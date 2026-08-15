import {
  Box,
  Paper,
  Skeleton,
} from "@mui/material";

const ACTIVITY_ROWS = 15;

function SkeletonActivityRow() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        height: 32,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >

      <Box
        sx={{
          flex: 1,
          minWidth: 110,
          px: 1.5,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Skeleton
          variant="rounded"
          width={80}
          height={22}
          animation="wave"
          sx={{ borderRadius: 1.5 }}
        />
      </Box>

  
      <Box
        sx={{
          flex: 1,
          minWidth: 110,
          px: 1.5,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Skeleton
          variant="rounded"
          width={80}
          height={22}
          animation="wave"
          sx={{ borderRadius: 1.5 }}
        />
      </Box>

  
      <Box
        sx={{
          flex: 1.6,
          minWidth: 160,
          px: 1.5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Skeleton
          variant="text"
          width="65%"
          height={18}
          animation="wave"
        />
        <Skeleton
          variant="text"
          width="40%"
          height={14}
          animation="wave"
        />
      </Box>

   
      <Box
        sx={{
          flex: 2,
          minWidth: 200,
          px: 1.5,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Skeleton
          variant="text"
          width="75%"
          height={18}
          animation="wave"
        />
      </Box>

  
      <Box
        sx={{
          flex: 1,
          minWidth: 140,
          px: 1.5,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Skeleton
          variant="text"
          width="65%"
          height={18}
          animation="wave"
        />
      </Box>

   
      <Box
        sx={{
          flex: 1,
          minWidth: 130,
          px: 1.5,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Skeleton
          variant="text"
          width="55%"
          height={18}
          animation="wave"
        />
      </Box>
    </Box>
  );
}

function SkeletonActivityGrid() {
  return (
    <Box
      sx={{
        flex: 1,
        minHeight: 0,
        minWidth: 1000,
        borderRadius: 3,
        overflow: "hidden",
      }}
    >
  
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: 56,
          bgcolor: "action.hover",
          borderRadius: 2,
          mb: 0.5,
        }}
      >
        {[
          { width: 1, minWidth: 110 },
          { width: 1, minWidth: 110 },
          { width: 1.6, minWidth: 160 },
          { width: 2, minWidth: 200 },
          { width: 1, minWidth: 140 },
          { width: 1, minWidth: 130 },
        ].map((column, index) => (
          <Box
            key={index}
            sx={{
              flex: column.width,
              minWidth: column.minWidth,
              px: 1.5,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Skeleton
              variant="text"
              width={index === 2 || index === 3 ? "45%" : "55%"}
              height={22}
              animation="wave"
            />
          </Box>
        ))}
      </Box>


      {Array.from({ length: ACTIVITY_ROWS }).map((_, index) => (
        <SkeletonActivityRow key={index} />
      ))}
    </Box>
  );
}

function SkeletonActivityHeader() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 1,
        p: 2,
        flexWrap: "wrap",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Skeleton
          variant="text"
          width={120}
          height={32}
          animation="wave"
        />
      </Box>

      <Skeleton
        variant="circular"
        width={40}
        height={40}
        animation="wave"
      />
    </Box>
  );
}

function SkeletonActivityFilters() {
  return (
    <Box
      sx={{
        display: "flex",
        gap: 1,
        px: 2,
        pb: 2,
        flexWrap: "wrap",
      }}
    >

      <Skeleton
        variant="rounded"
        height={40}
        animation="wave"
        sx={{
          flex: 1,
          minWidth: 200,
          borderRadius: 1,
        }}
      />

  
      <Skeleton
        variant="rounded"
        width={150}
        height={40}
        animation="wave"
        sx={{ borderRadius: 1 }}
      />

  
      <Skeleton
        variant="rounded"
        width={150}
        height={40}
        animation="wave"
        sx={{ borderRadius: 1 }}
      />

 
      <Skeleton
        variant="circular"
        width={40}
        height={40}
        animation="wave"
      />
    </Box>
  );
}

export default function ActivitiesSkeleton() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flex: 1,
        minWidth: 300,
        p: 2,
        mx: 2,
        height: 850,
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          p: 2,
          pt: 0,
          width: "70vw",
          maxHeight: 1000,
          display: "flex",
          flex: 1,
          borderRadius: 3,
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <SkeletonActivityHeader />

        <SkeletonActivityFilters />

        <SkeletonActivityGrid />
      </Paper>
    </Box>
  );
}