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
  suggestedAppointmentTimes: z.array(z.string()).describe('Suggested appointment times based on the doctor\'s availability.'),
  confirmationMessage: z.string().describe('A confirmation message for the appointment.'),
});
export type ScheduleAppointmentOutput = z.infer<typeof ScheduleAppointmentOutputSchema>;

export async function scheduleAppointment(input: ScheduleAppointmentInput): Promise<ScheduleAppointmentOutput> {
  return scheduleAppointmentFlow(input);
}

const getAvailableTimes = ai.defineTool({
  name: 'getAvailableTimes',
  description: 'Retrieves available appointment times from the doctor\'s Google Calendar for a given procedure and patient availability.',
  inputSchema: z.object({
    procedure: z.string().describe('The procedure for which to find available times.'),
    availability: z.string().describe('The patient\'s general availability.'),
  }),
  outputSchema: z.array(z.string()).describe('A list of available appointment times.'),
}, async (input) => {
  // In a real application, this would connect to the Google Calendar API
  // using the credentials from the settings page to fetch genuinely free slots.
  
  // For demonstration purposes, we return static dummy data.
  // The logic here could be to find the next available slots based on the current time.
  console.log(`Buscando horários para: ${input.procedure} com disponibilidade: ${input.availability}`);
  return [
    'Segunda-feira, 14:00 - 15:00',
    'Terça-feira, 10:00 - 11:00',
    'Quarta-feira, 16:00 - 17:00',
    'Sexta-feira, 09:00 - 10:00',
  ];
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

  Com base nos horários disponíveis fornecidos, gere uma mensagem de confirmação amigável e inclua a lista de horários.

  Horários disponíveis:
  {{#each suggestedAppointmentTimes}}
  - {{{this}}}
  {{/each}}

  Sempre inclua pelo menos 3 sugestões da lista fornecida.
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
      availability: input.availability,
    });

    const {output} = await prompt({
      patientName: input.patientName,
      procedure: input.procedure,
      suggestedAppointmentTimes: availableTimes,
    });
    
    if (!output) {
      throw new Error("A IA não conseguiu gerar uma sugestão de agendamento.");
    }

    // A IA já retorna o objeto no formato correto, incluindo os horários.
    // Apenas garantimos que o retorno da ferramenta seja passado para o prompt
    // e que a saída do prompt seja usada.
    return output;
  }
);
