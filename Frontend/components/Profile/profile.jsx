import React, { useEffect, useState, useRef } from "react";
import "./profile.css";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Profile() {
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));

  const [formData, setFormData] = useState({
    postContent: "",
    postImage: "",
  });

  const [users, setUsers] = useState([]);
  const [loader, setLoader] = useState(false);
  const user = userData?.data?.loggedInUser;
  if (!user) {
    return (
      <div style={styles.container}>
        <h2>User Information</h2>
        <p>No user data available.</p>
      </div>
    );
  }

  const userId = user._id;

  const [posts, setPosts] = useState(user.posts);

  // Format Date

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { month: "short", day: "numeric" };
    return date.toLocaleString("en-US", options);
  };

  // Logout user
  const logoutUser = async () => {
    try {
      const response = await fetch("/api/v1/user/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (response.ok) {
        toast("Logged out");
        navigate("/");
      }
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  // Add new Post
  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData({ ...formData, [id]: value });
  };

  const handleFileChange = (e) => {
    const { files } = e.target;
    if (files.length > 0) {
      const file = files[0];
      setFormData({ ...formData, postImage: file });
    }
  };

  const addNewPost = async (e) => {
    e.preventDefault();
    setLoader(true);
    const formDataToSend = new FormData();
    formDataToSend.append("postContent", formData.postContent);
    formDataToSend.append("postImage", formData.postImage);
    try {
      const response = await fetch("/api/v1/user/post", {
        method: "POST",
        body: formDataToSend,
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Post Added");
        setPosts((prevPosts) => [data.data, ...prevPosts]);
        setFormData({
          postContent: "",
          postImage: "",
        });
        setIsDialogOpen(!isDialogOpen);
      } else {
        toast.error(data.message || "Failed to add post");
      }
    } catch (error) {
      toast.error("Error occurred during adding post");
      console.log("Error", error);
    } finally {
      setLoader(false);
    }
  };
  // Suggestions

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/v1/user/suggestions", {
          method: "GET",
        });
        const data = await response.json();
        if (response.ok) {
          const allUsers = data.data.users;
          const profiles = allUsers.filter((i) => i._id != userId);
          const shuffleProfiles = [...profiles].sort(() => 0.5 - Math.random());
          const suggestedUsers = shuffleProfiles.slice(0, 6);
          setUsers(suggestedUsers);
        } else {
          toast.error("Failed to fetch users");
        }
      } catch (error) {
        toast.error("Error in fetching");
      }
    };
    fetchUsers();
  }, []);

  // Buttons sidebar
  const [dots, setDots] = useState(false);

  function toggleDots() {
    setDots(!dots);
  }

  const [more, setMore] = useState(false);

  function toggleMore() {
    setMore(!more);
  }

  // Switch

  const [isLightMode, setIsLightMode] = useState(false);

  const toggleMode = () => {
    const rootElement = document.documentElement;
    rootElement.classList.toggle("light-mode");
    setIsLightMode(!isLightMode);
  };

  // Model Post
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

  const openDialog = () => {
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
  };
  const openSearchDialog = () => {
    setIsSearchDialogOpen(true);
  };

  const closeSearchDialog = () => {
    setIsSearchDialogOpen(false);
  };

  // Search User Profile

  const [searchUsername, setSearchUsername] = useState("");

  const [searchProfile, setSearchProfile] = useState(null);

  const searchProfileRequest = async (e) => {
    e.preventDefault();
    setLoader(true);
    try {
      const response = await fetch("/api/v1/profiles/search", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: searchUsername,
        }),
      });

      if (response.ok) {
        toast.success("User found");
        const data = await response.json();
        setSearchProfile(data.data);
      } else {
        setSearchProfile(null);
      }
    } catch (error) {
      toast.error("Something went wrong while searching");
      console.log("Error : ", error);
    } finally {
      setLoader(false);
    }
  };

  // Delete post request

  const [idToDel, setIdToDel] = useState("");

  const deletePostRequest = async (e) => {
    try {
      const response = await fetch("/api/v1/user/post/delete", {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: idToDel,
        }),
        credentials: "include",
      });

      if (response.ok) {
        toast.success("Post deleted successfully");
        setIdToDel("");
        setPosts((prevPosts) =>
          prevPosts.filter((post) => post._id !== idToDel)
        );
      } else {
        toast.error("Unexpected error in deleting post");
      }
    } catch (error) {
      console.log("Error in deleting post:", error);
    }
  };

  const [postPopupId, setPostPopupId] = useState(null);
  const [postLikeIds, setPostLikeIds] = useState([]);

  // Function to handle likes
  const toggleLikePost = (postId) => {
    if (postLikeIds.includes(postId)) {
      setPostLikeIds(postLikeIds.filter((id) => id !== postId));
    } else {
      setPostLikeIds([...postLikeIds, postId]);
    }
  };

  return (
    <>
      <div className="profilePage" id="profilePage">
        <div className="sidebar">
          <p id="logo">Profiler</p>
          <div className="tabs">
            <button>
              <i class="fa-solid fa-house"></i>
              <span> Home</span>
            </button>
            <button onClick={openSearchDialog}>
              <i class="fa-solid fa-magnifying-glass"></i>
              <span>Search</span>
            </button>
            <button>
              <i
                class="fa-solid fa-user"
                onClick={() => {
                  navigate("/profile");
                }}
              ></i>
              <span>Profile</span>
            </button>
            <button onClick={toggleMore}>
              <i class="fa-solid fa-bars"></i>
              <span>More</span>
            </button>
          </div>
          <div
            className="moreOptionsBox"
            style={{ display: more ? "flex" : "none" }}
          >
            <button
              onClick={() => {
                navigate("/edit", { state: userId });
              }}
            >
              <i class="fa-solid fa-pen-to-square"></i>Edit Profile
            </button>
            <button>
              <i class="fa-solid fa-circle-info"></i>Your Information
            </button>
            <button id="toggleMode" onClick={toggleMode}>
              <i class="fa-solid fa-toggle-on"></i>
              {isLightMode ? "Shift to Dark Mode" : "Shift to Light Mode"}
            </button>
          </div>
          <div className="sidebar-bottom">
            <button id="post" onClick={openDialog}>
              Post
            </button>

            <button id="moreOptionsDots" onClick={toggleDots}>
              <i class="fa-solid fa-ellipsis-vertical"></i>
            </button>
          </div>
          <div className="DotBox" style={{ display: dots ? "block" : "none" }}>
            <button id="logoutBtn" onClick={logoutUser}>
              Logout
            </button>
          </div>
        </div>
        <form>
          <div
            className="postModel"
            style={{ display: isDialogOpen ? "flex" : "none" }}
          >
            {loader ? (
              <div className="loader"></div>
            ) : (
              <>
                <button id="closeDialog" onClick={closeDialog}>
                  <i class="fa-solid fa-xmark"></i>
                </button>
                <h2>Post Now</h2>
                <textarea
                  name="postContent"
                  id="postContent"
                  onChange={handleChange}
                  value={formData.postContent}
                  placeholder="Enter your content.."
                />
                <input
                  type="file"
                  onChange={handleFileChange}
                  id="postImage"
                  name="postImage"
                />
                <button id="post" type="button" onClick={addNewPost}>
                  Post
                </button>
              </>
            )}
            {/* Change onSubmit to onClick to prevent premature submission */}
          </div>
        </form>
        <form>
          <div
            className="searchModel"
            style={{ display: isSearchDialogOpen ? "flex" : "none" }}
          >
            <button id="closeDialog" onClick={closeSearchDialog}>
              <i class="fa-solid fa-xmark"></i>
            </button>
            <h2>Search</h2>
            <div className="searchUser">
              <input
                type="text"
                id="searchUsername"
                value={searchUsername}
                onChange={(e) => setSearchUsername(e.target.value)}
                placeholder="Enter username"
              />
              <button id="searchBtn" onClick={searchProfileRequest}>
                <i class="fa-solid fa-magnifying-glass"></i>
              </button>
            </div>
            {loader ? (
              <div className="loader"></div>
            ) : (
              searchProfile && (
                <div className="searchedUser">
                  {searchProfile.avatar ? (
                    <img
                      src={searchProfile.avatar}
                      id="suggestImage"
                      alt="Search User Avatar"
                    />
                  ) : (
                    <p></p>
                  )}
                  <div className="suggestDetail">
                    <h3>{searchProfile.name || ""}</h3>
                    <p>{searchProfile.username || ""}</p>
                  </div>
                </div>
              )
            )}
          </div>
        </form>

        <div className="center">
          <div className="head">
            <span>{user.name}</span>
          </div>
          <div
            className="cover-image"
            style={{ backgroundImage: `url(${user.coverImage})` }}
          ></div>
          <img src={user.avatar} id="avatarImage" alt="avatar" />
          <div className="profile-details">
            <h3 id="name">{user.name}</h3>
            <p id="username">@{user.username}</p>
            <p id="bio">{user.bio}</p>
            <div className="connections">
              <span id="following-count">0 followings</span> &nbsp;&nbsp;&nbsp;
              <span id="follower-count">0 followers</span>
            </div>
            <br />
            <br />
          </div>
          <hr />
          <h2>Posts</h2>
          {posts
            .slice()
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map((userPost) => {
              return (
                <div className="post">
                  <div className="post-details">
                    <div className="post-details-left">
                      <img id="post-avatar" src={user.avatar} alt="" />
                      <div>
                        <h3>{user.name}</h3>
                        <p>@{user.username}</p>
                      </div>
                      <p id="dateOfPost">
                        &nbsp;&nbsp;&nbsp;.{formatDate(userPost.date)}{" "}
                      </p>
                    </div>
                    <div className="post-details-right">
                      <i
                        class="fa-regular fa-heart"
                        style={{
                          color: postLikeIds.includes(userPost._id)
                            ? "red"
                            : isLightMode
                            ? "black"
                            : "white",
                        }}
                        onClick={() => toggleLikePost(userPost._id)}
                      ></i>

                      <i
                        class="fa-solid fa-ellipsis-vertical"
                        id="post-popup-dots"
                        onClick={() => {
                          setPostPopupId(
                            userPost._id === postPopupId ? null : userPost._id
                          );
                        }}
                      ></i>
                      <div
                        className="post-popup"
                        style={{
                          display:
                            postPopupId === userPost._id ? "block" : "none",
                        }}
                      >
                        <button
                          id="delete-btn"
                          onClick={() => {
                            setIdToDel(userPost._id);
                            deletePostRequest();
                          }}
                        >
                          <i class="fa-solid fa-trash"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="post-content">
                    <p>{userPost.content}</p>
                  </div>
                  <img id="postImage" src={userPost.image} alt="" />
                </div>
              );
            })}
        </div>
        <div className="rightbar">
          <div className="searchbox">
            <input type="text" placeholder="Search" id="search" />
          </div>
          <h2>Suggestions</h2>
          <div className="suggestions">
            {users.map((suggestion) => (
              <div
                className="suggest"
                key={suggestion._id}
                onClick={() => {
                  navigate("/otherProfile", { state: suggestion._id });
                }}
              >
                <img src={suggestion.avatar} alt="img" id="suggestImage" />
                <div className="suggestDetail">
                  <p id="suggestName">{suggestion.name}</p>
                  <p id="suggestUsername">@{suggestion.username}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
