# Study Library Content Management Setup

## Overview
This feature allows admins to upload and manage content for the Study Library, including PPT, PDF, and text files with publish dates.

## Installation Steps

### 1. Install Multer Package
```bash
npm install multer
```

### 2. Run Database Migration
```bash
node server/scripts/migrate-study-library-content.js
```

This will create the `study_library_content` table with support for:
- File uploads (PPT, PPTX, PDF, TXT)
- Text content
- Publish dates
- Metadata (subject, age group, difficulty, language)

### 3. Create Uploads Directory
The uploads directory will be created automatically, but ensure the server has write permissions:
```bash
mkdir -p uploads/study-library
chmod 755 uploads/study-library
```

## Features

### Admin Panel Features:
- **Create**: Upload PPT, PDF, or text files
- **Read**: View all content with filters and pagination
- **Update**: Edit content details and replace files
- **Delete**: Remove content and associated files

### Content Types Supported:
- **PPT/PPTX**: PowerPoint presentations
- **PDF**: PDF documents
- **Text**: Plain text content (can be typed or uploaded as .txt file)

### Fields:
- Title (required)
- Description (optional)
- Content Type (required)
- File Upload (required for PPT/PDF, optional for text)
- Text Content (for text type)
- Subject (optional)
- Age Group (optional: 6-8, 9-11, 12-14)
- Difficulty (optional: Basic, Advanced, Expert)
- Language (default: English)
- Publish Date (optional)
- Published Status (checkbox)

## API Endpoints

### GET `/api/admin/study-library-content`
Get all content with pagination and filters

### GET `/api/admin/study-library-content/:id`
Get specific content by ID

### POST `/api/admin/study-library-content`
Create new content (multipart/form-data)

### PUT `/api/admin/study-library-content/:id`
Update content (multipart/form-data)

### DELETE `/api/admin/study-library-content/:id`
Delete content and associated file

## File Storage
- Files are stored in `uploads/study-library/` directory
- Files are served statically at `/uploads/study-library/:filename`
- Maximum file size: 50MB
- Old files are automatically deleted when content is updated or deleted

## Access
Navigate to Admin Panel → Study Library to access the content management interface.

