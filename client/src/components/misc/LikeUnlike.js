import { useAuth } from "../../context/auth";
import { FcLike, FcLikePlaceholder } from "react-icons/fc";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Toast, toast } from "react-hot-toast";

export default function LikeUnlike({ ad }) {
  //context
  const navigate = useNavigate();
  const [auth, setAuth] = useAuth();

  const handleLike = async () => {
    try {
      if (auth.user === null) {
        navigate("/login", {
          //* not login go to login
          state: `/ad/${ad.slug}`, //* after login go to the same page where it was be.
        });
        return;
      }
      const { data } = await axios.post("/wishlist", { adId: ad._id }); //data ayega server se.
      console.log("handel like data", data);
      setAuth({ ...auth, user: data });
      const fromLocalStorage = JSON.parse(localStorage.getItem("auth")); //backend se jo data ayega wo updated hoga
      fromLocalStorage.user = data;
      localStorage.setItem("auth", JSON.stringify(fromLocalStorage));
      toast.success("added to wishlist");
    } catch (err) {
      console.log(err);
    }
  };

  const handleUnlike = async () => {
    console.log(">>>>>>>>>>>>>>>unlike clicked");
    try {
      if (auth.user === null) {
        navigate("/login", {
          //* not login go to login
          state: `/ad/${ad.slug}`, //* after login go to the same page where it was be.
        });
        return;
      }
      const { data } = await axios.delete(`/wishlist/${ad._id}`); //data ayega server se. //! agar kbhi b plain text k sath dynamic dena hai kuch use this syntax
      console.log("handel unlike data", data);

      setAuth({ ...auth, user: data });
      const fromLocalStorage = JSON.parse(localStorage.getItem("auth")); //backend se jo data ayega wo updated hoga
      fromLocalStorage.user = data;
      localStorage.setItem("auth", JSON.stringify(fromLocalStorage));
      toast.success("removed from wishlist");
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <>
      {auth.user?.wishlist.includes(ad?._id) ? (
        <span>
          <button onClick={handleUnlike} className="btn h2 mt-3">
            ❤️
          </button>
        </span>
      ) : (
        <span>
          <button onClick={handleLike} className="btn h2 mt-3">
            🤍
          </button>
        </span>
      )}
    </>
  );
}
//
