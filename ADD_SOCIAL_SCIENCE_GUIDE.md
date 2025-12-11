# 📚 Adding Social Science Topic Guide

This guide explains how to add the Social Science topic with Transport and Communication subtopics, including descriptions for OpenAI quiz generation.

## ✅ What This Does

1. **Creates/Updates Topic:** Social Science
   - Includes comprehensive description
   - Covers all age groups (6-14)
   - Category: Social Science

2. **Creates/Updates Subtopics:**
   - **Transport** - With detailed description about modes of transport, vehicles, safety, and evolution
   - **Communication** - With detailed description about verbal, written, non-verbal, and digital communication

3. **Description Integration:**
   - All descriptions are automatically used by OpenAI when generating quizzes
   - Descriptions provide context for tailored question generation
   - Ensures quizzes are relevant and educational

## 🚀 How to Run

### On Your VPS Server

```bash
# SSH into your VPS
ssh root@31.97.232.51

# Navigate to your app directory
cd /var/www/kidchatbox  # or your app path

# Run the script
node server/scripts/add-social-science-topic.js

# Or specify an admin email (optional)
node server/scripts/add-social-science-topic.js amithbti416@gmail.com
```

### Expected Output

```
✅ Found admin user: amithbti416@gmail.com
✅ Created Social Science topic (ID: uuid-here)
✅ Created Transport subtopic
✅ Created Communication subtopic

🎉 Social Science topic and subtopics added successfully!

📚 Topic: Social Science
   ├─ Transport (with description for AI quiz generation)
   └─ Communication (with description for AI quiz generation)

✅ These descriptions will be used by OpenAI to generate tailored quiz questions.

✅ Done!
```

## 📝 What Gets Created

### Topic: Social Science

**Title:** Social Science  
**Description:** 
> Social Science explores how people interact with each other and their environment. It includes understanding communities, cultures, history, geography, economics, and civic responsibilities. This subject helps children understand the world around them and their place in society.

**Category:** Social Science  
**Age Group:** 6-14 (all ages)  
**Difficulty:** Medium

### Subtopic: Transport

**Title:** Transport  
**Description:**
> Transport refers to the movement of people, animals, and goods from one place to another. It includes various modes like road transport (cars, buses, bicycles), rail transport (trains), water transport (ships, boats), and air transport (airplanes, helicopters). Understanding transport helps children learn about connectivity, infrastructure, environmental impact, and how societies function. Key concepts include different types of vehicles, their uses, safety rules, and how transport has evolved over time.

**Difficulty:** Medium  
**Order:** 1

### Subtopic: Communication

**Title:** Communication  
**Description:**
> Communication is the process of exchanging information, ideas, thoughts, and feelings between people. It includes verbal communication (speaking, listening), written communication (letters, emails, messages), non-verbal communication (body language, gestures), and modern digital communication (phones, internet, social media). Understanding communication helps children learn about expressing themselves clearly, understanding others, different communication methods, and how technology has changed how we connect. Key concepts include effective listening, clear speaking, writing skills, and respectful communication.

**Difficulty:** Medium  
**Order:** 2

## 🤖 How Descriptions Work with OpenAI

When generating quizzes:

1. **If subtopic is selected:** The subtopic description is automatically fetched and included in the OpenAI prompt
2. **If quiz description is provided:** It's used in addition to or instead of subtopic description
3. **OpenAI uses these descriptions** to:
   - Understand the context and purpose
   - Generate relevant questions
   - Ensure questions align with the learning objectives
   - Create educational and age-appropriate content

### Example OpenAI Prompt Enhancement

When generating a quiz for "Transport" subtopic, OpenAI receives:

```
Topics: Transport

Quiz Context/Description: Transport: Transport refers to the movement of people, animals, and goods from one place to another. It includes various modes like road transport (cars, buses, bicycles), rail transport (trains), water transport (ships, boats), and air transport (airplanes, helicopters). Understanding transport helps children learn about connectivity, infrastructure, environmental impact, and how societies function. Key concepts include different types of vehicles, their uses, safety rules, and how transport has evolved over time.

Use this description to understand the quiz's purpose and generate questions that align with this context.
```

This ensures OpenAI generates questions about:
- Different modes of transport
- Vehicle types and their uses
- Safety rules
- Evolution of transport
- Infrastructure and connectivity

## ✅ Verification

After running the script, verify the topic was created:

### Via Admin Portal

1. Login to admin portal: `https://guru-ai.cloud/admin`
2. Navigate to **Topics Management**
3. Look for **Social Science** topic
4. Check that it has **Transport** and **Communication** subtopics
5. Verify descriptions are present

### Via API

```bash
# Get all topics
curl https://guru-ai.cloud/api/topics \
  -H "Authorization: Bearer YOUR_TOKEN"

# Get Social Science topic with subtopics
curl https://guru-ai.cloud/api/topics/TOPIC_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Via Database

```bash
# Connect to database
psql -h YOUR_DB_HOST -U YOUR_DB_USER -d kidchatbox

# Check topic
SELECT id, title, description, category FROM topics WHERE title = 'Social Science';

# Check subtopics
SELECT id, title, description FROM subtopics 
WHERE topic_id = (SELECT id FROM topics WHERE title = 'Social Science');
```

## 🎯 Using the Topic

### Creating Quizzes

1. **Via Admin Portal:**
   - Go to Quiz Management
   - Click "Create Quiz"
   - Select Topic: **Social Science**
   - Select Subtopic: **Transport** or **Communication**
   - The description will automatically be used for quiz generation

2. **Via API:**
   ```bash
   POST /api/quizzes/generate
   {
     "subtopicId": "subtopic-uuid",
     "name": "Transport Quiz",
     "ageGroup": "9-11",
     "difficulty": "Basic",
     "numberOfQuestions": 15
   }
   ```

### Generating Study Sessions

When students select Social Science → Transport or Communication:
- The subtopic description provides context
- Study materials can reference the description
- Quizzes automatically use the description for tailored questions

## 🔄 Updating Descriptions

If you need to update descriptions later:

### Via Admin Portal
1. Go to Topics Management
2. Click on Social Science topic
3. Edit subtopic descriptions
4. Save changes

### Via Script
Edit `server/scripts/add-social-science-topic.js` and run again. The script will update existing entries.

### Via API
```bash
PUT /api/topics/subtopics/:id
{
  "description": "Updated description here"
}
```

## 📋 Summary

✅ **Script Created:** `server/scripts/add-social-science-topic.js`  
✅ **Topic:** Social Science  
✅ **Subtopics:** Transport, Communication  
✅ **Descriptions:** Comprehensive descriptions included  
✅ **OpenAI Integration:** Descriptions automatically used for quiz generation  
✅ **Idempotent:** Can run multiple times safely (updates if exists)

## 🐛 Troubleshooting

### Script Fails

**Error:** "Admin role not found"
- **Fix:** Run database migrations first: `npm run db:setup`

**Error:** "Database connection failed"
- **Fix:** Check `.env` file has correct database credentials

**Error:** "User not found"
- **Fix:** Script will use system user if admin email not found. This is fine.

### Topic Not Appearing

1. Check script ran successfully
2. Verify database connection
3. Check admin portal permissions
4. Refresh browser cache

### Descriptions Not Used in Quizzes

1. Verify subtopic has description in database
2. Check OpenAI API key is configured
3. Verify quiz generation includes subtopicId
4. Check server logs for errors

---

**Need Help?** Check:
- `SUPER_USER_GUIDE.md` - Admin user creation
- `DEPLOY_TO_EXISTING_VPS.md` - Deployment guide
- `TROUBLESHOOTING_API_ENDPOINT.md` - API troubleshooting

