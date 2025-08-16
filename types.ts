export type Sender = 'user' | 'ai';

export interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
  timestamp: string;
}

export interface Business {
    id: string;
    name: string;
    icon: string;
    color: string;
}

export type JobStatus = 'Booked' | 'In Progress' | 'Complete' | 'Cancelled';
export type JobPriority = 'Low' | 'Medium' | 'High' | 'Emergency';

export interface Job {
    id: string;
    date: string;
    customerName: string;
    address: string;
    postcode: string;
    jobType: string;
    priority: JobPriority;
    status: JobStatus;
    cost: number;
    paid: boolean;
}

export interface CalendarEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    jobType: string;
    customer: string;
}

export interface Report {
    id: string;
    ref: string;
    customer: string;
    address: string;
    jobType: string;
    fileName: string;
    fileSize: string;
    date: string;
}
