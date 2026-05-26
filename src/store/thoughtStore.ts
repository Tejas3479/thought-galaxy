import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Thought {
  id: string;
  text: string;
  sentiment: 'happy' | 'neutral' | 'sad' | 'auto';
  timestamp: string;
  keywords: string[];
}

interface ThoughtStore {
  thoughts: Thought[];
  addThought: (thought: Omit<Thought, 'id' | 'timestamp'>) => void;
}

const INITIAL_THOUGHTS: Thought[] = [
  {
    id: '1',
    text: 'I wonder if stars feel lonely',
    sentiment: 'auto',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    keywords: ['wonder', 'stars', 'lonely'],
  },
  {
    id: '2',
    text: 'Today feels like a quiet nebula',
    sentiment: 'auto',
    timestamp: new Date(Date.now() - 43200000).toISOString(),
    keywords: ['today', 'quiet', 'nebula'],
  },
  {
    id: '3',
    text: 'The void listens but never answers',
    sentiment: 'auto',
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    keywords: ['void', 'listens', 'answers'],
  },
];

export const useThoughtStore = create<ThoughtStore>()(
  persist(
    (set) => ({
      thoughts: INITIAL_THOUGHTS,
      addThought: (thought) =>
        set((state) => ({
          thoughts: [
            ...state.thoughts,
            {
              ...thought,
              id: Date.now().toString(),
              timestamp: new Date().toISOString(),
            },
          ],
        })),
    }),
    {
      name: 'thought-store',
    }
  )
);
