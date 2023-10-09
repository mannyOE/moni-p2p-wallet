import { Injectable, Inject } from '@nestjs/common'

import { User } from './user.entity'
import { USER_REPOSITORY } from '../../core/constants'
import { UserInterface } from './user.interfaces'

@Injectable()
export class UsersService {
    constructor(@Inject(USER_REPOSITORY) public userRepository: typeof User) { }

    async create (user: UserInterface): Promise<User> {
        return await this.userRepository.create<User>(user)
    }

    async findOneByEmail (email: string): Promise<User> {
        return await this.userRepository.findOne<User>({ where: { email } })
    }

    async findOneById (id: number): Promise<User> {
        return await this.userRepository.findOne<User>({ where: { id } })
    }

}
