# 🔧 Debugging & Troubleshooting Prompts

Use these prompts when you encounter bugs, errors, or unexpected behavior.

---

## 🚨 Error Analysis

### General Error Debugging

```
DEBUGGING: Error Analysis

I'm getting an error. Here's the information:

Error message: [Exact error message]
When it happens: [What action triggers it]
Browser/environment: [Where you see it]
Recent changes: [What was changed recently]

Check .nbc.md for similar issues, then help me debug this systematically.
```

### Console/Terminal Errors

```
DEBUGGING: Console Error

Error details:
- Type: [JavaScript/TypeScript/Build/Runtime error]
- Message: [Full error message]
- Stack trace: [If available]
- File/line: [Where it occurs]
- Steps to reproduce: [How to trigger it]

Check our error handling patterns and help me fix this.
```

### Build/Compilation Errors

```
DEBUGGING: Build Error

Build failing with:
- Command: [npm run build/dev/etc.]
- Error output: [Full error message]
- Files involved: [Which files have issues]
- Dependencies: [Any recent package changes]

Check our build configuration and help resolve this.
```

---

## 🐛 Specific Issue Types

### Component Not Rendering

```
DEBUGGING: Component Issue

Component problem:
- Component: [Component name]
- Expected: [What should happen]
- Actual: [What actually happens]
- Props passed: [Props being passed]
- Console errors: [Any errors shown]

Check the component patterns in .cursor/rules/ and help debug this.
```

### API/Database Issues

```
DEBUGGING: API/Database

Data issue:
- Endpoint: [API endpoint or database operation]
- Request: [What's being sent]
- Expected response: [What should come back]
- Actual response: [What actually comes back]
- Error codes: [HTTP status or database error]

Check our API patterns and database schema for issues.
```

### Authentication Problems

```
DEBUGGING: Auth Issue

Auth problem:
- Action: [Login/logout/access protected route]
- User state: [What auth state shows]
- Tokens: [Token status if relevant]
- Redirects: [Unexpected redirects]
- Permissions: [Access denied issues]

Check our auth implementation and .nbc.md for auth issues.
```

### Styling/Layout Issues

```
DEBUGGING: Styling Issue

UI problem:
- Component: [Which component]
- Expected look: [How it should look]
- Actual look: [How it actually looks]
- Responsive: [Mobile/desktop differences]
- CSS conflicts: [Any style conflicts]

Check our styling patterns and responsive design rules.
```

---

## 🔍 Systematic Debugging

### Step-by-Step Debug

```
DEBUGGING: Systematic Approach

Let's debug this systematically:

1. Issue: [Describe the problem clearly]
2. Context: [When/where it happens]
3. Environment: [Browser/device/OS]
4. Reproduction: [Exact steps to reproduce]
5. Expected: [What should happen]
6. Actual: [What actually happens]

Walk me through debugging this step by step.
```

### Performance Issues

```
DEBUGGING: Performance

Performance problem:
- Slow operation: [What's slow]
- Load times: [How long it takes]
- Network: [API response times]
- Memory: [Memory usage issues]
- Device: [Mobile/desktop differences]

Check .pdmd.md for performance optimizations and help identify bottlenecks.
```

### Data Flow Issues

```
DEBUGGING: Data Flow

Data not flowing correctly:
- Source: [Where data starts]
- Expected path: [How it should flow]
- Breaking point: [Where it stops working]
- State changes: [What should update]
- Side effects: [Other things affected]

Check our state management patterns and trace the data flow.
```

---

## 🛠️ Environment & Setup Issues

### Development Environment

```
DEBUGGING: Dev Environment

Environment issue:
- Problem: [What's not working]
- Setup: [Development setup details]
- Dependencies: [Package versions]
- Configuration: [Config files involved]
- Environment variables: [Missing/incorrect vars]

Help me fix the development environment setup.
```

### Deployment Issues

```
DEBUGGING: Deployment

Deployment problem:
- Platform: [Where deploying]
- Error: [Deployment error message]
- Build logs: [Build output]
- Environment: [Production environment details]
- Differences: [Local vs production differences]

Check our deployment configuration and help resolve this.
```

### Package/Dependency Issues

```
DEBUGGING: Dependencies

Package issue:
- Package: [Which package/dependency]
- Version: [Version numbers]
- Error: [Installation/import error]
- Conflicts: [Version conflicts]
- Usage: [How you're trying to use it]

Check our tech stack requirements and resolve dependency issues.
```

---

## 🔄 State & Logic Issues

### State Management Problems

```
DEBUGGING: State Issue

State not working correctly:
- State: [Which state values]
- Actions: [What should update it]
- Expected: [Expected state changes]
- Actual: [Actual state changes]
- Persistence: [Local storage/server sync issues]

Check our state management patterns and debug the state flow.
```

### Logic/Algorithm Issues

```
DEBUGGING: Logic Issue

Logic problem:
- Function: [Which function/algorithm]
- Input: [What you're passing in]
- Expected output: [What should happen]
- Actual output: [What actually happens]
- Edge cases: [Special cases that fail]

Help me debug this logic systematically.
```

### Async/Timing Issues

```
DEBUGGING: Async Issue

Timing/async problem:
- Operation: [Async operation that's failing]
- Timing: [When it should happen vs when it does]
- Dependencies: [What it depends on]
- Race conditions: [Competing operations]
- Error handling: [How errors are handled]

Check our async patterns and help debug the timing issue.
```

---

## 📱 Browser & Compatibility

### Cross-browser Issues

```
DEBUGGING: Browser Compatibility

Browser issue:
- Working browsers: [Where it works]
- Failing browsers: [Where it doesn't work]
- Features used: [Modern JS/CSS features]
- Polyfills: [What might be missing]
- Console errors: [Browser-specific errors]

Check our browser support requirements and fix compatibility.
```

### Mobile-specific Issues

```
DEBUGGING: Mobile Issue

Mobile problem:
- Device: [Phone/tablet specifics]
- Browser: [Mobile browser]
- Responsiveness: [Layout issues]
- Touch: [Touch interaction problems]
- Performance: [Mobile performance issues]

Check our mobile patterns and responsive design rules.
```

---

## 🔧 Quick Debug Commands

Copy-paste these for common issues:

### Generic Error

```
ERROR: [Brief description] - need help debugging this error
```

### Component Issue

```
COMPONENT: [ComponentName] not working as expected - [brief description]
```

### API Problem

```
API: [Endpoint] returning [unexpected result] instead of [expected result]
```

### Styling Issue

```
STYLE: [Component] looks wrong on [device/browser] - [description]
```

### Performance Issue

```
PERFORMANCE: [Feature] is slow - [description of slowness]
```

### Build Issue

```
BUILD: [Build command] failing with [error type]
```

---

## 🧪 Testing & Validation

### Test Failures

```
DEBUGGING: Test Issues

Test problem:
- Test type: [Unit/integration/e2e]
- Failing test: [Test name/description]
- Error message: [Test error output]
- Expected vs actual: [What the test expects vs gets]
- Environment: [Test environment details]

Help me fix the failing test.
```

### Validation Issues

```
DEBUGGING: Validation

Validation problem:
- Input: [What's being validated]
- Rules: [Validation rules]
- Expected: [Should pass/fail]
- Actual: [Actually passes/fails]
- Error messages: [Validation error output]

Check our validation patterns and fix the validation logic.
```

---

## 🎯 Best Debugging Practices

### Information to Always Include

1. **Exact error messages** (copy-paste, don't paraphrase)
2. **Steps to reproduce** (be specific)
3. **Environment details** (browser, device, OS)
4. **Recent changes** (what was modified recently)
5. **Console output** (full logs, not just summaries)

### Debugging Workflow

1. **Identify** the exact problem
2. **Isolate** the component/function causing it
3. **Check logs** (console, network, server logs)
4. **Reproduce** consistently
5. **Test fixes** incrementally
6. **Document** the solution in .nbc.md

### When to Use Emergency Reset

If debugging becomes overwhelming:

```
NUCLEAR RESET: Too many issues, let's start fresh and rebuild this feature properly.
```

---

## 📝 Logging Issues

Remember to log solved issues in `.nbc.md`:

```
## [DATE] - [ISSUE_TYPE]: [Brief Description]
**Problem:** [What was wrong]
**Solution:** [How it was fixed]
**Prevention:** [How to avoid in future]
```

---

**Remember: Good debugging is systematic. Provide complete information for faster solutions!** 🔍✨
