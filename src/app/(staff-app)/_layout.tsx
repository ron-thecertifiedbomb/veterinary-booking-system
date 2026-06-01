
// src/app/(staff-app)/_layout.tsx

import ProtectedLayout from "@/components/common/ProtectedLayout/ProtectedLayout";


export default function StaffLayout() {
    return <ProtectedLayout role="STAFF" />;
}
