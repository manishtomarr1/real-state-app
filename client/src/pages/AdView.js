import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import AdFeatures from "../components/cards/AdFeatures";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import LikeUnlike from "../components/misc/LikeUnlike";
import mapImage from "../assets/map.jpg";
import AdCard from "../components/cards/AdCard";
import ContactSeller from "../components/forms/ContactSeller";

dayjs.extend(relativeTime);

// SVG fallback image component
const DefaultImage = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

export default function AdView() {
  const params = useParams();

  const generatePhotosArray = (photos) => {
    if (photos?.length > 0) {
      return photos.map((photo) => ({
        original: photo.Location,
        thumbnail: photo.Location,
      }));
    }

    // Return an array with a default/fallback image
    return [
      {
        original: <DefaultImage />,
        thumbnail: <DefaultImage />,
      },
    ];
  };

  const [ad, setAd] = useState();
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (params?.slug) fetchAd();
  }, [params?.slug]);

  const fetchAd = async () => {
    try {
      const { data } = await axios.get(`/ad/${params.slug}`);
      setAd(data?.ad);
      setRelated(data?.related);
    } catch (err) {
      console.log(err);
    }
  };

  const openGoogleMapsLocation = () => {
    const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
      ad?.address
    )}`;
    window.open(googleMapsUrl);
  };

  return (
    <>
      <div className="container-fluid">
        <div className="row mt-2">
          <div className="col-lg-4">
            <div className="d-flex justify-content-between">
              <button className="btn btn-primary disabled mt-2">
                {ad?.type} for {ad?.action}
              </button>
              <LikeUnlike ad={ad} />
            </div>

            <div className="mt-4 mb-4">
              {ad?.sold ? "❌ off market" : "✅ in market"}
            </div>
            <h1>{ad?.address}</h1>
            <AdFeatures ad={ad} />
            <h3 className="mt-3 h2">price: ₹ {ad?.price}</h3>
            <p className="text-muted">{dayjs(ad?.createdAt).fromNow()}</p>
          </div>
          <div className="col-lg-8">
            {ad && (
              <div>
                <Carousel>
                  {generatePhotosArray(ad.photos).map((photo, index) => (
                    <div key={index}>
                      {typeof photo.original === "string" ? (
                        <img
                          className="add-image"
                          src={photo.original}
                          alt={`Photo ${index}`}
                        />
                      ) : (
                        photo.original
                      )}
                    </div>
                  ))}
                </Carousel>
              </div>
            )}
          </div>
        </div>
      </div>
      {ad?.address ? (
        <div className="container">
          <div className="row">
            <div
              className="col-lg-8 offset-lg-2"
              onClick={openGoogleMapsLocation}
            >
              <img
                className="map-image pointer"
                src={mapImage}
                alt="Map"
                style={{ width: "100%" }}
              />

              <h1>
                {ad?.type} in {ad?.address} for {ad?.action} in ₹ {ad?.price}
              </h1>
              <AdFeatures ad={ad} />
              <hr />
              <h2 className="fw-bold">{ad?.title}</h2>
              <p className="lead">{ad?.discription}</p>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}

      <div className="container">
        <ContactSeller ad={ad} />
      </div>

      <div className="container-fluid">
        <h4 className="d-flex justify-content-center mb-2">
          Related Properties
        </h4>
        <hr className="" style={{ width: "33%", margin: "auto" }} />
        <div className="row">
          {related?.map((ad) => (
            <AdCard key={ad._id} ad={ad} />
          ))}
        </div>
      </div>
      {/* <pre>{JSON.stringify({ ad, related }, null, 4)}</pre> */}
    </>
  );
}
