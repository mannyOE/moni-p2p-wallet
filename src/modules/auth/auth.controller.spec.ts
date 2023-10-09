import { Test, TestingModule } from '@nestjs/testing'
import { config } from "dotenv"
import { faker } from '@faker-js/faker'
import { WalletsModule } from '../wallet/wallet.module'
import { UsersModule } from '../users/users.module'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { LocalStrategy } from './local.strategy'
import { JwtStrategy } from './jwt.strategy'
import { AuthController } from './auth.controller'
import { testDatabaseConfig } from '../../core/database/test.database.config'
import { ExecutionContext, HttpException, HttpStatus } from '@nestjs/common'
import { DoesUserExist, LoginValidator, RegistrationValidator } from '../../core/guards/doesUserExist.guard'
import { isGuarded } from '../../core/utils/isGuarded.utils'
import { UsersService } from '../users/users.service'
import { HttpArgumentsHost } from '@nestjs/common/interfaces'
import { WalletsService } from '../wallet/wallet.service'
const jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_.+/=]+$/


testDatabaseConfig.authenticate().then(() => {

})

describe('Authentication Controller', () => {
  let controller: AuthController
  let userService: UsersService
  let authService: AuthService
  let walletService: WalletsService

  const loginInput = {
    email: faker.internet.email(),
    password: faker.internet.password(),
  }

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
      controllers: [AuthController],
    }).compile()

    controller = module.get<AuthController>(AuthController)
    userService = module.get<UsersService>(UsersService)
    authService = module.get<AuthService>(AuthService)
    walletService = module.get<WalletsService>(WalletsService)
  })

  it(`should be protected with LoginValidator.`, async () => {
    expect(isGuarded(controller.login, LoginValidator)).toBe(true)
  })

  it('should validate login paramters', async () => {
    const loginGuard = new LoginValidator()
    let req = jest.fn().mockReturnValue({ body: loginInput })
    const mockExecutionContext: ExecutionContext = {
      getArgByIndex: jest.fn().mockReturnThis(),
      getArgs: jest.fn().mockReturnThis(),
      getClass: jest.fn().mockReturnThis(),
      getHandler: jest.fn().mockReturnThis(),
      switchToRpc: jest.fn().mockReturnThis(),
      getType: jest.fn().mockReturnThis(),
      switchToWs: jest.fn().mockReturnThis(),
      switchToHttp: (): HttpArgumentsHost => ({
        getResponse: jest.fn().mockReturnThis(),
        getNext: jest.fn().mockReturnThis(),
        getRequest: req, // Mock the request object as needed
      })
    }
    try {
      let result = await loginGuard.canActivate(mockExecutionContext)
      expect(result).toBe(true)
      req = jest.fn().mockReturnValue({ body: {} })
      mockExecutionContext.switchToHttp().getRequest = req
      result = await loginGuard.canActivate(mockExecutionContext)
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException)
      expect(error.response.message).toEqual('Incomplete data provided')
      expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST)
    }
  })

  it('Fail to login user with incorrect details', async () => {
    try {
      await controller.login({ email: loginInput.email, password: loginInput.password })
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException)
      expect(error.response).toEqual({
        message: 'Account not found',
        details: 'No user found with these credentials',
      })
      expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST)
    }
  })

  it(`should be protected with RegistrationValidator.`, async () => {
    expect(isGuarded(controller.signUp, RegistrationValidator)).toBe(true)
  })
  it('should validate login paramters', async () => {
    const registerGuard = new RegistrationValidator()
    let req = jest.fn().mockReturnValue({ body: userInput })
    const mockExecutionContext: ExecutionContext = {
      getArgByIndex: jest.fn().mockReturnThis(),
      getArgs: jest.fn().mockReturnThis(),
      getClass: jest.fn().mockReturnThis(),
      getHandler: jest.fn().mockReturnThis(),
      switchToRpc: jest.fn().mockReturnThis(),
      getType: jest.fn().mockReturnThis(),
      switchToWs: jest.fn().mockReturnThis(),
      switchToHttp: (): HttpArgumentsHost => ({
        getResponse: jest.fn().mockReturnThis(),
        getNext: jest.fn().mockReturnThis(),
        getRequest: req, // Mock the request object as needed
      })
    }
    try {
      let result = await registerGuard.canActivate(mockExecutionContext)
      expect(result).toBe(true)
      req = jest.fn().mockReturnValue({ body: {} })
      mockExecutionContext.switchToHttp().getRequest = req
      result = await registerGuard.canActivate(mockExecutionContext)
    } catch (error) {
      expect(error).toBeInstanceOf(HttpException)
      expect(error.response.message).toEqual('Incomplete data provided')
      expect(error.getStatus()).toBe(HttpStatus.BAD_REQUEST)
    }
  })

  it(`should be protected with DoesUserExist.`, async () => {
    expect(isGuarded(controller.signUp, DoesUserExist)).toBe(true)
  })

  it('should validate login paramters', async () => {
    const registerGuard = new DoesUserExist(userService)
    let req = jest.fn().mockReturnValue({ body: userInput })
    const mockExecutionContext: ExecutionContext = {
      getArgByIndex: jest.fn().mockReturnThis(),
      getArgs: jest.fn().mockReturnThis(),
      getClass: jest.fn().mockReturnThis(),
      getHandler: jest.fn().mockReturnThis(),
      switchToRpc: jest.fn().mockReturnThis(),
      getType: jest.fn().mockReturnThis(),
      switchToWs: jest.fn().mockReturnThis(),
      switchToHttp: (): HttpArgumentsHost => ({
        getResponse: jest.fn().mockReturnThis(),
        getNext: jest.fn().mockReturnThis(),
        getRequest: req, // Mock the request object as needed
      })
    }
    try {
      let result = await registerGuard.canActivate(mockExecutionContext)
      expect(result).toBe(true)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toEqual('This email already exist')
    }
  })

  it('should create a use and confirm the accompanying wallet', async () => {
    const { user, token } = await controller.signUp(userInput)
    expect(user).toBeDefined()
    const wallet = await walletService.userWallet(user.id)
    expect(wallet).toBeDefined()
    expect(user.email).toBe(userInput.email)
    expect(token).toBeDefined()
    expect(jwtRegex.test(token)).toBe(true)
    expect(wallet.balance).toEqual(0)
  })

  it('Login a user', async () => {
    const { token, user } = await controller.login({ email: userInput.email, password: userInput.password })
    expect(token).toBeDefined()
    expect(user).toBeDefined()
    expect(user.email).toBe(userInput.email)
    expect(jwtRegex.test(token)).toBe(true)
  })

  afterAll(async () => {
    await testDatabaseConfig.close()
  })
})
