import { Test, TestingModule } from '@nestjs/testing'
import { config } from "dotenv"

import { WalletsModule } from '../wallet/wallet.module'
import { UsersModule } from '../users/users.module'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './auth.service'
import { LocalStrategy } from './local.strategy'
import { JwtStrategy } from './jwt.strategy'
import { AuthController } from './auth.controller'

describe('Authentication Controller', () => {
  let controller: AuthController

  beforeEach(async () => {
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
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
