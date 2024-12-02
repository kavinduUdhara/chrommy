export default function GeminiSVG() {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      stroke-width="0"
      role="img"
      viewBox="0 0 24 24"
      class="#gradientSVG"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="grad1" x1="10%" x2="100%" y1="10%" y2="0%">
          <stop offset="10%" stop-color="#4285f4" />
          <stop offset="50%" stop-color="#9b72cb" />
          <stop offset="80%" stop-color="#d96570" />
          <stop offset="90%" stop-color="#d96570" />
        </linearGradient>
      </defs>
      <path
        fill="url(#grad1)"
        d="M11.04 19.32Q12 21.51 12 24q0-2.49.93-4.68.96-2.19 2.58-3.81t3.81-2.55Q21.51 12 24 12q-2.49 0-4.68-.93a12.3 12.3 0 0 1-3.81-2.58 12.3 12.3 0 0 1-2.58-3.81Q12 2.49 12 0q0 2.49-.96 4.68-.93 2.19-2.55 3.81a12.3 12.3 0 0 1-3.81 2.58Q2.49 12 0 12q2.49 0 4.68.96 2.19.93 3.81 2.55t2.55 3.81"
      ></path>
    </svg>
  );
}
