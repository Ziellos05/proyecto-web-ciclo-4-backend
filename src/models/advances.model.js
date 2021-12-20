import mongoose from 'mongoose';
const { Schema } = mongoose;

const advancesSchema = new Schema({
  projectID: {
    type: Schema.ObjectId,
    required: true,
  },
  userID: {
    type: Schema.ObjectId,
    required: true
  },
  advance: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  comments: {
    type: String
  },
})

const Advances = new mongoose.model('advances', advancesSchema);

export default Advances;
