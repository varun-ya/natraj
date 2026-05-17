# Modal Migration Checklist

## ✅ Completed Modals

These modals have been updated to use the modal context:

- [x] **TutorSearchModal** (`src/components/home/TutorSearchModal.tsx`)
- [x] **BookingModal** (`src/components/booking/BookingModal.tsx`)
- [x] **PurchaseModal** (`src/components/store/PurchaseModal.tsx`)
- [x] **TutorActionSheet** (`src/components/booking/TutorActionSheet.tsx`)
- [x] **ModalWrapper** (`src/components/modal/ModalWrapper.tsx`)

## 🔄 Pending Modals

### High Priority (User-facing modals)

#### Profile Modals
- [ ] **EditProfileModal** (`src/components/profile/EditProfileModal.tsx`)
  - Used for: Editing user profile
  - Frequency: High
  - Impact: High

- [ ] **AvailabilityModal** (`src/components/profile/AvailabilityModal.tsx`)
  - Used for: Setting tutor availability
  - Frequency: Medium
  - Impact: Medium

- [ ] **EducationModal** (`src/components/profile/EducationModal.tsx`)
  - Used for: Adding education details
  - Frequency: Low
  - Impact: Low

- [ ] **ExperienceModal** (`src/components/profile/ExperienceModal.tsx`)
  - Used for: Adding work experience
  - Frequency: Low
  - Impact: Low

- [ ] **SubjectRateModal** (`src/components/profile/SubjectRateModal.tsx`)
  - Used for: Setting subject rates
  - Frequency: Medium
  - Impact: Medium

#### Request Modals
- [ ] **RequestDetailsModal** (`src/components/requests/RequestDetailsModal.tsx`)
  - Used for: Viewing request details
  - Frequency: High
  - Impact: High

#### Chat Modals
- [ ] **BookAgainModal** (`src/components/chat/BookAgainModal.tsx`)
  - Used for: Quick rebooking from chat
  - Frequency: Medium
  - Impact: Medium

- [ ] **TutorInfoSheet** (`src/components/chat/TutorInfoSheet.tsx`)
  - Used for: Viewing tutor info in chat
  - Frequency: Medium
  - Impact: Medium

#### Schedule Modals
- [ ] **CancelSheet** (`src/components/schedule/CancelSheet.tsx`)
  - Used for: Canceling sessions
  - Frequency: Medium
  - Impact: High

- [ ] **RescheduleSheet** (`src/components/schedule/RescheduleSheet.tsx`)
  - Used for: Rescheduling sessions
  - Frequency: Medium
  - Impact: High

- [ ] **RescheduleRequestSheet** (`src/components/schedule/RescheduleRequestSheet.tsx`)
  - Used for: Requesting reschedule
  - Frequency: Medium
  - Impact: High

- [ ] **EventModal** (`src/components/schedule/calendar/event-modal.tsx`)
  - Used for: Creating/editing calendar events
  - Frequency: High
  - Impact: High

#### Wallet Modals
- [ ] **EscrowInfoSheet** (`src/components/wallet/EscrowInfoSheet.tsx`)
  - Used for: Explaining escrow
  - Frequency: Low
  - Impact: Low

- [ ] **PaymentPendingSheet** (`src/components/wallet/PaymentPendingSheet.tsx`)
  - Used for: Showing pending payments
  - Frequency: Medium
  - Impact: Medium

- [ ] **ReferEarnSheet** (`src/components/wallet/ReferEarnSheet.tsx`)
  - Used for: Referral program
  - Frequency: Low
  - Impact: Low

### Low Priority (Onboarding/Admin)

- [ ] **SelectModal** (`src/components/onboarding/teacher-onboarding/SelectModal.tsx`)
  - Used for: Teacher onboarding selections
  - Frequency: Very Low (one-time)
  - Impact: Low

## 📝 Migration Steps for Each Modal

For each modal in the pending list:

### Step 1: Add Import
```typescript
import { useModal } from "@/context/ModalContext";
```

### Step 2: Use Hook
```typescript
const { openModal, closeModal } = useModal();
```

### Step 3: Update useEffect
```typescript
useEffect(() => {
  // ... existing code ...
  openModal();
  
  return () => {
    // ... existing cleanup ...
    closeModal();
  };
}, []);
```

### Step 4: Test
- [ ] Open modal on mobile - bottom nav hides
- [ ] Close modal - bottom nav returns
- [ ] Test on desktop - no issues
- [ ] Test body scroll locking

## 🎯 Priority Order

Recommended migration order based on user impact:

1. **RequestDetailsModal** - High frequency, high impact
2. **EditProfileModal** - High frequency, high impact
3. **EventModal** - High frequency, high impact
4. **CancelSheet** - Medium frequency, high impact
5. **RescheduleSheet** - Medium frequency, high impact
6. **RescheduleRequestSheet** - Medium frequency, high impact
7. **BookAgainModal** - Medium frequency, medium impact
8. **TutorInfoSheet** - Medium frequency, medium impact
9. **SubjectRateModal** - Medium frequency, medium impact
10. **AvailabilityModal** - Medium frequency, medium impact
11. **PaymentPendingSheet** - Medium frequency, medium impact
12. **EducationModal** - Low frequency, low impact
13. **ExperienceModal** - Low frequency, low impact
14. **EscrowInfoSheet** - Low frequency, low impact
15. **ReferEarnSheet** - Low frequency, low impact
16. **SelectModal** - Very low frequency, low impact

## 🔍 How to Find Modals

### Search for Modal Patterns
```bash
# Find files with "Modal" in name
find src/components -name "*Modal*"

# Find files with "Sheet" in name
find src/components -name "*Sheet*"

# Search for createPortal usage
grep -r "createPortal" src/components

# Search for body overflow manipulation
grep -r "body.style.overflow" src/components
```

### Check for These Patterns
Look for files that:
- Use `createPortal` from react-dom
- Set `document.body.style.overflow`
- Have `position: fixed` with high z-index
- Render backdrop/overlay elements
- Have "Modal" or "Sheet" in filename

## 📊 Progress Tracking

**Total Modals:** 21
**Completed:** 5 (24%)
**Remaining:** 16 (76%)

### By Category
- Profile: 0/5 (0%)
- Requests: 0/1 (0%)
- Chat: 0/2 (0%)
- Schedule: 0/4 (0%)
- Wallet: 0/3 (0%)
- Onboarding: 0/1 (0%)
- Core: 5/5 (100%) ✅

## 🧪 Testing Checklist

After migrating each modal, verify:

### Mobile Testing
- [ ] Bottom nav hides when modal opens
- [ ] Bottom nav returns when modal closes
- [ ] Body scroll is locked when modal open
- [ ] Body scroll restored when modal closed
- [ ] Modal appears above all other content
- [ ] Backdrop blur works correctly
- [ ] Safe area insets respected (iOS)
- [ ] Drag handle visible (for sheets)

### Desktop Testing
- [ ] Modal works normally
- [ ] No bottom nav visible (sidebar instead)
- [ ] No regressions in functionality
- [ ] Keyboard shortcuts work (ESC to close)

### Edge Cases
- [ ] Opening multiple modals in sequence
- [ ] Rapid open/close
- [ ] Browser back button behavior
- [ ] Deep linking with modal open
- [ ] Modal state persists on route change (if needed)

## 📈 Success Metrics

After completing all migrations:

- ✅ All modals hide bottom nav on mobile
- ✅ Consistent UX across all modals
- ✅ No body scroll issues
- ✅ Proper z-index hierarchy
- ✅ Clean modal context usage
- ✅ No memory leaks (proper cleanup)

## 🚀 Quick Win Strategy

To show immediate impact, migrate in this order:

**Week 1:** High-impact, high-frequency modals
- RequestDetailsModal
- EditProfileModal
- EventModal

**Week 2:** Schedule-related modals
- CancelSheet
- RescheduleSheet
- RescheduleRequestSheet

**Week 3:** Chat and booking modals
- BookAgainModal
- TutorInfoSheet
- SubjectRateModal

**Week 4:** Remaining modals
- All others

## 📝 Notes

- Each modal should take ~5-10 minutes to migrate
- Test immediately after each migration
- Commit after each successful migration
- Update this checklist as you go

## 🆘 Issues?

If you encounter issues:
1. Check `MOBILE_MODAL_UX_FIX.md` for detailed docs
2. See `MODAL_QUICK_GUIDE.md` for examples
3. Look at completed modals for reference
4. Verify ModalProvider is in layout

---

**Last Updated:** 2024
**Status:** In Progress (24% complete)
