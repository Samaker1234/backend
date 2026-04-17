const express = require('express');
const router = express.Router();

// GET toutes les compétences
router.get('/', async (req, res) => {
  try {
    const result = await global.pool.query('SELECT * FROM skills ORDER BY category, name');
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des compétences:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des compétences' });
  }
});

// GET une compétence par ID
router.get('/:id', async (req, res) => {
  try {
    const result = await global.pool.query('SELECT * FROM skills WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Compétence non trouvée' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la récupération de la compétence:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la compétence' });
  }
});

// POST créer une nouvelle compétence
router.post('/', async (req, res) => {
  try {
    const { name, category, level, icon } = req.body;
    const result = await global.pool.query(
      'INSERT INTO skills (name, category, level, icon) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, category, level, icon]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la création de la compétence:', error);
    res.status(400).json({ error: 'Erreur lors de la création de la compétence' });
  }
});

// PUT mettre à jour une compétence
router.put('/:id', async (req, res) => {
  try {
    const { name, category, level, icon } = req.body;
    const result = await global.pool.query(
      'UPDATE skills SET name = $1, category = $2, level = $3, icon = $4 WHERE id = $5 RETURNING *',
      [name, category, level, icon, req.params.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Compétence non trouvée' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la compétence:', error);
    res.status(400).json({ error: 'Erreur lors de la mise à jour de la compétence' });
  }
});

// DELETE supprimer une compétence
router.delete('/:id', async (req, res) => {
  try {
    await global.pool.query('DELETE FROM skills WHERE id = $1', [req.params.id]);
    res.json({ message: 'Compétence supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la compétence:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la compétence' });
  }
});

module.exports = router;
