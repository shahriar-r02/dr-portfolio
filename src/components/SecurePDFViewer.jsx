import { useState, useEffect } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import { ChevronLeft, ChevronRight, ShieldAlert } from 'lucide-react'

// Bind the mandatory worker to convert PDF layers into secure canvas prints
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`

export default function SecurePDFViewer({ fileUrl, isPreview }) {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  function onDocumentLoadSuccess({ numPages }) {
    // Force cut-off at page 2 if it's a preview file
    setNumPages(isPreview ? Math.min(2, numPages) : numPages)
  }

  useEffect(() => {
    // Block inspector, print, and save shortcut controls
    const preventShortcuts = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's' || e.key === 'u')) {
        e.preventDefault()
      }
    }
    const blockContext = (e) => e.preventDefault()

    document.addEventListener('contextmenu', blockContext)
    document.addEventListener('keydown', preventShortcuts)

    return () => {
      document.removeEventListener('contextmenu', blockContext)
      document.removeEventListener('keydown', preventShortcuts)
    }
  }, [])

  return (
    <div className="flex flex-col items-center bg-gray-100 dark:bg-gray-800/60 p-4 rounded-2xl select-none">
      {isPreview && (
        <div className="w-full flex items-center gap-2 mb-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 p-3 rounded-xl text-xs md:text-sm font-medium">
          <ShieldAlert size={18} />
          You are reading a 2-page preview sample. Purchase this module to unlock all chapters.
        </div>
      )}

      {/* The canvas frame wrapper */}
      <div className="overflow-auto max-w-full bg-white shadow-inner rounded-xl border border-gray-200 dark:border-gray-700 pointer-events-none">
        <Document
          file={fileUrl}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div className="p-10 text-gray-500 text-sm">Loading document securely...</div>}
        >
          <Page 
            pageNumber={pageNumber} 
            renderAnnotationLayer={false} 
            renderTextLayer={false} 
          />
        </Document>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-4 mt-4">
        <button
          disabled={pageNumber <= 1}
          onClick={() => setPageNumber(prev => prev - 1)}
          className="p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full disabled:opacity-40 text-gray-700 dark:text-white"
        >
          <ChevronLeft size={18} />
        </button>
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Page {pageNumber} of {numPages || '?'}
        </span>
        <button
          disabled={pageNumber >= numPages}
          onClick={() => setPageNumber(prev => prev + 1)}
          className="p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-full disabled:opacity-40 text-gray-700 dark:text-white"
        >
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}