'use client';

import { NotionRenderer } from 'react-notion-x';
import type { RecordMap } from 'notion-types';
import 'react-notion-x/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css';

export function PostRenderer({ recordMap }: { recordMap: RecordMap }) {
  return (
    <NotionRenderer 
      recordMap={recordMap} 
      fullPage={false} 
      darkMode={false} // You can connect this to your theme
      className="prose dark:prose-invert max-w-none 
                 prose-headings:font-headline prose-headings:text-foreground prose-p:text-foreground/80
                 prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground
                 prose-blockquote:border-primary prose-blockquote:text-foreground/70"
    />
  );
}
