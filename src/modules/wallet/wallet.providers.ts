import { Wallet } from './wallet.entity'
import { WALLET_REPOSITORY } from '../../core/constants'

export const walletsProviders = [
    {
        provide: WALLET_REPOSITORY,
        useValue: Wallet,
    },
]
