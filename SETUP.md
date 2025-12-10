# Setup Guide

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   - Create a `.env` file in the root directory
   - Add your OpenAI API key:
     ```
     VITE_OPENAI_API_KEY=your_openai_api_key_here
     ```
   - Get your API key from: https://platform.openai.com/api-keys

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open your browser**:
   - Navigate to the URL shown in the terminal (usually http://localhost:5173)

## Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## Project Features

✅ Multi-language support (Hindi, English, Hinglish)
✅ Age-appropriate questions (7-14 years)
✅ Multiple subjects and subtopics
✅ Interactive quiz with 15 questions
✅ Instant feedback on answers
✅ Detailed results with explanations
✅ AI-generated improvement tips

## Troubleshooting

### OpenAI API Key Error
- Make sure your `.env` file is in the root directory
- Ensure the variable name is exactly `VITE_OPENAI_API_KEY`
- Restart the dev server after adding the API key

### Build Errors
- Run `npm run lint` to check for linting errors
- Ensure all TypeScript types are correct
- Check that all imports use the `@/` alias

