import { config } from "dotenv"
import { Test, TestingModule } from '@nestjs/testing'

import { AuthService } from './auth.service'
import { LocalStrategy } from './local.strategy'
import { JwtStrategy } from './jwt.strategy'
import { PassportModule } from '@nestjs/passport'
import { UsersModule } from '../users/users.module'
import { WalletsModule } from '../wallet/wallet.module'
import { JwtModule } from '@nestjs/jwt'

describe('AuthService', () => {
  let service: AuthService

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
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
