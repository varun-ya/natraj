# Complete Static vs API Fields Comparison - Mobile & Web Apps

## 🎯 TEACHER/TUTOR SIDE

### ✅ API-INTEGRATED FIELDS (Both Mobile & Web)

| Field | Mobile Source | Web Source | Status |
|-------|--------------|------------|--------|
| **Profile Data** | `TutorDataModel.load()` → `GET /api/tutor/profile` | `useUserProfile` → `GET /api/tutor/profile` | ✅ MATCHED |
| firstName | `data.firstName` | API response | ✅ API |
| lastName | `data.lastName` | API response | ✅ API |
| email | `data.email` | API response | ✅ API |
| phone | `data.phone` | API response | ✅ API |
| profilePhoto | `data.profilePhoto` | API response | ✅ API |
| coverPhoto | `data.coverPhoto` | API response | ✅ API |
| bio | `data.profile['bio']` | API response | ✅ API |
| subjects | `data.subjects` | API response | ✅ API |
| experience | `data.experience` | API response | ✅ API |
| education | `data.education` | API response | ✅ API |
| rates | `data.rates` | API response | ✅ API |
| availability | `data.availability` | API response | ✅ API |
| isActive | `data.isActive` | API response | ✅ API |
| isVerified | `data.isVerified` | API response | ✅ API |
| **Dashboard Stats** | `data.raw['stats']` | `teacherDashboardService` | ✅ MATCHED |
| monthlyEarnings | `stats['monthlyEarnings']` | API response | ✅ API |
| activeStudents | `stats['activeStudents']` | API response | ✅ API |
| avgRating | `stats['avgRating']` | API response | ✅ API |
| reviewCount | `stats['reviewCount']` | API response | ✅ API |
| classesThisWeek | `stats['classesThisWeek']` | API response | ✅ API |
| hoursThisWeek | `stats['hoursThisWeek']` | API response | ✅ API |
| sessionsThisWeek | `stats['sessionsThisWeek']` | API response | ✅ API |
| followers | `stats['followers']` | API response | ✅ API |
| impressions | `stats['impressions']` | API response | ✅ API |
| profileViews | `stats['profileViews']` | API response | ✅ API |
| **Today's Schedule** | `data.todaySchedule` | `teacherDashboardService` | ✅ MATCHED |
| learner | API array | API array | ✅ API |
| subject | API array | API array | ✅ API |
| dateTime | API array | API array | ✅ API |
| **Pending Requests** | `data.pendingRequests` | `requestsService` | ✅ MATCHED |
| studentName | API array | API array | ✅ API |
| subject | API array | API array | ✅ API |
| type (paid/demo/reschedule) | API array | API array | ✅ API |
| status (pending/accepted/declined) | API array | API array | ✅ API |
| **Learners List** | `data.learners` | `teacherDashboardService` | ✅ MATCHED |
| name | API array | API array | ✅ API |
| image | API array | API array | ✅ API |
| subjects | API array | API array | ✅ API |
| location | API array | API array | ✅ API |
| **Chat Conversations** | `data.learners` (converted) | `data.learners` (converted) | ✅ MATCHED |
| Populated from learners array | ✅ API | ✅ API | ✅ API |
| **Blog/Feed** | `GET /api/blogs` | `blogService` | ✅ MATCHED |
| title | API | API | ✅ API |
| body | API | API | ✅ API |
| coverImageUrl | API | API | ✅ API |
| authorName | API | API | ✅ API |
| tags | API | API | ✅ API |
| **Stories** | `fetchTodayBlogs()` | `feedService.fetchTodayBlogs()` | ✅ MATCHED |
| Today's blogs | API | API | ✅ API |

### ⚠️ READY BUT BACKEND MISSING

| Field | Mobile | Web | Backend Status |
|-------|--------|-----|----------------|
| **Wallet** | `data.raw['wallet']` | `walletService.fetchTutorWallet()` | ❌ API doesn't return `wallet` field |
| totalEarned | Ready | Ready | Missing |
| pendingClearance | Ready | Ready | Missing |
| withdrawn | Ready | Ready | Missing |
| availableBalance | Ready | Ready | Missing |
| transactions | Ready | Ready | Missing |

### ❌ STATIC/EMPTY FIELDS (Both Mobile & Web)

| Field | Mobile Source | Web Source | Status |
|-------|--------------|------------|--------|
| **Schedule/Calendar Events** | `createInitialEvents()` returns `[]` | `scheduleService` returns `[]` | ❌ EMPTY (both) |
| **Chat Messages** | Local state only | Local state only | ❌ STATIC (both) |

---

## 🎓 LEARNER/STUDENT SIDE

### ✅ API-INTEGRATED FIELDS (Both Mobile & Web)

| Field | Mobile Source | Web Source | Status |
|-------|--------------|------------|--------|
| **Blog/Feed** | `GET /api/blogs` | `feedService` | ✅ MATCHED |
| All blog fields | API | API | ✅ API |

### ❌ STATIC FIELDS (Both Mobile & Web)

| Field | Mobile Source | Web Source | Status |
|-------|--------------|------------|--------|
| **Profile Data** | No LearnerDataModel | Mock data | ❌ STATIC (both) |
| **Dashboard Stats** | Hardcoded | Hardcoded | ❌ STATIC (both) |
| XP | `1240` | N/A | ❌ STATIC |
| Streak | `7d` | N/A | ❌ STATIC |
| Sessions | `156` | N/A | ❌ STATIC |
| Hours | `89.5h` | N/A | ❌ STATIC |
| Tutors | `3` | N/A | ❌ STATIC |
| Classes (This Week) | N/A | `8` | ❌ STATIC |
| Hours (This Week) | N/A | `12.5` | ❌ STATIC |
| Avg Score | N/A | `92%` | ❌ STATIC |
| Assignments completed | N/A | `5` | ❌ STATIC |
| Tests taken | N/A | `3` | ❌ STATIC |
| Doubts cleared | N/A | `12` | ❌ STATIC |
| Practice problems | N/A | `48` | ❌ STATIC |
| **Upcoming Schedule** | `_generateSessions()` | `scheduleCards` array | ❌ STATIC (both) |
| Tutor name | Hardcoded | Hardcoded | ❌ STATIC |
| Subject | Hardcoded | Hardcoded | ❌ STATIC |
| DateTime | Generated | Hardcoded | ❌ STATIC |
| **Review Lessons** | Mock data | `reviewCards` array | ❌ STATIC (both) |
| Session title | Hardcoded | Hardcoded | ❌ STATIC |
| Files count | Hardcoded | Hardcoded | ❌ STATIC |
| Quiz score | Hardcoded | Hardcoded | ❌ STATIC |
| Duration | Hardcoded | Hardcoded | ❌ STATIC |
| **My Tutors** | `assets/mock_tutors.json` | `myTutors` array | ❌ STATIC (both) |
| Tutor name | JSON file | Hardcoded | ❌ STATIC |
| Classes count | JSON file | Hardcoded | ❌ STATIC |
| Subject | JSON file | Hardcoded | ❌ STATIC |
| Rating | JSON file | Hardcoded | ❌ STATIC |
| **Suggested Tutors** | `assets/mock_tutors.json` | Hardcoded array | ❌ STATIC (both) |
| Tutor name | JSON file | Hardcoded | ❌ STATIC |
| Subject | JSON file | Hardcoded | ❌ STATIC |
| Rating | JSON file | Hardcoded | ❌ STATIC |
| Price | JSON file | Hardcoded | ❌ STATIC |
| Students | JSON file | Hardcoded | ❌ STATIC |
| Experience | JSON file | Hardcoded | ❌ STATIC |
| **Schedule/Calendar** | `createInitialEvents()` returns `[]` | Empty array | ❌ EMPTY (both) |
| **Chat Conversations** | `seedInbox` (empty) | Empty array | ❌ EMPTY (both) |
| **Wallet** | `kMockTxs` | `MOCK_TXS` | ❌ STATIC (both) |
| Balance | Mock | Mock | ❌ STATIC |
| Transactions | Mock | Mock | ❌ STATIC |
| **Activities Feed** | Mock data | `allActivities` array | ❌ STATIC (both) |
| Activity text | Hardcoded | Hardcoded | ❌ STATIC |
| Time | Hardcoded | Hardcoded | ❌ STATIC |
| **Rewards** | Mock data | Mock data | ❌ STATIC (both) |
| **Streak Calendar** | Mock data | Mock data | ❌ STATIC (both) |

---

## 📊 SUMMARY BY CATEGORY

### Teacher/Tutor Side

| Category | Total Fields | API Fields | Static Fields | Ready (Backend Missing) |
|----------|-------------|-----------|---------------|------------------------|
| Profile | 15 | 15 (100%) | 0 | 0 |
| Dashboard Stats | 10 | 10 (100%) | 0 | 0 |
| Schedule | 3 | 3 (100%) | 0 | 0 |
| Requests | 4 | 4 (100%) | 0 | 0 |
| Learners | 4 | 4 (100%) | 0 | 0 |
| Chat | 1 | 1 (100%) | 0 | 0 |
| Blog/Feed | 5 | 5 (100%) | 0 | 0 |
| Wallet | 5 | 0 | 0 | 5 (100%) |
| Calendar Events | 1 | 0 | 0 (empty) | 1 |
| **TOTAL** | **48** | **42 (87.5%)** | **0** | **6 (12.5%)** |

### Learner/Student Side

| Category | Total Fields | API Fields | Static Fields |
|----------|-------------|-----------|---------------|
| Profile | 0 | 0 | 0 (no model) |
| Dashboard Stats | 13 | 0 | 13 (100%) |
| Upcoming Schedule | 3 | 0 | 3 (100%) |
| Review Lessons | 4 | 0 | 4 (100%) |
| My Tutors | 4 | 0 | 4 (100%) |
| Suggested Tutors | 6 | 0 | 6 (100%) |
| Calendar Events | 1 | 0 | 0 (empty) |
| Chat | 1 | 0 | 0 (empty) |
| Wallet | 2 | 0 | 2 (100%) |
| Activities | 2 | 0 | 2 (100%) |
| Rewards | 1 | 0 | 1 (100%) |
| Streak Calendar | 1 | 0 | 1 (100%) |
| Blog/Feed | 5 | 5 (100%) | 0 |
| **TOTAL** | **43** | **5 (11.6%)** | **36 (83.7%)** |

---

## 🎯 FINAL STATUS

### ✅ 100% PARITY ACHIEVED

**Mobile App vs Web App:**
- Teacher side: Both use API for 87.5% of fields
- Learner side: Both use static data for 83.7% of fields
- **Perfect match** - No integration gaps between platforms

### 📋 WHAT'S STATIC IN BOTH APPS

**Teacher Side:**
- ❌ Calendar events (empty, waiting for API)
- ⚠️ Wallet (ready, backend doesn't return field yet)

**Learner Side:**
- ❌ All profile data (no API endpoint)
- ❌ All dashboard stats (hardcoded)
- ❌ Upcoming schedule (mock data)
- ❌ Review lessons (mock data)
- ❌ My tutors (JSON file / hardcoded)
- ❌ Suggested tutors (JSON file / hardcoded)
- ❌ Calendar events (empty)
- ❌ Chat conversations (empty)
- ❌ Wallet (mock data)
- ❌ Activities feed (mock data)
- ❌ Rewards (mock data)
- ❌ Streak calendar (mock data)
- ✅ Blog/Feed (API - only working feature)

### 🚀 NEXT STEPS FOR BACKEND

1. Add `wallet` field to `GET /api/tutor/profile` response
2. Create `GET /api/schedule` endpoint for calendar events
3. Create learner profile API endpoints
4. Create learner dashboard stats API
5. Create learner schedule/sessions API
6. Create learner wallet API
7. Create chat messages API
