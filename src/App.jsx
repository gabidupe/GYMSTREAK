import { useState, useEffect, useCallback, useRef } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Outfit:wght@300;400;500;600;700&display=swap');`;

// ─── STREAK RESCUE MODAL ─────────────────────────────────────────────────────
function StreakRescueModal({ lostStreak, onRescue, onDismiss }) {
  const [paying, setPaying] = useState(false);
  const [paid, setPaid] = useState(false);
  const [expired, setExpired] = useState(false);

  const [seconds, setSeconds] = useState(300);
  useEffect(() => {
    const t = setInterval(() => setSeconds((s) => {
      if (s <= 1) { clearInterval(t); setExpired(true); return 0; }
      return s - 1;
    }), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const handlePay = () => {
    setPaying(true);
    // Simulate payment processing (in real app: Google Play Billing API)
    setTimeout(() => {
      setPaying(false);
      setPaid(true);
      setTimeout(onRescue, 1800);
    }, 2000);
  };

  return (
    <div style={rsStyles.overlay}>
      <div style={rsStyles.modal}>
        {/* Dramatic broken streak visual */}
        {!paid && !expired ? (
          <>
            <div style={rsStyles.brokenRing}>
              <div style={rsStyles.crack} />
              <div style={rsStyles.crackNumber}>{lostStreak}</div>
              <div style={rsStyles.crackLabel}>días perdidos</div>
            </div>

            <div style={rsStyles.title}>¡Tu racha está en peligro!</div>
            <div style={rsStyles.subtitle}>
              Llevas <span style={{ color: "#FF6B35", fontWeight: 700 }}>{lostStreak} días</span> de racha construida.{"\n"}
              No lo pierdas todo ahora.
            </div>

            {/* Urgency timer */}
            <div style={rsStyles.timerBox}>
              <div style={rsStyles.timerLabel}>OFERTA EXPIRA EN</div>
              <div style={rsStyles.timer}>{mm}:{ss}</div>
            </div>

            {/* Value prop */}
            <div style={rsStyles.valueBox}>
              <div style={rsStyles.valueRow}><span>✓</span><span>Recupera tu racha de {lostStreak} días</span></div>
              <div style={rsStyles.valueRow}><span>✓</span><span>Protege tus insignias ganadas</span></div>
              <div style={rsStyles.valueRow}><span>✓</span><span>Un rescate de emergencia</span></div>
            </div>

            {/* CTA */}
            <button
              onClick={handlePay}
              disabled={paying}
              style={rsStyles.rescueBtn}
            >
              {paying ? (
                <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={rsStyles.spinner} />
                  Procesando...
                </span>
              ) : (
                <>
                  <span style={{ fontSize: 20 }}>⚡</span>
                  <span>Rescatar racha — $0.99</span>
                </>
              )}
            </button>

            <button onClick={onDismiss} style={rsStyles.dismissBtn}>
              No, prefiero perder mis {lostStreak} días
            </button>
          </>
        ) : paid ? (
          // Success state
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 72, marginBottom: 16, animation: "pop .4s ease" }}>🔥</div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 42, color: "#FF6B35", letterSpacing: 3 }}>
              ¡RACHA SALVADA!
            </div>
            <div style={{ color: "#888", fontSize: 14, marginTop: 8 }}>
              Tus {lostStreak} días están de vuelta. ¡No vuelvas a fallar!
            </div>
          </div>
        ) : (
          // Expired state
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>💀</div>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: 36, color: "#555", letterSpacing: 3, marginBottom: 10 }}>
              OFERTA EXPIRADA
            </div>
            <div style={{ color: "#555", fontSize: 13, lineHeight: 1.6, marginBottom: 24 }}>
              Tu racha de {lostStreak} días se perdió.<br/>
              Pero cada leyenda tuvo un día cero.<br/>
              <span style={{ color: "#FF6B35" }}>Empieza hoy.</span>
            </div>
            <button onClick={onDismiss} style={{ ...rsStyles.rescueBtn, background: "#1a1a1a", boxShadow: "none" }}>
              Empezar de nuevo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const rsStyles = {
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.92)",
    backdropFilter: "blur(6px)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 300, padding: 20,
  },
  modal: {
    background: "#0f0f0f",
    border: "1px solid #2a1a0a",
    borderRadius: 24,
    padding: "32px 24px",
    maxWidth: 380, width: "100%",
    animation: "fadeUp .35s ease",
    boxShadow: "0 0 60px #FF6B3520",
  },
  brokenRing: {
    width: 140, height: 140,
    borderRadius: "50%",
    border: "5px solid #333",
    borderTopColor: "#FF6B35",
    borderRightColor: "#FF6B35",
    margin: "0 auto 24px",
    display: "flex", flexDirection: "column",
    alignItems: "center", justifyContent: "center",
    position: "relative",
    background: "#111",
  },
  crack: {
    position: "absolute", top: -5, right: 18,
    width: 3, height: 20,
    background: "#0f0f0f",
    transform: "rotate(45deg)",
  },
  crackNumber: {
    fontFamily: "'Bebas Neue'", fontSize: 52,
    color: "#FF6B35", lineHeight: 1,
    opacity: 0.5,
  },
  crackLabel: { fontSize: 10, color: "#555", letterSpacing: 2, textTransform: "uppercase" },
  title: {
    fontFamily: "'Bebas Neue'", fontSize: 30,
    color: "#fff", letterSpacing: 2,
    textAlign: "center", marginBottom: 10,
  },
  subtitle: {
    fontSize: 14, color: "#888", textAlign: "center",
    lineHeight: 1.6, marginBottom: 20, whiteSpace: "pre-line",
  },
  timerBox: {
    background: "#1a0800", border: "1px solid #3a1500",
    borderRadius: 12, padding: "10px 16px",
    textAlign: "center", marginBottom: 16,
  },
  timerLabel: { fontSize: 9, color: "#FF6B35", letterSpacing: 3, textTransform: "uppercase", marginBottom: 4 },
  timer: { fontFamily: "'Bebas Neue'", fontSize: 36, color: "#FF6B35", letterSpacing: 4 },
  valueBox: { marginBottom: 20 },
  valueRow: {
    display: "flex", gap: 10, alignItems: "center",
    fontSize: 13, color: "#888", padding: "5px 0",
    borderBottom: "1px solid #1a1a1a",
  },
  rescueBtn: {
    width: "100%", padding: "16px",
    background: "linear-gradient(135deg, #FF4500, #FF8C00)",
    border: "none", borderRadius: 14,
    color: "#fff", fontFamily: "'Bebas Neue'",
    fontSize: 20, letterSpacing: 2,
    cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
    boxShadow: "0 4px 30px #FF650040",
    marginBottom: 12,
  },
  dismissBtn: {
    width: "100%", padding: "10px",
    background: "none", border: "none",
    color: "#333", fontSize: 11, cursor: "pointer",
    textDecoration: "underline",
  },
  spinner: {
    width: 18, height: 18,
    border: "2px solid #ffffff44",
    borderTopColor: "#fff",
    borderRadius: "50%",
    display: "inline-block",
    animation: "spin 0.7s linear infinite",
  },
};

// ─── CONSTANTS ──────────────────────────────────────────────────────────────
const BADGES = [
  { id: "first_blood",  label: "First Blood",   icon: "🔥", desc: "Log your first workout",          cond: (s) => s.totalWorkouts >= 1 },
  { id: "week1",        label: "Week Warrior",   icon: "⚡", desc: "7-day streak",                    cond: (s) => s.longestStreak >= 7 },
  { id: "fortnight",    label: "Fortnight",      icon: "💪", desc: "14-day streak",                   cond: (s) => s.longestStreak >= 14 },
  { id: "month",        label: "Iron Month",     icon: "🏆", desc: "30-day streak",                   cond: (s) => s.longestStreak >= 30 },
  { id: "century",      label: "Centurion",      icon: "💯", desc: "100 total workouts",              cond: (s) => s.totalWorkouts >= 100 },
  { id: "consistent",   label: "Consistent",     icon: "📅", desc: "Log 5 weeks in a row",           cond: (s) => s.longestStreak >= 35 },
  { id: "restmaster",   label: "Rest Master",    icon: "😴", desc: "Use 10 rest days strategically", cond: (s) => s.totalRest >= 10 },
  { id: "beast",        label: "Absolute Beast", icon: "🦁", desc: "60-day streak",                   cond: (s) => s.longestStreak >= 60 },
];

const QUOTES = [
  "El dolor de hoy es la fuerza de mañana.",
  "No te detengas cuando estés cansado. Para cuando hayas terminado.",
  "Tu cuerpo puede casi cualquier cosa. Es tu mente la que debes convencer.",
  "Cada rep cuenta. Cada día importa.",
  "Los campeones no se hacen en el gimnasio.",
  "Sé la versión que mereces ser.",
  "Pequeñas acciones diarias → grandes resultados.",
];

const MONTHS = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];
const DAYS_SHORT = ["D","L","M","X","J","V","S"];

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function dateStr(d) { return d.toISOString().split("T")[0]; }

function addDays(str, n) {
  const d = new Date(str + "T12:00:00");
  d.setDate(d.getDate() + n);
  return dateStr(d);
}

function daysBetween(a, b) {
  return Math.round((new Date(b) - new Date(a)) / 86400000);
}

function getCalendarDays(year, month) {
  const first = new Date(year, month, 1).getDay();
  const last = new Date(year, month + 1, 0).getDate();
  return { first, last };
}

// ─── STORAGE ────────────────────────────────────────────────────────────────
function load() {
  try {
    const raw = localStorage.getItem("gymstreak_v3");
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}
function save(data) {
  try { localStorage.setItem("gymstreak_v3", JSON.stringify(data)); } catch {}
}

// Detect if streak was broken: yesterday not logged and there was a prior streak
function detectBrokenStreak(log) {
  const yesterday = addDays(todayStr(), -1);
  const today = todayStr();
  if (log[today] || log[yesterday]) return 0;
  let d = addDays(yesterday, -1);
  let count = 0;
  for (let i = 0; i < 365; i++) {
    if (log[d] === "workout" || log[d] === "rest") {
      if (log[d] === "workout") count++;
      d = addDays(d, -1);
    } else break;
  }
  return count;
}

function computeStats(log) {
  const workoutDays = Object.entries(log)
    .filter(([, v]) => v === "workout")
    .map(([k]) => k)
    .sort();
  const restDays = Object.entries(log)
    .filter(([, v]) => v === "rest")
    .map(([k]) => k)
    .sort();

  const totalWorkouts = workoutDays.length;
  const totalRest = restDays.length;

  // compute current streak (backwards from today)
  let streak = 0;
  let d = todayStr();
  while (log[d] === "workout" || log[d] === "rest") {
    if (log[d] === "workout") streak++;
    d = addDays(d, -1);
  }

  // compute longest streak
  let longest = 0, cur = 0;
  const allDays = Object.keys(log).sort();
  for (let i = 0; i < allDays.length; i++) {
    if (log[allDays[i]] === "workout" || log[allDays[i]] === "rest") {
      const isConsec = i === 0 || daysBetween(allDays[i - 1], allDays[i]) === 1;
      if (isConsec) {
        if (log[allDays[i]] === "workout") cur++;
      } else {
        cur = log[allDays[i]] === "workout" ? 1 : 0;
      }
      if (cur > longest) longest = cur;
    }
  }

  return { streak, longestStreak: longest, totalWorkouts, totalRest };
}

// ─── COMPONENTS ─────────────────────────────────────────────────────────────

function Toast({ msg, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2800);
    return () => clearTimeout(t);
  }, []);
  return (
    <div style={styles.toast}>
      <span style={{ fontSize: 22 }}>{msg.icon}</span>
      <div>
        <div style={{ fontWeight: 600, fontSize: 14 }}>{msg.title}</div>
        <div style={{ fontSize: 12, opacity: .8 }}>{msg.body}</div>
      </div>
    </div>
  );
}

function BadgeGrid({ stats, earnedIds }) {
  return (
    <div style={styles.badgeGrid}>
      {BADGES.map((b) => {
        const earned = b.cond(stats);
        return (
          <div key={b.id} style={{ ...styles.badgeCard, ...(earned ? styles.badgeEarned : styles.badgeLocked) }}>
            <div style={{ fontSize: 28, filter: earned ? "none" : "grayscale(1) opacity(.3)" }}>{b.icon}</div>
            <div style={{ fontSize: 11, fontWeight: 600, marginTop: 4, color: earned ? "#fff" : "#555" }}>{b.label}</div>
            <div style={{ fontSize: 9, color: earned ? "#aaa" : "#444", marginTop: 2, textAlign: "center" }}>{b.desc}</div>
            {earned && <div style={styles.earnedDot} />}
          </div>
        );
      })}
    </div>
  );
}

function CalendarView({ log, year, month, onPrev, onNext, onDay }) {
  const today = todayStr();
  const { first, last } = getCalendarDays(year, month);
  const cells = [];
  for (let i = 0; i < first; i++) cells.push(null);
  for (let d = 1; d <= last; d++) cells.push(d);

  return (
    <div style={styles.calCard}>
      <div style={styles.calHeader}>
        <button style={styles.calNav} onClick={onPrev}>‹</button>
        <span style={styles.calTitle}>{MONTHS[month]} {year}</span>
        <button style={styles.calNav} onClick={onNext}>›</button>
      </div>
      <div style={styles.calGrid}>
        {DAYS_SHORT.map((d) => (
          <div key={d} style={styles.calDayLabel}>{d}</div>
        ))}
        {cells.map((d, i) => {
          if (!d) return <div key={`e${i}`} />;
          const key = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
          const val = log[key];
          const isToday = key === today;
          const isFuture = key > today;
          const isPast = key < today;
          const isLocked = isFuture || isPast;
          return (
            <button
              key={key}
              disabled={isLocked}
              onClick={() => onDay(key)}
              style={{
                ...styles.calDay,
                ...(val === "workout" ? styles.calWorkout : {}),
                ...(val === "rest" ? styles.calRest : {}),
                ...(isToday ? styles.calToday : {}),
                ...(isFuture ? styles.calFuture : {}),
                ...(isPast ? styles.calPast : {}),
              }}
            >
              {d}
              {val === "workout" && <span style={styles.calDot("🟠")} />}
              {val === "rest" && <span style={styles.calDot("🔵")} />}
            </button>
          );
        })}
      </div>
      <div style={styles.calLegend}>
        <span style={styles.legendItem}><span style={{ color: "#FF6B35" }}>●</span> Entreno</span>
        <span style={styles.legendItem}><span style={{ color: "#4A9EFF" }}>●</span> Descanso</span>
      </div>
    </div>
  );
}

function ResetButton({ onReset }) {
  const [confirmReset, setConfirmReset] = useState(false);
  return confirmReset ? (
    <div style={{ background: "#1a0a0a", border: "1px solid #331111", borderRadius: 12, padding: "16px", marginTop: 16, textAlign: "center" }}>
      <div style={{ fontSize: 13, color: "#ff6666", marginBottom: 12 }}>¿Seguro? Esto borra todo tu progreso.</div>
      <div style={{ display: "flex", gap: 8 }}>
        <button
          style={{ flex: 1, padding: "10px", background: "#ff2222", border: "none", borderRadius: 8, color: "#fff", fontWeight: 700, cursor: "pointer", fontSize: 13 }}
          onClick={() => { onReset(); setConfirmReset(false); }}
        >
          Sí, borrar todo
        </button>
        <button
          style={{ flex: 1, padding: "10px", background: "#222", border: "1px solid #333", borderRadius: 8, color: "#888", cursor: "pointer", fontSize: 13 }}
          onClick={() => setConfirmReset(false)}
        >
          Cancelar
        </button>
      </div>
    </div>
  ) : (
    <button
      style={{ display: "block", width: "100%", textAlign: "center", fontSize: 12, color: "#ff4444", background: "#1a0a0a", border: "1px solid #331111", padding: "10px 16px", borderRadius: 8, marginTop: 16, cursor: "pointer" }}
      onClick={() => setConfirmReset(true)}
    >
      🗑️ Reiniciar todos los datos
    </button>
  );
}

// ─── MAIN APP ────────────────────────────────────────────────────────────────
export default function App() {
  const saved = load();
  const [log, setLog] = useState(() => saved?.log || {});
  const [earnedIds, setEarnedIds] = useState(() => saved?.earnedIds || []);
  const [rescuedDates, setRescuedDates] = useState(() => saved?.rescuedDates || []);
  const [tab, setTab] = useState("home");
  const [toast, setToast] = useState(null);
  const [showRescue, setShowRescue] = useState(false);
  const [brokenStreakCount, setBrokenStreakCount] = useState(0);
  const [quoteIdx] = useState(() => Math.floor(Math.random() * QUOTES.length));
  const now = new Date();
  const [calYear, setCalYear] = useState(now.getFullYear());
  const [calMonth, setCalMonth] = useState(now.getMonth());

  const stats = computeStats(log);
  const today = todayStr();
  const todayVal = log[today];

  // Persist
  useEffect(() => { save({ log, earnedIds, rescuedDates }); }, [log, earnedIds, rescuedDates]);

  // Detect broken streak on mount — show rescue if applicable
  useEffect(() => {
    const broken = detectBrokenStreak(log);
    const yesterday = addDays(todayStr(), -1);
    const alreadyRescued = rescuedDates.includes(yesterday);
    if (broken >= 3 && !alreadyRescued) {
      setBrokenStreakCount(broken);
      // Small delay for dramatic effect
      const t = setTimeout(() => setShowRescue(true), 800);
      return () => clearTimeout(t);
    }
  }, []);

  // Check badges
  useEffect(() => {
    const newlyEarned = BADGES.filter(
      (b) => !earnedIds.includes(b.id) && b.cond(stats)
    );
    if (newlyEarned.length > 0) {
      setEarnedIds((prev) => [...prev, ...newlyEarned.map((b) => b.id)]);
      setToast({ icon: newlyEarned[0].icon, title: "¡Insignia desbloqueada!", body: newlyEarned[0].label });
    }
  }, [stats.totalWorkouts, stats.longestStreak, stats.totalRest]);

  const logDay = useCallback((key, type) => {
    setLog((prev) => {
      const next = { ...prev };
      if (next[key] === type) delete next[key]; // toggle off
      else next[key] = type;
      return next;
    });
    if (key === today) {
      if (type === "workout") setToast({ icon: "🔥", title: "¡Entreno registrado!", body: `Racha actual: ${stats.streak + 1} días` });
      if (type === "rest") setToast({ icon: "😴", title: "Descanso registrado", body: "El descanso es parte del proceso." });
    }
  }, [today, stats.streak]);

  const handleRescue = useCallback(() => {
    // Restore yesterday as a rest day to bridge the gap
    const yesterday = addDays(todayStr(), -1);
    setLog((prev) => ({ ...prev, [yesterday]: "rest" }));
    setRescuedDates((prev) => [...prev, yesterday]);
    setShowRescue(false);
    setToast({ icon: "⚡", title: "¡Racha rescatada!", body: `${brokenStreakCount} días recuperados. ¡Sigue así!` });
  }, [brokenStreakCount]);

  const handleDismissRescue = () => {
    setShowRescue(false);
  };

  // Manual rescue trigger for demo (button in stats)
  const triggerRescueDemo = () => {
    setBrokenStreakCount(14);
    setShowRescue(true);
  };

  const streakColor = stats.streak >= 30 ? "#FFD700" : stats.streak >= 14 ? "#FF6B35" : stats.streak >= 7 ? "#FF9F1C" : "#FF6B35";

  return (
    <>
      <style>{FONTS}</style>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: #0A0A0A; overflow-x: hidden; }
        button { cursor: pointer; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:none; } }
        @keyframes pop { 0%,100% { transform:scale(1); } 50% { transform:scale(1.15); } }
        @keyframes slideIn { from { transform:translateX(120%); opacity:0; } to { transform:none; opacity:1; } }
        @keyframes pulse { 0%,100%{box-shadow:0 0 0 0 ${streakColor}55} 50%{box-shadow:0 0 0 12px transparent} }
        .tab-btn:hover { opacity: 1 !important; }
        .action-btn:hover { filter: brightness(1.1); transform: translateY(-1px); }
        .action-btn { transition: all .15s; }
      `}</style>

      <div style={styles.root}>
        {/* BG GLOW */}
        <div style={{ position: "fixed", top: -120, left: "50%", transform: "translateX(-50%)", width: 600, height: 400, background: `radial-gradient(ellipse, ${streakColor}18 0%, transparent 70%)`, pointerEvents: "none", zIndex: 0, transition: "background 1s" }} />

        {/* TOAST */}
        {toast && <Toast msg={toast} onDone={() => setToast(null)} />}

        {/* STREAK RESCUE MODAL */}
        {showRescue && (
          <StreakRescueModal
            lostStreak={brokenStreakCount}
            onRescue={handleRescue}
            onDismiss={handleDismissRescue}
          />
        )}

        <div style={styles.container}>

          {/* ── HOME TAB ── */}
          {tab === "home" && (
            <div style={{ animation: "fadeUp .4s ease" }}>
              {/* Header */}
              <div style={styles.header}>
                <div>
                  <div style={styles.appName}>GYM<span style={{ color: streakColor }}>STREAK</span></div>
                  <div style={styles.quote}>"{QUOTES[quoteIdx]}"</div>
                </div>
              </div>

              {/* STREAK HERO */}
              <div style={styles.streakHero}>
                <div style={{ ...styles.streakRing, borderColor: streakColor, animation: stats.streak > 0 ? "pulse 2s infinite" : "none" }}>
                  <div style={{ ...styles.streakNumber, color: streakColor }}>{stats.streak}</div>
                  <div style={styles.streakLabel}>días de racha</div>
                </div>
                <div style={styles.minStats}>
                  <div style={styles.minStat}><span style={styles.minStatNum}>{stats.totalWorkouts}</span><span style={styles.minStatLabel}>entrenamientos</span></div>
                  <div style={styles.minStatDivider} />
                  <div style={styles.minStat}><span style={styles.minStatNum}>{stats.longestStreak}</span><span style={styles.minStatLabel}>mejor racha</span></div>
                  <div style={styles.minStatDivider} />
                  <div style={styles.minStat}><span style={styles.minStatNum}>{stats.totalRest}</span><span style={styles.minStatLabel}>descansos</span></div>
                </div>
              </div>

              {/* TODAY ACTIONS */}
              <div style={styles.sectionTitle}>HOY — {today}</div>
              <div style={styles.actionRow}>
                <button
                  className="action-btn"
                  onClick={() => logDay(today, "workout")}
                  style={{ ...styles.actionBtn, ...(todayVal === "workout" ? styles.actionActive("workout") : {}) }}
                >
                  <span style={{ fontSize: 32 }}>💪</span>
                  <span style={styles.actionLabel}>Fui al gym</span>
                  {todayVal === "workout" && <span style={styles.actionCheck}>✓</span>}
                </button>
                <button
                  className="action-btn"
                  onClick={() => logDay(today, "rest")}
                  style={{ ...styles.actionBtn, ...(todayVal === "rest" ? styles.actionActive("rest") : {}) }}
                >
                  <span style={{ fontSize: 32 }}>😴</span>
                  <span style={styles.actionLabel}>Día de descanso</span>
                  {todayVal === "rest" && <span style={styles.actionCheck}>✓</span>}
                </button>
              </div>

              {/* BADGES PREVIEW */}
              <div style={styles.sectionTitle}>INSIGNIAS</div>
              <div style={styles.badgePreviewRow}>
                {BADGES.map((b) => {
                  const earned = b.cond(stats);
                  return (
                    <div key={b.id} title={b.label} style={{ ...styles.badgeMini, filter: earned ? "none" : "grayscale(1) opacity(.25)" }}>
                      {b.icon}
                    </div>
                  );
                })}
              </div>
              <button style={styles.seeAllBtn} onClick={() => setTab("badges")}>Ver todas las insignias →</button>

              {/* NEXT MILESTONE */}
              {(() => {
                const milestones = [7, 14, 30, 60, 100];
                const next = milestones.find((m) => stats.streak < m) || milestones[milestones.length - 1];
                const pct = Math.min((stats.streak / next) * 100, 100);
                return (
                  <div style={styles.milestoneCard}>
                    <div style={styles.milestoneTop}>
                      <span style={{ fontSize: 12, color: "#888", letterSpacing: 2 }}>PRÓXIMO HITO</span>
                      <span style={{ fontSize: 13, color: streakColor, fontWeight: 600 }}>{next} días</span>
                    </div>
                    <div style={styles.progTrack}>
                      <div style={{ ...styles.progFill, width: `${pct}%`, background: streakColor }} />
                    </div>
                    <div style={{ fontSize: 11, color: "#666", marginTop: 6 }}>{stats.streak} / {next} días — {Math.max(0, next - stats.streak)} días para lograrlo</div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* ── CALENDAR TAB ── */}
          {tab === "calendar" && (
            <div style={{ animation: "fadeUp .4s ease" }}>
              <div style={styles.tabPageTitle}>Calendario</div>
              <CalendarView
                log={log}
                year={calYear}
                month={calMonth}
                onPrev={() => { if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); } else setCalMonth(m => m - 1); }}
                onNext={() => { if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); } else setCalMonth(m => m + 1); }}
                onDay={(key) => {
                  if (key !== todayStr()) return; // only today is editable
                  const types = [undefined, "workout", "rest"];
                  const cur = log[key];
                  const nextType = types[(types.indexOf(cur) + 1) % types.length];
                  if (!nextType) {
                    setLog(prev => { const n = { ...prev }; delete n[key]; return n; });
                  } else {
                    logDay(key, nextType);
                  }
                }}
              />
              <div style={{ marginTop: 16, fontSize: 12, color: "#555", textAlign: "center" }}>
                Solo puedes registrar el día de hoy
              </div>
            </div>
          )}

          {/* ── BADGES TAB ── */}
          {tab === "badges" && (
            <div style={{ animation: "fadeUp .4s ease" }}>
              <div style={styles.tabPageTitle}>Insignias</div>
              <div style={{ fontSize: 12, color: "#555", marginBottom: 20, textAlign: "center" }}>
                {earnedIds.length} / {BADGES.length} desbloqueadas
              </div>
              <BadgeGrid stats={stats} earnedIds={earnedIds} />
            </div>
          )}

          {/* ── STATS TAB ── */}
          {tab === "stats" && (
            <div style={{ animation: "fadeUp .4s ease" }}>
              <div style={styles.tabPageTitle}>Estadísticas</div>
              <div style={styles.statsGrid}>
                {[
                  { label: "Racha actual", val: stats.streak, unit: "días", color: streakColor },
                  { label: "Mejor racha", val: stats.longestStreak, unit: "días", color: "#FFD700" },
                  { label: "Total entrenamientos", val: stats.totalWorkouts, unit: "", color: "#FF6B35" },
                  { label: "Total descansos", val: stats.totalRest, unit: "", color: "#4A9EFF" },
                  { label: "Días registrados", val: Object.keys(log).length, unit: "", color: "#9B59B6" },
                  { label: "Rescates usados", val: rescuedDates.length, unit: "", color: "#FF4500" },
                ].map((s) => (
                  <div key={s.label} style={styles.statCard}>
                    <div style={{ ...styles.statBigNum, color: s.color }}>
                      {s.val}{s.unit ? <span style={{ fontSize: "0.5em", marginLeft: 3, opacity: 0.7 }}>{s.unit}</span> : null}
                    </div>
                    <div style={styles.statCardLabel}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Week heatmap */}
              <div style={styles.sectionTitle}>ACTIVIDAD POR DÍA DE LA SEMANA</div>
              {(() => {
                const counts = [0, 0, 0, 0, 0, 0, 0];
                Object.entries(log).forEach(([k, v]) => {
                  if (v === "workout") {
                    const dow = new Date(k + "T12:00:00").getDay();
                    counts[dow]++;
                  }
                });
                const max = Math.max(...counts, 1);
                const labels = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
                return (
                  <div style={styles.heatmapRow}>
                    {counts.map((c, i) => (
                      <div key={i} style={styles.heatCol}>
                        <div style={{ ...styles.heatBar, height: `${Math.max(4, (c / max) * 80)}px`, background: c > 0 ? streakColor : "#222" }} />
                        <div style={styles.heatLabel}>{labels[i]}</div>
                        <div style={styles.heatCount}>{c}</div>
                      </div>
                    ))}
                  </div>
                );
              })()}

              {/* Demo rescue button */}
              <div style={{ background: "#111", borderRadius: 16, padding: "16px 20px", marginTop: 20, marginBottom: 8 }}>
                <div style={{ fontSize: 11, color: "#555", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>STREAK RESCUE</div>
                <div style={{ fontSize: 13, color: "#888", marginBottom: 14, lineHeight: 1.5 }}>
                  Si algún día rompes tu racha, puedes rescatarla por solo $0.99. Tu progreso es demasiado valioso para perderlo.
                </div>
                <button
                  style={{ ...styles.seeAllBtn, borderColor: "#3a1500", color: "#FF6B35", width: "100%", textAlign: "center" }}
                  onClick={triggerRescueDemo}
                >
                  ⚡ Ver demo del Streak Rescue
                </button>
              </div>

              <ResetButton onReset={() => { setLog({}); setEarnedIds([]); setRescuedDates([]); setToast({ icon: "🗑️", title: "Datos borrados", body: "Empieza de cero. ¡Tú puedes!" }); }} />
            </div>
          )}

        </div>

        {/* BOTTOM NAV */}
        <nav style={styles.nav}>
          {[
            { id: "home", icon: "🏠", label: "Inicio" },
            { id: "calendar", icon: "📅", label: "Calendario" },
            { id: "badges", icon: "🏆", label: "Insignias" },
            { id: "stats", icon: "📊", label: "Stats" },
          ].map((t) => (
            <button
              key={t.id}
              className="tab-btn"
              onClick={() => setTab(t.id)}
              style={{ ...styles.navBtn, opacity: tab === t.id ? 1 : 0.4 }}
            >
              <span style={{ fontSize: 20 }}>{t.icon}</span>
              <span style={{ fontSize: 10, marginTop: 2, color: tab === t.id ? "#FF6B35" : "#888" }}>{t.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = {
  root: { minHeight: "100vh", background: "#0A0A0A", display: "flex", flexDirection: "column", fontFamily: "'Outfit', sans-serif", position: "relative" },
  container: { flex: 1, padding: "24px 20px 100px", maxWidth: 480, margin: "0 auto", width: "100%", position: "relative", zIndex: 1 },

  header: { marginBottom: 28 },
  appName: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, letterSpacing: 3, color: "#fff", lineHeight: 1 },
  quote: { fontSize: 12, color: "#555", marginTop: 6, fontStyle: "italic", lineHeight: 1.5 },

  streakHero: { display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 36 },
  streakRing: { width: 160, height: 160, borderRadius: "50%", border: "4px solid", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", marginBottom: 24, background: "#111", position: "relative" },
  streakNumber: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 68, lineHeight: 1 },
  streakLabel: { fontSize: 12, color: "#666", letterSpacing: 2, textTransform: "uppercase" },
  minStats: { display: "flex", alignItems: "center", gap: 0, background: "#111", borderRadius: 16, padding: "14px 24px", width: "100%" },
  minStat: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 2 },
  minStatNum: { fontFamily: "'Bebas Neue'", fontSize: 28, color: "#fff" },
  minStatLabel: { fontSize: 10, color: "#555", letterSpacing: 1, textTransform: "uppercase" },
  minStatDivider: { width: 1, height: 40, background: "#222" },

  sectionTitle: { fontSize: 11, letterSpacing: 3, color: "#444", textTransform: "uppercase", marginBottom: 12, marginTop: 8 },

  actionRow: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 28 },
  actionBtn: { background: "#111", border: "2px solid #1e1e1e", borderRadius: 16, padding: "20px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 8, color: "#fff", position: "relative" },
  actionLabel: { fontSize: 13, fontWeight: 500 },
  actionActive: (type) => ({
    background: type === "workout" ? "#FF6B3522" : "#4A9EFF22",
    borderColor: type === "workout" ? "#FF6B35" : "#4A9EFF",
  }),
  actionCheck: { position: "absolute", top: 10, right: 12, fontSize: 16, color: "#2ECC71", fontWeight: 700 },

  badgePreviewRow: { display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 },
  badgeMini: { fontSize: 28, background: "#111", borderRadius: 12, width: 52, height: 52, display: "flex", alignItems: "center", justifyContent: "center" },
  seeAllBtn: { fontSize: 12, color: "#FF6B35", background: "none", border: "1px solid #2a1510", padding: "8px 16px", borderRadius: 8, marginBottom: 20 },

  milestoneCard: { background: "#111", borderRadius: 16, padding: "16px 20px", marginBottom: 8 },
  milestoneTop: { display: "flex", justifyContent: "space-between", marginBottom: 10 },
  progTrack: { height: 6, background: "#1e1e1e", borderRadius: 3, overflow: "hidden" },
  progFill: { height: "100%", borderRadius: 3, transition: "width .8s ease" },

  // BADGES PAGE
  badgeGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10 },
  badgeCard: { borderRadius: 14, padding: "14px 8px", display: "flex", flexDirection: "column", alignItems: "center", position: "relative" },
  badgeEarned: { background: "#181818", border: "1px solid #2e2e2e" },
  badgeLocked: { background: "#0e0e0e", border: "1px solid #181818" },
  earnedDot: { width: 6, height: 6, borderRadius: "50%", background: "#2ECC71", position: "absolute", top: 8, right: 8 },

  // CALENDAR
  calCard: { background: "#111", borderRadius: 20, padding: "20px 16px" },
  calHeader: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  calTitle: { fontFamily: "'Bebas Neue'", fontSize: 22, letterSpacing: 2, color: "#fff" },
  calNav: { background: "none", border: "none", color: "#FF6B35", fontSize: 24, padding: "0 8px" },
  calGrid: { display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 },
  calDayLabel: { fontSize: 10, color: "#444", textAlign: "center", paddingBottom: 8, letterSpacing: 1 },
  calDay: { background: "#0e0e0e", border: "1px solid #1e1e1e", borderRadius: 8, aspectRatio: "1", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#888", position: "relative", padding: 0 },
  calWorkout: { background: "#FF6B3522", borderColor: "#FF6B35", color: "#FF6B35" },
  calRest: { background: "#4A9EFF22", borderColor: "#4A9EFF", color: "#4A9EFF" },
  calToday: { borderColor: "#FFD700", color: "#FFD700" },
  calFuture: { opacity: 0.2, cursor: "not-allowed" },
  calPast: { opacity: 0.45, cursor: "not-allowed" },
  calDot: () => ({ fontSize: 5, position: "absolute", bottom: 3 }),
  calLegend: { display: "flex", gap: 20, justifyContent: "center", marginTop: 14, fontSize: 12, color: "#555" },
  legendItem: { display: "flex", alignItems: "center", gap: 4 },

  // STATS
  tabPageTitle: { fontFamily: "'Bebas Neue'", fontSize: 32, letterSpacing: 3, color: "#fff", marginBottom: 20 },
  statsGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 28 },
  statCard: { background: "#111", borderRadius: 14, padding: "18px 16px" },
  statBigNum: { fontFamily: "'Bebas Neue'", fontSize: 36, lineHeight: 1 },
  statCardLabel: { fontSize: 11, color: "#555", marginTop: 4 },
  heatmapRow: { display: "flex", gap: 8, alignItems: "flex-end", background: "#111", borderRadius: 14, padding: "16px 12px" },
  heatCol: { flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 },
  heatBar: { width: "100%", borderRadius: 4, minHeight: 4, transition: "height .5s ease" },
  heatLabel: { fontSize: 9, color: "#444", letterSpacing: 1 },
  heatCount: { fontSize: 10, color: "#555" },

  // NAV
  nav: { position: "fixed", bottom: 0, left: 0, right: 0, background: "#0e0e0e", borderTop: "1px solid #1a1a1a", display: "flex", padding: "8px 0 20px", zIndex: 50 },
  navBtn: { flex: 1, background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", color: "#fff", padding: "4px 0", transition: "opacity .15s" },

  // TOAST
  toast: { position: "fixed", top: 20, right: 20, background: "#1e1e1e", border: "1px solid #2e2e2e", borderRadius: 14, padding: "14px 18px", display: "flex", gap: 12, alignItems: "center", zIndex: 200, animation: "slideIn .3s ease", maxWidth: 280, boxShadow: "0 8px 40px #000a" },
};
