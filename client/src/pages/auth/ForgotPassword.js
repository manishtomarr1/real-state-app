import { useState } from "react";
import axios from "axios";
import { Toast, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  //state
  const [email, setEmail] = useState("");
  const [loding, setLoding] = useState(false);

  //hooks
  const navigate = useNavigate(); //for navigate to another page

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      //  console.table({email,password})
      setLoding(true);
      const { data } = await axios.post(`/forgot-password`, { email });
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
        toast.success("please check your email for password reset link");
        setLoding(false);
        navigate("/");
      }
    } catch (err) {
      console.log(err);
      toast.error("something went wrong try again");
      setLoding(false);
    }
  };

  return (
    <div>
      <h1 className="display-1 bg-primary text-light p-5">forgot password</h1>
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
              <button disabled={loding} className="btn btn-primary col-12 mb-4">
                {loding ? "waiting..." : "submit"}
              </button>
            </form>
            <Link className="text-danger" to="/login">
              back to login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
