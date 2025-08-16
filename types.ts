export type Sender = 'user' | 'ai';

export interface ChatMessage {
  id: string;
  sender: Sender;
  text: string;
  timestamp: string;
  attachment?: {
    name: string;
    type: string;
    url: string;
  };
}

export interface Business {
    id: string;
    name: string;
    icon: string;
    color: string;
}

export interface Product {
    id: string;
    name: string;
    price: string;
    imageUrl: string;
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

export type Responsibility = 'Tenant' | 'Landlord' | 'Wear & Tear' | 'Not Set';
export type Action = 'Clean' | 'Repair' | 'Replace' | 'None';

export interface Comparison {
    id: string;
    area: string;
    item: string;
    checkIn: {
        description: string;
        imageUrl: string;
    };
    checkOut: {
        description: string;
        imageUrl: string;
    };
    analyst: {
        responsibility: Responsibility;
        action: Action;
        cost: number;
        legalComment: string;
    }
}

export interface Case {
    id: string;
    address: string;
    clientRef: string;
    depositScheme: 'TDS' | 'DPS' | 'MyDeposits';
    status: 'Intake' | 'In Analysis' | 'Complete';
    comparisons: Comparison[];
}