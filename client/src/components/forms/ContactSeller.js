import { useState, useEffect } from "react";
import { useAuth } from "../../context/auth";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

export default function ContactSeller({ ad }) {
  // context
  const [auth, setAuth] = useAuth();
  // state

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);

  // hooks
  const navigate = useNavigate();

  const loggedIn = auth.user !== null && auth.token !== "";

  useEffect(() => {
    if (loggedIn) {
      setName(auth.user?.name);
      setEmail(auth.user?.email);
      setPhone(auth.user?.phone);
    }
  }, [loggedIn]);

  const handleSubmit = async (e) => {
e.preventDefault()
    setLoading(true);
    try {
        const {data} = await axios.post('/contact-seller' , {
            name,email,message,phone,adId:ad._id
        })
        if(data?.error){
            toast.error(data?.error)
            setLoading(false)
        }
        else{
            toast.success("your enquiry has been emailed to the seller")
            setLoading(false)
            setMessage("")
        }
      console.log(name, email, message, phone);
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("Something went wrong. Try again.");
    }
  };

  return (
    <div className="card shadow px-3 py-3">
      <div className="row">
        <div className="col">
          <div className="row mx-2 mb-6 mt-3">
            <div>
              <h4>Contact {ad?.postedBy?.name ?? ad?.postedBy?.username}</h4>
              <p>
                About {ad?.type} in {ad?.address} for {ad?.action} ₹{ad?.price}
              </p>
            </div>

            <textarea
              className="form-control mb-3"
              name="message"
              value={message}
              placeholder="✍️ Write description"
              onChange={(e) => setMessage(e.target.value)}
              required
              color="black"
            />

            <input
              name="name"
              type="text"
              className="form-control mb-3 text-danger"
              placeholder="Enter your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={auth?.user?.name}
              required
              color="black"
            />

            <input
              type="email"
              placeholder="Enter your email"
              className="form-control mb-3 text-danger"
              value={email}
              onChange={(e) => setEmail(e.target.value?.toLowerCase())}
              disabled={auth?.user?.email}
              required
              color="black"
            />

            <input
              name="phone"
              type="text"
              className="form-control mb-3 text-danger"
              placeholder="Enter your phone"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={auth?.user?.phone}
              color="black"
            />

            <button
              className="btn btn-primary"
              disabled={!name || !email || loading}
              onClick={handleSubmit}
            >
              {loggedIn
                ? loading
                  ? "Please wait.."
                  : "Send enquiry"
                : "please login to send enquiry"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
