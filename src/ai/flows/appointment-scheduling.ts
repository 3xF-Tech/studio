'use server';
/**
 * @fileOverview AI-assisted appointment scheduling flow.
 *
 * - scheduleAppointment - A function that handles the appointment scheduling process.
 * - ScheduleAppointmentInput - The input type for the scheduleAppointment function.
 * - ScheduleAppointmentOutput - The return type for the scheduleAppointment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScheduleAppointmentInputSchema = z.object({
  patientName: z.string().describe('The name of the patient.'),
  procedure: z.string().describe('The desired procedure.'),
  availability: z.string().describe('The patient\'s general availability.'),
});
export type ScheduleAppointmentInput = z.infer<typeof ScheduleAppointmentInputSchema>;

const ScheduleAppointmentOutputSchema = z.object({
  suggestedAppointmentTimes: z.array(z.string()).describe('Suggested appointment times based on doctor\'s availability.'),
  confirmationMessage: z.string().describe('A confirmation message for the appointment.'),
});
export type ScheduleAppointmentOutput = z.infer<typeof ScheduleAppointmentOutputSchema>;

export async function scheduleAppointment(input: ScheduleAppointmentInput): Promise<ScheduleAppointmentOutput> {
  return scheduleAppointmentFlow(input);
}

const getAvailableTimes = ai.defineTool({
  name: 'getAvailableTimes',
  description: 'Retrieves available appointment times from the doctor\'s Google Calendar.',
  inputSchema: z.object({
    procedure: z.string().describe('The procedure for which to find available times.'),
    availability: z.string().describe('The patient\'s general availability.'),
  }),
  outputSchema: z.array(z.string()).describe('A list of available appointment times.'),
}, async (input) => {
  // TODO: Implement Google Calendar integration to fetch available times.
  // Replace with actual Google Calendar API call.
  // For now, return some dummy data.
  return ['Monday at 2:00 PM', 'Wednesday at 10:00 AM', 'Friday at 3:00 PM'];
});

const prompt = ai.definePrompt({
  name: 'scheduleAppointmentPrompt',
  input: {schema: ScheduleAppointmentInputSchema},
  output: {schema: ScheduleAppointmentOutputSchema},
  tools: [getAvailableTimes],
  prompt: `You are an AI assistant scheduling appointments for Dr. Carvalhal.

  The patient name is: {{{patientName}}}.
  They are interested in: {{{procedure}}}.
  Their availability is: {{{availability}}}.

  First, use the getAvailableTimes tool to check the doctor\'s Google Calendar and find suitable appointment times for the specified procedure and patient availability.

  Based on the available times, suggest three appointment times to the patient.

  Generate a confirmation message for the selected appointment time.

  Output the suggested appointment times and the confirmation message in the specified JSON format.
`,
});

const scheduleAppointmentFlow = ai.defineFlow(
  {
    name: 'scheduleAppointmentFlow',
    inputSchema: ScheduleAppointmentInputSchema,
    outputSchema: ScheduleAppointmentOutputSchema,
  },
  async input => {
    const {suggestedAppointmentTimes} = await getAvailableTimes({
      procedure: input.procedure,
      availability: input.availability,
    });
    const {output} = await prompt({
      ...input,
      suggestedAppointmentTimes,
    });
    return output!;
  }
);
