const express = require('express')
const app = express()
const jwt = require('jsonwebtoken')

const { verifyToken, filterAdmin, validateProductName, validateProductPrice, 
    validateProductNamePut, validateProductId, validateDetails,
    validateNewOrder, validateOrderId, validateStatus, validateUsername,
    validateFullName, validateFullNamePut, validateEmail, validateEmailPut,
    validateTelephone, validateTelephonePut, validateAddress, validateAddressPut,
    validatePassword, validatePasswordPut, validateLogin, validateUser,
    validateUserId } = require('./functions.js')

const { createUser, selectUserLogin, getProducts, createProduct, modifyProduct,
    deleteProduct, getUsers, getUser, modifyUser, deleteUser, getOrdersUser,
    getOrders, createOrder, modifyStatus, deleteOrder } = require('./queries.js')

app.use(express.json())

app.listen(process.env.PORT || 3000, () => console.log('server started'))

const authorizationPassword = 'cd7aPOdZW!n!'

//register and login
app.post('/users/register', validateUsername, validateFullName, validateEmail, 
    validateTelephone, validateAddress, validatePassword, async (req, res) => {
    const newUser = {
        username: req.body.username,
        fullName: req.body.fullName,
        email: req.body.email,
        telephone: +req.body.telephone,
        address: req.body.address,
        password: req.body.password
    }
    createUser(newUser, req, res)
})

app.post('/users/login', validateLogin, async (req, res) => {
    const { username, password } = req.body
    selectUserLogin(username, password, req, res)
})

app.use(verifyToken)

//products
app.get('/products', async (req, res) => {
    getProducts(req, res)
})

app.post('/products', filterAdmin, validateProductName, validateProductPrice, async (req, res) => {
    const newProduct = {
        name: req.body.name,
        price: req.body.price
    }
    createProduct(newProduct, req, res)
})

app.put('/products/:productId', filterAdmin, validateProductId, validateProductNamePut, async (req, res) => {
    const productId = +req.params.productId
    modifyProduct(productId, req, res)
})

app.delete('/products/:productId', filterAdmin, validateProductId, validateDetails, async (req, res) => {
    const productId = +req.params.productId
    deleteProduct(productId, req, res)
})

//users
app.get('/users', filterAdmin, async (req, res) => {
    getUsers(req, res)
})

app.get('/users/:userId', validateUser, validateUserId, async (req, res) => {
    const userId = +req.params.userId
    getUser(userId, req, res)
}) 

app.put('/users/:userId', validateUser, validateUserId, validateFullNamePut, validateEmailPut, 
validateTelephonePut, validateAddressPut, validatePasswordPut, async (req, res) => {
    const userId = +req.params.userId
    modifyUser(userId, req, res)
})

app.delete('/users/:userId', validateUser, validateUserId, async (req, res) => {
    const userId = +req.params.userId
    deleteUser(userId, req, res)
})

app.get('/users/:userId/orders', validateUser, validateUserId, async (req, res) => {
    const userId = +req.params.userId
    getOrdersUser(userId, req, res)
})

//orders
app.get('/orders', filterAdmin, async (req, res) => {
    getOrders(req, res)
})

app.post('/orders', validateNewOrder, async (req, res) => {
    const now = new Date()
    const newOrder = {
        status: "nuevo",
        time: now,
        paymentMethod: req.body.paymentMethod,
        userId: jwt.verify(req.headers.authorization.split(' ')[1], authorizationPassword).userId,
        products: req.body.products
    }
    createOrder(newOrder, req, res)
})

app.put('/orders/:orderId', filterAdmin, validateOrderId, validateStatus, async (req, res) => {
    const orderId = +req.params.orderId
    modifyStatus(orderId, req, res)
})

app.delete('/orders/:orderId', filterAdmin, validateOrderId, async (req, res) => {
    const orderId = +req.params.orderId
    deleteOrder(orderId, req, res)
})
