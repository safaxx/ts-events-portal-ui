import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Files in /public are served from the site root, so no "/public" in the path.
const DEFAULT_MENTOR_IMAGE = "/eventcard.jpg";

export function MentorCard({ mentor }) {
  return (
    <Card className="h-full w-full gap-3 overflow-hidden rounded-xl border border-(--ts-light-blue) bg-white pt-0 pb-5 font-[Poppins] shadow-[0_2px_12px_rgba(17,34,80,0.08)] ring-0 transition-all duration-300 hover:-translate-y-1.5 hover:border-(--ts-secondary) hover:bg-(--ts-bg-soft) hover:shadow-[0_8px_24px_rgba(17,34,80,0.15)]">
      <img
        src={DEFAULT_MENTOR_IMAGE}
        alt={`${mentor.name} cover`}
        className="block h-32 w-full rounded-t-xl object-cover object-center"
      />

      <CardHeader className="gap-1 px-5">
        <CardTitle className="m-0 text-lg leading-snug font-bold text-(--ts-primary)">
          {mentor.name}
        </CardTitle>
        <CardAction>
          <Badge
            variant="secondary"
            className={`h-auto rounded-lg border px-2.5 py-0.5 text-xs font-semibold ${
              mentor.available
                ? "border-green-200 bg-green-50 text-green-700"
                : "border-(--ts-surface) bg-(--ts-bg-soft) text-(--ts-text)"
            }`}
          >
            {mentor.available ? "Available" : "Busy"}
          </Badge>
        </CardAction>
        <p className="mb-0! text-sm! font-semibold text-(--ts-secondary)!">
          {mentor.headline}
        </p>
      </CardHeader>

      <div className="flex flex-col gap-3 px-5">
        <CardDescription className="m-0 line-clamp-3 text-[13px] leading-relaxed text-[#404040]">
          {mentor.bio}
        </CardDescription>

        {mentor.specialties?.length > 0 && (
          <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
            {mentor.specialties.map((specialty) => (
              <li
                key={specialty.specialtyId}
                className="rounded-lg border border-(--ts-surface) bg-(--ts-bg-soft) px-2.5 py-1 text-xs font-semibold text-(--ts-primary)"
              >
                {specialty.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <CardFooter className="mt-auto border-t-0 bg-transparent px-5">
        <Button className="h-auto w-full cursor-pointer rounded-lg bg-(--ts-primary) px-5 py-2.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(17,34,80,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-(--ts-secondary) hover:shadow-[0_6px_16px_rgba(17,34,80,0.4)]">
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
}
