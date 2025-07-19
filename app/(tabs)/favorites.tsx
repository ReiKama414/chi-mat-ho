import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Plus, CreditCard as Edit2, Trash2 } from 'lucide-react-native';
import { useApp } from '@/contexts/AppContext';
import { lightTheme, darkTheme } from '@/constants/themes';
import { translations } from '@/constants/translations';
import { CyberCard } from '@/components/CyberCard';
import { CyberButton } from '@/components/CyberButton';
import { NeonText } from '@/components/NeonText';
import { LunchOption } from '@/types';

export default function FavoritesScreen() {
  const { data, addLunchOption, updateLunchOption, deleteLunchOption } =
    useApp();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingOption, setEditingOption] = useState<LunchOption | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    location: '',
    liked: false,
  });
  const theme = data.settings.theme === 'dark' ? darkTheme : lightTheme;
  const t = translations[data.settings.language];

  const openModal = (option?: LunchOption) => {
    if (option) {
      setEditingOption(option);
      setFormData({
        name: option.name,
        type: option.type,
        location: option.location || '',
        liked: option.liked,
      });
    } else {
      setEditingOption(null);
      setFormData({
        name: '',
        type: '',
        location: '',
        liked: false,
      });
    }
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      Alert.alert('錯誤', '請輸入餐廳名稱');
      return;
    }

    if (editingOption) {
      await updateLunchOption(editingOption.id, formData);
    } else {
      await addLunchOption(formData);
    }
    setModalVisible(false);
  };

  const handleDelete = async (id: string) => {
    Alert.alert(t.deleteOption, t.confirmClear, [
      { text: t.cancel, style: 'cancel' },
      {
        text: t.delete,
        style: 'destructive',
        onPress: () => deleteLunchOption(id),
      },
    ]);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <NeonText size={28} style={styles.title}>
          {t.myLunchOptions}
        </NeonText>
        <CyberButton
          title={t.addNew}
          onPress={() => openModal()}
          style={styles.addButton}
        >
          <Plus size={24} color={theme.text} />
        </CyberButton>
      </View>

      <ScrollView style={styles.content}>
        {data.lunchOptions.map((option) => (
          <CyberCard key={option.id} style={styles.optionCard}>
            <View style={styles.optionHeader}>
              <View style={styles.optionInfo}>
                <NeonText
                  size={18}
                  style={styles.optionName}
                >
                  {option.name}
                </NeonText>
                <Text
                  style={[styles.optionType, { color: theme.textSecondary }]}
                >
                  {option.type}
                </Text>
                {option.location && (
                  <Text
                    style={[
                      styles.optionLocation,
                      { color: theme.textSecondary },
                    ]}
                  >
                    📍 {option.location}
                  </Text>
                )}
              </View>
              <View style={styles.optionActions}>
                <CyberButton
                  title=""
                  onPress={() => openModal(option)}
                  style={styles.iconButton}
                >
                  <Edit2 size={16} color={theme.text} />
                </CyberButton>
                <CyberButton
                  title=""
                  onPress={() => handleDelete(option.id)}
                  variant="danger"
                  style={styles.iconButton}
                >
                  <Trash2 size={16} color={theme.text} />
                </CyberButton>
              </View>
            </View>
            {option.liked && (
              <View style={styles.likedBadge}>
                <Text style={[styles.likedText, { color: theme.neonPink }]}>
                  ❤️ {t.liked}
                </Text>
              </View>
            )}
          </CyberCard>
        ))}

        {data.lunchOptions.length === 0 && (
          <CyberCard style={styles.emptyCard}>
            <View style={styles.emptyContent}>
              <NeonText size={18} color={theme.textSecondary} glow={false}>
                {t.noOptionsDesc}
              </NeonText>
              <CyberButton
                title={t.addNew}
                onPress={() => openModal()}
                style={styles.emptyButton}
              />
            </View>
          </CyberCard>
        )}
      </ScrollView>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View
            style={[styles.modalContent, { backgroundColor: theme.surface }]}
          >
            <NeonText size={20} style={styles.modalTitle}>
              {editingOption ? t.editOption : t.addNew}
            </NeonText>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                {t.restaurantName}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                value={formData.name}
                onChangeText={(text) =>
                  setFormData({ ...formData, name: text })
                }
                placeholder="請輸入餐廳名稱"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                {t.foodType}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                value={formData.type}
                onChangeText={(text) =>
                  setFormData({ ...formData, type: text })
                }
                placeholder="例如：中式、日式、速食"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={[styles.label, { color: theme.text }]}>
                {t.location}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.background,
                    borderColor: theme.border,
                    color: theme.text,
                  },
                ]}
                value={formData.location}
                onChangeText={(text) =>
                  setFormData({ ...formData, location: text })
                }
                placeholder="例如：公司附近、家附近"
                placeholderTextColor={theme.textSecondary}
              />
            </View>

            <View style={styles.formGroup}>
              <CyberButton
                title={formData.liked ? '喜歡' : '普通'}
                onPress={() =>
                  setFormData({ ...formData, liked: !formData.liked })
                }
                variant={formData.liked ? 'primary' : 'secondary'}
              />
            </View>

            <View style={styles.modalActions}>
              <CyberButton
                title={t.cancel}
                onPress={() => setModalVisible(false)}
                variant="secondary"
                style={styles.modalButton}
              />
              <CyberButton
                title={t.save}
                onPress={handleSave}
                style={styles.modalButton}
              />
            </View>
          </View>
        </View>
      </Modal>
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
  addButton: {
    paddingHorizontal: 12,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  optionCard: {
    marginBottom: 16,
  },
  optionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  optionInfo: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 4,
    alignItems: 'flex-start',
    justifyContent: 'center',
    marginRight: 8,
    height: '100%',
  },
  optionName: {
    fontWeight: 'bold',
    maxWidth: '90%',
  },
  optionType: {
    fontSize: 14,
    marginTop: 4,
    maxWidth: '90%',
  },
  optionLocation: {
    fontSize: 12,
    marginTop: 2,
    maxWidth: '90%',
  },
  optionActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  likedBadge: {
    marginTop: 8,
  },
  likedText: {
    fontSize: 12,
  },
  emptyCard: {
    marginTop: 20,
  },
  emptyContent: {
    alignItems: 'center',
    gap: 20,
  },
  emptyButton: {
    marginTop: 10,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    borderRadius: 12,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  modalActions: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
  },
});
