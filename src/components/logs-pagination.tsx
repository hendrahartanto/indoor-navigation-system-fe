
// A helper function to generate the page numbers and ellipses
interface Props {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const getPaginationRange = (currentPage: number, totalPages: number) => {
  // If there are 7 or fewer pages, show all of them
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  // If the current page is near the beginning
  if (currentPage < 5) {
    return [1, 2, 3, 4, 5, '...', totalPages];
  }

  // If the current page is near the end
  if (currentPage > totalPages - 4) {
    return [1, '...', totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  // If the current page is in the middle
  return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages];
};

export default function Pagination({ totalPages, currentPage, onPageChange }: Props) {

  // Don't render anything if there's only one page
  if (totalPages <= 1) {
    return null;
  }

  const pages = getPaginationRange(currentPage, totalPages);

  return (
    <nav
      aria-label="Pagination"
      className="inline-flex -space-x-px rounded-md shadow-sm"
    >
      {/* Previous Button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`inline-flex items-center rounded-l-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className="h-5 w-5"
        >
          <path
            fillRule="evenodd"
            d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Page Numbers */}
      {pages.map((page, index) => {
        if (typeof page === 'string') {
          // This is an ellipsis
          return (
            <span
              key={`ellipsis-${index}`}
              className="inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700"
            >
              {page}
            </span>
          );
        }

        // This is a page number button
        const isActive = page === currentPage;
        return (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={isActive ? 'page' : undefined}
            className={`inline-flex items-center border px-4 py-2 text-sm font-semibold focus:z-20 ${isActive
                ? 'border-blue-600 bg-blue-600 text-white'
                : 'border-gray-300 bg-white text-gray-900 hover:bg-gray-50'
              }`}
          >
            {page}
          </button>
        );
      })}

      {/* Next Button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`inline-flex items-center rounded-r-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-900 hover:bg-gray-50 ${currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : ''
          }`}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden="true"
          className="h-5 w-5"
        >
          <path
            fillRule="evenodd"
            d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </nav>
  );
}
