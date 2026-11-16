import { mentorService } from "@/Services/MentorService";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LoadingComponent from "../../Loading/LoadingComponent";
import "../../Events/EventDetails/EventDetailsPage.css";

const MentorDetails = () => {
  const { mentorId } = useParams();
  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  

  useEffect(() => {
    if (!mentorId) {
      setLoading(false);
      return;
    }

    async function loadMentorProfile() {
      setLoading(true);

      try {
        const response = await mentorService.getMentorProfile(mentorId);
        const dto = response?.mentor ?? response?.data ?? response ?? null;
        setMentor(dto);
      } catch (error) {
        console.error("Failed to load mentor profile", error);
        setMentor(null);
      } finally {
        setLoading(false);
      }
    }

    loadMentorProfile();
  }, [mentorId]);

  if (loading) {
    return (
      <div className="mx-auto min-h-screen w-full max-w-[1200px] px-4 py-10 md:px-5 md:pt-8 md:pb-[60px]">
        <LoadingComponent />
      </div>
    );
  }

  if (!mentor) {
    return (
      <div className="event-details-page-root">
        <main className="event-left">
          <h1 className="event-hero-title">Mentor not found</h1>
          <p className="overview-text">
            This mentor profile may have been removed or the link may be
            incorrect.
          </p>
        </main>
      </div>
    );
  }

  return (
    <div className="event-details-page-root">
      <div className="event-details-inner">
        <main className="event-left">
          <h1 className="event-hero-title">{mentor.name}</h1>

          <div className="event-meta-row">
            <div className="meta-item">
              <span className="meta-icon" aria-hidden="true">👩‍💻</span>
              <strong>{mentor.headline || "Mentor"}</strong>
            </div>
            <div className="meta-item">
              <span className="meta-icon" aria-hidden="true">
                {mentor.available ? "🟢" : "⚪"}
              </span>
              <span>{mentor.available ? "Available" : "Busy"}</span>
            </div>
          </div>

          <hr className="separator" />

          <section className="overview">
            <h2 className="section-heading">About</h2>
            <p className="overview-text">
              {mentor.bio || "This mentor has not added a profile bio yet."}
            </p>

            {mentor.specialties?.length > 0 && (
              <div className="event-categories">
                <span className="cat-label">Specialties:</span>
                {mentor.specialties.map((specialty, index) => (
                  <span
                    key={specialty.specialtyId || specialty.name}
                    className={`cat-pill ${
                      index === mentor.specialties.length - 1 ? "active" : ""
                    }`}
                  >
                    {specialty.name}
                  </span>
                ))}
              </div>
            )}
          </section>
        </main>

        <aside className="event-right">
          <div className="right-card simple-actions">
            <h2 className="section-heading">Mentor availability</h2>
            <div className="right-details">
              <div className="detail-row">
                <span className="detail-label">Status</span>
                <span className="detail-value">
                  {mentor.available ? "Available" : "Busy"}
                </span>
              </div>
            </div>

            {mentor.meetingLink ? (
              <a
                href={mentor.meetingLink}
                target="_blank"
                rel="noreferrer"
                className="action-btn reserve-btn action-btn-link"
              >
                Join meeting
              </a>
            ) : (
              <p className="overview-text">
                Meeting link not available yet.
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default MentorDetails;
