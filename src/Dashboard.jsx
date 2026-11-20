import { useCallback, useEffect, useState } from "react";
import { invitation } from "./invitation.js";
import { supabase } from "./supabase.js";

const PAGE_SIZE = 500;

async function fetchAllRsvps() {
  const rsvps = [];

  for (let from = 0; ; from += PAGE_SIZE) {
    const { data, error } = await supabase
      .from("rsvps")
      .select("id, name, attending, created_at")
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .range(from, from + PAGE_SIZE - 1);

    if (error) throw error;
    rsvps.push(...data);
    if (data.length < PAGE_SIZE) return rsvps;
  }
}

function formatDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function Dashboard() {
  const [rsvps, setRsvps] = useState([]);
  const [status, setStatus] = useState("loading");
  const [errorMessage, setErrorMessage] = useState("");

  const loadRsvps = useCallback(async () => {
    if (!supabase) {
      setErrorMessage("Connect your Supabase project to load the guest list.");
      setStatus("error");
      return;
    }

    setStatus("loading");
    setErrorMessage("");

    try {
      setRsvps(await fetchAllRsvps());
      setStatus("ready");
    } catch (error) {
      setErrorMessage(error.message || "The guest list could not be loaded.");
      setStatus("error");
    }
  }, []);

  useEffect(() => {
    document.title = `Guest dashboard | ${invitation.nickname}'s birthday`;
    loadRsvps();
  }, [loadRsvps]);

  const attendingCount = rsvps.filter((rsvp) => rsvp.attending).length;
  const unableToAttendCount = rsvps.length - attendingCount;

  return (
    <main className="dashboard-page">
      <header className="topbar dashboard-topbar">
        <a className="brand" href="/" aria-label={`${invitation.nickname}'s birthday invitation`}>
          <span className="brand-mark" aria-hidden="true">✳</span>
          <span>{invitation.nickname}'s Big day</span>
        </a>
        <a className="topbar-link" href="/">Back to invitation <span aria-hidden="true">↗</span></a>
      </header>

      <section className="dashboard-content" aria-labelledby="dashboard-title">
        <div className="dashboard-heading">
          <p className="eyebrow"><span aria-hidden="true">✷</span> The guest list</p>
          <h1 id="dashboard-title">RSVP dashboard</h1>
          <p>See who's joining {invitation.nickname} for her big day.</p>
        </div>

        <div className="dashboard-stats" aria-label="RSVP totals">
          <article className="dashboard-stat">
            <span className="stat-icon" aria-hidden="true">♡</span>
            <p>Total responses</p>
            <strong>{status === "ready" ? rsvps.length : "—"}</strong>
          </article>
          <article className="dashboard-stat">
            <span className="stat-icon" aria-hidden="true">🎉</span>
            <p>Will attend</p>
            <strong>{status === "ready" ? attendingCount : "—"}</strong>
          </article>
          <article className="dashboard-stat">
            <span className="stat-icon" aria-hidden="true">💌</span>
            <p>Can't make it</p>
            <strong>{status === "ready" ? unableToAttendCount : "—"}</strong>
          </article>
        </div>

        <section className="guest-list" aria-labelledby="guest-list-title">
          <div className="guest-list-heading">
            <div>
              <h2 id="guest-list-title">All responses</h2>
              <p>Every guest who has filled out the RSVP form.</p>
            </div>
            <button className="refresh-button" type="button" onClick={loadRsvps} disabled={status === "loading"}>
              {status === "loading" ? "Loading…" : "Refresh"}
            </button>
          </div>

          {status === "error" && (
            <div className="dashboard-message dashboard-error" role="alert">
              <p>{errorMessage}</p>
              {supabase && <button className="text-button" type="button" onClick={loadRsvps}>Try again</button>}
            </div>
          )}
          {status === "loading" && <p className="dashboard-message" role="status">Loading the guest list…</p>}
          {status === "ready" && rsvps.length === 0 && (
            <p className="dashboard-message">No RSVPs yet. Responses will show up here.</p>
          )}
          {status === "ready" && rsvps.length > 0 && (
            <div className="guest-table-wrap">
              <table className="guest-table">
                <thead>
                  <tr>
                    <th scope="col">Guest</th>
                    <th scope="col">Response</th>
                    <th scope="col">Submitted</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvps.map((rsvp) => (
                    <tr key={rsvp.id}>
                      <td className="guest-name">{rsvp.name}</td>
                      <td>
                        <span className={`attendance-badge${rsvp.attending ? " is-attending" : " is-declined"}`}>
                          <span aria-hidden="true">{rsvp.attending ? "✓" : "–"}</span>
                          {rsvp.attending ? "Attending" : "Not attending"}
                        </span>
                      </td>
                      <td className="guest-date">{formatDate(rsvp.created_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </section>

      <footer className="footer">
        <span>Made with <span aria-label="love">♥</span> for {invitation.name}</span>
        <a href="/">Back to invitation ↑</a>
      </footer>
    </main>
  );
}

export default Dashboard;
