import React from "react";

const ConfirmDeleteModal = ({ open, onClose, onConfirm, title, loading }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-6 text-center">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <span className="text-red-500 text-2xl">🗑️</span>
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">
          Delete Job Post?
        </h3>
        <p className="text-sm text-gray-500 mb-6">
          {title
            ? `Are you sure you want to delete "${title}"? This action cannot be undone.`
            : "Are you sure you want to delete this job post? This action cannot be undone."}
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-60"
          >
            {loading ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;