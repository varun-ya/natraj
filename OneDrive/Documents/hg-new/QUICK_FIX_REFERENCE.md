# Quick Fix Reference - Teacher Dark Mode

## Find and Replace Patterns

### Pattern 1: Background #FEFCFA
**Find:** `isTeacher ? "#FEFCFA"`
**Replace:** `isTeacher ? "var(--teacher-bg)"`

**Find:** `isTeacher ? '#FEFCFA'`
**Replace:** `isTeacher ? 'var(--teacher-bg)'`

### Pattern 2: Background #FFE2CE  
**Find:** `isTeacher ? "#FFE2CE"`
**Replace:** `isTeacher ? "var(--teacher-primary-container)"`

**Find:** `isTeacher ? '#FFE2CE'`
**Replace:** `isTeacher ? 'var(--teacher-primary-container)'`

**Find:** `"#FFE2CE"` (standalone)
**Replace:** `"var(--teacher-primary-container)"`

**Find:** `'#FFE2CE'` (standalone)
**Replace:** `'var(--teacher-primary-container)'`

### Pattern 3: Color #D86C23
**Find:** `isTeacher ? "#D86C23"`
**Replace:** `isTeacher ? "var(--teacher-orange)"`

**Find:** `isTeacher ? '#D86C23'`
**Replace:** `isTeacher ? 'var(--teacher-orange)'`

**Find:** `"#D86C23"` (standalone)
**Replace:** `"var(--teacher-orange)"`

**Find:** `'#D86C23'` (standalone)
**Replace:** `'var(--teacher-orange)'`

### Pattern 4: Text Color #1A1A1A
**Find:** `isTeacher ? "#1A1A1A"`
**Replace:** `isTeacher ? "var(--teacher-on-primary-container)"`

**Find:** `isTeacher ? '#1A1A1A'`
**Replace:** `isTeacher ? 'var(--teacher-on-primary-container)'`

**Find:** `"#1A1A1A"` (standalone in teacher context)
**Replace:** `"var(--teacher-on-primary-container)"`

### Pattern 5: White text on orange
**Find:** `isTeacher ? "#FFFFFF"`
**Replace:** `isTeacher ? "var(--on-primary)"`

**Find:** `isTeacher ? '#FFFFFF'`
**Replace:** `isTeacher ? 'var(--on-primary)'`

## VS Code Find/Replace

Use VS Code's Find in Files (Ctrl+Shift+F) with regex enabled:

1. Search in: `src/components`
2. Files to include: `*.tsx`
3. Use regex: ☑

### Regex Patterns:

1. `isTeacher \? ["']#FEFCFA["']` → `isTeacher ? "var(--teacher-bg)"`
2. `isTeacher \? ["']#FFE2CE["']` → `isTeacher ? "var(--teacher-primary-container)"`
3. `isTeacher \? ["']#D86C23["']` → `isTeacher ? "var(--teacher-orange)"`
4. `isTeacher \? ["']#1A1A1A["']` → `isTeacher ? "var(--teacher-on-primary-container)"`
5. `["']#FEFCFA["']` → `"var(--teacher-bg)"`
6. `["']#FFE2CE["']` → `"var(--teacher-primary-container)"`
7. `["']#D86C23["']` → `"var(--teacher-orange)"`
8. `["']#1A1A1A["']` → `"var(--teacher-on-primary-container)"`

## Manual Check List

After replacements, verify these files:
- [ ] FeedPage.tsx
- [ ] BlogCard.tsx
- [ ] ChatPage.tsx
- [ ] MessageList.tsx
- [ ] calendar-app.tsx
- [ ] event-modal.tsx
- [ ] SessionHistoryPage.tsx
- [ ] SessionList.tsx
- [ ] ChatTab.tsx (history)
- [ ] AINotesTab.tsx
- [ ] TranscriptTab.tsx
- [ ] InteractiveTabs.tsx
