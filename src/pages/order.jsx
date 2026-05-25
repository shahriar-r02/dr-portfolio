import { useState } from 'react'
import { ShoppingCart, CheckCircle, LogIn } from 'lucide-react'
import { db } from '../firebase/config'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { useSettings } from '../hooks/useSettings'
import { useAuth } from '../context/AuthContext'
import { Link } from 'react-router-dom'

function Order() {
  const { data: bookData } = useSettings('book')
  const { data: contactData } = useSettings('contact')
  const { user } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    district: '',
    quantity: '1',
    transactionId: '',
  })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await addDoc(collection(db, 'orders'), {
        ...formData,
        status: 'pending',
        userEmail: user.email,
        userName: user.displayName || '',
        createdAt: serverTimestamp()
      })
      const message = `New Book Order!
Name: ${formData.name}
Phone: ${formData.phone}
Address: ${formData.address}
District: ${formData.district}
Quantity: ${formData.quantity}
Transaction ID: ${formData.transactionId}
Customer Email: ${user.email}`

      const whatsappNumber = contactData?.whatsapp || '8801822496928'
      const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
      window.open(whatsappUrl, '_blank')
      setSubmitted(true)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  // Not logged in
  if (!user) {
    return (
      <div className="pt-24 px-6 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6 p-12 rounded-3xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 shadow-xl max-w-md w-full">
          <div className="text-6xl">🔒</div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Login Required</h2>
          <p className="text-gray-600 dark:text-gray-300">You need to login or create an account to buy the book and track your order.</p>
          <div className="flex flex-col gap-3">
            <Link
              to="/auth"
              className="flex items-center justify-center gap-2 px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold transition shadow-lg"
            >
              <LogIn size={20} /> Login / Sign Up
            </Link>
            <Link
              to="/book"
              className="px-8 py-3 bg-white/40 dark:bg-gray-700/40 border border-white/30 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full font-medium hover:bg-white/60 transition"
            >
              View Book Details
            </Link>
          </div>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="pt-24 px-6 pb-16 min-h-screen flex items-center justify-center">
        <div className="text-center space-y-6 p-12 rounded-3xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 shadow-xl max-w-md w-full">
          <CheckCircle size={64} className="text-green-500 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Order Submitted!</h2>
          <p className="text-gray-600 dark:text-gray-300">Your order has been saved and sent to Jit Biswas via WhatsApp. He will confirm your payment and courier the book shortly.</p>
          <div className="flex flex-col gap-3">
            <Link to="/profile" className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium transition">
              View My Orders
            </Link>
            <button onClick={() => setSubmitted(false)} className="px-6 py-3 bg-white/40 dark:bg-gray-700/40 border border-white/30 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full font-medium hover:bg-white/60 transition">
              Place Another Order
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 px-6 pb-16">
      <div className="max-w-2xl mx-auto">

        <div className="text-center mb-12">
          <div className="inline-block px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium mb-4">
            Order Now
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white">
            Buy <span className="text-orange-500">The Book</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-3">Fill the form below after completing bKash payment</p>
          <p className="text-sm text-green-600 dark:text-green-400 mt-2">
            Logged in as <strong>{user.displayName || user.email}</strong>
          </p>
        </div>

        {/* bKash Payment Info */}
        <div className="p-6 rounded-2xl backdrop-blur-md bg-orange-50/50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 shadow-lg mb-8">
          <h3 className="font-bold text-gray-800 dark:text-white mb-4">Payment Instructions</h3>
          <div className="space-y-2 text-gray-600 dark:text-gray-300">
            <p>1. Open your bKash app</p>
            <p>2. Send Money to: <span className="font-bold text-orange-500">{contactData?.phone || '01822496928'}</span></p>
            <p>3. Amount: <span className="font-bold text-orange-500">৳ {bookData?.courierDhaka || '350'}</span> (inside Dhaka) or <span className="font-bold text-orange-500">৳ {bookData?.courierOutside || '400'}</span> (outside Dhaka)</p>
            <p>4. Save your Transaction ID</p>
            <p>5. Fill the form below</p>
          </div>
        </div>

        {/* Order Form */}
        <form onSubmit={handleSubmit} className="space-y-5 p-8 rounded-3xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 shadow-xl">

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Name</label>
            <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Your full name"
              className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-white/40 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Phone Number</label>
            <input type="text" name="phone" required value={formData.phone} onChange={handleChange} placeholder="01XXXXXXXXX"
              className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-white/40 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Full Address</label>
            <textarea name="address" required value={formData.address} onChange={handleChange} placeholder="House, Road, Area" rows={3}
              className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-white/40 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">District</label>
            <input type="text" name="district" required value={formData.district} onChange={handleChange} placeholder="Your district"
              className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-white/40 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Quantity</label>
            <select name="quantity" value={formData.quantity} onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-white/40 dark:border-gray-600 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-orange-400">
              <option value="1">1 Copy</option>
              <option value="2">2 Copies</option>
              <option value="3">3 Copies</option>
              <option value="4">4 Copies</option>
              <option value="5">5 Copies</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">bKash Transaction ID</label>
            <input type="text" name="transactionId" required value={formData.transactionId} onChange={handleChange} placeholder="e.g. 8G7H2K9L0M"
              className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-white/40 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400" />
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold text-lg transition shadow-lg shadow-orange-200 flex items-center justify-center gap-2">
            <ShoppingCart size={20} />
            {loading ? 'Submitting...' : 'Submit Order via WhatsApp'}
          </button>
        </form>

      </div>
    </div>
  )
}

export default Order