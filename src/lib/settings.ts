
import 'server-only';
import { Client } from '@notionhq/client';
import { cache } from 'react';

const DEFAULT_BRAND_NAME = 'Muse';

export const getSiteSettings = cache(async (): Promise<{ brandName: string }> => {
    const notionClient = process.env.NOTION_POSTS_API_KEY ? new Client({ auth: process.env.NOTION_POSTS_API_KEY }) : null;
    const databaseId = process.env.NOTION_POSTS_DATABASE_ID;

    if (!notionClient || !databaseId) {
        console.warn('Posts Notion database is not configured. Using default brand name.');
        return { brandName: DEFAULT_BRAND_NAME };
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
            page_size: 1, // We only need one setting entry for the brand name
        });
        
        const settingPage = response.results[0];

        if (settingPage && 'properties' in settingPage) {
            const brandName = (settingPage.properties.Title as any)?.title?.[0]?.plain_text;
            if (brandName) {
                return { brandName };
            }
        }

        console.warn("No 'setting' type entry found with a Title. Using default brand name.");
        return { brandName: DEFAULT_BRAND_NAME };

    } catch (error) {
        console.error('Failed to fetch site settings from Notion:', error);
        return { brandName: DEFAULT_BRAND_NAME };
    }
}, ['site_settings'], { revalidate: 60 });
