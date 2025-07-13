const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: "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",
});
const openai = new OpenAIApi(configuration);

async function text_davinci(text) {
    try {
        const completion = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: text,
            temperature: 0,
            max_tokens: 3072
        });
        console.log(completion.data.choices[0].text);
        return completion.data.choices[0].text;
    } catch (err) {
        console.log(err);
        return false;
    };

};
async function content_filter_alph(text) {
    try {
        const completion = await openai.createCompletion({
            model: "content-filter-alpha",
            prompt: "<|endoftext|>" + text + "\n--\nLabel:",
            temperature: 0,
            max_tokens: 1,
            top_p: 0,
            logprobs: 10
        });
        console.log(completion.data.choices[0].text);
        return completion.data.choices[0].text;
    } catch (err) {
        console.log(err);
        return false;
    };

};
async function CreatImage(text) {
    try {
        const response = await openai.createImage({
            prompt: text,
            n: 1,
            size: "512x512",
        });
        console.log(response.data.data[0].url);
        return response.data.data[0].url;
    } catch (err) {
        console.log(err);
        return false;
    };

};
module.exports = {
    text_davinci: text_davinci,
    CreatImage: CreatImage,
    content_filter_alph: content_filter_alph
};