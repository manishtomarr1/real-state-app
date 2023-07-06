import Resizer from "react-image-file-resizer";
import { Avatar } from "antd";
import axios from "axios";
export default function ImageUpload({ ad, setAd }) {
  const handleUpload = async (e) => {
    try {
      let files = e.target.files;
      files = [...files];
      if (files?.length) {
        console.log(files);
        setAd({ ...ad, uploading: true });

        files.map((file) => {
          //! this is how we send the image to the server
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
                  console.log("URI>>>>>", uri);
                  const { data } = await axios.post("/upload-image", {
                    image: uri,
                  });
                  setAd((prev) => ({
                    ...prev,
                    photos: [data, ...prev.photos],
                    uploading: false,
                  }));
                } catch (err) {
                  console.log(err);
                  setAd({ ...ad, uploading: false });
                }
              },
              "base64"
            );
          });
        });
      }
    } catch (err) {
      console.log(err);
      setAd({ ...ad, uploading: false });
    }
  };

  const handleDelete = async (file) => {
    const answer = window.confirm("Delete image?");
    if (!answer) return;
    try {
      const { data } = await axios.post("/delete-image", file);
      if (data?.ok) {
        setAd((prev) => ({
          ...prev,
          photos: prev.photos.filter((p) => p.key !== file.key),
          uploading: false,
        }));
      }
    } catch (err) {
      console.log(err);
      setAd({ ...ad, uploading: false });
    }
  };
  return (
    <>
      <label className="btn">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleUpload}
        ></input>
      </label>
      {ad.photos?.map((file, index) => (
        <Avatar
          key={index}
          src={file?.Location}
          size="46"
          className="mx-1"
          onClick={() => handleDelete(file)}
        />
      ))}
    </>
  );
}
