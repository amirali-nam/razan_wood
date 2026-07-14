export default function Logo({ stroke = '#fffdf8', width = 24, height = 28 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 26 30" fill="none" aria-hidden="true">
      <path
        d="M13 29V14M13 14C13 14 8 12 5 7M13 14c0 0 5-2 8-7M13 14c0-5-1-9 0-13M8 10C6 8 4 7 2 6.5M18 10c2-2 4-3 6-3.5"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
