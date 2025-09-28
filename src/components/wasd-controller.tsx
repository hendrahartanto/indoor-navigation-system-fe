import React, { useCallback, useEffect, useRef, useState } from "react";

type KeyWASD = "w" | "a" | "s" | "d";
type Phase = "down" | "up";

export default function WasdController({
  onCommand,
}: {
  onCommand?: (key: KeyWASD, type: Phase) => void;
}) {
  const [driveMode, setDriveMode] = useState(false);
  const [activeKey, setActiveKey] = useState<KeyWASD | null>(null);
  const activeKeyRef = useRef<KeyWASD | null>(null);
  useEffect(() => {
    activeKeyRef.current = activeKey;
  }, [activeKey]);

  const lastRef = useRef<{ key: KeyWASD; type: Phase } | null>(null);

  const isWASD = (k: string): k is KeyWASD =>
    k === "w" || k === "a" || k === "s" || k === "d";

  const lastEventRef = useRef<{ key: KeyWASD; type: Phase; ts: number } | null>(
    null
  );

  const trigger = useCallback(
    (key: KeyWASD, type: Phase) => {
      const now = performance.now();
      const last = lastEventRef.current;
      if (
        type === "up" &&
        last &&
        last.key === key &&
        last.type === "up" &&
        now - last.ts < 100
      ) {
        return;
      }
      lastEventRef.current = { key, type, ts: now };
      lastRef.current = { key, type };
      onCommand?.(key, type);
      console.log(`[WASD ${type}]`, key);
    },
    [onCommand]
  );

  const pressKey = useCallback(
    (key: KeyWASD) => {
      if (activeKey) return;
      setActiveKey(key);
      trigger(key, "down");
    },
    [activeKey, trigger]
  );

  const releaseKey = useCallback(
    (key: KeyWASD) => {
      if (activeKey !== key) return;
      trigger(key, "up");
      setActiveKey(null);
    },
    [activeKey, trigger]
  );

  const releaseAll = useCallback(() => {
    if (activeKey) {
      trigger(activeKey, "up");
      setActiveKey(null);
    }
  }, [activeKey, trigger]);

  useEffect(() => {
    if (!driveMode) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (!isWASD(key)) return;
      e.preventDefault();
      pressKey(key);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (!isWASD(key)) return;
      e.preventDefault();
      releaseKey(key);
    };

    const onVisibility = () => {
      if (document.visibilityState !== "visible") releaseAll();
    };

    window.addEventListener("keydown", onKeyDown, { passive: false });
    window.addEventListener("keyup", onKeyUp, { passive: false });
    window.addEventListener("blur", releaseAll);
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      window.removeEventListener("blur", releaseAll);
      document.removeEventListener("visibilitychange", onVisibility);
      releaseAll();
    };
  }, [driveMode, pressKey, releaseKey, releaseAll]);

  const pressStart = useCallback(
    (k: KeyWASD) => (e?: React.PointerEvent) => {
      if (!driveMode) return;
      e?.preventDefault();
      (e?.currentTarget as HTMLElement | undefined)?.setPointerCapture?.(
        e?.pointerId || 0
      );
      pressKey(k);
      if (navigator.vibrate) navigator.vibrate(8);
    },
    [driveMode, pressKey]
  );

  const pressEnd = useCallback(
    (k: KeyWASD) => (e?: React.PointerEvent) => {
      if (!driveMode) return;
      e?.preventDefault();
      releaseKey(k);
    },
    [driveMode, releaseKey]
  );

  const last = lastRef.current;
  const isActive = useCallback((k: KeyWASD) => activeKey === k, [activeKey]);

  return (
    <div className="mt-4">
      <div className="mb-3 flex items-center justify-between rounded-xl border border-gray-200 bg-white/60 p-3 shadow-sm backdrop-blur-md dark:border-gray-200 dark:bg-white/10">
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex h-2.5 w-2.5 rounded-full ${
              driveMode ? "bg-emerald-500 animate-pulse" : "bg-gray-300"
            }`}
            aria-hidden
          />
          <div>
            <div className="text-sm font-semibold text-gray-800">
              Drive Mode
            </div>
            <div className="text-xs text-gray-500">
              {driveMode
                ? "Keyboard captured (W/A/S/D)"
                : "Disabled for normal typing"}
            </div>
          </div>
        </div>
        <button
          type="button"
          aria-pressed={driveMode}
          onClick={() => {
            if (driveMode) releaseAll();
            setDriveMode((v) => !v);
          }}
          className={`group relative inline-flex h-9 w-20 items-center rounded-full transition
            ${
              driveMode
                ? "bg-gradient-to-r from-blue-600 to-cyan-500"
                : "bg-gray-300 dark:bg-gray-600"
            }`}
        >
          <span
            className={`ml-1 inline-flex h-7 w-7 transform items-center justify-center rounded-full bg-white shadow-md transition
              ${driveMode ? "translate-x-11" : "translate-x-0"}`}
          />
          <span className="sr-only">Toggle drive mode</span>
          <span
            className={`absolute left-2 text-[10px] font-semibold uppercase ${
              driveMode ? "opacity-0" : "opacity-70 text-gray-800"
            }`}
          >
            Off
          </span>
          <span
            className={`absolute right-3 text-[10px] font-semibold uppercase text-white ${
              driveMode ? "opacity-90" : "opacity-0"
            }`}
          >
            On
          </span>
        </button>
      </div>

      <div className="mb-3 flex items-center justify-between rounded-lg border border-gray-200 bg-white/60 px-3 py-2 text-sm text-gray-600 shadow-sm backdrop-blur-md dark:border-gray-200 dark:text-gray-200">
        <div className="flex items-center gap-2">
          {["W", "A", "S", "D"].map((k) => (
            <kbd
              key={k}
              className={`rounded px-1.5 py-0.5 font-mono text-[11px] font-semibold ${
                isActive(k.toLowerCase() as KeyWASD)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-800 text-white"
              }`}
            >
              {k}
            </kbd>
          ))}
          <span className="ml-2 text-xs text-gray-500">
            {driveMode ? "Press one key at a time" : "Enable Drive Mode to use"}
          </span>
        </div>
        <div className="text-xs text-gray-500">
          {last ? (
            <>
              Last:{" "}
              <span className="font-mono font-semibold text-gray-700 dark:text-gray-100">
                {last.key.toUpperCase()}
              </span>{" "}
              {last.type}
            </>
          ) : (
            "Awaiting input…"
          )}
        </div>
      </div>

      <div
        className={`relative mx-auto flex w-full max-w-xs select-none justify-center rounded-2xl border
          ${driveMode ? "border-blue-200/70" : "border-gray-200"}
          bg-gradient-to-b from-white/80 to-white/50 p-4 shadow backdrop-blur-md dark:from-white/10 dark:to-white/5`}
      >
        {!driveMode && (
          <div className="absolute inset-0 z-10 grid place-items-center rounded-2xl bg-white/60 text-xs text-gray-600">
            <div className="rounded-md border border-gray-200 bg-white/80 px-2 py-1 shadow-sm">
              Drive Mode is off
            </div>
          </div>
        )}

        <div className="grid grid-cols-3 gap-3">
          <div />
          <Key
            label="W"
            hint="Forward"
            active={isActive("w")}
            disabled={!driveMode}
            onDown={pressStart("w")}
            onUp={pressEnd("w")}
          />
          <div />

          <Key
            label="A"
            hint="Left"
            active={isActive("a")}
            disabled={!driveMode}
            onDown={pressStart("a")}
            onUp={pressEnd("a")}
          />
          <Key
            label="S"
            hint="Back"
            active={isActive("s")}
            disabled={!driveMode}
            onDown={pressStart("s")}
            onUp={pressEnd("s")}
          />
          <Key
            label="D"
            hint="Right"
            active={isActive("d")}
            disabled={!driveMode}
            onDown={pressStart("d")}
            onUp={pressEnd("d")}
          />
        </div>
      </div>

      <p className="mt-2 text-center text-xs text-gray-500">
        Single-press only (no combos)
      </p>
    </div>
  );
}

function Key({
  label,
  hint,
  active,
  disabled,
  onDown,
  onUp,
}: {
  label: "W" | "A" | "S" | "D";
  hint: string;
  active?: boolean;
  disabled?: boolean;
  onDown?: (e: React.PointerEvent) => void;
  onUp?: (e: React.PointerEvent) => void;
}) {
  const arrow =
    label === "W" ? "↑" : label === "S" ? "↓" : label === "A" ? "←" : "→";

  return (
    <button
      type="button"
      disabled={disabled}
      onPointerDown={onDown}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      onPointerLeave={onUp}
      className={[
        "relative h-16 w-16 rounded-2xl border text-center transition-all duration-150",
        "bg-white/80 backdrop-blur-md dark:bg-white/10",
        "shadow-sm hover:shadow-md active:shadow-sm",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
        active
          ? "border-blue-600 ring-4 ring-blue-300 scale-105"
          : "border-gray-200 hover:border-gray-300",
      ].join(" ")}
      aria-pressed={!!active}
      aria-label={`${hint} (${label})`}
      title={hint}
    >
      {active && (
        <span className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-blue-100/60 blur-md" />
      )}
      <div
        className={`flex h-full flex-col items-center justify-center leading-none ${
          active
            ? "font-extrabold text-blue-700 dark:text-blue-300"
            : "font-semibold"
        }`}
      >
        <div className="text-xl">{label}</div>
        <div className="mt-0.5 text-[11px] text-gray-500">
          {arrow} {hint}
        </div>
      </div>
    </button>
  );
}
