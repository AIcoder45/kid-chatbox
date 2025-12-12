# UX Micro-Patterns

## Toast Notifications

**Usage**:
- Success: Green toast for successful actions
- Error: Red toast for errors
- Info: Blue toast for informational messages
- Warning: Yellow toast for warnings

**Best Practices**:
- Auto-dismiss after 3-5 seconds
- Manual dismiss option
- Stack multiple toasts
- Don't block UI

**Implementation**: Use Chakra UI `useToast` hook.

## Auto Refresh Patterns

**When to Auto-Refresh**:
- Real-time data (notifications, messages)
- Dashboard metrics
- Live updates

**Implementation**:
- Use `setInterval` or React Query's `refetchInterval`
- Pause when tab is inactive
- Respect user's data usage

**User Control**: Allow users to disable auto-refresh.

## Copy to Clipboard

**Implementation**:
```typescript
const copyToClipboard = async (text: string) => {
  await navigator.clipboard.writeText(text);
  toast({ title: 'Copied to clipboard' });
};
```

**Fallback**: For older browsers, use `document.execCommand('copy')`.

**Feedback**: Always show confirmation toast.

## Modals and Side Panels

**Modals**:
- Use for critical actions (delete, confirm)
- Block background interaction
- Escape key to close
- Focus trap inside modal

**Side Panels**:
- Use for secondary content (filters, details)
- Don't block main content
- Slide in/out animation
- Close on outside click

## Confirmation Dialogs

**When to Use**:
- Destructive actions (delete, logout)
- Irreversible changes
- Data loss risk

**Pattern**:
```typescript
const handleDelete = () => {
  if (confirm('Are you sure?')) {
    // Delete action
  }
};
```

**Better**: Use custom dialog component with clear messaging.

