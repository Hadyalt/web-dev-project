import React from "react";
import { HomepageState, initHomepageState, Event, Review } from "./Homepage.state";
import { loadEvent, loadUserEvents, submitReview } from "./Homepage.api";
import { DateOnly } from "../../Models/Date";
import { DashboardForm } from "../Dashboard/Dashboard";
import { HomepageReview } from "./HomepageReview";

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
    }

    componentDidMount() {
        const username = sessionStorage.getItem("username");
        const userRole = sessionStorage.getItem("userRole");
        const isAdmin = userRole === "admin";

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
                const yourEvents = userEvents.filter(userEvent => {
                    // Check if eventDate exists and is valid
                    if (!userEvent.eventDate) {
                        console.warn('Missing eventDate for:', userEvent);
                        return false;
                    }
                    try {
                        const eventDate = DateOnly.parse(userEvent.eventDate.toString());
                        return eventDate.isBefore(today);
                    } catch (err) {
                        console.error('Error parsing eventDate:', err, userEvent);
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
        loadEvent()
            .then((events) => {
                const today = DateOnly.fromDate(new Date());
                const futureEvents = events.filter(event => {
                    const eventDate = DateOnly.parse(event.eventDate.toString());
                    return eventDate.isAfter(today);
                });
                this.setState({ events: futureEvents, loading: false });
            })
            .catch((error) => {
                this.setState({ error: error.message, loading: false });
            });
    }
    
    handleEventClick = (eventId: number) => {
        this.setState({ selectedEventId: eventId, view: "eventDetails" });
    }

    handleReviewChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            review: { ...prevState.review, [name]: value }
        }));
    }

    handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { selectedEventId, review } = this.state;
        const userId = sessionStorage.getItem("userId");
        if (!userId) {
            alert("User ID not found. Please log in again.");
            return;
        }
        try {
            await submitReview(selectedEventId, { userId: Number(userId), rating: review.rating, feedback: review.feedback });
            alert("Review submitted successfully!");
            this.setState({ review: { userId: 0, rating: 0, feedback: "" } });
        } catch (error) {
            alert("Failed to submit review");
        }
    }

    render() {
        const { events, loading, error, view, selectedEventId, review, userEvents } = this.state;

        if (view === "homepage") {
            if (loading) {
                return <div>Loading...</div>;
            }

            if (error) {
                return <div>Error: {error}</div>;
            }

            return (
                <div>
                    <h1>Homepage</h1>
                    <h2>Your Events Calander</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Date</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Location</th>
                                <th>Admin Approval</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userEvents.map((userEvent, index) => (
                                <tr key={`${userEvent.eventId}-${index}`} onClick={() => this.handleEventClick(userEvent.eventId)}>
                                    <td>{userEvent.title}</td>
                                    <td>{userEvent.description}</td>
                                    <td>{userEvent.eventDate.toString()}</td>
                                    <td>{userEvent.startTime.toString()}</td>
                                    <td>{userEvent.endTime.toString()}</td>
                                    <td>{userEvent.location}</td>
                                    <td>{userEvent.adminApproval ? "Approved" : "Pending"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <h2>Open Events</h2>
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Description</th>
                                <th>Date</th>
                                <th>Start Time</th>
                                <th>End Time</th>
                                <th>Location</th>
                                <th>Admin Approval</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event, index) => (
                                <tr key={`${event.eventId}-${index}`} onClick={() => this.handleEventClick(event.eventId)}>
                                    <td>{event.title}</td>
                                    <td>{event.description}</td>
                                    <td>{event.eventDate.toString()}</td>
                                    <td>{event.startTime.toString()}</td>
                                    <td>{event.endTime.toString()}</td>
                                    <td>{event.location}</td>
                                    <td>{event.adminApproval ? "Approved" : "Pending"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {this.state.isAdmin && (
                        <button onClick={() => this.setState({ view: "dashboard" })}>
                            Go to Dashboard
                        </button>
                    )}
                </div>
            );
        } else if (view === "eventDetails") {
            window.location.href = `/homepage/${this.state.selectedEventId}`;
            const selectedEvent = events.find(event => event.eventId === selectedEventId);
            if (!selectedEvent) {
                return <div>Event not found</div>;
            }
            return (
                <HomepageReview
                    backToHome={() => this.setState({ view: "homepage" })}
                />
            );
        } else if (view === "dashboard") {
            window.location.href = "/dashboard";
            return <DashboardForm />
        }
    }
}