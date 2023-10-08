import { Test, TestingModule } from '@nestjs/testing'
import { config } from "dotenv"

import { WalletsModule } from '../wallet/wallet.module'
import { UsersModule } from '../users/users.module'
import { TransactionService } from './transaction.service'
import { transactionProviders } from './transaction.providers'
import { TransactionController } from './transaction.controller'

describe('Transactions Controller', () => {
  let controller: TransactionController

  beforeEach(async () => {
    config()
    const module: TestingModule = await Test.createTestingModule({
      imports: [WalletsModule, UsersModule],
      providers: [TransactionService, ...transactionProviders],
      controllers: [TransactionController],
      exports: [TransactionService],
    }).compile()

    controller = module.get<TransactionController>(TransactionController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
