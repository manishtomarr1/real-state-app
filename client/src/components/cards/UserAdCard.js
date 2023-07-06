import { IoBedOutline } from "react-icons/io5";
import { TbBath } from "react-icons/tb";
import { BiArea } from "react-icons/bi";
import { Badge } from "antd";
import { BiLocationPlus } from "react-icons/bi";
import { Link } from "react-router-dom";
import AdFeatures from "./AdFeatures";

export default function UserAdCard({ ad }) {
  return (
    <div className="col-lg-4 p-4 gx-4 gy-4" key={ad._id}>
      <Badge.Ribbon
        text={`for ${ad?.action}`}
        color={ad?.action === "sell" ? "pink" : "orange"}
      >
        <div className="card hoverable shadow">
          <Link to={`/user/ad/${ad.slug}`}>
            <img
              src={ad?.photos?.[0]?.Location}
              alt={`${ad?.type}-${ad?.address}-${ad?.action}-${ad?.price}`}
              style={{
                height: "250px",
                objectFit: "cover",
                width: "content-fit",
              }}
            ></img>
          </Link>
          {/* //! check typos on modal */}
          <div className="card-body">
            <div className="d-flex justify-content-between">
              <h3>₹ {ad?.price}</h3>
              <p className="card-text">
                <span>
                  <BiLocationPlus /> {ad?.address}
                </span>
              </p>
            </div>
            <AdFeatures ad={ad} />
          </div>
        </div>
      </Badge.Ribbon>
    </div>
  );
}
