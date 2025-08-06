
'use client';
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Post } from '@/lib/types'
import { ThemeToggle } from './theme-toggle'
import { cn } from '@/lib/utils'
import { Tag, FileText, Search, Menu as MenuIcon, X } from 'lucide-react'
import { NavbarSearchInput } from './navbar-search-input'
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';

const transition = {
  type: 'spring',
  mass: 0.5,
  damping: 11.5,
  stiffness: 100,
  restDelta: 0.001,
  restSpeed: 0.001,
}

const MenuItem = ({
  setActive,
  active,
  item,
  children,
}: {
  setActive: (item: string) => void
  active: string | null
  item: string
  children?: React.ReactNode
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
  )
}

const DesktopMenu = ({
  setActive,
  children,
}: {
  setActive: (item: string | null) => void
  children: React.ReactNode
}) => {
  return (
    <nav
      onMouseLeave={() => setActive(null)} // resets the state
      className={cn(
        'relative rounded-full border bg-background/50 shadow-input flex items-center justify-center space-x-8 px-8 py-3',
        'backdrop-blur-md'
      )}
    >
      {children}
    </nav>
  )
}

const HoveredLink = ({ children, icon, ...rest }: any) => {
  const Icon = icon
  return (
    <Link
      {...rest}
      className="text-muted-foreground hover:text-foreground flex items-center gap-2"
    >
      <Icon size={16} />
      {children}
    </Link>
  )
}

export function Navbar({
  tags = [],
  pages = [],
}: {
  tags?: string[]
  pages?: Post[]
}) {
  const [active, setActive] = useState<string | null>(null)

  return (
    <div className="w-full z-40 fixed top-0 left-0 flex justify-center py-6 px-4 md:px-6">
      {/* Desktop Navbar */}
      <div className="hidden md:flex w-full justify-center">
        <DesktopMenu setActive={setActive}>
          <Link
            href="/"
            className="cursor-pointer text-foreground hover:opacity-[0.9] flex items-center font-bold font-headline text-lg"
          >
            Muse
          </Link>
          <MenuItem setActive={setActive} active={active} item="Tags">
            <div className="flex flex-col space-y-4 text-sm">
              {tags.map(tag => (
                <HoveredLink
                  key={tag}
                  href={`/?tag=${encodeURIComponent(tag)}`}
                  icon={Tag}
                >
                  {tag}
                </HoveredLink>
              ))}
            </div>
          </MenuItem>
          <MenuItem setActive={setActive} active={active} item="Pages">
            <div className="flex flex-col space-y-4 text-sm">
              {pages.map(page => (
                <HoveredLink
                  key={page.id}
                  href={`/${page.slug}`}
                  icon={FileText}
                >
                  {page.title}
                </HoveredLink>
              ))}
            </div>
          </MenuItem>
          <MenuItem setActive={setActive} active={active} item="Search">
            <NavbarSearchInput />
          </MenuItem>
          <ThemeToggle />
        </DesktopMenu>
      </div>

      {/* Mobile Navbar */}
      <div className="md:hidden flex justify-between items-center w-full rounded-full border bg-background/50 shadow-input px-4 py-2 backdrop-blur-md">
        <Link
          href="/"
          className="cursor-pointer text-foreground hover:opacity-[0.9] flex items-center font-bold font-headline text-lg"
        >
          Muse
        </Link>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <MenuIcon />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
              <SheetHeader>
                <SheetTitle className="sr-only">Menu</SheetTitle>
              </SheetHeader>
              <div className="p-4">
                <div className="mb-8">
                  <NavbarSearchInput />
                </div>
                <Accordion type="multiple" className="w-full">
                  <AccordionItem value="tags">
                    <AccordionTrigger>Tags</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col space-y-4 text-sm mt-2">
                        {tags.map(tag => (
                          <HoveredLink
                            key={tag}
                            href={`/?tag=${encodeURIComponent(tag)}`}
                            icon={Tag}
                          >
                            {tag}
                          </HoveredLink>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="pages">
                    <AccordionTrigger>Pages</AccordionTrigger>
                    <AccordionContent>
                    <div className="flex flex-col space-y-4 text-sm mt-2">
                        {pages.map(page => (
                        <HoveredLink
                            key={page.id}
                            href={`/${page.slug}`}
                            icon={FileText}
                        >
                            {page.title}
                        </HoveredLink>
                        ))}
                    </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </div>
  )
}
