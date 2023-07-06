import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; //for fatch the token
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { Navigate } from "react-router-dom";

export default function AccessAccount() {
  //context
  const [auth, setAuth] = useAuth();

  //hooks
  // const params=useParams()
  const { token } = useParams();
  console.log(token);
  const navigate = useNavigate();

  const requestAccess = async () => {
    try {
      const { data } = await axios.post(`/access-account`, {
        resetCode: token,
      });

      if (data?.error) {
        toast.error(data.error);
      } else {
        //save in local storage
        localStorage.setItem("auth", JSON.stringify(data)); ///data is that data which come when we hit api
        //save in context
        setAuth(data);
        toast.success("please update your passsword in profile page");
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong try again!");
    }
  };
  useEffect(() => {
    if (token) {
      requestAccess();
    }
  }, [token]); //if few milisecond delay
  return (
    <div className="display-1 d-flex justify-content-center align-items-center vh-100">
      please wait...
    </div>
  );
}
