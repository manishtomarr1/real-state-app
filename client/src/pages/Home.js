import { useAuth } from "../context/auth";
import { useEffect, useState } from "react";
import axios from "axios";
import AdCard from "../components/cards/AdCard";
import SearchForm from "../components/forms/SearchForm";
export default function Home() {
  const fetchAds = async () => {
    try {
      const { data } = await axios.get("/ads"); //request jayege /ads route pe wha se data milega or set jaiga
      setAdsForRent(data.adsForRent);
      setAdsForSell(data.adsForSell);
    } catch (err) {
      console.log(err);
    }
  };
  //context
  const [auth, setAuth] = useAuth();

  //state
  const [adsForSell, setAdsForSell] = useState();
  const [adsForRent, setAdsForRent] = useState();

  //effect
  useEffect(() => {
    fetchAds();
  }, []);

  return (
    <div>
      <SearchForm />
      <h1 className="display-1 bg-primary text-light p-5">For Sell</h1>

      <div className="container">
        <div className="row">
          {adsForSell?.map((ad) => (
            <AdCard ad={ad} key={ad._id} />
          ))}
        </div>
      </div>

      <h1 className="display-1 bg-primary text-light p-5">For Rent</h1>

<div className="container">
  <div className="row">
    {adsForRent?.map((ad) => (
      <AdCard ad={ad} key={ad._id} />
    ))}
  </div>
</div>

      {/* <pre>{JSON.stringify({ adsForSell, adsForRent }, null, 4)}</pre> */}
    </div>
  );
}
