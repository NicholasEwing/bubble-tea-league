import React from "react";

export default function MatchContainer(props) {
  return (
    <div className="grid place-items-center">
      <h1>Match Results</h1>
      <p>Page for Match ID: {props.matchId}</p>
      {props.children}
    </div>
  );
}
