import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Sun, Moon, Menu, X, User, LogOut, FileText } from 'lucide-react'
import { auth } from '../firebase/config'
import { signOut } from 'firebase/auth'
import { useAuth } from '../context/AuthContext'

function Navbar({ darkMode, setDarkMode }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [showDropdown, setShowDropdown] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user && user.email === 'jitbiswas204@gmail.com') {
      setIsAdmin(true)
    } else {
      setIsAdmin(false)
    }
  }, [user])

  const handleLogout = async () => {
    await signOut(auth)
    setShowDropdown(false)
    navigate('/')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-md bg-white/30 dark:bg-gray-900/30 border-b border-white/20 dark:border-gray-700/20 shadow-sm">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        <Link to="/" className="text-xl font-bold text-gray-800 dark:text-white">
          Jit <span className="text-orange-500">Biswas</span>
        </Link>

        {/* Desktop Navigation Row */}
        <div className="hidden md:flex items-center gap-8">
          <Link to="/" className="text-gray-700 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400 transition font-medium">Home</Link>
          <Link to="/about" className="text-gray-700 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400 transition font-medium">About</Link>
          <Link to="/book" className="text-gray-700 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400 transition font-medium">Book</Link>
          <Link to="/notes" className="text-gray-700 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400 transition font-medium">Notes</Link>
          <Link to="/blog" className="text-gray-700 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400 transition font-medium">Blog</Link>
          <Link to="/videos" className="text-gray-700 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400 transition font-medium">Lectures</Link>
          <Link to="/contact" className="text-gray-700 dark:text-gray-200 hover:text-orange-500 dark:hover:text-orange-400 transition font-medium">Contact</Link>
          {isAdmin && (
            <Link to="/admin" className="text-orange-500 hover:text-orange-600 font-medium transition">Admin</Link>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full bg-white/40 dark:bg-gray-700/40 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 text-gray-700 dark:text-gray-200 hover:scale-110 transition"
          >
            {darkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-4 py-2 bg-white/40 dark:bg-gray-700/40 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 rounded-full hover:bg-white/60 transition"
              >
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center">
                    <span className="text-white text-xs font-bold">
                      {(user.displayName || user.email || 'U')[0].toUpperCase()}
                    </span>
                  </div>
                )}
                <span className="hidden md:block text-sm font-medium text-gray-700 dark:text-gray-200 max-w-24 truncate">
                  {user.displayName || user.email?.split('@')[0]}
                </span>
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 py-2 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 z-50">
                  <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>
                  <Link to="/profile" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-700 transition text-sm">
                    <User size={16} className="text-orange-500" /> My Profile
                  </Link>
                  <Link to="/notes" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-770 transition text-sm">
                    <FileText size={16} className="text-orange-500" /> Lecture Notes
                  </Link>
                  <Link to="/order" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-700 transition text-sm">
                    <span className="text-orange-500">📦</span> Buy Book
                  </Link>
                  <Link to="/videos" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-700 transition text-sm">
                    <span className="text-orange-500">🎬</span> Lectures
                  </Link>
                  {isAdmin && (
                    <Link to="/admin" onClick={() => setShowDropdown(false)} className="flex items-center gap-3 px-4 py-2 text-orange-500 hover:bg-orange-50 dark:hover:bg-gray-700 transition text-sm font-medium">
                      <span>⚙️</span> Admin Panel
                    </Link>
                  )}
                  <div className="border-t border-gray-100 dark:border-gray-700 my-1" />
                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition text-sm">
                    <LogOut size={16} /> Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/auth" className="hidden md:flex items-center gap-2 px-5 py-2 bg-white/40 dark:bg-gray-700/40 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 text-gray-700 dark:text-gray-200 rounded-full font-medium hover:bg-white/60 transition">
              <User size={16} /> Login
            </Link>
          )}

          <Link to="/order" className="hidden md:block px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium transition shadow-lg shadow-orange-200 dark:shadow-orange-900">
            Buy Book
          </Link>

          <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden text-gray-700 dark:text-gray-200">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Collapse View Layout */}
      {menuOpen && (
        <div className="md:hidden mt-4 pb-4 flex flex-col gap-4 px-4">
          <Link to="/" onClick={() => setMenuOpen(false)} className="text-gray-700 dark:text-gray-200 hover:text-orange-500 font-medium">Home</Link>
          <Link to="/about" onClick={() => setMenuOpen(false)} className="text-gray-700 dark:text-gray-200 hover:text-orange-500 font-medium">About</Link>
          <Link to="/book" onClick={() => setMenuOpen(false)} className="text-gray-700 dark:text-gray-200 hover:text-orange-500 font-medium">Book</Link>
          <Link to="/notes" onClick={() => setMenuOpen(false)} className="text-gray-700 dark:text-gray-200 hover:text-orange-500 font-medium">Notes</Link>
          <Link to="/blog" onClick={() => setMenuOpen(false)} className="text-gray-700 dark:text-gray-200 hover:text-orange-500 font-medium">Blog</Link>
          <Link to="/videos" onClick={() => setMenuOpen(false)} className="text-gray-700 dark:text-gray-200 hover:text-orange-500 font-medium">Lectures</Link>
          <Link to="/contact" onClick={() => setMenuOpen(false)} className="text-gray-700 dark:text-gray-200 hover:text-orange-500 font-medium">Contact</Link>
          {isAdmin && (
            <Link to="/admin" onClick={() => setMenuOpen(false)} className="text-orange-500 font-medium">Admin</Link>
          )}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-4 space-y-3">
            {user ? (
              <>
                <div className="flex items-center gap-3 pb-2">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center">
                      <span className="text-white text-sm font-bold">
                        {(user.displayName || user.email || 'U')[0].toUpperCase()}
                      </span>
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white text-sm">{user.displayName || user.email?.split('@')[0]}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.email}</p>
                  </div>
                </div>
                <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
                  <User size={16} className="text-orange-500" /> My Profile
                </Link>
                <Link to="/notes" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
                  <FileText size={16} className="text-orange-500" /> Lecture Notes
                </Link>
                <button onClick={() => { handleLogout(); setMenuOpen(false) }} className="flex items-center gap-2 text-red-500 font-medium">
                  <LogOut size={16} /> Logout
                </button>
              </>
            ) : (
              <Link to="/auth" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 text-gray-700 dark:text-gray-200 font-medium">
                <User size={16} className="text-orange-500" /> Login / Sign Up
              </Link>
            )}
            <Link to="/order" onClick={() => setMenuOpen(false)} className="w-full text-center px-5 py-2 bg-orange-500 text-white rounded-full font-medium block">
              Buy Book
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar