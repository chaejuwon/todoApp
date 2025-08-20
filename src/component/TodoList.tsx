import CreateToDo from "./CreateToDo";
import ToDo from "./ToDo";
import styled from "styled-components";

const Wrapper = styled.div`
  padding:0 30px;
`;

function TodoList() {
  return (
    <Wrapper>
      <CreateToDo />
      <ToDo />
    </Wrapper>
  );
}

export default TodoList;