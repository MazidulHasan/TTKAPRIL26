const user = {
    name: 'Alice',
    // Normal function
    logNormal() {
        setTimeout(function() {
            console.log('Normal:', this.name); 
        }, 100);
    },
    // Arrow function
    logArrow() {
        setTimeout(() => {
            console.log('Arrow:', this.name); 
        }, 100);
    }
};

user.logNormal(); // Logs: "Normal: undefined" (because setTimeout runs in the global scope)
user.logArrow();  // Logs: "Arrow: Alice" (because it inherits `this` from the logArrow method)