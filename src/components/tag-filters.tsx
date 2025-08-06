
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { cn } from '@/lib/utils';
import { BorderButton } from './ui/border-button';


export function TagFilters({ tags }: { tags: string[] }) {
    const searchParams = useSearchParams();
    const currentTag = searchParams.get('tag');

    return (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <BorderButton
                href="/"
                active={!currentTag}
            >
                All Posts
            </BorderButton>
            {tags.map((tag) => (
                <BorderButton
                    key={tag}
                    href={`/?tag=${encodeURIComponent(tag)}`}
                    active={currentTag === tag}
                >
                {tag}
                </BorderButton>
            ))}
        </div>
    )
}
