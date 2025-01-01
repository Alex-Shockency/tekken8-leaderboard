# tekken8-leaderboard

Naisu Reamde

## Project Structure

```
.
└── tekken8-leaderboard/
    ├── backend/
    │   ├── src/
    │   │   ├── models/
    │   │   ├── routes/
    │   │   ├── tsconfig.json
    │   │   └── index.ts
    │   ├── .env
    │   ├── .gitignore
    │   ├── package-lock.json
    │   ├── package.json
    │   └── vercel.json
    ├── frontend/
    │   ├── .angular
    │   ├── src/
    │   │   ├── app
    │   │   ├── assets
    │   │   ├── environments
    │   │   ├── custom-theme.scss
    │   │   ├── favicon.ico
    │   │   ├── index.html
    │   │   ├── main.ts
    │   │   └── styles.scss
    │   ├── .editorconfig
    │   ├── .gitignore
    │   ├── angular.json
    │   ├── package-lock.json
    │   └── package.json
    ├── LICENSE
    └── README.md
```

Using a mono-repo approach, server-side code (mongoDB client, mongoose, ExpressJS) lives in `backend`. Client-side code (Angular, Sass), lives in `frontend`

## Running Project

### Server

1. Navigate to `tekken8-leaderboard/backend`.
2. Run `npm i` to install dependencies if first time install. Else run `npm ci`.
3. Run `npm run dev` to start dev server at localhost:3000.

### Client

1. Navigate to `tekken8-leaderboard/frontend`.
2. Run `npm i` to install dependencies if first time install. Else run `npm ci`.
3. Run `npm run start` to start dev server at localhost:4200.
