const { Router } = require("express");
const database = require("../lib/db/database");
const { send } = require("process");
const { compare, hash } = require("bcrypt");
const body_parser = require('body-parser');

const router = Router();
router.use(body_parser);
router.get("/orders/:email", (req, res) => {
  database.query(
    `SELECT * FROM orders WHERE client_email = '${req.params.email}';`,
    (err, rows) => {
      if (err) res.sendStatus(401);
      else res.status(200).send(rows);
    }
  );
});
router.get("/order/:email", (req, res) => {
  database.query(
    `SELECT * FROM orders WHERE client_email = '${req.params.email}' AND epoch = '${req.params.secret}';`,
    (err, rows) => {
      if (err) res.sendStatus(401);
      else res.status(200).send(rows[0]);
    }
  );
});
router.post("/admin/login", (req, res) => {
  database.query(
    `SELECT * FROM admins WHERE admin_email = '${req.body.email}';`,
    (err, rows) => {
      if (err) res.sendStatus(404);
      else {
        compare(
          req.body.admin_password,
          Buffer.from(rows[0].admin_password, "binary").toString("utf-8"),
          (err, same) => {
            if (err) throw err;
            if (same) {
              res.status(200).send(true);
            } else {
              res.status(401).send(false);
            }
          }
        );
      }
    }
  );
});
router.post("/admin", (req, res) => {
  hash(req.body.password, 10, (err, hash) => {
    if (err) res.sendStatus(500);
    database.query(
      `INSERT INTO admins (admin_email, admin_password) VALUES ( '${req.body.email}', '${hash}' )`,
      (err, rows) => {
        if (err) res.sendStatus(500);
        else res.status(200).send(true);
      }
    );
  });
});
router.get("/menu", (req, res) => {
  database.query(`SELECT * FROM menu NATURAL JOIN courses;`, (err, rows) => {
    if (err) res.sendStatus(401);
    else res.status(200).send(rows);
  });
});
router.get("/orders/unset", (req, res) => {
  database.query("SELECT * FROM orders WHERE confirmed = 0;", (err, rows) => {
    if (err) res.sendStatus(500);
    else res.status(200).send(rows);
  });
});
router.get("/orders/set", (req, res) => {
  database.query("SELECT * FROM orders WHERE confirmed = 1;", (err, rows) => {
    if (err) res.sendStatus(500);
    else res.status(200).send(rows);
  });
});
router.post("/order", (req, res) => {
  database.query(
    `INSERT INTO orders (order, epoch, client_email) VALUES ('${
      req.body.order
    }', '${new Date().getTime()}', '${req.body.email}');`,
    (err, rows) => {
      if (err) send.sendStatus(400);
      else res.status(200).send(true);
    }
  );
});
router.put("/order/:id", (req, res) => {
  database.query(
    `UPDATE orders SET confirmed = 1 WHERE order_id = ${req.params.id};`,
    (err, rows) => {
      if (err) send.sendStatus(400);
      else res.status(200).send(true);
    }
  );
});
router.put("/order/change/:id", (req, res) => {
  database.query(
    `UPDATE orders SET order = '${req.body.order}' WHERE order_id = ${req.params.id};`,
    (err, rows) => {
      if (err) send.sendStatus(400);
      else res.status(200).send(true);
    }
  );
});

module.exports = router;
