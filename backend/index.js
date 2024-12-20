import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Welcome route
app.get("/", (req, res) => {
  res.send("Welcome to the Food Inspector API");
});

// Buyer registration route
app.post("/new/buyer", (req, res) => {
  try {
    const { fullName, phoneNumber, businessName, location, password } = req.body;
    
    // Validate required fields
    if (!fullName || !phoneNumber || !businessName || !location || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required'
      });
    }

    console.log('Received registration data:', {
      fullName,
      phoneNumber,
      businessName,
      location
    });

    // Send success response
    return res.status(200).json({
      success: true,
      message: 'Registration successful. Please verify OTP.'
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something broke!'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});