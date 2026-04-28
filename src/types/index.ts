export type TargetAudience = 'Young Parents' | 'Working Adults' | 'Both';
export type ContentGoal = 'Education' | 'Engagement' | 'Lead Nurturing';
export type Platform = 'Facebook' | 'Instagram' | 'TikTok' | 'LinkedIn';
export type PostType = 'Static Post' | 'Reel';

export interface FormInputs {
  targetAudience: TargetAudience;
  contentGoals: ContentGoal[];
  platform: Platform;
  insuranceTopic: string;
  postType: PostType;
}

export interface CalendarDay {
  day: number;
  theme: string;
  hook: string;
  message: string;
  format: string;
  cta: string;
}

export interface PostResult {
  hook: string;
  value: string;
  cta: string;
  full_caption: string;
  hashtags: string[];
}

export interface ImageCreative {
  type: 'image';
  image_prompt: string;
}

export interface VideoCreative {
  type: 'video';
  script: {
    hook: string;
    body: string;
    cta: string;
  };
}

export type CreativeAsset = ImageCreative | VideoCreative;

export type AppStep = 1 | 2 | 3 | 4 | 5;
