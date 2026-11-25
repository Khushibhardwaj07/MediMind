// Turns an EXISTING account into an admin. Run on your own computer:
//   npm run make:admin -- someone@example.com
// It needs access to the database, so it is not something a website visitor can do.
const { pool } = require('../src/config/db');

async function main() {
  const email = (process.argv[2] || '').trim().toLowerCase();

  if (!email) {
    console.error('Usage: npm run make:admin -- user@example.com');
    process.exitCode = 1;
    return;
  }

  const { rows } = await pool.query(
    "UPDATE users SET role = 'admin' WHERE email = $1 RETURNING id, email",
    [email]
  );

  if (rows.length === 0) {
    console.error(`No user found with email ${email}. Sign up first, then run this again.`);
    process.exitCode = 1;
    return;
  }

  await pool.query(
    'INSERT INTO audit_logs (user_id, action, entity, entity_id) VALUES ($1, $2, $3, $4)',
    [rows[0].id, 'ADMIN_PROMOTED_BY_SCRIPT', 'user', rows[0].id]
  );

  console.log(`Done. ${rows[0].email} is now an admin. Log in again to get a new token.`);
}

main()
  .catch((err) => {
    console.error('Failed:', err.message);
    process.exitCode = 1;
  })
  .finally(() => pool.end());