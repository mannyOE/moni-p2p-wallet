import { Transaction } from './transaction.entity'
import { TRANSACTION_REPOSITORY } from '../../core/constants'

export const transactionProviders = [
  {
    provide: TRANSACTION_REPOSITORY,
    useValue: Transaction,
  },
]
