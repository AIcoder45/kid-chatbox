# Word of the Day Feature

## Overview
The Word of the Day feature displays a daily vocabulary word on the dashboard with detailed information including definitions, phonetics, part of speech, examples, and synonyms.

## Implementation

### Backend (Node.js/Express)
- **Endpoint**: `GET /api/public/word-of-the-day`
- **Location**: `server/routes/public.js`
- **API Used**: Free Dictionary API (https://dictionaryapi.dev)
- **No authentication required**

#### How It Works
1. Uses a curated list of 35 educational vocabulary words
2. Selects a word based on the day of year (ensures same word for all users per day)
3. Fetches word data from Free Dictionary API
4. Returns formatted response with:
   - Word and phonetic pronunciation
   - Meanings with part of speech
   - Up to 2 definitions per meaning
   - Example sentences
   - Synonyms

#### Response Format
```json
{
  "success": true,
  "word": "resilient",
  "phonetic": "/rɪˈzɪl.i.ənt/",
  "meanings": [
    {
      "partOfSpeech": "adjective",
      "definitions": [
        {
          "definition": "Able to withstand or recover quickly from difficult conditions.",
          "example": "The resilient child bounced back from disappointment."
        }
      ],
      "synonyms": ["strong", "tough", "hardy"]
    }
  ],
  "sourceUrl": "https://en.wiktionary.org/wiki/resilient"
}
```

### Frontend (React/TypeScript)

#### Component: `WordOfTheDay.tsx`
- **Location**: `src/components/WordOfTheDay.tsx`
- **Features**:
  - Loading state with spinner
  - Error handling with fallback UI
  - Responsive design for mobile and desktop
  - Beautiful purple-themed card design
  - Displays up to 2 meanings with definitions
  - Shows example sentences in highlighted boxes
  - Displays synonyms as badges

#### Integration
Added to Dashboard in the right sidebar above "Upcoming Tests"

#### Constants
All text uses internationalization constants from `src/constants/app.ts`:
- `WORD_OF_THE_DAY_TITLE`
- `WORD_OF_THE_DAY_LOADING`
- `WORD_OF_THE_DAY_ERROR`
- `WORD_OF_THE_DAY_SYNONYMS`

#### API Service
Added to `src/services/api.ts` under `publicApi`:
```typescript
publicApi.getWordOfTheDay()
```

## Word List
The feature includes 35 carefully selected vocabulary words suitable for kids:
- benevolent, eloquent, resilient, meticulous, profound
- ephemeral, luminous, ambitious, diligent, compassionate
- innovative, persistent, gracious, magnificent, authentic
- courageous, enthusiastic, generous, humble, intelligent
- jovial, kindhearted, legendary, optimistic, passionate
- remarkable, sincere, thoughtful, unique, vibrant
- wonderful, zealous, brilliant, charming, delightful

## Features
✅ **No API Key Required** - Uses free public API
✅ **Same Word for All Users** - Based on day of year
✅ **Educational Content** - Definitions, examples, and synonyms
✅ **Kid-Friendly** - Curated vocabulary list
✅ **Responsive Design** - Works on all devices
✅ **Error Handling** - Graceful fallback if API fails
✅ **Loading States** - Smooth user experience
✅ **No Authentication** - Available to all users

## Usage
The Word of the Day automatically loads when the dashboard is displayed. It refreshes daily at midnight (based on server timezone).

## Customization
To add or modify words, edit the `VOCABULARY_WORDS` array in `server/routes/public.js`.

## Dependencies
- Backend: `axios` (already installed)
- Frontend: React, Chakra UI (existing dependencies)

## Testing
To test the feature:
1. Start the backend server: `npm run dev:server`
2. Start the frontend: `npm run dev`
3. Navigate to the dashboard
4. The Word of the Day card should appear in the right sidebar

## Future Enhancements
- [ ] User can save favorite words
- [ ] Audio pronunciation
- [ ] Quiz based on words of the week
- [ ] Word history/archive
- [ ] User preference for word difficulty level

