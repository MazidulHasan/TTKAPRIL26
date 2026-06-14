const user1 = {
            userName: "Mazidul",
            age: 98,
            gender: "Male"
        }

function userFunction(anyObject) {
    console.log(`Username is ${anyObject.userName} and age is ${anyObject.age}`);
}

userFunction(user1);


//changin the values of the object
user1.userName = "Karim"; // changin the value
user1.age = 51

// user1 = {
//             userName: "Karim",
//             age: 51,
//             gender: "Male"
//         }


userFunction(user1); // For checking what is the current value