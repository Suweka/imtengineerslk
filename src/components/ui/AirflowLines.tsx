export function AirflowLines({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 800 400"
      preserveAspectRatio="none"
      className={`pointer-events-none absolute inset-0 h-full w-full ${className}`}
    >
      <path
        d="M -50 90 C 150 60, 250 130, 450 95 S 750 60, 900 100"
        fill="none"
        stroke="#1C75BC"
        strokeWidth="2.5"
        strokeLinecap="round"
        className="airflow-line"
        style={{ opacity: 0.28, animationDuration: "9s" }}
      />
      <path
        d="M -50 190 C 180 220, 260 150, 470 195 S 760 230, 900 190"
        fill="none"
        stroke="#1C75BC"
        strokeWidth="2"
        strokeLinecap="round"
        className="airflow-line"
        style={{ opacity: 0.2, animationDuration: "11s", animationDelay: "-3s" }}
      />
      <path
        d="M -50 280 C 160 250, 300 320, 480 275 S 780 240, 900 285"
        fill="none"
        stroke="#1C75BC"
        strokeWidth="1.5"
        strokeLinecap="round"
        className="airflow-line"
        style={{ opacity: 0.16, animationDuration: "13s", animationDelay: "-6s" }}
      />
    </svg>
  );
}
