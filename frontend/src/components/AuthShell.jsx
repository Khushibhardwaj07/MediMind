// The frame for login and signup: calm picture on the left, form on the right.
// (On a phone the picture becomes a banner on top.)
import CalmScene from './CalmScene.jsx';

export default function AuthShell({ children }) {
  return (
    <div className="auth-split">
      <aside className="auth-visual">
        <CalmScene />
        <div className="auth-visual-text">
          <span className="brand">MediMind</span>
          <p className="auth-tagline">Your health, explained calmly.</p>
          <p className="auth-visual-sub">
            Understand your medical reports in simple words, and never forget a medicine or an
            appointment again.
          </p>
        </div>
      </aside>

      <main className="auth-panel">
        <div className="auth-box">{children}</div>
      </main>
    </div>
  );
}