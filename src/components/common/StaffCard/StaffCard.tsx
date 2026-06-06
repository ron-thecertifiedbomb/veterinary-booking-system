

import { Badge } from "@/components/common/Badge/Badge";
import { Card } from "@/components/common/Card/Card";
import { CardContent } from "@/components/common/CardContent/CardContent";
import { AuthenticatedUser } from "@/features/auth/types/auth.types";

import { Phone, Mail, User } from "lucide-react";


type StaffCardProps = {
    staff: AuthenticatedUser;
   
};

type StaffGridProps = {

    staffList: AuthenticatedUser[];
};



export function StaffCard({ staff }: StaffCardProps) {

    return (
        <Card className="p-4 rounded-2xl shadow-sm hover:shadow-md transition">
            <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-slate-800">
                        {staff.name}
                    </h3>
                    <Badge className={`${staff.isActive ? "bg-green-500" : "bg-gray-400"} text-white`}>
                        {staff.isActive ? "Active" : "Inactive"}
                    </Badge>
                </div>

                <p className="text-sm text-slate-500 flex items-center gap-2">
                    <User size={16} /> {staff.staffProfile?.position}
                </p>

                <p className="text-sm text-slate-500">
                    Specialization: <span className="font-medium">{staff.staffProfile?.specialization}</span>
                </p>

                <p className="text-sm text-slate-500">
                    License: <span className="font-medium">{staff.staffProfile?.licenseNumber}</span>
                </p>

                <div className="pt-2 space-y-1">
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                        <Mail size={14} /> {staff.email}
                    </p>
                    <p className="text-sm text-slate-600 flex items-center gap-2">
                        <Phone size={14} /> {staff.phone}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

// Grid wrapper for list usage
export default function StaffGrid({ staffList }: StaffGridProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {staffList.map((staff) => (
                <StaffCard key={staff.id} staff={staff} />
            ))}
        </div>
    );
}

