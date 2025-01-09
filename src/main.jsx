import {
  RouterProvider,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import { createRoot } from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import store from "./ReduxToolkit/store.js";
import Layout from './Layout.jsx';
import Home from "./pages/Home/Home.jsx";
import Job from "./pages/Job/Job.jsx";
import Signin from "./pages/Signin/Signin.jsx";
import Blog from "./pages/Blog/Blog.jsx";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Home />}></Route>
      <Route path="signin" element={<Signin />}></Route>
      <Route path="job" element={<Job />}></Route>
      <Route path="blog" element={<Blog />}></Route>
    </Route>
  )
)

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
    <ToastContainer />
  </Provider>
)
