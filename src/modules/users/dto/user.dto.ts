import { IsNotEmpty, MinLength, IsEmail, IsEnum, IsDate } from 'class-validator'

enum Gender {
    MALE = 'male',
    FEMALE = 'female',
}

export class UserDto {

    @IsNotEmpty()
    readonly first_name: string

    @IsNotEmpty()
    readonly last_name: string

    @IsNotEmpty()
    readonly address: string

    @IsNotEmpty()
    readonly phone_number: string

    @IsNotEmpty()
    @IsDate()
    readonly dob: Date

    @IsNotEmpty()
    @IsEmail()
    readonly email: string

    @IsNotEmpty()
    @MinLength(6)
    readonly password: string

}
