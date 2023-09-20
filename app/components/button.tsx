import styled from "styled-components";

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  margin-right: 1rem;
  cursor: pointer;
  &:disabled {
    background-color: grey;
  }
`;

export default Button;
