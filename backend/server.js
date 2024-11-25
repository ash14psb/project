const express = require("express");
const oracledb = require("oracledb");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Oracle Database connection configuration
const dbConfig = {
  user: "system",
  password: "0000",
  connectString: "localhost:1521/XE",
};

// ------------------------ USER AUTHENTICATION ------------------------

/**
 * Register a new user.
 */
app.post("/register", async (req, res) => {
  const { username, password, role } = req.body;
  try {
    const connection = await oracledb.getConnection(dbConfig);

    // Check if username already exists
    const checkUser = await connection.execute(
      `SELECT COUNT(*) AS COUNT FROM Users WHERE username = :username`,
      [username]
    );
    if (checkUser.rows[0][0] > 0) {
      return res.status(400).json({ error: "Username already exists!" });
    }

    // Insert the new user
    await connection.execute(
      `INSERT INTO Users (user_id, username, password, role) 
       VALUES (Users_seq.NEXTVAL, :username, :password, :role)`,
      [username, password, role],
      { autoCommit: true }
    );
    res.status(201).json({ message: "User registered successfully!" });
    await connection.close();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Login a user.
 */
app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const connection = await oracledb.getConnection(dbConfig);

    const result = await connection.execute(
      `SELECT * FROM Users WHERE username = :username AND password = :password`,
      [username, password]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials!" });
    }

    const user = {
      user_id: result.rows[0][0],
      username: result.rows[0][1],
      role: result.rows[0][3],
    };
    res.status(200).json({ message: "Login successful!", user });
    await connection.close();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------ TOURS MANAGEMENT ------------------------

/**
 * Get all tours.
 */
app.get("/tours", async (req, res) => {
  try {
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(`SELECT * FROM Tours`);
    res.json(
      result.rows.map((row) => ({
        tour_id: row[0],
        destination: row[1],
        description: row[2],
        price: row[3],
        available_slots: row[4],
        created_by: row[5],
      }))
    );
    await connection.close();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Add a new tour (Travel Agent or Admin only).
 */
app.post("/tours", async (req, res) => {
  const { destination, description, price, available_slots, created_by } =
    req.body;
  try {
    const connection = await oracledb.getConnection(dbConfig);

    await connection.execute(
      `INSERT INTO Tours (tour_id, destination, description, price, available_slots, created_by) 
       VALUES (Tours_seq.NEXTVAL, :destination, :description, :price, :available_slots, :created_by)`,
      [destination, description, price, available_slots, created_by],
      { autoCommit: true }
    );

    res.status(201).json({ message: "Tour added successfully!" });
    await connection.close();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Get details of a specific tour.
 */
app.get("/tours/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const connection = await oracledb.getConnection(dbConfig);
    const result = await connection.execute(
      `SELECT * FROM Tours WHERE tour_id = :id`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Tour not found!" });
    }

    const tour = {
      tour_id: result.rows[0][0],
      destination: result.rows[0][1],
      description: result.rows[0][2],
      price: result.rows[0][3],
      available_slots: result.rows[0][4],
      created_by: result.rows[0][5],
    };
    res.json(tour);
    await connection.close();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------ BOOKINGS MANAGEMENT ------------------------

/**
 * Book a tour.
 */
app.post("/bookings", async (req, res) => {
  const { user_id, tour_id } = req.body;
  try {
    const connection = await oracledb.getConnection(dbConfig);

    // Check availability
    const tourResult = await connection.execute(
      `SELECT available_slots FROM Tours WHERE tour_id = :tour_id`,
      [tour_id]
    );
    if (tourResult.rows.length === 0) {
      return res.status(404).json({ error: "Tour not found!" });
    }

    if (tourResult.rows[0][0] <= 0) {
      return res
        .status(400)
        .json({ error: "No slots available for this tour!" });
    }

    // Create a booking
    await connection.execute(
      `INSERT INTO Bookings (booking_id, user_id, tour_id) 
       VALUES (Bookings_seq.NEXTVAL, :user_id, :tour_id)`,
      [user_id, tour_id],
      { autoCommit: true }
    );

    // Decrement the available slots
    await connection.execute(
      `UPDATE Tours SET available_slots = available_slots - 1 WHERE tour_id = :tour_id`,
      [tour_id],
      { autoCommit: true }
    );

    res.status(201).json({ message: "Booking successful!" });
    await connection.close();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------ PAYMENTS MANAGEMENT ------------------------

/**
 * Make a payment for a booking.
 */
app.post("/payments", async (req, res) => {
  const { booking_id, amount } = req.body;
  try {
    const connection = await oracledb.getConnection(dbConfig);

    await connection.execute(
      `INSERT INTO Payments (payment_id, booking_id, amount) 
       VALUES (Payments_seq.NEXTVAL, :booking_id, :amount)`,
      [booking_id, amount],
      { autoCommit: true }
    );

    res.status(201).json({ message: "Payment successful!" });
    await connection.close();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ------------------------ START SERVER ------------------------

const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

app.get("/", (req, res) => {
  res.send("Welcome to the Tourism Management System API");
});
