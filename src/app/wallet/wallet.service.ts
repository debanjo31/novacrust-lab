import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { TransferWalletDto } from './dto/transfer-wallet.dto';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from '../transaction/entities/transaction.entity';
import { TransferStatus } from '../../shared/constants';

@Injectable()
export class WalletService {
  constructor(
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private dataSource: DataSource,
  ) { }

  create(createWalletDto: CreateWalletDto) {
    const wallet = this.walletRepository.create(createWalletDto);
    return this.walletRepository.save(wallet);
  }

  async fundWallet(walletId: number, fundWalletDto: FundWalletDto) {
    const { amount, idempotencyKey } = fundWalletDto;

    if (idempotencyKey) {
      const existingTransaction = await this.transactionRepository.findOne({ where: { idempotencyKey } });
      if (existingTransaction) {
        return existingTransaction; // Idempotent response
      }
    }

    return this.dataSource.transaction(async (manager) => {
      const wallet = await manager.findOne(Wallet, { where: { id: walletId } });
      if (!wallet) throw new NotFoundException('Wallet not found');

      wallet.balance = Number(wallet.balance) + Number(amount); // Ensure number addition
      await manager.save(wallet);

      const transaction = manager.create(Transaction, {
        type: 'FUND',
        amount: amount,
        receiver: wallet,
        status: TransferStatus.COMPLETED,
        reference: `FUND-${Date.now()}`,
        description: 'Fund Wallet',
        idempotencyKey,
      });
      await manager.save(transaction);

      return { wallet, transaction };
    });
  }

  async transferFunds(senderId: number, transferDto: TransferWalletDto) {
    const { receiverWalletId, amount, description, idempotencyKey } = transferDto;
    const receiverId = Number(receiverWalletId);

    if (senderId === receiverId) {
      throw new BadRequestException('Cannot transfer to self');
    }

    if (idempotencyKey) {
      const existingTransaction = await this.transactionRepository.findOne({ where: { idempotencyKey } });
      if (existingTransaction) {
        return existingTransaction; // Idempotent response
      }
    }

    return this.dataSource.transaction(async (manager) => {
      // 1. Locking sender for update to prevent race conditions
       const sender = await manager.findOne(Wallet, {
        where: { id: senderId },
        lock: { mode: 'pessimistic_write' }
      });

      const receiver = await manager.findOne(Wallet, { where: { id: receiverId }, relations: ['user'] });

      if (!sender) throw new NotFoundException('Sender wallet not found');
      if (!receiver) throw new NotFoundException('Receiver wallet not found');

      // 2. Re-fetch sender with user relations for the response (safe explicitly after lock)
      const senderWithUser = await manager.findOne(Wallet, { where: { id: senderId }, relations: ['user'] });
      if (senderWithUser) {
        sender.user = senderWithUser.user;
      }

      if (Number(sender.balance) < amount) {
        throw new BadRequestException('Insufficient funds');
      }

      sender.balance = Number(sender.balance) - amount;
      receiver.balance = Number(receiver.balance) + Number(amount);

      await manager.save(sender);
      await manager.save(receiver);

      const transaction = manager.create(Transaction, {
        type: 'TRANSFER',
        amount: amount,
        sender: sender,
        receiver: receiver,
        status: TransferStatus.COMPLETED,
        reference: `TRF-${Date.now()}`, // Simple Reference
        // description: description, // If Transaction entity has description
        idempotencyKey,
      });

      await manager.save(transaction);

      return transaction;
    });
  }

  findAll() {
    return this.walletRepository.find();
  }

  async findOne(id: number) {

    if (!id || isNaN(id)) {
      throw new BadRequestException('Invalid wallet ID');
    }
    const wallet = await this.walletRepository.findOne({
      where: { id },
      relations: ['user']
    });
    if (!wallet) throw new NotFoundException('Wallet not found');

    // Fetch transactions separately or via relation if defined
    // Assuming we want a flat list of related transactions
    const transactions = await this.transactionRepository.find({
      where: [
        { sender: { id: id } },
        { receiver: { id: id } }
      ],
      order: { transferDate: 'DESC' }
    });

    return { ...wallet, transactions };
  }

  // Method scaffolding
  update(id: number, dto: UpdateWalletDto) { return 'Not implemented'; }
  remove(id: number) { return 'Not implemented'; }
}
