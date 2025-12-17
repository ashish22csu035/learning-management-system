

const mongoose = require('mongoose');

/**
 * Connect to MongoDB Database
 * This function establishes connection to our MongoDB Atlas database
 */
const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(` MongoDB Connected: ${conn.connection.host}`);
    console.log(` Database Name: ${conn.connection.name}`);
    
  } catch (error) {
    // If connection fails, log error and exit
    console.error(` Error: ${error.message}`);
    process.exit(1); // Exit with failure
  }
};

// Export the function so we can use it in server.js
module.exports = connectDB;