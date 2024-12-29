import React, { useState, useEffect } from "react";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import TurnedInNotIcon from "@mui/icons-material/TurnedInNot";
import DeleteIcon from "@mui/icons-material/Delete";
import ThumbUpOffAltIcon from "@mui/icons-material/ThumbUpOffAlt";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const MainContent = () => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("followers");
  const navigate = useNavigate();
  const userData = JSON.parse(localStorage.getItem("user"));
  const [darkMode, setDarkMode] = useState(
    () => JSON.parse(localStorage.getItem("theme")) || false
  );
  const toggleTheme = () => {
    setDarkMode(!darkMode);
  };
  useEffect(() => {
    localStorage.setItem("theme", darkMode);
  }, [darkMode]);
  
  useEffect(() => {
    if (!userData) navigate("/");
  }, [userData, navigate]);

  if (!userData) return null;

  const user = userData?.data?.loggedInUser || userData?.data;
  if (!user) return <div>No user data available.</div>;

  const userId = user._id;
  const [posts, setPosts] = useState(user.posts);
  const [followed, setFollowed] = useState(false);
  const [followings, setFollowings] = useState(0);
  const [followers, setFollowers] = useState(0);
  const [followingData, setFollowingData] = useState([]);
  const [followerData, setFollowerData] = useState([]);

  const deletePostRequest = async (id) => {
    try {
      const response = await fetch("/api/v1/user/post/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
        credentials: "include",
      });
      if (response.ok) {
        toast.success("Post deleted successfully");
        setPosts((prev) => prev.filter((post) => post._id !== id));
      } else {
        toast.error("Unexpected error in deleting post");
      }
    } catch (error) {
      console.error("Error in deleting post:", error);
    }
  };

  const getFollowDetails = async (profileId) => {
    try {
      const response = await fetch("/api/v1/user/followStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profileId }),
      });
      if (response.ok) {
        const data = await response.json();
        setFollowings(data.data.followingCount);
        setFollowers(data.data.followerCount);
        setFollowed(data.data.followStatus);
        setFollowingData(data.data.followings);
        setFollowerData(data.data.followers);
      } else {
        toast.error("Error in fetching follow details");
      }
    } catch (error) {
      console.error("Error fetching follow details:", error);
      toast.error("Error fetching follow details in catch block");
    }
  };

  useEffect(() => {
    if (userId) getFollowDetails(userId);
  }, [userId, followed]);

  const renderPopupContent = () => {
    const data = activeTab === "followers" ? followerData : followingData;
    return (
      <div className="space-y-4">
        {data.map((user) => (
          <div
            key={user.username}
            onClick={() => navigate(`/${user.username}`)}
            className="flex items-center space-x-4 p-2 hover:bg-gray-100 rounded-lg cursor-pointer"
          >
            <img
              src={user.avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-sm text-gray-500">{user.username}</p>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div
      className={`ml-[8%] mr-[23%] flex-1 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      }`}
      id="main-content"
    >
      {/* Theme Toggle */}
      <div className="p-4 flex items-center justify-between">
        <h1 className="font-bold text-xl">{user.name}</h1>
        <button
          onClick={toggleTheme}
          className={`px-4 py-2 rounded ${
            darkMode ? "bg-gray-800 text-white" : "bg-gray-200 text-gray-800"
          }`}
        >
          <DarkModeIcon />
        </button>
      </div>

      {/* Profile Section */}
      <div>
      <div
            className="h-[12vmax] w-full bg-gray-500 bg-cover bg-center"
            style={{ backgroundImage: `url(${user.coverImage})` }}
          ></div>
        <div
          className={`p-6 shadow rounded-lg ${
            darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
          }`}
        >
          <div className="relative -mt-16">
            <img
              src={user.avatar}
              alt="Avatar"
              className="w-32 h-32 rounded-full border-4 border-white"
            />
          </div>
          <div className="mt-4 flex justify-between">
            <div>
              <h2 className="text-3xl font-bold">{user.name}</h2>
              <p>@{user.username}</p>
            </div>
          </div>
            <div>
              <p>{user.bio}</p>
            </div>
          <div className="mt-2 flex space-x-6">
            <p
              onClick={() => {
                setActiveTab("followers");
                setPopupVisible(true);
              }}
              className="cursor-pointer hover:underline"
            >
              <strong>{followers}</strong> Followers
            </p>
            <p
              onClick={() => {
                setActiveTab("following");
                setPopupVisible(true);
              }}
              className="cursor-pointer hover:underline"
            >
              <strong>{followings}</strong> Following
            </p>
          </div>
        </div>
      </div>

      {/* Follow Popup */}
      {popupVisible && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white w-96 p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab("followers")}
                  className={`text-lg font-bold ${
                    activeTab === "followers"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  Followers
                </button>
                <button
                  onClick={() => setActiveTab("following")}
                  className={`text-lg font-bold ${
                    activeTab === "following"
                      ? "border-b-2 border-blue-500 text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  Following
                </button>
              </div>
              <button
                onClick={() => setPopupVisible(false)}
                className="text-gray-600 hover:text-gray-800"
              >
                Close
              </button>
            </div>
            {renderPopupContent()}
          </div>
        </div>
      )}

      {/* Posts Section */}
      <div
        className={`mt-10 p-6 shadow rounded-lg ${
          darkMode ? "bg-gray-800 text-white" : "bg-white text-gray-800"
        }`}
      >
        <h3 className="text-2xl font-semibold mb-6 border-b pb-2">Posts</h3>
        {posts.slice()
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .map((post) => (
          <div key={post._id} className="mb-6 pb-6 border-b">
            <div className="flex items-center space-x-4 mb-2">
              <img
                src={user.avatar}
                alt="Avatar"
                className="w-12 h-12 rounded-full"
              />
              <div>
                <h4 className="text-lg font-bold">{user.name}</h4>
                <p>@{user.username}</p>
              </div>
             
            </div>
            {post.content && (
                  <p className="mb-3">
                    {" "}
                    {post.content?.split(" ").map((word, index) =>
                      word.startsWith("#") ? (
                        <span key={index} style={{ color: "skyblue" }}>
                          {word}{" "}
                        </span>
                      ) : (
                        word + " "
                      )
                    )}
                  </p>
                )}
            {post.image && (
              <img
                src={post.image}
                alt="Post"
                className="w-full rounded-lg mb-3"
              />
            )}
            <div className="flex justify-between space-x-4">
              <div className="flex justify-between space-x-4">
              <button>
                <ThumbUpOffAltIcon />
              </button>
              <button onClick={() => deletePostRequest(post._id)}>
                <DeleteIcon />
              </button>
              <button>
                <TurnedInNotIcon />
              </button>
              </div>
          
              <p className="text-sm text-gray-500">
                {new Date(post.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MainContent;