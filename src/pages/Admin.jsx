import { useState, useEffect } from 'react'
import { db, auth, storage } from '../firebase/config'
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc, serverTimestamp, getDoc, setDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { CheckCircle, Truck, Trash2, Lock, LogOut, Plus, X, Save, Edit3, Upload } from 'lucide-react'

function Admin() {
  const [loggedIn, setLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [orders, setOrders] = useState([])
  const [blogs, setBlogs] = useState([])
  const [activeTab, setActiveTab] = useState('orders')
  const [loading, setLoading] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [uploadingIndex, setUploadingIndex] = useState(null)

  const [newBlog, setNewBlog] = useState({ title: '', excerpt: '', category: 'Study Tips', emoji: '📚' })
  const [showBlogForm, setShowBlogForm] = useState(false)

  const [about, setAbout] = useState({
    bio1: '', bio2: '', facebookLink: '', medilogyLink: '',
    achievements: [
      { title: '', proofUrl: '', proofType: '' },
    ],
    education: [
      { school: 'Dhaka Medical College', degree: 'MBBS 4th Year Batch 89', year: 'Current' },
      { school: 'Cantonment College Jashore', degree: 'Higher Secondary Certificate', year: 'College' },
      { school: 'Akij Collegiate School', degree: 'Secondary School Certificate', year: 'High School' },
      { school: 'Sunrise Public School', degree: 'Primary Education', year: 'Primary' },
    ],
    experience: [
      { role: 'Instructor', place: 'Medilogy', desc: 'Teaching chemistry and guiding medical admission aspirants across Bangladesh', duration: '5+ Years' },
      { role: 'MBBS Student', place: 'Dhaka Medical College', desc: 'Pursuing MBBS degree Batch 89', duration: 'Current' },
    ]
  })

  const [book, setBook] = useState({
    title: '', price: '', courierDhaka: '', courierOutside: '',
    description: '', edition: '', publisher: '', language: ''
  })

  const [contact, setContact] = useState({
    phone: '', whatsapp: '', email: '', facebook: '', location: ''
  })

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-white/40 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400"
  const labelClass = "block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      setLoggedIn(true)
      setError('')
      fetchAll()
    } catch (err) {
      setError('Wrong email or password!')
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await signOut(auth)
    setLoggedIn(false)
  }

  const fetchAll = async () => {
    fetchOrders()
    fetchBlogs()
    fetchSettings('about', setAbout)
    fetchSettings('book', setBook)
    fetchSettings('contact', setContact)
  }

  const fetchOrders = async () => {
    const snap = await getDocs(collection(db, 'orders'))
    setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  const fetchBlogs = async () => {
    const snap = await getDocs(collection(db, 'blogs'))
    setBlogs(snap.docs.map(d => ({ id: d.id, ...d.data() })))
  }

  const fetchSettings = async (docId, setter) => {
    try {
      const snap = await getDoc(doc(db, 'settings', docId))
      if (snap.exists()) {
        const data = snap.data()
        if (docId === 'about') {
          setter(prev => ({
            ...prev,
            ...data,
            achievements: data.achievements && data.achievements.length > 0
              ? data.achievements.map(a => typeof a === 'string' ? { title: a, proofUrl: '', proofType: '' } : a)
              : prev.achievements,
            education: data.education && data.education.length > 0 ? data.education : prev.education,
            experience: data.experience && data.experience.length > 0 ? data.experience : prev.experience,
          }))
        } else {
          setter(data)
        }
      }
    } catch (err) {
      console.log('Error fetching settings:', err)
    }
  }

  const saveSettingsDoc = async (docId, data) => {
    await setDoc(doc(db, 'settings', docId), data, { merge: true })
    setSaveMsg('Saved successfully!')
    setTimeout(() => setSaveMsg(''), 3000)
  }

  const handleProofUpload = async (file, index) => {
    if (!file) return
    setUploadingIndex(index)
    try {
      const fileRef = ref(storage, `achievements/${Date.now()}_${file.name}`)
      await uploadBytes(fileRef, file)
      const url = await getDownloadURL(fileRef)
      const fileType = file.type.startsWith('image/') ? 'image' : 'pdf'
      const updated = [...about.achievements]
      updated[index] = { ...updated[index], proofUrl: url, proofType: fileType }
      setAbout({ ...about, achievements: updated })
    } catch (err) {
      console.log('Upload error:', err)
    }
    setUploadingIndex(null)
  }

  const saveAbout = async (e) => {
    e.preventDefault()
    const cleanAchievements = about.achievements.filter(a => a.title.trim() !== '')
    const cleanEducation = about.education.filter(e => e.school.trim() !== '')
    const cleanExperience = about.experience.filter(e => e.role.trim() !== '')
    await saveSettingsDoc('about', {
      ...about,
      achievements: cleanAchievements,
      education: cleanEducation,
      experience: cleanExperience
    })
  }

  const saveBook = async (e) => {
    e.preventDefault()
    await saveSettingsDoc('book', book)
  }

  const saveContact = async (e) => {
    e.preventDefault()
    await saveSettingsDoc('contact', contact)
  }

  const updateOrderStatus = async (id, status) => {
    await updateDoc(doc(db, 'orders', id), { status })
    fetchOrders()
  }

  const deleteOrder = async (id) => {
    if (window.confirm('Delete this order?')) {
      await deleteDoc(doc(db, 'orders', id))
      fetchOrders()
    }
  }

  const addBlog = async (e) => {
    e.preventDefault()
    await addDoc(collection(db, 'blogs'), {
      ...newBlog,
      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      readTime: '5 min read',
      createdAt: serverTimestamp()
    })
    setNewBlog({ title: '', excerpt: '', category: 'Study Tips', emoji: '📚' })
    setShowBlogForm(false)
    fetchBlogs()
  }

  const deleteBlog = async (id) => {
    if (window.confirm('Delete this blog post?')) {
      await deleteDoc(doc(db, 'blogs', id))
      fetchBlogs()
    }
  }

  const getStatusColor = (status) => {
    if (status === 'pending') return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
    if (status === 'verified') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    if (status === 'shipped') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    return ''
  }

  if (!loggedIn) {
    return (
      <div className="pt-24 px-6 pb-16 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-md p-8 rounded-3xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 shadow-xl">
          <div className="text-center mb-8">
            <div className="p-4 bg-orange-100 dark:bg-orange-900/30 rounded-2xl w-fit mx-auto mb-4">
              <Lock className="text-orange-500" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Admin Login</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Enter your credentials to continue</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email address" required className={inputClass} />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" required className={inputClass} />
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button type="submit" disabled={loading} className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold transition shadow-lg">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 px-6 pb-16">
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Admin Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-300 mt-1">Manage everything on your website</p>
          </div>
          <div className="flex items-center gap-3">
            {saveMsg && <span className="text-green-500 font-medium text-sm bg-green-50 dark:bg-green-900/20 px-4 py-2 rounded-full">{saveMsg}</span>}
            <button onClick={handleLogout} className="flex items-center gap-2 px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full font-medium hover:bg-gray-300 transition">
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {[
            { label: 'Total Orders', value: orders.length, icon: '📦' },
            { label: 'Pending', value: orders.filter(o => o.status === 'pending').length, icon: '⏳' },
            { label: 'Shipped', value: orders.filter(o => o.status === 'shipped').length, icon: '🚚' },
          ].map((stat, index) => (
            <div key={index} className="p-6 rounded-2xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 shadow-lg text-center">
              <div className="text-4xl mb-2">{stat.icon}</div>
              <div className="text-3xl font-bold text-orange-500">{stat.value}</div>
              <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-3 mb-8">
          {['orders', 'blogs', 'about', 'book', 'contact'].map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-medium capitalize transition ${activeTab === tab ? 'bg-orange-500 text-white shadow-lg' : 'bg-white/40 dark:bg-gray-700/40 text-gray-700 dark:text-gray-200 hover:bg-white/60'}`}>
              {tab}
            </button>
          ))}
        </div>

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {orders.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📦</div>
                <p className="text-gray-500 dark:text-gray-400">No orders yet.</p>
              </div>
            )}
            {orders.map((order) => (
              <div key={order.id} className="p-6 rounded-2xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 shadow-lg">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-bold text-gray-800 dark:text-white text-lg">{order.name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>{order.status}</span>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">📞 {order.phone}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">📍 {order.address}, {order.district}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">📚 Quantity: {order.quantity}</p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">💳 TxID: {order.transactionId}</p>
                    {order.userEmail && <p className="text-gray-600 dark:text-gray-300 text-sm">📧 {order.userEmail}</p>}
                  </div>
                  <div className="flex flex-wrap gap-2 items-start">
                    <button onClick={() => updateOrderStatus(order.id, 'verified')} className="flex items-center gap-1 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-medium hover:bg-blue-200 transition">
                      <CheckCircle size={14} /> Verify
                    </button>
                    <button onClick={() => updateOrderStatus(order.id, 'shipped')} className="flex items-center gap-1 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-medium hover:bg-green-200 transition">
                      <Truck size={14} /> Shipped
                    </button>
                    <button onClick={() => deleteOrder(order.id)} className="flex items-center gap-1 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm font-medium hover:bg-red-200 transition">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* BLOGS TAB */}
        {activeTab === 'blogs' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Blog Posts</h2>
              <button onClick={() => setShowBlogForm(!showBlogForm)} className="flex items-center gap-2 px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium transition">
                {showBlogForm ? <X size={16} /> : <Plus size={16} />}
                {showBlogForm ? 'Cancel' : 'Add Post'}
              </button>
            </div>
            {showBlogForm && (
              <form onSubmit={addBlog} className="p-6 rounded-2xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 shadow-lg mb-6 space-y-4">
                <h3 className="font-bold text-gray-800 dark:text-white">New Blog Post</h3>
                <input type="text" placeholder="Blog title" required value={newBlog.title} onChange={(e) => setNewBlog({ ...newBlog, title: e.target.value })} className={inputClass} />
                <textarea placeholder="Short description" required value={newBlog.excerpt} onChange={(e) => setNewBlog({ ...newBlog, excerpt: e.target.value })} rows={3} className={inputClass} />
                <div className="flex gap-4">
                  <select value={newBlog.category} onChange={(e) => setNewBlog({ ...newBlog, category: e.target.value })} className={`flex-1 ${inputClass}`}>
                    <option>Study Tips</option>
                    <option>Chemistry</option>
                    <option>Personal</option>
                  </select>
                  <input type="text" placeholder="Emoji" value={newBlog.emoji} onChange={(e) => setNewBlog({ ...newBlog, emoji: e.target.value })} className="w-24 px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-white/40 dark:border-gray-600 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <button type="submit" className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold transition">Publish Post</button>
              </form>
            )}
            <div className="space-y-4">
              {blogs.length === 0 && (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">📝</div>
                  <p className="text-gray-500 dark:text-gray-400">No blog posts yet.</p>
                </div>
              )}
              {blogs.map((blog) => (
                <div key={blog.id} className="p-6 rounded-2xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 shadow-lg flex justify-between items-start gap-4">
                  <div className="flex gap-4 flex-1 min-w-0">
                    <div className="text-3xl flex-shrink-0">{blog.emoji}</div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-gray-800 dark:text-white truncate">{blog.title}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-1 line-clamp-2">{blog.excerpt}</p>
                      <span className="text-xs text-orange-500 font-medium">{blog.category}</span>
                    </div>
                  </div>
                  <button onClick={() => deleteBlog(blog.id)} className="flex-shrink-0 flex items-center gap-1 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm font-medium hover:bg-red-200 transition">
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ABOUT TAB */}
        {activeTab === 'about' && (
          <form onSubmit={saveAbout} className="space-y-8 p-8 rounded-3xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 shadow-xl">
            <div className="flex items-center gap-3">
              <Edit3 className="text-orange-500" size={22} />
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Edit About Page</h2>
            </div>

            {/* Bio */}
            <div className="space-y-4">
              <h3 className="font-bold text-orange-500 text-sm uppercase tracking-wide border-b border-orange-200 dark:border-orange-800 pb-2">Bio</h3>
              <div>
                <label className={labelClass}>Bio Paragraph 1</label>
                <textarea value={about.bio1} onChange={(e) => setAbout({ ...about, bio1: e.target.value })} rows={3} placeholder="First paragraph about yourself" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Bio Paragraph 2</label>
                <textarea value={about.bio2} onChange={(e) => setAbout({ ...about, bio2: e.target.value })} rows={3} placeholder="Second paragraph about yourself" className={inputClass} />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Facebook Link</label>
                  <input type="url" value={about.facebookLink} onChange={(e) => setAbout({ ...about, facebookLink: e.target.value })} placeholder="https://facebook.com/yourpage" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Medilogy Link</label>
                  <input type="url" value={about.medilogyLink} onChange={(e) => setAbout({ ...about, medilogyLink: e.target.value })} placeholder="https://medilogy.com/yourprofile" className={inputClass} />
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="space-y-4">
              <h3 className="font-bold text-orange-500 text-sm uppercase tracking-wide border-b border-orange-200 dark:border-orange-800 pb-2">Achievements</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Add each achievement with optional proof (image or PDF certificate)</p>
              {about.achievements.map((ach, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/40 dark:bg-gray-700/40 border border-white/30 dark:border-gray-600 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-orange-500 text-sm">Achievement {i + 1}</span>
                    <button type="button" onClick={() => setAbout({ ...about, achievements: about.achievements.filter((_, idx) => idx !== i) })}
                      className="text-red-400 hover:text-red-600"><X size={16} /></button>
                  </div>

                  {/* Title */}
                  <input
                    type="text"
                    value={ach.title}
                    onChange={(e) => {
                      const updated = [...about.achievements]
                      updated[i] = { ...updated[i], title: e.target.value }
                      setAbout({ ...about, achievements: updated })
                    }}
                    placeholder="e.g. Best Teacher Award at Medilogy"
                    className={inputClass}
                  />

                  {/* Proof Upload */}
                  <div className="flex items-center gap-3">
                    <label className="flex-1 cursor-pointer">
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-dashed transition ${ach.proofUrl ? 'border-green-400 bg-green-50 dark:bg-green-900/20' : 'border-orange-300 dark:border-orange-700 bg-orange-50/50 dark:bg-orange-900/10'}`}>
                        {uploadingIndex === i ? (
                          <span className="text-sm text-orange-500">Uploading...</span>
                        ) : ach.proofUrl ? (
                          <>
                            <span className="text-green-500 text-sm">✅ Proof uploaded</span>
                            <span className="text-xs text-gray-500">({ach.proofType})</span>
                          </>
                        ) : (
                          <>
                            <Upload size={16} className="text-orange-400" />
                            <span className="text-sm text-orange-500">Upload proof (image or PDF)</span>
                          </>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => {
                          if (e.target.files[0]) handleProofUpload(e.target.files[0], i)
                        }}
                      />
                    </label>

                    {/* Preview */}
                    {ach.proofUrl && (
                      <a href={ach.proofUrl} target="_blank" rel="noreferrer"
                        className="px-3 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-xl text-sm font-medium hover:bg-orange-200 transition">
                        View
                      </a>
                    )}

                    {/* Remove proof */}
                    {ach.proofUrl && (
                      <button type="button"
                        onClick={() => {
                          const updated = [...about.achievements]
                          updated[i] = { ...updated[i], proofUrl: '', proofType: '' }
                          setAbout({ ...about, achievements: updated })
                        }}
                        className="px-3 py-2 bg-red-100 dark:bg-red-900/30 text-red-500 rounded-xl text-sm hover:bg-red-200 transition">
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
              <button type="button"
                onClick={() => setAbout({ ...about, achievements: [...about.achievements, { title: '', proofUrl: '', proofType: '' }] })}
                className="flex items-center gap-2 text-orange-500 font-medium text-sm hover:text-orange-600">
                <Plus size={16} /> Add Achievement
              </button>
            </div>

            {/* Education */}
            <div className="space-y-3">
              <h3 className="font-bold text-orange-500 text-sm uppercase tracking-wide border-b border-orange-200 dark:border-orange-800 pb-2">Education</h3>
              {(about.education || []).map((edu, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/40 dark:bg-gray-700/40 border border-white/30 dark:border-gray-600 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600 dark:text-gray-400 text-sm">Entry {i + 1}</span>
                    <button type="button" onClick={() => setAbout({ ...about, education: about.education.filter((_, idx) => idx !== i) })}
                      className="text-red-400 hover:text-red-600"><X size={16} /></button>
                  </div>
                  <input type="text" value={edu.school}
                    onChange={(e) => { const u = [...about.education]; u[i] = { ...u[i], school: e.target.value }; setAbout({ ...about, education: u }) }}
                    placeholder="School / College name" className={inputClass} />
                  <div className="flex gap-3">
                    <input type="text" value={edu.degree}
                      onChange={(e) => { const u = [...about.education]; u[i] = { ...u[i], degree: e.target.value }; setAbout({ ...about, education: u }) }}
                      placeholder="Degree / Level" className={inputClass} />
                    <input type="text" value={edu.year}
                      onChange={(e) => { const u = [...about.education]; u[i] = { ...u[i], year: e.target.value }; setAbout({ ...about, education: u }) }}
                      placeholder="Year" className="w-32 px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-white/40 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                </div>
              ))}
              <button type="button"
                onClick={() => setAbout({ ...about, education: [...(about.education || []), { school: '', degree: '', year: '' }] })}
                className="flex items-center gap-2 text-orange-500 font-medium text-sm hover:text-orange-600">
                <Plus size={16} /> Add Education
              </button>
            </div>

            {/* Experience */}
            <div className="space-y-3">
              <h3 className="font-bold text-orange-500 text-sm uppercase tracking-wide border-b border-orange-200 dark:border-orange-800 pb-2">Experience</h3>
              {(about.experience || []).map((exp, i) => (
                <div key={i} className="p-4 rounded-xl bg-white/40 dark:bg-gray-700/40 border border-white/30 dark:border-gray-600 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-medium text-gray-600 dark:text-gray-400 text-sm">Entry {i + 1}</span>
                    <button type="button" onClick={() => setAbout({ ...about, experience: about.experience.filter((_, idx) => idx !== i) })}
                      className="text-red-400 hover:text-red-600"><X size={16} /></button>
                  </div>
                  <div className="flex gap-3">
                    <input type="text" value={exp.role}
                      onChange={(e) => { const u = [...about.experience]; u[i] = { ...u[i], role: e.target.value }; setAbout({ ...about, experience: u }) }}
                      placeholder="Role / Title" className={inputClass} />
                    <input type="text" value={exp.place}
                      onChange={(e) => { const u = [...about.experience]; u[i] = { ...u[i], place: e.target.value }; setAbout({ ...about, experience: u }) }}
                      placeholder="Place / Company" className={inputClass} />
                    <input type="text" value={exp.duration}
                      onChange={(e) => { const u = [...about.experience]; u[i] = { ...u[i], duration: e.target.value }; setAbout({ ...about, experience: u }) }}
                      placeholder="Duration" className="w-36 px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-white/40 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                  </div>
                  <textarea value={exp.desc}
                    onChange={(e) => { const u = [...about.experience]; u[i] = { ...u[i], desc: e.target.value }; setAbout({ ...about, experience: u }) }}
                    placeholder="Description" rows={2} className={inputClass} />
                </div>
              ))}
              <button type="button"
                onClick={() => setAbout({ ...about, experience: [...(about.experience || []), { role: '', place: '', desc: '', duration: '' }] })}
                className="flex items-center gap-2 text-orange-500 font-medium text-sm hover:text-orange-600">
                <Plus size={16} /> Add Experience
              </button>
            </div>

            <button type="submit" className="flex items-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold transition shadow-lg">
              <Save size={18} /> Save About Page
            </button>
          </form>
        )}

        {/* BOOK TAB */}
        {activeTab === 'book' && (
          <form onSubmit={saveBook} className="space-y-6 p-8 rounded-3xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 shadow-xl">
            <div className="flex items-center gap-3">
              <Edit3 className="text-orange-500" size={22} />
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Edit Book Page</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Book Title</label>
                <input type="text" value={book.title} onChange={(e) => setBook({ ...book, title: e.target.value })} placeholder="Book title" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Edition</label>
                <input type="text" value={book.edition} onChange={(e) => setBook({ ...book, edition: e.target.value })} placeholder="e.g. 2nd Edition" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Publisher</label>
                <input type="text" value={book.publisher} onChange={(e) => setBook({ ...book, publisher: e.target.value })} placeholder="Publisher name" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Language</label>
                <input type="text" value={book.language} onChange={(e) => setBook({ ...book, language: e.target.value })} placeholder="e.g. Bengali" className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Book Description</label>
              <textarea value={book.description} onChange={(e) => setBook({ ...book, description: e.target.value })} rows={4} placeholder="Describe the book" className={inputClass} />
            </div>
            <div className="p-6 rounded-2xl bg-orange-50/50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 space-y-4">
              <h3 className="font-bold text-gray-800 dark:text-white">💰 Pricing</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={labelClass}>Book Price (৳)</label>
                  <input type="number" value={book.price} onChange={(e) => setBook({ ...book, price: e.target.value })} placeholder="350" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Courier Inside Dhaka (৳)</label>
                  <input type="number" value={book.courierDhaka} onChange={(e) => setBook({ ...book, courierDhaka: e.target.value })} placeholder="350" className={inputClass} />
                </div>
                <div>
                  <label className={labelClass}>Courier Outside Dhaka (৳)</label>
                  <input type="number" value={book.courierOutside} onChange={(e) => setBook({ ...book, courierOutside: e.target.value })} placeholder="400" className={inputClass} />
                </div>
              </div>
            </div>
            <button type="submit" className="flex items-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold transition shadow-lg">
              <Save size={18} /> Save Book Page
            </button>
          </form>
        )}

        {/* CONTACT TAB */}
        {activeTab === 'contact' && (
          <form onSubmit={saveContact} className="space-y-6 p-8 rounded-3xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 shadow-xl">
            <div className="flex items-center gap-3">
              <Edit3 className="text-orange-500" size={22} />
              <h2 className="text-xl font-bold text-gray-800 dark:text-white">Edit Contact Info</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className={labelClass}>Phone Number</label>
                <input type="text" value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} placeholder="01XXXXXXXXX" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>WhatsApp Number (with country code, no +)</label>
                <input type="text" value={contact.whatsapp} onChange={(e) => setContact({ ...contact, whatsapp: e.target.value })} placeholder="8801XXXXXXXXX" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Email Address</label>
                <input type="email" value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} placeholder="your@email.com" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>Location</label>
                <input type="text" value={contact.location} onChange={(e) => setContact({ ...contact, location: e.target.value })} placeholder="Dhaka, Bangladesh" className={inputClass} />
              </div>
            </div>
            <div>
              <label className={labelClass}>Facebook Profile Link</label>
              <input type="url" value={contact.facebook} onChange={(e) => setContact({ ...contact, facebook: e.target.value })} placeholder="https://facebook.com/yourprofile" className={inputClass} />
            </div>
            <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-700 dark:text-blue-300">
                <strong>Note:</strong> WhatsApp number must include country code. Example: 8801822496928
              </p>
            </div>
            <button type="submit" className="flex items-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold transition shadow-lg">
              <Save size={18} /> Save Contact Info
            </button>
          </form>
        )}

      </div>
    </div>
  )
}

export default Admin