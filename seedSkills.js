const { Pool } = require('pg');
require('dotenv').config();

const skills = [
  // Expertise Mathématique et Statistique
  { name: 'Statistiques descriptives et inférentielles', category: 'Expertise Mathématique et Statistique', level: 90 },
  { name: 'Tests d\'hypothèses', category: 'Expertise Mathématique et Statistique', level: 88 },
  { name: 'Analyse de variance', category: 'Expertise Mathématique et Statistique', level: 85 },
  { name: 'Algèbre linéaire', category: 'Expertise Mathématique et Statistique', level: 82 },
  { name: 'Calcul différentiel', category: 'Expertise Mathématique et Statistique', level: 80 },
  { name: 'Probabilités', category: 'Expertise Mathématique et Statistique', level: 85 },

  // Programmation et Ingénierie des Données
  { name: 'Python', category: 'Programmation et Ingénierie des Données', level: 97 },
  { name: 'R', category: 'Programmation et Ingénierie des Données', level: 70 },
  { name: 'SQL', category: 'Programmation et Ingénierie des Données', level: 92 },
  { name: 'Pandas / NumPy', category: 'Programmation et Ingénierie des Données', level: 95 },
  { name: 'Apache Spark', category: 'Programmation et Ingénierie des Données', level: 75 },
  { name: 'AWS / Azure / GCP', category: 'Programmation et Ingénierie des Données', level: 70 },
  { name: 'BeautifulSoup / Scrapy', category: 'Programmation et Ingénierie des Données', level: 85 },
  { name: 'Bash / Shell', category: 'Programmation et Ingénierie des Données', level: 75 },

  // Machine Learning et Modélisation
  { name: 'Scikit-Learn', category: 'Machine Learning et Modélisation', level: 95 },
  { name: 'Random Forest', category: 'Machine Learning et Modélisation', level: 92 },
  { name: 'XGBoost / LightGBM', category: 'Machine Learning et Modélisation', level: 90 },
  { name: 'SVM', category: 'Machine Learning et Modélisation', level: 85 },
  { name: 'K-means Clustering', category: 'Machine Learning et Modélisation', level: 88 },
  { name: 'PCA', category: 'Machine Learning et Modélisation', level: 82 },
  { name: 'TensorFlow / Keras', category: 'Machine Learning et Modélisation', level: 85 },
  { name: 'PyTorch', category: 'Machine Learning et Modélisation', level: 80 },
  { name: 'HuggingFace', category: 'Machine Learning et Modélisation', level: 82 },
  { name: 'Computer Vision', category: 'Machine Learning et Modélisation', level: 75 },
  { name: 'NLP (BERT, Transformers)', category: 'Machine Learning et Modélisation', level: 85 },

  // Communication et Business Intelligence
  { name: 'Matplotlib / Seaborn', category: 'Communication et Business Intelligence', level: 92 },
  { name: 'Plotly / Dash', category: 'Communication et Business Intelligence', level: 88 },
  { name: 'Streamlit', category: 'Communication et Business Intelligence', level: 90 },
  { name: 'Power BI', category: 'Communication et Business Intelligence', level: 78 },
  { name: 'Tableau', category: 'Communication et Business Intelligence', level: 75 },
  { name: 'Data Storytelling', category: 'Communication et Business Intelligence', level: 85 },
  { name: 'Domain Expertise RH', category: 'Communication et Business Intelligence', level: 80 },
];

async function seedSkills() {
  try {
    console.log('✅ Connexion à PostgreSQL...');
    const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://delamou_user:N7PlO9zvYJ9TKuA2Ejqhl58dFvCSKne9@dpg-d7go6pnavr4c73aejm4g-a/delamou';
    const pool = new Pool({
      connectionString: DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      }
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
