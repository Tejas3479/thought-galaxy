'use client';

import { useState } from 'react';
import { useThoughtStore } from '@/store/thoughtStore';
import { detectSentiment, sentimentTypeToEmoji } from '@/utils/sentiment';

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of',
  'is', 'are', 'am', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
  'can', 'if', 'this', 'that', 'it', 'with', 'from', 'by', 'as', 'i', 'you', 'he',
  'she', 'we', 'they', 'what', 'when', 'where', 'why', 'how',
]);

function extractKeywords(text: string): string[] {
  const words = text
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 3 && !STOP_WORDS.has(word))
    .map((word) => word.replace(/[^\w]/g, ''));

  // Remove duplicates and take first 3
  return [...new Set(words)].slice(0, 3);
}

type Sentiment = 'happy' | 'neutral' | 'sad' | null;

export default function ThoughtInput() {
  const [text, setText] = useState('');
  const [manualSentiment, setManualSentiment] = useState<Sentiment>(null);
  const addThought = useThoughtStore((state) => state.addThought);

  const handleSubmit = () => {
    const trimmed = text.trim();
    if (!trimmed) return;

    const keywords = extractKeywords(trimmed);
    
    // Determine sentiment: manual selection takes precedence, otherwise auto-detect
    let finalSentiment: 'happy' | 'neutral' | 'sad';
    if (manualSentiment) {
      finalSentiment = manualSentiment;
    } else {
      const detectedType = detectSentiment(trimmed);
      finalSentiment = sentimentTypeToEmoji(detectedType);
    }

    addThought({
      text: trimmed,
      sentiment: finalSentiment,
      keywords,
    });

    setText('');
    setManualSentiment(null);
    console.log('Thought added:', {
      text: trimmed,
      sentiment: finalSentiment,
      keywords,
      manualOverride: manualSentiment !== null,
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleSubmit();
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 flex items-center justify-center pb-8 z-50 pointer-events-none">
      <div className="pointer-events-auto w-full max-w-md mx-4 backdrop-blur-lg bg-black/40 border border-white/10 rounded-xl p-6 shadow-2xl">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="What are you thinking right now?"
          className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white placeholder-white/50 resize-none focus:outline-none focus:border-white/30 transition-colors"
          rows={3}
        />

        {/* Sentiment Selection - Optional Manual Override */}
        <div className="flex gap-2 mt-4 mb-4">
          <button
            onClick={() => setManualSentiment(manualSentiment === 'happy' ? null : 'happy')}
            className={`text-2xl px-3 py-1 rounded-lg transition-all ${
              manualSentiment === 'happy'
                ? 'bg-white/20 scale-110'
                : 'bg-white/5 hover:bg-white/10'
            }`}
            title="Override auto-detect: Happy"
          >
            😊
          </button>
          <button
            onClick={() => setManualSentiment(manualSentiment === 'neutral' ? null : 'neutral')}
            className={`text-2xl px-3 py-1 rounded-lg transition-all ${
              manualSentiment === 'neutral'
                ? 'bg-white/20 scale-110'
                : 'bg-white/5 hover:bg-white/10'
            }`}
            title="Override auto-detect: Neutral"
          >
            😐
          </button>
          <button
            onClick={() => setManualSentiment(manualSentiment === 'sad' ? null : 'sad')}
            className={`text-2xl px-3 py-1 rounded-lg transition-all ${
              manualSentiment === 'sad'
                ? 'bg-white/20 scale-110'
                : 'bg-white/5 hover:bg-white/10'
            }`}
            title="Override auto-detect: Sad"
          >
            😔
          </button>
          {!manualSentiment && text.trim() && (
            <div className="ml-auto text-xs text-white/50 py-1 px-2">
              Auto-detecting sentiment...
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={!text.trim()}
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-600 disabled:to-gray-700 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-all duration-200 hover:shadow-lg"
        >
          Release into the Void
        </button>
      </div>
    </div>
  );
}
