import { apiConnector } from "../apiConnector";
import { endpoints } from "../apis";

const { FEEDBACK_API } = endpoints;

/**
 * Creates feedback for a particular notification.
 * @param {Object} feedbackData - { userid, feedback, for }
 */
export function createFeedback(feedbackData) {
  console.log("feed", feedbackData);
  return async (dispatch) => {
    try {
      const response = await apiConnector("POST", FEEDBACK_API, feedbackData);

    //  console.log("FEEDBACK RESPONSE:", response);

      const { success, feedback } = response.data;

      return { success, feedback }; // return success explicitly
    } catch (error) {
    //  console.error("FEEDBACK ERROR:", error);
      return { success: false, error }; // propagate error safely
    }
  };
}

