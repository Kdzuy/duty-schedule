var tf = require("@tensorflow/tfjs");
require('@tensorflow/tfjs-node');

async function straintf(){
    // Define a model for linear regression.
    const model = tf.sequential();
    model.add(tf.layers.dense({units: 1, inputShape: [1]}));

    // Prepare the model for training: Specify the loss and the optimizer.
    model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});
    var data=[];
    // Generate some synthetic data for training.
    const xs = tf.tensor2d([1], [1, 1]);
    const ys = tf.tensor2d([1], [1, 1]);
    const zs = tf.tensor2d([1], [1, 1]);
    //console.log(ys)
    data.push(xs); data.push(ys); data.push(zs);
    // Train the model using the data.
    var check=0;
    var addData = await model.fit(...data);
    // Use the model to do inference on a data point the model hasn't seen before:
    var check0 = await model.predict(tf.tensor2d([1], [1, 1])).array();
    for (var i=0;i<check0.length;i++){
        //var check0 = await model.predict(tf.tensor2d([1,3,3,7], [4, 1])).array();
        if (check0[i]>0) check++;
         console.log(check0[i]);
    };

    if (check/check0.length*100>=70) {
        console.log(true);
    } else {
        console.log(false);
    };
    console.log(check/check0.length*100);
};
const path = require('path');
const fastText = require('fasttext');
async function straintf(){
    const modelURL = path.resolve(__dirname, './model.bin');
    const classifier  = new fastText.Classifier(modelURL);
    classifier.predict('ngày tháng', 100)
    .then(res => {
            console.log('res: ', res);
    }).catch (err => {
        console.log('err: ',err);
    });
};
module.exports = {
    straintf: straintf
};