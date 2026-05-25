import React, { useState } from 'react';
import { Box, Paper, TextField, IconButton, Typography, List, ListItem } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import ChatBubbleIcon from '@mui/icons-material/ChatBubble';
import CloseIcon from '@mui/icons-material/Close';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([{ text: "שלום! איך אוכל לעזור לך היום?", sender: 'bot' }]);
  const [input, setInput] = useState('');

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { text: input, sender: 'user' }]);
    setInput('');
    // כאן תוכלי להוסיף את הלוגיקה לקריאה ל-Backend שלך
  };

  return (
    <Box sx={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000 }}>
      {!isOpen ? (
        <IconButton onClick={() => setIsOpen(true)} sx={{ bgcolor: 'primary.main', color: 'white', p: 2, '&:hover': { bgcolor: 'primary.dark' } }}>
          <ChatBubbleIcon />
        </IconButton>
      ) : (
        <Paper elevation={6} sx={{ width: 320, height: 450, display: 'flex', flexDirection: 'column', p: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="h6">עוזר אישי</Typography>
            <IconButton onClick={() => setIsOpen(false)}><CloseIcon /></IconButton>
          </Box>
          <List sx={{ flexGrow: 1, overflowY: 'auto', mb: 1 }}>
            {messages.map((msg, index) => (
              <ListItem key={index} sx={{ justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start' }}>
                <Paper sx={{ p: 1, bgcolor: msg.sender === 'user' ? 'primary.light' : 'grey.200' }}>
                  <Typography variant="body2">{msg.text}</Typography>
                </Paper>
              </ListItem>
            ))}
          </List>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <TextField fullWidth size="small" value={input} onChange={(e) => setInput(e.target.value)} placeholder="כתוב הודעה..." />
            <IconButton color="primary" onClick={handleSend}><SendIcon /></IconButton>
          </Box>
        </Paper>
      )}
    </Box>
  );
};

export default Chatbot;