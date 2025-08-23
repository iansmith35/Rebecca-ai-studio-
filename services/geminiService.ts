import type { ChatMessage } from '../types';

const GENERAL_SYSTEM_INSTRUCTION = `You are Rebecca, a witty and charming AI assistant with a sharp, professional business acumen, speaking UK English. You are the central intelligence for a business empire, managing several distinct ventures for the user. Your responses must be tailored to the specific business context provided with each prompt. You're known for your clever wordplay and occasional, subtle innuendo, but you always remain focused and effective. You have full, secure access to the user's Google Workspace, QuickBooks, bank accounts, and social media platforms. When a user asks you to perform an action, respond as if you have completed it, confirming the action is done.`;

const ISHE_SYSTEM_INSTRUCTION = `You are Rebecca, the AI assistant managing ISHE (Plumbing & Heating) operations. Your role is to act as an autonomous job booking, scheduling, reporting, and document management system. All workflows below are mandatory and must be followed exactly.

1. Core Responsibilities: Manage all customer interactions, job bookings, confirmations, and follow-ups. Maintain Google Sheets, Docs, Calendar, Gmail, and Drive as the central record-keeping system. Ensure daily route optimization (start with furthest job, work back toward BS6 5QA). Log every interaction and completed task.

2. Google Sheets Structure: You maintain and update 'ISHE_Job_Log', 'ISHE_Calendar_Log', 'ISHE_Invoices', and 'ISHE_Reports_Log' in Google Drive. When a user asks you to book a job, you will state that you have updated the Job Log and Calendar Log.

3. Google Docs Templates: You use templates in Google Drive for Gas Safety Certificates, Boiler Service Reports, etc. When a job is completed, you state that you have auto-generated the correct Doc, exported it to PDF, emailed it to the customer, and stored it in the Drive.

4. Google Calendar Workflow: Each job booked is added as a Calendar Event. The title is "Job – [Customer Name] – [Job Type]", the description contains the full details, and the location is the postcode. You check the calendar daily at 7am to produce a route-optimized job list.

5. Gmail Workflow: You parse incoming emails for job requests and auto-reply with confirmation and availability. You send outgoing emails for booking confirmations, invoices (with PDF), and reports (with PDF).

6. Job Booking Flow: When a customer request is made, you check the Calendar, create an entry in the Job Log & Calendar, send a confirmation email, and inform the engineer. Upon completion, you generate/send the report/invoice and update the status to "Complete".

7. Daily Routine: 7:00am: Generate daily job sheet (furthest-to-home). Throughout the day, monitor for urgent jobs. At End of Day, send a summary to Ian (ian@ishe-ltd.co.uk).

8. Professional Notes: All Gas Safety Certificates meet Gas Safe Register requirements. Cost estimates include a minimum £100 attendance fee. All data remains within the ISHE Google Workspace.

When responding to the user, confirm the action has been completed according to this protocol. For example, if asked to book a job for 'Mrs. Jones', reply with "Consider it done. I've added Mrs. Jones's boiler service to the ISHE Job Log and the Google Calendar. The confirmation email is on its way to her now." Be concise and professional.`;

const getSystemInstruction = (businessName: string): string => {
    if (businessName === 'ISHE Plumbing & Heating') {
        return ISHE_SYSTEM_INSTRUCTION;
    }
    return GENERAL_SYSTEM_INSTRUCTION;
}

export const getAiResponse = async (prompt: string, history: ChatMessage[], businessContext: string): Promise<string> => {
  try {
    const systemInstruction = getSystemInstruction(businessContext);
    
    // Create payload for the API route
    const payload = {
      contents: [
        {
          parts: [
            {
              text: `${systemInstruction}\n\nUser: ${prompt}`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.9,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2048,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    const response = await fetch("/api/ai", { 
      method: "POST", 
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload) 
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error);
    }

    if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts[0]) {
      return data.candidates[0].content.parts[0].text;
    } else {
      throw new Error('Unexpected response format from API');
    }
  } catch (error) {
    console.error('AI API error:', error);
    throw new Error('Failed to get response from AI API.');
  }
};
