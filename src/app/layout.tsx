
import type { Metadata } from 'next';
import { ThemeProvider } from '@/components/theme-provider';
import './globals.css';
import './social-card.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { getAllTags, getPublishedPages } from '@/lib/posts';
import { getSiteSettings } from '@/lib/settings';

export async function generateMetadata(): Promise<Metadata> {
    const { brandName, homepageTitle, homepageDescription } = await getSiteSettings();
    return {
        title: {
            default: `${homepageTitle} | ${brandName}`,
            template: `%s | ${brandName}`,
        },
        description: homepageDescription,
    };
}


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const allTags = await getAllTags();
  const corePages = await getPublishedPages({ category: 'Core' });
  const legalPages = await getPublishedPages({ category: 'Legal' });
  const settings = await getSiteSettings();

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;700&display=swap" rel="stylesheet" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Roboto:wght@400;500;700&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased" suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <div className="flex flex-col min-h-screen">
                <Navbar tags={allTags} pages={corePages} brandName={settings.brandName} />
                <main className="flex-grow pt-28">{children}</main>
                <Footer corePages={corePages} legalPages={legalPages} settings={settings} />
            </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
