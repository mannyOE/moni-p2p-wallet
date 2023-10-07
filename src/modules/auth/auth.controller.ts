import { Controller, Body, Post, UseGuards, Request, HttpException, HttpStatus } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

import { AuthService } from './auth.service'
import { DoesUserExist, RegistrationValidator } from '../../core/guards/doesUserExist.guard'
import { UserInterface } from '../users/user.interfaces'
import { RegisterValidationSchema } from './auth.validators'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login (@Request() req) {
        return await this.authService.login(req.user)
    }

    @UseGuards(RegistrationValidator, DoesUserExist)
    @Post('signup')
    async signUp (@Body() user: UserInterface) {
        return await this.authService.create(user)
    }
}
