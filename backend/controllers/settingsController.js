const Setting = require('../models/Setting');
const AppError = require('../utils/appError');
const asyncHandler = require('../middleware/asyncHandler');

const toggleAutoResponse = asyncHandler(async (req, res) => {
  const { enabled } = req.body;
  const settings = await Setting.getSingleton();

  if (enabled !== undefined && typeof enabled !== 'boolean') {
    throw new AppError('enabled must be a boolean value', 400);
  }

  settings.autoResponseEnabled = typeof enabled === 'boolean' ? enabled : !settings.autoResponseEnabled;
  await settings.save();

  res.status(200).json({
    success: true,
    message: 'Auto-response setting updated successfully',
    data: settings
  });
});

const setTone = asyncHandler(async (req, res) => {
  const { tone } = req.body;
  const allowedTones = ['friendly', 'professional', 'sarcastic'];

  if (!tone || !allowedTones.includes(tone)) {
    throw new AppError('tone must be one of: friendly, professional, sarcastic', 400);
  }

  const settings = await Setting.getSingleton();
  settings.tone = tone;
  await settings.save();

  res.status(200).json({
    success: true,
    message: 'Tone updated successfully',
    data: settings
  });
});

module.exports = {
  toggleAutoResponse,
  setTone
};
