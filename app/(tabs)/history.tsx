import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useApp } from '@/contexts/AppContext';
import { lightTheme, darkTheme } from '@/constants/themes';
import { translations } from '@/constants/translations';
import { CyberCard } from '@/components/CyberCard';
import { CyberButton } from '@/components/CyberButton';
import { NeonText } from '@/components/NeonText';
import { HistoryRecord } from '@/types';

export default function HistoryScreen() {
  const { data, clearHistory } = useApp();
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('all');
  const theme = data.settings.theme === 'dark' ? darkTheme : lightTheme;
  const t = translations[data.settings.language];

  const getFilteredHistory = (): HistoryRecord[] => {
    const now = new Date();
    const today = now.toISOString().split('T')[0];
    const weekStart = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    switch (filter) {
      case 'today':
        return data.history.filter(record => record.date === today);
      case 'week':
        return data.history.filter(record => new Date(record.date) >= weekStart);
      default:
        return data.history;
    }
  };

  const handleClearHistory = () => {
    Alert.alert(
      t.clearHistory,
      t.confirmClear,
      [
        { text: t.cancel, style: 'cancel' },
        { text: t.confirm, style: 'destructive', onPress: clearHistory },
      ]
    );
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    
    if (dateString === today.toISOString().split('T')[0]) {
      return t.today;
    } else if (dateString === yesterday.toISOString().split('T')[0]) {
      return '昨天';
    } else {
      return date.toLocaleDateString(data.settings.language);
    }
  };

  const filteredHistory = getFilteredHistory();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <NeonText size={28} style={styles.title}>
          {t.lunchHistory}
        </NeonText>
        {data.history.length > 0 && (
          <CyberButton
            title={t.clearHistory}
            onPress={handleClearHistory}
            variant="danger"
            size="small"
          />
        )}
      </View>

      <View style={styles.filterSection}>
        <View style={styles.filterButtons}>
          <CyberButton
            title={t.all}
            onPress={() => setFilter('all')}
            variant={filter === 'all' ? 'primary' : 'secondary'}
            size="small"
            style={styles.filterButton}
          />
          <CyberButton
            title={t.thisWeek}
            onPress={() => setFilter('week')}
            variant={filter === 'week' ? 'primary' : 'secondary'}
            size="small"
            style={styles.filterButton}
          />
          <CyberButton
            title={t.today}
            onPress={() => setFilter('today')}
            variant={filter === 'today' ? 'primary' : 'secondary'}
            size="small"
            style={styles.filterButton}
          />
        </View>
      </View>

      <ScrollView style={styles.content}>
        {filteredHistory.length > 0 ? (
          filteredHistory.map((record) => (
            <CyberCard key={record.id} style={styles.historyCard}>
              <View style={styles.historyHeader}>
                <NeonText size={18} style={styles.historyName}>
                  {record.selected}
                </NeonText>
                <Text style={[styles.historyDate, { color: theme.textSecondary }]}>
                  {formatDate(record.date)}
                </Text>
              </View>
              <View style={styles.historyMeta}>
                <Text style={[styles.historyTime, { color: theme.textSecondary }]}>
                  {new Date(record.timestamp).toLocaleTimeString(data.settings.language, {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
            </CyberCard>
          ))
        ) : (
          <CyberCard style={styles.emptyCard}>
            <View style={styles.emptyContent}>
              <NeonText size={18} color={theme.textSecondary} glow={false}>
                {t.noHistory}
              </NeonText>
              <Text style={[styles.emptyDesc, { color: theme.textSecondary }]}>
                開始抽選午餐後，歷史記錄將會出現在這裡
              </Text>
            </View>
          </CyberCard>
        )}
      </ScrollView>

      {data.history.length > 0 && (
        <CyberCard style={styles.statsCard}>
          <View style={styles.statsContent}>
            <View style={styles.statItem}>
              <NeonText size={20} color={theme.neonBlue}>
                {data.history.length}
              </NeonText>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                總抽選次數
              </Text>
            </View>
            <View style={styles.statItem}>
              <NeonText size={20} color={theme.neonPurple}>
                {new Set(data.history.map(h => h.selected)).size}
              </NeonText>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                不同餐廳
              </Text>
            </View>
            <View style={styles.statItem}>
              <NeonText size={20} color={theme.neonPink}>
                {data.history.filter(h => h.date === new Date().toISOString().split('T')[0]).length}
              </NeonText>
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                今日抽選
              </Text>
            </View>
          </View>
        </CyberCard>
      )}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontWeight: 'bold',
  },
  filterSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  filterButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  filterButton: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  historyCard: {
    marginBottom: 12,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  historyName: {
    fontWeight: 'bold',
    maxWidth: '85%',
  },
  historyDate: {
    fontSize: 14,
  },
  historyMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  historyTime: {
    fontSize: 12,
  },
  emptyCard: {
    marginTop: 20,
  },
  emptyContent: {
    alignItems: 'center',
    gap: 10,
  },
  emptyDesc: {
    fontSize: 14,
    textAlign: 'center',
  },
  statsCard: {
    margin: 20,
  },
  statsContent: {
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