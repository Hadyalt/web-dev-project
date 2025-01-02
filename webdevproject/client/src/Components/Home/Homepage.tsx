import React from "react";
import { HomepageState, initHomepageState } from "./Homepage.state.tsx";
import { loadEvent } from "./Homepage.api.ts";

export class Homepage extends React.Component<{}, HomepageState> {
    constructor(props: {}) {
        super(props);
        this.state = initHomepageState;
    }

    handleReload: () => void = () => {
        this.setState({ loading: true, error: null });
        this.loadEvents();
    }

    componentDidMount() {
        this.loadEvents();
    }

    loadEvents = () => {
        loadEvent()
            .then((events) => {
                this.setState({ events, loading: false });
            })
            .catch((error) => {
                this.setState({ error: error.message, loading: false });
            });
    }

    render() {
        if (this.state.view == "homepage") {
            const { events, loading, error } = this.state;

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
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {events.map((event, index) => (
                                <tr key={`${event.eventId}-${index}`}>
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
                </div>
            );
        } 
    }
}
