export const LeadActivityComposerMode = {
  CALL: "call",
  EMAIL: "email",
  NOTE: "note",
} as const;

export type LeadActivityComposerMode =
  (typeof LeadActivityComposerMode)[keyof typeof LeadActivityComposerMode];

export const LeadTimelineItemKind = {
  CALL: "call",
  EMAIL: "email",
  NOTE: "note",
  SYSTEM: "system",
} as const;

export type LeadTimelineItemKind =
  (typeof LeadTimelineItemKind)[keyof typeof LeadTimelineItemKind];

export type LeadTimelineItem = {
  actorName: string;
  description: string;
  id: string;
  kind: LeadTimelineItemKind;
  occurredAtLabel: string;
  title: string;
};
