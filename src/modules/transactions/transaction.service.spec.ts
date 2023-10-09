import { config } from "dotenv"
import { Test, TestingModule } from '@nestjs/testing'
import { faker } from '@faker-js/faker'
import { v4 as uuidv4 } from 'uuid'
import { testDatabaseConfig } from '../../core/database/test.database.config'
import { TransactionService } from './transaction.service'
import { AuthModule } from '../auth/auth.module'
import { WalletsModule } from '../wallet/wallet.module'
import { UsersModule } from '../users/users.module'
import { transactionProviders } from './transaction.providers'
import { WalletsService } from '../wallet/wallet.service'
import { UsersService } from '../users/users.service'

testDatabaseConfig.authenticate().then(() => {

})

describe('TransactionService', () => {
  let user, wallet, user2, wallet2
  let service: TransactionService
  let userService: UsersService
  let walletService: WalletsService
  const userInput = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    dob: faker.date.past(),
    address: faker.location.streetAddress(),
    password: faker.internet.password(),
    phone_number: faker.phone.number()
  }
  const userTwoInput = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    dob: faker.date.past(),
    address: faker.location.streetAddress(),
    password: faker.internet.password(),
    phone_number: faker.phone.number()
  }

  const chargeEvent: ChargeEvent = {
    event: 'charge.success',
    data: {
      id: 123,
      domain: 'example.com',
      status: 'success',
      reference: 'ref123456',
      amount: 1000,
      message: null,
      gateway_response: 'Payment successful',
      paid_at: '2023-10-15T14:30:00Z',
      created_at: '2023-10-15T14:00:00Z',
      channel: 'web',
      currency: 'USD',
      ip_address: '192.168.0.1',
      metadata: {
        userId: 456,
        walletId: 789,
      },
      log: {
        time_spent: 300,
        attempts: 1,
        authentication: 'token',
        errors: 0,
        success: true,
        mobile: false,
        input: [],
        channel: null,
        history: [
          {
            type: 'info',
            message: 'Payment initiated',
            time: 1634298000,
          },
          {
            type: 'info',
            message: 'Payment successful',
            time: 1634298600,
          },
        ],
      },
      fees: null,
      customer: {
        id: 456,
        first_name: 'John',
        last_name: 'Doe',
        email: 'johndoe@example.com',
        customer_code: 'CUST123',
        phone: null,
        metadata: {},
        risk_action: 'none',
      },
      authorization: {
        authorization_code: 'AUTHCODE123',
        bin: '123456',
        last4: '7890',
        exp_month: '12',
        exp_year: '25',
        card_type: 'Visa',
        bank: 'Example Bank',
        country_code: 'US',
        brand: 'Visa',
        account_name: 'John Doe',
        signature: 'Signature123',
      },
      plan: null,
    },
  }

  beforeAll(async () => {
    await testDatabaseConfig.sync({ force: true })
    config()
    const module: TestingModule = await Test.createTestingModule({
      imports: [WalletsModule, UsersModule, AuthModule],
      providers: [TransactionService, ...transactionProviders],
      exports: [TransactionService],
    }).compile()

    service = module.get<TransactionService>(TransactionService)
    userService = module.get<UsersService>(UsersService)
    walletService = module.get<WalletsService>(WalletsService)
    // create the user
    const { dataValues: dtUser } = await userService.create(userInput)
    user = dtUser
    const { dataValues: dtUser2 } = await userService.create(userTwoInput)
    user2 = dtUser2
    // create user1 wallet
    const { dataValues } = await walletService.create({
      userId: user.id,
      balance: 0,
      previous_balance: 0,
      reference: uuidv4()
    })
    // get the user's wallet
    wallet = dataValues
    const { dataValues: dtValues } = await walletService.create({
      userId: user2.id,
      balance: 0,
      previous_balance: 0,
      reference: uuidv4()
    })
    wallet2 = dtValues
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })


  it('should deposit cash into wallet', async () => {
    const amount = 100000
    // initiate transaction
    const result = await service.create(amount, user)
    expect(result).toBeDefined()
    const { reference } = result
    const event = { ...chargeEvent }
    event.data.amount = amount
    event.data.reference = reference
    event.data.metadata = {
      userId: user.id,
      walletId: wallet.id
    }
    await service.savePaystackTransaction(event)
    // get the user wallet
    let updatedWallet = await walletService.userWallet(user.id)
    expect(updatedWallet).toBeDefined()
    expect(updatedWallet.balance).toEqual((amount / 100) + wallet.balance)
    wallet = updatedWallet
  })

  it('Transfer cash to another user wallet', async () => {
    const amount = 500
    const trxn = await service.makeTransferTransaction(amount, user2.email, user.id)
    expect(trxn).toBeDefined()
    let updatedWallet = await walletService.userWallet(user.id)
    let updatedWallet2 = await walletService.userWallet(user2.id)

    expect(updatedWallet.balance).toEqual(wallet.balance - amount)
    expect(updatedWallet2.balance).toEqual(wallet2.balance + amount)
  })

  afterAll(async () => {
    await testDatabaseConfig.close()
  })
})
