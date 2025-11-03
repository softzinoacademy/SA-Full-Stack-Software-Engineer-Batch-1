const promise1 = Promise.resolve("Promise 1 resolved");

const promise2 = new Promise((resolve, reject) => {
  setTimeout(resolve, 2000, "Promise 2 resolved");
});
const promise3 = new Promise((resolve, reject) => {
  setTimeout(resolve, 2000, "Promise 3 resolved");
});

// promise1.then((value) => {
//     console.log(value);
// });
// promise2.then((value) => {
//     console.log(value);
// });
// promise3.then((value) => {
//     console.log(value);
// });

Promise.race([promise1, promise2, promise3])
  .then((res) => {
    console.log(res);
  })
  .catch((error) => {
    console.log(error);
  });
