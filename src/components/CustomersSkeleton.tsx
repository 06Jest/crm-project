import {
  Box,
  Paper,
  Skeleton,
} from "@mui/material";

const CUSTOMER_ROWS = 15;

function SkeletonCustomerTableRow() {
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
      {/* Name */}
      <Box
        sx={{
          flex: 1,
          px: 1,
          minWidth: 0,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Skeleton
          variant="text"
          width="65%"
          height={20}
          animation="wave"
        />
      </Box>

      {/* Email */}
      <Box sx={{ flex: 1, px: 1, minWidth: 0 }}>
        <Skeleton
          variant="text"
          width="75%"
          height={20}
          animation="wave"
        />
      </Box>

      {/* Phone */}
      <Box sx={{ flex: 1, px: 1, minWidth: 0 }}>
        <Skeleton
          variant="text"
          width="60%"
          height={20}
          animation="wave"
        />
      </Box>

      {/* Status */}
      <Box
        sx={{
          width: 120,
          px: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Skeleton
          variant="rounded"
          width={72}
          height={22}
          animation="wave"
          sx={{ borderRadius: 10 }}
        />
      </Box>

      {/* Open Deals */}
      <Box
        sx={{
          width: 100,
          px: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Skeleton
          variant="text"
          width={35}
          height={20}
          animation="wave"
        />
      </Box>

      {/* Preferred Time */}
      <Box sx={{ flex: 1, px: 1, minWidth: 0 }}>
        <Skeleton
          variant="text"
          width="65%"
          height={20}
          animation="wave"
        />
      </Box>

      {/* Owner */}
      <Box sx={{ flex: 1, px: 1, minWidth: 0 }}>
        <Skeleton
          variant="text"
          width="55%"
          height={20}
          animation="wave"
        />
      </Box>

      {/* Since */}
      <Box
        sx={{
          width: 100,
          px: 1,
          display: "flex",
          alignItems: "center",
        }}
      >
        <Skeleton
          variant="text"
          width={55}
          height={20}
          animation="wave"
        />
      </Box>

      {/* Action */}
      <Box
        sx={{
          flex: 1,
          px: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Skeleton
          variant="rounded"
          width={48}
          height={24}
          animation="wave"
          sx={{ borderRadius: 6 }}
        />
      </Box>
    </Box>
  );
}

function SkeletonCustomerDataGrid() {
  const headers = [
    "Name",
    "Email",
    "Phone",
    "Status",
    "Open Deals",
    "Preferred time",
    "Owner",
    "Since",
    "Action",
  ];

  return (
    <Box
      sx={{
        minHeight: 0,
        minWidth: 1000,
        mx: 1,
        mb: 1,
        borderRadius: 3,
        overflow: "hidden",
        flex: 1,
      }}
    >
      {/* DataGrid header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          height: 56,
          bgcolor: "action.hover",
          borderRadius: "8px 8px 0 0",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        {headers.map((_, index) => (
          <Box
            key={index}
            sx={{
              flex: index === 3 || index === 4 || index === 7
                ? "0 0 auto"
                : 1,
              width:
                index === 3
                  ? 120
                  : index === 4
                    ? 100
                    : index === 7
                      ? 100
                      : undefined,
              px: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: index === 8 ? "center" : "flex-start",
            }}
          >
            <Skeleton
              variant="text"
              width={index === 8 ? 45 : "55%"}
              height={22}
              animation="wave"
            />
          </Box>
        ))}
      </Box>

      {/* Rows */}
      {Array.from({ length: CUSTOMER_ROWS }).map((_, index) => (
        <SkeletonCustomerTableRow key={index} />
      ))}
    </Box>
  );
}

function SkeletonCustomerHeader() {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        p: 2,
      }}
    >
      {/* Left side */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.25,
        }}
      >
        {/* Groups icon */}
        <Skeleton
          variant="rounded"
          width={40}
          height={40}
          animation="wave"
          sx={{ borderRadius: 2 }}
        />

        <Box>
          {/* Customers */}
          <Skeleton
            variant="text"
            width={110}
            height={28}
            animation="wave"
          />

          {/* Count */}
          <Skeleton
            variant="text"
            width={35}
            height={18}
            animation="wave"
          />
        </Box>
      </Box>

      {/* Delete button */}
      <Skeleton
        variant="rounded"
        width={40}
        height={40}
        animation="wave"
        sx={{ borderRadius: 2 }}
      />
    </Box>
  );
}

export default function CustomersSkeleton() {
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
        sx={(theme) => ({
          justifyContent: "flex-start",
          p: 1,
          pt: 0,
          width: "50vw",
          transition: "width 0.3s ease",
          maxHeight: 1000,
          display: "flex",
          flex: 1,
          borderRadius: 3,
          flexDirection: "column",
          overflow: "hidden",
          border: `1px solid ${
            theme.palette.mode === "dark"
              ? "#3a3a3a"
              : "#e3e3e3"
          }`,
        })}
      >
        <SkeletonCustomerHeader />

        <SkeletonCustomerDataGrid />
      </Paper>
    </Box>
  );
}