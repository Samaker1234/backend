const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

// Fallback DATABASE_URL si dotenv ne fonctionne pas
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://delamou_user:N7PlO9zvYJ9TKuA2Ejqhl58dFvCSKne9@dpg-d7go6pnavr4c73aejm4g-a.virginia-postgres.render.com/delamou';

async function initDatabase() {
  try {
    console.log('🔄 Initialisation de la base de données PostgreSQL...');
    console.log('DATABASE_URL:', DATABASE_URL ? 'Set' : 'Not set');
    
    const pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
    });

    // Lire le schéma SQL
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Exécuter le schéma
    await pool.query(schema);
    console.log('✅ Tables créées avec succès');

    await pool.end();
    console.log('🎉 Base de données initialisée avec succès');
    process.exit(0);
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation:', error);
    process.exit(1);
  }
}

initDatabase();
