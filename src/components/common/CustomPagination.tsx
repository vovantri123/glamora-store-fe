import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

interface CustomPaginationProps {
  currentPage: number; // 0-based page index
  totalPages: number;
  onPageChange: (page: number) => void; // 0-based page index
  className?: string;
  showEllipsis?: boolean;
  maxVisiblePages?: number;
}

function CustomPagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showEllipsis = true,
  maxVisiblePages = 5,
}: CustomPaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    if (!showEllipsis || totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i);
    }

    const half = Math.floor(maxVisiblePages / 2);
    let start = Math.max(0, currentPage - half);
    const end = Math.min(totalPages - 1, start + maxVisiblePages - 1);

    if (end - start + 1 < maxVisiblePages) {
      start = Math.max(0, end - maxVisiblePages + 1);
    }

    const pages = [];
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();
  const showStartEllipsis = showEllipsis && visiblePages[0] > 1;
  const showEndEllipsis =
    showEllipsis && visiblePages[visiblePages.length - 1] < totalPages - 2;

  return (
    <Pagination className={cn('mx-auto flex w-full justify-center', className)}>
      <PaginationContent className="gap-1">
        {/* Previous Button */}
        <PaginationItem>
          <PaginationPrevious
            onClick={(e) => {
              e.preventDefault();
              onPageChange(Math.max(0, currentPage - 1));
            }}
            className={cn(
              'cursor-pointer select-none outline-none transition-all duration-200 hover:bg-primary/10 hover:text-primary focus:outline-none',
              currentPage === 0 && 'pointer-events-none opacity-50'
            )}
            aria-label="Go to previous page"
          />
        </PaginationItem>

        {/* First Page + Ellipsis */}
        {showStartEllipsis && (
          <>
            <PaginationItem>
              <PaginationLink
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(0);
                }}
                className="cursor-pointer select-none outline-none transition-all duration-200 hover:bg-primary/10 hover:text-primary focus:outline-none"
              >
                1
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <span className="flex h-9 w-9 items-center justify-center">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </span>
            </PaginationItem>
          </>
        )}

        {/* Page Numbers */}
        {visiblePages.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={(e) => {
                e.preventDefault();
                onPageChange(page);
              }}
              isActive={currentPage === page}
              className={cn(
                'cursor-pointer select-none outline-none transition-all duration-200 focus:outline-none',
                currentPage === page
                  ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                  : 'hover:bg-primary/10 hover:text-primary'
              )}
            >
              {page + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* Last Page + Ellipsis */}
        {showEndEllipsis && (
          <>
            <PaginationItem>
              <span className="flex h-9 w-9 items-center justify-center">
                <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                onClick={(e) => {
                  e.preventDefault();
                  onPageChange(totalPages - 1);
                }}
                className="cursor-pointer select-none outline-none transition-all duration-200 hover:bg-primary/10 hover:text-primary focus:outline-none"
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}

        {/* Next Button */}
        <PaginationItem>
          <PaginationNext
            onClick={(e) => {
              e.preventDefault();
              onPageChange(Math.min(totalPages - 1, currentPage + 1));
            }}
            className={cn(
              'cursor-pointer select-none outline-none transition-all duration-200 hover:bg-primary/10 hover:text-primary focus:outline-none',
              currentPage === totalPages - 1 && 'pointer-events-none opacity-50'
            )}
            aria-label="Go to next page"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}

export { CustomPagination };
