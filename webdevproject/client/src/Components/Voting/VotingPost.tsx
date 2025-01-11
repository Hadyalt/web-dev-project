import React from "react";
import { VotingPostState, initVotingPostState } from "./Voting.state";
import { DateOnly } from "../../Models/Date";
import { createVote } from "./Voting.api";

interface VotingPostProps {
    backToHome: () => void;
}

export class VotingPost extends React.Component<VotingPostProps, VotingPostState> {
    constructor(props: VotingPostProps) {
        super(props);
        this.state = initVotingPostState;
    }

    handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
    
        if (name in this.state) {
          this.setState({ [name]: value } as unknown as Pick<VotingPostState, keyof VotingPostState>);
        }
      };
    
      handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { StartDate, StartTime } = this.state;
        const combinedStartDateTime = `${StartDate}T${StartTime}`;
        const { EndDate, EndTime } = this.state;
        const combinedEndDateTime = `${EndDate}T${EndTime}`;
        const formattedStartDate = combinedStartDateTime;
        const formattedEndDate = combinedEndDateTime;
        await createVote(
          this.state.EventDetails,
          formattedStartDate, 
          formattedEndDate, 
          0
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
              <h1 style={styles.heading}>Votes Form</h1>
              <form onSubmit={this.handleSubmit}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Event Details:</label>
                  <input
                    type="text"
                    name="EventDetails"
                    value={this.state.EventDetails}
                    onChange={this.handleChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                <label style={styles.label}>Start date:</label>
                <input
                  type="date"
                  name="StartDate"
                  value={this.state.StartDate}
                  onChange={this.handleChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Start time:</label>
                <input
                  type="time"
                  name="StartTime"
                  value={this.state.StartTime}
                  onChange={this.handleChange}
                  style={styles.input}
                />
              </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>End date:</label>
                  <input
                    type="date"
                    name="EndDate"
                    value={this.state.EndDate}
                    onChange={this.handleChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                <label style={styles.label}>End time:</label>
                <input
                  type="time"
                  name="EndTime"
                  value={this.state.EndTime}
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