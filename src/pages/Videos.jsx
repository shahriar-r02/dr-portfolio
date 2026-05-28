import { useState, useEffect } from 'react'
import { db } from '../firebase/config'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'
import { Play, Lock, ChevronDown, ChevronUp } from 'lucide-react'

function getYouTubeId(url) {
  const regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
  const match = url.match(regExp)
  return match && match[7].length === 11 ? match[7] : null
}

function Videos() {
  const { user } = useAuth()
  const [categories, setCategories] = useState([])
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [openCategories, setOpenCategories] = useState({})

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catSnap = await getDocs(collection(db, 'videoCategories'))
        const cats = catSnap.docs.map(d => ({ id: d.id, ...d.data() }))
        setCategories(cats)

        const q = query(collection(db, 'videos'), orderBy('chapterNumber', 'asc'))
        const vidSnap = await getDocs(q)
        const vids = vidSnap.docs.map(d => ({ id: d.id, ...d.data() }))
        setVideos(vids)

        const openState = {}
        cats.forEach(c => openState[c.id] = true)
        setOpenCategories(openState)
      } catch (err) {
        console.log('Error:', err)
      }
      setLoading(false)
    }
    fetchData()
  }, [])

  const toggleCategory = (id) => {
    setOpenCategories(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const getVideosForCategory = (categoryId) => {
    return videos
      .filter(v => v.categoryId === categoryId)
      .sort((a, b) => (a.chapterNumber || 0) - (b.chapterNumber || 0))
  }

  return (
    <div className="pt-24 px-6 pb-16">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium mb-4">
            Lectures
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
            Video <span className="text-orange-500">Lectures</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-4">Watch Jit Biswas teach chemistry and medical admission topics</p>
        </div>

        {!user && (
          <div className="mb-8 p-6 rounded-2xl bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Lock size={24} className="text-orange-500" />
              <div>
                <p className="font-bold text-gray-800 dark:text-white">Login to watch full videos</p>
                <p className="text-gray-600 dark:text-gray-300 text-sm">Create a free account to access all lecture videos</p>
              </div>
            </div>
            <Link to="/auth" className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium transition shadow-lg flex-shrink-0">
              Login / Sign Up
            </Link>
          </div>
        )}

        {selectedVideo && user && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setSelectedVideo(null)}>
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-4xl w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
                <div>
                  <p className="text-xs text-orange-500 font-medium mb-1">{selectedVideo.categoryName} • Chapter {selectedVideo.chapterNumber}</p>
                  <h3 className="font-bold text-gray-800 dark:text-white text-lg">{selectedVideo.title}</h3>
                </div>
                <button onClick={() => setSelectedVideo(null)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">✕</button>
              </div>
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute top-0 left-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${getYouTubeId(selectedVideo.url)}?autoplay=1`}
                  title={selectedVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
              {selectedVideo.description && (
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-300">{selectedVideo.description}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {loading ? (
          <div className="space-y-6">
            {[1,2,3].map(i => (
              <div key={i} className="h-48 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🎬</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No lectures yet</h3>
            <p className="text-gray-500 dark:text-gray-400">Lecture videos will appear here soon.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {categories
              .sort((a, b) => (a.order || 0) - (b.order || 0))
              .map((category) => {
                const catVideos = getVideosForCategory(category.id)
                const isOpen = openCategories[category.id]

                return (
                  <div key={category.id} className="rounded-2xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 shadow-lg overflow-hidden">

                    <button
                      onClick={() => toggleCategory(category.id)}
                      className="w-full flex items-center justify-between p-6 hover:bg-white/20 dark:hover:bg-gray-700/20 transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center text-2xl">
                          {category.emoji || '📚'}
                        </div>
                        <div className="text-left">
                          <h2 className="text-xl font-bold text-gray-800 dark:text-white">{category.name}</h2>
                          <p className="text-gray-500 dark:text-gray-400 text-sm">{catVideos.length} {catVideos.length === 1 ? 'video' : 'videos'}</p>
                        </div>
                      </div>
                      {isOpen ? <ChevronUp size={20} className="text-gray-500" /> : <ChevronDown size={20} className="text-gray-500" />}
                    </button>

                    {isOpen && (
                      <div className="px-6 pb-6">
                        {catVideos.length === 0 ? (
                          <p className="text-center text-gray-500 dark:text-gray-400 py-8">No videos in this category yet.</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {catVideos.map((video) => (
                              <div key={video.id} className="rounded-2xl overflow-hidden bg-white/40 dark:bg-gray-700/40 border border-white/30 dark:border-gray-600/30 shadow hover:shadow-lg transition group">
                                <div className="relative">
                                  <img
                                    src={`https://img.youtube.com/vi/${getYouTubeId(video.url)}/maxresdefault.jpg`}
                                    alt={video.title}
                                    className="w-full h-40 object-cover"
                                    onError={(e) => {
                                      e.target.src = `https://img.youtube.com/vi/${getYouTubeId(video.url)}/hqdefault.jpg`
                                    }}
                                  />
                                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                                    {user ? (
                                      <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
                                        <Play size={20} className="text-white ml-1" />
                                      </div>
                                    ) : (
                                      <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
                                        <Lock size={20} className="text-orange-500" />
                                      </div>
                                    )}
                                  </div>
                                  <div className="absolute top-2 left-2 px-2 py-1 bg-orange-500 text-white text-xs rounded-full font-medium">
                                    Ch. {video.chapterNumber}
                                  </div>
                                  {!user && (
                                    <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded-full flex items-center gap-1">
                                      <Lock size={10} /> Login
                                    </div>
                                  )}
                                </div>

                                <div className="p-4">
                                  <h3 className="font-bold text-gray-800 dark:text-white text-sm mb-1 line-clamp-2">{video.title}</h3>
                                  {video.description && (
                                    <p className="text-gray-500 dark:text-gray-400 text-xs line-clamp-2 mb-3">{video.description}</p>
                                  )}
                                  {user ? (
                                    <button
                                      onClick={() => setSelectedVideo({ ...video, categoryName: category.name })}
                                      className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full text-xs font-medium transition flex items-center justify-center gap-1"
                                    >
                                      <Play size={12} /> Watch Now
                                    </button>
                                  ) : (
                                    <Link
                                      to="/auth"
                                      className="w-full py-2 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium transition flex items-center justify-center gap-1 hover:bg-orange-100 hover:text-orange-600"
                                    >
                                      <Lock size={12} /> Login to Watch
                                    </Link>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
          </div>
        )}

      </div>
    </div>
  )
}

export default Videos