const bcrypt = require('bcryptjs');
const authConfig = require('../config/auth.config');

class PasswordService {
    async hash(password) {
        return await bcrypt.hash(password, authConfig.saltRounds);
    }

    async verify(plainPassword, hashedPassword) {
        return await bcrypt.compare(plainPassword, hashedPassword);
    }
}

module.exports = new PasswordService(); 