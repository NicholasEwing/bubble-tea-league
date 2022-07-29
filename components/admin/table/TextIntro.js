import React from "react";

export default function TextIntro() {
  return (
    <div className="sm:flex-auto">
      <h1 className="text-xl font-semibold text-white">Matches</h1>
      <p className="mt-2 text-sm text-gray-400">
        A list of all the matches in the Bubble Tea League including their
        format, time, teams, and season.
      </p>
      <p className="mt-2 text-sm text-gray-400">
        Matches are only generated when creating a new season and can&apos;t be
        deleted.
      </p>
    </div>
  );
}
