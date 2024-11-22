const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const login = require("./routes/auth/login");
const register = require("./routes/auth/register");
const logout = require("./routes/auth/logout");
const me = require("./routes/auth/me");
const {
  getAllReviews,
  getReviewById,
} = require("./routes/reviews/get-reviews");
const createReview = require("./routes/reviews/create-reviews");
const updateReview = require("./routes/reviews/update-reviews");
const { deleteReview } = require("./routes/reviews/delete-reviews");

// create express app
const app = express();
// middlewares
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    credentials: true,
    optionsSuccessStatus: 200,
  })
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());

// routes
app.get("/", (_, res) => {
  res.redirect(process.env.CLIENT_URL);
});

// authenticate middleware
const authenticateToken = () => {
  return (req, res, next) => {
    const token = req.cookies?.access_token;
    if (token == null) return res.status(401).json({ message: "Unauthorized" });

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };
};

// optional authenticate middleware
const authenticateOptional = (req, res, next) => {
  const token = req.cookies?.access_token;
  if (token == null) return next();
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return next();
    req.user = user;
    next();
  });
};

/**
 * endpoints for users
 */

// login
app.post("/login", async (req, res) => {
  return await login(req, res);
});

// register
app.post("/register", async (req, res) => {
  return await register(req, res);
});

// logout
app.post("/logout", async (req, res) => {
  return await logout(req, res);
});

// get me
app.get("/me", authenticateToken(), async (req, res) => {
  return await me(req, res);
});

/**
 * endpoints for reviews
 */

// get all reviews
app.get("/reviews", authenticateOptional, async (req, res) => {
  return await getAllReviews(req, res);
});

// get review by id
app.get("/reviews/:id", authenticateOptional, async (req, res) => {
  return await getReviewById(req, res);
});

// create review
app.post("/reviews", authenticateToken(), async (req, res) => {
  return await createReview(req, res);
});

// update review
app.put("/reviews/:id", authenticateToken(), async (req, res) => {
  return await updateReview(req, res);
});

// delete review
app.delete("/reviews/:id", authenticateToken(), async (req, res) => {
  return await deleteReview(req, res);
});

// server run on port 8000 or env port
const port = process.env.PORT || 8000;
// listen to port
app.listen(port, () => {
  console.log("Server is running on port 8000");
});
