# Landing Page Critical Issues

## 🔴 Critical (Must Fix)

### 1. **Next.js App Router Incompatibility**
- **Issue**: Using `next/head` which doesn't work in App Router
- **Location**: `frontend/app/landing/page.js:5, 465-469`
- **Fix**: Replace with `metadata` export or use `next/font` for fonts
- **Impact**: Fonts won't load, SEO broken

### 2. **Global State in React Strict Mode**
- **Issue**: `logoInstanceCount` global variable breaks with React Strict Mode
- **Location**: `frontend/app/landing/page.js:9, 23, 30, 32, 205`
- **Fix**: Use React state or refs instead of global variable
- **Impact**: 3D logo won't initialize, memory leaks

### 3. **localStorage SSR Safety**
- **Issue**: `localStorage` accessed without `typeof window` check
- **Location**: `frontend/app/landing/page.js:319-320, 329`
- **Fix**: Wrap in `typeof window !== 'undefined'` checks
- **Impact**: Hydration errors, crashes in private browsing

### 4. **Missing Error Boundaries**
- **Issue**: No error boundary for 3D logo component
- **Location**: `Logo3D` component
- **Fix**: Add error boundary or try-catch with fallback UI
- **Impact**: White screen if Three.js fails

## 🟡 High Priority

### 5. **Missing SEO Metadata**
- **Issue**: No metadata export for App Router
- **Fix**: Add `metadata` export with title, description, OG tags
- **Impact**: Poor SEO, bad social sharing previews

### 6. **Accessibility Issues**
- **Issue**: Missing ARIA labels, no focus trap in modal
- **Fix**: Add ARIA labels, implement focus trap
- **Impact**: Poor accessibility, WCAG violations

### 7. **Performance Issues**
- **Issue**: 15+ fonts loaded synchronously, no code splitting
- **Fix**: Use `next/font`, lazy load Three.js, code split
- **Impact**: Slow page load, poor Core Web Vitals

## 🟢 Medium Priority

### 8. **Unused Imports**
- **Issue**: Many unused icon imports
- **Fix**: Remove unused imports
- **Impact**: Larger bundle size

### 9. **Input Validation**
- **Issue**: Only HTML5 validation, no sanitization
- **Fix**: Add client-side sanitization
- **Impact**: Potential XSS if backend doesn't sanitize

### 10. **Browser Compatibility**
- **Issue**: No fallback for browsers without WebGL
- **Fix**: Add feature detection and fallback UI
- **Impact**: Broken experience on older browsers

### 11. **Error Handling**
- **Issue**: Errors only logged to console
- **Fix**: Add user-friendly error messages
- **Impact**: Poor UX on failures

### 12. **Unnecessary Suspense**
- **Issue**: Suspense used without async components
- **Fix**: Remove or add proper async boundaries
- **Impact**: Unnecessary overhead

