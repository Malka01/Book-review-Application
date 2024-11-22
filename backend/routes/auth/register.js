const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { registerSchema } = require("../../validations");
const { db } = require("../../lib/db");

const register = async (req, res) => {
  try {
    // get data from request body
    const data = req.body;

    // validate data
    const validatedData = registerSchema.safeParse(data);

    // check if data is valid
    if (!validatedData.success) {
      return res.status(400).json({
        success: false,
        errors: validatedData.error.errors,
      });
    }

    // get data from validated data
    const { email, firstName, lastName, password } = validatedData.data;

    // check if user exists
    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // create user
    const newUser = await db.user.create({
      data: {
        email,
        firstName,
        lastName,
        password: hashedPassword,
      },
    });

    // create token
    const jwtContent = {
      id: newUser.id,
      email: newUser.email,
    };

    const accessToken = jwt.sign(jwtContent, process.env.ACCESS_TOKEN_SECRET, {
      expiresIn: "30 days",
    });

    // send token as cookie
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });

    const userData = await db.user.findUnique({
      where: {
        id: newUser.id,
      },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
        reviews: {
          select: {
            isbn: true,
            title: true,
            author: true,
            rating: true,
            review: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    });

    // send user data
    return res.status(200).json({
      success: true,
      message: "User registered",
      user: userData,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
};

module.exports = register;
