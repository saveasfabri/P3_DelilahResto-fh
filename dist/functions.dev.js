"use strict";

var jwt = require('jsonwebtoken');

var _require = require('./queries.js'),
    validateProductNameQuery = _require.validateProductNameQuery,
    validateProductIdQuery = _require.validateProductIdQuery,
    validateDetailsQuery = _require.validateDetailsQuery,
    validateNewOrderQuery = _require.validateNewOrderQuery,
    validateOrderIdQuery = _require.validateOrderIdQuery,
    validateUsernameQuery = _require.validateUsernameQuery,
    validateLoginQuery = _require.validateLoginQuery,
    validateUserIdQuery = _require.validateUserIdQuery;

var authorizationPassword = 'cd7aPOdZW!n!';

function verifyToken(req, res, next) {
  var fullToken = req.headers.authorization || "0.0.0";
  var token = fullToken.split(' ')[1];

  try {
    jwt.verify(token, authorizationPassword);
    next();
  } catch (error) {
    res.status(401).send(error);
  }
}

function filterAdmin(req, res, next) {
  var token = req.headers.authorization.split(' ')[1];
  var user = jwt.verify(token, authorizationPassword);

  if (user.admin) {
    next();
  } else {
    res.status(403).send("You do not have administrator permissions").end();
  }
}

var validateProductName = function validateProductName(req, res, next) {
  var pName = req.body.name;
  if (pName.length > 1 && pName.length < 65) next();else res.status(400).send("The product name is wrong").end();
};

var validateProductPrice = function validateProductPrice(req, res, next) {
  var price = req.body.price;

  if (typeof price === "number") {
    if (Math.trunc(price) < 10000 && Math.trunc(price) > 0) next();else res.status(400).send("The price is wrong").end();
  } else {
    res.status(400).send("The price is not a number").end();
  }
};

function validateProductNamePut(req, res, next) {
  return regeneratorRuntime.async(function validateProductNamePut$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.next = 2;
          return regeneratorRuntime.awrap(validateProductNameQuery(req, res, next));

        case 2:
        case "end":
          return _context.stop();
      }
    }
  });
}

function validateProductId(req, res, next) {
  return regeneratorRuntime.async(function validateProductId$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(validateProductIdQuery(req, res, next));

        case 2:
        case "end":
          return _context2.stop();
      }
    }
  });
}

function validateDetails(req, res, next) {
  return regeneratorRuntime.async(function validateDetails$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          _context3.next = 2;
          return regeneratorRuntime.awrap(validateDetailsQuery(req, res, next));

        case 2:
        case "end":
          return _context3.stop();
      }
    }
  });
}

function validateNewOrder(req, res, next) {
  return regeneratorRuntime.async(function validateNewOrder$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.next = 2;
          return regeneratorRuntime.awrap(validateNewOrderQuery(req, res, next));

        case 2:
        case "end":
          return _context4.stop();
      }
    }
  });
}

function validateOrderId(req, res, next) {
  return regeneratorRuntime.async(function validateOrderId$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.next = 2;
          return regeneratorRuntime.awrap(validateOrderIdQuery(req, res, next));

        case 2:
        case "end":
          return _context5.stop();
      }
    }
  });
}

function validateStatus(req, res, next) {
  var status = req.body.status;
  if (["nuevo", "confirmado", "preparando", "enviando", "cancelado", "entregado"].includes(status)) next();else res.status(400).send("The status is wrong").end();
}

function validateUsername(req, res, next) {
  return regeneratorRuntime.async(function validateUsername$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.next = 2;
          return regeneratorRuntime.awrap(validateUsernameQuery(req, res, next));

        case 2:
        case "end":
          return _context6.stop();
      }
    }
  });
}

function validateFullName(req, res, next) {
  var newFullName = req.body.fullName;

  if (newFullName) {
    if (newFullName.length >= 3 && newFullName.length <= 64) next();else res.status(400).send("The full name length is wrong").end();
  } else res.status(400).send("The full name is wrong").end();
}

function validateFullNamePut(req, res, next) {
  if (req.body.fullName) {
    if (req.body.fullName.length >= 3 && req.body.fullName.length <= 64) next();else res.status(400).send("The full name length is wrong").end();
  } else next();
}

function validateEmail(req, res, next) {
  var email = req.body.email;
  if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(email)) next();else res.status(400).send("The email is wrong").end();
}

function validateEmailPut(req, res, next) {
  if (req.body.email) {
    if (/^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i.test(req.body.email)) next();else res.status(400).send("The email is wrong").end();
  } else next();
}

function validateTelephone(req, res, next) {
  var telephone = req.body.telephone;
  if (Number.isInteger(telephone) && telephone >= 100000000 && telephone <= 9999999999999) next();else res.status(400).send("The telephone is wrong").end();
}

function validateTelephonePut(req, res, next) {
  if (req.body.telephone) {
    if (Number.isInteger(req.body.telephone) && req.body.telephone >= 100000000 && req.body.telephone <= 9999999999999) next();else res.status(400).send("The telephone is wrong").end();
  } else next();
}

function validateAddress(req, res, next) {
  var address = req.body.address;
  if (address.length >= 3 && address.length <= 64) next();else res.status(400).send("The address is wrong").end();
}

function validateAddressPut(req, res, next) {
  if (req.body.address) {
    if (req.body.address.length >= 3 && req.body.address.length <= 64) next();else res.status(400).send("The address is wrong").end();
  } else next();
}

function validatePassword(req, res, next) {
  var password = req.body.password;
  if (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*?&#.$($)$-$_]{4,15}$/.test(password)) next();else res.status(400).send("The password is wrong").end();
} // Minimum 4 characters
// Maximum 15 characters
// At least 1 character
// At least 1 digit
// No blank spaces


function validatePasswordPut(req, res, next) {
  if (req.body.password) {
    if (/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d$@$!%*?&#.$($)$-$_]{4,15}$/.test(req.body.password)) next();else res.status(400).send("The password is wrong").end();
  } else next();
}

function validateLogin(req, res, next) {
  return regeneratorRuntime.async(function validateLogin$(_context7) {
    while (1) {
      switch (_context7.prev = _context7.next) {
        case 0:
          _context7.next = 2;
          return regeneratorRuntime.awrap(validateLoginQuery(req, res, next));

        case 2:
        case "end":
          return _context7.stop();
      }
    }
  });
}

function validateUser(req, res, next) {
  var userId = +req.params.userId;
  var token = jwt.verify(req.headers.authorization.split(' ')[1], authorizationPassword);
  if (token.userId === userId || token.admin === 1) next();else res.status(401).send("You do not have enough permissions").end();
}

function validateUserId(req, res, next) {
  return regeneratorRuntime.async(function validateUserId$(_context8) {
    while (1) {
      switch (_context8.prev = _context8.next) {
        case 0:
          _context8.next = 2;
          return regeneratorRuntime.awrap(validateUserIdQuery(req, res, next));

        case 2:
        case "end":
          return _context8.stop();
      }
    }
  });
}

module.exports = {
  verifyToken: verifyToken,
  filterAdmin: filterAdmin,
  validateProductName: validateProductName,
  validateProductPrice: validateProductPrice,
  validateProductNamePut: validateProductNamePut,
  validateProductId: validateProductId,
  validateDetails: validateDetails,
  validateNewOrder: validateNewOrder,
  validateOrderId: validateOrderId,
  validateStatus: validateStatus,
  validateUsername: validateUsername,
  validateFullName: validateFullName,
  validateFullNamePut: validateFullNamePut,
  validateEmail: validateEmail,
  validateEmailPut: validateEmailPut,
  validateTelephone: validateTelephone,
  validateTelephonePut: validateTelephonePut,
  validateAddress: validateAddress,
  validateAddressPut: validateAddressPut,
  validatePassword: validatePassword,
  validatePasswordPut: validatePasswordPut,
  validateLogin: validateLogin,
  validateUser: validateUser,
  validateUserId: validateUserId
};