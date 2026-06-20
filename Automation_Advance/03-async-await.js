// Automation work may take time, for example loading a page or receiving API data.
function getTestUserLater() {
  return new Promise((resolve) => {
    setTimeout(() => resolve('qa.user@example.com'), 5000);
  });
}

async function prepareLoginTest() {
  // "await" pauses this function until the Promise is complete.
  const testUser = await getTestUserLater();
  console.log(`Test data is ready for: ${testUser}`);
  console.log('The login check can start now.');
}

// Calling an async function returns a Promise.
console.log('First call');
prepareLoginTest();
// console.log('Last Call');