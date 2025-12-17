import { Injectable, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { Wallet } from '../wallet/entities/wallet.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Wallet)
    private walletRepository: Repository<Wallet>,
  ) { }

  async create(createUserDto: CreateUserDto) {
    // 1. Check if user exists
    const existingUser = await this.userRepository.findOne({ where: { email: createUserDto.email } });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // 2. Create Wallet
    const wallet = this.walletRepository.create({
      balance: 0,
      currency: 'USD',
    });
    const savedWallet = await this.walletRepository.save(wallet);

    // 3. Create User linked to Wallet
    const user = this.userRepository.create({
      ...createUserDto,
      wallet: savedWallet,
    });

    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find({ relations: ['wallet'] });
  }

  findOne(id: number) {
    return this.userRepository.findOne({ where: { id }, relations: ['wallet'] });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
