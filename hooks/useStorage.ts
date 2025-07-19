import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppData, AppSettings, LunchOption, HistoryRecord } from '@/types';

const STORAGE_KEY = 'lunch_selector_data';

const defaultSettings: AppSettings = {
  theme: 'dark',
  language: 'zh-TW',
  excludeRecent: true,
  excludeDays: 1,
};

const defaultData: AppData = {
  lunchOptions: [],
  history: [],
  settings: defaultSettings,
};

export const useStorage = () => {
  const loadData = async (): Promise<AppData> => {
    try {
      const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
      if (jsonValue != null) {
        const data = JSON.parse(jsonValue);
        return { ...defaultData, ...data };
      }
    } catch (e) {
      console.error('Error loading data:', e);
    }
    return defaultData;
  };

  const saveData = async (data: AppData): Promise<void> => {
    try {
      const jsonValue = JSON.stringify(data);
      await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    } catch (e) {
      console.error('Error saving data:', e);
    }
  };

  const addLunchOption = async (option: Omit<LunchOption, 'id' | 'createdAt'>): Promise<void> => {
    const data = await loadData();
    const newOption: LunchOption = {
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      ...option,
    };
    data.lunchOptions.push(newOption);
    await saveData(data);
  };

  const updateLunchOption = async (id: string, updates: Partial<LunchOption>): Promise<void> => {
    const data = await loadData();
    const index = data.lunchOptions.findIndex(option => option.id === id);
    if (index !== -1) {
      data.lunchOptions[index] = { ...data.lunchOptions[index], ...updates };
      await saveData(data);
    }
  };

  const deleteLunchOption = async (id: string): Promise<void> => {
    const data = await loadData();
    data.lunchOptions = data.lunchOptions.filter(option => option.id !== id);
    await saveData(data);
  };

  const addHistory = async (selected: string): Promise<void> => {
    const data = await loadData();
    const newRecord: HistoryRecord = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      selected,
      timestamp: Date.now(),
    };
    data.history.unshift(newRecord);
    await saveData(data);
  };

  const updateSettings = async (settings: Partial<AppSettings>): Promise<void> => {
    const data = await loadData();
    data.settings = { ...data.settings, ...settings };
    await saveData(data);
  };

  const clearFavorites = async (): Promise<void> => {
    const data = await loadData();
    data.lunchOptions = [];
    await saveData(data);
  };

  const clearHistory = async (): Promise<void> => {
    const data = await loadData();
    data.history = [];
    await saveData(data);
  };

  return {
    loadData,
    saveData,
    addLunchOption,
    updateLunchOption,
    deleteLunchOption,
    addHistory,
    updateSettings,
    clearFavorites,
    clearHistory,
  };
};