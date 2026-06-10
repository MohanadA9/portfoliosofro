import { useEffect, useRef, useState } from "react";
export function OtpInput({ length = 6, value, onChange, onComplete, autoFocus = true }) {
  const [digits, setDigits] = useState(() =>
    Array.from(
      {
        length,
      },
      (_, i) => value[i] ?? "",
    ),
  );
  const refs = useRef([]);
  useEffect(() => {
    setDigits(
      Array.from(
        {
          length,
        },
        (_, i) => value[i] ?? "",
      ),
    );
  }, [value, length]);
  useEffect(() => {
    if (autoFocus) refs.current[0]?.focus();
  }, [autoFocus]);
  const update = (next) => {
    setDigits(next);
    const joined = next.join("");
    onChange(joined);
    if (joined.length === length && next.every(Boolean)) onComplete?.(joined);
  };
  const setAt = (idx, ch) => {
    const c = ch.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[idx] = c;
    update(next);
    if (c && idx < length - 1) refs.current[idx + 1]?.focus();
  };
  const onKey = (e, idx) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) refs.current[idx - 1]?.focus();
    if (e.key === "ArrowLeft" && idx > 0) refs.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < length - 1) refs.current[idx + 1]?.focus();
  };
  const onPaste = (e) => {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!text) return;
    e.preventDefault();
    const next = Array.from(
      {
        length,
      },
      (_, i) => text[i] ?? "",
    );
    update(next);
    refs.current[Math.min(text.length, length - 1)]?.focus();
  };
  return (
    <div className="flex justify-center gap-2 sm:gap-3" onPaste={onPaste}>
      {digits.map((d, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => setAt(i, e.target.value)}
          onKeyDown={(e) => onKey(e, i)}
          onFocus={(e) => e.target.select()}
          className="size-12 sm:size-14 text-center text-xl font-display font-bold rounded-xl border-2 border-input bg-card focus:border-electric focus:outline-none focus:ring-2 focus:ring-electric/30 transition"
          aria-label={`Digit ${i + 1}`}
        />
      ))}
    </div>
  );
}
