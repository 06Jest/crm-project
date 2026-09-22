import DashboardIcon from "@mui/icons-material/Dashboard";
import ContactsIcon from "@mui/icons-material/Contacts";
import PermContactCalendarIcon from "@mui/icons-material/PermContactCalendar";
import HandshakeIcon from "@mui/icons-material/Handshake";
import EventNoteIcon from "@mui/icons-material/EventNote";
import PersonSearchIcon from "@mui/icons-material/PersonSearch";

export const navigationTabs = [
  {
    label: "Dashboard",
    value: "/app/dashboard",
    icon: DashboardIcon,
  },
  {
    label: "Leads",
    value: "/app/leads",
    icon: PersonSearchIcon,
  },
  {
    label: "Contacts",
    value: "/app/contacts",
    icon: ContactsIcon,
  },
  {
    label: "Deals",
    value: "/app/deals",
    icon: HandshakeIcon,
  },
  {
    label: "Customers",
    value: "/app/customers",
    icon: PermContactCalendarIcon,
  },
  {
    label: "Activities",
    value: "/app/activities",
    icon: EventNoteIcon,
  },
];  