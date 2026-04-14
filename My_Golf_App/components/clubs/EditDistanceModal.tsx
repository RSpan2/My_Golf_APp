import { useState } from 'react';
import { Modal, Pressable, Text, TextInput, View } from 'react-native';

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
      <Pressable className="flex-1 bg-black/60 justify-center items-center" onPress={onClose}>
        <Pressable
          className="bg-gray-900 rounded-2xl p-6 w-72 border border-gray-700"
          onPress={() => {}}
        >
          <Text className="text-white text-lg font-semibold mb-1">{clubName}</Text>
          <Text className="text-gray-400 text-sm mb-4">{statLabel} (yards)</Text>

          <TextInput
            className="bg-gray-800 text-white text-center text-2xl font-bold rounded-lg py-3 px-4 mb-5"
            keyboardType="number-pad"
            value={input}
            onChangeText={setInput}
            onSubmitEditing={handleSave}
            returnKeyType="done"
            placeholder="—"
            placeholderTextColor="#6b7280"
            maxLength={4}
            autoFocus
          />

          <View className="flex-row gap-2">
            <Pressable
              className="flex-1 py-3 rounded-lg bg-gray-700 items-center active:bg-gray-600"
              onPress={() => { setInput(''); onSave(undefined); }}
            >
              <Text className="text-gray-300 font-medium">Clear</Text>
            </Pressable>
            <Pressable
              className="flex-1 py-3 rounded-lg bg-green-700 items-center active:bg-green-600"
              onPress={handleSave}
            >
              <Text className="text-white font-semibold">Enter</Text>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default EditDistanceModal;
