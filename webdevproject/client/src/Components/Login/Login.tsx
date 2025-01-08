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
        this.setState({ errorMessage: "" });
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
    const styles = {
      container: {
        fontFamily: "Arial, sans-serif",
        padding: "20px",
        backgroundColor: "#f9f9f9",
        borderRadius: "8px",
        maxWidth: "400px",
        margin: "auto",
        marginTop: "50px",
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
      button: {
        width: "100%",
        padding: "10px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      },
      errorMessage: {
        color: "red",
        fontSize: "14px",
        marginTop: "10px",
      },
      heading: {
        textAlign: "center" as const,
        marginBottom: "20px",
      },
    };

    if (this.state.view === "login") {
      return (
        <div style={styles.container}>
          <h1 style={styles.heading}>Login and Events Form</h1>
          {/* Login Form */}
          <form onSubmit={this.handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Username:</label>
              <input
                type="text"
                name="username"
                value={this.state.username}
                onChange={this.handleChange}
                placeholder="USERNAME"
                style={styles.input}
              />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Password:</label>
              <input
                type="password"
                name="password"
                value={this.state.password}
                onChange={this.handleChange}
                placeholder="PASSWORD"
                style={styles.input}
              />
            </div>
            <button type="submit" style={styles.button}>Submit</button>
          </form>

          {/* Display Error Message */}
          {this.state.errorMessage && (
            <p style={styles.errorMessage}>{this.state.errorMessage}</p>
          )}
        </div>
      );
    } else {
      window.location.href = "/homepage";
      return (
        <Homepage
          backToHome={() => {
            this.setState(this.state.updateViewState("homepage"));
          }}
        />
      );
    }
  }
}
