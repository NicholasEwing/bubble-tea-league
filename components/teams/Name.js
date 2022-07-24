import React from "react";

export default function Name({ name, role }) {
  return (
    <div className="name">
      <p className="text-xl lg:text-4xl font-medium">{name}</p>
      <p className="text-md lg:text-xl text-[#8fa3b0] tracking-tight">{role}</p>
    </div>
  );
}
