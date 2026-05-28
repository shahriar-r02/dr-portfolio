import { useState } from 'react'
import { GraduationCap, Briefcase, Award, ExternalLink, FileText, Image } from 'lucide-react'
import jitPhoto from '../assets/images/jit.jpg'
import { useSettings } from '../hooks/useSettings'

const achievementIcons = ['🏆', '🎓', '👨‍🎓', '📚', '⭐', '🥇', '🌟', '💪']

const defaultEducation = [
  { school: 'Dhaka Medical College', degree: 'MBBS 4th Year Batch 89', year: 'Current' },
  { school: 'Cantonment College Jashore', degree: 'Higher Secondary Certificate', year: 'College' },
  { school: 'Akij Collegiate School', degree: 'Secondary School Certificate', year: 'High School' },
  { school: 'Sunrise Public School', degree: 'Primary Education', year: 'Primary' },
]

const defaultExperience = [
  { role: 'Instructor', place: 'Medilogy', desc: 'Teaching chemistry and guiding medical admission aspirants across Bangladesh', duration: '5+ Years' },
  { role: 'MBBS Student', place: 'Dhaka Medical College', desc: 'Pursuing MBBS degree Batch 89', duration: 'Current' },
]

const defaultData = {
  bio1: "I am a 4th-year student at Dhaka Medical College and a dedicated educator with over 5 years of teaching experience in medical admission preparation.",
  bio2: "I am the author of Basic Chemistry and Organic, now in its 2nd Edition, published by Medilogy Publication.",
  facebookLink: "https://www.facebook.com/jit.biswas.153352",
  medilogyLink: "https://medilogy.com",
  achievements: [],
  education: defaultEducation,
  experience: defaultExperience
}

function About() {
  const { data, loading } = useSettings('about')
  const d = data || defaultData
  const [proofModal, setProofModal] = useState(null)

  const achievements = d.achievements && d.achievements.length > 0
    ? d.achievements.map(a => typeof a === 'string' ? { title: a, proofUrl: '', proofType: '' } : a)
    : defaultData.achievements

  return (
    <div className="pt-24 px-6 pb-16">
      <div className="max-w-6xl mx-auto">

        {proofModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setProofModal(null)}>
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-700">
                <h3 className="font-bold text-gray-800 dark:text-white text-lg">{proofModal.title}</h3>
                <button onClick={() => setProofModal(null)} className="p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">✕</button>
              </div>
              <div className="p-6 overflow-auto max-h-[70vh]">
                {proofModal.proofType === 'image' ? (
                  <img src={proofModal.proofUrl} alt={proofModal.title} className="w-full rounded-2xl object-contain max-h-[60vh]" />
                ) : (
                  <iframe src={proofModal.proofUrl + '#toolbar=0'} className="w-full h-[60vh] rounded-2xl" title={proofModal.title} style={{ border: 'none' }} />
                )}
              </div>
              <div className="p-6 border-t border-gray-100 dark:border-gray-700 flex justify-end">
                <a href={proofModal.proofUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-6 py-2 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition">
                  <ExternalLink size={16} /> Open in New Tab
                </a>
              </div>
            </div>
          </div>
        )}

        <div className="text-center mb-16">
          <div className="inline-block px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium mb-4">
            About Me
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 dark:text-white">
            Who is <span className="text-orange-500">Jit Biswas?</span>
          </h1>
        </div>

        <div className="flex flex-col md:flex-row gap-12 items-center mb-16">
          <div className="flex-1 flex justify-center">
            <div className="w-48 h-48 md:w-64 md:h-64 rounded-3xl overflow-hidden shadow-2xl">
              <img src={jitPhoto} alt="Jit Biswas" className="w-full h-full object-cover object-[center_20%]" />
            </div>
          </div>
          <div className="flex-1 space-y-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Jit Biswas</h2>
            <p className="text-orange-500 font-medium">MBBS Student & Medical Educator</p>
            {loading ? (
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse w-4/5" />
              </div>
            ) : (
              <>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{d.bio1}</p>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{d.bio2}</p>
              </>
            )}
            <div className="flex gap-4 pt-2">
              <a href={d.facebookLink || defaultData.facebookLink} target="_blank" rel="noreferrer" className="px-5 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-full font-medium transition">
                Facebook
              </a>
              <a href={d.medilogyLink || defaultData.medilogyLink} target="_blank" rel="noreferrer" className="px-5 py-2 bg-white/40 dark:bg-gray-700/40 border border-white/30 dark:border-gray-600 text-gray-700 dark:text-gray-200 rounded-full font-medium hover:bg-white/60 transition">
                Medilogy
              </a>
            </div>
          </div>
        </div>

        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              <GraduationCap className="text-orange-500" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Education</h2>
          </div>
          <div className="space-y-4">
            {loading ? (
              [1,2,3,4].map(i => <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />)
            ) : (
              (d.education && d.education.length > 0 ? d.education : defaultEducation).map((item, index) => (
                <div key={index} className="p-6 rounded-2xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 shadow-lg flex justify-between items-center">
                  <div>
                    <h3 className="font-bold text-gray-800 dark:text-white">{item.school}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm">{item.degree}</p>
                  </div>
                  <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium">{item.year}</span>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
              <Briefcase className="text-orange-500" size={24} />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Experience</h2>
          </div>
          <div className="space-y-4">
            {loading ? (
              [1,2].map(i => <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />)
            ) : (
              (d.experience && d.experience.length > 0 ? d.experience : defaultExperience).map((item, index) => (
                <div key={index} className="p-6 rounded-2xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 shadow-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-gray-800 dark:text-white">{item.role}</h3>
                      <p className="text-orange-500 font-medium text-sm">{item.place}</p>
                      <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">{item.desc}</p>
                    </div>
                    <span className="px-3 py-1 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium">{item.duration}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {achievements.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-xl">
                <Award className="text-orange-500" size={24} />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Achievements</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {loading ? (
                [1,2,3,4].map(i => <div key={i} className="h-24 bg-gray-200 dark:bg-gray-700 rounded-2xl animate-pulse" />)
              ) : (
                achievements.map((item, index) => (
                  <div key={index} className="p-6 rounded-2xl backdrop-blur-md bg-white/30 dark:bg-gray-800/30 border border-white/40 dark:border-gray-700/40 shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="text-4xl flex-shrink-0">{achievementIcons[index % achievementIcons.length]}</div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-800 dark:text-white">{item.title}</h3>
                        {item.proofUrl && (
                          <button onClick={() => setProofModal(item)} className="mt-3 flex items-center gap-2 px-4 py-1.5 bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-xs font-medium hover:bg-orange-200 transition">
                            {item.proofType === 'image' ? <Image size={12} /> : <FileText size={12} />}
                            View Proof / Certificate
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  )
}

export default About