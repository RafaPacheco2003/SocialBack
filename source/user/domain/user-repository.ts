import { UserEntity } from './user-entity';

export interface UserRepository {
    findById(uuid: string): Promise<UserEntity | null>;
    findByEmail(email: string): Promise<UserEntity | null>;
    create(userEntity: UserEntity): Promise<UserEntity>;
    update(userEntity: UserEntity): Promise<UserEntity>;
    delete(uuid: string): Promise<boolean>;
    findAll(): Promise<UserEntity[]>;
}