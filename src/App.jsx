import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./components/NavBar"
import Home from "./components/Home"
import "./App.css"
import { Provider } from "react-redux"
import { persistedStore, store } from "./redux/store/store"
import { PersistGate } from "redux-persist/integration/react"
import Footer from "./components/Footer"
import Clienti from "./components/Clienti"

function App() {
  return (
    <>
      <Provider store={store}>
        <PersistGate persistor={persistedStore}>
          <BrowserRouter>
            <Navbar />
            <div className="min-vh-100 d-flex flex-column">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/clienti" element={<h1>Clienti</h1>} />
                {/*<Route path="/fatture" element={<h1>Fatture</h1>} />
              <Route path="/login" element={<h1>Login</h1>} /> */}
              </Routes>
            </div>
            <Footer />
          </BrowserRouter>
        </PersistGate>
      </Provider>
    </>
  )
}

export default App
