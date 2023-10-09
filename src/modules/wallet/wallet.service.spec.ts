import { config } from "dotenv"
import { v4 as uuidv4 } from 'uuid'
import { Test, TestingModule } from '@nestjs/testing'
import { WalletsService } from './wallet.service'
import { faker } from '@faker-js/faker'
import { walletsProviders } from './wallet.providers'
import { testDatabaseConfig } from '../../core/database/test.database.config'
import { UsersModule } from '../users/users.module'
import { UsersService } from '../users/users.service'

testDatabaseConfig.authenticate().then(() => {

})


describe('WalletsService', () => {
  let service: WalletsService
  let userService: UsersService
  let user, wallet
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
      providers: [WalletsService, ...walletsProviders],
      exports: [WalletsService],
      imports: [UsersModule]
    }).compile()

    service = module.get<WalletsService>(WalletsService)
    userService = module.get<UsersService>(UsersService)
    user = await userService.create(userInput)
    user = user.dataValues
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should create a user wallet', async () => {
    const { dataValues } = await service.create({
      userId: user.id,
      balance: 0,
      previous_balance: 0,
      reference: uuidv4()
    })

    expect(dataValues.balance).toEqual(0)
    wallet = await service.userWallet(user.id)
    expect(wallet.id).toEqual(dataValues.id)
  })

  it('should topup a user wallet', async () => {
    const updatedWallet = await service.topupWallet(wallet.id, 500)
    expect(wallet.id).toEqual(updatedWallet.id)
    expect(wallet.balance).toEqual(updatedWallet.previous_balance)
    expect(updatedWallet.balance).toEqual(wallet.balance + 500)
  })

  afterAll(async () => {
    await testDatabaseConfig.close()
  })
})
