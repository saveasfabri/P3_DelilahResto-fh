"use strict";

var _require = require("sequelize"),
    QueryTypes = _require.QueryTypes;

var _require2 = require("./db"),
    db = _require2.db;

var jwt = require('jsonwebtoken');

var authorizationPassword = 'cd7aPOdZW!n!';

function validateProductNameQuery(req, res, next) {
  var productId, product, newProduct;
  return regeneratorRuntime.async(function validateProductNameQuery$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          productId = +req.params.productId;
          _context.next = 3;
          return regeneratorRuntime.awrap(db.query("SELECT * FROM products WHERE product_id = ?", {
            replacements: [productId],
            type: QueryTypes.SELECT
          }));

        case 3:
          product = _context.sent;
          newProduct = {
            name: req.body.name || product[0].name
          };
          if (newProduct.name.length > 1 && newProduct.name.length < 65) next();else res.status(400).send("The product name is wrong").end();

        case 6:
        case "end":
          return _context.stop();
      }
    }
  });
}

function validateProductIdQuery(req, res, next) {
  var productId, products, productsArray;
  return regeneratorRuntime.async(function validateProductIdQuery$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          productId = +req.params.productId;
          _context2.next = 3;
          return regeneratorRuntime.awrap(db.query("SELECT product_id FROM products", {
            type: QueryTypes.SELECT
          }));

        case 3:
          products = _context2.sent;
          productsArray = products.map(function (id) {
            return id.product_id;
          });
          if (productsArray.includes(productId)) next();else res.status(404).send("The product does not exist").end();

        case 6:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function validateDetailsQuery(req, res, next) {
  var products;
  return regeneratorRuntime.async(function validateDetailsQuery$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(db.query("SELECT product_id FROM orders_products", {
            type: QueryTypes.SELECT
          }));

        case 2:
          products = _context3.sent;
          if (products.every(function (p) {
            return p.product_id !== +req.params.productId;
          })) next();else res.status(400).send("The product cannot be removed").end();

        case 4:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function validateNewOrderQuery(req, res, next) {
  var newOrder, ids, qs, products, productsArray;
  return regeneratorRuntime.async(function validateNewOrderQuery$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          newOrder = req.body;
          ids = newOrder.products.map(function (product) {
            return product.productId;
          });
          qs = newOrder.products.map(function (quantity) {
            return quantity.quantity;
          });
          _context4.next = 5;
          return regeneratorRuntime.awrap(db.query("SELECT product_id FROM products", {
            type: QueryTypes.SELECT
          }));

        case 5:
          products = _context4.sent;
          productsArray = products.map(function (id) {
            return id.product_id;
          });

          if (["efectivo", "tarjeta"].includes(newOrder.paymentMethod)) {
            if (ids.every(function (id) {
              return typeof id === "number" && productsArray.includes(id);
            })) {
              if (ids.every(different)) {
                if (qs.every(function (q) {
                  return typeof q === "number" && q > 0 && Number.isInteger(q);
                })) next();else res.status(400).send("The quantity is wrong").end();
              } else res.status(400).send("The productId is wrong").end();
            } else res.status(400).send("The productId is wrong").end();
          } else res.status(400).send("The payment method is wrong").end();

        case 8:
        case "end":
          return _context4.stop();
      }
    }
  });
}

function different(value, index, list) {
  return list.indexOf(value) === index;
}

function validateOrderIdQuery(req, res, next) {
  var orderId, orders, ordersArray;
  return regeneratorRuntime.async(function validateOrderIdQuery$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          orderId = +req.params.orderId;
          _context5.next = 3;
          return regeneratorRuntime.awrap(db.query("SELECT order_id FROM orders", {
            type: QueryTypes.SELECT
          }));

        case 3:
          orders = _context5.sent;
          ordersArray = orders.map(function (id) {
            return id.order_id;
          });
          if (ordersArray.includes(orderId)) next();else res.status(404).send("The order does not exist").end();

        case 6:
        case "end":
          return _context5.stop();
      }
    }
  });
}

function validateUsernameQuery(req, res, next) {
  var newUsername, users, usersArray;
  return regeneratorRuntime.async(function validateUsernameQuery$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          newUsername = req.body.username;
          _context6.next = 3;
          return regeneratorRuntime.awrap(db.query("SELECT username FROM users", {
            type: QueryTypes.SELECT
          }));

        case 3:
          users = _context6.sent;
          usersArray = users.map(function (user) {
            return user.username;
          });

          if (newUsername.length >= 3 && newUsername.length <= 64) {
            if (usersArray.every(function (user) {
              return user != newUsername;
            })) next();else res.status(400).send("The username already exists").end();
          } else res.status(400).send("The username length is wrong").end();

        case 6:
        case "end":
          return _context6.stop();
      }
    }
  });
}

function validateLoginQuery(req, res, next) {
  var _req$body, username, password, user;

  return regeneratorRuntime.async(function validateLoginQuery$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _req$body = req.body, username = _req$body.username, password = _req$body.password;
          _context7.next = 3;
          return regeneratorRuntime.awrap(db.query("SELECT * FROM users WHERE username = :username && password = :password", {
            replacements: {
              username: username,
              password: password
            },
            type: QueryTypes.SELECT
          }));

        case 3:
          user = _context7.sent;
          if (user[0]) next();else res.status(400).send("Invalid credentials").end();

        case 5:
        case "end":
          return _context7.stop();
      }
    }
  });
}

function validateUserIdQuery(req, res, next) {
  var userId, users, usersArray;
  return regeneratorRuntime.async(function validateUserIdQuery$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          userId = +req.params.userId;
          _context8.next = 3;
          return regeneratorRuntime.awrap(db.query("SELECT user_id FROM users", {
            type: QueryTypes.SELECT
          }));

        case 3:
          users = _context8.sent;
          usersArray = users.map(function (id) {
            return id.user_id;
          });
          if (usersArray.includes(userId)) next();else res.status(404).send("The user does not exist").end();

        case 6:
        case "end":
          return _context8.stop();
      }
    }
  });
}

function createUser(newUser, req, res) {
  var inserted, username, fullName, email, telephone, address;
  return regeneratorRuntime.async(function createUser$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          _context9.next = 2;
          return regeneratorRuntime.awrap(db.query("\n    INSERT INTO users (username, full_name, email, telephone, address, password)\n    VALUES (:username, :fullName, :email, :telephone, :address, :password)\n    ", {
            replacements: newUser,
            type: QueryTypes.INSERT
          }));

        case 2:
          inserted = _context9.sent;
          username = newUser.username, fullName = newUser.fullName, email = newUser.email, telephone = newUser.telephone, address = newUser.address;
          res.status(201).json(Object.assign({}, {
            user_id: inserted[0]
          }, {
            username: username,
            full_name: fullName,
            email: email,
            telephone: telephone,
            address: address
          }));

        case 5:
        case "end":
          return _context9.stop();
      }
    }
  });
}

function selectUserLogin(username, password, req, res) {
  var user, admin, userId;
  return regeneratorRuntime.async(function selectUserLogin$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          _context10.next = 2;
          return regeneratorRuntime.awrap(db.query("SELECT * FROM users WHERE username = :username && password = :password", {
            replacements: {
              username: username,
              password: password
            },
            type: QueryTypes.SELECT
          }));

        case 2:
          user = _context10.sent;
          admin = user[0].admin;
          userId = user[0].user_id;
          res.status(200).json(jwt.sign({
            username: username,
            admin: admin,
            userId: userId
          }, authorizationPassword));

        case 6:
        case "end":
          return _context10.stop();
      }
    }
  });
}

function getProducts(req, res) {
  var products;
  return regeneratorRuntime.async(function getProducts$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          _context11.next = 2;
          return regeneratorRuntime.awrap(db.query("SELECT * FROM products", {
            type: QueryTypes.SELECT
          }));

        case 2:
          products = _context11.sent;
          res.status(200).json(products);

        case 4:
        case "end":
          return _context11.stop();
      }
    }
  });
}

function createProduct(newProduct, req, res) {
  var inserted;
  return regeneratorRuntime.async(function createProduct$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          _context12.next = 2;
          return regeneratorRuntime.awrap(db.query("\n    INSERT INTO products (name, unit_price)\n    VALUES (:name, :price)\n    ", {
            replacements: newProduct,
            type: QueryTypes.INSERT
          }));

        case 2:
          inserted = _context12.sent;
          res.status(201).json(Object.assign({}, {
            productId: inserted[0]
          }, newProduct));

        case 4:
        case "end":
          return _context12.stop();
      }
    }
  });
}

function modifyProduct(productId, req, res) {
  var product, newProduct, modified;
  return regeneratorRuntime.async(function modifyProduct$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          _context13.next = 2;
          return regeneratorRuntime.awrap(db.query("SELECT * FROM products WHERE product_id = ?", {
            replacements: [productId],
            type: QueryTypes.SELECT
          }));

        case 2:
          product = _context13.sent;
          newProduct = {
            productId: productId,
            name: req.body.name || product[0].name,
            price: req.body.price || product[0].unit_price
          };
          _context13.next = 6;
          return regeneratorRuntime.awrap(db.query("\n    UPDATE products SET name = :name, unit_price = :price WHERE product_id = :productId\n    ", {
            replacements: newProduct,
            type: QueryTypes.UPDATE
          }));

        case 6:
          modified = _context13.sent;
          res.status(200).json(newProduct);

        case 8:
        case "end":
          return _context13.stop();
      }
    }
  });
}

function deleteProduct(productId, req, res) {
  var product, deleted;
  return regeneratorRuntime.async(function deleteProduct$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          _context14.next = 2;
          return regeneratorRuntime.awrap(db.query("SELECT * FROM products WHERE product_id = ?", {
            replacements: [productId],
            type: QueryTypes.SELECT
          }));

        case 2:
          product = _context14.sent;
          _context14.next = 5;
          return regeneratorRuntime.awrap(db.query("DELETE FROM products WHERE product_id = ?", {
            replacements: [productId],
            type: QueryTypes.DELETE
          }));

        case 5:
          deleted = _context14.sent;
          res.status(200).json(product[0]);

        case 7:
        case "end":
          return _context14.stop();
      }
    }
  });
}

function getUsers(req, res) {
  var users;
  return regeneratorRuntime.async(function getUsers$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          _context15.next = 2;
          return regeneratorRuntime.awrap(db.query("\n    SELECT user_id, username, full_name, email, telephone, address, admin FROM users\n    ", {
            type: QueryTypes.SELECT
          }));

        case 2:
          users = _context15.sent;
          res.status(200).json(users);

        case 4:
        case "end":
          return _context15.stop();
      }
    }
  });
}

function getUser(userId, req, res) {
  var user;
  return regeneratorRuntime.async(function getUser$(_context16) {
    while (1) {
      switch (_context16.prev = _context16.next) {
        case 0:
          _context16.next = 2;
          return regeneratorRuntime.awrap(db.query("\n    SELECT user_id, username, full_name, email, telephone, address, admin FROM users WHERE user_id = ?\n    ", {
            replacements: [userId],
            type: QueryTypes.SELECT
          }));

        case 2:
          user = _context16.sent;
          res.status(200).json(user[0]);

        case 4:
        case "end":
          return _context16.stop();
      }
    }
  });
}

function modifyUser(userId, req, res) {
  var user, password, newUser, modified;
  return regeneratorRuntime.async(function modifyUser$(_context17) {
    while (1) {
      switch (_context17.prev = _context17.next) {
        case 0:
          _context17.next = 2;
          return regeneratorRuntime.awrap(db.query("SELECT * FROM users WHERE user_id = ?", {
            replacements: [userId],
            type: QueryTypes.SELECT
          }));

        case 2:
          user = _context17.sent;
          password = req.body.password || user[0].password;
          newUser = {
            userId: userId,
            username: user[0].username,
            fullName: req.body.fullName || user[0].full_name,
            email: req.body.email || user[0].email,
            telephone: req.body.telephone || user[0].telephone,
            address: req.body.address || user[0].address,
            admin: user[0].admin
          };
          _context17.next = 7;
          return regeneratorRuntime.awrap(db.query("\n    UPDATE users SET username = :username, full_name = :fullName, email = :email, \n    telephone = :telephone, address = :address, password = :password\n    WHERE user_id = :userId\n    ", {
            replacements: Object.assign({}, newUser, {
              password: password
            }),
            type: QueryTypes.UPDATE
          }));

        case 7:
          modified = _context17.sent;
          res.status(200).json(newUser);

        case 9:
        case "end":
          return _context17.stop();
      }
    }
  });
}

function deleteUser(userId, req, res) {
  var user, deleted, _user$, user_id, username, full_name, email, telephone, address, admin;

  return regeneratorRuntime.async(function deleteUser$(_context18) {
    while (1) {
      switch (_context18.prev = _context18.next) {
        case 0:
          _context18.next = 2;
          return regeneratorRuntime.awrap(db.query("SELECT * FROM users WHERE user_id = ?", {
            replacements: [userId],
            type: QueryTypes.SELECT
          }));

        case 2:
          user = _context18.sent;
          _context18.next = 5;
          return regeneratorRuntime.awrap(db.query("DELETE FROM users WHERE user_id = ?", {
            replacements: [userId],
            type: QueryTypes.DELETE
          }));

        case 5:
          deleted = _context18.sent;
          _user$ = user[0], user_id = _user$.user_id, username = _user$.username, full_name = _user$.full_name, email = _user$.email, telephone = _user$.telephone, address = _user$.address, admin = _user$.admin;
          res.status(200).json({
            user_id: user_id,
            username: username,
            full_name: full_name,
            email: email,
            telephone: telephone,
            address: address,
            admin: admin
          });

        case 8:
        case "end":
          return _context18.stop();
      }
    }
  });
}

function getOrdersUser(userId, req, res) {
  var orders, users, products, total, ordersAndProducts;
  return regeneratorRuntime.async(function getOrdersUser$(_context19) {
    while (1) {
      switch (_context19.prev = _context19.next) {
        case 0:
          _context19.next = 2;
          return regeneratorRuntime.awrap(db.query("SELECT * FROM orders WHERE user_id = ?", {
            replacements: [userId],
            type: QueryTypes.SELECT
          }));

        case 2:
          orders = _context19.sent;
          _context19.next = 5;
          return regeneratorRuntime.awrap(db.query("SELECT user_id, username, full_name, email, telephone, address, admin FROM users", {
            type: QueryTypes.SELECT
          }));

        case 5:
          users = _context19.sent;
          _context19.next = 8;
          return regeneratorRuntime.awrap(db.query("SELECT *, op.quantity * p.unit_price AS subtotal FROM orders_products op \n    INNER JOIN products p ON op.product_id = p.product_id", {
            type: QueryTypes.SELECT
          }));

        case 8:
          products = _context19.sent;
          _context19.next = 11;
          return regeneratorRuntime.awrap(db.query("SELECT op.order_id, SUM(op.quantity * p.unit_price) AS total \n    FROM orders_products op inner join orders o on o.order_id = op.order_id inner join products p \n    on p.product_id = op.product_id GROUP BY op.order_id", {
            type: QueryTypes.SELECT
          }));

        case 11:
          total = _context19.sent;
          ordersAndProducts = orders.map(function (order) {
            return Object.assign({}, order, {
              products: products.filter(function (product) {
                return product.order_id === order.order_id;
              })
            }, {
              total: +total.filter(function (row) {
                return row.order_id === order.order_id;
              })[0].total
            }, {
              user: users.filter(function (user) {
                return user.user_id === order.user_id;
              })[0]
            });
          });
          res.status(200).json(ordersAndProducts);

        case 14:
        case "end":
          return _context19.stop();
      }
    }
  });
}

function getOrders(req, res) {
  var orders, users, products, total, ordersAndProducts;
  return regeneratorRuntime.async(function getOrders$(_context20) {
    while (1) {
      switch (_context20.prev = _context20.next) {
        case 0:
          _context20.next = 2;
          return regeneratorRuntime.awrap(db.query("SELECT order_id, status, time, payment_method, o.user_id\n    FROM orders o INNER JOIN users u ON o.user_id = u.user_id", {
            type: QueryTypes.SELECT
          }));

        case 2:
          orders = _context20.sent;
          _context20.next = 5;
          return regeneratorRuntime.awrap(db.query("SELECT user_id, username, full_name, email, telephone, address, admin FROM users", {
            type: QueryTypes.SELECT
          }));

        case 5:
          users = _context20.sent;
          _context20.next = 8;
          return regeneratorRuntime.awrap(db.query("SELECT *, op.quantity * p.unit_price AS subtotal FROM orders_products op \n    INNER JOIN products p ON op.product_id = p.product_id", {
            type: QueryTypes.SELECT
          }));

        case 8:
          products = _context20.sent;
          _context20.next = 11;
          return regeneratorRuntime.awrap(db.query("SELECT op.order_id, SUM(op.quantity * p.unit_price) AS total \n    FROM orders_products op inner join orders o on o.order_id = op.order_id inner join products p \n    on p.product_id = op.product_id GROUP BY op.order_id", {
            type: QueryTypes.SELECT
          }));

        case 11:
          total = _context20.sent;
          ordersAndProducts = orders.map(function (order) {
            return Object.assign({}, order, {
              products: products.filter(function (product) {
                return product.order_id === order.order_id;
              })
            }, {
              total: +total.filter(function (row) {
                return row.order_id === order.order_id;
              })[0].total
            }, {
              user: users.filter(function (user) {
                return user.user_id === order.user_id;
              })[0]
            });
          });
          res.status(200).json(ordersAndProducts);

        case 14:
        case "end":
          return _context20.stop();
      }
    }
  });
}

function createOrder(newOrder, req, res) {
  var orderInserted, user;
  return regeneratorRuntime.async(function createOrder$(_context22) {
    while (1) {
      switch (_context22.prev = _context22.next) {
        case 0:
          _context22.next = 2;
          return regeneratorRuntime.awrap(db.query("\n    INSERT INTO orders (status, time, payment_method, user_id)\n    VALUES (:status, :time, :paymentMethod, :userId)\n    ", {
            replacements: newOrder,
            type: QueryTypes.INSERT
          }));

        case 2:
          orderInserted = _context22.sent;
          req.body.products.forEach(function _callee(product) {
            return regeneratorRuntime.async(function _callee$(_context21) {
              while (1) {
                switch (_context21.prev = _context21.next) {
                  case 0:
                    _context21.next = 2;
                    return regeneratorRuntime.awrap(db.query("\n        INSERT INTO orders_products (order_id, product_id, quantity)\n        VALUES (".concat(orderInserted[0], ", ").concat(product.productId, ", ").concat(product.quantity, ")\n        "), {
                      replacements: req.body.products,
                      type: QueryTypes.INSERT
                    }));

                  case 2:
                    return _context21.abrupt("return", _context21.sent);

                  case 3:
                  case "end":
                    return _context21.stop();
                }
              }
            });
          });
          _context22.next = 6;
          return regeneratorRuntime.awrap(db.query("\n    SELECT user_id, username, full_name, email, telephone, address, admin FROM users WHERE user_id = ?\n    ", {
            replacements: [jwt.verify(req.headers.authorization.split(' ')[1], authorizationPassword).userId],
            type: QueryTypes.SELECT
          }));

        case 6:
          user = _context22.sent;
          res.status(201).json(Object.assign({}, {
            orderId: orderInserted[0]
          }, newOrder, {
            user: user[0]
          }));

        case 8:
        case "end":
          return _context22.stop();
      }
    }
  });
}

function modifyStatus(orderId, req, res) {
  var order, newOrder, modified;
  return regeneratorRuntime.async(function modifyStatus$(_context23) {
    while (1) {
      switch (_context23.prev = _context23.next) {
        case 0:
          _context23.next = 2;
          return regeneratorRuntime.awrap(db.query("SELECT * FROM orders WHERE order_id = ?", {
            replacements: [orderId],
            type: QueryTypes.SELECT
          }));

        case 2:
          order = _context23.sent;
          newOrder = {
            orderId: orderId,
            status: req.body.status || order[0].status,
            time: order[0].time,
            paymentMethod: order[0].payment_method,
            userId: order[0].user_id
          };
          _context23.next = 6;
          return regeneratorRuntime.awrap(db.query("UPDATE orders SET status = :status WHERE order_id = :orderId", {
            replacements: newOrder,
            type: QueryTypes.UPDATE
          }));

        case 6:
          modified = _context23.sent;
          res.status(200).json(newOrder);

        case 8:
        case "end":
          return _context23.stop();
      }
    }
  });
}

function deleteOrder(orderId, req, res) {
  var order, deleted;
  return regeneratorRuntime.async(function deleteOrder$(_context24) {
    while (1) {
      switch (_context24.prev = _context24.next) {
        case 0:
          _context24.next = 2;
          return regeneratorRuntime.awrap(db.query("SELECT * FROM orders WHERE order_id = ?", {
            replacements: [orderId],
            type: QueryTypes.SELECT
          }));

        case 2:
          order = _context24.sent;
          _context24.next = 5;
          return regeneratorRuntime.awrap(db.query("DELETE FROM orders WHERE order_id = ?", {
            replacements: [orderId],
            type: QueryTypes.DELETE
          }));

        case 5:
          deleted = _context24.sent;
          res.status(200).json(order[0]);

        case 7:
        case "end":
          return _context24.stop();
      }
    }
  });
}

module.exports = {
  validateProductNameQuery: validateProductNameQuery,
  validateProductIdQuery: validateProductIdQuery,
  validateDetailsQuery: validateDetailsQuery,
  validateNewOrderQuery: validateNewOrderQuery,
  validateOrderIdQuery: validateOrderIdQuery,
  validateUsernameQuery: validateUsernameQuery,
  validateLoginQuery: validateLoginQuery,
  validateUserIdQuery: validateUserIdQuery,
  createUser: createUser,
  selectUserLogin: selectUserLogin,
  getProducts: getProducts,
  createProduct: createProduct,
  modifyProduct: modifyProduct,
  deleteProduct: deleteProduct,
  getUsers: getUsers,
  getUser: getUser,
  modifyUser: modifyUser,
  deleteUser: deleteUser,
  getOrdersUser: getOrdersUser,
  getOrders: getOrders,
  createOrder: createOrder,
  modifyStatus: modifyStatus,
  deleteOrder: deleteOrder
};