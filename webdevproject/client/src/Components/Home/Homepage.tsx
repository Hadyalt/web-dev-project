import React from "react";
import { HomepageState, initHomepageState, Event } from "./Homepage.state.tsx";
import { loadEvent } from "./Homepage.api.ts";
import { DateOnly } from "../../Models/Date";
import { DashboardForm } from "../Dashboard/Dashboard.tsx";

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
    }

    componentDidMount() {
        const username = sessionStorage.getItem("username");
        const userRole = sessionStorage.getItem("userRole");

        if (!username || !userRole) {
            // Redirect to login page
            alert("You are not logged in. Redirecting to login page...");
            window.location.href = "/login";
        } else {
            this.loadEvents();
        }
    }

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

    render() {
        const { events, loading, error, view, selectedEventId } = this.state;

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
            const selectedEvent = events.find(event => event.eventId === selectedEventId);
            if (!selectedEvent) {
                return <div>Event not found</div>;
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
                    <button onClick={() => this.setState({ view: "homepage" })}>Back to Homepage</button>
                </div>
            );
        } else if (view === "dashboard") {
            return <DashboardForm />
        }
    }
}