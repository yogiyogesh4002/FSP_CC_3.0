// Google Sheets > Extensions > Apps Script. See PAYMENT-SETUP.md.
// Script properties: SPREADSHEET_ID, SHEET_NAME, SHARED_SECRET.
function doPost(e) {
  function json(value) { return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON); }
  var lock = LockService.getScriptLock();
  try {
    var props = PropertiesService.getScriptProperties();
    var secret = props.getProperty('SHARED_SECRET');
    var data = JSON.parse(e.postData.contents);
    if (!secret || data.secret !== secret) return json({ ok: false });
    var r = data.registration;
    if (!r || r.status !== 'PAID' || r.event !== 'fsp-catalyst-connect-3' || !/^pay_[A-Za-z0-9]+$/.test(r.paymentId) || !/^order_[A-Za-z0-9]+$/.test(r.orderId) || typeof r.amount !== 'number' || r.amount <= 0 || r.currency !== 'INR') return json({ ok: false });
    lock.waitLock(20000);
    var sheet = SpreadsheetApp.openById(props.getProperty('SPREADSHEET_ID')).getSheetByName(props.getProperty('SHEET_NAME') || 'Registrations');
    if (!sheet) throw new Error('Create the Registrations tab first');
    if (sheet.getLastRow() === 0) sheet.appendRow(['Payment ID', 'Order ID', 'Paid At (UTC)', 'Name', 'Email', 'Mobile', 'City', 'Amount', 'Currency', 'Status', 'Event']);
    // Lock protects the check-and-append operation from concurrent webhook retries.
    if (sheet.getLastRow() > 1) {
      var rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getDisplayValues();
      if (rows.some(function(row) { return row[0] === r.paymentId || row[1] === r.orderId; })) return json({ ok: true, duplicate: true });
    }
    // Escape formula prefixes in user-controlled text before writing to Sheets.
    function cell(value) { var text = String(value || ''); return /^[=+@\-\t\r]/.test(text) ? "'" + text : text; }
    sheet.appendRow([r.paymentId, r.orderId, r.paidAt, cell(r.name), cell(r.email), cell(r.phone), cell(r.city), r.amount, r.currency, r.status, r.event]);
    SpreadsheetApp.flush();
    return json({ ok: true, duplicate: false });
  } catch (error) {
    // Return failure so the website responds non-2xx and Razorpay retries delivery.
    return json({ ok: false });
  } finally { if (lock.hasLock()) lock.releaseLock(); }
}
