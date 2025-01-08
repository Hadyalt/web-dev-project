import { ViewState } from "../Dashboard/dashboard.state"

export interface VotingState {
    view: ViewState
    updateViewState: (view: ViewState) => (state: VotingState) => VotingState
}

export const initLoginState: VotingState = {
    view: "voting",
    updateViewState: (view: ViewState) => (state: VotingState): VotingState => {
        return {
            ...state,
            view: view
        }
    }
}