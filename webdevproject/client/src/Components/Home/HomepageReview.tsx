import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Event, Review } from "./Homepage.state";
import { loadEvent, submitReview } from "./Homepage.api";
import { getEventById } from "../DashboardPatch/dashboardPatch.api";

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
    }, [eventId]);

    const handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setReview(prevReview => ({ ...prevReview, [name]: value }));
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

    return (
        <div>
            <h1>{selectedEvent.title}</h1>
            <p>{selectedEvent.description}</p>
            <p>Date: {selectedEvent.eventDate.toString()}</p>
            <p>Start Time: {selectedEvent.startTime.toString()}</p>
            <p>End Time: {selectedEvent.endTime.toString()}</p>
            <p>Location: {selectedEvent.location}</p>
            <p>Admin Approval: {selectedEvent.adminApproval ? "Approved" : "Pending"}</p>

            <h2>Reviews</h2>
            <ul>
                {selectedEvent.reviews && selectedEvent.reviews.length > 0 ? (
                    selectedEvent.reviews.map((review, index) => (
                        <li key={index}>
                            <p>Rating: {review.rating}</p>
                            <p>Feedback: {review.feedback}</p>
                        </li>
                    ))
                ):(<p></p>)}
            </ul>

            <form onSubmit={handleReviewSubmit}>
                <div>
                    <label>Rating:</label>
                    <input
                        type="number"
                        name="rating"
                        value={review.rating}
                        onChange={handleReviewChange}
                        min="1"
                        max="10"
                    />
                </div>
                <div>
                    <label>Feedback:</label>
                    <textarea
                        name="feedback"
                        value={review.feedback}
                        onChange={handleReviewChange}
                    />
                </div>
                <button type="submit">Submit Review</button>
            </form>

            <button type="button" onClick={() => {
            window.location.href = "/homepage";  
            //this.props.backToHome()
            }}> Go to the homepage </button>
        </div>
    );
};
