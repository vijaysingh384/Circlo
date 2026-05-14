const mongoose = require('mongoose');



const AppEvent = mongoose.Schema({
     _id: string,
  eventId: string,
  name: string,
  joinCode: string,
  createdAt: string,

});

module.exports = mongoose.model("Event", AppEvent);


