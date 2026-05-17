# Teacher Dark Mode Fix - Color Mapping

## Problem
Teacher theme uses hardcoded hex colors that don't adapt to dark mode.

## Solution
Replace all hardcoded colors with CSS variables that have both light and dark mode values.

## Color Mapping

### Replace these hardcoded colors:

| Hardcoded Color | CSS Variable | Usage |
|----------------|--------------|-------|
| `#FEFCFA` | `var(--teacher-bg)` | Main background |
| `#FFE2CE` | `var(--teacher-primary-container)` | Buttons, active states, chips |
| `#D86C23` | `var(--teacher-orange)` | Accent color, borders, icons |
| `#1A1A1A` | `var(--teacher-on-primary-container)` | Text on peach backgrounds |
| `#FFFFFF` | `var(--on-primary)` | Text on orange backgrounds |

### CSS Variables Defined

**Light Mode:**
- `--teacher-bg`: #FEFCFA (warm off-white)
- `--teacher-surface`: #FEFCFA
- `--teacher-primary-container`: #FFE2CE (light peach)
- `--teacher-on-primary-container`: #1A1A1A (dark text)
- `--teacher-orange`: #D86C23 (orange)
- `--teacher-orange-light`: #FFE2CE
- `--teacher-selected-bg`: #FFE2CE

**Dark Mode:**
- `--teacher-bg`: #1A1512 (dark brown)
- `--teacher-surface`: #1A1512
- `--teacher-primary-container`: #5A2800 (dark orange)
- `--teacher-on-primary-container`: #FFDCC2 (light peach text)
- `--teacher-orange`: #FFB77C (light orange)
- `--teacher-orange-light`: #5A2800
- `--teacher-selected-bg`: #5A2800

## Files to Update

All teacher components need color replacements:

### Feed Components
- FeedPage.tsx
- BlogCard.tsx
- StoriesRow.tsx
- RightSidebar.tsx
- ShortsTab.tsx

### Chat Components
- ChatPage.tsx
- ChatHeader.tsx
- ChatInput.tsx
- MessageList.tsx
- ConvoItem.tsx

### Schedule Components
- calendar-app.tsx
- event-modal.tsx
- calendar-event.tsx

### History Components
- SessionHistoryPage.tsx
- SessionList.tsx
- ChatTab.tsx
- AINotesTab.tsx
- TranscriptTab.tsx
- InteractiveTabs.tsx (Quiz, Polls, Flashcards)

### Other Components
- Any component using isTeacher conditional styling

## Implementation Pattern

### Before (Hardcoded):
```typescript
style={{ background: isTeacher ? '#FFE2CE' : 'var(--primary-container)' }}
```

### After (CSS Variables):
```typescript
style={{ background: isTeacher ? 'var(--teacher-primary-container)' : 'var(--primary-container)' }}
```

## Complete Replacement Rules

1. **Background colors:**
   - `#FEFCFA` → `var(--teacher-bg)`
   - `#FFE2CE` → `var(--teacher-primary-container)`

2. **Accent/Border colors:**
   - `#D86C23` → `var(--teacher-orange)`

3. **Text colors:**
   - `#1A1A1A` (on peach) → `var(--teacher-on-primary-container)`
   - `#FFFFFF` (on orange) → `var(--on-primary)`

4. **Keep these as-is:**
   - `var(--surface-dim)` - student background
   - `var(--primary)` - student accent
   - `var(--on-surface)` - general text
   - `var(--error)` - error states
