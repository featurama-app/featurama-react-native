---
name: ios-device-deploy
description: Deploys the ExpoBoilerplate iOS app to a physical iPhone for testing. Use when the user says "test on iPhone", "deploy to iOS", "run on my phone", "iOS device", or wants to test the mobile app locally on iOS.
allowed-tools: Bash, Read, Glob
---

# iOS Device Deployment

Deploys the ExpoBoilerplate Expo app to a physical iPhone for local testing.

## Prerequisites

- Xcode installed with valid Apple Developer account
- Physical iPhone connected via USB or on same network
- CocoaPods installed (`brew install cocoapods`)

## Step-by-Step Process

### 1. List Connected Devices

```bash
xcrun xctrace list devices 2>/dev/null | grep -i iphone
```

Look for physical devices (not simulators). Note the device ID in parentheses.

**Default device: Always use "iPhone von Max" (Device ID: `00008130-001E15A20E6A001C`) — do not ask the user which device to deploy to.**

### 2. Install CocoaPods Dependencies (first time only)

```bash
cd /Users/maxmannstein/Coding/ExpoBoilerplate/ios
pod install
```

This creates `ExpoBoilerplate.xcworkspace`.

### 3. Start Metro Bundler (Background)

```bash
cd /Users/maxmannstein/Coding/ExpoBoilerplate
npx expo start --port 19000
```

Run this in background. Metro bundler will run on `http://localhost:19000`.

**Important:** Port 19000 is reserved for ExpoBoilerplate in the port registry (`~/Coding/VibeAutomation/docs/port_registry.md`). Always use `--port 19000` to avoid conflicts with other projects.

### 4. Build and Deploy

**Option A: Using Expo CLI (recommended)**

```bash
cd /Users/maxmannstein/Coding/ExpoBoilerplate
npx expo run:ios --port 19000 --device
```

**Option B: Using xcodebuild directly**

```bash
cd /Users/maxmannstein/Coding/ExpoBoilerplate/ios
xcodebuild -workspace ExpoBoilerplate.xcworkspace \
  -configuration Debug \
  -scheme ExpoBoilerplate \
  -destination "id=DEVICE_ID" \
  CODE_SIGN_STYLE=Automatic \
  build
```

Replace `DEVICE_ID` with the actual device ID from step 1.

### 5. Install and Launch (if using xcodebuild)

```bash
# Find the built app
APP_PATH=$(find ~/Library/Developer/Xcode/DerivedData -name "ExpoBoilerplate.app" -path "*/Debug-iphoneos/*" | head -1)

# Install
xcrun devicectl device install app --device "DEVICE_ID" "$APP_PATH"

# Launch
xcrun devicectl device process launch --device "DEVICE_ID" com.yourcompany.expoboilerplate
```

## After Successful Deploy

After the build succeeds and the app is installed, **always show the Expo Dev Server URL** to the user:

1. Get the Mac's local IP: `ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -1`
2. Print the URL in this format: **`http://<LOCAL_IP>:19000`**

Example output:
```
Expo Dev Server URL: http://192.168.0.172:19000
```

## Quick Reference

| Item | Value |
|------|-------|
| Bundle ID | `com.yourcompany.expoboilerplate` |
| App Name | `ExpoBoilerplate` |
| Workspace | `ios/ExpoBoilerplate.xcworkspace` |
| Project | `ios/ExpoBoilerplate.xcodeproj` |
| Metro Port | `19000` |

## Troubleshooting

### Error: Code Signing Issue
1. Open Xcode: `open ios/ExpoBoilerplate.xcworkspace`
2. Select the project → Signing & Capabilities
3. Select your Development Team
4. Let Xcode manage signing automatically

### Workspace not found
Run pod install first:
```bash
cd /Users/maxmannstein/Coding/ExpoBoilerplate/ios
pod install
```

### Device not found
1. Check USB connection
2. Trust the computer on iPhone (tap "Trust" on device dialog)
3. Run `xcrun xctrace list devices` to verify

### App doesn't connect to Dev Server
1. Check Metro is running: `curl -s http://localhost:19000/status`
2. Get local IP: `ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}'`
3. Ensure iPhone is on same WiFi network

### Pod install fails
```bash
cd /Users/maxmannstein/Coding/ExpoBoilerplate/ios
pod deintegrate
pod install
```

### Clean rebuild
```bash
cd /Users/maxmannstein/Coding/ExpoBoilerplate/ios
pod deintegrate && pod install
xcodebuild clean -workspace ExpoBoilerplate.xcworkspace -scheme ExpoBoilerplate
```

### Regenerate native project
```bash
cd /Users/maxmannstein/Coding/ExpoBoilerplate
npx expo prebuild --clean --platform ios
cd ios && pod install
```
