import React from "react";
import { DashboardState, initDashboardState } from "./dashboard.state.tsx";
import { loadEvent, getAttendance } from "./dashboard.api.ts";
import { deleteEvent } from "./dashboard.api.ts";
import { DashboardPostForm } from "../DashboardPost/DashboardPost.tsx";
import { DashboardPatch } from "../DashboardPatch/dashboardPatch.tsx";
import { Homepage } from "../Home/Homepage.tsx";
import { VotingPost } from "../Voting/VotingPost.tsx";
import { deleteVote, loadVoteEvents } from "../Voting/Voting.api.ts";
import { VotingPatch } from "../Voting/VotingPatch.tsx";

export class DashboardForm extends React.Component<{}, DashboardState> {
  constructor(props: {}) {
    super(props);
    this.state = initDashboardState;
  }

  handleReload: () => void = () => {
    this.setState({ loading: true, error: null });
    this.loadEvents();
    this.loadVoteEvents();
  };

  componentDidMount() {
    const username = sessionStorage.getItem("username");
    const userRole = sessionStorage.getItem("userRole");

    if (!username || !userRole) {
      alert("You are not logged in. Redirecting to login page...");
      window.location.href = "/login";
    } else {
      this.loadEvents();
      this.loadVoteEvents();
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

   loadVoteEvents = () => {
          loadVoteEvents()
              .then((voteEvents) => {
                  if (!voteEvents) {
                      this.setState({ voteEvents: [], loading: false });
                      return;
                  }
                  this.setState({ voteEvents: voteEvents, loading: false });
              })
      };

  handleDelete = (eventId: number) => {
    this.setState({ showModal: true, eventToDelete: eventId });
  };

  handleDeleteVote = (voteId: number) => {
    this.setState({ showModal2: true, voteToDelete: voteId });
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

  confirmDeleteVote = async () => {
    if (this.state.voteToDelete) {
      try {
        await deleteVote(this.state.voteToDelete.toString());
        this.setState({ showModal2: false, voteToDelete: null });
        this.loadVoteEvents();
      } catch (error) {
        console.error("Error deleting event:", error);
        this.setState({ showModal2: false, voteToDelete: null });
      }
    }
  };

  cancelDeleteVote = () => {
    this.setState({ showModal2: false, voteToDelete: null });
  };

  fetchAttendance = async (eventId: number) => {
    this.setState({ loadingAttendance: true });
    try {
      const data = await getAttendance(eventId); 
      this.setState({ attendance: data, loadingAttendance: false });
    } catch (error) {
      console.error("Error fetching attendance:", error);
      this.setState({ loadingAttendance: false });
    }
    this.handleAttendee();
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
      const { events, loading, error, attendance, voteEvents } = this.state;

      if (loading) {
        return <div style={styles.container}>Loading...</div>;
      }

      if (error) {
        return <div style={styles.container}>Error: {error}</div>;
      }

      return (
        
        <div
        
        style={{
          position: "relative", 
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h1 style={{ ...styles.heading, margin: 0 }}>Dashboard</h1>
        <button
          style={{
            ...styles.button,
            position: "absolute", 
            top: 2,              
            right: 2,            
            backgroundColor: "red",
            padding: "10px 15px",
            fontSize: "14px",
          }}
          onClick={this.handleLogout}
        >
          Logout
        </button>
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

          <h1 style={styles.heading}>Vote Dashboard</h1>
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
                                <button style={styles.button} onClick={() => this.setState({ view: "votePatch", selectedVoteId: vote.id })}>
                                  Edit
                                </button>
                                <button style={styles.button} onClick={() => this.handleDeleteVote(vote.id)}>
                                  Delete
                                </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    </table>

          <button style={styles.button} onClick={() => this.setState(this.state.updateViewState("dashboardPost"))}>Make Event</button>
          <button style={styles.button} onClick={() => this.setState(this.state.updateViewState("homepage"))}>Home</button>
          <button style={styles.button} onClick={() => this.setState(this.state.updateViewState("voting"))}>Make Vote</button>

          {this.state.showModal && (
            <div style={styles.overlay}>
              <div style={styles.modal}>
                <h2>Are you sure you want to delete this event?</h2>
                <button style={styles.button} onClick={this.confirmDelete}>Yes</button>
                <button style={styles.button} onClick={this.cancelDelete}>No</button>
              </div>
            </div>
          )}
          {this.state.showModal2 && (
            <div style={styles.overlay}>
              <div style={styles.modal}>
                <h2>Are you sure you want to delete this event?</h2>
                <button style={styles.button} onClick={this.confirmDeleteVote}>Yes</button>
                <button style={styles.button} onClick={this.cancelDeleteVote}>No</button>
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
                <button style={styles.button} onClick={() => this.setState({ showAttendee: false })}>Close</button>

                

                
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
    } else if (this.state.view == "votePatch") {
      window.location.href = `/voting/edit/${this.state.selectedVoteId}`;
      return (
        <VotingPatch
          backToHome={() => {
            this.setState(this.state.updateViewState("dashboard"));
            this.loadEvents();
          }}
        />
      );
    }else if (this.state.view == "homepage") {
      window.location.href = "/homepage";
      return (
        <Homepage
          backToHome={() => {
            this.setState(this.state.updateViewState("homepage"));
          }}
        />
      );
    } else if (this.state.view == "voting") {
      window.location.href = "/voting";
      return (
        <VotingPost
          backToHome={() => {
            this.setState(this.state.updateViewState("voting"));
            this.loadEvents();
          }}
        />
      );
    }
  }
}
