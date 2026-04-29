import { BrowserRouter, Route, Routes } from "react-router-dom";

import "./App.css";
import { Provider } from "react-redux";
import { persistedStore, store } from "./redux/store/store";
import { PersistGate } from "redux-persist/integration/react";

function App() {
    return (
        <>
            <Provider store={store}>
                <PersistGate persistor={persistedStore}>
                    <BrowserRouter>
                        <Routes>
                            <Route
                                path="/"
                                element={
                                    <h1 className="btn btn-danger">Titolo</h1>
                                }
                            />
                        </Routes>
                    </BrowserRouter>
                </PersistGate>
            </Provider>
        </>
    );
}

export default App;
