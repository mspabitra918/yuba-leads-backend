// Shared database config used by both sequelize-cli (migrations) and the
// NestJS SequelizeModule. Reads from environment; defaults to local SQLite.
require('dotenv').config();

const dialect = process.env.DB_DIALECT || 'sqlite';

// Hosted Postgres (Supabase/Heroku/RDS) requires SSL; a local Postgres does not.
function needsSsl(url) {
  try {
    const host = new URL(url).hostname;
    return host !== 'localhost' && host !== '127.0.0.1';
  } catch {
    return true;
  }
}

function buildConfig() {
  // Prefer a full connection string when provided (e.g. Postgres on a host).
  if (process.env.DATABASE_URL) {
    return {
      url: process.env.DATABASE_URL,
      dialect: 'postgres',
      logging: false,
      ...(needsSsl(process.env.DATABASE_URL)
        ? { dialectOptions: { ssl: { require: true, rejectUnauthorized: false } } }
        : {}),
    };
  }

  if (dialect === 'sqlite') {
    return {
      dialect: 'sqlite',
      storage: process.env.DB_STORAGE || './yuba-leads.sqlite',
      logging: false,
    };
  }

  return {
    dialect,
    host: process.env.DB_HOST || '127.0.0.1',
    port: Number(process.env.DB_PORT) || 5432,
    database: process.env.DB_NAME || 'yuba_leads',
    username: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    logging: false,
  };
}

const config = buildConfig();

// sequelize-cli expects an object keyed by environment.
module.exports = {
  development: config,
  test: config,
  production: config,
};
