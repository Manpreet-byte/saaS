const mongoose = require('mongoose');

const settingSchema = new mongoose.Schema(
  {
    scope: {
      type: String,
      default: 'global',
      unique: true,
      index: true
    },
    autoResponseEnabled: {
      type: Boolean,
      default: true
    },
    tone: {
      type: String,
      enum: ['friendly', 'professional', 'sarcastic'],
      default: 'professional'
    },
    totalUsers: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true
  }
);

settingSchema.statics.getSingleton = async function () {
  return this.findOneAndUpdate(
    { scope: 'global' },
    { $setOnInsert: { scope: 'global' } },
    {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true,
      runValidators: true
    }
  );
};

module.exports = mongoose.model('Setting', settingSchema);
