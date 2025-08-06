'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import type { Post } from '@/lib/posts';
import { ThemeToggle } from './theme-toggle';

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
        className="cursor-pointer text-black hover:opacity-[0.9] dark:text-white"
      >
        {item}
      </motion.p>
      {active !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={transition}
        >
          {active === item && (
            <div className="absolute top-[calc(100%_+_1.2rem)] left-1/2 transform -translate-x-1/2 pt-4">
              <motion.div
                transition={transition}
                layoutId="active" // layoutId ensures smooth animation
                className="bg-white dark:bg-black backdrop-blur-sm rounded-2xl overflow-hidden border border-black/[0.2] dark:border-white/[0.2] shadow-xl"
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
  return (
    <nav
      onMouseLeave={() => setActive(null)} // resets the state
      className="relative rounded-full border border-input dark:bg-black dark:border-white/[0.2] bg-white shadow-input flex justify-center space-x-4 px-8 py-6 "
    >
      {children}
    </nav>
  );
};

const HoveredLink = ({ children, ...rest }: any) => {
  return (
    <Link
      {...rest}
      className="text-neutral-700 dark:text-neutral-200 hover:text-black "
    >
      {children}
    </Link>
  );
};

export function Navbar({ tags, pages }: { tags: string[], pages: Post[] }) {
  const [active, setActive] = useState<string | null>(null);

  return (
    <div className="w-full z-40 fixed top-0 left-0 bg-transparent flex justify-center py-4">
        <Menu setActive={setActive}>
            <Link href="/" className="cursor-pointer text-black hover:opacity-[0.9] dark:text-white flex items-center">
                Muse
            </Link>
            <MenuItem setActive={setActive} active={active} item="Tags">
            <div className="flex flex-col space-y-4 text-sm">
                {tags.map((tag) => (
                    <HoveredLink key={tag} href={`/?tag=${encodeURIComponent(tag)}`}>{tag}</HoveredLink>
                ))}
            </div>
            </MenuItem>
            <MenuItem setActive={setActive} active={active} item="Pages">
            <div className="flex flex-col space-y-4 text-sm">
                {pages.map((page) => (
                    <HoveredLink key={page.id} href={`/${page.slug}`}>{page.title}</HoveredLink>
                ))}
            </div>
            </MenuItem>
            <ThemeToggle />
        </Menu>
    </div>
  );
}
