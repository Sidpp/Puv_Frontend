import { toast } from "react-hot-toast";
import { setLoading } from "../../slices/authSlice";
import { apiConnector } from "../apiConnector";
import { jiraendpoints } from "../apis";
import { setJiraCredentials } from "../../slices/jiraDetailSlice";

const { GET_ISSUES_API, APPROVE_ISSUE_API ,MARK_JIRA_ALERT_READ_API,UPDATE_JIRA_ALERT_STATUS_API, GET_ISSUES_BY_ID_API, JIRA_CONNECT_API ,GET_JIRA_CREDENTIALS_API} = jiraendpoints;


//approve/reject for alert
export function updateJiraAlertStatus(issueId, alertId, operation) {
  console.log("backend",issueId,alertId,operation)
  return async (dispatch) => {
    const toastId = toast.loading(
      operation === "approved"
        ? "Approving Jira alert..."
        : "Rejecting Jira alert..."
    );

    try {
      const response = await apiConnector("PUT", UPDATE_JIRA_ALERT_STATUS_API, {
        issueId,
        alertId,
        operation,
      });

      console.log("UPDATE_JIRA_ALERT_STATUS RESPONSE:", response);

      if (response.data?.success) {
        toast.success(
          operation === "approved"
            ? "Jira alert approved successfully"
            : "Jira alert rejected successfully"
        );
      } else {
        toast.error(response.data?.message || "Failed to update alert status");
      }
    } catch (error) {
      console.error("UPDATE_JIRA_ALERT_STATUS ERROR:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update Jira alert status"
      );
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}

//mark readed as true
export function markJiraAlertRead(issueId, alertId) {
  //console.log("backend..",issueId,alertId);
  return async (dispatch) => {
    const toastId = toast.loading("Marking Jira alert as read...");

    try {
      const response = await apiConnector("PUT", MARK_JIRA_ALERT_READ_API, {
        issueId,
        alertId,
      });

      console.log("MARK_JIRA_ALERT_READ RESPONSE:", response);

      if (response.data?.success) {
        toast.success("Jira alert marked as read");
      } else {
        toast.error(response.data?.message || "Failed to mark alert as read");
      }
    } catch (error) {
      console.error("MARK_JIRA_ALERT_READ ERROR:", error);
      toast.error(
        error?.response?.data?.message || "Failed to mark Jira alert as read"
      );
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}


// 🔁 APPROVE JIRA ISSUE
export function approveJiraIssue(issueId, operation) {
  //console.log("loggg", issueId, operation, APPROVE_ISSUE_API);
  return async (dispatch) => {
    const toastId = toast.loading(
      operation === "approved" ? "Approving Jira issue..." : "Rejecting Jira issue..."
    );

    try {
  

      const response = await apiConnector(
        "POST",
        APPROVE_ISSUE_API, // backend route
        { issueId, operation }
      );

      console.log("UPDATE_JIRA_ISSUE_STATUS RESPONSE:", response);

      if (response.data?.success) {
        toast.success(
          operation === "approved"
            ? "Issue approved successfully"
            : "Issue rejected successfully"
        );
      } else {
        toast.error(response.data?.message || "Failed to update issue status");
      }
    } catch (error) {
      console.error("UPDATE_JIRA_ISSUE_STATUS ERROR:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update Jira issue status"
      );
    } finally {
      dispatch(setLoading(false));
      toast.dismiss(toastId);
    }
  };
}


// 🔁 GET JIRA ISSUE BY ID
export function getJiraIssueById(issueId) {
  return async (dispatch) => {
    //const toastId = toast.loading("Fetching Jira issue...");
    try {

      const token = JSON.parse(localStorage.getItem("token"));

      const response = await apiConnector(
        "GET",
        `${GET_ISSUES_BY_ID_API}/${issueId}`,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

      console.log("GET_JIRA_ISSUE_BY_ID RESPONSE:", response);

      const issue = response.data?.issue;

      if (!issue || typeof issue !== "object") {
        throw new Error("Invalid response format: issue not found");
      }

      //toast.success("Jira issue loaded successfully");
      return issue;
    } catch (error) {
      console.error("GET_JIRA_ISSUE_BY_ID ERROR:", error);
      //toast.error(error?.response?.data?.message || "Failed to fetch Jira issue");
    } finally {
      dispatch(setLoading(false));
    // toast.dismiss(toastId);
    }
  };
}

//get jira credentials
export function fetchJiraCredentials() {
  return async (dispatch) => {
    //const toastId = toast.loading("Fetching Jira credentials...");
    try {
      const token = JSON.parse(localStorage.getItem("token"));

      const response = await apiConnector(
        "GET",
        GET_JIRA_CREDENTIALS_API, 
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
        setJiraCredentials({
          jiraEmail: data.jira_email,
          jiraDomain: data.jira_domain,
          jira_api_key: " Your API KEY IS SECURE"
    
        })
      );

      //toast.success("Fetched Jira credentials");
    } catch (error) {
      console.error("Fetch Jira credentials error:", error);
     // toast.error(error.response.data.message);
    } finally {
     // toast.dismiss(toastId);
    }
  };
}

// connect jira 
export function jiraConnect(
  { jira_email, jira_domain, jira_api_key },
  onSuccess
) {
  return async (dispatch) => {
    //const toastId = toast.loading("Updating Jira ");
    try {
      const token = JSON.parse(localStorage.getItem("token"));

      const response = await apiConnector(
        "POST",
        JIRA_CONNECT_API,
        { jira_email, jira_domain, jira_api_key },
        {
          Authorization: `Bearer ${token}`,
        }
      );

      if (!response.data.success) {
        throw new Error(response.data.message);
      }

      dispatch(
        setJiraCredentials({
          jiraEmail: jira_email,
          jiraDomain: jira_domain,
          jiraApiKey: jira_api_key,
        })
      );

     toast.success("Jira Details updated successfully");
      onSuccess && onSuccess(response.data.data);
    } catch (error) {
      console.error("JIRA_INFO ERROR:", error);
     // toast.error(error?.response?.data?.message || "Failed to update jira");
    } finally {
     // toast.dismiss(toastId);
    }
  };
}

// 🔁 GET JIRA ISSUES
export function getAllJiraIssues() {
  return async (dispatch) => {
    //dispatch(setLoading(true));
    //const toastId = toast.loading("Fetching Jira issues...");
    try {
      const token = JSON.parse(localStorage.getItem("token"));

      const response = await apiConnector(
        "GET",
        GET_ISSUES_API,
        null,
        {
          Authorization: `Bearer ${token}`,
        }
      );

     // console.log("GET_ISSUES_API RESPONSE:", response);

      const issues = response.data?.issues;

      if (!Array.isArray(issues)) {
        throw new Error("Invalid response format: issues is not an array");
      }

      // Optionally store in Redux
      // dispatch(setIssues(issues));

     // toast.success("Jira issues loaded successfully");
      return issues;
    } catch (error) {
      console.error("GET_ISSUES_API ERROR:", error);
     // toast.error(error?.response?.data?.message || "Failed to fetch Jira issues");
    } finally {
     // dispatch(setLoading(false));
     // toast.dismiss(toastId);
    }
  };
}
