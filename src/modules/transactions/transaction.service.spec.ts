import { config } from "dotenv"
import { Test, TestingModule } from '@nestjs/testing'

import { UsersModule } from '../users/users.module'
import { WalletsModule } from '../wallet/wallet.module'
import { TransactionService } from './transaction.service'
import { transactionProviders } from './transaction.providers'

describe('TransactionService', () => {
  let service: TransactionService

  beforeEach(async () => {
    config()
    const module: TestingModule = await Test.createTestingModule({
      imports: [WalletsModule, UsersModule],
      providers: [TransactionService, ...transactionProviders],
      exports: [TransactionService],
    }).compile()

    service = module.get<TransactionService>(TransactionService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
