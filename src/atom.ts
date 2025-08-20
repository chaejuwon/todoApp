import { atom, selector } from "recoil";

export enum Categories {
  "TO_DO" = "TO_DO",
  "DOING" = "DOING",
  "DONE" = "DONE"
}

export interface IToDo {
  text: string;
  id: number;
  category: Categories;
}

const localStorageKey = "my-todo-list";

export const todoState = atom<IToDo[]>({
  key: "todoState",
  default: [],
  effects_UNSTABLE: [
    ({ setSelf, onSet }) => {
      // 1) 초기 로드
      const stored = localStorage.getItem(localStorageKey);
      if (stored != null) {
        try {
          setSelf(JSON.parse(stored));
        } catch {
          setSelf([]);
        }
      }

      // 2) 값이 바뀔 때 저장
      onSet((newValue, _, isReset) => {
        if (isReset) {
          localStorage.removeItem(localStorageKey);
        } else {
          localStorage.setItem(localStorageKey, JSON.stringify(newValue));
        }
      });
    },
  ],
});

export const categoryState = atom<Categories>({
  key: "categoryState",
  default: Categories.TO_DO
});

export const toDoSelector = selector({
  key: "toDoSelector",
  get: ({ get }) => {
    const toDos = get(todoState);
    const category = get(categoryState);
    // 카테고리별 필터링이 필요하면 여기서 해도 됨
    return toDos;
  },
});