# 🚀 Ultimate Cursor AI Template

This template provides a comprehensive setup for working with Cursor AI on any project. It includes pre-configured prompts, rules, and documentation to make AI collaboration seamless and productive.

## 📁 File Structure Overview

```
📂 your-project/
├── 📂 prompts/                     # AI Prompt Templates
│   ├── 📄 README.md               # This file - setup guide
│   ├── 📄 main-prompt.md          # Primary AI role & instructions
│   ├── 📄 emergency-prompts.md    # When AI gets confused
│   ├── 📄 feature-prompts.md      # Feature-specific guidance
│   └── 📄 debugging-prompts.md    # Debugging & troubleshooting
├── 📂 .cursor/                     # Cursor IDE Configuration
│   └── 📂 rules/                  # Cursor Rules (auto-loaded)
├── 📄 .pdmd.md                    # Project Decisions & Done Log
├── 📄 .nbc.md                     # Notes, Bugs & Clarifications
├── 📄 PRD.md                      # Product Requirements Document
└── 📄 checklist.md                # Development checklist
```

## 🎯 How This Template Works

### The AI Collaboration System

This template sets up a **human-AI collaboration system** where:

- **You = The Executor** (runs code, tests, reports)
- **AI = The Brain** (thinks, plans, writes code)
- **Files = Memory** (tracks decisions, bugs, progress)

### Key Files Explained

| File                           | Purpose                    | When to Use                |
| ------------------------------ | -------------------------- | -------------------------- |
| `prompts/main-prompt.md`       | Primary AI instructions    | Start of every session     |
| `prompts/emergency-prompts.md` | When AI gets lost/confused | AI acting weird/unhelpful  |
| `prompts/feature-prompts.md`   | Feature-specific guidance  | Building specific features |
| `.pdmd.md`                     | Progress tracking          | AI logs completed work     |
| `.nbc.md`                      | Bug/issue tracking         | AI logs problems found     |
| `.cursor/rules/`               | Cursor auto-rules          | Always active in Cursor    |

## 🚀 Quick Start Guide

### 1. Setup Your Project

1. **Copy this template** to your new project
2. **Update `PRD.md`** with your project goals
3. **Customize `prompts/main-prompt.md`** with your tech stack
4. **Open in Cursor** - rules auto-load from `.cursor/rules/`

### 2. Start AI Collaboration

**Copy and paste this to start any session:**

```
I'm working on [PROJECT_NAME]. Please read prompts/main-prompt.md for your role and our project context.

Check .pdmd.md and .nbc.md for current progress before starting any new work.

Today I want to work on: [DESCRIBE_TASK]
```

### 3. When AI Gets Confused

If AI starts acting weird, becomes unhelpful, or forgets context:

**Copy and paste this:**

```
You seem confused. Please read prompts/emergency-prompts.md and reset your approach based on those instructions.
```

### 4. For Specific Features

When building specific features like auth, payments, UI components:

**Copy and paste this:**

```
I'm building [FEATURE_NAME]. Please read prompts/feature-prompts.md and follow the specific guidance for this type of feature.
```

## 🧠 AI Behavior Guidelines

### What AI Should Do

✅ Think and plan like a senior engineer  
✅ Write implementation-ready code  
✅ Give explicit execution instructions  
✅ Track progress in `.pdmd.md` and `.nbc.md`  
✅ Wait for your feedback before continuing

### What AI Should NOT Do

❌ Run commands itself  
❌ Assume tests pass without confirmation  
❌ Skip progress logging  
❌ Make up file contents  
❌ Continue without feedback

## 📋 Daily Workflow

### Starting a Session

1. Open Cursor
2. Paste the "Start AI Collaboration" prompt
3. Describe what you want to build
4. Let AI plan and implement
5. Execute AI's instructions
6. Report results back to AI

### During Development

1. **AI plans** → **You execute** → **Report results**
2. AI updates `.pdmd.md` with completed work
3. AI updates `.nbc.md` with any issues found
4. Repeat until feature is complete

### When Stuck

- Use `prompts/emergency-prompts.md`
- Use `prompts/debugging-prompts.md`
- Check `.nbc.md` for known issues
- Ask AI to read the relevant prompt file

## 🛠️ Customization Guide

### For Your Tech Stack

Edit `prompts/main-prompt.md` and update:

- **Tech Stack** section (replace Next.js/Supabase/etc.)
- **Constraints** section (your specific limitations)
- **Project Context** (your app's purpose)

### For Your Rules

Add files to `.cursor/rules/` following this pattern:

- `001-your-rule.mdc` - Custom coding standards
- `002-your-framework.mdc` - Framework-specific rules
- `003-your-domain.mdc` - Domain-specific guidelines

### For Your Project Type

Update these files:

- `PRD.md` - Your product requirements
- `checklist.md` - Your development milestones
- `prompts/feature-prompts.md` - Your common features

## 🎭 Prompt Templates

### When AI Needs Context

```
Please read .pdmd.md and .nbc.md to understand current project state, then proceed with [TASK].
```

### When Starting New Feature

```
I want to build [FEATURE]. Check .pdmd.md for what's already done, then plan the implementation.
```

### When AI is Confused

```
Reset: Read prompts/main-prompt.md for your role. Read .pdmd.md for current progress. Then help me with [TASK].
```

### When Debugging

```
There's an issue with [PROBLEM]. Check .nbc.md for known issues, then help me debug this.
```

## 🔧 Troubleshooting

### AI Not Following Instructions

- Use `prompts/emergency-prompts.md`
- Remind AI to read the main prompt
- Check if Cursor rules are loading properly

### AI Not Tracking Progress

- Explicitly ask AI to update `.pdmd.md`
- Remind AI of the workflow loop
- Use the emergency reset prompt

### AI Making Assumptions

- Use more explicit instructions
- Reference the "What AI Should NOT Do" list
- Ask AI to wait for confirmation

## 🎯 Success Metrics

You'll know the template is working when:

- ✅ AI consistently follows your project patterns
- ✅ Progress is tracked in `.pdmd.md`
- ✅ Issues are logged in `.nbc.md`
- ✅ AI waits for your feedback before continuing
- ✅ Code quality remains consistent
- ✅ You can easily pick up where you left off

## 🚀 Advanced Tips

### Multi-Session Continuity

Always start sessions with: "Check .pdmd.md and .nbc.md for current state"

### Large Features

Break into smaller tasks and track each in `.pdmd.md`

### Team Collaboration

Share `.pdmd.md` and `.nbc.md` with team members for context

### Custom Workflows

Create your own prompt files for repeated patterns

---

**Happy coding with your AI pair programmer! 🤖👨‍💻**
