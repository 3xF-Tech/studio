
import { addDays, addMonths, subMonths } from 'date-fns';

export type PatientPackage = {
    sessions: number;
    totalValue: number;
    days: string;
    time: string;
}

export type Address = {
    street: string;
    number: string;
    complement?: string;
    neighborhood: string;
    city: string;
    state: string;
    zip: string;
}

export type Patient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'Active' | 'Inactive';
  package: PatientPackage | null;
  sessionDuration?: number;
  address?: Address;
};

export const mockPatients: Patient[] = [
  { 
    id: '1', 
    name: 'Alice Johnson', 
    email: 'alice@example.com', 
    phone: '11 91234 5678', 
    status: 'Active', 
    package: { sessions: 10, totalValue: 2000, days: "Segundas", time: "14:00" }, 
    sessionDuration: 50,
    address: { street: 'Rua das Flores', number: '123', neighborhood: 'Jardim das Rosas', city: 'São Paulo', state: 'SP', zip: '01234-567' }
  },
  { id: '2', name: 'Bob Williams', email: 'bob@example.com', phone: '21 92345 6789', status: 'Inactive', package: null, sessionDuration: 50 },
  { 
      id: '3', 
      name: 'Charlie Brown', 
      email: 'charlie@example.com', 
      phone: '31 93456 7890', 
      status: 'Active', 
      package: { sessions: 5, totalValue: 1100, days: "Quartas", time: "10:00" }, 
      sessionDuration: 60,
      address: { street: 'Avenida Principal', number: '456', complement: 'Bloco A', neighborhood: 'Centro', city: 'Campinas', state: 'SP', zip: '13010-001' }
  },
  { id: '4', name: 'Diana Miller', email: 'diana@example.com', phone: '41 94567 8901', status: 'Active', package: null, sessionDuration: 50 },
];

export type Appointment = {
    id: string;
    patientName: string;
    procedure: string;
    startTime: Date;
    endTime: Date;
    status: 'Confirmed' | 'Pending' | 'Cancelled';
    price?: number;
}

const today = new Date();

export const mockAppointments: Appointment[] = [
    { id: 'a1', patientName: 'Alice Johnson', procedure: 'Sessão de Terapia', startTime: new Date(new Date().setHours(9, 0, 0, 0)), endTime: new Date(new Date().setHours(9, 50, 0, 0)), status: 'Confirmed', price: 200 },
    { id: 'a2', patientName: 'Eve Davis', procedure: 'Avaliação Neuropsicológica', startTime: new Date(new Date().setHours(10, 30, 0, 0)), endTime: new Date(new Date().setHours(11, 30, 0, 0)), status: 'Confirmed', price: 500 },
    { id: 'a3', patientName: 'Frank White', procedure: 'Consulta Inicial', startTime: new Date(new Date().setHours(12, 0, 0, 0)), endTime: new Date(new Date().setHours(12, 50, 0, 0)), status: 'Pending', price: 200 },
    { id: 'a4', patientName: 'Grace Lee', procedure: 'Sessão de Terapia', startTime: new Date(addDays(today, 3).setHours(14, 0, 0, 0)), endTime: new Date(addDays(today, 3).setHours(14, 50, 0, 0)), status: 'Confirmed', price: 200 },
    { id: 'a5', patientName: 'Heidi Black', procedure: 'Sessão de Terapia', startTime: new Date(addDays(today, 5).setHours(11, 0, 0, 0)), endTime: new Date(addDays(today, 5).setHours(11, 50, 0, 0)), status: 'Confirmed', price: 200 },
];

export type FinancialRecord = {
    id: string;
    patientName: string;
    issueDate: string;
    paymentDueDate: string;
    amount: number;
    status: 'Paid' | 'Pending' | 'Overdue';
    paymentMethod: 'Credit Card' | 'PIX' | 'Bank Transfer';
};

export const mockFinancials: FinancialRecord[] = [
    { id: 'f1', patientName: 'Alice Johnson', issueDate: today.toISOString(), paymentDueDate: addDays(today, 15).toISOString(), amount: 350, status: 'Paid', paymentMethod: 'Credit Card' },
    { id: 'f2', patientName: 'Charlie Brown', issueDate: addDays(today, -20).toISOString(), paymentDueDate: addDays(today, 10).toISOString(), amount: 500, status: 'Pending', paymentMethod: 'PIX' },
    { id: 'f3', patientName: 'Bob Williams', issueDate: addDays(today, -40).toISOString(), paymentDueDate: addDays(today, -10).toISOString(), amount: 200, status: 'Paid', paymentMethod: 'Bank Transfer' },
    { id: 'f4', patientName: 'Grace Lee', issueDate: addDays(today, -50).toISOString(), paymentDueDate: addDays(today, -20).toISOString(), amount: 450, status: 'Overdue', paymentMethod: 'PIX' },
];

export type ContractPayment = {
    date: Date;
    amount: number;
    status: 'Paid' | 'Pending';
}

export type Contract = {
    id: string;
    patientName: string;
    totalValue: number;
    paymentDates: ContractPayment[];
}

export const mockContracts: Contract[] = [
    {
        id: 'pkg1',
        patientName: 'Alice Johnson',
        totalValue: 2000,
        paymentDates: [
            { date: subMonths(today, 1), amount: 1000, status: 'Paid' },
            { date: addMonths(today, 1), amount: 1000, status: 'Pending' },
        ],
    },
    {
        id: 'pkg2',
        patientName: 'Charlie Brown',
        totalValue: 1100,
        paymentDates: [
            { date: today, amount: 550, status: 'Pending' },
            { date: addMonths(today, 2), amount: 550, status: 'Pending' },
        ],
    },
     {
        id: 'pkg3',
        patientName: 'Outro Paciente',
        totalValue: 3000,
        paymentDates: [
            { date: addMonths(today, 4), amount: 1500, status: 'Pending' },
            { date: addMonths(today, 5), amount: 1500, status: 'Pending' },
        ],
    }
];


export type Campaign = {
    id: string;
    name: string;
    targetAudience: string;
    service: string;
    status: 'Active' | 'Completed' | 'Draft';
    sent: number;
    conversionRate: number;
};

export const mockCampaigns: Campaign[] = [
    { id: 'c1', name: 'Spring Rejuvenation', targetAudience: 'Clients over 40', service: 'Laser Treatment', status: 'Active', sent: 150, conversionRate: 0.12 },
    { id: 'c2', name: 'Summer Glow Up', targetAudience: 'All Clients', service: 'HydraFacial', status: 'Completed', sent: 300, conversionRate: 0.25 },
    { id: 'c3', name: 'New Year, New You', targetAudience: 'Potential Leads', service: 'Consultation Discount', status: 'Draft', sent: 0, conversionRate: 0 },
];

    