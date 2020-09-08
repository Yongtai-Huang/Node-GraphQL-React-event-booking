const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String, unique: true, required: [true, "can't be blank"], index: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  createdEvents: [{ type: Schema.Types.ObjectId, ref: 'Event' }]
}, {timestamps: true});

userSchema.plugin(uniqueValidator, {message: 'is already taken.'});

module.exports = mongoose.model('User', userSchema);
