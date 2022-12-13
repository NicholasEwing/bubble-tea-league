interface TopIconProps {
  width?: number;
  height?: number;
}

export default function TopIcon({ width = 48, height = 48 }: TopIconProps) {
  return (
    <svg
      className="icon"
      width={width}
      height={height}
      viewBox="0 0 400 400"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          fillRule="evenodd"
          fill="#555d64"
          d="M247.059, 247.059V164.706H164.706v82.353h82.353ZM352.936, 352.933V82.537l-47.054, 46.875v176.47l-176.309.019L82.532,352.933h270.4Z"
        ></path>
        <path
          fillRule="evenodd"
          fill="#c79e57"
          d="M329.946, 47.1l-59.358,58.787H105.882V270.588L47.1,329.945,47.059,47.059Z"
        ></path>
      </g>
    </svg>
  );
}
