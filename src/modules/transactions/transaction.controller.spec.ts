import { Test, TestingModule } from '@nestjs/testing'
import { config } from "dotenv"
import { faker } from '@faker-js/faker'
import { WalletsModule } from '../wallet/wallet.module'
import { UsersModule } from '../users/users.module'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { testDatabaseConfig } from '../../core/database/test.database.config'
import { AuthService } from '../auth/auth.service'
import { LocalStrategy } from '../auth/local.strategy'
import { JwtStrategy } from '../auth/jwt.strategy'
import { TransactionController } from './transaction.controller'
import { AuthController } from '../auth/auth.controller'
import { TransactionService } from './transaction.service'
import { transactionProviders } from './transaction.providers'
import { WalletsService } from '../wallet/wallet.service'


testDatabaseConfig.authenticate().then(() => {

})

describe('Wallet Controller', () => {
  let controller: TransactionController
  let authController: AuthController
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

  const user2Input = {
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
      imports: [
        PassportModule,
        UsersModule,
        WalletsModule,
        JwtModule.register({
          secret: process.env.JWTKEY,
          signOptions: { expiresIn: process.env.TOKEN_EXPIRATION },
        }),
      ],
      providers: [
        AuthService,
        LocalStrategy,
        JwtStrategy,
        TransactionService, ...transactionProviders
      ],
      controllers: [TransactionController, AuthController],
    }).compile()

    authController = module.get<AuthController>(AuthController)
    controller = module.get<TransactionController>(TransactionController)
    walletService = module.get<WalletsService>(WalletsService)

    // create user
    await authController.signUp(userInput)
    await authController.signUp(user2Input)
  })

  it('should fund a users wallet', async () => {
    const amount = 200000
    const { user } = await authController.login({ email: userInput.email, password: userInput.password })
    const wallet = await walletService.userWallet(user.id)
    const result = await controller.initiate({ amount }, { user })
    expect(result).toBeDefined()
    const { reference } = result
    const event = { ...chargeEvent }
    event.data.amount = amount
    event.data.reference = reference
    event.data.metadata = {
      userId: user.id,
      walletId: wallet.id
    }
    await controller.paystackWebhook(event)
    const updatedWallet = await walletService.userWallet(user.id)
    expect(updatedWallet).toBeDefined()
    expect(updatedWallet.balance).toEqual(wallet.balance + (amount / 100))
  })

  it('should transfer from a users wallet to another user', async () => {
    // login 2nd user
    const { user: secondUser } = await authController.login({ email: user2Input.email, password: user2Input.password })
    // get the new user's wallet
    const user2Wallet = await walletService.userWallet(secondUser.id)
    const amount = 1000
    const { user } = await authController.login({ email: userInput.email, password: userInput.password })
    const wallet = await walletService.userWallet(user.id)

    await controller.transfer({ amount, email: user2Input.email }, { user })

    const updatedWallet = await walletService.userWallet(user.id)
    expect(updatedWallet.balance).toEqual(wallet.balance - amount)
    const updatedUser2Wallet = await walletService.userWallet(secondUser.id)
    expect(updatedUser2Wallet.balance).toEqual(user2Wallet.balance + amount)
  })

  afterAll(async () => {
    await testDatabaseConfig.close()
  })
})
