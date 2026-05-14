import { Box, Typography } from '@mui/material';
import MentionChip from './MentionChip';
import type { MentionItem } from '../types/message';

interface MessageContentProps {
  content: string;
  mentions?: MentionItem[];
  isMyMessage?: boolean;
}

export default function MessageContent({
  content,
  mentions = [],
  isMyMessage = false,
}: MessageContentProps) {
  if (!mentions || mentions.length === 0) {
    return (
      <Typography
        variant="body2"
        sx={{ whiteSpace: 'pre-wrap', lineHeight: 1.5, fontSize: 13 }}
      >
        {content}
      </Typography>
    );
  }

  // Split the content by @MentionName and render mention chips inline
  // Build a regex that matches any @{name} for each mention
  const parts: React.ReactNode[] = [];

  // Sort mentions by their appearance in content (earliest first)
  const sortedMentions = [...mentions].sort((a, b) => {
    const idxA = content.indexOf(`@${a.name}`);
    const idxB = content.indexOf(`@${b.name}`);
    return idxA - idxB;
  });

  let currentIdx = 0;

  sortedMentions.forEach((mention, i) => {
    const mentionText = `@${mention.name}`;
    const mentionIdx = content.indexOf(mentionText, currentIdx);

    if (mentionIdx === -1) return;

    // Text before this mention
    if (mentionIdx > currentIdx) {
      parts.push(
        <Typography
          key={`text-${i}`}
          component="span"
          variant="body2"
          sx={{ whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.5 }}
        >
          {content.slice(currentIdx, mentionIdx)}
        </Typography>
      );
    }

    // The mention chip
    parts.push(
      <MentionChip
        key={`mention-${mention.id}`}
        mention={mention}
        isMyMessage={isMyMessage}
      />
    );

    currentIdx = mentionIdx + mentionText.length;
  });

  // Remaining text after last mention
  if (currentIdx < content.length) {
    parts.push(
      <Typography
        key="text-end"
        component="span"
        variant="body2"
        sx={{ whiteSpace: 'pre-wrap', fontSize: 13, lineHeight: 1.5 }}
      >
        {content.slice(currentIdx)}
      </Typography>
    );
  }

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 0.25 }}>
      {parts}
    </Box>
  );
}