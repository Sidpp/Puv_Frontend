import { toast } from "react-hot-toast";
import { setLoading, setToken } from "../../slices/authSlice";
import { setUser } from "../../slices/profileSlice";
import { apiConnector } from "../apiConnector";
import { endpoints } from "../apis";
import { setJiraCredentials } from "../../slices/jiraDetailSlice";
import { setGoogleCredentials } from "../../slices/googleSlice";

const {
  SEARCH_API,
  SENDOTP_API,
  SIGNIN_API,
  RESETPASSTOKEN_API,
  RESETPASSWORD_API,
  GET_USER_DETAILS_API,
  SIGNUP_API,
  REGISTER_API,
  GET_ALL_USERS_API,
  EDIT_USER_API,
  DELETE_USER_API,
  CHANGE_PASSWORD_API,
  UPDATE_IMAGE_API,
  UPDATE_INFO_API,
  SEND_EMAIL_OTP_API,
  VERIFY_EMAIL_OTP_API,
  NOTIFICATION_API,
  JIRA_DELETE_API,
  GOOGLE_DELETE_API,
} = endpoints;

// export function approveAlert(issueId, operation) {
//   //console.log("loggg", issueId, operation, APPROVE_ISSUE_API);
//   return async (dispatch) => {
//     const toastId = toast.loading(
//       operation === "approved" ? "Approving Jira issue..." : "Rejecting Jira issue..."
//     );

//     try {

//       const response = await apiConnector(
//         "POST",
//         APPROVE_ISSUE_API, // backend route
//         { issueId, operation }
//       );

//       console.log("UPDATE_JIRA_ISSUE_STATUS RESPONSE:", response);

//       if (response.data?.success) {
//         toast.success(
//           operation === "approved"
//             ? "Issue approved successfully"
//             : "Issue rejected successfully"
//         );
//       } else {
//         toast.error(response.data?.message || "Failed to update issue status");
//       }
//     } catch (error) {
//       console.error("UPDATE_JIRA_ISSUE_STATUS ERROR:", error);
//       toast.error(
//         error?.response?.data?.message || "Failed to update Jira issue status"
//       );
//     } finally {
//       dispatch(setLoading(false));
//       toast.dismiss(toastId);
//     }
//   };
// }

export function deleteUserJiraCredential(user_id) {
  //console.log("delete Jira credential for user:", user_id);

  return async (dispatch) => {
    try {
      const response = await apiConnector("DELETE", JIRA_DELETE_API, {
        user_id,
      });
      //console.log("DELETE JIRA RESPONSE:", response);

      const { success, message } = response.data;

      // Only throw if backend returns success: false
      if (success === false) {
        throw new Error(message || "Failed to delete Jira credential");
      }

      // Success case
      return { success: true, message };
    } catch (error) {
      // Only log network errors or unexpected issues
      //console.error("DELETE JIRA ERROR (network/unknown):", error);
      return { success: false, message: error.message || "Server error" };
    }
  };
}

export function deleteUserGoogleCredential(user_id) {
  // console.log("delete Google credential for user:", user_id);

  return async (dispatch) => {
    try {
      const response = await apiConnector("DELETE", GOOGLE_DELETE_API, {
        user_id,
      });
      //console.log("DELETE GOOGLE RESPONSE:", response);

      const { success, message } = response.data;

      // Only throw if backend returns success: false
      if (success === false) {
        throw new Error(message || "Failed to delete Google credential");
      }

      // Success case
      return { success: true, message };
    } catch (error) {
      // Only log network errors or unexpected issues
      // console.error("DELETE GOOGLE ERROR (network/unknown):", error);
      return { success: false, message: error.message || "Server error" };
    }
  };
}

export function globalSearch(query) {
  return async (dispatch) => {
    try {
      // dispatch(setLoading(true));

      const response = await apiConnector("POST", SEARCH_API, { query });

      // console.log("SEARCH RESPONSE:", response);

      // Our backend returns { query, jira: [...], google: [...] }
      const { jira, google } = response.data;

      if (!jira && !google) {
        throw new Error("Invalid response format: no results found");
      }

      return { jira, google }; // return both sets of results
    } catch (error) {
      // console.error("GLOBAL_SEARCH ERROR:", error);
      return null;
    } finally {
      // dispatch(setLoading(false));
    }
  };
}

export function getNotification() {
  return async (dispatch) => {
    try {
      const response = await apiConnector("GET", NOTIFICATION_API);

      //console.log("NOTIFICATION RESPONSE:", response);

      const { success, alerts } = response.data;

      if (!success) {
        throw new Error("Invalid response format: no alerts found");
      }

      // return merged alerts array
      return alerts || [];
    } catch (error) {
      // console.error("NOTIFICATION ERROR:", error);
      return [];
    } finally {
      // dispatch(setLoading(false));
    }
  };
}

export function deleteNotification(id, source, alert_id) {
  //console.log("delete",id,source,alert_id)
  return async (dispatch) => {
    try {
      const response = await apiConnector("DELETE", NOTIFICATION_API, {
        id,
        source,
        alert_id,
      });

      // console.log("DELETE NOTIFICATION RESPONSE:", response);

      const { success, message } = response.data;

      if (!success) {
        throw new Error(message || "Failed to delete notification");
      }

      return { success: true, message };
    } catch (error) {
      //console.error("DELETE NOTIFICATION ERROR:", error);
      return { success: false, message: error.message || "Server error" };
    } finally {
      // dispatch(setLoading(false));
    }
  };
}

export function updateImage(displayPicture, onSuccess) {
  return async (dispatch) => {
    const toastId = toast.loading("Uploading image...");
    try {
      const token = JSON.parse(localStorage.getItem("token"));

      // FormData to send image file
      const formData = new FormData();
      formData.append("displayPicture", displayPicture);

      const response = await apiConnector("PUT", UPDATE_IMAGE_API, formData, {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      dispatch(setUser(response.data.data));

      toast.success("Image updated successfully");
      onSuccess && onSuccess(response.data.data);
    } catch (error) {
      // console.error("UPDATE_IMAGE ERROR:", error);
      toast.error(error?.response?.data?.message || "Failed to update image");
    } finally {
      toast.dismiss(toastId);
    }
  };
}

export function updateBasicInfo({ name, email }, onSuccess) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating info...");
    try {
      const token = JSON.parse(localStorage.getItem("token"));

      const response = await apiConnector(
        "PUT",
        UPDATE_INFO_API,
        { name, email },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(setUser(response.data.data));

      //toast.success("Info updated successfully");
      onSuccess && onSuccess(response.data.data);
    } catch (error) {
      // console.error("UPDATE_BASIC_INFO ERROR:", error);
      // toast.error(error?.response?.data?.message || "Failed to update info");
    } finally {
      toast.dismiss(toastId);
    }
  };
}

//change password
export function changePassword(oldPassword, newPassword, onSuccess) {
  // console.log("api",CHANGE_PASSWORD_API)
  return async (dispatch) => {
    const toastId = toast.loading("Changing password...");
    //dispatch(setLoading(true));
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const response = await apiConnector(
        "PUT",
        CHANGE_PASSWORD_API,
        { oldPassword, newPassword },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Password changed successfully");

      // Call optional success callback to do things like clear form
      if (onSuccess) onSuccess();
    } catch (error) {
      // console.error("CHANGE_PASSWORD ERROR:", error);
      toast.error(
        error?.response?.data?.message || "Failed to change password"
      );
    } finally {
      //  dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

//get all users
export function getAllUsers() {
  return async (dispatch) => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const response = await apiConnector("GET", GET_ALL_USERS_API, null, {
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      return response.data.users;
    } catch (error) {
      // console.error("GET_ALL_USERS ERROR:", error);
      return [];
    }
  };
}

//edit user
export function editUser(userId, updatedData, onSuccess) {
  return async (dispatch) => {
    const toastId = toast.loading("Updating user...");
    //dispatch(setLoading(true));
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const response = await apiConnector(
        "PUT",
        EDIT_USER_API(userId),
        updatedData,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("User updated successfully");
      onSuccess && onSuccess(response.data.user); // Optional callback
    } catch (error) {
      // console.error("EDIT_USER ERROR:", error);
      toast.error(error?.response?.data?.message || "Failed to update user");
    }
    toast.dismiss(toastId);
    // dispatch(setLoading(false));
  };
}

//delete user
export function deleteUser(userId, onSuccess) {
  return async (dispatch) => {
    const toastId = toast.loading("Deleting user...");
    //dispatch(setLoading(true));
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      const response = await apiConnector(
        "DELETE",
        DELETE_USER_API(userId),
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("User deleted successfully");
      onSuccess && onSuccess(); // Optional callback to refresh UI
    } catch (error) {
      // console.error("DELETE_USER ERROR:", error);
      toast.error(error?.response?.data?.message || "Failed to delete user");
    }
    toast.dismiss(toastId);
    // dispatch(setLoading(false));
  };
}

//signup
export function signUp(role, name, email, password, confirmPassword, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    // dispatch(setLoading(true));
    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const response = await apiConnector("POST", SIGNUP_API, {
        role,
        name,
        email,
        password,
        confirmPassword,
      });

      //console.log("SIGNUP API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Signup Successful");
      navigate("/");
    } catch (error) {
      // console.log("SIGNUP API ERROR............", error);
      toast.error(
        error?.response?.data?.message || error?.message || "Signup Failed"
      );
    }
    //spatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

//register
export function register(
  role,
  projectrole,
  name,
  source,
  email,
  password,
  confirmPassword,
  assignJiraProjects,
  googleProjectAuthor,
  jiraProjectAuthor,
  navigate
) {

  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    // dispatch(setLoading(true));
    try {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }
      const token = JSON.parse(localStorage.getItem("token"));
      const response = await apiConnector(
        "POST",
        REGISTER_API,
        {
          name,
          email,
          password,
          source,
          confirmPassword,
          role,
          projectrole,
          assignJiraProjects,
          googleProjectAuthor,
          jiraProjectAuthor
        },
        {
          Authorization: `Bearer ${token}`,
        }
      );

     // console.log("REGISTRATION API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Register Successful");
      navigate("/dashboard/settings/user-management");
    } catch (error) {
      console.log("REGISRATION API ERROR............", error);
      toast.error(
        error?.response?.data?.message || error?.message || "Signup Failed"
      );
    }
    //spatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function getUserDetails() {
  return async (dispatch) => {
    dispatch(setLoading(true));
    try {
      const token = JSON.parse(localStorage.getItem("token"));

      const response = await apiConnector("GET", GET_USER_DETAILS_API, null, {
        Authorization: `Bearer ${token}`,
      });

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const userData = response.data.user;
      dispatch(setUser(userData));
      return true;
    } catch (error) {
      //console.log("GET_USER_DETAILS ERROR:", error);
      toast.error("Failed to fetch user details");
      localStorage.removeItem("token");
      return false;
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export function getPasswordResetToken(email, setEmailSent) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSTOKEN_API, {
        email,
      });

      // console.log("RESETPASSTOKEN RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Reset Email Sent");
      setEmailSent(true);
    } catch (error) {
      // console.log("RESETPASSTOKEN ERROR............", error);
      toast.error("Failed To Send Reset Email");
    }
    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}

export function resetPassword(password, confirmPassword, token, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      });

      // console.log("RESETPASSWORD RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Password Reset Successfully");
      navigate("/");
    } catch (error) {
      //console.log("RESETPASSWORD ERROR............", error);
      toast.error("Failed To Reset Password");
    }
    toast.dismiss(toastId);
    dispatch(setLoading(false));
  };
}

export function sendOtp(email, password, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      //console.log("api", SENDOTP_API);
      const response = await apiConnector("POST", SENDOTP_API, {
        email,
        password,
        checkUserPresent: true,
      });
      //console.log("SENDOTP API RESPONSE............", response);

      //console.log(response.data.success);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("OTP Sent Successfully");
      navigate("/verify-email");
    } catch (error) {
      //console.log("SENDOTP API ERROR............", error);
      toast.error(error.response.data.message);
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function sendEmailOtp(email) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    //dispatch(setLoading(true));
    try {
      //console.log("api", SENDOTP_API);
      const response = await apiConnector("POST", SEND_EMAIL_OTP_API, {
        email,
        checkUserPresent: true,
      });
      //console.log("SENDOTP API RESPONSE............", response);

      //console.log(response.data.success);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("OTP Sent Successfully");
    } catch (error) {
      // console.log("SENDOTP API ERROR............", error);
      toast.error(error.response.data.message);
    }
    //dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function verifyEmailOtp(oldEmail, newEmail, otp) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", VERIFY_EMAIL_OTP_API, {
        oldEmail,
        newEmail,
        otp,
      });

      // console.log("VERIFICATION API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      toast.success("Email verified & updated successfully");

      //console.log("verify for setUser",response.data.updatedUser)
      dispatch(setUser({ ...response.data.updatedUser }));
    } catch (error) {
      // console.log("verification ERROR............", error);
      toast.error(error.response?.data?.message || "Verification Failed");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function signin(email, password, otp, navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Loading...");
    dispatch(setLoading(true));
    try {
      const response = await apiConnector("POST", SIGNIN_API, {
        email,
        password,
        otp,
      });

      // console.log("SIGNin API RESPONSE............", response);

      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      toast.success("Signin Successful");

      dispatch(setToken(response.data.token));

      dispatch(setUser({ ...response.data.user }));
      localStorage.setItem("token", JSON.stringify(response.data.token));
      navigate("/dashboard");
    } catch (error) {
       console.log("SIGNin API ERROR............", error);
      toast.error(error.response.data.message);
      navigate("/");
    }
    dispatch(setLoading(false));
    toast.dismiss(toastId);
  };
}

export function logout(navigate) {
  return (dispatch) => {
    dispatch(setToken(null));
    dispatch(setUser(null));
    dispatch(setJiraCredentials(null));
    dispatch(setGoogleCredentials(null));
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged Out");
    navigate("/");
  };
}
