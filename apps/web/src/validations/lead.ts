import { z } from "zod";

import { LeadSource } from "@/enums/lead.enums.ts";
import { LeadPreferredContactMethod } from "@/services/lead.types.ts";

const leadSourceValues = Object.values(LeadSource) as [
  (typeof LeadSource)[keyof typeof LeadSource],
  ...(typeof LeadSource)[keyof typeof LeadSource][],
];

const preferredContactMethodValues = Object.values(
  LeadPreferredContactMethod,
) as [
  (typeof LeadPreferredContactMethod)[keyof typeof LeadPreferredContactMethod],
  ...(typeof LeadPreferredContactMethod)[keyof typeof LeadPreferredContactMethod][],
];

export const createLeadSchema = z
  .object({
    assignedToId: z
      .string()
      .refine((value) => value === "" || z.uuid().safeParse(value).success, {
        message: "Assigned user is invalid",
      }),
    customerName: z
      .string()
      .trim()
      .min(1, "Customer name is required")
      .max(200, "Customer name must be 200 characters or fewer"),
    email: z
      .string()
      .trim()
      .min(1, "Email address is required")
      .max(320, "Email address must be 320 characters or fewer")
      .email("Enter a valid email address"),
    inquiry: z
      .string()
      .trim()
      .max(4000, "Inquiry must be 4000 characters or fewer"),
    phone: z
      .string()
      .trim()
      .max(50, "Phone number must be 50 characters or fewer"),
    preferredContactMethod: z.enum(preferredContactMethodValues),
    source: z
      .string()
      .refine((value) => leadSourceValues.includes(value as (typeof leadSourceValues)[number]), {
        message: "Lead source is required",
      }),
  })
  .superRefine((values, context) => {
    if (
      values.preferredContactMethod !== LeadPreferredContactMethod.EMAIL &&
      values.phone.trim().length === 0
    ) {
      context.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Phone number is required for the selected preferred contact method",
        path: ["phone"],
      });
    }
  });

export type CreateLeadFormValues = z.infer<typeof createLeadSchema>;
