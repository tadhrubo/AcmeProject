# Acme AI - Task Management Portal

A full-stack, responsive project and task management portal built for the Acme AI technical assessment.

## Tech Stack
* **Framework:** Next.js (App Router)
* **Database:** PostgreSQL (hosted on Supabase)
* **ORM:** Prisma
* **Styling:** Tailwind CSS

## Local Setup Instructions

1. **Install dependencies:**

    npm install

2. **Environment Configuration:**
   Copy the `.env.example` file to a new `.env` file and add your PostgreSQL connection string.
   
    cp .env.example .env

3. **Database Setup:**
   Push the Prisma schema to your database to create the necessary tables and generate the client.
   
    npx prisma db push

4. **Run the Development Server:**

    npm run dev
   
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Docker Deployment
To run this application via Docker:

    docker build -t acme-ai-tasks .
    docker run -p 3000:3000 --env-file .env acme-ai-tasks

## AI Usage Disclosure
In accordance with the assessment guidelines, AI tools were used strictly for generating standard structural boilerplate, including the `Dockerfile`, `.env.example`, and baseline Tailwind CSS grid layouts. All core application logic, state management, Prisma schemas, API route handlers, and data fetching mechanics were implemented manually.