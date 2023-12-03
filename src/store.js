import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers';
import Cookies from 'js-cookie';
import { setToken } from './utils/fetchFromAPI';


const loadState = () => {
  try {
    const serializedState = Cookies.get('reduxState');
    if (serializedState === undefined) {
      return undefined;
    }
    const state = JSON.parse(serializedState);

    if (state && state.accessToken) {
      
      setToken(state.accessToken);
    }
    return state;
  } catch (err) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    Cookies.set('reduxState', serializedState);
  } catch (err) {
  }
};

const preloadedState = loadState();

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production',
  preloadedState,
});

store.subscribe(() => {
  const state = store.getState();
  saveState(state);
});

export default store;
