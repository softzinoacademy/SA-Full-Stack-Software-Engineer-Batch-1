const processOrder = (order) => {
    console.log(`Processing order for customer ${order}`);

    setTimeout(() => {
       console.log(`Cooking completed for customer ${order}`);
    }, 6000);

     setTimeout(() => {
       console.log(`waiting time ${order}`);
    }, 3000);

    console.log(`Order processed for customer ${order}`);
}


console.log('Take order for customer 1');
processOrder(1);
console.log('Customer 1 is leaving');