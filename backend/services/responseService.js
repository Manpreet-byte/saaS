const RESPONSE_TEMPLATES = {
  positive: {
    friendly: 'Thanks for the wonderful feedback! We\'re glad you had a great experience.',
    professional: 'Thank you for the positive review. We appreciate your feedback and are pleased we met your expectations.',
    sarcastic: 'Well, that is refreshingly positive. Thanks for sharing the good news.'
  },
  neutral: {
    friendly: 'Thanks for the honest feedback. We appreciate it and will keep improving.',
    professional: 'Thank you for your feedback. We value it and will continue improving our service.',
    sarcastic: 'A perfectly average review—good to know. Thanks for the feedback.'
  },
  apology: {
    friendly: 'We\'re sorry your experience fell short. Thanks for letting us know, and we\'ll work to improve.',
    professional: 'We apologize for the poor experience and appreciate the feedback. We\'ll review this carefully.',
    sarcastic: 'Not exactly the result we hoped for. Sorry about that, and we\'ll do better.'
  }
};

const getCategory = (rating) => {
  if (rating >= 4) return 'positive';
  if (rating <= 2) return 'apology';
  return 'neutral';
};

const shortenText = (text, maxLength = 90) => {
  if (!text) return '';
  const cleaned = String(text).replace(/\s+/g, ' ').trim();
  if (cleaned.length <= maxLength) return cleaned;
  return `${cleaned.slice(0, maxLength).trim()}...`;
};

const generateAutoResponse = ({ rating, reviewText, tone = 'professional' }) => {
  const normalizedTone = RESPONSE_TEMPLATES.positive[tone] ? tone : 'professional';
  const category = getCategory(Number(rating));
  const baseResponse = RESPONSE_TEMPLATES[category][normalizedTone];
  const snippet = shortenText(reviewText);

  if (!snippet) {
    return baseResponse;
  }

  return `${baseResponse} We noted your comment: "${snippet}".`;
};

module.exports = {
  generateAutoResponse
};
