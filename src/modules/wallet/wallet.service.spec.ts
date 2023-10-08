import { config } from "dotenv"
import { Test, TestingModule } from '@nestjs/testing'
import { WalletsService } from './wallet.service'
import { walletsProviders } from './wallet.providers'


describe('WalletsService', () => {
  let service: WalletsService

  beforeEach(async () => {
    config()
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletsService, ...walletsProviders],
      exports: [WalletsService]
    }).compile()

    service = module.get<WalletsService>(WalletsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
