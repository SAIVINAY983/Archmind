const mongoose = require('mongoose');

const generationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  prompt: {
    type: String,
    required: true,
  },
  architecture: {
    hld: { type: Object },
    lld: { type: Object },
    dbSchema: { type: Object },
    apis: { type: Array },
    diagramData: { type: Object },
    scalability: { type: Array },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Generation', generationSchema);
