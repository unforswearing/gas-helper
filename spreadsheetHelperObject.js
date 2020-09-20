/*
  The spreadsheet helper is best used with scripts that use the onFormSubmit trigger.
  The object below returns an object containing questions, answers and other parameters
  of the responses spreadsheet that it is acting on.

  The "_sheet" object is the return value of the immediately invoked "_sheet" function.
*/

var sheetId = undefined;

// the object
sheet_ = function sheet_ (id) {
  if (!id) throw Error('No id was passed to sheet object');
  var spreadsheet = SpreadsheetApp.openById(id);

  var getAllSheets = function getAllSheets () {
    return spreadsheet.getSheets();
  }

  var getLastRow = function getLastRow () {
    return spreadsheet.getLastRow();
  }

  // this doesn't need to be a function
  var getFirstColumnLetter = function getFirstColumnLetter () {
    return 'A';
  }

  var getLastColumnLetter = function getLastColumnLetter () {
    var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    var alphaLen = alphabet.length;
    var col = spreadsheet.getLastColumn();

    if (col <= alphaLen) return alphabet.splice((col - 1), 1).toString();

    var firstLetter = alphabet[Math.floor(col / alphaLen) - 1];
    return firstLetter + alphabet.splice((col % alphaLen), 1).toString();
  }

  var getRange = function getRange (row) {
    var start = getFirstColumnLetter();
    var end = getLastColumnLetter();

    if (!row) row = getLastRow();

    var tmpRange = start + row + ':' + end + row;
    return tmpRange;
  }

  var getValues = function getValues (range) {
    if (range) return spreadsheet.getRange(range).getValues();
    return spreadsheet.getRange(getRange(getLastRow())).getValues();
  }

  var getFormAnswersArray = function getFormAnswersArray () {
    var range = getRange(getLastRow());
    var answers = getValues(range)[0];
    return answers;
  }

  var getFormQuestionsArray = function getFormQuestionsArray () {
    var range = getRange(1);
    var questions = getValues(range)[0];
    return questions;
  }

  var getSubmissionObject = function getSubmissionObject (noEmptyAnswers) {
    var questions = getFormQuestionsArray();
    var answers = getFormAnswersArray();
    var tmp = {};

    for (var i = 0; i < questions.length; i++) {
      var q = questions[i].toString();
      var a = answers[i];

      if (noEmptyAnswers) { if (!a) continue };

      tmp[q] = a;
    }

    return tmp;
  }

  var params = {
    self: spreadsheet,
    id: spreadsheet.getId(),
    allSheets: getAllSheets(),
    lastRow: getLastRow(),
    lastColumnLetter: getLastColumnLetter(),
    lastRange: getRange(getLastRow()),
    firstEmptyRange: getRange(getLastRow() + 1),
    questions: getFormQuestionsArray(),
    answers: getFormAnswersArray(),
    submissionObj: getSubmissionObject(),
    constrainedObj: getSubmissionObject(true)
  }

  return params
}(sheetId)

// FOR TESTING -----------------------------------
function test () {
  Logger.log(sheet.self)
  Logger.log(sheet.id)
  Logger.log(sheet.lastRow)
  Logger.log(sheet.lastColumnLetter)
  Logger.log(sheet.answers)
  Logger.log(sheet.questions)
  Logger.log(sheet.submissionObj)

  var timestamp = sheet.answers[0]
  var name = sheet.answers[3]

  Logger.log('submitted by ' + name + ' at ' + timestamp)

  // or use the submission object
  var submission = sheet.submissionObj

  timestamp = submission['Timestamp']
  name = submission['Name']

  Logger.log('submitted by ' + name + ' at ' + timestamp)
}
