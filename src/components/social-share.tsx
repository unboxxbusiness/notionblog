
'use client';

import React, { useEffect, useState } from 'react';
import { Twitter, Facebook, Linkedin, Share2, Copy, Check } from 'lucide-react';

const WhatsAppIcon = () => (
    <svg fill="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.06 22L7.31 20.52C8.75 21.33 10.36 21.82 12.04 21.82C17.5 21.82 21.95 17.37 21.95 11.91C21.95 9.41 20.98 7.11 19.34 5.47C17.7 3.83 15.4 2.86 12.96 2.86C12.65 2.86 12.34 2.88 12.04 2.91L12.04 2ZM12.04 2C6.56 2 2.11 6.45 2.11 11.91C2.11 13.67 2.57 15.37 3.42 16.88L2.04 22L7.29 20.53C8.74 21.33 10.35 21.82 12.04 21.82C17.52 21.82 21.96 17.37 21.96 11.91C21.96 6.45 17.52 2 12.04 2ZM12.05 3.85C16.54 3.85 20.03 7.34 20.03 11.83C20.03 16.32 16.54 19.81 12.05 19.81C10.53 19.81 9.09 19.41 7.85 18.63L7.42 18.38L4.35 19.23L5.22 16.24L4.96 15.8C4.13 14.53 3.69 12.99 3.69 11.4C3.69 6.91 7.18 3.42 11.67 3.42H12.05L12.05 3.85ZM9.39 6.36C9.21 6.36 9.03 6.36 8.82 6.74C8.61 7.12 7.93 7.74 7.93 8.96C7.93 10.18 8.84 11.36 9 11.54C9.13 11.72 11.45 15.24 14.89 16.83C17.77 18.14 18.39 17.84 18.91 17.77C19.43 17.68 20.52 17.07 20.73 16.48C20.94 15.89 20.94 15.4 20.85 15.22C20.76 15.04 20.58 14.95 20.32 14.81C20.06 14.67 18.78 14.04 18.52 13.93C18.26 13.82 18.08 13.78 17.9 14.04C17.72 14.31 17.21 14.93 17.03 15.11C16.85 15.29 16.67 15.33 16.42 15.22C16.16 15.11 15.21 14.81 14.09 13.82C13.21 13.06 12.58 12.13 12.45 11.91C12.32 11.68 12.45 11.54 12.63 11.36C12.77 11.22 12.95 11 13.13 10.78C13.31 10.56 13.36 10.45 13.45 10.27C13.54 10.09 13.49 9.91 13.41 9.77C13.32 9.63 12.81 8.41 12.63 7.84C12.45 7.27 12.27 6.36 12.09 6.36H9.39Z" />
    </svg>
);

interface SocialBoxProps {
  href?: string;
  onClick?: () => void;
  icon: React.ReactNode;
  className: string;
  delay?: string;
}

const SocialBox = ({ href, icon, className, delay, onClick }: SocialBoxProps) => {
    const content = (
        <div className={`box ${className}`} style={{ transitionDelay: delay }} onClick={onClick}>
          <span className="icon">{icon}</span>
        </div>
      );

    if (href) {
        return <a href={href} target="_blank" rel="noopener noreferrer">{content}</a>;
    }
    return content;
};

export function SocialShare({ title, slug }: { title:string, slug:string }) {
  const [url, setUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Ensure window is defined (runs only on client)
    setUrl(window.location.origin + `/posts/${slug}`);
  }, [slug]);

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    });
  }

  if (!url) {
    return null; // Don't render on the server
  }
  
  const socialLinks = [
    { href: `https://linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, icon: <Linkedin />, className: "box1" },
    { href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, icon: <Twitter />, className: "box2", delay: "0.1s" },
    { href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, icon: <Facebook />, className: "box3", delay: "0.2s" },
    { href: `https://api.whatsapp.com/send?text=${encodeURIComponent(title + ' ' + url)}`, icon: <WhatsAppIcon />, className: "box4", delay: "0.3s" },
    { onClick: handleCopy, icon: copied ? <Check /> : <Copy />, className: "box5", delay: "0.4s" },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-50">
        <div className="card">
            <div className="background" />
            <div className="logo" title="Share">
              Share
            </div>
            <div className="icon-container">
                <Share2 />
            </div>

            {socialLinks.map((link, index) => (
            <SocialBox
                key={index}
                href={link.href}
                onClick={link.onClick}
                icon={link.icon}
                className={link.className}
                delay={link.delay}
            />
            ))}
        </div>
    </div>
  );
};
