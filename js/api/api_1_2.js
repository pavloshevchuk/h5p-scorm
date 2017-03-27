/**
 * @file
 * SCORM 1.2 API Implementation.
 *
 * Some portions adapted from the Moodle Scorm module.
 */

function SCORM_API_1_2() {
  var Initialized = false,
      errorCode = "0";

  function LMSInitialize(param) {
    AppendToSCOLog("User Agent: " + navigator.userAgent);

    if (FlashDetect.installed) {
      AppendToSCOLog("Flash is installed - Version info: " + FlashDetect.raw);
    }
    else {
      AppendToSCOLog("Flash was not detected");
    }

    var result = "false",
        errorCode = "0";

    if (param == "") {
      if (!Initialized) {
        Initialized = cmi.init("1.2");
        if (Initialized) {
          result = "true";
        }
        else {
          // Init error.
          errorCode = "101";
        }
      }
      else {
        // Already initialized.
        errorCode = "101";
      }
    }
    else {
      // Argument error.
      errorCode = "201";
    }

    LogSCOAPICall("LMSInitialize", param, "", errorCode);

    return result;
  }

  function LMSFinish(param) {
    var result = "false",
        errorCode = "0";

    if (param == "") {
      if (Initialized) {
        Initialized = false;

        // Store data.
        cmi.commit();

        result = "true";
      }
      else {
        // Not initialized.
        errorCode = "301";
      }
    }
    else {
      // Argument error.
      errorCode = "201";
    }

    LogSCOAPICall("LMSFinish", param, "", errorCode);

    return result;
  }

  function LMSGetValue(element) {
    var result = "",
        errorCode = "0",
        logResult;

    if (Initialized) {
      if (element != "") {

        // Get element value.
        result = cmi.getValue(element);

      }
      else {
        // Argument error.
        errorCode = "201";
      }
    }
    else {
      // Not initialized.
      errorCode = "301";
    }

    logResult = result;

    if (!cmi.log_suspend && element == "cmi.suspend_data") {
      logResult = "(Value Omitted)";
    }

    LogSCOAPICall("LMSGetValue", element, logResult, errorCode);

    return result;
  }

  function LMSSetValue(element, value) {
    var result = "false",
        errorCode = "0",
        logValue;

    if (Initialized) {
      if (element != "") {
        // store element value
        if (!cmi.setValue(element, value)) {
          // General error.
          errorCode = "101";
        }
        else {
          result = "true";
        }
      }
      else {
        // Argument error.
        errorCode = "201";
      }
    }
    else {
      // Not initialized.
      errorCode = "301";
    }

    logValue = value;

    if (!cmi.log_suspend && element == "cmi.suspend_data") {
      logValue = "(Value Omitted)";
    }

    LogSCOAPICall("LMSSetValue", element, logValue, errorCode);

    return result;
  }

  function LMSCommit(param) {
    var result = "false",
        errorCode = "0";

    if (param == "") {
      if (Initialized) {

        // Store data here.
        if (cmi.commit()) {
          result = "true";
        }
        else {
          // Commit error.
          errorCode = "101";
        }
      }
      else {
        // Not initialized.
        errorCode = "301";
      }
    } else {
      // Argument error.
      errorCode = "201";
    }

    LogSCOAPICall("LMSCommit", param, "", errorCode);

    return result;
  }

  function LMSGetLastError() {
    LogSCOAPICall("LMSGetLastError", "", "", errorCode);

    return errorCode;
  }

  function LMSGetErrorString(param) {
    if (param != "") {
      var errorString = [];

      errorString["0"] = "No error";
      errorString["101"] = "General exception";
      errorString["201"] = "Invalid argument error";
      errorString["202"] = "Element cannot have children";
      errorString["203"] = "Element not an array - cannot have count";
      errorString["301"] = "Not initialized";
      errorString["401"] = "Not implemented error";
      errorString["402"] = "Invalid set value, element is a keyword";
      errorString["403"] = "Element is read only";
      errorString["404"] = "Element is write only";
      errorString["405"] = "Incorrect data type";

      LogSCOAPICall("LMSGetErrorString", param, errorString[param], 0);

      return errorString[param];
    }
    else {
      LogSCOAPICall("LMSGetErrorString", param, "No error string found!", 0);

      return "";
    }
  }

  function LMSGetDiagnostic(param) {
    var result = "";

    if (cmi.diagnostic != "") {
      result = cmi.diagnostic;
      cmi.diagnostic = "";
    }
    else if (errorCode != "") {
      result = errorCode;
    }

    LogSCOAPICall("LMSGetDiagnostic", param, result, 0);

    return result;
  }

  this.LMSInitialize = LMSInitialize;
  this.LMSFinish = LMSFinish;
  this.LMSGetValue = LMSGetValue;
  this.LMSSetValue = LMSSetValue;
  this.LMSCommit = LMSCommit;
  this.LMSGetLastError = LMSGetLastError;
  this.LMSGetErrorString = LMSGetErrorString;
  this.LMSGetDiagnostic = LMSGetDiagnostic;
}

var API = new SCORM_API_1_2();
