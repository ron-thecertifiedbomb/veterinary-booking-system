type CardContentProps = {
    children: React.ReactNode;
    className?: string;
};

export function CardContent({
    children,
    className = "",
}: CardContentProps) {
    return (
        <div className={`p-4 ${className}`}>
            {children}
        </div>
    );
}