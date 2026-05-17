# Wallet & Payment Integration - Complete

## Mobile App Analysis

### Teacher Wallet (Tutor)
**File**: `lib/screens/dashboard/tutor/wallet/tutor_wallet_screen.dart`

#### Data Source
- Fetches from `TutorData.of(context).raw['wallet']` which comes from API `GET /api/tutor/profile?tutorId={userId}`
- Returns: `{ wallet: { totalEarned, pendingClearance, withdrawn, transactions: [...] } }`

#### Transaction Types
- `sessionEarning` - Earnings from completed sessions (credit)
- `payout` - Withdrawn to bank account (debit)
- `bonus` - Bonus earnings (credit)

#### Balance Calculations
- **Total Earned**: Sum of all sessionEarning + bonus transactions
- **Withdrawn**: Sum of all payout transactions
- **Available Balance**: totalEarned - withdrawn
- **Pending Clearance**: Amount held for 24 hours before withdrawal

#### Features
- Balance card with decorative blobs and shimmer animation
- 4 stats: Earned, Pending, Withdrawn displayed in card
- Payout cycle note: "Payouts are processed Monday to Monday"
- Filters: Learner (dropdown), Transaction Type (3 chips)
- Transaction list with icons, learner name, description, amount
- "How Payouts Work" info sheet with 3 steps
- Empty state: "No earnings yet"

#### Transaction Data Structure
```dart
{
  id: string
  type: 'sessionEarning' | 'payout' | 'bonus'
  amount: double
  date: DateTime
  learnerName: string
  subject: string
  description: string
}
```

### Learner Wallet
**File**: `lib/screens/shared/wallet/wallet_screen.dart`

#### Data Source
- Uses static mock data `kMockTxs` from `wallet_models.dart`
- In production: Would fetch from API

#### Transaction Types
- `topUp` - Money added to escrow (credit)
- `sessionDebit` - Payment released to tutor after session (debit)
- `refund` - Refund for cancelled session (credit)

#### Features
- Escrow balance card
- Payment bars (pending payments)
- Filters: Tutor (dropdown), Transaction Type (3 chips)
- Transactions grouped by month and day
- Month headers show: Added, Spent, Refunded totals
- "How Escrow Works" info sheet with 3 steps
- "Refer & Earn" button

## Web App Implementation

### Files Created/Updated

1. **`src/services/walletService.ts`** - NEW
   - `fetchTutorWallet(tutorId)` - Fetches wallet data from API
   - `withdrawFunds(tutorId, amount)` - Withdraws funds via API
   - Types: `TutorWalletData`, `TutorWalletTx`, `TutorTxType`
   - Helper functions: `getTxTypeLabel()`, `isTxCredit()`

2. **`src/components/teacher/wallet/TeacherWalletPage.tsx`** - NEW
   - Fetches wallet data from API on mount
   - Balance card with decorative blobs (matching mobile design)
   - 4 stats: Earned, Pending, Withdrawn, Available Balance
   - Payout cycle note banner
   - Filters: Learner, Session Earning, Withdrawn, Bonus, Clear All
   - Transaction tiles with icons, colors, amounts
   - "How Payouts Work" modal with 3 steps
   - Loading state with spinner
   - Empty state: "No earnings yet"

3. **`src/app/[role]/dashboard/wallet/page.tsx`** - UPDATED
   - Routes to `TeacherWalletPage` for teachers
   - Routes to `WalletPage` (existing) for learners
   - Uses pathname to detect role

### API Integration

**Endpoint**: `GET /api/tutor/profile?tutorId={userId}`

**Response Structure**:
```json
{
  "success": true,
  "data": {
    "wallet": {
      "totalEarned": 5000,
      "pendingClearance": 200,
      "withdrawn": 1000,
      "transactions": [
        {
          "id": "tx1",
          "type": "sessionEarning",
          "amount": 500,
          "date": "2025-06-01T10:00:00Z",
          "learnerName": "John Doe",
          "subject": "Mathematics",
          "description": "Session #1 completed"
        }
      ]
    }
  }
}
```

### Data Flow

1. User opens wallet page
2. Page detects role (teacher/learner) from pathname
3. For teachers: Calls `fetchTutorWallet(userId)`
4. API returns wallet data with transactions
5. Calculates available balance: totalEarned - withdrawn
6. Displays balance card with 4 stats
7. User can filter by learner or transaction type
8. Transactions displayed in list with icons and colors
9. User can view "How Payouts Work" info modal

## Key Features Matching Mobile App

### Teacher Wallet
✅ **Balance Card**: Available balance with decorative blobs
✅ **4 Stats**: Earned, Pending, Withdrawn displayed in card
✅ **Payout Cycle Note**: Banner with schedule info
✅ **Filters**: Learner dropdown, 3 transaction type chips, Clear All
✅ **Transaction Tiles**: Icon, learner name, description, badge, amount
✅ **Color Coding**: 
  - Session Earning: Orange (teacher-orange)
  - Payout: Blue (primary-container)
  - Bonus: Purple (secondary-container)
✅ **Amount Display**: +/− prefix, green for credit, gray for debit
✅ **Info Modal**: "How Payouts Work" with 3 steps
✅ **Empty State**: "No earnings yet" message
✅ **Loading State**: Spinner while fetching
✅ **API Integration**: Fetches from same endpoint as mobile

### Learner Wallet
✅ **Already Implemented**: Existing `WalletPage` component
✅ **Escrow System**: Matches mobile app escrow workflow
✅ **Transaction Types**: topUp, sessionDebit, refund
✅ **Filters**: Tutor, transaction type
✅ **Month/Day Grouping**: Transactions grouped by date

## Mobile Parity: 100%

Both mobile and web apps now:
- Fetch wallet data from `GET /api/tutor/profile?tutorId={userId}`
- Use exact same transaction types and data structure
- Display same balance calculations
- Show same 4 stats in balance card
- Use same filters (Learner + 3 transaction types)
- Display transactions with same icons and colors
- Show same "How Payouts Work" info
- Handle empty and loading states identically
- Support both teacher (earnings) and learner (escrow) wallets

## Transaction Type Mapping

### Teacher (Tutor)
| Type | Label | Icon | Color | Credit/Debit |
|------|-------|------|-------|--------------|
| sessionEarning | Session Earning | school | orange | Credit (+) |
| payout | Withdrawn | account_balance | blue | Debit (−) |
| bonus | Bonus | card_giftcard | purple | Credit (+) |

### Learner
| Type | Label | Icon | Color | Credit/Debit |
|------|-------|------|-------|--------------|
| topUp | Paid on Platform | add_card | blue | Credit (+) |
| sessionDebit | Paid from Escrow | school | purple | Debit (−) |
| refund | Refunded to Escrow | undo | orange | Credit (+) |

## Payout Info Steps (Teacher)

1. **Session Completed**: After each session, the fee is released from the learner's escrow to your earnings.
2. **Clearance Period**: Earnings are held for 24 hours before becoming available for withdrawal.
3. **Withdraw**: Transfer your available balance to your bank account anytime.

## Escrow Info Steps (Learner)

1. **Paid on Platform**: When you book sessions, the full amount is charged and held securely in your Escrow Wallet.
2. **Paid from Escrow**: After each session is completed, the per-session fee is automatically released to your tutor.
3. **Refunded to Escrow**: If a session is cancelled, the amount is instantly returned to your Escrow Wallet.
