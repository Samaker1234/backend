const express = require('express');
const router = express.Router();
const { sendSkillNotification } = require('../services/emailService');

// GET toutes les compétences
router.get('/', async (req, res) => {
  try {
    const skills = await global.prisma.skill.findMany({
      orderBy: [
        { category: 'asc' },
        { name: 'asc' }
      ]
    });
    res.json(skills);
  } catch (error) {
    console.error('Erreur lors de la récupération des compétences:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des compétences' });
  }
});

// GET une compétence par ID
router.get('/:id', async (req, res) => {
  try {
    const skill = await global.prisma.skill.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!skill) {
      return res.status(404).json({ error: 'Compétence non trouvée' });
    }
    res.json(skill);
  } catch (error) {
    console.error('Erreur lors de la récupération de la compétence:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération de la compétence' });
  }
});

// POST créer une nouvelle compétence
router.post('/', async (req, res) => {
  try {
    const { name, category, level, icon } = req.body;
    const skill = await global.prisma.skill.create({
      data: { name, category, level, icon }
    });
    
    // Envoyer la notification par email
    await sendSkillNotification(skill);
    
    res.status(201).json(skill);
  } catch (error) {
    console.error('Erreur lors de la création de la compétence:', error);
    res.status(400).json({ error: 'Erreur lors de la création de la compétence' });
  }
});

// PUT mettre à jour une compétence
router.put('/:id', async (req, res) => {
  try {
    const { name, category, level, icon } = req.body;
    const skill = await global.prisma.skill.update({
      where: { id: parseInt(req.params.id) },
      data: { name, category, level, icon }
    });
    res.json(skill);
  } catch (error) {
    console.error('Erreur lors de la mise à jour de la compétence:', error);
    res.status(400).json({ error: 'Erreur lors de la mise à jour de la compétence' });
  }
});

// DELETE supprimer une compétence
router.delete('/:id', async (req, res) => {
  try {
    await global.prisma.skill.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Compétence supprimée avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression de la compétence:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression de la compétence' });
  }
});

module.exports = router;
