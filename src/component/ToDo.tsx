import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  Categories,
  categoryState,
  IToDo,
  toDoSelector,
  todoState,
} from "../atom";
import styled from "styled-components";
import { useState } from "react";

const TodoWrap = styled.div`
  margin-top: 50px;
  display: flex;
  justify-content: center;
  gap: 30px;
  padding: 0 20px;
  @media all and (max-width: 500px) {
    flex-direction: column;
  }
`;

const ModifyBtn = styled.a`
  padding: 3px 7px !important;
  font-size: 12px !important;
  background-color: #339af0 !important;
  color: white !important;
  border: none !important;
  border-radius: 4px !important;
  cursor: pointer !important;
  transition: background-color 0.2s ease !important;

  &:hover {
    background-color: #1c7ed6;
  }
`;

const TodoItem = styled.div`
  flex: 1;
  min-width: 250px;
  max-width: 300px;
  background-color: #f8f9fa;
  border: 1px solid #dee2e6;
  border-radius: 12px;
  padding: 20px;

  h2 {
    font-size: 22px;
    font-weight: bold;
    text-align: center;
    margin-bottom: 15px;
    color: #343a40;
  }

  ul {
    list-style: none;
    padding: 0;
  }

  li {
    background-color: #ffffff;
    border: 1px solid #ced4da;
    border-radius: 8px;
    padding: 10px;
    margin-bottom: 10px;
    transition: box-shadow 0.2s;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;

    &:hover {
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    }

    span {
      font-size: 16px;
      margin-bottom: 10px;
      color: #212529;
    }

    button {
      padding: 5px 10px;
      font-size: 13px;
      background-color: #e9ecef;
      border: none;
      border-radius: 6px;
      cursor: pointer;
      transition: background-color 0.2s ease;

      &:hover {
        background-color: #adb5bd;
        color: #fff;
      }

      &:last-of-type {
        background-color: #ffc9c9;

        &:hover {
          background-color: #fa5252;
        }
      }
    }
  }
`;


function ToDo() {
  const setToDos = useSetRecoilState(todoState);
  // const toDos = useRecoilValue(todoState);
  const toDos = useRecoilValue(toDoSelector);
  const toDoList = toDos.filter((toDo) => toDo.category === Categories.TO_DO);
  const doingList = toDos.filter((toDo) => toDo.category === Categories.DOING);
  const doneList = toDos.filter((toDo) => toDo.category === Categories.DONE);
  const onClick = (category: IToDo["category"], id: IToDo["id"], text: IToDo["text"]) => {
    setToDos((oldToDos) => {
      const targetIndex = oldToDos.findIndex((indexToDos) => indexToDos.id === id);

      const newToDo = { text, id, category };
      return [...oldToDos.slice(0, targetIndex), newToDo, ...oldToDos.slice(targetIndex + 1)];
    });
  };
  // 삭제
  const onDelete = (id: IToDo["id"]) => {
    setToDos((oldToDos) => {
      const newToDos = oldToDos.filter((toDo) => {
        return toDo.id !== id;
      });
      return newToDos;
    });
  };
  // 수정
  const [modifyingId, setModifyingId] = useState<IToDo["id"] | null>(null);
  const [modifyingState, setModifyingState] = useState(false);
  const [value, setValue] = useState("");
  const onModify = (id: IToDo["id"], currentText: IToDo["text"]) => {
    setModifyingId(id);
    setModifyingState(prev => !prev);
    setValue(currentText);
  };
  const realModify = (id: IToDo["id"]) => {
    setToDos((oldToDos) =>
      oldToDos.map((toDo) =>
        toDo.id === id ? { ...toDo, text: value } : toDo
      )
    );
    setModifyingId(null);
    setValue("");
    setModifyingState(false);
  };

  const changeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  return (
    <>
      <TodoWrap>
        <TodoItem>
          <h2>TO_DO</h2>
          <ul>
            {toDoList?.map(toDo => <li
                key={toDo.id}>
                {modifyingId === toDo.id && modifyingState ? (
                  <div>
                    <input type="text" name="modify" onChange={changeInput}
                           value={value} />
                    <ModifyBtn
                      onClick={() => realModify(toDo.id)}>수정</ModifyBtn>
                  </div>
                ) : <span>{toDo.text}</span>}
                {toDo.category != Categories.TO_DO &&
                  <button
                    onClick={() => onClick(Categories.TO_DO, toDo.id, toDo.text)}>TO_DO</button>}
                {toDo.category != Categories.DOING &&
                  <button
                    onClick={() => onClick(Categories.DOING, toDo.id, toDo.text)}>DOING</button>}
                {toDo.category != Categories.DONE &&
                  <button
                    onClick={() => onClick(Categories.DONE, toDo.id, toDo.text)}>DONE</button>}
                <button onClick={() => onModify(toDo.id, toDo.text)}>modify</button>
                <button onClick={() => onDelete(toDo.id)}>delete</button>
              </li>,
            )}
          </ul>
        </TodoItem>
        <TodoItem>
          <h2>DOING</h2>
          <ul>
            {doingList?.map(doing => <li
                key={doing.id}>
              {modifyingId === doing.id ? (
                <div>
                  <input type="text" name="modify" onChange={changeInput}
                         value={value} />
                  <ModifyBtn
                    onClick={() => realModify(doing.id)}>수정</ModifyBtn>
                </div>
              ) : <span>{doing.text}</span>}
                {doing.category != Categories.TO_DO &&
                  <button
                    onClick={() => onClick(Categories.TO_DO, doing.id, doing.text)}>TO_DO</button>}
                {doing.category != Categories.DOING &&
                  <button
                    onClick={() => onClick(Categories.DOING, doing.id, doing.text)}>DOING</button>}
                {doing.category != Categories.DONE &&
                  <button
                    onClick={() => onClick(Categories.DONE, doing.id, doing.text)}>DONE</button>}
              <button onClick={() => onModify(doing.id, doing.text)}>modify</button>
              <button onClick={() => onDelete(doing.id)}>delete</button>
              </li>,
            )}
          </ul>
        </TodoItem>
        <TodoItem>
          <h2>DONE</h2>
          <ul>
            {doneList?.map(done => <li
                key={done.id}>
              {modifyingId === done.id ? (
                <div>
                  <input type="text" name="modify" onChange={changeInput}
                         value={value} />
                  <ModifyBtn
                    onClick={() => realModify(done.id)}>수정</ModifyBtn>
                </div>
              ) : <span>{done.text}</span>}
                {done.category != Categories.TO_DO &&
                  <button
                    onClick={() => onClick(Categories.TO_DO, done.id, done.text)}>TO_DO</button>}
                {done.category != Categories.DOING &&
                  <button
                    onClick={() => onClick(Categories.DOING, done.id, done.text)}>DOING</button>}
                {done.category != Categories.DONE &&
                  <button
                    onClick={() => onClick(Categories.DONE, done.id, done.text)}>DONE</button>}
              <button onClick={() => onModify(done.id, done.text)}>modify</button>
              <button onClick={() => onDelete(done.id)}>delete</button>
              </li>,
            )}
          </ul>
        </TodoItem>
      </TodoWrap>

    </>
  );
}

export default ToDo;