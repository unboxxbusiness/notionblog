'use client'
import { motion } from "framer-motion"
import { Plus, type LucideIcon } from "lucide-react"
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

  const buttonSize = "size-10 sm:size-16"

  return (
    <div className={cn("w-full relative flex items-start justify-start sm:justify-center", className)}>
      <div className="flex items-center justify-center relative gap-4">
        <motion.div
          className="absolute left-0 bg-background w-full rounded-full z-10"
          animate={{
            x: active ? "calc(100% + 16px)" : 0,
          }}
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
        >
          <motion.button
            className={cn(
              buttonSize,
              "rounded-full flex items-center justify-center",
              "bg-primary hover:bg-primary/90 transition-colors"
            )}
            onClick={() => setActive(!active)}
            animate={{ rotate: active ? 45 : 0 }}
            transition={{
              type: "spring",
              stiffness: 200,
              damping: 20,
            }}
          >
            <Plus
               size={iconSize}
               strokeWidth={3}
               className="text-primary-foreground"
             />
          </motion.button>
        </motion.div>
                 
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
            initial={{ scale: 0, opacity: 0, x: -100 }}
            animate={{
              scale: active ? 1 : 0,
              opacity: active ? 1 : 0,
              x: active ? 0 : -100,
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
    </div>
  )
}
