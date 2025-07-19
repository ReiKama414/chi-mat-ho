import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppData, AppSettings, LunchOption, HistoryRecord } from '@/types';
import { useStorage } from '@/hooks/useStorage';

interface AppContextType {
  data: AppData;
  refreshData: () => Promise<void>;
  addLunchOption: (option: Omit<LunchOption, 'id' | 'createdAt'>) => Promise<void>;
  updateLunchOption: (id: string, updates: Partial<LunchOption>) => Promise<void>;
  deleteLunchOption: (id: string) => Promise<void>;
  addHistory: (selected: string) => Promise<void>;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  clearFavorites: () => Promise<void>;
  clearHistory: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData>({
    lunchOptions: [],
    history: [],
    settings: { theme: 'dark', language: 'zh-TW', excludeRecent: true, excludeDays: 1 },
  });

  const storage = useStorage();

  const refreshData = async () => {
    const newData = await storage.loadData();
    setData(newData);
  };

  const addLunchOption = async (option: Omit<LunchOption, 'id' | 'createdAt'>) => {
    await storage.addLunchOption(option);
    await refreshData();
  };

  const updateLunchOption = async (id: string, updates: Partial<LunchOption>) => {
    await storage.updateLunchOption(id, updates);
    await refreshData();
  };

  const deleteLunchOption = async (id: string) => {
    await storage.deleteLunchOption(id);
    await refreshData();
  };

  const addHistory = async (selected: string) => {
    await storage.addHistory(selected);
    await refreshData();
  };

  const updateSettings = async (settings: Partial<AppSettings>) => {
    await storage.updateSettings(settings);
    await refreshData();
  };

  const clearFavorites = async () => {
    await storage.clearFavorites();
    await refreshData();
  };

  const clearHistory = async () => {
    await storage.clearHistory();
    await refreshData();
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <AppContext.Provider
      value={{
        data,
        refreshData,
        addLunchOption,
        updateLunchOption,
        deleteLunchOption,
        addHistory,
        updateSettings,
        clearFavorites,
        clearHistory,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};