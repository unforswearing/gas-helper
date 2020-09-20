/*
    __  __________    ____  __________     ____  ____      ____________________
   / / / / ____/ /   / __ \/ ____/ __ \   / __ \/ __ )    / / ____/ ____/_  __/
  / /_/ / __/ / /   / /_/ / __/ / /_/ /  / / / / __  |_  / / __/ / /     / /   
 / __  / /___/ /___/ ____/ /___/ _, _/  / /_/ / /_/ / /_/ / /___/ /___  / /    
/_/ /_/_____/_____/_/   /_____/_/ |_|   \____/_____/\____/_____/\____/ /_/     
        
Compiling helper functions. Some of this code is inspired dby various ES3 helper libraries.


 */

// var helper = helperObject();
function helperObject () {
  var params = {};
  
  // Helpers that modify Arrays -----------------------------------
  params['concatAndDedupe'] = function (arrA, arrB) {
    function uniq(a) {
      var seen = {}; var out = [];
      var len = a.length; var j = 0;
       
      for (var i = 0; i < len; i++) {
        var item = a[i];
        if (seen[item] !== 1) {
          seen[item] = 1;
          out[j++] = item;
        }
      }
       
      return out;
    }
     
    var tmp = uniq(arrA.concat(arrB));
    return tmp;
  }
    
  params['isEmptyArray'] = function (arr) {
    // if the array doesn't exist or is empty, return true
    if (!Array.isArray(arr) || !arr.length) return true;
    return false;
  }
  
  params['move'] = function (array, from, to) {
    function am (array, from, to) {
      array.splice((to < 0 ? array.length + to : to), 0, array.splice(from, 1)[0]);
    }

    array = array.slice();
    am(array, from, to);
    return array;
  }
  
  // ----------------------------------------------------------------------------------
  // Helpers to modify dates ----------------------------------------------------------

  params['addToDate'] = function (dateObj, days) {
    // there are better ways to do this
    if (!dateObj) { dateObj = false };
    var d = new Date();
    var seconds = days * 86400;
    var milliseconds = seconds * 1000;
    var date = new Date(+d + milliseconds);
    date = date.toString().replace(/..:..:..*/, '');

    if (dateObj) { date = new Date(date) };

    return date;
  }
  
  params['dayName'] = function () {
    var d = new Date();
    var days = [
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 
      'Thursday', 'Friday', 'Saturday'
    ];
    
    var today = days[d.getDay()];

    return today;
  }
  
  params['formatTimestamp'] = function (timestamp) {
    var d = timestamp.toString().substring(16, 0);
    
    var dateFormat = 'MM/dd/yyyy';
    d = Utilities.formatDate(new Date(d), Session.getScriptTimeZone(), dateFormat);
    
    return d.toString();
  }
  

  params['dateStringWithoutTime'] = function (timestamp) {
    var dateString = new Date(timestamp).toString().substring(0, 16);
    return Number(new Date(dateString).getTime()).toFixed(0);
  }
  
  // ----------------------------------------------------------------------------------
  // Helpers to modify numbers --------------------------------------------------------
  
  params['nth'] = function (num) {
    var t = (num % 100);
    if (t >= 10 && t <= 20) {
      return 'th';
    }

    var numMod = (num % 10);

    var suffixes = {
      1: num + 'st', 2: num + 'nd', 3: num + 'rd'
    }
    
    return suffixes[numMod] ? suffixes[numMod] : num + 'th';
  }
  
  params['tally'] = function (num) {
    var Tally = function (int) {
      var params = {};
      
      params.value = num || 0
      params.up = function () {
        this.value++;
        return this.value;
      }
        
      params.down = function () {
        this.value--;
        return this.value;
      }
      
      params.total = function () {
        return this.value;
      }
      
      params.clear = function () {
        this.value = 0;
      }
    }
     
    return new Tally(num);
  }
  
  // ----------------------------------------------------------------------------------
  // Helpers to modify objects ----------------------------------------------------------
  
  params['subset'] = function (object, keys) {
    var results = {};
    for (var i = 0, l = keys.length; i < l; i++) {
      var k = keys[i];
      if (k in object) results[k] = object[k];
    }

    return results;
  }
  
  params['toQueryString'] = function (object) {
    var str = [];
    for (var p in object) {
      if (object.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(object[p]));
      }
    }

    return str.join('&');
  }
 
  params['values'] = function (object) {
    var values = [];
    var keys = Object.keys(object);
    for (var i = 0; i < keys.length; i++) {
      var k = keys[i];
      values.push(object[k]);
    }
    
    return values;
  }
  
  // ----------------------------------------------------------------------------------
  // Helpers to modify functions ------------------------------------------------------
  
  params['static'] = function (data) {
    var param = {
      get: function () {
        try {
          var _data = data();
          return _data;
        } catch (e) {
          throw Error(e);
        }
      },
      data: function () {
        return this.get();
      }
    }
  }
  
  // ----------------------------------------------------------------------------------
  // Helpers to modify strings --------------------------------------------------------
  
  params['capitalize'] = function (str) {   
    return str.toString().replace(/\b[a-z]/g, function (match) {
      return match.toUpperCase();
    })
  } 

  params['contains'] = function (str, substring, fromIndex) {
    str = str.toString();
    substring = substring.toString();

    return str.indexOf(substring, fromIndex) !== -1;
  }

  params['delimit'] = function (str, delimiter, swap) {
    if (swap) return str.toString().replace(new RegExp(swap, 'g'), delimiter);
    return this.replace(/ /g, delimiter);
  }
  
  params['remove'] = function (str, regex) {   
    return str.toString().replace(regex, '');
  }
  
  params['titleCase'] = function (str) {
    str = str.toLowerCase().split(' ');
    for (var i = 0; i < str.length; i++) {
      
      if (str[i].toString().match('-')) {
        var pre = str[i].match(/\w+(?=-)/).toString();
        var post = str[i].match(/-\w+/).toString().charAt(1).toUpperCase();
        post = post + str[i].match(/-\w+/).toString().replace(/-./, '');
        
        str[i] = pre + '-' + post;
      } 
      
      str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
    }
   
    return str.join(' ');
  }
  

  // ----------------------------------------------------------------------------------
  // General utility helpers ----------------------------------------------------------
  
  params['emailFooter'] = function (type, subject) {
    subject = subject.replace(/ /g, '%20');
    var htmlMessageFooter = undefined;
    var plainMessageFooter = undefined;
        
    if (type === 'plain' || !type) return plainMessageFooter;
    if (type === 'html') return htmlMessageFooter;
  }
   
  params['generatePdf'] = function (template, title) {
    if ((!template) || (!title)) {
      throw new Error('generatePDF() is missing some data. Please see Log for info.');
    }
    
    if (title.match(/\.html$/)) { title = title.replace(/\.html/, '') };
    var pdf = Utilities.newBlob(template, 'text/html', title + '.html').getAs('application/pdf');
    return pdf
  }

  params['getFileId'] = function (file) {
    // this would be shorter if i could use a 'lookbehind assertion'
    return file.match(/(?=id=).*$/).toString().replace('id=', '') ;
  }

  params['getTabInSheet'] = function (sheetId, tabName) {
    if ((!sheetId) || (!tabName)) {
      Logger.log('getTabInSheet is missing some data. usage: getTabInSheet(sheetId, tabName)');
      throw new Error('getTabInSheet() is missing some data. Please see Log for info.');
    }

    var externalSheet = SpreadsheetApp.openById(sheetId);
    var tabInSheet = externalSheet.getSheetByName(tabName);
    tabInSheet = tabInSheet.activate();

    return tabInSheet
  }
  
  // process logger
  params['proc'] = function () {
    var returnedLogger;
  
    try {
      // BetterLog: https://github.com/peterherrmann/BetterLog
      var bl = BetterLog();
      
      // logSheet = id of the spreadsheet used for logging
      var logSheet = undefined;
      var LLogger = bl.useSpreadsheet(logSheet)
      
      LLogger.DATE_TIME_LAYOUT = "'['yyyy-MM-dd HH:mm:ss z'] '";
      LLogger.log('BetterLog is being used');
      returnedLogger = LLogger;
    } catch (e) {
      // Otherwise, use the built in logger
      Logger.log('BetterLog encountered an error. Will not use');
      returnedLogger = Logger;
    }

    return returnedLogger;
  }

  // probably not comprehensive
  params['stripHtmlTags'] = function (str) {
    str = toString(str);

    return str.replace(/<[^>]*>/g, '');
  }

  // used to reformat reimbursement totals from 20.50 -> $20.50
  params['toDollars'] = function (item) {
    if (item.toString().match(/\$/)) return item;
    
    if (Number(item) > 0) { return '$' + Number(item).toFixed(2); };
    return '0';
  }

  params['warn'] = function (error) { 
    var responseSheet = false;
    var scriptLogs = false;
    var scriptProject = false;
    
    // compose a message using the above variables
    var msg = false
       
    var recipient = undefined;
     
    GmailApp.sendEmail(recipient, 'Check-in Request form error!', msg)
  }

  // ==================================================================
  // params complete here. return them and end.
  return params;
}















