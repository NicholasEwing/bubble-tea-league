MatchSection.defaultProps = {
  bgClass: "bg-black",
};

interface MatchSectionProps {
  children: JSX.Element[];
  bgClass: string;
  hideOnDesktop: boolean;
  left: boolean;
}

export default function MatchSection({
  children,
  bgClass,
  hideOnDesktop,
  left,
}: MatchSectionProps) {
  let justifyClass = "justify-center";
  if (left) {
    justifyClass = "justify-left";
  }

  return (
    <section
      className={`flex ${justifyClass} ${bgClass} ${
        hideOnDesktop ? "sm:hidden" : ""
      } h-16 items-center border-b border-b-[#252c32] text-lg text-white`}
    >
      {children}
    </section>
  );
}
