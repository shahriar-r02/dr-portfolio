import { useState, useEffect } from 'react'
import { db, auth } from '../firebase/config'
import { collection, getDocs, doc, getDoc, addDoc, serverTimestamp } from 'firebase/firestore'
import { Lock, Unlock, FileText, CheckCircle, X, FolderOpen } from 'lucide-react'
import SecurePDFViewer from '../components/SecurePDFViewer'

export default function Note() {
  const [categories, setCategories] = useState([])
  const [notes, setNotes] = useState([])
  const [unlockedCategories, setUnlockedCategories] = useState([])
  const [activeCategory, setActiveCategory] = useState(null)
  const [activeNote, setActiveNote] = useState(null)
  const [loading, setLoading] = useState(true)

  // bKash Checkout Overlay States
  const [showCheckout, setShowCheckout] = useState(null)
  const [bkashNumber, setBkashNumber] = useState('')
  const [trxId, setTrxId] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  useEffect(() => {
    fetchNotesStructure()
  }, [])

  async function fetchNotesStructure() {
    try {
      const catSnap = await getDocs(collection(db, 'noteCategories'))
      const notesSnap = await getDocs(collection(db, 'notes'))
      
      setCategories(catSnap.docs.map(d => ({ id: d.id, ...d.data() })))
      setNotes(notesSnap.docs.map(d => ({ id: d.id, ...d.data() })))

      if (auth.currentUser) {
        const userSnap = await getDoc(doc(db, 'users', auth.currentUser.uid))
        if (userSnap.exists()) {
          setUnlockedCategories(userSnap.data().unlockedNotes || [])
        }
      }
      setLoading(false)
    } catch (err) {
      console.error(err)
      setLoading(false)
    }
  }

  async function handlePaymentSubmit(e) {
    e.preventDefault()
    if (!auth.currentUser) return alert('Please log in to purchase lecture notes.')
    setSubmitting(true)

    try {
      await addDoc(collection(db, 'notePayments'), {
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        categoryId: showCheckout.id,
        categoryTitle: showCheckout.title,
        amount: showCheckout.price,
        bkashNumber,
        trxId: trxId.toUpperCase().trim(),
        status: 'pending',
        createdAt: serverTimestamp()
      })

      setSuccess(true)
      setTimeout(() => {
        setShowCheckout(null)
        setSuccess(false)
        setBkashNumber('')
        setTrxId('')
      }, 2500)
    } catch (err) {
      alert('Submission failed. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return <div className="p-20 text-center text-gray-500">Loading study modules...</div>

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-20">
        
        {/* If no categories exist yet, show a clean, descriptive fallback state */}
        {categories.length === 0 ? (
          <div className="max-w-md mx-auto text-center py-20 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl bg-white dark:bg-gray-800/40 p-8 shadow-sm">
            <FolderOpen size={48} className="mx-auto text-orange-400 mb-4 stroke-1" />
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Notes Coming Soon</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
              Jit Biswas is preparing premium medical notes. Once uploaded by the admin, they will appear here module by module!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Side: Note Directories */}
            <div className="lg:col-span-4 flex flex-col gap-4">
              <h2 className="text-2xl font-bold tracking-tight">Lecture Notes</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 -mt-2">Select a chapter to read or unlock full access.</p>
              
              <div className="flex flex-col gap-4 mt-2">
                {categories.map(cat => {
                  const isUnlocked = unlockedCategories.includes(cat.id)
                  return (
                    <div key={cat.id} className="border border-gray-200 dark:border-gray-800 rounded-2xl p-4 bg-white dark:bg-gray-800/50 backdrop-blur-sm shadow-sm">
                      <div className="flex justify-between items-start gap-3 mb-3">
                        <div>
                          <h3 className="font-bold text-base text-gray-900 dark:text-white">{cat.title}</h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{cat.description}</p>
                        </div>
                        {isUnlocked ? (
                          <span className="text-green-500 p-1.5 bg-green-50 dark:bg-green-950/20 rounded-full text-xs flex items-center gap-1 font-medium">
                            <Unlock size={14} /> Unlocked
                          </span>
                        ) : (
                          <button 
                            onClick={() => setShowCheckout(cat)}
                            className="text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-md transition"
                          >
                            <Lock size={12} /> ৳{cat.price}
                          </button>
                        )}
                      </div>

                      {/* Chapter items under this directory */}
                      <div className="border-t border-gray-100 dark:border-gray-700/60 pt-2 flex flex-col gap-1">
                        {notes.filter(n => n.categoryId === cat.id).map(note => (
                          <button
                            key={note.id}
                            onClick={() => {
                              setActiveCategory(cat)
                              setActiveNote(note)
                            }}
                            className={`w-full text-left p-2.5 rounded-xl text-xs md:text-sm flex items-center gap-2.5 transition ${
                              activeNote?.id === note.id 
                                ? 'bg-orange-500 text-white font-semibold shadow-md shadow-orange-500/10' 
                                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
                            }`}
                          >
                            <FileText size={16} className="flex-shrink-0" />
                            <span className="truncate">{note.title}</span>
                          </button>
                        ))}
                        {notes.filter(n => n.categoryId === cat.id).length === 0 && (
                          <p className="text-xs text-gray-400 italic p-2">No chapters uploaded yet.</p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Right Side: Render View Window */}
            <div className="lg:col-span-8">
              {activeNote ? (
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 md:p-6 rounded-3xl shadow-sm">
                  <div className="mb-4">
                    <span className="text-xs font-bold uppercase text-orange-500 tracking-wider">{activeCategory?.title}</span>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-0.5">{activeNote.title}</h2>
                  </div>
                  <SecurePDFViewer 
                    fileUrl={unlockedCategories.includes(activeCategory.id) ? activeNote.pdfUrl : activeNote.previewUrl}
                    isPreview={!unlockedCategories.includes(activeCategory.id)}
                  />
                </div>
              ) : (
                <div className="h-96 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-3xl flex flex-col items-center justify-center text-gray-400 p-6 text-center">
                  <FileText size={44} className="mb-2 stroke-1 text-gray-300 dark:text-gray-600" />
                  <p className="text-sm font-medium">Select a chapter from the directory tree to start learning.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* bKash Payment Gateway Modal */}
      {showCheckout && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 w-full max-w-md p-6 rounded-3xl shadow-2xl relative border border-gray-100 dark:border-gray-700">
            <button onClick={() => setShowCheckout(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"><X size={20} /></button>
            
            {success ? (
              <div className="text-center py-6">
                <CheckCircle size={52} className="text-green-500 mx-auto mb-3 animate-bounce" />
                <h3 className="text-xl font-bold">Ticket Submitted!</h3>
                <p className="text-xs text-gray-500 mt-1">Access unlocks automatically once admin confirms the TrxID.</p>
              </div>
            ) : (
              <>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white pr-6">Unlock {showCheckout.title}</h3>
                <p className="text-xs text-gray-500 mt-1">Send money via bKash to get full instant access to all present and future chapters.</p>
                
                <div className="bg-orange-50 dark:bg-orange-950/30 p-3.5 rounded-2xl my-4 text-center border border-orange-100 dark:border-orange-900/20">
                  <span className="text-[10px] uppercase tracking-wider text-orange-600 dark:text-orange-400 block font-bold">bKash Personal Number</span>
                  <span className="text-xl font-mono font-bold text-gray-900 dark:text-white tracking-wide">01822496928</span>
                </div>

                <form onSubmit={handlePaymentSubmit} className="flex flex-col gap-3.5">
                  <div>
                    <label className="text-xs font-bold text-gray-600 dark:text-gray-400 block mb-1">Your bKash Wallet Number</label>
                    <input required type="text" placeholder="01XXXXXXXXX" value={bkashNumber} onChange={e => setBkashNumber(e.target.value)} className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent focus:border-orange-500 outline-none" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-600 dark:text-gray-400 block mb-1">Transaction ID (TrxID)</label>
                    <input required type="text" placeholder="8NXXXXXXXX" value={trxId} onChange={e => setTrxId(e.target.value)} className="w-full px-4 py-2 text-sm border border-gray-200 dark:border-gray-700 rounded-xl bg-transparent focus:border-orange-500 outline-none uppercase tracking-wider" />
                  </div>
                  <button type="submit" disabled={submitting} className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-orange-500/10 transition mt-2 disabled:opacity-50">
                    {submitting ? 'Verifying...' : `Confirm Payment — ৳${showCheckout.price}`}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}