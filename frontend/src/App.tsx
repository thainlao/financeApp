import { BrowserRouter, Routes, Route } from "react-router-dom"
import LoginPage from '../features/auth/LoginPage/LoginPage';
import RegisterPage from "../features/auth/RegisterPage/RegisterPage";
import Dashboard from "../features/dashboard/Dashboard";
import { useAppDispatch, useAppSelector } from "./store/hoocs";
import { useEffect } from "react";
import { fetchUserData, selectIsAuthenticated } from "./store/Reducers/authReducer";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Setting from "../features/setting/Setting";
import FAQ from "../pages/FAQ/FAQ";
import ForgetPassword from "../features/auth/ForgetPassword/ForgetPassword";
import ChangePassword from "../features/auth/ForgetPassword/ChangePassword";

function App() {
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserData());
    }
  }, [isAuthenticated, dispatch]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />}/>
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/register" element={<RegisterPage />}/>
        <Route path="/forgetpass" element={<ForgetPassword />}/>
        <Route path='/change-password' element={<ChangePassword />} />
        <Route path="/setting" element={<Setting />}/>
        <Route path="/faq" element={<FAQ />}/>
      </Routes>
      <ToastContainer toastClassName="toast-container" bodyClassName="toast-message" />
    </BrowserRouter>
  )
}

export default App
