async function  parseStackOverflow(id,type){
    const axios = require("axios");
    const cheerio = require("cheerio");

    const url = `https://${type}stackoverflow.com/questions/${id}`
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    const questionTitle = $("h1 a.question-hyperlink").text();
    const questionBody = $(".postcell .js-post-body p");
    let questionBodyText = "";
    questionBody.each((idx,el) =>{
        questionBodyText += $(el).text() + '\n';
    })
    return {title: questionTitle, text: questionBodyText};
}
module.exports = parseStackOverflow;