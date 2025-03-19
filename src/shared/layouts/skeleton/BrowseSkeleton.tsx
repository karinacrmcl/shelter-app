import React from "react";
import { Skeleton, Grid, Box } from "@mui/material";

export default function BrowseSkeleton() {
  return (
    <Grid
      style={{ maxHeight: "calc(100vh - 170px)" }}
      container
      spacing={2}
      justifyContent="center"
    >
      {Array.from(new Array(6)).map((_, index) => (
        <Grid item xs={12} sm={6} md={4} key={index}>
          <Box sx={{ width: "100%", my: 2 }}>
            <Skeleton variant="rectangular" width="100%" height={180} />
            <Box sx={{ pt: 1 }}>
              <Skeleton />
              <Skeleton width="60%" />
            </Box>
          </Box>
        </Grid>
      ))}
    </Grid>
  );
}
