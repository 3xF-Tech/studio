
import { addDays } from 'date-fns';

export type Patient = {
  id: string;
  name: string;
  email: string;
  phone: string;
  lastVisit: string;
  nextAppointment: string | null;
  status: 'Active' | 'Inactive';
};

export const mockPatients: Patient[] = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', phone: '123-456-7890', lastVisit: '2024-04-10', nextAppointment: '2024-05-15', status: 'Active' },
  { id: '2', name: 'Bob Williams', email: 'bob@example.com', phone: '234-567-8901', lastVisit: '2024-03-22', nextAppointment: null, status: 'Inactive' },
  { id: '3', name: 'Charlie Brown', email: 'charlie@example.com', phone: '345-678-9012', lastVisit: '2024-04-18', nextAppointment: '2024-05-20', status: 'Active' },
  { id: '4', name: 'Diana Miller', email: 'diana@example.com', phone: '456-789-0123', lastVisit: '2024-02-01', nextAppointment: '2024-05-12', status: 'Active' },
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
    { id: 'a1', patientName: 'Alice Johnson', procedure: 'Botox', startTime: new Date(new Date().setHours(9, 0, 0, 0)), endTime: new Date(new Date().setHours(10, 0, 0, 0)), status: 'Confirmed', price: 350 },
    { id: 'a2', patientName: 'Eve Davis', procedure: 'Filler', startTime: new Date(new Date().setHours(10, 30, 0, 0)), endTime: new Date(new Date().setHours(11, 30, 0, 0)), status: 'Confirmed', price: 500 },
    { id: 'a3', patientName: 'Frank White', procedure: 'Consultation', startTime: new Date(new Date().setHours(12, 0, 0, 0)), endTime: new Date(new Date().setHours(12, 30, 0, 0)), status: 'Pending', price: 200 },
    { id: 'a4', patientName: 'Grace Lee', procedure: 'Laser', startTime: new Date(addDays(today, 3).setHours(14, 0, 0, 0)), endTime: new Date(addDays(today, 3).setHours(15, 0, 0, 0)), status: 'Confirmed', price: 450 },
    { id: 'a5', patientName: 'Heidi Black', procedure: 'Check-up', startTime: new Date(addDays(today, 5).setHours(11, 0, 0, 0)), endTime: new Date(addDays(today, 5).setHours(11, 45, 0, 0)), status: 'Confirmed', price: 250 },
];

export type FinancialRecord = {
    id: string;
    patientName: string;
    date: string;
    amount: number;
    status: 'Paid' | 'Pending' | 'Overdue';
    paymentMethod: 'Credit Card' | 'PIX' | 'Bank Transfer';
};

export const mockFinancials: FinancialRecord[] = [
    { id: 'f1', patientName: 'Alice Johnson', date: '2024-04-10', amount: 350, status: 'Paid', paymentMethod: 'Credit Card' },
    { id: 'f2', patientName: 'Charlie Brown', date: '2024-04-18', amount: 500, status: 'Pending', paymentMethod: 'PIX' },
    { id: 'f3', patientName: 'Bob Williams', date: '2024-03-22', amount: 200, status: 'Paid', paymentMethod: 'Bank Transfer' },
    { id: 'f4', patientName: 'Grace Lee', date: '2024-03-15', amount: 450, status: 'Overdue', paymentMethod: 'PIX' },
]

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
