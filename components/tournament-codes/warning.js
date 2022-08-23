/* This example requires Tailwind CSS v2.0+ */
import { ExclamationIcon } from "@heroicons/react/solid";

export default function Warning() {
  return (
    <div className="rounded-md bg-yellow-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationIcon
            className="h-5 w-5 text-yellow-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-yellow-800">
            Private Info - For Player Use Only
          </h3>
          <div className="mt-2 text-sm text-yellow-700">
            <strong>TL;DR:</strong>
            <ul role="list" className="my-2 list-disc space-y-1 pl-5">
              <li>Don't share tournament codes with the public.</li>
              <li>Only use codes associated with your team's matches.</li>
              <li>
                Always ensure you're using the correct code depending on the
                team you're facing.
              </li>
            </ul>
            <p>
              Only players authenticated via Discord that have an email
              registered with the Bubble Tea League can view this page. Do NOT
              share any tournament codes from this table to the general public.
              <br />
              Only use the tournament codes associated with your team's matches.
              Using the incorrect code or sharing codes could compromise the
              entire tournament by allowing third-parties to generate fake
              statistics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
