import { Transaction } from './transaction.entity'
import { Source } from './source.entity'
import { SOURCE_REPOSITORY, TRANSACTION_REPOSITORY } from '../../core/constants'

export const transactionProviders = [
  {
    provide: TRANSACTION_REPOSITORY,
    useValue: Transaction,
  },
  {
    provide: SOURCE_REPOSITORY,
    useValue: Source,
  },
]
