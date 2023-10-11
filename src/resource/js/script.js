// For changing portrait photo
// https://stackoverflow.com/questions/11406605/how-to-make-a-link-act-as-a-file-input
$(function () {
	$("#edit_portrait_link").on("click", function (e) {
		e.preventDefault();
		$("#edit_portrait:hidden").trigger("click");
	});
});

// For phone number input mask
// https://www.geeksforgeeks.org/jquery-inputmask/
$(function () {
	$("input").inputmask();
});

// For confirm email button, disable for 60s
// https://jsfiddle.net/qfzL86oc/
$.fn.timedDisable = function (time) {
	if (time == null) {
		time = 5;
	}
	var seconds = Math.ceil(time); // Calculate the number of seconds
	return $(this).each(function () {
		$(this).attr("disabled", "disabled");
		var disabledElem = $(this);
		var originalText = this.innerHTML; // Remember the original text content

		// append the number of seconds to the text
		disabledElem.text(originalText + " (" + seconds + ")");

		// do a set interval, using an interval of 1000 milliseconds
		//     and clear it after the number of seconds counts down to 0
		var interval = setInterval(function () {
			seconds = seconds - 1;
			// decrement the seconds and update the text
			disabledElem.text(originalText + " (" + seconds + ")");
			if (seconds === 0) {
				// once seconds is 0...
				disabledElem.removeAttr("disabled").text(originalText); //reset to original text
				clearInterval(interval); // clear interval
			}
		}, 1000);
	});
};

$(function () {
	$("#btn_confirm_email").on("click", function (e) {
		e.preventDefault();
		$("#btn_confirm_email").timedDisable(5);
	});
});

//Display Toast msg for confirm email button, forgot password link
// https://getbootstrap.com/docs/5.3/components/toasts/
// https://www.tutorialrepublic.com/twitter-bootstrap-tutorial/bootstrap-toasts.php
$(document).ready(function () {
	$("#btn_forgot_pswd").click(function () {
		$("#btn_forgot_pswd_toast").toast("show");
	});

	$("#btn_confirm_email").click(function () {
		$("#btn_confirm_email_toast").toast("show");
	});
});

// -------------------------- NOR WORKING --------------------------
// // For Country/State dropdown
// // https://codepen.io/CreativeCoder111/pen/PoBRKqQ
// var countryState = {
// 	CA: [
// 		"AB",
// 		"BC",
// 		"MB",
// 		"NB",
// 		"NL",
// 		"NS",
// 		"NT",
// 		"NU",
// 		"ON",
// 		"PE",
// 		"QC",
// 		"SK",
// 		"YT",
// 	],
// 	US: [
// 		"AL",
// 		"AK",
// 		"AZ",
// 		"AR",
// 		"CA",
// 		"CO",
// 		"CT",
// 		"DE",
// 		"FL",
// 		"GA",
// 		"HI",
// 		"ID",
// 		"IL",
// 		"IN",
// 		"IA",
// 		"KS",
// 		"KY",
// 		"LA",
// 		"ME",
// 		"MD",
// 		"MA",
// 		"MI",
// 		"MN",
// 		"MS",
// 		"MO",
// 		"MT",
// 		"NE",
// 		"NV",
// 		"NH",
// 		"NJ",
// 		"NM",
// 		"NY",
// 		"NC",
// 		"ND",
// 		"OH",
// 		"OK",
// 		"OR",
// 		"PA",
// 		"RI",
// 		"SC",
// 		"SD",
// 		"TN",
// 		"TX",
// 		"UT",
// 		"VT",
// 		"VA",
// 		"WA",
// 		"WV",
// 		"WI",
// 		"WY",
// 	],
// };

// window.onload = function () {
// 	const selectedCountry = doccument.getElementById("floating_country"),
// 		selectedState = document.getElementById("floating_state"),
// 		selects = document.querySelectorAll("select");

// 	selectedState.disabled = true;

// 	selects.forEach((select) => {
// 		if (select.disabled == true) {
// 			select.style.cursor = "auto";
// 		} else {
// 			select.style.cursor = "pointer";
// 		}
// 	});

// 	selectedCountry.onchange = (e) => {
// 		selectedState.disabled = false;

// 		selects.forEach((select) => {
// 			if (select.disabled == true) {
// 				select.style.cursor = "auto";
// 			} else {
// 				select.style.cursor = "pointer";
// 			}
// 		});

// 		selectedState.length = 1;

// 		let cities = countryState[selectedCountry.value][e.target.value];

// 		for (let i = 0; i < cities.length; i++) {
// 			selectedState.options[selectedState.options.length] = new Option(
// 				cities[i],
// 				cities[i]
// 			);
// 		}
// 	};
// };
