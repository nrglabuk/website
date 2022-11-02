// Change the ellipsis every second
setInterval(((stage) => () => document.getElementById('txt').innerText = (() => {
	switch (stage++) {
		default:
			stage = 0;
			return "updating";
		case 0:
			return "updating.";
		case 1:
			return "updating..";
		case 2:
			return "updating...";
	}
})())(0), 1000);

// Prevent video right click & controls
for (const event of ['oncontextmenu', 'onplay', 'onpause'])
	document.getElementById('vid')[event] = event => event.preventDefault();