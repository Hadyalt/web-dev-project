import React from "react";
import { DashboardState, initDashboardState } from "./dashboard.state.tsx";
import { loadEvent, getAttendance } from "./dashboard.api.ts"; // Add getAttendance function import
import { deleteEvent } from "./dashboard.api.ts";
import { DashboardPostForm } from "../DashboardPost/DashboardPost.tsx";
import { DashboardPatch } from "../DashboardPatch/dashboardPatch.tsx";
import { Homepage } from "../Home/Homepage.tsx";

export class DashboardForm extends React.Component<{}, DashboardState> {
  constructor(props: {}) {
    super(props);
    this.state = initDashboardState;
  }

  handleReload: () => void = () => {
    this.setState({ loading: true, error: null });
    this.loadEvents();
  };

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
        this.setState({ events, loading: false });
      })
      .catch((error) => {
        this.setState({ error: error.message, loading: false });
      });
  };

  handleDelete = (eventId: number) => {
    this.setState({ showModal: true, eventToDelete: eventId });
  };

  handleAttendee = () => {
    this.setState({ showAttendee: true })
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
  };

  cancelDelete = () => {
    this.setState({ showModal: false, eventToDelete: null });
  };

  fetchAttendance = async (eventId: number) => {
    this.setState({ loadingAttendance: true });
    try {
      const data = await getAttendance(eventId);  // Call the getAttendance function
      this.setState({ attendance: data, loadingAttendance: false });
    } catch (error) {
      console.error("Error fetching attendance:", error);
      this.setState({ loadingAttendance: false });
    }
    this.handleAttendee();
  };

  render() {
    const styles = {
      container: {
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
      },
      table: {
        width: "100%",
        borderCollapse: "collapse" as "collapse",
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
      modal: {
        position: "fixed" as const,
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "white",
        padding: "20px",
        borderRadius: "8px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
        zIndex: 1000,
      },
      overlay: {
        position: "fixed" as const,
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 999,
      },
    };

    if (this.state.view == "dashboard") {
      const { events, loading, error, attendance, loadingAttendance } = this.state;

      if (loading) {
        return <div style={styles.container}>Loading...</div>;
      }

      if (error) {
        return <div style={styles.container}>Error: {error}</div>;
      }

      return (
        <div style={styles.container}>
          <h1 style={styles.heading}>Dashboard</h1>
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
                <th style={styles.th}>Actions</th>
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
                  <td style={styles.td}>
                    <button style={styles.button} onClick={() => this.setState({ view: "dashboardPatch", selectedEventId: event.eventId })}>
                      Edit
                    </button>
                    <button style={styles.button} onClick={() => this.handleDelete(event.eventId)}>Delete</button>
                    <button style={styles.button} onClick={() => this.fetchAttendance(event.eventId)}>Get Attendance</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button style={styles.button} onClick={() => this.setState(this.state.updateViewState("dashboardPost"))}>Make Event</button>
          <button style={styles.button} onClick={() => this.setState(this.state.updateViewState("homepage"))}>Back</button>

          {this.state.showModal && (
            <div style={styles.overlay}>
              <div style={styles.modal}>
                <h2>Are you sure you want to delete this event?</h2>
                <button style={styles.button} onClick={this.confirmDelete}>Yes</button>
                <button style={styles.button} onClick={this.cancelDelete}>No</button>
              </div>
            </div>
          )}

          {this.state.showAttendee && (
            <div style={styles.overlay}>
              <div style={styles.modal}>
                <h2>Attendance</h2>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Rating</th>
                      <th style={styles.th}>Feedback</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendance.map((attendee, index) => (
                      <tr key={index}>
                        <td style={styles.td}>{attendee.rating || "No rating"}</td>
                        <td style={styles.td}>{attendee.feedback || "No feedback"}</td>
                      </tr>
                    ))}
                    {attendance.length === 0 && (
                      <div>No attendance available</div>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      );
    } else if (this.state.view == "dashboardPost") {
      window.location.href = "/dashboard/post";
      return (
        <DashboardPostForm
          backToHome={() => {
            this.setState(this.state.updateViewState("dashboard"));
            this.loadEvents();
          }}
        />
      );
    } else if (this.state.view == "dashboardPatch") {
      window.location.href = `/dashboard/edit/${this.state.selectedEventId}`;
      return (
        <DashboardPatch
          backToHome={() => {
            this.setState(this.state.updateViewState("dashboard"));
            this.loadEvents();
          }}
        />
      );
    } else if (this.state.view == "homepage") {
      window.location.href = "/homepage";
      return (
        <Homepage
          backToHome={() => {
            this.setState(this.state.updateViewState("homepage"));
          }}
        />
      );
    }
  }
}