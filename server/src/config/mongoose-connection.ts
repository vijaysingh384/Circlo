import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/circlo';

mongoose.connect(MONGODB_URI).then(() => {
  console.log('Connected to MongoDB');
})
.catch((Error) => {
  console.log('Error connecting to MongoDB' , Error);
})



export default mongoose.connection;
