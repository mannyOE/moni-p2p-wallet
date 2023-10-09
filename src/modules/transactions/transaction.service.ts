import { Injectable, Inject } from '@nestjs/common'
import * as Paystack from "paystack-node"
import { v4 as uuidv4 } from 'uuid'
import { Transaction } from './transaction.entity'
import { SOURCE_REPOSITORY, TRANSACTION_REPOSITORY } from '../../core/constants'
import { WalletsService } from '../wallet/wallet.service'
import { User } from '../users/user.entity'
import { Source } from './source.entity'
import { UsersService } from '../users/users.service'

@Injectable()
export class TransactionService {
  private readonly paystackService
  constructor(
    @Inject(TRANSACTION_REPOSITORY) private readonly transactionRepository: typeof Transaction,
    @Inject(SOURCE_REPOSITORY) private readonly sourceRepository: typeof Source,
    private readonly walletService: WalletsService,
    private readonly userService: UsersService,
  ) {
    this.paystackService = new Paystack(`${process.env.PAYSTACK_SECRET}`)
  }

  async create (amount: number, user: User): Promise<{
    authorization_url: string
    access_code: string
    reference: string
  }> {
    const wallet = await this.walletService.userWallet(user.id)
    // generate trxn reference
    const ref = uuidv4()
    // generate payment link
    const { body: { data: transaction } } = await this.paystackService.initializeTransaction({
      email: user.email,
      amount: amount * 100, // Amount in kobo (100000 kobo = ₦1000)
      reference: ref, // Replace with a unique reference
      metadata: JSON.stringify({
        userId: user.id,
        walletId: wallet.id,
        // Add more custom fields as needed
      }),
    })
    return {
      ...transaction
    }
  }

  async savePaystackTransaction (charge: ChargeEvent) {
    if (charge.event === "charge.success") {
      let existingSource = await this.sourceRepository.findOne<Source>({
        where: {
          signature: charge.data.authorization.signature
        }
      })
      if (!existingSource) {
        existingSource = await this.sourceRepository.create<Source>({
          card_pan: charge.data.authorization.last4,
          userId: charge.data.metadata.userId,
          type: "deposit",
          signature: charge.data.authorization.signature
        })
        existingSource = existingSource['dataValues']
      }
      // save the charge source
      let existingTrxn = await this.transactionRepository.findOne<Transaction>({
        where: {
          reference: charge.data.reference
        }
      })
      if (!existingTrxn) {
        // create the transaction
        await this.transactionRepository.create<Transaction>({
          reference: charge.data.reference,
          amount: charge.data.amount / 100,
          walletId: charge.data.metadata.walletId,
          status: "confirmed",
          type: "credit",
          sourceId: existingSource.id
        })
        await this.walletService.topupWallet(charge.data.metadata.walletId, charge.data.amount / 100)
      }
    }
    return {}
  }

  async makeTransferTransaction (amount, email, userId) {
    // get the user with email
    const destinationAccount = await this.userService.findOneByEmail(email)
    // get the source wallet
    const sourceWallet = await this.walletService.userWallet(userId)
    // get the destination wallet
    const destinationWallet = await this.walletService.userWallet(destinationAccount.id)
    // update the destination wallet
    await this.walletService.topupWallet(destinationWallet.id, amount)
    // update the source wallet
    await this.walletService.topupWallet(sourceWallet.id, amount * -1)
    // create transaction source
    let existingSource = await this.sourceRepository.findOne<Source>({
      where: {
        signature: sourceWallet.id + "",
        userId: destinationAccount.id
      }
    })
    if (!existingSource) {
      existingSource = await this.sourceRepository.create<Source>({
        userId: destinationAccount.id,
        type: "share",
        signature: sourceWallet.id + ""
      })
      existingSource = existingSource['dataValues']
    }
    const ref = uuidv4()
    // create transaction destination 
    await this.transactionRepository.create<Transaction>({
      reference: ref,
      amount: amount,
      walletId: destinationWallet.id,
      status: "confirmed",
      type: "credit",
      sourceId: existingSource.id
    })

    const trxn = await this.transactionRepository.create<Transaction>({
      reference: ref,
      amount: amount,
      walletId: sourceWallet.id,
      status: "confirmed",
      type: "debit",
      sourceId: existingSource.id
    })
    return trxn['dataValues']
  }
}
