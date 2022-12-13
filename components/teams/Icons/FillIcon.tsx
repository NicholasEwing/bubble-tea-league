interface FillIconProps {
  width?: number;
  height?: number;
}

export default function FillIcon({ width = 48, height = 48 }: FillIconProps) {
  return (
    <svg
      className="icon"
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 400 400"
    >
      <path
        fillRule="evenodd"
        fill="#c79e57"
        d="M58.824,223.529H341.176L364.706,200l-23.53-23.529H58.824L35.294,200Zm235.294,82.353L152.941,70.588,117.647,58.824,105.882,94.118,247.059,329.412l35.294,11.764Zm0-211.764L152.941,329.412l-35.294,11.764-11.765-35.294L247.059,70.588l35.294-11.765Z"
      ></path>
    </svg>
  );
}
