# File Previews

## Image Previews

**Display Images**:
```typescript
<img src={imageUrl} alt={altText} loading="lazy" />
```

**Thumbnails**: Show thumbnail, load full image on click.

**Lightbox**: Use library like `react-image-lightbox` for full-screen view.

## PDF Previews

**Embed PDF**:
```typescript
<iframe src={pdfUrl} width="100%" height="600px" />
```

**PDF.js**: For better control and cross-browser support.

**Download Option**: Always provide download button.

## Video Previews

**HTML5 Video**:
```typescript
<video controls src={videoUrl} poster={thumbnailUrl}>
  Your browser does not support video.
</video>
```

**Thumbnail**: Show thumbnail before play.

**Lazy Load**: Load video on demand, not on page load.

## Document Previews

**Office Documents**: Use services like Google Docs Viewer or Microsoft Office Online.

**Fallback**: Always provide download option if preview fails.

## File Type Detection

**MIME Types**: Check file MIME type to determine preview method.

**Icons**: Show appropriate icon for unsupported file types.

**Error Handling**: Show error message if preview fails to load.

## Security Considerations

**Validate File Types**: Only allow safe file types for preview.

**Sanitize URLs**: Ensure file URLs are safe before rendering.

**CORS**: Handle CORS issues for external file previews.

