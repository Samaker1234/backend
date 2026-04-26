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
app.use(helmet());
app.use(cors());
app.use(express.json());
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
