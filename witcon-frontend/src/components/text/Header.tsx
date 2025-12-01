import type { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface HeaderProps {
  children?: ReactNode;
  className?: string;
}

export default function Header({ children, className = "" }: HeaderProps) {
  return (
<h1 className={twMerge("text-4xl text-primary-pink font-bukhari antialiased", className)}>{children}</h1>
  );
}
