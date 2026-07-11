import AddPetForm from "@/components/common/Pets/AddPetForm";
import AppSafeArea from "@/components/common/AppSafeArea/AppSafeArea";

export default function AddPetScreen() {
  return (
    <AppSafeArea scroll>
      <AddPetForm />
    </AppSafeArea>
  );
}
