import Link from 'next/link';
import { ThemeToggle } from '@/components/theme-toggle';

export function Header() {
  return (
    <header className="py-4 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold font-headline text-primary hover:opacity-80 transition-opacity">
          Muse
        </Link>
        <ThemeToggle />
      </div>
    </header>
  );
}
