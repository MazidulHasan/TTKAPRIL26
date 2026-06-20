class QaMember {

  // CONSTRUCTOR
  // The constructor runs automatically whenever we create an object with "new".
  constructor(name, level) {
    // THIS
    // "this" means the object that is currently being created or used.
    this.name = name;
    this.level = level;
  }


  // A function inside a class is called a method.
  introduce() {
    return `${this.name} is a ${this.level} QA.`;
  }



  createBugTitle(featureName) {
    return `${featureName} is not working - reported by ${this.name}`;
  }
}





// "new" creates objects from the QaMember class.
const hasan = new QaMember('Hasan', 'Junior');
const mila = new QaMember('Mila', 'Senior');

// Both objects use the same class, but each has its own data.
// console.log(hasan.introduce());
// console.log(mila.introduce());


// console.log(hasan.createBugTitle('Temp data'));
// console.log(mila.createBugTitle('Temp data 2'));

const rahim = new QaMember('Rahim', 'Senior');
console.log(rahim.introduce());
