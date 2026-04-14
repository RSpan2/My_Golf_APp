import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

interface EditDistanceModalProps {
  visible: boolean;
  clubName: string;
  statLabel: string;
  currentValue: number | undefined;
  onSave: (value: number | undefined) => void;
  onClose: () => void;
}

const EditDistanceModal = ({
  visible,
  clubName,
  statLabel,
  currentValue,
  onSave,
  onClose,
}: EditDistanceModalProps) => {
  const [input, setInput] = useState(currentValue !== undefined ? String(currentValue) : '');

  const handleOpen = () => {
    setInput(currentValue !== undefined ? String(currentValue) : '');
  };

  const handleSave = () => {
    const parsed = parseInt(input, 10);
    onSave(isNaN(parsed) || input.trim() === '' ? undefined : parsed);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onShow={handleOpen}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.card} onPress={() => {}}>
          <Text style={styles.clubName}>{clubName}</Text>
          <Text style={styles.statLabel}>{statLabel} (yards)</Text>

          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSave}
            returnKeyType="done"
            placeholder="—"
            placeholderTextColor="#4b5563"
            maxLength={4}
            autoFocus
            textAlign="center"
          />

          <View style={styles.buttonRow}>
            <Pressable
              style={({ pressed }) => [styles.btn, styles.btnClear, pressed && styles.btnClearPressed]}
              onPress={() => { setInput(''); onSave(undefined); }}
            >
              <Text style={styles.btnClearText}>Clear</Text>
            </Pressable>
            <Pressable
              style={({ pressed }) => [styles.btn, styles.btnSave, pressed && styles.btnSavePressed]}
              onPress={handleSave}
            >
              <Text style={styles.btnSaveText}>Save</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default EditDistanceModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 24,
    width: 300,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  clubName: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    color: '#6b7280',
    fontSize: 13,
    marginBottom: 20,
  },
  input: {
    backgroundColor: '#242424',
    color: '#ffffff',
    fontSize: 36,
    fontWeight: '700',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#2a2a2a',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  btn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnClear: {
    backgroundColor: '#242424',
  },
  btnClearPressed: {
    backgroundColor: '#2e2e2e',
  },
  btnClearText: {
    color: '#9ca3af',
    fontSize: 15,
    fontWeight: '600',
  },
  btnSave: {
    backgroundColor: '#16a34a',
  },
  btnSavePressed: {
    backgroundColor: '#15803d',
  },
  btnSaveText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
  },
});
