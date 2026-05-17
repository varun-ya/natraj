# Quick Reference: Modal Context Usage

## 🚀 Quick Start

### Import the Hook
```typescript
import { useModal } from "@/context/ModalContext";
```

### Use in Your Modal
```typescript
function MyModal({ onClose }) {
  const { openModal, closeModal } = useModal();
  
  useEffect(() => {
    openModal();
    return () => closeModal();
  }, []);
  
  // Your modal JSX
}
```

## 📋 Complete Examples

### Example 1: Simple Modal with ModalWrapper
```typescript
import ModalWrapper from "@/components/modal/ModalWrapper";

export default function SimpleModal({ isOpen, onClose }) {
  return (
    <ModalWrapper 
      isOpen={isOpen} 
      onClose={onClose}
      position="bottom"
    >
      <div className="p-5">
        <h2>My Modal</h2>
        <p>Content here</p>
      </div>
    </ModalWrapper>
  );
}
```

### Example 2: Custom Modal with createPortal
```typescript
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useModal } from "@/context/ModalContext";

export default function CustomModal({ onClose }) {
  const [mounted, setMounted] = useState(false);
  const { openModal, closeModal } = useModal();
  
  useEffect(() => {
    setMounted(true);
    document.body.style.overflow = "hidden";
    openModal();
    
    return () => {
      document.body.style.overflow = "";
      closeModal();
    };
  }, []);
  
  if (!mounted) return null;
  
  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50">
      <div className="bg-surface rounded-[28px] p-6 max-w-md">
        <h2>Custom Modal</h2>
        <button onClick={onClose}>Close</button>
      </div>
    </div>,
    document.body
  );
}
```

### Example 3: Bottom Sheet Modal
```typescript
import { useEffect } from "react";
import { useModal } from "@/context/ModalContext";

export default function BottomSheet({ onClose }) {
  const { openModal, closeModal } = useModal();
  
  useEffect(() => {
    openModal();
    document.body.style.overflow = "hidden";
    return () => {
      closeModal();
      document.body.style.overflow = "";
    };
  }, []);
  
  return (
    <div 
      className="fixed inset-0 z-[80] flex flex-col justify-end sm:justify-center sm:items-center"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div 
        className="relative w-full sm:max-w-[520px] sm:mx-4 sm:rounded-[28px] rounded-t-[28px] bg-surface"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 20px) + 8px)" }}
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-12 h-1.5 rounded-full opacity-20 bg-on-surface" />
        </div>
        
        {/* Content */}
        <div className="px-5 py-4">
          <h2>Bottom Sheet</h2>
          <p>Your content here</p>
        </div>
      </div>
    </div>
  );
}
```

## 🎯 Common Patterns

### Pattern 1: Modal with Loading State
```typescript
const { openModal, closeModal } = useModal();
const [loading, setLoading] = useState(true);

useEffect(() => {
  openModal();
  loadData().finally(() => setLoading(false));
  return () => closeModal();
}, []);
```

### Pattern 2: Nested Modals
```typescript
// Parent Modal
function ParentModal() {
  const [showChild, setShowChild] = useState(false);
  const { openModal, closeModal } = useModal();
  
  useEffect(() => {
    openModal();
    return () => closeModal();
  }, []);
  
  return (
    <>
      <div>Parent Modal Content</div>
      <button onClick={() => setShowChild(true)}>Open Child</button>
      {showChild && <ChildModal onClose={() => setShowChild(false)} />}
    </>
  );
}

// Child Modal - automatically increments modal count
function ChildModal({ onClose }) {
  const { openModal, closeModal } = useModal();
  
  useEffect(() => {
    openModal(); // Count becomes 2
    return () => closeModal(); // Count becomes 1
  }, []);
  
  return <div>Child Modal Content</div>;
}
```

### Pattern 3: Success/Confirmation Modal
```typescript
const { openModal, closeModal } = useModal();
const [state, setState] = useState<"form" | "success">("form");

useEffect(() => {
  openModal();
  return () => closeModal();
}, []);

const handleSubmit = async () => {
  await submitData();
  setState("success");
  setTimeout(() => {
    closeModal();
    onClose();
  }, 2000);
};
```

## ⚠️ Common Mistakes

### ❌ Don't: Forget to cleanup
```typescript
// BAD - modal count never decrements
useEffect(() => {
  openModal();
  // Missing return cleanup!
}, []);
```

### ✅ Do: Always cleanup
```typescript
// GOOD
useEffect(() => {
  openModal();
  return () => closeModal();
}, []);
```

### ❌ Don't: Call multiple times
```typescript
// BAD - increments count multiple times
useEffect(() => {
  openModal();
  openModal(); // Don't do this!
  return () => closeModal();
}, []);
```

### ✅ Do: Call once per modal
```typescript
// GOOD
useEffect(() => {
  openModal(); // Once per modal
  return () => closeModal();
}, []);
```

## 🔧 Troubleshooting

### Bottom nav not hiding?
1. Check if ModalProvider is in layout
2. Verify openModal() is called
3. Check if cleanup (closeModal) is working
4. Inspect modal count in React DevTools

### Body scroll not locking?
```typescript
// Add this to your modal
useEffect(() => {
  document.body.style.overflow = "hidden";
  return () => {
    document.body.style.overflow = "";
  };
}, []);
```

### Modal not appearing above nav?
```typescript
// Ensure z-index is higher than 70
<div className="fixed inset-0 z-[80]">
  {/* Modal content */}
</div>
```

## 📱 Mobile-Specific Tips

### Safe Area Insets
```typescript
// For bottom sheets on iOS
style={{ 
  paddingBottom: "calc(env(safe-area-inset-bottom, 20px) + 8px)" 
}}
```

### Drag Handle
```typescript
// Add visual drag handle for mobile sheets
<div className="flex justify-center pt-3 pb-1 sm:hidden">
  <div className="w-12 h-1.5 rounded-full opacity-20 bg-on-surface" />
</div>
```

### Backdrop Blur
```typescript
// Better mobile UX with backdrop blur
<div 
  className="fixed inset-0 bg-black/50"
  style={{ backdropFilter: "blur(4px)" }}
/>
```

## 🎨 Styling Tips

### Responsive Modal
```typescript
<div className="w-full sm:max-w-[520px] sm:mx-4 sm:rounded-[28px] rounded-t-[28px]">
  {/* Mobile: full width, rounded top */}
  {/* Desktop: max width, fully rounded */}
</div>
```

### Smooth Transitions
```typescript
const [isVisible, setIsVisible] = useState(false);

useEffect(() => {
  requestAnimationFrame(() => setIsVisible(true));
}, []);

<div style={{
  transform: isVisible ? "scale(1)" : "scale(0.95)",
  opacity: isVisible ? 1 : 0,
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
}}>
```

## 📚 Related Files

- Context: `src/context/ModalContext.tsx`
- Wrapper: `src/components/modal/ModalWrapper.tsx`
- AppShell: `src/components/AppShell.tsx`
- Layout: `src/app/[role]/dashboard/layout.tsx`

## 🆘 Need Help?

Check the full documentation: `MOBILE_MODAL_UX_FIX.md`
