
import 'server-only';
import { Client } from '@notionhq/client';
import { cache } from 'react';

export const getSiteSettings = cache(async (): Promise<{ [key: string]: string }> => {
    const notionClient = process.env.NOTION_POSTS_API_KEY ? new Client({ auth: process.env.NOTION_POSTS_API_KEY }) : null;
    const databaseId = process.env.NOTION_POSTS_DATABASE_ID;

    const defaultSettings = {
        brandName: 'Muse'
    };

    if (!notionClient || !databaseId) {
        console.warn('Posts Notion database is not configured. Using default values for site settings.');
        return defaultSettings;
    }

    try {
        const response = await notionClient.databases.query({
            database_id: databaseId,
            filter: {
                property: 'Type',
                select: {
                    equals: 'setting',
                },
            },
        });

        if (response.results.length === 0) {
            return defaultSettings;
        }

        const settings = response.results.reduce((acc, page) => {
            if ('properties' in page) {
                const key = (page.properties.Title as any)?.title?.[0]?.plain_text;
                // Using Excerpt property to store the value for the setting
                const value = (page.properties.Excerpt as any)?.rich_text?.[0]?.plain_text;
                if (key && value) {
                    acc[key] = value;
                }
            }
            return acc;
        }, {} as { [key: string]: string });

        return { ...defaultSettings, ...settings };

    } catch (error) {
        console.error('Failed to fetch site settings from Notion:', error);
        return defaultSettings;
    }
}, ['site_settings'], { revalidate: 3600 });
