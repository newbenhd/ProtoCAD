const axios = require('axios');

const root = {
	launch: () => axios.get('https://api.spacexdata.com/v3/launches/latest').then(res => res.data),
    allLaunch: () => axios.get('https://api.spacexdata.com/v3/launches').then(res => res.data).then(items => {
    const output = [];
    for(let i = items.length - 5; i < items.length; i++) output.push(items[i])
    return output;
    })
}

module.exports = root;