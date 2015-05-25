
$(function() {

//    var data = [
//        {
//            subject_name: "飞天茅台1",
//            subject_profit: 8,
//            subject_period: 4,
//            subject_total_amount: 10000,
//            subject_init_amount: 1000
//        },
//        {
//            subject_name: "飞天茅台2",
//            subject_profit: 18,
//            subject_period: 14,
//            subject_total_amount: 100001,
//            subject_init_amount: 10001
//        }
//    ];


//    //添加subjects
//    $("#add_subjects_list").on('click', function() {
//
//        $.each(data, function(index, val) {
//            addSubjectToFront(val);
//        });
//    });

    querySubjectsFromServer();

});

function querySubjectsFromServer() {

    $.ajax({
        url: serverUrl,
        dataType: "json",
        data: {openid: openid},
        type: "GET",
        success: function(data) {
            if(data.respCode == 1000) {
                if(!data.subjectList || data.subjectList.length == 0 ) {
                    noValidSubjects();
                    return;
                }
                $.each(data, function(index, val) {
                    addSubjectToFront(val);
                });
            } else {
                myAlert(data.errmsg, function(){
                    if(data.errcode == "400000") {
                        document.location.href="400.html";
                    }
                    if(data.errcode == "500000") {
                        document.location.href="500.html";
                    }
                });
            }
        }
    });
}

function noValidSubjects() {

    var $tips = $('<div class="panel panel-default" style="margin-left: 16px; margin-right: 16px;">\
                   <div class="panel-heading">\
                       标的已被秒光啦，下次早点呦！！！\
                   </div>\
               </div>');
    $tips.appendTo('.subjects_list');
}

function addSubjectToFront(subject) {

    var $desc = $('<div class="panel panel-default">\
            <div class="panel-heading" id="subject_title">\
                '+ subject.subject_name +'\
            </div>\
            <table class="table">\
                <tr>\
                    <td>年化收益:</td><td><span id="porfit">'+ subject.subject_profit +'</span>%</td>\
                    <td>投资期限:</td><td><span id="invest_period">'+ subject.subject_period +'</span>个月</td>\
                </tr>\
                <tr>\
                    <td>项目金额:</td><td><span id="total_amount">'+ subject.subject_total_amount +'</span>元</td>\
                    <td>起投金额:</td><td><span id="start_amount">'+ subject.subject_init_amount +'</span>元</td>\
                </tr>\
            </table>\
        </div>');
    $desc.appendTo('.subjects_list');
}