import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { TransferWalletDto } from './dto/transfer-wallet.dto';
import { ResponseDto } from '../../dto/response.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) { }

  @Post()
  async create(@Body() createWalletDto: CreateWalletDto) {
    const data = await this.walletService.create(createWalletDto);
    return ResponseDto.success('Wallet created successfully', data);
  }

  @Post(':id/fund')
  async fund(@Param('id', ParseIntPipe) id: number, @Body() fundWalletDto: FundWalletDto) {
    const data = await this.walletService.fundWallet(id, fundWalletDto);
    return ResponseDto.success('Wallet funded successfully', data);
  }

  @Post(':id/transfer')
  async transfer(@Param('id', ParseIntPipe) id: number, @Body() transferWalletDto: TransferWalletDto) {
    const data = await this.walletService.transferFunds(id, transferWalletDto);
    return ResponseDto.success('Funds transferred successfully', data);
  }

  @Get()
  async findAll() {
    const data = await this.walletService.findAll();
    return ResponseDto.success('Wallets retrieved successfully', data);
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const data = await this.walletService.findOne(id);
    return ResponseDto.success('Wallet retrieved successfully', data);
  }
}
