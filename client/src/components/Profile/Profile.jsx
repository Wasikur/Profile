import { useRef, useState } from "react";
import user from "../assets/user.png";
import "./profile.css";

function Profile() {
  const [image, setImage] = useState(null);
  const [isUploadContainerVisible, setUploadContainerVisibility] =
    useState(false);
  const hiddenFileInput = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const imgname = event.target.files[0].name;
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = Math.max(img.width, img.height);
        canvas.width = maxSize;
        canvas.height = maxSize;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          img,
          (maxSize - img.width) / 2,
          (maxSize - img.height) / 2
        );
        canvas.toBlob(
          (blob) => {
            const file = new File([blob], imgname, {
              type: "image/png",
              lastModified: Date.now(),
            });

            console.log(file);
            setImage(file);
          },
          "image/jpeg",
          0.8
        );
      };
    };
  };

  const handleUploadButtonClick = (file) => {
    var myHeaders = new Headers();
    const token = "adhgsdaksdhk938742937423";
    myHeaders.append("Authorization", `Bearer ${token}`);

    var formdata = new FormData();
    formdata.append("file", file);

    var requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: formdata,
      redirect: "follow",
    };

    fetch("https://trickuweb.com/upload/profile_pic", requestOptions)
      .then((response) => response.text())
      .then((result) => {
        console.log(JSON.parse(result));
        const profileurl = JSON.parse(result);
        setImage(profileurl.img_url);
      })
      .catch((error) => console.log("error", error));
  };

  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };

  const handleToggleUploadContainer = () => {
    setUploadContainerVisibility(!isUploadContainerVisible);
  };

  return (
    <>
      {image ? (
        <img
          src={URL.createObjectURL(image)}
          alt="profile image"
          className="img-display-after"
          onClick={handleToggleUploadContainer}
          id="toggle-btn"
        />
      ) : (
        <img
          src={user}
          alt="profile image"
          className="img-display-before"
          onClick={handleToggleUploadContainer}
          id="toggle-btn"
        />
      )}

      {isUploadContainerVisible && (
        <div className={"image-upload-container"}>
          <div className="box-decoration">
            {/* <label htmlFor="image-upload-input" className="image-upload-label">
          {image ? image.name : "Choose an image"}
        </label> */}
            <div onClick={handleClick} style={{ cursor: "pointer" }}>
              {image ? (
                <img
                  src={URL.createObjectURL(image)}
                  alt="upload image"
                  className="img-display-after"
                />
              ) : (
                <img
                  src={user}
                  alt="upload image"
                  className="img-display-before"
                />
              )}

              <input
                id="image-upload-input"
                type="file"
                onChange={handleImageChange}
                ref={hiddenFileInput}
                style={{ display: "none" }}
              />
            </div>

            {/* <button
              className="image-upload-button"
              onClick={handleUploadButtonClick}
            >
              Upload
            </button> */}

            <div className="info">
              <label htmlFor="name">
                <strong>Name</strong>
              </label>
              <input type="text" placeholder="Name" />
              <label htmlFor="email">
                <strong>Email</strong>
              </label>
              <input type="text" placeholder="Email" />
              <label htmlFor="phone">
                <strong>Phone Number</strong>
              </label>
              <input type="text" placeholder="Phone Number" />
              <label htmlFor="old_password">
                <strong>Old Password</strong>
              </label>
              <input type="text" placeholder="Old Password" />
              <label htmlFor="new_password">
                <strong>New Password</strong>
              </label>
              <input type="text" placeholder="New Password" />
            </div>
            <button className="update-button" onClick={handleUploadButtonClick}>
              Update Profile
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Profile;
