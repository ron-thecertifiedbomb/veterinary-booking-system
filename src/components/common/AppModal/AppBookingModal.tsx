import { NoPets, NoSlots } from "@/components/booking";
import BookingForm from "@/components/booking/BookingForm";
import BookingModal from "@/components/booking/BookingModal";
import Loader from "@/components/common/Loader/Loader";
import { Pet } from "@/features/pet/pet.types";


import { Slot } from "@/hooks/appointments/useBookingSystem";
import { formatAppointmentDate } from "@/utils/dateandtime/dateandtimeformatter";
import { useState } from "react";

type Props = {
    pets: Pet[];
    slots?: Slot[];
    date: string;
    creating?: boolean;
    visible: boolean;
    loading: boolean;
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
    loading,
    onClose,
    onSubmit,
}: Props) {

    const [selectedPetId, setSelectedPetId] = useState("");
    const [selectedTime, setSelectedTime] = useState("");
    const [serviceType, setServiceType] = useState("");
    const [notes, setNotes] = useState("");

    const isPetsEmpty = pets.length === 0;
    const noAvailableSlots = slots?.length === 0;

    const modalState: ModalState = isPetsEmpty
        ? "NO_PETS"
        : noAvailableSlots
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
                    <>
                        {loading ? (<Loader />) : (
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
                                        serviceType,
                                        appointmentDate: formatAppointmentDate(date, selectedTime),
                                        notes,
                                    })
                                }
                                handleClose={onClose}
                            />)}
                    </>
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