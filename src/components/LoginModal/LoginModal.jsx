import { useEffect, useState } from "react";
import "../AuthModal/auth-modal.css";

export default function LoginModal({
  isOpen,
  onClose,
  onLogin,
  onOpenSignup,
  isSubmitting,
  errorText,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setPassword("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const isSubmitDisabled =
    isSubmitting || email.trim().length === 0 || password.trim().length === 0;

  return (
    <div className="auth-modal">
      <form
        className="auth-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!isSubmitDisabled) {
            onLogin({ email, password });
          }
        }}
        noValidate
      >
        <button
          className="auth-modal__close-btn"
          type="button"
          onClick={onClose}
        >
          ×
        </button>

        <h2 className="auth-form__title">Log in</h2>

        <label className="auth-form__field">
          <span className="auth-form__label">Email</span>
          <input
            className="auth-form__input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </label>

        <label className="auth-form__field">
          <span className="auth-form__label">Password</span>
          <input
            className="auth-form__input"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </label>

        {errorText && <p className="auth-form__error">{errorText}</p>}

        <div className="auth-form__actions">
          <button
            className="auth-form__submit"
            type="submit"
            disabled={isSubmitDisabled}
            aria-disabled={isSubmitDisabled}
          >
            Log in
          </button>
          <button
            type="button"
            className="auth-form__link"
            onClick={onOpenSignup}
          >
            or Sign up
          </button>
        </div>
      </form>
    </div>
  );
}
