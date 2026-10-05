const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");

const User = require("../models/User");

const router = express.Router();

const googleClient = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID
);

// =========================
// REGISTER
// =========================

router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    console.log("REGISTER REQUEST:", {
      name,
      email,
    });

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({
      email: cleanEmail,
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists.",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
    });

    console.log("REGISTER SUCCESS:", user.email);

    return res.status(201).json({
      message: "Registration successful.",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("REGISTER ERROR:", error);
    console.log("REGISTER ERROR MESSAGE:", error.message);

    return res.status(500).json({
      message: error.message,
    });
  }
});

// =========================
// NORMAL LOGIN
// =========================

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    console.log("LOGIN REQUEST:", {
      email,
    });

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({
      email: cleanEmail,
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password.",
      });
    }

    // Google account cannot use normal password login
    if (!user.password) {
      return res.status(400).json({
        message: "Please continue with Google to login.",
      });
    }

    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(400).json({
        message: "Invalid email or password.",
      });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "JWT_SECRET is missing in .env",
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    console.log("LOGIN SUCCESS:", user.email);

    return res.json({
      message: "Login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("LOGIN ERROR:", error);
    console.log("LOGIN ERROR MESSAGE:", error.message);

    return res.status(500).json({
      message: error.message,
    });
  }
});

// =========================
// GOOGLE LOGIN
// =========================

router.post("/google", async (req, res) => {
  try {
    const { credential } = req.body;

    console.log("GOOGLE LOGIN REQUEST");

    if (!credential) {
      return res.status(400).json({
        message: "Google credential is required.",
      });
    }

    if (!process.env.GOOGLE_CLIENT_ID) {
      return res.status(500).json({
        message: "GOOGLE_CLIENT_ID is missing in .env",
      });
    }

    // Verify Google ID token
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const googleId = payload.sub;
    const email = payload.email;
    const name = payload.name || "Google User";

    if (!googleId || !email) {
      return res.status(400).json({
        message: "Unable to get Google account information.",
      });
    }

    const cleanEmail = email.trim().toLowerCase();

    // Check existing user
    let user = await User.findOne({
      email: cleanEmail,
    });

    // Create user if not already registered
    if (!user) {
      user = await User.create({
        name: name.trim(),
        email: cleanEmail,
        googleId,
        password: null,
      });

      console.log("GOOGLE USER CREATED:", user.email);
    } else {
      // Add Google ID if existing account doesn't have one
      if (!user.googleId) {
        user.googleId = googleId;
        await user.save();
      }

      console.log("GOOGLE USER LOGIN:", user.email);
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        message: "JWT_SECRET is missing in .env",
      });
    }

    // Create our own JWT
    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.json({
      message: "Google login successful.",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("GOOGLE LOGIN ERROR:", error);
    console.log(
      "GOOGLE LOGIN ERROR MESSAGE:",
      error.message
    );

    return res.status(401).json({
      message: "Google authentication failed.",
    });
  }
});

module.exports = router;