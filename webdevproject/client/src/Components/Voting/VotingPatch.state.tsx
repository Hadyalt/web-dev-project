import { ViewState } from "../Dashboard/dashboard.state"

export interface votePatchState {
    EventDetails: string,
    StartDate: string
    StartTime: string,
    EndDate: string
    EndTime: string,
    view: ViewState
    updateViewState: (view: ViewState) => (state: votePatchState) => votePatchState
}

export const initVotePatchState: votePatchState = {
    EventDetails: "",
    StartDate: "",
    StartTime: "",
    EndDate: "",
    EndTime: "",
    view: "votePatch",
    updateViewState: (view: ViewState) => (state: votePatchState): votePatchState => {
        return {
            ...state,
            view: view
        }
    }
}