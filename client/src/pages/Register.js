import { useState } from "react";
import axios from "axios";
import { API } from "../config";
import { Toast, toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function Register() {
  //state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loding,setLoding] =useState(false)

  //hooks
  const navigate= useNavigate()//for navigate to another page

  const handelSubmit = async (e) => {
    e.preventDefault();
    try {
      //  console.table({email,password})
      setLoding(true)
      const {data}= await axios.post(`/pre-regester`, { email, password });
      console.log(data);
      console.log(">>>>>>>>>>> ok", data.ok)
      const invalidEmail= data.ok
      console.log(".....invalidemail", invalidEmail)
      if(data?.error){
        toast.error(data.error) //this will come from backend
        setLoding(false)
      }
    //   } else if (invalidEmail){
    //     toast.error("something went wrong try again")
    //     setLoding(false)
    //   }
      else{
        toast.success("please check your email to activate account")
        setLoding(false)
        navigate("/")
      }
    } catch (err) {
        console.log(err)
        toast.error("something went wrong try again")
        setLoding(false)
    }
  };

  return (
    <div>
      <h1 className="display-1 bg-primary text-light p-5">Register</h1>
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
              <button  disabled={loding}  className="btn btn-primary col-12 mb-4">{loding ? "waiting..." : "register"}</button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
