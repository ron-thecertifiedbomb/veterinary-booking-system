import BookingModal from "@/components/booking/BookingModal";
import DateSelector from "@/components/booking/DateSelector";
import { getTodayDate } from "@/utils/date";
import { useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createBooking } from "@/features/booking/api";

export default function Home() {
    const [date, setDate] = useState(getTodayDate());

    const [showModal, setShowModal] = useState(false);


    return (
        <SafeAreaView className="flex-1 bg-background">
            <View className="max-w-md mx-auto w-full px-6 py-10">
                <DateSelector
                    date={date}
                    onDateChange={setDate}
                    onContinue={() => setShowModal(true)}
                />
            </View>
            <BookingModal
                visible={showModal}
                onClose={() => setShowModal(false)}
                onSubmit={(data) => console.log(data)}
            />



        </SafeAreaView>
    );
}