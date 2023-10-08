import { Controller, Post, Body, UseGuards, Request } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { TransactionService } from './transaction.service'
import { PaystackValidator, TransferValidator } from '../../core/guards/doesUserExist.guard'

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) { }

  @UseGuards(AuthGuard('jwt'))
  @Post("initiate")
  async initiate (@Body() body, @Request() req): Promise<any> {
    return await this.transactionService.create(body.amount, req.user)
  }

  @UseGuards(AuthGuard('jwt'), TransferValidator)
  @Post("transfer")
  async transfer (@Body() body, @Request() req): Promise<any> {
    return await this.transactionService.makeTransferTransaction(body.amount, body.email, req.user.id)
  }

  @UseGuards(PaystackValidator)
  @Post("paystack-webhook")
  async paystackWebhook (@Body() body): Promise<any> {
    return await this.transactionService.savePaystackTransaction(body)
  }

}
