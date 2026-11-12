import { ArrowDown, CalendarDays, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import eventService from "../../../Services/EventService";
import LoadingComponent from "../../Loading/LoadingComponent";
import EventCard from "../EventCard/EventCard";
import "./MyEventsPage.css";

export default function MyEventsPage() {
  const [activeTab, setActiveTab] = useState("created"); // "rsvps" | "created"
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [myCreatedEvents, setMyCreatedEvents] = useState([]);
  const [myRsvps, setMyRsvps] = useState([]);

  // Pagination state — separate tracking per tab
  const [pageSize] = useState(3);
  const [createdTotalPages, setCreatedTotalPages] = useState(0);
  const [createdTotalElements, setCreatedTotalElements] = useState(0);

  const createdPageRef = useRef(0);
  const [rsvpsTotalPages, setRsvpsTotalPages] = useState(0);
  const [rsvpTotalElements, setRsvpTotalElements] = useState(0);
  const rsvpsPageRef = useRef(0);
  const isFetchingMoreRef = useRef(false);

  // Track which tabs have already been fetched to avoid redundant calls
  const hasFetchedCreated = useRef(false);
  const hasFetchedRsvps = useRef(false);

  // Lazy fetch: only load data for the active tab (and only once per tab)
  useEffect(() => {
    if (activeTab === "created" && !hasFetchedCreated.current) {
      fetchCreatedEvents(0);
    } else if (activeTab === "rsvps" && !hasFetchedRsvps.current) {
      fetchRsvps(0);
    }
  }, [activeTab]);

  const fetchCreatedEvents = async (page) => {
    if (page > 0 && isFetchingMoreRef.current) return;
    if (page > 0) {
      isFetchingMoreRef.current = true;
      setIsFetchingMore(true);
    }

    try {
      if (page === 0) setLoading(true);
      const created = await eventService.getMyCreatedEvents(page, pageSize);

      if (created?.events) {
        setMyCreatedEvents((prev) => {
          if (page === 0) return created.events;
          // Append & deduplicate
          const combined = [...prev, ...created.events];
          return Array.from(
            new Map(combined.map((e) => [e.eventId, e])).values(),
          );
        });
        setCreatedTotalPages(created.totalPages || 0);
        setCreatedTotalElements(created.totalElements || 0);
        createdPageRef.current = page;
      } else {
        throw new Error("Failed to load created events.");
      }
      hasFetchedCreated.current = true;
    } catch (err) {
      console.error("Error loading created events:", err);
      toast.error(err.message || "Failed to load created events.", {
        action: {
          label: "Retry",
          onClick: () => fetchCreatedEvents(page),
        },
      });
    } finally {
      if (page === 0) {
        setLoading(false);
      } else {
        isFetchingMoreRef.current = false;
        setIsFetchingMore(false);
      }
    }
  };

  const fetchRsvps = async (page) => {
    if (page > 0 && isFetchingMoreRef.current) return;
    if (page > 0) {
      isFetchingMoreRef.current = true;
      setIsFetchingMore(true);
    }

    try {
      if (page === 0) setLoading(true);
      const rsvps = await eventService.getMyRSVPs(page, pageSize);

      if (rsvps?.events) {
        setMyRsvps((prev) => {
          if (page === 0) return rsvps.events;
          // Append & deduplicate
          const combined = [...prev, ...rsvps.events];
          return Array.from(
            new Map(combined.map((e) => [e.eventId, e])).values(),
          );
        });
        setRsvpsTotalPages(rsvps.totalPages || 0);
        setRsvpTotalElements(rsvps.totalElements || 0);
        rsvpsPageRef.current = page;
      } else {
        throw new Error("Failed to load RSVPs.");
      }
      hasFetchedRsvps.current = true;
    } catch (err) {
      console.error("Error loading RSVPs:", err);
      toast.error(err.message || "Failed to load RSVPs.", {
        action: {
          label: "Retry",
          onClick: () => fetchRsvps(page),
        },
      });
    } finally {
      if (page === 0) {
        setLoading(false);
      } else {
        isFetchingMoreRef.current = false;
        setIsFetchingMore(false);
      }
    }
  };

  const handleLoadMore = () => {
    if (isFetchingMoreRef.current) return;
    if (activeTab === "created" && createdPageRef.current + 1 < createdTotalPages) {
      fetchCreatedEvents(createdPageRef.current + 1);
    } else if (activeTab === "rsvps" && rsvpsPageRef.current + 1 < rsvpsTotalPages) {
      fetchRsvps(rsvpsPageRef.current + 1);
    }
  };



  // LOADING UI
  if (loading) {
    return (
      <div className="mx-auto min-h-screen w-full max-w-[1200px] px-4 py-10 md:px-5 md:pt-8 md:pb-[60px]">
        <LoadingComponent />
      </div>
    );
  }

  const activeList = activeTab === "created" ? myCreatedEvents : myRsvps;
  const hasMoreEvents =
    activeTab === "created"
      ? createdPageRef.current + 1 < createdTotalPages
      : rsvpsPageRef.current + 1 < rsvpsTotalPages;

  return (
    <div className="my-events-page">
      {/* <h2 className="section-title">
        {activeTab === "created" ? "My Created Events" : "My RSVPs"}
      </h2> */}

      {/* --- Toggle Buttons (same style as Dashboard) --- */}
      <div className="mb-12 flex flex-wrap justify-center gap-4 max-md:w-full max-md:flex-col max-md:gap-3">
        <button
          className={`flex items-center justify-center gap-2.5 rounded-lg border-2 px-7 py-3.5 text-[15px] font-semibold shadow-[0_2px_8px_rgba(15,51,99,0.08)] transition-all max-md:w-full ${
            activeTab === "created"
              ? "border-[#0F3363] bg-[#0F3363] text-white shadow-[0_4px_16px_rgba(15,51,99,0.3)]"
              : "border-[#C2D7ED] bg-white text-[#4970A5] hover:-translate-y-0.5 hover:border-[#0F3363] hover:bg-[#FBF1E8] hover:text-[#0F3363] hover:shadow-[0_4px_12px_rgba(15,51,99,0.15)]"
          }`}
          onClick={() => setActiveTab("created")}
        >
          Created Events ({createdTotalElements})
        </button>

        <button
          className={`flex items-center justify-center gap-2.5 rounded-lg border-2 px-7 py-3.5 text-[15px] font-semibold shadow-[0_2px_8px_rgba(15,51,99,0.08)] transition-all max-md:w-full ${
            activeTab === "rsvps"
              ? "border-[#0F3363] bg-[#0F3363] text-white shadow-[0_4px_16px_rgba(15,51,99,0.3)]"
              : "border-[#C2D7ED] bg-white text-[#4970A5] hover:-translate-y-0.5 hover:border-[#0F3363] hover:bg-[#FBF1E8] hover:text-[#0F3363] hover:shadow-[0_4px_12px_rgba(15,51,99,0.15)]"
          }`}
          onClick={() => setActiveTab("rsvps")}
        >
          My RSVPs ({rsvpTotalElements})
        </button>
      </div>

      {/* Events grid */}
      {activeList.length > 0 ? (
        <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {activeList.map((event) => (
            <div key={event.eventId} className="h-full [&_.event-card]:!max-w-none">
              <EventCard event={event} />
            </div>
          ))}
        </div>
      ) : (
        <div className="flex min-h-[320px] flex-col items-center justify-center px-6 py-12 text-center">
          <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-[#FBF1E8] text-[#0F3363]">
            <CalendarDays aria-hidden="true" className="size-6" />
          </div>
          <h2 className="!mb-2 !text-xl !font-semibold !text-[#0F3363]">
            {activeTab === "created" ? "No created events yet" : "No RSVPs yet"}
          </h2>
          <p className="!mb-0 max-w-md !text-sm !text-[#747474]">
            {activeTab === "created"
              ? "Events you create will appear here."
              : "Events you RSVP to will appear here."}
          </p>
        </div>
      )}

      {activeList.length > 0 && hasMoreEvents && (
        <div className="mt-8 flex justify-center">
          <Button
            type="button"
            variant="outline"
            onClick={handleLoadMore}
            disabled={isFetchingMore}
            className="h-10 min-w-36 gap-2 border-[#C2D7ED] px-5 text-[#0F3363] hover:bg-[#FBF1E8] disabled:opacity-60"
          >
            {isFetchingMore ? (
              <>
                <Loader2 aria-hidden="true" className="animate-spin" />
                Loading more
              </>
            ) : (
              <>
                <ArrowDown aria-hidden="true" />
                Load more
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
