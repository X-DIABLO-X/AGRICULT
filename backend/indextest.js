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
const app = express();

app.use(express.json());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : "*",
  methods: ["GET", "POST"],
}));

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPhoneNumber = (phone) => {
  const phoneRegex = /^\+?[\d\s-]{10,}$/;
  return phoneRegex.test(phone);
};

app.post("/new/buyer", async (req, res) => {
  try {
    const { userName, fullName, email, password, phoneNumber, businessName, location } = req.body;

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

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: password
    });

    if (authError) {
      return res.status(400).json({
        success: false,
        message: "Authentication failed",
        error: authError.message
      });
    }

    const { error: dbError } = await supabase.from("USER_BUYERS").insert([{
      userName: userName.trim(),
      fullName: fullName,
      email: email.trim(),
      phoneNumber: phoneNumber,
      businessName: businessName.trim(),
      location: location.trim(),
      password: password
    }]);

    if (dbError) {
      await supabase.auth.admin.deleteUser(authData.user.id);
      return res.status(500).json({
        success: false,
        message: "Failed to register buyer"
      });
    }

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email."
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during registration"
    });
  }
});

app.post("/new/seller", async (req, res) => {
  try {
    const { userName, license, email, password, phoneNumber, region } = req.body;

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

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          user_type: 'seller',
          userName,
          license,
          phoneNumber,
          region
        }
      }
    });

    if (authError) {
      return res.status(400).json({
        success: false,
        message: "Authentication failed",
        error: authError.message
      });
    }

    const { error: dbError } = await supabase.from("USER_SELLER").insert([{
      userName: userName.trim(),
      license,
      email: email.trim(),
      phoneNumber,
      region: region.trim(),
      user_id: authData.user.id
    }]);

    if (dbError) {
      await supabase.auth.admin.deleteUser(authData.user.id);
      return res.status(500).json({
        success: false,
        message: "Failed to register seller"
      });
    }

    return res.status(201).json({
      success: true,
      message: "Registration successful. Please verify your email."
    });
  } catch (error) {
    console.error("Registration error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during registration"
    });
  }
});

app.post("/user/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials"
      });
    }

    return res.status(200).json({
      success: true,
      session: data.session
    });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during login"
    });
  }
});


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
    console.log(req.body);
    if (
      !quantity ||
      !qualityType ||
      !region ||
      !loadingDate ||
      !deliveryLocation ||
      !userName
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const { data, error } = await supabase
      .from("ORDERS")
      .insert([
        {
          quantity: quantity,
          quality: qualityType,
          region: region,
          loadingDate: loadingDate,
          deliveryLocation: deliveryLocation,
          userName: userName,
          status:"TRUE",
        },
      ])
      .select();

    if (error) {
      console.error("Error inserting row:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to place order",
      });
    }

    return res.status(201).json({
      success: true,
      message: "Order placed successfully",
    });
  } catch (error) {
    console.error("Order error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error during order",
    });
  }
});

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Internal server error",
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


app.get("/fetch/orders", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('ORDERS')
      .select('*');

    if (error) {
      console.error('Error fetching rows:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch orders'
      });
    }

    return res.status(200).json({
      success: true,
      orders: data
    });

  } catch (error) {
    console.error('Registration error:', error);
    return res.status(500).json({ 
      success: false,
      message: 'Server error during registration'
    })
  }
})

