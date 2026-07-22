import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import CommanTable from "../../components/Table/CommomTable";
import {
  getJobPosts,
  updateJobPostStatus,
  deleteJobPost,
} from "../../ReduxToolkit/Slice/jobPostSlice";
import JobPostModal from "./JobPostModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

function JobPost() {
  const dispatch = useDispatch();
  const { jobPosts, status } = useSelector((state) => state.jobPost);

  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const [deleteTarget, setDeleteTarget] = useState(null); 
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    if (status === "idle") {
      dispatch(getJobPosts());
    }
  }, [dispatch, status]);

  const handleOpenCreate = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (id) => {
    const row = jobPosts.find((j) => j._id === id);
    if (!row) return;
    setEditData(row);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditData(null);
  };

  const handleToggleStatus = async (row) => {
    const nextStatus = row.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
    setTogglingId(row._id);
    await dispatch(updateJobPostStatus({ jobPostId: row._id, status: nextStatus }));
    setTogglingId(null);
  };

  const handleRequestDelete = (id) => {
    const row = jobPosts.find((j) => j._id === id);
    setDeleteTarget(row || { _id: id });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    setDeleteLoading(true);
    await dispatch(deleteJobPost(deleteTarget._id));
    setDeleteLoading(false);
    setDeleteTarget(null);
  };

  const columns = [
    { label: "Title", accessor: "title" },
    { label: "Location", accessor: "location" },
    { label: "Email", accessor: "email" },
    { label: "Experience", accessor: "experience" },
    {
      label: "Status",
      accessor: "status",
      formatter: (statusVal, row) => {
        const isActive = statusVal === "ACTIVE";
        const isBusy = togglingId === row._id;
        return (
          <button
            type="button"
            onClick={() => handleToggleStatus(row)}
            disabled={isBusy}
            title={isActive ? "Click to deactivate" : "Click to activate"}
            className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors duration-200 disabled:opacity-60 ${
              isActive ? "bg-green-500" : "bg-gray-300"
            }`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
                isActive ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        );
      },
    },
    {
      // label: "End Date",
      // accessor: "end Date",
      formatter: (date) =>
        date ? new Date(date).toLocaleDateString("en-GB") : "-",
    },
    // No custom Action column — CommanTable renders its own Edit/Delete icons
  ];

  return (
    <div className="p-3 md:p-5">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4">
        <h3 className="text-lg font-semibold">Job Posts</h3>
        <button
          onClick={handleOpenCreate}
          className="bg-[#ED1C24] hover:bg-red-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors w-full sm:w-auto"
        >
          + Create Job Post
        </button>
      </div>

      <div className="overflow-x-auto">
        <CommanTable
          columns={columns}
          data={jobPosts || []}
          status={status}
          onEdit={handleOpenEdit}
          onDelete={handleRequestDelete}
        />
      </div>

      <JobPostModal
        open={modalOpen}
        onClose={handleCloseModal}
        editData={editData}
      />

      <ConfirmDeleteModal
        open={Boolean(deleteTarget)}
        title={deleteTarget?.title}
        loading={deleteLoading}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}

export default JobPost;