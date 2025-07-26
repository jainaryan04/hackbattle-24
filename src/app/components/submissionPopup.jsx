import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import Draggable from "react-draggable";

// A simple loading component to show while fetching data
const LoadingIndicator = () => (
  <div className="flex justify-center items-center h-full">
    <div className="text-yellow-300 font-pixeboy text-2xl">
      Loading Details...
    </div>
  </div>
);

const SubmissionPopup = ({ visible, onCancel }) => {
  // State for form inputs
  const [projectIdea, setProjectIdea] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [figmaLink, setFigmaLink] = useState("");
  const [otherLink, setOtherLink] = useState("");

  // State to control the UI, now powered by data from the backend
  const [isIdeaPresent, setIsIdeaPresent] = useState(false); // True if an idea has been submitted at least once
  const [hasExistingLinks, setHasExistingLinks] = useState(false); // True if links have been submitted

  // Loading states for fetching and submission actions
  const [isLoading, setIsLoading] = useState(true); // For the initial data fetch
  const [isSubmittingIdea, setIsSubmittingIdea] = useState(false);
  const [isSubmittingLinks, setIsSubmittingLinks] = useState(false);

  // On popup visibility, fetch existing submission details from the backend
  useEffect(() => {
    if (visible) {
      const fetchSubmissionDetails = async () => {
        setIsLoading(true);
        try {
          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/submission-details`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
              },
            }
          );

          const { projectIdea, githubLink, figmaLink, otherLink } =
            response.data;

          // Populate form fields with fetched data
          if (projectIdea) {
            setProjectIdea(projectIdea);
            setIsIdeaPresent(true); // An idea exists, so enable link submission
          }
          if (githubLink) {
            setGithubLink(githubLink);
            setHasExistingLinks(true); // Links exist
          }
          if (figmaLink) setFigmaLink(figmaLink);
          if (otherLink) setOtherLink(otherLink);
        } catch (error) {
          // A 404 error is expected if no submission has been made yet.
          // We don't need to show an error toast for that.
          if (error.response?.status !== 404) {
            toast.error("Could not fetch submission details.");
          }
          console.error(
            "Fetching details failed:",
            error.response?.data?.message || error.message
          );
        } finally {
          setIsLoading(false);
        }
      };

      fetchSubmissionDetails();
    }
  }, [visible]);

  const handleIdeaSubmit = async () => {
    if (!projectIdea.trim()) {
      toast.error("Project Idea cannot be empty.");
      return;
    }
    setIsSubmittingIdea(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/track-submission`,
        { projectIdea: projectIdea.trim() },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
          },
        }
      );
      toast.success("Project Idea updated successfully!");
      setIsIdeaPresent(true); // Mark that an idea is now present
    } catch (error) {
      toast.error(error.response?.data?.error || "Submission failed.");
    } finally {
      setIsSubmittingIdea(false);
    }
  };

  const handleLinkSubmit = async () => {
    if (!githubLink.trim()) {
      toast.error("GitHub link is required.");
      return;
    }
    setIsSubmittingLinks(true);
    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/link-submission`,
        {
          githubLink: githubLink.trim(),
          figmaLink: figmaLink.trim() || null,
          otherLink: otherLink.trim() || null,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("AccessToken")}`,
          },
        }
      );
      toast.success("Links updated successfully!");
      setHasExistingLinks(true); // Mark that links are now present
    } catch (error) {
      toast.error(error.response?.data?.error || "Submission failed.");
    } finally {
      setIsSubmittingLinks(false);
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-500 backdrop-blur-sm">
      <Draggable handle=".handle">
        <div className="h-fit w-[90%] sm:w-1/2 rounded-lg bg-red-600 relative overflow-y-auto flex flex-col border-black border-2">
          <div className="bg-yellow-300 text-center py-2 flex justify-between items-center border-b-2 border-pink-300 px-4 handle cursor-move">
            <span className="text-[#6E57FF] font-pixeboy text-3xl">
              {"<SUBMISSION>"}
            </span>
            <button
              onClick={onCancel}
              className="text-black ml-2 hover:bg-red-300 transition-colors duration-200 w-6 h-6 flex items-center justify-center rounded-full bg-red-600 border border-black font-bold text-xs"
            >
              &#x2715;
            </button>
          </div>

          <div className="flex-1 p-4 space-y-4">
            {isLoading ? (
              <LoadingIndicator />
            ) : (
              <>
                {/* --- Project Idea Section --- */}
                <div className="p-3 border-2 border-dashed border-pink-300 rounded-lg">
                  <h3 className="font-pixeboy text-yellow-300 text-2xl mb-2">
                    1. Project Idea
                  </h3>
                  <textarea
                    placeholder="Enter your project idea here..."
                    value={projectIdea}
                    onChange={(e) => setProjectIdea(e.target.value)}
                    className="font-pixeboy text-[2.2vh] p-2 h-[100px] w-full text-black rounded-lg border-2 border-pink-300 resize-none disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={isSubmittingIdea}
                  />
{/*                   <button
                    onClick={handleIdeaSubmit}
                    className="mt-2 w-full rounded-lg sm:text-[3vh] text-[2vh] px-8 py-2 text-black border-black border-2 bg-yellow-300 transition-colors duration-200 hover:opacity-90 font-pixeboy disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={isSubmittingIdea}
                  >
                    {isSubmittingIdea
                      ? "Submitting..."
                      : isIdeaPresent
                      ? "Update Idea"
                      : "Submit Idea"}
                  </button> */}
                </div>

                {/* --- Links Section --- */}
                <div className="p-3 border-2 border-dashed border-pink-300 rounded-lg">
                  <h3 className="font-pixeboy text-yellow-300 text-2xl mb-2">
                    2. Submission Links
                  </h3>
                  <textarea
                    placeholder="Github Link (Required)"
                    value={githubLink}
                    onChange={(e) => setGithubLink(e.target.value)}
                    className="font-pixeboy text-[2.2vh] p-2 h-[60px] w-full text-black rounded-lg border-2 border-pink-300 resize-none disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={!isIdeaPresent || isSubmittingLinks}
                  />
                  <textarea
                    placeholder="Figma Link (Optional)"
                    value={figmaLink}
                    onChange={(e) => setFigmaLink(e.target.value)}
                    className="font-pixeboy text-[2.2vh] p-2 mt-2 h-[60px] w-full text-black rounded-lg border-2 border-pink-300 resize-none disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={!isIdeaPresent || isSubmittingLinks}
                  />
                  <textarea
                    placeholder="Other Link (Optional)"
                    value={otherLink}
                    onChange={(e) => setOtherLink(e.target.value)}
                    className="font-pixeboy text-[2.2vh] p-2 mt-2 h-[60px] w-full text-black rounded-lg border-2 border-pink-300 resize-none disabled:bg-gray-300 disabled:cursor-not-allowed"
                    disabled={!isIdeaPresent || isSubmittingLinks}
                  />
                  <button
                    onClick={handleLinkSubmit}
                    className="mt-2 w-full rounded-lg sm:text-[3vh] text-[2vh] px-8 py-2 text-black border-black border-2 bg-yellow-300 transition-colors duration-200 hover:opacity-90 font-pixeboy disabled:bg-gray-400 disabled:cursor-not-allowed"
                    disabled={!isIdeaPresent || isSubmittingLinks}
                  >
                    {isSubmittingLinks
                      ? "Submitting..."
                      : hasExistingLinks
                      ? "Update Links"
                      : "Submit Links"}
                  </button>
                  {!isIdeaPresent && (
                    <p className="text-center font-pixeboy text-yellow-300 text-sm mt-1">
                      Submit an idea first to enable link submission.
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </Draggable>
    </div>
  );
};

export default SubmissionPopup;
