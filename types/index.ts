export interface LunchOption {
  id: string;
  name: string;
  type: string;
  liked: boolean;
  location?: string;
  createdAt: string;
}

export interface HistoryRecord {
  id: string;
  date: string;
  selected: string;
  timestamp: number;
}

export interface AppSettings {
  theme: 'light' | 'dark';
  language: 'zh-TW' | 'zh-CN' | 'en';
  excludeRecent: boolean;
  excludeDays: number;
}

export interface AppData {
  lunchOptions: LunchOption[];
  history: HistoryRecord[];
  settings: AppSettings;
}

export interface ThemeColors {
  background: string;
  surface: string;
  primary: string;
  secondary: string;
  accent: string;
  text: string;
  textSecondary: string;
  border: string;
  danger: string;
  success: string;
  neonBlue: string;
  neonPurple: string;
  neonPink: string;
}