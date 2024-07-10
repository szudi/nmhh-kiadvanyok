function RegUser(objForm) {
	return js_EmailValidator(objForm.email, false, "#email#");
}
function MakeISODate(dteDate) {
	var month = dteDate.getMonth() + 1;
	if ( month < 10 )
		month = '0' + month;
	var day = dteDate.getDate()
	if ( day < 10 )
		day = '0' + day;
	
	return '' + dteDate.getFullYear() + '-' + month  + '-' + day;
}	

function AddStyleToEtikettTable(objNode) 
{	
	
	if ( objNode == null ) 
	{
		alert("Nem létezõ objektumra való hivatkozás!");
	} 	
	else if ( objNode.tagName == 'TABLE' ) 
	{
		
		for ( var i = 1; i < objNode.rows.length; i+=2 ) 
		{
			var tr = objNode.rows[i];
			for ( var j = 0; j < tr.cells.length; ++j ) {				
				tr.cells[j].className = tr.cells[j].className + "_d";
			}
		}
	}
	
}	

function showMap(strUrl)
{	
 	var PictureMapWindowVar = window.open(strUrl,"PictureMapWindow","toolbar=no,menubar=no,location=no,scrollbars=yes,resizable=no,alwaysRaised=yes,directories=no,height=600,width=600");
	PictureMapWindowVar.focus();

}	
	
function RedefineStyles(objNode, strStyle) 
{	
	
	if ( objNode == null ) 
	{
		alert("Nem létezõ objektumra való hivatkozás!");
	} 	
	else 
	{
		if ( objNode.className != null && objNode.className != "undefined" && objNode.className.match(/^redef/) ) 
		{	
	  		objNode.className =strStyle + "_" + objNode.className;
		}  	
		
		for ( var i = 0; i < objNode.childNodes.length; ++i ) 
		{
			RedefineStyles(objNode.childNodes[i],strStyle);
		}
	}
	
}	
	
function FindFirstSibling(objNode, strTagName) 
{	
	var sibling = objNode.previousSibling;	
	
	while ( sibling != null && sibling.tagName != strTagName ) 
	{	
		sibling = sibling.previousSibling;
	}	
	
	
	return(sibling);
}	
	
function PrintDOM(objNode)
{	
	alert(objNode.tagName);
	
	for ( var i = 0; i < objNode.childNodes.length; ++i ) 
	{	
		PrintDOM(objNode.childNodes[i]);
	}	
}	
	
function ClearText(objField)
{	
	if (objField.defaultValue == objField.value)
	{	
		objField.value = "";
	}	
}	
	
function AddCookie(strCookieName, strCookieValue, intExpires, strPath, strDomain, strSecure)
{	
	var strCookie = strCookieName + '=' + URLEncode(strCookieValue);
	
	
	if (intExpires != 0)
	{	
		intCurrent = (new Date()).getTime();
		strExpires = (new Date(intCurrent + (intExpires * 1000))).toGMTString();
		
		strCookie += ';expires=' + strExpires;
	}	
	
	if (strPath != 'null')
	{	
		strCookie += ';path=' + strPath;
	}	
	
	if (strDomain != 'null')
	{	
		strCookie += ';domain=' + strDomain;
	}	
	
	if (strSecure == 'true')
	{	
		strCookie += '; secure';
	}	
	
	document.cookie = strCookie;
}	
	