import React from 'react';

const Spinner = () => (
  <svg
    className="animate-spin h-4 w-4 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    aria-hidden="true"
  >
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

const ConfirmDialog = ({
  open,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
}) => {
  if (!open) return null;

  const handleCancel = () => {
    if (loading) return;
    if (typeof onCancel === 'function') {
      onCancel();
    }
  };

  const handleConfirm = () => {
    if (loading) return;
    if (typeof onConfirm === 'function') {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70" aria-hidden="true" />
      <div className="relative w-full max-w-md rounded-lg bg-gray-800 p-6 shadow-2xl border border-gray-700">
        <h2 className="text-xl font-semibold text-white">{title}</h2>
        <p className="mt-3 text-sm text-gray-300">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={handleCancel}
            disabled={loading}
            className="px-4 py-2 rounded-md border border-gray-600 text-sm font-medium text-gray-200 hover:bg-gray-700 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={handleConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-red-600 text-sm font-semibold text-white shadow hover:bg-red-500 focus:outline-none disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading && <Spinner />}
            <span>{confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
