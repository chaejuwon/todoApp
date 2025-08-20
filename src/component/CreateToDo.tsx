import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { useForm } from "react-hook-form";
import { categoryState, todoState } from "../atom";
import styled from "styled-components";
import { useEffect } from "react";
// import ToDoSelect from "./ToDoSelect";

interface FormProps {
  toDo: string,
}
const Wrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  margin: 100px auto 0;
  width: 100%;
  max-width: 600px;
  padding: 20px;
`;

const Title = styled.h1`
  color: ${props => props.theme.textColor};
  font-size: 48px;
  margin-bottom: 20px;
`;

const Divider = styled.hr`
  width: 100%;
  margin-bottom: 30px;
  border: 1px solid #dee2e6;
`;

const Form = styled.form`
  display: flex;
  gap: 10px;
  width: 100%;
  justify-content: center;

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 15px;
  }
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  font-size: 16px;
  border: 1px solid #ced4da;
  border-radius: 8px;
  background-color: #f8f9fa;
  transition: border-color 0.2s ease;

  &:focus {
    outline: none;
    border-color: #339af0;
    background-color: #ffffff;
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  font-size: 16px;
  background-color: #339af0;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #1c7ed6;
  }
`;

function CreateToDo() {
  const setToDos = useSetRecoilState(todoState);
  const category = useRecoilValue(categoryState);
  const { register, handleSubmit, setValue } = useForm<FormProps>();
  const onValid = ({ toDo }: FormProps) => {
    setToDos((oldTodDos) => [{
      text: toDo,
      id: Date.now(),
      category: category,
    }, ...oldTodDos]);
    setValue("toDo", "");

  };
  return (
    <Wrapper>
      <Title>Todo List</Title>
      <Divider />
      <Form onSubmit={handleSubmit(onValid)}>
        <Input {...register("toDo", { required: "Please write a to do" })} placeholder="Write a to do" />
        <Button type="submit">Add</Button>
      </Form>
    </Wrapper>
  );

}

export default CreateToDo;