import { combineReducers, createStore, applyMiddleware } from "redux";
import { v1 as uuid } from "uuid";
import thunk from "redux-thunk";
import logger from "redux-logger";
import { composeWithDevTools } from "redux-devtools-extension";
import { Todo } from "./type";

// constants
const CREATE_TODO = 'CREATE_TODO';
const EDIT_TODO = 'EDIT_TODO';
const TOGGLE_TODO = 'TOGGLE_TODO';
const DELETE_TODO = 'DELETE_TODO';
const SELECT_TODO = 'SELECT_TODO';

// Actions and Action types
interface createToDoActionType {
    type: typeof CREATE_TODO;
    payload: Todo
}

export const createToDoActionCreator = ({ desc }: {
    desc: string;
}): createToDoActionType => {
    return {
        type: CREATE_TODO,
        payload: {
            id: uuid(),
            desc,
            isComplete: false
        }
    };
};

interface editToDoActionType {
    type: typeof EDIT_TODO;
    payload: { id: string, desc: string }
}

export const editToDoActionCreator = ({ id, desc }: {
    id: string, desc: string;
}): editToDoActionType => {
    return {
        type: EDIT_TODO,
        payload: {
            id,
            desc
        }
    };
};

interface toggleToDoActionType {
    type: typeof TOGGLE_TODO;
    payload: { id: string, isComplete: boolean }
}

export const toggleToDoActionCreator = ({ id, isComplete }: {
    id: string, isComplete: boolean;
}): toggleToDoActionType => {
    return {
        type: TOGGLE_TODO,
        payload: {
            id,
            isComplete
        }
    };
};

interface deleteToDoActionType {
    type: typeof DELETE_TODO;
    payload: { id: string }
}

export const deleteToDoActionCreator = ({ id }: {
    id: string
}): deleteToDoActionType => {
    return {
        type: DELETE_TODO,
        payload: {
            id
        }
    };
};

interface selectToDoActionType {
    type: typeof SELECT_TODO;
    payload: { id: string }
}

export const selectToDoActionCreator = ({ id }: {
    id: string
}): selectToDoActionType => {
    return {
        type: SELECT_TODO,
        payload: {
            id
        }
    };
};

// Reducers

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

type ToDoActionTypes = createToDoActionType | editToDoActionType | toggleToDoActionType | deleteToDoActionType;
const toDosReducer = (state: Todo[] = todosInitialState, action: ToDoActionTypes) => {
    switch (action.type) {
        case CREATE_TODO: {
            const { payload } = action;
            return [...state, payload];
        }
        case EDIT_TODO: {
            const { payload } = action;
            return state.map(todo => todo.id === payload.id ? { ...todo, desc: payload.desc } : todo);
        }
        case TOGGLE_TODO: {
            const { payload } = action;
            return state.map(todo => todo.id === payload.id ? { ...todo, isComplete: payload.isComplete } : todo);
        }
        case DELETE_TODO: {
            const { payload } = action;
            return state.filter(todo => todo.id !== payload.id);
        }
        default:
            return state;
    }
};

type SelectedToDoActionTypes = selectToDoActionType;
const selectedTodosReducer = (state: string | null = null, action: SelectedToDoActionTypes) => {
    switch (action.type) {
        case SELECT_TODO: {
            const { payload } = action;
            return payload.id;
        }
        default:
            return state;
    }
};

const counterReducer = (state: number = 0, action: ToDoActionTypes) => {
    switch (action.type) {
        case CREATE_TODO: {
            return state + 1;
        }
        case EDIT_TODO: {
            return state + 1;
        }
        case TOGGLE_TODO: {
            return state + 1;
        }
        case DELETE_TODO: {
            return state + 1;
        }
        default:
            return state;
    }
};

const reducers = combineReducers({
    todos: toDosReducer,
    selectedTodo: selectedTodosReducer,
    counter: counterReducer
});

// Store
export default createStore(reducers,
    composeWithDevTools(
        applyMiddleware(thunk, logger)
    ));