# Vani.Coach - Mobile Communication Coaching App
### React Native Frontend Candidate Assessment & Production Architecture

A high-performance, production-grade mobile application engineered for **[Vani.Coach](https://vani.coach/)**, an AI-powered communication coaching platform that empowers professionals to elevate their workplace communication skills.

This project implements the core **Assessment Results** screen requested in the candidate exercise, expanded into a complete end-to-end mobile coaching experience featuring an **Interactive Practice Studio (Hardware Voice Recording & Written Response)** and a **Communication Analytics Dashboard**, designed according to senior React Native and system architecture standards.

---

## 🎯 Executive Summary & Assessment Requirements Fulfillment

The application strictly fulfills every functional requirement, data model specification, and performance consideration outlined in the assessment prompt:

| Requirement from PDF | Implementation | Architecture Detail |
| :--- | :--- | :--- |
| **All 5 Core Fields** | `question`, `assessmentType` (Recorded/Text), `score`, `status` (Completed/Pending), `feedback` | Fully typed with TypeScript interfaces in `@/features/assessments/types`. |
| **PDF Example Scenario** | • *Tell me about yourself* (Recorded, 82, Completed)<br>• *Describe a challenging situation* (Recorded, 65, Completed)<br>• *Write a professional email to your manager* (Text, 78, Completed)<br>• *Explain your current project* (Recorded, Pending) | Available out-of-the-box via the **"Load PDF Example Scenario"** button. |
| **Recorded vs. Text** | Prominent visual badge differentiation | Distinct color tokens, semantic iconography (`mic` vs. `document-text`), and duration/word metrics. |
| **Performance Grading** | Dynamic rating based on score | `Score >= 70`: **Good** (Emerald badge)<br>`Score < 70`: **Needs Improvement** (Amber badge). |
| **Pending Assessment Handling** | Evaluated vs. un-evaluated state | Pending items display no score or feedback, render as **"Awaiting Evaluation"**, and include a 1-tap **"Evaluate Now (Instant AI)"** trigger. |
| **Zero Completed State** | Graceful empty state handling | Illustrated zero-state component with action buttons to start a practice session or load test data. |
| **High Data Volume Scale** | Smooth 60–120 FPS performance under 5,000+ items | Virtualized using **Shopify FlashList v2** with cell recycling, windowed pagination, and $O(N)$ single-pass filtering. |

---

## 🛠️ Technology Stack & Architectural Decisions ("What We Used & Why")

Every dependency and architectural pattern was chosen deliberately to reflect industry-standard React Native practices:

### 1. List Virtualization: `@shopify/flash-list` (v2.0)
* **Why over `FlatList`?**: React Native's built-in `FlatList` continuously unmounts and remounts components during fast scrolls, leading to blank view flashes, high JS bridge traffic, and memory spikes under large datasets.
* **How FlashList Solves It**: FlashList recycles underlying native Android/iOS views across items of similar structure. Memory consumption remains completely flat even when handling thousands of assessments.
* **Pagination**: Windowed pagination (`PAGE_SIZE = 20`) with `onEndReachedThreshold={0.5}` loads items incrementally as the user scrolls.

### 2. State Management & Offline Persistence: `Zustand` + `react-native-mmkv` (v4)
* **Why over `AsyncStorage` or Redux?**:
  * `AsyncStorage` is asynchronous, slow (serialized across the JS bridge), and prone to data race conditions on app boot.
  * Redux introduces heavy boilerplate and unnecessary bundle weight for client state.
* **Why MMKV**: Written in C++, Tencent's MMKV operates synchronously on mmap memory, executing reads and writes **~30x faster** than `AsyncStorage`.
* **Why Zustand**: Lightweight (<2KB), minimal boilerplate, and supports fine-grained selector subscriptions so components only re-render when their specific slice changes.

### 3. Server State & Caching: `@tanstack/react-query` (v5)
* **Purpose**: Manages server state lifecycle, optimistic mutations, query key factories, and query invalidation.
* **Integration**: Standardized query keys (`assessmentQueryKeys`) and mutation hooks for fetching, submitting, and evaluating assessments.

### 4. Hardware Voice Studio: `expo-audio` (SDK 52 / v57 API)
* **Hardware Recording**: Uses `useAudioRecorder(RecordingPresets.HIGH_QUALITY)` with hardware permission checks.
* **In-App Playback Preview**: Employs `useAudioPlayer` and `useAudioPlayerStatus` allowing users to listen to their voice response, inspect duration, view waveform animations, or retake before submitting.
* **Safety Guards**: Includes a 3-second minimum duration validation to ensure quality coaching analysis.

### 5. Keyboard Handling: `react-native-keyboard-aware-scroll-view`
* **Why**: Standard `KeyboardAvoidingView` on Android frequently glitches or hides inputs under the software keyboard.
* **Behavior**: Automatically calculates layout offsets and smoothly scrolls focused text inputs into view when typing custom prompts or written responses.

### 6. Path Aliases: `@/*` via Babel & Metro
* **Why**: Prevents fragile, error-prone relative paths (e.g., `../../../shared/theme`).
* **Implementation**: Configured in `tsconfig.json`, `babel.config.js`, and `metro.config.js` (`extraNodeModules`) for clean, absolute-like imports:
  ```tsx
  import { AppText, Card, Badge, useTheme, ms } from '@/shared';
  import { useAssessmentStore } from '@/features/assessments/store';
  ```

### 7. Design System & Responsive Typography
* **Responsive Scaling (`scale.ts`)**: Implements mathematical scaling based on a standard $375 \times 812$ viewport guideline:
  * `s(size)`: horizontal scaling
  * `vs(size)`: vertical scaling
  * `ms(size, factor)`: moderate scaling (used for typography and icons to preserve readability across large tablets and small phones).
* **Official Vani.Coach Design System**:
  * Curated brand palette: Coral Primary (`#FF6B2B`), Indigo Recorded (`#6366F1`), Cyan Written Text (`#06B6D4`), Emerald Good (`#10B981`), Amber Improvement (`#F59E0B`).
  * Instant Dark & Light mode toggle supported system-wide.

---

## 📂 Project Structure

```plaintext
VaniAssessmentApp/
├── App.tsx                           # Root component (Providers: QueryClient, SafeArea, Theme)
├── index.js                          # Expo entrypoint
├── babel.config.js                   # Babel plugin module-resolver configuration (@ -> src)
├── metro.config.js                   # Metro bundler path resolution & asset symlink handling
├── tsconfig.json                     # TypeScript strict mode & path aliases (@/*)
├── package.json                      # Dependencies and scripts
│
├── assets/                           # App icon, splash screens, and official Vani logos
│   └── images/
│       └── vani-logo.png             # Official Vani.Coach brand logo asset
│
└── src/
    ├── core/                         # Low-level core infrastructure
    │   ├── api/                      # Network layer
    │   │   ├── client.ts             # Fetch/HTTP client with timeout & retry logic
    │   │   ├── endpoints.ts          # REST endpoint definitions
    │   │   ├── errorHandler.ts       # Standardized API error parser
    │   │   ├── queryClient.ts        # TanStack React Query singleton client
    │   │   ├── types.ts              # Generic API request/response schemas
    │   │   └── interceptors/         # Auth header injection & request/response logging
    │   ├── storage/                  # Native MMKV storage instance
    │   └── index.ts
    │
    ├── features/                     # Domain-driven feature modules
    │   ├── assessments/              # Feature 1: Assessment Results
    │   │   ├── api/                  # API query hooks & mutation keys
    │   │   ├── components/           # AssessmentCard, AssessmentFilter, AssessmentStats, EmptyState
    │   │   ├── data/                 # Baseline mock data & 4-question PDF scenario
    │   │   ├── screens/              # AssessmentResultsScreen (FlashList virtualization)
    │   │   ├── store/                # useAssessmentStore (Zustand + MMKV persistence)
    │   │   └── types/                # AssessmentResult, AssessmentFilterType data models
    │   │
    │   ├── practice/                 # Feature 2: Interactive Practice Studio
    │   │   ├── components/
    │   │   │   ├── AudioWaveform.tsx # Pulsing animated audio wave bars
    │   │   │   ├── EvaluationModal.tsx # AI Coaching critique & score dialog
    │   │   │   ├── QuestionPicker.tsx# Preset question selector & custom question input
    │   │   │   ├── TextResponseStudio.tsx # Multi-line editor with live word count & STAR tips
    │   │   │   └── VoiceRecorderStudio.tsx# Fixed-height studio with mic, timer, and preview bar
    │   │   └── screens/
    │   │       └── TakeAssessmentScreen.tsx # Multi-step assessment creator with KeyboardAwareScrollView
    │   │
    │   └── analytics/                # Feature 3: Communication Fitness Analytics
    │       └── screens/
    │           └── AnalyticsScreen.tsx # Modality-aware analytics (Spoken vs. Written separation)
    │
    ├── navigation/                   # Navigation architecture
    │   ├── AppNavigator.tsx          # Root Stack navigator
    │   ├── TabNavigator.tsx          # Bottom tab bar setup
    │   ├── BottomTabBar.tsx          # Custom animated tab bar with center microphone trigger
    │   ├── navigationRef.ts          # Top-level imperative navigation utilities
    │   └── types.ts                  # Fully typed navigation parameters
    │
    └── shared/                       # Cross-cutting design system & utilities
        ├── components/
        │   ├── AppText.tsx           # Typed typography primitive with variant presets
        │   ├── Badge.tsx             # Semantic pills (Recorded, Text, Good, Needs Improvement)
        │   ├── Card.tsx              # Elevated/outlined surface container
        │   ├── Header.tsx            # Universal header with Vani logo & theme switcher
        │   ├── ScoreIndicator.tsx    # Compact circular score indicator
        │   └── ScreenWrapper.tsx     # SafeAreaView wrapper with StatusBar management
        ├── theme/                    # ThemeContext, color tokens, typography, spacing, shadows
        └── utils/                    # Scale utils (ms, s, vs)
```

---

## ⚡ Setup & Running Instructions

### Prerequisites
- **Node.js**: v18 or v20 LTS recommended
- **Yarn**: `npm install -g yarn`
- **Android SDK / Xcode**: Configured for React Native development
- **Physical Device / Emulator**: USB debugging enabled for Android

### 1. Install Dependencies
```bash
yarn install
```

### 2. Environment Configuration & Switching

The project features a multi-environment configuration system (`development`, `staging`, `production`) powered by `scripts/set-env.js`:

| Environment | Config File | API Base URL | Debug Stats | Command to Switch |
| :--- | :--- | :--- | :---: | :--- |
| **Development** | `.env.development` | `https://dev-api.vani.coach/v1` | `true` | `yarn env:dev` |
| **Staging** | `.env.staging` | `https://staging-api.vani.coach/v1` | `true` | `yarn env:staging` |
| **Production** | `.env.production` | `https://api.vani.coach/v1` | `false` | `yarn env:prod` |

---

### 3. Complete Command & Script Reference

| Category | Command | Description |
| :--- | :--- | :--- |
| **Environment** | `yarn env:dev` | Switch active `.env` to Development |
| | `yarn env:staging` | Switch active `.env` to Staging / Release Candidate |
| | `yarn env:prod` | Switch active `.env` to Production |
| **Development** | `yarn start:dev` | Switch to Dev env and start Metro bundler with clean cache |
| | `yarn start:prod` | Switch to Prod env and start Metro bundler with clean cache |
| | `yarn android:dev` | Run on Android device/emulator with Development environment |
| | `yarn android:prod` | Run on Android device/emulator with Production environment |
| | `yarn ios:dev` | Run on iOS simulator with Development environment |
| | `yarn ios:prod` | Run on iOS simulator with Production environment |
| **Build & Release** | `yarn build:apk` | Sets Production env and builds release APK via Gradle |
| | `yarn build:android:release` | Standalone release APK (`app-release.apk`) |
| | `yarn build:android:bundle` | Production Google Play Store App Bundle (`.aab`) |
| | `yarn build:android:debug` | Debug APK build |
| **Maintenance** | `yarn clean` | Cleans Gradle artifacts, Metro cache, and temporary buffers |
| | `yarn typecheck` | Runs TypeScript strict check (`tsc --noEmit`) |
| | `yarn lint` | Validates static code correctness |

### 4. Build Release Standalone APK (Android)
To compile an optimized, standalone release APK using R8/ProGuard and Hermes engine:
```bash
# 1-step automated command (switches to production env & compiles APK):
yarn build:apk

# Output APK path:
# android/app/build/outputs/apk/release/app-release.apk
```

To build a Google Play Store App Bundle (`.aab`):
```bash
yarn build:android:bundle
```

---

## 🔍 Code Quality & Verification Commands

### TypeScript Strict Mode Check
Verify that all source files compile with **0 type errors**:
```bash
yarn typecheck
# or: npx tsc --noEmit
```

### Metro Bundler Health Check
Verify that the Metro server is bundling without errors:
```bash
curl -s -o /dev/null -w "%{http_code}" "http://localhost:8081/index.bundle?platform=android&dev=true&minify=false"
# Expected response: 200
```

---

## 💡 Key Architectural Highlights for Technical Review

1. **Zero Cumulative Layout Shift (CLS)**:
   In `VoiceRecorderStudio.tsx`, the outer container height is strictly set to `height: ms(280)` and control row to `height: ms(96)`. When tapping the microphone to begin recording, the studio never shifts or shrinks.
2. **Modality-Aware Analytics**:
   In `AnalyticsScreen.tsx`, **Speech Clarity & Pronunciation** and **Filler Word Control** are calculated **strictly from completed audio recordings**. If no voice assessments exist, an informative notice is shown rather than arbitrary scores. Written communication metrics (*Grammar, Conciseness, Email Structure*) are calculated **strictly from text responses**.
3. **Single-Pass Aggregation**:
   The computation of filtered items, average score, total attempts, and grade distributions in `AssessmentResultsScreen.tsx` is executed in **one single-pass $O(N)$ loop** inside `useMemo`, eliminating redundant array iterations.
4. **Resilient Hardware Lifecycle**:
   All hardware audio streams and native driver animations safely release on component unmount, preventing memory leaks in background states.
