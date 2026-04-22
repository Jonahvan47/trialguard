import { useState } from "react";
import { supabase } from "./supabaseClient";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div style={{ maxWidth: 400, margin: "100px auto", padding: 24 }}>
      <h2>{isLogin ? "Sign In" : "Create Account"}</h2>
      <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: 12, padding: 8 }} />
      <input placeholder="Password" type="password" value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ display: "block", width: "100%", marginBottom: 12, padding: 8 }} />
      {error && <p style={{ color: "red" }}>{error}</p>}
      <button onClick={handleSubmit} disabled={loading}
        style={{ width: "100%", padding: 10, marginBottom: 12 }}>
        {loading ? "Loading..." : isLogin ? "Sign In" : "Sign Up"}
      </button>
      <p style={{ textAlign: "center", cursor: "pointer", color: "blue" }}
        onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Need an account? Sign up" : "Already have an account? Sign in"}
      </p>
    </div>
  );
}