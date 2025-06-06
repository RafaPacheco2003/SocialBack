module.exports = {
    secret: process.env.JWT_SECRET || "your-secret-key",
    expiresIn: "24h",
    refreshExpiresIn: "7d",
    saltRounds: 10
}; 