import React, { useEffect, useState } from "react";
import { MentorCard } from "./MentorCard";
import { mentorService } from "@/Services/MentorService";
import { toast } from "sonner";
import LoadingComponent from "../Loading/LoadingComponent";

const MentorsPage = () => {
  const [loading, setLoading] = useState(true);
  const [mentors, setMentors] = useState([]);

  useEffect(() => {
    fetchAllMentors();
  }, []);

  const fetchAllMentors = async () => {
    setLoading(true);
    try {
      const mentorsList = await mentorService.getAllMentors();
      if (mentorsList?.mentors) {
        setMentors(mentorsList.mentors);
      } else {
        throw new Error("Failed to load mentors.");
      }
    } catch (err) {
      console.error("Error loading mentors:", err);
      toast.error(err.message || "Failed to load mentors.", {
        action: {
          label: "Retry",
          onClick: () => fetchAllMentors(),
        },
      });
    } finally {
      // runs after success AND error, so the loader never gets stuck
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingComponent />;
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-4">
      <header className="mb-6">
        <h1 className="mb-1! text-3xl!">Ask A Tech Sister</h1>
        <p className="mb-0! text-sm! text-(--ts-text)!">
          Connect with experienced mentors for career advice, interview prep
          and more.
        </p>
      </header>

      {mentors.length > 0 ? (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-6">
          {mentors.map((mentor) => (
            <MentorCard key={mentor.mentorId} mentor={mentor} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-(--ts-surface) bg-(--ts-bg-soft) px-6 py-12 text-center">
          <p className="mb-0! max-w-md text-sm! text-[#747474]!">
            Uh oh! Looks like there are no mentors available at the moment.
          </p>
        </div>
      )}
    </section>
  );
};

export default MentorsPage;
