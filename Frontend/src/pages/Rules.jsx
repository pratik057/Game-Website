import React from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png"; // Import your logo
const AndarBaharRules = () => {
  return (
    <Container maxWidth="md" sx={{ mt: 5 }}>
        <Link to="/dashboard" className="flex items-center space-x-2">
                  <img
                    src={Logo || "/placeholder.svg"}
                    alt="Andar Bahar"
                    className="h-15 md:h-24 w-auto drop-shadow-lg"
                  />
                </Link>
      <Paper
        elevation={3}
        sx={{
          p: 4,
          borderRadius: 4,
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#1e293b', // dark background
          color: '#ffffff', // white text
        }}
      >
        {/* Background Grid Overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: 'radial-gradient(#ffffff33 1px, transparent 1px)',
            backgroundSize: '20px 20px',
            opacity: 0.1,
            pointerEvents: 'none',
          }}
        />

        <Typography variant="h4" align="center" gutterBottom sx={{ color: '#90caf9' }}>
          Andar Bahar - Game Rules
        </Typography>
        
        <List>
          {[
            {
              primary: "Objective:",
              secondary:
                "Predict whether a card matching the middle card will appear on the Andar (left) or Bahar (right) side.",
            },
            {
              primary: "Starting the Game:",
              secondary:
                "A single middle card (the 'Joker Card') is placed face up.",
            },
            {
              primary: "Choosing a Side:",
              secondary:
                "Players bet on either Andar or Bahar side before the cards are dealt.",
            },
            {
              primary: "Dealing Cards:",
              secondary:
                "Dealer deals cards alternately to Andar and Bahar sides.",
            },
            {
              primary: "Winning the Game:",
              secondary:
                "The side where the first matching card (same rank as Joker) appears wins.",
            },
          ].map((rule, idx) => (
            <ListItem key={idx}>
              <ListItemIcon>
                <CheckCircleIcon sx={{ color: '#66bb6a' }} />
              </ListItemIcon>
              <ListItemText
                primary={rule.primary}
                secondary={rule.secondary}
                primaryTypographyProps={{ sx: { color: '#ffffff', fontWeight: 600 } }}
                secondaryTypographyProps={{ sx: { color: '#e0e0e0' } }}
              />
            </ListItem>
          ))}
        </List>

        <Link
          to="/game"
          style={{
            display: 'inline-block',
            marginTop: '2rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#1976d2',
            color: '#fff',
            borderRadius: '12px',
            textDecoration: 'none',
            textAlign: 'center',
            fontWeight: 500,
          }}
        >
          Back to Home
        </Link>
      </Paper>
    </Container>
  );
};

export default AndarBaharRules;
