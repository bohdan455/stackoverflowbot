async function googleresults(value) {
    let google = require('googlethis');
    let searchResults = []
    const options = {
        page: 0,
    }
    const response = await google.search(`site:https://stackoverflow.com/questions/ ${value}`, options);
    response.results.map(item => {
        let resultId = item.url.split('/')[4];
        let type = item.url.split('/')[2].split('.')[0] === 'ru' ? 'ru.' : '';

        if(resultId !== "tagged "){
            searchResults.push({title: item.title, url:resultId , type: type});
        }
    });
    return searchResults;
}
module.exports = googleresults