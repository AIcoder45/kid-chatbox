/**
 * Test script to demonstrate Word of the Day rotation
 * Run: node test-word-rotation.js
 */

const VOCABULARY_WORDS = [
  'benevolent', 'eloquent', 'resilient', 'meticulous', 'profound',
  'ephemeral', 'luminous', 'ambitious', 'diligent', 'compassionate',
  'innovative', 'persistent', 'gracious', 'magnificent', 'authentic',
  'courageous', 'enthusiastic', 'generous', 'humble', 'intelligent',
  'jovial', 'kindhearted', 'legendary', 'optimistic', 'passionate',
  'remarkable', 'sincere', 'thoughtful', 'unique', 'vibrant',
  'wonderful', 'zealous', 'brilliant', 'charming', 'delightful',
];

/**
 * Get word for a specific date
 */
function getWordForDate(date) {
  const dayOfYear = Math.floor(
    (date - new Date(date.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24
  );
  const wordIndex = dayOfYear % VOCABULARY_WORDS.length;
  return {
    date: date.toDateString(),
    dayOfYear,
    wordIndex,
    word: VOCABULARY_WORDS[wordIndex],
  };
}

console.log('\n🔄 WORD OF THE DAY - ROTATION TEST\n');
console.log('=' .repeat(70));

// Test 1: Show today's word
console.log('\n📅 TODAY\'S WORD:');
console.log('-'.repeat(70));
const today = getWordForDate(new Date());
console.log(`Date:        ${today.date}`);
console.log(`Day of Year: ${today.dayOfYear}`);
console.log(`Array Index: ${today.wordIndex}`);
console.log(`Word:        "${today.word.toUpperCase()}"`);

// Test 2: Show next 7 days
console.log('\n📆 NEXT 7 DAYS:');
console.log('-'.repeat(70));
for (let i = 0; i < 7; i++) {
  const futureDate = new Date();
  futureDate.setDate(futureDate.getDate() + i);
  const wordInfo = getWordForDate(futureDate);
  console.log(`${wordInfo.date.padEnd(15)} | Day ${String(wordInfo.dayOfYear).padStart(3)} | Index ${String(wordInfo.wordIndex).padStart(2)} | ${wordInfo.word}`);
}

// Test 3: Show rotation cycle (every 35 days shows the same word)
console.log('\n🔁 WORD ROTATION CYCLE (35 days):');
console.log('-'.repeat(70));
const today2 = new Date();
console.log(`${getWordForDate(today2).date} → "${getWordForDate(today2).word}"`);

const plus35 = new Date(today2);
plus35.setDate(plus35.getDate() + 35);
console.log(`${getWordForDate(plus35).date} → "${getWordForDate(plus35).word}"`);

const plus70 = new Date(today2);
plus70.setDate(plus70.getDate() + 70);
console.log(`${getWordForDate(plus70).date} → "${getWordForDate(plus70).word}"`);

console.log('\n✅ Notice: Same word repeats every 35 days!');

// Test 4: Show all 35 words in order
console.log('\n📚 ALL 35 VOCABULARY WORDS (in rotation order):');
console.log('-'.repeat(70));
const startDate = new Date(2025, 0, 1); // January 1, 2025
for (let i = 0; i < 35; i++) {
  const date = new Date(startDate);
  date.setDate(date.getDate() + i);
  const wordInfo = getWordForDate(date);
  const marker = i === wordInfo.wordIndex ? '✓' : ' ';
  console.log(`${marker} ${String(i).padStart(2)}. ${VOCABULARY_WORDS[i].padEnd(15)} | Appears on Day ${i}, ${35 + i}, ${70 + i}, ${105 + i}...`);
}

// Test 5: Calculate word frequency in a year
console.log('\n📊 WORD FREQUENCY IN ONE YEAR:');
console.log('-'.repeat(70));
const daysInYear = 365;
const cyclesPerYear = Math.floor(daysInYear / VOCABULARY_WORDS.length);
const remainingDays = daysInYear % VOCABULARY_WORDS.length;
console.log(`Total days in year:    ${daysInYear}`);
console.log(`Vocabulary words:      ${VOCABULARY_WORDS.length}`);
console.log(`Complete cycles:       ${cyclesPerYear} (${cyclesPerYear * VOCABULARY_WORDS.length} days)`);
console.log(`Remaining days:        ${remainingDays}`);
console.log(`\nEach word appears:     ~${Math.floor(daysInYear / VOCABULARY_WORDS.length)} times per year`);
console.log(`First ${remainingDays} words appear: ${cyclesPerYear + 1} times (one extra appearance)`);
console.log(`Last ${VOCABULARY_WORDS.length - remainingDays} words appear:  ${cyclesPerYear} times`);

// Test 6: Show which word on specific important dates
console.log('\n🎯 SPECIFIC DATE EXAMPLES:');
console.log('-'.repeat(70));
const importantDates = [
  new Date(2025, 0, 1),   // New Year
  new Date(2025, 1, 14),  // Valentine's Day
  new Date(2025, 6, 4),   // Independence Day
  new Date(2025, 9, 31),  // Halloween
  new Date(2025, 11, 25), // Christmas
];

importantDates.forEach(date => {
  const wordInfo = getWordForDate(date);
  console.log(`${wordInfo.date.padEnd(20)} | "${wordInfo.word}"`);
});

console.log('\n' + '='.repeat(70));
console.log('✅ Test Complete! Words change automatically based on the date.\n');
console.log('🚀 Run this script on different days to see different words!');
console.log('🔄 No database, no manual updates - pure mathematics!\n');

