const db = require('../../db/db.js');

const custController = {};

// new customer signs up
custController.createUser = async (req, res, next) => {
  const {
    first_name,
    last_name,
    email,
    password,
    address_number,
    address_street,
    address_zip,
  } = req.body;

  const queryParams = [
    first_name,
    last_name,
    email,
    password,
    address_number,
    address_street,
    address_zip,
  ];
  const signUp = `INSERT INTO customers (id, first_name, last_name, email, password, address_number, address_street, address_zip)
  VALUES (nextval('cust_sequence'), $1, $2, $3, $4, $5, $6, $7) RETURNING id`;

  try {
    const data = await db.query(signUp, queryParams);

    res.locals.userId = data.rows[0];

    return next();
  } catch (err) {
    next({
      log: `custController.createUser: ERROR: Error creating new user.`,
      message: {
        err:
          'Error occurred in custController.createUser. Check server logs for more details.',
      },
    });
  }
};

// customer signs in and cart loads 'get' request
custController.verifyCust = async (req, res, next) => {
  const { email, password } = req.body;

  const queryParams = [email];

  const allCusts = `SELECT * FROM customers WHERE email=$1`;

  try {
    const data = await db.query(allCusts, queryParams);
    if (data.rows[0].password === password) {
      res.locals.isVerified = true;
      res.locals.custInfo = data.rows;
    } else {
      res.locals.isVerified = false;
    }
    return next();
  } catch (err) {
    next({
      log: `custController.verifyCust: ERROR: Error getting the customer's information from the database.`,
      message: {
        err:
          'Error occurred in custController.verifyCust. Check server logs for more details.',
      },
    });
  }
};

module.exports = custController;
