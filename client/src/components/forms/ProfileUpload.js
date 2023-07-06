import Resizer from "react-image-file-resizer";
import { Avatar } from "antd";
import axios from "axios";
import { useAuth } from "../../context/auth";
export default function ProfileUpload({
  photo,
  setPhoto,
  uploading,
  setUploading,
}) {
  //context
  const [auth, setAuth] = useAuth();
  const handleUpload = async (e) => {
    try {
      let file = e.target.files[0];

      if (file) {
        setUploading(true);
        new Promise(() => {
          Resizer.imageFileResizer(
            file,
            1080,
            720,
            "JPEG",
            100,
            0,
            async (uri) => {
              try {
                const { data } = await axios.post("/upload-image", {
                  image: uri,
                });
               setPhoto(data)
               setUploading(false)
              } catch (err) {
                console.log(err);
                setUploading(false)

              }
            },
            "base64"
          );
        });
      }
    } catch (err) {
      console.log(err);
      setUploading(false)

    }
  };

  const handleDelete = async (file) => {
    const answer = window.confirm("Delete image?");
    if (!answer) return;
    setUploading(true)

    try {
      const { data } = await axios.post("/delete-image", photo);
      if (data?.ok) {
       setPhoto(null)
       setUploading(false)
      }
    } catch (err) {
      console.log(err);
      setUploading(false)

    }
  };
  return (
    <>
      <label className="btn btn-primary mt-4 mb-3">
        {uploading ? "processing..." : "upload photo"}
        <input
          type="file"
          accept="image/*"
          onChange={handleUpload}
          hidden
        ></input>
      </label>
     {photo?.Location ? (
         <Avatar
         src={photo?.Location}
         size="46"
         className="mx-1"
         onClick={() => handleDelete()}
       />
     ) : (
        ""
     )}
    </>
  );
}
