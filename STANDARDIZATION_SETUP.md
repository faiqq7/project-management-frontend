# Frontend Standardization Setup

This document outlines the standardization setup applied to the frontend repository.

## What's Been Added

### 🔧 Configuration Files

- **`.eslintrc.json`** - Comprehensive ESLint configuration with React, accessibility, and import sorting rules
- **`.prettierrc.json`** - Prettier formatting configuration for consistent code style
- **`.prettierignore`** - Files to exclude from Prettier formatting
- **`.editorconfig`** - Editor settings for consistent coding styles across different editors
- **`.vscode/settings.json`** - VS Code workspace settings for optimal development experience
- **`.vscode/extensions.json`** - Recommended VS Code extensions

### 📦 Package.json Updates

#### New Dev Dependencies
- `prettier` - Code formatter
- `eslint-plugin-import` - Import/export syntax linting
- `eslint-plugin-jsx-a11y` - Accessibility linting for JSX
- `eslint-plugin-react` - React-specific linting rules
- `eslint-plugin-react-hooks` - React Hooks linting rules
- `husky` - Git hooks management
- `lint-staged` - Run linters on staged files

#### New Scripts
- `lint` - Run ESLint on src directory
- `lint:fix` - Automatically fix ESLint issues
- `format` - Format code with Prettier
- `format:check` - Check if code is formatted correctly
- `pre-commit` - Run all checks (lint, format, test)
- `fix-all` - Fix all auto-fixable issues
- `prepare` - Set up Husky hooks
- `postinstall` - Install Husky hooks after npm install

### 🎯 Pre-commit Hooks

Automated checks that run before each commit:
- ESLint fixes
- Prettier formatting
- Only staged files are processed

### 📚 Documentation

- **`DEVELOPMENT_GUIDE.md`** - Comprehensive development guidelines including:
  - Project structure conventions
  - Naming conventions
  - Code standards
  - Best practices
  - Development workflow
  - API integration patterns

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Git Hooks
```bash
npm run prepare
```

### 3. Install Recommended VS Code Extensions
Open VS Code and install the recommended extensions from the Extensions panel.

## 🛠 Daily Workflow

### Before Committing
Run the pre-commit check:
```bash
npm run pre-commit
```

### Fix Issues Automatically
```bash
npm run fix-all
```

### Individual Commands
```bash
npm run lint          # Check for linting errors
npm run lint:fix      # Fix linting errors
npm run format        # Format all code
npm run format:check  # Check if code is formatted
```

## 🎯 Key Features

### Code Quality
- **ESLint** with React, accessibility, and import sorting rules
- **Prettier** for consistent code formatting
- **EditorConfig** for consistent editor behavior
- **Import sorting** with automatic organization

### Development Experience
- **VS Code integration** with automatic formatting and linting
- **Git hooks** prevent commits with linting errors
- **Consistent styling** across the entire team
- **Accessibility checks** built into linting

### Automation
- **Pre-commit hooks** automatically format and lint staged files
- **Auto-fix** capabilities for most common issues
- **Import organization** with proper grouping and sorting

## 📋 Configuration Details

### ESLint Rules
- React best practices
- Hooks rules validation
- Accessibility checks
- Import/export organization
- Code quality standards
- Consistent code style

### Prettier Configuration
- 2-space indentation
- Double quotes
- Trailing commas
- 80-character line width
- LF line endings

### Import Organization
Imports are automatically organized in this order:
1. Built-in Node.js modules
2. External packages
3. Internal modules
4. Parent directory imports
5. Sibling imports
6. Index imports

## 🔄 Migration Notes

### Existing Code
- Run `npm run fix-all` to automatically fix most issues
- Some manual fixes may be required for complex cases
- The pre-commit hooks will prevent commits with errors

### Team Onboarding
1. Install the recommended VS Code extensions
2. Run `npm install` to set up hooks
3. Familiarize yourself with the `DEVELOPMENT_GUIDE.md`
4. Use `npm run pre-commit` before committing

## 🎉 Benefits

- **Consistency** - All code follows the same style and patterns
- **Quality** - Automated checks prevent common errors
- **Productivity** - Auto-formatting and fixing saves time
- **Maintainability** - Clear standards make code easier to understand
- **Accessibility** - Built-in a11y checks improve user experience
- **Collaboration** - Standardized setup reduces friction between developers