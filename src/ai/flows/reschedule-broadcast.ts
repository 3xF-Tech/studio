
'use server';

/**
 * @fileOverview A flow for broadcasting a reschedule notification to affected patients.
 *
 * - rescheduleBroadcast - A function that finds affected patients and generates personalized messages.
 * - RescheduleBroadcastInput - The input type for the rescheduleBroadcast function.
 * - RescheduleBroadcastOutput - The return type for the rescheduleBroadcast function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import { mockAppointments } from '@/lib/data';
import { parse, isWithinInterval } from 'date-fns';

const RescheduleBroadcastInputSchema = z.object({
  startDate: z.string().describe('The start date of the period to clear (YYYY-MM-DD).'),
  startTime: z.string().describe('The start time of the period to clear (HH:mm).'),
  endDate: z.string().describe('The end date of the period to clear (YYYY-MM-DD).'),
  endTime: z.string().describe('The end time of the period to clear (HH:mm).'),
  baseMessage: z.string().describe('The base message to be sent to patients.'),
});
export type RescheduleBroadcastInput = z.infer<typeof RescheduleBroadcastInputSchema>;

const RescheduleBroadcastOutputSchema = z.object({
  notifications: z.array(
    z.object({
      patientName: z.string(),
      personalizedMessage: z.string(),
    })
  ).describe('A list of personalized notifications to be sent.'),
});
export type RescheduleBroadcastOutput = z.infer<typeof RescheduleBroadcastOutputSchema>;


export async function rescheduleBroadcast(input: RescheduleBroadcastInput): Promise<RescheduleBroadcastOutput> {
  return rescheduleBroadcastFlow(input);
}


const findAffectedAppointmentsTool = ai.defineTool({
    name: 'findAffectedAppointments',
    description: 'Finds appointments within a given date and time range.',
    inputSchema: z.object({
        startDateTime: z.date(),
        endDateTime: z.date(),
    }),
    outputSchema: z.array(
        z.object({
            patientName: z.string(),
            procedure: z.string(),
            appointmentTime: z.string(),
        })
    ),
}, async ({ startDateTime, endDateTime }) => {
    // This is a simulation. In a real application, this would query a database
    // or the Google Calendar API to find appointments within the specified interval.
    const affected = mockAppointments.filter(apt => 
        isWithinInterval(apt.startTime, { start: startDateTime, end: endDateTime })
    );

    return affected.map(apt => ({
        patientName: apt.patientName,
        procedure: apt.procedure,
        appointmentTime: apt.startTime.toISOString(),
    }));
});


const personalizeMessagePrompt = ai.definePrompt({
    name: 'personalizeBroadcastMessage',
    input: { schema: z.object({
        patientName: z.string(),
        baseMessage: z.string(),
    })},
    output: { schema: z.object({
        personalizedMessage: z.string()
    })},
    prompt: `You are a helpful assistant. Personalize the following message for the given patient. Be friendly and empathetic.

    Patient Name: {{{patientName}}}
    Base Message: {{{baseMessage}}}
    
    Personalized Message:`,
});

const rescheduleBroadcastFlow = ai.defineFlow(
  {
    name: 'rescheduleBroadcastFlow',
    inputSchema: RescheduleBroadcastInputSchema,
    outputSchema: RescheduleBroadcastOutputSchema,
  },
  async (input) => {
    const startDateTime = parse(`${input.startDate} ${input.startTime}`, 'yyyy-MM-dd HH:mm', new Date());
    const endDateTime = parse(`${input.endDate} ${input.endTime}`, 'yyyy-MM-dd HH:mm', new Date());

    const affectedAppointments = await findAffectedAppointmentsTool({
        startDateTime,
        endDateTime
    });
    
    if (affectedAppointments.length === 0) {
        return { notifications: [] };
    }

    const notificationPromises = affectedAppointments.map(async (appointment) => {
      const { output } = await personalizeMessagePrompt({
        patientName: appointment.patientName,
        baseMessage: input.baseMessage,
      });
      return {
        patientName: appointment.patientName,
        personalizedMessage: output!.personalizedMessage,
      };
    });
    
    const notifications = await Promise.all(notificationPromises);

    return { notifications };
  }
);
