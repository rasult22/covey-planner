// Principle Centered Planner - Predefined Values

import { ValueCategory } from '@/types';

export interface PredefinedValue {
  name: string;
  category: ValueCategory;
  description?: string;
}

export const PREDEFINED_VALUES: PredefinedValue[] = [
  // Personal
  { name: 'Integrity', category: 'personal', description: 'Being honest and having strong moral principles' },
  { name: 'Growth', category: 'personal', description: 'Continuous learning and self-improvement' },
  { name: 'Creativity', category: 'personal', description: 'Expressing imagination and original ideas' },
  { name: 'Health', category: 'personal', description: 'Physical and mental well-being' },
  { name: 'Courage', category: 'personal', description: 'Facing fears and taking bold action' },
  { name: 'Authenticity', category: 'personal', description: 'Being true to yourself' },
  { name: 'Wisdom', category: 'personal', description: 'Sound judgment and deep understanding' },
  { name: 'Resilience', category: 'personal', description: 'Bouncing back from setbacks' },

  // Relationships
  { name: 'Family', category: 'relationships', description: 'Nurturing family bonds' },
  { name: 'Love', category: 'relationships', description: 'Deep care and affection for others' },
  { name: 'Friendship', category: 'relationships', description: 'Building meaningful connections' },
  { name: 'Compassion', category: 'relationships', description: 'Empathy and kindness toward others' },
  { name: 'Trust', category: 'relationships', description: 'Reliability and honesty in relationships' },
  { name: 'Community', category: 'relationships', description: 'Contributing to your community' },
  { name: 'Loyalty', category: 'relationships', description: 'Standing by those who matter' },

  // Professional
  { name: 'Excellence', category: 'professional', description: 'Striving for the highest quality' },
  { name: 'Leadership', category: 'professional', description: 'Inspiring and guiding others' },
  { name: 'Innovation', category: 'professional', description: 'Creating new solutions' },
  { name: 'Achievement', category: 'professional', description: 'Reaching goals and milestones' },
  { name: 'Collaboration', category: 'professional', description: 'Working effectively with others' },
  { name: 'Professionalism', category: 'professional', description: 'Maintaining high standards at work' },
  { name: 'Impact', category: 'professional', description: 'Making a meaningful difference' },

  // Financial
  { name: 'Financial Security', category: 'financial', description: 'Building stable financial foundation' },
  { name: 'Abundance', category: 'financial', description: 'Creating wealth and prosperity' },
  { name: 'Generosity', category: 'financial', description: 'Sharing resources with others' },
  { name: 'Independence', category: 'financial', description: 'Financial freedom and autonomy' },

  // Spiritual
  { name: 'Purpose', category: 'spiritual', description: 'Living with meaning and direction' },
  { name: 'Faith', category: 'spiritual', description: 'Spiritual beliefs and practices' },
  { name: 'Gratitude', category: 'spiritual', description: 'Appreciating what you have' },
  { name: 'Peace', category: 'spiritual', description: 'Inner calm and tranquility' },
  { name: 'Service', category: 'spiritual', description: 'Helping and serving others' },
  { name: 'Mindfulness', category: 'spiritual', description: 'Being present and aware' },
];

export const VALUES_BY_CATEGORY = PREDEFINED_VALUES.reduce((acc, value) => {
  if (!acc[value.category]) {
    acc[value.category] = [];
  }
  acc[value.category].push(value);
  return acc;
}, {} as Record<ValueCategory, PredefinedValue[]>);

export const CATEGORY_LABELS: Record<ValueCategory, string> = {
  personal: 'Personal',
  relationships: 'Relationships',
  professional: 'Professional',
  financial: 'Financial',
  spiritual: 'Spiritual',
};
