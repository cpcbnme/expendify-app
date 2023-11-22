export const convertDate = (date: Date) => {
	if (date) {
		let dayStr = "";
		let monthStr = "";
		const day = date.getDate();
		dayStr = day < 10 ? "0" + day : day.toString();
		const month = date.getMonth() + 1;
		monthStr = month < 10 ? "0" + month : month.toString();
		const year = date.getFullYear();
		return `${dayStr}/${monthStr}/${year}`;
	}
	return "";
};

export const getPrevious7DaysDate = () => {
	var date = new Date();
	return new Date(date.getTime() - 7 * 24 * 60 * 60 * 1000);
};

export const getPrevious30DaysDate = () => {
	var date = new Date();
	return new Date(date.getTime() - 30 * 24 * 60 * 60 * 1000);
};

export const getPrevious6MonthsDate = () => {
	var date = new Date();
	return new Date(date.getTime() - 6 * 30 * 24 * 60 * 60 * 1000);
};

export const getPrevious365DaysDate = () => {
	var date = new Date();
	return new Date(date.getTime() - 365 * 24 * 60 * 60 * 1000);
};

export const isStringNullOrEmptyOrWhiteSpace = (value: string) => {
	if (value === null || value === undefined) {
		return true;
	}

	if (value.trim() === "") {
		return true;
	}

	return false;
};

export const getNumberFromString = (val: string) => {
	if (val) {
		if (val.length > 1) {
			const valFirst = val.replace("$", "");
			const formattedAmount = Number(valFirst.replace(/,/g, ""));
			return formattedAmount;
		}
	}
	return 0;
};

export const getFirstTwoNumbers = (val: Number) => {
	let valFirst = "0";
	if (val) {
		if (val.toString().length > 1) {
			if (val.toString().startsWith("-")) {
				valFirst = val.toString().substring(0, 3);
			} else {
				valFirst = val.toString().substring(0, 2);
			}
		}
	}
	return Number.parseInt(valFirst);
};

export const getSpanishInitials = (name: string) => {
	// name like Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec
	// convert to Ene, Feb, Mar, Abr, May, Jun, Jul, Ago, Sep, Oct, Nov, Dic
	let nameSpanish = "";
	switch (name) {
		case "Jan":
			nameSpanish = "Ene";
			break;
		case "Feb":
			nameSpanish = "Feb";
			break;
		case "Mar":
			nameSpanish = "Mar";
			break;
		case "Apr":
			nameSpanish = "Abr";
			break;
		case "May":
			nameSpanish = "May";
			break;
		case "Jun":
			nameSpanish = "Jun";
			break;
		case "Jul":
			nameSpanish = "Jul";
			break;
		case "Aug":
			nameSpanish = "Ago";
			break;
		case "Sep":
			nameSpanish = "Sep";
			break;
		case "Oct":
			nameSpanish = "Oct";
			break;
		case "Nov":
			nameSpanish = "Nov";
			break;
		case "Dec":
			nameSpanish = "Dic";
			break;
		default:
			nameSpanish = name;
			break;
	}

	return nameSpanish;
};

export const timeSince = (dateStr) => {
	const date = new Date(dateStr);
	var seconds = Math.floor((new Date() - date) / 1000);

	var interval = seconds / 31536000;

	if (interval > 1) {
		return `hace ${Math.floor(interval)} años`;
	}
	interval = seconds / 2592000;
	if (interval > 1) {
		return Math.floor(interval) + " meses atrás";
	}
	interval = seconds / 86400;
	if (interval > 1) {
		return `hace ${Math.floor(interval)} días`;
		//return Math.floor(interval) + ' dias atrás';
	}
	interval = seconds / 3600;
	if (interval > 1) {
		return `hace ${Math.floor(interval)} ${
			interval < 2 ? "hora" : "horas"
		}`;
		//return Math.floor(interval) + ' horas';
	}
	interval = seconds / 60;
	if (interval > 1) {
		return `hace ${Math.floor(interval)} ${
			interval < 2 ? "minuto" : "minutos"
		}`;
	}

	// if the time is in the future
	if (seconds < 60) {
		return "Justo ahora";
	}

	if (seconds < -1) {
		return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
	}
};

export const isValidEmail = (email: string) => {
	const re = /\S+@\S+\.\S+/;
	return re.test(email);
};

export const isValidPassword = (
	Password: string
): { isValid: boolean; message: string } => {
	// Define the criteria for a strong password
	const minLength = 8;
	const minLower = 1;
	const minUpper = 1;
	const minNumber = 1;
	const minSpecial = 1;
	let score = 0;

	const levels = [
		{
			score: 0,
			level: "Weak",
			message: "😢 Tu  contraseña es demasiado corta.",
			color: "red",
		},
		{
			score: 1,
			level: "Fair",
			message: "😐 Tu contraseña es simple.",
			color: "orange",
		},
		{
			score: 2,
			level: "Good",
			message: "😊 Haz un mejor esfuerzo con tu contraseña.",
			color: "yellow",
		},
		{
			score: 3,
			level: "Better",
			message: "😍 Ya casi, prueba con otra contraseña.",
			color: "green",
		},
		{
			score: 4,
			level: "Strong",
			message: "😍 Tu contraseña es lo suficientemente adecuada.",
			color: "green",
		},
		// {
		//   score: 5,
		//   level: 'Passed',
		//   message: "😍 Your password is strong! You're doing great!",
		//   color: 'green',
		// },
	];

	// Check if the Password meets each criterion and increment the score accordingly
	if (Password.length >= minLength) {
		score++;
	}
	if (/[a-z]/.test(Password) && Password.length >= minLower) {
		score++;
	}
	if (/[A-Z]/.test(Password) && Password.length >= minUpper) {
		score++;
	}
	if (/[0-9]/.test(Password) && Password.length >= minNumber) {
		score++;
	}
	if (/[!@#$%^&*]/.test(Password) && Password.length >= minSpecial) {
		score++;
	}

	// Find the level that matches the score
	let level = levels.find((level) => level.score === score);

	let isValid: boolean = score > 4;

	return !isValid
		? { isValid, message: level.message }
		: { isValid, message: "passed" };
};

export const isEqual = (a, b) => {
	// Create arrays of property names
	const aProps = Object.getOwnPropertyNames(a);
	const bProps = Object.getOwnPropertyNames(b);

	// If number of properties is different,
	// objects are not equivalent
	if (aProps.length !== bProps.length) {
		return false;
	}

	for (let i = 0; i < aProps.length; i++) {
		const propName = aProps[i];

		// If values of same property are not equal,
		// objects are not equivalent
		if (a[propName] !== b[propName]) {
			return false;
		}
	}

	// If we made it this far, objects
	// are considered equivalent
	return true;
};

export const getAppName = () => {
	return "Invoice";
};

export const truncate = (str: string, maxLength: number) => {
	if (str.length > maxLength) {
		str = str.substring(0, maxLength - 3) + "...";
	}
	return str;
};
