import { useState, useEffect } from 'react';
import { 
  FaNewspaper, 
  FaExternalLinkAlt, 
  FaCalendarAlt, 
  FaUser, 
  FaSpinner, 
  FaSyncAlt, 
  FaExclamationCircle,
  FaSearch,
  FaTimes 
} from 'react-icons/fa';
import { publicApi } from '@/services/api';

interface NewsArticle {
  source: {
    id: string | null;
    name: string;
  };
  author: string;
  title: string;
  description: string;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface NewsFeedProps {
  initialPageSize?: number;
}

export default function NewsFeed({ initialPageSize = 10 }: NewsFeedProps) {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [allArticles, setAllArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [pageSize] = useState(initialPageSize);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const fetchNews = async (pageNum: number, isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      const response = await publicApi.getEducationNews({
        page: pageNum,
        pageSize,
      });

      if (response.success) {
        setArticles(response.articles);
        setAllArticles(response.articles);
        setTotalResults(response.totalResults);
        setPage(pageNum);
        setSearchQuery('');
        setIsSearching(false);
      } else {
        setError('Failed to load news articles');
      }
    } catch (err) {
      console.error('Error fetching news:', err);
      setError('Unable to fetch news. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews(1);
  }, []);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(query.length > 0);
    
    if (query.trim() === '') {
      setArticles(allArticles);
      return;
    }

    const filtered = allArticles.filter((article) => {
      const searchLower = query.toLowerCase();
      return (
        article.title.toLowerCase().includes(searchLower) ||
        article.description.toLowerCase().includes(searchLower) ||
        article.source.name.toLowerCase().includes(searchLower) ||
        (article.author && article.author.toLowerCase().includes(searchLower))
      );
    });
    
    setArticles(filtered);
  };

  const handleRefresh = () => {
    fetchNews(page, true);
  };

  const handleNextPage = () => {
    const maxPage = Math.ceil(totalResults / pageSize);
    if (page < maxPage) {
      fetchNews(page + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      fetchNews(page - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
    
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  if (loading && !refreshing) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <FaSpinner className="w-12 h-12 animate-spin text-blue-500 mx-auto mb-4" />
          <p className="text-gray-600">Loading education news...</p>
        </div>
      </div>
    );
  }

  if (error && articles.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <FaExclamationCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">Unable to Load News</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchNews(1)}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const maxPage = Math.ceil(totalResults / pageSize);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-10">
        {/* ========== HEADER SECTION ========== */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 mb-8 border border-gray-100">
          {/* Title and Refresh Button */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-6">
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="p-4 bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl shadow-lg">
                  <FaNewspaper className="w-8 h-8 md:w-10 md:h-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  📰 Education News
                </h1>
                <p className="text-gray-600 mt-2 text-sm md:text-base font-medium">
                  Stay updated with the latest in education worldwide
                </p>
              </div>
            </div>
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="flex items-center justify-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              <FaSyncAlt className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="text-base">Refresh</span>
            </button>
          </div>

          {/* Search Bar Section */}
          <div className="relative">
            <div className="relative">
              <FaSearch className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder="🔍 Search by title, description, source, or author..."
                className="w-full pl-14 pr-14 py-4 text-base border-2 border-gray-200 rounded-2xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all bg-gray-50 hover:bg-white"
              />
              {searchQuery && (
                <button
                  onClick={() => handleSearch('')}
                  className="absolute right-5 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-red-500 transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              )}
            </div>
            
            {/* Search Results Info */}
            {isSearching && (
              <div className="mt-3 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-700 font-medium">
                  🔎 Found <span className="font-bold">{articles.length}</span> article{articles.length !== 1 ? 's' : ''} matching "<span className="font-bold">{searchQuery}</span>"
                </p>
              </div>
            )}
          </div>
        </div>

          {/* ========== NEWS ARTICLES GRID SECTION ========== */}
        {articles.length === 0 && !loading ? (
          <div className="bg-white rounded-3xl shadow-xl p-16 text-center border border-gray-100">
            <div className="max-w-md mx-auto">
              <div className="p-6 bg-gray-100 rounded-full inline-block mb-6">
                <FaNewspaper className="w-20 h-20 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-3">No Articles Found</h3>
              <p className="text-gray-600 text-lg">
                {isSearching 
                  ? `No articles match your search "${searchQuery}". Try different keywords.`
                  : 'No news articles available at the moment.'}
              </p>
              {isSearching && (
                <button
                  onClick={() => handleSearch('')}
                  className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-semibold"
                >
                  Clear Search
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5 md:gap-6 lg:gap-8 mb-6 md:mb-8">
          {articles.map((article, index) => (
            <article
              key={`${article.url}-${index}`}
              className="group bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100 hover:border-blue-300 transform hover:-translate-y-2"
            >
              {/* ========== ARTICLE IMAGE SECTION ========== */}
              {article.urlToImage && (
                <div className="relative h-48 sm:h-56 md:h-60 lg:h-64 xl:h-72 overflow-hidden bg-gradient-to-br from-gray-200 to-gray-300">
                  <img
                    src={article.urlToImage}
                    alt={article.title}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={(e) => {
                      const parent = (e.target as HTMLImageElement).parentElement;
                      if (parent) parent.style.display = 'none';
                    }}
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 md:top-4 md:left-4">
                    <span className="px-2 py-1 md:px-3 md:py-1.5 bg-white/95 backdrop-blur-sm rounded-full text-xs md:text-sm font-extrabold text-blue-600 shadow-xl">
                      📚 EDUCATION
                    </span>
                  </div>
                  {/* New Badge for recent articles */}
                  {(() => {
                    const hoursAgo = Math.floor((new Date().getTime() - new Date(article.publishedAt).getTime()) / (1000 * 60 * 60));
                    return hoursAgo < 24 && (
                      <div className="absolute top-3 right-3 md:top-4 md:right-4">
                        <span className="px-2 py-1 md:px-3 md:py-1.5 bg-red-500 backdrop-blur-sm rounded-full text-xs md:text-sm font-extrabold text-white shadow-xl animate-pulse">
                          🔥 NEW
                        </span>
                      </div>
                    );
                  })()}
                </div>
              )}

              {/* ========== ARTICLE CONTENT SECTION ========== */}
              <div className="p-4 sm:p-5 md:p-6 lg:p-7">
                {/* Source and Date Row */}
                <div className="flex items-center justify-between mb-3 md:mb-4 pb-3 border-b-2 border-gray-100">
                  <div className="flex items-center gap-1.5 md:gap-2 font-bold text-blue-600 bg-blue-50 px-2.5 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm">
                    <FaNewspaper className="w-3 h-3 md:w-4 md:h-4" />
                    <span className="truncate max-w-[120px] sm:max-w-[150px] md:max-w-none">{article.source.name}</span>
                  </div>
                  <div className="flex items-center gap-1.5 md:gap-2 text-gray-500 text-xs md:text-sm whitespace-nowrap">
                    <FaCalendarAlt className="w-3 h-3 md:w-4 md:h-4" />
                    {formatDate(article.publishedAt)}
                  </div>
                </div>

                {/* Article Title */}
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-extrabold text-gray-900 mb-3 md:mb-4 line-clamp-2 group-hover:text-blue-600 transition-colors leading-tight min-h-[44px] sm:min-h-[50px] md:min-h-[56px]">
                  {article.title}
                </h2>

                {/* Article Description */}
                <p className="text-sm sm:text-base text-gray-600 mb-4 md:mb-6 line-clamp-3 leading-relaxed min-h-[60px] sm:min-h-[66px] md:min-h-[72px]">
                  {article.description}
                </p>

                {/* ========== AUTHOR AND ACTION SECTION ========== */}
                <div className="flex items-center justify-between pt-4 md:pt-5 border-t-2 border-gray-100">
                  {article.author && article.author !== 'Unknown Author' ? (
                    <div className="flex items-center gap-1.5 md:gap-2 text-xs md:text-sm text-gray-600 max-w-[40%] md:max-w-[50%]">
                      <div className="p-1.5 md:p-2 bg-gray-100 rounded-full flex-shrink-0">
                        <FaUser className="w-2.5 h-2.5 md:w-3 md:h-3 text-gray-500" />
                      </div>
                      <span className="line-clamp-1 font-medium">{article.author}</span>
                    </div>
                  ) : (
                    <div></div>
                  )}
                  <a
                    href={article.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 md:gap-2 px-4 py-2 sm:px-5 sm:py-2.5 md:px-6 md:py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg md:rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl text-xs sm:text-sm font-bold ml-auto whitespace-nowrap"
                  >
                    <span className="hidden sm:inline">Read More</span>
                    <span className="sm:hidden">Read</span>
                    <FaExternalLinkAlt className="w-3 h-3 md:w-4 md:h-4" />
                  </a>
                </div>
              </div>
            </article>
          ))}
          </div>
        )}

        {/* ========== PAGINATION SECTION ========== */}
        {!isSearching && maxPage > 1 && (
          <div className="bg-white rounded-2xl md:rounded-3xl shadow-2xl p-4 sm:p-5 md:p-6 lg:p-8 border border-gray-100">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 md:gap-6">
              {/* Previous Button */}
              <button
                onClick={handlePrevPage}
                disabled={page === 1 || loading}
                className="w-full sm:w-auto px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-white border-2 border-gray-300 rounded-lg md:rounded-xl hover:bg-gray-50 hover:border-blue-500 hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-bold text-gray-700 text-sm md:text-base"
              >
                ← Previous
              </button>
              
              {/* Page Numbers */}
              <div className="flex items-center gap-2 md:gap-3">
                <div className="flex gap-1.5 md:gap-2">
                  {Array.from({ length: Math.min(5, maxPage) }, (_, i) => {
                    let pageNum;
                    if (maxPage <= 5) {
                      pageNum = i + 1;
                    } else if (page <= 3) {
                      pageNum = i + 1;
                    } else if (page >= maxPage - 2) {
                      pageNum = maxPage - 4 + i;
                    } else {
                      pageNum = page - 2 + i;
                    }
                    
                    return (
                      <button
                        key={pageNum}
                        onClick={() => {
                          fetchNews(pageNum);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}
                        className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl font-bold transition-all text-sm md:text-base ${
                          page === pageNum
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-110'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Next Button */}
              <button
                onClick={handleNextPage}
                disabled={page === maxPage || loading}
                className="w-full sm:w-auto px-4 sm:px-6 md:px-8 py-2.5 sm:py-3 md:py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg md:rounded-xl hover:from-blue-600 hover:to-purple-700 hover:shadow-xl transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed font-bold text-sm md:text-base"
              >
                Next →
              </button>
            </div>

            {/* Results Info */}
            <div className="text-center mt-4 md:mt-6 pt-4 md:pt-6 border-t-2 border-gray-200">
              <p className="text-sm md:text-base text-gray-600">
                Showing <span className="font-bold text-blue-600 text-base md:text-lg">{(page - 1) * pageSize + 1}</span> - <span className="font-bold text-blue-600 text-base md:text-lg">{Math.min(page * pageSize, totalResults)}</span> of <span className="font-bold text-purple-600 text-base md:text-lg">{totalResults.toLocaleString()}</span> articles
              </p>
              <p className="text-xs md:text-sm text-gray-500 mt-1.5 md:mt-2">
                📄 Page {page} of {maxPage.toLocaleString()}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

