// import app from "/app.js";
import connectDB from "./src/database/database.js";
import dotenv from "dotenv";

dotenv.config({
  path: "./.env",
});

const testDBConnection = async () => {
  try {
    await connectDB();
    console.log("✅ Database connection successful!");
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
};

testDBConnection();
