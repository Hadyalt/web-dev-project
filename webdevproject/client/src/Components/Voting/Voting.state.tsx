import { DateOnly } from "../../Models/Date"
import { ViewState } from "../Dashboard/dashboard.state"

export interface VotingPostState {
    EventDetails: string,
    StartDate: string
    StartTime: string,
    EndDate: string
    EndTime: string,
    view: ViewState
    updateViewState: (view: ViewState) => (state: VotingPostState) => VotingPostState
}

export const initVotingPostState: VotingPostState = {
    EventDetails: "",
    StartDate: "",
    StartTime: "",
    EndDate: "",
    EndTime: "",
    view: "voting",
    updateViewState: (view: ViewState) => (state: VotingPostState): VotingPostState => {
        return {
            ...state,
            view: view
        }
    }
}

export type Vote = {
    id: number;
    eventDetails: number;
    startTime: Date;
    endTime: Date;
    voteCount: number;
}