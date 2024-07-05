import React, { useState, useEffect } from "react";
import NavBar from './components/NavBar';
import AllEntries from './routes/AllEntries';
import NewEntry from './routes/NewEntry';
import EditEntry from './routes/EditEntry';
import { EntryProvider } from './utilities/globalContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { FiSun, FiMoon } from 'react-icons/fi';

export default function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  return (
    <div className={`app-container ${theme}`}>
      <label className="toggle-label pt-3 pl-3">
        <input
          type="checkbox"
          checked={theme === 'light'}
          onChange={toggleTheme}
          className="toggle-input"
        />
        <div className="toggle-button">
          {theme === 'dark' ? <FiMoon size={24} /> : <FiSun size={24} />}
        </div>
        <span className="toggle-text">{theme === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
      </label>
      <Router>
        <EntryProvider>
          <NavBar />
          <Routes>
            <Route path="/" element={<AllEntries />} />
            <Route path="create" element={<NewEntry />} />
            <Route path="edit/:id" element={<EditEntry />} />
          </Routes>
        </EntryProvider>
      </Router>
    </div>
  );
}
