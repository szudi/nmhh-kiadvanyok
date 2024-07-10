	
var g_HtmlArea = null;
var g_project_name = null;
var g_structure_name = null;
var g_call_structure_name = null;
var g_arrPostInits = new Array();
var g_arrResizeScripts = new Array();
	
var fromWindowWidth = 500;
var dialogWindowWidth = 200;
var dialogWindowHeight = 100;
	
	
window.onresize = DoResizeScripts;

if (typeof(debug) == "undefined") {
	debug = function(strMessage, objObject) {
		if(typeof(console) != "undefined")
			console.debug(strMessage, objObject);
	}
}

if (typeof(error) == "undefined") {
	error = function(strMessage, objObject) {
		if(typeof(console) != "undefined")
			console.error(strMessage, objObject);
	}
}


function LngChnOnChange(frmTarget, strLang, arrControls, strOld)
{	
	var strCurrent = null;
	var ctlCurrent = null;
	var ctlData = null;
	
	
	for (var i=0; i < arrControls.length; i++)
	{	
		strCurrent = arrControls[i];
		ctlCurrent = frmTarget.elements[strCurrent];
		
		if (strOld != "none")
		{	
			ctlData = frmTarget.elements[strCurrent + "_" + strOld];
			ctlData.value = ctlCurrent.value;
		}	
		
		ctlData = frmTarget.elements[strCurrent + "_" + strLang];
		ctlCurrent.value = ctlData.value;
	}	
	
	
	return strLang;
}	
	
function selectNode(nodContext, strPath, strName, strValue)
{	
	var arrPath = strPath.split('/');
	var arrResult = new Array();
	
	
	selectNodeImp(nodContext, arrPath, 0, arrResult);
	
	
	return arrResult;
}	

function selectNodeImp(nodContext, arrPath, intPos, arrResult)
{	
	var intNext = intPos + 1;
	var strName = arrPath[intPos];
	var blnLast = ( arrPath.length == intNext );
	
	
	for (var i=0; i<nodContext.childNodes.length; i++)
	{	
		if (typeof(nodContext.childNodes[i].tagName) != 'undefined' &&
			nodContext.childNodes[i].tagName.toLowerCase() 
			== strName.toLowerCase())
		{	
			if (blnLast)
			{	
				arrResult[arrResult.length] = nodContext.childNodes[i];
			}	
			else
			{	
				selectNodeImp(
					nodContext.childNodes[i], arrPath, intNext, arrResult);
			}	
		}	
	}	
}	
	
function CallNewPage(objHost, objForm)
{	
/*	
comm_control_name=edit-struct
comm_action_key=new-page
-RECALL WITH SelectRowControl
*/	
	var strOldControlName = objForm.comm_control_name.value;
	var strOldAction = objForm.comm_action_key.value;
	
	
	objForm.comm_control_name.value = "edit-struct";
	objForm.comm_action_key.value = "new-page";
	createTarget(objForm); 
	objForm.submit();
	
	objForm.comm_control_name.value = strOldControlName;
	objForm.comm_action_key.value = strOldAction;
}	
	
function CallModifyPage(objHost, objForm, strControlName)
{	
/*	
comm_control_name=edit-struct
comm_action_key=modify-page
period_id=2
-NO RECALL
-- controlname
-- structurename
*/	
	var strStructName = objForm.comm_structure_name.value;
	var strOldControlName = objForm.comm_control_name.value;
	var strOldAction = objForm.comm_action_key.value;
	var strOldResult = objForm.result_mode.value;
	var objChange = objForm.ch_other;
	var strChName = objChange.name;
	var strID = "";
	
	
	eval("strID = objHost." + strControlName + ".value");
	
	if (strID != "" && strID != "null" && strID != null)
	{	
		objForm.comm_control_name.value = "edit-struct";
		objForm.comm_action_key.value = "modify-page";
		objForm.result_mode.value = "BROWSE";
		objChange.name = strStructName + "_id";
		objChange.value = strID;
		createTarget(objForm); 
		objForm.submit();
	}	
	else
	{	
		alert(GetLangText("NO-SEL-DOC"));
	}	
	
	/*	
	alert(objForm.name);
	alert(objForm.ch_other.name);
	alert("objForm.comm_control_name.value: " + objForm.comm_control_name.value
		+ "\nobjForm.comm_action_key.value: " + objForm.comm_action_key.value);
	*/	
	
	objForm.comm_control_name.value = strOldControlName;
	objForm.comm_action_key.value = strOldAction;
	objForm.result_mode.value = strOldResult;
	objChange.name = strChName;
}	
	
function ShortDateOnBlur(sdtSource, hdnTarget, strDelimiter)
{	
	var strValue = sdtSource.value;
	var blnReturn = true;
	
	
	if (strValue.length == 8)
	{
		var strYear = strValue.substring(0, 4);
		var strMonth = strValue.substring(4, 6);
		var strDay = strValue.substring(6, 8);
		
		hdnTarget.value = strYear + strDelimiter
			+ strMonth + strDelimiter + strDay;
	}
	else
	{	
		if (strValue.length > 0)
		{	
			//alert(GetLangText("BAD-DATE-LEN"));
			//sdtSource.focus();
			//blnReturn = false;
			
			hdnTarget.value = "BADDATA";
		}	
		else
		{	
			hdnTarget.value = "";
		}	
	}	
	
	
	return blnReturn;
}	
	
function ShortDateSetValue(sdtTarget, strValue)
{	
	if (strValue.length == 10)
	{	
		var strYear = strValue.substring(0, 4);
		var strMonth = strValue.substring(5, 7);
		var strDay = strValue.substring(8, 10);
		
		sdtTarget.value = strYear + strMonth + strDay;
	}	
}	
	
function ShortDateCheckValue(sdtTarget, hdnTarget, blnNeeded)
{	
	var strValue = hdnTarget.value;
	var blnReturn = true;
	
	
	if (strValue.length == 10)
	{	
		var strYear = strValue.substring(0, 4);
		var strMonth = strValue.substring(5, 7);
		var strDay = strValue.substring(8, 10);
		
		var ctlYear = new ShortDateWrap(sdtTarget, strYear);
		var ctlMonth = new ShortDateWrap(sdtTarget, strMonth*1);
		var ctlDay = new ShortDateWrap(sdtTarget, strDay*1);
		
		blnReturn = CheckDateControlsValue(ctlYear, ctlMonth, ctlDay, blnNeeded);
	}	
	else
	{	
		if (blnNeeded)
		{	
			alert(GetLangText("BAD-DATE-LEN"));
			sdtTarget.focus();
			blnReturn = false;
		}	
	}	
	
	
	return blnReturn;
}	
	
function ShortDateWrap(ctlTarget, strValue)
{	
	this.value = strValue;
	this.m_ctlTarget = ctlTarget;
}	
	
ShortDateWrap.prototype.focus = function () 
{	
	this.m_ctlTarget.focus();
}	
	
function NumericControlShow(numSource, hdnShow, strSeparator)
{	
	var strValue = numSource.value;
	var intLength = strValue.length;
	var strNew = "";
	var intPos = 0;
	
	
	for (var i = intLength; i > 0; i--)
	{	
		intPos++;
		
		strNew = strValue.substring(i-1, i) + strNew;
		
		if (intPos % 3 == 0 && intPos < intLength)
		{	
			strNew = strSeparator + strNew;
		}	
	}	
	
	hdnShow.value = strNew;
}	
	
function copyFormElements(frmFrom, frmTo)
{	
	var inpAdd = null;
	var inpCurr = null;
	
	
	for (var i=0; i < frmFrom.elements.length; i++)
	{	
		inpCurr = frmFrom.elements[i];
		
		inpAdd = document.createElement("input");
		
		inpAdd.setAttribute("type", inpCurr.type);
		inpAdd.setAttribute("name", inpCurr.name);
		inpAdd.setAttribute("value", inpCurr.value);
		
		frmTo.appendChild(inpAdd);
	}	
}	
	
function AddPostInit(strCmd)
{	
	g_arrPostInits[g_arrPostInits.length] = strCmd;
}	
	
function PostInit()
{	
	for (var i = 0; i < g_arrPostInits.length; i++)
	{	
		strCmd = g_arrPostInits[i];
		
		//alert(strCmd);
		
		try
		{	
			eval(strCmd);
		}	
		catch (e)
		{	
			if (console != undefined)
				console.debug("exception " + e, strCmd);
		}	
	}	
}	
	
function CtrlNumVal(objForm, strName)
{	
	var strCmd = "strValue = objForm." + strName + ".value";
	var strValue = null;
	
	
	eval(strCmd);
	
	strValue = strValue.replace(",", ".");
	
	
	return strValue*1;
}	
	
function AddResizeScript(strCmd)
{	
	g_arrResizeScripts[g_arrResizeScripts.length] = strCmd;
}	
	
function DoResizeScripts()
{	
	for (i = 0; i < g_arrResizeScripts.length; i++)
	{	
		strCmd = g_arrResizeScripts[i];
		
		//alert(strCmd);
		
		eval(strCmd);
	}	
}	
	
function createTarget(form) 
{
//http://javascript.internet.com/forms/form-target-formatting.html	
	_target = form.target;
	_colon = _target.indexOf(":");
	if(_colon != -1) 
	{
		form.target = _target.substring(0,_colon);
		form.args = _target.substring(_colon+1);
	} 
	else if(typeof(form.args)=="undefined") 
	{
		form.args = "";
	}
	if(form.args.indexOf("{")!=-1) 
	{
		_args = form.args.split("{");
		form.args = _args[0];
		for(var i = 1; i < _args.length;i++) 
		{
			_args[i] = _args[i].split("}");
			form.args += eval(_args[i][0]) + _args[i][1];
		}
	}
	form.args = form.args.replace(/ /g,"");
	form.args = form.args.replace(/\n/g,"");
	form.args = form.args.replace(/\r/g,"");
	form.args = form.args.replace(/\t/g,"");
	//http://javascript.internet.com/bgeffects/bouncing-image.html
	//alert(document.body.clientWidth);
	_win = window.open('/licoms/process.html',form.target,form.args);
	
	if(typeof(focus)=="function")
		_win.focus();
	
	return true;
}

function ClearEditPage()
{
	if (typeof(top.freMain) != "undefined" && typeof(top.freMain.freEdit) != "undefined")
		top.freMain.freEdit.document.location = '/licoms/blank.html';
	if (typeof(top.freEdit) != "undefined")
		top.freEdit.document.location = '/licoms/blank.html';
	
}

function RefreshSearchPage()
{
	top.freSearch.recallPage();
}


function SetValue(objCtl, strVal)
{	
	objCtl.value = strVal;
}	

function RemoveTags(strVal) {
	if(strVal == null) {
		error("RemoveTags got null parameter");
		return null;
	}
	else
		return(strVal.replace(/<[^>]*>/gi,""));
} 
	

function SelectRadio(objCtl, strVal)
{
    for (var i = 0; i < objCtl.length; i++)
    {
	if(objCtl[i].value == strVal)
	{
	    objCtl[i].checked=true;
	}
    }
}	
	
function CheckSearchNumber(ctlTarget, strTitle)
{	
	var blnReturn = true;
	
	
	if (ctlTarget.value != "") 
	{	
		var rexExp = new RegExp(/^[0-9]+$/);
		
		if ( ! rexExp.test(ctlTarget.value) ) 
		{	
			alert(GetLangText("ONLY-NUM", strTitle));
			
			ctlTarget.focus();
			
			blnReturn = false;
		}	
	}	
	
	
	return blnReturn;
}	
	
function CheckRadioControlValue(objCtl)
{	
	var blnValid = false;
	
	
	for (var i = 0; i < objCtl.length && !blnValid; i++)
	{	
		blnValid = objCtl[i].checked;
	}	
	
	
	return blnValid;
}	
	
function SelectItem(objCtl, strVal)
{	
	if (navigator.appName == "Netscape")
	{
		for (var i = 0; i < objCtl.options.length; i++)
		{
			if (objCtl.options[i].value == strVal)
				objCtl.options[i].selected = true;
		}
	}
	else
	{
		var i = 0;
		while ( i < objCtl.options.length && objCtl.options[i].value != strVal)
		{
			i++;
		}
		if ( i < objCtl.options.length ) {
			objCtl.value = strVal;
		}
	}
}	

function InsertSelectValue(objTxa, objSel) {
	for (var i = 0; i < objSel.options.length && ! objSel.options[i].selected ; i++)
	{
	}
	if ( i < objSel.options.length ) {
	  if ( objSel.options[i].id == "edit"){
		} else {
			var val = objTxa.value;
			val = "," + val + ",";
			if ( val.indexOf("," + objSel.options[i].value+ ",") == -1 ) {
				if ( objTxa.value != "" ) {
					objTxa.value += ","
				}
				objTxa.value += objSel.options[i].value;
			}
		}
	}			
}

function InicCheckBoxValue(objCtlCb, objCtl, strVal, strTrueVal, strFalseVal)
{
	if ( strVal == strTrueVal ){
		objCtlCb.checked = true;
		objCtl.value = strTrueVal;
	} else {
		objCtlCb.checked = false;
		objCtl.value = strFalseVal;	
	}
}

function ChangeCheckBoxValue(objCtlCb, objCtl, strTrueVal, strFalseVal) 
{
	if ( objCtlCb.checked ){
		objCtl.value = strTrueVal;
	} else {
		objCtl.value = strFalseVal;	
	}
}
	
function SetDateControlsValue(strDate, ctlYear, ctlMonth, ctlDay)
{	
	var success = false;
	if (strDate.length == 10)
	{	
		strYear = strDate.substring(0, 4);
		strMonth = strDate.substring(5, 7);
		strDay = strDate.substring(8, 10);
		success = true;
	} else if ( strDate.indexOf("-") == -1 && strDate.length == 8 ) {
		strYear = strDate.substring(0, 4);
		strMonth = strDate.substring(4, 6);
		strDay = strDate.substring(6, 8);
		success = true;
	}
	if ( success ) {
		ctlYear.value = strYear;
		SelectItem(ctlMonth, strMonth);
		SelectItem(ctlDay, strDay);
	}
}	
	
function SetDateTimeControlsValue(strDate, ctlYear, ctlMonth, ctlDay, ctlHour, ctlMin)
{	
	var success = false;
	if (strDate.length > 15)
	{	
		strYear = strDate.substring(0, 4);
		strMonth = strDate.substring(5, 7);
		strDay = strDate.substring(8, 10);
		strHour = strDate.substring(11, 13);
		strMin = strDate.substring(14, 16);
		success = true;
	} else if ( strDate.indexOf("-") == -1 && strDate.length > 13 ) {
		strYear = strDate.substring(0, 4);
		strMonth = strDate.substring(4, 6);
		strDay = strDate.substring(6, 8);
		strHour = strDate.substring(8, 10);
		strMin = strDate.substring(10, 12);
		success = true;
	}
	if ( success ) {
		ctlYear.value = strYear;
		SelectItem(ctlMonth, strMonth);
		SelectItem(ctlDay, strDay);
		SelectItem(ctlHour, strHour);
		SelectItem(ctlMin, strMin);
	}
}	

function SetTimeControlsValue(strTime, ctlHour, ctlMin)
{	
	var success = false;

	if (strTime.length == 5)
	{	
		strHour = strTime.substring(0, 2);
		strMin = strTime.substring(3, 5);
		success = true;
	} 

	if ( success ) {
		SelectItem(ctlHour, strHour);
		SelectItem(ctlMin, strMin);
	}
}	


function CheckSelectControlValue(objForm)
{
	for (var i = 0; i < objForm.options.length && ! objForm.options[i].selected ; i++)
	{
	}
	if ( i < objForm.options.length ) {
	  if ( objForm.options[i].id == "edit"){
			alert(GetLangText("FLD-NEED"));
			objForm.focus();
			return false;
		} else {
			return true;
		}
	} else {
		alert(GetLangText("NO-SEL"));
		objForm.focus();
		return false;
	}			
}
	
function CheckDateControlsValue(ctlYear, ctlMonth, ctlDay, blnNeeded)
{	
	
	if ( ctlYear.value != "" )
	{	
		if ( isNaN(ctlYear.value) )
		{
			alert(GetLangText("DATE-YEAR-NUM"));
			
			ctlYear.focus();
			
			return	false;
		}
	
		if ( ctlMonth.value < 1 || ctlMonth.value > 12 ) 
		{	
			alert(GetLangText("BAD-MONTH"));
			
			ctlMonth.focus();
			
			return	false;
		}	
		
		if ( ctlDay.value < 1 ) 
		{	
			alert(GetLangText("BAD-DAY"));
			
			ctlDay.focus();
			
			return false;
		}	
		
		if ( (	ctlMonth.value == 1 || ctlMonth.value == 3 || ctlMonth.value == 5 || ctlMonth.value == 7 ||
				ctlMonth.value == 8 || ctlMonth.value == 10 || ctlMonth.value == 12 ) && ctlDay.value > 31 )
		{	
			alert(GetLangText("BAD-DAY"));
			
			ctlDay.focus();
			
			return false;
		}	
		
		if ( (	ctlMonth.value == 4 || ctlMonth.value == 6 || ctlMonth.value == 9 || ctlMonth.value == 11 ) 
				&& ctlDay.value > 30 )
		{	
			alert(GetLangText("BAD-DAY"));
			
			ctlDay.focus();
			
			return false;
		}	
		
		isLeap = false;
		
		if ( ctlYear.value % 400 == 0 ) 
		{	
			isLeap = true;
		}	
		else
		{	
			if ( ctlYear.value % 100 == 0 ) 
			{	
	        	isLeap = false;
	      	}	
	      	else
	      	{	
				if ( ctlYear.value % 4 == 0 ) 
				{	
					isLeap = true;
				}	
			}	
		}	
		if (	(  isLeap && ctlMonth.value == 2 && ctlDay.value > 29 ) ||
				( !isLeap && ctlMonth.value == 2 && ctlDay.value > 28 ) ) 
		{	
			alert(GetLangText("BAD-DAY"));
			ctlDay.focus();
			
			return false;
		}	
		
		
	    return true;
 	}	
 	else 
 	{	
		if ( blnNeeded ) 
		{	
			alert(GetLangText("NEED-DATE"));
			
			ctlYear.focus();
			
			return false;
    	}	
    	else 
    	{	
      		return true;
		}	
	}	
	
	return true;
}	

function CheckDateTimeControlsValue(ctlYear, ctlMonth, ctlDay, ctlHour, ctlMin, blnNeeded)
{	
	var blnValid = CheckDateControlsValue(ctlYear, ctlMonth, ctlDay, blnNeeded);
	
	if(blnValid)
	{
		blnValid = CheckTimeControlsValue(ctlHour, ctlMin, blnNeeded);
	} 	

	return blnValid;
}
	
function CheckTimeControlsValue(ctlHour, ctlMin, blnNeeded)
{	
	var blnValid = true;

	if( ctlHour.value == -1)
	{
		if(blnNeeded == true)
		{
			alert(GetLangText("NEED-HOUR"));
			ctlHour.focus();
			blnValid = false;
		}
	}
	else
	{

	if ( ctlHour.value < 0 || ctlHour.value > 23 ) 
	{	
		alert(GetLangText("BAD-HOUR"));
		
		ctlHour.focus();
		
		blnValid = false;
	}	

	if ( blnValid && (ctlMin.value < 0 || ctlMin.value > 59) ) 
	{	
		alert(GetLangText("BAD-MIN"));
		
		ctlMin.focus();
		
		blnValid = false;
	}	
 	}
	return blnValid;
}

function SetDateHiddenValue(ctlHidden, ctlYear, ctlMonth, ctlDay)
{	
	ctlHidden.value = 
		ctlYear.value + "-" + ctlMonth.value + "-" + ctlDay.value;
}	
	
function SetDateTimeHiddenValue(ctlHidden, ctlYear, ctlMonth, ctlDay, ctlHour, ctlMin)
{	
	ctlHidden.value = 
		ctlYear.value + "-" + ctlMonth.value + "-" + ctlDay.value + " " + ctlHour.value + ":" + ctlMin.value + ":00";
}	

function SetTimeHiddenValue(ctlHidden, ctlHour, ctlMin)
{	
    if(ctlHour.value < 0)
	{
	  ctlHidden.value = "";
	}
	else
	{
		ctlHidden.value = 
			ctlHour.value + ":" + ctlMin.value;
	}
}	
	
function Occurs(strText)
{	
	var intOcc = 0;
	var intAt = strText.indexOf("\n");
	
	
	while (intAt > -1)
	{	
		intOcc++;
		
		strText = strText.substr(intAt+1);
		intAt = strText.indexOf("\n");
	}	
	
	
	return intOcc;
}	
	
function TextAreaLength(fctCurrentLength, fctTextArea, intMaxLenght)
{	
	var intOccurs = Occurs(fctTextArea.value);
	var intLength = fctTextArea.value.length + intOccurs;
	
	
 	if (intLength > intMaxLenght)
 	{	
		fctTextArea.value = fctTextArea.value.substring(0, intMaxLenght-intOccurs);
		fctCurrentLength.value = 0;
	}	
	else
	{	
    	fctCurrentLength.value = intMaxLenght - intLength;
	}	
	
	
  	return true;
}	
	
function PositionUp(strID, intPosition)
{	
	document.frmPosition.old_position.value = intPosition;
	document.frmPosition.new_position.value = intPosition - 1;
	document.frmPosition.id.value = strID;
	
	createTarget(document.frmPosition);
	
	document.frmPosition.submit();
}	
	
function PositionDown(strID, intPosition)
{	
	document.frmPosition.old_position.value = intPosition;
	document.frmPosition.new_position.value = intPosition + 1;
	document.frmPosition.id.value = strID;
	
	createTarget(document.frmPosition);
	
	document.frmPosition.submit();
}	
		
function CreateNewChild(strID)
{	
	document.frmNewChild.tree_id.value = strID;
	
	document.frmNewChild.submit();
}	
	
function ModifyTreeNode(strTreeID, objID, strID)
{	
	document.frmModTree.tree_id.value = strTreeID;
	objID.value = strID;
	
	document.frmModTree.submit();
}	
	
function SelectRecord(strShowValue, strCodeValue, strCallerName)
{	
	var strEval = "window.opener.SelectItem_" + strCallerName 
		+ "(RemoveTags(URLDecode('" + strShowValue + "')), URLDecode('" + strCodeValue + "'));";
	
	eval(strEval);
	
	window.close();
}	
	
function VisibilityControl(objForm, strName, strType, blnEnable)
{	
	if (strType == "html-area")
	{	
		var imgEdit = null;
		
		
		strCmd = "imgEdit = objForm.hta_" + strName + "_edt";
		eval(strCmd);
		
		if (blnEnable)
		{	
			imgEdit.style.display = "block";
		}	
		else
		{	
			imgEdit.style.display = "none";
		}	
		
		strCmd = "objForm.hta_" + strName + ".disabled = !blnEnable";
		eval(strCmd);
	}	
	if (strType == "textbox")
	{	
		strCmd = "objForm.txt_" + strName + ".disabled = !blnEnable";
		
		eval(strCmd);
	}	
	else if (strType == "codeset" || strType == "select")
	{	
		strCmd = "objForm.sel_" + strName + ".disabled = !blnEnable";
		
		eval(strCmd);
	}
	else if (strType == "simple-codename") 
	{
		selBtn = document.getElementById("scn_" + strName + "_selbtn");
		resetBtn = document.getElementById("scn_" + strName + "_resetbtn");
		if ( blnEnable ) {
			selBtn.style.visibility='visible';
			if ( resetBtn ) {
				resetBtn.style.visibility='visible';
			}
		} else {
			selBtn.style.visibility='hidden';
			if ( resetBtn ) {
				resetBtn.style.visibility='hidden';
			}
		}
	}
}	
	
/*		
	Multi Copy supported Select Record
*/	
function SelectRecordWithMC(strShowValue, strCodeValue, strCallerName, arrMultiCopy)
{	
	LoadRecordWithMC(strShowValue, strCodeValue, strCallerName, arrMultiCopy);
	
	window.close();
}	
	
function LoadRecordWithMC(strShowValue, strCodeValue, strCallerName, arrMultiCopy)
{	
	var strEval = "window.opener.SelectItem_" + strCallerName 
		+ "(RemoveTags(URLDecode('" + strShowValue + "')), URLDecode('" 
		+ strCodeValue + "'), arrMultiCopy);";
	
	eval(strEval);
}	
	
function OnChangeMultiCopySelect(selSource, arrData)
{	
	var intPos = selSource.selectedIndex;
	
	
	if (intPos > 0)
	{	
		SetMultiCopyValues(selSource.form, arrData[intPos]);
	}	
}	
	
function SetMultiCopyValues(objForm, arrMultiCopy)
{	
	var objProperty = null;
	var strValue = "";
	var strCmd = "";
	var objCtl = null;
	
	
	for (i=0; i < arrMultiCopy.length; i++)
	{	
		objProperty = arrMultiCopy[i];
		
		
		if (objProperty._proptype == "textbox")
		{	
			for (var strColumn in objProperty)
			{	
				if (strColumn.indexOf("_") != 0)
				{	
					strValue = objProperty[strColumn];
					strValue = RemoveTags(URLDecode(strValue));
					
					strCmd = "objCtl = objForm.txt_" + objProperty._propname;
					
					eval(strCmd);
					
					objCtl.value = strValue;
				}	
			}	
		}	
		else if (objProperty._proptype == "textarea")
		{	
			for (var strColumn in objProperty)
			{	
				if (strColumn.indexOf("_") != 0)
				{	
					strValue = objProperty[strColumn];
					strValue = RemoveTags(URLDecode(strValue));
					
					strCmd = "objCtl = objForm.txa_" + objProperty._propname ;
					
					eval(strCmd);
					
					objCtl.value = strValue;
				}	
			}	
		}	
		else if (objProperty._proptype == "codeset")
		{	
			for (var strColumn in objProperty)
			{	
				if (strColumn.indexOf("_") != 0)
				{	
					strValue = objProperty[strColumn];
					strValue = RemoveTags(URLDecode(strValue));
					
					strCmd = "objCtl = objForm.sel_" + objProperty._propname ;
					
					eval(strCmd);
					
					SelectItem(objCtl, strValue);
				}	
			}	
		}	
		else
		{	
			alert("Not supported control type for MultiCopy!");
		}	
	}	
}	
	
function LocateParentNode(objCurrent, strNodeName)
{	
	var blnFound = false;
	var objFound = null;
	
	
	while (!blnFound)
	{	
		objCurrent = objCurrent.parentNode;
//		alert(objCurrent);
//		alert(objCurrent.nodeName);
		
		if (objCurrent.nodeName == strNodeName)
		{	
			objFound = objCurrent;
			blnFound = true;
		}	
	}	
	
	
	return objFound;
}	
	
function LocateParentForm(objCurrent)
{	
	return LocateParentNode(objCurrent, 'FORM');
}	
	
function LocateChild(objParent, strNodeName, strName)
{	
	var objFound = null;
	var objCurrent = null;
	var arrChildren = objParent.childNodes;
	
	
	for (var i = 0; i < arrChildren.length && objFound == null; i++)
	{	
		objCurrent = arrChildren[i];
		
		if (objCurrent.nodeName == strNodeName && objCurrent.name.indexOf(strName) > -1)
		{	
			objFound = objCurrent;
		}	
		else
		{	
			objFound = LocateChild(objCurrent, strNodeName, strName);
		}	
	}	
	
	
	return objFound;
}	
	
function LocateChildren(objParent, strNodeName, strName, arrFound)
{	
	var objFound = null;
	var objCurrent = null;
	var arrChildren = objParent.childNodes;
	
	
	for (var i = 0; i < arrChildren.length && objFound == null; i++)
	{	
		objCurrent = arrChildren[i];
		
		if (objCurrent.nodeName == strNodeName && objCurrent.name.indexOf(strName) > -1)
		{	
			arrFound[arrFound.length] = objCurrent;
		}	
		
		LocateChildren(objCurrent, strNodeName, strName, arrFound);
	}	
}	
	
function SaveHtmlArea(strContent)
{	
	g_HtmlArea.value = strContent;
	g_HtmlArea.onkeyup();
}	

function LoadHtmlArea()
{	
	return(g_HtmlArea.value);
}	

function GetProjectName()
{	
	return(g_project_name);
}	

function GetStructureName()
{	
	return(g_structure_name);
}	
	
function GetCallStructureName()
{	
	return(g_call_structure_name);
}	
	
function ShowHtmlArea(objTextArea, strProjectName, strStructureName, strCallStructureName)
{	
	g_HtmlArea = objTextArea;	
	g_project_name = strProjectName;
	g_structure_name = strStructureName;
	
	if (strCallStructureName == undefined)
	{	
		g_call_structure_name = strStructureName;
	}	
	else
	{	
		g_call_structure_name = strCallStructureName;
	}	
	
	window.open('/licoms/htmlarea/wysiwyg.html','chblokk','toolbar=no,location=no,directories=no,status=yes,menubar=no,resizable=yes,scrollbars=yes,width=620,height=500');
}	
	
function GroupCodeNameSet(objCallerForm, strStructureName)
{	
	objCallerForm.comm_structure_name.value = strStructureName;
	objCallerForm.req_session.value = 
		strStructureName + ".selector:" + objCallerForm.component_path.value;
}	
	
function GroupCodeNameShowSearcher(objCallerForm, objParmForm, strStructureName)
{	
	GroupCodeNameSet(objCallerForm, strStructureName);
	createTarget(objCallerForm);
	objCallerForm.submit();
}	
	
function SelectMainColumn(strFormName, strID)
{	
	eval('document.' + strFormName + '.id.value = strID');
	createTarget(eval('document.' + strFormName));
	eval('document.' + strFormName + '.submit()');
}	
	
function DeleteRecord(strID, strStructName, strTreeID)
{	
	var objForm = null;
	
	
	eval("objForm = document.frmDeleteRecord_" + strStructName + ";");
	eval("objForm." + strStructName + "_id.value = '" + strID + "'");
	
	objForm.tree_id.value = strTreeID;
	
	objForm.submit();
}	

function CheckPassword( ctlPwd1, ctlPwd2, blnNeeded	) 
{
	if ( ctlPwd1.value == ctlPwd2.value )
	{
		if ( ctlPwd1.value == "" && blnNeeded ) {
			alert(GetLangText("PWDS-NEED"));
			ctlPwd1.focus();
			return false;			
		}
	} else {
		alert(GetLangText("PWDS-EQ"));
		ctlPwd1.focus();
		return false;
	}
	
	return true;
	 
}	
	
function WebImageConvertFrom(objCaller, objForm, strConvert)
{	
	var strFilePath = "";
	
	
	eval("strFilePath = objForm.wim_" + strConvert + ".value");
	
	if (strFilePath == "")
	{	
		alert(GetLangText("NEED-IMG"));
	}	
	else
	{	
		objCaller.prop_name.value = strConvert;
		objCaller.file_path.value = strFilePath;
		
		objCaller.comm_action_key.value = "convert-from";
		
		objCaller.submit();
	}	
}	
	
function WebImageConvertAll(objCaller, objForm, strFilePath)
{	
	if (strFilePath == "")
	{	
		alert(GetLangText("NEED-IMG"));
	}	
	else
	{	
		objCaller.prop_name.value = "";
		objCaller.file_path.value = strFilePath;
		
		objCaller.comm_action_key.value = "convert-all";
		
		objCaller.submit();
	}	
}	
	
function ShowWebImage(strWebPath, strPath)
{	
	if (strPath == "")
	{	
		alert(GetLangText("NO-LINK-IMG"));
	}	
	else
	{	
		window.open(strWebPath + strPath, 
			'_blank', 
			'toolbar=no,location=no,directories=no,status=yes,menubar=no,resizable=yes,scrollbars=yes,width=640,height=480'
			);
	}	
}	

// ====================================================================
//       URLEncode and URLDecode functions
//
// Copyright Albion Research Ltd. 2002
// http://www.albionresearch.com/
// http://www.albionresearch.com/misc/urlencode.htm
// You may copy these functions providing that 
// (a) you leave this copyright notice intact, and 
// (b) if you use these functions on a publicly accessible
//     web site you include a credit somewhere on the web site 
//     with a link back to http://www.albionresarch.com/
//
// If you find or fix any bugs, please let us know at albionresearch.com
//
// SpecialThanks to Neelesh Thakur for being the first to
// report a bug in URLDecode() - now fixed 2003-02-19.
// ====================================================================
function URLEncode(plaintext)
{
	if(plaintext == null) {	
		error("URLEncode got null parameter");
		return null;
	}
	// The Javascript escape and unescape functions do not correspond
	// with what browsers actually do...
	var SAFECHARS = "0123456789" +					// Numeric
					"ABCDEFGHIJKLMNOPQRSTUVWXYZ" +	// Alphabetic
					"abcdefghijklmnopqrstuvwxyz" +
					"-_.!~*'()";					// RFC2396 Mark characters
	var HEX = "0123456789ABCDEF";

	var encoded = "";
	for (var i = 0; i < plaintext.length; i++ ) {
		var ch = plaintext.charAt(i);
	    if (ch == " ") {
		    encoded += "+";				// x-www-urlencoded, rather than %20
		} else if (SAFECHARS.indexOf(ch) != -1) {
		    encoded += ch;
		} else {
		    var charCode = ch.charCodeAt(0);

			if(charCode == 337) {
                               encoded += "%F5";
                       } else if(charCode == 369) {
                               encoded += "%FB";
                       } else if(charCode == 336) {
                               encoded += "%D5";
                       } else if(charCode == 368) {
                               encoded += "%DB";
                       }
		       else if (charCode > 255) {
			    alert( "Unicode Character '" + ch + "' cannot be encoded using standard URL encoding.\n" +
				        "(URL encoding only supports 8-bit characters.)\n" +
						"A space (+) will be substituted." );
				encoded += "+";
			} else {
				encoded += "%";
				encoded += HEX.charAt((charCode >> 4) & 0xF);
				encoded += HEX.charAt(charCode & 0xF);
			}
		}
	} // for

	return encoded;
};

function URLDecode(encoded)
{
	if(encoded == null) {	
		error("URLDecode got null parameter");
		return null;
	}

	plaintext = encoded.replace(/\+/g, " ");
	
	return decodeURIComponent(plaintext);
}

function URLDecodeOld(encoded)
{
   // Replace + with ' '
   // Replace %xx with equivalent character
   // Put [ERROR] in output if %xx is invalid.
   var HEXCHARS = "0123456789ABCDEFabcdef"; 
   var plaintext = "";
   var i = 0;
   while (i < encoded.length) {
       var ch = encoded.charAt(i);
	   if (ch == "+") {
	       plaintext += " ";
		   i++;
	   } else if (ch == "%") {
			if (i < (encoded.length-2) 
					&& HEXCHARS.indexOf(encoded.charAt(i+1)) != -1 
					&& HEXCHARS.indexOf(encoded.charAt(i+2)) != -1 ) {
				if ( encoded.substr(i,3) == "%F5") {
					plaintext += "ő";
				} else if ( encoded.substr(i,3) == "%FB" ) {
					plaintext += "ű";
				} else if ( encoded.substr(i,3) == "%D5" ) {
					plaintext += "Ő";
				} else if ( encoded.substr(i,3) == "%DB" ) {
					plaintext += "Ű";
				} else {
					plaintext += unescape( encoded.substr(i,3) );
				}
				i += 3;
			} else {
				alert( 'Bad escape combination near ...' + encoded.substr(i) );
				plaintext += "%[ERROR]";
				i++;
			}
		} else {
		   plaintext += ch;
		   i++;
		}
	} // while
   return plaintext;
};	
	
// Simple List Control Helper Functions - BOB
	
function SListControlFill(arrData, strFill, objCtl)
{	
	var objItem = null;
	
	
	objCtl.options.length = 0;
	
	for (intPos = 0; intPos < arrData.length; intPos++)
	{	
		objItem = arrData[intPos];
		
		eval(strFill);
	}	
}	
	
function SListControlRemove(arrSource, objCtl, strArray)
{	
	/*
	alert("sel: "  + objCtl.selectedIndex 
		+ "arr-len: " + arrSource.length 
		+ "lst-len: " + objCtl.options.length 
		);
	*/
	var intPos = objCtl.selectedIndex;
	
	
	if (intPos > -1)
	{	
		arrSource[intPos] = null;
		objCtl.options[intPos] = null;
		
		arrSource = ArrayRemoveNull(arrSource, strArray);
		
		if (intPos > 0)
		{	
			objCtl.selectedIndex = intPos - 1;
		}	
		else if(objCtl.options.length > 0)
		{	
			objCtl.selectedIndex = 0;
		}	
	}	
	else
	{	
		alert(GetLangText("PLS-SEL-DEL"));
	}	
}	
	
function SListControlParse(arrData, strData, strRowSep, strValSep, strFill)
{	
	var arrRows = strData.split(strRowSep);
	var arrValues = null;
	
	
	if (strData.length != 0)
	{	
		for (intPos = 0; intPos < arrRows.length; intPos++)
		{	
			arrValues = arrRows[intPos].split(strValSep);
				
			eval(strFill);
		}	
	}	
}	

function SListControlSave(arrData, strRowSep, strValSep, strFill)
{	
	var objVal = null;
	var strSave = null;
	
	
	for (intPos = 0; intPos < arrData.length; intPos++)
	{	
		objVal = arrData[intPos];
		
		strSave = eval(strFill);
	}	
	
	
	return strSave;
}	

function ArrayRemoveNull(arrSource, strArray)
{	
	var arrTarget = new Array();
	
	
	for (intPos = 0; intPos < arrSource.length; intPos++)
	{	
		// alert("pos: " + intPos + " value: " + arrSource[intPos]);
		
		if (arrSource[intPos] != null)
			arrTarget[arrTarget.length] = arrSource[intPos];
	}	
	
	if (strArray != null)
		eval(strArray + " = arrTarget;")
	
	
	return arrTarget;
}	
	
// Simple List Control Helper Functions - EOB
	
function ChkMultiSelectInit(strPosition, strCodeValue)
{	
	var chkCurrent = null;
	var objFound = RLocateMultiCodeName(strPosition, strCodeValue)
	
	
	chkCurrent = document.getElementById('chkMultiSelect_' + strPosition);
	chkCurrent.checked = (objFound != null);
}	
	
function RLocateMultiCodeName(strPosition, strCodeValue)
{	
	var frmTarget = window.opener.g_form_multi_select;
	var strStructName = frmTarget.comm_structure_name.value
	var objFound = null;
	var strCommand = "objFound = LocateMultiCodeNameForm" 
		+ "(window.opener.document, '" + strStructName + "', '" + strCodeValue + "')";
	
	
	eval(strCommand);
	
	
	return objFound;
}	
	
function GetCodeNameControlName(strFormName)
{	
	var strName = strFormName.replace('frmSimpleCodeName_', '');
	var frmSrc = document[strFormName];
	
	if (frmSrc == undefined) frmSrc = {};
	
	debug("frmSrc", frmSrc);
	
	if (frmSrc.callercontrol != undefined) {
		strName = frmSrc.callercontrol.value;
	} else {
		strName = strName.replace(/^.*scn/, "scn");
		var intAt = strName.lastIndexOf('_');
		strName = strName.substr(0, intAt);
	}
	
	return strName;
}	
	
function InitCallMultiCodeName(strStructName)
{	
	var divRoot = document.getElementById("divCodeNameResultHeader_" + strStructName);
	var tdmTarget = document.getElementById("tdmCodeNameCall_" + strStructName);
	var selCodeName = LocateChild(divRoot, "SELECT", "_searcher");
	var selCloned = null;
	
	
	if (selCodeName != null)
	{	
		selCloned = selCodeName.cloneNode(true);
		
		tdmTarget.appendChild(selCloned);
	}	
}	
	
function CallMultiCodeName(strStructName)
{	
	var tdmTarget = document.getElementById("tdmCodeNameCall_" + strStructName);
	var divRoot = document.getElementById("divCodeNameResultHeader_" + strStructName);
	var frmCodeName = LocateChild(divRoot, "FORM", "CodeName");
	var selCodeName = LocateChild(divRoot, "SELECT", "_searcher");
	var frmNew = LocateChild(divRoot, "FORM", "New");
	var strControlName = GetCodeNameControlName(frmCodeName.name);
	
	
	strCmd = 'g_form_' + strControlName + ' = frmNew';
	eval(strCmd);
	g_form_multi_select = frmNew;
	
	if (selCodeName != null)
	{	
		selCloned = LocateChild(tdmTarget, "SELECT", "_searcher");
		
		selCodeName.value = selCloned.value;
		
		frmCodeName.comm_structure_name.value = selCloned.value;
		
		frmCodeName.req_session.value = 
			frmCodeName.req_session.value.replace("dummy", selCloned.value);
	}	
	
	frmCodeName.acr_multi_select.value = 'yes';
	createTarget(frmCodeName);
	
	frmCodeName.submit();
}	
	
//var doc2 = (new DOMParser()).parseFromString(strXML, "text/xml");
//alert(doc2);
	
//nodResponse = sendXMLRequest("/licoms/simple?" + strParms, doc2);
//,  strParms + "&DATA=" + URLDecode(strXML)
	
function MultiSelectProcess()
{	
	var blnFound = true;
	var frmTarget = window.opener.g_form_multi_select;
	var strStructName = frmTarget.comm_structure_name.value;
	var strProjectName = frmTarget.comm_project_name.value;
	var strCodeValue = null;
	var objFound = null;
	var strXML = "<forms>\n";
	var strParms = null;
	var nodResponse = null;
	var winProc = null;
	var docForms = null;
	
	
	for (var i = 1; i < 101 && blnFound; i++)
	{	
		chkCurrent = document.getElementById('chkMultiSelect_' + i);
		
		if (chkCurrent != undefined)
		{	
			strCodeValue = chkCurrent.value;
			
			objFound = RLocateMultiCodeName("" + i, strCodeValue);
			
			if (objFound != null)
			{	
				strXML += MultiSelectDelete(strStructName, objFound, i);
			}	
			else
			{	
				strXML += MultiSelectInsert(strStructName, frmTarget, chkCurrent, i);
			}	
		}	
		else
		{	
			blnFound = false;
		}	
	}	
	
	strXML += "</forms>\n";
	
	strParms = "comm_project_name=" + strProjectName
		+ "&comm_action_name=multi";
	//	+ "&comm_action_name=multi&DATA=" + URLDecode(strXML);
	
	winProc = openProcessWindow();
	
	nodResponse = sendXMLRequest("/licoms/simple?" + strParms, strXML);
	
	winProc.location = "/licoms/end_process.html";
	
	window.opener.recallPage();
	window.close();
}	
	
function MultiSelectDelete(strStructName, frmModify, intPos)
{	
	var objForm = null;
	var strID = null;
	var strOldTargetKey = null;
	var strOldTarget = null;
	var strXML = "";
	
	
	if (!chkCurrent.checked)
	{	
		eval("strID =  frmModify." + strStructName + "_id.value");
		
		eval("objForm = window.opener.document.frmDeleteRecord_" + strStructName + ";");
		eval("objForm." + strStructName + "_id.value = '" + strID + "'");
		
		strOldTargetKey = objForm.target_key.value;
		objForm.target_key.value = "no-refresh-";
		strOldTarget = objForm.target;
		objForm.target = intPos + "_" + objForm.target;
		
		//createTarget(objForm);
		//objForm.submit();
		
		strXML = generateForm(objForm);
		
		objForm.target_key.value = strOldTargetKey;
		objForm.target = strOldTarget;
	}	
	
	
	return strXML;
}	
	
function MultiSelectInsert(strStructName, frmTarget, chkCurrent, intPos)
{	
	var strOldTargetKey = null;
	var strOldTarget = null;
	var strXML = "";
	
	
	if (chkCurrent.checked)
	{	
		eval('SaveMultiSelect_' + intPos + '();');
		eval("frmTarget." + strStructName + "_id.value = 'get-new'");
		
		strOldTargetKey = frmTarget.target_key.value;
		frmTarget.target_key.value = "in-no-window";
		strOldTarget = frmTarget.target;
		frmTarget.target = intPos + "_" + frmTarget.target;
		
		//createTarget(frmTarget);
		//frmTarget.submit();
		
		strXML = generateForm(frmTarget);
		
		frmTarget.target_key.value = strOldTargetKey;
		frmTarget.target = strOldTarget;
	}	
	
	
	return strXML;
}	
	
function getMultiCodeNameForms(objDocument, strStructName)
{	
	var tblTest = null;
	var arrRows = null;
	var arrCols = null;
	var arrForms = null;
	
	
	if (typeof (g_arrCodeNameForms) == "undefined") 
	{	
		g_arrCodeNameForms = new Array();
		
		tblTest = objDocument.getElementById("divCodeNameResult_" + strStructName);
		arrRows = tblTest.getElementsByTagName("tr");
		
		for (var i = 0; i < arrRows.length; i++)
		{	
			arrCols = arrRows[i].getElementsByTagName("td");
			
			for (var j = 0; j < arrCols.length; j++)
			{	
				arrForms = arrCols[j].getElementsByTagName("form");
				
				for (var k = 0; k < arrForms.length; k++)
				{	
					if (arrForms[k].name.indexOf("frmModify_" + strStructName) > -1)
					{	
						g_arrCodeNameForms[g_arrCodeNameForms.length] = arrForms[k];
					}	
				}	
			}	
		}	
	}	
	
	
	return g_arrCodeNameForms;
}		
	
function LocateMultiCodeNameForm(objDocument, strStructName, strValue)
{	
	var divRoot = objDocument.getElementById("divCodeNameResultHeader_" + strStructName);
	var frmCodeName = LocateChild(divRoot, "FORM", "CodeName");
	var strControlName = GetCodeNameControlName(frmCodeName.name);
	var arrForms = new Array();
	var objCurrent = null;
	var strCheck = null;
	var objFound = null;
	
	
	arrForms = getMultiCodeNameForms(objDocument, strStructName);
	
	for (var i = 0; i < arrForms.length && objFound == null; i++)
	{	
		objCurrent = arrForms[i];
		
		debug("strControlName", strControlName);
		strCheck = eval("objCurrent." + strControlName + ".value");
		// strCheck = eval("objCurrent." + strStructName + "_id.value");
		debug("objCurrent", objCurrent);
		debug("strValue", strValue);
		debug("strCheck", strCheck);
		
		if (strValue == strCheck)
		{	
			objFound = objCurrent;
		}	
	}	
	
	
	return objFound;
}	
	
function generateForms(docTarget)
{	
	var strXML = "";
	
	
	strXML += '<forms>\n';
	
	for (var i=0; i < docTarget.forms.length; i++)
	{	
		strXML += generateForm(docTarget.forms[i]);
	}	
	
	strXML += '</forms>';
	
	
	return strXML;
}	

function generateForm(frmData)
{	
	var elmCurrent = null;
	var strXML = "";
	
	
	strXML += '<form name="' + frmData.name + '"'
		+ ' method="' + frmData.method + '"'
		+ ' action="' + frmData.action + '">\n';
	
	strXML += '\t<elements>\n';
	
	for (var i=0; i < frmData.elements.length; i++)
	{	
		elmCurrent = frmData.elements[i];
		
		strXML += '\t\t<element name="' + elmCurrent.name + '"' 
			+ ' value="' + elmCurrent.value + '"/>\n';
	}	
	
	strXML += '\t</elements>\n';
	
	strXML += '</form>\n';
	
	
	return strXML;
}	
	
function openProcessWindow()
{	
	var winProc = window.open('/licoms/process.html', 'winProc', 'width=200,height=200');
	
	
	if(typeof(focus)=="function")
		winProc.focus();
	
	
	return winProc;
}	
	
function TimeCodeFormat(txtSource)
{	
	// "10:00:00:00" 6, 8
	//  01234567890
	//	12345678901
	
	var strValue = txtSource.value;
	
	
	strValue = strValue.replace(/ /g,"");
	
	if (strValue.length == 6)
	{	
		strValue = strValue.substring(0, 2) + ":" + 
			strValue.substring(2, 4) + ":" + 
			strValue.substring(4, 6) + ":00";
	}	
	
	if (strValue.length == 8)
	{	
		strValue = strValue.substring(0, 2) + ":" + 
			strValue.substring(2, 4) + ":" + 
			strValue.substring(4, 6) + ":" + 
			strValue.substring(6, 8);
	}	
	
	txtSource.value = strValue;
	
	
	return true;
}	
	
function dragMousePos(e) 
{	
	//get the position of the mouse
	if( !e ) 
	{	
		e = window.event;
	}	
	
	if( !e || ( typeof( e.pageX ) != 'number' && typeof( e.clientX ) != 'number' ) ) 
	{	
		return [0,0]; 
	}	
	
	if( typeof( e.pageX ) == 'number' ) 
	{	
		var xcoord = e.pageX; var ycoord = e.pageY;
	}	
	else
	{	
		var xcoord = e.clientX; var ycoord = e.clientY;
		
		if( !( ( window.navigator.userAgent.indexOf( 'Opera' ) + 1 ) 
			|| ( window.ScriptEngine && ScriptEngine().indexOf( 'InScript' ) + 1 ) || window.navigator.vendor == 'KDE' ) ) 
		{	
			if( document.documentElement && ( document.documentElement.scrollTop || document.documentElement.scrollLeft ) ) 
			{
				xcoord += document.documentElement.scrollLeft; 
				ycoord += document.documentElement.scrollTop;
			}
			else if( document.body && ( document.body.scrollTop || document.body.scrollLeft ) ) 
			{	
				xcoord += document.body.scrollLeft; 
				ycoord += document.body.scrollTop; 
			}	
		}	
	}	
	
	
	return [xcoord,ycoord];
}	
	
function HrhCboItem(strName, strID, strHead)
{	
	this.m_strName = strName;
	this.m_strID = strID;
	this.m_strHead = strHead;
}	
	
function HrhCboLoad(selTarget, strHead, arrHrhCboItem)
{	
	if (strHead == undefined)
	{	
		strHead = this.value;
		eval("selTarget = this.form." + this.m_strItem);
		eval("arrHrhCboItem = arr" + this.m_strItem);
	}	
	
	//selTarget, strHead
	
	RemoveOptions(selTarget);
	
	for (var i = 0; i < arrHrhCboItem.length; i++)
	{	
		if (arrHrhCboItem[i].m_strHead == strHead)
		{	
			AddOption(
				selTarget, 
				arrHrhCboItem[i].m_strName, 
				arrHrhCboItem[i].m_strID
				);
		}	
	}	
}	
	
function AddOption(selTarget, strText, strValue)
{	
	var optNew = document.createElement('option');
	
	
	optNew.text = strText;
	optNew.value = strValue;
	
	try
	{	
		selTarget.add(optNew, null); // standards compliant
	}	
	catch(ex)
	{	
		selTarget.add(optNew); // IE only
	}	
}	
	
function RemoveOptions(selTarget)
{	
	for (i = selTarget.options.length-1; i > -1; i--)
	{	
		selTarget.remove(selTarget.options[i]);
	}	
}	
	
/*	DomEvents Version 1.0
	Copyright 2005 Mark Wubben
	
	See <http://novemberborn.net/javascript/domevents> for more information.
	This software is licensed under the CC-GNU LGPL:
	<http://creativecommons.org/licenses/LGPL/2.1/>
*/	
	
var __DomEvents__ = new function()
{
   var registry = {};
   function registryKey(id, type, fn)
   {
      return id + "#" + type + "#" + fn;
   }
   function isInRegistry(key)
   {
      return registry[key] != null;
   }
   function invoke(key, evt)
   {
      if(!isInRegistry(key))
         return null;

      _evt = __DomEvents__.alterEventObject(evt);
      if(typeof _evt == "object")
         evt = _evt;
      
      var handler = registry[key];
      var scope = handler.scope;
       
      // Evade Function#apply()
      scope.__DomEvents_listener__ = handler.listener;
      scope.__DomEvents_listener__(evt);
      scope.__DomEvents_listener__ = null;
   }

   var targetIdCount = 0;
   
   function targetId(target)
   {
      if(target == document)
         return "__DomEvents_ID_document";
      if(target == window)
         return "__DomEvents_ID_window";
      
      var id = target.getAttribute("id") || target.uniqueID;
      
      if(id == null){
         id = "__DomEvents_ID_" + targetIdCount++;
         target.setAttribute("id", id);
      }
      
      return id;
   }
      
   window.addEvent = function(target, type, listener, scope)
   {
      var key = registryKey(targetId(target), type, listener);
      scope = scope || target;
      
      if(isInRegistry(key))
         return false;
      
      // Hey, it's a new listener!
      handler = {
         listener:   listener,
         scope:      scope,
         invoker:    function(evt)
                     {
                        invoke(key, evt);
                     }
      }
      
      registry[key] = handler;
      
      if(target.addEventListener){
         target.addEventListener(type, handler.invoker, false);
      } else if(target.attachEvent){
         target.attachEvent("on" + type, handler.invoker);
      } else {
         return false;
      }
      
      // Reset variables:
      target = listener = scope = null;
      
      return true;
   }
   
   window.removeEvent = function(target, type, listener, scope)
   {
      var key = registryKey(targetId(target), type, listener);
      
      if(!isInRegistry(key))
         return false;
         
      var invoker = registry[key].invoker;
      
      registry[key] = null;

      if(target.removeEventListener){
         target.removeEventListener(type, invoker, false);
      } else if(target.detachEvent) {
         target.detachEvent("on" + type, invoker);
      } else {
         return false;
      }
      
      return true;
   }

   this.alterEventObject = function(){};
}	
	
// IN LINE EDIT CONTROL : BEGIN

function getXmlHttpRequestObject()
{	
	if (window.XMLHttpRequest) 
	{
		return new XMLHttpRequest();
	} 
	else if(window.ActiveXObject) 
	{	
		return new ActiveXObject("Microsoft.XMLHTTP");
	} 
	else 
	{
		alert("Your Browser Sucks!\nIt's about time to upgrade don't you think?");
	}
}	
	
var g_objXmlHttp = getXmlHttpRequestObject();
	
function ILEGetPosition(objDiv)
{	
	var nlsChilds = objDiv.childNodes;
	var intPos = 0;
	var intFound = -1;
	
	
	for(var i=0; i<nlsChilds.length; i++)
	{	
		if(nlsChilds[i].tagName == "DIV")
		{	
			intPos++;
			
			if (nlsChilds[i].className == 'suggest_link_over')
			{	
				nlsChilds[i].className = 'suggest_link';
				intFound = intPos;
			}	
		}	
	}	
	
	
	return intFound;
}	
	
function ILESetPosition(objDiv, intFound)
{	
	var nlsChilds = objDiv.childNodes;
	var intPos = 0;
	
	
	for(var i=0; i<nlsChilds.length; i++)
	{	
		if(nlsChilds[i].tagName == "DIV")
		{	
			intPos++;
			
			if (intPos == intFound)
			{	
				nlsChilds[i].className = 'suggest_link_over';
			}	
		}	
	}	
}	
	
function ILESavePosition(objDiv, intFound, objTxt)
{	
	var nlsChilds = objDiv.childNodes;
	var intPos = 0;
	
	
	for(var i=0; i<nlsChilds.length; i++)
	{	
		if(nlsChilds[i].tagName == "DIV")
		{	
			intPos++;
			
			if (intPos == intFound)
			{	
				objTxt.value = nlsChilds[i].innerHTML;
				
				var arrMC = ILEGenData(nlsChilds[i].id);
				
				SetMultiCopyValues(objTxt.form, arrMC);
				
				objDiv.innerHTML = '';
				objDiv.style.display = "none";
			}	
		}	
	}	
}	
	
function ILESearch(event, objDiv, objTxt, strURL, fncHandler) 
{	
	if (g_objXmlHttp.readyState == 4 || g_objXmlHttp.readyState == 0) 
	{	
        if(event.keyCode == 40) // Down
        {	
	        var intPos = ILEGetPosition(objDiv);
	        
	        if (intPos == -1)
	        {	
		        intPos = 0;
	        }	
	        
	        ILESetPosition(objDiv, intPos+1);
		}	
        else if(event.keyCode == 38) // Up
        {	
	        var intPos = ILEGetPosition(objDiv);
	        
	        ILESetPosition(objDiv, intPos-1);
		}	
        else if(event.keyCode == 13) // Enter
        {	
        	//alert("Save");
        	
	        var intPos = ILEGetPosition(objDiv);
        	
        	ILESavePosition(objDiv, intPos, objTxt);
        	
        	//alert("Saved: " + intPos);
        	
        	return false;
        }	
        else if(event.keyCode == 9) // TAB
        {	
			objDiv.innerHTML = "";
			objDiv.style.display = "none";
		}	
		else
		{	
			if (event.charCode > 31)
			{	
				var strSrch = escape(objTxt.value) + String.fromCharCode(event.charCode);
			}	
			else if (event.keyCode == 8)
			{	
				var strSrch = escape(objTxt.value);
				
				strSrch = strSrch.substring(0, strSrch.length-1);
			}	
			else
			{	
				var strSrch = escape(objTxt.value);
			}	
			
			g_objXmlHttp.open("POST", strURL + strSrch, true);
			g_objXmlHttp.onreadystatechange = fncHandler; 
			g_objXmlHttp.send(null);
		}	
	}	
}	
	
//Mouse over function
function ILEOver(objDiv) 
{	
	objDiv.className = 'suggest_link_over';
}	
	
//Mouse out function
function ILEOut(objDiv) 
{	
	objDiv.className = 'suggest_link';
}	
	
function ILEHandleSearch(objDiv, strFunction)
{	
	if (g_objXmlHttp.readyState == 4) 
	{	
		objDiv.innerHTML = '';
		objDiv.style.display = "none";
		
		var arrData = g_objXmlHttp.responseText.split("\n");
		
//		var intLen = strData.length;
//		if (intLen > 10)
//		{	
//			intLen = 10;
//		}	
		
		for(i=0; i < arrData.length - 1; i++) 
		{	
			var arrValues = arrData[i].split("##");
			
			//Build our element string.  This is cleaner using the DOM, but
			//IE doesn't support dynamically added attributes.
			var strLine = '<div id="' + arrValues[1] 
				+ '" onmouseover="javascript:ILEOver(this);" ';
			
			strLine += 'onmouseout="javascript:ILEOut(this);" ';
			strLine += 'onclick="javascript:' + strFunction + '(this);" ';
			strLine += 'class="suggest_link">' + arrValues[0] + '</div>';
			
			objDiv.innerHTML += strLine;
		}	
		
		if (arrData.length > 1)
		{	
			objDiv.style.display = "block";
		}	
	}	
}	
	
function ILEGenData(strData)
{	
	var arrData = null;
	var arrMultiCopy = new Array();
	
	
	if (strData != 'none')
	{	
		arrData = strData.split('||');
		
		for(i=0; i < arrData.length - 1; i++) 
		{	
			var strData = arrData[i];
			var intEQ = strData.indexOf("=");
			var intUS = strData.indexOf("_");
			
			var strName = strData.substring(intUS + 1, intEQ); 
			var strType = strData.substring(0, intUS); 
			var strValue = strData.substring(intEQ + 1); 
			
			arrMultiCopy[i] = new Object();
			arrMultiCopy[i]._propname = strName;
			arrMultiCopy[i]._proptype = strType;
			eval("arrMultiCopy[" + i + "]." + strName + " = '" + strValue + "';\n");
		}	
	}	
	
	
	return arrMultiCopy;
}	
	
// IN LINE EDIT CONTROL : END
	
function FormatNumeric(strValue, strDelimiter, intPrecision, strPoint)
{	
	var intLength = -1;
	var strNew = "";
	var strPrecision = "";
	var intPos = 0;
	
	
	if (strValue == null)
	{	
		strValue = "0";
	}	
	
	if (strValue.indexOf(".") > 0)
	{	
		strPrecision = strValue.substring(strValue.indexOf(".")+1);
		strValue = strValue.substring(0, strValue.indexOf("."));
	}	
	else if (strValue.indexOf(",") > 0)
	{	
		strPrecision = strValue.substring(strValue.indexOf(",")+1);
		strValue = strValue.substring(0, strValue.indexOf(","));
	}	
	
	if (intPrecision > 0)
	{	
		strPrecision = strPoint + PadRight(strPrecision, intPrecision, "0");
	}	
	else if (strPrecision.length > 0)
	{	
		strPrecision = strPoint + strPrecision;
	}	
	
	intLength = strValue.length;
	
	for (var i = intLength; i > 0; i--)
	{	
		intPos++;
		
		strNew = strValue.substring(i-1, i) + strNew;
		
		if (intPos % 3 == 0 && intPos < intLength)
		{	
			strNew = strDelimiter + strNew;
		}	
	}	
	
	strNew += strPrecision;
	
	
	return strNew;
}	
	
function PadLeft(strTag, intTagLength, strFillTag)
{	
	return SidePad(strTag, intTagLength, strFillTag, true);
}	
	
function PadRight(strTag, intTagLength, strFillTag)
{	
	return SidePad(strTag, intTagLength, strFillTag, false);
}	
	
function SidePad(strTag, intTagLength, strFillTag, blnLeft)
{	
	var intLength = strTag.length;
	var intNeed = intTagLength - intLength;
	var strFillText = "";
	
	
	for (var i = 0; i < intNeed; i++)
	{	
		strFillText += strFillTag;
	}	
	
	if (blnLeft)
	{	
		strTag = strFillText + strTag;
	}	
	else
	{	
		strTag = strTag + strFillText;
	}	
	
	
	return strTag;
}	
	
function FocusOnOver(objDiv)
{	
	objDiv.className = "focus-onover";
	
	
	return true;
}	
	
function FocusOnOut(objDiv)
{	
	objDiv.className = "focus-onout";
	
	
	return true;
}	
	
