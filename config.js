const databaseConnection = {
    host: 'localhost',
    port: 5432,
    database: 'reactChat',
    user: 'postgres',
    password: '12345'
};
const secret = 'hamburguesas';

module.exports = {
    databaseConnection: databaseConnection,
    secret: secret
}