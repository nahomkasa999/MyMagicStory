import React from "react";

export default function TemplateDetailLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="w-[50%] m-auto">
            {children}
        </div>
    );
}
