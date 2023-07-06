import { useAuth } from "../../context/auth";
import { useEffect, useState } from "react";
import axios from "axios";
import AdCard from "../../components/cards/AdCard";
import SearchForm from "../../components/forms/SearchForm";

export default function Rent() {
  const fetchAds = async () => {
    try {
      const { data } = await axios.get("/ads-for-rent"); //request jayege /ads route pe wha se data milega or set jaiga
     setAds(data)
    } catch (err) {
      console.log(err);
    }
  };
  //context
  const [auth, setAuth] = useAuth();

  //state
  const [ads, setAds] = useState();

  //effect
  useEffect(() => {
    fetchAds();
  }, []);

  return (
    <div>
        <SearchForm/>
      <h1 className="display-1 bg-primary text-light p-5">For Rent</h1>

      <div className="container">
        <div className="row">
          {ads?.map((ad) => (
            <AdCard ad={ad} key={ad._id} />
          ))}
        </div>
      </div>

      {/* <pre>{JSON.stringify({ adsForSell, adsForRent }, null, 4)}</pre> */}
    </div>
  );
}
