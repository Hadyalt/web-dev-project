import React from "react";
import { HomepageState, initHomepageState } from "./Homepage.state";
import { attendEvent, loadEvent, loadUserEvents, removeAttendance, submitReview } from "./Homepage.api";
import { DateOnly } from "../../Models/Date";
import { DashboardForm } from "../Dashboard/Dashboard";
import { HomepageReview } from "./HomepageReview";
import { OfficeAttendance } from "../Office/OfficeAttendance";

interface HomepageProps {
    backToHome: () => void;
}

export class Homepage extends React.Component<HomepageProps, HomepageState> {
    constructor(props: HomepageProps) {
        super(props);
        this.state = initHomepageState;
    }

    handleReload: () => void = () => {
        this.setState({ loading: true, error: null });
        this.loadEvents();
        this.loadUserEvents();
        
    };

    componentDidMount() {
        const username = sessionStorage.getItem("username");
        const userRole = sessionStorage.getItem("userRole");

        if (!username || !userRole) {
            alert("You are not logged in. Redirecting to login page...");
            window.location.href = "/login";
        } else {
            this.loadEvents();
            this.loadUserEvents();
        }
    }

    loadUserEvents = () => {
        loadUserEvents()
            .then((userEvents) => {
                if (!userEvents) {
                    this.setState({ userEvents: [], loading: false });
                    return;
                }
                const today = DateOnly.fromDate(new Date());
                const yourEvents = userEvents.filter((userEvent) => {
                    if (!userEvent.eventDate) {
                        console.warn("Missing eventDate for:", userEvent);
                        return false;
                    }
                    try {
                        const eventDate = DateOnly.parse(userEvent.eventDate.toString());
                        return eventDate.isAfter(today);
                    } catch (err) {
                        console.error("Error parsing eventDate:", err, userEvent);
                        return false;
                    }
                });
                this.setState({ userEvents: yourEvents, loading: false });
            })
            .catch((error) => {
                this.setState({ error: error.message, loading: false });
            });
    };

    loadEvents = () => {
        // First load user events and then filter events accordingly
        Promise.all([loadEvent(), loadUserEvents()])
            .then(([events, userEvents]) => {
                const today = DateOnly.fromDate(new Date());
                
                // Extract event IDs from userEvents to filter
                const userEventIds = new Set(userEvents.map((userEvent) => userEvent.eventId));
    
                // Filter events not in userEvents
                const futureEvents = events.filter((event) => {
                    const eventDate = DateOnly.parse(event.eventDate.toString());
                    return eventDate.isAfter(today) && !userEventIds.has(event.eventId);
                });
    
                this.setState({ events: futureEvents, loading: false });
            })
            .catch((error) => {
                this.setState({ error: error.message, loading: false });
            });
    };

    handleEventClick = (eventId: number) => {
        this.setState({ selectedEventId: eventId, view: "eventDetails" });
    };

    handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        this.setState((prevState) => ({
            review: { ...prevState.review, [name]: value },
        }));
    };

    handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { selectedEventId, review } = this.state;
        const userId = sessionStorage.getItem("userId");
        if (!userId) {
            alert("User ID not found. Please log in again.");
            return;
        }
        try {
            await submitReview(selectedEventId, {
                userId: Number(userId),
                rating: review.rating,
                feedback: review.feedback,
            });
            alert("Review submitted successfully!");
            this.setState({ review: { userId: 0, rating: 0, feedback: "" } });
        } catch (error) {
            alert("Failed to submit review");
        }
    };
    handleAttendEvent = (eventId: number) => {
        const userId = Number(sessionStorage.getItem("userId"));
        const FeedBack = "";
        const Rating = 0;
        if (!userId) {
            alert("User ID not found. Please log in again.");
            return;
        }
        attendEvent(eventId, userId, FeedBack, Rating)
            .then(() => {
                alert("Successfully registered for the event!");
                this.handleReload(); // Reload events and userEvents
            })
            .catch((error) => {
                alert("Failed to register for the event: " + error.message);
            });
    };
    handleRemoveAttendance = (eventId: number) => {
        const userId = Number(sessionStorage.getItem("userId"));
        if (!userId) {
            alert("User ID not found. Please log in again.");
            return;
        }
        removeAttendance(eventId)
            .then(() => {
                alert("Successfully removed attendance for the event!");
                this.handleReload(); // Reload events and user events
            })
            .catch((error) => {
                alert("Failed to remove attendance: " + error.message);
            });
    };

    render() {
        const { events, loading, error, view, selectedEventId, userEvents } = this.state;

        const styles: { [key: string]: React.CSSProperties } = {
            container: {
                fontFamily: "Arial, sans-serif",
                padding: "20px",
                backgroundColor: "#f9f9f9",
                borderRadius: "8px",
            },
            table: {
                width: "100%",
                borderCollapse: "collapse",
                marginBottom: "20px",
            },
            th: {
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px",
                textAlign: "left" as const,
                borderBottom: "2px solid #ddd",
            },
            td: {
                padding: "10px",
                textAlign: "left" as const,
                borderBottom: "1px solid #ddd",
            },
            button: {
                padding: "10px 20px",
                backgroundColor: "#007bff",
                color: "white",
                border: "none",
                borderRadius: "4px",
                cursor: "pointer",
            },
            heading: {
                color: "#333",
                marginBottom: "10px",
            },
        };

        if (view === "homepage") {
            if (loading) {
                return <div style={styles.container}>Loading...</div>;
            }

            if (error) {
                return <div style={styles.container}>Error: {error}</div>;
            }

            return (
                <div style={styles.container}>
                    <h1 style={styles.heading}>Homepage</h1>
                    <h2>Your Events Calendar</h2>
                    <table style={styles.table}>
                        <thead>
                            <tr>
                                <th style={styles.th}>Title</th>
                                <th style={styles.th}>Description</th>
                                <th style={styles.th}>Date</th>
                                <th style={styles.th}>Start Time</th>
                                <th style={styles.th}>End Time</th>
                                <th style={styles.th}>Location</th>
                                <th style={styles.th}>Admin Approval</th>
                                <th style={styles.th}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userEvents.map((userEvent, index) => (
                                <tr key={`${userEvent.eventId}-${index}`}>
                                    <td style={styles.td}>{userEvent.title}</td>
                                    <td style={styles.td}>{userEvent.description}</td>
                                    <td style={styles.td}>{userEvent.eventDate.toString()}</td>
                                    <td style={styles.td}>{userEvent.startTime.toString()}</td>
                                    <td style={styles.td}>{userEvent.endTime.toString()}</td>
                                    <td style={styles.td}>{userEvent.location}</td>
                                    <td style={styles.td}>{userEvent.adminApproval ? "Approved" : "Pending"}</td>
                                    <td style={styles.td}>
                                        <button
                                            style={styles.button}
                                            onClick={() => this.handleRemoveAttendance(userEvent.eventId)}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h2>Open Events</h2>
                    <table style={styles.table}>
                    <thead>
                            <tr>
                                <th style={styles.th}>Title</th>
                                <th style={styles.th}>Description</th>
                                <th style={styles.th}>Date</th>
                                <th style={styles.th}>Start Time</th>
                                <th style={styles.th}>End Time</th>
                                <th style={styles.th}>Location</th>
                                <th style={styles.th}>Admin Approval</th>
                                <th style={styles.th}>Average Rating</th>
                                <th style={styles.th}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {events.map((event, index) => (
                            <tr key={`${event.eventId}-${index}`}>
                                <td style={styles.td}>{event.title}</td>
                                <td style={styles.td}>{event.description}</td>
                                <td style={styles.td}>{event.eventDate.toString()}</td>
                                <td style={styles.td}>{event.startTime.toString()}</td>
                                <td style={styles.td}>{event.endTime.toString()}</td>
                                <td style={styles.td}>{event.location}</td>
                                <td style={styles.td}>{event.adminApproval ? "Approved" : "Pending"}</td>
                                <td style={styles.td}>{event.averageRating.toFixed(1)}</td>
                                <td style={styles.td}>
                                    <button
                                        style={styles.button}
                                        onClick={() => this.handleAttendEvent(event.eventId)}
                                    >
                                        Attend
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    </table>
                    <button style={styles.button} onClick={() => this.setState({ view: "officeAttendance" })}>
                        Office attendance
                    </button>
                    {this.state.isAdmin && (
                        <button style={styles.button} onClick={() => this.setState({ view: "dashboard" })}>
                            Go to Dashboard
                        </button>
                    )}
                </div>
            );
        } else if (view === "eventDetails") {
            window.location.href = `/homepage/${this.state.selectedEventId}`;
            return <HomepageReview backToHome={() => this.setState({ view: "homepage" })} />;
        } else if (view === "dashboard") {
            window.location.href = "/dashboard";
            return <DashboardForm />;
        } else if (view === "officeAttendance") {
            window.location.href = "/officeAttendance";
            return <OfficeAttendance  backToHome={() => this.setState({ view: "homepage"})}/>;
        }
    }
}
