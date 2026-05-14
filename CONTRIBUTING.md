# Contributing to Circlo

Thank you for your interest in contributing to Circlo! This document provides guidelines for contributing to the project.

## 🎯 Project Philosophy

Circlo is designed to be:
- **Simple** - Easy to understand and maintain
- **Beginner-friendly** - Great for learning and interviews
- **Practical** - Focused on real-world use cases
- **Clean** - Well-organized and readable code

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/yourusername/circlo.git`
3. Install dependencies: `npm run install:all`
4. Create a branch: `git checkout -b feature/your-feature-name`
5. Make your changes
6. Test your changes
7. Commit: `git commit -m 'Add some feature'`
8. Push: `git push origin feature/your-feature-name`
9. Open a Pull Request

## 📝 Code Style

### TypeScript/JavaScript
- Use TypeScript for frontend code
- Use ES6+ features
- Use functional components with hooks
- Keep functions small and focused
- Add comments for complex logic

### Naming Conventions
- **Components**: PascalCase (e.g., `EventHeader.tsx`)
- **Hooks**: camelCase with "use" prefix (e.g., `usePhotos.ts`)
- **Utilities**: camelCase (e.g., `copyToClipboard.ts`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `MAX_FILE_SIZE`)

### File Organization
```
src/
├── components/    # Reusable UI components
├── pages/         # Page-level components
├── hooks/         # Custom React hooks
├── lib/           # Core utilities (api, validation)
├── utils/         # Helper functions
└── types.ts       # TypeScript types
```

## ✅ Before Submitting

- [ ] Code follows the project style
- [ ] No console.log statements (unless intentional)
- [ ] No unused imports or variables
- [ ] TypeScript types are properly defined
- [ ] Code is well-commented where necessary
- [ ] Changes are tested locally
- [ ] README is updated if needed

## 🐛 Bug Reports

When reporting bugs, please include:
- Clear description of the issue
- Steps to reproduce
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Browser/OS information

## 💡 Feature Requests

When suggesting features:
- Explain the use case
- Describe the expected behavior
- Keep it simple and aligned with project goals
- Consider if it fits the "beginner-friendly" philosophy

## 🔍 Code Review Process

1. All PRs require review before merging
2. Address review comments promptly
3. Keep PRs focused on a single feature/fix
4. Update your branch if main has changed

## 📚 Resources

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [Socket.IO Documentation](https://socket.io/docs/)

## ❓ Questions?

Feel free to open an issue for any questions or clarifications.

Thank you for contributing! 🎉
