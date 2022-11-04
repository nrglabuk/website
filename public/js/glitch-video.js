// Prevent video right click & controls
for (const event of ['oncontextmenu', 'onplay', 'onpause'])
	document.getElementById('video-background')[event] = event => event.preventDefault();

document.getElementById('video-overlay').oncontextmenu = event => event.preventDefault();
