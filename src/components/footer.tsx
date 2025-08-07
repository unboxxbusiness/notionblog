
'use client';
import { Icons } from "@/components/ui/icons"
import { Button } from "@/components/ui/button"
import { Facebook, Instagram, Linkedin, Twitter, Feather } from "lucide-react"
import Link from "next/link"
import type { Post } from "@/lib/types"
import { NewsletterForm } from "./newsletter-form"
import type { SiteSettings } from "@/lib/settings";
import { Separator } from "./ui/separator";

interface FooterProps {
  corePages?: Post[];
  legalPages?: Post[];
  settings: SiteSettings;
}

export function Footer({ corePages = [], legalPages = [], settings }: FooterProps) {

  return (
    <footer className="bg-background py-12 border-t">
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex flex-col items-center">
          <div className="mb-8 rounded-full bg-primary/10 p-6">
            <Link href="/" aria-label="Homepage">
                <Feather className="h-8 w-8 text-primary" />
            </Link>
          </div>
          <nav className="mb-8 flex flex-wrap justify-center gap-6">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            {corePages.map((page) => (
              <Link key={page.id} href={`/${page.slug}`} className="hover:text-primary transition-colors">
                {page.title}
              </Link>
            ))}
          </nav>
          <div className="mb-8 flex space-x-4">
            {settings.facebookUrl && (
              <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Facebook className="h-4 w-4" />
                  <span className="sr-only">Facebook</span>
                </Button>
              </a>
            )}
            {settings.twitterUrl && (
              <a href={settings.twitterUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="rounded-full">
                  <Twitter className="h-4 w-4" />
                  <span className="sr-only">Twitter</span>
                </Button>
              </a>
            )}
            {settings.instagramUrl && (
                <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="rounded-full">
                        <Instagram className="h-4 w-4" />
                        <span className="sr-only">Instagram</span>
                    </Button>
                </a>
            )}
            {settings.linkedinUrl && (
                <a href={settings.linkedinUrl} target="_blank" rel="noopener noreferrer">
                    <Button variant="outline" size="icon" className="rounded-full">
                        <Linkedin className="h-4 w-4" />
                        <span className="sr-only">LinkedIn</span>
                    </Button>
                </a>
            )}
          </div>
          <div className="text-center mb-6">
            <h3 className="font-headline text-2xl font-bold">Join the {settings.brandName} Community</h3>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
                Subscribe to our newsletter for the latest articles, insights, and a dose of creative inspiration delivered to your inbox.
            </p>
          </div>
          <div className="mb-8 w-full max-w-md">
            <NewsletterForm />
          </div>

          <Separator className="my-8 w-full max-w-3xl" />
          
          <div className="text-center w-full flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {settings.brandName}. All rights reserved.
            </p>
            {legalPages.length > 0 && (
                <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2">
                    {legalPages.map((page) => (
                        <Link key={page.id} href={`/${page.slug}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                            {page.title}
                        </Link>
                    ))}
                </nav>
            )}
          </div>
        </div>
      </div>
    </footer>
  )
}
