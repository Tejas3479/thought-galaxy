const POSITIVE_WORDS = new Set([
  'love',
  'happy',
  'wonder',
  'beautiful',
  'hope',
  'peace',
  'dream',
  'shine',
  'warm',
  'grateful',
  'yes',
  'amazing',
  'inspired',
  'joy',
  'bliss',
  'excellent',
  'wonderful',
  'fantastic',
  'brilliant',
  'radiant',
  'serene',
  'thankful',
  'blessed',
  'magnificent',
  'splendid',
  'delightful',
  'awesome',
  'good',
  'great',
  'smile',
  'laugh',
  'celebrate',
  'victory',
  'triumph',
  'success',
  'freedom',
  'light',
  'bright',
  'sparkle',
  'glorious',
  'perfect',
  'lovely',
  'enchanted',
]);

const NEGATIVE_WORDS = new Set([
  'sad',
  'lonely',
  'fear',
  'dark',
  'lost',
  'pain',
  'hurt',
  'empty',
  'angry',
  'no',
  'hate',
  'broken',
  'anxious',
  'depressed',
  'miserable',
  'awful',
  'terrible',
  'horrible',
  'disgusting',
  'sick',
  'tired',
  'exhausted',
  'overwhelmed',
  'trapped',
  'imprisoned',
  'dying',
  'dead',
  'void',
  'abyss',
  'nightmare',
  'despair',
  'hopeless',
  'worthless',
  'useless',
  'forgotten',
  'ignored',
  'rejected',
  'betrayed',
  'ashamed',
  'guilty',
  'failure',
  'fail',
  'bad',
  'wrong',
  'negative',
  'evil',
  'monster',
  'sorrow',
  'grief',
  'weep',
  'cry',
  'tears',
  'suffer',
  'anguish',
]);

export type SentimentType = 'positive' | 'neutral' | 'negative';

export function detectSentiment(text: string): SentimentType {
  const lowerText = text.toLowerCase();
  
  // Word boundary matching regex
  let positiveCount = 0;
  let negativeCount = 0;

  // Count positive words
  for (const word of POSITIVE_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    const matches = lowerText.match(regex);
    positiveCount += matches ? matches.length : 0;
  }

  // Count negative words
  for (const word of NEGATIVE_WORDS) {
    const regex = new RegExp(`\\b${word}\\b`, 'g');
    const matches = lowerText.match(regex);
    negativeCount += matches ? matches.length : 0;
  }

  if (positiveCount > negativeCount) {
    return 'positive';
  } else if (negativeCount > positiveCount) {
    return 'negative';
  } else {
    return 'neutral';
  }
}

// Map sentiment types to emoji sentiment keys
export function sentimentTypeToEmoji(type: SentimentType): 'happy' | 'neutral' | 'sad' {
  switch (type) {
    case 'positive':
      return 'happy';
    case 'negative':
      return 'sad';
    default:
      return 'neutral';
  }
}
