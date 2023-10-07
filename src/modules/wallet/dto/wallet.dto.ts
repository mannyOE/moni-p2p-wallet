import { IsNotEmpty, MinLength } from 'class-validator'

export class WalletDto {

    @IsNotEmpty()
    @MinLength(4)
    readonly title: string

    @IsNotEmpty()
    readonly body: string
}
