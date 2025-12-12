# Version Control & Branching

## Git Branching Model

**Main Branches**:
- `main` or `master`: Production-ready code
- `develop`: Integration branch for features

**Feature Branches**:
- `feature/feature-name`: New features
- `bugfix/bug-name`: Bug fixes
- `hotfix/issue-name`: Critical production fixes

**Naming Convention**:
- Use kebab-case
- Be descriptive: `feature/user-authentication`, not `feature/auth`

## Pull Request Checklist

**Before Submitting PR**:
- [ ] Code follows project style guide
- [ ] All tests pass
- [ ] No linting errors
- [ ] Documentation updated
- [ ] No console.log statements
- [ ] Environment variables documented
- [ ] Migration scripts included (if DB changes)

**PR Description**:
- What changed and why
- How to test
- Screenshots (if UI changes)
- Breaking changes (if any)

## Commit Message Format

**Conventional Commits**:
```
feat: add user authentication
fix: resolve login token expiry issue
docs: update API documentation
refactor: extract auth logic to service
test: add tests for user service
chore: update dependencies
```

**Format**: `<type>: <description>`

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation
- `refactor`: Code refactoring
- `test`: Tests
- `chore`: Maintenance

**Benefits**: Clear history, automated changelog generation.

## Branch Protection

**Protect Main Branch**:
- Require PR reviews
- Require CI checks to pass
- No direct pushes to main
- Require up-to-date branch

**Benefits**: Prevents broken code in production.

## Code Review Guidelines

**Review Checklist**:
- Code quality and style
- Security concerns
- Performance implications
- Test coverage
- Documentation

**Be Constructive**: Provide actionable feedback.

**Approve When**: Code is correct, tested, and documented.

