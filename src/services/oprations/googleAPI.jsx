//import { toast } from "react-hot-toast";
import { setLoading } from "../../slices/authSlice";
import { apiConnector } from "../apiConnector";
import { googleendpoints } from "../apis";
import { setGoogleCredentials } from "../../slices/googleSlice";
import toast from "react-hot-toast";

const {
  GET_ALL_GOOGLE_DETAILS_API,
  GET_GOOGLE_CREDENTIALS_API,
  GET_GOOGLE_SHEET_BY_ID_API,
  APPROVE_GOOGLE_API,
  UPDATE_GOOGLE_ALERT_STATUS_API,
  MARK_GOOGLE_ALERT_READ_API,
  GET_ASSIGNED_GOOGLE_DETAILS_API
} = googleendpoints;

// mark aproved/rejected for notification
export function updateGoogleAlertStatus(projectId, alertId, operation) {
  return async (dispatch) => {
    const toastId = toast.loading(
      operation === "approved"
        ? "Approving Google alert..."
        : "Rejecting Google alert..."
    );

    try {
      const response = await apiConnector("PUT", UPDATE_GOOGLE_ALERT_STATUS_API, {
        projectId,
        alertId,
        operation,
      });

     // console.log("UPDATE_GOOGLE_ALERT_STATUS RESPONSE:", response);

      if (response.data?.success) {
        toast.success(
          operation === "approved"
            ? "Google alert approved successfully"
            : "Google alert rejected successfully"
        );
      } else {
        toast.error(response.data?.message || "Failed to update Google alert status");
      }
    } catch (error) {
      //console.error("UPDATE_GOOGLE_ALERT_STATUS ERROR:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update Google alert status"
      );
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

//mark read for notification
export function markGoogleAlertRead(projectId, alertId) {
  return async (dispatch) => {
    const toastId = toast.loading("Marking Google alert as read...");

    try {
      const response = await apiConnector("PUT", MARK_GOOGLE_ALERT_READ_API, {
        projectId,
        alertId,
      });

     // console.log("MARK_GOOGLE_ALERT_READ RESPONSE:", response);

      if (response.data?.success) {
        toast.success("Google alert marked as read");
      } else {
        toast.error(response.data?.message || "Failed to mark Google alert as read");
      }
    } catch (error) {
      //console.error("MARK_GOOGLE_ALERT_READ ERROR:", error);
      toast.error(
        error?.response?.data?.message || "Failed to mark Google alert as read"
      );
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

//mark ai summary approve/rejected
export function approveGoogleSumary(projectId, operation) {
 // console.log("project ",projectId, operation)
  return async (dispatch) => {
    const toastId = toast.loading(
      operation === "approved"
        ? "Approving..."
        : "Rejecting..."
    );

    try {
      const response = await apiConnector(
        "POST",
        APPROVE_GOOGLE_API,
        { projectId, operation }
      );

     // console.log("UPDATE_GOOGLE_SUMMARY_STATUS RESPONSE:", response);

      if (response.data?.success) {
        toast.success(
          operation === "approved"
            ? "Approved successfully"
            : "Rejected successfully"
        );
      } else {
        toast.error(response.data?.message || "Failed to update Google issue status");
      }
    } catch (error) {
     // console.error("UPDATE_GOOGLE_SUMMARY_STATUS ERROR:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update Google summary status"
      );
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}


//get jira credentials
export function fetchGoogleCredentials() {
  return async (dispatch) => {
    //const toastId = toast.loading("Fetching Google credentials...");
    try {
      const token = JSON.parse(localStorage.getItem("token"));

      const response = await apiConnector(
        "GET",
        GET_GOOGLE_CREDENTIALS_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      const data = response.data.data;

      dispatch(
        setGoogleCredentials({
          spreadsheetId: data.spreadsheetId,
          sheetRange: data.sheetRange,
        })
      );
      //console.log("google credentials server",data)

      //toast.success("Fetched Google credentials");
    } catch (error) {
     // console.error("Fetch Google credentials error:", error);
      //toast.error(error.response.data.message);
    } finally {
      //toast.dismiss(toastId);
    }
  };
}

//get sheet by id
export function getGoogleSheetById(sheetId) {
  return async (dispatch) => {
    //const toastId = toast.loading("Fetching Google Sheet details...");

    try {
      if (!sheetId) {
        throw new Error("Google Sheet ID is required");
      }

      const response = await apiConnector(
        "GET",
        `${GET_GOOGLE_SHEET_BY_ID_API}/${sheetId}`
      );

     // console.log("GET_GOOGLE_SHEET_BY_ID RESPONSE:", response);

      const sheet = response.data?.sheet;

      if (!sheet) {
        throw new Error("Google Sheet not found");
      }

     // toast.success("Google Sheet fetched successfully");
      return sheet;
    } catch (error) {
      //console.error("GET_GOOGLE_SHEET_BY_ID ERROR:", error);
      // toast.error(
      //   error?.response?.data?.error || "Failed to fetch Google Sheet"
      // );
    } finally {
      dispatch(setLoading(false));
      //toast.dismiss(toastId);
    }
  };
}

// 🔁 GET GOOGLE SHEET DETAILS
export function getAllGoogleDetails() {
  return async (dispatch) => {
    //const toastId = toast.loading("Fetching Google Sheet details...");

    try {
      const token = JSON.parse(localStorage.getItem("token"));

      const response = await apiConnector(
        "GET",
        GET_ALL_GOOGLE_DETAILS_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      //console.log("GET_GOOGLE_DETAILS RESPONSE:", response);

      const projects = response.data?.data;

      if (!Array.isArray(projects)) {
        throw new Error("Invalid response format: projects is not an array");
      }

      // Optional: dispatch to store it in Redux
      // dispatch(setGoogleDetails(projects));

     // toast.success("Google Sheet details loaded successfully");
      return projects;
    } catch (error) {
      //console.error("GET_GOOGLE_DETAILS ERROR:", error);
      // toast.error(
      //   error?.response?.data?.message || "Failed to fetch Google Sheet details"
      // );
    } finally {
      //dispatch(setLoading(false));
      //toast.dismiss(toastId);
    }
  };
}

// 🔁 GET ASSIGN GOOGLE SHEET DETAILS
export function getAssignGoogleDetails(userId) {
  return async (dispatch) => {
    //const toastId = toast.loading("Fetching Google Sheet details...");
 // console.log("user",userId)
    try {
     

      const response = await apiConnector(
        "POST",
        GET_ASSIGNED_GOOGLE_DETAILS_API,
        {userId}
      );

      //console.log("GET_GOOGLE_DETAILS RESPONSE:", response);

      const projects = response.data?.data;

      if (!Array.isArray(projects)) {
        throw new Error("Invalid response format: projects is not an array");
      }

      // Optional: dispatch to store it in Redux
      // dispatch(setGoogleDetails(projects));

     // toast.success("Google Sheet details loaded successfully");
      return projects;
    } catch (error) {
     // console.error("GET_GOOGLE_DETAILS ERROR:", error);
      // toast.error(
      //   error?.response?.data?.message || "Failed to fetch Google Sheet details"
      // );
    } finally {
      //dispatch(setLoading(false));
      //toast.dismiss(toastId);
    }
  };
}
