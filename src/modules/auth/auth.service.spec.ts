import { config } from "dotenv"
import { Test, TestingModule } from '@nestjs/testing'
import { faker } from '@faker-js/faker'
import { AuthService } from './auth.service'
import { LocalStrategy } from './local.strategy'
import { JwtStrategy } from './jwt.strategy'
import { PassportModule } from '@nestjs/passport'
import { UsersModule } from '../users/users.module'
import { WalletsModule } from '../wallet/wallet.module'
import { JwtModule } from '@nestjs/jwt'
import { WalletsService } from '../wallet/wallet.service'
import { testDatabaseConfig } from '../../core/database/test.database.config'
const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]+$/

testDatabaseConfig.authenticate().then(() => {

})

describe('AuthService', () => {
  let service: AuthService
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
    }).compile()

    service = module.get<AuthService>(AuthService)
    walletService = module.get<WalletsService>(WalletsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
  it('validate user with unknown creds should return null', async () => {
    const user = await service.validateUser(faker.internet.email(), faker.internet.password())
    expect(user).toBe(null)
  })

  it('Create a user', async () => {
    const { user, token } = await service.create(userInput)
    expect(user).toBeDefined()
    const wallet = await walletService.userWallet(user.id)
    expect(wallet).toBeDefined()
    expect(user.email).toBe(userInput.email)
    expect(token).toBeDefined()
    expect(jwtRegex.test(token)).toBe(true)
    expect(wallet.balance).toEqual(0)
  })

  it('Login a user', async () => {
    const user = await service.validateUser(userInput.email, userInput.password)
    expect(user).toBeDefined()
    expect(user.email).toBe(userInput.email)
    const { token } = await service.login(user)
    expect(token).toBeDefined()
    expect(jwtRegex.test(token)).toBe(true)
  })

  afterAll(async () => {
    await testDatabaseConfig.close()
  })
})
