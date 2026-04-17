const { Pool } = require('pg');
require('dotenv').config();

const skills = [
  // Machine Learning
  { name: 'Scikit-Learn', category: 'Machine Learning', level: 95 },
  { name: 'XGBoost / LightGBM', category: 'Machine Learning', level: 90 },
  { name: 'Feature Engineering', category: 'Machine Learning', level: 92 },
  { name: 'Model Evaluation', category: 'Machine Learning', level: 93 },
  
  // Deep Learning
  { name: 'TensorFlow / Keras', category: 'Deep Learning', level: 85 },
  { name: 'PyTorch', category: 'Deep Learning', level: 80 },
  { name: 'HuggingFace', category: 'Deep Learning', level: 82 },
  { name: 'Computer Vision', category: 'Deep Learning', level: 75 },
  
  // Programmation
  { name: 'Python', category: 'Programmation', level: 97 },
  { name: 'SQL', category: 'Programmation', level: 90 },
  { name: 'R', category: 'Programmation', level: 65 },
  { name: 'Bash / Shell', category: 'Programmation', level: 70 },
  
  // Ingénierie des données
  { name: 'Pandas / NumPy', category: 'Ingénierie des données', level: 95 },
  { name: 'Apache Spark', category: 'Ingénierie des données', level: 70 },
  { name: 'PostgreSQL', category: 'Ingénierie des données', level: 85 },
  { name: 'ETL Pipelines', category: 'Ingénierie des données', level: 80 },
  
  // Visualisation
  { name: 'Matplotlib / Seaborn', category: 'Visualisation', level: 92 },
  { name: 'Plotly / Dash', category: 'Visualisation', level: 88 },
  { name: 'Streamlit', category: 'Visualisation', level: 90 },
  { name: 'Power BI', category: 'Visualisation', level: 75 },
  
  // MLOps & Outils
  { name: 'Docker', category: 'MLOps & Outils', level: 80 },
  { name: 'MLflow', category: 'MLOps & Outils', level: 78 },
  { name: 'FastAPI', category: 'MLOps & Outils', level: 83 },
  { name: 'Git / GitHub', category: 'MLOps & Outils', level: 90 },
];

async function seedSkills() {
  try {
    console.log('✅ Connexion à PostgreSQL...');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL?.includes('render.com') ? { rejectUnauthorized: false } : false
    });

    // Nettoyer la table skills
    await pool.query('DELETE FROM skills');
    console.log('🗑️ Table skills nettoyée');
    
    // Insérer les compétences
    for (const skill of skills) {
      await pool.query(
        'INSERT INTO skills (name, category, level) VALUES ($1, $2, $3)',
        [skill.name, skill.category, skill.level]
      );
    }
    console.log('✅ Compétences insérées avec succès');
    console.log(`📊 ${skills.length} compétences ajoutées`);

    await pool.end();
    console.log('🎉 Seed des compétences terminé avec succès');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur:', err);
    process.exit(1);
  }
}

seedSkills();
