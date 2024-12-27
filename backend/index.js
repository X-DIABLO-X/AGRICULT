import express from "express";
import cors from "cors";
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

dotenv.config();


const SUPABASE_URL = 'https://pojuqqnftsunpiutlyrn.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBvanVxcW5mdHN1bnBpdXRseXJuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ2ODAwOTIsImV4cCI6MjA1MDI1NjA5Mn0.0QASIiNcOib_pClL7XMi45_MoK3cMNjLbmvfhp982UQ';


if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error("Missing required environment variables");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Express Configuration
const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
}));

// Utility Functions
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
};

// Middleware for API request logging
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Buyer Registration Endpoint
app.post("/new/buyer", async (req, res) => {
  try {
    const { userName, fullName, email, password, phoneNumber, businessName, location } = req.body;

    // Input validation
    if (!userName || !fullName || !email || !password || !phoneNumber || !businessName || !location) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format"
      });
    }

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from("USER_BUYERS")
      .select("email")
      .eq("email", email.trim())
      .single();

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists"
      });
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        data: {
          user_type: "buyer"
        }
    }
    });

    if (authError) {
      if (authError.message.toLowerCase().includes('rate limit') || authError.status === 429) {
        return res.status(429).json({
          success: false,
          message: "Too many signup attempts. Please try again after some time.",
          error: authError.message
        });
      }

      return res.status(400).json({
        success: false,
        message: "Authentication failed",
        error: authError.message
      });
    }

    // Insert into USER_BUYERS table
    const { error: dbError } = await supabase.from("USER_BUYERS").insert([{
      userName: userName.trim(),
      fullName: fullName,
      email: email.trim(),
      password: password,
      phoneNumber: phoneNumber,
      businessName: businessName.trim(),
      location: location.trim()
    }]);

    if (dbError) {
      await supabase.auth.admin.deleteUser(authData.user.id);
      return res.status(500).json({
        success: false,
        message: "Failed to register buyer",
        error: dbError.message
      });
    }

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please check your email for verification.",
      userId: authData.user.id
    });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: error.message
    });
  }
});

// Seller Registration Endpoint
app.post("/new/seller", async (req, res) => {
  try {
    const { userName, license, email, password, phoneNumber, region } = req.body;

    // Input validation
    if (!userName || !license || !email || !password || !phoneNumber || !region) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format"
      });
    }

    if (!isValidPhoneNumber(phoneNumber)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number format"
      });
    }

    // Check if seller already exists
    const { data: existingSeller } = await supabase
      .from("USER_SELLER")
      .select("email")
      .eq("email", email.trim())
      .single();

    if (existingSeller) {
      return res.status(400).json({
        success: false,
        message: "Seller with this email already exists"
      });
    }

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: 'seller'
        }
      }
    });

    if (authError) {
      if (authError.message.toLowerCase().includes('rate limit') || authError.status === 429) {
        return res.status(429).json({
          success: false,
          message: "Too many signup attempts. Please try again after some time.",
          error: authError.message
        });
      }

      return res.status(400).json({
        success: false,
        message: "Authentication failed",
        error: authError.message
      });
    }

    // Insert into USER_SELLER table
    const { error: dbError } = await supabase.from("USER_SELLER").insert([{
      userName: userName.trim(),
      license: license,
      email: email.trim(),
      phoneNumber: phoneNumber,
      region: region.trim(),
      password: password
    }]);

    if (dbError) {
      await supabase.auth.admin.deleteUser(authData.user.id);
      return res.status(500).json({
        success: false,
        message: "Failed to register seller",
        error: dbError.message
      });
    }

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please check your email for verification.",
      userId: authData.user.id
    });

  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during registration",
      error: error.message
    });
  }
});

// User Login Endpoint
app.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
        error: error.message
      });
    }

    // Get user details based on email
    const { data: userData, error: userError } = await supabase
      .from('USER_BUYERS')
      .select('*')
      .eq('email', email)
      .single();

    if (!userData) {
      // Check in sellers table if not found in buyers
      const { data: sellerData, error: sellerError } = await supabase
        .from('USER_SELLER')
        .select('*')
        .eq('email', email)
        .single();

      if (sellerError || !sellerData) {
        return res.status(404).json({
          success: false,
          message: "User details not found"
        });
      }

      return res.status(200).json({
        success: true,
        session: data.session,
        user: sellerData,
        userType: 'seller'
      });
    }

    return res.status(200).json({
      success: true,
      session: data.session,
      user: userData,
      userType: 'buyer'
    });

  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login",
      error: error.message
    });
  }
});

// New Order Endpoint
app.post("/new/order", async (req, res) => {
  try {
    const {
      quantity,
      qualityType,
      region,
      loadingDate,
      deliveryLocation,
      userName,
    } = req.body;

    if (!quantity || !qualityType || !region || !loadingDate || !deliveryLocation || !userName) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const { data, error } = await supabase
      .from("ORDERS")
      .insert([
        {
          quantity,
          quality: qualityType,
          region,
          loadingDate,
          deliveryLocation,
          userName,
        },
      ])
      .select();

    if (error) {
      console.error("Error inserting order:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to place order",
        error: error.message
      });
    }

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
      order: data[0]
    });
  } catch (error) {
    console.error("Order error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during order placement",
      error: error.message
    });
  }
});

// Fetch Orders Endpoint
app.get("/fetch/orders", async (req, res) => {
  try {
    const { userName, status } = req.query;
    
    let query = supabase
      .from('ORDERS')
      .select('*')
      .order('created_at', { ascending: false });

    if (userName) {
      query = query.eq('userName', userName);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Error fetching orders:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch orders',
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      orders: data
    });

  } catch (error) {
    console.error('Fetch orders error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while fetching orders',
      error: error.message
    });
  }
});

// Update Order Status Endpoint
app.put("/order/:orderId/status", async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }

    const { error } = await supabase
      .from('ORDERS')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', orderId);

    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update order status',
        error: error.message
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Order status updated successfully'
    });

  } catch (error) {
    console.error('Update order status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error while updating order status',
      error: error.message
    });
  }
});

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: err.message
  });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});