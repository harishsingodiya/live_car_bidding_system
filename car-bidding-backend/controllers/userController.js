const bcrypt = require("bcrypt");
const jwtUtils = require("../utils/jwtUtils");
const User = require("../models/user");

exports.registerUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await User.getByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    await User.create(username, hashedPassword);

    const newUser = await User.getByUsername(username);

    // Generate JWT token
    const token = jwtUtils.generateToken({
      id: newUser.id,
      username: newUser.username,
    });
    const refreshToken = jwtUtils.generateRefreshToken({
      id: newUser.id,
      username: newUser.username,
    });

    res.status(201).json({
      message: "User registered successfully",
      token,
      refreshToken,
      userData: { userId: newUser.id, username: newUser.username },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error registering user", error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.getByUsername(username);
    if (!user) {
      return res.status(400).json({ message: "User not registered!!" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate JWT token
    const token = jwtUtils.generateToken({
      id: user.id,
      username: user.username,
    });
    const refreshToken = jwtUtils.generateRefreshToken({
      id: user.id,
      username: user.username,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      refreshToken,
      userData: { userId: user.id, username: user.username },
    });
  } catch (error) {
    res.status(500).json({ message: "Error logging in", error: error.message });
  }
};

// Refresh Token Endpoint
exports.refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token required" });
  }

  // Verify refresh token
  const decoded = jwtUtils.verifyRefreshToken(refreshToken);
  if (!decoded) {
    return res
      .status(403)
      .json({ message: "Invalid or expired refresh token" });
  }

  // Get the user from the database
  const user = await User.getById(decoded.id);
  if (!user) {
    return res.status(403).json({ message: "Invalid refresh token" });
  }

  // Generate new access token
  const token = jwtUtils.generateToken({
    id: user.id,
    username: user.username,
  });
  res.status(200).json({
    message: "Login successful",
    token,
    userData: { userId: user.id, username: user.username },
  });
};

exports.getUserDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.getById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error fetching user details", error: error.message });
  }
};
