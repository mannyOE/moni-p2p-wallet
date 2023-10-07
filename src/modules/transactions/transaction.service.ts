import { Injectable, Inject } from '@nestjs/common'

import { Transaction } from './transaction.entity'
import { TRANSACTION_REPOSITORY } from '../../core/constants'

@Injectable()
export class TransactionService {
  constructor(@Inject(TRANSACTION_REPOSITORY) private readonly transactionRepository: typeof Transaction) { }

  async create (trxn: any, walletId): Promise<Transaction> {
    return await this.transactionRepository.create<Transaction>({ ...trxn, walletId })
  }
}
