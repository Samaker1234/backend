const express = require('express');
const router = express.Router();
const { sendProjectNotification } = require('../services/emailService');

// GET tous les projets
router.get('/', async (req, res) => {
  try {
    const projects = await global.prisma.project.findMany({
      orderBy: { createdAt: 'asc' }
    });
    res.json(projects);
  } catch (error) {
    console.error('Erreur lors de la récupération des projets:', error);
    res.status(500).json({ error: 'Erreur lors de la récupération des projets' });
  }
});

// POST import groupé (bulk)
router.post('/bulk', async (req, res) => {
  const projects = req.body;
  if (!Array.isArray(projects)) {
    return res.status(400).json({ error: 'Le corps de la requête doit être un tableau de projets' });
  }

  try {
    const createdProjects = await global.prisma.project.createMany({
      data: projects.map(p => ({
        title: p.title,
        description: p.description,
        tools: p.tools || [],
        github_url: p.github_url,
        demo_url: p.demo_url,
        image_url: p.image_url,
        category: p.category
      })),
      skipDuplicates: true
    });

    res.json({
      message: `${createdProjects.count} projets importés avec succès`,
      count: createdProjects.count
    });
  } catch (error) {
    console.error('Erreur lors de l\'import groupé:', error);
    res.status(500).json({ error: 'Erreur lors de l\'importation des projets' });
  }
});

// GET un projet par ID
router.get('/:id', async (req, res) => {
  try {
    const project = await global.prisma.project.findUnique({
      where: { id: parseInt(req.params.id) }
    });
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
router.post('/', async (req, res) => {
  try {
    const { title, description, tools, github_url, demo_url, image_url, category } = req.body;
    const project = await global.prisma.project.create({
      data: {
        title,
        description,
        tools: tools || [],
        github_url,
        demo_url,
        image_url,
        category
      }
    });

    // Envoyer la notification par email
    await sendProjectNotification(project);

    res.status(201).json(project);
  } catch (error) {
    console.error('Erreur lors de la création du projet:', error);
    res.status(400).json({ error: 'Erreur lors de la création du projet' });
  }
});

// PUT mettre à jour un projet
router.put('/:id', async (req, res) => {
  try {
    const { title, description, tools, github_url, demo_url, image_url, category } = req.body;
    const project = await global.prisma.project.update({
      where: { id: parseInt(req.params.id) },
      data: {
        title,
        description,
        tools: tools || [],
        github_url,
        demo_url,
        image_url,
        category
      }
    });
    res.json(project);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du projet:', error);
    res.status(400).json({ error: 'Erreur lors de la mise à jour du projet' });
  }
});

// DELETE supprimer un projet
router.delete('/:id', async (req, res) => {
  try {
    await global.prisma.project.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.json({ message: 'Projet supprimé avec succès' });
  } catch (error) {
    console.error('Erreur lors de la suppression du projet:', error);
    res.status(500).json({ error: 'Erreur lors de la suppression du projet' });
  }
});

module.exports = router;
