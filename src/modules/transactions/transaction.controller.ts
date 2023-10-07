import { Controller, Get, Post, Put, Delete, Param, Body, NotFoundException, UseGuards, Request } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { TransactionService } from './transaction.service'
import { Transaction as TransactionEntity } from './transaction.entity'

@Controller('transaction')
export class WalletController {
  constructor(private readonly transactionService: TransactionService) { }

}
