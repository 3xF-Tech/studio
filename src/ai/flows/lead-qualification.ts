// This file uses server-side code, and must have the `'use server'` directive.
'use server';

/**
 * @fileOverview AI-powered agent to pre-qualify leads for aesthetic procedures.
 *
 * - leadQualification - A function that handles the lead qualification process.
 * - LeadQualificationInput - The input type for the leadQualification function.
 * - LeadQualificationOutput - The return type for the leadQualification function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LeadQualificationInputSchema = z.object({
  procedureOfInterest: z
    .string()
    .describe('The aesthetic procedure the patient is interested in.'),
  patientInformation: z.string().describe('Information about the patient, including their concerns, medical history, and desired outcomes.'),
  knowledgeBase: z.string().describe('Knowledge base of procedures and patient profiles.'),
});
export type LeadQualificationInput = z.infer<typeof LeadQualificationInputSchema>;

const LeadQualificationOutputSchema = z.object({
  isQualified: z
    .boolean()
    .describe('Whether the patient is qualified for the procedure.'),
  reason: z.string().describe('The reason for the qualification decision.'),
  nextSteps: z.string().describe('Recommended next steps for the patient.'),
});
export type LeadQualificationOutput = z.infer<typeof LeadQualificationOutputSchema>;

export async function leadQualification(input: LeadQualificationInput): Promise<LeadQualificationOutput> {
  return leadQualificationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'leadQualificationPrompt',
  input: {schema: LeadQualificationInputSchema},
  output: {schema: LeadQualificationOutputSchema},
  prompt: `You are an AI assistant designed to pre-qualify patients for aesthetic procedures.

  Based on the following knowledge base, information provided by the patient, and the procedure they are interested in, determine if they are a good candidate for the procedure.

  Knowledge Base:
  {{knowledgeBase}}

  Procedure of Interest: {{procedureOfInterest}}
  Patient Information: {{patientInformation}}

  Provide a reason for your decision and suggest the next steps for the patient.

  Considerations:
  - Patient suitability based on the knowledge base.
  - Potential risks or contraindications.
  - Alignment of patient expectations with procedure outcomes.

  Output:
  - isQualified: true or false
  - reason: A detailed explanation for the qualification decision.
  - nextSteps: Recommended actions for the patient (e.g., schedule a consultation, further research).`,
});

const leadQualificationFlow = ai.defineFlow(
  {
    name: 'leadQualificationFlow',
    inputSchema: LeadQualificationInputSchema,
    outputSchema: LeadQualificationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
