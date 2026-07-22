import React, { useEffect, useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { useDispatch, useSelector } from "react-redux";
import {
  createJobPost,
  updateJobPost,
  resetActionStatus,
} from "../../ReduxToolkit/Slice/jobPostSlice";

const QUILL_MODULES = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    ["bold", "italic", "underline", "strike"],
    [{ list: "ordered" }, { list: "bullet" }],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    ["link", "clean"],
  ],
};

const INITIAL_FORM = {
  title: "",
  location: "",
  email: "",
  experience: "",
  description: "",
//   status: "ACTIVE",
  // endDate: "",
};

const JobPostModal = ({ open, onClose, editData }) => {
  const dispatch = useDispatch();
  const { actionStatus } = useSelector((state) => state.jobPost);
  const [form, setForm] = useState(INITIAL_FORM);

  const isEditMode = Boolean(editData?._id);

  useEffect(() => {
    if (editData) {
      setForm({
        title: editData.title || "",
        location: editData.location || "",
        email: editData.email || "",
        experience: editData.experience || "",
        description: editData.description || "",
        // status: editData.status || "ACTIVE",
        // endDate: editData.endDate
        //   ? editData.endDate.substring(0, 10)
        //   : "",
      });
    } else {
      setForm(INITIAL_FORM);
    }
  }, [editData, open]);

  useEffect(() => {
    if (actionStatus === "succeeded") {
      dispatch(resetActionStatus());
      onClose();
    }
  }, [actionStatus, dispatch, onClose]);

  if (!open) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDescriptionChange = (value) => {
    setForm((prev) => ({ ...prev, description: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      dispatch(
        updateJobPost({ jobPostId: editData._id, payload: form }),
      );
    } else {
      dispatch(createJobPost(form));
    }
  };

  const isSubmitting = actionStatus === "loading";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto bg-white rounded-2xl shadow-2xl p-5 md:p-8">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-500 transition-colors"
          aria-label="Close"
        >
          ✕
        </button>

        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">
          {isEditMode ? "Update Job Post" : "Create Job Post"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="e.g. Frontend Developer"
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={form.location}
                onChange={handleChange}
                required
                placeholder="e.g. Gurugram"
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="hr@company.com"
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Experience
              </label>
              <input
                type="text"
                name="experience"
                value={form.experience}
                onChange={handleChange}
                placeholder="e.g. 2 - 4 Years"
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Status
              </label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
              </select>
            </div> */}

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={form.endDate}
                onChange={handleChange}
                className="w-full p-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div> */}
          </div>

          {/* Rich Text Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Description
            </label>
            <ReactQuill
              theme="snow"
              value={form.description}
              onChange={handleDescriptionChange}
              modules={QUILL_MODULES}
              className="bg-white rounded-lg [&_.ql-container]:rounded-b-lg [&_.ql-toolbar]:rounded-t-lg"
              style={{ minHeight: "160px" }}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-colors"
            >
              {isSubmitting
                ? "Saving..."
                : isEditMode
                  ? "Update Job Post"
                  : "Create Job Post"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobPostModal;