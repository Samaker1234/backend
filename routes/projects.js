const express = require('express');
const router = express.Router();

// GET tous les projets
router.get('/', (req, res) => {
  try {
    const stmt = global.db.prepare('SELECT * FROM projects ORDER BY created_at ASC');
    const projects = [];
    while (stmt.step()) {
      const project = stmt.getAsObject();
      // Parser le champ tools qui est stocké comme JSON
      if (project.tools) {
        project.tools = JSON.parse(project.tools);
      }
      projects.push(project);
    }
    stmt.free();
    res.json(projects);
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des projets' });
  }
});

// GET un projet par ID
router.get('/:id', (req, res) => {
  try {
    const stmt = global.db.prepare('SELECT * FROM projects WHERE id = ?');
    stmt.bind([parseInt(req.params.id)]);
    const project = stmt.getAsObject()[0];
    if (!project) {
      return res.status(404).json({ error: 'Projet non trouvé' });
    }
    res.json(project);
  } catch (error) {
    console.error('Erreur lors de la récupération du projet:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération du projet' });
  }
});

// POST créer un nouveau projet
router.post('/', (req, res) => {
  try {
    const { title, description, tools, github_url, demo_url, image_url, category } = req.body;
    const stmt = global.db.prepare(
      'INSERT INTO projects (title, description, tools, github_url, demo_url, image_url, category) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    stmt.run([title, description, JSON.stringify(tools), github_url, demo_url, image_url, category]);
    const newProject = global.db.prepare('SELECT * FROM projects WHERE id = last_insert_rowid()').getAsObject()[0];
    res.status(201).json(newProject);
  } catch (error) {
    console.error('Erreur lors de la création du projet:', error);
    res.status(400).json({ error: 'Erreur lors de la création du projet' });
  }
});

// PUT mettre à jour un projet
router.put('/:id', (req, res) => {
  try {
    const { title, description, tools, github_url, demo_url, image_url, category } = req.body;
    const stmt = global.db.prepare(
      'UPDATE projects SET title = ?, description = ?, tools = ?, github_url = ?, demo_url = ?, image_url = ?, category = ? WHERE id = ?'
    );
    stmt.run([title, description, JSON.stringify(tools), github_url, demo_url, image_url, category, parseInt(req.params.id)]);
    const projectStmt = global.db.prepare('SELECT * FROM projects WHERE id = ?');
    projectStmt.bind([parseInt(req.params.id)]);
    const project = projectStmt.getAsObject()[0];
    if (!project) {
      return res.status(404).json({ error: 'Projet non trouvé' });
    }
    res.json(project);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du projet:', error);
    res.status(400).json({ error: 'Erreur lors de la mise à jour du projet' });
  }
});

// DELETE supprimer un projet
router.delete('/:id', (req, res) => {
  try {
    const stmt = global.db.prepare('DELETE FROM projects WHERE id = ?');
    stmt.run([parseInt(req.params.id)]);
    res.json({ message: 'Projet supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du projet' });
  }
});

module.exports = router;
