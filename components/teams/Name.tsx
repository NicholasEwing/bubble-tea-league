interface NameProps {
  name: string;
  role: string;
}

export default function Name({ name, role }: NameProps) {
  return (
    <div className="name">
      <p className="text-xl font-medium lg:text-4xl">{name}</p>
      <p className="text-md tracking-tight text-[#8fa3b0] lg:text-xl">{role}</p>
    </div>
  );
}
