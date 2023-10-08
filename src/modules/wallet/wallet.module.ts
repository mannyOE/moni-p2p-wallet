import { Module } from '@nestjs/common'

import { WalletsService } from './wallet.service'
import { WalletController } from './wallet.controller'
import { walletsProviders } from './wallet.providers'

@Module({
  providers: [WalletsService, ...walletsProviders],
  controllers: [WalletController],
  exports: [WalletsService]
})
export class WalletsModule { }
