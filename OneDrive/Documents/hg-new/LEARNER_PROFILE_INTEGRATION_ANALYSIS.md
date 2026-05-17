# LEARNER PROFILE INTEGRATION ANALYSIS - Mobile App

## 📋 OVERVIEW

The mobile app **DOES HAVE** learner profile integration! After the latest pull, there's a complete `LearnerDataModel` service that fetches data from API.

---

## 🔧 ARCHITECTURE & WORKFLOW

### 1. **LearnerDataModel Service** (`learner_data_model.dart`)

**Purpose**: Centralized service for fetching learner-related data from API

**Base URL**: `https://app.homeguruworld.com/api`

**Key Methods**:

#### A. `fetchLearnerStats(String learnerId)`
```dart
GET /api/learner/stats?learnerId={learnerId}
```

**Returns**:
```dart
{
  'xp': int,
  'streak': int,
  'sessions': int,
  'hours': double,
  'tutors': int,
  'streakData': []
}
```

**Fallback**: Returns default stats (all zeros) if API fails

**Usage**: Called by `StatsCarousel` widget to display learner stats

---

#### B. `fetchTutors()`
```dart
GET /api/tutors?limit=20&lastKey={lastKey}&subject={subject}&board={board}&grade={grade}
```

**Parameters**:
- `limit`: Number of tutors to fetch (default: 20)
- `lastKey`: Pagination key for next page
- `subject`: Filter by subject
- `board`: Filter by board (CBSE, ICSE, etc.)
- `grade`: Filter by grade

**Returns**:
```dart
{
  'tutors': List<Map<String, dynamic>>,
  'hasMore': bool,
  'lastKey': String?
}
```

**Features**:
- ✅ Pagination support
- ✅ Filter by subject, board, grade
- ✅ Returns active & verified tutors only

**Usage**: Called by `SearchTab` to display tutor grid

---

#### C. `mapTutorForWidget(Map<String, dynamic> apiTutor)`

**Purpose**: Transforms API tutor data to widget-friendly format

**Input** (API format):
```dart
{
  'tutorId': String,
  'name': String,
  'profilePhoto': String,
  'isVerified': bool,
  'rating': double,
  'reviewCount': int,
  'location': String/Map,
  'experience': String,
  'subjects': List,
  'rates': List,
  'languages': List,
  'availability': Map/List,
  'hourlyRate': int
}
```

**Output** (Widget format):
```dart
{
  'id': String,
  'name': String,
  'image': String,
  'verified': bool,
  'rating': double,
  'reviews': int,
  'students': int, // Mock (not in API yet)
  'location': String,
  'experience': String,
  'responseTime': String, // Mock
  'subjects': List<{name, hourlyRate}>,
  'rates': List,
  'languages': List,
  'availability': List
}
```

---

## 📊 INTEGRATION POINTS

### 1. **Stats Carousel** (`stats_carousel.dart`)

**Integration Flow**:
```
1. Widget initState()
2. _loadStats() called
3. Get userId from SharedPreferences
4. Call LearnerDataModel.fetchLearnerStats(userId)
5. Update state with API response
6. Display stats in carousel
```

**API Fields Used**:
- ✅ `xp` → "1240 XP"
- ✅ `streak` → "7d Streak"
- ✅ `sessions` → "156 Sessions"
- ✅ `hours` → "89.5h Hours"
- ✅ `tutors` → "3 Tutors"

**Fallback**: Shows "0" for all stats if API fails

**Loading State**: Shows CircularProgressIndicator while fetching

---

### 2. **Search Tab** (`search_tab.dart`)

**Integration Flow**:
```
1. Widget initState()
2. _loadTutors() called
3. Call LearnerDataModel.fetchTutors(limit: 20)
4. Map each tutor using mapTutorForWidget()
5. Apply filters (subject, budget)
6. Display in grid with pagination
7. Load more on scroll (infinite scroll)
```

**Features**:
- ✅ **Pagination**: Loads 20 tutors at a time
- ✅ **Infinite Scroll**: Auto-loads more when scrolling near bottom
- ✅ **Filters**: Subject, Budget (Under ₹300, ₹300-500, ₹500-800, Above ₹800)
- ✅ **Pull to Refresh**: Reloads tutors from API
- ✅ **Shimmer Loading**: Shows skeleton cards while loading

**API Fields Used**:
- ✅ `tutorId` → Tutor ID
- ✅ `name` → Tutor name
- ✅ `profilePhoto` → Avatar image
- ✅ `isVerified` → Verified badge
- ✅ `rating` → Star rating
- ✅ `reviewCount` → Review count
- ✅ `location` → Location text
- ✅ `experience` → Years of experience
- ✅ `subjects` → Subject list
- ✅ `hourlyRate` → Price per hour

---

### 3. **My Tutors** (`my_tutors.dart`)

**Current Status**: ❌ Uses `assets/mock_tutors.json` (static file)

**Expected Integration**: Should fetch from API endpoint like:
```dart
GET /api/learner/my-tutors?learnerId={learnerId}
```

**Not Implemented Yet**: Still uses local JSON file

---

### 4. **Suggested Tutors** (`suggested_tutors.dart`)

**Current Status**: ❌ Uses `assets/mock_tutors.json` (static file)

**Expected Integration**: Should fetch from API endpoint like:
```dart
GET /api/learner/suggested-tutors?learnerId={learnerId}
```

**Not Implemented Yet**: Still uses local JSON file

---

## 🔄 DATA FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────┐
│                    LEARNER DASHBOARD                         │
└─────────────────────────────────────────────────────────────┘
                              │
                              ├─── Home Tab
                              │     │
                              │     ├─── StatsCarousel
                              │     │     └─── LearnerDataModel.fetchLearnerStats()
                              │     │           └─── GET /api/learner/stats
                              │     │                 └─── Returns: xp, streak, sessions, hours, tutors
                              │     │
                              │     ├─── UpcomingCard (❌ Static)
                              │     ├─── ReviewLessons (❌ Static)
                              │     ├─── MyTutors (❌ JSON file)
                              │     ├─── SuggestedTutors (❌ JSON file)
                              │     └─── StreakCalendar (❌ Static)
                              │
                              ├─── Search Tab
                              │     └─── LearnerDataModel.fetchTutors()
                              │           └─── GET /api/tutors?limit=20
                              │                 └─── Returns: tutors[], hasMore, lastKey
                              │                       └─── mapTutorForWidget()
                              │                             └─── Display in grid
                              │
                              ├─── Schedule Tab (❌ Empty)
                              ├─── Feed Tab (✅ API - blogs)
                              └─── Chat Tab (❌ Empty)
```

---

## ✅ WHAT'S INTEGRATED (API)

| Feature | Endpoint | Status | Fields |
|---------|----------|--------|--------|
| **Learner Stats** | `GET /api/learner/stats` | ✅ WORKING | xp, streak, sessions, hours, tutors |
| **Tutor Search** | `GET /api/tutors` | ✅ WORKING | tutorId, name, profilePhoto, rating, subjects, etc. |
| **Pagination** | `GET /api/tutors?lastKey=` | ✅ WORKING | Infinite scroll support |
| **Filters** | `GET /api/tutors?subject=&board=&grade=` | ✅ WORKING | Subject, board, grade filters |

---

## ❌ WHAT'S STILL STATIC

| Feature | Current Source | Expected Endpoint |
|---------|---------------|-------------------|
| **My Tutors** | `assets/mock_tutors.json` | `GET /api/learner/my-tutors` |
| **Suggested Tutors** | `assets/mock_tutors.json` | `GET /api/learner/suggested-tutors` |
| **Upcoming Schedule** | Hardcoded in widget | `GET /api/learner/schedule` |
| **Review Lessons** | Hardcoded in widget | `GET /api/learner/sessions` |
| **Rewards** | Hardcoded in widget | `GET /api/learner/rewards` |
| **Streak Calendar** | Hardcoded in widget | `GET /api/learner/streak` |
| **Wallet** | Mock data | `GET /api/learner/wallet` |
| **Chat** | Empty array | `GET /api/chat/conversations` |

---

## 🔑 KEY INSIGHTS

### 1. **Authentication**
- Uses `SharedPreferences` to store `userId`
- Stored during login: `prefs.setString('userId', userId)`
- Retrieved for API calls: `prefs.getString('userId')`

### 2. **Error Handling**
- All API calls have try-catch blocks
- Falls back to default/empty data on error
- Prints error to console for debugging

### 3. **Caching**
- No caching implemented
- Every widget load = fresh API call
- Could benefit from caching layer

### 4. **Loading States**
- Stats: Shows CircularProgressIndicator
- Tutors: Shows shimmer skeleton cards
- Good UX during loading

### 5. **Pagination Strategy**
- Loads 20 tutors per page
- Uses `lastKey` for cursor-based pagination
- Infinite scroll triggers at 400px from bottom

---

## 🎯 COMPARISON: MOBILE vs WEB

### Mobile App (Current State)
- ✅ Learner stats API integrated
- ✅ Tutor search API integrated
- ✅ Pagination working
- ✅ Filters working
- ❌ My Tutors uses JSON file
- ❌ Suggested Tutors uses JSON file
- ❌ Schedule/Sessions static
- ❌ Wallet static

### Web App (Current State)
- ❌ Learner stats static (hardcoded)
- ❌ Tutor search static (hardcoded)
- ❌ No pagination
- ❌ No filters
- ❌ My Tutors static
- ❌ Suggested Tutors static
- ❌ Schedule/Sessions static
- ❌ Wallet static

---

## 📝 NEXT STEPS FOR WEB APP

To achieve parity with mobile app, web app needs:

1. ✅ Create `learnerStatsService.ts`
   - Fetch from `GET /api/learner/stats`
   - Update dashboard stats to use API

2. ✅ Create `tutorSearchService.ts`
   - Fetch from `GET /api/tutors`
   - Implement pagination
   - Implement filters (subject, budget)
   - Add infinite scroll

3. ⚠️ Keep My Tutors static (mobile also uses JSON)
4. ⚠️ Keep Suggested Tutors static (mobile also uses JSON)
5. ⚠️ Keep Schedule static (mobile also static)
6. ⚠️ Keep Wallet static (mobile also static)

---

## 🚀 SUMMARY

**Mobile App Learner Integration Status**:
- **Stats**: ✅ 100% API integrated
- **Tutor Search**: ✅ 100% API integrated
- **My Tutors**: ❌ JSON file (not API)
- **Suggested Tutors**: ❌ JSON file (not API)
- **Other Features**: ❌ Static/Empty

**Overall**: 2 out of 8 major features are API-integrated (25%)

**Web App Goal**: Match mobile app's 25% API integration for learner side
