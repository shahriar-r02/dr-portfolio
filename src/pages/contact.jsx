import { useState } from 'react'
import { Mail, Phone, MapPin, Send, Facebook } from 'lucide-react'
import { useSettings } from '../hooks/useSettings'

const defaultData = {
  phone: "01822496928",
  whatsapp: "8801822496928",
  email: "jitbiswas204@gmail.com",
  facebook: "https://www.facebook.com/jit.biswas.153352",
  location: "Dhaka, Bangladesh"
}

function Contact() {
  const { data, loading } = useSettings('contact')
  const d = data || defaultData
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value })

  const handleSubmit = (e) => {
    e.preventDefault()
    const message = `Hello Jit,\nMy name is ${formData.name}\nEmail: ${formData.email}\nMessage: ${formData.message}`
    window.open(`https://wa.me/${d.whatsapp || defaultData.whatsapp}?text=${encodeURIComponent(message)}`, '_blank')
    setSubmitted(true)
  }

  return (
    <div className="pt-24 px-6 pb-16">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium mb-4">
            Contact
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
            Get In <span className="text-orange-500">Touch</span>
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-4">Have a question? Feel free to reach out!</p>
        </div>

        <div className="flex flex-col md:flex-row gap-12">
          <div className="flex-1 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Contact Information</h2>
            <p className="text-gray-600 dark:text-gray-300">Reach out for book orders, teaching inquiries, or any questions.</p>

            {loading ? (
              [1,2,3,4].map(i => <div key={i} className="h-16 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />)
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 rounded-2xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 shadow-lg">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl"><Phone className="text-orange-500" size={20} /></div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Phone</p>
                    <p className="font-medium text-gray-800 dark:text-white">{d.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 shadow-lg">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl"><Mail className="text-orange-500" size={20} /></div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Email</p>
                    <p className="font-medium text-gray-800 dark:text-white">{d.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 shadow-lg">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl"><MapPin className="text-orange-500" size={20} /></div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                    <p className="font-medium text-gray-800 dark:text-white">{d.location}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 rounded-2xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 shadow-lg">
                  <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-xl"><Facebook className="text-orange-500" size={20} /></div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Facebook</p>
                    <a href={d.facebook} target="_blank" rel="noreferrer" className="font-medium text-orange-500 hover:underline">JIT Biswas</a>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1">
            {submitted ? (
              <div className="h-full flex items-center justify-center p-12 rounded-3xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 shadow-xl text-center space-y-4">
                <div>
                  <div className="text-5xl mb-4">✅</div>
                  <h3 className="text-xl font-bold text-gray-800 dark:text-white">Message Sent!</h3>
                  <p className="text-gray-600 dark:text-gray-300 mt-2">Your message has been sent via WhatsApp.</p>
                  <button onClick={() => setSubmitted(false)} className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-full font-medium">Send Another</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5 p-8 rounded-3xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 shadow-xl">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Send a Message</h2>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Your Name</label>
                  <input type="text" name="name" required value={formData.name} onChange={handleChange} placeholder="Your full name" className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-white/40 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Email Address</label>
                  <input type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="your@email.com" className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-white/40 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Message</label>
                  <textarea name="message" required value={formData.message} onChange={handleChange} placeholder="Write your message here..." rows={5} className="w-full px-4 py-3 rounded-xl bg-white/50 dark:bg-gray-700/50 border border-white/40 dark:border-gray-600 text-gray-800 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-400" />
                </div>
                <button type="submit" className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold text-lg transition shadow-lg shadow-orange-200 flex items-center justify-center gap-2">
                  <Send size={20} /> Send via WhatsApp
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Contact