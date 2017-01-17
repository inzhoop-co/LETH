/*
	API available
	apiApp
	apiChat
	apiFriends

*/

function init_T03()
{	
	//define center button
	var btnCenter = angular.element(document.querySelector('#centerButton'));
	btnCenter.html(' Results!');
	btnCenter.attr('class','button button-smal button-icon icon ion-ios-list-outliney');
	btnCenter.attr('onclick','results()');

	//define left button
	
	var btnLeft = angular.element(document.querySelector('#leftButton'));
	btnLeft.html(' Agree');
	btnLeft.attr('class','button button-smal button-icon icon ion-play');
	btnLeft.attr('onclick','agree()');
	
	var btnRight = angular.element(document.querySelector('#rightButton'));
	btnRight.html(' Disagree');
	btnRight.attr('class','button button-smal button-icon icon ion-play');
	btnRight.attr('onclick','disagree()');
	
}

function update_T03()
{
   alert('updateData!');
}

function disagree()
{
    alert('disagree!');
}

function agree()
{
    alert('agree!');
}

// Play main function of a simlpe contract
function results()
{
    var m = "Addr <br/>" +  dappContract.address + "<br/>"
    angular.element(document.querySelector('#status')).html(m);
    
    var e = new CustomEvent('dappMessage', { "detail": m});
    document.body.dispatchEvent(e);
}
