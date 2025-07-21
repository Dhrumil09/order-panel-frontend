interface PaginationProps {
  currentPage: number;
  totalPages: number;
  startIndex: number;
  endIndex: number;
  totalItems: number;
  onPageChange: (page: number) => void;
  itemLabel?: string;
}

const Pagination = ({ currentPage, totalPages, startIndex, endIndex, totalItems, onPageChange, itemLabel = "customers" }: PaginationProps) => {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pages.push(i);
        }
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pages.push(i);
        }
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  return (
    <div className="flex items-center justify-between px-6 py-4 border-t border-[#DDDDDD] bg-white">
      <div className="text-sm text-[#666666]">
        Showing {startIndex + 1} to {Math.min(endIndex, totalItems)} of {totalItems} {itemLabel}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-3 py-2 text-sm border border-[#DDDDDD] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F7F3FF] hover:border-[#9869E0] transition-colors"
        >
          Previous
        </button>
        
        <div className="flex items-center gap-1">
          {getPageNumbers().map((page, index) => (
            <button
              key={index}
              onClick={() => typeof page === 'number' && onPageChange(page)}
              disabled={page === '...'}
              className={`px-3 py-2 text-sm border rounded-lg transition-colors ${
                page === currentPage
                  ? 'bg-[#9869E0] text-white border-[#9869E0]'
                  : page === '...'
                  ? 'border-transparent cursor-default'
                  : 'border-[#DDDDDD] text-[#666666] hover:bg-[#F7F3FF] hover:border-[#9869E0]'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
        
        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-3 py-2 text-sm border border-[#DDDDDD] rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F7F3FF] hover:border-[#9869E0] transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination; 