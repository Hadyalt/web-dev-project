import React from "react";
import { LoginState, initLoginState } from "./Login.state";
import { login } from "./Login.api";
import { Homepage } from "../Home/Homepage";

export class LoginForm extends React.Component<{}, LoginState> {
  constructor(props: {}) {
    super(props);
    this.state = { ...initLoginState, errorMessage: "" }; // Add errorMessage to state
  }

  handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;

    if (name in this.state) {
      this.setState({ [name]: value } as unknown as Pick<LoginState, keyof LoginState>);
    }
  };

  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const success = await login(this.state.username, this.state.password);
      if (success) {
        this.setState({  errorMessage: "" });
        alert("Login successful! Redirecting to homepage...");
        this.setState({ view: "homepage" });
      } 
      else {
        throw new Error("Invalid username or password");
      }
    } catch (error: any) {
      this.setState({ errorMessage: error.message || "An unknown error occurred" });
    }
  };

  render() {
    if(this.state.view === "login") {
        return (
        <div>
            <h1>Login and Events Form</h1>
            {/* Login Form */}
            <form onSubmit={this.handleSubmit}>
            <div>
                <label>Username:</label>
                <input
                type="text"
                name="username"
                value={this.state.username}
                onChange={this.handleChange}
                placeholder="USERNAME"
                />
            </div>
            <div>
                <label>Password:</label>
                <input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
                placeholder="PASSWORD"
                />
            </div>
            <button type="submit">Submit</button>
            
            </form>
            
            {/* Display Error Message */}
            {this.state.errorMessage && (
            <p style={{ color: "red" }}>{this.state.errorMessage}</p>
            )}
        </div>
        );
    }
    else {
        window.location.href = "/homepage"
        return (<Homepage
                  backToHome={() => {
                    this.setState(this.state.updateViewState("homepage"));
                  }} /> );
    }
  }
}
