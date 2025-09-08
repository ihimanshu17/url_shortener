import React, { useState, useEffect } from "react";
import { Container, Typography, Box } from "@mui/material";

function StatsPage() {
  const [links, setLinks] = useState([]);

  useEffect(() => {
    setLinks(JSON.parse(localStorage.getItem("links")) || []);
  }, []);

  return (
    <Container>
      <Typography variant="h4" mt={3} gutterBottom>
        Stats
      </Typography>
      {links.map((link, i) => (
        <Box key={i} mb={2}>
          <Typography><b>Short URL:</b> {window.location.origin}/{link.code}</Typography>
          <Typography><b>Original URL:</b> {link.url}</Typography>
          <Typography><b>Created:</b> {new Date(link.created).toLocaleString()}</Typography>
          <Typography><b>Expiry:</b> {new Date(link.expiry).toLocaleString()}</Typography>
          <Typography><b>Clicks:</b> {link.clicks?.length || 0}</Typography>
          {link.clicks?.map((c, idx) => (
            <Typography key={idx} sx={{ pl: 2 }}>
              - {new Date(c.time).toLocaleString()} from {c.referrer || "direct"}
            </Typography>
          ))}
        </Box>
      ))}
    </Container>
  );
}

export default StatsPage;
