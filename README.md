# Vani.Coach - Mobile Assessment Results Screen
### React Native Frontend Candidate Exercise

A production-ready React Native implementation of the **Assessment Results** screen for **[Vani.Coach](https://vani.coach/)**, an AI-powered communication coaching platform.

---

## 📱 Features & Assessment Requirements Completed

| Assessment Requirement | Implementation Details |
| :--- | :--- |
| **Display Completed Assessments** | Lists user questions, scores, and AI coaching feedback with clean typography and readability. |
| **Recorded vs. Text Differentiation** | Distinct visual badges & icons (`mic-outline` for Recorded, `document-text-outline` for Text). |
| **Score & AI Feedback Rendering** | Displays numeric evaluation score (`/100`) and structured AI coaching critique. Expandable for long comments. |
| **Good vs. Needs Improvement Indicator** | Dynamic performance grading based on score threshold (Score $\ge 70$ tagged **Good**, Score $< 70$ tagged **Needs Improvement**). |
| **Empty State Handling** | Custom illustrated zero-state component with clear messaging and recovery action when no assessments exist. |
| **Pending Assessment Handling** | Safely renders submissions awaiting AI evaluation without displaying placeholder scores or feedback. |
| **Scalability & Large Dataset Performance** | Virtualized `FlatList` with memoized render items, windowing, and clipped subview removal for smooth 60 FPS scrolling. |
| **Reviewer Test Controls** | Built-in interactive controls to test Empty State, toggle Pending items, or instantly stress-test with 60+ generated items. |

---

## 🎨 Design System & Visuals

- **Official Vani.Coach Palette**: Aligned with the live platform brand tokens:
  - Primary Brand Coral: `#F05A30`
  - Accent / Dark Navy: `#060B1F`
  - Tint & Backgrounds: `#FDEEEA`, `#FAFAFB`
  - Semantic Green (Good): `#10B981`
  - Semantic Amber (Needs Improvement): `#F59E0B`
- **Responsive Scaling (`scale.ts`)**: Base guideline layout ($375 \times 812$) using `scale`, `verticalScale`, and `moderateScale` for seamless rendering across screen densities and tablets.
- **Theme Support**: Built-in Dark & Light mode toggle with responsive contrast adjustments.

---

## 🏗️ Architecture & Project Structure

```plaintext
VaniAssessmentApp/
├── src/
│   ├── shared/
│   │   ├── utils/
│   │   │   └── scale.ts              # Responsive scaling helpers (s, vs, ms, mvs)
│   │   ├── theme/
│   │   │   ├── colors.ts             # Vani.Coach brand color tokens (Light & Dark)
│   │   │   ├── typography.ts         # Standardized font weights and scales
│   │   │   ├── spacing.ts            # Margins, paddings, and border radii
│   │   │   ├── shadows.ts            # Platform elevation presets
│   │   │   └── ThemeContext.tsx      # Global theme provider & useTheme hook
│   │   └── components/
│   │       ├── AppText.tsx           # Scaled, themed typography primitive
│   │       ├── Card.tsx              # Elevated surface container
│   │       ├── Badge.tsx             # Semantic pills (Recorded/Text, Good/Needs Improvement)
│   │       ├── ScoreIndicator.tsx    # Evaluation badge with score denominator
│   │       └── Header.tsx            # Top screen header with theme toggle
│   │
│   └── features/
│       └── assessments/
│           ├── types/
│           │   └── assessment.ts     # TypeScript models (AssessmentResult, Filter, Stats)
│           ├── data/
│           │   └── mockAssessments.ts# Sample data (includes all 4 questions from assessment PDF)
│           ├── hooks/
│           │   └── useAssessments.ts # Business logic: filtering, search, stats aggregation
│           ├── components/
│           │   ├── AssessmentCard.tsx# Memoized assessment item with AI feedback
│           │   ├── AssessmentStats.tsx# Metric banner (Avg Score, Completed, Breakdown)
│           │   ├── AssessmentFilter.tsx# Segmented filter & candidate test controls
│           │   └── EmptyState.tsx    # Zero completed state screen
│           └── screens/
│               └── AssessmentResultsScreen.tsx # Main optimized FlatList screen
│
├── App.tsx                           # Root component wrapped in ThemeProvider & SafeArea
├── app.json                          # Native bundle identifier & config
├── package.json
└── tsconfig.json
```

---

## ⚡ Performance Considerations

As requested in the candidate exercise (*"Assume that a user may have a large number of assessment results"*), the following optimizations are implemented:

1. **Virtualization with `FlatList`**:
   - `initialNumToRender={6}`: Quick initial paint without blocking the JS thread.
   - `maxToRenderPerBatch={8}`: Controls offscreen rendering batches during fast flings.
   - `windowSize={5}`: Low memory footprint by maintaining only 2 screens above and below.
   - `removeClippedSubviews={true}`: Frees native drawing buffers for items outside the viewport.
2. **Memoized Components**:
   - `AssessmentCard` is wrapped in `React.memo` to prevent re-renders when parent state updates.
   - `keyExtractor` and `renderItem` handlers use `useCallback`.
3. **O(N) Single-Pass Statistics**:
   - Metrics (Average Score, Good vs. Needs Improvement distribution) are calculated in a single pass memoized in `useAssessments`.

---

## 🚀 How to Run the App

### Prerequisites
- Node.js (v20+)
- Yarn (`npm install -g yarn`)
- Android Studio / Emulator or Xcode (for iOS)

### 1. Install Dependencies
```bash
yarn install
```

### 2. Run on Android Emulator
```bash
yarn android
# or: npx expo run:android
```

### 3. Run on iOS Simulator (macOS only)
```bash
yarn ios
# or: npx expo run:ios
```

### 4. Run on Web (Instant Preview)
```bash
yarn web
```

---

## 🧪 Testing the Requirements

The top filter bar includes interactive action buttons specifically for assessment evaluation:
- **All / Recorded / Text**: Toggles type filtering.
- **View Pending**: Shows un-evaluated submissions to demonstrate pending handling.
- **Test Empty State**: Simulates the 0 completed items edge case to demonstrate the empty state UI.
- **60+ Items (Scale)**: Injects 60 mock assessments to demonstrate high-volume scroll performance.
- **Refresh Icon**: Resets back to the original assessment dataset.
