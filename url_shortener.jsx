// App.js - Fully professional URL Shortener
import React, { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useParams, Link } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemText,
  Alert,
  Snackbar,
  CircularProgress,
  AppBar,
  Toolbar,
  CssBaseline,
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import BarChartIcon from '@mui/icons-material/BarChart';

// Logging adapter
const log = (eventName, data) => console.info(`[LOG] ${eventName}:`, data);

// Material-UI theme
const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#ff9800' },
    background: { default: '#f5f5f5' },
  },
  typography: {
    fontFamily: 'Inter, sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 600 },
    body1: { color: '#555' },
    body2: { color: '#777' },
  },
});

// Helper functions
const generateShortCode = (length = 6) => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length));
  return result;
};

const isValidUrl = (url) => {
  try { new URL(url); return true; } catch { return false; }
};

// Main App Component
const App = () => {
  const [links, setLinks] = useState({});
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const isInitialLoad = useRef(true);

  // Load from localStorage
  useEffect(() => {
    const savedLinks = localStorage.getItem('shortener_links');
    if (savedLinks) {
      try { setLinks(JSON.parse(savedLinks)); } catch { }
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isInitialLoad.current) { isInitialLoad.current = false; return; }
    localStorage.setItem('shortener_links', JSON.stringify(links));
  }, [links]);

  const showSnackbar = (message) => { setSnackbarMessage(message); setSnackbarOpen(true); };

  // --- Shortener Page ---
  const ShortenerPage = () => {
    const [urlInputs, setUrlInputs] = useState([{ longUrl: '', customCode: '', validity: '30' }]);
    const [shortenedLinks, setShortenedLinks] = useState([]);

    const handleAddUrl = () => { if (urlInputs.length < 5) setUrlInputs([...urlInputs, { longUrl: '', customCode: '', validity: '30' }]); };

    const handleInputChange = (index, field, value) => {
      const newInputs = [...urlInputs]; newInputs[index][field] = value; setUrlInputs(newInputs);
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      const newLinks = [];
      const updatedLinks = { ...links };
      let hasError = false;

      urlInputs.forEach((input, index) => {
        const longUrl = input.longUrl.trim();
        const customCode = input.customCode.trim();
        const validityMinutes = parseInt(input.validity, 10) || 30;

        if (!longUrl) { showSnackbar(`URL at row ${index + 1} is required.`); hasError = true; return; }
        if (!isValidUrl(longUrl)) { showSnackbar(`URL at row ${index + 1} is not valid.`); hasError = true; return; }
        if (customCode && !/^[a-zA-Z0-9]+$/.test(customCode)) { showSnackbar(`Custom code at row ${index + 1} must be alphanumeric.`); hasError = true; return; }
        if (customCode && updatedLinks[customCode]) { showSnackbar(`Custom code '${customCode}' at row ${index + 1} is already in use.`); hasError = true; return; }

        let shortCode = customCode || generateShortCode();
        if (!customCode) while (updatedLinks[shortCode]) shortCode = generateShortCode();
        input.shortCode = shortCode;

        const creationTime = new Date().toISOString();
        const expiryTime = new Date(Date.now() + validityMinutes * 60 * 1000).toISOString();
        const newLink = { longUrl, shortCode, creationTime, expiryTime, clicks: [] };
        updatedLinks[shortCode] = newLink;
        newLinks.push(newLink);
        log('Link created', { shortCode, longUrl, expiryTime });
      });

      if (!hasError) { setLinks(updatedLinks); setShortenedLinks(newLinks); showSnackbar('Links created successfully!'); }
    };

    const handleCopy = (shortCode) => {
      const url = `${window.location.origin}/${shortCode}`;
      navigator.clipboard.writeText(url);
      showSnackbar('Short link copied to clipboard!');
    };

    return (
      <Container maxWidth="md" sx={{ mt: 6, mb: 6 }}>
        <Paper elevation={6} sx={{ p: 5, borderRadius: 3 }}>
          <Typography variant="h4" align="center" gutterBottom>URL Shortener</Typography>
          <Typography variant="body1" align="center" sx={{ mb: 4, color: 'text.secondary' }}>
            Enter up to 5 URLs to shorten. Optionally, use custom short codes.
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              {urlInputs.map((input, index) => (
                <Grid item xs={12} key={index}>
                  <Paper elevation={2} sx={{ p: 3, borderRadius: 2, transition: 'all 0.2s', '&:hover': { boxShadow: 8 } }}>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={6}>
                        <TextField fullWidth label="Long URL" placeholder="https://www.example.com" variant="outlined" value={input.longUrl} onChange={(e) => handleInputChange(index, 'longUrl', e.target.value)} />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <TextField fullWidth label="Validity (mins)" type="number" variant="outlined" value={input.validity} onChange={(e) => handleInputChange(index, 'validity', e.target.value)} />
                      </Grid>
                      <Grid item xs={6} md={3}>
                        <TextField fullWidth label="Custom Code (optional)" variant="outlined" value={input.customCode} onChange={(e) => handleInputChange(index, 'customCode', e.target.value)} />
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}
              <Grid item xs={12} container justifyContent="center" spacing={2} sx={{ mt: 2 }}>
                <Grid item>
                  <Button variant="outlined" onClick={handleAddUrl} disabled={urlInputs.length >= 5} sx={{ borderRadius: 2 }}>Add Another URL</Button>
                </Grid>
                <Grid item>
                  <Button type="submit" variant="contained" sx={{ borderRadius: 2, backgroundColor: '#1976d2', '&:hover': { backgroundColor: '#1565c0' } }}>Shorten</Button>
                </Grid>
              </Grid>
            </Grid>
          </form>

          {shortenedLinks.length > 0 && (
            <Box sx={{ mt: 5 }}>
              <Typography variant="h5" gutterBottom>Your Shortened Links</Typography>
              <Grid container spacing={2}>
                {shortenedLinks.map((link, idx) => (
                  <Grid item xs={12} key={idx}>
                    <Paper elevation={3} sx={{ p: 2, borderRadius: 2, transition: 'all 0.2s', '&:hover': { boxShadow: 10 } }}>
                      <Grid container alignItems="center">
                        <Grid item xs={9}>
                          <Link to={`/${link.shortCode}`} style={{ color: '#1976d2', fontWeight: 500 }}>
                            {`${window.location.origin}/${link.shortCode}`}
                          </Link>
                          <Typography variant="body2" sx={{ color: 'text.secondary' }}>Expires: {new Date(link.expiryTime).toLocaleString()}</Typography>
                        </Grid>
                        <Grid item xs={3} sx={{ textAlign: 'right' }}>
                          <Button onClick={() => handleCopy(link.shortCode)} startIcon={<ContentCopyIcon />} variant="contained" color="secondary" size="small">Copy</Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}
        </Paper>
      </Container>
    );
  };

  // --- Stats Page ---
  const StatsPage = () => (
    <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
      <Typography variant="h4" component="h1" align="center" gutterBottom>Short Link Statistics</Typography>
      <Grid container spacing={3}>
        {Object.entries(links).length > 0 ? (
          Object.entries(links).map(([shortCode, linkData]) => (
            <Grid item xs={12} key={shortCode}>
              <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                <Typography variant="h6">Short URL: <Link to={`/${shortCode}`} style={{ color: '#1976d2' }}>{`${window.location.origin}/${shortCode}`}</Link></Typography>
                <Typography variant="body1" sx={{ mt: 1 }}>Original URL: {linkData.longUrl}</Typography>
                <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>Created: {new Date(linkData.creationTime).toLocaleString()}</Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>Expires: {new Date(linkData.expiryTime).toLocaleString()}</Typography>
                <Typography variant="h6" sx={{ mt: 2 }}>Total Clicks: {linkData.clicks.length}</Typography>
              </Paper>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body1" align="center" sx={{ mt: 4 }}>No short links have been created yet.</Typography>
          </Grid>
        )}
      </Grid>
    </Container>
  );

  // --- Redirect Page ---
  const RedirectPage = () => {
    const { code } = useParams();
    const navigate = useNavigate();
    const [status, setStatus] = useState('loading');
    const [message, setMessage] = useState('');

    useEffect(() => {
      const link = links[code];
      if (!link) { setStatus('error'); setMessage('This short link does not exist.'); return; }
      if (new Date() > new Date(link.expiryTime)) { setStatus('error'); setMessage('This short link has expired.'); return; }

      const newClick = { timestamp: new Date().toISOString(), referrer: document.referrer, location: 'Unknown' };
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (pos) => { newClick.location = `Lat: ${pos.coords.latitude.toFixed(2)}, Lon: ${pos.coords.longitude.toFixed(2)}`; updateLink(newClick); },
          () => updateLink(newClick), { enableHighAccuracy: false, timeout: 5000 }
        );
      } else updateLink(newClick);

      const updateLink = (click) => {
        setLinks(prev => ({ ...prev, [code]: { ...prev[code], clicks: [...(prev[code].clicks||[]), click] } }));
        window.location.replace(link.longUrl);
      };
    }, [code, links]);

    return (
      <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          {status === 'loading' && <><CircularProgress /><Typography variant="h6" sx={{ mt: 2 }}>Loading link...</Typography></>}
          {status === 'error' && (
            <Alert severity="error" sx={{ borderRadius: 2 }}>
              <Typography variant="h6" gutterBottom>Oops!</Typography>
              <Typography variant="body1">{message}</Typography>
              <Box sx={{ mt: 2 }}><Button variant="contained" onClick={() => navigate('/')} sx={{ borderRadius: 2 }}>Go Home</Button></Box>
            </Alert>
          )}
        </Paper>
      </Container>
    );
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AppBar position="static" sx={{ borderRadius: '0 0 10px 10px', boxShadow: 4 }}>
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              <Link to="/" style={{ textDecoration: 'none', color: 'inherit' }}>Gemini Shortener</Link>
            </Typography>
            <Button color="inherit" component={Link} to="/" sx={{ borderRadius: 2 }}>Shorten URL</Button>
            <Button color="inherit" component={Link} to="/stats" endIcon={<BarChartIcon />} sx={{ borderRadius: 2 }}>Stats</Button>
          </Toolbar>
        </AppBar>
        <Routes>
          <Route path="/" element={<ShortenerPage />} />
          <Route path="/stats" element={<StatsPage />} />
          <Route path="/:code" element={<RedirectPage />} />
        </Routes>
      </BrowserRouter>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </ThemeProvider>
  );
};

export default App;
