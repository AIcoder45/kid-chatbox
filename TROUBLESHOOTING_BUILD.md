# 🔧 Troubleshooting Build Issues

## Problem: `tsc: not found` or `vite: not found`

This error occurs when devDependencies are not installed.

## ✅ Solution Steps

### Step 1: Verify Node.js and npm are installed

```bash
node --version  # Should show v20.x.x or higher
npm --version   # Should show 9.x.x or higher
```

### Step 2: Clean install dependencies

```bash
cd /var/www/kidchatbox

# Remove existing node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Install ALL dependencies (including devDependencies)
npm install

# Verify TypeScript and Vite are installed
ls node_modules/.bin/tsc
ls node_modules/.bin/vite
```

### Step 3: Try building again

```bash
npm run build
```

## 🔍 If Still Not Working

### Check if dependencies are actually installed:

```bash
# Check if TypeScript is installed
npm list typescript

# Check if Vite is installed
npm list vite

# If they show "empty", reinstall:
npm install typescript vite --save-dev
```

### Verify package.json is correct:

```bash
cat package.json | grep -A 20 devDependencies
```

You should see `typescript` and `vite` listed.

### Check npm cache:

```bash
# Clear npm cache
npm cache clean --force

# Reinstall
rm -rf node_modules package-lock.json
npm install
```

### Check disk space:

```bash
df -h
```

If disk is full, free up space first.

### Check permissions:

```bash
# Ensure you have write permissions
ls -la /var/www/kidchatbox

# Fix permissions if needed
sudo chown -R $USER:$USER /var/www/kidchatbox
```

## 🚀 Alternative: Install TypeScript and Vite globally

If local installation doesn't work:

```bash
# Install globally (not recommended but works)
npm install -g typescript vite

# Then try build
npm run build
```

## 📝 Manual Verification

After `npm install`, verify these files exist:

```bash
# Check these paths exist:
test -f node_modules/.bin/tsc && echo "✅ tsc found" || echo "❌ tsc missing"
test -f node_modules/.bin/vite && echo "✅ vite found" || echo "❌ vite missing"
test -d node_modules/typescript && echo "✅ typescript found" || echo "❌ typescript missing"
test -d node_modules/vite && echo "✅ vite found" || echo "❌ vite missing"
```

All should show "✅ found".

## 🎯 Quick Fix Command

Run this complete sequence:

```bash
cd /var/www/kidchatbox
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
npm run build
```

