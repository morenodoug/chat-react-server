const databaseConnection = {
    host: 'localhost',
    port: 5432,
    database: 'reactChat',
    user: 'postgres',
    password: '12345'
};

// jsonwebtoken
const secret = 'hamburguesas';

const optionsJWT = {
    expiresIn: Math.floor(Date.now() / 1000) + (60 * 60),
}

//bcrypt
const saltRounds = 10;

module.exports = {
    databaseConnection: databaseConnection,
    secret: secret,
    optionsJWT: optionsJWT,
    saltRounds: saltRounds
}