import React from "react";
import { HomepageState, initHomepageState } from "./Homepage.state";
import { attendEvent, loadEvent, loadUserEvents, removeAttendance, submitReview } from "./Homepage.api";
import { DateOnly } from "../../Models/Date";
import { DashboardForm } from "../Dashboard/Dashboard";
import { HomepageReview } from "./HomepageReview";
import { OfficeAttendance } from "../Office/OfficeAttendance";
import { castVote, loadVoteEvents } from "../Voting/Voting.api";
import { HomepageEventDetails } from "./HomepageEventDetails";

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
        this.loadVoteEvents();  
        this.loadPastUserEvents(); 
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
            this.loadVoteEvents();
            this.loadPastUserEvents();
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

    loadPastUserEvents = () => {
        loadUserEvents()
            .then((userEvents) => {
                if (!userEvents) {
                    this.setState({ userPastEvents: [], loading: false });
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
                        return eventDate.isBefore(today);
                    } catch (err) {
                        console.error("Error parsing eventDate:", err, userEvent);
                        return false;
                    }
                });
                this.setState({ userPastEvents: yourEvents, loading: false });
            })
            .catch((error) => {
                this.setState({ error: error.message, loading: false });
            });
    };

    loadVoteEvents = () => {
        loadVoteEvents()
            .then((voteEvents) => {
                if (!voteEvents) {
                    this.setState({ voteEvents: [], loading: false });
                    return;
                }
                const today = DateOnly.fromDate(new Date());
                const voteEvent = voteEvents.filter((voteEvent) => {
                    if (!voteEvent.startTime) {
                        console.warn("Missing eventDate for:", voteEvent);
                        return false;
                    }
                    try {
                        // Extract only the date portion
                        const dateOnlyString = voteEvent.startTime.toString().split('T')[0];
                        const eventDate = DateOnly.parse(dateOnlyString);
                        return eventDate.isAfter(today);
                    } catch (err) {
                        console.error("Error parsing eventDate:", err, voteEvent);
                        return false;
                    }
                });
                console.log(voteEvent);
                this.setState({ voteEvents: voteEvent, loading: false });
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

    handleEventClickOpen = (eventId: number) => {
        this.setState({ selectedEventId: eventId, view: "eventDetailsOpen" });
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

    handleVoteEvent = (VotingOptionId: number) => {
        const userId = Number(sessionStorage.getItem("userId"));
        if (!userId) {
            alert("User ID not found. Please log in again.");
            return;
        }
        console.log(VotingOptionId)
        castVote(VotingOptionId, userId)
            .then(() => {
                alert("Successfully casted a vote");
                this.handleReload(); // Reload events and userEvents
            })
            .catch((error) => {
                alert("Failed to cast a vote for the event: " + error.message);
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

    handleLogout = () => {
        const confirmLogout = window.confirm("Are you sure you want to log out?");
        if (confirmLogout) {
            sessionStorage.clear();
            alert("You have been logged out.");
            window.location.href = "/login";
        }
      };

    render() {
        const { events, loading, error, view, selectedEventId, userEvents, voteEvents, userPastEvents} = this.state;

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
                <div
        
                    style={{
                    position: "relative", // Ensure the parent container has positioning
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                    }}
                >
                    <h1 style={{ ...styles.heading, margin: 0 }}>Homepage</h1>
                    <button
                    style={{
                        ...styles.button,
                        position: "absolute", // Absolute positioning
                        top: 2,              // Aligns the button to the top
                        right: 2,            // Aligns the button to the right
                        backgroundColor: "red",
                        padding: "10px 15px",
                        fontSize: "14px",
                    }}
                    onClick={this.handleLogout}
                    >
                    Logout
                    </button>
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
                                <tr key={`${userEvent.eventId}-${index}`} onClick={() => this.handleEventClickOpen(userEvent.eventId)}>                                    <td style={styles.td}>{userEvent.title}</td>
                                    <td style={styles.td}>{userEvent.description}</td>
                                    <td style={styles.td}>{userEvent.eventDate.toString()}</td>
                                    <td style={styles.td}>{userEvent.startTime.toString()}</td>
                                    <td style={styles.td}>{userEvent.endTime.toString()}</td>
                                    <td style={styles.td}>{userEvent.location}</td>
                                    <td style={styles.td}>{userEvent.adminApproval ? "Approved" : "Pending"}</td>
                                    <td style={styles.td}>
                                        <button
                                            style={styles.button}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                this.handleRemoveAttendance(userEvent.eventId)}}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h2>Your Past Events Calendar</h2>
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
                            {userPastEvents.map((userEvent, index) => (
                                <tr key={`${userEvent.eventId}-${index}`} onClick={() => this.handleEventClick(userEvent.eventId)}>                                    <td style={styles.td}>{userEvent.title}</td>
                                    <td style={styles.td}>{userEvent.description}</td>
                                    <td style={styles.td}>{userEvent.eventDate.toString()}</td>
                                    <td style={styles.td}>{userEvent.startTime.toString()}</td>
                                    <td style={styles.td}>{userEvent.endTime.toString()}</td>
                                    <td style={styles.td}>{userEvent.location}</td>
                                    <td style={styles.td}>{userEvent.adminApproval ? "Approved" : "Pending"}</td>
                                    <td style={styles.td}>
                                        <button
                                            style={styles.button}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                this.handleRemoveAttendance(userEvent.eventId)}}
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
                            <tr key={`${event.eventId}-${index}`} onClick={() => this.handleEventClickOpen(event.eventId)}>                                
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
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            this.handleAttendEvent(event.eventId)}}
                                    >
                                        Attend
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    </table>

                    <h2>Events for Vote</h2>
                    <table style={styles.table}>
                    <thead>
                            <tr>
                                <th style={styles.th}>Even Details</th>
                                <th style={styles.th}>Start date</th>
                                <th style={styles.th}>Start time</th>
                                <th style={styles.th}>End date</th>
                                <th style={styles.th}>End time</th>
                                <th style={styles.th}>Vote count</th>
                                <th style={styles.th}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                        {voteEvents.map((vote, index) => (
                            <tr key={`${vote.id}-${index}`}>
                                <td style={styles.td}>{vote.eventDetails}</td>
                                <td style={styles.td}>{vote.startTime.toString().split('T')[0]}</td>
                                <td style={styles.td}>{vote.startTime.toString().split('T')[1]}</td>
                                <td style={styles.td}>{vote.endTime.toString().split('T')[0]}</td>
                                <td style={styles.td}>{vote.endTime.toString().split('T')[1]}</td>
                                <td style={styles.td}>{vote.voteCount}</td>
                                <td style={styles.td}>
                                    <button
                                        style={styles.button}
                                        onClick={() => this.handleVoteEvent(vote.id)}
                                    >
                                        Vote
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    </table>

                    {sessionStorage.getItem('userRole') === "admin" && (
                        <button style={styles.button} onClick={() => this.setState({ view: "dashboard" })}>
                            Go to Dashboard
                        </button>
                    )}
                    <button style={styles.button} onClick={() => this.setState({ view: "officeAttendance" })}>
                        Office attendance
                    </button>
                </div>
            );
        } else if (view === "eventDetails") {
            window.location.href = `/homepage/${this.state.selectedEventId}`;
            return <HomepageReview backToHome={() => this.setState({ view: "homepage" })} />;
        } else if (view === "eventDetailsOpen") {
            window.location.href = `/homepage/open/${this.state.selectedEventId}`;
            return <HomepageEventDetails backToHome={() => this.setState({ view: "homepage" })} />;
        }else if (view === "dashboard") {
            window.location.href = "/dashboard";
            return <DashboardForm />;
        } else if (view === "officeAttendance") {
            window.location.href = "/officeAttendance";
            return <OfficeAttendance  backToHome={() => this.setState({ view: "homepage"})}/>;
        }
    }
}
