import './App.css'
import { AuthProvider } from './contexts/AuthContext'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import VenuesPage from './pages/VenuesPage'
import ChecklistPage from './pages/ChecklistPage'
import BudgetPage from './pages/BudgetPage'
import './i18n'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/venues" element={<VenuesPage />} />
        <Route path="/checklist" element={<ChecklistPage />} />
        <Route path="/budget" element={<BudgetPage />} />
      </Routes>
    </Router>
  )
}

const AppWithAuth = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  )
}

export default AppWithAuth
