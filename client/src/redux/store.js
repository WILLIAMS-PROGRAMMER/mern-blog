import { configureStore, combineReducers} from '@reduxjs/toolkit'
import  userReducer from './user/userSlice.js'
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import persistStore from 'redux-persist/es/persistStore';

const rootReducer = combineReducers({
  user: userReducer
});

const persistConfig = {
  key: 'root',
  storage,
  version: 1,
}

const persistedReducer = persistReducer(persistConfig, rootReducer); // this is the root reducer that we will use in the store

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ // this is for removing the serializable check warning
    serializableCheck: false,
  }),
});

//this is the persistor that we will use to persist the store, in the main.jsx we will use it to wrap the provider
export const persistor = persistStore(store);
