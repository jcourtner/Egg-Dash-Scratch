const db = require('../../db/db.js');

const productsController = {};

productsController.getAllProducts = async (req, res, next) => {
  const getProducts = `SELECT * FROM products`;
  try {
    const data = await db.query(getProducts);
    res.locals.products = data.rows;
  } catch (err) {
    next({
      log: `productsController.createUser: ERROR: Error pulling data from the DB.`,
      message: {
        err:
          'Error occurred in productController.getAllProducts. Check server logs for more details.',
      },
    });
  }
};

module.exports = productsController;
