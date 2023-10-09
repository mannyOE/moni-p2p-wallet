import { Test, TestingModule } from '@nestjs/testing'
import { UsersService } from './users.service'
import { usersProviders } from './users.providers'
import { faker } from '@faker-js/faker'
import { testDatabaseConfig } from '../../core/database/test.database.config'

testDatabaseConfig.authenticate().then(() => {

})


describe('UsersService', () => {
  let service: UsersService
  const createdUserIds = []
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
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, ...usersProviders],
      exports: [UsersService],
    }).compile()

    service = module.get<UsersService>(UsersService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should create a user', async () => {
    const user = await service.create(userInput)
    expect(user).toBeDefined()
    createdUserIds.push(user.dataValues.id)
    expect(user.dataValues.email).toEqual(userInput.email)
  })
  it('fetched user should match', async () => {
    let user = await service.findOneByEmail(userInput.email)
    expect(user).toBeDefined()
    expect(user.email).toEqual(userInput.email)
    user = await service.findOneById(createdUserIds[0])
    expect(user).toBeDefined()
    expect(user.email).toEqual(userInput.email)
  })

  afterAll(async () => {
    await testDatabaseConfig.close()
  })
})
