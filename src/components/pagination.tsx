"use client"

import { usePathname, useSearchParams } from "next/navigation"
import Link from "next/link"
import {
  Pagination as UIPagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { cn } from "@/lib/utils"

function Pagination({
  currentPage,
  totalPages,
  className,
}: {
  currentPage: number
  totalPages: number
  className?: string
}) {
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams)
    params.set("page", pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }

  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages

  // Basic pagination: Previous and Next buttons
  if (totalPages <= 1) {
    return null
  }

  return (
    <UIPagination className={cn("mt-8", className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={createPageURL(currentPage - 1)}
            aria-disabled={isFirstPage}
            className={
              isFirstPage
                ? "pointer-events-none text-muted-foreground"
                : undefined
            }
          />
        </PaginationItem>
        <PaginationItem>
          <span className="p-2 text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </span>
        </PaginationItem>
        <PaginationItem>
          <PaginationNext
            href={createPageURL(currentPage + 1)}
            aria-disabled={isLastPage}
            className={
              isLastPage
                ? "pointer-events-none text-muted-foreground"
                : undefined
            }
          />
        </PaginationItem>
      </PaginationContent>
    </UIPagination>
  )
}

export { Pagination }
