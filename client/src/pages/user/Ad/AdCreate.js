// import { useAuth } from "../context/auth";
import { useState } from "react";
import Sidebar from "../../../components/nav/SideBAr";
import { useNavigate } from "react-router-dom";
export default function AdCreate() {
  const [sell, setSell] = useState(false);
  const [rent, setrent] = useState(false);

  //hooks
  const navigate = useNavigate();

  const handleRent = () => {
    setSell(false);
    setrent(true);
  };

  const handleSell = () => {
    setSell(true);
    setrent(false);
  };
  return (
    <div>
      <h1 className="display-1 bg-primary text-light p-5">Ad Create</h1>
      <Sidebar />

      <div
        className="d-flex justify-content-center align-items-center vh-100"
        style={{ marginTop: "-10%" }}
      >
        <div className="col-lg-6">
          <button
            onClick={handleSell}
            className="btn btn-primary btn-lg col-12 p-5"
          >
            Sell
          </button>
          {sell && (
            <div className="my-1">
              <button
                onClick={() => navigate("sell/House")}
                className="btn btn-secondary  col-6 p-5"
                style={{ color: "gray" }}
              >
                house
              </button>
              <button
                onClick={() => navigate("sell/Land")} //* yha se navigate de dia ab app.js se krenge esko handle route se 
                className="btn btn-secondary  col-6 p-5 "
                style={{ color: "gray" }}
              >
                land
              </button>
            </div>
          )}
        </div>

        <div className="col-lg-6">
          <button
            onClick={handleRent}
            className="btn btn-primary btn-lg col-12 p-5"
          >
            Rent
          </button>
          {rent && (
            <div className="my-1">
              <button
                onClick={() => navigate("rent/House")}
                className="btn btn-secondary  col-6 p-5 "
                style={{ color: "gray" }}
              >
                house
              </button>
              <button
                onClick={() => navigate("rent/Land")}
                className="btn btn-secondary  col-6 p-5"
                style={{ color: "gray" }}
              >
                land
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
