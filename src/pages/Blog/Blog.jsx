import React, { useEffect, useRef, useState } from 'react';
import CommanTable from '../../components/Table/CommomTable';
import { useDispatch, useSelector } from 'react-redux';
import { getBlog, deleteBlog, updateBlog, updateStatus } from '../../ReduxToolkit/Slice/Blog';
import AddBlog from './AddBlog';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import JoditEditor from 'jodit-react';

function Blog() {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [blogTitle, setBlogTitle] = useState("");
    const [image, setImage] = useState(null);
    const [description, setDescription] = useState("");
    const [id, setId] = useState("");
    const closeButtonRef = useRef(null);
    const [isIconValid, setIsIconValid] = useState(true);
    const [loading, setLoading] = useState(false);
    const { blogs, status } = useSelector((state) => state.blog);

    useEffect(() => {
        if (status === "idle") {
            dispatch(getBlog());
        } else if (status === "succeeded") {
            handleCloseModal();
            setLoading(false);
        } else if (status === "uploading") {
            setLoading(true);
        } else if (status === "failed") {
            setLoading(false);
        }
    }, [dispatch, status]);

    const handleBlogDeletion = (blogId) => {
        const isConfirmed = window.confirm("Are you sure you want to delete this Blog?");

        if (isConfirmed) {
            dispatch(deleteBlog(blogId));
        }
    };

    const handleEditData = (id) => {
        const selectedBlog = blogs.find(blog => blog._id === id);

        if (selectedBlog) {
            setBlogTitle(selectedBlog.blogTitle);
            setImage(selectedBlog.image);
            setDescription(selectedBlog.description);
            setId(id);
            setIsModalOpen(true);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!image) {
            setIsIconValid(false);
            return;
        }
        setIsIconValid(true);

        const formData = new FormData();
        formData.append("blogTitle", blogTitle);
        formData.append("image", image);
        formData.append("description", description);
        dispatch(updateBlog({ blogId: id, formData }));
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setBlogTitle("");
        setImage(null);
        setDescription("");
    };

    const handleBlogStatus = (blogId, currentStatus) => {
        const isConfirmed = window.confirm("Are you sure you want to update the status of this Blog?");

        const updatedStatus = !currentStatus;

        if (isConfirmed) {
            dispatch(updateStatus({ blogId, updatedStatus }));
        }
    };

    const columns = [
        { label: "Title", accessor: "blogTitle" },
        {
            label: "Image", accessor: "image", formatter: (images) => {
                if (images && images.length > 0) {
                    return (
                        <img
                            src={images}
                            alt="Blog"
                            style={{ width: "50px", height: "50px", objectFit: "cover" }}
                            className="rounded-3xl img-fit"
                        />
                    );
                } else {
                    return "No Image";
                }
            },
        },
        {
            label: "Status",
            accessor: "status",
            formatter: (status, row) => {
                return (
                    <span
                        onClick={() => handleBlogStatus(row._id, status)}
                        className="cursor-pointer"
                    >
                        {status
                            ? <i className='bg-green-300 px-4 py-1 rounded-2xl'>True</i>
                            : <i className='bg-red-300 px-4 py-1 rounded-2xl'>False</i>}
                    </span>
                );
            },
        }
    ];

    return (
        <div>
            <div className="flex justify-between items-center m-3">
                <h3 className="text-lg font-semibold">Blog</h3>
                <AddBlog />
            </div>
            <CommanTable
                columns={columns}
                data={blogs || []}
                status={status}
                onDelete={handleBlogDeletion}
                onEdit={handleEditData}
            />

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black bg-opacity-50"
                    id="exampleModal"
                    tabIndex={-1}
                    aria-labelledby="exampleModalLabel"
                    aria-hidden="true"
                >
                    <div className="relative w-full max-w-7xl p-4">
                        <div className="relative bg-white rounded-lg shadow-lg">
                            <div className="flex items-start justify-between p-4 border-b border-gray-200 rounded-t-lg">
                                <h1 className="text-lg font-medium" id="exampleModalLabel">
                                    Edit Blog
                                </h1>
                                <button
                                    type="button"
                                    className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center"
                                    onClick={handleCloseModal}
                                    aria-label="Close"
                                >
                                    <svg
                                        className="w-5 h-5"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        ></path>
                                    </svg>
                                </button>
                            </div>
                            <div className="p-6 overflow-y-auto max-h-[70vh]">
                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                        <div>
                                            <Input
                                                label="Title"
                                                type="text"
                                                placeholder="Enter Title"
                                                value={blogTitle}
                                                required
                                                onChange={(e) => setBlogTitle(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <Input
                                                label="Image"
                                                type="file"
                                                onChange={(e) => setImage(e.target.files[0])}
                                            />
                                        </div>
                                        <div className='col-span-2'>
                                            <label htmlFor="description">
                                                Description
                                            </label>
                                            <JoditEditor
                                                required={true}
                                                value={description}
                                                tabIndex={1}
                                                onBlur={newContent => setDescription(newContent)}
                                                onChange={newContent => { }}
                                            />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-end p-4 border-t border-gray-200 rounded-b-lg">
                                        <button
                                            type="button"
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
                                            onClick={handleCloseModal}
                                        >
                                            Cancel
                                        </button>
                                        <Button
                                            type="submit"
                                            children={loading ? "Updating..." : "Update"}
                                            disabled={loading}
                                            className="ml-2 px-4 py-2 text-sm font-medium text-white bg-themeColor rounded-lg hover:bg-blue-700"
                                        />
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Blog;
