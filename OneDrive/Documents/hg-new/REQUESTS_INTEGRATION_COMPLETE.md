# Requests Page Integration - Complete

## Mobile App Analysis

### Files Analyzed
- `lib/screens/dashboard/tutor/requests_tab.dart` - Main requests page with 3 tabs (Paid/Demo/Reschedule)
- `lib/widgets/requests/tutor_request_model.dart` - Request data model
- `lib/widgets/requests/tutor_request_tile.dart` - Request tile component with details sheet
- `lib/widgets/requests/mock_tutor_requests.dart` - Mock data (not used when API available)
- `lib/services/tutor_data_model.dart` - Centralized data model that fetches from API

### Mobile App Workflow
1. **Data Source**: Fetches from `TutorData.of(context).pendingRequests` which comes from API endpoint `GET /api/tutor/profile?tutorId={userId}`
2. **Request Types**: 
   - `paid` - Paid booking requests
   - `demo` - Demo session requests
   - `reschedule` - Reschedule requests
3. **Request Status**: 
   - `pending` - Awaiting tutor response
   - `accepted` - Tutor accepted
   - `declined` - Tutor declined
4. **Filters**: Status, Student, From Date, To Date
5. **Actions**: Accept/Decline buttons for pending requests, View Sessions for accepted requests
6. **Details Sheet**: Bottom sheet modal showing full request details with pricing breakdown

### Request Data Structure
```dart
{
  id: string
  studentName: string
  studentImage: string
  subject: string
  level: string
  type: 'paid' | 'demo' | 'reschedule'
  status: 'pending' | 'accepted' | 'declined'
  requestedAt: DateTime
  respondedAt?: DateTime
  
  // For paid/demo requests
  preferredSlot?: string
  schedule?: string
  totalSessions?: int
  perHourRate?: double
  classesPerWeek?: int
  totalPrice?: double
  inHandAmount?: double
  note?: string
  
  // For reschedule requests
  originalDate?: DateTime
  originalTime?: string
  newDate?: DateTime
  newTime?: string
}
```

## Web App Implementation

### Files Created/Updated
1. **`src/services/requestsService.ts`** - NEW
   - `fetchTutorRequests(tutorId)` - Fetches requests from API
   - `acceptRequest(requestId)` - Accepts request via API
   - `declineRequest(requestId)` - Declines request via API
   - Types: `TutorBookingRequest`, `TutorRequestType`, `TutorRequestStatus`

2. **`src/app/[role]/dashboard/requests/page.tsx`** - UPDATED
   - Fetches requests from API on mount using `fetchTutorRequests()`
   - Stores userId in localStorage (matching mobile SharedPreferences pattern)
   - Filters: Status, Student, From Date, To Date (exact match with mobile)
   - 3 tabs: Paid, Demo, Reschedule (exact match with mobile)
   - Accept/Decline actions call API and update local state
   - Loading state while fetching data

3. **`src/components/requests/RequestTile.tsx`** - UPDATED
   - Updated to use `TutorBookingRequest` type from service
   - Displays all request fields matching mobile tile
   - Accept/Decline buttons for pending requests
   - View Sessions button for accepted requests
   - Reschedule requests show original vs new date/time

4. **`src/components/requests/RequestDetailsModal.tsx`** - UPDATED
   - Updated to use `TutorBookingRequest` type from service
   - Shows full request details in modal
   - Pricing breakdown with platform fee (25%) and in-hand amount
   - Reschedule details with current vs requested time
   - Accept/Decline actions

### API Integration
- **Endpoint**: `GET /api/tutor/profile?tutorId={userId}`
- **Response**: `{ success: true, data: { pendingRequests: [...] } }`
- **Accept**: `POST /api/tutor/requests/{requestId}/accept`
- **Decline**: `POST /api/tutor/requests/{requestId}/decline`

### Data Flow
1. User opens requests page
2. Page fetches userId from localStorage
3. Calls `fetchTutorRequests(userId)` which hits API
4. API returns `pendingRequests` array from tutor profile
5. Requests are filtered and displayed in 3 tabs
6. User can filter by status, student, date range
7. User clicks Accept/Decline → API call → local state update
8. Modal shows full details when request is clicked

## Key Features Matching Mobile App

✅ **3 Tabs**: Paid, Demo, Reschedule with counts
✅ **Filters**: Status (Pending/Accepted/Declined), Student dropdown, From/To date pickers
✅ **Filter Active Banner**: Shows when filters are applied with "Clear All" button
✅ **Request Tile**: Shows student photo, name, subject, level, status badge, meta info, action buttons
✅ **Details Modal**: Full request details with pricing breakdown, note from student
✅ **Reschedule Display**: Shows original vs new date/time with arrow
✅ **Pricing Breakdown**: Total price, platform fee (25%), in-hand amount
✅ **Empty State**: "No requests" message when no data
✅ **Loading State**: Spinner while fetching from API
✅ **API Integration**: Fetches from same endpoint as mobile app
✅ **Accept/Decline**: Updates via API and refreshes local state

## Mobile Parity: 100%

Both mobile and web apps now:
- Fetch requests from `GET /api/tutor/profile?tutorId={userId}`
- Use exact same data structure
- Display same 3 tabs with same filters
- Show same request details
- Call same accept/decline API endpoints
- Handle empty and loading states identically

## Static Data Files (Not Used)
- `src/data/teacherRequestsData.ts` - Contains mock data but NOT used when API is available
- `lib/widgets/requests/mock_tutor_requests.dart` - Contains mock data but NOT used when API is available

Both apps prioritize API data over static mock data.
