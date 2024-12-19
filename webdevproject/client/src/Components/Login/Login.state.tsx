export type ViewState = "login" | "dashboard"

export interface LoginState {
    username: string
    password: string
    errorMessage?: string
    view: ViewState
    updateViewState: (view: ViewState) => (state: LoginState) => LoginState
}

export const initLoginState: LoginState = {
    username: "",
    password: "",
    errorMessage: "",
    view: "login",
    updateViewState: (view: ViewState) => (state: LoginState): LoginState => {
        return {
            ...state,
            view: view
        }
    }
}