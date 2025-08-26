1. TypeScript Error Checking
bash# Check TypeScript compilation
npx tsc --noEmit

# Check with strict mode
npx tsc --noEmit --strict

# Check specific files
npx tsc --noEmit src/**/*.ts src/**/*.tsx

# Check TypeScript config
cat tsconfig.json
2. Linting & Code Quality
bash# ESLint check
npm run lint
# OR
npx eslint . --ext .js,.jsx,.ts,.tsx

# Fix auto-fixable ESLint issues
npx eslint . --ext .js,.jsx,.ts,.tsx --fix

# Check for unused dependencies
npx depcheck

# Check for security vulnerabilities
npm audit
npm audit fix
3. Architecture & Build Errors
bash# Check Next.js build
npm run build

# Check development server
npm run dev

# Check bundle analyzer (if configured)
npx @next/bundle-analyzer

# Check for circular dependencies
npx madge --circular src/

# Check import/export issues
npx es6-plato src/
4. Firebase Configuration Errors
bash# Validate Firebase rules
firebase firestore:rules:get
firebase storage:rules:get

# Check Firebase project status
firebase projects:list
firebase use

# Validate hosting config
firebase serve --only hosting

# Check Firebase functions (if any)
firebase functions:log

# Validate all Firebase services
firebase deploy --dry-run
5. Package & Dependency Errors
bash# Check package.json issues
npm ls
npm ls --depth=0

# Check for outdated packages
npm outdated

# Clear cache if issues
rm -rf node_modules package-lock.json
npm install

# Check Node.js compatibility
node --version
npm --version
6. File Structure & Architecture Check
bash# Check file structure
tree -I 'node_modules|.git|.next'

# Find large files that might cause issues
find . -type f -size +10M -not -path "./node_modules/*" -not -path "./.git/*"

# Check for missing files
ls -la src/
ls -la public/
ls -la pages/ || echo "No pages directory"

# Check imports and exports
grep -r "import.*from.*undefined" src/ || echo "No undefined imports found"
