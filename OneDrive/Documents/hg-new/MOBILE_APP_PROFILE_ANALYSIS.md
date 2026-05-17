# Mobile App Profile Data Flow Analysis

## Overview
Complete analysis of how the mobile app (Flutter) fetches and manages profile data from the backend.

---

## 🏗️ Architecture Components

### 1. **Services Layer**

#### `LearnerProfileService` (`learner_profile_service.dart`)
```dart
static const String baseUrl = 'https://app.homeguruworld.com/api/learner/profile';
```

**Key Methods:**
- `fetchProfile(String learnerId)` - GET request to fetch learner profile
  - Endpoint: `/api/learner/profile?learnerId={id}&_t={timestamp}`
  - Headers: `Content-Type: application/json`, `Cache-Control: no-cache`
  - Returns: `data['profile']` from response
  
- `updateProfile(String learnerId, Map<String, dynamic> updates)` - PATCH request
  - Endpoint: `/api/learner/profile`
  - Body: `{ learnerId, ...updates }`
  - Returns: `boolean` success status

#### `LearnerDataModel` (`learner_data_model.dart`)
```dart
static const _baseUrl = 'https://app.homeguruworld.com/api';
```

**Key Methods:**
- `fetchLearnerStats(String learnerId)` - GET request for stats
  - Endpoint: `/api/learner/stats?learnerId={id}`
  - Headers: `Cache-Control: no-cache`, `Pragma: no-cache`
  - Returns: `result['stats']` containing:
    - `xp`, `streak`, `sessions`, `hours`, `tutors`, `streakData`
  - Fallback: Returns default stats if API fails

#### `TutorProfileService` (`tutor_profile_service.dart`)
```dart
static const String _baseUrl = 'https://app.homeguruworld.com/api/tutor/profile';
static const String _uploadUrl = 'https://app.homeguruworld.com/api/upload';
```

**Key Methods:**
- `getTutorProfile(String tutorId)` - GET request
  - Endpoint: `/api/tutor/profile?tutorId={id}`
  - Returns: `{ success, data }` or `{ success: false, error }`

- `updateProfile(String tutorId, Map<String, dynamic> fields)` - PUT request
  - Endpoint: `/api/tutor/profile`
  - Body: `{ tutorId, ...fields }`
  - Returns: `{ success, isComplete, isActive }`

- `uploadFile(File file, String folder)` - POST multipart request
  - Endpoint: `/api/upload`
  - Fields: `folder` (e.g., 'profile-photos', 'covers')
  - Files: `file` with original filename
  - Returns: S3 URL string or null

---

### 2. **State Management**

#### `UserProfileStore` (`user_profile_store.dart`)

**Local Storage Keys:**
```dart
'profile_avatar_path'
'profile_cover_path'
'profile_sub_profiles'
'profile_guardian_warning_shown'
'profile_name'
'profile_handle'
'profile_bio'
'profile_phone'
```

**State Properties:**
- `File? avatar` - Local avatar image file
- `File? cover` - Local cover image file
- `List<SubProfile> subProfiles` - Sub-profiles list
- `String name, handle, bio, phone` - Profile text fields

**Key Methods:**

1. **`load()`** - Static factory method
   - Loads all profile data from SharedPreferences
   - Validates file paths exist before setting
   - Returns initialized `UserProfileStore` instance

2. **`updateProfile({name, handle, bio, phone})`**
   - Updates in-memory state
   - Calls `notifyListeners()` to update UI
   - Persists to SharedPreferences

3. **`setAvatar(File file)`** - Complete workflow:
   ```dart
   1. Update local state (_avatar = file)
   2. Notify listeners (UI updates)
   3. Save file path to SharedPreferences
   4. Upload to S3 via TutorProfileService.uploadFile()
   5. Get S3 URL
   6. Update DB via TutorProfileService.updateProfile()
   7. Log results
   ```

4. **`setCover(File file)`** - Same workflow as avatar
   - Uploads to 'covers' folder instead of 'profile-photos'
   - Updates `coverPhoto` field in DB

**InheritedWidget Pattern:**
```dart
class ProfileStore extends InheritedNotifier<UserProfileStore>
```
- Provides profile store to entire widget tree
- Access via: `ProfileStore.of(context)`
- Automatically rebuilds widgets when state changes

---

### 3. **UI Layer**

#### `ProfileScreen` (`profile_screen.dart`)

**Structure:**
```
NestedScrollView
├── SliverToBoxAdapter
│   ├── ProfileHeader (cover + avatar)
│   ├── ProfileInfo (name, bio, stats)
├── SliverPersistentHeader (TabBar - pinned)
└── TabBarView
    ├── AboutTab
    ├── AchievementsTab
    ├── MyTutorsTab
    └── SettingsTab
```

**Image Picking:**
```dart
_pickCover() -> ImagePicker -> ProfileStore.setCover()
_pickAvatar() -> ImagePicker -> ProfileStore.setAvatar()
```

#### `ProfileHeader` (`profile_header.dart`)

**Layout:**
- Cover image: 170px height
- Avatar: 46px radius, overlaps cover by 32px
- Edit cover button: Positioned bottom-right on cover
- Camera icon on avatar: Bottom-right corner

**Image Display:**
- Uses `File` from `ProfileStore`
- Fallback: Gradient blobs if no cover image
- Fallback: Person icon if no avatar

#### `ProfileInfo` (`profile_info.dart`)

**Data Loading Flow:**
```dart
initState()
  └─> _loadData()
      ├─> Get userId from SharedPreferences
      ├─> LearnerProfileService.fetchProfile(learnerId)
      │   └─> Returns: firstName, lastName, email, bio, createdAt
      ├─> LearnerDataModel.fetchLearnerStats(learnerId)
      │   └─> Returns: sessions, tutors, hours, streak
      └─> setState() to update UI
```

**Displayed Data:**
- Name: `firstName + lastName`
- Email: From profile
- Bio: From profile or "No bio yet"
- Joined date: Formatted from `createdAt`
- Stats row: sessions, tutors, hours, streak

**Edit Flow:**
```dart
_navigateToEdit()
  └─> Navigator.push(LearnerProfileEditScreen)
      └─> On return (result == true)
          └─> _loadData() // Refresh data
```

---

## 🔄 Complete Data Flow

### **Learner Profile Load Sequence**

```
1. App Launch
   └─> UserProfileStore.load()
       └─> Load from SharedPreferences
           ├─> avatar path
           ├─> cover path
           ├─> name, handle, bio, phone
           └─> Validate files exist

2. Navigate to ProfileScreen
   └─> ProfileHeader renders
       ├─> Shows cover from ProfileStore
       └─> Shows avatar from ProfileStore
   
   └─> ProfileInfo.initState()
       └─> _loadData()
           ├─> Get userId from SharedPreferences
           │
           ├─> API Call 1: LearnerProfileService.fetchProfile()
           │   GET /api/learner/profile?learnerId={id}&_t={timestamp}
           │   Response: { profile: { firstName, lastName, email, ... } }
           │
           ├─> API Call 2: LearnerDataModel.fetchLearnerStats()
           │   GET /api/learner/stats?learnerId={id}
           │   Response: { success: true, stats: { xp, streak, ... } }
           │
           └─> setState() with combined data
               └─> UI updates with fresh data
```

### **Image Upload Sequence**

```
1. User taps avatar/cover
   └─> ImagePicker.pickImage()
       └─> Returns XFile with local path

2. Convert to File and call ProfileStore
   └─> ProfileStore.setAvatar(file) or setCover(file)
       
       ├─> Step 1: Update local state
       │   ├─> _avatar = file
       │   └─> notifyListeners() → UI shows new image immediately
       
       ├─> Step 2: Persist to SharedPreferences
       │   └─> Save file path for next app launch
       
       ├─> Step 3: Upload to S3
       │   └─> TutorProfileService.uploadFile(file, folder)
       │       POST /api/upload (multipart/form-data)
       │       ├─> Field: folder = 'profile-photos' or 'covers'
       │       ├─> File: image file
       │       └─> Response: { success: true, url: 's3://...' }
       
       └─> Step 4: Update Database
           └─> TutorProfileService.updateProfile(tutorId, { profilePhoto: url })
               PUT /api/tutor/profile
               ├─> Body: { tutorId, profilePhoto: url }
               └─> Response: { success: true, data: { isComplete, isActive } }
```

### **Profile Update Sequence**

```
1. User taps "Edit" button
   └─> Navigate to LearnerProfileEditScreen
       
2. User edits fields and saves
   └─> LearnerProfileService.updateProfile(learnerId, updates)
       PATCH /api/learner/profile
       ├─> Body: { learnerId, firstName, lastName, bio, ... }
       └─> Response: { success: true }
   
3. Return to ProfileScreen
   └─> result == true
       └─> _loadData() // Refresh from API
           └─> UI updates with new data
```

---

## 🔑 Key Differences: Mobile vs Web

### **Mobile App (Flutter)**

1. **State Management:**
   - Uses `InheritedNotifier` pattern with `UserProfileStore`
   - Local state persisted in `SharedPreferences`
   - Images stored as local `File` objects

2. **API Calls:**
   - Direct HTTP calls using `http` package
   - Explicit cache-busting with `_t` timestamp
   - Manual error handling with try-catch

3. **Image Handling:**
   - Uses `ImagePicker` for native gallery access
   - Stores local file paths in SharedPreferences
   - Uploads to S3 via `/api/upload` endpoint
   - Updates DB with S3 URL after upload

4. **Data Loading:**
   - Two separate API calls: profile + stats
   - Loads on `initState()` of ProfileInfo widget
   - Refreshes after edit via navigation result

### **Web App (Next.js)**

1. **State Management:**
   - Uses React hooks (`useState`, `useEffect`)
   - Custom hook `useUserProfile` for profile data
   - Images stored as base64 or URLs in localStorage

2. **API Calls:**
   - Fetch API with Next.js API routes
   - Cache control via headers
   - Error handling in hook with detailed logging

3. **Image Handling:**
   - Uses HTML file input
   - Converts to base64 for preview
   - Should upload to S3 (TODO in code)
   - Updates localStorage immediately

4. **Data Loading:**
   - Single API call per resource
   - Loads on component mount via `useEffect`
   - Auto-refreshes when dependencies change

---

## 📊 API Endpoints Used

### **Learner Endpoints**

| Method | Endpoint | Purpose | Response |
|--------|----------|---------|----------|
| GET | `/api/learner/profile?learnerId={id}` | Fetch profile | `{ profile: {...} }` |
| PATCH | `/api/learner/profile` | Update profile | `{ success: true }` |
| GET | `/api/learner/stats?learnerId={id}` | Fetch stats | `{ success: true, stats: {...} }` |

### **Tutor Endpoints**

| Method | Endpoint | Purpose | Response |
|--------|----------|---------|----------|
| GET | `/api/tutor/profile?tutorId={id}` | Fetch profile | `{ success: true, data: {...} }` |
| PUT | `/api/tutor/profile` | Update profile | `{ success: true, data: {...} }` |

### **Upload Endpoint**

| Method | Endpoint | Purpose | Response |
|--------|----------|---------|----------|
| POST | `/api/upload` | Upload to S3 | `{ success: true, url: '...' }` |

**Upload Request Format:**
```
Content-Type: multipart/form-data
Fields:
  - folder: string ('profile-photos' | 'covers')
  - file: File (image file)
```

---

## 🎯 Implementation Recommendations for Web App

Based on mobile app analysis, the web app should:

1. **Use the same API structure:**
   - GET `/api/learner/profile?learnerId={id}` for profile
   - GET `/api/learner/stats?learnerId={id}` for stats
   - PATCH `/api/learner/profile` for updates

2. **Implement proper image upload:**
   ```typescript
   // Current: Stores base64 in localStorage (not ideal)
   // Should: Upload to S3 via /api/upload, then update DB
   
   async function uploadImage(file: File, type: 'profile' | 'cover') {
     const formData = new FormData();
     formData.append('file', file);
     formData.append('folder', type === 'profile' ? 'profile-photos' : 'covers');
     
     const response = await fetch('/api/upload', {
       method: 'POST',
       body: formData,
     });
     
     const { url } = await response.json();
     return url;
   }
   ```

3. **Match mobile app data structure:**
   - Profile response: `{ profile: { firstName, lastName, email, ... } }`
   - Stats response: `{ success: true, stats: { xp, streak, ... } }`

4. **Add cache-busting:**
   - Mobile app adds `_t` timestamp to GET requests
   - Web app should do the same for consistency

5. **Error handling:**
   - Mobile app has fallback default stats
   - Web app should implement similar graceful degradation

---

## 🐛 Current Issues & Fixes

### **Issue: Web app getting 500 error**

**Root Cause Analysis:**
- Mobile app successfully calls same endpoints
- Web app `useUserProfile` hook gets 500 error
- Likely issues:
  1. Missing or invalid `userId` in localStorage
  2. DynamoDB query failing
  3. Data structure mismatch

**Solution Applied:**
1. Added detailed logging to API route
2. Improved error handling in `useUserProfile` hook
3. Added error details to response for debugging

**Next Steps:**
1. Check browser console for detailed error logs
2. Verify `userId` exists in localStorage
3. Check server logs for DynamoDB errors
4. Ensure learner data exists in database

---

## 📝 Summary

The mobile app has a well-structured profile system with:
- Clear separation of concerns (services, state, UI)
- Proper image upload workflow (local → S3 → DB)
- Two-step data loading (profile + stats)
- Graceful error handling with fallbacks
- Efficient state management with InheritedNotifier

The web app should follow the same patterns for consistency and reliability.
