'use client';

import React, { useEffect, useState } from 'react';
import { Twitter, Facebook, Linkedin, Share2 } from 'lucide-react';

interface SocialBoxProps {
  href: string;
  icon: React.ReactNode;
  className: string;
  delay?: string;
}

const SocialBox = ({ href, icon, className, delay }: SocialBoxProps) => (
  <a href={href} target="_blank" rel="noopener noreferrer">
    <div className={`box ${className}`} style={{ transitionDelay: delay }}>
      <span className="icon">{icon}</span>
    </div>
  </a>
);

export function SocialShare({ title, slug }: { title:string, slug:string }) {
  const [url, setUrl] = useState('');

  useEffect(() => {
    // Ensure window is defined (runs only on client)
    setUrl(window.location.origin + `/posts/${slug}`);
  }, [slug]);

  if (!url) {
    return null; // Don't render on the server
  }
  
  const socialLinks = [
    { href: `https://linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}&title=${encodeURIComponent(title)}`, icon: <Linkedin />, className: "box1" },
    { href: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`, icon: <Twitter />, className: "box2", delay: "0.2s" },
    { href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, icon: <Facebook />, className: "box3", delay: "0.4s" },
  ];

  return (
    <div className="fixed bottom-8 right-8 z-50">
        <div className="card">
            <div className="background" />
            <div className="logo" title="Share">
              <Share2 />
            </div>

            {socialLinks.map((link, index) => (
            <SocialBox
                key={index}
                href={link.href}
                icon={link.icon}
                className={link.className}
                delay={link.delay}
            />
            ))}

            <div className="box box4" style={{ transitionDelay: "0.6s" }} />
        </div>
    </div>
  );
};
