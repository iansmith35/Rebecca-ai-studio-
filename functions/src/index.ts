import {onRequest} from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import {google} from "googleapis";
import * as functions from "firebase-functions";

// Export the health endpoint
export * from './health';

// Export automation functions
export * from './automation';

// Initialize Firebase Admin
admin.initializeApp();

// CORS configuration (handled by onRequest config)
// const corsHandler = cors({origin: true});

// Configuration constants
const config = functions.config();
const SHEET_ID = config.google?.sheet_id || '1OGLC-mafxToexD4rXx5pVbCNOEO6DP5T6s05REwbdvY';
const HEARTBEAT_TAB = 'VoiceFlow_Heartbeat';
const MEMORY_TAB = 'VoiceFlow_Memory';
const DRIVE_ISHE = config.google?.drive_folder_ishe || 'ISHE_Uploads';
const DRIVE_PERSONAL = config.google?.drive_folder_personal || 'Personal_Uploads';

// Google Auth setup
let googleAuth: any = null;

function getGoogleAuth() {
  if (!googleAuth) {
    if (config.google?.credentials) {
      const credentials = JSON.parse(config.google.credentials);
      googleAuth = new google.auth.GoogleAuth({
        credentials,
        scopes: [
          'https://www.googleapis.com/auth/gmail.readonly',
          'https://www.googleapis.com/auth/calendar.readonly',
          'https://www.googleapis.com/auth/drive',
          'https://www.googleapis.com/auth/spreadsheets',
        ],
      });
    } else {
      throw new Error('Google service account credentials not configured. Please set up google.credentials config.');
    }
  }
  return googleAuth;
}

// Main API endpoint
export const api = onRequest({cors: true}, async (request, response) => {
  try {
    if (request.method === 'GET') {
      // Health check / authorization page
      response.send(`
        <div style="font-family:system-ui;padding:24px">
          <h2>Rebecca Backend: Firebase Functions ✅</h2>
          <p>Backend is running. You can close this tab.</p>
        </div>
      `);
      return;
    }

    if (request.method === 'POST') {
      const data = request.body || {};
      const action = data.action;

      switch (action) {
        case 'health':
          response.json({ok: true, ts: new Date().toISOString()});
          break;
        
        case 'listEmails':
          const emails = await listEmails(data.max);
          response.json({ok: true, items: emails});
          break;
        
        case 'listCalendar':
          const calendar = await listCalendar(data.max);
          response.json({ok: true, items: calendar});
          break;
        
        case 'listDrive':
          const drive = await listDrive(data.scope, data.max, data.folderId);
          response.json({ok: true, items: drive});
          break;
        
        case 'uploadFile':
          const upload = await uploadFile(data);
          response.json({ok: true, id: upload.id, name: upload.name});
          break;
        
        case 'addTask':
          const task = await addTask(data.sheetId || SHEET_ID, data.text);
          response.json({ok: true, added: task.added});
          break;
        
        case 'listTasks':
          const tasks = await listTasks(data.sheetId || SHEET_ID);
          response.json({ok: true, items: tasks.items});
          break;
        
        case 'completeTask':
          const complete = await completeTask(data.sheetId || SHEET_ID, data.id);
          response.json({ok: true, completed: complete.completed});
          break;
        
        case 'updateTask':
          const update = await updateTask(data.sheetId || SHEET_ID, data.row, data.status, data.due);
          response.json({ok: true, updated: update.updated});
          break;
        
        case 'logChat':
          const log = await logChat(data.sheetId || SHEET_ID, data.userText, data.botText);
          response.json({ok: true, logged: log.logged});
          break;
        
        default:
          response.status(400).json({ok: false, error: `Unknown action: ${action}`});
      }
    } else {
      response.status(405).json({ok: false, error: 'Method not allowed'});
    }
  } catch (error) {
    console.error('API Error:', error);
    response.status(500).json({ok: false, error: String(error)});
  }
});

async function listEmails(max: number = 10): Promise<any[]> {
  try {
    const auth = getGoogleAuth();
    const gmail = google.gmail({version: 'v1', auth});
    
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: max,
    });

    const messages = response.data.messages || [];
    const emailDetails = await Promise.all(
      messages.map(async (message) => {
        const details = await gmail.users.messages.get({
          userId: 'me',
          id: message.id!,
        });
        
        const headers = details.data.payload?.headers || [];
        const subject = headers.find(h => h.name === 'Subject')?.value || 'No Subject';
        const snippet = details.data.snippet || '';
        
        return {
          subject,
          snippet: snippet.slice(0, 160),
          time: new Date(parseInt(details.data.internalDate || '0')),
        };
      })
    );

    return emailDetails;
  } catch (error) {
    console.error('Gmail API error:', error);
    throw new Error(`Gmail integration error: ${error}`);
  }
}

async function listCalendar(max: number = 10): Promise<any[]> {
  try {
    const auth = getGoogleAuth();
    const calendar = google.calendar({version: 'v3', auth});
    
    const now = new Date();
    const twoWeeksFromNow = new Date(now.getTime() + 14 * 24 * 3600 * 1000);
    
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: now.toISOString(),
      timeMax: twoWeeksFromNow.toISOString(),
      maxResults: max,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    return events.map(event => ({
      title: event.summary || 'No Title',
      time: `${formatDateTime(event.start?.dateTime || event.start?.date || '')} – ${formatDateTime(event.end?.dateTime || event.end?.date || '')}`,
      location: event.location || '',
    }));
  } catch (error) {
    console.error('Calendar API error:', error);
    throw new Error(`Calendar integration error: ${error}`);
  }
}

async function listDrive(scope: string, max: number = 25, folderId?: string): Promise<any[]> {
  try {
    const auth = getGoogleAuth();
    const drive = google.drive({version: 'v3', auth});
    
    let targetFolderId = folderId;
    
    if (!targetFolderId) {
      // Find or create the target folder
      const folderName = scope === 'personal' ? DRIVE_PERSONAL : DRIVE_ISHE;
      const folderResponse = await drive.files.list({
        q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
      });
      
      if (folderResponse.data.files && folderResponse.data.files.length > 0) {
        targetFolderId = folderResponse.data.files[0].id!;
      } else {
        // Create folder
        const createResponse = await drive.files.create({
          requestBody: {
            name: folderName,
            mimeType: 'application/vnd.google-apps.folder',
          },
        });
        targetFolderId = createResponse.data.id!;
      }
    }

    const response = await drive.files.list({
      q: `'${targetFolderId}' in parents`,
      pageSize: max,
      orderBy: 'modifiedTime desc',
    });

    const files = response.data.files || [];
    return files.map(file => ({
      name: file.name,
      title: file.name,
      time: new Date(file.modifiedTime!),
      id: file.id,
      kind: file.mimeType === 'application/vnd.google-apps.folder' ? 'folder' : 'file',
    }));
  } catch (error) {
    console.error('Drive API error:', error);
    throw new Error(`Drive integration error: ${error}`);
  }
}

async function uploadFile(data: any): Promise<{id: string, name: string}> {
  try {
    if (!data || !data.base64) {
      throw new Error('uploadFile: missing base64 data');
    }

    const auth = getGoogleAuth();
    const drive = google.drive({version: 'v3', auth});
    
    // Find parent folder
    const folderName = data.scope === 'personal' ? DRIVE_PERSONAL : DRIVE_ISHE;
    const folderResponse = await drive.files.list({
      q: `name='${folderName}' and mimeType='application/vnd.google-apps.folder'`,
    });
    
    let parentId: string;
    if (folderResponse.data.files && folderResponse.data.files.length > 0) {
      parentId = folderResponse.data.files[0].id!;
    } else {
      // Create folder
      const createResponse = await drive.files.create({
        requestBody: {
          name: folderName,
          mimeType: 'application/vnd.google-apps.folder',
        },
      });
      parentId = createResponse.data.id!;
    }

    // Upload file
    const buffer = Buffer.from(data.base64, 'base64');
    const response = await drive.files.create({
      requestBody: {
        name: data.filename || `file-${Date.now()}`,
        parents: [parentId],
      },
      media: {
        mimeType: data.mimeType || 'application/octet-stream',
        body: buffer,
      },
    });

    return {
      id: response.data.id!,
      name: response.data.name!,
    };
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error(`File upload error: ${error}`);
  }
}

async function addTask(sheetId: string, text: string): Promise<{added: boolean}> {
  try {
    const auth = getGoogleAuth();
    const sheets = google.sheets({version: 'v4', auth});
    
    const taskId = `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const values = [
      [new Date().toISOString(), 'VOICE', 'TODO', text || '', 'PENDING', '', '', taskId]
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${HEARTBEAT_TAB}!A:H`,
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });

    return {added: true};
  } catch (error) {
    console.error('Add task error:', error);
    throw new Error(`Add task error: ${error}`);
  }
}

async function listTasks(sheetId: string): Promise<{items: any[]}> {
  try {
    const auth = getGoogleAuth();
    const sheets = google.sheets({version: 'v4', auth});
    
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${HEARTBEAT_TAB}!A:H`,
    });

    const rows = response.data.values || [];
    if (rows.length === 0) return {items: []};

    const dataRows = rows.slice(1);

    const items = dataRows
      .filter(row => row[2] === 'TODO')
      .map(row => {
        const created = row[0] ? formatDateTime(row[0]) : '';
        const doneAt = row[4] === 'DONE' && row[0] ? formatDateTime(row[0]) : undefined;
        return {
          id: row[7] || `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          created,
          text: row[3] || '',
          status: row[4] || 'PENDING',
          due: row[5] || undefined,
          doneAt,
        };
      });

    return {items};
  } catch (error) {
    console.error('List tasks error:', error);
    throw new Error(`List tasks error: ${error}`);
  }
}

async function completeTask(sheetId: string, taskId: string): Promise<{completed: boolean}> {
  try {
    const auth = getGoogleAuth();
    const sheets = google.sheets({version: 'v4', auth});
    
    // First, get all data to find the task
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: `${HEARTBEAT_TAB}!A:H`,
    });

    const rows = response.data.values || [];
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][7] === taskId) {
        // Update status and completion time
        await sheets.spreadsheets.values.update({
          spreadsheetId: sheetId,
          range: `${HEARTBEAT_TAB}!E${i + 1}:F${i + 1}`,
          valueInputOption: 'RAW',
          requestBody: {
            values: [['DONE', formatDateTime(new Date().toISOString())]],
          },
        });
        return {completed: true};
      }
    }

    return {completed: false};
  } catch (error) {
    console.error('Complete task error:', error);
    throw new Error(`Complete task error: ${error}`);
  }
}

async function updateTask(sheetId: string, row: number, status: string, due: string): Promise<{updated: boolean}> {
  try {
    const auth = getGoogleAuth();
    const sheets = google.sheets({version: 'v4', auth});
    
    const updates: any[] = [];
    if (status) updates.push({range: `${HEARTBEAT_TAB}!E${row}`, values: [[status]]});
    if (due !== undefined) updates.push({range: `${HEARTBEAT_TAB}!F${row}`, values: [[due]]});

    if (updates.length > 0) {
      await sheets.spreadsheets.values.batchUpdate({
        spreadsheetId: sheetId,
        requestBody: {
          data: updates,
          valueInputOption: 'RAW',
        },
      });
    }

    return {updated: true};
  } catch (error) {
    console.error('Update task error:', error);
    throw new Error(`Update task error: ${error}`);
  }
}

async function logChat(sheetId: string, userText: string, botText: string): Promise<{logged: boolean}> {
  try {
    const auth = getGoogleAuth();
    const sheets = google.sheets({version: 'v4', auth});
    
    const values = [
      [new Date().toISOString(), 'Rebecca Studio', userText || '', botText || '']
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: `${MEMORY_TAB}!A:D`,
      valueInputOption: 'RAW',
      requestBody: {
        values,
      },
    });

    return {logged: true};
  } catch (error) {
    console.error('Log chat error:', error);
    throw new Error(`Log chat error: ${error}`);
  }
}

function formatDateTime(dateString: string | Date): string {
  const date = new Date(dateString);
  return date.toLocaleString('en-GB', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}