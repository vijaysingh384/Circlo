import Event from '../models/Event.js';
import Photo from '../models/Photo.js';

/**
 * Database abstraction layer
 */
class Database {
  // Event methods
  async createEvent(eventData) {
    const event = new Event(eventData);
    await event.save();
    return event.toObject();
  }

  async getEventById(eventId) {
    const event = await Event.findOne({ eventId });
    return event ? event.toObject() : null;
  }

  async getEventByJoinCode(joinCode) {
    const event = await Event.findOne({ joinCode: joinCode.toUpperCase() });
    return event ? event.toObject() : null;
  }

  // Photo methods
  async createPhoto(photoData) {
    const photo = new Photo(photoData);
    await photo.save();
    return photo.toObject();
  }

  async getPhotoById(photoId) {
    const photo = await Photo.findOne({ photoId });
    return photo ? photo.toObject() : null;
  }

  async getPhotosByEventId(eventId) {
    const photos = await Photo.find({ eventId }).sort({ uploadedAt: -1 });
    return photos.map(photo => photo.toObject());
  }

  async countPhotosBySessionToken(eventId, sessionToken) {
    return await Photo.countDocuments({ eventId, sessionToken });
  }

  async deletePhoto(photoId) {
    await Photo.deleteOne({ photoId });
  }

  // Get all photos (for cleanup service)
  async getAllPhotos() {
    const photos = await Photo.find({}).sort({ uploadedAt: -1 });
    return photos.map(photo => photo.toObject());
  }
}

export default Database;
