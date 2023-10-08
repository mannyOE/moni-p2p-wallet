import { CanActivate, ExecutionContext, Injectable, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common'
import { Observable } from 'rxjs'

import { UsersService } from '../../modules/users/users.service'
import { LoginValidationSchema, RegisterValidationSchema } from '../../modules/auth/auth.validators'

@Injectable()
export class DoesUserExist implements CanActivate {
    constructor(private readonly userService: UsersService) { }

    canActivate (
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        return this.validateRequest(request)
    }

    async validateRequest (request) {
        const userExist = await this.userService.findOneByEmail(request.body.email)
        if (userExist) {
            throw new ForbiddenException('This email already exist')
        }
        return true
    }
}


@Injectable()
export class RegistrationValidator implements CanActivate {
    constructor(private readonly userService: UsersService) { }

    canActivate (
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        return this.validateRequest(request)
    }

    async validateRequest (request) {
        const customMessages = {
            'dob.invalid': 'Date of Birth must be at least 18 years ago.',
            'address.invalid': 'Address must contain terms like avenue, street, road, close, etc.',
        }
        const result = RegisterValidationSchema.validate(request.body, { messages: customMessages })
        if (result.error) {
            throw new HttpException(
                {
                    message: 'Incomplete data provided', // Replace with your custom error message
                    details: result.error.message, // You can include additional error information
                },
                HttpStatus.BAD_REQUEST, // You can choose an appropriate HTTP status code
            )
        }
        return true
    }
}


@Injectable()
export class LoginValidator implements CanActivate {
    constructor(private readonly userService: UsersService) { }

    canActivate (
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        return this.validateRequest(request)
    }

    async validateRequest (request) {
        const result = LoginValidationSchema.validate(request.body)
        if (result.error) {
            throw new HttpException(
                {
                    message: 'Incomplete data provided', // Replace with your custom error message
                    details: result.error.message, // You can include additional error information
                },
                HttpStatus.BAD_REQUEST, // You can choose an appropriate HTTP status code
            )
        }
        return true
    }
}