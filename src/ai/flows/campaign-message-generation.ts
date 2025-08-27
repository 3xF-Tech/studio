'use server';

/**
 * @fileOverview A flow for generating personalized campaign messages based on promotional content and patient profiles.
 *
 * - generateCampaignMessage - A function that generates a personalized campaign message.
 * - CampaignMessageInput - The input type for the generateCampaignMessage function.
 * - CampaignMessageOutput - The return type for the generateCampaignMessage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CampaignMessageInputSchema = z.object({
  patientProfile: z
    .string()
    .describe('The profile of the patient, including their interests and past interactions.'),
  promotionalContent: z
    .string()
    .describe('The details of the promotional campaign, including the service being promoted and any special offers.'),
});
export type CampaignMessageInput = z.infer<typeof CampaignMessageInputSchema>;

const CampaignMessageOutputSchema = z.object({
  message: z.string().describe('The personalized campaign message.'),
});
export type CampaignMessageOutput = z.infer<typeof CampaignMessageOutputSchema>;

export async function generateCampaignMessage(input: CampaignMessageInput): Promise<CampaignMessageOutput> {
  return generateCampaignMessageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'campaignMessagePrompt',
  input: {schema: CampaignMessageInputSchema},
  output: {schema: CampaignMessageOutputSchema},
  prompt: `You are an expert marketing assistant specializing in creating personalized campaign messages.

  Based on the patient's profile and the promotional content, generate a personalized message that will resonate with the patient and encourage them to take action.

  Patient Profile: {{{patientProfile}}}
  Promotional Content: {{{promotionalContent}}}

  Message:`, // Ensure the 'Message:' prefix for consistent output.
});

const generateCampaignMessageFlow = ai.defineFlow(
  {
    name: 'generateCampaignMessageFlow',
    inputSchema: CampaignMessageInputSchema,
    outputSchema: CampaignMessageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

