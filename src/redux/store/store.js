import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import localStorage from "redux-persist/lib/storage";
import { dataReducer } from "../reducers/reducers";

const persistConfig = {
    storage: localStorage,
    key: "root",
};

const superReducer = combineReducers({ data: dataReducer });

const persistedReducer = persistReducer(persistConfig, superReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => {
        return getDefaultMiddleware({ serializableCheck: false });
    },
});

export const persistedStore = persistStore(store);
