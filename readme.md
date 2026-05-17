<div align="center">
<img src="doc/icon.png" height="100px">
</div>
<br/>

# Leaper: Digital Learning Platform

Leaper is a digital platform to manage learning system.

This is the backend for the Leaper project, a basic LMS built around Nest.js and Flutter. This backend is written in Nest.js

> [!NOTE]
> This Project is Divided into two Repos. For the Front End Repo, see
> https://github.com/local-fish/Leaper

## Requirements

- [`Bun`](https://bun.sh/)
- [`MySql`](https://www.mysql.com/)

## Setup

1. Install dependencies: `bun i`

2. Configure environment: `cp .env.example .env`

3. Generate database: `bun prisma generate && bun prisma db push`

## Running

Run `bun start`
