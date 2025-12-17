import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { FundWalletDto } from './dto/fund-wallet.dto';
import { TransferWalletDto } from './dto/transfer-wallet.dto';

@Controller('wallet')
export class WalletController {
  constructor(private readonly walletService: WalletService) { }

  @Post()
  create(@Body() createWalletDto: CreateWalletDto) {
    return this.walletService.create(createWalletDto);
  }

  @Post(':id/fund')
  fund(@Param('id') id: string, @Body() fundWalletDto: FundWalletDto) {
    return this.walletService.fundWallet(+id, fundWalletDto);
  }

  @Post(':id/transfer')
  transfer(@Param('id') id: string, @Body() transferWalletDto: TransferWalletDto) {
    return this.walletService.transferFunds(+id, transferWalletDto);
  }

  @Get()
  findAll() {
    return this.walletService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.walletService.findOne(+id);
  }
}
