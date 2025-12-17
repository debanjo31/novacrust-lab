import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './app/user/user.module';
import { WalletModule } from './app/wallet/wallet.module';
import { TransactionModule } from './app/transaction/transaction.module';
import { User } from './app/user/entities/user.entity';
import { Wallet } from './app/wallet/entities/wallet.entity';
import { Transaction } from './app/transaction/entities/transaction.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [User, Wallet, Transaction],
      synchronize: true, // Auto-create tables (dev only)
    }),
    UserModule,
    WalletModule,
    TransactionModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
