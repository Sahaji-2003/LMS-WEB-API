const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    educator_name: { type: String, required: true },
    role: { type: String, required: true, default: "Educator"},
    institute: { type: String, required: true },
    user_id: { type: String, required: true, unique: true },
    educator_phone: { type: Number, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true }
});

const Educator = mongoose.model('Educator', UserSchema);

module.exports = Educator;
