import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Switch,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { lightTheme, darkTheme } from '@/constants/themes';
import { translations } from '@/constants/translations';
import { CyberCard } from '@/components/CyberCard';
import { CyberButton } from '@/components/CyberButton';
import { NeonText } from '@/components/NeonText';
import { AppSettings } from '@/types';

export default function SettingsScreen() {
  const { data, updateSettings, clearFavorites, clearHistory } = useApp();
  const theme = data.settings.theme === 'dark' ? darkTheme : lightTheme;
  const t = translations[data.settings.language];

  const handleThemeChange = (isDark: boolean) => {
    updateSettings({ theme: isDark ? 'dark' : 'light' });
  };

  const handleLanguageChange = (language: AppSettings['language']) => {
    updateSettings({ language });
  };

  const handleClearFavorites = () => {
    Alert.alert(t.clearFavorites, t.confirmClear, [
      { text: t.cancel, style: 'cancel' },
      { text: t.confirm, style: 'destructive', onPress: clearFavorites },
    ]);
  };

  const handleClearHistory = () => {
    Alert.alert(t.clearHistory, t.confirmClear, [
      { text: t.cancel, style: 'cancel' },
      { text: t.confirm, style: 'destructive', onPress: clearHistory },
    ]);
  };

  const handleExcludeRecentChange = (value: boolean) => {
    updateSettings({ excludeRecent: value });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <NeonText size={28} style={styles.title}>
          {t.settings}
        </NeonText>
      </View>

      <ScrollView style={styles.content}>
        {/* Theme Settings */}
        <CyberCard style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <NeonText size={18} style={styles.settingTitle}>
              {t.themeMode}
            </NeonText>
          </View>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              夜間模式
            </Text>
            <Switch
              value={data.settings.theme === 'dark'}
              onValueChange={handleThemeChange}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={theme.text}
            />
          </View>
        </CyberCard>

        {/* Language Settings */}
        <CyberCard style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <NeonText size={18} style={styles.settingTitle}>
              {t.language}
            </NeonText>
          </View>
          <View style={styles.languageButtons}>
            <CyberButton
              title="繁體中文"
              onPress={() => handleLanguageChange('zh-TW')}
              variant={
                data.settings.language === 'zh-TW' ? 'primary' : 'secondary'
              }
              size="small"
              style={styles.languageButton}
            />
            <CyberButton
              title="简体中文"
              onPress={() => handleLanguageChange('zh-CN')}
              variant={
                data.settings.language === 'zh-CN' ? 'primary' : 'secondary'
              }
              size="small"
              style={styles.languageButton}
            />
            <CyberButton
              title="English"
              onPress={() => handleLanguageChange('en')}
              variant={
                data.settings.language === 'en' ? 'primary' : 'secondary'
              }
              size="small"
              style={styles.languageButton}
            />
          </View>
        </CyberCard>

        {/* Exclusion Settings */}
        <CyberCard style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <NeonText size={18} style={styles.settingTitle}>
              抽選設定
            </NeonText>
          </View>
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, { color: theme.text }]}>
              {t.excludeRecent}
            </Text>
            <Switch
              value={data.settings.excludeRecent}
              onValueChange={handleExcludeRecentChange}
              trackColor={{ false: theme.border, true: theme.primary }}
              thumbColor={theme.text}
            />
          </View>
          {data.settings.excludeRecent && (
            <View style={styles.excludeDaysSection}>
              <Text
                style={[styles.settingLabel, { color: theme.textSecondary }]}
              >
                排除 {data.settings.excludeDays} 天內的選項
              </Text>
              <View style={styles.dayButtons}>
                {[1, 2, 3, 7].map((days) => (
                  <CyberButton
                    key={days}
                    title={`${days}天`}
                    onPress={() => updateSettings({ excludeDays: days })}
                    variant={
                      data.settings.excludeDays === days
                        ? 'primary'
                        : 'secondary'
                    }
                    size="small"
                    style={styles.dayButton}
                  />
                ))}
              </View>
            </View>
          )}
        </CyberCard>

        {/* Data Management */}
        <CyberCard style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <NeonText size={18} style={styles.settingTitle}>
              {t.dataManagement}
            </NeonText>
          </View>
          <View style={styles.dataButtons}>
            <CyberButton
              title={t.clearFavorites}
              onPress={handleClearFavorites}
              variant="danger"
              size="small"
              style={styles.dataButton}
            />
            <CyberButton
              title={t.resetHistory}
              onPress={handleClearHistory}
              variant="danger"
              size="small"
              style={styles.dataButton}
            />
          </View>
        </CyberCard>

        {/* App Info */}
        <CyberCard style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <NeonText size={18} style={styles.settingTitle}>
              {t.about}
            </NeonText>
          </View>
          <View style={styles.appInfo}>
            <Text style={[styles.appInfoText, { color: theme.text }]}>
              吃乜好？ ChiMatHo
            </Text>
            <Text style={[styles.appInfoText, { color: theme.textSecondary }]}>
              版本 1.0.0
            </Text>
            <Text style={[styles.appInfoText, { color: theme.textSecondary }]}>
              完全前端運作，資料儲存在本地
            </Text>

            <View
              style={{
                marginTop: 12,
                display: 'flex',
                flexDirection: 'column',
                gap: 8,
              }}
            >
              <TouchableOpacity
                onPress={() => Linking.openURL('https://github.com/ReiKama414')}
              >
                <Text style={[styles.appInfoText, { color: theme.primary }]}>
                  🔗 Github
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  Linking.openURL('https://reikama-414-site-v3.vercel.app')
                }
              >
                <Text style={[styles.appInfoText, { color: theme.primary }]}>
                  🐾 ReiKama414 Site
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </CyberCard>

        {/* Stats */}
        <CyberCard style={styles.settingCard}>
          <View style={styles.settingHeader}>
            <NeonText size={18} style={styles.settingTitle}>
              使用統計
            </NeonText>
          </View>
          <View style={styles.statsGrid}>
            <View style={styles.statItem}>
              <NeonText size={20} color={theme.neonBlue}>
                {data.lunchOptions.length}
              </NeonText>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                收藏選項
              </Text>
            </View>
            <View style={styles.statItem}>
              <NeonText size={20} color={theme.neonPurple}>
                {data.history.length}
              </NeonText>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                抽選記錄
              </Text>
            </View>
            <View style={styles.statItem}>
              <NeonText size={20} color={theme.neonPink}>
                {data.lunchOptions.filter((o) => o.liked).length}
              </NeonText>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                喜愛選項
              </Text>
            </View>
          </View>
        </CyberCard>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  settingCard: {
    marginBottom: 16,
  },
  settingHeader: {
    marginBottom: 12,
  },
  settingTitle: {
    fontWeight: 'bold',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  settingLabel: {
    fontSize: 16,
  },
  languageButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  languageButton: {
    flex: 1,
  },
  excludeDaysSection: {
    marginTop: 12,
  },
  dayButtons: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
  },
  dayButton: {
    flex: 1,
  },
  dataButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  dataButton: {
    flex: 1,
  },
  appInfo: {
    gap: 4,
  },
  appInfoText: {
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});
