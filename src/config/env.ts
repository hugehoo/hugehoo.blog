// Centralized environment variable configuration
export const ENV = {
  // GitHub Configuration
  GITHUB_TOKEN: process.env.GITHUB_TOKEN,
  GITHUB_OWNER: process.env.GITHUB_OWNER || 'hugehoo',
  GITHUB_REPO: process.env.GITHUB_REPO || 'hugehoo.blog',
  GITHUB_BRANCH: process.env.GITHUB_BRANCH || 'main',
  
  // Editor Authentication
  EDITOR_PASSWORD: process.env.EDITOR_PASSWORD,
  
  // Environment
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

// Validation helpers
export const validateGitHubConfig = () => {
  const missing = [];
  
  if (!ENV.GITHUB_TOKEN) missing.push('GITHUB_TOKEN');
  if (!ENV.GITHUB_OWNER) missing.push('GITHUB_OWNER');
  if (!ENV.GITHUB_REPO) missing.push('GITHUB_REPO');
  
  if (missing.length > 0) {
    throw new Error(`Missing required GitHub environment variables: ${missing.join(', ')}`);
  }
  
  return {
    token: ENV.GITHUB_TOKEN!,
    owner: ENV.GITHUB_OWNER,
    repo: ENV.GITHUB_REPO,
    branch: ENV.GITHUB_BRANCH,
  };
};

export const validateEditorConfig = () => {
  if (!ENV.EDITOR_PASSWORD) {
    throw new Error('Missing required environment variable: EDITOR_PASSWORD');
  }
  
  return {
    password: ENV.EDITOR_PASSWORD,
  };
};