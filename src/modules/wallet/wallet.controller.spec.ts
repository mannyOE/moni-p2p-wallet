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
import { WalletController } from './wallet.controller'
import { AuthController } from '../auth/auth.controller'


testDatabaseConfig.authenticate().then(() => {

})

describe('Wallet Controller', () => {
  let controller: WalletController
  let authController: AuthController

  const userInput = {
    first_name: faker.person.firstName(),
    last_name: faker.person.lastName(),
    email: faker.internet.email(),
    dob: faker.date.past(),
    address: faker.location.streetAddress(),
    password: faker.internet.password(),
    phone_number: faker.phone.number()
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
      ],
      controllers: [WalletController, AuthController],
    }).compile()

    authController = module.get<AuthController>(AuthController)
    controller = module.get<WalletController>(WalletController)
    // create user
    await authController.signUp(userInput)
  })

  it('Fetch a users wallet', async () => {
    const { user } = await authController.login({ email: userInput.email, password: userInput.password })
    const result = await controller.fetchWallet({ user })
    expect(result).toBeDefined()
    expect(result.dataValues.balance).toEqual(0)
    expect(result.dataValues.userId).toEqual(user.id)
  })

  afterAll(async () => {
    await testDatabaseConfig.close()
  })
})
