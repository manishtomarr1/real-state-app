import { IoBedOutline } from "react-icons/io5";
import { TbBath } from "react-icons/tb";
import { BiArea } from "react-icons/bi";

export default function AdFeatures ({ad}) {
return (
    <p className="card-text d-flex justify-content-between">
    {ad?.bedrooms ? (
      // ?check krte hai k ad? hai agar ho tbhi yeh code chale
      <span>
        <IoBedOutline />
        {ad?.bedrooms}
      </span>
    ) : (
      ""
    )}
    {ad?.bathroom ? (
      // ?check krte hai k ad? hai agar ho tbhi yeh code chale
      <span>
        <TbBath />
        {ad?.bathroom}
      </span>
    ) : (
      ""
    )}

    {ad?.landsize ? (
      // ?check krte hai k ad? hai agar ho tbhi yeh code chale
      <span>
        <BiArea />
        {ad?.landsize}
      </span>
    ) : (
      ""
    )}
  </p>
)
}