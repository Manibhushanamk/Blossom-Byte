import fs from 'fs';
import path from 'path';

// Store configuration at the root of the project (outside public/src)
const configPath = path.join(process.cwd(), 'blossom-config.json');

export function getConfig() {
  if (fs.existsSync(configPath)) {
    try {
      const data = fs.readFileSync(configPath, 'utf-8');
      return JSON.parse(data);
    } catch (e) {
      console.error('Failed to read config:', e);
      return null;
    }
  }
  return null;
}

export function saveConfig(config) {
  try {
    const existing = getConfig() || {};
    const merged = { ...existing, ...config };
    fs.writeFileSync(configPath, JSON.stringify(merged, null, 2));
    return true;
  } catch (e) {
    console.error('Failed to save config:', e);
    return false;
  }
}

export function isConfigured() {
  const config = getConfig();
  return !!(config && config.dbUri);
}

export function clearConfig() {
  try {
    if (fs.existsSync(configPath)) {
      fs.unlinkSync(configPath);
    }
    return true;
  } catch (e) {
    console.error('Failed to clear config:', e);
    return false;
  }
}
