import { Link } from 'react-router-dom'
import { Star, ShoppingCart, Eye } from 'lucide-react'
import bookCoverPdfRaw from '../assets/pdf/book-cover.pdf'
import samplePdfRaw from '../assets/pdf/sample.pdf'
import { useSettings } from '../hooks/useSettings'

const bookCoverPdf = bookCoverPdfRaw + '#toolbar=0&navpanes=0&scrollbar=0'
const samplePdf = samplePdfRaw + '#toolbar=0&navpanes=0&scrollbar=0'

const defaultData = {
  title: "Basic Chemistry and Organic",
  price: "350",
  courierDhaka: "350",
  courierOutside: "400",
  description: "Written with one goal in mind — to break down complex chemistry concepts into clear, digestible lessons that every medical aspirant can master.",
  edition: "2nd Edition",
  publisher: "Medilogy Publication",
  language: "Bengali"
}

function Book() {
  const { data, loading } = useSettings('book')
  const d = data || defaultData

  return (
    <div className="pt-24 px-6 pb-16">
      <div className="max-w-6xl mx-auto">

        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium mb-4">
            My Book
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
            {loading ? 'Loading...' : <>{d.title?.split(' ').slice(0, 2).join(' ')} <span className="text-orange-500">{d.title?.split(' ').slice(2).join(' ')}</span></>}
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-4 text-lg">{d.edition} — Published by {d.publisher}</p>
        </div>

        <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
          <div className="flex-1 flex justify-center">
            <div className="relative">
              <div className="w-56 h-72 rounded-2xl overflow-hidden shadow-2xl">
                <iframe src={bookCoverPdf} className="w-full h-full" title="Book Cover" style={{ border: 'none' }} />
              </div>
              <div className="absolute -top-3 -right-3 px-3 py-1 bg-green-500 text-white text-sm font-bold rounded-full shadow-lg">
                {d.edition}
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{d.title}</h2>
              <p className="text-orange-500 font-medium">by Jit Biswas</p>
            </div>

            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map((star) => (
                <Star key={star} size={20} className="text-orange-400 fill-orange-400" />
              ))}
              <span className="text-gray-600 dark:text-gray-300 text-sm ml-2">5.0 Rating</span>
            </div>

            {loading ? (
              <div className="h-16 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
            ) : (
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{d.description}</p>
            )}

            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Edition', value: d.edition },
                { label: 'Publisher', value: d.publisher },
                { label: 'Language', value: d.language },
                { label: 'Category', value: 'Medical Admission' },
              ].map((item, index) => (
                <div key={index} className="p-3 rounded-xl bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40">
                  <p className="text-xs text-gray-500 dark:text-gray-400">{item.label}</p>
                  <p className="font-medium text-gray-800 dark:text-white">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-6">
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">Price</p>
                <p className="text-3xl font-bold text-orange-500">৳ {d.price}</p>
              </div>
              <div className="flex gap-3">
                <Link to="/order" className="flex items-center gap-2 px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium transition shadow-lg shadow-orange-200">
                  <ShoppingCart size={18} /> Buy Now
                </Link>
                <a href="#preview" className="flex items-center gap-2 px-6 py-3 bg-white/40 dark:bg-gray-700/40 border border-white/30 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full font-medium hover:bg-white/60 transition">
                  <Eye size={18} /> Preview
                </a>
              </div>
            </div>
          </div>
        </div>

        <div id="preview" className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Book Preview</h2>
            <p className="text-gray-600 dark:text-gray-300 mt-2">Read sample pages before buying</p>
          </div>
          <div className="p-8 rounded-3xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 shadow-xl">
            <iframe src={samplePdf} className="w-full h-[600px] rounded-2xl" title="Book Sample" style={{ border: 'none' }} />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white text-center mb-8">Why This Book?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🎯', title: 'Exam Focused', desc: 'Every topic carefully selected based on medical admission exam patterns' },
              { icon: '📖', title: 'Easy to Understand', desc: 'Complex chemistry concepts explained in simple clear language' },
              { icon: '✅', title: 'Proven Results', desc: 'Thousands of students have used this book to secure admission' },
            ].map((item, index) => (
              <div key={index} className="p-6 rounded-2xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 shadow-lg text-center">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-bold text-gray-800 dark:text-white mb-2">{item.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}

export default Book