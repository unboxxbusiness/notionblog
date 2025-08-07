
import 'server-only';
import { Client } from '@notionhq/client';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';
import { cache } from 'react';

export const getSiteSettings = cache(async (): Promise<{ [key: string]: string }> => {
    const notionSettingsClient = process.env.NOTION_SITE_SETTINGS_API_KEY ? new Client({ auth: process.env.NOTION_SITE_SETTINGS_API_KEY }) : null;
    const databaseId = process.env.NOTION_SITE_SETTINGS_DATABASE_ID;

    if (!notionSettingsClient || !databaseId) {
        console.warn('Site settings Notion database is not configured. Using default values.');
        return {
            brandName: 'Muse'
        };
    }

    try {
        const response = await notionSettingsClient.databases.query({
            database_id: databaseId,
        });

        const settings = response.results.reduce((acc, page) => {
            if ('properties' in page) {
                const key = (page.properties.Key as any)?.title?.[0]?.plain_text;
                const value = (page.properties.Value as any)?.rich_text?.[0]?.plain_text;
                if (key && value) {
                    acc[key] = value;
                }
            }
            return acc;
        }, {} as { [key: string]: string });

        return settings;

    } catch (error) {
        console.error('Failed to fetch site settings from Notion:', error);
        return {
            brandName: 'Muse'
        };
    }
}, ['site_settings'], { revalidate: 3600 });
