import express from 'express';
import pool from '../data/db.js';

const router = express.Router();

// GET all collections
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM collections ORDER BY id DESC');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read collections" });
  }
});

// GET collection by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM collections WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Collection not found' });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to read collection" });
  }
});

// POST add new collection
router.post('/', async (req, res) => {
  try {
    const id = Date.now();
    const result = await pool.query(
      'INSERT INTO collections (id, name) VALUES ($1, $2) RETURNING *',
      [id, req.body.name]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to create collection" });
  }
});

// PUT update collection
router.put('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'UPDATE collections SET name = $1 WHERE id = $2 RETURNING *',
      [req.body.name, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Collection not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to update collection" });
  }
});

// DELETE collection
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM collections WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Collection not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete collection" });
  }
});

export default router;
