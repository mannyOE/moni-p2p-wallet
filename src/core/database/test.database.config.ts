// sequelize.config.test.ts
import { Sequelize } from 'sequelize-typescript'
import { Source } from '../../modules/transactions/source.entity'
import { Transaction } from '../../modules/transactions/transaction.entity'
import { User } from '../../modules/users/user.entity'
import { Wallet } from '../../modules/wallet/wallet.entity'

export const testDatabaseConfig = new Sequelize({
  dialect: 'sqlite',
  storage: ':memory:', // Use an in-memory database for testing
  logging: false, // Disable logging during tests
})
testDatabaseConfig.addModels([User, Wallet, Transaction, Source])
