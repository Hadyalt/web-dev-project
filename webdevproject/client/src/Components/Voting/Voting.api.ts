import axios from "axios";
import { DateOnly } from "../../Models/Date";
import { Vote } from "./Voting.state";

export const loadVoteEvents = (): Promise<Vote[]> => {
    return fetch("http://localhost:3001/api/v1/vote/options", {
        method: "GET",
        credentials: "include"
    }
    )
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok 2");
            }
            return response.json();
        })
        .then(data => data as Vote[]);
}

export const castVote = (VotingOptionId: number, UserId: number): Promise<void> => {
    return fetch(`http://localhost:3001/api/v1/vote/vote`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ VotingOptionId, UserId })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to cast vote");
        }
    });
};

export const createVote = (EventDetails: string, StartTime: string, EndTime: string, VoteCount: number): Promise<void> => {
    return fetch(`http://localhost:3001/api/v1/vote/options`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ EventDetails, StartTime, EndTime, VoteCount })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to submit review");
        }
    });
};

export const deleteVote = (voteId: string): Promise<void> => {
    return fetch(`http://localhost:3001/api/v1/vote/options/delete/${voteId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to delete Vote");
        }
      })
      .catch((error) => {
        throw new Error(error.message || "Unknown error occurred during deletion");
      });
  }

  export const updateVote = (
    id: number,
    EventDetails: string, 
    StartTime: string,
    EndTime: string, 
    VoteCount: number 
): Promise<Vote> => {
    return fetch(`http://localhost:3001/api/v1/vote/options/update/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        credentials: "include",
        body: JSON.stringify({ EventDetails, StartTime, EndTime, VoteCount})
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        return response.json();
    })
    .then(data => data as Vote);
};

export const getVoteById = async (voteId: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/v1/vote/options/${voteId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching vote:", error);
      throw error;
    }
  };