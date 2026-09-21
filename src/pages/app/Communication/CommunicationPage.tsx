import { useParams } from "react-router-dom";
import { Box, Typography } from "@mui/material";

import NotesPanel from "../../../components/panels/NotesPanel";
import TasksPanel from "../../../components/panels/TasksPanel";
import ChatsPanel from "../../../components/panels/ChatsPanel";
import EmailsPanel from "../../../components/panels/EmailPanel";
import CallsPanel from "../../../components/panels/CallsPanel";
import SmsPanel from "../../../components/panels/SMSPanel";

const panelRegistry = {
  notes: NotesPanel,
  tasks: TasksPanel,
  chats: ChatsPanel,
  emails: EmailsPanel,
  calls: CallsPanel,
  sms: SmsPanel,
};

const titleRegistry = {
  notes: "Notes",
  tasks: "Tasks",
  chats: "Chats",
  emails: "Emails",
  calls: "Calls",
  sms: "SMS",
};

export default function CommunicationPage() {
  const { id } = useParams<{ id: string }>();

  const Panel = id
    ? panelRegistry[id as keyof typeof panelRegistry]
    : undefined;

  const title = id
    ? titleRegistry[id as keyof typeof titleRegistry]
    : undefined;

  if (!Panel || !title) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography variant="h5">
          Communication panel not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: "100%",
        minHeight: 0,
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          px: { xs: 2, md: 3 },
          py: 2,
          borderBottom: "1px solid",
          borderColor: "divider",
          flexShrink: 0,
        }}
      >
        <Typography variant="h5" fontWeight={700}>
          {title}
        </Typography>
      </Box>

      <Box
        sx={{
          flex: 1,
          minHeight: 0,
          overflow: "hidden",
          p: { xs: 1, md: 2 },
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 1400,
            minWidth: 0,
            minHeight: 0,
          }}
        >
          <Panel />
        </Box>
      </Box>
    </Box>
  );
}