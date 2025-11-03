const processOrder = (order) => {
    console.log(`Processing order for customer ${order}`);

    var currentTime = new Date().getTime();
    while (new Date().getTime() < currentTime + 1000) {
        // Wait for 1 second
    }

    console.log(`Order processed for customer ${order}`);
}


console.log('Take order for customer 1');
processOrder(1);
console.log('Customer 1 is leaving');