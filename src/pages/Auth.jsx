import { useState } from 'react'
import { auth, googleProvider } from '../firebase/config'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth'
import { useNavigate } from 'react-router-dom'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'

function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [resetMsg, setResetMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setResetMsg('')
    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password)
      } else {
        const result = await createUserWithEmailAndPassword(auth, email, password)
        await updateProfile(result.user, { displayName: name })
      }
      navigate('/')
    } catch (err) {
      if (err.code === 'auth/user-not-found') setError('No account found with this email.')
      else if (err.code === 'auth/wrong-password') setError('Wrong password. Try again.')
      else if (err.code === 'auth/email-already-in-use') setError('Email already registered. Please login.')
      else if (err.code === 'auth/weak-password') setError('Password must be at least 6 characters.')
      else if (err.code === 'auth/invalid-email') setError('Please enter a valid email address.')
      else setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  const handleGoogle = async () => {
    setLoading(true)
    setError('')
    try {
      await signInWithPopup(auth, googleProvider)
      navigate('/')
    } catch (err) {
      setError('Google sign in failed. Please try again.')
    }
    setLoading(false)
  }

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first.')
      return
    }
    try {
      await sendPasswordResetEmail(auth, email)
      setResetMsg('Password reset email sent! Check your inbox.')
      setError('')
    } catch (err) {
      setError('Could not send reset email. Check your email address.')
    }
  }

  return (
    <div className="pt-24 px-6 pb-16 min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="p-8 rounded-3xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 shadow-xl">

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">
              {isLogin ? 'Login to buy books and watch lectures' : 'Sign up to get started'}
            </p>
          </div>

          <button
            onClick={handleGoogle}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition shadow-sm mb-6"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.6 20H24v8h11.3C33.6 33.1 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20c11 0 19.7-8 19.7-20 0-1.3-.1-2.7-.1-4z"/>
              <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.5 15.1 18.9 12 24 12c3 0 5.8 1.1 7.9 3l5.7-5.7C34.1 6.5 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7z"/>
              <path fill="#4CAF50" d="M24 44c5.2 0 9.9-1.9 13.5-5l-6.2-5.2C29.4 35.5 26.8 36 24 36c-5.2 0-9.6-3-11.3-7.3l-6.5 5C9.5 39.5 16.3 44 24 44z"/>
              <path fill="#1976D2" d="M43.6 20H24v8h11.3c-.9 2.4-2.5 4.5-4.6 5.8l6.2 5.2C41 35.8 44 30.3 44 24c0-1.3-.1-2.7-.4-4z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
            <span className="text-sm text-gray-500 dark:text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200 dark:bg-gray-600" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative">
                <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your full name" required
                  className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-white/40 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400" />
              </div>
            )}

            <div className="relative">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" required
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-white/40 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400" />
            </div>

            <div className="relative">
              <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required
                className="w-full pl-11 pr-11 py-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-white/40 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {isLogin && (
              <div className="text-right">
                <button type="button" onClick={handleForgotPassword} className="text-sm text-orange-500 hover:underline">
                  Forgot Password?
                </button>
              </div>
            )}

            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800">
                <p className="text-red-600 dark:text-red-400 text-sm">{error}</p>
              </div>
            )}

            {resetMsg && (
              <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <p className="text-green-600 dark:text-green-400 text-sm">{resetMsg}</p>
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold transition shadow-lg shadow-orange-200 disabled:opacity-50">
              {loading ? 'Please wait...' : isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-600 dark:text-gray-300 mt-6 text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button onClick={() => { setIsLogin(!isLogin); setError(''); setResetMsg('') }}
              className="text-orange-500 font-medium ml-1 hover:underline">
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>

        </div>
      </div>
    </div>
  )
}

export default Auth