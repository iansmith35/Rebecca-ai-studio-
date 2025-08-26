/***** Rebecca Backend — Web App (robust) *****/
const SHEET_ID='1OGLC-mafxToexD4rXx5pVbCNOEO6DP5T6s05REwbdvY';
const HEARTBEAT_TAB='VoiceFlow_Heartbeat';
const MEMORY_TAB='VoiceFlow_Memory';
const DRIVE_ISHE='ISHE_Uploads';
const DRIVE_PERSONAL='Personal_Uploads';

function doGet(){ _ensureFolder(DRIVE_ISHE); _ensureFolder(DRIVE_PERSONAL);
  SpreadsheetApp.openById(SHEET_ID);
  try{GmailApp.getInboxThreads(0,1);}catch(_){}
  try{CalendarApp.getDefaultCalendar().getEvents(new Date(),new Date());}catch(_){}
  return HtmlService.createHtmlOutput('<div style="font-family:system-ui;padding:24px"><h2>Rebecca Backend: Authorized ✅</h2><p>You can close this tab.</p></div>');
}

function doPost(e){
  try{
    const d=JSON.parse(e.postData.contents||'{}');
    switch(d.action){
      case 'health':       return _json({ok:true,ts:new Date().toISOString()});
      case 'listEmails':   return _json({ok:true,items:listEmails(d.max)});
      case 'listCalendar': return _json({ok:true,items:listCalendar(d.max)});
      case 'listDrive':    return _json({ok:true,items:listDrive(d.scope,d.max)});
      case 'uploadFile':   return _json({ok:true,...uploadFile(d)});
      case 'addTask':      return _json({ok:true,...addTask(d.sheetId||SHEET_ID,d.text)});
      case 'logChat':      return _json({ok:true,...logChat(d.sheetId||SHEET_ID,d.userText,d.botText)});
      default:             return _json({ok:false,error:'Unknown action: '+d.action});
    }
  }catch(err){ return _json({ok:false,error:String(err)}); }
}

function listEmails(max){ max=Number(max)||10;
  const th=GmailApp.getInboxThreads(0,max);
  return th.map(t=>({subject:t.getFirstMessageSubject(),snippet:(t.getMessages()[0].getPlainBody()||'').slice(0,160),time:t.getLastMessageDate()}));
}
function listCalendar(max){ max=Number(max)||10;
  const now=new Date(), end=new Date(now.getTime()+14*24*3600*1000);
  const ev=CalendarApp.getDefaultCalendar().getEvents(now,end);
  return ev.slice(0,max).map(e=>({title:e.getTitle(),time:Utilities.formatDate(e.getStartTime(),Session.getScriptTimeZone(),'EEE dd MMM HH:mm')+' – '+Utilities.formatDate(e.getEndTime(),Session.getScriptTimeZone(),'HH:mm'),location:e.getLocation()||''}));
}
function listDrive(scope,max){ max=Number(max)||25;
  const folder=_ensureFolder(scope==='personal'?DRIVE_PERSONAL:DRIVE_ISHE);
  const files=folder.getFiles(); const items=[];
  while(files.hasNext()&&items.length<max){ const f=files.next(); items.push({name:f.getName(),title:f.getName(),time:f.getLastUpdated(),id:f.getId()}); }
  return items;
}
function uploadFile(d){
  if(!d||!d.base64) throw new Error('uploadFile: missing base64');
  const parent=_ensureFolder(d.scope==='personal'?DRIVE_PERSONAL:DRIVE_ISHE);
  const blob=Utilities.newBlob(Utilities.base64Decode(d.base64), d.mimeType||'application/octet-stream', d.filename||('file-'+Date.now()));
  const file=parent.createFile(blob); return { id:file.getId(), name:file.getName() };
}
function addTask(sheetId,text){ const ss=SpreadsheetApp.openById(sheetId);
  const sh=_ensureSheet(ss,HEARTBEAT_TAB,['ts','source','kind','text','status','colF','colG','app']);
  sh.appendRow([new Date(),'VOICE','TODO',text||'','PENDING','','','Rebecca Studio']); return {added:true};
}
function logChat(sheetId,userText,botText){ const ss=SpreadsheetApp.openById(sheetId);
  const sh=_ensureSheet(ss,MEMORY_TAB,['ts','app','user','bot']);
  sh.appendRow([new Date(),'Rebecca Studio',userText||'',botText||'']); return {logged:true};
}

function _json(o){ return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function _ensureFolder(name){ const it=DriveApp.getFoldersByName(name); return it.hasNext()?it.next():DriveApp.createFolder(name); }
function _ensureSheet(ss,name,header){ const sh=ss.getSheetByName(name)||ss.insertSheet(name); if(header&&sh.getLastRow()===0) sh.appendRow(header); return sh; }