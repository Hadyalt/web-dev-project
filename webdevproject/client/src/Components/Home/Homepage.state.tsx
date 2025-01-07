import { DateOnly, TimeSpan } from "../../Models/Date";
import { ViewState } from "../Dashboard/dashboard.state";

export type Review = {
    userId: number;
    rating: number;
    feedback: string;
};

export type Event = {
    eventId: number;
    title: string;
    description: string;
    eventDate: DateOnly;
    startTime: TimeSpan;
    endTime: TimeSpan;
    location: string;
    adminApproval: boolean;
    reviews: Review[];
    averageRating: number;
};

export interface HomepageState {
    selectedEventId: number;
    isAdmin: boolean;
    events: Event[];
    loading: boolean;
    error: string | null;
    view: ViewState;
    showModal: boolean;
    review: Review;
    updateViewState: (view: ViewState) => (state: HomepageState) => HomepageState;
}

export const initHomepageState: HomepageState = {
    selectedEventId: 1,
    events: [],
    isAdmin: true,
    loading: true,
    error: "",
    view: "homepage",
    showModal: false,
    review: {
        userId: 0,
        rating: 0, 
        feedback: ""
    },
    updateViewState: (view: ViewState) => (state: HomepageState): HomepageState => {
        return {
            ...state,
            view: view
        };
    }
};