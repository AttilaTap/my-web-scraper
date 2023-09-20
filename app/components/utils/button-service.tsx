import React from "react";
import Link from "next/link";

interface ButtonComponentProps {
  route: string;
  name: string;
}

const ButtonComponent: React.FC<ButtonComponentProps> = ({ route, name }) => {
  return (
    <Link href={route}>
      <button style={{ margin: "10px" }}>{name}</button>
    </Link>
  );
};

export default ButtonComponent;
