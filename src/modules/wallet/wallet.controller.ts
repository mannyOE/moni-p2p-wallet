import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, UseGuards, Request } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { WalletsService } from './wallet.service'
import { Wallet } from './wallet.entity'

@UseGuards(AuthGuard('jwt'))
@Controller('wallet')
export class WalletController {
    constructor(private readonly walletService: WalletsService) { }

    @Get()
    async fetchWallet (@Request() req): Promise<Wallet> {
        return await this.walletService.userWallet(req.user.id)
    }
}
