/**
 * useAssessmentStore — Zustand store with MMKV persistence
 *
 * Pattern: AmrutamSuperApp
 * - Persists to MMKV via mmkvAdapter
 * - All derived data computed via selectors
 * - Follows Vani.Coach PDF specification
 */
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvAdapter } from '@/core/storage';
import { navigate, NAVIGATION } from '@/navigation';
import type {
  AssessmentResult,
  AssessmentFilterType,
  PerformanceFilterType,
  AssessmentStatsSummary,
} from '@/features/assessments/types';

export type TabType = 'results' | 'practice' | 'analytics';

export const PDF_EXAMPLE_ASSESSMENTS: AssessmentResult[] = [
  {
    id: 'pdf-scenario-1',
    question: 'Tell me about yourself',
    assessmentType: 'Recorded',
    score: 82,
    status: 'Completed',
    feedback:
      'Strong structured narrative following the Present-Past-Future framework. Good executive presence and vocal pace. Highlight: Clearly articulated career trajectory and key milestones.',
    submittedAt: 'Today, 10:15 AM',
    duration: '1m 24s',
  },
  {
    id: 'pdf-scenario-2',
    question: 'Describe a challenging situation',
    assessmentType: 'Recorded',
    score: 65,
    status: 'Completed',
    feedback:
      'Identified the challenge well, but lacked a clear quantifiable result under the STAR framework. Try reducing filler words and emphasize your specific resolution actions.',
    submittedAt: 'Today, 11:30 AM',
    duration: '2m 05s',
  },
  {
    id: 'pdf-scenario-3',
    question: 'Write a professional email to your manager',
    assessmentType: 'Text',
    score: 78,
    status: 'Completed',
    feedback:
      'Clear, concise subject line and courteous professional tone. Action items are highlighted nicely with bullet points. Strong business communication etiquette.',
    submittedAt: 'Today, 2:45 PM',
    duration: '142 words',
  },
  {
    id: 'pdf-scenario-4',
    question: 'Explain your current project',
    assessmentType: 'Recorded',
    score: null,
    status: 'Pending',
    feedback: null,
    submittedAt: 'Today, 4:10 PM',
    duration: '1m 15s',
  },
];

// ─── State shape ──────────────────────────────────────────────────────────────

interface AssessmentState {
  // Persisted data
  assessments: AssessmentResult[];

  // UI state
  activeTab: TabType;
  filterType: AssessmentFilterType;
  performanceFilter: PerformanceFilterType;
  searchQuery: string;
  showPending: boolean;
  isRefreshing: boolean;

  // Actions
  addAssessment: (
    item: Omit<AssessmentResult, 'id' | 'submittedAt'> & { submittedAt?: string }
  ) => void;
  removeAssessment: (id: string) => void;
  clearAllCompleted: () => void;
  clearAll: () => void;
  loadPdfExampleData: () => void;
  generateStressTestData: (count?: number) => void;
  loadMoreDummyData: (count?: number) => void;
  appendMockBatch: (count?: number, isPending?: boolean) => void;
  evaluatePendingAssessment: (id: string) => void;

  // UI actions
  setActiveTab: (tab: TabType) => void;
  setFilterType: (type: AssessmentFilterType) => void;
  setPerformanceFilter: (filter: PerformanceFilterType) => void;
  setSearchQuery: (query: string) => void;
  setShowPending: (value: boolean) => void;
  triggerRefresh: () => void;
}

export const useAssessmentStore = create<AssessmentState>()(
  persist(
    (set, get) => ({
      assessments: [],

      activeTab: 'results',
      filterType: 'All',
      performanceFilter: 'All',
      searchQuery: '',
      showPending: false,
      isRefreshing: false,

      // ── Data mutations ───────────────────────────────────────────────────

      addAssessment: (item) => {
        const newRecord: AssessmentResult = {
          ...item,
          id: `eval_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
          submittedAt: item.submittedAt ?? 'Just now',
        };
        set((state) => ({
          assessments: [newRecord, ...state.assessments],
        }));
      },

      removeAssessment: (id) => {
        set((state) => ({
          assessments: state.assessments.filter((a) => a.id !== id),
        }));
      },

      clearAllCompleted: () => {
        // Deletes all mock data, completed AND pending
        set({ assessments: [] });
      },

      clearAll: () => {
        set({ assessments: [] });
      },

      loadPdfExampleData: () => {
        set({ assessments: [...PDF_EXAMPLE_ASSESSMENTS] });
      },

      appendMockBatch: (count = 4, isPending = false) => {
        const questions = [
          "How do you communicate a critical release delay to stakeholders?",
          "Explain your technical architecture and design trade-offs",
          "Describe a time you resolved a conflict with a cross-functional peer",
          "Draft an executive response to an urgent client escalation",
          "Tell me about a high-impact project you led from inception to launch",
          "Explain a complex technical concept to a non-technical executive",
          "Write a constructive performance review summary for a peer",
          "How do you negotiate scope boundaries during quarterly roadmap planning?",
          "Deliver an impactful 60-second value pitch for your core product",
          "How do you mentor an engineer struggling with communication clarity?",
        ];

        const feedbacks = [
          "Strong structured delivery following the STAR framework. Clear executive presence and confident vocal pace.",
          "Identified the core challenge well. Good active listening and courteous, authoritative business tone.",
          "Clear, concise narrative with great bullet-point hierarchy. Action items are easy for leadership to scan.",
          "Polite and well-structured. Good empathy demonstrated. Practice reducing hesitation pauses for maximum impact.",
          "Exceptional clarity on technical trade-offs. Confident inflection and strong business communication etiquette.",
        ];

        const newItems: AssessmentResult[] = Array.from({ length: count }, (_, i) => {
          const isRecorded = Math.random() > 0.45;
          const score = isPending ? null : Math.floor(Math.random() * 26) + 70; // 70-95
          const qIdx = Math.floor(Math.random() * questions.length);
          const fIdx = Math.floor(Math.random() * feedbacks.length);
          const daysAgo = Math.floor(Math.random() * 6) + 2;

          return {
            id: `stream_${Date.now()}_${i}_${Math.random().toString(36).substring(2, 7)}`,
            question: questions[qIdx],
            assessmentType: isRecorded ? "Recorded" : "Text",
            score,
            status: isPending ? "Pending" : "Completed",
            feedback: isPending ? null : feedbacks[fIdx],
            submittedAt: `${daysAgo}d ago`,
            duration: isRecorded
              ? `${Math.floor(Math.random() * 70) + 40}s`
              : `${Math.floor(Math.random() * 110) + 85} words`,
          };
        });

        set((state) => ({
          assessments: [...state.assessments, ...newItems],
        }));
      },

      evaluatePendingAssessment: (id) => {
        set((state) => ({
          assessments: state.assessments.map((item) => {
            if (item.id === id && item.status === 'Pending') {
              const generatedScore = Math.floor(Math.random() * 26) + 70; // 70 - 95
              return {
                ...item,
                status: 'Completed',
                score: generatedScore,
                feedback: `Vani AI Coach Analysis: Clear articulation of core project objectives. Good pacing, concise technical summary. Recommended focus area: Quantify business impact with concrete metrics.`,
                submittedAt: 'Just evaluated',
              };
            }
            return item;
          }),
        }));
      },

      loadMoreDummyData: (count = 20) => get().generateStressTestData(count),
      generateStressTestData: (count = 50) => {
        const questions = [
          'Explain your technical architecture and design trade-offs',
          'Describe how you handle conflict with a cross-functional peer',
          'How do you communicate a critical release delay to stakeholders?',
          'Tell me about a high-impact project you led from inception to launch',
          'Explain a complex distributed systems concept to a junior engineer',
          'Draft a response to an urgent client escalation regarding an outage',
        ];
        const feedbacks = [
          'Excellent executive clarity and structured points. Direct and authoritative tone.',
          'Strong framing using STAR. Vocal inflection conveyed confidence and high empathy.',
          'Good problem explanation, but lacked measurable metrics in the resolution step.',
          'Concise and actionable email response with great formatting and courteous tone.',
        ];

        const stressItems: AssessmentResult[] = Array.from({ length: count }, (_, i) => {
          const isCompleted = Math.random() > 0.15;
          const isRecorded = Math.random() > 0.45;
          const score = isCompleted ? Math.floor(Math.random() * 41) + 58 : null; // 58 - 98

          return {
            id: `stress_${Date.now()}_${i}`,
            question: questions[i % questions.length],
            assessmentType: isRecorded ? 'Recorded' : 'Text',
            score,
            status: isCompleted ? 'Completed' : 'Pending',
            feedback: isCompleted ? feedbacks[i % feedbacks.length] : null,
            submittedAt: `${Math.floor(i / 3) + 1}d ago`,
            duration: isRecorded ? `${Math.floor(Math.random() * 90) + 30}s` : `${Math.floor(Math.random() * 100) + 80} words`,
          };
        });

        set((state) => ({
          assessments: [...stressItems, ...state.assessments],
        }));
      },

      // ── UI actions ────────────────────────────────────────────────────────

      setActiveTab: (tab) => {
        if (get().activeTab === tab) return;
        set({ activeTab: tab });
        if (tab === 'results') {
          navigate(NAVIGATION.RESULTS);
        } else if (tab === 'practice') {
          navigate(NAVIGATION.PRACTICE);
        } else if (tab === 'analytics') {
          navigate(NAVIGATION.ANALYTICS);
        }
      },

      setFilterType: (type) => set({ filterType: type }),
      setPerformanceFilter: (filter) => set({ performanceFilter: filter }),
      setSearchQuery: (query) => set({ searchQuery: query }),
      setShowPending: (value) => set({ showPending: value }),

      triggerRefresh: () => {
        set({ isRefreshing: true });
        setTimeout(() => set({ isRefreshing: false }), 600);
      },
    }),
    {
      name: 'vani_assessment_store_v2',
      storage: createJSONStorage(() => mmkvAdapter),
      partialize: (state) => ({
        assessments: state.assessments,
      }),
    }
  )
);