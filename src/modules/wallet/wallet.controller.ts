import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, UseGuards, Request } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { WalletsService } from './wallet.service'
import { Wallet as WalletEntity } from './wallet.entity'
import { WalletDto } from './dto/wallet.dto'

@Controller('wallet')
export class WalletController {
    constructor(private readonly walletService: WalletsService) { }
}
