"use client";

import { Button } from "@/components/ui/button";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
    navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Menu, MoveRight, X } from "lucide-react";
import { useState } from "react";
import Link from "next/link";
import { ThemeToggle } from "./theme-toggle";
import type { Post } from "@/lib/posts";

export function Header({ tags, pages }: { tags: string[], pages: Post[] }) {
    const navigationItems = [
        {
            title: "Tags",
            description: "Explore posts by tags.",
            items: tags.map(tag => ({ title: tag, href: `/?tag=${encodeURIComponent(tag)}` })),
        },
        {
            title: "Pages",
            description: "Find other pages.",
            items: pages.map(page => ({ title: page.title, href: `/${page.slug}` })),
        }
    ];

    const [isOpen, setOpen] = useState(false);
    return (
        <header className="w-full z-40 fixed top-0 left-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
            <div className="container relative mx-auto min-h-20 flex gap-4 flex-row lg:grid lg:grid-cols-3 items-center">
                <div className="justify-start items-center gap-4 lg:flex hidden flex-row">
                    <NavigationMenu className="flex justify-start items-start">
                        <NavigationMenuList className="flex justify-start gap-4 flex-row">
                            <NavigationMenuItem>
                                <Link href="/" legacyBehavior passHref>
                                    <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                                        Home
                                    </NavigationMenuLink>
                                </Link>
                            </NavigationMenuItem>
                            {navigationItems.map((item) => (
                                <NavigationMenuItem key={item.title}>
                                    <>
                                        <NavigationMenuTrigger className="font-medium text-sm bg-transparent">
                                            {item.title}
                                        </NavigationMenuTrigger>
                                        <NavigationMenuContent className="!w-[450px] p-4">
                                            <div className="flex flex-col lg:grid grid-cols-2 gap-4">
                                                <div className="flex flex-col h-full justify-between">
                                                    <div className="flex flex-col">
                                                        <p className="text-base">{item.title}</p>
                                                        <p className="text-muted-foreground text-sm">
                                                            {item.description}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col text-sm h-full">
                                                    {item.items?.map((subItem) => (
                                                        <Link href={subItem.href} passHref key={subItem.title} legacyBehavior={false}>
                                                            <NavigationMenuLink
                                                                className="flex flex-row justify-between items-center hover:bg-muted py-2 px-4 rounded"
                                                            >
                                                                <span className="truncate">{subItem.title}</span>
                                                                <MoveRight className="w-4 h-4 text-muted-foreground" />
                                                            </NavigationMenuLink>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        </NavigationMenuContent>
                                    </>
                                </NavigationMenuItem>
                            ))}
                        </NavigationMenuList>
                    </NavigationMenu>
                </div>
                <div className="flex lg:justify-center">
                    <Link href="/" className="text-2xl font-bold font-headline text-primary hover:opacity-80 transition-opacity">
                        Muse
                    </Link>
                </div>
                <div className="flex justify-end w-full gap-2 items-center">
                    <ThemeToggle />
                </div>
                <div className="flex w-12 shrink lg:hidden items-end justify-end">
                    <Button variant="ghost" onClick={() => setOpen(!isOpen)}>
                        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </Button>
                    {isOpen && (
                        <div className="absolute top-20 border-t flex flex-col w-full right-0 bg-background shadow-lg py-4 container gap-8">
                             <Link
                                href="/"
                                className="flex justify-between items-center"
                                onClick={() => setOpen(false)}
                            >
                                <span className="text-lg">Home</span>
                                <MoveRight className="w-4 h-4 stroke-1 text-muted-foreground" />
                            </Link>
                            {navigationItems.map((item) => (
                                <div key={item.title}>
                                    <div className="flex flex-col gap-2">
                                        <p className="text-lg">{item.title}</p>
                                        {item.items &&
                                            item.items.map((subItem) => (
                                                <Link
                                                    key={subItem.title}
                                                    href={subItem.href}
                                                    className="flex justify-between items-center"
                                                    onClick={() => setOpen(false)}
                                                >
                                                    <span className="text-muted-foreground truncate">
                                                        {subItem.title}
                                                    </span>
                                                    <MoveRight className="w-4 h-4 stroke-1" />
                                                </Link>
                                            ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
