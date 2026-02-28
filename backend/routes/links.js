import express from 'express';
import { readData, writeData } from '../data/db.js';

const router = express.Router();

// GET all links
router.get('/', async (req, res) => {
  try {
    const data = await readData();
    res.json(data.links);
  } catch (err) {
    res.status(500).json({ error: "Failed to read links" });
  }
});

// /unassigned MUST come before /:id
router.get('/unassigned', async (req, res) => {
  try {
    const data = await readData();
    const unassignedLinks = data.links.filter(link => link.collectionId === null);
    res.json(unassignedLinks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch unassigned links" });
  }
});

// GET links by collection — also before /:id
router.get('/collection/:id', async (req, res) => {
  try {
    const data = await readData();
    const collectionId = Number(req.params.id);
    const filteredLinks = data.links.filter(link => link.collectionId === collectionId);
    res.json(filteredLinks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch links by collection" });
  }
});

// GET link by ID
router.get('/:id', async (req, res) => {
  try {
    const data = await readData();
    const link = data.links.find(l => l.id === Number(req.params.id));
    if (!link) return res.status(404).json({ error: 'Link not found' });
    res.json(link);
  } catch (err) {
    res.status(500).json({ error: "Failed to read link" });
  }
});

// POST add new link
router.post("/", async (req, res) => {
  try {
    const data = await readData();
    const newLink = {
      id: Date.now(),
      name: req.body.name,
      url: req.body.url,
      notes: req.body.notes ?? "",        // FIX: notes was never being saved
      collectionId: req.body.collectionId ?? null
    };
    data.links.push(newLink);
    await writeData(data);
    res.status(201).json(newLink);
  } catch (err) {
    res.status(500).json({ error: "Failed to add new link" });
  }
});

// PUT update link
router.put('/:id', async (req, res) => {
  try {
    const data = await readData();
    const linkId = Number(req.params.id);
    const index = data.links.findIndex(link => link.id === linkId);

    if (index === -1) return res.status(404).json({ error: "Link not found" });

    const updatedLink = {
      ...data.links[index],
      name: req.body.name ?? data.links[index].name,
      url: req.body.url ?? data.links[index].url,
      notes: req.body.notes ?? data.links[index].notes,  // FIX: notes was never being updated
      collectionId: req.body.collectionId ?? data.links[index].collectionId
    };

    data.links[index] = updatedLink;
    await writeData(data);

    res.json(updatedLink);
  } catch (err) {
    res.status(500).json({ error: "Failed to update link" });
  }
});

// DELETE link
router.delete("/:id", async (req, res) => {
  try {
    const data = await readData();
    const linkId = Number(req.params.id);
    const index = data.links.findIndex(link => link.id === linkId);

    if (index === -1) return res.status(404).json({ error: "Link not found" });

    const deletedLink = data.links.splice(index, 1)[0];
    await writeData(data);

    res.json(deletedLink);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete link" });
  }
});

export default router;
