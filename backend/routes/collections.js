import express from 'express';
import { readData, writeData } from '../data/db.js';

const router = express.Router();

// GET all collections
router.get("/", async (req, res) => {
  try {
    const data = await readData();
    res.json(data.collections);
  } catch (err) {
    res.status(500).json({ error: "Failed to read collections" });
  }
});

// GET collection by ID
router.get('/:id', async (req, res) => {
  try {
    const data = await readData();
    const collection = data.collections.find(       // FIX: was "colleciton" (typo)
      c => c.id === Number(req.params.id)
    );
    if (!collection) return res.status(404).json({ error: 'Collection not found' });
    res.json(collection);
  } catch (err) {
    res.status(500).json({ error: "Failed to read collection" });
  }
});

// POST add new collection
router.post("/", async (req, res) => {
  try {
    const data = await readData();
    const newCollection = {
      id: Date.now(),           // FIX: was "Data.now()" (capital D = ReferenceError)
      name: req.body.name
    };
    data.collections.push(newCollection);
    await writeData(data);
    res.status(201).json(newCollection);
  } catch (err) {
    res.status(500).json({ error: "Failed to create collection" });
  }
});

// PUT update collection
router.put("/:id", async (req, res) => {
  try {
    const data = await readData();
    const index = data.collections.findIndex(       // FIX: was "data.collection" (missing "s")
      c => c.id === Number(req.params.id)
    );
    if (index === -1) return res.status(404).json({ error: "Collection not found" });

    data.collections[index].name = req.body.name;
    await writeData(data);

    res.json(data.collections[index]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update collection" });
  }
});

// DELETE collection
router.delete("/:id", async (req, res) => {
  try {
    const data = await readData();
    const index = data.collections.findIndex(
      c => c.id === Number(req.params.id)
    );
    if (index === -1) return res.status(404).json({ error: "Collection not found" });
    // FIX 1: was "index === 1" (missing minus = wrong condition, never caught missing items)
    // FIX 2: was "res.status.json(...)" (missing "()" after status = crash)

    const deleted = data.collections.splice(index, 1);
    await writeData(data);

    res.json(deleted[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete collection" });
  }
});

export default router;
