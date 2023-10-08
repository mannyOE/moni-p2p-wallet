import { Module } from '@nestjs/common'

import { TransactionService } from './transaction.service'
import { transactionProviders } from './transaction.providers'
import { TransactionController } from './transaction.controller'
import { WalletsModule } from '../wallet/wallet.module'
import { UsersModule } from '../users/users.module'

@Module({
  imports: [WalletsModule, UsersModule],
  providers: [TransactionService, ...transactionProviders],
  controllers: [TransactionController],
  exports: [TransactionService],
})
export class TransactionsModule { }
