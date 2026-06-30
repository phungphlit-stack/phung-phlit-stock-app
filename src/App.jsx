import { useState } from 'react'
import './App.css'

export default function App() {
  const [pin, setPin] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [error, setError] = useState('')

  const handlePinSubmit = (e) => {
    e.preventDefault()
    if (pin === '4510') {
      setIsLoggedIn(true)
      setError('')
    } else {
      setError('PIN ไม่ถูกต้อง')
      setPin('')
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h1>ผึ้งผลิต</h1>
          <p className="subtitle">Stock Management System</p>
          <form onSubmit={handlePinSubmit}>
            <input
              type="password"
              maxLength="4"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="กรอก PIN"
              className="pin-input"
              autoFocus
            />
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn-login">เข้าสู่ระบบ</button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>ผึ้งผลิต Stock App</h1>
        <button 
          className="btn-logout"
          onClick={() => {
            setIsLoggedIn(false)
            setPin('')
          }}
        >
          ออกจากระบบ
        </button>
      </header>
      <main className="app-main">
        <p>สวัสดี! ยินดีต้อนรับเข้าสู่ระบบจัดการสต็อก</p>
      </main>
    </div>
  )
}
