# Simple Redux Setup in React + TypeScript

## 1. Install Dependencies

```sh
npm i @reduxjs/toolkit react-redux
```

## 2. Folder Structure

You need to create two folders:
- `/src/features` → Contains feature slices of Redux.
- `/src/app` → Contains the store and custom hooks.

---

## 3. Features (Slices)

### What is a Slice?
A slice is a piece of global state with:
1. An **initial state**
2. **Reducers** (functions that modify the state)
3. **Actions** (functions that trigger reducers)

It is created using `createSlice()` from `@reduxjs/toolkit`.

### What is Inside the Features Folder?
Each feature has its own folder. For example, if we create a counter feature, we will create:

**`/src/features/counter/counterSlice.ts`**

### Creating a Slice

First, import `createSlice` and `PayloadAction`:

```ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
```

Now, use `createSlice` to create a slice:

```ts
const counterSlice = createSlice({
  name: "",
  initialState: {},
  reducers: {},
});
```

A slice requires:
- **name**
- **initial state**
- **reducers**

#### Define Initial State

```ts
interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};
```

#### Why Use an Object as `initialState` Instead of a Number?
1. Allows storing multiple properties, making it scalable.
2. Easier to combine different reducers.

#### What are reducers?
A reducer in Redux is a pure function that takes the current state and an action as input and returns the new state.

reducers is an object which will contain the functions/actions which you will perform on your variable. They receive the current state and action, and return a new state with the updated values. In this example we are creating a reducer which will increament, decrement and add any specifi amount of value to our counter.

```ts
reducers: {
    increamented(state){ //this state refers to the initialState
        state.value += 1; // this happes because of immer
    },
    decrement(state){
        state.value -= 1;
    },
    addAmount(state, action: PayloadAction<number>){
        // here action is an object which will contain a payload which is a number
        state.value += action.payload; // value of the state will change based on the payload we passed
    }
    // more reducers here
}
```

### What is Immer?
Immer is a JavaScript library that helps manage immutable state updates in a simpler and more readable way. It allows you to write mutable-looking code while ensuring that the state remains immutable under the hood.

#### Export Actions and Reducer
After this we will export all reducers as ```counterSlice.actions``` and a default export of ```counterSlice.reducer```;

```ts
export const { incremented, decremented, addAmount } = counterSlice.actions;
export default counterSlice.reducer; //default export because its convention
```

### Final `counterSlice.ts`

```ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

const counterSlice = createSlice({
  name: "counter",
  initialState,
  reducers: {
    incremented(state) {
      state.value += 1;
    },
    decremented(state) {
      state.value -= 1;
    },
    addAmount(state, action: PayloadAction<number>) {
      state.value += action.payload;
    },
  },
});

export const { incremented, decremented, addAmount } = counterSlice.actions;
export default counterSlice.reducer;
```

---

## 4. Setting Up Redux Store

Inside `/src/app`, create:
1. `store.ts` → It is a central area where all the state are stored.
2. `hooks.ts` → Here we will just add types to already existing `useDispatch()` & `useSelector()` hooks.

So, store => stores all state and we use these hooks to manage the state(like updating and retreving value of the state).

### In `store.ts` file

Import dependencies like `configureStore` and reducer:

```ts
import {configureStore} from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";
```

this counterReducer is nothing but ```export default counterSlice.reducer``` which contain the reducers.

now we will configure store using ```configureStore()```.

```ts
export const store = configureStore({
  reducer: {
    counter: counterReducer, 
  }
});

export type AppDispatch = typeof store.dispatch; 
//AppDispatch	Ensures type-safe dispatching of actions.
export type RootState = ReturnType<typeof store.getState>;
//RootState	Ensures type-safe access to the Redux store.
```

### Explanation
##### About AppDispatch
- `store.dispatch` is a function that sends an action to the Redux store, which then runs the appropriate reducer to update the state.
- `AppDispatch` ensures that only valid actions can be dispatched in TypeScript.
###### About RootState
- `store.getState()` returns the entire Redux state.
- `ReturnType<typeof store.getState>` gets the type of the entire state object.
- `RootState` represents the structure of your Redux store.

Store has been configured.

---

### In `hooks.ts` file

In this file we will simply create custom typed hooks of already exisiting `useDispatch` & `useSelector` hooks.

```ts
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

---

## 5. Integrate Redux in `main.tsx`

Wrap `<App />` inside `<Provider>` to make the Redux store available throughout the app.

### `main.tsx`

```ts
import { Provider } from "react-redux";
import { store } from "./app/store";
import App from "./App";

<Provider store={store}>
  <App />
</Provider>
```

---

## 6. Using Redux in `App.tsx`

Import custom hooks from `hooks.ts` and actions from `counterSlice.ts`:

```ts
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { incremented } from "./features/counter/counterSlice";
```

Use `useAppDispatch` and `useAppSelector`:

```ts
const dispatch = useAppDispatch();
const count = useAppSelector((state) => state.counter.value);
```

### Explanation
#### useAppSelector
- a function will be passed inside it which will return us the current state of the variable and we will then store it in a variable.
- `const count = useAppSelector((state) => state.counter.value);` → Selects `value` from the counter state and stores in count variable.
- state –> Represents the entire Redux store (all the data stored in Redux).
- state.counter –> This selects only the counter slice from the store.
- state.counter.value –> This goes even deeper and picks the value property from counter.
#### useAppDispatch
- To use useAppDispatch hook we will call it and assing it to a variable like `const dispatch = useAppDispatch()`.
- This dispatch will help us use any actions/reducers
- Then `dispatch(incremented())` → Calls the `incremented` action.

### Final `App.tsx`

```ts
import "./App.css";
import { useAppDispatch, useAppSelector } from "./app/hooks";
import { incremented } from "./features/counter/counterSlice";

function App() {
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();

  function handleClick() {
    dispatch(incremented());
  }

  return (
    <div className="w-[80%] bg-black mx-auto my-0">
      <button className="text-white" onClick={handleClick}>
        Count is: {count}
      </button>
    </div>
  );
}

export default App;
```

---

## 🎉 Redux Setup Complete!
Your React + TypeScript app now has a fully functional Redux store with a counter feature. 🚀

