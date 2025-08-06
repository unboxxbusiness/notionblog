'use client';

import { useEffect, useState } from 'react';
import { Twitter, Facebook, Linkedin, Link as LinkIcon } from 'lucide-react';
import { AnimatedSocialIcons, type SocialIcon } from './animated-social-icons';
import { useToast } from '@/hooks/use-toast';

export function SocialShare({ title, slug }: { title: string; slug: string }) {
  const [url, setUrl] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    // Ensure window is defined (runs only on client)
    setUrl(window.location.origin + `/posts/${slug}`);
  }, [slug]);

  if (!url) {
    // Don't render on the server
    return null;
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    toast({
        title: "Link Copied!",
        description: "The post URL has been copied to your clipboard.",
    })
  };

  const socialIcons: SocialIcon[] = [
    {
      Icon: Twitter,
      href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(title)}`,
    },
    {
      Icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        url
      )}`,
    },
    {
      Icon: Linkedin,
      href: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
        url
      )}&title=${encodeURIComponent(title)}`,
    },
    {
      Icon: LinkIcon,
      onClick: handleCopy,
    },
  ];

  return (
    <div className="py-8">
      <AnimatedSocialIcons icons={socialIcons} />
    </div>
  );
}
