
import { useState } from "react";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  function submit(e) {
    e.preventDefault();

    if (onLogin(username, password)) {
      setError("");
    } else {
      setError("Incorrect username or password.");
    }
  }

  return (
    <div className="login-screen">
      <form className="login-card" onSubmit={submit}>
        <div className="brand-logo login-logo">L</div>
        <p className="eyebrow">COMMUNITY LIBRARY</p>
        <h1>Welcome back</h1>
        <p className="muted">Sign in to manage your library.</p>

        <label>Username</label>
        <input
          value={username}
          onChange={e => setUsername(e.target.value)}
          placeholder="Enter username"
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          placeholder="Enter password"
          required
        />

        {error && <p className="error-message">{error}</p>}

        <button className="primary-button full-width" type="submit">
          Sign In
        </button>

        <p className="demo-note">Demo login: admin / 1234</p>
      </form>
    </div>
  );
}