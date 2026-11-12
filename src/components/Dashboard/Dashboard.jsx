import {
  ArrowDown,
  CalendarDays,
  Check,
  ChevronDown,
  History,
  ListFilter,
  Loader2,
  Search,
  X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import EventCard from "../Events/EventCard/EventCard";
import eventService from "../../Services/EventService";
import authService from "../../Services/AuthService";

function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const requestedScope = searchParams.get("scope");
  const scope = ["rsvps", "created"].includes(requestedScope) ? requestedScope : "all";
  const activeTab = searchParams.get("time") === "PAST" ? "PAST" : "UPCOMING";
  const [allEvents, setAllEvents] = useState([]);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadFailed, setLoadFailed] = useState(false);

  // Pagination state
  const pageSize = 3;
  const [totalPages, setTotalPages] = useState(0);

  const [searchInput, setSearchInput] = useState(""); // raw input (instant)
  const [searchQuery, setSearchQuery] = useState(""); // debounced (triggers fetch)

  const isFetchingRef = useRef(false);
  const requestIdRef = useRef(0);
  const currentPageRef = useRef(0);
  const debounceTimer = useRef(null);

  // Reload page one whenever the selected event scope or time range changes.
  useEffect(() => {
    if (scope !== "all" && !authService.isAuthenticated()) {
      const returnParams = new URLSearchParams(searchParams);
      returnParams.set("scope", scope);
      returnParams.set("time", activeTab);
      navigate("/login", {
        state: {
          from: {
            pathname: location.pathname,
            search: `?${returnParams.toString()}`,
          },
        },
      });
      return;
    }

    currentPageRef.current = 0;
    isFetchingRef.current = false;
    setIsFetchingMore(false);
    setAllEvents([]);
    fetchEvents(0, scope, activeTab, searchQuery);
  }, [scope, activeTab, searchQuery]);

  // ── Debounce: commit searchQuery 500ms after user stops typing ──
  useEffect(() => {
    clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(() => {
      setSearchQuery(searchInput);
    }, 800);
    return () => clearTimeout(debounceTimer.current);
  }, [searchInput]);

  const fetchEvents = async (page, selectedScope, type, query = "") => {
    if (page > 0 && isFetchingRef.current) return;

    const requestId = page === 0 ? ++requestIdRef.current : requestIdRef.current;
    if (page > 0) {
      isFetchingRef.current = true;
      setIsFetchingMore(true);
    } else {
      isFetchingRef.current = false;
      setIsFetchingMore(false);
    }

    try {
      // Only set global loading for the first page
      if (page === 0) {
        setIsLoading(true);
        setLoadFailed(false);
      }

      let response;
      if (selectedScope === "rsvps") {
        response = await eventService.getMyRSVPs(page, pageSize, type);
      } else if (selectedScope === "created") {
        response = await eventService.getMyCreatedEvents(page, pageSize, type);
      } else {
        response = await eventService.getAllEvents(page, pageSize, type, query);
      }

      if (requestId !== requestIdRef.current) return;
      if (Array.isArray(response?.events)) {
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
        currentPageRef.current = page;
      } else {
        if (page === 0) setLoadFailed(true);
        const message = response.message || "Failed to load events.";
        toast.error(message, {
          action: {
            label: "Retry",
            onClick: () => fetchEvents(page, selectedScope, type, query),
          },
        });
      }
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      console.error("Error fetching events:", err);
      if (page === 0) setLoadFailed(true);
      toast.error("Failed to load events. Please try again.", {
        action: {
          label: "Retry",
          onClick: () => fetchEvents(page, selectedScope, type, query),
        },
      });
    } finally {
      if (requestId === requestIdRef.current) {
        if (page === 0) {
          setIsLoading(false);
        } else {
          isFetchingRef.current = false;
          setIsFetchingMore(false);
        }
      }
    }
  };

  const handleLoadMore = () => {
    if (currentPageRef.current + 1 < totalPages) {
      fetchEvents(currentPageRef.current + 1, scope, activeTab, searchQuery);
    }
  };

  const handleScopeChange = (nextScope) => {
    if (nextScope !== "all" && !authService.isAuthenticated()) {
      const returnParams = new URLSearchParams(searchParams);
      returnParams.set("scope", nextScope);
      returnParams.set("time", activeTab);
      navigate("/login", {
        state: {
          from: {
            pathname: location.pathname,
            search: `?${returnParams.toString()}`,
          },
        },
      });
      return;
    }

    if (nextScope !== "all") {
      setSearchInput("");
      setSearchQuery("");
    }
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("scope", nextScope);
    setSearchParams(nextParams);
  };

  const handleTimeChange = (nextTime) => {
    const nextParams = new URLSearchParams(searchParams);
    nextParams.set("time", nextTime);
    setSearchParams(nextParams);
  };

  // LOADING UI
  if (isLoading) {
    return (
      <div className="mx-auto min-h-screen w-full max-w-[1200px] px-4 py-10 md:px-5 md:pt-8 md:pb-[60px]">
        <div className="mb-6 space-y-2">
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-4 w-72 max-w-full" />
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
      <header className="mb-6">
        <h1 className="mb-1! text-3xl!">Events</h1>
        <p className="mb-0! text-sm! text-(--ts-text)!">
          Discover upcoming Tech Sisters events, RSVP and join the community.
        </p>
      </header>

      <div className="mb-5 flex min-w-0 flex-nowrap items-center gap-1.5 lg:gap-3">
        {scope === "all" && (
          <form className="min-w-0 flex-1" onSubmit={handleSearchSubmit}>
            <Field
              orientation="horizontal"
              className="min-w-0 items-center gap-1 lg:gap-2"
            >
              <FieldLabel htmlFor="event-search" className="sr-only">
                Search events
              </FieldLabel>
              <ButtonGroup className="min-w-0 flex-1">
                <Input
                  id="event-search"
                  type="search"
                  placeholder="Search events..."
                  value={searchInput}
                  onChange={(event) => setSearchInput(event.target.value)}
                  className="h-10 min-w-0 rounded-l-xl border-[#D5E1EE] bg-white px-2 shadow-sm focus-visible:ring-[#0F3363]/20 lg:h-[50px] lg:px-3"
                />
                <Button
                  type="submit"
                  aria-label="Search events"
                  className="h-10 shrink-0 gap-1 rounded-r-xl bg-[#0F3363] px-2.5 text-white shadow-sm hover:bg-[#17477F] lg:h-[50px] lg:gap-2 lg:px-4"
                >
                  <Search aria-hidden="true" />
                  <span className="hidden lg:inline">Search</span>
                </Button>
              </ButtonGroup>
              {searchInput && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={handleClear}
                  aria-label="Clear search"
                  className="h-9 w-8 shrink-0 rounded-lg text-[#59718D] hover:bg-[#F1F6FB] hover:text-[#0F3363] lg:h-[50px] lg:w-[50px] lg:rounded-xl"
                >
                  <X aria-hidden="true" />
                </Button>
              )}
            </Field>
          </form>
        )}

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger
              aria-label={`Event scope: ${scope === "rsvps" ? "My RSVPs" : scope === "created" ? "Created by me" : "All events"}`}
              className="group flex h-10 w-[100px] items-center justify-between gap-1 rounded-xl border border-[#D5E1EE] bg-white px-1.5 text-xs font-semibold text-[#0F3363] shadow-sm transition hover:border-[#9DB7D2] hover:bg-[#F8FAFD] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F3363]/20 aria-expanded:border-[#0F3363] aria-expanded:bg-[#F1F6FB] aria-expanded:ring-2 aria-expanded:ring-[#0F3363]/15 max-[380px]:w-[84px] lg:h-[50px] lg:w-[190px] lg:gap-3 lg:px-4 lg:text-sm"
            >
              <span className="flex min-w-0 items-center gap-2">
                <ListFilter aria-hidden="true" className="size-3.5 shrink-0 text-[#547394] lg:size-4" />
                <span className="truncate lg:hidden">
                  {scope === "rsvps"
                    ? "RSVPs"
                    : scope === "created"
                      ? "Created"
                      : "All"}
                </span>
                <span className="hidden truncate lg:inline">
                  {scope === "rsvps"
                    ? "My RSVPs"
                    : scope === "created"
                      ? "Created by me"
                      : "All events"}
                </span>
              </span>
              <ChevronDown
                aria-hidden="true"
                className="size-3.5 shrink-0 text-[#547394] transition-transform group-aria-expanded:rotate-180 lg:size-4"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="start"
              sideOffset={6}
              className="min-w-[190px] rounded-xl border border-[#D5E1EE] bg-white p-1.5 shadow-[0_12px_32px_rgba(15,51,99,0.16)]"
            >
              {[
                { value: "all", label: "All events" },
                { value: "rsvps", label: "My RSVPs" },
                { value: "created", label: "Created by me" },
              ].map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleScopeChange(option.value)}
                  className="h-10 cursor-pointer rounded-lg px-3 text-sm font-medium text-[#425B78] focus:bg-[#EFF5FB] focus:text-[#0F3363]"
                >
                  {option.label}
                  {scope === option.value && (
                    <Check aria-hidden="true" className="ml-auto size-4 text-[#0F3363]" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <Tabs
            value={activeTab}
            onValueChange={handleTimeChange}
            className="w-[132px] shrink-0 max-[380px]:w-[120px] lg:w-auto"
          >
            <TabsList className="h-10 w-full justify-stretch rounded-xl border border-[#D5E1EE] bg-white p-1 shadow-sm lg:h-[50px] lg:w-auto">
              <TabsTrigger
                value="UPCOMING"
                className="h-8 min-w-0 flex-1 gap-0 rounded-lg px-0.5 text-[11px] font-semibold text-[#647A93] transition-all hover:bg-[#F3F7FB] hover:text-[#0F3363] data-active:bg-[#0F3363] data-active:text-white data-active:shadow-[0_2px_8px_rgba(15,51,99,0.2)] lg:h-10 lg:min-w-[118px] lg:gap-1.5 lg:px-4 lg:text-sm lg:flex-initial"
              >
                <CalendarDays aria-hidden="true" className="hidden size-4 lg:inline" />
                Upcoming
              </TabsTrigger>
              <TabsTrigger
                value="PAST"
                className="h-8 min-w-0 flex-1 gap-0 rounded-lg px-0.5 text-[11px] font-semibold text-[#647A93] transition-all hover:bg-[#F3F7FB] hover:text-[#0F3363] data-active:bg-[#0F3363] data-active:text-white data-active:shadow-[0_2px_8px_rgba(15,51,99,0.2)] lg:h-10 lg:min-w-[118px] lg:gap-1.5 lg:px-4 lg:text-sm lg:flex-initial"
              >
                <History aria-hidden="true" className="hidden size-4 lg:inline" />
                Past
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
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
            {scope === "all" && searchQuery
              ? "No events match your search"
              : scope === "rsvps"
                ? activeTab === "PAST"
                  ? "No past events in your RSVPs"
                  : "No upcoming events in your RSVPs"
                : scope === "created"
                  ? activeTab === "PAST"
                    ? "No past events created by you"
                    : "No upcoming events created by you"
                  : activeTab === "PAST"
                    ? "No past events yet"
                    : "No upcoming events right now"}
          </h2>
          <p className="!mb-0 max-w-md !text-sm !text-[#747474]">
            {scope === "all" && searchQuery
              ? "Try a different search term or clear your search."
              : scope === "rsvps"
                ? "Events you RSVP to will appear here."
                : scope === "created"
                  ? "Events you create will appear here."
                  : activeTab === "PAST"
                    ? "Past events will appear here after they’ve taken place."
                    : "Check back soon for upcoming Tech Sisters events."}
          </p>
          {scope === "all" && searchQuery && (
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
