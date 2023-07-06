import { useState } from "react";
import axios from "axios";
import { Toast, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import { Link, useLocation } from "react-router-dom"; //! useLocation-> for going to the same page where it was be ->like unlike page

export default function Login() {
  //context
  const [auth, setAuth] = useAuth();

  //state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loding, setLoding] = useState(false);

  //hooks
  const navigate = useNavigate(); //for navigate to another page
  const location = useLocation();

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      //  console.table({email,password})
      setLoding(true);
      const { data } = await axios.post(`/login`, { email, password });
      console.log(data);
      console.log(">>>>>>>>>>> ok", data.ok);
      const invalidEmail = data.ok;
      console.log(".....invalidemail", invalidEmail);
      if (data?.error) {
        toast.error(data.error); //this will come from backend
        setLoding(false);
      }
      //   } else if (invalidEmail){
      //     toast.error("something went wrong try again")
      //     setLoding(false)
      //   }
      else {
        setAuth(data); //when user login the token and refersh token is store in the context
        localStorage.setItem("auth", JSON.stringify(data));
        toast.success("login successfull");
        setLoding(false);
        location?.state !== null //! yeh wohi like unlike wala matter kaise usi page pe rehna hai.
          ? navigate(location.state)
          : navigate("/dashboard");
      }
    } catch (err) {
      console.log(err);
      toast.error("something went wrong try again");
      setLoding(false);
    }
  };

  return (
    <div>
      <h1 className="display-1 bg-primary text-light p-5">login</h1>
      <div className="container">
        <div className="row">
          <div className="col-lg-4 offset-lg-4">
            <form onSubmit={handelSubmit}>
              <input
                type="text"
                placeholder="Enter your email"
                className="form-control mb-4"
                required
                autoFocus
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              ></input>
              <input
                type="password"
                placeholder="Enter your password"
                className="form-control mb-4"
                required
                autoFocus
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              ></input>
              <button disabled={loding} className="btn btn-primary col-12 mb-4">
                {loding ? "waiting..." : "login"}
              </button>
            </form>
            <Link className="text-danger" to="/auth/forgot-password">
              forgot password
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
