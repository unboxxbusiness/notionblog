'use client'
import { motion } from "framer-motion"
import { Share, type LucideIcon } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export interface SocialIcon {
  Icon: LucideIcon
  href?: string
  className?: string
  onClick?: () => void;
}

interface AnimatedSocialIconsProps {
  icons: SocialIcon[]
  className?: string
  iconSize?: number
}

export function AnimatedSocialIcons({
   icons,
   className,
  iconSize = 20
}: AnimatedSocialIconsProps) {
  const [active, setActive] = useState(false)

  const buttonSize = "size-10 sm:size-12"

  return (
    <div className={cn("relative flex flex-col items-center gap-4", className)}>
        <motion.button
            className={cn(
            buttonSize,
            "rounded-full flex items-center justify-center",
            "bg-primary hover:bg-primary/90 transition-colors z-10"
            )}
            onClick={() => setActive(!active)}
            animate={{ rotate: active ? 45 : 0 }}
            transition={{
                type: "spring",
                stiffness: 200,
                damping: 20,
            }}
        >
            <Share
                size={iconSize}
                strokeWidth={2.5}
                className="text-primary-foreground"
                />
        </motion.button>
                 
        {icons.map(({ Icon, href, className, onClick }, index) => (
          <motion.div
            key={index}
            className={cn(
              buttonSize,
              "rounded-full flex items-center justify-center",
              "bg-background shadow-lg hover:shadow-xl",
              "border",
              className
            )}
            initial={{ scale: 0, opacity: 0, y: -20 }}
            animate={{
              scale: active ? 1 : 0,
              opacity: active ? 1 : 0,
              y: active ? 0 : -20,
            }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
              delay: 0.1 * index
            }}
          >
            {href ? (
              <a
                 href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full h-full"
              >
                <Icon
                   size={iconSize}
                  className="text-muted-foreground transition-all hover:text-foreground hover:scale-110"
                 />
              </a>
            ) : (
                <button onClick={onClick} className="flex items-center justify-center w-full h-full">
                    <Icon
                        size={iconSize}
                        className="text-muted-foreground transition-all hover:text-foreground hover:scale-110"
                    />
              </button>
            )}
          </motion.div>
        ))}
      </div>
  )
}
