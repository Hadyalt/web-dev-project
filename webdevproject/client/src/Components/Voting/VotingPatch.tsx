import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { updateVote, getVoteById } from './Voting.api.ts';

interface VotePatch {
    backToHome: () => void;
}

export const VotingPatch: React.FC<VotePatch> = ({ backToHome }) => {
    const { voteId } = useParams<{ voteId: string }>(); 
    const [vote, setVote] = useState({
        eventDetails: '',
        startDate: '',
        startTime: '',
        endDate: '',
        endTime: '',
        voteCount: 0,
    });

      
      useEffect(() => {
        const fetchVoteData = async () => {
            if (voteId) {
                try {
                    const voteData = await getVoteById(parseInt(voteId)); 
                    const formattedVote = {
                      eventDetails: voteData.eventDetails || '',
                      startDate: voteData.startTime.toString().split('T')[0] || '',
                      startTime: voteData.startTime.toString().split('T')[1] || '',
                      endDate: voteData.endTime.toString().split('T')[0] || '',
                      endTime: voteData.endTime.toString().split('T')[1] || '',
                      voteCount: voteData.voteCount || 0,
                  };
                  console.log(formattedVote);

                  setVote(formattedVote);
                    
                    setVote(voteData); 
                } catch (error) {
                    console.error('Error fetching vote data:', error);
                }
            }
        };

        fetchVoteData(); 
    }, [voteId]); 

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        const startDate = vote.startTime.toString().split('T')[0]; 
        const combinedStartDateTime = `${startDate}T${value}`;
        if (name === "startTime") {
            setVote(prevEvent => ({ ...prevEvent, [name]: combinedStartDateTime }));
            return;
        }
        setVote(prevEvent => ({ ...prevEvent, [name]: value }));
    };

    const handleChange2 = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      const endDate = vote.endTime.toString().split('T')[0];
      const combinedEndDateTime = `${endDate}T${value}`;
      setVote(prevEvent => ({ ...prevEvent, [name]: combinedEndDateTime}));
  };

  const handleChange3 = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const startTime = vote.startTime.toString().split('T')[1];
    const combinedEndDateTime = `${value}T${startTime}`;
    setVote(prevEvent => ({ ...prevEvent, [name]: combinedEndDateTime}));
};

const handleChange4 = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
  const { name, value } = e.target;
  const startTime = vote.endTime.toString().split('T')[1];
  const combinedEndDateTime = `${value}T${startTime}`;
  setVote(prevEvent => ({ ...prevEvent, [name]: combinedEndDateTime}));
};

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!voteId) return;
        try {
            await updateVote(
                parseInt(voteId),
                vote.eventDetails,
                vote.startTime,
                vote.endTime,
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
                    name="eventDetails"
                    value={vote.eventDetails}
                    onChange={handleChange}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                <label style={styles.label}>Start date:</label>
                <input
                  type="date"
                  name="startTime"
                  value={vote.startTime.toString().split('T')[0]}
                  onChange={handleChange3}
                  style={styles.input}
                />
              </div>
              <div style={styles.formGroup}>
                <label style={styles.label}>Start time:</label>
                <input
                  type="time"
                  name="startTime"
                  value={vote.startTime.toString().split('T')[1]}
                  onChange={handleChange}
                  style={styles.input}
                />
              </div>
                <div style={styles.formGroup}>
                  <label style={styles.label}>End date:</label>
                  <input
                    type="date"
                    name="endTime"
                    value={vote.endTime.toString().split('T')[0]}
                    onChange={handleChange4}
                    style={styles.input}
                  />
                </div>
                <div style={styles.formGroup}>
                <label style={styles.label}>End time:</label>
                <input
                  type="time"
                  name="endTime"
                  value={vote.endTime.toString().split('T')[1]}
                  onChange={handleChange2}
                  style={styles.input}
                />
              </div>                 
              <button type="submit" style={styles.button} onClick={() => {
                    window.location.href = "/dashboard";
                  }}> 
                    Save
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
