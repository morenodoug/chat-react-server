//verificar emails
let isEmail = require('isemail');

//querys 
let db = require('../querys');

let error = {
    status: 400,
    message: " email no valido"
};


function validateEmail(email) {

    let promise = new Promise((resolve, reject) => {

        isEmail.validate(email, { checkDNS: true }, (validate) => {
            if (!validate) {
                reject(error);
            }
            resolve(email);
        });


    });

    return promise;
}


function usedEmail(email) {

    return db.any('SELECT * FROM "user" WHERE email =$1', [email]).
    then((data) => {
        return new Promise((resolve, reject) => {
            (data.length > 0) ? resolve(true): resolve(false);

        });

    }).
    catch((err) => {
        console.log(err);
        error.status = 500
        error.message = 'error en el servidor'
        return new Promise((resolve, reject) => {
            reject(error);
        });
    })
}



function usersConected(users) {
    let usersData = {}
    for (user in users) {
        usersData[[user].id] = users[user]
    }
    return usersData;
}


module.exports = {
    validateEmail: validateEmail,
    usedEmail: usedEmail
}