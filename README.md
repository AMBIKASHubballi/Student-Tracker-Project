# Student Project Tracker

A hands-on web app development workshop project. It adds, displays, edits and deletes engineering projects, and stores them in a SQLite database through an Express API.

## Run locally

Use the workshop Node 22 baseline (at least 22.18, below 23), Git and VS Code.
Open a PowerShell terminal inside the project, then run:

    npm.cmd ci
    npm.cmd start

Open http://localhost:3000. Stop the server with Ctrl+C.

## How it works

Browser HTML/CSS/JavaScript -> fetch/HTTP -> Express API -> SQLite -> JSON response -> updated page.

## Files

- `public/script.js`: browser code that loads, adds, edits and deletes projects
- `database.js`: SQLite setup and queries
- `data/projects.db`: the SQLite database (created locally)
- `server.js`: Express routes under `/api/projects`

## Verification (my actual checks)

- [x] POST returned 201 when adding a project
- [x] GET returned 200 and listed the projects
- [x] PUT returned 200 when editing a project
- [x] DELETE returned 200 when deleting a project
- [ ] Records survived a page refresh
- [ ] Records survived a server restart
- [ ] A second browser showed the same records

## Limitations

- Teaching project: no login and only basic input checks.
- Data is stored in one local SQLite file on this laptop.
- If the server is stopped, the page cannot load or save projects.
