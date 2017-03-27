/**
 * @file
 * SCORM 2004 API Implementation.
 *
 * Some portions adapted from the Moodle Scorm module.
 */

function SCORM_API_2004() {
  var Initialized = false,
      Terminated = false,
      errorCode = "0";

  function Initialize(param) {
    var result = "false",
        errorCode = "0";

    AppendToSCOLog("User Agent: " + navigator.userAgent);

    if (FlashDetect.installed) {
      AppendToSCOLog("Flash is installed - Version info: " + FlashDetect.raw);
    }
    else {
      AppendToSCOLog("Flash was not detected");
    }

    if (param == "") {
      if (!Initialized) {
        Initialized = cmi.init("2004");

        if (!Initialized) {
          // Init error.
          errorCode = "102";
        }
        else {
          Terminated = false;
          result = "true";
        }
      }
      else {
        // Already initialized.
        errorCode = "103";
      }
    }
    else {
      // Argument error.
      errorCode = "201";
    }

    LogSCOAPICall("Initialize", param, "", errorCode);

    return result;
  }

  function Terminate(param) {
    var result = "false",
        errorCode = "0";

    if (param == "") {
      if (Initialized) {
        Initialized = false;
        Terminated = true;

        // Store data.
        cmi.commit();

        result = "true";

        if (adl_nav_request != "_none_") {
          switch (adl_nav_request) {
            case 'continue':
              break;
            case 'previous':
              break;
            case 'choice':
              break;
            case 'jump':
              break;
            case 'exit':
              break;
            case 'exitAll':
              break;
            case 'abandon':
              break;
            case 'abandonAll':
              break;
          }
        }
      }
      else {
        if (Terminated) {
          // Term after term.
          errorCode = "113";
        }
        else {
          // Term before init.
          errorCode = "112";
        }
      }
    }
    else {
      // Argument error.
      errorCode = "201";
    }

    LogSCOAPICall("Terminate", param, "", errorCode);

    return result;
  }

  function GetValue(element) {
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
      if (Terminated) {
        // Get value after term.
        errorCode = "123";
      }
      else {
        // Get value before init.
        errorCode = "122";
      }
    }

    logResult = result;

    if (!cmi.log_suspend && element == "suspend_data") {
      logResult = "(Value Omitted)";
    }

    LogSCOAPICall("GetValue", element, logResult, errorCode);

    return result;
  }

  function SetValue(element, value) {
    var result = "false",
        errorCode = "0",
        logValue;

    if (Initialized) {
      if (element != "") {
        // Store element value.
        if (!cmi.setValue(element, value)) {
          // Set error.
          errorCode = "351";
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
      if (Terminated) {
        // Store data after term.
        errorCode = "133";
      }
      else {
        // Store data before init.
        errorCode = "132";
      }
    }

    logValue = value;

    if (!cmi.log_suspend && element == "cmi.suspend_data") {
      logValue = "(Value Omitted)";
    }

    LogSCOAPICall("SetValue", element, logValue, errorCode);

    return result;
  }

  function Commit(param) {
    var result = "false",
        errorCode = "0";

    if (param == "") {
      if (Initialized) {
        // Store data.
        if (cmi.commit()) {
          result = "true";
        }
        else {
          // Commit error.
          errorCode = "391";
        }
      }
      else {
        if (Terminated) {
          // Commit after term.
          errorCode = "143";
        }
        else {
          // Commit before init.
          errorCode = "142";
        }
      }
    }
    else {
      // Argument error.
    }

    LogSCOAPICall("Commit", param, "", errorCode);

    return result;
  }

  function GetLastError() {
    LogSCOAPICall("GetLastError", "", "", errorCode);

    return errorCode;
  }

  function GetErrorString(param) {
    if (param != "") {
      var errorString = [];

      errorString["0"] = "No error";
      errorString["101"] = "General exception";
      errorString["102"] = "General initialization failure";
      errorString["103"] = "Already initialized";
      errorString["104"] = "Content instance terminated";
      errorString["111"] = "General termination failure";
      errorString["112"] = "Termination before initialization";
      errorString["113"] = "Termination after termination";
      errorString["122"] = "Retrieve data before initialization";
      errorString["123"] = "Retrieve data after termination";
      errorString["132"] = "Store data before initialization";
      errorString["133"] = "Store data after termination";
      errorString["142"] = "Commit before initialization";
      errorString["143"] = "Commit data after termination";
      errorString["201"] = "General argument error";
      errorString["301"] = "General get failure";
      errorString["351"] = "General set failure";
      errorString["391"] = "General commit failure";
      errorString["401"] = "Undefined data model element";
      errorString["402"] = "Unimplemented data model element";
      errorString["403"] = "Data model element not initialized";
      errorString["404"] = "Data model element is read only";
      errorString["405"] = "Data model element is write only";
      errorString["406"] = "Data model element type mismatch";
      errorString["407"] = "Data model element value out of range";
      errorString["408"] = "Data model dependency not established";

      LogSCOAPICall("GetErrorString", param, errorString[param], 0);

      return errorString[param];
    }
    else {
      LogSCOAPICall("GetErrorString", param, "No error string found!", 0);

      return "";
    }
  }

  function GetDiagnostic(param) {
    var result = "";

    if (cmi.diagnostic != "") {
      result = cmi.diagnostic;
      cmi.diagnostic = "";
    }
    else if (errorCode != "") {
      result = errorCode;
    }

    LogSCOAPICall("GetDiagnostic", param, result, 0);

    return result;
  }

  this.Initialize = Initialize;
  this.Terminate = Terminate;
  this.GetValue = GetValue;
  this.SetValue = SetValue;
  this.Commit = Commit;
  this.GetLastError = GetLastError;
  this.GetErrorString = GetErrorString;
  this.GetDiagnostic = GetDiagnostic;
}

var API_1484_11 = new SCORM_API_2004();
