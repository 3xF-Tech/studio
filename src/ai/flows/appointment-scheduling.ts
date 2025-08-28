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
  selectedDays: z.array(z.string()).describe("The patient's desired days of the week."),
});
export type ScheduleAppointmentInput = z.infer<typeof ScheduleAppointmentInputSchema>;

const ScheduleAppointmentOutputSchema = z.object({
  suggestedAppointmentTimes: z.array(z.string()).describe('Suggested appointment times based on the doctor\'s availability.'),
  confirmationMessage: z.string().describe('A confirmation message for the appointment.'),
});
export type ScheduleAppointmentOutput = z.infer<typeof ScheduleAppointmentOutputSchema>;

export async function scheduleAppointment(input: ScheduleAppointmentInput): Promise<ScheduleAppointmentOutput> {
  return scheduleAppointmentFlow(input);
}

const getAvailableTimes = ai.defineTool({
  name: 'getAvailableTimes',
  description: 'Retrieves available appointment times from the doctor\'s Google Calendar for a given procedure and selected weekdays.',
  inputSchema: z.object({
    procedure: z.string().describe('The procedure for which to find available times.'),
    selectedDays: z.array(z.string()).describe('The patient\'s desired days of the week.'),
  }),
  outputSchema: z.array(z.string()).describe('A list of available appointment times.'),
}, async (input) => {
  // In a real application, this would connect to the Google Calendar API
  // using the credentials from the settings page to fetch genuinely free slots.
  
  // For demonstration purposes, we return static dummy data,
  // filtered by the selected days.
  console.log(`Buscando horários para: ${input.procedure} nos dias: ${input.selectedDays.join(', ')}`);
  
  const allTimes = [
    'Segunda-feira, 14:00 - 15:00',
    'Terça-feira, 10:00 - 11:00',
    'Terça-feira, 11:00 - 12:00',
    'Quarta-feira, 16:00 - 17:00',
    'Quinta-feira, 09:00 - 10:00',
    'Sexta-feira, 09:00 - 10:00',
    'Sexta-feira, 10:00 - 11:00',
  ];

  if (input.selectedDays.length === 0) {
    return allTimes; // Return all if no specific day is selected
  }

  const filteredTimes = allTimes.filter(time => 
    input.selectedDays.some(day => time.toLowerCase().startsWith(day.toLowerCase()))
  );

  return filteredTimes.length > 0 ? filteredTimes : ["Nenhum horário encontrado para os dias selecionados."];
});

const prompt = ai.definePrompt({
  name: 'scheduleAppointmentPrompt',
  input: {schema: z.object({
      patientName: z.string(),
      procedure: z.string(),
      suggestedAppointmentTimes: z.array(z.string()),
  })},
  output: {schema: ScheduleAppointmentOutputSchema},
  tools: [getAvailableTimes],
  prompt: `Você é um assistente de IA agendando consultas para a Dra. Fabiana Carvalhal.

  O nome do paciente é: {{{patientName}}}.
  Eles estão interessados em: {{{procedure}}}.

  Gere uma mensagem de confirmação amigável e inclua a lista de horários.
  Se não houver horários, informe o paciente.

  Horários disponíveis:
  {{#each suggestedAppointmentTimes}}
  - {{{this}}}
  {{/each}}
`,
});

const scheduleAppointmentFlow = ai.defineFlow(
  {
    name: 'scheduleAppointmentFlow',
    inputSchema: ScheduleAppointmentInputSchema,
    outputSchema: ScheduleAppointmentOutputSchema,
  },
  async input => {
    const availableTimes = await getAvailableTimes({
      procedure: input.procedure,
      selectedDays: input.selectedDays,
    });

    const {output} = await prompt({
      patientName: input.patientName,
      procedure: input.procedure,
      suggestedAppointmentTimes: availableTimes,
    });
    
    if (!output) {
      throw new Error("A IA não conseguiu gerar uma sugestão de agendamento.");
    }
    
    // The output from the prompt already contains the suggested times
    // so we can just return it directly.
    return output;
  }
);
