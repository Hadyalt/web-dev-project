import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Event, Review } from "./Homepage.state";
import { loadEvent, submitReview } from "./Homepage.api";
import { getEventById } from "../DashboardPatch/dashboardPatch.api";
import { getAttendance } from "../Dashboard/dashboard.api";

export const HomepageReview: React.FC<{ backToHome: () => void }> = ({ backToHome }) => {
    const { eventId } = useParams<{ eventId: string }>();
    const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
    const [review, setReview] = useState<Review>({ userId: 0, rating: 0, feedback: "" });

    useEffect(() => {
        if (eventId) {
            getEventById(parseInt(eventId))
                .then(event => setSelectedEvent(event))
                .catch(() => alert("Failed to load event details"));
        }
        loadReviews();
    }, [eventId]);

    const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setReview(prevReview => ({ ...prevReview, [name]: value }));
    };

    const loadReviews = async () => {
        if (!eventId) {
            return;
        }
        getAttendance(parseInt(eventId))
            .then(reviews => setSelectedEvent(prevEvent => prevEvent && { ...prevEvent, reviews }))
    };

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const userId = sessionStorage.getItem("userId");
        if (!userId || !selectedEvent) {
            alert("User ID not found or event not loaded. Please try again.");
            return;
        }
        try {
            await submitReview(selectedEvent.eventId, { userId: Number(userId), rating: review.rating, feedback: review.feedback });
            alert("Review submitted successfully!");
            setReview({ userId: 0, rating: 0, feedback: "" });
            window.location.href = "/homepage";
        } catch (error) {
            alert("Failed to submit review");
        }
    };

    if (!selectedEvent) {
        return <div>Loading event details...</div>;
    }

    const styles = {
        container: {
            fontFamily: "Arial, sans-serif",
            padding: "20px",
            maxWidth: "600px",
            margin: "auto",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        },
        heading: {
            textAlign: "center" as const,
            marginBottom: "20px",
        },
        eventDetails: {
            marginBottom: "20px",
        },
        reviews: {
            marginBottom: "20px",
        },
        formGroup: {
            marginBottom: "15px",
        },
        label: {
            display: "block",
            marginBottom: "5px",
            fontWeight: "bold",
        },
        input: {
            width: "100%",
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
        },
        textarea: {
            width: "100%",
            padding: "10px",
            borderRadius: "4px",
            border: "1px solid #ccc",
        },
        button: {
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            marginRight: "10px",
        },
        reviewList: {
            listStyleType: "none",
            padding: 0,
        },
        reviewItem: {
            borderBottom: "1px solid #ddd",
            padding: "10px 0",
        },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>{selectedEvent.title}</h1>
            <div style={styles.eventDetails}>
                <p>{selectedEvent.description}</p>
                <p>Date: {selectedEvent.eventDate.toString()}</p>
                <p>Start Time: {selectedEvent.startTime.toString()}</p>
                <p>End Time: {selectedEvent.endTime.toString()}</p>
                <p>Location: {selectedEvent.location}</p>
                <p>Admin Approval: {selectedEvent.adminApproval ? "Approved" : "Pending"}</p>
            </div>

            <h2>Reviews</h2>
            <ul style={styles.reviewList}>
                {selectedEvent.reviews && selectedEvent.reviews.length > 0 ? (
                    selectedEvent.reviews.map((review, index) => (
                        <li key={index} style={styles.reviewItem}>
                            <p>Rating: {review.rating}</p>
                            <p>Feedback: {review.feedback}</p>
                        </li>
                    ))
                ) : (
                    <p>No reviews yet.</p>
                )}
            </ul>

            <form onSubmit={handleReviewSubmit}>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Rating:</label>
                    <input
                        type="number"
                        name="rating"
                        value={review.rating}
                        onChange={handleReviewChange}
                        min="1"
                        max="10"
                        style={styles.input}
                    />
                </div>
                <div style={styles.formGroup}>
                    <label style={styles.label}>Feedback:</label>
                    <textarea
                        name="feedback"
                        value={review.feedback}
                        onChange={handleReviewChange}
                        style={styles.textarea}
                    />
                </div>
                <button type="submit" style={styles.button}>
                    Submit Review
                </button>
                <button
                    type="button"
                    style={styles.button}
                    onClick={() => {
                        window.location.href = "/homepage";
                    }}
                >
                    Go to the Homepage
                </button>
            </form>
        </div>
    );
};
