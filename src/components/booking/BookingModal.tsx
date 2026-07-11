import { Modal, ScrollView, Pressable, useWindowDimensions, View } from "react-native";

type Props = {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
};

export default function BookingModal({ visible, onClose, children }: Props) {
  const { width } = useWindowDimensions();
  const isLargeScreen = width >= 768;

  return (
    <Modal visible={visible} animationType="fade" transparent onRequestClose={onClose}>
      <View
        className={`flex-1 bg-black/30 ${
          isLargeScreen ? "justify-center items-center px-4" : "justify-end"
        }`}
      >
        <Pressable
          className={isLargeScreen ? "absolute inset-0" : "flex-1"}
          onPress={onClose}
        />

        <View
          className={`bg-surface border border-border ${
            isLargeScreen
              ? "w-full max-w-lg rounded-xl p-3"
              : "rounded-t-2xl px-4 pt-4 pb-8 max-h-[90%] border-b-0"
          }`}
        >
          {!isLargeScreen && (
            <View className="w-10 h-1 bg-border rounded-full self-center mb-4" />
          )}

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20, paddingTop: 4 }}
            keyboardShouldPersistTaps="handled"
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
