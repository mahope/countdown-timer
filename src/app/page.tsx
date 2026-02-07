"use client";

import { useState, useEffect, useMemo } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  total: number;
}

const THEMES = [
  { name: "Bryllup", emoji: "💒", gradient: "from-pink-500 to-rose-600", bg: "from-pink-50 to-rose-100" },
  { name: "Fødselsdag", emoji: "🎂", gradient: "from-purple-500 to-indigo-600", bg: "from-purple-50 to-indigo-100" },
  { name: "Nytår", emoji: "🎆", gradient: "from-yellow-500 to-orange-600", bg: "from-yellow-50 to-orange-100" },
  { name: "Baby", emoji: "👶", gradient: "from-cyan-500 to-blue-600", bg: "from-cyan-50 to-blue-100" },
  { name: "Ferie", emoji: "✈️", gradient: "from-emerald-500 to-teal-600", bg: "from-emerald-50 to-teal-100" },
  { name: "Event", emoji: "🎉", gradient: "from-red-500 to-pink-600", bg: "from-red-50 to-pink-100" },
  { name: "Simpel", emoji: "⏰", gradient: "from-gray-600 to-slate-700", bg: "from-gray-50 to-slate-100" },
];

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const now = new Date().getTime();
  const target = targetDate.getTime();
  const difference = target - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, total: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
    total: difference,
  };
}

function TimeBlock({ value, label, gradient }: { value: number; label: string; gradient: string }) {
  return (
    <div className="text-center">
      <div className={`bg-gradient-to-br ${gradient} text-white rounded-2xl p-4 md:p-6 shadow-lg min-w-[80px] md:min-w-[100px]`}>
        <span className="text-4xl md:text-6xl font-bold block">
          {value.toString().padStart(2, "0")}
        </span>
      </div>
      <span className="text-sm md:text-base text-gray-600 mt-2 block font-medium">
        {label}
      </span>
    </div>
  );
}

export default function CountdownTimer() {
  const [title, setTitle] = useState<string>("Min Countdown");
  const [targetDateStr, setTargetDateStr] = useState<string>(() => {
    const future = new Date();
    future.setDate(future.getDate() + 30);
    return future.toISOString().slice(0, 16);
  });
  const [selectedTheme, setSelectedTheme] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isEditing, setIsEditing] = useState<boolean>(true);
  const [copied, setCopied] = useState<boolean>(false);

  const theme = THEMES[selectedTheme];
  const targetDate = useMemo(() => new Date(targetDateStr), [targetDateStr]);

  // Update countdown every second
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    // Initial calculation
    setTimeLeft(calculateTimeLeft(targetDate));

    return () => clearInterval(timer);
  }, [targetDate]);

  // Generate shareable URL
  const shareUrl = useMemo(() => {
    const params = new URLSearchParams({
      t: title,
      d: targetDateStr,
      th: selectedTheme.toString(),
    });
    if (typeof window !== "undefined") {
      return `${window.location.origin}?${params.toString()}`;
    }
    return "";
  }, [title, targetDateStr, selectedTheme]);

  // Load from URL params
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlTitle = params.get("t");
      const urlDate = params.get("d");
      const urlTheme = params.get("th");

      if (urlTitle) {
        setTitle(urlTitle);
        setIsEditing(false);
      }
      if (urlDate) setTargetDateStr(urlDate);
      if (urlTheme) setSelectedTheme(parseInt(urlTheme) || 0);
    }
  }, []);

  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Kunne ikke kopiere link");
    }
  };

  const isComplete = timeLeft && timeLeft.total <= 0;

  return (
    <main className={`min-h-screen bg-gradient-to-br ${theme.bg}`}>
      <section data-seo-explainer className="max-w-3xl mx-auto p-4 text-gray-700">
        <h2 className="text-lg font-semibold mb-2">Om dette værktøj</h2>
        <p>Dette gratis online værktøj er bygget til at løse en praktisk opgave hurtigt og sikkert direkte i din browser. Ingen data sendes til servere, og du kan frit bruge resultatet.</p>
        <p>Vi fokuserer på brugervenlighed, performance og gennemsigtighed. Nedenfor finder du tips, forklaringer og bedste praksis, så du forstår metoden og kan bruge den i hverdagen.</p>
      </section>
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Countdown Timer ⏱️
          </h1>
          <p className="mt-2 text-gray-600">
            Tæl ned til din store dag - gratis og let at dele
          </p>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Settings panel (collapsible) */}
        {isEditing && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              ⚙️ Indstillinger
            </h2>

            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Titel
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                  placeholder="F.eks. Vores bryllup"
                />
              </div>

              {/* Date/time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dato og tidspunkt
                </label>
                <input
                  type="datetime-local"
                  value={targetDateStr}
                  onChange={(e) => setTargetDateStr(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              {/* Theme selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tema
                </label>
                <div className="flex flex-wrap gap-2">
                  {THEMES.map((t, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedTheme(idx)}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                        selectedTheme === idx
                          ? `bg-gradient-to-r ${t.gradient} text-white shadow-md`
                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                      }`}
                    >
                      <span>{t.emoji}</span>
                      <span className="text-sm">{t.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(false)}
              className={`mt-6 w-full py-3 bg-gradient-to-r ${theme.gradient} text-white font-bold rounded-xl hover:opacity-90 transition-opacity`}
            >
              ✓ Start countdown
            </button>
          </div>
        )}

        {/* Main countdown display */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 text-center">
          {/* Title with theme emoji */}
          <div className="mb-8">
            <span className="text-6xl mb-4 block">{theme.emoji}</span>
            <h2 className="text-2xl md:text-4xl font-bold text-gray-900">
              {title}
            </h2>
            <p className="text-gray-500 mt-2">
              {targetDate.toLocaleDateString("da-DK", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>

          {/* Countdown or completion message */}
          {isComplete ? (
            <div className="py-12">
              <span className="text-8xl mb-6 block">🎉</span>
              <h3 className="text-3xl font-bold text-gray-900">
                Tiden er inde!
              </h3>
              <p className="text-gray-600 mt-2">
                Countdown er færdig. Tillykke!
              </p>
            </div>
          ) : timeLeft ? (
            <div className="flex justify-center gap-3 md:gap-6 flex-wrap">
              <TimeBlock value={timeLeft.days} label="Dage" gradient={theme.gradient} />
              <TimeBlock value={timeLeft.hours} label="Timer" gradient={theme.gradient} />
              <TimeBlock value={timeLeft.minutes} label="Minutter" gradient={theme.gradient} />
              <TimeBlock value={timeLeft.seconds} label="Sekunder" gradient={theme.gradient} />
            </div>
          ) : (
            <div className="py-12 text-gray-500">Indlæser...</div>
          )}

          {/* Action buttons */}
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
            >
              {isEditing ? "Skjul indstillinger" : "✏️ Rediger"}
            </button>
            <button
              onClick={copyShareLink}
              className={`px-6 py-2 rounded-lg transition-all ${
                copied
                  ? "bg-green-500 text-white"
                  : `bg-gradient-to-r ${theme.gradient} text-white hover:opacity-90`
              }`}
            >
              {copied ? "✓ Link kopieret!" : "🔗 Del countdown"}
            </button>
          </div>
        </div>

        {/* Share preview */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            📤 Del med andre
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            Kopiér linket og del det med venner og familie:
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={shareUrl}
              readOnly
              className="flex-1 px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600"
            />
            <button
              onClick={copyShareLink}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 transition-colors"
            >
              Kopiér
            </button>
          </div>
        </div>

        {/* Quick countdowns */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            ⚡ Hurtige countdowns
          </h3>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Nytårsaften", date: `${new Date().getFullYear() + 1}-01-01T00:00`, theme: 2 },
              { label: "Om 1 time", date: new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16), theme: 6 },
              { label: "Om 24 timer", date: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().slice(0, 16), theme: 6 },
              { label: "Om 1 uge", date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16), theme: 4 },
            ].map((quick, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setTitle(quick.label);
                  setTargetDateStr(quick.date);
                  setSelectedTheme(quick.theme);
                  setIsEditing(false);
                }}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm text-gray-700 transition-colors"
              >
                {quick.label}
              </button>
            ))}
          </div>
        </div>

        {/* SEO Content */}
        <section className="mt-12 bg-white rounded-2xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Gratis online countdown timer
          </h2>
          <div className="prose max-w-none text-gray-600">
            <p>
              Brug vores gratis countdown timer til at tælle ned til din næste store begivenhed. 
              Perfekt til bryllupper, fødselsdage, ferier, babyfødsler eller nytårsaften.
            </p>
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">
              Sådan bruger du countdown timeren
            </h3>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Giv din countdown en titel</li>
              <li>Vælg dato og tidspunkt</li>
              <li>Vælg et tema der passer til begivenheden</li>
              <li>Del linket med venner og familie</li>
            </ol>
            <h3 className="text-lg font-semibold text-gray-900 mt-6 mb-2">
              Del dit link
            </h3>
            <p>
              Når du har oprettet din countdown, kan du dele linket med andre. 
              De vil se præcis den samme countdown som dig - perfekt til at 
              bygge forventning op til jeres fælles begivenhed!
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2025 CountdownTimer.dk - Gratis dansk countdown timer</p>
          <p className="mt-1">
            Tæl ned til din store dag - del med venner og familie.
          </p>
        </footer>
      </div>
    </main>
  );
}
