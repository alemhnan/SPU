window.onload = function () {

	var messageEle = document.getElementById('messageSpace');

	var readPrivateFrame = document.getElementById('readPrivateFrame').contentWindow;
	var writePrivateFrame = document.getElementById('writePrivateFrame').contentWindow;
	var token = null;

	function receiveMessage(e) {
		// Check to make sure that this message came from the correct domain.
		if (e.origin !== "https://loginspu.surge.sh" && e.origin !== "https://readwritespu.surge.sh") {
			return;
		}

		if (e.origin === "https://loginspu.surge.sh") {
			token = e.data.token;
			var decoded = jwt_decode(token);

			readPrivateFrame.postMessage({ token: token, userId: decoded.userId }, 'https://readspu.surge.sh');
			writePrivateFrame.postMessage({ token: token, userId: decoded.userId }, 'https://readwritespu.surge.sh');
		}

		if (e.origin === "https://readwritespu.surge.sh") {
			var status = e.data.status;
			if (status === 'POST_DONE') {
				var decoded = jwt_decode(token);
				readPrivateFrame.postMessage({ token: token, userId: decoded.userId }, 'https://readspu.surge.sh');
			}
		}
	}

	window.addEventListener('message', receiveMessage);

}
