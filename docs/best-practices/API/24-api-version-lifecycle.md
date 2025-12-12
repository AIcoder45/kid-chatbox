# API Version Lifecycle

## Deprecation Workflow

**Announce Deprecation**:
- Add deprecation header to responses
- Document in API docs
- Notify API consumers
- Set deprecation date (6-12 months notice)

**Implementation**:
```javascript
router.get('/api/v1/users', (req, res) => {
  res.setHeader('Deprecation', 'true');
  res.setHeader('Sunset', 'Mon, 01 Jan 2025 00:00:00 GMT');
  res.setHeader('Link', '</api/v2/users>; rel="successor-version"');
  // ... handler
});
```

**Communication**: Email, documentation, changelog.

## Sunset Policies

**Sunset Timeline**:
- **Announcement**: 6-12 months before sunset
- **Warning Period**: 3 months before sunset
- **Sunset**: Remove deprecated version

**Graceful Transition**:
- Provide migration guide
- Support both versions during transition
- Monitor usage of deprecated version

**Sunset Header**:
```javascript
res.setHeader('Sunset', 'Mon, 01 Jan 2025 00:00:00 GMT');
```

## Versioning Strategy

**When to Version**:
- Breaking changes
- Major feature additions
- Significant refactoring

**Version Format**:
- URL: `/api/v1/`, `/api/v2/`
- Header: `Accept: application/vnd.api+json;version=2`

**Keep Versions**: Support at least 2 versions simultaneously.

## Migration Support

**Provide Tools**:
- Migration scripts
- Code examples
- Compatibility guide
- Support during transition

**Monitor Usage**: Track which version clients use, plan sunset accordingly.

## Communication Plan

**Before Deprecation**:
- Announce in changelog
- Email API consumers
- Update documentation
- Provide migration timeline

**During Transition**:
- Regular reminders
- Support for questions
- Migration assistance

**After Sunset**:
- Archive old documentation
- Provide redirects (if possible)
- Document lessons learned

