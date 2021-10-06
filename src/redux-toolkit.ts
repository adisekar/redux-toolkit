import { createSlice, PayloadAction, configureStore, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { v1 as uuid } from 'uuid';
import { Todo } from './type';

const todosInitialState: Todo[] = [
    {
        id: uuid(),
        desc: "Learn React",
        isComplete: true
    },
    {
        id: uuid(),
        desc: "Learn Redux",
        isComplete: true
    },
    {
        id: uuid(),
        desc: "Learn Redux-ToolKit",
        isComplete: false
    }
];

export const fetchTodos = createAsyncThunk('todos/getTodos', async () => {
    const response = await axios.get('https://jsonplaceholder.typicode.com/todos');
    const data: any[] = response.data;

    const todos = data.map(d => {
        return { id: uuid(), desc: d.title, isComplete: d.complete } as Todo
    });
    return todos;
});


const todosSlice = createSlice({
    name: 'todos',
    initialState: todosInitialState,
    reducers: {
        create: {
            reducer: (state, { payload }: PayloadAction<{ id: string, desc: string, isComplete: boolean }>) => {
                state.push(payload);
            },
            prepare: ({ desc }: { desc: string }) => ({
                payload: {
                    id: uuid(),
                    desc,
                    isComplete: false
                }
            })
        },
        edit: (state, { payload }: PayloadAction<{ id: string, desc: string }>) => {
            const todoToEdit = state.find(todo => todo.id === payload.id);
            if (todoToEdit) {
                todoToEdit.desc = payload.desc;
            }
        },
        toggle: (state, { payload }: PayloadAction<{ id: string, isComplete: boolean }>) => {
            const todoToToggle = state.find(todo => todo.id === payload.id);
            if (todoToToggle) {
                todoToToggle.isComplete = payload.isComplete;
            }
        },
        remove: (state, { payload }: PayloadAction<{ id: string }>) => {
            state.filter(todo => todo.id !== payload.id);
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchTodos.pending, () => todosInitialState)
            .addCase(fetchTodos.fulfilled, (state, { payload }) => [...state, ...payload])
            .addCase(fetchTodos.rejected, () => todosInitialState)
        // .addDefaultCase((state, action) => { })
    }
});


const selectedToDoSlice = createSlice({
    name: 'selectedTodo',
    initialState: null as string | null,
    reducers: {
        select: (state, { payload }: PayloadAction<{ id: string }>) => payload.id
    }
});

const counterSlice = createSlice({
    name: 'counter',
    initialState: 0,
    reducers: {},
    extraReducers: {
        [todosSlice.actions.create.type]: state => state + 1,
        [todosSlice.actions.edit.type]: state => state + 1,
        [todosSlice.actions.toggle.type]: state => state + 1,
        [todosSlice.actions.remove.type]: state => state + 1
    }
});

export const {
    create: createToDoActionCreator,
    edit: editToDoActionCreator,
    toggle: toggleToDoActionCreator,
    remove: deleteToDoActionCreator
} = todosSlice.actions;

export const {
    select: selectToDoActionCreator
} = selectedToDoSlice.actions;

const reducer = {
    todos: todosSlice.reducer,
    selectedTodo: selectedToDoSlice.reducer,
    counter: counterSlice.reducer
};

export default configureStore({
    reducer
});