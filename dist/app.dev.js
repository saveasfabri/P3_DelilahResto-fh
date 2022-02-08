"use strict";

var express = require('express');

var app = express();

var jwt = require('jsonwebtoken');

var _require = require('./functions.js'),
    verifyToken = _require.verifyToken,
    filterAdmin = _require.filterAdmin,
    validateProductName = _require.validateProductName,
    validateProductPrice = _require.validateProductPrice,
    validateProductNamePut = _require.validateProductNamePut,
    validateProductId = _require.validateProductId,
    validateDetails = _require.validateDetails,
    validateNewOrder = _require.validateNewOrder,
    validateOrderId = _require.validateOrderId,
    validateStatus = _require.validateStatus,
    validateUsername = _require.validateUsername,
    validateFullName = _require.validateFullName,
    validateFullNamePut = _require.validateFullNamePut,
    validateEmail = _require.validateEmail,
    validateEmailPut = _require.validateEmailPut,
    validateTelephone = _require.validateTelephone,
    validateTelephonePut = _require.validateTelephonePut,
    validateAddress = _require.validateAddress,
    validateAddressPut = _require.validateAddressPut,
    validatePassword = _require.validatePassword,
    validatePasswordPut = _require.validatePasswordPut,
    validateLogin = _require.validateLogin,
    validateUser = _require.validateUser,
    validateUserId = _require.validateUserId;

var _require2 = require('./queries.js'),
    createUser = _require2.createUser,
    selectUserLogin = _require2.selectUserLogin,
    getProducts = _require2.getProducts,
    createProduct = _require2.createProduct,
    modifyProduct = _require2.modifyProduct,
    deleteProduct = _require2.deleteProduct,
    getUsers = _require2.getUsers,
    getUser = _require2.getUser,
    modifyUser = _require2.modifyUser,
    deleteUser = _require2.deleteUser,
    getOrdersUser = _require2.getOrdersUser,
    getOrders = _require2.getOrders,
    createOrder = _require2.createOrder,
    modifyStatus = _require2.modifyStatus,
    deleteOrder = _require2.deleteOrder;

app.use(express.json());
app.listen(process.env.PORT || 3000, function () {
  return console.log('server started');
});
var authorizationPassword = 'cd7aPOdZW!n!'; //register and login

app.post('/users/register', validateUsername, validateFullName, validateEmail, validateTelephone, validateAddress, validatePassword, function _callee(req, res) {
  var newUser;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          newUser = {
            username: req.body.username,
            fullName: req.body.fullName,
            email: req.body.email,
            telephone: +req.body.telephone,
            address: req.body.address,
            password: req.body.password
          };
          createUser(newUser, req, res);

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
});
app.post('/users/login', validateLogin, function _callee2(req, res) {
  var _req$body, username, password;

  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _req$body = req.body, username = _req$body.username, password = _req$body.password;
          selectUserLogin(username, password, req, res);

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
});
app.use(verifyToken); //products

app.get('/products', function _callee3(req, res) {
  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          getProducts(req, res);

        case 1:
        case "end":
          return _context3.stop();
      }
    }
  });
});
app.post('/products', filterAdmin, validateProductName, validateProductPrice, function _callee4(req, res) {
  var newProduct;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          newProduct = {
            name: req.body.name,
            price: req.body.price
          };
          createProduct(newProduct, req, res);

        case 2:
        case "end":
          return _context4.stop();
      }
    }
  });
});
app.put('/products/:productId', filterAdmin, validateProductId, validateProductNamePut, function _callee5(req, res) {
  var productId;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          productId = +req.params.productId;
          modifyProduct(productId, req, res);

        case 2:
        case "end":
          return _context5.stop();
      }
    }
  });
});
app["delete"]('/products/:productId', filterAdmin, validateProductId, validateDetails, function _callee6(req, res) {
  var productId;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          productId = +req.params.productId;
          deleteProduct(productId, req, res);

        case 2:
        case "end":
          return _context6.stop();
      }
    }
  });
}); //users

app.get('/users', filterAdmin, function _callee7(req, res) {
  return regeneratorRuntime.async(function _callee7$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          getUsers(req, res);

        case 1:
        case "end":
          return _context7.stop();
      }
    }
  });
});
app.get('/users/:userId', validateUser, validateUserId, function _callee8(req, res) {
  var userId;
  return regeneratorRuntime.async(function _callee8$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          userId = +req.params.userId;
          getUser(userId, req, res);

        case 2:
        case "end":
          return _context8.stop();
      }
    }
  });
});
app.put('/users/:userId', validateUser, validateUserId, validateFullNamePut, validateEmailPut, validateTelephonePut, validateAddressPut, validatePasswordPut, function _callee9(req, res) {
  var userId;
  return regeneratorRuntime.async(function _callee9$(_context9) {
    while (1) {
      switch (_context9.prev = _context9.next) {
        case 0:
          userId = +req.params.userId;
          modifyUser(userId, req, res);

        case 2:
        case "end":
          return _context9.stop();
      }
    }
  });
});
app["delete"]('/users/:userId', validateUser, validateUserId, function _callee10(req, res) {
  var userId;
  return regeneratorRuntime.async(function _callee10$(_context10) {
    while (1) {
      switch (_context10.prev = _context10.next) {
        case 0:
          userId = +req.params.userId;
          deleteUser(userId, req, res);

        case 2:
        case "end":
          return _context10.stop();
      }
    }
  });
});
app.get('/users/:userId/orders', validateUser, validateUserId, function _callee11(req, res) {
  var userId;
  return regeneratorRuntime.async(function _callee11$(_context11) {
    while (1) {
      switch (_context11.prev = _context11.next) {
        case 0:
          userId = +req.params.userId;
          getOrdersUser(userId, req, res);

        case 2:
        case "end":
          return _context11.stop();
      }
    }
  });
}); //orders

app.get('/orders', filterAdmin, function _callee12(req, res) {
  return regeneratorRuntime.async(function _callee12$(_context12) {
    while (1) {
      switch (_context12.prev = _context12.next) {
        case 0:
          getOrders(req, res);

        case 1:
        case "end":
          return _context12.stop();
      }
    }
  });
});
app.post('/orders', validateNewOrder, function _callee13(req, res) {
  var now, newOrder;
  return regeneratorRuntime.async(function _callee13$(_context13) {
    while (1) {
      switch (_context13.prev = _context13.next) {
        case 0:
          now = new Date();
          newOrder = {
            status: "nuevo",
            time: now,
            paymentMethod: req.body.paymentMethod,
            userId: jwt.verify(req.headers.authorization.split(' ')[1], authorizationPassword).userId,
            products: req.body.products
          };
          createOrder(newOrder, req, res);

        case 3:
        case "end":
          return _context13.stop();
      }
    }
  });
});
app.put('/orders/:orderId', filterAdmin, validateOrderId, validateStatus, function _callee14(req, res) {
  var orderId;
  return regeneratorRuntime.async(function _callee14$(_context14) {
    while (1) {
      switch (_context14.prev = _context14.next) {
        case 0:
          orderId = +req.params.orderId;
          modifyStatus(orderId, req, res);

        case 2:
        case "end":
          return _context14.stop();
      }
    }
  });
});
app["delete"]('/orders/:orderId', filterAdmin, validateOrderId, function _callee15(req, res) {
  var orderId;
  return regeneratorRuntime.async(function _callee15$(_context15) {
    while (1) {
      switch (_context15.prev = _context15.next) {
        case 0:
          orderId = +req.params.orderId;
          deleteOrder(orderId, req, res);

        case 2:
        case "end":
          return _context15.stop();
      }
    }
  });
});