## Project Description
This is the backend for the Leaper project, a basic LMS built around Nest.js and Flutter. This backend is written in Nest.js
Note: This Project is Divided into two Repos. For the Front End Repo, see https://github.com/local-fish/Leaper

Currently the project encompasses the following API
- Course System
- Schedule System
- Forum System

Todo:
- Assessment System

## Requirements

- [`Bun`](https://bun.sh/)

## Setup

1. Install dependencies: `bun i`

2. Configure database: `cp .env.example .env`

3. Generate database: `bun prisma generate && bun prisma db push`

## Running

Run `bun start`
