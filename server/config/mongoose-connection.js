import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/circlo';

mongoose.connect(MONGODB_URI).then(
   function() {
       console.log("Connected to MongoDB");
       console.log("MongoDB URI:", MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@')); // Log URI without password
   }
).catch(
   function(err) {
       console.log("Error connecting to MongoDB:", err.message);
       console.log("MongoDB URI being used:", MONGODB_URI.replace(/\/\/([^:]+):([^@]+)@/, '//$1:****@'));
   }
);

export default mongoose.connection;
