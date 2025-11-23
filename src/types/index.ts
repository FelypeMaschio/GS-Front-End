export interface User {
  id: string;
  name: string;
  email: string;
  xp: number;
  level: number;
  badges: Badge[];
  avatar?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: Date;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  xpReward: number;
  progress: number;
  completed: boolean;
  dueDate?: Date;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
  progress: number;
  completed: boolean;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  completed: boolean;
}

export interface TeamMember {
  id: string;
  name: string;
  rm: string;
  role: string;
  class: string;
  github: string;
  linkedin: string;
  photo: string;
}