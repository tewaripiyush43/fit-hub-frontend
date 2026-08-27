import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "../helpers/errorPopUp";
import ExerciseCard from "../components/ExerciseCard";
import { cloneWorkout } from "../api/workoutApi";
import { portalActions } from "../store/index";
import { updateSEO } from "../utils/seoHelper";
import api from "../api/client";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import LibraryAddIcon from "@mui/icons-material/LibraryAdd";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockIcon from "@mui/icons-material/Lock";

// UI Primitives
import {
  Badge,
  Button,
  ErrorState,
  Skeleton,
} from "../components/ui";

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
  const [id] = (workoutId || "").split("-");
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
      if (!id || id === "undefined") {
        setError("Invalid workout routine link.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        const response = await api.get(`/workout/get/${id}`);
        
        if (response.status === 200 && response.data) {
          setWorkout(response.data.workout || response.data);
        } else {
          setError("Failed to load workout routine.");
        }
      } catch (err) {
        console.error("Shared workout fetch error:", err);
        const status = err.response?.status;
        if (status === 403) {
          setError("This workout routine is private and can only be viewed by its creator.");
        } else if (status === 404) {
          setError("Workout routine not found. It may have been deleted or the link is incorrect.");
        } else {
          setError(err.response?.data?.error?.message || "Failed to load shared routine. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };
    
      fetchSharedWorkout();
  }, [id]);

  useEffect(() => {
    if (workout?.name) {
      const exerciseCount = workout.exercises?.length || 0;
      updateSEO({
        title: `${workout.name} - Custom Workout Routine | FitHub`,
        description: `Explore the "${workout.name}" routine on FitHub (${exerciseCount} exercises). View target muscle sets, reps, and clone it directly to your workout library.`,
        pathname: `/share/workout/${workoutId}`,
        keywords: `${workout.name}, workout routine, gym program, custom split, fitHub workout`,
      });
    }
  }, [workout, workoutId]);

  const handleClone = async () => {
    if (!isLoggedIn || !user?._id) {
      dispatch(portalActions.setPortalOpen());
      toast.info("Please log in or sign up to save this routine to your library!");
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
      const msg = err.response?.data?.error?.message || err.response?.data?.message || "Failed to save workout. Please try again.";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCopyLink = () => {
    const slug = workout?.name ? workout.name.replace(/\s+/g, "-") : "";
    const shareUrl = `${window.location.origin}/share/workout/${id}-${slug}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.info("Workout link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div className="workout-page shared-workout-page" style={{ maxWidth: "1200px", margin: "0 auto", padding: "100px 20px" }}>
        <Skeleton variant="text" width="200px" height="30px" />
        <Skeleton variant="text" width="60%" height="48px" style={{ margin: "16px 0" }} />
        <Skeleton variant="card" height="120px" style={{ marginBottom: "24px" }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          <Skeleton variant="exercise-card" height="260px" />
          <Skeleton variant="exercise-card" height="260px" />
          <Skeleton variant="exercise-card" height="260px" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shared-workout-error-container" style={{ minHeight: "80vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "100px 20px" }}>
        <ErrorState
          icon={<LockIcon />}
          title="Shared Routine Notice"
          message={error}
          onRetry={() => navigate("/")}
          retryLabel="Explore Public Routines"
        />
      </div>
    );
  }

  return (
    <div className="workout-page shared-workout-page">
      <div className="workout-page-header">
        <Button
          variant="ghost"
          size="sm"
          iconStart={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
        >
          Back
        </Button>

        <div className="workout-page-actions">
          <Button
            variant="outline"
            size="sm"
            iconStart={<ContentCopyIcon />}
            onClick={handleCopyLink}
            title="Copy Public Link"
          >
            {copied ? "Copied!" : "Share Link"}
          </Button>

          <Button
            variant="primary"
            size="sm"
            iconStart={<LibraryAddIcon />}
            onClick={handleClone}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save to My Workouts"}
          </Button>
        </div>
      </div>

      <div className="workout-page-meta">
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap", marginBottom: "8px" }}>
          <Badge variant="accent" size="md">
            Shared Community Routine
          </Badge>
          <Badge variant="neutral" size="md">
            {workout?.exercises?.length || 0} Exercises Included
          </Badge>
        </div>
        <h1 className="workout-page-title">{workout?.name}</h1>
      </div>

      <div className="workout-page-description">
        <h3 className="description-heading">Workout Overview & Guidelines</h3>
        <div className="workout-page-content">
          {workout?.description ? (
            renderFormattedDescription(workout.description)
          ) : (
            <p className="empty-description-placeholder">No special guidelines provided for this routine.</p>
          )}
        </div>
      </div>

      <div className="workout-page-exercises-section">
        <div className="exercises-section-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 className="exercises-section-title">Routine Exercises</h2>
          <Badge variant="accent" size="sm">
            {workout?.exercises?.length || 0} Movements
          </Badge>
        </div>

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
