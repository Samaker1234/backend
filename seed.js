const { Pool } = require('pg');
require('dotenv').config();

const projects = [
  {
    title: 'Prédiction des Maladies Cardiaques',
    description: 'Modèle de Machine Learning utilisant Random Forest pour prédire les maladies cardiaques avec une précision de 92%. Analyse de données médicales et visualisation des résultats.',
    tools: ['Python', 'Scikit-learn', 'Pandas', 'Matplotlib'],
    github_url: 'https://github.com/Delamou1234/heart-disease-prediction',
    demo_url: 'https://heart-disease-demo.vercel.app',
    image_url: null,
    category: 'Machine Learning'
  },
  {
    title: 'Analyse de Sentiments NLP',
    description: 'Application d\'analyse de sentiments en temps réel utilisant BERT et FastAPI. Classification des avis clients en 3 catégories avec une précision de 89%.',
    tools: ['Python', 'Transformers', 'FastAPI', 'React'],
    github_url: 'https://github.com/Delamou1234/sentiment-analysis',
    demo_url: null,
    image_url: null,
    category: 'NLP'
  },
  {
    title: 'Dashboard de Ventes Interactif',
    description: 'Tableau de bord interactif pour visualiser les données de vente en temps réel. Utilisation de Plotly Dash avec filtres dynamiques et graphiques interactifs.',
    tools: ['Python', 'Plotly', 'Dash', 'Pandas'],
    github_url: 'https://github.com/Delamou1234/sales-dashboard',
    demo_url: 'https://sales-dashboard-demo.vercel.app',
    image_url: null,
    category: 'Visualisation de données'
  },
  {
    title: 'Détection d\'Objets en Temps Réel',
    description: 'Système de détection d\'objets utilisant YOLOv8 pour identifier et localiser des objets dans des flux vidéo en temps réel avec une latence minimale.',
    tools: ['Python', 'OpenCV', 'YOLO', 'PyTorch'],
    github_url: 'https://github.com/Delamou1234/object-detection',
    demo_url: null,
    image_url: null,
    category: 'Vision par ordinateur'
  }
];

async function seedDatabase() {
  try {
    console.log('✅ Connexion à PostgreSQL...');
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: process.env.DATABASE_URL?.includes('render.com') ? { rejectUnauthorized: false } : false
    });

    // Nettoyer la table
    await pool.query('DELETE FROM projects');
    console.log('🗑️ Table nettoyée');
    
    // Insérer les projets
    for (const project of projects) {
      await pool.query(
        'INSERT INTO projects (title, description, tools, github_url, demo_url, image_url, category) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [project.title, project.description, project.tools, project.github_url, project.demo_url, project.image_url, project.category]
      );
    }
    console.log('✅ Projets insérés avec succès');
    console.log(`📊 ${projects.length} projets ajoutés`);

    await pool.end();
    console.log('🎉 Seed terminé avec succès');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erreur:', err);
    process.exit(1);
  }
}

seedDatabase();
