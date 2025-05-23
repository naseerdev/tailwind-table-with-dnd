import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import './App.css';
import ListPage from './components/ListPage';
import DetailPage from './components/DetailPage';

// Define a simple theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Example primary color (Material-UI blue)
    },
    secondary: {
      main: '#dc004e', // Example secondary color (Material-UI pink)
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 500,
    },
    // Add other typography customizations here if needed
  },
  // Add component overrides or spacing adjustments here if needed
  // Example:
  // components: {
  //   MuiButton: {
  //     styleOverrides: {
  //       root: {
  //         borderRadius: 8,
  //       },
  //     },
  //   },
  // },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline /> {/* Ensures baseline styles and applies background color from theme */}
      <Router>
        <div className="App"> {/* This div can be used for global app styling if App.css is used */}
          <Routes>
            <Route path="/" element={<ListPage />} />
            <Route path="/item/:itemId" element={<DetailPage />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
