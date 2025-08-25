import React, { ReactNode } from "react";

export default function CreateTemplateLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <section className="m-auto w-[40%]">
      {children}
    </section>
  );
}
