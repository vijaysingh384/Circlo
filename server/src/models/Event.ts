import mongoose, { Schema, Model } from 'mongoose';
import type { Event } from '../types/index.js';


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

const EventModel = mongoose.model("Event", EventSchema);

export default EventModel;
