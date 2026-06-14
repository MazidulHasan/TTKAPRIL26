const user1 = {
                userName: "Mazidul",
                age: 98,
                gender: "Male"
            }
const user2 = {
                userName: "Rahim",
                age: 21,
                gender: "Male"
            }


function userFunction(anyObject) {
    console.log(`Username is ${anyObject.userName} and age is ${anyObject.age}`);
    // console.log(`Username is ${anyObject.hairColor}`);

    // console.log("Username is ${anyObject.userName} and age is ${anyObject.age}");
    
    // console.log("Username is", anyObject.userName, "and age is", anyObject.age);


}

// userFunction(user1);
// userFunction(user2);

userFunction({
    userName: "Mazidul",
    age: 98,
    gender: "Male"
});