console.log("IT’S ALIVE!");

function $$ (selector, context = document) {
	return Array.from(context.querySelectorAll(selector));
}

// let navLinks = $$("nav a");

// let currentLink = navLinks.find(a => a.host === location.host && a.pathname === location.pathname)

// if (currentLink) { // or if (currentLink !== undefined)
// 	currentLink.classList.add("current");
// }

// let pages = [
// 	{url: "https://patrickxliu.github.io/my-portfolio/", title: "Home"},
// 	{url: "https://patrickxliu.github.io/my-portfolio/projects", title: "Projects"},
// 	{url: "https://patrickxliu.github.io/my-portfolio/contact", title: "Contact"},
//     {url: "https://patrickxliu.github.io/my-portfolio/resume", title: "Resume"},
//     {url: "https://github.mit.edu/pxliu", title: "Github"}
// ];

// let nav = document.createElement("nav");
// document.body.prepend(nav);

// // const ARE_WE_HOME = document.documentElement.classList.contains("home");

// for (let p of pages) {
// 	let url = p.url;
// 	let title = p.title;

// 	let a = document.createElement("a");
//     a.href = url;
//     a.textContent = title;

//     if (a.host === location.host && a.pathname === location.pathname) {
//         a.classList.add("current");
//     }

//     if (a.host !== location.host){
//         a.target = "_blank";
//     }
//     nav.append(a);

// }
// console.log(location.pathname)
// console.log(nav)

// document.body.insertAdjacentHTML("afterbegin", `
// 	<label class="color-scheme">
// 		Theme:
// 		<select>
// 			<option value='light dark'>Automatic</option>
//             <option value='light'>Light</option>
//             <option value='dark'>Dark</option>
// 		</select>
// 	</label>`
// );

// let select = document.querySelector("select");

// select.addEventListener("input", function (event) {
// 	console.log("color scheme changed to", event.target.value);
//     document.documentElement.style.setProperty("color-scheme", event.target.value);
//     localStorage.colorScheme = event.target.value;
// });

// if (localStorage.colorScheme) {
// 	document.documentElement.style.setProperty("color-scheme", localStorage.colorScheme);
// 	select.value = localStorage.colorScheme;
// }


