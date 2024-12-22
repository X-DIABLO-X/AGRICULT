import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables first
dotenv.config();

const SUPABASE_URL = 'https://pojuqqnftsunpiutlyrn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvanVxcW5mdHN1bnBpdXRseXJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2ODAwOTIsImV4cCI6MjA1MDI1NjA5Mn0.0QASIiNcOib_pClL7XMi45_MoK3cMNjLbmvfhp982UQ';

// Validate environment variables
if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('Missing required environment variables');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : '*',
  methods: ['GET', 'POST']
}));

// Email validation helper  
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Phone number validation helper
const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
};

const insertRow = async (userData) => {
  try {
    const { data, error } = await supabase
      .from('BUYERS')
      .insert([{
        ...userData,
        created_at: new Date().toISOString()
      }]);

    return { data, error };
  } catch (error) {
    console.error('Error in insertRow:', error);
    throw error;
  }
};

// Welcome route
app.get("/", (_req, res) => {
  res.send("Welcome to the backend!");
});

// Buyer registration route
app.post("/new/seller", async (req, res) => {
  try {
    const { userName, license, email, password, phoneNumber, region, location } = req.body;

    // Enhanced input validation - check if values exist and are strings before trimming
    if (!userName || !license || !email || !password || !phoneNumber || 
        !region || !location || 
        typeof userName !== 'string' || typeof license !== 'string' || 
        typeof email !== 'string' || typeof password !== 'string' || 
        typeof phoneNumber == 'string' || typeof region !== 'string' || 
        typeof location !== 'string' ||
        !userName.trim() || !email.trim() || 
        !password.trim() || !region.trim() || 
        !location.trim()) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required and must be non-empty strings'
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate phone number
    // if (!isValidPhoneNumber(phoneNumber)) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Invalid phone number format'
    //   });
    // }

    // Validate password length
    // if (password.length < 8) {
    //   return res.status(400).json({
    //     success: false,
    //     message: 'Password must be at least 8 characters long'
    //   });
    // }

    // // Check if user already exists
    // const { data: existingUser } = await supabase
    //   .from('USER_BUYERS')
    //   .select('email, userName')
    //   .or(`email.eq.${email},userName.eq.${userName}`)
    //   .single();

    // if (existingUser) {
    //   return res.status(409).json({
    //     success: false,
    //     message: 'Email or username already exists'
    //   });
    // }
    
    // Insert new user with trimmed values
    const { data, error } = await supabase
      .from('USER_BUYERS').insert([{
        userName: userName.trim(),
        license: license,
        email: email.trim(),
        password: password.trim(),
        phoneNumber: phoneNumber,
        region: region.trim(),
        location: location.trim()
      }]).select();

    if (error) {
      console.error('Error inserting row:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to register buyer'
      });
    }

    // Send success response
    return res.status(201).json({
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
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Internal server error'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});