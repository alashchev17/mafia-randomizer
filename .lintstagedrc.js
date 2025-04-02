export default {
  "*.{ts,tsx}": ["yarn format:write", "eslint --max-warnings 0"],
  "*.{js,jsx}": ["yarn format:write"],
  "*.{json,css,md}": ["yarn format:write"],
};
