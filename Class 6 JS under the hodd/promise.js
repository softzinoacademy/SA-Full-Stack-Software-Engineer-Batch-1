const deployment = true;

const deploy = new Promise((resolve, reject) => {
    if (deployment) {
      const project = {
         name: 'Project 1',
         status: 'Deployed',
         server: 'Server 1'
      }
      resolve(project);
    } else {
        reject(new Error('Deployment failed'));
    }
});


const deployDetails = (oli) => {
    return new Promise((resolve) => {
        const details =  `Project: ${oli.name}, Status: ${oli.status}, Server: ${oli.server}`;
        resolve(details);
    });
}


deploy
    .then(deployDetails)
    .then((res) => {
        console.log(res);
    })
    .catch((err) => {
        console.log(err.message);
    });


console.log('Finished');