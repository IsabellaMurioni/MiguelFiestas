import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/Home'
import LoginPage from './pages/LogIn'
import SignupPage from './pages/SignUp'
import EventsPage from './pages/Events'
import BalancePage from './pages/Balance'
import ProfilePage from './pages/Profile'

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/balance" element={<BalancePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
    </Router>
  )
}
