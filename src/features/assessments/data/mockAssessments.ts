import { AssessmentResult } from '../types/assessment';

export const INITIAL_ASSESSMENTS: AssessmentResult[] = [
  // 4 Questions from PDF Example Scenario
  {
    id: 'asmt-001',
    question: 'Tell me about yourself',
    assessmentType: 'Recorded',
    score: 82,
    status: 'Completed',
    feedback:
      'Strong opening with clear articulation of career milestones. Good pacing and confident tone. Try to quantify your achievements more specifically to make a stronger impact.',
    submittedAt: 'Today, 10:30 AM',
    duration: '1m 45s',
  },
  {
    id: 'asmt-002',
    question: 'Describe a challenging situation',
    assessmentType: 'Recorded',
    score: 65,
    status: 'Completed',
    feedback:
      'Good choice of scenario, but the STAR structure (Situation, Task, Action, Result) was incomplete. The resolution felt rushed, and filler words like "um" and "you know" were frequent.',
    submittedAt: 'Yesterday, 4:15 PM',
    duration: '2m 10s',
  },
  {
    id: 'asmt-003',
    question: 'Write a professional email to your manager',
    assessmentType: 'Text',
    score: 78,
    status: 'Completed',
    feedback:
      'Polite and well-structured email. The call-to-action is clear. Consider using bullet points for key deliverables to enhance readability for busy leadership.',
    submittedAt: 'Sep 4, 2:00 PM',
    duration: '142 words',
  },
  {
    id: 'asmt-004',
    question: 'Explain your current project',
    assessmentType: 'Recorded',
    score: null,
    status: 'Pending',
    feedback: null,
    submittedAt: 'Just now',
    duration: '1m 20s',
  },

  // Additional realistic items for performance and stress testing
  {
    id: 'asmt-005',
    question: 'How do you handle disagreement with a peer?',
    assessmentType: 'Recorded',
    score: 88,
    status: 'Completed',
    feedback:
      'Exceptional empathy and collaborative mindset demonstrated. Great active listening references and calm vocal modulation throughout.',
    submittedAt: 'Sep 3, 11:00 AM',
    duration: '2m 05s',
  },
  {
    id: 'asmt-006',
    question: 'Draft an escalation response for an unhappy client',
    assessmentType: 'Text',
    score: 62,
    status: 'Completed',
    feedback:
      'Tone is slightly defensive. Shift focus from explaining internal delays to acknowledging client frustration and proposing clear remediation timelines.',
    submittedAt: 'Sep 2, 6:40 PM',
    duration: '210 words',
  },
  {
    id: 'asmt-007',
    question: 'Deliver a 60-second elevator pitch for our product',
    assessmentType: 'Recorded',
    score: 91,
    status: 'Completed',
    feedback:
      'Outstanding hook! Clear value proposition delivered within 52 seconds. Energy remained high and memorable throughout the recording.',
    submittedAt: 'Sep 1, 9:20 AM',
    duration: '52s',
  },
  {
    id: 'asmt-008',
    question: 'Summarize the quarterly retrospective findings',
    assessmentType: 'Text',
    score: 74,
    status: 'Completed',
    feedback:
      'Accurate summary with actionable next steps. Formatting could benefit from subheaders to separate engineering vs product takeaways.',
    submittedAt: 'Aug 30, 3:15 PM',
    duration: '185 words',
  },
  {
    id: 'asmt-009',
    question: 'Where do you see your leadership trajectory in 3 years?',
    assessmentType: 'Recorded',
    score: 70,
    status: 'Completed',
    feedback:
      'Good ambition demonstrated. Practice concise speech delivery to avoid circling back to points already established.',
    submittedAt: 'Aug 29, 1:40 PM',
    duration: '1m 55s',
  },
  {
    id: 'asmt-010',
    question: 'Proposal for cross-functional sprint planning alignment',
    assessmentType: 'Text',
    score: null,
    status: 'Pending',
    feedback: null,
    submittedAt: 'Yesterday, 8:00 PM',
    duration: '315 words',
  },
];
