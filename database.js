import 'dotenv/config';
import pg from 'pg';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1
});

export const db = {
  async list() {
    const result = await pool.query(
      'SELECT id, name, status FROM projects ORDER BY id DESC'
    );
    return result.rows;
  },
  async create({ name, status }) {
    const result = await pool.query(
      'INSERT INTO projects (name, status) VALUES ($1, $2) RETURNING id, name, status',
      [name, status]
    );
    return result.rows[0];
  },
  async update(id, { name, status }) {
    const result = await pool.query(
      'UPDATE projects SET name = $1, status = $2 WHERE id = $3 RETURNING id, name, status',
      [name, status, id]
    );
    return result.rows[0] || null;
  },
  async remove(id) {
    const result = await pool.query('DELETE FROM projects WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
};