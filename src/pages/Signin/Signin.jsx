import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SignInAPi } from "../../ReduxToolkit/Slice/Signin";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signin() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const status = useSelector((state) => state.signIn.status);
    const loginError = useSelector((state) => state.signIn.error);
    const notify = () =>
        toast.error(
            loginError ? loginError : "Admin not found! Please try again later"
        );

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const submit = (e) => {
        e.preventDefault();
        dispatch(SignInAPi({ email, password }));
    };

    useEffect(() => {
        if (status === "failed") {
            notify();
        }
        if (status === "succeeded") {
            navigate("/");
            window.location.reload(false);
        }
    }, [status]);

    return (
        <>
            <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
                <form onSubmit={submit} className="bg-themeColor p-6 rounded-lg shadow-lg w-full max-w-md">
                    <div className="text-center mb-6">
                        <h5 className="text-white text-lg font-bold">Assist</h5>
                        <h2 className="text-white text-2xl font-semibold">Login</h2>
                    </div>
                    <ToastContainer />
                    <div className="mb-4">
                        <label htmlFor="email" className="block text-white mb-2">Email</label>
                        <input
                            required
                            type="email"
                            id="email"
                            className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter Your Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-white mb-2">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                id="password"
                                className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="********"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                className="absolute inset-y-0 right-0 flex items-center px-4 text-gray-500"
                                onClick={togglePasswordVisibility}
                            >
                                {showPassword ? (
                                    <i className="bi bi-eye-slash-fill"></i>
                                ) : (
                                    <i className="bi bi-eye-fill"></i>
                                )}
                            </button>
                        </div>
                    </div>
                    <div>
                        <button
                            type="submit"
                            className="w-full py-2 text-themeColor bg-white rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 ease-in-out"
                            disabled={status === "loading"}
                        >
                            {status === "loading" ? (
                                <div className="flex justify-center">
                                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-themeColor"></div>
                                </div>
                            ) : (
                                "Login"
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default Signin;
