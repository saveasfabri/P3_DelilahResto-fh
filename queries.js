const { QueryTypes } = require("sequelize")
const { db } = require("./db")
const jwt = require('jsonwebtoken')

const authorizationPassword = 'cd7aPOdZW!n!'

async function validateProductNameQuery(req, res, next) {
    const productId = +req.params.productId
    const product = await db.query(`SELECT * FROM products WHERE product_id = ?`, {
        replacements: [productId],
        type: QueryTypes.SELECT 
    })
    const newProduct = { name: req.body.name || product[0].name }
    if(newProduct.name.length > 1 && newProduct.name.length < 65) next()
    else res.status(400).send("The product name is wrong").end()
}

async function validateProductIdQuery(req, res, next) {
    const productId = +req.params.productId
    const products = await db.query(`SELECT product_id FROM products`, {
        type: QueryTypes.SELECT
    })
    const productsArray = products.map(id => id.product_id)
    if(productsArray.includes(productId)) next()
    else res.status(404).send("The product does not exist").end()
}

async function validateDetailsQuery(req, res, next) {
    let products = await db.query(`SELECT product_id FROM orders_products`, {
        type: QueryTypes.SELECT
    })
    if(products.every(p => p.product_id !== +req.params.productId)) next()
    else res.status(400).send("The product cannot be removed").end()
}

async function validateNewOrderQuery(req, res, next) {
    const newOrder = req.body
    const ids = newOrder.products.map(product => product.productId)
    const qs = newOrder.products.map(quantity => quantity.quantity)
    const products = await db.query(`SELECT product_id FROM products`, {
        type: QueryTypes.SELECT
    })
    const productsArray = products.map(id => id.product_id)
    if(["efectivo", "tarjeta"].includes(newOrder.paymentMethod)) {
        if(ids.every(id => typeof(id) === "number" && productsArray.includes(id))) {
            if(ids.every(different)) {
                if(qs.every(q => typeof(q) === "number" && q > 0 && Number.isInteger(q))) next()
                else res.status(400).send("The quantity is wrong").end()
            } else res.status(400).send("The productId is wrong").end()
        } else res.status(400).send("The productId is wrong").end()
    } else res.status(400).send("The payment method is wrong").end()
}

function different(value, index, list) {
    return list.indexOf(value) === index
}

async function validateOrderIdQuery(req, res, next) {
    const orderId = +req.params.orderId
    const orders = await db.query(`SELECT order_id FROM orders`, {
        type: QueryTypes.SELECT
    })
    const ordersArray = orders.map(id => id.order_id)
    if(ordersArray.includes(orderId)) next()
    else res.status(404).send("The order does not exist").end()
}

async function validateUsernameQuery(req, res, next) {
    const newUsername = req.body.username
    const users = await db.query(`SELECT username FROM users`, {
        type: QueryTypes.SELECT
    })
    const usersArray = users.map(user => user.username)
    if(newUsername.length >= 3 && newUsername.length <= 64) {
        if(usersArray.every(user => user != newUsername)) next()
        else res.status(400).send("The username already exists").end()
    } else res.status(400).send("The username length is wrong").end()
}

async function validateLoginQuery(req, res, next) {
    const { username, password } = req.body
    const user = await db.query(`SELECT * FROM users WHERE username = :username && password = :password`, { 
        replacements: { username, password },
        type: QueryTypes.SELECT 
    })
    if(user[0]) next()
    else res.status(400).send("Invalid credentials").end()
}

async function validateUserIdQuery(req, res, next) {
    const userId = +req.params.userId
    const users = await db.query(`SELECT user_id FROM users`, {
        type: QueryTypes.SELECT
    })
    const usersArray = users.map(id => id.user_id)
    if(usersArray.includes(userId)) next()
    else res.status(404).send("The user does not exist").end()
}

async function createUser(newUser, req, res) {
    const inserted = await db.query(`
    INSERT INTO users (username, full_name, email, telephone, address, password)
    VALUES (:username, :fullName, :email, :telephone, :address, :password)
    `, {
        replacements: newUser,
        type: QueryTypes.INSERT
    })
    const { username, fullName, email, telephone, address } = newUser
    res.status(201).json(Object.assign({}, { user_id: inserted[0] } , 
        { username: username, full_name: fullName, email: email, telephone: telephone, address: address}))
}

async function selectUserLogin(username, password, req, res) {
    const user = await db.query(`SELECT * FROM users WHERE username = :username && password = :password`, { 
        replacements: { username, password },
        type: QueryTypes.SELECT 
    })
    const admin = user[0].admin
    const userId = user[0].user_id
    res.status(200).json(jwt.sign({ username,  admin, userId} , authorizationPassword))
}

async function getProducts(req, res) {
    const products = await db.query(`SELECT * FROM products`, { type: QueryTypes.SELECT })
    res.status(200).json(products)
}

async function createProduct(newProduct, req, res) {
    const inserted = await db.query(`
    INSERT INTO products (name, unit_price)
    VALUES (:name, :price)
    `, {
        replacements: newProduct,
        type: QueryTypes.INSERT
    })
    res.status(201).json(Object.assign({}, { productId: inserted[0] } , newProduct))
}

async function modifyProduct(productId, req, res) {
    const product = await db.query(`SELECT * FROM products WHERE product_id = ?`, {
        replacements: [productId],
        type: QueryTypes.SELECT 
    })
    const newProduct = {
        productId: productId,
        name: req.body.name || product[0].name,
        price: req.body.price || product[0].unit_price
    }
    const modified = await db.query(`
    UPDATE products SET name = :name, unit_price = :price WHERE product_id = :productId
    `, {
        replacements: newProduct,
        type: QueryTypes.UPDATE
    })
    res.status(200).json(newProduct)
}
    
async function deleteProduct(productId, req, res) {
    const product = await db.query(`SELECT * FROM products WHERE product_id = ?`, {
        replacements: [productId],
        type: QueryTypes.SELECT 
    })
    const deleted = await db.query(`DELETE FROM products WHERE product_id = ?`, {
        replacements: [productId],
        type: QueryTypes.DELETE
    })
    res.status(200).json(product[0])
}
    
async function getUsers(req, res) {
    const users = await db.query(`
    SELECT user_id, username, full_name, email, telephone, address, admin FROM users
    `, { 
        type: QueryTypes.SELECT 
    })
    res.status(200).json(users)
}

async function getUser(userId, req, res) {
    const user = await db.query(`
    SELECT user_id, username, full_name, email, telephone, address, admin FROM users WHERE user_id = ?
    `, { 
        replacements: [userId],
        type: QueryTypes.SELECT 
    })
    res.status(200).json(user[0])
}
    
async function modifyUser(userId, req, res) {
    const user = await db.query(`SELECT * FROM users WHERE user_id = ?`, {
        replacements: [userId],
        type: QueryTypes.SELECT 
    })
    const password = req.body.password || user[0].password
    const newUser = {
        userId: userId,
        username: user[0].username,
        fullName: req.body.fullName || user[0].full_name,
        email: req.body.email || user[0].email,
        telephone: req.body.telephone || user[0].telephone,
        address: req.body.address || user[0].address,
        admin: user[0].admin
    }
    const modified = await db.query(`
    UPDATE users SET username = :username, full_name = :fullName, email = :email, 
    telephone = :telephone, address = :address, password = :password
    WHERE user_id = :userId
    `, {
        replacements: Object.assign( {}, newUser, {password: password} ),
        type: QueryTypes.UPDATE
    })
    res.status(200).json(newUser)
}
    
async function deleteUser(userId, req, res) {
    const user = await db.query(`SELECT * FROM users WHERE user_id = ?`, {
        replacements: [userId],
        type: QueryTypes.SELECT 
    })
    const deleted = await db.query(`DELETE FROM users WHERE user_id = ?`, {
        replacements: [userId],
        type: QueryTypes.DELETE
    })
    const {user_id, username, full_name, email, telephone, address, admin} = user[0]
    res.status(200).json({ user_id, username, full_name, email, telephone, address, admin })
}

async function getOrdersUser(userId, req, res) {
    const orders = await db.query(`SELECT * FROM orders WHERE user_id = ?`, { 
        replacements: [userId], type: QueryTypes.SELECT 
    })
    const users = await db.query(`SELECT user_id, username, full_name, email, telephone, address, admin FROM users`, { 
        type: QueryTypes.SELECT 
    })
    const products = await db.query(`SELECT *, op.quantity * p.unit_price AS subtotal FROM orders_products op 
    INNER JOIN products p ON op.product_id = p.product_id`, { 
        type: QueryTypes.SELECT 
    })
    const total = await db.query(`SELECT op.order_id, SUM(op.quantity * p.unit_price) AS total 
    FROM orders_products op inner join orders o on o.order_id = op.order_id inner join products p 
    on p.product_id = op.product_id GROUP BY op.order_id`, { 
        type: QueryTypes.SELECT 
    })
    
    const ordersAndProducts = orders.map(order => 
        Object.assign( {} , order, { products: products.filter(product => 
            product.order_id === order.order_id)}, { total: +total.filter(row => 
                row.order_id === order.order_id)[0].total }, { user: users.filter(user => 
                    user.user_id === order.user_id)[0]}
        ))
    res.status(200).json(ordersAndProducts)
}

async function getOrders(req, res) {
    const orders = await db.query(`SELECT order_id, status, time, payment_method, o.user_id
    FROM orders o INNER JOIN users u ON o.user_id = u.user_id`, {
        type: QueryTypes.SELECT 
    })
    const users = await db.query(`SELECT user_id, username, full_name, email, telephone, address, admin FROM users`, { 
        type: QueryTypes.SELECT 
    })
    const products = await db.query(`SELECT *, op.quantity * p.unit_price AS subtotal FROM orders_products op 
    INNER JOIN products p ON op.product_id = p.product_id`, { 
        type: QueryTypes.SELECT 
    })
    const total = await db.query(`SELECT op.order_id, SUM(op.quantity * p.unit_price) AS total 
    FROM orders_products op inner join orders o on o.order_id = op.order_id inner join products p 
    on p.product_id = op.product_id GROUP BY op.order_id`, { 
        type: QueryTypes.SELECT 
    })
    
    const ordersAndProducts = orders.map(order => 
        Object.assign( {} , order, { products: products.filter(product => 
            product.order_id === order.order_id)}, { total: +total.filter(row => 
                row.order_id === order.order_id)[0].total }, { user: users.filter(user => 
                    user.user_id === order.user_id)[0]}
        ))
    res.status(200).json(ordersAndProducts)
}

async function createOrder(newOrder, req, res) {
    const orderInserted = await db.query(`
    INSERT INTO orders (status, time, payment_method, user_id)
    VALUES (:status, :time, :paymentMethod, :userId)
    `, {
        replacements: newOrder,
        type: QueryTypes.INSERT
    })
    
    req.body.products.forEach(async product => await db.query(`
        INSERT INTO orders_products (order_id, product_id, quantity)
        VALUES (${orderInserted[0]}, ${product.productId}, ${product.quantity})
        `, {
            replacements: req.body.products,
            type: QueryTypes.INSERT
    }))
    
    const user = await db.query(`
    SELECT user_id, username, full_name, email, telephone, address, admin FROM users WHERE user_id = ?
    `, {
        replacements: [jwt.verify(req.headers.authorization.split(' ')[1], authorizationPassword).userId],
        type: QueryTypes.SELECT 
    })
    res.status(201).json(Object.assign( {}, { orderId: orderInserted[0] }, newOrder, {user: user[0]} ))
}
    
async function modifyStatus(orderId, req, res) {
    const order = await db.query(`SELECT * FROM orders WHERE order_id = ?`, {
        replacements: [orderId],
        type: QueryTypes.SELECT
    })

    const newOrder = {
        orderId: orderId,
        status: req.body.status || order[0].status,
        time: order[0].time,
        paymentMethod: order[0].payment_method,
        userId: order[0].user_id
    }
    const modified = await db.query(`UPDATE orders SET status = :status WHERE order_id = :orderId`, {
        replacements: newOrder,
        type: QueryTypes.UPDATE
    })
    res.status(200).json(newOrder)
}

async function deleteOrder(orderId, req, res) {
    const order = await db.query(`SELECT * FROM orders WHERE order_id = ?`, {
        replacements: [orderId],
        type: QueryTypes.SELECT
    })
    const deleted = await db.query(`DELETE FROM orders WHERE order_id = ?`, {
        replacements: [orderId],
        type: QueryTypes.DELETE
    })
    res.status(200).json(order[0])
}

module.exports = { 
    validateProductNameQuery, validateProductIdQuery, validateDetailsQuery,
    validateNewOrderQuery, validateOrderIdQuery, validateUsernameQuery,
    validateLoginQuery, validateUserIdQuery, createUser, selectUserLogin,
    getProducts, createProduct, modifyProduct, deleteProduct, getUsers,
    getUser, modifyUser, deleteUser, getOrdersUser, getOrders, createOrder,
    modifyStatus, deleteOrder
}