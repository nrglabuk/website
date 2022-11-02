// TODO: Demo form
window.addEventListener("load",function() {

	// Remove noscript warning elements
	for (const x of document.getElementsByClassName('noscript'))
		x.parentElement.removeChild(x);

	// Show the cookie consent thing if not initialised
	if (localStorage.getItem('cookie') == null) {

		loadStylesheet('cookie-consent');

		const header = document.getElementsByTagName('header').item(0);

		const container = document.createElement('div');
		container.id = 'cookie-consent';

		const text = document.createElement('p');
		const link = document.createElement('a');
		link.href = '/about/cookies';
		text.innerHTML = 'Our website uses cookies and similar technologies to function. We also use some third party'
			+ ' plugins - such as social media share buttons - that may leave their own cookies on your device.';
		text.appendChild(link);
		container.appendChild(text);

		const btnContainer = document.createElement('div');
		container.appendChild(btnContainer);

		const reject = document.createElement('div');
		reject.classList.add('button','gray');
		reject.innerText = 'Reject third party';
		btnContainer.appendChild(reject);
		reject.addEventListener('click',function(){
			localStorage.setItem('cookie', JSON.stringify({
				'3rd': '0'
			}));
			container.parentElement.removeChild(container);
		});

		const accept = document.createElement('div');
		accept.classList.add('button');
		accept.innerText = 'Accept & close';
		btnContainer.appendChild(accept);
		accept.addEventListener('click',function(){
			localStorage.setItem('cookie', JSON.stringify({
				'3rd': '1'
			}));
			container.parentElement.removeChild(container);
		});

		header.parentElement.insertBefore(container, header);
	}

	if (hasCookieConsent()) loadScript("fb");

	let captchaLoaded = false;

	const form = document.getElementById("enq-form"),
	tooltip = document.getElementById("enq-form-tooltip"),
	debrief = document.getElementById("enq-form-debrief"),
	btn = {
		start: document.getElementById("enq-form-start"),
		cont: document.getElementById("enq-form-buttons"),
		prev: document.getElementById("enq-form-prev-btn"),
		next: document.getElementById("enq-form-next-btn")
	},
	input = {
		msg: document.getElementById("enq-form-msg"),
		name: document.getElementById("enq-form-name"),
		email: document.getElementById("enq-form-email"),
	},

	activateTooltip = () => setTimeout(() => tooltip.classList.remove("hide"), 1200),

	validate = (() => {
		let timeout = null;
		function schedule(callback, nextPage) {
			clearTimeout(timeout);
			timeout = setTimeout(() => {
				if (callback()) {
					btn.next.addEventListener("click", nextPage);
					btn.next.classList.remove("disabled");
				} else {
					btn.next.removeEventListener("click", nextPage);
					btn.next.classList.add("disabled");
					activateTooltip();
				}
			}, 100);
		}
		return {
			clear: () => clearTimeout(timeout),
			p1: () => schedule(() => (len => {
				if (len === 0) tooltip.innerText = "Please enter a message.";
				else if (len < 60) tooltip.innerText = "Your message is too short. There is a minimum length requirement to help us prevent spam.";
				else if (len > 10000) tooltip.innerText = "Message is waaay too long.";
				else return true;
				return false;
			})(input.msg.value.trim().replace(/\s+/g, ' ').length), p2),

			p2: () => schedule(() => (name => {
				if (name.length === 0) tooltip.innerText = "Please complete all fields.";
				else if (name.length < 3) tooltip.innerText = "Is that a real name?";
				else if (name.length > 60) tooltip.innerText = "Sorry, but your name is really, really long.";
				else return true;
				return false;
			})(input.name.value.trim().replace(/\s+/g, ' ')) && (email => {
				if (email.length === 0) tooltip.innerText = "Please complete all fields.";
				else if (email.length > 255 || !email.match(/^[^\s\n@]+@[^.\s\n@]+\.[^\s\n@]+$/)) tooltip.innerText = "Please input a valid email address.";
				else return true;
				return false;
			})(input.email.value.trim().replace(/\s+/g, ' ')), p3)
		}
	})(),

	reset = pos => {
		validate.clear();
		[p0, p1, p2, p3].forEach(fn => {
			btn.prev.removeEventListener('click', fn);
			btn.next.removeEventListener('click', fn);
		});
		input.msg.removeEventListener('input', validate.p1);
		input.name.removeEventListener('input', validate.p2);
		input.email.removeEventListener('input', validate.p2);
		tooltip.classList.add('hide');
		btn.next.classList.remove('hidden');
		form.style.left = `-${pos * 100}%`;
	};

	function p0() {
		reset(0);
		btn.cont.classList.remove('reveal');
		btn.next.classList.remove('hover-button','disabled');
		btn.next.classList.add('disabled');
	}

	function p1() {
		reset(1);
		btn.cont.classList.add('reveal');
		btn.prev.classList.remove('disabled');
		btn.next.classList.remove('submit');
		btn.next.classList.add('disabled');
		btn.prev.addEventListener('click', p0);
		input.msg.addEventListener('input', validate.p1);
		validate.p1();
	}

	function p2() {
		reset(2);
		btn.cont.classList.add('reveal');
		btn.prev.classList.remove('disabled');
		btn.next.classList.add('disabled');
		btn.prev.addEventListener('click', p1);
		input.name.addEventListener('input', validate.p2);
		input.email.addEventListener('input', validate.p2);
		validate.p2();
	}

	function p3() {
		reset(3);
		btn.cont.classList.add("reveal");
		btn.prev.classList.remove("disabled");
		btn.next.classList.add("hidden");
		btn.prev.addEventListener("click", p2);
		if (!captchaLoaded) grecaptcha.render("enq-form-captcha", {
			sitekey: "6Ld58yEcAAAAABfnvFKXDgogC6lxFy23-mcLujqY",
			tabindex: -1,
			callback: p4
		});
		captchaLoaded = true;
	}

	function p4() {
		reset(3);
		btn.cont.classList.remove("reveal");
		btn.next.classList.add("hidden");
		fetch("/contact", {
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			method: 'POST',
			body: new URLSearchParams({
				"msg": input.msg.value.trim().replace(/\s+/g, ' '),
				"name": input.name.value.trim().replace(/\s+/g, ' '),
				"email": input.email.value.trim().replace(/\s+/g, ' ')
				// TODO: validate captcha
			}),
			mode: 'same-origin',
			credentials: 'omit',
			cache: 'no-store'
		})
		.then(response => {
			setTimeout(() => grecaptcha.reset(), 500);
			if (response.ok) success();
			else return response.text();
		})
		.then(err => {
			if (err) failure(err);
		})
		.catch(() => failure())
	}

	function success() {
		reset(4);
		btn.cont.classList.remove('reveal');
		debrief.innerText = 'Your message has been received, thanks! We check our mail regularly so keep an eye on your inbox.';
		debrief.classList.remove('error');
	}

	function failure(err) {
		reset(4);
		btn.cont.classList.add("reveal");
		debrief.innerText = err ?? "Something went wrong on our end. Please try again or come back later.";
		debrief.classList.add("error");
		btn.prev.classList.remove("disabled");
		btn.next.classList.add("hidden");
		btn.prev.addEventListener("click", p1);
	}

	btn.start.classList.remove("disabled");
	btn.start.addEventListener("click", p1);
	[input.name, input.email].forEach(e => (l => {
		e.addEventListener("focus", () => l.classList.add("active"));
		e.addEventListener("blur", () => l.classList.remove("active"));
	})(e.parentElement));
});

function hasCookieConsent() {
	const cookie = JSON.parse(localStorage.getItem('cookie'));
	return cookie && cookie['3rd'] === '1';
}

function loadScriptExt(src) {
	const s = document.createElement('script');
	s.src = src;
	document.head.appendChild(s);
}

function loadScript(name) {
	loadScriptExt('/js/' + name + '.js')
}

function loadStylesheet(name) {
	const s = document.createElement('link');
	s.rel = 'stylesheet';
	s.href = '/css/' + name + '.css';
	document.head.appendChild(s);
}
