import { NextRequest, NextResponse } from "next/server";
import { getAppsScriptURL } from "@/lib/rebeccaConfig";

// Mock data for local development
const mockEmailsData = [
  {
    subject: "Weekly Team Sync",
    snippet: "Hi team, this is a reminder for our weekly sync meeting tomorrow at 10 AM. Please prepare your updates and any blockers you're facing.",
    time: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
  },
  {
    subject: "Re: Project Timeline",
    snippet: "Thanks for the update on the project timeline. I've reviewed the milestones and they look reasonable. Let me know if you need any additional resources.",
    time: new Date(Date.now() - 4 * 60 * 60 * 1000) // 4 hours ago
  },
  {
    subject: "Invoice #1234 Due",
    snippet: "This is a reminder that invoice #1234 for £1,250 is due in 3 days. Please process payment at your earliest convenience.",
    time: new Date(Date.now() - 6 * 60 * 60 * 1000) // 6 hours ago
  }
];

const mockCalendarData = [
  {
    title: "Client Meeting - Smith Residence",
    time: "Today 14:30 – 15:30",
    location: "123 Oak Street, London"
  },
  {
    title: "Site Survey - New Build",
    time: "Tomorrow 09:00 – 11:00", 
    location: "45 Elm Avenue, Manchester"
  },
  {
    title: "Team Lunch",
    time: "Fri 15 Nov 12:30 – 13:30",
    location: "The Crown Pub"
  }
];

const mockDriveData = [
  {
    name: "Heating System Manual.pdf",
    title: "Heating System Manual.pdf",
    time: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
    id: "mock-file-1"
  },
  {
    name: "Installation Photos.jpg",
    title: "Installation Photos.jpg", 
    time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    id: "mock-file-2"
  },
  {
    name: "Customer Contract.docx",
    title: "Customer Contract.docx",
    time: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    id: "mock-file-3"
  }
];

export async function OPTIONS(){ return NextResponse.json({}, { headers: corsHeaders() }); }

export async function POST(req: NextRequest){
  try{
    const body = await req.json();
    
    // Check if we should use mock data for local development
    const isLocalDevelopment = process.env.NODE_ENV === 'development' && process.env.USE_MOCK_BACKEND === 'true';
    
    if (isLocalDevelopment) {
      console.log('Using mock backend for action:', body.action);
      return handleMockBackend(body);
    }
    
    // Try to use real Google Apps Script backend
    const res = await fetch(getAppsScriptURL(), {
      method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify(body)
    });

    const text = await res.text();
    const ct = res.headers.get("content-type") || "";
    let data: any = null;
    if (ct.includes("application/json")) {
      try { data = JSON.parse(text); } catch {}
    }
    if (!data) {
      // Most common cause: Web App not public ("Anyone") OR domain-scoped URL.
      return NextResponse.json({
        ok:false,
        error:"BACKEND_HTML",
        hint:"Apps Script returned HTML (likely auth page). Deploy Web App as 'Anyone' and use the generic URL https://script.google.com/macros/s/.../exec .",
        rawSnippet: text.slice(0,500),
        suggestion: "For local development, set USE_MOCK_BACKEND=true in your .env.local file"
      }, { status: 500, headers: corsHeaders() });
    }
    return NextResponse.json(data, { headers: corsHeaders() });
  }catch(e:any){
    const errorResponse = { 
      ok:false, 
      error: e?.message||String(e),
      suggestion: process.env.NODE_ENV === 'development' ? "For local development, set USE_MOCK_BACKEND=true in your .env.local file" : undefined
    };
    return NextResponse.json(errorResponse, { status: 500, headers: corsHeaders() });
  }
}

function handleMockBackend(body: any) {
  switch(body.action) {
    case 'health':
      return NextResponse.json({
        ok: true,
        ts: new Date().toISOString(),
        mock: true
      }, { headers: corsHeaders() });
      
    case 'listEmails':
      const maxEmails = Number(body.max) || 10;
      return NextResponse.json({
        ok: true,
        items: mockEmailsData.slice(0, maxEmails),
        mock: true
      }, { headers: corsHeaders() });
      
    case 'listCalendar':
      const maxEvents = Number(body.max) || 10;
      return NextResponse.json({
        ok: true,
        items: mockCalendarData.slice(0, maxEvents),
        mock: true
      }, { headers: corsHeaders() });
      
    case 'listDrive':
      const maxFiles = Number(body.max) || 25;
      const scopeLabel = body.scope === 'personal' ? 'Personal' : 'ISHE';
      return NextResponse.json({
        ok: true,
        items: mockDriveData.slice(0, maxFiles).map(file => ({
          ...file,
          name: `[${scopeLabel}] ${file.name}`
        })),
        mock: true
      }, { headers: corsHeaders() });
      
    case 'uploadFile':
      return NextResponse.json({
        ok: true,
        id: `mock-upload-${Date.now()}`,
        name: body.filename || 'uploaded-file.txt',
        mock: true
      }, { headers: corsHeaders() });
      
    case 'addTask':
      return NextResponse.json({
        ok: true,
        added: true,
        mock: true
      }, { headers: corsHeaders() });
      
    case 'logChat':
      return NextResponse.json({
        ok: true,
        logged: true,
        mock: true
      }, { headers: corsHeaders() });
      
    default:
      return NextResponse.json({
        ok: false,
        error: 'Unknown action: ' + body.action,
        mock: true
      }, { status: 400, headers: corsHeaders() });
  }
}

function corsHeaders(){
  return {
    "Access-Control-Allow-Origin":"*",
    "Access-Control-Allow-Methods":"POST, OPTIONS",
    "Access-Control-Allow-Headers":"Content-Type",
  };
}