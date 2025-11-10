import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import HomePage from './pages/Home'
import Login from './pages/LogIn'
import Signup from './pages/SignUp'
import ProfilePage from './pages/Profile'
import BalancePage from './pages/Balance'
import EventsPage from './pages/Events'
import CreateEventPage from './pages/CreateEvents'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/balance" element={<BalancePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path='/create-event' element={<CreateEventPage />} />
        </Routes>
      </Router>
    </QueryClientProvider>
  )
}

export default App