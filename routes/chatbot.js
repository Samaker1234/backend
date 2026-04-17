const express = require('express');
const router = express.Router();
const { getGeminiResponse } = require('../services/geminiService');

// POST envoyer un message au chatbot
router.post('/', async (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'Message requis' });
    }
    
    const response = await getGeminiResponse(message);
    
    res.json({
      success: true,
      response: response
    });
  } catch (error) {
    console.error('Erreur lors du traitement du message:', error);
    res.status(500).json({ error: 'Erreur lors du traitement du message' });
  }
});

module.exports = router;
