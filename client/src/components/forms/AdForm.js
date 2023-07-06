import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Toast, toast } from "react-hot-toast";
import CurrencyInput from "react-currency-input-field";
import ImageUpload from "./ImageUpload";
import { useAuth } from "../../context/auth";
import LocaleProvider from "antd/es/locale";
export default function AdForm({ action, type }) {
  //context
  const [auth, setAuth] = useAuth();
  const handleClick = async () => {
    try {
      setAd({ ...ad, loding: true });
      const { data } = await axios.post("/ad", ad);
      console.log("ad create successfully", data);
      if (data?.error) {
        toast.error(data.error);
        setAd({ ...ad, loding: false });
      } else {
        //data{user,ad}

        //update user in context
        setAuth({ ...auth, user: data.user });

        //update user in local storege
        const fromLS = JSON.parse(localStorage.getItem("auth"));
        auth.user = data.user;
        localStorage.setItem("auth", JSON.stringify(fromLS));
        toast.success("ad post successfully");
        setAd({ ...ad, loding: false });

        // navigate("/dashboard");
        //navigate

        //reload page on redirect
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.log(err);
      setAd({ ...ad, loding: false });
    }
  };
  //state
  const [ad, setAd] = useState({
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

  //hooks
  const navigate = useNavigate();
  return (
    <>
      <ImageUpload ad={ad} setAd={setAd} />
      <input
        className="input form-control mb-3"
        placeholder="enter address"
        onChange={(e) => {
          setAd({ ...ad, address: e.target.value });
        }}
      ></input>

      <CurrencyInput
        placeholder="enter a price"
        defaultValue={ad.price}
        className="form-control mb-3"
        onValueChange={(value) => setAd({ ...ad, price: value })}
      ></CurrencyInput>

      {type === "House" ? (
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

      <button
        onClick={handleClick}
        className={`btn btn-primary mb-5 ${ad.loding ? "disabled" : ""} `}
      >
        {ad.loding ? "saving..." : "submit"}
      </button>
      <pre>{JSON.stringify(ad, null, 4)}</pre>
    </>
  );
}
