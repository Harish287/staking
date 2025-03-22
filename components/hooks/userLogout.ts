import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/auth-slice/store"; // Ensure correct store path
import { logoutUser } from "../../redux/auth-slice/index"; 
import Cookies from "js-cookie";

const useLogout = () => {
  const dispatch = useDispatch<AppDispatch>(); 
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap(); 

 
      Cookies.remove("token");
      localStorage.removeItem("token");


      router.push("/auth/signin");

    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return { handleLogout };
};

export default useLogout;
