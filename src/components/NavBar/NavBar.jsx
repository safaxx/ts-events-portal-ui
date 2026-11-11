import {
  ArrowLeft,
  CalendarPlus,
  House,
  LayoutDashboardIcon,
  LogIn,
  LogOut,
  MessageCircleQuestion,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import authService from "../../Services/AuthService";
import "./NavBar.css";

function ProfileMenu({
  userName,
  onLogout,
  triggerClassName,
  contentClassName,
  align = "start",
  children,
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={triggerClassName}
        title={userName || "User"}
        aria-label="Open profile menu"
      >
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        side="top"
        align={align}
        sideOffset={8}
        className={contentClassName}
      >
        <DropdownMenuItem
          variant="destructive"
          onClick={onLogout}
          className="cursor-pointer"
        >
          <LogOut aria-hidden="true" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function NavBar() {
  const nav = useNavigate();
  const location = useLocation();
  const isAuthed = authService.isAuthenticated();

  const userName = localStorage.getItem("name");
  const userEmail = localStorage.getItem("email");
  const userRoles = localStorage.getItem("roles") || "";
  const isAdmin = userRoles.includes("ROLE_ADMIN");

  const handleLogout = () => {
    authService.logout();
  };

  const isActive = (path) => location.pathname === path;
  const userInitial = userName?.charAt(0).toUpperCase() || "U";

  return (
    <>
      <aside className="sidebar">
        <nav className="sidebar__nav" aria-label="Primary navigation">
          {location.pathname !== "/dashboard" && (
            <Button
              variant="ghost"
              className="sidebar__item"
              onClick={() => nav(-1)}
              aria-label="Go back"
            >
              <ArrowLeft aria-hidden="true" className="sidebar__icon" />
              <span className="sidebar__label">Back</span>
            </Button>
          )}

          <Button
            variant="ghost"
            className={`sidebar__item ${isActive("/dashboard") ? "active" : ""}`}
            onClick={() => nav("/dashboard")}
            aria-current={isActive("/dashboard") ? "page" : undefined}
          >
            <House aria-hidden="true" className="sidebar__icon" />
            <span className="sidebar__label">Events</span>
          </Button>

          {isAdmin && (
            <Button
              variant="ghost"
              className={`sidebar__item ${isActive("/create-event") ? "active" : ""}`}
              onClick={() => nav("/create-event")}
              aria-current={isActive("/create-event") ? "page" : undefined}
            >
              <CalendarPlus aria-hidden="true" className="sidebar__icon" />
              <span className="sidebar__label">Create Event</span>
            </Button>
          )}

          <Button
            variant="ghost"
            className={`sidebar__item ${isActive("/ask-a-tech-sister") ? "active" : ""}`}
            onClick={() => nav("/ask-a-tech-sister")}
            aria-current={isActive("/ask-a-tech-sister") ? "page" : undefined}
          >
            <MessageCircleQuestion
              aria-hidden="true"
              className="sidebar__icon"
            />
            <span className="sidebar__label">Ask a Tech Sister</span>
          </Button>
        </nav>

        <div className="sidebar__footer">
          {isAuthed ? (
            <div className="user-menu-wrapper">
              <ProfileMenu
                userName={userName}
                userEmail={userEmail}
                onLogout={handleLogout}
                triggerClassName="user-avatar"
                contentClassName="w-56"
              >
                {userInitial}
              </ProfileMenu>

              <div className="sidebar__user-info">
                <span className="sidebar__username">{userName}</span>
                <span className="sidebar__email">{userEmail}</span>
              </div>
            </div>
          ) : (
            <Button
              variant="ghost"
              className="sidebar__item"
              onClick={() => nav("/login")}
            >
              <LogIn aria-hidden="true" className="sidebar__icon" />
              <span className="sidebar__label">Log in</span>
            </Button>
          )}
        </div>
      </aside>

      <nav className="mobile-tabbar" aria-label="Primary navigation">
        <Button
          variant="ghost"
          className={`mobile-tabbar__item ${isActive("/dashboard") ? "active" : ""}`}
          onClick={() => nav("/dashboard")}
          aria-current={isActive("/dashboard") ? "page" : undefined}
        >
          <House aria-hidden="true" className="mobile-tabbar__icon" />
          <span>Events</span>
        </Button>

        {isAdmin && (
          <Button
            variant="ghost"
            className={`mobile-tabbar__item ${isActive("/create-event") ? "active" : ""}`}
            onClick={() => nav("/create-event")}
            aria-current={isActive("/create-event") ? "page" : undefined}
          >
            <CalendarPlus aria-hidden="true" className="mobile-tabbar__icon" />
            <span>Create</span>
          </Button>
        )}

        <Button
            variant="ghost"
            className={`mobile-tabbar__item ${isActive("/ask-a-tech-sister") ? "active" : ""}`}
            onClick={() => nav("/ask-a-tech-sister")}
            aria-current={isActive("/ask-a-tech-sister") ? "page" : undefined}
          >
          <MessageCircleQuestion aria-hidden="true" className="mobile-tabbar__icon" />
          <span>Ask a Tech Sister</span>
        </Button>

        {isAuthed ? (
          <div className="mobile-tabbar__profile">
            <ProfileMenu
              userName={userName}
              userEmail={userEmail}
              onLogout={handleLogout}
              triggerClassName="mobile-tabbar__item"
              contentClassName="w-56"
              align="end"
            >
              <span className="mobile-tabbar__avatar">{userInitial}</span>
              <span>Profile</span>
            </ProfileMenu>
          </div>
        ) : (
          <Button
            variant="ghost"
            className={`mobile-tabbar__item ${isActive("/login") ? "active" : ""}`}
            onClick={() => nav("/login")}
            aria-current={isActive("/login") ? "page" : undefined}
          >
            <LogIn aria-hidden="true" className="mobile-tabbar__icon" />
            <span>Log in</span>
          </Button>
        )}
      </nav>
    </>
  );
}

export default NavBar;
