import { UserRepository } from '../../domain/user-repository';
import { UserEntity } from '../../domain/user-entity'; 
import { UserModel } from '../model/UserSchema';


export class MongoRepository implements UserRepository {
    private toEntity(mongoDocument: any): UserEntity {
        return {
            uuid: mongoDocument.uuid,
            firstName: mongoDocument.firstName,
            lastName: mongoDocument.lastName,
            phoneNumber: mongoDocument.phoneNumber,
            email: mongoDocument.email,
            password: mongoDocument.password,
            createdAt: mongoDocument.createdAt,
            updatedAt: mongoDocument.updatedAt || new Date(),
            isActive: mongoDocument.isActive,
            lastLogin: mongoDocument.lastLogin
        };
    }

    async findById(uuid: string): Promise<UserEntity | null> {
        const user = await UserModel.findOne({ uuid }).lean();
        if (!user) {
            return null;
        }
        return this.toEntity(user);
    }

    async findByEmail(email: string): Promise<UserEntity | null> {
        const user = await UserModel.findOne({ email }).lean();
        if (!user) {
            return null;
        }
        return this.toEntity(user);
    }

    async create(userEntity: UserEntity): Promise<UserEntity> {
        const user = await UserModel.create({
            uuid: userEntity.uuid,
            firstName: userEntity.firstName,
            lastName: userEntity.lastName,
            phoneNumber: userEntity.phoneNumber,
            email: userEntity.email,
            password: userEntity.password,
            createdAt: userEntity.createdAt,
            updatedAt: userEntity.updatedAt,
            isActive: userEntity.isActive,
            lastLogin: userEntity.lastLogin
        });
        
        return this.toEntity(user);
    }

    async update(userEntity: UserEntity): Promise<UserEntity> {
        const updatedUser = await UserModel.findOneAndUpdate(
            { uuid: userEntity.uuid },
            {
                firstName: userEntity.firstName,
                lastName: userEntity.lastName,
                phoneNumber: userEntity.phoneNumber,
                email: userEntity.email,
                password: userEntity.password,
                updatedAt: new Date(),
                isActive: userEntity.isActive,
                lastLogin: userEntity.lastLogin
            },
            { new: true, lean: true }
        );

     

        return this.toEntity(updatedUser);
    }

    async delete(uuid: string): Promise<boolean> {
        const result = await UserModel.deleteOne({ uuid });
        return result.deletedCount > 0;
    }

    async findAll(): Promise<UserEntity[]> {
        const users = await UserModel.find().lean();
        if (!users || users.length === 0) {
            return [];
        }
        return users.map(user => this.toEntity(user));
    }
}