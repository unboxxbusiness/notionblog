'use server';

import { z } from 'zod';
import { Client } from '@notionhq/client';

const notion = new Client({ auth: process.env.NOTION_SUBSCRIBERS_API_KEY });
const databaseId = process.env.NOTION_SUBSCRIBERS_DATABASE_ID!;

const subscribeSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email.' }),
});

export interface FormState {
  status: 'idle' | 'success' | 'error' | 'pending';
  message: string;
  errors?: {
    name?: string[];
    email?: string[];
  } | null;
}

export async function subscribeToAction(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {

  if (!process.env.NOTION_SUBSCRIBERS_API_KEY || !databaseId) {
    return {
        status: 'error',
        message: 'Subscriber database is not configured. Please set NOTION_SUBSCRIBERS_API_KEY and NOTION_SUBSCRIBERS_DATABASE_ID in your environment variables.',
    };
  }

  const validatedFields = subscribeSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
  });

  if (!validatedFields.success) {
    return {
      status: 'error',
      message: 'Invalid form data.',
      errors: validatedFields.error.flatten().fieldErrors,
    };
  }

  const { name, email } = validatedFields.data;

  try {
    await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        Name: {
          title: [
            {
              text: {
                content: name,
              },
            },
          ],
        },
        Email: {
          email: email,
        },
        SubscribedAt: {
            date: {
                start: new Date().toISOString(),
            }
        }
      },
    });

    return {
      status: 'success',
      message: 'Thank you for subscribing!',
    };
  } catch (error) {
    console.error('Failed to add subscriber to Notion:', error);
    return {
      status: 'error',
      message: 'Something went wrong. Please try again later.',
    };
  }
}
