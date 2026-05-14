const mongoose = require('mongoose');

const ImageSchema = mongoose.Schema({
    id: String,
    file_type: String,
    event_id: String,
    image_url: String,
});

module.exports = mongoose.model("Image", imageSchema);
