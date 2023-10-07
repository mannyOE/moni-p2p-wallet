import { Injectable, Inject } from '@nestjs/common'

import { Wallet } from './wallet.entity'
import { WalletDto } from './dto/wallet.dto'
import { User } from '../users/user.entity'
import { WALLET_REPOSITORY } from '../../core/constants'

@Injectable()
export class WalletsService {
    constructor(@Inject(WALLET_REPOSITORY) private readonly walletRepository: typeof Wallet) { }

    async create (post: WalletDto, userId): Promise<Wallet> {
        return await this.walletRepository.create<Wallet>({ ...post, userId })
    }

    async findAll (): Promise<Wallet[]> {
        return await this.walletRepository.findAll<Wallet>({
            include: [{ model: User, attributes: { exclude: ['password'] } }],
        })
    }

    async findOne (id): Promise<Wallet> {
        return await this.walletRepository.findOne({
            where: { id },
            include: [{ model: User, attributes: { exclude: ['password'] } }],
        })
    }

    async delete (id, userId) {
        return await this.walletRepository.destroy({ where: { id, userId } })
    }

    async update (id, data, userId) {
        const [numberOfAffectedRows, [updatedPost]] = await this.walletRepository.update({ ...data }, { where: { id, userId }, returning: true })
        return { numberOfAffectedRows, updatedPost }
    }
}
