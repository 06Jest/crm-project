import {
  Box, Card, CardContent, Typography,
  Button, CircularProgress, Alert, Chip,
} from '@mui/material';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import RefreshIcon from '@mui/icons-material/Refresh';

interface AIInsightCardProps {
  title?: string;
  result: string | null;
  loading: boolean;
  error: string;
  onGenerate: () => void;
  onClear?: () => void;
  buttonLabel?: string;
  compact?: boolean;
}

export default function AIInsightCard({
  title = 'AI Insight',
  result,
  loading,
  error,
  onGenerate,
  onClear,
  buttonLabel = 'Generate',
  compact = false,
}: AIInsightCardProps) {
  if (!result && !loading && !error) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <Button
          size={compact ? 'small' : 'medium'}
          variant="outlined"
          startIcon={<AutoAwesomeIcon />}
          onClick={onGenerate}
          sx={{ borderColor: 'secondary.main', color: 'secondary.main' }}
        >
          {buttonLabel}
        </Button>
      </Box>
    );
  }

  return (
    <Card
      elevation={0}
      sx={{
        border: 1,
        borderColor: 'secondary.main',
        borderRadius: 2,
        bgcolor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(156,39,176,0.08)'
            : 'rgba(156,39,176,0.04)',
      }}
    >
      <CardContent sx={{ p: compact ? 1.5 : 2, '&:last-child': { pb: compact ? 1.5 : 2 } }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
            <AutoAwesomeIcon sx={{ fontSize: 16, color: 'secondary.main' }} />
            <Typography variant="caption" fontWeight={700} color="secondary.main">
              {title}
            </Typography>
            <Chip
              label="AI"
              size="small"
              sx={{
                height: 16,
                fontSize: 9,
                bgcolor: 'secondary.main',
                color: 'white',
                fontWeight: 700,
              }}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            {result && (
              <Button
                size="small"
                startIcon={<RefreshIcon sx={{ fontSize: 14 }} />}
                onClick={onGenerate}
                disabled={loading}
                sx={{ fontSize: 11, py: 0.25 }}
              >
                Regenerate
              </Button>
            )}
            {onClear && result && (
              <Button
                size="small"
                onClick={onClear}
                sx={{ fontSize: 11, py: 0.25 }}
              >
                Clear
              </Button>
            )}
          </Box>
        </Box>

        {loading && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
            <CircularProgress size={16} color="secondary" />
            <Typography variant="body2" color="text.secondary">
              AI is thinking...
            </Typography>
          </Box>
        )}


        {error && !loading && (
          <Alert severity="error" sx={{ py: 0.5 }}>
            <Typography variant="caption">{error}</Typography>
          </Alert>
        )}


        {result && !loading && (
          <Typography
            variant="body2"
            color="text.primary"
            lineHeight={1.7}
            sx={{ whiteSpace: 'pre-wrap' }}
          >
            {result}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}