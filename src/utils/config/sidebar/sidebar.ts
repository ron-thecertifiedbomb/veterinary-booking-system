// ..\src\utils\config\sidebar\sidebar.ts

export const adminNav = [
  { label: "Dashboard", href: "/admin/dashboard" },

  // { label: "Staff Management", href: "/admin/staff" },
  // { label: "Customer Management", href: "/admin/customers" },
  { label: "Users Management", href: "/admin/users" },
  { label: "Appointments", href: "/admin/appointments" },
  { label: "Patients", href: "/(admin-web)/patients" },

  { label: "Reports", href: "/(admin-web)/reports" },
  { label: "Analytics", href: "/(admin-web)/analytics" },

  { label: "Settings", href: "/admin/profile" },
];

export const customerNav = [
  { label: "Home", href: "/(web)/home" },
  { label: "Appointments", href: "/(web)/appointments" },
  { label: "Pets", href: "/(web)/pets" },
  { label: "Profile", href: "/(web)/profile" },
];
