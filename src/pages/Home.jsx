import { Link } from 'react-router-dom'
import { BookOpen, Users, Award, ChevronRight, PenSquare, Play, Mail, ShoppingCart, FileText } from 'lucide-react'
import jitPhoto from '../assets/images/jit.jpg'
import coverPhoto from '../assets/images/cover.jpg'
// Importing the PDF from your assets folder path
import bookCoverPdf from '../assets/pdf/book-cover.pdf' 
import { useSettings } from '../hooks/useSettings'

function Home() {
  const { data: bookData } = useSettings('book')
  const { data: contactData } = useSettings('contact')

  return (
    <div className="overflow-x-hidden">

      {/* ── FULL WIDTH COVER ── */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300">

        {/* Cover photo as background */}
        <div className="absolute inset-0">
          <img
            src={coverPhoto}
            alt="Cover"
            className="w-full h-full object-cover object-center"
          />
          {/* Subtle light/dark overlays to soften background text contrast */}
          <div className="absolute inset-0 bg-white/10 dark:bg-black/40 backdrop-blur-[2px]" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/40 dark:from-black/40 dark:via-transparent dark:to-black/60" />
        </div>

        {/* Cover Content Container */}
        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto pt-28 pb-32">
          
          {/* Frosted Glass Card — Adapts to both Light and Dark Modes dynamically */}
          <div className="p-6 md:p-10 rounded-3xl bg-white/75 dark:bg-gray-900/75 backdrop-blur-xl border border-white/60 dark:border-gray-800/40 shadow-xl shadow-orange-950/5 dark:shadow-black/50 transition-all duration-300">

            {/* Profile photo floating on cover */}
            <div className="flex justify-center mb-6">
              <div className="relative">
                <div className="w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-4 border-orange-500/20 dark:border-orange-500/40 shadow-xl">
                  <img
                    src={jitPhoto}
                    alt="Jit Biswas"
                    className="w-full h-full object-cover object-[center_20%]"
                  />
                </div>
                {/* Online indicator */}
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900 shadow" />
              </div>
            </div>

            {/* Badge */}
            <div className="inline-block px-4 py-1.5 bg-orange-500 text-white rounded-full text-xs md:text-sm font-semibold mb-4 shadow-md">
              MBBS Student & Medical Educator
            </div>

            {/* Name */}
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-3">
              Jit <span className="text-orange-500">Biswas</span>
            </h1>

            {/* Subtitle */}
            <p className="text-base md:text-xl text-gray-700 dark:text-gray-300 mb-3 font-medium">
              4th Year Student · Dhaka Medical College
            </p>

            <p className="text-sm md:text-base text-gray-600 dark:text-gray-400 max-w-xl mx-auto leading-relaxed mb-8">
              Educator at Medilogy · Author of <span className="text-orange-600 dark:text-orange-400 font-semibold">Basic Chemistry & Organic</span> · Guiding 1000+ students across Bangladesh
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              <Link to="/book"
                className="flex items-center gap-2 px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-bold text-base transition shadow-lg shadow-orange-500/30">
                <BookOpen size={18} /> Get My Book
              </Link>
              <Link to="/about"
                className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-800 dark:text-white rounded-full font-bold text-base transition border border-gray-200 dark:border-gray-700">
                About Me <ChevronRight size={18} />
              </Link>
            </div>

            {/* Stats Row inside the Hero Card */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-10 border-t border-gray-200 dark:border-gray-800 pt-6">
              {[
                { value: '5+', label: 'Years Teaching' },
                { value: '1000+', label: 'Students Guided' },
                { value: '2nd', label: 'Edition Book' },
                { value: 'DMC', label: 'Batch 80' },
              ].map((stat, i) => (
                <div key={i} className="text-center min-w-[100px]">
                  <div className="text-xl md:text-2xl font-bold text-orange-600 dark:text-orange-400">{stat.value}</div>
                  <div className="text-gray-500 dark:text-gray-400 text-xs mt-0.5 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400 dark:text-gray-500 animate-bounce">
          <div className="w-px h-6 bg-gray-300 dark:bg-gray-700" />
          <span className="text-[10px] tracking-widest uppercase font-medium">Scroll</span>
        </div>
      </div>

      {/* ── PAGE SUMMARY CARDS ── */}
      <div className="px-6 py-16 bg-gradient-to-b from-orange-50 to-white dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* About Card */}
            <Link to="/about" className="group p-6 rounded-3xl backdrop-blur-md bg-white/60 dark:bg-gray-800/50 border border-white/60 dark:border-gray-700/40 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-orange-500 transition-colors duration-300">
                <Users size={26} className="text-orange-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">About Me</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                Learn about Jit's journey as a medical student, educator and author. Education, experience and achievements all in one place.
              </p>
              <span className="flex items-center gap-1 text-orange-500 text-sm font-medium group-hover:gap-2 transition-all">
                View Profile <ChevronRight size={16} />
              </span>
            </Link>

            {/* Book Card */}
            <Link to="/book" className="group p-6 rounded-3xl backdrop-blur-md bg-white/60 dark:bg-gray-800/50 border border-white/60 dark:border-gray-700/40 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-orange-500 transition-colors duration-300">
                <BookOpen size={26} className="text-orange-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">My Book</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-3">
                <span className="font-medium text-gray-800 dark:text-white">Basic Chemistry & Organic</span> — 2nd Edition. Written to break down complex chemistry for every medical aspirant.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-orange-500">৳ {bookData?.price || '350'}</span>
                <span className="flex items-center gap-1 text-orange-500 text-sm font-medium group-hover:gap-2 transition-all">
                  View Book <ChevronRight size={16} />
                </span>
              </div>
            </Link>

            {/* Lecture Notes Card — Replaced the redundant Order Card to preserve grid design balance */}
            <Link to="/notes" className="group p-6 rounded-3xl backdrop-blur-md bg-white/60 dark:bg-gray-800/50 border border-white/60 dark:border-gray-700/40 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-orange-500 transition-colors duration-300">
                <FileText size={26} className="text-orange-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Lecture Notes</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                Premium chapter-wise medical admission notes. Secure canvas streaming layout with custom pricing modules.
              </p>
              <span className="flex items-center gap-1 text-orange-500 text-sm font-medium group-hover:gap-2 transition-all">
                Study Materials <ChevronRight size={16} />
              </span>
            </Link>

            {/* Blog Card */}
            <Link to="/blog" className="group p-6 rounded-3xl backdrop-blur-md bg-white/60 dark:bg-gray-800/50 border border-white/60 dark:border-gray-700/40 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-orange-500 transition-colors duration-300">
                <PenSquare size={26} className="text-orange-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Blog & Articles</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                Study tips, chemistry guides and personal stories from Jit's journey as a medical student and educator.
              </p>
              <span className="flex items-center gap-1 text-orange-500 text-sm font-medium group-hover:gap-2 transition-all">
                Read Articles <ChevronRight size={16} />
              </span>
            </Link>

            {/* Lectures Card */}
            <Link to="/videos" className="group p-6 rounded-3xl backdrop-blur-md bg-white/60 dark:bg-gray-800/50 border border-white/60 dark:border-gray-700/40 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-orange-500 transition-colors duration-300">
                <Play size={26} className="text-orange-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Video Lectures</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                Chapter-wise video lectures on Organic Chemistry, Basic Chemistry and medical admission prep. Login to watch.
              </p>
              <span className="flex items-center gap-1 text-orange-500 text-sm font-medium group-hover:gap-2 transition-all">
                Watch Lectures <ChevronRight size={16} />
              </span>
            </Link>

            {/* Contact Card */}
            <Link to="/contact" className="group p-6 rounded-3xl backdrop-blur-md bg-white/60 dark:bg-gray-800/50 border border-white/60 dark:border-gray-700/40 shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 -col shadow">
              <div className="w-14 h-14 bg-orange-100 dark:bg-orange-900/30 rounded-2xl flex items-center justify-center mb-5 group-hover:bg-orange-500 transition-colors duration-300">
                <Mail size={26} className="text-orange-500 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Get in Touch</h3>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mb-4">
                Have a question about the book, lectures or admissions? Send a message directly to Jit via WhatsApp or email.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500 dark:text-gray-400">{contactData?.phone || '01822496928'}</span>
                <span className="flex items-center gap-1 text-orange-500 text-sm font-medium group-hover:gap-2 transition-all">
                  Contact <ChevronRight size={16} />
                </span>
              </div>
            </Link>

          </div>
        </div>
      </div>

      {/* ── BOOK HIGHLIGHT BANNER ── */}
      <div className="px-6 py-16 bg-white dark:bg-gray-800 transition-colors duration-300">
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden p-8 md:p-12 rounded-3xl bg-gradient-to-br from-orange-500 to-orange-600 shadow-2xl shadow-orange-200 dark:shadow-orange-900/40">

            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />

            <div className="relative flex flex-col md:flex-row items-center gap-8">
              <div className="flex-1 text-white">
                <div className="inline-block px-4 py-1 bg-white/20 rounded-full text-sm font-medium mb-4">
                  📚 Now Available — 2nd Edition
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-3">Basic Chemistry & Organic</h2>
                <p className="text-white/80 text-lg mb-2">by Jit Biswas · Medilogy Publication</p>
                <p className="text-white/70 leading-relaxed mb-6">
                  Written to break down complex chemistry concepts into clear, digestible lessons that every medical aspirant can master.
                </p>
                <div className="flex flex-wrap gap-4 items-center">
                  <Link to="/order"
                    className="flex items-center gap-2 px-8 py-3 bg-white text-orange-500 rounded-full font-bold text-lg hover:bg-orange-50 transition shadow-lg">
                    <ShoppingCart size={20} /> Buy Now — ৳ {bookData?.price || '400'}
                  </Link>
                  <Link to="/book"
                    className="flex items-center gap-2 px-8 py-3 bg-white/20 hover:bg-white/30 text-white rounded-full font-bold text-lg transition border border-white/30">
                    Preview <ChevronRight size={20} />
                  </Link>
                </div>
              </div>

              {/* PDF Container Slot using object integration layout */}
              <div className="flex-shrink-0">
                <div className="w-36 h-48 md:w-44 md:h-56 rounded-2xl overflow-hidden shadow-2xl transition-transform duration-300 hover:scale-105 border border-white/20 bg-white">
                  <object
                    data={`${bookCoverPdf}#view=FitH&toolbar=0&navpanes=0&scrollbar=0`}
                    type="application/pdf"
                    className="w-full h-full object-cover pointer-events-none"
                  >
                    {/* Dynamic Text Fallback structure if user device has embedded PDF modules blocked */}
                    <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center bg-orange-100 text-orange-700">
                      <BookOpen size={32} className="mb-2" />
                      <span className="text-xs font-bold font-sans">Basic Chemistry & Organic</span>
                    </div>
                  </object>
                </div>
              </div>
              
            </div>
          </div>
        </div>
      </div>

      {/* ── STATS STRIP ── */}
      <div className="px-6 py-12 bg-gradient-to-b from-white to-orange-50 dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '5+', label: 'Years Teaching', icon: '🎓' },
              { value: '1000+', label: 'Students Guided', icon: '👨‍🎓' },
              { value: '2nd', label: 'Edition Book', icon: '📚' },
              { value: 'DMC', label: 'Batch 89', icon: '🏥' },
            ].map((stat, i) => (
              <div key={i} className="p-6 rounded-2xl backdrop-blur-md bg-white/50 dark:bg-gray-800/50 border border-white/60 dark:border-gray-700/40 shadow-lg text-center">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-bold text-orange-500 mb-1">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-300 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  )
}

export default Home