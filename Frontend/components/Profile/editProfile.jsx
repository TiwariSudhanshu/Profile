import React, { useEffect, useState } from "react";
import "./profile.css";
import "./editProfile.css";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link, NavLink } from "react-router-dom";

function EditProfile() {
  const [loader, setLoader] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state;
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState("");
  const [coverImagePreview, setCoverImagePreview] = useState("");
  const [pageToggle, setPageToggle] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    bio: "",
    mobileNo: "",
    email: "",
    avatar: null,
    coverImage: null,
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (e) => {
    const { id, files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      if (id === "avatar") {
        setAvatar(file);
        const imageUrl = URL.createObjectURL(file);
        setAvatarPreview(imageUrl);
      } else if (id === "coverImage") {
        // Update formData to include the file
        setFormData((prevData) => ({
          ...prevData,
          coverImage: file,
        }));
        // Create a preview URL for the cover image
        const coverUrl = URL.createObjectURL(file);
        setCoverImagePreview(coverUrl);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoader(true);
    const dataToSend = new FormData();
    for (const key in formData) {
      dataToSend.append(key, formData[key]);
    }
    if (avatar) {
      dataToSend.append("avatar", avatar);
    }

    try {
      const response = await fetch("/api/v1/user/edit/change", {
        method: "post",
        body: dataToSend,
        credentials: "include",
      });

      if (response.ok) {
        toast.success("User Info edited");
        navigate("/profile");
      } else {
        toast.error("User info not edited");
      }
    } catch (error) {
      toast.error("Error in editing");
      console.log("Error in change : ", error);
    } finally {
      setLoader(false);
    }
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch("/api/v1/user/edit", {
          method: "get",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        });
        const data = await response.json();
        if (response.ok) {
          setUser(data.data);
          setFormData({
            name: data.data.name,
            username: data.data.username,
            bio: data.data.bio,
            mobileNo: data.data.mobileNo,
            email: data.data.email,
            avatar: null,
            coverImage: null,
          });
        }
      } catch (error) {
        toast.error("Some Error");
        console.log("Error in api", error);
      }
    };

    fetchUser();
  }, []);

  if (!user) {
    return (
      <div className="loading-div">
        <div className="loader"></div>
      </div>
    );
  }

  return (
    <div className="profilePage" id="profilePage">
      <div className="sidebar">
        <p id="logo">Profiler</p>
        <div className="tabs">
          <button>
            <i className="fa-solid fa-house"></i>
            <span> Home</span>
          </button>
          <button>
            <i className="fa-solid fa-magnifying-glass"></i>
            <span>Search</span>
          </button>
          <button
            onClick={() => {
              navigate("/profile");
            }}
          >
            <i className="fa-solid fa-user"></i>
            <span>Profile</span>
          </button>
          <button>
            <i className="fa-solid fa-bars"></i>
            <span>More</span>
          </button>
        </div>
      </div>
      <div className="menubar">
        <NavLink id="menubar-link" onClick={()=>{setPageToggle(true)}} >Edit profile Info</NavLink>
        <NavLink id="menubar-link" onClick={()=>{setPageToggle(false)}}>Change password</NavLink>
      </div>
      <div className="center">
  {pageToggle ? (
    <div className="edit-center">
      <h1>Edit Profile</h1>
      <form onSubmit={handleSubmit}>
        <div className="change">
          <label htmlFor="avatar" id="avatar-label">
            <i className="fa-solid fa-pen"></i>
          </label>
          {avatarPreview ? (
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className="avatar-preview"
            />
          ) : (
            <img
              src={user.avatar}
              alt="Default Avatar"
              className="avatar-preview"
            />
          )}
          <input
            type="file"
            id="avatar"
            onChange={handleFileChange}
            accept="image/*"
            style={{ display: "none" }}
          />
        </div>
        <div className="change">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            name="name"
            id="name"
            placeholder="Name"
            value={formData.name}
            onChange={handleChange}
          />
        </div>
        <div className="change">
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
          />
        </div>
        <div className="change">
          <label htmlFor="bio">Bio</label>
          <input
            type="text"
            name="bio"
            id="bio"
            placeholder="Bio"
            value={formData.bio}
            onChange={handleChange}
          />
        </div>
        <div className="change">
          <label htmlFor="coverImage">Cover Image:</label>
          <input
            type="file"
            id="coverImage"
            name="coverImage"
            onChange={handleFileChange}
          />
          {coverImagePreview ? (
            <div
              className="coverImage"
              style={{
                backgroundImage: `url(${coverImagePreview})`,
                width: "100%",
                height: "100px",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
          ) : user?.coverImage ? (
            <div
              className="coverImage"
              style={{
                backgroundImage: `url(${user.coverImage})`,
                width: "100%",
                height: "100px",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            ></div>
          ) : null}
        </div>
        <div className="change">
          <label htmlFor="mobileNo">Mobile No</label>
          <input
            type="text"
            name="mobileNo"
            id="mobileNo"
            placeholder="Mobile No"
            value={formData.mobileNo}
            onChange={handleChange}
          />
        </div>
        <div className="change">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        {loader ? (
          <div className="loader"></div>
        ) : (
          <button className="changeButton">Change</button>
        )}
      </form>
    </div>
  ) : (
    <div className="pass-center edit-center">
      <h1>Change Password</h1>
      <form >
        <div className="change">
          <label htmlFor="current-password">Current Password</label>
          <input
            type="password"
            id="current-password"
            placeholder="Current Password"
            className="password-input"
          />
        </div>
        <div className="change">
          <label htmlFor="new-password">New Password</label>
          <input
            type="password"
            id="new-password"
            placeholder="New Password"
            className="password-input"
           autoComplete="new-password"
          />
        </div>
        <div className="change">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            type="password"
            id="confirm-password"
            placeholder="Confirm Password"
            className="password-input"
            autoComplete="new-password"
          />
        </div>
        {loader ? (
          <div className="loader"></div>
        ) : (
          <button type="submit" className="changeButton">Change</button>
        )}
      </form>
    </div>
  )}
</div>

    </div>
  );
}

export default EditProfile;
