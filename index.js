import app from "./app.js";
import connectDB from "./src/database/db.js";
import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

const startServer = async () => {
  try {
    await connectDB();
    app.listen(process.env.PORT || 8000, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log("Server failed to start", error);
  }
};

startServer();
