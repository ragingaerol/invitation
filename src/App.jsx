import { useEffect, useRef, useState } from "react";
import { invitation } from "./invitation.js";
import { supabase } from "./supabase.js";

function App() {
  const [photo, setPhoto] = useState(() => {
    const photoVersion = "2026-11-20-xienna";
    if (window.localStorage.getItem("birthday-photo-version") !== photoVersion) {
      window.localStorage.removeItem("birthday-photo");
      window.localStorage.setItem("birthday-photo-version", photoVersion);
      return invitation.photo;
    }
    return window.localStorage.getItem("birthday-photo") || invitation.photo;
  });
  const [name, setName] = useState("");
  const [attending, setAttending] = useState("");
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const photoInput = useRef(null);

  useEffect(() => {
    if (!wishlistOpen) return undefined;

    function closeOnEscape(event) {
      if (event.key === "Escape") setWishlistOpen(false);
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [wishlistOpen]);

  function choosePhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setMessage("Please choose an image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const image = reader.result;
      try {
        window.localStorage.setItem("birthday-photo", image);
        window.localStorage.setItem("birthday-photo-version", "2026-11-20-xienna");
        setPhoto(image);
        setMessage("");
      } catch {
        setMessage("This photo is too large to save in this browser. Try a smaller image.");
      }
    };
    reader.onerror = () => setMessage("We couldn't read that photo. Please try another.");
    reader.readAsDataURL(file);
  }

  async function submitRsvp(event) {
    event.preventDefault();
    setStatus("sending");
    setMessage("");

    try {
      if (!supabase) {
        throw new Error("The RSVP service isn't configured yet. Please contact the organizer.");
      }

      const { error } = await supabase.from("rsvps").insert({
        name: name.trim(),
        attending: attending === "yes",
      });

      if (error) throw error;

      setStatus("sent");
      setMessage(
        attending === "yes"
          ? "Wonderful! We can't wait to celebrate with you."
          : "Thanks for letting us know. We'll miss you!",
      );
      setName("");
      setAttending("");
    } catch (error) {
      setStatus("error");
      setMessage(
        error.message || "Your RSVP could not be saved. Please try again in a moment.",
      );
    }
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#home" aria-label={`${invitation.nickname}'s birthday invitation`}>
          <span className="brand-mark" aria-hidden="true">✳</span>
          <span>{invitation.nickname}'s Big day</span>
        </a>
        <nav className="topbar-nav" aria-label="Main navigation">
          <a className="topbar-link" href="#rsvp">RSVP <span aria-hidden="true">↗</span></a>
          <a className="topbar-link" href="/dashboard">Guest dashboard <span aria-hidden="true">↗</span></a>
        </nav>
      </header>

      <section className="hero" id="home">
        <div className="balloon-cluster">
          <button className="balloon balloon-one" type="button" aria-label="Pink balloon one" />
          <button className="balloon balloon-two" type="button" aria-label="Pink balloon two" />
          <button className="balloon balloon-three" type="button" aria-label="Pink balloon three" />
          <button className="balloon balloon-four" type="button" aria-label="Pink balloon four" />
          <button className="balloon balloon-five" type="button" aria-label="Pink balloon five" />
          <button className="balloon balloon-six" type="button" aria-label="Pink balloon six" />
          <button className="balloon balloon-seven" type="button" aria-label="Pink balloon seven" />
          <button className="balloon balloon-eight" type="button" aria-label="Pink balloon eight" />
          <button className="balloon balloon-nine" type="button" aria-label="Pink balloon nine" />
          <button className="balloon balloon-ten" type="button" aria-label="Pink balloon ten" />
        </div>
        <div className="hero-copy">
          <p className="eyebrow"><span aria-hidden="true">✷</span> You are cordially invited</p>
          <h1>{invitation.nickname}'s<br /><span className="headline-name">berry first</span><br />Birthday</h1>
          <p className="intro">{invitation.note}</p>
          <a className="button button-primary" href="#rsvp">Save your spot <span aria-hidden="true">↓</span></a>
          <div className="hero-date"><span aria-hidden="true">✳</span> {invitation.date}</div>
        </div>

        <div className={`photo-wrap${photo ? " has-photo" : ""}`}>
          <span className="sunburst sunburst-one" aria-hidden="true">✳</span>
          <span className="sunburst sunburst-two" aria-hidden="true">✷</span>
          <div className="photo-frame">
            {photo ? (
              <img className="birthday-photo" src={photo} alt={`${invitation.name} celebrating her birthday`} />
            ) : (
              <div className="photo-placeholder">
                <span className="photo-sparkle" aria-hidden="true">✦</span>
                <span className="photo-initial">{invitation.name.charAt(0)}</span>
                <span className="photo-hint">Add her photo</span>
              </div>
            )}
            <button
              className="photo-edit"
              type="button"
              onClick={() => photoInput.current?.click()}
              aria-label={photo ? "Change birthday photo" : "Add birthday photo"}
            >
              <span aria-hidden="true">＋</span>
            </button>
            <input
              ref={photoInput}
              className="visually-hidden"
              type="file"
              accept="image/*"
              onChange={choosePhoto}
              aria-label="Choose a photo"
            />
          </div>
          <span className="berry-sticker" aria-hidden="true">🍓</span>
          <div className="photo-caption"><span aria-hidden="true">♡</span> The birthday girl</div>
        </div>
        <span className="hero-doodle" aria-hidden="true">✳</span>
      </section>

      <section className="details" aria-labelledby="details-title">
        <div className="section-heading">
          <p className="eyebrow"><span aria-hidden="true">✷</span> The when & where</p>
          <h2 id="details-title">The party details</h2>
        </div>
        <div className="detail-grid">
          <article className="detail-card detail-date">
            <span className="detail-berry" aria-hidden="true">🍓</span>
            <span className="detail-icon" aria-hidden="true">◷</span>
            <p className="detail-label">Mark your calendar</p>
            <h3>{invitation.date}</h3>
            <p>{invitation.time}</p>
          </article>
          <article className="detail-card detail-place">
            <span className="detail-berry" aria-hidden="true">🍓</span>
            <span className="detail-icon" aria-hidden="true">⌖</span>
            <p className="detail-label">Come find us</p>
            <h3>{invitation.venue}</h3>
            <p>{invitation.address}</p>
          </article>
          <article className="detail-card detail-note">
            <span className="detail-berry" aria-hidden="true">🍓</span>
            <span className="detail-icon" aria-hidden="true">♡</span>
            <p className="detail-label">A little note</p>
            <h3>Your presence is the greatest gift.</h3>
            <p>
              If you would like to give a gift, you can find our wish list{" "}
              <button className="wishlist-link" type="button" onClick={() => setWishlistOpen(true)}>
                here
              </button>
              .
            </p>
          </article>
          <article className="detail-card detail-dress-code">
            <span className="detail-berry" aria-hidden="true">🍓</span>
            <span className="detail-icon" aria-hidden="true">♛</span>
            <p className="detail-label">Dress code</p>
            <h3>We'd love our guests to wear colors inspired by our palette:</h3>
            <div className="dress-code-colors" aria-label="Dress code colors">
              <div className="dress-code-color">
                <span className="color-swatch white" aria-hidden="true"></span>
                <span>White</span>
              </div>
              <div className="dress-code-color">
                <span className="color-swatch baby-pink" aria-hidden="true"></span>
                <span>Baby Pink</span>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="rsvp" id="rsvp" aria-labelledby="rsvp-title">
        <div className="rsvp-heading">
          <p className="eyebrow"><span aria-hidden="true">✷</span> We'd love to know</p>
          <h2 id="rsvp-title">Can you make it?</h2>
          <p>Let us know who's coming so we can save you some cake.</p>
        </div>
        <form className="rsvp-form" onSubmit={submitRsvp}>
          <label className="field-label" htmlFor="guest-name">Your name</label>
          <input
            id="guest-name"
            className="name-input"
            type="text"
            autoComplete="name"
            maxLength={100}
            placeholder="Type your name here"
            value={name}
            onChange={(event) => setName(event.target.value)}
            required
          />
          <fieldset className="attendance-fieldset">
            <legend className="field-label">Will you be joining us?</legend>
            <div className="attendance-options">
              <label className={`attendance-option${attending === "yes" ? " selected" : ""}`}>
                <input
                  type="radio"
                  name="attending"
                  value="yes"
                  checked={attending === "yes"}
                  onChange={(event) => setAttending(event.target.value)}
                  required
                />
                <span aria-hidden="true">🎉</span> Yes, count me in!
              </label>
              <label className={`attendance-option${attending === "no" ? " selected" : ""}`}>
                <input
                  type="radio"
                  name="attending"
                  value="no"
                  checked={attending === "no"}
                  onChange={(event) => setAttending(event.target.value)}
                />
                <span aria-hidden="true">💌</span> Sorry, can't make it
              </label>
            </div>
          </fieldset>
          <button className="button button-submit" type="submit" disabled={status === "sending"}>
            {status === "sending" ? "Sending…" : "Send my RSVP"} <span aria-hidden="true">↗</span>
          </button>
          <p className={`form-message${status === "error" ? " form-error" : ""}`} role="status" aria-live="polite">
            {message}
          </p>
        </form>
        <span className="rsvp-sparkle" aria-hidden="true">✳</span>
      </section>

      <footer className="footer">
        <span>Made with <span aria-label="love">♥</span> for {invitation.name}</span>
        <a href="#home">Back to top ↑</a>
      </footer>

      {wishlistOpen && (
        <div
          className="wishlist-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setWishlistOpen(false);
          }}
        >
          <section
            className="wishlist-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="wishlist-title"
          >
            <button
              className="wishlist-close"
              type="button"
              aria-label="Close wish list"
              onClick={() => setWishlistOpen(false)}
            >
              ×
            </button>
            <p className="eyebrow"><span aria-hidden="true">✷</span> Xienna's wish list</p>
            <h2 id="wishlist-title">A few thoughtful gifts</h2>
            <ul className="wishlist-list">
              <li><span aria-hidden="true">🍓</span> Baby Essentials</li>
              <li><span aria-hidden="true">🍓</span> EQ diaper pants XL</li>
              <li><span aria-hidden="true">🍓</span> EQ Wipes</li>
              <li><span aria-hidden="true">🍓</span> Neutral clothes for 1-2 years old</li>
              <li><span aria-hidden="true">🍓</span> Educational toys</li>
              <li><span aria-hidden="true">🍓</span> Monetary gift for Xienna's savings</li>
            </ul>
          </section>
        </div>
      )}
    </main>
  );
}

export default App;
