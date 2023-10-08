import { Controller, Body, Post, UseGuards } from '@nestjs/common'

import { AuthService } from './auth.service'
import { DoesUserExist, LoginValidator, RegistrationValidator } from '../../core/guards/doesUserExist.guard'
import { UserInterface } from '../users/user.interfaces'

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @UseGuards(LoginValidator)
    @Post('login')
    async login (@Body() req) {
        const user = await this.authService.validateUser(req.email, req.password)
        return await this.authService.login(user)
    }

    @UseGuards(RegistrationValidator, DoesUserExist)
    @Post('signup')
    async signUp (@Body() user: UserInterface) {
        return await this.authService.create(user)
    }
}
