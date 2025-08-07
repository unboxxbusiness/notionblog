# Notion Blog

## Project Title
Notion Blog

## Description
This is a Next.js blog platform that uses Notion as a Content Management System (CMS). It allows you to write and manage your blog posts in Notion and display them on a modern, fast website built with Next.js.

## Features
- Integration with Notion API for content management.
- Dynamic routing for blog posts based on Notion pages.
- Tagging and categorization of posts.
- Search functionality for finding posts.
- Pagination for browsing through posts.
- Responsive design with Tailwind CSS.
- Theming (Light/Dark mode).
- Hero section for the latest post.
- Newsletter subscription form (integrated with Notion database).
- Social sharing options.

## Technologies Used
- Next.js
- React
- TypeScript
- Tailwind CSS
- Notion API
- Framer Motion (for animations)
- Lucide React (for icons)
- date-fns (for date formatting)
- zod (for form validation)

## Setup

### 1. Clone the Repository


bash git clone <repository_url> cd notion-blog

### 2. Install Dependencies


bash npm install

yarn install

pnpm install

### 3. Set up Environment Variables

You will need to create a `.env.local` file in the root of your project to store your Notion API key and database ID.


NOTION_SUBSCRIBERS_API_KEY=your_notion_api_key NOTION_SUBSCRIBERS_DATABASE_ID=your_notion_database_id

Replace `your_notion_api_key` with your actual Notion API key and `your_notion_database_id` with the ID of your Notion database where you will store subscriber information.

You will also need to set up a Notion database for your blog posts and obtain its ID. This ID will be used within the application code to fetch your posts. Look for where the database ID is used to fetch posts (likely in `src/lib/posts.ts`) and replace it with your blog post database ID.

### 4. Connect to Notion CMS

1.  **Create a Notion Integration:** Go to your Notion settings, find "Integrations," and create a new integration. Give it a name (e.g., "Blog CMS Integration") and select the workspace you want to use. Copy the "Internal Integration Token" – this is your API key (`NOTION_SUBSCRIBERS_API_KEY`).
2.  **Create Notion Databases:** Create two databases in your Notion workspace: one for your blog posts and one for newsletter subscribers.
3.  **Share Databases with Integration:** Share the blog posts database and the subscribers database with the integration you just created. You can do this by inviting the integration to the database page.
4.  **Get Database IDs:** Open each database as a full page. The database ID is part of the URL. For example, in the URL `https://www.notion.so/your_workspace/<database_id>?v=<view_id>`, the `<database_id>` is the one you need. Copy the IDs for both your blog posts database and your subscribers database (`NOTION_SUBSCRIBERS_DATABASE_ID`).

## Usage

### Running Locally


bash npm run dev

yarn dev

pnpm dev

This will start the development server at `http://localhost:3000`.

### Adding New Posts

1.  Go to your Notion blog posts database.
2.  Add a new page (row) to the database.
3.  Fill in the properties for your post (e.g., Title, Slug, Published Date, Tags, Featured Image, Excerpt). Make sure you have properties set up in your Notion database that correspond to the data the blog expects (check `src/lib/types.ts` for the expected data structure).
4.  Write your blog content within the Notion page.

The blog will fetch and display the published posts from your Notion database.

## Contributing
Contributions are welcome! Please feel free
