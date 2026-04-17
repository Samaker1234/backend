const express = require('express');
const initSqlJs = require('sql.js');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Connexion à SQLite avec sql.js
let db;
const dbPath = path.join(__dirname, 'database.sqlite');

async function initDatabase() {
  const SQL = await initSqlJs();
  
  // Charger ou créer la base de données
  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }
  
  console.log('✅ Connexion à SQLite réussie');
  global.db = db;
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

  // Sauvegarder la base de données avant de fermer
  function saveDatabase() {
    const data = db.export();
    const buffer = Buffer.from(data);
    fs.writeFileSync(dbPath, buffer);
  }

  process.on('SIGINT', () => {
    saveDatabase();
    process.exit(0);
  });

  // Sauvegarder périodiquement
  setInterval(saveDatabase, 30000);

  // Démarrage du serveur
  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur le port ${PORT}`);
    console.log(`📡 API disponible sur http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('❌ Erreur lors de l\'initialisation de la base de données:', err);
  process.exit(1);
});
