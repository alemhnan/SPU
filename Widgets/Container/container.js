window.onload = function() {

	var messageEle = document.getElementById('messageSpace');

	// var loginFrame = document.getElementById('loginFrame').contentWindow;
	var readPrivateFrame = document.getElementById('readPrivateFrame').contentWindow;

	function receiveMessage(e) {
		// Check to make sure that this message came from the correct domain.
		if (e.origin !== "https://loginspu.surge.sh")
			return;

		readPrivateFrame.postMessage({ token: e.data.token }, 'https://readspu.surge.sh');
		
	}

	window.addEventListener('message', receiveMessage);

}
