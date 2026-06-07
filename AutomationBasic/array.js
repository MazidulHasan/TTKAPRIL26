let browser = ["Chrome", "Firefox", "Edge", "Safari"]

for(const brw of browser){
    console.log(brw);
}


// console.log("Lenght::", browser.length);

// for (let index = 1; index < browser.length; index++) {
//     console.log(browser[index]);
// }


console.log("---------------------------------------------------");

browser.push("Webkit")

for(const brw of browser){
    console.log(brw);
}

console.log("---------------------------------------------------");

browser.pop()

for(const brw of browser){
    console.log(brw);
}