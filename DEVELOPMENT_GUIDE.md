# Frontend Development Guide

## Project Structure

This React application follows a standardized structure for maintainability and consistency.

### Directory Structure

```
src/
├── components/          # Reusable UI components
│   ├── common/         # Generic components (Button, Input, Modal, etc.)
│   ├── forms/          # Form-specific components
│   └── layout/         # Layout components (Header, Footer, Sidebar)
├── context/            # React Context providers
├── hooks/              # Custom React hooks
├── pages/              # Page components (route components)
├── services/           # API calls and external services
├── utils/              # Utility functions and helpers
├── constants/          # Application constants
├── assets/             # Images, icons, fonts
└── styles/            # Global styles and CSS modules
```

## Naming Conventions

### Files and Directories
- **Components**: Use PascalCase (e.g., `UserProfile.js`, `TimeEntryForm.js`)
- **Pages**: Use PascalCase (e.g., `Dashboard.js`, `ProjectDetail.js`)
- **Hooks**: Use camelCase starting with `use` (e.g., `useAuth.js`, `useLocalStorage.js`)
- **Utilities**: Use camelCase (e.g., `formatDate.js`, `apiHelper.js`)
- **Constants**: Use SCREAMING_SNAKE_CASE (e.g., `API_ENDPOINTS.js`, `USER_ROLES.js`)

### Variables and Functions
- Use camelCase for variables and functions
- Use descriptive names (e.g., `handleUserLogin` instead of `handleLogin`)
- Boolean variables should start with `is`, `has`, `can`, `should` (e.g., `isLoading`, `hasPermission`)

### Components
- Use PascalCase for component names
- Use descriptive names that indicate the component's purpose
- Prefer functional components with hooks over class components

## Code Standards

### Component Structure
```javascript
import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

// Named export for the component
export default function ComponentName({ prop1, prop2, ...props }) {
  // State declarations
  const [state, setState] = useState(initialValue);

  // Effect hooks
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // Event handlers
  const handleEvent = () => {
    // Handler logic
  };

  // Render helpers (if needed)
  const renderHelper = () => {
    return <div>Helper content</div>;
  };

  return (
    <div className="component-wrapper">
      {/* JSX content */}
    </div>
  );
}

// PropTypes definition
ComponentName.propTypes = {
  prop1: PropTypes.string.isRequired,
  prop2: PropTypes.number,
};

// Default props (if needed)
ComponentName.defaultProps = {
  prop2: 0,
};
```

### Import Order
1. React and React-related imports
2. Third-party library imports
3. Internal imports (components, hooks, utils)
4. Relative imports

```javascript
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import axios from "axios";

import Button from "../components/common/Button";
import { useAuth } from "../hooks/useAuth";
import { formatDate } from "../utils/dateUtils";

import "./ComponentName.css";
```

### Event Handler Naming
- Use `handle` prefix for event handlers (e.g., `handleSubmit`, `handleChange`)
- Use `on` prefix for prop event handlers (e.g., `onSubmit`, `onChange`)

### State Management
- Use useState for local component state
- Use useContext for shared state across multiple components
- Keep state as close to where it's used as possible
- Avoid deeply nested state objects

### Styling
- Use Tailwind CSS classes for styling
- Create custom CSS classes only when Tailwind utilities are insufficient
- Use consistent spacing using Tailwind's spacing scale
- Follow mobile-first responsive design principles

## Best Practices

### Performance
- Use React.memo() for expensive components that don't need frequent re-renders
- Use useCallback() and useMemo() judiciously to prevent unnecessary re-renders
- Lazy load components and routes when appropriate

### Accessibility
- Always include `alt` attributes for images
- Use semantic HTML elements
- Ensure proper keyboard navigation
- Maintain sufficient color contrast ratios
- Include ARIA labels where necessary

### Error Handling
- Use error boundaries for catching JavaScript errors
- Provide meaningful error messages to users
- Log errors for debugging purposes
- Handle loading and error states gracefully

### Testing
- Write unit tests for utility functions
- Write integration tests for critical user flows
- Use descriptive test names
- Keep tests focused and independent

## Development Workflow

### Before Committing
1. Run `npm run pre-commit` to check linting, formatting, and tests
2. Or run individual commands:
   - `npm run lint` - Check for linting errors
   - `npm run format:check` - Check code formatting
   - `npm run test` - Run tests

### Fixing Issues
- `npm run fix-all` - Automatically fix linting and formatting issues
- `npm run lint:fix` - Fix ESLint issues
- `npm run format` - Format code with Prettier

### Git Hooks
- Pre-commit hooks are automatically set up with Husky
- Code will be automatically linted and formatted before each commit
- Commits will be rejected if there are linting errors

## Environment Setup

### Required VS Code Extensions
- Prettier - Code formatter
- ESLint - JavaScript linter
- EditorConfig - Maintain consistent coding styles
- Tailwind CSS IntelliSense - Tailwind CSS support
- ES7+ React/Redux/React-Native snippets - React snippets

### Recommended Settings
All VS Code settings are configured in `.vscode/settings.json`

## API Integration

### Service Pattern
Create service files for API interactions:

```javascript
// services/userService.js
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const userService = {
  getUsers: () => axios.get(`${API_BASE_URL}/users/`),
  getUser: (id) => axios.get(`${API_BASE_URL}/users/${id}/`),
  createUser: (userData) => axios.post(`${API_BASE_URL}/users/`, userData),
  updateUser: (id, userData) => axios.put(`${API_BASE_URL}/users/${id}/`, userData),
  deleteUser: (id) => axios.delete(`${API_BASE_URL}/users/${id}/`),
};
```

### Error Handling
```javascript
try {
  const response = await userService.getUsers();
  setUsers(response.data);
} catch (error) {
  console.error("Failed to fetch users:", error);
  setError("Failed to load users. Please try again.");
}
```

## Contributing

1. Follow the established patterns in the codebase
2. Write self-documenting code with clear variable and function names
3. Add comments for complex business logic
4. Test your changes thoroughly
5. Ensure all linting and formatting checks pass
6. Update documentation when necessary

## Resources

- [React Documentation](https://reactjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [ESLint Rules](https://eslint.org/docs/rules/)
- [Prettier Configuration](https://prettier.io/docs/en/configuration.html)
