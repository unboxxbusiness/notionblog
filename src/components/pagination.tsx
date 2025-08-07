
"use client"

import { usePathname, useSearchParams } from "next/navigation"
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

  if (totalPages <= 1) {
    return null
  }

  const isFirstPage = currentPage === 1
  const isLastPage = currentPage === totalPages

  const getPageNumbers = () => {
    const pageNumbers = []
    const visiblePages = 5 // Total number of page links to show

    if (totalPages <= visiblePages) {
      // Show all pages if total is less than or equal to visiblePages
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i)
      }
    } else {
      const startPage = Math.max(2, currentPage - 1)
      const endPage = Math.min(totalPages - 1, currentPage + 1)
      
      pageNumbers.push(1)

      if (currentPage > 3) {
        pageNumbers.push('...')
      }

      for (let i = startPage; i <= endPage; i++) {
          if(i > 1 && i < totalPages)
            pageNumbers.push(i)
      }

      if (currentPage < totalPages - 2) {
        pageNumbers.push('...')
      }
      
      pageNumbers.push(totalPages)
    }

    // Remove duplicate '...'
    return pageNumbers.filter((v, i, a) => v !== '...' || a[i-1] !== '...');
  }

  const pageNumbers = getPageNumbers()

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

        {pageNumbers.map((page, index) =>
          typeof page === "number" ? (
            <PaginationItem key={`${page}-${index}`}>
              <PaginationLink
                href={createPageURL(page)}
                isActive={currentPage === page}
              >
                {page}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem key={`ellipsis-${index}`}>
              <PaginationEllipsis />
            </PaginationItem>
          )
        )}

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
