import React, { useState } from "react";
import { Container, Typography, Box } from "@mui/material";
import UrlForm from "../components/UrlForm";
import { saveLink } from "../utils/storage";
import logger from "../utils/logger";

function ShortenerPage() {
  const [links, setLinks] = useState(() => JSON.parse(localStorage.getItem("links")) || []);

  const handleAddLinks = (newLinks) => {
    const updated = [...links, ...newLinks];
    setLinks(updated);
    localStorage.setItem("links", JSON.stringify(updated));
    logger("Link(s) created", newLinks);
  };

  return (
    <Container>
      <Typography variant="h4" mt={3} gutterBottom>
        URL Shortener
      </Typography>
      <UrlForm onSubmit={handleAddLinks} />
      <Box mt={4}>
        <Typography variant="h6">Generated Links:</Typography>
        {links.map((l, i) => (
          <Typography key={i}>
            {window.location.origin}/{l.code} (expires at {new Date(l.expiry).toLocaleTimeString()})
          </Typography>
        ))}
      </Box>
    </Container>
  );
}

export default ShortenerPage;
