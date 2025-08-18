# 🚨 Emergency AI Reset Prompts

Use these prompts when the AI becomes confused, unhelpful, or loses context.

---

## 🔄 Full Context Reset

**When AI is completely lost or acting erratically:**

```
EMERGENCY RESET:

1. Stop what you're doing immediately
2. Read prompts/main-prompt.md to remember your role
3. Read .pdmd.md to understand current project progress
4. Read .nbc.md to understand current issues
5. Ask me what I want to work on next
6. Follow the workflow loop: Check → Plan → Code → Instruct → Wait → Log

Do NOT continue until you confirm you understand your role and current project state.
```

---

## 🧠 Role Confusion Reset

**When AI forgets its role or starts acting like it can run commands:**

```
ROLE RESET:

You are the BRAIN, not the executor. You:
- Think and write code
- Give me explicit instructions
- Wait for my feedback
- Track progress in .pdmd.md and .nbc.md

You do NOT:
- Run commands yourself
- Assume things work without my confirmation
- Continue without waiting for feedback

Remember: You = brain, Me = body. What do you need me to test or run?
```

---

## 📁 Context Loss Reset

**When AI can't remember what we're working on:**

```
CONTEXT RESET:

Please read these files in order:
1. .pdmd.md - to see what we've completed
2. .nbc.md - to see current issues/bugs
3. prompts/main-prompt.md - to remember your role

Then tell me:
- What was the last thing we completed?
- What issues are currently logged?
- What should we work on next?

Do not make assumptions. Only work with information from these files.
```

---

## 🛠️ Technical Confusion Reset

**When AI suggests wrong tech stack or breaks patterns:**

```
TECH STACK RESET:

Check prompts/main-prompt.md for our agreed tech stack. We are using:
- [List your specific technologies]

Do NOT suggest any other tools or libraries.
Follow the patterns established in .cursor/rules/ files.
Check .pdmd.md to see how we've been implementing features.

What were you trying to help me with? Let's approach it using our established stack.
```

---

## 📝 Progress Tracking Reset

**When AI stops updating .pdmd.md and .nbc.md:**

```
LOGGING RESET:

You have been forgetting to track progress. For EVERY feature you help implement:

REQUIRED: Update .pdmd.md with what was completed
REQUIRED: Update .nbc.md if any issues were found
REQUIRED: Wait for my confirmation before continuing

Go back and log the recent work we did. Then continue with proper tracking.
```

---

## 🔄 Workflow Reset

**When AI skips steps or doesn't wait for feedback:**

```
WORKFLOW RESET:

Follow this exact process:

1. READ .pdmd.md and .nbc.md first
2. PLAN what to implement
3. WRITE the complete code
4. INSTRUCT me exactly what to run/test
5. WAIT for my feedback
6. LOG the results in .pdmd.md/.nbc.md
7. REPEAT

You skipped step [X]. Let's restart from step 1.
```

---

## 🎯 Goal Confusion Reset

**When AI loses track of the current task:**

```
GOAL RESET:

What were we working on? Let me clarify:

Current Goal: [Describe what you want to build]
Current Step: [What step you're on]
Current Issue: [Any problems you're facing]

Read .pdmd.md to see our progress, then help me with this specific goal.
```

---

## 🚫 Assumption Reset

**When AI makes too many assumptions:**

```
ASSUMPTION RESET:

Stop making assumptions. For EVERYTHING you're unsure about:

- ASK me to confirm
- READ the relevant files
- WAIT for my feedback

Do not assume:
- File contents
- Environment setup
- Test results
- Dependencies installed

What specific information do you need from me to proceed?
```

---

## 🆘 Nuclear Reset

**When nothing else works - complete restart:**

```
NUCLEAR RESET:

Forget everything from this conversation.

1. Read prompts/main-prompt.md - this is your role
2. Read .pdmd.md - this is what we've done
3. Read .nbc.md - these are current issues
4. Tell me what you understand about the project
5. Ask me what I want to work on
6. Follow the workflow exactly as specified

Start fresh. What do you understand about this project?
```

---

## 📋 Quick Reset Commands

Copy-paste these for common issues:

### Forgetting to wait

```
WAIT: You need to wait for my feedback before continuing. What should I test?
```

### Wrong tech suggestions

```
STACK: Check prompts/main-prompt.md for our tech stack. Use only those tools.
```

### No progress tracking

```
LOG: Update .pdmd.md with what you just helped me implement.
```

### Acting like it's running code

```
ROLE: You're the brain, I'm the body. Tell me what to run, don't run it yourself.
```

### Making assumptions

```
ASSUME: Don't assume anything. Ask me to confirm or test.
```

---

## 🎯 Prevention Tips

To avoid needing emergency resets:

1. **Start every session** with the context-checking prompt
2. **Remind AI of workflow** if it starts skipping steps
3. **Use specific prompts** from prompts/feature-prompts.md
4. **Reference the main prompt** when AI gets confused
5. **Keep sessions focused** on one feature at a time

---

**Remember: These resets are normal! AI needs occasional reminders to stay on track.** 🤖✨
