import { ArrowDown, CalendarDays, History, Loader2, Search, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import EventCard from "../Events/EventCard/EventCard";
import eventService from "../Services/EventService";

function Dashboard() {
  const [allEvents, setAllEvents] = useState([]);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);
  const [activeTab, setActiveTab] = useState("UPCOMING"); // "upcoming" | "past"

  // Pagination state
  const [pageSize] = useState(3);
  const [totalPages, setTotalPages] = useState(0);

  const [searchInput, setSearchInput] = useState(""); // raw input (instant)
  const [searchQuery, setSearchQuery] = useState(""); // debounced (triggers fetch)

  const isFetchingRef = useRef(false);
  const currentPageRef = useRef(0);
  const debounceTimer = useRef(null);

  // Initial load
  useEffect(() => {
    fetchEvents(0, activeTab, searchQuery);
  }, []);

  // Tab / search reset
  useEffect(() => {
    currentPageRef.current = 0;
    setAllEvents([]);
    fetchEvents(0, activeTab, searchQuery);
  }, [activeTab, searchQuery]);

  // ── Debounce: commit searchQuery 500ms after user stops typing ──
  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 800);
    return () => clearTimeout(debounceTimer.current);
  }, [searchInput]);

  const fetchEvents = async (page, type = "UPCOMING", query = "") => {
    if (page > 0 && isFetchingRef.current) return;

    if (page > 0) {
      isFetchingRef.current = true;
      setIsFetchingMore(true);
    }

    try {
      // Only set global loading for the first page
      if (page === 0) {
        setIsLoading(true);
        setLoadFailed(false);
      }

      const response = await eventService.getAllEvents(
        page,
        pageSize,
        type,
        query,
      );

      if (response.success && response.events) {
        setAllEvents((prevEvents) => {
          // If it's page 0 (initial load/tab switch), replace the list
          if (page === 0) return response.events;

          // Otherwise, append new events to the old ones
          const combined = [...prevEvents, ...response.events];

          // Optional: Deduplicate by eventId just in case the API sends duplicates
          return Array.from(
            new Map(combined.map((e) => [e.eventId, e])).values(),
          );
        });
        setTotalPages(response.totalPages || 0);

        console.log(allEvents);

        currentPageRef.current = page;
      } else if (response.events && response.events.length === 0) {
        if (page === 0) {
          setAllEvents([]);
          setTotalPages(0);
          currentPageRef.current = 0;
        } else {
          setTotalPages(page);
        }
      } else {
        if (page === 0) setLoadFailed(true);
        const message = response.message || "Failed to load events.";
        toast.error(message, {
          action: {
            label: "Retry",
            onClick: () => fetchEvents(page, type, query),
          },
        });
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      if (page === 0) setLoadFailed(true);
      toast.error("Failed to load events. Please try again.", {
        action: {
          label: "Retry",
          onClick: () => fetchEvents(page, type, query),
        },
      });
    } finally {
      if (page === 0) {
        setIsLoading(false);
      } else {
        isFetchingRef.current = false;
        setIsFetchingMore(false);
      }
    }
  };

  const handleLoadMore = () => {
    if (currentPageRef.current + 1 < totalPages) {
      fetchEvents(currentPageRef.current + 1, activeTab, searchQuery);
    }
  };

  // LOADING UI
  if (isLoading) {
    return (
      <div className="mx-auto min-h-screen w-full max-w-[1200px] px-4 py-10 md:px-5 md:pt-8 md:pb-[60px]">
        <div className="mb-12 flex justify-center">
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="mb-5 flex flex-col gap-3 md:flex-row md:gap-4">
          <Skeleton className="h-[50px] flex-1" />
          <Skeleton className="h-[50px] w-full md:w-[248px]" />
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }, (_, index) => (
            <div
              key={index}
              className="overflow-hidden rounded-xl border border-[#C2D7ED] bg-white"
            >
              <Skeleton className="h-48 w-full rounded-none" />
              <div className="space-y-4 p-5">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleClear = () => {
    setSearchInput("");
    setSearchQuery("");
  };

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    clearTimeout(debounceTimer.current);
    setSearchQuery(searchInput);
  };

  return (
    <div className="mx-auto min-h-screen w-full max-w-[1200px] px-4 py-10 md:px-5 md:pt-8 md:pb-[60px]">
      <div className="mb-12 text-center">
        <h1 className="!mb-0 !text-[2.5rem] !font-bold !text-[#0F3363] max-md:!text-[2rem]">
          Events
        </h1>
      </div>

      {/* 🔍 Search + Toggle */}
      <div className="mb-5 flex flex-col items-stretch gap-3 md:flex-row md:gap-4">
        {/* Search Bar */}
        <form className="min-w-0 flex-1" onSubmit={handleSearchSubmit}>
          <Field orientation="horizontal" className="items-center">
            <FieldLabel htmlFor="event-search" className="sr-only">
              Search events
            </FieldLabel>
            <ButtonGroup className="min-w-0 flex-1">
              <Input
                id="event-search"
                type="search"
                placeholder="Search events, keywords, topics..."
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                className="h-[50px]"
              />
              <Button type="submit" variant="outline" className="h-[50px]">
                <Search aria-hidden="true" />
                <span>Search</span>
              </Button>
            </ButtonGroup>
            {searchInput && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={handleClear}
                aria-label="Clear search"
                className="h-[50px] w-[50px]"
              >
                <X aria-hidden="true" />
              </Button>
            )}
          </Field>
        </form>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full md:w-auto"
        >
          <TabsList className="h-[50px] w-full justify-stretch rounded-[15px] bg-gray-200 p-1 md:w-auto">
            <TabsTrigger
              value="UPCOMING"
              className="h-12 min-w-[120px] flex-1 rounded-[12px] px-6 text-base font-medium text-gray-500 transition-colors hover:text-black data-active:bg-[#0F3363] data-active:text-white md:flex-initial"
            >
              <CalendarDays aria-hidden="true" />
              Upcoming
            </TabsTrigger>
            <TabsTrigger
              value="PAST"
              className="h-12 min-w-[120px] flex-1 rounded-[12px] px-6 text-base font-medium text-gray-500 transition-colors hover:text-black data-active:bg-[#0F3363] data-active:text-white md:flex-initial"
            >
              <History aria-hidden="true" />
              Past
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Events Grid */}
      {loadFailed ? null : allEvents.length === 0 ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center px-6 py-12 text-center">
          <div className="mb-5 flex size-14 items-center justify-center rounded-full bg-[#FBF1E8] text-[#0F3363]">
            {activeTab === "PAST" ? (
              <History aria-hidden="true" className="size-6" />
            ) : (
              <CalendarDays aria-hidden="true" className="size-6" />
            )}
          </div>
          <h2 className="!mb-2 !text-xl !font-semibold !text-[#0F3363]">
            {searchQuery
              ? "No events match your search"
              : activeTab === "PAST"
                ? "No past events yet"
                : "No upcoming events right now"}
          </h2>
          <p className="!mb-0 max-w-md !text-sm !text-[#747474]">
            {searchQuery
              ? "Try a different search term or clear your search."
              : activeTab === "PAST"
                ? "Past events will appear here after they’ve taken place."
                : "Check back soon for upcoming Tech Sisters events."}
          </p>
          {searchQuery && (
            <Button
              type="button"
              variant="outline"
              onClick={handleClear}
              className="mt-5 border-[#C2D7ED] text-[#0F3363]"
            >
              Clear search
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {allEvents.map((event) => (
            <div key={event.eventId} className="h-full [&_.event-card]:!max-w-none">
              <EventCard event={event} />
            </div>
          ))}
        </div>
      )}

      {!loadFailed && allEvents.length > 0 && currentPageRef.current + 1 < totalPages && (
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

export default Dashboard;
