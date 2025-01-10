import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { updateVote, getVoteById } from './Voting.api.ts';
import { DateOnly } from '../../Models/Date.tsx';

interface VotePatch {
    backToHome: () => void;
}

export const DashboardPatch: React.FC<VotePatch> = ({ backToHome }) => {
    const { voteId } = useParams<{ voteId: string }>(); // Use useParams to get the voteId
    const [vote, setVote] = useState({
        EventDetails: '',
        StartDate: '',
        StartTime: '',
        EndDate: '',
        EndTime: '',
        voteCount: 0,
    });

    useEffect(() => {
        if (voteId) {
            // Fetch vote details by ID
            getVoteById(parseInt(voteId)).then(setVote);
        }
    }, [voteId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setVote(prevEvent => ({ ...prevEvent, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!voteId) return;
        const { StartDate, StartTime } = vote;
        const combinedStartDateTime = `${StartDate}T${StartTime}`;
        const { EndDate, EndTime } = vote;
        const combinedEndDateTime = `${EndDate}T${EndTime}`;
        const formattedStartDate = combinedStartDateTime;
        const formattedEndDate = combinedEndDateTime;

        const formattedDate = DateOnly.parse(vote.StartTime).toString();
        try {
            await updateVote(
                parseInt(voteId),
                vote.EventDetails,
                formattedStartDate,
                formattedEndDate,
                vote.voteCount
                 
            );
            window.location.href = `/dashboard`
            backToHome();
        } catch (error) {
            console.error("Error updating vote:", error);
        }
    };

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
              <form onSubmit={handleSubmit}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Event Details:</label>
                  <input
                    type="text"
                    name="EventDetails"
                    value={vote.EventDetails}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                <label style={styles.label}>Start date:</label>
                <input
                  type="date"
                  name="StartDate"
                  value={vote.StartDate}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Start time:</label>
                <input
                  type="time"
                  name="StartTime"
                  value={vote.StartTime}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>End date:</label>
                  <input
                    type="date"
                    name="EndDate"
                    value={vote.EndDate}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                <label style={styles.label}>End time:</label>
                <input
                  type="time"
                  name="EndTime"
                  value={vote.EndTime}
                  onChange={handleChange}
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
};
