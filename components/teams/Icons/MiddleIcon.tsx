interface MiddleIconProps {
  width?: number;
  height?: number;
}

export default function MiddleIcon({
  width = 48,
  height = 48,
}: MiddleIconProps) {
  return (
    <svg
      className="icon"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 400 400"
    >
      <g>
        <path
          fillRule="evenodd"
          fill="#555d64"
          d="M305.755,199.6L352.9,152.569l0.039,200.372h-200L200,305.882H305.883Zm-58.7-152.541L199.753,94.1H94.1L94.117,200,47.065,246.79V47.068Z"
        ></path>
        <path
          fillRule="evenodd"
          fill="#c79e57"
          d="M105.882,352.941l247.06-247.059V47.059H294.118L47.059,294.117v58.824h58.823Z"
        ></path>
      </g>
    </svg>
  );
}
