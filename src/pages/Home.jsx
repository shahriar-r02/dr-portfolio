import { Link } from 'react-router-dom'
import { BookOpen, Users, Award, ChevronRight } from 'lucide-react'
import jitPhoto from '../assets/images/jit.jpg'

function Home() {
  return (
    <div className="pt-24 px-6">
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col md:flex-row items-center justify-between gap-12 py-16">
          <div className="flex-1 space-y-6">
            <div className="inline-block px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium">
              MBBS Student & Educator
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-gray-800 dark:text-white leading-tight">
              Hi, I'm <span className="text-orange-500">Jit Biswas</span>
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl">
              4th-year student at Dhaka Medical College and dedicated educator with over 5 years of teaching experience in medical admission preparation.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/book" className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium transition shadow-lg shadow-orange-200 dark:shadow-orange-900 flex items-center gap-2">
                Get My Book <ChevronRight size={18} />
              </Link>
              <Link to="/about" className="px-8 py-3 bg-white/40 dark:bg-gray-700/40 backdrop-blur-sm border border-white/30 dark:border-gray-600/30 text-gray-700 dark:text-gray-200 rounded-full font-medium hover:bg-white/60 transition">
                About Me
              </Link>
            </div>
          </div>

          <div className="flex-1 flex justify-center">
            <div className="relative mx-8">
              <div className="w-full md:w-72 h-72 md:h-80 rounded-3xl overflow-hidden shadow-2xl border border-white/40 dark:border-gray-700/40">
                <img src={jitPhoto} alt="Jit Biswas" className="w-full h-full object-cover object-[center_20%]" />
              </div>
              <div className="absolute -bottom-4 -left-4 md:-left-6 px-3 md:px-4 py-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex items-center gap-2">
                <Users size={16} className="text-orange-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">1000+ Students</span>
              </div>
              <div className="absolute -top-4 -right-4 md:-right-6 px-3 md:px-4 py-2 bg-white dark:bg-gray-800 rounded-2xl shadow-lg flex items-center gap-2">
                <Award size={16} className="text-orange-500" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200">Best Teacher</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
          <div className="p-6 rounded-2xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 shadow-lg text-center">
            <div className="text-4xl font-bold text-orange-500 mb-2">5+</div>
            <div className="text-gray-600 dark:text-gray-300 font-medium">Years Teaching</div>
          </div>
          <div className="p-6 rounded-2xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 shadow-lg text-center">
            <div className="text-4xl font-bold text-orange-500 mb-2">1000+</div>
            <div className="text-gray-600 dark:text-gray-300 font-medium">Students Guided</div>
          </div>
          <div className="p-6 rounded-2xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 shadow-lg text-center">
            <div className="text-4xl font-bold text-orange-500 mb-2">2nd</div>
            <div className="text-gray-600 dark:text-gray-300 font-medium">Edition Book</div>
          </div>
        </div>

        <div className="py-12">
          <div className="p-8 rounded-3xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 shadow-xl flex flex-col md:flex-row items-center gap-8">
            <div className="w-40 h-52 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-xl">
              <BookOpen size={48} className="text-white" />
            </div>
            <div className="flex-1 space-y-4">
              <div className="text-sm text-orange-500 font-medium">Now Available — 2nd Edition</div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Basic Chemistry & Organic</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Written to break down complex chemistry concepts into clear, digestible lessons that every medical aspirant can master.
              </p>
              <div className="flex gap-4">
                <Link to="/order" className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium transition shadow-lg shadow-orange-200">
                  Buy Now
                </Link>
                <Link to="/book" className="px-6 py-2 bg-white/40 dark:bg-gray-700/40 backdrop-blur-sm border border-white/30 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full font-medium hover:bg-white/60 transition">
                  Preview
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Home