let a = 20; // global

function funcScope() {
    let b = 30; // local
    console.log("b value", b);
    console.log(a);
}

// funcScope()
console.log(b);

