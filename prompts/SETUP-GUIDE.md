# 🚀 Template Setup Guide

Follow this step-by-step guide to set up the Ultimate Cursor AI Template for your project.

---

## 📋 Prerequisites

- [ ] **Cursor IDE** installed and set up
- [ ] **Basic understanding** of your chosen tech stack
- [ ] **Project idea** or requirements defined

---

## 🎯 Step 1: Copy & Customize Template

### 1.1 Copy Template Structure

```bash
# Create your new project directory
mkdir my-awesome-project
cd my-awesome-project

# Copy all template files (adjust path as needed)
cp -r /path/to/ultimate-cursor-template/* .
```

### 1.2 Remove Template Examples

```bash
# Remove template examples (keep the templates for reference)
rm -f prompts/TEMPLATE.*
```

### 1.3 Initialize Git (Optional)

```bash
git init
git add .
git commit -m "Initial commit: Added Ultimate Cursor AI Template"
```

---

## ⚙️ Step 2: Customize Core Files

### 2.1 Update Main Prompt (`prompts/main-prompt.md`)

**Find and replace these placeholders:**

| Placeholder                  | Replace With         | Example                        |
| ---------------------------- | -------------------- | ------------------------------ |
| `[YOUR_FRONTEND_TECH]`       | Your frontend choice | `Next.js 15 App Router`        |
| `[YOUR_STYLING]`             | Your styling choice  | `Tailwind CSS with shadcn/ui`  |
| `[YOUR_BACKEND]`             | Your backend choice  | `Supabase`                     |
| `[YOUR_PROJECT_NAME]`        | Your project name    | `TaskMaster Pro`               |
| `[YOUR_PROJECT_DESCRIPTION]` | Project description  | `A modern task management app` |
| `[YOUR_TARGET_USERS]`        | Target users         | `Freelancers and small teams`  |
| `[FEATURE_1]` etc.           | Core features        | `Task creation and management` |

**Tech Stack Sections to Update:**

- Frontend framework and tools
- Backend and database
- Authentication solution
- Deployment platform

### 2.2 Create Product Requirements (`PRD.md`)

Copy from template:

```bash
cp prompts/TEMPLATE.PRD.md PRD.md
```

**Customize these sections:**

- Project name and description
- Core value propositions
- Pages and routes structure
- Feature requirements
- Technical requirements

### 2.3 Initialize Tracking Files

```bash
# Create initial tracking files
cp prompts/TEMPLATE.pdmd.md .pdmd.md
cp prompts/TEMPLATE.nbc.md .nbc.md

# Update project names in the files
sed -i 's/\[YOUR_PROJECT_NAME\]/Your Actual Project Name/g' .pdmd.md
sed -i 's/\[YOUR_PROJECT_NAME\]/Your Actual Project Name/g' .nbc.md
```

---

## 🎛️ Step 3: Configure Cursor Rules

### 3.1 Verify Cursor Rules Directory

```bash
# Ensure .cursor/rules directory exists and has files
ls -la .cursor/rules/

# Should show multiple .mdc files
```

### 3.2 Customize Rules (Optional)

**For non-Next.js projects:**

- Edit `.cursor/rules/104-nextjs-backend.mdc`
- Edit `.cursor/rules/105-nextjs-routes.mdc`
- Edit `.cursor/rules/107-server-components.mdc`

**For different styling approaches:**

- Edit `.cursor/rules/108-shadcn-ui.mdc`
- Edit `.cursor/rules/110-styles.mdc`
- Edit `.cursor/rules/111-tailwind-styles.mdc`

### 3.3 Add Custom Rules

Create project-specific rules:

```bash
# Add your own rules
echo "Your custom rule content" > .cursor/rules/200-your-domain.mdc
echo "Framework-specific rules" > .cursor/rules/201-your-framework.mdc
```

---

## 🔧 Step 4: Development Environment Setup

### 4.1 Install Dependencies

```bash
# Initialize your project with your chosen tech stack
npm init -y  # or yarn init
# Install your specific dependencies
```

### 4.2 Create Basic Project Structure

```bash
# Create directories based on your framework
mkdir -p src/components
mkdir -p src/pages
mkdir -p src/lib
# etc.
```

### 4.3 Update .gitignore

```bash
# Add template-specific ignores
echo "prompts/TEMPLATE.*" >> .gitignore
echo "*.log" >> .gitignore
```

---

## 🤖 Step 5: Test AI Integration

### 5.1 Open in Cursor

```bash
code . # or cursor .
```

### 5.2 Test Basic AI Interaction

**Copy and paste this prompt:**

```
I'm working on [YOUR_PROJECT_NAME]. Please read prompts/main-prompt.md for your role and our project context.

Check .pdmd.md and .nbc.md for current progress before starting any new work.

Today I want to test that you understand our setup. Please:
1. Confirm you can read the main prompt
2. Confirm you understand our tech stack
3. Suggest the first development step
```

### 5.3 Verify AI Behavior

**AI should:**

- ✅ Read the main prompt file
- ✅ Reference your specific tech stack
- ✅ Give clear, actionable next steps
- ✅ Wait for your feedback

**If AI doesn't behave correctly:**

- Use `prompts/emergency-prompts.md`
- Check that `.cursor/rules/` files are in place
- Verify `prompts/main-prompt.md` is properly customized

---

## 📝 Step 6: Create Development Checklist

### 6.1 Update Checklist.md

Based on your PRD, create development milestones:

```markdown
# Development Checklist

## Phase 1: Project Setup

- [ ] Template configured and customized
- [ ] Development environment set up
- [ ] Basic project structure created
- [ ] AI integration tested

## Phase 2: Core Features

- [ ] [Your core feature 1]
- [ ] [Your core feature 2]
- [ ] [Your core feature 3]

## Phase 3: Advanced Features

- [ ] [Your advanced feature 1]
- [ ] [Your advanced feature 2]
```

---

## 🎨 Step 7: Design System Setup (Optional)

### 7.1 Create Design Guidelines

```bash
cp design.md your-design-guidelines.md
```

### 7.2 Customize Design System

Update with your:

- Color palette
- Typography choices
- Component styles
- Responsive breakpoints

---

## ✅ Step 8: Verification Checklist

Before starting development, verify:

### Project Files

- [ ] `prompts/main-prompt.md` fully customized
- [ ] `PRD.md` matches your project requirements
- [ ] `.pdmd.md` and `.nbc.md` initialized
- [ ] `checklist.md` reflects your development plan

### Cursor Configuration

- [ ] `.cursor/rules/` directory has all .mdc files
- [ ] Rules are relevant to your tech stack
- [ ] Custom rules added if needed

### AI Integration

- [ ] AI reads main prompt correctly
- [ ] AI understands your tech stack
- [ ] AI follows the workflow loop
- [ ] AI waits for feedback before continuing

### Development Environment

- [ ] Dependencies installed
- [ ] Basic project structure created
- [ ] Git initialized (if using)
- [ ] .gitignore configured

---

## 🚀 Step 9: Start First Development Session

### 9.1 Begin with a Simple Task

```
I'm working on [PROJECT_NAME]. Please read prompts/main-prompt.md for context.

Check .pdmd.md and .nbc.md for current state.

I want to start with: [SIMPLE_FIRST_TASK - e.g., "creating the basic project structure and a simple homepage"]
```

### 9.2 Follow the Workflow

1. **AI plans** → **You execute** → **Report results**
2. Let AI update `.pdmd.md` and `.nbc.md`
3. Verify AI is tracking progress correctly

---

## 🎯 Step 10: Establish Team Workflow (If Team Project)

### 10.1 Share Template Knowledge

- Share this setup guide with team members
- Ensure everyone understands the AI collaboration model
- Establish who updates `.pdmd.md` and `.nbc.md`

### 10.2 Create Team Rules

- Add team-specific rules to `.cursor/rules/`
- Document code review process
- Establish merge/collaboration workflow

---

## 🔧 Troubleshooting Common Issues

### AI Not Following Instructions

**Solution:** Use emergency reset prompt from `prompts/emergency-prompts.md`

### Rules Not Loading

**Solution:** Verify `.cursor/rules/` files are present and restart Cursor

### AI Making Wrong Tech Assumptions

**Solution:** Double-check tech stack customization in `prompts/main-prompt.md`

### Progress Not Being Tracked

**Solution:** Explicitly remind AI to update `.pdmd.md` after each feature

---

## 📚 Next Steps

Once setup is complete:

1. **Start small** - Begin with simple features to test the workflow
2. **Iterate** - Refine prompts and rules based on what works
3. **Document** - Keep `.pdmd.md` and `.nbc.md` updated
4. **Share** - Help others by improving the template

---

## 🆘 Getting Help

If you encounter issues:

1. **Check troubleshooting** section above
2. **Use emergency prompts** in `prompts/emergency-prompts.md`
3. **Review the main README** for additional guidance
4. **Start fresh** with the nuclear reset if needed

---

**🎉 Congratulations! You're ready to revolutionize your development workflow with AI pair programming!**

---

_Remember: The template is designed to adapt to your needs. Don't hesitate to customize prompts and rules as you discover what works best for your project and team._
