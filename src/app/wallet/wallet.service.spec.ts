import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Wallet } from './entities/wallet.entity';
import { Transaction } from '../transaction/entities/transaction.entity';
import { DataSource } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { TransferStatus } from '../../shared/constants';

describe('WalletService', () => {
  let service: WalletService;
  let mockDataSource: any;
  let mockManager: any;

  const mockWalletRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
  };

  const mockTransactionRepository = {
    find: jest.fn(),
  };

  beforeEach(async () => {
    mockManager = {
      findOne: jest.fn(),
      save: jest.fn(),
      create: jest.fn(),
    };

    mockDataSource = {
      transaction: jest.fn().mockImplementation((cb) => cb(mockManager)),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: getRepositoryToken(Wallet),
          useValue: mockWalletRepository,
        },
        {
          provide: getRepositoryToken(Transaction),
          useValue: mockTransactionRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('fundWallet', () => {
    it('should successfully fund a wallet', async () => {
      const walletId = 1;
      const amount = 100;
      const initialWallet = { id: walletId, balance: 50 };

      mockManager.findOne.mockResolvedValue({ ...initialWallet });
      mockManager.create.mockReturnValue({ id: 1, type: 'FUND', amount });

      const result = await service.fundWallet(walletId, { amount });

      // Check balance update
      expect(mockManager.findOne).toHaveBeenCalledWith(Wallet, { where: { id: walletId } });
      expect(mockManager.save).toHaveBeenCalledWith(expect.objectContaining({
        id: walletId,
        balance: 150
      }));
      // Check transaction creation
      expect(mockManager.create).toHaveBeenCalledWith(Transaction, expect.objectContaining({
        type: 'FUND',
        amount: 100
      }));
    });

    it('should throw NotFoundException if wallet does not exist', async () => {
      mockManager.findOne.mockResolvedValue(null);
      await expect(service.fundWallet(999, { amount: 100 }))
        .rejects.toThrow(NotFoundException);
    });
  });

  describe('transferFunds', () => {
    it('should successfully transfer funds', async () => {
      const sender = { id: 1, balance: 200 };
      const receiver = { id: 2, balance: 50 };
      const transferDto = { receiverWalletId: '2', amount: 100, description: 'Test' };

      mockManager.findOne
        .mockResolvedValueOnce({ ...sender }) // Sender
        .mockResolvedValueOnce({ ...receiver }); // Receiver

      mockManager.create.mockReturnValue({ id: 1, type: 'TRANSFER' });

      await service.transferFunds(1, transferDto);

      // Verify balances updated
      expect(mockManager.save).toHaveBeenCalledWith(expect.objectContaining({ id: 1, balance: 100 }));
      expect(mockManager.save).toHaveBeenCalledWith(expect.objectContaining({ id: 2, balance: 150 }));
    });

    it('should throw BadRequestException if insufficient funds', async () => {
      const sender = { id: 1, balance: 50 };
      const receiver = { id: 2, balance: 50 };
      const transferDto = { receiverWalletId: '2', amount: 100, description: 'Test' };

      mockManager.findOne
        .mockResolvedValueOnce({ ...sender })
        .mockResolvedValueOnce({ ...receiver });

      await expect(service.transferFunds(1, transferDto))
        .rejects.toThrow(BadRequestException);
    });
  });
});
