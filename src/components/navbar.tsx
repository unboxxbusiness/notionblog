
'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { Post } from '@/lib/posts';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';
import { Tag, FileText, Search } from 'lucide-react';
import { NavbarSearchInput } from './navbar-search-input';

const transition = {
  type: 'spring',
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
};

const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void;
  active: string | null;
  item: string;
  children?: React.ReactNode;
}) => {
  return (
    <div onMouseEnter={() => setActive(item)} className="relative">
      <motion.p
        transition={{ duration: 0.3 }}
        className="cursor-pointer text-foreground hover:opacity-[0.9] flex items-center gap-2"
      >
        {item === 'Search' && <Search size={16} />}
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_0.5rem)] left-1/2 transform -translate-x-1/2">
              <motion.div
                transition={transition}
                layoutId="active" // layoutId ensures smooth animation
                className="bg-background backdrop-blur-sm rounded-2xl overflow-hidden border border-input shadow-xl"
              >
                <motion.div
                  layout // layout ensures smooth animation
                  className="w-max h-full p-4"
                >
                  {children}
                </motion.div>
              </motion.div>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

const Menu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void;
  children: React.ReactNode;
}) => {
    const { resolvedTheme } = useTheme();

  return (
    <nav
      onMouseLeave={() => setActive(null)} // resets the state
      className={cn(
        "relative rounded-full border bg-background/50 shadow-input flex items-center justify-center space-x-8 px-8 py-3",
        "backdrop-blur-md"
      )}
    >
      {children}
    </nav>
  );
};

const HoveredLink = ({ children, icon, ...rest }: any) => {
    const Icon = icon;
    return (
      <Link
        {...rest}
        className="text-muted-foreground hover:text-foreground flex items-center gap-2"
      >
        <Icon size={16} />
        {children}
      </Link>
    );
  };

export function Navbar({ tags = [], pages = [] }: { tags?: string[], pages?: Post[] }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="w-full z-40 fixed top-0 left-0 flex justify-center py-6">
        <Menu setActive={setActive}>
            <Link href="/" className="cursor-pointer text-foreground hover:opacity-[0.9] flex items-center font-bold font-headline text-lg">
                Muse
            </Link>
            <MenuItem setActive={setActive} active={active} item="Tags">
            <div className="flex flex-col space-y-4 text-sm">
                {tags.map((tag) => (
                    <HoveredLink key={tag} href={`/?tag=${encodeURIComponent(tag)}`} icon={Tag}>{tag}</HoveredLink>
                ))}
            </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item="Pages">
            <div className="flex flex-col space-y-4 text-sm">
                {pages.map((page) => (
                    <HoveredLink key={page.id} href={`/${page.slug}`} icon={FileText}>{page.title}</HoveredLink>
                ))}
            </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item="Search">
                <NavbarSearchInput />
            </MenuItem>
            <ThemeToggle />
        </Menu>
    </div>
  );
}
