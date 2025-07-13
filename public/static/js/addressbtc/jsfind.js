async function GET_data_BTC(data) {
    let URL_BTC = "https://api.blockcypher.com/v1/btc/main/txs/" + data;
    try {
        return await $.ajax({
            url: URL_BTC,
            type: "GET",
            success: function (res, status) {
                res.status = status;
                return res;
            },
            error: function (res, status) {
                return res;
            }
        });
    } catch (err) {
        let res = {
            status: 404
        };
        return res;
    };

};
$("#btn-login").click(SearchBTC);
async function SearchBTC() {
    let Transaction = document.getElementById("textname").value;
    if (Transaction.trim().length == 0) {
        alert("Vui lòng nhập BTC Transaction!");
        return;
    };
    let data = await GET_data_BTC(Transaction); console.log(data);
    let liInputsOld = document.querySelectorAll(".research");
    if (liInputsOld && liInputsOld.length > 0) {
        for (let i = 0; i < liInputsOld.length; i++) {
            liInputsOld[i].remove();
        };
    };
    if ((data.statusText && data.statusText.indexOf("error") >= 0) || data.status >= 400) {
        alert("Sai chuỗi BTC Transaction hoặc API không phản hồi!");
        return;
    } else {
        //add Input and Output
        addInput(data.inputs);
        addOutput(data.outputs);
        addInfoTrans(data);
    };
};
function addInput(data1) {
    var ulInputs = document.getElementById("list-inputs");
    if (data1 && data1.length > 0 && data1[0].prev_hash) {
        var liInput = "";
        for (let i = 0; i < data1.length; i++) {
            if (data1[i].prev_hash) {
                liInput += "<li id='li-inputs-" + i + "' class='li-inputs research' title='" + data1[i].addresses[0] + "'>" + data1[i].prev_hash + "</li>";
            } else {
                liInput += "<li id='li-inputs-" + i + "' class='li-inputs' title='" + data1[i].addresses + "'>No prev_hash</li>";
            };
        };
        //console.log(liInput)
        ulInputs.innerHTML = liInput;
        addEnventClickli();
    };

};
function addOutput(data2) {
    //console.log('data2',data2)
    var ulOutputs = document.getElementById("list-outputs");
    if (data2 && data2.length > 0 && data2[0].spent_by) {
        //console.log(data2)
        var liOutput = "";
        for (let i = 0; i < data2.length; i++) {
            if (data2[i].spent_by) {
                liOutput += "<li id='li-outputs-" + i + "' class='li-outputs research' title='" + data2[i].addresses[0] + "'>" + data2[i].spent_by + "</li>";
            } else {
                liOutput += "<li id='li-outputs-" + i + "' class='li-outputs' title='" + data2[i].addresses + "'>No spent_by</li>";
            };

        };
        //console.log(liInput)
        ulOutputs.innerHTML = liOutput;
        addEnventClickli();
    };
};
function addInfoTrans(data0) {
    var ulInfor = document.getElementById("list-infomation");
    var liInfomation = "";
    if (data0 && data0.relayed_by) {
        liInfomation += "<li class='li-infomation research'><b>- Relayed_by (IP): </b>" + data0.relayed_by + "</li>";
    };
    if (data0 && data0.block_hash) {
        liInfomation += "<li class='li-infomation research'><b>- Block_hash: </b>" + data0.block_hash + "</li>";
    };
    if (data0 && data0.block_height) {
        liInfomation += "<li class='li-infomation research'><b>- Block_height: </b>" + data0.block_height + "</li>";
    };
    if (data0 && data0.confirmed) {
        liInfomation += "<li class='li-infomation research'><b>- Confirmed: </b>" + data0.confirmed + "</li>";
    };
    if (data0 && data0.received) {
        liInfomation += "<li class='li-infomation research'><b>- Received: </b>" + data0.received + "</li>";
    };
    ulInfor.innerHTML = liInfomation;
};
function addEnventClickli() {
    $(".research").click(function (e) {
        e.preventDefault();
        let id_li_click = $(this).attr("id");
        let valueLiReSearch = document.getElementById(id_li_click).textContent.trim();
        document.getElementById("textname").value = valueLiReSearch;
        SearchBTC();
    })
};