import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom"; //for fatch the token
import toast from "react-hot-toast";
import axios from "axios";
import { useAuth } from "../../context/auth";
import { Navigate } from "react-router-dom";

export default function AccountActivate() {

    //context
const [auth, setAuth] = useAuth()

  //hooks
  // const params=useParams()
  const { token } = useParams();
  console.log(token);
  const navigate = useNavigate()

  const requestActivation = async () => {
    try {
      const { data } = await axios.post(`/register`, { token });

      if (data?.error) {
        toast.error(data.error);
      } else {
        //save in local storage
        localStorage.setItem("auth",JSON.stringify(data)) ///data is that data which come when we hit api
        //save in context
        setAuth(data)
        toast.success("successfully logged in, welcome to HFE");
        navigate('/')
      }
    } catch (err) {
      console.log(err);
      toast.error("Something went wrong try again!");
    }
  };
  useEffect(() => {
    if (token) {
      requestActivation();
    }
  }, [token]); //if few milisecond delay
  return (
    <div className="display-1 d-flex justify-content-center align-items-center vh-100">
      please wait...
    </div>
  );
}
