import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { lightTheme, darkTheme } from '@/constants/themes';
import { translations } from '@/constants/translations';
import { CyberCard } from '@/components/CyberCard';
import { CyberButton } from '@/components/CyberButton';
import { NeonText } from '@/components/NeonText';
import { LunchOption } from '@/types';

export default function HomeScreen() {
  const { data, addHistory } = useApp();
  const [selectedOption, setSelectedOption] = useState<LunchOption | null>(
    null
  );
  const [finalOption, setFinalOption] = useState<LunchOption | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const theme = data.settings.theme === 'dark' ? darkTheme : lightTheme;
  const t = translations[data.settings.language];

  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (finalOption) {
      scaleAnim.setValue(0.8);
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        friction: 5,
      }).start();
    }
  }, [finalOption]);
  const getFilteredOptions = (): LunchOption[] => {
    if (!data.settings.excludeRecent) {
      return data.lunchOptions;
    }

    const excludeDays = data.settings.excludeDays;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - excludeDays);

    const recentSelections = data.history
      .filter((record) => new Date(record.date) > cutoffDate)
      .map((record) => record.selected);

    return data.lunchOptions.filter(
      (option) => !recentSelections.includes(option.name)
    );
  };

  const drawLunch = async () => {
    const availableOptions = getFilteredOptions();

    if (availableOptions.length === 0) {
      Alert.alert(t.noOptionsTitle, t.noOptionsDesc);
      return;
    }

    setIsDrawing(true);
    setSelectedOption(null);
    setFinalOption(null);

    let currentIndex = 0;
    const totalSteps = 30 + Math.floor(Math.random() * 20);
    let delay = 50;

    const spin = async (step: number) => {
      setSelectedOption(availableOptions[currentIndex]);
      currentIndex = (currentIndex + 1) % availableOptions.length;

      if (step < totalSteps) {
        const nextDelay = delay + step * 5;
        setTimeout(() => spin(step + 1), nextDelay);
      } else {
        const finalOption =
          availableOptions[
            (currentIndex - 1 + availableOptions.length) %
              availableOptions.length
          ];
        setSelectedOption(finalOption);
        setFinalOption(finalOption);
        await addHistory(finalOption.name);
        setIsDrawing(false);
      }
    };

    spin(0);
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.header}>
        <NeonText size={28} style={styles.title}>
          {t.lunchSelector}
        </NeonText>
      </View>

      <View style={styles.content}>
        <CyberCard style={styles.resultCard} neonColor={theme.neonBlue}>
          <View style={styles.resultContent}>
            {selectedOption ? (
              <>
                <NeonText size={20} color={theme.neonBlue}>
                  {t.todaySelection}
                </NeonText>
                <NeonText
                  size={32}
                  style={styles.selectedName}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {selectedOption.name}
                </NeonText>
              </>
            ) : (
              <NeonText size={18} color={theme.textSecondary} glow={false}>
                {data.lunchOptions.length === 0
                  ? t.noOptionsTitle
                  : '點擊按鈕開始抽選'}
              </NeonText>
            )}
          </View>
        </CyberCard>

        <View style={styles.drawSection}>
          <CyberButton
            title={isDrawing ? '抽籤中...' : t.drawButton}
            onPress={drawLunch}
            size="large"
            style={styles.drawButton}
          />
        </View>

        <CyberCard style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <NeonText size={24} color={theme.neonPurple}>
                {data.lunchOptions.length}
              </NeonText>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                總選項
              </Text>
            </View>
            <View style={styles.statItem}>
              <NeonText size={24} color={theme.neonPink}>
                {getFilteredOptions().length}
              </NeonText>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                可選項
              </Text>
            </View>
            <View style={styles.statItem}>
              <NeonText size={24} color={theme.neonBlue}>
                {data.history.length}
              </NeonText>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                歷史記錄
              </Text>
            </View>
          </View>
        </CyberCard>

        {data.settings.excludeRecent && (
          <CyberCard style={styles.settingsCard}>
            <View style={styles.settingRow}>
              <Text style={[styles.settingText, { color: theme.text }]}>
                {t.excludeRecent}
              </Text>
              <NeonText size={14} color={theme.neonBlue}>
                {data.settings.excludeDays} 天內
              </NeonText>
            </View>
          </CyberCard>
        )}

        {finalOption && (
          <Animated.View
            style={{
              transform: [{ scale: scaleAnim }],
              alignItems: 'flex-start',
            }}
          >
            <CyberCard
              style={
                (styles.resultCard,
                {
                  paddingTop: 6,
                  alignItems: 'flex-start',
                  width: '100%',
                })
              }
              neonColor={theme.neonBlue}
            >
              <NeonText size={32} style={styles.selectedName}>
                {finalOption.name}
              </NeonText>

              {/* 顯示詳細資訊 */}
              {finalOption.type && (
                <Text style={styles.selectedDetail}>🍱 {finalOption.type}</Text>
              )}
              {finalOption.location && (
                <Text style={styles.selectedDetail}>
                  📍 {finalOption.location}
                </Text>
              )}
              {'liked' in finalOption && (
                <Text style={styles.selectedDetail}>
                  {finalOption.liked ? '❤️ 喜歡的' : '💔 普通'}
                </Text>
              )}
            </CyberCard>
          </Animated.View>
        )}
      </View>
    </ScrollView>
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
  },
  title: {
    fontWeight: 'bold',
    marginBottom: 20,
    maxWidth: '90%',
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  resultCard: {
    marginBottom: 30,
    minHeight: 150,
    width: '100%',
  },
  resultContent: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },
  selectedName: {
    fontWeight: 'bold',
    marginVertical: 10,
    textAlign: 'center',
  },
  selectedType: {
    fontSize: 16,
    fontStyle: 'italic',
  },
  selectedDetail: {
    fontSize: 14,
    marginTop: 4,
    color: '#aaa',
    textAlign: 'center',
  },
  drawSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  drawButton: {
    minWidth: 200,
    width: '100%',
  },
  statsCard: {
    marginBottom: 20,
  },
  statsRow: {
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
  settingsCard: {
    marginBottom: 20,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
  },
});
