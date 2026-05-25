import { useState, useEffect } from 'react'
import { Calendar, Clock, ArrowRight } from 'lucide-react'
import { db } from '../firebase/config'
import { collection, getDocs, orderBy, query } from 'firebase/firestore'

function Blog() {
  const [selected, setSelected] = useState('All')
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const categories = ['All', 'Study Tips', 'Chemistry', 'Personal']

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const q = query(collection(db, 'blogs'), orderBy('createdAt', 'desc'))
        const snapshot = await getDocs(q)
        const firebasePosts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setPosts(firebasePosts)
      } catch (err) {
        console.log('Error fetching blogs:', err)
      }
      setLoading(false)
    }
    fetchBlogs()
  }, [])

  const filtered = selected === 'All' ? posts : posts.filter(p => p.category === selected)

  return (
    <div className="pt-24 px-6 pb-16">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium mb-4">
            Blog
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
            Articles <span className="text-orange-500">& Insights</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-4">Tips, guides and stories from my journey</p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center mb-12">
          {categories.map((cat) => (
            <button key={cat} onClick={() => setSelected(cat)}
              className={`px-5 py-2 rounded-full font-medium transition ${
                selected === cat
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-200'
                  : 'bg-white/40 dark:bg-gray-700/40 text-gray-700 dark:text-gray-200 hover:bg-white/60'
              }`}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1,2,3,4].map(i => (
              <div key={i} className="h-48 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No posts yet</h3>
            <p className="text-gray-500 dark:text-gray-400">Blog posts added from admin will appear here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {filtered.map((post) => (
              <div key={post.id} className="p-6 rounded-2xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 shadow-lg hover:shadow-xl transition group">
                <div className="text-4xl mb-4">{post.emoji}</div>
                <div className="flex items-center gap-2 mb-3">
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-xs font-medium">
                    {post.category}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-3 group-hover:text-orange-500 transition">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                  {post.excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} /> {post.date}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {post.readTime}
                    </span>
                  </div>
                  <button className="flex items-center gap-1 text-orange-500 text-sm font-medium hover:gap-2 transition-all">
                    Read More <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  )
}

export default Blog