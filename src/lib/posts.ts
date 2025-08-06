// This file mocks a Notion API client.
import 'server-only'

export type Post = {
  id: string;
  slug: string;
  title: string;
  tags: string[];
  author: string;
  publishedDate: string;
  featuredImage: string;
  featuredImageHint: string;
  content: string;
};

const allPosts: Post[] = [
  {
    id: '1',
    slug: 'the-art-of-minimalist-design',
    title: 'The Art of Minimalist Design',
    tags: ['Design', 'Creativity'],
    author: 'Elena Reyes',
    publishedDate: '2024-05-15',
    featuredImage: 'https://placehold.co/1200x630.png',
    featuredImageHint: 'minimalist desk',
    content: `
Minimalism in design is the art of saying more with less. It's not about stripping away everything, but about making conscious decisions to include only the essential elements. This philosophy can be applied to web design, interior design, and even our daily lives.

### Key Principles

1.  **Whitespace is Your Friend:** Ample whitespace (or negative space) helps to guide the user's eye and create a sense of calm and focus. It prevents the design from feeling cluttered.
2.  **Limited Color Palette:** A simple color scheme, often monochromatic with one or two accent colors, creates a cohesive and elegant look. Our own site uses a deep purple primary with a teal accent.
3.  **Flat Textures & Patterns:** Minimalist design avoids heavy textures, gradients, and shadows in favor of flat colors and simple typography.
4.  **Purposeful Typography:** Fonts are chosen for their clarity and readability. A good hierarchy of headings and body text is crucial. We use 'Space Grotesk' for headlines to add a touch of personality.

By embracing these principles, you can create designs that are not only beautiful but also highly functional and user-friendly. The goal is to remove distractions and let the content shine.
    `,
  },
  {
    id: '2',
    slug: 'unlocking-creativity-a-guide-for-developers',
    title: 'Unlocking Creativity: A Guide for Developers',
    tags: ['Development', 'Creativity'],
    author: 'Alex Chen',
    publishedDate: '2024-04-22',
    featuredImage: 'https://placehold.co/1200x630.png',
    featuredImageHint: 'code editor',
    content: `
Creativity isn't just for artists and writers; it's a crucial skill for developers too. Writing elegant code, solving complex problems, and designing intuitive systems all require a creative spark.

### How to Foster Creativity

*   **Step Away from the Keyboard:** Sometimes the best ideas come when you're not actively trying to code. Go for a walk, listen to music, or work on a different kind of project.
*   **Learn Something New:** Dive into a new programming language, framework, or even a non-technical subject. Expanding your knowledge base gives you more tools to draw from.
*   **Collaborate:** Brainstorm with colleagues. Different perspectives can unlock new solutions you hadn't considered.
*   **Embrace Constraints:** Limitations can force you to think outside the box. Try a coding challenge with a strict time or memory limit.

Creativity is a muscle. The more you use it, the stronger it gets. Don't be afraid to experiment, fail, and try again.
    `,
  },
  {
    id: '3',
    slug: 'the-future-of-ai-in-content-creation',
    title: 'The Future of AI in Content Creation',
    tags: ['AI', 'Technology'],
    author: 'Samantha Lee',
    publishedDate: '2024-03-10',
    featuredImage: 'https://placehold.co/1200x630.png',
    featuredImageHint: 'robot writing',
    content: `
Artificial Intelligence is rapidly transforming the landscape of content creation. From generating blog post ideas to drafting entire articles, AI tools are becoming indispensable for creators.

### The AI Advantage

*   **Efficiency:** AI can automate repetitive tasks, like generating summaries or creating social media posts, freeing up creators to focus on high-level strategy and creativity.
*   **Inspiration:** Stuck on a blank page? AI can provide outlines, headlines, and different angles for a story, breaking through writer's block.
*   **Personalization:** AI can help tailor content to specific audiences, analyzing data to understand what resonates most.

While some fear AI will replace human creators, a more likely future is one of collaboration. AI will be a powerful assistant, augmenting human creativity, not supplanting it. The key is to learn how to wield these new tools effectively.
    `,
  },
  {
    id: '4',
    slug: 'mastering-the-command-line',
    title: 'Mastering the Command Line',
    tags: ['Development', 'Technology'],
    author: 'Ben Carter',
    publishedDate: '2024-02-18',
    featuredImage: 'https://placehold.co/1200x630.png',
    featuredImageHint: 'terminal window',
    content: `
In a world of graphical user interfaces, the command line remains a developer's most powerful tool. It offers speed, flexibility, and automation that GUIs can't match.

### Essential Commands

*   **Navigation:** \`ls\`, \`cd\`, \`pwd\` are the basics for moving around your file system.
*   **File Manipulation:** Use \`touch\`, \`rm\`, \`cp\`, \`mv\`, and \`mkdir\` to manage files and directories.
*   **Piping and Redirection:** Combine commands with \`|\` and redirect output with \`>\` and \`<\` to create powerful workflows.
*   **Searching:** \`grep\` is your best friend for finding text within files.

Investing time in learning the command line is one of the best things you can do for your productivity as a developer. It's a timeless skill that will serve you well throughout your career.
`,
  },
];

export async function getPublishedPosts(): Promise<Post[]> {
  // In a real app, you'd fetch this from Notion
  return allPosts.sort((a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime());
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  // In a real app, you'd fetch a single page from Notion
  return allPosts.find((post) => post.slug === slug);
}

export async function getAllTags(): Promise<string[]> {
    const posts = await getPublishedPosts();
    const tags = new Set<string>();
    posts.forEach(post => {
        post.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags).sort();
}
