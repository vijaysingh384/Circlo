const mongoose = require('mongoose');

const CreateEventResponse =  mongoose.Schema({
    eventId: string,
  joinCode: string,
  name: string,
  createdAt: string,
})

module.exports = mongoose.model("CreateEventResponse", CreateEventResponse);