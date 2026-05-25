import { createContext, useContext, useEffect, useState } from 'react'
import { auth, db } from '../firebase/config'
import { onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [settings, setSettings] = useState({
    about: null,
    book: null,
    contact: null
  })
  const [settingsLoaded, setSettingsLoaded] = useState(false)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setLoading(false)
    })
    return () => unsub()
  }, [])

  useEffect(() => {
    const fetchAllSettings = async () => {
      try {
        const [aboutSnap, bookSnap, contactSnap] = await Promise.all([
          getDoc(doc(db, 'settings', 'about')),
          getDoc(doc(db, 'settings', 'book')),
          getDoc(doc(db, 'settings', 'contact')),
        ])
        setSettings({
          about: aboutSnap.exists() ? aboutSnap.data() : null,
          book: bookSnap.exists() ? bookSnap.data() : null,
          contact: contactSnap.exists() ? contactSnap.data() : null,
        })
      } catch (err) {
        console.log('Settings fetch error:', err)
      }
      setSettingsLoaded(true)
    }
    fetchAllSettings()
  }, [])

  const refreshSettings = async (docId, newData) => {
    setSettings(prev => ({ ...prev, [docId]: newData }))
  }

  return (
    <AuthContext.Provider value={{ user, loading, settings, settingsLoaded, refreshSettings }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}