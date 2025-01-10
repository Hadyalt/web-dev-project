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