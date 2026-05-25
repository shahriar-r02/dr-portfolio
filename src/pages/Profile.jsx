import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { auth, db } from '../firebase/config'
import { signOut } from 'firebase/auth'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { useNavigate } from 'react-router-dom'
import { LogOut, Package, Clock, CheckCircle, Truck, User } from 'lucide-react'

function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/auth')
      return
    }
    fetchMyOrders()
  }, [user])

  const fetchMyOrders = async () => {
    try {
      const q = query(
        collection(db, 'orders'),
        where('userEmail', '==', user.email)
      )
      const snap = await getDocs(q)
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    } catch (err) {
      console.log('Error fetching orders:', err)
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await signOut(auth)
    navigate('/')
  }

  const getStatusIcon = (status) => {
    if (status === 'pending') return <Clock size={16} className="text-yellow-500" />
    if (status === 'verified') return <CheckCircle size={16} className="text-blue-500" />
    if (status === 'shipped') return <Truck size={16} className="text-green-500" />
    return <Package size={16} className="text-gray-500" />
  }

  const getStatusColor = (status) => {
    if (status === 'pending') return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
    if (status === 'verified') return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
    if (status === 'shipped') return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
    return ''
  }

  if (!user) return null

  return (
    <div className="pt-24 px-6 pb-16">
      <div className="max-w-4xl mx-auto">

        {/* Profile Header */}
        <div className="p-8 rounded-3xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 shadow-xl mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">

            {/* Avatar */}
            <div className="w-24 h-24 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center flex-shrink-0 shadow-lg">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
              ) : (
                <User size={40} className="text-white" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                {user.displayName || 'User'}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">{user.email}</p>
              <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
                <div className="px-4 py-2 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                  <span className="text-orange-600 dark:text-orange-400 font-medium text-sm">
                    {orders.length} {orders.length === 1 ? 'Order' : 'Orders'}
                  </span>
                </div>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-full font-medium hover:bg-gray-300 transition"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        {/* Orders */}
        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">My Orders</h2>

          {loading ? (
            <div className="space-y-4">
              {[1,2].map(i => <div key={i} className="h-32 rounded-2xl bg-gray-200 dark:bg-gray-700 animate-pulse" />)}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 p-8 rounded-3xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 shadow-xl">
              <div className="text-6xl mb-4">📦</div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">No orders yet</h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">You haven't placed any orders yet.</p>
              <button
                onClick={() => navigate('/order')}
                className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium transition shadow-lg"
              >
                Buy a Book
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="p-6 rounded-2xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 shadow-lg">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-bold text-gray-800 dark:text-white">Basic Chemistry & Organic</h3>
                        <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)} {order.status}
                        </span>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">📍 {order.address}, {order.district}</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">📚 Quantity: {order.quantity}</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">💳 Transaction ID: {order.transactionId}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {order.createdAt?.toDate?.()?.toLocaleDateString('en-US', {
                          year: 'numeric', month: 'short', day: 'numeric'
                        }) || 'Recently'}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default Profile