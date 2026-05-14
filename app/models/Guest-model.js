const mongoose = require('mongoose');



const GuestSchema = mongoose.Schema({
    id: String,
    event_id: String,
    guest_name: String,
});

module.exports = mongoose.model("Guest", GuestSchema);