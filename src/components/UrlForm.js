import React, { useState } from "react";
import { TextField, Button, Box, Grid } from "@mui/material";
import { validateUrl, generateCode } from "../utils/validator";

function UrlForm({ onSubmit }) {
  const [entries, setEntries] = useState([
    { url: "", validity: "", shortcode: "" },
  ]);

  const handleChange = (index, field, value) => {
    const newEntries = [...entries];
    newEntries[index][field] = value;
    setEntries(newEntries);
  };

  const addField = () => {
    if (entries.length < 5) {
      setEntries([...entries, { url: "", validity: "", shortcode: "" }]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const now = Date.now();
    const newLinks = entries
      .filter((e) => validateUrl(e.url))
      .map((e) => {
        const validityMinutes = e.validity ? parseInt(e.validity) : 30;
        return {
          url: e.url,
          code: e.shortcode || generateCode(),
          created: now,
          expiry: now + validityMinutes * 60 * 1000,
          clicks: [],
        };
      });

    if (newLinks.length > 0) {
      onSubmit(newLinks);
      setEntries([{ url: "", validity: "", shortcode: "" }]);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {entries.map((entry, i) => (
        <Box key={i} mb={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={`Long URL ${i + 1}`}
                value={entry.url}
                onChange={(e) => handleChange(i, "url", e.target.value)}
                required
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Validity (min)"
                type="number"
                value={entry.validity}
                onChange={(e) => handleChange(i, "validity", e.target.value)}
                placeholder="30"
              />
            </Grid>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                label="Custom Code"
                value={entry.shortcode}
                onChange={(e) => handleChange(i, "shortcode", e.target.value)}
                placeholder="optional"
              />
            </Grid>
          </Grid>
        </Box>
      ))}
      <Button onClick={addField} variant="outlined" disabled={entries.length >= 5}>
        Add URL
      </Button>
      <Button type="submit" variant="contained" sx={{ ml: 2 }}>
        Shorten
      </Button>
    </form>
  );
}

export default UrlForm;
