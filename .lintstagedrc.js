export default {
  "*.{ts,tsx}": ["yarn format:write", "eslint --max-warnings 0", "git add"],
  "*.{js,jsx}": ["yarn format:write", "git add"],
  "*.{json,css,md}": ["yarn format:write", "git add"],
};
