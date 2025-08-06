
'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { MovingBorderButton } from './ui/moving-border-button';
import { cn } from '@/lib/utils';


export function TagFilters({ tags }: { tags: string[] }) {
    const searchParams = useSearchParams();
    const currentTag = searchParams.get('tag');

    return (
        <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <MovingBorderButton
                as={Link}
                href="/"
                containerClassName="h-auto"
                className="px-4 py-2 text-sm"
                active={!currentTag}
            >
                All Posts
            </MovingBorderButton>
            {tags.map((tag) => (
                <MovingBorderButton
                    key={tag}
                    as={Link}
                    href={`/?tag=${encodeURIComponent(tag)}`}
                    containerClassName="h-auto"
                    className="px-4 py-2 text-sm"
                    active={currentTag === tag}
                >
                {tag}
                </MovingBorderButton>
            ))}
        </div>
    )
}
