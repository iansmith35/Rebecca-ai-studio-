
import { Job, CalendarEvent, Report, Product, Case, Comparison } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const isheJobs: Job[] = [
    {
        id: uuidv4(),
        date: '2024-07-29',
        customerName: 'Alice Johnson',
        address: '123 Oak Avenue, Bristol',
        postcode: 'BS1 4GH',
        jobType: 'Boiler Service',
        priority: 'Medium',
        status: 'Booked',
        cost: 150,
        paid: false,
    },
    {
        id: uuidv4(),
        date: '2024-07-29',
        customerName: 'Robert Smith',
        address: '45 Pine Street, Bristol',
        postcode: 'BS8 1TH',
        jobType: 'Gas Safety Certificate',
        priority: 'High',
        status: 'Booked',
        cost: 200,
        paid: true,
    },
    {
        id: uuidv4(),
        date: '2024-07-30',
        customerName: 'Emily Davis',
        address: '78 Maple Drive, Bristol',
        postcode: 'BS6 5QA',
        jobType: 'Leaky Pipe Repair',
        priority: 'Emergency',
        status: 'In Progress',
        cost: 350,
        paid: false,
    },
    {
        id: uuidv4(),
        date: '2024-07-28',
        customerName: 'Michael Brown',
        address: '90 Elm Close, Bristol',
        postcode: 'BS3 2JB',
        jobType: 'New Radiator Install',
        priority: 'Low',
        status: 'Complete',
        cost: 850,
        paid: true,
    },
    {
        id: uuidv4(),
        date: '2024-08-01',
        customerName: 'Jessica Wilson',
        address: '21 Birch Lane, Bristol',
        postcode: 'BS5 8RU',
        jobType: 'Boiler Replacement Quote',
        priority: 'Medium',
        status: 'Booked',
        cost: 100,
        paid: true,
    },
];

export const isheCalendarEvents: CalendarEvent[] = [
    { id: uuidv4(), title: 'Service - A. Johnson', start: new Date(2024, 6, 29, 9, 0), end: new Date(2024, 6, 29, 11, 0), jobType: 'Boiler Service', customer: 'Alice Johnson' },
    { id: uuidv4(), title: 'Gas Cert - R. Smith', start: new Date(2024, 6, 29, 13, 0), end: new Date(2024, 6, 29, 14, 0), jobType: 'Gas Safety Certificate', customer: 'Robert Smith' },
    { id: uuidv4(), title: 'EMERGENCY - E. Davis', start: new Date(2024, 6, 30, 8, 0), end: new Date(2024, 6, 30, 12, 0), jobType: 'Leaky Pipe Repair', customer: 'Emily Davis' },
    { id: uuidv4(), title: 'Quote - J. Wilson', start: new Date(2024, 7, 1, 15, 0), end: new Date(2024, 7, 1, 16, 0), jobType: 'Boiler Replacement Quote', customer: 'Jessica Wilson' },
];

export const isheReports: Report[] = [
    {
        id: uuidv4(),
        ref: 'GSC-2024-07-28-001',
        customer: 'Michael Brown',
        address: '90 Elm Close, Bristol',
        jobType: 'Gas Safety Certificate',
        fileName: 'GSC_M Brown_BS32JB_280724.pdf',
        fileSize: '1.2 MB',
        date: '2024-07-28',
    },
    {
        id: uuidv4(),
        ref: 'INV-2024-07-28-001',
        customer: 'Michael Brown',
        address: '90 Elm Close, Bristol',
        jobType: 'New Radiator Install',
        fileName: 'INV_M Brown_BS32JB_280724.pdf',
        fileSize: '450 KB',
        date: '2024-07-28',
    },
    {
        id: uuidv4(),
        ref: 'BSR-2024-07-27-003',
        customer: 'Sarah Taylor',
        address: '15 Cedar Road, Bristol',
        jobType: 'Boiler Service',
        fileName: 'BSR_S Taylor_BS20TH_270724.pdf',
        fileSize: '980 KB',
        date: '2024-07-27',
    }
];

export const kinkyBrizzleProducts: Product[] = [
    { id: 'kb-001', name: 'Latex Corset Tee', price: '£35.00', imageUrl: 'https://placehold.co/400x400/1a1a1a/f0f0f0?text=KB+Tee' },
    { id: 'kb-002', name: 'Rope Bondage Hoodie', price: '£55.00', imageUrl: 'https://placehold.co/400x400/1a1a1a/f0f0f0?text=KB+Hoodie' },
    { id: 'kb-003', name: 'Distressed "SINNER" Cap', price: '£25.00', imageUrl: 'https://placehold.co/400x400/1a1a1a/f0f0f0?text=KB+Cap' },
    { id: 'kb-004', name: '"Owned" Choker Necklace', price: '£20.00', imageUrl: 'https://placehold.co/400x400/1a1a1a/f0f0f0?text=KB+Choker' },
];

export const tenancyComparisons: Comparison[] = [
    {
        id: uuidv4(),
        area: 'Living Room',
        item: 'Carpet',
        checkIn: {
            description: 'Carpet professionally cleaned, no marks or stains noted.',
            imageUrl: 'https://placehold.co/400x300/666/fff?text=Check-In:+Clean+Carpet',
        },
        checkOut: {
            description: 'Large red wine stain visible near the sofa.',
            imageUrl: 'https://placehold.co/400x300/b00/fff?text=Check-Out:+Wine+Stain',
        },
        analyst: {
            responsibility: 'Tenant',
            action: 'Clean',
            cost: 120.00,
            legalComment: 'Professional cleaning required to remove significant staining not present at check-in. This is beyond fair wear and tear.'
        }
    },
    {
        id: uuidv4(),
        area: 'Kitchen',
        item: 'Oven',
        checkIn: {
            description: 'Oven is clean and in good working order.',
            imageUrl: 'https://placehold.co/400x300/666/fff?text=Check-In:+Clean+Oven',
        },
        checkOut: {
            description: 'Heavy grease and burnt-on food residue on all surfaces.',
            imageUrl: 'https://placehold.co/400x300/333/fff?text=Check-Out:+Dirty+Oven',
        },
        analyst: {
            responsibility: 'Tenant',
            action: 'Clean',
            cost: 100.00,
            legalComment: 'Oven requires professional deep clean to return to state of cleanliness documented at check-in. Standard cleaning charge applies.'
        }
    },
     {
        id: uuidv4(),
        area: 'Bedroom 1',
        item: 'Wall',
        checkIn: {
            description: 'Walls painted magnolia, good condition.',
            imageUrl: 'https://placehold.co/400x300/666/fff?text=Check-In:+Wall+OK',
        },
        checkOut: {
            description: 'Large scrapes and scuffs on the wall by the door, plaster is chipped.',
            imageUrl: 'https://placehold.co/400x300/964B00/fff?text=Check-Out:+Scuffs',
        },
        analyst: {
            responsibility: 'Tenant',
            action: 'Repair',
            cost: 180.00,
            legalComment: 'Damage to wall exceeds fair wear and tear. Cost covers filling, sanding, and repainting the affected area to match.'
        }
    },
     {
        id: uuidv4(),
        area: 'Exterior',
        item: 'Guttering',
        checkIn: {
            description: 'Gutters clear and functional.',
            imageUrl: 'https://placehold.co/400x300/666/fff?text=Check-In:+Gutter+OK',
        },
        checkOut: {
            description: 'Guttering blocked with leaves and debris from winter.',
            imageUrl: 'https://placehold.co/400x300/228B22/fff?text=Check-Out:+Blocked',
        },
        analyst: {
            responsibility: 'Landlord',
            action: 'None',
            cost: 0.00,
            legalComment: 'Gutter clearing is considered routine external maintenance and is typically the landlord\'s responsibility unless specified otherwise in the tenancy agreement.'
        }
    }
];


export const tenancyCases: Case[] = [
    {
        id: 'CASE-001',
        address: '15 Portland Square, Bristol, BS2 8SJ',
        clientRef: 'LL-PSQ-15',
        depositScheme: 'TDS',
        status: 'In Analysis',
        comparisons: tenancyComparisons,
    }
];
