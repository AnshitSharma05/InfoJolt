import { useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { setSessionChecked, setUser } from "@/redux/authSlice";
import { API_BASE_URL } from "@/config/api";

const AuthBootstrap = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setSessionChecked(false));
    const syncSession = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/v1/user/me`, {
          withCredentials: true,
        });
        if (res.data?.success && res.data?.user) {
          dispatch(setUser(res.data.user));
        } else {
          dispatch(setUser(null));
        }
      } catch {
        dispatch(setUser(null));
      } finally {
        dispatch(setSessionChecked(true));
      }
    };
    syncSession();
  }, [dispatch]);

  return null;
};

export default AuthBootstrap;
