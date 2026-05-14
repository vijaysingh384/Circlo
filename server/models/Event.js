import mongoose from 'mongoose';

const EventSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  joinCode: {
    type: String,
    required: true,
    unique: true,
  },
  hostToken: {
    type: String,
    required: true,
  },
  createdAt: {
    type: String,
    required: true,
  },
});

export default mongoose.model('Event', EventSchema);
