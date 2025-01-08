import React from "react";
import { DashboardPostState, initDashboardPostState } from "./dashboardPost.state.tsx";
import { postEvent } from "./dashboardPost.api.ts";
import { DateOnly } from "../../Models/Date.tsx";

interface DashboardPostFormProps {
  backToHome: () => void;
}

export class DashboardPostForm extends React.Component<DashboardPostFormProps, DashboardPostState> {
  constructor(props: DashboardPostFormProps) {
    super(props);
    this.state = { ...initDashboardPostState };
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name in this.state) {
      this.setState({ [name]: value } as unknown as Pick<DashboardPostState, keyof DashboardPostState>);
    }
  };

  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formattedDate = DateOnly.parse(this.state.Date).toString();
    await postEvent(
      this.state.title,
      this.state.description,
      formattedDate,
      this.state.startTime,
      this.state.endTime,
      this.state.location,
      this.state.adminApproval,
      this.state.event_Attendances,
      this.state.ReviewFeedback
    )
      .then(() => {
        window.location.href = "/dashboard";
      })
      .catch((error) => {
        console.error("Error posting event:", error);
      });
  };

  render() {
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
      heading: {
        textAlign: "center" as const,
        marginBottom: "20px",
      },
    };

    return (
      <div style={styles.container}>
        <h1 style={styles.heading}>Events Form</h1>
        <form onSubmit={this.handleSubmit}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Title:</label>
            <input
              type="text"
              name="title"
              value={this.state.title}
              onChange={this.handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Description:</label>
            <textarea
              name="description"
              value={this.state.description}
              onChange={this.handleChange}
              style={styles.textarea}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Event Date:</label>
            <input
              type="date"
              name="Date"
              value={this.state.Date}
              onChange={this.handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Start Time:</label>
            <input
              type="time"
              name="startTime"
              value={this.state.startTime}
              onChange={this.handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>End Time:</label>
            <input
              type="time"
              name="endTime"
              value={this.state.endTime}
              onChange={this.handleChange}
              style={styles.input}
            />
          </div>
          <div style={styles.formGroup}>
            <label style={styles.label}>Location:</label>
            <input
              type="text"
              name="location"
              value={this.state.location}
              onChange={this.handleChange}
              style={styles.input}
            />
          </div>
          <button type="submit" style={styles.button}>
            Submit
          </button>
          <button
            type="button"
            style={styles.button}
            onClick={() => {
              window.location.href = "/dashboard";
            }}
          >
            Back
          </button>
        </form>
      </div>
    );
  }
}
