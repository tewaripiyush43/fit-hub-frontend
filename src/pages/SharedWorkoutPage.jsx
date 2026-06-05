import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-toastify";
import ExerciseCard from "../components/ExerciseCard";
import { cloneWorkout } from "../api/workoutApi";
import api from "../api/client";
import Loader from "../components/Loader";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FavoriteIcon from "@mui/icons-material/Favorite";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";

const renderFormattedDescription = (text) => {
  if (!text) return null;
  const lines = text.split("\n");
  return lines.map((line, idx) => {
    let cleanLine = line.trim();
    if (!cleanLine) return <br key={idx} />;
    
    const isListItem = cleanLine.startsWith("* ") || cleanLine.startsWith("- ");
    if (isListItem) cleanLine = cleanLine.substring(2).trim();
    
    const parts = [];
    const boldRegex = /\*\*(.*?)\*\*/g;
    let lastIndex = 0;
    let match;
    while ((match = boldRegex.exec(cleanLine)) !== null) {
      if (match.index > lastIndex) {
        parts.push(cleanLine.substring(lastIndex, match.index));
      }
      parts.push(<strong key={match.index}>{match[1]}</strong>);
      lastIndex = boldRegex.lastIndex;
    }
    if (lastIndex < cleanLine.length) {
      parts.push(cleanLine.substring(lastIndex));
    }
    if (isListItem) {
      return (
        <li key={idx} style={{ marginLeft: "25px", marginBottom: "8px", listStyleType: "disc", textAlign: "left" }}>
          {parts}
        </li>
      );
    }
    return (
      <p key={idx} style={{ marginBottom: "12px", textAlign: "left" }}>
        {parts}
      </p>
    );
  });
};

const SharedWorkoutPage = () => {
  const { workoutId } = useParams();
  const [id] = workoutId.split("-");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [workout, setWorkout] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    const fetchSharedWorkout = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/workout/get/${id}`);
        
        if (response.status === 201) {
          setWorkout(response.data.workout);
        }
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Workout not found or is private.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchSharedWorkout();
  }, [id]);

  const handleClone = async () => {
    if (!isLoggedIn) {
      toast.error("Please log in to save this workout!");
      navigate("/");
      return;
    }
    
    try {
      setSaving(true);
      const newId = await cloneWorkout(dispatch, id);
      if (newId) {
        toast.success("Workout saved successfully to your routines!");
        navigate(`/${user.username}/myworkouts/${newId}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save workout. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = () => {
    const slug = workout?.name ? workout.name.replace(/\s+/g, "-") : "";
    const shareUrl = `${window.location.origin}/share/workout/${id}-${slug}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return <Loader />;
  
  if (error) {
    return (
      <div className="shared-workout-error-container">
        <div className="error-card">
          <h2>Access Denied / Not Found</h2>
          <p>{error}</p>
          <button onClick={() => navigate("/")}>Go to Homepage</button>
        </div>
      </div>
    );
  }

  return (
    <div className="workout-page shared-workout-page">
      <div className="workout-page-header">
        <span className="workout-page-back-btn" onClick={() => navigate(-1)}>
          &larr; Back
        </span>
        
        <div className="workout-page-actions">
          <button className="workout-share-btn" onClick={handleCopyLink}>
            <ContentCopyIcon style={{ fontSize: "1.1rem" }} />
            <span>{copied ? "Copied!" : "Copy Link"}</span>
          </button>
          
          {isLoggedIn && (
            <button 
              className="workout-page-save-info-btn" 
              onClick={handleClone} 
              disabled={saving}
            >
              <LibraryAddIcon style={{ fontSize: "1.1rem", marginRight: "4px" }} />
              <span>{saving ? "Saving..." : "Save to My Workouts"}</span>
            </button>
          )}
        </div>
      </div>

      <div className="workout-page-meta">
        <span className="shared-badge">Shared Routine</span>
        <h1 className="workout-page-title">{workout?.name}</h1>
        <div className="workout-page-stats-badge">
          <span>{workout?.exercises?.length || 0}</span> Exercises Included
        </div>
      </div>

      <div className="workout-page-description">
        <h3 className="description-heading">Workout Overview</h3>
        <div className="workout-page-content">
          {workout?.description ? (
            renderFormattedDescription(workout.description)
          ) : (
            <p className="empty-description-placeholder">No description provided.</p>
          )}
        </div>
      </div>

      <div className="workout-page-exercises-section">
        <h2 className="exercises-section-title">Routine Exercises</h2>
        <div className="workout-page-exercises-container">
          {workout?.exercises?.map((exercise) => (
            <ExerciseCard
              key={exercise._id}
              animation={false}
              removeBtn={false}
              exerciseData={exercise}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SharedWorkoutPage;
