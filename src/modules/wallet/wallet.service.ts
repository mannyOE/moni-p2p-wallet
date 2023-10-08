import { Injectable, Inject } from '@nestjs/common'

import { Wallet } from './wallet.entity'
import { WALLET_REPOSITORY } from '../../core/constants'
import { CreateWallet } from './wallet.interfaces'

@Injectable()
export class WalletsService {
    constructor(@Inject(WALLET_REPOSITORY) private readonly walletRepository: typeof Wallet) { }

    async create (data: CreateWallet): Promise<Wallet> {
        return await this.walletRepository.create<Wallet>(data)
    }
}
