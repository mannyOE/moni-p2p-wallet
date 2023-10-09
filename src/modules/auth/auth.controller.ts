import { Controller, Body, Post, UseGuards, HttpException, HttpStatus } from '@nestjs/common'

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
        if (!user) {
            throw new HttpException(
                {
                    message: 'Account not found', // Replace with your custom error message
                    details: "No user found with these credentials", // You can include additional error information
                },
                HttpStatus.BAD_REQUEST, // You can choose an appropriate HTTP status code
            )
        }
        return await this.authService.login(user)
    }

    @UseGuards(RegistrationValidator, DoesUserExist)
    @Post('signup')
    async signUp (@Body() user: UserInterface) {
        return await this.authService.create(user)
    }
}
