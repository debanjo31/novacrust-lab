import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './app/user/user.module';
import { WalletModule } from './app/wallet/wallet.module';
import { TransactionModule } from './app/transaction/transaction.module';
import { User } from './app/user/entities/user.entity';
import { Wallet } from './app/wallet/entities/wallet.entity';
import { Transaction } from './app/transaction/entities/transaction.entity';
import { DatabaseModule } from './database/database.module';

@Module({
  imports: [
    DatabaseModule,
    UserModule,
    WalletModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
