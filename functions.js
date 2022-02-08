const jwt = require('jsonwebtoken')

const { validateProductNameQuery, validateProductIdQuery, validateDetailsQuery, 
    validateNewOrderQuery, validateOrderIdQuery, validateUsernameQuery,
    validateLoginQuery, validateUserIdQuery } = require('./queries.js')

const authorizationPassword = 'cd7aPOdZW!n!'

function verifyToken(req, res, next) {
    const fullToken = req.headers.authorization || "0.0.0"
    const token = fullToken.split(' ')[1]
    try {
        jwt.verify(token, authorizationPassword)
        next()
    } catch (error) {
        res.status(401).send(error)
    }
}

function filterAdmin(req, res, next) {
    const token = req.headers.authorization.split(' ')[1]
    const user = jwt.verify(token, authorizationPassword)
    if(user.admin) {
        next()
    } else {
        res.status(403).send("You do not have administrator permissions").end()
    }
}

const validateProductName = (req, res, next) => {
    const pName = req.body.name
    if(pName.length > 1 && pName.length < 65) next()
    else res.status(400).send("The product name is wrong").end()
}

const validateProductPrice = (req, res, next) => {
    const price = req.body.price
    if(typeof(price) === "number") {
        if(Math.trunc(price) < 10000 && Math.trunc(price) > 0) next()
        else res.status(400).send("The price is wrong").end()
    } else {
        res.status(400).send("The price is not a number").end()
    }
}

async function validateProductNamePut(req, res, next) {
    await validateProductNameQuery(req, res, next)
}

async function validateProductId(req, res, next) {
    await validateProductIdQuery(req, res, next)
}

async function validateDetails(req, res, next) {
    await validateDetailsQuery(req, res, next)
}

async function validateNewOrder(req, res, next) {
    await validateNewOrderQuery(req, res, next)
}

async function validateOrderId(req, res, next) {
    await validateOrderIdQuery(req, res, next)
}

function validateStatus(req, res, next) {
    const status = req.body.status
    if(["nuevo", "confirmado", "preparando", "enviando", "cancelado", "entregado"].includes(status)) next()
    else res.status(400).send("The status is wrong").end()
}

async function validateUsername(req, res, next) {
    await validateUsernameQuery(req, res, next)
}

function validateFullName(req, res, next) {
    const newFullName = req.body.fullName
    if(newFullName) {
        if(newFullName.length >= 3 && newFullName.length <= 64) next()  
        else res.status(400).send("The full name length is wrong").end()
    } else res.status(400).send("The full name is wrong").end()
}

function validateFullNamePut(req, res, next) {
    if(req.body.fullName) {
        if(req.body.fullName.length >= 3 && req.body.fullName.length <= 64) next()  
        else res.status(400).send("The full name length is wrong").end()
    } else next()
}

function validateEmail(req, res, next) {
    const email = req.body.email
    if(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email)) next()
    else res.status(400).send("The email is wrong").end()
}

function validateEmailPut(req, res, next) {
    if(req.body.email) {
        if(/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(req.body.email)) next()
        else res.status(400).send("The email is wrong").end()
    } else next()
}

function validateTelephone(req, res, next) {
    const telephone = req.body.telephone
    if(Number.isInteger(telephone) && telephone >= 100000000 && telephone <= 9999999999999) next()
    else res.status(400).send("The telephone is wrong").end()
}

function validateTelephonePut(req, res, next) {
    if(req.body.telephone) {
        if(Number.isInteger(req.body.telephone) && req.body.telephone >= 100000000 && req.body.telephone <= 9999999999999) next()
        else res.status(400).send("The telephone is wrong").end()
    } else next()
}

function validateAddress(req, res, next) {
    const address = req.body.address
    if(address.length >= 3 && address.length <= 64) next()
    else res.status(400).send("The address is wrong").end()
}

function validateAddressPut(req, res, next) {
    if(req.body.address) {
        if(req.body.address.length >= 3 && req.body.address.length <= 64) next()
        else res.status(400).send("The address is wrong").end()
    } else next()
}

function validatePassword(req, res, next) {
    const password = req.body.password
    if(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*?&#.$($)$-$_]{4,15}$/.test(password)) next()
    else res.status(400).send("The password is wrong").end()
}
// Minimum 4 characters
// Maximum 15 characters
// At least 1 character
// At least 1 digit
// No blank spaces

function validatePasswordPut(req, res, next) {
    if(req.body.password) {
        if(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*?&#.$($)$-$_]{4,15}$/.test(req.body.password)) next()
        else res.status(400).send("The password is wrong").end()
    } else next()
}

async function validateLogin(req, res, next) {
    await validateLoginQuery(req, res, next)
}

function validateUser(req, res, next) {
    const userId = +req.params.userId
    const token = jwt.verify(req.headers.authorization.split(' ')[1], authorizationPassword)
    if(token.userId === userId || token.admin === 1) next()
    else res.status(401).send("You do not have enough permissions").end()
}

async function validateUserId(req, res, next) {
    await validateUserIdQuery(req, res, next)
}

module.exports = { 
    verifyToken, filterAdmin, validateProductName, validateProductPrice,
    validateProductNamePut, validateProductId, validateDetails, validateNewOrder,
    validateOrderId, validateStatus, validateUsername, validateFullName,
    validateFullNamePut, validateEmail, validateEmailPut, validateTelephone,
    validateTelephonePut, validateAddress, validateAddressPut, validatePassword,
    validatePasswordPut, validateLogin, validateUser, validateUserId
}