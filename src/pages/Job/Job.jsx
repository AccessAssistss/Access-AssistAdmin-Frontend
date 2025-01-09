import React, { useEffect } from 'react';
import CommanTable from '../../components/Table/CommomTable';
import { useDispatch, useSelector } from 'react-redux';
import { getJob, deleteJob } from '../../ReduxToolkit/Slice/Job';

function Job() {
    const dispatch = useDispatch();
    const { jobs, status } = useSelector((state) => state.job);

    useEffect(() => {
        if (status === "idle") {
            dispatch(getJob());
        }
    }, [dispatch, status]);

    const handleJobDeletion = (jobId) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this Job?");
        if (isConfirmed) {
            dispatch(deleteJob(jobId));
        }
    };

    const columns = [
        { label: "Name", accessor: "name" },
        { label: "Email", accessor: "email" },
        { label: "Phone", accessor: "phone" },
        { label: "Qualification", accessor: "qualification" },
        { label: "State", accessor: "state" },
        { label: "Role", accessor: "jobRole" },
        {
            label: "CV",
            accessor: "cv",
            formatter: (cv) => {
                return (
                    <a
                        href={cv}
                        target="blank"
                        download
                        rel="noopener noreferrer"
                        className="cursor-pointer"
                    >
                        <i className="bg-blue-500 px-2 py-1 rounded-2xl text-white hover:bg-blue-400">
                            CV
                        </i>
                    </a>
                );
            },
        }
    ];

    return (
        <div>
            <div className="flex justify-between items-center m-3">
                <h3 className="text-lg font-semibold">Jobs</h3>
            </div>

            <CommanTable
                columns={columns}
                data={jobs || []}
                status={status}
                onDelete={handleJobDeletion}
            />
        </div>
    );
}

export default Job;
