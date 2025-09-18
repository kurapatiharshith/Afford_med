
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import UrlShortener from './pages/UrlShortener';
import StatisticsDashboard from './pages/StatisticsDashboard';
import { logEvent } from './middleware/logger';

const STORAGE_KEY = 'affordmed_short_urls';

function saveUrls(urls) {
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(urls));
}
function loadUrls() {
  try {
    return JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function RedirectHandler({ urls, onClick }) {
  const { shortcode } = useParams();
  const navigate = useNavigate();
  useEffect(() => {
    const found = urls.find(u => u.short === shortcode);
    if (found) {
      // Check expiry
      if (new Date(found.expiresAt) < new Date()) {
        logEvent('redirect_expired', { shortcode });
        alert('This short URL has expired.');
        navigate('/');
        return;
      }
      // Log click
      const click = {
        timestamp: new Date().toISOString(),
        source: document.referrer || 'direct',
        location: 'Unknown' // Could use IP geolocation API if allowed
      };
      onClick(shortcode, click);
      window.open(found.originalUrl, '_blank');
      navigate('/dashboard');
    } else {
      logEvent('redirect_not_found', { shortcode });
      alert('Short URL not found.');
      navigate('/');
    }
  }, [shortcode]);
  return null;
}

function App() {
  const [urls, setUrls] = useState(loadUrls());

  useEffect(() => {
    saveUrls(urls);
  }, [urls]);

  const handleShorten = (data) => {
    // Check for shortcode collision
    if (urls.some(u => u.short === data.short)) {
      alert('Shortcode already exists. Please choose another.');
      logEvent('shortcode_collision', { shortcode: data.short });
      return;
    }
    setUrls([...urls, data]);
  };

  const handleShortUrlClick = (short) => {
    window.location.href = '/' + short;
  };

  const handleClickLog = (short, click) => {
    setUrls(urls => urls.map(u =>
      u.short === short
        ? { ...u, clickCount: (u.clickCount || 0) + 1, clicks: [...(u.clicks || []), click] }
        : u
    ));
    logEvent('short_url_clicked', { short, click });
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<UrlShortener onShorten={handleShorten} />} />
        <Route path="/dashboard" element={<StatisticsDashboard urls={urls} onShortUrlClick={handleShortUrlClick} />} />
        <Route path=":shortcode" element={<RedirectHandler urls={urls} onClick={handleClickLog} />} />
      </Routes>
    </Router>
  );
}

export default App;
