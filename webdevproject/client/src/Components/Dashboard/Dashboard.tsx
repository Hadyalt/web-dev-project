import React from "react";
import { DashboardState, initDashboardState } from "./dashboard.state.tsx";
import { loadEvent } from "./dashboard.api.ts";
import { deleteEvent } from "./dashboard.api.ts";
import { DashboardPostForm } from "../DashboardPost/DashboardPost.tsx";
import { DashboardPatch } from "../DashboardPatch/dashboardPatch.tsx";

export class DashboardForm extends React.Component<{}, DashboardState> {
  constructor(props: {}) {
    super(props);
    this.state = initDashboardState;
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

  handleDelete = (eventId: number) => {
    this.setState({ showModal: true, eventToDelete: eventId });
  }

  confirmDelete = async () => {
    if (this.state.eventToDelete) {
      try {
        await deleteEvent(this.state.eventToDelete.toString());
        this.setState({ showModal: false, eventToDelete: null });
        this.loadEvents();
      } catch (error) {
        console.error("Error deleting event:", error);
        this.setState({ showModal: false, eventToDelete: null });
      }
    }
  }

  cancelDelete = () => {
    this.setState({ showModal: false, eventToDelete: null });
  }

  render() {
    if (this.state.view == "dashboard") {
      const { events, loading, error } = this.state;

      if (loading) {
        return <div>Loading...</div>;
      }

      if (error) {
        return <div>Error: {error}</div>;
      }

      return (
        <div>
          <h1>Dashboard</h1>
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
                  <td>
                    <button onClick={() => this.setState({ view: "dashboardPatch", selectedEventId: event.eventId })}>
                      Edit
                    </button>
                    <button onClick={() => this.handleDelete(event.eventId)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button onClick={e => this.setState(this.state.updateViewState("dashboardPost"))}>
            Make Event
          </button>
          <button>Back</button>

          {this.state.showModal && (
            <div className="modal">
              <div className="modal-content">
                <h2>Are you sure you want to delete this event?</h2>
                <button onClick={this.confirmDelete}>Yes</button>
                <button onClick={this.cancelDelete}>No</button>
              </div>
            </div>
          )}
        </div>
      );
    } else if (this.state.view == "dashboardPost") {
      return (
        <DashboardPostForm 
          backToHome={() => {
            this.setState(this.state.updateViewState("dashboard"));
            this.loadEvents();
          }}
        />
      );
    } else if (this.state.view == "dashboardPatch") {
      return (
        <DashboardPatch
          eventId={this.state.selectedEventId}
          backToHome={() => {
            this.setState(this.state.updateViewState("dashboard"));
            this.loadEvents();
          }}
        />
      );
    }else if (this.state.view == "dashboardPatch") {
      return (
        <DashboardPatch
          backToHome={() => {
            this.setState(this.state.updateViewState("dashboard"));
            this.loadEvents();
          }}
        />
      );
    } else if (this.state.view == "dashboardPatch") {
      return (
        <DashboardPatch
          eventId={this.state.selectedEventId}
          backToHome={() => {
            this.setState(this.state.updateViewState("dashboard"));
            this.loadEvents();
          }}
        />
      );
    }
  }
}