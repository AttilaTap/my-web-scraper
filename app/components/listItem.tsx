import styled from "styled-components";

const ListItem = styled.li`
  margin: 0.5rem 0;
  counter-increment: my-awesome-counter;
  &:before {
    content: counter(my-awesome-counter) ". ";
    font-weight: bold;
  }
`;

export default ListItem;