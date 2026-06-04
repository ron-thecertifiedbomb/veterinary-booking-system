import Appointments from "@/components/common/Appointments/Appointments";
import AppSafeArea from "@/components/common/AppSafeArea/AppSafeArea";
import { SafeAreaView } from "react-native-safe-area-context";


export default function AppointmentsScreen() {

    return (
      <AppSafeArea>
        <Appointments />
             </AppSafeArea>
    );
}