import { useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Footer from "./components/Footer";
import Clienti from "./components/Clienti";
import Fatture from "./components/Fatture";

import { persistedStore, store } from "./redux/store/store";
import { isLoggedIn } from "./api/authApi";

import "./App.css";

// Protegge le pagine private
function ProtectedRoute({ isUserLogged, children }) {
  if (!isUserLogged) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  const [isUserLogged, setIsUserLogged] = useState(isLoggedIn());

  return (
    <Provider store={store}>
      <PersistGate persistor={persistedStore}>
        <BrowserRouter>
          <div className="min-vh-100 d-flex flex-column">
            <Navbar isUserLogged={isUserLogged} setIsUserLogged={setIsUserLogged} />

            <main className="flex-grow-1">
              <Routes>
                {/*<Route path="/fatture" element={<h1>Fatture</h1>} />
              <Route path="/login" element={<h1>Login</h1>} /> */}
                <Route path="/login" element={isUserLogged ? <Navigate to="/" replace /> : <Login setIsUserLogged={setIsUserLogged} />} />

                <Route
                  path="/"
                  element={
                    <ProtectedRoute isUserLogged={isUserLogged}>
                      <Home />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/clienti"
                  element={
                    <ProtectedRoute isUserLogged={isUserLogged}>
                      <Clienti />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/fatture"
                  element={
                    <ProtectedRoute isUserLogged={isUserLogged}>
                      <Fatture />
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute isUserLogged={isUserLogged}>
                      <Admin />
                    </ProtectedRoute>
                  }
                />

                <Route path="*" element={<Navigate to="/login" replace />} />
              </Routes>
            </main>

            <Footer />
          </div>
        </BrowserRouter>
      </PersistGate>
    </Provider>
  );
}

export default App;
