import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common'

import { AuthService } from './auth.service'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
    constructor(private readonly authService: AuthService) {
        super()
    }

    async validate (email: string, password: string): Promise<any> {
        console.log("middleware")
        const user = await this.authService.validateUser(email, password)
        if (!user) {
            throw new HttpException(
                {
                    message: 'Invalid user credentials', // Replace with your custom error message
                    details: 'Invalid user credentials', // You can include additional error information
                },
                HttpStatus.BAD_REQUEST, // You can choose an appropriate HTTP status code
            )
        }
        return user
    }
}
