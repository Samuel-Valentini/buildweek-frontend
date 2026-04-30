import { useEffect, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { login, saveToken } from "../api/authApi"
import "./Login.css"

const Login = ({ setIsUserLogged }) => {
  const navigate = useNavigate()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errore, setErrore] = useState("")
  const [loading, setLoading] = useState(false)

  const [lampOn, setLampOn] = useState(false)
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)

  const startYRef = useRef(0)
  const currentPullRef = useRef(0)

  const MAX_PULL = 38
  const TRIGGER_PULL = 22

  useEffect(() => {
    document.body.classList.add("login-no-scroll")

    return () => {
      document.body.classList.remove("login-no-scroll")
    }
  }, [])

  const getClientY = (event) => {
    if (event.touches && event.touches.length > 0) {
      return event.touches[0].clientY
    }

    if (event.changedTouches && event.changedTouches.length > 0) {
      return event.changedTouches[0].clientY
    }

    return event.clientY
  }

  const startPull = (event) => {
    event.preventDefault()
    setIsPulling(true)
    startYRef.current = getClientY(event)
  }

  useEffect(() => {
    const movePull = (event) => {
      if (!isPulling) return

      const currentY = getClientY(event)
      const diff = currentY - startYRef.current
      const limitedPull = Math.max(0, Math.min(diff, MAX_PULL))

      currentPullRef.current = limitedPull
      setPullDistance(limitedPull)
    }

    const endPull = () => {
      if (!isPulling) return

      if (currentPullRef.current >= TRIGGER_PULL) {
        setLampOn((prev) => !prev)
      }

      setIsPulling(false)
      setPullDistance(0)
      currentPullRef.current = 0
    }

    window.addEventListener("pointermove", movePull)
    window.addEventListener("pointerup", endPull)

    window.addEventListener("mousemove", movePull)
    window.addEventListener("mouseup", endPull)

    window.addEventListener("touchmove", movePull, { passive: false })
    window.addEventListener("touchend", endPull)
    window.addEventListener("touchcancel", endPull)

    return () => {
      window.removeEventListener("pointermove", movePull)
      window.removeEventListener("pointerup", endPull)

      window.removeEventListener("mousemove", movePull)
      window.removeEventListener("mouseup", endPull)

      window.removeEventListener("touchmove", movePull)
      window.removeEventListener("touchend", endPull)
      window.removeEventListener("touchcancel", endPull)
    }
  }, [isPulling])

  const handleLogin = async (e) => {
    e.preventDefault()

    setErrore("")
    setLoading(true)

    try {
      const token = await login(email, password)
      saveToken(token)
      setIsUserLogged(true)
      navigate("/")
    } catch (error) {
      setErrore(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className={`lamp-login-page ${lampOn ? "lamp-on" : ""}`}>
      <div className="lamp-login-overlay"></div>

      <div className="creative-bg">
        <div className="creative-grid"></div>
      </div>

      <div className="global-light"></div>

      <div className="login-scene">
        <div className="login-intro-text">
          <span>EpiEnergy Portal</span>

          <h1>Gestisci energia, clienti e fatture in modo semplice.</h1>

          <p>Accedi alla tua area riservata e controlla tutto da un unico posto.</p>
        </div>

        <div className="lamp-side">
          <div className="lamp-box">
            <div className="lamp-glow"></div>
            <div className="lamp-halo"></div>

            <div className="desk-lamp">
              <div className="lamp-shade"></div>
              <div className="lamp-stem"></div>
              <div className="lamp-base"></div>

              <div className="lamp-cord-wrap" style={{ transform: `translateY(${pullDistance}px)` }}>
                <div className="lamp-cord-line"></div>

                <button
                  type="button"
                  className="lamp-cord-knob"
                  onPointerDown={startPull}
                  onMouseDown={startPull}
                  onTouchStart={startPull}
                  aria-label="Tira la cordicella"
                ></button>
              </div>
            </div>

            {!lampOn && <p className="lamp-tip">Tira la cordicella verso il basso</p>}
          </div>
        </div>

        <div className={`login-card ${lampOn ? "show-card" : ""}`}>
          <div className="login-card-inner">
            <h2>Welcome</h2>
            <p className="login-subtitle">Sign in to continue</p>

            {errore && <div className="login-error">{errore}</div>}

            <form onSubmit={handleLogin}>
              <div className="login-field">
                <label htmlFor="email">Email</label>

                <input id="email" type="email" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>

              <div className="login-field">
                <label htmlFor="password">Password</label>

                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? "Signing In..." : "Sign In"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Login
