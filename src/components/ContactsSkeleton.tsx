import {
  Box,
  Paper,
  Skeleton,
} from "@mui/material";

const CONTACT_ROWS = 10;

function SkeletonTableRow() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        height: 30,
        borderBottom: "1px solid",
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          px: 1,
          flex: 1,
          minWidth: 0,
        }}
      >
        <Skeleton
          variant="circular"
          width={24}
          height={24}
          animation="wave"
          sx={{ flexShrink: 0 }}
        />

        <Skeleton
          variant="text"
          width="65%"
          height={20}
          animation="wave"
        />
      </Box>


      <Box sx={{ flex: 1, px: 1, minWidth: 0 }}>
        <Skeleton
          variant="text"
          width="75%"
          height={20}
          animation="wave"
        />
      </Box>

      <Box sx={{ flex: 1, px: 1, minWidth: 0 }}>
        <Skeleton
          variant="text"
          width="60%"
          height={20}
          animation="wave"
        />
      </Box>

      <Box sx={{ flex: 1, px: 1 }}>
        <Skeleton
          variant="rounded"
          width={70}
          height={22}
          animation="wave"
          sx={{ borderRadius: 1.5 }}
        />
      </Box>

      <Box sx={{ flex: 1, px: 1, minWidth: 0 }}>
        <Skeleton
          variant="text"
          width="65%"
          height={20}
          animation="wave"
        />
      </Box>


      <Box sx={{ flex: 1, px: 1, minWidth: 0 }}>
        <Skeleton
          variant="text"
          width="55%"
          height={20}
          animation="wave"
        />
      </Box>
 
      <Box
        sx={{
          flex: 1,
          px: 1,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Skeleton
          variant="rounded"
          width={48}
          height={24}
          animation="wave"
          sx={{ borderRadius: 999 }}
        />
      </Box>
    </Box>
  );
}

function SkeletonDataGrid() {
  return (
    <Box
      sx={{
        minHeight: 0,
        minWidth: 1000,
        mx: 1,
        mb: 1,
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
          "Name",
          "Email",
          "Phone",
          "Status",
          "Owner",
          "Created",
          "Action",
        ].map((_, index) => (
          <Box
            key={index}
            sx={{
              flex: 1,
              px: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: index === 6 ? "center" : "flex-start",
            }}
          >
            <Skeleton
              variant="text"
              width={index === 6 ? 45 : "55%"}
              height={22}
              animation="wave"
            />
          </Box>
        ))}
      </Box>

      {Array.from({ length: CONTACT_ROWS }).map((_, index) => (
        <SkeletonTableRow key={index} />
      ))}
    </Box>
  );
}

function SkeletonContactHeader() {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 2,
        pb: 1.5,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
        }}
      >
        <Skeleton
          variant="circular"
          width={38}
          height={38}
          animation="wave"
        />

        <Box>
          <Skeleton
            variant="text"
            width={110}
            height={28}
            animation="wave"
          />

          <Skeleton
            variant="text"
            width={75}
            height={18}
            animation="wave"
          />
        </Box>
      </Box>


      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <Skeleton
          variant="rounded"
          width={38}
          height={38}
          animation="wave"
          sx={{ borderRadius: 2 }}
        />

        <Skeleton
          variant="rounded"
          width={38}
          height={38}
          animation="wave"
          sx={{ borderRadius: 2 }}
        />
      </Box>
    </Box>
  );
}

function SkeletonSidebarCard({
  showPriorityIcon = false,
}: {
  showPriorityIcon?: boolean;
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        height: "50%",
        maxHeight: 300,
        width: "90%",
        minWidth: 200,
        minHeight: 310,
        mx: 1,
        mb: 2,
        p: 1.5,
        borderRadius: 3,
        borderColor: "divider",
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1,
          pb: 1,
          mb: 0.5,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Skeleton
          variant="circular"
          width={18}
          height={18}
          animation="wave"
        />

        <Skeleton
          variant="text"
          width={125}
          height={22}
          animation="wave"
        />
      </Box>

      <Box
        sx={{
          overflow: "hidden",
          height: "calc(100% - 36px)",
        }}
      >
        {Array.from({ length: 7 }).map((_, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "center",
              py: 0.75,
              px: 0.75,
              gap: 1,
              borderRadius: 2,
            }}
          >
            {showPriorityIcon ? (
              <Skeleton
                variant="circular"
                width={16}
                height={16}
                animation="wave"
              />
            ) : (
              <Skeleton
                variant="circular"
                width={26}
                height={26}
                animation="wave"
              />
            )}

            <Skeleton
              variant="text"
              width="55%"
              height={20}
              animation="wave"
              sx={{ flex: 1 }}
            />

            <Skeleton
              variant="text"
              width={45}
              height={17}
              animation="wave"
            />
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

export default function ContactsSkeleton() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        flexDirection: "row",
        flex: 1,
        minWidth: 300,
        p: {
          sm: 0,
          md: 2,
        },
        mx: {
          sm: 0.5,
          md: 2,
        },
        height: 850,
      }}
    >
      <Paper
        variant="outlined"
        sx={{
          justifyContent: "flex-start",
          p: 1,
          pt: 0,
          width: "50vw",
          transition: "width 0.3s ease",
          maxHeight: 1000,
          display: "flex",
          flex: 1,
          borderRadius: 3,
          borderColor: "divider",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <SkeletonContactHeader />

        <SkeletonDataGrid />
      </Paper>

      <Box
        sx={{
          display: {
            xs: "none",
            lg: "flex",
          },
          flexDirection: "column",
          width: "15%",
          alignItems: "end",
          minWidth: 270,
        }}
      >
        <SkeletonSidebarCard/>

        <SkeletonSidebarCard showPriorityIcon />
      </Box>
    </Box>
  );
}