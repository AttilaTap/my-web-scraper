'use client';

import React from "react";
import Link from "next/link";
import styled from "styled-components";

interface ButtonComponentProps {
  route: string;
  name: string;
  className?: string;
}

const StyledButton = styled.button`
  background: linear-gradient(to bottom, #264653, #2a9d8f); /* Updated background gradient */
  border: 1px solid #e76f51; /* Use a contrasting color for the border */
  padding: 0.5rem 1rem;
  color: white;
  border-radius: 50px;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.2s, box-shadow 0.2s;
  font-family: var(--font-mono);
  font-size: 1rem;
  text-decoration: none;
  text-align: center;
  width: 100%;
  max-width: var(--max-width);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1), 0 6px 6px rgba(0, 0, 0, 0.05), inset 0 -2px 1px rgba(255, 255, 255, 0.1);
  z-index: 2;
  margin: 10px;

  &:hover {
    background: linear-gradient(to bottom, #e9c46a, #f4a261); /* Updated hover background */
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15), 0 8px 8px rgba(0, 0, 0, 0.1), inset 0 -2px 1px rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }

  &:disabled {
    background-color: grey;
    box-shadow: none;
    cursor: not-allowed;
  }
`;

const ButtonComponent: React.FC<ButtonComponentProps> = ({ route, name, className }) => {
  return (
    <Link href={route}>
      <StyledButton className={className}>{name}</StyledButton>
    </Link>
  );
};

export default ButtonComponent;