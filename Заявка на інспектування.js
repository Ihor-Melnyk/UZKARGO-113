//Скрипт 1. Передача результату опрацювання документа в ESIGN
function onTaskExecuteVerifyRequest(routeStage) {
  debugger;
  var signatures = [];
  var command;
  if (routeStage.executionResult == "executed") {
    command = "CompleteTask";
    signatures = EdocsApi.getSignaturesAllFiles();
  } else {
    command = "RejectTask";
  }
  var DocCommandData = {};

  DocCommandData.extSysDocID = CurrentDocument.id;
  DocCommandData.extSysDocVersion = CurrentDocument.version;
  DocCommandData.command = command;
  DocCommandData.legalEntityCode = EdocsApi.getAttributeValue("EDRPOUOrg").value;
  DocCommandData.userEmail = EdocsApi.getEmployeeDataByEmployeeID(CurrentUser.employeeId).email;
  DocCommandData.userTitle = CurrentUser.fullName;
  DocCommandData.comment = routeStage.comment;
  DocCommandData.signatures = signatures;

  routeStage.externalAPIExecutingParams = {
    externalSystemCode: "ESIGN1", // код зовнішньої системи
    externalSystemMethod: "integration/processDocCommand", // метод зовнішньої системи
    data: DocCommandData, // дані, що очікує зовнішня система для заданого методу
    executeAsync: false, // виконувати завдання асинхронно
  };
}

//Скрипт 2. Зміна властивостей атрибутів при створені документа
function setInitialRequired() {
  if (CurrentDocument.inExtId) {
    controlRequired("edocsIncomeDocumentNumber");
    controlRequired("edocsIncomeDocumentDate");
    controlRequired("DataInspection");
    controlRequired("PlaceInspection");
    controlRequired("NumberLocomotive");
    controlRequired("DataInspection");
    controlRequired("SeriesLocomotive");
    controlRequired("NumberLocom");
    controlRequired("NumberContract");
    controlRequired("DateContract");
    controlRequired("edocsDocSum");
    controlRequired("RequestVATPerecent");
  } else {
    controlRequired("edocsIncomeDocumentNumber", false);
    controlRequired("edocsIncomeDocumentDate", false);
    controlRequired("DataInspection", false);
    controlRequired("PlaceInspection", false);
    controlRequired("NumberLocomotive", false);
    controlRequired("DataInspection", false);
    controlRequired("SeriesLocomotive", false);
    controlRequired("NumberLocom", false);
    controlRequired("NumberContract", false);
    controlRequired("DateContract", false);
    controlRequired("edocsDocSum", false);
    controlRequired("RequestVATPerecent", false);
  }
}

function controlRequired(CODE, required = true) {
  const control = EdocsApi.getControlProperties(CODE);
  control.required = required;
  EdocsApi.setControlProperties(control);
}

function onCardInitialize() {
  setInitialRequired();
  CreateAccountTask();
}

//Скрипт 3. Неможливість внесення змін в поля карточки
function CreateAccountTask() {
  const stateTask = EdocsApi.getCaseTaskDataByCode("CreateAccount").state;
  if (stateTask == "assigned" || stateTask == "inProgress" || stateTask == "completed'") {
    controlDisabled("edocsIncomeDocumentNumber");
    controlDisabled("edocsIncomeDocumentDate");
    controlDisabled("DataInspection");
    controlDisabled("Comment");
    controlDisabled("NumberLocomotive");
    controlDisabled("PlaceInspection");
    controlDisabled("SeriesLocomotive");
    controlDisabled("Comment");
    controlDisabled("NumberLocom");
    controlDisabled("Section");
    controlDisabled("NumberContract");
    controlDisabled("DateContract");
    controlDisabled("edocsDocSum");
    controlDisabled("RequestVATPerecent");
  } else {
    controlDisabled("edocsIncomeDocumentNumber", false);
    controlDisabled("edocsIncomeDocumentDate", false);
    controlDisabled("DataInspection", false);
    controlDisabled("Comment", false);
    controlDisabled("NumberLocomotive", false);
    controlDisabled("PlaceInspection", false);
    controlDisabled("SeriesLocomotive", false);
    controlDisabled("Comment", false);
    controlDisabled("NumberLocom", false);
    controlDisabled("Section", false);
    controlDisabled("NumberContract", false);
    controlDisabled("DateContract", false);
    controlDisabled("edocsDocSum", false);
    controlDisabled("RequestVATPerecent", false);
  }
}

function controlDisabled(CODE, disabled = true) {
  const control = EdocsApi.getControlProperties(CODE);
  control.disabled = disabled;
  EdocsApi.setControlProperties(control);
}
