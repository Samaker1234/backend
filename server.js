const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Fallback DATABASE_URL si dotenv ne fonctionne pas
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://delamou_user:N7PlO9zvYJ9TKuA2Ejqhl58dFvCSKne9@dpg-d7go6pnavr4c73aejm4g-a.virginia-postgres.render.com/delamou';

// Connexion à PostgreSQL
const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: DATABASE_URL?.includes('render.com') ? { rejectUnauthorized: false } : false
});

async function initDatabase() {
  try {
    await pool.connect();
    console.log('✅ Connexion à PostgreSQL réussie');
    global.pool = pool;
  } catch (error) {
    console.error('❌ Erreur lors de la connexion à PostgreSQL:', error);
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
