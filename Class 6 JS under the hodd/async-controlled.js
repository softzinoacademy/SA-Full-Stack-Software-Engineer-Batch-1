const takeOrder = (order, callback) => {
  console.log(`Take order for customer ${order}`);
  callback(order);
};

const processOrder = (order, callback) => {
  console.log(`Processing order for customer ${order}`);

  setTimeout(() => {
    console.log(`Cooking completed for customer ${order}`);
    console.log(`Order processed for customer ${order}`);
    callback(order);
  }, 3000);
};



const completeOrder = (order) => {
    console.log(`Order completed for customer ${order}`);
}

//calling function
takeOrder(1, (order) => {
    processOrder(order, (order) => {
        completeOrder(order);
    });
});



// console.log('Customer 1 is leaving');