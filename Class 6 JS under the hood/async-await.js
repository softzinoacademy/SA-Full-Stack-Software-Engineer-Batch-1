
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


const deployDetails = (project) => {
    return new Promise((resolve, reject) => {
        const details =  `Project: ${project.name}, Status: ${project.status}, Server: ${project.server}`;
        resolve(details);
    });
}


// deploy
//     .then(deployDetails)
//     .then((res) => {
//         console.log(res);
//     })
//     .catch((err) => {
//         console.log(err.message);
//     });


async function deployProjectDetails() {
    
    const projectData = await deploy;
    const projectDetails = await deployDetails(projectData);
    console.log(projectDetails);
}



deployProjectDetails();