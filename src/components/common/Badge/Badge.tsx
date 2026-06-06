
type BadgeProps = {
    children: React.ReactNode;
    className?: string;
    variant?: "default" | "success" | "secondary" | "destructive";
};

export function Badge({
    children,
    className = "",
    variant = "default",
}: BadgeProps) {
    const variants = {
        default: "bg-slate-900 text-white",
        success: "bg-green-500 text-white",
        secondary: "bg-gray-200 text-gray-800",
        destructive: "bg-red-500 text-white",
    };

    return (
        <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
        >
            {children}
        </span>
    );
}
