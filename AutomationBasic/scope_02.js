function parent() {
    const userName = "Mazidul";

    function child(params) {
        const platform = "Zoom";
        console.log(userName);
        console.log(platform);
    }
    child();
}

parent();
// console.log(userName);
