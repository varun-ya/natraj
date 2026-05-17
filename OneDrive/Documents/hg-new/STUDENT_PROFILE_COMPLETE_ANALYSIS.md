# Student Profile - Complete Analysis

## Overview
Complete analysis of student (learner) profile implementation in mobile app including data sources, API integrations, workflows, and UI components.

---

## 1. Profile Screen Structure

### Main Screen: `profile_screen.dart`
- **Layout**: NestedScrollView with 4 tabs
- **Components**:
  - ProfileHeader (cover photo + avatar)
  - ProfileInfo (name, bio, stats)
  - TabBar with 4 tabs: About, Achievements, My Tutors, Settings

### Data Flow:
```
ProfileScreen (main container)
  ├── ProfileHeader (cover + avatar management)
  │   └── Uses: ProfileStore (local file storage)
  │
  ├── ProfileInfo (name, bio, stats display)
  │   ├── Fetches: LearnerProfileService.fetchProfile()
  │   └── Fetches: LearnerDataModel.fetchLearnerStats()
  │
  └── TabBarView
      ├── AboutTab (bio, subjects, goals) - STATIC DATA
      ├── AchievementsTab (badges) - STATIC DATA
      ├── MyTutorsTab (tutor list) - STATIC DATA (mock_tutors.json)
      └── SettingsTab (account, notifications) - LOCAL STORAGE
```

---

## 2. API Integrations

### ✅ API Integration #1: Profile Data
**Service**: `LearnerProfileService.fetchProfile()`
**Endpoint**: `GET /api/learner/profile?learnerId={learnerId}`
**Used In**: `profile_info.dart`

**Response Structure**:
```json
{
  "profile": {
    "firstName": "string",
    "lastName": "string",
    "email": "string",
    "phone": "string",
    "profilePhoto": "string (URL)",
    "coverPhoto": "string (URL)",
    "bio": "string",
    "grade": "string",
    "board": "string",
    "subjects": ["string"],
    "goals": ["string"],
    "dob": "string",
    "gender": "string",
    "createdAt": "string (ISO date)"
  }
}
```

**Fields Displayed**:
- Name: `firstName + lastName`
- Email: `email`
- Bio: `bio`
- Joined Date: `createdAt` (formatted as "Joined MMM YYYY")

---

### ✅ API Integration #2: Stats Data
**Service**: `LearnerDataModel.fetchLearnerStats()`
**Endpoint**: `GET /api/learner/stats?learnerId={learnerId}`
**Used In**: `profile_info.dart`

**Response Structure**:
```json
{
  "success": true,
  "stats": {
    "xp": 0,
    "streak": 0,
    "sessions": 0,
    "hours": 0.0,
    "tutors": 0,
    "streakData": []
  }
}
```

**Fields Displayed**:
- Sessions: `sessions`
- Tutors: `tutors`
- Learning Hours: `hours`
- Streak: `streak`

**Fallback**: Returns default stats (all zeros) if API fails

---

### ✅ API Integration #3: Profile Update
**Service**: `LearnerProfileService.updateProfile()`
**Endpoint**: `PATCH /api/learner/profile`
**Used In**: `profile_edit_screen.dart`

**Request Body**:
```json
{
  "learnerId": "string",
  "firstName": "string",
  "lastName": "string",
  "bio": "string",
  "phone": "string",
  "dob": "string",
  "gender": "string",
  "grade": "string",
  "board": "string",
  "subjects": ["string"],
  "goals": ["string"]
}
```

**Workflow**:
1. User clicks "Edit" button in ProfileInfo
2. Opens `LearnerProfileEditScreen`
3. Loads current profile data from API
4. User edits fields
5. Saves via PATCH request
6. Returns to profile screen and reloads data

---

### ✅ API Integration #4: Photo Upload
**Service**: `TutorProfileService.uploadFile()` + `TutorProfileService.updateProfile()`
**Used In**: `user_profile_store.dart`

**Workflow for Avatar**:
1. User taps camera icon on avatar
2. Opens image picker
3. Saves file locally to `ProfileStore`
4. Uploads to S3 via `uploadFile(file, 'profile-photos')`
5. Updates DB via `updateProfile(userId, {'profilePhoto': url})`

**Workflow for Cover**:
1. User taps "Edit cover" button
2. Opens image picker
3. Saves file locally to `ProfileStore`
4. Uploads to S3 via `uploadFile(file, 'covers')`
5. Updates DB via `updateProfile(userId, {'coverPhoto': url})`

---

## 3. Static Data Components

### ❌ About Tab - STATIC
**File**: `about_tab.dart`
**Data Source**: Hardcoded in widget

**Static Content**:
```dart
Bio: "Passionate about mathematics and physics. Preparing for JEE 2026..."
Subjects: ['Mathematics', 'Physics', 'Chemistry', 'English']
Goals: [
  'Crack JEE Advanced 2026',
  'Score 95%+ in boards',
  'Study 6 hours daily'
]
```

**Should Use**: Profile API data (bio, subjects, goals)

---

### ❌ Achievements Tab - STATIC
**File**: `achievements_tab.dart`
**Data Source**: Hardcoded badges array

**Static Content**:
```dart
Badges: [
  '7-Day Streak',
  'First Session',
  'Top Learner',
  'Quick Starter',
  'Verified Learner',
  'Tutor's Pick'
]
```

**Should Use**: API endpoint for achievements/badges

---

### ❌ My Tutors Tab - STATIC
**File**: `my_tutors_tab.dart`
**Data Source**: `assets/mock_tutors.json`

**Uses**: `MyTutors` widget which loads from JSON file

**Should Use**: API endpoint for learner's enrolled tutors

---

### ❌ Settings Tab - LOCAL STORAGE
**File**: `settings_tab.dart`
**Data Source**: SharedPreferences + ProfileStore

**Local Data**:
- Email: Hardcoded `'ravi.kumar@example.com'`
- Phone: ProfileStore (local)
- Notifications: Local state
- Sub-profiles: SharedPreferences

**Should Use**: Profile API data for email/phone

---

## 4. Local Storage (ProfileStore)

### Purpose
Manages local file storage for avatar and cover photos before API upload

### Storage Keys
```dart
'profile_avatar_path'          // Local file path
'profile_cover_path'           // Local file path
'profile_sub_profiles'         // JSON array
'profile_guardian_warning_shown' // Boolean
'profile_name'                 // String
'profile_handle'               // String
'profile_bio'                  // String
'profile_phone'                // String
```

### Default Values (Fallback)
```dart
name: 'Ravi Kumar'
handle: '@ravi.learns'
bio: 'Class 11 · PCM · JEE 2026'
phone: '9999999999'
```

---

## 5. Profile Edit Screen

### Fields Available for Editing
1. **First Name** - TextFormField (required)
2. **Last Name** - TextFormField (required)
3. **Bio** - TextFormField (multiline, optional)
4. **Phone** - TextFormField (phone keyboard, optional)
5. **Date of Birth** - DatePicker (read-only field)
6. **Gender** - Dropdown (Male, Female, Other)
7. **Grade** - Dropdown (6th-12th)
8. **Board** - Dropdown (CBSE, ICSE, State Board, IB, IGCSE)
9. **Subjects** - FilterChips (Mathematics, Physics, Chemistry, Biology, English, Hindi, Social Science)

### Validation
- First Name: Required
- Last Name: Required
- All other fields: Optional

### Save Flow
1. Validate form
2. Get userId from SharedPreferences
3. Call `LearnerProfileService.updateProfile()`
4. Show success/error message
5. Navigate back with result=true
6. Parent screen reloads data

---

## 6. Data Integration Summary

### API Integrated (25%)
| Component | Data Source | Status |
|-----------|-------------|--------|
| Profile Info (name, email, bio, joined) | GET /api/learner/profile | ✅ API |
| Stats (sessions, tutors, hours, streak) | GET /api/learner/stats | ✅ API |
| Profile Edit | PATCH /api/learner/profile | ✅ API |
| Photo Upload | S3 + DB Update | ✅ API |

### Static Data (75%)
| Component | Data Source | Status |
|-----------|-------------|--------|
| About Tab - Bio | Hardcoded | ❌ Static |
| About Tab - Subjects | Hardcoded | ❌ Static |
| About Tab - Goals | Hardcoded | ❌ Static |
| Achievements Tab | Hardcoded | ❌ Static |
| My Tutors Tab | mock_tutors.json | ❌ Static |
| Settings - Email | Hardcoded | ❌ Static |
| Settings - Phone | Local Storage | ❌ Static |
| Settings - Notifications | Local State | ❌ Static |
| Settings - Sub-profiles | SharedPreferences | ❌ Static |

---

## 7. Key Workflows

### Workflow 1: View Profile
```
1. User navigates to Profile tab
2. ProfileScreen loads
3. ProfileHeader displays cover + avatar from ProfileStore (local files)
4. ProfileInfo fetches:
   - Profile data from GET /api/learner/profile
   - Stats data from GET /api/learner/stats
5. Display name, email, bio, joined date, stats
6. TabBar shows 4 tabs with static/local data
```

### Workflow 2: Edit Profile
```
1. User clicks "Edit" button in ProfileInfo
2. Opens LearnerProfileEditScreen
3. Loads current profile from GET /api/learner/profile
4. Populates form fields
5. User edits fields
6. User clicks "Save"
7. Validates form
8. Sends PATCH /api/learner/profile
9. Shows success message
10. Returns to profile screen
11. Profile screen reloads data
```

### Workflow 3: Change Avatar
```
1. User taps camera icon on avatar
2. Opens image picker
3. User selects photo
4. Photo saved to ProfileStore (local file)
5. UI updates immediately with local file
6. Background: Upload to S3
7. Background: Update DB with S3 URL
8. Console logs upload result
```

### Workflow 4: Change Cover
```
1. User taps "Edit cover" button
2. Opens image picker
3. User selects photo
4. Photo saved to ProfileStore (local file)
5. UI updates immediately with local file
6. Background: Upload to S3
7. Background: Update DB with S3 URL
8. Console logs upload result
```

---

## 8. Missing API Endpoints

### Should Be Created
1. **GET /api/learner/achievements** - For achievements/badges tab
2. **GET /api/learner/tutors** - For my tutors tab (enrolled tutors)
3. **GET /api/learner/settings** - For settings data (email, phone, preferences)
4. **PATCH /api/learner/settings** - For updating settings

---

## 9. Authentication & User ID

### User ID Source
```dart
final prefs = await SharedPreferences.getInstance();
final learnerId = prefs.getString('userId');
```

### Storage Location
- Key: `'userId'`
- Stored in: SharedPreferences
- Set during: Login flow

---

## 10. Error Handling

### Profile Service
- Returns `null` if API fails
- UI shows default/fallback data
- No error messages to user

### Stats Service
- Returns default stats (all zeros) if API fails
- No error messages to user

### Profile Update
- Shows error SnackBar if API fails
- Shows success SnackBar if successful

### Photo Upload
- Logs to console only
- No user-facing error messages
- Local file still shows in UI

---

## 11. UI Components Breakdown

### ProfileHeader
- **Height**: 170px cover + top padding
- **Avatar**: 92px diameter (46px radius × 2)
- **Overlap**: 32px between cover and content
- **Features**:
  - Back button (top-left)
  - Edit cover button (bottom-right)
  - Camera icon on avatar (bottom-right of avatar)
  - Gradient overlay on cover
  - Blob decorations if no cover image

### ProfileInfo
- **Stats Row**: 4 equal-width cards
  - Sessions count
  - Tutors count
  - Learning hours
  - Streak count
- **Buttons**: Edit (filled) + Share (outlined)
- **Verified Badge**: Blue checkmark next to name
- **Meta Info**: Calendar icon + joined date

### About Tab
- **Sections**:
  - Bio (paragraph text)
  - Subjects (chip list)
  - Goals (icon + text list)

### Achievements Tab
- **Layout**: 2-column grid
- **Badge Card**:
  - Icon (32px)
  - Title (bold)
  - Subtitle (small)
  - Unlocked: Primary color + border
  - Locked: Gray + no border

### My Tutors Tab
- **Uses**: MyTutors widget
- **Shows**: Full tutor list (showAll: true)

### Settings Tab
- **Sections**:
  - Account (email, phone)
  - Sub-profiles (list + add button)
  - Notifications (push, email toggles)
  - More (change password, help, privacy)

---

## 12. Key Insights

### ✅ What's Working
1. Profile data (name, email, bio) fetched from API
2. Stats (sessions, tutors, hours, streak) fetched from API
3. Profile editing with API integration
4. Photo upload with S3 + DB update
5. Graceful fallback for API failures

### ❌ What's Static
1. About tab content (bio, subjects, goals) - should use API data
2. Achievements tab - completely hardcoded
3. My Tutors tab - uses JSON file instead of API
4. Settings tab - email/phone hardcoded or local storage

### 🔄 Data Flow Pattern
1. **Load**: Fetch from API on screen mount
2. **Display**: Show API data or fallback
3. **Edit**: Open edit screen with current data
4. **Save**: PATCH to API
5. **Reload**: Refresh data after save

### 📱 Local Storage Pattern
1. **Photos**: Store locally first for instant UI update
2. **Upload**: Background upload to S3
3. **Update**: Background DB update with URL
4. **No Blocking**: User can continue using app

---

## 13. Comparison with Web App

### Web App Current State
- Profile page fetches from GET /api/learner/profile
- Stats fetched from GET /api/learner/stats
- Displays: name, avatar, cover, bio, grade, board, subjects, goals, XP, streak, sessions, hours, tutors
- No profile edit functionality yet
- No photo upload functionality yet

### Mobile App Current State
- Profile page fetches from GET /api/learner/profile
- Stats fetched from GET /api/learner/stats
- Displays: name, email, bio, joined date, sessions, tutors, hours, streak
- Has profile edit screen with full form
- Has photo upload for avatar and cover
- About/Achievements/My Tutors tabs use static data

### Parity Status
- ✅ Profile data fetching: Both use same API
- ✅ Stats fetching: Both use same API
- ❌ Profile editing: Mobile has, web doesn't
- ❌ Photo upload: Mobile has, web doesn't
- ❌ About tab: Mobile static, web uses API data (ahead)
- ❌ Achievements: Mobile static, web doesn't have
- ❌ My Tutors: Mobile static, web doesn't have
- ❌ Settings: Mobile has, web doesn't have

---

## 14. Next Steps for Web App

### Priority 1: Match Mobile API Integration
1. ✅ Already done: Profile data fetching
2. ✅ Already done: Stats fetching
3. ❌ TODO: Profile edit functionality
4. ❌ TODO: Photo upload functionality

### Priority 2: Add Missing Features
1. ❌ TODO: About section (use API data like web already does)
2. ❌ TODO: Achievements section (needs new API)
3. ❌ TODO: My Tutors section (needs new API)
4. ❌ TODO: Settings section (needs new API)

### Priority 3: Fix Mobile Static Data
1. Update About tab to use API data (bio, subjects, goals)
2. Create achievements API and integrate
3. Create my tutors API and integrate
4. Create settings API and integrate

---

## Summary

**Mobile App Profile Integration**: 25% API, 75% Static
- ✅ Profile info (name, email, bio, joined)
- ✅ Stats (sessions, tutors, hours, streak)
- ✅ Profile editing
- ✅ Photo upload
- ❌ About tab content
- ❌ Achievements
- ❌ My Tutors
- ❌ Settings data

**Web App Profile Integration**: Ahead in some areas, behind in others
- ✅ Profile info
- ✅ Stats
- ✅ About section uses API data (mobile doesn't)
- ❌ Profile editing (mobile has)
- ❌ Photo upload (mobile has)
- ❌ Achievements (neither has API)
- ❌ My Tutors (neither has API)
- ❌ Settings (mobile has local, neither has API)
