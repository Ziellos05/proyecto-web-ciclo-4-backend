import mongoose from 'mongoose';
const { Schema } = mongoose;

const enrollmentsSchema = new Schema({
  project_id: {
    type: Schema.ObjectId,
    required: true,
  },
  user_id: {
    type: Schema.ObjectId,
    required: true
  },
  leader_id: {
    type: Schema.ObjectId,
    required: true
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACEPTED', 'REJECTED'],
    requires: true
  },
  admissionDate: {
    type: Date,
  },
  outputDate: {
    type: Date
  }
})

const Enrollements = new mongoose.model('enrollments', enrollmentsSchema);

export default Enrollements;
