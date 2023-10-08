import { Injectable, Inject } from '@nestjs/common'
import { Wallet } from './wallet.entity'
import { WALLET_REPOSITORY } from '../../core/constants'
import { CreateWallet } from './wallet.interfaces'
import { User } from '../users/user.entity'

@Injectable()
export class WalletsService {
    constructor(@Inject(WALLET_REPOSITORY) private readonly walletRepository: typeof Wallet) { }

    async create (data: CreateWallet): Promise<Wallet> {
        return await this.walletRepository.create<Wallet>(data)
    }
    async userWallet (userId: number): Promise<Wallet> {
        return await this.walletRepository.findOne<Wallet>({
            where: {
                userId
            },
            include: {
                model: User
            }
        })
    }
    async topupWallet (walletId: number, amount: number): Promise<Wallet> {
        let wallet = await this.walletRepository.findOne<Wallet>({ where: { id: walletId } })
        await this.walletRepository.update<Wallet>(
            {
                balance: amount + wallet.balance,
                previous_balance: wallet.balance,
            },
            {
                where: {
                    id: walletId
                }
            }
        )
        return await this.walletRepository.findOne<Wallet>({ where: { id: walletId } })
    }
}
