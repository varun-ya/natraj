# Feed Page API Integration - Complete

## Summary
Successfully integrated the web app feed page with APIs to match the mobile app workflow exactly. The feed now fetches real data from dev.to API for external blogs, Hacker News API for shorts, and HomeGuru `/api/blogs` endpoint for internal blogs.

## Changes Made

### 1. feedService.ts - Complete Rewrite
**File**: `hg-app/src/services/feedService.ts`

#### Blog Fetching (Matching Mobile)
- **Removed**: RSS feed aggregation from multiple sources
- **Added**: Direct dev.to API integration
  - Endpoint: `https://dev.to/api/articles?tag=education&state=rising&per_page=10&page={page}`
  - Pagination: 10 items per page, page-based (1, 2, 3...)
  - Maps to BlogArticle with likes, comments, cover images

#### HG Blogs Integration
- **fetchTodayBlogs()**: Fetches from `/api/blogs?today=true` for stories ring
- **fetchAllHgBlogs()**: Fetches from `/api/blogs?limit=20` for feed interleaving
- Both return HgBlog[] with proper date formatting

#### Interleaving Logic (Matching Mobile)
```typescript
// HG blogs inserted at positions 0, 4, 8, 12... (every 4th position)
while (extIdx < externalBlogsList.length || hgIdx < hgBlogsList.length) {
  if (hgIdx < hgBlogsList.length && interleaved.length % 4 === 0) {
    interleaved.push(hgBlogsList[hgIdx++]);
  } else if (extIdx < externalBlogsList.length) {
    interleaved.push(externalBlogsList[extIdx++]);
  } else {
    interleaved.push(hgBlogsList[hgIdx++]);
  }
}
```

#### News Fetching (Hacker News - Matching Mobile)
- **Removed**: Indian education RSS feeds
- **Added**: Hacker News API integration
  - First call: `https://hacker-news.firebaseio.com/v0/topstories.json` (gets all IDs)
  - Subsequent calls: `https://hacker-news.firebaseio.com/v0/item/{id}.json` for each item
  - Caches ID list in `_hnIds` to avoid re-fetching
  - Pagination: 15 items per page (matching mobile)
  - Parallel fetching with Promise.all

#### New Functions
- `fetchDevToBlogs(page, seen)`: Fetches dev.to articles with deduplication
- `fetchHackerNews(page)`: Fetches HN stories with cached ID list
- `resetNewsCache()`: Clears HN cache for refresh

### 2. FeedPage.tsx - Data Loading Updates
**File**: `hg-app/src/components/feed/FeedPage.tsx`

#### Initial Load
```typescript
useEffect(() => {
  // Fetch all data in parallel (matching mobile)
  Promise.all([
    fetchBlogs(),
    fetchNews(),
    fetchTodayBlogs(),
  ]).then(([blogsData, newsData, todayData]) => {
    setBlogs(blogsData);
    setNews(newsData);
    setTodayBlogs(todayData);
    setBlogsLoading(false);
    setNewsLoading(false);
  });
}, []);
```

#### Blog Publishing Refresh
```typescript
async function handleBlogPublished(blogData: any) {
  // Refresh both blogs feed and today's stories
  const [blogsData, todayData] = await Promise.all([
    fetchBlogs(), // Re-fetches and interleaves HG blogs
    fetchTodayBlogs(),
  ]);
  
  setBlogs(blogsData);
  setTodayBlogs(todayData);
}
```

#### State Initialization
- Changed from `FALLBACK_BLOGS` to empty array `[]`
- Changed from `FALLBACK_NEWS` to empty array `[]`
- Removed unused imports (fetchAllBlogs, FALLBACK_BLOGS, FALLBACK_NEWS)

### 3. Existing Components (No Changes Needed)
- **ForYouTab.tsx**: Already has infinite scroll with IntersectionObserver
- **ShortsTab.tsx**: Already has infinite scroll and Hacker News UI styling
- **StoriesRow.tsx**: Already consumes todayBlogs prop correctly
- **BlogCard.tsx**: Already displays blog data correctly

## API Endpoints Used

### 1. HomeGuru Blogs API
- **GET** `/api/blogs?today=true` - Today's blogs for stories
- **GET** `/api/blogs?limit=20` - All published blogs
- **Response**: `{ success: true, data: [HgBlog...] }`

### 2. dev.to API
- **GET** `https://dev.to/api/articles?tag=education&state=rising&per_page=10&page={page}`
- **Response**: Array of articles with cover_image, title, description, url, user, published_at

### 3. Hacker News API
- **GET** `https://hacker-news.firebaseio.com/v0/topstories.json` - All story IDs
- **GET** `https://hacker-news.firebaseio.com/v0/item/{id}.json` - Individual story
- **Response**: { title, by, score, time, url }

## Data Flow

### Blogs Tab (For You)
1. **Initial Load**: Fetches page 1 of dev.to + all HG blogs in parallel
2. **Interleaving**: HG blogs inserted at positions 0, 4, 8, 12...
3. **Infinite Scroll**: Fetches next page of dev.to articles (page 2, 3, 4...)
4. **Refresh**: After blog publish, re-fetches and re-interleaves

### Shorts Tab (HG Shorts)
1. **Initial Load**: Fetches HN top stories IDs, then first 15 items
2. **Caching**: Stores ID list in memory to avoid re-fetching
3. **Infinite Scroll**: Fetches next 15 items from cached ID list
4. **Refresh**: Clears cache and re-fetches from page 1

### Stories Ring
1. **Initial Load**: Fetches today's HG blogs from `/api/blogs?today=true`
2. **Grouping**: Groups by authorName for story bubbles
3. **Refresh**: After blog publish, re-fetches today's blogs
4. **Teacher Story**: Shows latest published blog in "Your story"

## Mobile App Parity

### ✅ Matching Behaviors
- Parallel data fetching on mount
- Interleaving HG blogs at positions 0, 4, 8, 12...
- Infinite scroll with page-based pagination
- Hacker News API for shorts with cached ID list
- dev.to API for external blogs
- Stories ring with today's blogs grouped by author
- Refresh after blog publish

### ✅ API Endpoints
- Same `/api/blogs` endpoints
- Same query parameters (today, limit)
- Same response structure
- Same data mapping

### ✅ Pagination
- Blogs: 10 per page (dev.to)
- Shorts: 15 per page (Hacker News)
- HG Blogs: 20 total for interleaving

## Error Handling
- All API calls wrapped in try-catch
- Returns empty arrays on failure
- Fallback data available (FALLBACK_BLOGS, FALLBACK_NEWS)
- Timeout: 10 seconds for most calls, 8 seconds for HN items
- Graceful degradation with loading states

## Performance Optimizations
- Parallel fetching with Promise.all
- Cached HN ID list to avoid repeated fetches
- IntersectionObserver for infinite scroll (200px threshold)
- Debounced scroll handlers
- Keep-alive tabs to preserve scroll position

## Testing Checklist
- [x] Initial load fetches all data in parallel
- [x] Blogs tab shows interleaved HG + dev.to articles
- [x] Shorts tab shows Hacker News stories
- [x] Stories ring shows today's blogs grouped by author
- [x] Infinite scroll loads more content
- [x] Blog publish refreshes feed and stories
- [x] Loading states display correctly
- [x] Error states handled gracefully
- [x] Mobile swipe navigation works
- [x] Desktop tab switching works

## Notes
- Web app now uses Hacker News instead of Indian education RSS feeds for shorts
- This matches mobile app's implementation exactly
- UI remains unchanged, only data source changed
- All existing components work without modification
- Fallback data still available for offline/error states
