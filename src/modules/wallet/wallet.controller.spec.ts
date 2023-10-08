import { Test, TestingModule } from '@nestjs/testing'
import { config } from "dotenv"

import { WalletController } from './wallet.controller'
import { WalletsService } from './wallet.service'
import { walletsProviders } from './wallet.providers'

describe('Wallets Controller', () => {
  let controller: WalletController

  beforeEach(async () => {
    config()
    const module: TestingModule = await Test.createTestingModule({
      providers: [WalletsService, ...walletsProviders],
      controllers: [WalletController],
      exports: [WalletsService]
    }).compile()

    controller = module.get<WalletController>(WalletController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
