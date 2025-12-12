# Forms

## Form Libraries (React Hook Form Preferred)

**Why React Hook Form**:
- Minimal re-renders
- Better performance
- Built-in validation
- Easy integration with UI libraries

**Installation**:
```bash
npm install react-hook-form
```

**Basic Usage**:
```typescript
const { register, handleSubmit, formState: { errors } } = useForm();
```

## Validation Strategy

**Schema Validation** (Zod/Yup):
```typescript
import { z } from 'zod';
const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const { register, handleSubmit } = useForm({
  resolver: zodResolver(schema),
});
```

**Custom Validation**: Use `validate` function in `register()`.

## Error Display Pattern

**Consistent Error UI**:
```typescript
<FormControl isInvalid={!!errors.email}>
  <FormLabel>Email</FormLabel>
  <Input {...register('email')} />
  <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
</FormControl>
```

**Show errors** after first submit attempt or on blur.

## File Upload Rules

**Validation**:
- File size limits (e.g., 5MB max)
- File type restrictions (MIME types)
- Client-side preview before upload

**Implementation**:
```typescript
const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
  const file = e.target.files?.[0];
  if (file && file.size > 5 * 1024 * 1024) {
    setError('File too large');
    return;
  }
  // Process file
};
```

## Controlled vs Uncontrolled Inputs

**Uncontrolled** (React Hook Form default):
- Better performance
- Less re-renders
- Use `register()` or `Controller`

**Controlled** (useState):
- Needed for complex UI (rich text editors)
- Real-time validation feedback
- Use `Controller` component

**Rule**: Prefer uncontrolled unless you need controlled behavior.

