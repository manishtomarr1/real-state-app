import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { LoaderIcon, Toast, toast } from "react-hot-toast";
import CurrencyInput from "react-currency-input-field";
import ImageUpload from "../../../components/forms/ImageUpload";
import Sidebar from "../../../components/nav/SideBAr";

export default function AdEdit({ action, type }) {
  //state
  const [ad, setAd] = useState({
    _id: "",
    photos: [],
    uploading: false,
    price: "",
    address: "",
    bedrooms: "",
    bathrooms: "",
    carpark: "",
    landsize: "",
    type,
    discription: "",
    action,
    title: "",
    loding: false,
  });
  const [loded, setLoded] = useState(false);
  //hooks
  const navigate = useNavigate();
  const params = useParams();

  useEffect(() => {
    if (params?.slug) {
      fatchAd();
    }
  }, [params?.slug]);

  const fatchAd = async () => {
    try {
      const { data } = await axios.get(`/ad/${params.slug}`);
      setAd(data?.ad);
      setLoded(true);
    } catch (err) {
      console.log(err);
    }
  };
  const handleDelete = async () => {
    try {
      setAd({ ...ad, loding: true });

      const { data } = await axios.delete(`/ad/${ad._id}`);
      // console.log("ad create successfully", data);
      if (data?.error) {
        toast.error(data.error);
        setAd({ ...ad, loding: false });
      } else {
        toast.success("ad deleted successfully");
        setAd({ ...ad, loding: false });
        navigate("/dashboard");
     
    } }catch (err) {
      console.log(err);
      setAd({ ...ad, loding: false });
    }
  };

  const handleClick = async () => {
    try {
      //valiadtion
      if (!ad.photos?.length) {
        toast.error("photo is required");
        return;
      } else if (!ad?.price) {
        toast.error("price is required");
        return;
      } else if (!ad?.discription) {
        toast.error("discription is required");
        return;
      } else {
        //make put request
        setAd({ ...ad, loding: true });

        const { data } = await axios.put(`/ad/${ad._id}`, ad);
        // console.log("ad create successfully", data);
        if (data?.error) {
          toast.error(data.error);
          setAd({ ...ad, loding: false });
        } else {
          toast.success("ad updated successfully");
          setAd({ ...ad, loding: false });
          navigate("/dashboard");
          //navigation
        }
      }
    } catch (err) {
      console.log(err);
      setAd({ ...ad, loding: false });
    }
  };
  return (
    <div>
      <h1 className="display-1 bg-primary text-light p-5">Update Ad</h1>
      <Sidebar />
      <div className="container">
        <ImageUpload ad={ad} setAd={setAd} />
        {loded ? (
          <input
            className="input form-control mb-3"
            placeholder="enter address"
            onChange={(e) => {
              setAd({ ...ad, address: e.target.value });
            }}
          ></input>
        ) : (
          ""
        )}

        {loded ? (
          <CurrencyInput
            placeholder="enter a price"
            defaultValue={ad.price}
            className="form-control mb-3"
            onValueChange={(value) => setAd({ ...ad, price: value })}
          ></CurrencyInput>
        ) : (
          ""
        )}

        {ad.type === "House" ? (
          <>
            {" "}
            <input
              type="number"
              min="0"
              className="form-control mb-3"
              placeholder="enter how many bedrooms"
              value={ad.bedrooms}
              onChange={(e) => setAd({ ...ad, bedrooms: e.target.value })}
            ></input>
            <input
              type="number"
              min="0"
              className="form-control mb-3"
              placeholder="enter how many bathrooms"
              value={ad.bathroom}
              onChange={(e) => setAd({ ...ad, bathroom: e.target.value })}
            ></input>
            <input
              type="number"
              min="0"
              className="form-control mb-3"
              placeholder="enter how many carparks"
              value={ad.carpark}
              onChange={(e) => setAd({ ...ad, carpark: e.target.value })}
            ></input>
          </>
        ) : (
          ""
        )}
        <input
          type="text"
          className="form-control mb-3"
          placeholder="enter the land size"
          value={ad.landsize}
          onChange={(e) => setAd({ ...ad, landsize: e.target.value })}
        ></input>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="enter title"
          value={ad.title}
          onChange={(e) => setAd({ ...ad, title: e.target.value })}
        ></input>

        <textarea
          type="text"
          className="form-control mb-3"
          placeholder="enter discription"
          value={ad.discription}
          onChange={(e) => setAd({ ...ad, discription: e.target.value })}
        ></textarea>

        <div className="d-flex justify-content-between">
        <button
          onClick={handleClick}
          className={`btn btn-primary mb-5 ${ad.loding ? "disabled" : ""} `}
        >
          {ad.loding ? "saving..." : "submit"}
        </button>

        <button
          onClick={handleDelete}
          className={`btn btn-danger mb-5 ${ad.loding ? "disabled" : ""} `}
        >
          {ad.loding ? "Deleting..." : "Delete"}
        </button>

          </div>        {/* <pre>{JSON.stringify(ad, null, 4)}</pre> */}
      </div>
    </div>
  );
}
