import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import Eclipse from "../../../assets/Ellipse.png";
import Profile from "../../../assets/Profile.png";
import {
  updateBasicInfo,
  updateImage,
} from "../../../services/oprations/authAPI";
import {
  fetchJiraCredentials,
  jiraConnect,
} from "../../../services/oprations/jiraAPI";
import { fetchGoogleCredentials } from "../../../services/oprations/googleAPI";

const ProfileSettings = () => {
  const { user } = useSelector((state) => state.profile);
  const { credentials } = useSelector((state) => state.jiradetail);
  const { credentials: googleCredentials } = useSelector(
    (state) => state.google
  );
  const dispatch = useDispatch();

  const [googleSheet, setGoogleSheet] = useState({
    sheetId: "",
    sheetRange: "",
  });

  const [profile, setProfile] = useState({
    name: "",
    email: "",
    avatar: null,
    previewAvatar: null,
  });

  const [jira, setJira] = useState({
    jiraEmail: "",
    jiraDomain: "",
    jiraApiKey: "",
  });

  // Populate name/email from user
  useEffect(() => {
    if (user) {
      setProfile((prev) => ({
        ...prev,
        name: user.name || "",
        email: user.email || "",
      }));
    }
  }, [user]);

  // Populate Jira details from credentials
  useEffect(() => {
    dispatch(fetchJiraCredentials());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchGoogleCredentials());
  }, [dispatch]);

  useEffect(() => {
    if (credentials) {
      setJira({
        jiraEmail: credentials.jiraEmail || "",
        jiraDomain: credentials.jiraDomain || "",
        jiraApiKey: credentials.jira_api_key || "Your API KEY is Secure",
      });
    }
    //console.log("credentials", credentials, jira);
  }, [credentials]);

  useEffect(() => {
    if (googleCredentials) {
      setGoogleSheet({
        sheetId: googleCredentials.spreadsheetId || "",
        sheetRange: googleCredentials.sheetRange || "",
      });
    }
    console.log("google credentila", googleCredentials, googleSheet);
  }, [googleCredentials]);

  // Cleanup avatar preview on unmount
  useEffect(() => {
    return () => {
      if (profile.previewAvatar) {
        URL.revokeObjectURL(profile.previewAvatar);
      }
    };
  }, [profile.previewAvatar]);

  const handleProfileChange = (e) => {
    const { id, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleJiraChange = (e) => {
    const { id, value } = e.target;
    setJira((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setProfile((prev) => ({
        ...prev,
        avatar: file,
        previewAvatar: previewUrl,
      }));
    }
  };

  const handleSave = () => {
    // if (profile.name.trim() || profile.email.trim()) {
    //   dispatch(
    //     updateBasicInfo(
    //       { name: profile.name.trim(), email: profile.email.trim() },
    //       (updatedUser) => {
    //         console.log("Basic info updated:", updatedUser);
    //       }
    //     )
    //   );
    // }

    if (profile.name.trim()) {
      dispatch(
        updateBasicInfo({ name: profile.name.trim() }, (updatedUser) => {
          console.log("Basic info updated:", updatedUser);
        })
      );
    }

    if (profile.email.trim()) {
      dispatch(
        updateBasicInfo({ email: profile.email.trim() }, (updatedUser) => {
          console.log("Basic info updated:", updatedUser);
        })
      );
    }

    if (profile.avatar) {
      dispatch(
        updateImage(profile.avatar, (updatedUser) => {
          console.log("Image updated:", updatedUser);
        })
      );
    }

    // if (jira.jiraEmail && jira.jiraDomain && jira.jiraApiKey) {
    //   dispatch(
    //     jiraConnect(
    //       {
    //         jira_email: jira.jiraEmail,
    //         jira_domain: jira.jiraDomain,
    //         jira_api_key: jira.jiraApiKey,
    //       },
    //       (updatedJIRA) => {
    //         console.log("Jira updated:", updatedJIRA);
    //       }
    //     )
    //   );
    // } else {
    //   console.log("Please fill all Jira fields before submitting.");
    // }
  };

  // Update Google Sheet input changes
  const handleGoogleChange = (e) => {
    const { id, value } = e.target;
    setGoogleSheet((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleGoogleConnect = () => {
    if (
      googleSheet.sheetId.trim() &&
      googleSheet.sheetRange.trim() &&
      user?._id
    ) {
      const stateObj = {
        sheetId: googleSheet.sheetId.trim(),
        sheetRange: googleSheet.sheetRange.trim(),
        userId: user?._id,
      };

      const encodedState = encodeURIComponent(JSON.stringify(stateObj));
      console.log("encoded", encodedState);

      const baseUrl = process.env.REACT_APP_GOOGLE_BACKEND_URL;
      window.location.href = `${baseUrl}/auth/google?state=${encodedState}`;
    } else {
      console.log("Please fill all Google Sheet fields before connecting.");
    }
  };

  const handleJiraConnect = () => {
    if (jira.jiraEmail && jira.jiraDomain && jira.jiraApiKey) {
      dispatch(
        jiraConnect(
          {
            jira_email: jira.jiraEmail,
            jira_domain: jira.jiraDomain,
            jira_api_key: jira.jiraApiKey,
          },
          (updatedJIRA) => {
            console.log("Jira updated:", updatedJIRA);
          }
        )
      );
    } else {
      console.log("Please fill all Jira fields before submitting.");
    }
  };

  const handleVerifyEmail = () => {};

  return (
    <div className="bg-white font-sans p-6 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Top container */}
        <div className="bg-[#f3f7f6] rounded-xl p-8 flex flex-col md:flex-row md:space-x-12 shadow-md">
          {/* Avatar section */}
          <div className="flex flex-col items-center space-y-3 md:w-1/3">
            <div className="relative w-32 h-32">
              {profile.previewAvatar ? (
                <img
                  src={profile.previewAvatar}
                  alt="Preview Avatar"
                  className="w-32 h-32 rounded-full object-cover border-2 border-blue-500"
                />
              ) : user?.image ? (
                <img
                  src={user.image}
                  alt="User Avatar"
                  className="w-32 h-32 rounded-full object-cover border-2 border-gray-300"
                />
              ) : (
                <>
                  <img
                    src={Eclipse}
                    alt="Eclipse Background"
                    className="w-32 h-32 rounded-full"
                  />
                  <img
                    src={Profile}
                    alt="Profile"
                    className="absolute top-1/2 left-1/2 w-16 h-16 transform -translate-x-1/2 -translate-y-1/2"
                  />
                </>
              )}
            </div>

            <input
              type="file"
              accept="image/*"
              id="avatarUpload"
              onChange={handleImageChange}
              className="hidden"
            />

            <label htmlFor="avatarUpload">
              <div className="cursor-pointer bg-[#001f3f] text-white font-semibold rounded-full px-8 py-2 shadow-md hover:shadow-lg transition-shadow text-center">
                Upload Avatar
              </div>
            </label>

            <p className="text-center text-sm text-[#001f3f] font-normal leading-tight">
              Allowed *.jpeg, *.jpg, *.png
              <br />
              Max size of 3MB
            </p>
          </div>

          {/* Profile form */}
          <form className="flex-1 space-y-6 mt-6 md:mt-0">
            <div>
              <label
                htmlFor="name"
                className="block text-[#6b6b6b] font-semibold mb-1"
              >
                Name
              </label>
              <input
                type="text"
                id="name"
                value={profile.name}
                onChange={handleProfileChange}
                placeholder="Smith John"
                className="w-full rounded-xl py-3 px-4 text-gray-400 placeholder-gray-400 shadow-md focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-[#6b6b6b] font-semibold mb-1"
              >
                Email Address
              </label>
              <div className="flex gap-3">
                <input
                  type="email"
                  id="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  placeholder="demo@gmail.com"
                  className="flex-1 rounded-xl py-3 px-4 text-gray-700 placeholder-gray-400 shadow-md focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
                />

                {profile.email && (
                  <button
                    type="button"
                    onClick={handleVerifyEmail}
                    className="bg-[#001f3f] text-white font-semibold px-5 py-3 rounded-xl hover:bg-[#0c1c5c] transition-colors"
                  >
                    Verify
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>

        {/* Connections Section */}
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          {/* Google Sheet */}
          <div className="bg-[#f3f7f6] rounded-xl p-6 flex flex-col space-y-4 flex-1 shadow-md">
            <p className="text-[#001f3f] font-semibold text-sm flex items-center gap-2">
              Google Sheet connection
              {googleCredentials ? (
                <>
                  <FaCheckCircle
                    className="text-green-500 text-base"
                    title="Connected"
                  />
                  <span className="text-green-600 text-xs">Online</span>
                </>
              ) : (
                <>
                  <FaTimesCircle
                    className="text-red-500 text-base"
                    title="Not connected"
                  />
                  <span className="text-red-600 text-xs">Offline</span>
                </>
              )}
            </p>

            <div>
              <label
                htmlFor="sheetId"
                className="block text-[#6b6b6b] font-semibold mb-1"
              >
                Google Sheet ID
              </label>
              <input
                type="text"
                id="sheetId"
                value={googleSheet.sheetId}
                onChange={handleGoogleChange}
                placeholder="Your Google Sheet ID"
                className="w-full rounded-xl py-3 px-4 text-gray-400 placeholder-gray-400 shadow-md focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
              />
            </div>
            <div>
              <label
                htmlFor="sheetRange"
                className="block text-[#6b6b6b] font-semibold mb-1"
              >
                Google Sheet Range
              </label>
              <input
                type="text"
                id="sheetRange"
                value={googleSheet.sheetRange}
                onChange={handleGoogleChange}
                placeholder="e.g. Sheet1!A1:C10"
                className="w-full rounded-xl py-3 px-4 text-gray-400 placeholder-gray-400 shadow-md focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
              />
            </div>
            <button
              type="button"
              onClick={handleGoogleConnect}
              className="w-fit bg-[#001f3f] text-white font-semibold rounded-full px-8 py-3 shadow-md hover:shadow-lg transition-shadow"
            >
              Connect to Google Sheet
            </button>
          </div>

          {/* Jira Connection */}
          <form className="bg-[#f3f7f6] rounded-xl p-6 flex flex-col space-y-4 flex-1 shadow-md">
            <p className="text-[#001f3f] font-semibold text-sm flex items-center gap-2">
              Jira connection
              {credentials ? (
                <>
                  <FaCheckCircle
                    className="text-green-500 text-base"
                    title="Connected"
                  />
                  <span className="text-green-600 text-xs">Online</span>
                </>
              ) : (
                <>
                  <FaTimesCircle
                    className="text-red-500 text-base"
                    title="Not connected"
                  />
                  <span className="text-red-600 text-xs">Offline</span>
                </>
              )}
            </p>

            <div>
              <label
                htmlFor="jiraEmail"
                className="block text-[#6b6b6b] font-semibold mb-1"
              >
                Jira Email Address
              </label>
              <input
                type="email"
                id="jiraEmail"
                value={jira.jiraEmail}
                onChange={handleJiraChange}
                placeholder="demo@gmail.com"
                className="w-full rounded-xl py-3 px-4 text-gray-400 placeholder-gray-400 shadow-md focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
              />
            </div>

            <div>
              <label
                htmlFor="jiraDomain"
                className="block text-[#6b6b6b] font-semibold mb-1"
              >
                Jira Site URL
              </label>
              <input
                type="text"
                id="jiraDomain"
                value={jira.jiraDomain}
                onChange={handleJiraChange}
                placeholder="https://yoursite.atlassian.net"
                className="w-full rounded-xl py-3 px-4 text-gray-400 placeholder-gray-400 shadow-md focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
              />
            </div>

            <div>
              <label
                htmlFor="jiraApiKey"
                className="block text-[#6b6b6b] font-semibold mb-1"
              >
                Jira API Key
              </label>
              <input
                type="text"
                id="jiraApiKey"
                value={jira.jiraApiKey}
                onChange={handleJiraChange}
                placeholder="your-api-key"
                className="w-full rounded-xl py-3 px-4 text-gray-400 placeholder-gray-400 shadow-md focus:outline-none focus:ring-2 focus:ring-[#001f3f]"
              />
            </div>
            <button
              type="button"
              onClick={handleJiraConnect}
              className="w-fit bg-[#001f3f] text-white font-semibold rounded-full px-8 py-3 shadow-md hover:shadow-lg transition-shadow"
            >
              Connect to Jira
            </button>
          </form>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            className="bg-[#001f3f] text-white font-semibold rounded-full px-8 py-3 shadow-md hover:shadow-lg transition-shadow"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
