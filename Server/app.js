const express = require("express");
const app = express();
const cookie_parser = require("cookie-parser");
const cors = require("cors");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 8000;
const pool = require("./connection");
const jwt = require("jsonwebtoken");
const authenticateToken = require("./middleware/authentication");
app.use(express.json());
app.use(cookie_parser());
app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
dotenv.config();
app.listen(PORT, () => {
  console.log("Server running successfully");
});

app.post("/signup", async (req, res) => {
  try {
    const { email, firstName, lastName, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const queryText =
      "INSERT INTO users (email, firstname, lastname, password) VALUES ($1, $2, $3, $4)";
    const values = [email, firstName, lastName, hashedPassword];
    const result = await pool.query(queryText, values);
    if (result.rowCount === 1) {
      res.status(200).json({ message: "Data inserted successfully" });
    } else {
      res.status(400).json({ error: "Account creation failed" });
    }
  } catch (error) {
    if (error.constraint === "users_pkey") {
      res.status(400).json({ error: "Email address already exists " });
    } else {
      console.error("Error inserting data:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});

app.post("/login", async (req, res) => {
  let { email, password } = req.body;
  try {
    const queryText = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(queryText, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    const user = result.rows[0];
    const isPasswordMatch = await bcrypt.compare(password, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }
    let jwtSecretKey = process.env.JWT_SECRET_KEY;
    let data = {
      email: email,
    };
    const token = jwt.sign(data, jwtSecretKey);
    res
      .status(200)
      .cookie("token", token, { httpOnly: true })
      .json({
        message: "Login successful",
        data: {
          email: email,
          firstName: result.rows[0].firstname,
          lastName: result.rows[0].lastname,
          token: token,
        },
      });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.delete("/logout", authenticateToken, async (req, res) => {
  try {
    res.status(200).clearCookie("token").send("Logout Successful");
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.get("/orders/:email", authenticateToken, async (req, res) => {
  const userId = req.params.email;
  try {
    const ordersQuery = `
    SELECT o.order_id, 
           o.price,
           JSON_AGG(json_build_object(
             'item_id', oi.item_id,
             'quantity', oi.quantity,
             'status', oi.status
           )) AS order_items
    FROM Orders o
    JOIN orderItems oi ON o.order_id = oi.order_id
    WHERE o.user_id = $1
    GROUP BY o.order_id, o.price;
  `;
    const { rows } = await pool.query(ordersQuery, [userId]);
    const orders = rows.map((row) => ({
      order_id: row.order_id,
      price: row.price,
      order_items: row.order_items,
    }));
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/cart", authenticateToken, async (req, res) => {
  const { product_id, quantity, price, user_id } = req.body;
  try {
    const items = await pool.query(
      "SELECT product_id, quantity, price FROM cart where user_id=$1 AND product_id=$2",
      [user_id, product_id]
    );
    let result = [];
    if (items.rows.length > 0) {
      let updatedPrice =
        items.rows[0].price * (items.rows[0].quantity + quantity);
      result = await pool.query(
        `UPDATE cart SET quantity=${items.rows[0].quantity}+${quantity}, price=${updatedPrice}  where user_id=$1 AND product_id=$2`,
        [user_id, product_id]
      );
    } else {
      result = await pool.query(
        "INSERT INTO cart(product_id, quantity, price, user_id) VALUES($1, $2, $3, $4)",
        [product_id, quantity, price, user_id]
      );
    }
    res.json(result.rowCount);
  } catch (error) {
    console.error("Error executing SQL query:", error);
    res.status(500).json({
      error: "An error occurred while inserting data into the cart table",
    });
  }
});

app.get("/cart/:user_id", authenticateToken, async (req, res) => {
  const user_id = req.params.user_id;
  try {
    const result = await pool.query(
      "SELECT product_id, quantity, price FROM cart where user_id=$1",
      [user_id]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).send({ message: "Failed! Internal error!" });
  }
});

app.put("/cart", authenticateToken, async (request, response) => {
  const user_id = request.body.user_id;
  const product_id = request.body.id;
  const quantity = request.body.quantity;
  try {
    let result = null;
    if (quantity > 0) {
      result = await pool.query(
        "UPDATE cart set quantity=$1 where user_id=$2 and product_id=$3",
        [quantity, user_id, product_id]
      );
    } else {
      result = await pool.query(
        "delete from cart where user_id=$1 and product_id=$2",
        [user_id, product_id]
      );
    }

    response.status(200).send({ data: "success!" });
  } catch (error) {
    response.status(500).send({ message: "Internal error" });
  }
});

app.post("/checkout", authenticateToken, async (req, res) => {
  const { cartItems, user_id, price } = req.body;
  try {
    const order = await pool.query(
      "INSERT INTO orders(user_id, price,status,order_date) VALUES($1, $2,$3,$4) RETURNING order_id,user_id",
      [user_id, price, "Ordered", new Date()]
    );
    if (order.rowCount >= 1) {
      var orderItems;
      for (let item of cartItems) {
        orderItems = await pool.query(
          "INSERT INTO orderitems(item_id, order_id, quantity,status)VALUES ($1, $2, $3,$4)",
          [item.id, order.rows[0].order_id, item.quantity, "Ordered"]
        );
      }
      if (orderItems.rowCount >= 1) {
        const result = await pool.query("delete from cart where user_id=$1", [
          user_id,
        ]);
        if (result.rowCount >= 1) {
          res.status(200).send("Success");
        }
      }
    }
  } catch (error) {
    res.status(500).send({ message: "Failed! Internal error!" });
  }
});
