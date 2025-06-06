const { UserDTO } = require('../dtos/user.dto');
const User = require('../models/user.model');

class UserMapper {
    static toModel(createDTO) {
        return new User({
            firstName: createDTO.firstName,
            lastName: createDTO.lastName,
            email: createDTO.email,
            password: createDTO.password,
            isActive: true
        });
    }

    static toModelForUpdate(updateDTO) {
        const updateData = new User({
            firstName: updateDTO.firstName,
            lastName: updateDTO.lastName,
            email: updateDTO.email,
            isActive: updateDTO.isActive
        });

        if (updateDTO.password) {
            updateData.password = updateDTO.password;
        }

        return updateData;
    }

    static toDTO(userModel) {
        return new UserDTO(userModel);
    }

    static toDTOList(userModels) {
        return userModels.map(model => this.toDTO(model));
    }

    static toPaginatedDTO(paginationResult) {
        return {
            items: this.toDTOList(paginationResult.docs),
            page: paginationResult.page,
            limit: paginationResult.limit,
            total: paginationResult.totalDocs,
            pages: paginationResult.totalPages
        };
    }
}

module.exports = UserMapper; 