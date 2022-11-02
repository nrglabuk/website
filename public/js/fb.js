/** Loads the Facebook chat. */
document.head.appendChild(((s) => {
	s.addEventListener("load", () => {
		document.body.appendChild((c => {
			c.id = "fb-customer-chat";
			c.classList.add("fb-customerchat");
			c.setAttribute("page_id", "107670191168037");
			c.setAttribute("attribution", "biz_inbox");
			return c;
		})(document.createElement("div")));
		window.fbAsyncInit = () => FB.init({
			xfbml: true,
			version: "v11.0"
		});
	});
	s.id = "facebook-jssdk";
	s.src = "https://connect.facebook.net/en_GB/sdk/xfbml.customerchat.js";
	return s;
})(document.createElement("script")));
