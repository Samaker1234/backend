const express = require('express');
const router = express.Router();

// GET tous les projets
router.get('/', async (req, res) => {
  try {
    const result = await global.pool.query('SELECT * FROM projects ORDER BY created_at ASC');
    const projects = result.rows.map(project => ({
      ...project,
      tools: project.tools || []
    }));
    res.json(projects);
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des projets' });
  }
});

// GET un projet par ID
router.get('/:id', async (req, res) => {
  try {
    const result = await global.pool.query('SELECT * FROM projects WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Projet non trouvé' });
    }
    const project = result.rows[0];
    res.json({
      ...project,
      tools: project.tools || []
    });
  } catch (error) {
    console.error('Erreur lors de la récupération du projet:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du projet' });
  }
});

// POST créer un nouveau projet
router.post('/', async (req, res) => {
  try {
    const { title, description, tools, github_url, demo_url, image_url, category } = req.body;
    const result = await global.pool.query(
      'INSERT INTO projects (title, description, tools, github_url, demo_url, image_url, category) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [title, description, tools || [], github_url, demo_url, image_url, category]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la création du projet:', error);
    res.status(400).json({ error: 'Erreur lors de la création du projet' });
  }
});

// PUT mettre à jour un projet
router.put('/:id', async (req, res) => {
  try {
    const { title, description, tools, github_url, demo_url, image_url, category } = req.body;
    const result = await global.pool.query(
      'UPDATE projects SET title = $1, description = $2, tools = $3, github_url = $4, demo_url = $5, image_url = $6, category = $7 WHERE id = $8 RETURNING *',
      [title, description, tools || [], github_url, demo_url, image_url, category, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Projet non trouvé' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du projet:', error);
    res.status(400).json({ error: 'Erreur lors de la mise à jour du projet' });
  }
});

// DELETE supprimer un projet
router.delete('/:id', async (req, res) => {
  try {
    await global.pool.query('DELETE FROM projects WHERE id = $1', [req.params.id]);
    res.json({ message: 'Projet supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du projet' });
  }
});

module.exports = router;
