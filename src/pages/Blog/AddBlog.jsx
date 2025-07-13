import React, { useState, useRef, useEffect } from "react";
import Button from "../../components/Button/Button";
import PageTitle from "../../components/PageTitle/PageTitle";
import Input from "../../components/Input/Input";
import { createBlog } from "../../ReduxToolkit/Slice/Blog";
import { useDispatch, useSelector } from "react-redux";
import JoditEditor from "jodit-react";

function AddBlog() {
    const dispatch = useDispatch();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [blogTitle, setBlogTitle] = useState("");
    const [image, setImage] = useState("");
    const [description, setDescription] = useState("");
    const closeButtonRef = useRef(null);
    const [isIconValid, setIsIconValid] = useState(true);
    const [loading, setLoading] = useState(false);
    const blogStatus = useSelector((state) => state.blog.status);

    const YourComponent = () => {
    const [description, setDescription] = useState('');

    useEffect(() => {
        if (blogStatus === "succeeded") {
            handleCloseModal();
            setLoading(false);
        } else if (blogStatus === "uploading") {
            setLoading(true);
        } else if (blogStatus === "failed") {
            setLoading(false);
        }
    }, [blogStatus]);

    const handleOpenModal = () => setIsModalOpen(true);
    const handleCloseModal = () => {
        setIsModalOpen(false);
        setBlogTitle("");
        setImage("");
        setDescription("");
    }

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

        dispatch(createBlog(formData));
    };

    return (
        <>
            <Button
                onClick={handleOpenModal}
                children={"Add Blog"}
                icon="plus-circle-fill"
            />
            {isModalOpen && (
                <div className="fixed inset-2 z-50 overflow-y-auto flex items-center justify-center min-h-full p-4">
                    <div className="fixed inset-0 bg-black opacity-50" onClick={handleCloseModal}></div>
                    <div className="relative w-full max-w-6xl bg-white rounded-lg shadow-lg">
                        <div className="flex justify-between items-center p-4 border-b">
                            <PageTitle
                                className="text-lg font-medium"
                                children={"Upload Blog"}
                            />
                            <Button
                                type="button"
                                bgColor="bg-transparent"
                                textColor="text-black"
                                className="text-black hover:bg-gray-200 rounded-full p-2"
                                onClick={handleCloseModal}
                                ref={closeButtonRef}
                            >
                                <span className="text-2xl">&times;</span>
                            </Button>
                        </div>
                        <div className="p-6">
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
                                            className="w-full"
                                        />
                                    </div>
                                    <div>
                                        <Input
                                            label="Images"
                                            type="file"
                                            onChange={(e) => setImage(e.target.files[0])}
                                        />
                                        {!isIconValid && (
                                            <div className="text-danger">
                                                At least one image is required.
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="col-span-2 mt-4">
                                    <label htmlFor="description" className="form-label">
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

                                <div className="flex justify-end space-x-2 mt-4">
                                    <button
                                        type="button"
                                        className="bg-gray-500 text-white px-4 py-2 rounded"
                                        onClick={handleCloseModal}
                                    >
                                        Close
                                    </button>
                                    <Button
                                        type="submit"
                                        children={loading ? "Uploading..." : "Upload"}
                                        disabled={loading}
                                    />
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default AddBlog;
