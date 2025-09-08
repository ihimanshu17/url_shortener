import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Container, Typography } from "@mui/material";
import logger from "../utils/logger";

function RedirectPage() {
  const { code } = useParams();
  const [message, setMessage] = useState("Redirecting...");

  useEffect(() => {
    const links = JSON.parse(localStorage.getItem("links")) || [];
    const link = links.find((l) => l.code === code);

    if (!link) {
      setMessage("❌ Link not found.");
      logger("Error: Link not found", code);
      return;
    }

    if (Date.now() > link.expiry) {
      setMessage("⏰ This link has expired.");
      logger("Error: Link expired", link);
      return;
    }

    const click = {
      time: Date.now(),
      referrer: document.referrer || "direct"
    };
    link.clicks = link.clicks ? [...link.clicks, click] : [click];

    localStorage.setItem("links", JSON.stringify(links));

    logger("Redirect", link);
    window.location.href = link.url;
  }, [code]);

  return (
    <Container>
      <Typography variant="h5" mt={3}>{message}</Typography>
    </Container>
  );
}

export default RedirectPage;
