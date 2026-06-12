import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProjects,
  createProject,
  updateProject,
  updateProjectStatus,
} from "../../ReduxToolkit/Slice/Projects";

const baseUrl = "https://access-assist-admin-backend.vercel.app";

const EMPTY_FORM = { title: "", description: "", image: null, files: [] };

/* ── File Viewer Modal ── */
const FileModal = ({ files, title, onClose }) => {
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const getFileIcon = (fileName = "") => {
    const ext = fileName.split(".").pop().toLowerCase();
    if (ext === "pdf") return "fa-file-pdf";
    if (["doc", "docx"].includes(ext)) return "fa-file-word";
    if (["xls", "xlsx"].includes(ext)) return "fa-file-excel";
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext))
      return "fa-file-image";
    if (["zip", "rar"].includes(ext)) return "fa-file-zipper";
    return "fa-file";
  };

  const resolveUrl = (url) =>
    url?.startsWith("http") ? url : `${baseUrl}/${url?.replace(/^\//, "")}`;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      style={{ backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl w-full max-w-md mx-4 max-h-[75vh] flex flex-col"
        style={{
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          animation: "modalIn 0.18s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <span className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <i className="fa-solid fa-folder-open text-blue-500 text-sm" />
            </span>
            <div>
              <h3 className="text-sm font-semibold text-gray-800">Files</h3>
              {title && (
                <p className="text-xs text-gray-400 truncate max-w-[220px]">
                  {title}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="fa-solid fa-xmark text-sm" />
          </button>
        </div>

        {/* Count */}
        <div className="px-5 pt-3 pb-1">
          <span className="text-xs text-gray-400">
            {files.length} file{files.length !== 1 ? "s" : ""} available
          </span>
        </div>

        {/* List */}
        <div className="overflow-y-auto px-4 pb-4 flex flex-col gap-1.5">
          {files.map((file, i) => {
            const fileName = file.fileName || file.name || `File ${i + 1}`;
            const fileUrl = resolveUrl(file.fileUrl || file.url || file);
            return (
              <a
                key={i}
                href={fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-gray-50 border border-transparent hover:border-gray-100 transition-all group cursor-pointer"
              >
                <span className="flex-shrink-0 w-9 h-9 rounded-lg bg-gray-50 border border-gray-100 flex items-center justify-center group-hover:bg-white transition-colors">
                  <i
                    className={`fa-solid ${getFileIcon(fileName)} text-gray-400 text-sm group-hover:text-blue-500 transition-colors`}
                  />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700 font-medium truncate group-hover:text-blue-600 transition-colors">
                    {fileName}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {fileName.split(".").pop().toUpperCase()} · Click to open
                  </p>
                </div>
                <i className="fa-solid fa-arrow-up-right-from-square text-gray-200 group-hover:text-blue-400 text-xs transition-colors flex-shrink-0" />
              </a>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-50 bg-gray-50 rounded-b-2xl">
          <p className="text-xs text-gray-300 text-center">
            Press Esc or click outside to close
          </p>
        </div>
      </div>
    </div>
  );
};

/* ── Main Component ── */
export default function Project() {
  const dispatch = useDispatch();
  const {
    projects,
    totalProjects,
    projectsThisMonth,
    projectsToday,
    loading,
    actionLoading,
  } = useSelector((state) => state.projects);

  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [togglingId, setTogglingId] = useState(null);
  const [fileModal, setFileModal] = useState(null); // { files, title }

  useEffect(() => {
    dispatch(fetchAllProjects());
  }, [dispatch]);

  const openCreate = () => {
    setEditTarget(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  };
  const openEdit = (project) => {
    setEditTarget(project);
    setForm({
      title: project.title || "",
      description: project.description || "",
      image: null,
      files: [],
    });
    setModalOpen(true);
  };
  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
    setForm(EMPTY_FORM);
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "image") setForm((f) => ({ ...f, image: files[0] }));
    else if (name === "files")
      setForm((f) => ({ ...f, files: Array.from(files) }));
    else setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.description.trim()) return;

    const totalSize =
      (form.image?.size || 0) +
      form.files.reduce((sum, file) => sum + file.size, 0);

    if (totalSize > 5 * 1024 * 1024) {
      alert("Total upload size must be less than 5 MB");
      return;
    }

    const fd = new FormData();

    fd.append("title", form.title);
    fd.append("description", form.description);

    if (form.image) {
      fd.append("image", form.image);
    }

    form.files.forEach((file) => {
      fd.append("files", file);
    });

    if (editTarget) {
      await dispatch(
        updateProject({
          id: editTarget._id,
          formData: fd,
        }),
      );
    } else {
      await dispatch(createProject(fd));
    }

    closeModal();
    dispatch(fetchAllProjects());
  };

  const handleStatusToggle = async (project) => {
    setTogglingId(project._id);
    await dispatch(
      updateProjectStatus({ id: project._id, status: !project.status }),
    );
    await dispatch(fetchAllProjects());
    setTogglingId(null);
  };

  const stats = [
    {
      label: "Total Projects",
      value: totalProjects,
      icon: "fa-folder-open",
      bg: "bg-blue-50",
      iconColor: "text-blue-500",
      border: "border-blue-100",
    },
    {
      label: "This Month",
      value: projectsThisMonth,
      icon: "fa-calendar-days",
      bg: "bg-emerald-50",
      iconColor: "text-emerald-500",
      border: "border-emerald-100",
    },
    {
      label: "Today",
      value: projectsToday,
      icon: "fa-clock",
      bg: "bg-orange-50",
      iconColor: "text-orange-500",
      border: "border-orange-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50/60 p-6 lg:p-8">
      {/* File Viewer Modal */}
      {fileModal && (
        <FileModal
          files={fileModal.files}
          title={fileModal.title}
          onClose={() => setFileModal(null)}
        />
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">
            Projects
          </h1>
          <p className="text-sm text-gray-400 mt-0.5">
            Manage and publish your project portfolio
          </p>
        </div>
        <button
          onClick={openCreate}
          className="flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors duration-200 shadow-sm"
        >
          <i className="fa-solid fa-plus text-xs" />
          New Project
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {stats.map(({ label, value, icon, bg, iconColor, border }) => (
          <div
            key={label}
            className={`${bg} border ${border} rounded-xl p-5 flex items-center gap-4`}
          >
            <div className="w-10 h-10 rounded-lg bg-white flex items-center justify-center shadow-sm flex-shrink-0">
              <i className={`fa-regular ${icon} ${iconColor} text-base`} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-800 leading-none">
                {value}
              </p>
              <p className="text-xs text-gray-500 mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-28 gap-3">
          <span className="loading loading-spinner loading-md text-gray-400" />
          <p className="text-sm text-gray-400">Loading projects…</p>
        </div>
      ) : projects.length === 0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl flex flex-col items-center justify-center py-24 gap-3 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-center">
            <i className="fa-regular fa-folder-open text-gray-300 text-2xl" />
          </div>
          <p className="text-sm font-medium text-gray-500">No projects yet</p>
          <p className="text-xs text-gray-400">
            Click "New Project" to add your first one
          </p>
          <button
            onClick={openCreate}
            className="mt-2 flex items-center gap-2 bg-gray-900 hover:bg-gray-700 text-white text-xs font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <i className="fa-solid fa-plus text-[10px]" />
            New Project
          </button>
        </div>
      ) : (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50/80">
                  {[
                    "#",
                    "Project",
                    "Description",
                    "Files",
                    "Status",
                    "Actions",
                  ].map((h, i) => (
                    <th
                      key={h}
                      className={`text-left text-xs font-semibold text-gray-400 uppercase tracking-wider px-5 py-3.5 ${
                        i === 0 ? "w-10" : ""
                      } ${i === 2 ? "hidden md:table-cell" : ""} ${
                        i === 3 ? "hidden lg:table-cell" : ""
                      } ${i === 5 ? "text-right" : ""}`}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {projects.map((project, index) => {
                  const files = project.files || [];
                  return (
                    <tr
                      key={project._id}
                      className="hover:bg-gray-50/60 transition-colors duration-150 group"
                    >
                      {/* # */}
                      <td className="px-5 py-4 text-gray-300 text-xs font-mono">
                        {String(index + 1).padStart(2, "0")}
                      </td>

                      {/* Project */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {project.image ? (
                            <img
                              src={project.image}
                              alt={project.title}
                              className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-gray-100"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                              <i className="fa-regular fa-image text-gray-300 text-sm" />
                            </div>
                          )}
                          <span className="font-medium text-gray-800 max-w-[160px] truncate">
                            {project.title}
                          </span>
                        </div>
                      </td>

                      {/* Description */}
                      <td className="px-5 py-4 hidden md:table-cell">
                        <span className="text-gray-400 max-w-[240px] truncate block text-xs leading-relaxed">
                          {project.description}
                        </span>
                      </td>

                      {/* Files — single "See Files" button */}
                      <td className="px-5 py-4 hidden lg:table-cell">
                        {files.length > 0 ? (
                          <button
                            onClick={() =>
                              setFileModal({
                                files,
                                title: project.title || "",
                              })
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 hover:border-gray-300 text-gray-600 text-xs font-medium transition-all duration-150"
                          >
                            <i className="fa-solid fa-folder-open text-blue-400 text-[10px]" />
                            See Files
                            <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-gray-100 text-gray-500 text-[10px] font-semibold">
                              {files.length}
                            </span>
                          </button>
                        ) : (
                          <span className="text-gray-200 text-xs">—</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4">
                        {togglingId === project._id ? (
                          <span className="loading loading-spinner loading-xs text-gray-400" />
                        ) : (
                          <button
                            onClick={() => handleStatusToggle(project)}
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-colors duration-150 ${
                              project.status
                                ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                                : "bg-gray-100 text-gray-400 hover:bg-gray-200"
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${project.status ? "bg-emerald-500" : "bg-gray-300"}`}
                            />
                            {project.status ? "Active" : "Inactive"}
                          </button>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <button
                          onClick={() => openEdit(project)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-black text-white hover:bg-gray-800 transition-all duration-200"
                        >
                          <i className="fa-regular fa-pen-to-square text-[10px]" />
                          Edit
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer */}
          <div className="px-5 py-3 border-t border-gray-50 bg-gray-50/50">
            <p className="text-xs text-gray-400">
              Showing {projects.length} of {totalProjects} project
              {totalProjects !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{
            backgroundColor: "rgba(0,0,0,0.45)",
            backdropFilter: "blur(4px)",
          }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
            style={{ animation: "modalIn 0.18s ease-out" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-semibold text-gray-900">
                  {editTarget ? "Edit Project" : "New Project"}
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  {editTarget
                    ? "Update project details below"
                    : "Fill in the details to create a project"}
                </p>
              </div>
              <button
                onClick={closeModal}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <i className="fa-solid fa-xmark text-sm" />
              </button>
            </div>

            {/* Body */}
            <div className="px-6 py-5 flex flex-col gap-5 max-h-[60vh] overflow-y-auto">
              {/* Title */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Enter project title"
                  className="w-full px-3.5 py-2.5 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-gray-400 focus:bg-white transition-all placeholder:text-gray-300"
                />
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Description
                </label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe the project…"
                  rows={3}
                  className="w-full px-3.5 py-2.5 text-sm text-gray-800 bg-gray-50 border border-gray-200 rounded-lg outline-none focus:border-gray-400 focus:bg-white transition-all placeholder:text-gray-300 resize-none"
                />
              </div>

              {/* Image */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Cover Image
                  {editTarget && (
                    <span className="ml-1 text-gray-300 font-normal normal-case">
                      — leave empty to keep current
                    </span>
                  )}
                </label>
                {editTarget?.image && !form.image && (
                  <img
                    src={editTarget.image}
                    alt="current"
                    className="h-20 w-full object-cover rounded-lg border border-gray-100"
                  />
                )}
                <label className="flex items-center gap-3 px-3.5 py-2.5 bg-gray-50 border border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-gray-400 transition-all group">
                  <i className="fa-regular fa-image text-gray-300 group-hover:text-gray-400 transition-colors" />
                  <span className="text-sm text-gray-400 group-hover:text-gray-500 transition-colors truncate">
                    {form.image ? form.image.name : "Choose image…"}
                  </span>
                  <input
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Files */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">
                  Attachments
                  {editTarget && (
                    <span className="ml-1 text-gray-300 font-normal normal-case">
                      — leave empty to keep current
                    </span>
                  )}
                </label>
                <label className="flex items-center gap-3 px-3.5 py-2.5 bg-gray-50 border border-dashed border-gray-200 rounded-lg cursor-pointer hover:border-gray-400 transition-all group">
                  <i className="fa-regular fa-paperclip text-gray-300 group-hover:text-gray-400 transition-colors" />
                  <span className="text-sm text-gray-400 group-hover:text-gray-500 transition-colors truncate">
                    {form.files.length > 0
                      ? `${form.files.length} file${form.files.length > 1 ? "s" : ""} selected`
                      : "Choose files…"}
                  </span>
                  <input
                    type="file"
                    name="files"
                    multiple
                    onChange={handleChange}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2.5 px-6 py-4 border-t border-gray-100 bg-gray-50/50">
              <button
                onClick={closeModal}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={
                  actionLoading ||
                  !form.title.trim() ||
                  !form.description.trim()
                }
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium bg-gray-900 hover:bg-gray-700 disabled:bg-gray-200 disabled:text-gray-400 text-white transition-colors min-w-[100px] justify-center shadow-sm"
              >
                {actionLoading ? (
                  <span className="loading loading-spinner loading-xs" />
                ) : (
                  <>
                    <i
                      className={`fa-solid ${editTarget ? "fa-floppy-disk" : "fa-plus"} text-xs`}
                    />
                    {editTarget ? "Save Changes" : "Create Project"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes modalIn {
          from { opacity: 0; transform: scale(0.97) translateY(6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
