import { Sequelize } from 'sequelize-typescript'
import { Client } from 'pg'
import { Queries } from './queries'
import createSubscriber from "pg-listen"

import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants'
import { databaseConfig } from './database.config'
import { User } from '../../modules/users/user.entity'
import { Wallet } from '../../modules/wallet/wallet.entity'
import { Transaction } from '../../modules/transactions/transaction.entity'
import { Source } from '../../modules/transactions/source.entity'

export const databaseProviders = [
    {
        provide: SEQUELIZE,
        useFactory: async () => {
            let config
            switch (process.env.NODE_ENV) {
                case DEVELOPMENT:
                    config = databaseConfig.development
                    break
                case TEST:
                    config = databaseConfig.test
                    break
                case PRODUCTION:
                    config = databaseConfig.production
                    break
                default:
                    config = databaseConfig.development
            }
            const sequelize = new Sequelize(config)
            sequelize.addModels([User, Wallet, Transaction, Source])
            await sequelize.sync()
            const pgClient = new Client({
                connectionString: process.env.DATABASE_URL,
            })
            const subscriber = createSubscriber({
                connectionString: process.env.DATABASE_URL,
            })
            await Queries(pgClient)
            await subscriber.connect()
            await subscriber.listenTo("wallet_changed")
            subscriber.notifications.on("wallet_changed", async (payload: any) => {
                //TODO check and confirm all transactions sum up to the current wallet balance
                console.log(payload)
            })
            return sequelize
        },
    },
]
