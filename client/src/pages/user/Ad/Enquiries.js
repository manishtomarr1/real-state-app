// import { useAuth } from "../context/auth";
import { useState, useEffect } from "react";
import { useAuth } from "../../../context/auth";
import Sidebar from "../../../components/nav/SideBAr";
import axios from "axios";
import AdCard from "../../../components/cards/AdCard";

export default function Enquiries() {
  //context
  const [auth, setAuth] = useAuth();

  //state
  const [ads, setAds] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAds();
  }, [auth.token !== ""]);

  const fetchAds = async () => {
    try {
      const { data } = await axios.get('/enquired-properties');
      console.log(data)
      setAds(data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1 className="display-1 bg-primary text-light p-5">Enquiries</h1>
      <Sidebar />

      {!ads?.length ? (
        <div
          className="d-flex justify-content-center aling-items-center vh-100 "
          style={{ marginTop: "10%" }}
        >
          <h2>
            hey {auth?.user?.name ? auth?.user?.name : auth.user?.username}, you
            have not enquried any properties yet.
          </h2>
        </div>
      ) : (
        <div className="container">
          <div className="row">
            <div className="col-lg-8 offset-lg-2 mt-4 mb-4">
              <p className="text-center">
                you have enquried {ads?.length} properties
              </p>
            </div>
          </div>
          <div className="row">
            {ads?.map((ad) => (
              <AdCard ad={ad} key={ad._id} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
