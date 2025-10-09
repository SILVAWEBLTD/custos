import { faker } from '@faker-js/faker';
import fs from 'node:fs';

faker.seed(42); // deterministic output across runs

const USER_COUNT = 1000; // tune as needed
const POSTS_PER_USER = 2; // tune as needed
const USERS_CHUNK = 50; // reduce if you still hit limits
const POSTS_CHUNK = 50; // reduce if you still hit limits

function escapeSql(str) {
  return String(str).replaceAll("'", "''");
}

const users = [];
const emails = new Set();
while (users.length < USER_COUNT) {
  const first = faker.person.firstName();
  const last = faker.person.lastName();
  const email = faker.internet
    .email({ firstName: first, lastName: last })
    .toLowerCase();
  if (emails.has(email)) continue;
  emails.add(email);
  users.push({ email, name: `${first} ${last}` });
}

const lines = [];
lines.push('-- Generated seed data (batched, no explicit transactions)');

// =========================================
// Users seeds (batched)
// =========================================
lines.push('-- Users seeds');

for (let i = 0; i < users.length; i += USERS_CHUNK) {
  const chunk = users.slice(i, i + USERS_CHUNK);
  const values = chunk
    .map((u) => `('${escapeSql(u.email)}','${escapeSql(u.name)}')`)
    .join(',\n');

  lines.push(
    `INSERT INTO users (email, name)
VALUES
${values}
ON CONFLICT(email) DO NOTHING;`
  );
}

// =========================================
// Posts seeds (batched via CTE + ANSI dedupe)
// =========================================
lines.push('-- Posts seeds');

const postSeeds = [];
for (const u of users) {
  for (let i = 0; i < POSTS_PER_USER; i++) {
    const title = escapeSql(faker.lorem.sentence({ min: 3, max: 6 }));
    const content = escapeSql(faker.lorem.paragraph());
    postSeeds.push(`('${escapeSql(u.email)}','${title}','${content}')`);
  }
}

for (let i = 0; i < postSeeds.length; i += POSTS_CHUNK) {
  const chunk = postSeeds.slice(i, i + POSTS_CHUNK).join(',\n');

  lines.push(
    `WITH seeds(email, title, content) AS (
VALUES
${chunk}
)
INSERT INTO posts (title, content, user_id)
SELECT s.title, s.content, u.id
FROM seeds s
JOIN users u ON u.email = s.email
WHERE NOT EXISTS (
  SELECT 1 FROM posts p
  WHERE p.title = s.title AND p.user_id = u.id
);`
  );
}

const output = lines.join('\n\n') + '\n';
fs.writeFileSync(new URL('./seeds.sql', import.meta.url), output, 'utf8');
console.log('Wrote seeds to database/seeds.sql');
