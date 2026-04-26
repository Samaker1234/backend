const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Middleware
const { sendSecurityAlert } = require('./services/emailService');
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes pour l'alerte de sécurité
app.post('/api/security/alert', async (req, res) => {
  const { attempts, userAgent, screenshot } = req.body;
  await sendSecurityAlert({ attempts, userAgent, screenshot });
  res.json({ success: true });
});

// Routes pour l'authentification
app.post('/api/auth/login', async (req, res) => {
  const { password } = req.body;
  try {
    const admin = await prisma.admin.findFirst();
    if (admin && admin.password === password) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false, message: 'Mot de passe incorrect' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/auth/change-password', async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const admin = await prisma.admin.findFirst();
    if (admin && admin.password === oldPassword) {
      await prisma.admin.update({
        where: { id: admin.id },
        data: { password: newPassword }
      });
      res.json({ success: true, message: 'Mot de passe mis à jour' });
    } else {
      res.status(401).json({ success: false, message: 'Ancien mot de passe incorrect' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/auth/cv', async (req, res) => {
  try {
    const admin = await prisma.admin.findFirst();
    res.json({ cv_url: admin?.cv_url || '/cv.pdf' });
  } catch (error) {
    res.json({ cv_url: '/cv.pdf' });
  }
});

app.post('/api/auth/update-cv', async (req, res) => {
  const { password, cv_url } = req.body;
  try {
    const admin = await prisma.admin.findFirst();
    if (admin && admin.password === password) {
      await prisma.admin.update({
        where: { id: admin.id },
        data: { cv_url }
      });
      res.json({ success: true, message: 'Lien du CV mis à jour' });
    } else {
      res.status(401).json({ success: false, message: 'Mot de passe incorrect' });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
app.use(express.urlencoded({ extended: true }));

// Rendre prisma global pour les routes (ou l'exporter)
global.prisma = prisma;

async function initDatabase() {
  try {
    await prisma.$connect();
    console.log('✅ Connexion à Supabase via Prisma réussie');
  } catch (error) {
    console.error('❌ Erreur lors de la connexion à la base de données:', error);
    process.exit(1);
  }
}

initDatabase().then(() => {
  // Routes
  app.use('/api/projects', require('./routes/projects'));
  app.use('/api/messages', require('./routes/messages'));
  app.use('/api/chatbot', require('./routes/chatbot'));
  app.use('/api/skills', require('./routes/skills'));

  // Route racine
  app.get('/', (req, res) => {
    res.json({
      message: 'Bienvenue sur l\'API du portfolio de Samaké DELAMOU',
      version: '1.0.0',
      endpoints: {
        projects: '/api/projects',
        messages: '/api/messages',
        skills: '/api/skills',
        chatbot: '/api/chatbot'
      }
    });
  });

  // Gestion des erreurs
  app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Une erreur est survenue sur le serveur' });
  });

  // Démarrage du serveur
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📡 API disponible sur http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('❌ Erreur lors de l\'initialisation de la base de données:', err);
  process.exit(1);
});
