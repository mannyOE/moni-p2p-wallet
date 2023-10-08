import { CanActivate, ExecutionContext, Injectable, ForbiddenException, HttpException, HttpStatus } from '@nestjs/common'
import { Observable } from 'rxjs'
const crypto = require('crypto')
const secret = process.env.PAYSTACK_SECRET

import { UsersService } from '../../modules/users/users.service'
import { LoginValidationSchema, RegisterValidationSchema } from '../../modules/auth/auth.validators'
import { WalletsService } from '../../modules/wallet/wallet.service'

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

@Injectable()
export class TransferValidator implements CanActivate {
    constructor(private readonly userService: UsersService, private readonly walletService: WalletsService) { }

    canActivate (
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        return this.validateRequest(request)
    }

    async validateRequest (request) {
        const result = this.userService.findOneByEmail(request.body.email)
        if (!result) {
            throw new HttpException(
                {
                    message: 'No user found by this email', // Replace with your custom error message
                },
                HttpStatus.BAD_REQUEST, // You can choose an appropriate HTTP status code
            )
        }
        const wallet = await this.walletService.userWallet(request.user.id)
        if (!wallet) {
            throw new HttpException(
                {
                    message: 'No wallet found for this user', // Replace with your custom error message
                },
                HttpStatus.BAD_REQUEST, // You can choose an appropriate HTTP status code
            )
        }
        if (wallet.balance < request.body.amount) {
            throw new HttpException(
                {
                    message: 'You do not have enough in your wallet to make this transaction', // Replace with your custom error message
                },
                HttpStatus.BAD_REQUEST, // You can choose an appropriate HTTP status code
            )
        }
        return true
    }
}


@Injectable()
export class PaystackValidator implements CanActivate {
    constructor() { }

    canActivate (
        context: ExecutionContext,
    ): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest()
        return this.validateRequest(request)
    }

    async validateRequest (request) {
        const hash = crypto.createHmac('sha512', secret).update(JSON.stringify(request.body)).digest('hex')
        if (hash !== request.headers['x-paystack-signature']) {
            // Retrieve the request's body
            throw new HttpException(
                {
                    message: 'Signature does not match', // Replace with your custom error message
                    details: "Signature does not match", // You can include additional error information
                },
                HttpStatus.BAD_REQUEST, // You can choose an appropriate HTTP status code
            )
        }
        return true
    }
}