# File Handling

## Safe File Uploads

**Use Multer** (Current Project Uses):
```javascript
const multer = require('multer');
const upload = multer({
  dest: 'uploads/',
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  },
});

router.post('/upload', upload.single('file'), handleUpload);
```

**Security**: Validate file type, size, and content.

## Storage Strategy (Local, S3, GCS)

**Local Storage** (Development):
- Simple setup
- Good for small files
- Not scalable

**Cloud Storage** (Production):
- **AWS S3**: Scalable, reliable
- **Google Cloud Storage**: Similar to S3
- **Cloudinary**: Image optimization included

**Implementation**:
```javascript
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');

const uploadToS3 = async (file) => {
  const command = new PutObjectCommand({
    Bucket: process.env.S3_BUCKET,
    Key: file.filename,
    Body: file.buffer,
    ContentType: file.mimetype,
  });
  await s3Client.send(command);
};
```

## Media Type Validation

**Validate MIME Type**:
```javascript
const allowedMimeTypes = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'application/pdf': ['.pdf'],
};

function isValidFile(file) {
  const ext = path.extname(file.originalname).toLowerCase();
  return allowedMimeTypes[file.mimetype]?.includes(ext);
}
```

**Check File Content**: Don't trust file extension, validate actual content.

## Virus Scanning (Optional)

**For Production**:
- Use services like ClamAV
- Cloud services (AWS Macie, Google Cloud Security)
- Third-party APIs (VirusTotal)

**When Needed**: User-uploaded files, especially executables.

**Current Project**: Consider adding for production if accepting user uploads.

## File Naming

**Unique Filenames**:
```javascript
const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`;
```

**Organize by Date**:
```javascript
const date = new Date();
const path = `${date.getFullYear()}/${date.getMonth() + 1}/${filename}`;
```

**Sanitize Filenames**: Remove special characters, prevent path traversal.

