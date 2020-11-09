const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const jobSchema = new Schema({
  // jobId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  // address: { type: String, required: false },
  // location: {
  //   lat: { type: Number, required: false },
  //   lng: { type: Number, required: false }
  // },
  creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
  applier: [{ type: mongoose.Types.ObjectId, required: false, ref: 'User' }],
});

module.exports = mongoose.model('job', jobSchema);
