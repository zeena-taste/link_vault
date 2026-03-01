import express from 'express';
import pool from '../data/db.js';

const router = express.Router();

// GET all links
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM links ORDER BY id DESC');
    const links = result.rows.map(r => ({ ...r, collectionId: r.collection_id }));
    res.json(links);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read links" });
  }
});

// GET unassigned — MUST be before /:id
router.get('/unassigned', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM links WHERE collection_id IS NULL ORDER BY id DESC');
    const links = result.rows.map(r => ({ ...r, collectionId: r.collection_id }));
    res.json(links);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch unassigned links" });
  }
});

// GET links by collection — MUST be before /:id
router.get('/collection/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM links WHERE collection_id = $1 ORDER BY id DESC',
      [req.params.id]
    );
    const links = result.rows.map(r => ({ ...r, collectionId: r.collection_id }));
    res.json(links);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch links by collection" });
  }
});

// GET link by ID
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM links WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Link not found' });
    const link = { ...result.rows[0], collectionId: result.rows[0].collection_id };
    res.json(link);
  } catch (err) {
    res.status(500).json({ error: "Failed to read link" });
  }
});

// POST add new link
router.post('/', async (req, res) => {
  try {
    const { name, url, notes = '', collectionId = null } = req.body;
    const id = Date.now();
    const result = await pool.query(
      'INSERT INTO links (id, name, url, notes, collection_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [id, name, url, notes, collectionId]
    );
    const link = { ...result.rows[0], collectionId: result.rows[0].collection_id };
    res.status(201).json(link);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to add link" });
  }
});

// PUT update link
router.put('/:id', async (req, res) => {
  try {
    const { name, url, notes, collectionId } = req.body;
    const result = await pool.query(
      `UPDATE links SET
        name = COALESCE($1, name),
        url = COALESCE($2, url),
        notes = COALESCE($3, notes),
        collection_id = COALESCE($4, collection_id)
       WHERE id = $5 RETURNING *`,
      [name, url, notes, collectionId, req.params.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: "Link not found" });
    const link = { ...result.rows[0], collectionId: result.rows[0].collection_id };
    res.json(link);
  } catch (err) {
    res.status(500).json({ error: "Failed to update link" });
  }
});

// DELETE link
router.delete('/:id', async (req, res) => {
  try {
    const result = await pool.query('DELETE FROM links WHERE id = $1 RETURNING *', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "Link not found" });
    const link = { ...result.rows[0], collectionId: result.rows[0].collection_id };
    res.json(link);
  } catch (err) {
    res.status(500).json({ error: "Failed to delete link" });
  }
});

export default router;
