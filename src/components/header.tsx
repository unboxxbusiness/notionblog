'use client';

import * as React from 'react';
import Link from 'next/link';
import { Book, Menu, Sunset, Trees, Zap } from 'lucide-react';

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
  } from '@/components/ui/sheet';
import { Button } from './ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import type { Post } from '@/lib/posts';
import { ThemeToggle } from './theme-toggle';
import { cn } from '@/lib/utils';

interface MenuItem {
    title: string;
    url: string;
    description?: string;
    icon?: JSX.Element;
    items?: MenuItem[];
  }
  

export function Header({ tags, pages }: { tags: string[]; pages: Post[] }) {

    const menu: MenuItem[] = [
        {
          title: 'Home',
          url: '/',
        },
        {
          title: 'Tags',
          url: '#',
          items: tags.map((tag) => ({
            title: tag,
            url: `/?tag=${encodeURIComponent(tag)}`,
            description: `View all posts tagged with ${tag}`,
            icon: <Book className="size-5 shrink-0" />,
          })),
        },
        {
          title: 'Pages',
          url: '#',
          items: pages.map((page) => ({
            title: page.title,
            url: `/${page.slug}`,
            description: page.excerpt,
            icon: <Trees className="size-5 shrink-0" />,
          })),
        },
      ];

  return (
    <header className="w-full z-40 fixed top-0 left-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto flex justify-between items-center h-20">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-2xl font-bold font-headline text-primary hover:opacity-80 transition-opacity">Muse</span>
            </Link>
            
            <div className="hidden lg:flex items-center gap-4">
                <NavigationMenu>
                <NavigationMenuList>
                    <NavigationMenuItem>
                    <Link href="/" legacyBehavior passHref>
                        <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                        Home
                        </NavigationMenuLink>
                    </Link>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Tags</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            {tags.map((tag) => (
                                <ListItem
                                key={tag}
                                title={tag}
                                href={`/?tag=${encodeURIComponent(tag)}`}
                                >
                                View all posts tagged with {tag}
                                </ListItem>
                            ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                    <NavigationMenuItem>
                        <NavigationMenuTrigger>Pages</NavigationMenuTrigger>
                        <NavigationMenuContent>
                            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                            {pages.map((page) => (
                                <ListItem
                                key={page.id}
                                title={page.title}
                                href={`/${page.slug}`}
                                >
                                {page.excerpt}
                                </ListItem>
                            ))}
                            </ul>
                        </NavigationMenuContent>
                    </NavigationMenuItem>
                </NavigationMenuList>
                </NavigationMenu>
                <ThemeToggle />
            </div>

            <div className="lg:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                        <Menu className="size-4" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="overflow-y-auto">
                        <SheetHeader>
                        <SheetTitle>
                            <Link href="/" className="flex items-center gap-2">
                            <span className="text-2xl font-bold font-headline text-primary hover:opacity-80 transition-opacity">Muse</span>
                            </Link>
                        </SheetTitle>
                        </SheetHeader>
                        <div className="my-6 flex flex-col gap-6">
                            <Accordion
                                type="single"
                                collapsible
                                className="flex w-full flex-col gap-4"
                            >
                                {menu.map((item) => renderMobileMenuItem(item))}
                            </Accordion>
                            <div className="border-t py-4">
                                <ThemeToggle />
                            </div>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    </header>
  );
}

const renderMobileMenuItem = (item: MenuItem) => {
    if (item.items) {
      return (
        <AccordionItem key={item.title} value={item.title} className="border-b-0">
          <AccordionTrigger className="py-0 font-semibold hover:no-underline">
            {item.title}
          </AccordionTrigger>
          <AccordionContent className="mt-2">
            {item.items.map((subItem) => (
              <Link
                key={subItem.title}
                className="flex select-none gap-4 rounded-md p-3 leading-none outline-none transition-colors hover:bg-muted hover:text-accent-foreground"
                href={subItem.url}
              >
                {subItem.icon}
                <div>
                  <div className="text-sm font-semibold">{subItem.title}</div>
                  {subItem.description && (
                    <p className="text-sm leading-snug text-muted-foreground">
                      {subItem.description}
                    </p>
                  )}
                </div>
              </Link>
            ))}
          </AccordionContent>
        </AccordionItem>
      );
    }
  
    return (
      <Link
        key={item.title}
        href={item.url}
        className="font-semibold flex items-center py-2"
      >
        {item.title}
      </Link>
    );
  };

const ListItem = React.forwardRef<
  React.ElementRef<'a'>,
  React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = 'ListItem';
