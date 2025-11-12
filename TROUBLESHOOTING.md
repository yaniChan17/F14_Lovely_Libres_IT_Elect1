# Troubleshooting Guide

## Issue: expo-sqlite Module Resolution Error

If you encounter the error:
```
Unable to resolve "expo-sqlite" from "database\database.js"
```

### Solution Steps

1. **Delete node_modules and package-lock.json**
   ```bash
   # Windows (PowerShell)
   Remove-Item -Recurse -Force node_modules
   Remove-Item -Force package-lock.json
   
   # macOS/Linux
   rm -rf node_modules package-lock.json
   ```

2. **Clear npm cache**
   ```bash
   npm cache clean --force
   ```

3. **Clear Expo cache**
   ```bash
   npx expo start -c
   # or
   expo start --clear
   ```

4. **Reinstall dependencies**
   ```bash
   npm install
   ```

5. **If still having issues, try reinstalling Expo CLI**
   ```bash
   npm install -g expo-cli@latest
   ```

### Alternative: Use Expo Install Command

Instead of `npm install`, use Expo's install command to ensure version compatibility:

```bash
npx expo install expo-sqlite expo-crypto
```

This will automatically install the correct versions for your Expo SDK.

## Common Issues

### Issue: "Cannot find module './utils/autoAddConfigPlugins.js'"

This error usually means your Expo CLI installation is corrupted.

**Solution:**
```bash
# Remove Expo CLI globally
npm uninstall -g expo-cli

# Clear npm cache
npm cache clean --force

# Reinstall Expo CLI
npm install -g expo-cli@latest

# Or use npx (recommended - no global install needed)
npx expo start
```

### Issue: Version Mismatch Warnings

If you see warnings about package versions not matching Expo SDK, follow these steps:

1. Check your Expo SDK version in `package.json`:
   ```json
   "expo": "~53.0.20"
   ```

2. Use the Expo doctor command to check compatibility:
   ```bash
   npx expo-doctor
   ```

3. Install all packages with Expo install command:
   ```bash
   npx expo install --fix
   ```

## Verified Working Configuration

For **Expo SDK 53**, use these package versions:

```json
{
  "dependencies": {
    "expo": "~53.0.20",
    "expo-sqlite": "~15.2.14",
    "expo-crypto": "~14.1.5",
    "expo-status-bar": "~2.2.3",
    "react": "19.0.0",
    "react-native": "0.79.5",
    "react-native-safe-area-context": "5.4.0",
    "react-native-screens": "~4.11.1"
  }
}
```

## Step-by-Step Fresh Install

If nothing else works, try a complete fresh install:

```bash
# 1. Delete everything
Remove-Item -Recurse -Force node_modules, package-lock.json, .expo

# 2. Clear all caches
npm cache clean --force
npx expo start -c

# 3. Reinstall with Expo
npx expo install

# 4. Start the app
npx expo start
```

## Platform-Specific Notes

### Windows
- Use PowerShell or Command Prompt, not Git Bash
- Make sure you have write permissions to the project folder
- Run as Administrator if you encounter permission issues

### macOS/Linux
- Use Terminal
- You might need to use `sudo` for global npm packages

## Still Having Issues?

1. Check Node.js version (should be v14+ or v18+ recommended):
   ```bash
   node --version
   ```

2. Check npm version:
   ```bash
   npm --version
   ```

3. Make sure you're in the project directory:
   ```bash
   cd path/to/F14_Lovely_Libres_IT_Elect1
   pwd  # or cd (Windows) to verify
   ```

4. Try using Yarn instead of npm:
   ```bash
   yarn install
   yarn start
   ```

## Quick Fix Checklist

- [ ] Deleted `node_modules` folder
- [ ] Deleted `package-lock.json` file
- [ ] Cleared npm cache: `npm cache clean --force`
- [ ] Cleared Expo cache: `npx expo start -c`
- [ ] Reinstalled dependencies: `npm install`
- [ ] Used correct package versions (see above)
- [ ] Restarted terminal/IDE
- [ ] Tried `npx expo install expo-sqlite expo-crypto`

## Contact

If you continue to experience issues after following these steps, please provide:
1. Node.js version (`node --version`)
2. npm version (`npm --version`)
3. Operating system
4. Complete error message
5. Output of `npx expo-doctor`
