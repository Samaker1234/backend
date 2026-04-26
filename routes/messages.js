const express = require('express');
const router = express.Router();
const { sendContactEmail, sendConfirmationEmail } = require('../services/emailService');

// POST créer un nouveau message
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Validation basique
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Tous les champs sont requis' });
    }
    
    // Sauvegarder dans la base de données via Prisma
    const newMessage = await global.prisma.message.create({
      data: { name, email, message }
    });
    
    // Envoyer l'email de notification
    const emailSent = await sendContactEmail({ name, email, message });
    
    // Envoyer l'email de confirmation à l'expéditeur
    await sendConfirmationEmail({ name, email });
    
    res.status(201).json({ 
      success: true, 
      message: emailSent ? 'Message envoyé avec succès ! Vous recevrez une confirmation par email.' : 'Message enregistré avec succès !',
      data: newMessage
    });
  } catch (error) {
    console.error('Erreur lors de l\'envoi du message:', error);
    res.status(500).json({ error: 'Erreur lors de l\'envoi du message' });
  }
});

// GET tous les messages (optionnel, pour l'admin)
router.get('/', async (req, res) => {
  try {
    const messages = await global.prisma.message.findMany({
      orderBy: { createdAt: 'desc' }
    });
    res.json(messages);
  } catch (error) {
    console.error('Erreur lors de la récupération des messages:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des messages' });
  }
});

// DELETE un message
router.delete('/:id', async (req, res) => {
  try {
    await global.prisma.message.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Message supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du message:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du message' });
  }
});

module.exports = router;
