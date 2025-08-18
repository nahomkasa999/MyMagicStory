# 🎯 Feature-Specific AI Prompts

Use these prompts when building specific types of features to get targeted, focused assistance.

---

## 🔐 Authentication & User Management

### Building Auth System

```
FEATURE: Authentication

Read prompts/main-prompt.md for our auth approach, then help me build:

Current Goal: [Login/Register/OAuth/etc.]
Requirements: [List specific requirements]
Integration: [Specify auth provider if applicable]

Follow our established patterns from .pdmd.md and implement only what's needed.
```

### User Profile/Settings

```
FEATURE: User Profile

I need to build user profile/settings functionality.

Requirements:
- [Profile fields needed]
- [Settings to manage]
- [Privacy controls]

Check .cursor/rules/ for our component patterns and .pdmd.md for auth integration.
```

---

## 🗄️ Database & API Development

### Database Schema

```
FEATURE: Database Schema

I need to design/modify database schema for:

Feature: [Feature name]
Data needed: [List data requirements]
Relationships: [Describe relationships]
Constraints: [Special requirements]

Use our established database patterns from .cursor/rules/ and check .pdmd.md for existing schema.
```

### API Endpoints

```
FEATURE: API Endpoint

I need to create API endpoint(s) for:

Endpoint: [HTTP method and path]
Purpose: [What it does]
Input: [Request format]
Output: [Response format]
Validation: [Validation rules]

Follow our API patterns from .cursor/rules/ and integrate with existing endpoints in .pdmd.md.
```

### CRUD Operations

```
FEATURE: CRUD Operations

I need CRUD functionality for:

Entity: [What you're managing]
Operations needed: [Create/Read/Update/Delete]
Access control: [Who can do what]
Validation: [Business rules]

Use our established database patterns and check .pdmd.md for similar implementations.
```

---

## 🎨 UI Components & Frontend

### New Component

```
FEATURE: UI Component

I need to create a new component:

Component: [Component name]
Purpose: [What it does]
Props: [Expected props]
Styling: [Design requirements]
Interactions: [User interactions]

Follow our component patterns from .cursor/rules/ and use our design system from existing components.
```

### Form Building

```
FEATURE: Form

I need to build a form for:

Purpose: [What the form does]
Fields: [List all fields and types]
Validation: [Validation rules]
Submission: [What happens on submit]
Error handling: [How to handle errors]

Use our form patterns and validation approach from .cursor/rules/.
```

### Layout/Navigation

```
FEATURE: Layout/Navigation

I need to implement:

Type: [Header/Sidebar/Footer/Navigation]
Structure: [How it should be organized]
Responsive: [Mobile/tablet behavior]
States: [Different states like logged in/out]

Follow our layout patterns from existing components and check responsive guidelines.
```

---

## 🔄 State Management & Data Flow

### State Management

```
FEATURE: State Management

I need to manage state for:

Feature: [What feature needs state]
Data: [What data to track]
Actions: [What can modify the state]
Persistence: [Local storage/server sync]

Use our state management approach from .cursor/rules/ and check .pdmd.md for existing patterns.
```

### Real-time Features

```
FEATURE: Real-time

I need real-time functionality for:

Feature: [What needs real-time updates]
Events: [What triggers updates]
Scope: [Who sees updates]
Performance: [Update frequency/optimization]

Check our real-time implementation patterns and server setup.
```

---

## 🔍 Search, Filtering & Data Display

### Search/Filter

```
FEATURE: Search & Filtering

I need search/filter functionality for:

Data: [What to search through]
Search types: [Text/category/date/etc.]
Filters: [Available filter options]
Performance: [Pagination/lazy loading]

Use our search patterns and check .pdmd.md for existing search implementations.
```

### Data Tables/Lists

```
FEATURE: Data Display

I need to display data as:

Format: [Table/list/cards/etc.]
Data source: [Where data comes from]
Actions: [What users can do with items]
Sorting: [Sortable columns]
Pagination: [How to handle large datasets]

Follow our data display patterns from existing components.
```

---

## 💳 E-commerce & Payments

### Payment Integration

```
FEATURE: Payments

I need to integrate payments for:

Provider: [Stripe/PayPal/etc.]
Products: [What's being sold]
Flow: [Checkout process]
Webhooks: [Payment confirmations]

Check our payment integration approach and security requirements.
```

### Shopping Cart

```
FEATURE: Shopping Cart

I need cart functionality with:

Items: [What can be added]
Persistence: [How long cart persists]
Modifications: [Add/remove/update quantities]
Checkout: [Integration with payment]

Use our e-commerce patterns and state management approach.
```

---

## 🔒 Security & Permissions

### Access Control

```
FEATURE: Access Control

I need to implement permissions for:

Roles: [User types/roles]
Resources: [What needs protection]
Rules: [Who can access what]
Enforcement: [Where to check permissions]

Check our auth patterns and security implementation from .cursor/rules/.
```

### Data Validation

```
FEATURE: Data Validation

I need validation for:

Input: [What data to validate]
Rules: [Validation requirements]
Error handling: [How to show errors]
Security: [XSS/injection prevention]

Use our validation patterns and security guidelines.
```

---

## 📧 Notifications & Communication

### Email/Notifications

```
FEATURE: Notifications

I need notification system for:

Types: [Email/push/in-app/etc.]
Triggers: [What causes notifications]
Templates: [Message formats]
Preferences: [User control options]

Check our notification patterns and email service integration.
```

### Messaging/Chat

```
FEATURE: Messaging

I need messaging functionality for:

Type: [Chat/comments/DMs/etc.]
Participants: [Who can message whom]
Features: [File uploads/reactions/etc.]
Real-time: [Live updates needed]

Use our real-time patterns and messaging implementation.
```

---

## 📱 Mobile & Responsive

### Mobile Optimization

```
FEATURE: Mobile Optimization

I need to optimize for mobile:

Component: [What needs mobile treatment]
Gestures: [Touch interactions needed]
Layout: [How layout should adapt]
Performance: [Mobile-specific optimizations]

Follow our responsive design patterns and mobile guidelines.
```

### Progressive Web App

```
FEATURE: PWA Features

I need PWA functionality:

Features: [Offline/push notifications/install]
Caching: [What to cache offline]
Performance: [Loading optimizations]
Integration: [With existing app]

Check our PWA implementation approach and service worker patterns.
```

---

## 🧪 Testing & Quality

### Testing Strategy

```
FEATURE: Testing

I need to test:

Component/Feature: [What to test]
Test types: [Unit/integration/e2e]
Scenarios: [Key user flows]
Edge cases: [Error conditions]

Note: Only implement tests if specifically requested. Focus on testable code structure.
```

---

## 🚀 Performance & Optimization

### Performance Optimization

```
FEATURE: Performance

I need to optimize:

Area: [Load time/runtime/memory/etc.]
Current issue: [What's slow]
Target: [Performance goals]
Constraints: [What can't change]

Check existing performance patterns and optimization techniques in .pdmd.md.
```

---

## 📋 Quick Feature Commands

Copy-paste for common requests:

### Component Creation

```
COMPONENT: Create [ComponentName] component with [specific requirements]
```

### API Integration

```
API: Build endpoint for [specific functionality]
```

### Database Work

```
DATABASE: Add [table/field/relationship] for [feature]
```

### Bug Fix

```
BUG: Fix issue with [specific problem] - check .nbc.md for context
```

### Feature Enhancement

```
ENHANCE: Improve [existing feature] by adding [specific enhancement]
```

---

## 🎯 Using These Prompts Effectively

1. **Be Specific**: Include exact requirements and constraints
2. **Reference Context**: Mention checking .pdmd.md for existing patterns
3. **Set Scope**: Clearly define what should and shouldn't be included
4. **Follow Up**: Use the workflow loop - let AI implement, then test and provide feedback

---

**Remember: Good prompts lead to better AI assistance. Be specific about what you want!** 🎯✨
