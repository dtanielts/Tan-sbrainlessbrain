export interface BlogPost {
  id: string;
  title_vi: string;
  title_en: string;
  content_vi: string;
  content_en: string;
  date: string;
  mood_vi: string;
  mood_en: string;
  learning_vi?: string;
  learning_en?: string;
  tags: string[];
  category: 'thought' | 'learning';
  isCustom?: boolean; // Flag to identify user-created posts saved in localStorage
}
