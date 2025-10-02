import { useEffect, useState } from "react";
import "../AuthModal/auth-modal.css";

export default function RegisterModal({
  isOpen,
  onClose,
  onRegister,
  onOpenLogin,
  isSubmitting,
  errorText,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [avatar, setAvatar] = useState("");

  // ✅ compute if the form is ready (all fields non-empty)
  const canSubmit =
    email.trim() && password.trim() && name.trim() && avatar.trim();

  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setPassword("");
      setName("");
      setAvatar("");
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="auth-modal">
      <form
        className="auth-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!canSubmit) return; // guard just in case
          onRegister({ name, avatar, email, password });
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

        <h2 className="auth-form__title">Sign up</h2>

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

        <label className="auth-form__field">
          <span className="auth-form__label">Name</span>
          <input
            className="auth-form__input"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            required
          />
        </label>

        <label className="auth-form__field">
          <span className="auth-form__label">Avatar URL</span>
          <input
            className="auth-form__input"
            type="url"
            value={avatar}
            onChange={(e) => setAvatar(e.target.value)}
            placeholder="Avatar URL"
            required
          />
        </label>

        {errorText && <p className="auth-form__error">{errorText}</p>}

        <div className="auth-form__actions">
          <button
            className="auth-form__submit"
            type="submit"
            disabled={isSubmitting || !canSubmit}
            aria-disabled={isSubmitting || !canSubmit}
          >
            Sign up
          </button>
          <button
            type="button"
            className="auth-form__link"
            onClick={onOpenLogin}
          >
            or Log in
          </button>
        </div>
      </form>
    </div>
  );
}
