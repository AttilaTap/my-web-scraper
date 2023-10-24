import React from "react";
import Link from "next/link";

interface ButtonComponentProps {
  route: string;
  name: string;
  className?: string;  // Allow className as an optional prop
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({ route, name, className }) => {
  return (
    <Link href={route}>
      <button className={className} style={{ margin: "10px" }}>{name}</button>
    </Link>
  );
};

export default ButtonComponent;

