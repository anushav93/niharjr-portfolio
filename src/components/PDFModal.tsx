'use client';

import Modal from './Modal';

interface PDFModalProps {
  isOpen: boolean;
  onClose: () => void;
  pdfUrl: string;
  title?: string;
}

export default function PDFModal({ isOpen, onClose, pdfUrl, title }: PDFModalProps) {
  const dialogTitle = title || 'Certificate View';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      className="max-w-5xl h-[90vh] flex flex-col"
      ariaLabelledBy="pdf-modal-title"
    >
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 id="pdf-modal-title" className="text-lg font-medium text-gray-900">
          {dialogTitle}
        </h2>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close certificate viewer"
          className="text-gray-500 hover:text-gray-700 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <div className="flex-1 bg-gray-100 relative">
        <iframe
          src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
          className="w-full h-full absolute inset-0"
          title={dialogTitle}
        />
      </div>
    </Modal>
  );
}
