// Tweaks panel for the ud-berlin.eu placeholder.
// Lets the user drop in a real merged video URL, tune the overlay
// (color tone + opacity), tweak the headline, and toggle bits of chrome.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "videoUrl": "",
  "overlayTone": "warm-gray",
  "overlayOpacity": 0.52,
  "accent": "#d97a4a",
  "showLede": true,
  "showCornerTicks": true,
  "showGrain": true,
  "showLangSwitch": true,
  "headlineDe": "Demnächst hier",
  "headlineHu": "Épülőben, szépülőben…"
}/*EDITMODE-END*/;

const TONE_PRESETS = {
  "warm-gray":  { h: 60,  c: 0.012, l: 0.18 },
  "neutral":    { h: 0,   c: 0,     l: 0.18 },
  "cool-blue":  { h: 240, c: 0.020, l: 0.16 },
  "ember":      { h: 35,  c: 0.030, l: 0.16 },
  "midnight":   { h: 260, c: 0.025, l: 0.10 },
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  // Apply live styling whenever tweaks change
  React.useEffect(() => {
    const root = document.documentElement;
    const tone = TONE_PRESETS[t.overlayTone] || TONE_PRESETS["warm-gray"];
    root.style.setProperty("--overlay-h", String(tone.h));
    root.style.setProperty("--overlay-c", String(tone.c));
    root.style.setProperty("--overlay-l", String(tone.l));
    root.style.setProperty("--overlay-a", String(t.overlayOpacity));
    root.style.setProperty("--ember", t.accent);
  }, [t.overlayTone, t.overlayOpacity, t.accent]);

  // Wire up the video element
  React.useEffect(() => {
    const v = document.getElementById("bgVideo");
    if (!v) return;
    if (t.videoUrl && t.videoUrl.trim()) {
      if (v.getAttribute("src") !== t.videoUrl) {
        v.setAttribute("src", t.videoUrl);
        v.load();
        const tryPlay = () => v.play().catch(() => {});
        v.addEventListener("loadeddata", tryPlay, { once: true });
      }
    } else {
      v.removeAttribute("src");
      v.classList.remove("ready");
      try { v.load(); } catch (e) {}
    }
  }, [t.videoUrl]);

  // Headlines + visibility toggles
  React.useEffect(() => {
    const de = document.querySelector(".head .de");
    const hu = document.querySelector(".head .hu");
    if (de) de.textContent = t.headlineDe;
    if (hu) hu.textContent = t.headlineHu;
  }, [t.headlineDe, t.headlineHu]);

  React.useEffect(() => {
    const set = (sel, on) => {
      const el = document.querySelector(sel);
      if (el) el.style.display = on ? "" : "none";
    };
    set(".lede", t.showLede);
    set(".corner-tl", t.showCornerTicks);
    set(".corner-br", t.showCornerTicks);
    set(".grain", t.showGrain);
    set(".lang-switch", t.showLangSwitch);
  }, [t.showLede, t.showCornerTicks, t.showGrain, t.showLangSwitch]);

  return (
    <TweaksPanel title="Tweaks">

      <TweakSection label="Background video">
        <TweakText
          label="Video URL (.mp4)"
          placeholder="https://… or bg.mp4"
          value={t.videoUrl}
          onChange={(v) => setTweak("videoUrl", v)}
        />
      </TweakSection>

      <TweakSection label="Overlay">
        <TweakSelect
          label="Tone"
          value={t.overlayTone}
          options={[
            { value: "warm-gray", label: "Warm gray" },
            { value: "neutral",   label: "Neutral gray" },
            { value: "cool-blue", label: "Cool blue" },
            { value: "ember",     label: "Ember" },
            { value: "midnight",  label: "Midnight" },
          ]}
          onChange={(v) => setTweak("overlayTone", v)}
        />
        <TweakSlider
          label="Opacity"
          min={0.15} max={0.85} step={0.01}
          value={t.overlayOpacity}
          onChange={(v) => setTweak("overlayOpacity", v)}
        />
        <TweakColor
          label="Accent"
          value={t.accent}
          options={["#d97a4a", "#c84a3a", "#6e8aa8", "#b89a5a", "#e0d4be"]}
          onChange={(v) => setTweak("accent", v)}
        />
      </TweakSection>

      <TweakSection label="Headline">
        <TweakText
          label="Deutsch"
          value={t.headlineDe}
          onChange={(v) => setTweak("headlineDe", v)}
        />
        <TweakText
          label="Magyar"
          value={t.headlineHu}
          onChange={(v) => setTweak("headlineHu", v)}
        />
      </TweakSection>

      <TweakSection label="Chrome">
        <TweakToggle label="Subtitle / lede"   value={t.showLede}        onChange={(v) => setTweak("showLede", v)} />
        <TweakToggle label="Corner tick text"  value={t.showCornerTicks} onChange={(v) => setTweak("showCornerTicks", v)} />
        <TweakToggle label="Film grain"        value={t.showGrain}       onChange={(v) => setTweak("showGrain", v)} />
        <TweakToggle label="Language switch"   value={t.showLangSwitch}  onChange={(v) => setTweak("showLangSwitch", v)} />
      </TweakSection>

    </TweaksPanel>
  );
}

ReactDOM.createRoot(document.getElementById("tweaks-root")).render(<App />);
