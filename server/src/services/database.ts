import EventModel from "../models/Event.js";
import PhotoModel from "../models/Photo.js";
import type { Event, Photo } from "../types/index.js";

class Database {

  async createEvent(eventData: Partial<Event>): Promise<Event> {
    const event = new EventModel(eventData);
    const savedEvent = await event.save();

    return savedEvent.toObject() as Event;
  }

  async getEventById(eventId: string): Promise<Event | null> {
    const event = await EventModel.findOne({ eventId });

    return event ? (event.toObject() as Event) : null;
  }

  async getEventByJoinCode(joinCode: string): Promise<Event | null> {
    const event = await EventModel.findOne({
      joinCode: joinCode.toUpperCase(),
    });

    return event ? (event.toObject() as Event) : null;
  }

  async createPhoto(photoData: Partial<Photo>): Promise<Photo> {
    const photo = new PhotoModel(photoData);
    const savedPhoto = await photo.save();

    return savedPhoto.toObject() as Photo;
  }

  async getPhotoById(photoId: string): Promise<Photo | null> {
    const photo = await PhotoModel.findOne({ photoId });

    return photo ? (photo.toObject() as Photo) : null;
  }

  async getPhotosByEventId(eventId: string): Promise<Photo[]> {
    const photos = await PhotoModel.find({ eventId }).sort({
      uploadedAt: -1,
    });

    return photos.map((photo) => photo.toObject() as Photo);
  }

  async countPhotosBySessionToken(
    eventId: string,
    sessionToken: string
  ): Promise<number> {
    return PhotoModel.countDocuments({
      eventId,
      sessionToken,
    });
  }

  async deletePhoto(photoId: string): Promise<void> {
    await PhotoModel.deleteOne({ photoId });
  }

  async getAllPhotos(): Promise<Photo[]> {
    const photos = await PhotoModel.find().sort({
      uploadedAt: -1,
    });

    return photos.map((photo) => photo.toObject() as Photo);
  }
}

export default Database;