import { Link, useLocation } from 'react-router-dom'
import './Header.css'

function Header() {
  const location = useLocation()

  return (
    <header className="header">
      <h1>Junk Journal</h1>
      <nav>
        <Link 
          to="/" 
          className={location.pathname === '/' ? 'active' : ''}
        >
          Journal
        </Link>
        <span> | </span>
        <Link 
          to="/stats" 
          className={location.pathname === '/stats' ? 'active' : ''}
        >
          Stats
        </Link>
      </nav>
    </header>
  )
}

export default Header
