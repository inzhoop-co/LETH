/*
	API available
	apiApp
	apiChat
	apiFriends

*/

function init()
{	
	//define center button
	var btnCenter = angular.element(document.querySelector('#centerButton'));
	btnCenter.html(' Test me!');
	btnCenter.attr('class','button button-smal button-icon icon ion-play');
	btnCenter.attr('onclick','greet()');

	//define left button
	/*
	var btnLeft = angular.element(document.querySelector('#leftButton'));
	btnLeft.html(' left');
	btnLeft.attr('class','button button-smal button-icon icon ion-camera');
	btnLeft.attr('onclick','scan()');
	*/

	//define left button
	/*
	var btnRight = angular.element(document.querySelector('#rightButton'));
	btnRight.html(' right');
	btnRight.attr('class','button button-smal button-icon icon ion-ios-refresh');
	btnRight.attr('onclick','updateData()');
	*/
}

function updateData()
{
    init();
}

function scan()
{
    alert('how to catch scan result?');
}

// Play main function of a simlpe contract
function greet()
{
    var m = "Calling contract at <br/>" +  dappContract.address + "<br/>"
    m += "<b>"  + dappContract.greet() + "</b>";
    angular.element(document.querySelector('#message')).html(m);
    
    var e = new CustomEvent('dappMessage', { "detail": m});
    document.body.dispatchEvent(e);

    //apiChat.sendDappMessage(m);
}
