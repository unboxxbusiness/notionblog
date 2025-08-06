'use client';

import { NotionRenderer } from 'react-notion-x';
import type { RecordMap } from 'notion-types';
import 'react-notion-x/src/styles.css';
import 'prismjs/themes/prism-tomorrow.css';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

export function PostRenderer({ recordMap }: { recordMap: RecordMap }) {
  const { resolvedTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(resolvedTheme === 'dark');
  }, [resolvedTheme]);

  return (
    <NotionRenderer
      recordMap={recordMap}
      fullPage={false}
      darkMode={isDarkMode}
      className="prose dark:prose-invert max-w-none 
                 prose-headings:font-headline prose-p:text-foreground/80
                 prose-a:text-primary hover:prose-a:text-primary/80 prose-strong:text-foreground
                 prose-blockquote:border-primary prose-blockquote:text-foreground/70"
    />
  );
}
