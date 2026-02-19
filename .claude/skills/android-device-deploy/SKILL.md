---
name: android-device-deploy
description: Deploys the ExpoBoilerplate Android app to a physical Android device for testing. Use when the user says "test on Android", "deploy to Android", "run on my Android phone", "Android device", or wants to test the mobile app on Android.
allowed-tools: Bash, Read, Glob
---

# Android Device Deployment

Deploys the ExpoBoilerplate Expo app to a physical Android device for local testing.

## Prerequisites

- Android SDK installed (via Android Studio or standalone)
- Physical Android device connected via USB with USB debugging enabled
- Java 17 or 21 (Java 25 is NOT compatible with React Native)

## Step-by-Step Process

### 1. List Connected Devices

```bash
adb devices
```

Look for devices with `device` status (not `unauthorized` or `offline`). Note the device ID, e.g., `R58N815NQZD`.

### 2. Start Metro Bundler (Background)

```bash
cd /Users/maxmannstein/Coding/ExpoBoilerplate
npx expo start
```

Run this in background. Metro bundler will run on `http://localhost:8081`.

### 3. Build and Deploy

**Option A: Using Expo CLI (recommended)**

```bash
cd /Users/maxmannstein/Coding/ExpoBoilerplate
npx expo run:android --device
```

**Option B: Using Gradle directly**

```bash
# Set correct Java version (important!)
export JAVA_HOME=$(/usr/libexec/java_home -v 21)

cd /Users/maxmannstein/Coding/ExpoBoilerplate/android
./gradlew app:assembleDebug
```

Build output: `app/build/outputs/apk/debug/app-debug.apk`

### 4. Install the App (if using Gradle)

```bash
adb install -r /Users/maxmannstein/Coding/ExpoBoilerplate/android/app/build/outputs/apk/debug/app-debug.apk
```

The `-r` flag replaces existing installation.

### 5. Launch the App

```bash
adb shell am start -n com.yourcompany.expoboilerplate/.MainActivity
```

## Quick Reference

| Item | Value |
|------|-------|
| Package ID | `com.yourcompany.expoboilerplate` |
| Main Activity | `com.yourcompany.expoboilerplate/.MainActivity` |
| APK Location | `android/app/build/outputs/apk/debug/app-debug.apk` |
| Metro Port | `8081` |
| Required Java | Java 17 or 21 (NOT Java 25) |

## Troubleshooting

### Error: Java version incompatible
This means wrong Java version is being used. Set Java 21:
```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
```

Check installed Java versions:
```bash
/usr/libexec/java_home -V
```

### Device shows "unauthorized"
1. Check for authorization dialog on device
2. Tap "Allow" and check "Always allow from this computer"
3. If no dialog: `adb kill-server && adb start-server`

### Device not found
1. Check USB cable and connection
2. Enable USB debugging: Settings → Developer Options → USB Debugging
3. Try different USB port or cable
4. Run `adb kill-server && adb start-server`

### App doesn't connect to Dev Server
1. Check Metro is running: `curl -s http://localhost:8081/status`
2. Ensure device and computer are on same network
3. Shake device → Settings → Change Bundle Location → Enter computer IP:8081

### Gradle build fails
```bash
cd /Users/maxmannstein/Coding/ExpoBoilerplate/android
./gradlew clean
./gradlew app:assembleDebug
```

### Regenerate native project
```bash
cd /Users/maxmannstein/Coding/ExpoBoilerplate
npx expo prebuild --clean --platform android
```

## Available Java Versions

Check installed Java versions:
```bash
/usr/libexec/java_home -V
```

Use Java 21:
```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
```
