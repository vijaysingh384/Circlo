import mongoose from 'mongoose';

mongoose.connect("mongodb://localhost:27017/circlo").then(
   function() {
       console.log("Connected to MongoDB");
   }
).catch(
   function(err) {
       console.log("Error connecting to MongoDB: " + err);
   }
);

export default mongoose.connection;
