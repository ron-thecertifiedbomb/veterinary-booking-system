import { NoPets, NoSlots } from "@/components/booking";
import BookingForm from "@/components/booking/BookingForm";
import BookingModal from "@/components/booking/BookingModal";
import { Slot } from "@/features/appointment/types";
import { Pet } from "@/features/pet/types";
import { useState } from "react";

type Props = {
    pets: Pet[];
    slots: Slot[];
    date: string;
    creating?: boolean;
    visible: boolean;
    onClose: () => void;
    onSubmit: (data: any) => void;
};

type ModalState = "NO_PETS" | "NO_SLOTS" | "FORM";

export default function AppBookingModal({
    pets,
    slots,
    date,
    creating = false,
    visible,
    onClose,
    onSubmit,
}: Props) {

    const [selectedPetId, setSelectedPetId] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [serviceType, setServiceType] = useState("");
    const [notes, setNotes] = useState("");
    const availableSlots = slots.filter((s) => s.available);
    const isPetsEmpty = pets.length === 0;
    const isSlotsEmpty = availableSlots.length === 0;

    const modalState: ModalState = isPetsEmpty
        ? "NO_PETS"
        : isSlotsEmpty
            ? "NO_SLOTS"
            : "FORM";

    const renderContent = () => {
        switch (modalState) {
            case "NO_PETS":
                return <NoPets />;
            case "NO_SLOTS":
                return <NoSlots />;

            case "FORM":
                return (
                    <BookingForm
                        pets={pets}
                        slots={slots}
                        date={date}
                        selectedPetId={selectedPetId}
                        selectedTime={selectedTime}
                        serviceType={serviceType}
                        notes={notes}
                        setSelectedPetId={setSelectedPetId}
                        setSelectedTime={setSelectedTime}
                        setServiceType={setServiceType}
                        setNotes={setNotes}
                        creating={creating}
                        handleSubmit={() =>
                            onSubmit({
                                petId: selectedPetId,
                                petName:
                                    pets.find((p) => p.id === selectedPetId)?.petName || "",
                                serviceType,
                                appointmentDate: new Date(date).toISOString(),
                                appointmentTime: selectedTime, 
                                notes,
                            })
                        }
                        handleClose={onClose}
                    />
                );
            default:
                return null;
        }
    };
    return (
        <BookingModal visible={visible} onClose={onClose}>
            {renderContent()}
        </BookingModal>
    );
}