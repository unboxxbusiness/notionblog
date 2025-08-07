
import 'server-only';
import { Client } from '@notionhq/client';
import { cache } from 'react';
import type { PageObjectResponse } from '@notionhq/client/build/src/api-endpoints';

interface SiteSettings {
    brandName: string;
    homepageTitle: string;
    homepageDescription: string;
}

const DEFAULTS: SiteSettings = {
    brandName: 'Muse',
    homepageTitle: 'A Blog for Creative Minds and Curious Souls',
    homepageDescription: 'Explore topics in design, development, and AI. A blog for creative minds and curious souls.'
};

export const getSiteSettings = cache(async (): Promise<SiteSettings> => {
    const notionClient = process.env.NOTION_POSTS_API_KEY ? new Client({ auth: process.env.NOTION_POSTS_API_KEY }) : null;
    const databaseId = process.env.NOTION_POSTS_DATABASE_ID;

    if (!notionClient || !databaseId) {
        console.warn('Posts Notion database is not configured. Using default settings.');
        return DEFAULTS;
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
        
        const settings: Partial<SiteSettings> = {};

        for (const page of response.results) {
            if (!('properties' in page)) continue;

            const key = (page.properties.Title as any)?.title?.[0]?.plain_text;
            const value = (page.properties.Excerpt as any)?.rich_text?.[0]?.plain_text;

            if (key === 'brandName' && value) {
                settings.brandName = value;
            } else if (key === 'homepageTitle' && value) {
                settings.homepageTitle = value;
            } else if (key === 'homepageDescription' && value) {
                settings.homepageDescription = value;
            }
        }
        
        return { ...DEFAULTS, ...settings };

    } catch (error) {
        console.error('Failed to fetch site settings from Notion:', error);
        return DEFAULTS;
    }
}, ['site_settings'], { revalidate: 60 });
