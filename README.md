# 🗂️ File Explorer Web App

A modern web-based file explorer inspired by **Windows Explorer**, built using:

- ⚡ [Elysia](https://elysiajs.com/) (Bun backend)
- 🗃️ PostgreSQL
- 🌿 [Vue 3](https://vuejs.org/)
- ✨ Clean UI with two-panel layout

## ⚙️ Requirements

[Bun](https://bun.sh/) | v1.1+ | [bun.sh](https://bun.sh/) |
[Node.js](https://nodejs.org/) | v18+ | [nodejs.org](https://nodejs.org/) |
[PostgreSQL](https://www.postgresql.org/) | v14+ | [postgresql.org](https://www.postgresql.org/) |

## 🧩 Database Setup

createdb directory_tree_db

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS ltree;

CREATE TABLE items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  parent_id UUID,
  is_folder BOOLEAN NOT NULL DEFAULT false,
  extension TEXT,
  path LTREE NOT NULL,
  depth INT DEFAULT 0
);

-- Root
INSERT INTO items (name, path, depth, is_folder)
VALUES ('Root', uuid_generate_v4()::text, 0, TRUE);

-- Documents
WITH root AS (SELECT id, path, depth FROM items WHERE name='Root')
INSERT INTO items (name, parent_id, is_folder, path, depth)
SELECT
  'Documents',
  root.id,
  TRUE,
  root.path || '.' || uuid_generate_v4()::text,
  root.depth + 1
FROM root;

-- Pictures
WITH root AS (SELECT id, path, depth FROM items WHERE name='Root')
INSERT INTO items (name, parent_id, is_folder, path, depth)
SELECT
  'Pictures',
  root.id,
  TRUE,
  root.path || '.' || uuid_generate_v4()::text,
  root.depth + 1
FROM root;

-- File sample in Pictures
WITH pictures AS (SELECT id, path, depth FROM items WHERE name='Pictures')
INSERT INTO items (name, parent_id, is_folder, extension, path, depth)
SELECT
  'holiday.png',
  pictures.id,
  FALSE,
  '.png',
  pictures.path || '.' || uuid_generate_v4()::text,
  pictures.depth + 1
FROM pictures;

## 🧠 Backend Setup (Elysia + Bun)
cd backend
bun install
bun run dev

## 🌿 Frontend Setup (Vue 3)
cd frontend
bun install
bun run dev

## 🔌 API Endpoints
Method	Endpoint	           Description
GET	    /api/v1/folders	     Get all root folders
GET	    /api/v1/folders/:id	 Get children of a folder




