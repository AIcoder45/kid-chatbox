# How Word of the Day Changes Automatically 🔄

## Algorithm Explained

The Word of the Day feature uses a **mathematical algorithm** that automatically selects a different word each day based on the calendar date.

---

## 📅 The Day-Based Selection Algorithm

```javascript
const getWordOfTheDay = () => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
  );
  const wordIndex = dayOfYear % VOCABULARY_WORDS.length;
  return VOCABULARY_WORDS[wordIndex];
};
```

### Step-by-Step Breakdown:

#### 1. **Get Current Date**
```javascript
const today = new Date();
// Example: December 22, 2025
```

#### 2. **Calculate Day of Year**
```javascript
const dayOfYear = Math.floor(
  (today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
);
```

This calculates which day of the year it is (1-365/366):
- January 1 = Day 1
- December 22, 2025 = Day 356
- December 31 = Day 365 (or 366 in leap year)

#### 3. **Select Word Using Modulo**
```javascript
const wordIndex = dayOfYear % VOCABULARY_WORDS.length;
// Example: 356 % 35 = 6
return VOCABULARY_WORDS[wordIndex]; // Returns 7th word (index 6)
```

The **modulo operator (%)** ensures:
- Index always stays within array bounds (0-34 for 35 words)
- Same day = Same word for all users
- Cycles through all words continuously

---

## 🎯 Real-World Examples

### Example 1: December 22, 2025
- Day of year: **356**
- Calculation: 356 % 35 = **6**
- Word: **`VOCABULARY_WORDS[6]`** = `"luminous"`
- ✅ Everyone sees "luminous" on December 22, 2025

### Example 2: December 23, 2025
- Day of year: **357**
- Calculation: 357 % 35 = **7**
- Word: **`VOCABULARY_WORDS[7]`** = `"ambitious"`
- ✅ Everyone sees "ambitious" on December 23, 2025

### Example 3: January 1, 2026
- Day of year: **1**
- Calculation: 1 % 35 = **1**
- Word: **`VOCABULARY_WORDS[1]`** = `"eloquent"`
- ✅ New year, but algorithm continues smoothly

---

## 🔁 Word Rotation Cycle

With **35 words** in the vocabulary list:
- **Day 1-35**: Shows words 1-35
- **Day 36**: Cycles back to word 1 (36 % 35 = 1)
- **Day 70**: Shows word 0 (70 % 35 = 0)
- **Day 365**: Shows word based on 365 % 35 = 15

### Complete Cycle Time:
- Every **35 days**, the word pattern repeats
- Over a year (365 days), you see the full list ~10 times
- Students get multiple exposures to each word for better retention

---

## ⏰ When Does the Word Change?

### Automatic Change at Midnight
- **No server restart needed**
- **No manual intervention required**
- Changes automatically at **12:00 AM server time**

### How It Works:
1. User visits dashboard at **11:59 PM** → Sees "luminous"
2. Clock strikes **12:00 AM** (midnight)
3. User refreshes dashboard → Sees new word "ambitious"

The algorithm calculates the day **on every API request**, so it's always current.

---

## 🌍 Time Zone Considerations

### Server Time-Based
The word changes based on the **server's time zone**:

```javascript
const today = new Date(); // Uses server's local time
```

### Example Scenarios:

#### Scenario 1: Server in UTC
- Midnight UTC = Word changes
- Users in New York (UTC-5) see change at 7:00 PM (local)
- Users in Tokyo (UTC+9) see change at 9:00 AM (local)

#### Scenario 2: Server in EST (New York)
- Midnight EST = Word changes
- All users see change at midnight EST
- Tokyo users see change at 2:00 PM (local)

### Recommendation:
For global apps, consider using UTC:

```javascript
const getWordOfTheDay = () => {
  const today = new Date();
  // Force UTC
  const dayOfYear = Math.floor(
    (Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()) 
     - Date.UTC(today.getUTCFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
  );
  const wordIndex = dayOfYear % VOCABULARY_WORDS.length;
  return VOCABULARY_WORDS[wordIndex];
};
```

---

## 📊 Word Distribution Over Time

### Over 1 Month (30 days):
```
Day 1:  benevolent
Day 2:  eloquent
Day 3:  resilient
...
Day 30: compassionate
Day 31: innovative (cycle continues)
```

### Over 1 Year (365 days):
```
Each word appears approximately:
365 ÷ 35 = 10.4 times per year

Students see each word ~10 times throughout the year
Perfect for vocabulary retention!
```

---

## 🎓 Educational Benefits

### 1. **Consistency**
- Same word for all students in a class
- Teachers can plan lessons around the word
- Discussion and collaboration possible

### 2. **Spaced Repetition**
- Words repeat every 35 days
- Proven learning technique
- Better long-term retention

### 3. **Automatic Variety**
- No manual updates needed
- Always fresh content
- Students stay engaged

### 4. **Predictability (Optional)**
- Teachers can calculate future words
- Plan curriculum in advance
- Coordinate with lesson plans

---

## 🛠️ Testing Different Days

### Development/Testing Mode

You can test with specific words using the query parameter:

```bash
# Test with "hello"
http://localhost:3001/api/public/word-of-the-day?word=hello

# Test with "resilient"
http://localhost:3001/api/public/word-of-the-day?word=resilient
```

### Calculate Future Words

Want to know which word appears on a specific date? Use this formula:

```javascript
// Example: What word on March 15, 2026?
const date = new Date(2026, 2, 15); // Month is 0-indexed
const dayOfYear = Math.floor(
  (date - new Date(date.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24)
);
const wordIndex = dayOfYear % 35;
console.log(`March 15, 2026: ${VOCABULARY_WORDS[wordIndex]}`);
// Output: Day 74, Index 4, Word: "profound"
```

---

## 🔐 Reliability & Stability

### No Database Required
- ✅ Pure algorithmic approach
- ✅ No data storage needed
- ✅ Instant calculation
- ✅ Never out of sync

### Fault Tolerant
- ✅ Works even if API fails
- ✅ No external dependencies
- ✅ Always returns a valid word
- ✅ Consistent across server restarts

### Performance
- ⚡ O(1) time complexity
- ⚡ Calculated in microseconds
- ⚡ No database queries
- ⚡ Scales infinitely

---

## 📝 The 35-Word Vocabulary List

```javascript
const VOCABULARY_WORDS = [
  'benevolent',    // Index 0  - Day 0, 35, 70...
  'eloquent',      // Index 1  - Day 1, 36, 71...
  'resilient',     // Index 2  - Day 2, 37, 72...
  'meticulous',    // Index 3  - Day 3, 38, 73...
  'profound',      // Index 4  - Day 4, 39, 74...
  'ephemeral',     // Index 5  - Day 5, 40, 75...
  'luminous',      // Index 6  - Day 6, 41, 76...
  'ambitious',     // Index 7  - Day 7, 42, 77...
  'diligent',      // Index 8  - Day 8, 43, 78...
  'compassionate', // Index 9  - Day 9, 44, 79...
  // ... 25 more words
];
```

Each word is carefully selected to be:
- ✅ Age-appropriate (6-14 years)
- ✅ Educational value
- ✅ Common enough to be useful
- ✅ Advanced enough to challenge

---

## 🎨 User Experience

### For Students:
- "Visit dashboard → See new word each day"
- Builds anticipation and routine
- Encourages daily learning habit

### For Teachers:
- Know what students are learning
- Can reference the word in class
- Build lessons around vocabulary

### For Parents:
- Track child's vocabulary growth
- Daily conversation starters
- Shared learning experience

---

## 🚀 Summary

**The Word of the Day changes automatically every day using:**

1. ✅ **Day of year calculation** (1-365)
2. ✅ **Modulo operation** (day % 35)
3. ✅ **Array index selection** (VOCABULARY_WORDS[index])
4. ✅ **Midnight automatic refresh** (no restart needed)

**Result:**
- 🎯 Different word every day
- 🔄 35-day rotation cycle
- 🌍 Same word for all users per day
- ⚡ Zero maintenance required
- 🎓 10+ exposures per word per year

**No manual updates. No database. No maintenance. Just works! 🎉**

