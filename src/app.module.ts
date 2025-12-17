import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './app/user/user.module';
import { WalletModule } from './app/wallet/wallet.module';
import { TransactionModule } from './app/transaction/transaction.module';

@Module({
  imports: [UserModule, WalletModule, TransactionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
