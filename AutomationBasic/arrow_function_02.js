const user1 = {
            userName: "Mazidul",
            age: 98,
            gender: "Male"
        }

function userNameAndAge(anyObject) {
    console.log(`Username is ${anyObject.userName} and age is ${anyObject.age}`);
}

const userNameAndGender = (anyObject) => {
    console.log(`Username is ${anyObject.userName} and gender is ${anyObject.gender}`);
}

// userNameAndAge(user1);
// userNameAndGender(user1);

console.log(user1.userName);
