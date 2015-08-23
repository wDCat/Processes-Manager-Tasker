/* ------------------------------------------------------------------------
 Processes Manager
 Author: DCat (http://blog.opk.me/)
 Tieba: @definecat
 Version: 0.1.2
 ------------------------------------------------------------------------- */
build("main.js", 21);
_main_js_init = 1;
if (typeof(tk.flash) == "undefined") {
    document.write("<p><div class='text-danger'>请在Tasker中运行</div></p>");
}
if (typeof(jQuery) == "undefined") {
    document.write("<p><div class='text-danger'>Unable to load jQuery.</div></p>");
}
printone = function (id, obd) {
    $(".info").html("Insert..." + obd[li('PID')]);
    name = obd[li('NAME')];
    if (name.indexOf("/") != -1 || name.indexOf(".") == -1)return;

    /*tr=$("<tr></tr>");
     $("<th></th>").attr('scope','row').html(obd[li('PID')]).appendTo(tr);
     $("<td></td>").html(obd[li('NAME')]).addClass('p-'+id).appendTo(tr);
     $("<td></td>").html(obd[li('NAME')]).appendTo(tr);
     $("<td></td>").html(obd[li('USER')]).appendTo(tr);
     tr.addClass("proci").data("id",id).appendTo($(".pcsd"));*/
    //.data("name",obd[li('NAME')])
    pcone = $("<div></div>").addClass("media proci").data("id", id);
    pcone.html($(".p-simple").html());
    pcone.find(".p-title").html(obd[li('tNAME')]).addClass('p-' + id);
    pcone.find(".p-info").html("进程名：" + obd[li('tNAME')] + "<br />PID：" + obd[li('PID')] + "    用户：" + obd[li('USER')]);
    pcone.appendTo($(".p-list"));

};
printan = function () {
    trs = $(".p-list > div").not(".p-simple");
    //$("[class*=p-]").html("%%");
    for (i = 0; i < trs.length; i++) {
        id = $(trs[i]).data('id');
        name = pclist[id][li('NAME_1')];
        $(".info").html("正在获取(" + i + "/" + trs.length + "):" + name);
        if (name.indexOf("/") != -1) {
            $(trs[i]).empty();
            //$(".p-"+$(trs[i]).data("pid")).html("");
            continue;
        }
        if (name.indexOf(".") == -1) {
            //$(".p-"+$(trs[i]).data("pid")).html("--");
            $(trs[i]).empty();
            continue;
        }
        /*if(name.indexOf(":")!=-1){
         dd=name.split(":");
         name=dd[0];
         }*/
        var dna = getappname(name);
        if (dna != "") {
            $(".p-" + id).html(dna);
            pclist[id][li('tNAME')] = dna;
        }
        //t.wait(100);
    }
    $(".info").html("Done.");
    //$(".wl-info").hide();
    loading(0, "");
};
getappname = function (apkn) {
    t.setGlobal("PCGAN", "===");
    t.performTask("getappname", 1, apkn, "");
    while (t.global("PCGAN") == "===") {
        t.wait(10);
    }
    return t.global("PCGAN");
    /*
     wait=function(){
     if(t.global("PCGAN")!="==="&&t.global("PCGAN")!="")return t.global("PCGAN");
     else setTimeout(function(){wait()},200)
     }
     wait();
     */
};
pd_menu = function (id) {
    $(".p-footer").hide();
    pd_clear();
    var list = new listobj('media');
    list.insert(1, "查看基本信息", "glyphicon-wrench", "Show simple info.");
    list.insert(2, "查看线程列表", "glyphicon-wrench", "Show Task Info");
    list.self.find(".text").css({'font-size': '11px', 'color': '#555555'});
    list.appendTo($(".de-info")).click(function (obj, ids) {
        switch (ids) {
            case 1:
                //$(".p-footer").show();
                pd(id);
                break;
            case 2:
                pd_task(id);
                break;
        }

    });
};
pd_close = function () {
    $(".p-close").click();
};
pd_kill = function (id) {
    pd_title("终止进程");
    pd_clear();
    pd_text.append("<div><h4>确定要终止这个进程吗？</h4><span>??</span></div>").find("code").html(pclist[id][li('tNAME')]);
    _tm = 666;
    pd_text.find("span").css({'color': 'rgba(0,0,0,0.7)'}).html("<ul><li>对象：<code>" + pclist[id][li('tNAME')] + "</code></li><li>终止方式：" + ((_tm = config.get('DefaultKillingway')) == "" ? "没有数据" : codetotext(_tm)) + "<a href='#' class='change' style='padding-left:4px'>更换</a></li></ul>").find("a.change").click(function () {
        pd_config();
    });
    pd_text.append("<p class='line'></p>");
    (new listobj('media')).insert(1, "确定", "glyphicon-wrench", "Yes Yes Yes")
        .insert(2, "不了", "glyphicon-wrench", "No No No")
        .appendTo($(".de-info")).click(function (obj, way) {
            if (way == 1) {
                pd_killingresult(id, parseInt(_tm));
            } else pd(id);
        });
};
pd_text = function () {
    return $(".de-info");
};
codetotext = function (_t) {
    switch (_t) {
        case "1":
            return "使用 am 终止";
            break;
        case "2":
            return "使用 kill 终止";
            break;
        case "3":
            return "使用 killall 终止";
            break;
        default:
            return "数据错误:#" + _t + "#";
    }
};
pd_config_kw = function () {
    pd_clear();
    pd_title('选择 默认终止进程方式');

    pd_text.append("<h4>原先方式:<code><span class='yx'></span></code></h4>").find(".yx").html((_tm = config.get('DefaultKillingway')) == "" ? "没有数据" : codetotext(_tm));
    pd_text.append("<h4>修改为</h4>");
    (new listobj('media')).insert(1, "使用 am 终止", "glyphicon-wrench", "am focus-stop")
        .insert(2, "使用 kill 终止", "glyphicon-wrench", "kill -s 9 ")
        .insert(3, "使用 killall 终止", "glyphicon-wrench", "killall")
        .insert(4, "返回", "glyphicon-wrench", "Return")
        .appendTo($(".de-info")).click(function (obj, way) {
            if (way == 4) {
                pd_config();
            } else {
                config.set('DefaultKillingway', way);
                pd_clear();
                pd_text.append("<h4>设置已保存</h4>");
                (new listobj('media'))
                    .insert(4, "返回", "glyphicon-wrench", "Return")
                    .appendTo($(".de-info"))
                    .click(function () {
                        pd_config();
                    });
            }

        });
};
pd_config = function () {
    pd_clear();
    pd_title('偏好设置');
    (new listobj('media')).appendTo(pd_text)
        .insert(1, "默认终止进程方式", "glyphicon-wrench", "Setting")
        .insert(99, "关闭", "glyphicon-wrench", "Close")
        .click(function (obj, sid) {
            switch (sid) {
                case 1:
                    pd_config_kw();
                    break;
                case 99:
                    pd_close();
                    break;
                default:
                    error('Error');
            }
        });
};
pdobj = function () {
    return $(".de-info");
};
pd_clear = function () {
    $(".de-info").empty();
};
pd_killingresult = function (id, way) {
    pd_clear();
    $(".de-info").append("<div class='alert alert-info' role='alert' style='display:none;'>loading..</div><div><h4>执行结果</h4><span class='pd-kr-info'>等待...</span></div><div><h4>PID 残留</h4><span class='pd-kr-c1'>正在加载数据...</span></div></div><div><h4>进程残留</h4><span class='pd-kr-c2'>等待...</span></div>").find("h4").prepend("<i class='glyphicon glyphicon-asterisk text-info'></i>");
    $(".de-info > div").css({'margin-right': '10px'});
    var way2 = "";
    var pns = "";
    switch (way) {
        case 2:
            way2 = 'kill';
            pns = pclist[id][li('PID')];
            break;
        case 3:
            way2 = 'killall';
            pns = pclist[id][li('NAME_1')];
            break;
        case 1:
            way2 = 'am';
            pns = pclist[id][li('NAME_1')];
            break;
        default:
            alert('error');
    }
    $(".pd-kr-c1").parent().hide();
    $(".de-info > div.alert").html("正在使用 " + way2 + " 终止对象:<br /> " + pns).empty();
    //isexist('name',pclist[id][li('NAME')]);
    var _succ = 0;
    setTimeout(function () {
        $(".pd-kr-info").html("正在执行...");
        msgg = killprocess(way2, pns);
        $(".pd-kr-info").html((msgg == "") ? '执行完毕，没有返回值。' : msgg).addClass('text-info');
        setTimeout(function () {
            //$(".pd-kr-c1").html("正在加载数据...")
            $(".pd-kr-c2").html("正在加载数据...");
            /*var t1=isexist('pid',pclist[id][li('PID')]);
             if(t1==0){
             $(".pd-kr-c1").html("无残留").addClass('text-success');
             }else{
             $(".pd-kr-c1").html("检测到进程依旧在运行.").addClass('text-danger');
             }*/
            var t2 = isexist('name', pclist[id][li('NAME')]);

            if (count(t2) == 0) {
                //_succ=1;
                $(".clorncl").html("3秒后自动关闭");
                $(".pd-kr-c2").html("无残留").addClass('text-success');
                setTimeout(function () {
                    pd_close();
                }, 3000);
            } else {
                $(".clorncl").html("关闭");
                $(".pd-kr-c2").html("检测到进程依旧在运行..<br /><br />").addClass('text-danger');
                var list = new listobj('table');
                list.sethead(Array('#', "进程PID"));
                for (i in t2) {
                    list.insert(0, Array(i, t2[i]));
                }
                list.appendTo($(".pd-kr-c2"));

            }
        }, 800);
    }, 200);
    pd_text.append("<p class='line'></p>");
    (new listobj('media')).insert(1, "重试", "glyphicon-wrench", "Retry.")
        .insert(2, "<span class='clorncl'>请等待</span>", "glyphicon-wrench", "Close.")
        .appendTo($(".de-info"))

        .click(function (obj, bid) {
            switch (bid) {
                case 1:
                    return pd_killingresult(id, way);
                case 2:
                    return pd_close();
            }
        });


};
pd_title = function (_t) {
    $(".de-title").html(_t);
};


pd_task = function (id) {

    pd_clear();
    /*var btns=new listobj('button');
     btns.insert(1,"返回菜单","danger",function(){
     printdetailmenu(id);
     });
     btns.insert(2,"刷新列表","primary",function(){
     pd_task(id);
     });
     btns.appendTo($(".de-info"));*/
    (new listobj('media')).insert(1, "返回菜单", "glyphicon-wrench", "Return.").appendTo($(".de-info")).click(function (obj, id) {
        switch (id) {
            case 1:
                pd_menu(id);
                break;
        }
    });
    $(".de-info").append("<br />");
    obj = pclist[id];
    info = getprocesstasks(obj[li('PID')]);
    //alert(info);
    var list = new listobj('table').sethead(Array('#', 'Task PID'));
    talist = info.split("\n");
    for (i in talist) {
        list.insert(i, Array(i, talist[i]));

    }
    list.appendTo($(".de-info"));

};
pd_show = function () {
    $(".p-da-show").click();
};
_lasttrans = 0;
pd = function (id, transobj) {
    /*$(".p-de-tbody").html("");

     //alert(count(tid));
     cou=1;
     for(i in tid){
     tr=$("<tr></tr>");
     $("<th></th>").attr("scope","row").html(cou).appendTo(tr);
     $("<td></td>").html(i).appendTo(tr);
     $("<td></td>").html(obj[li(i)]).appendTo(tr);
     tr.appendTo($(".p-de-tbody"));
     cou+=1;
     }
     */
    pd_clear();
    obj = pclist[id];
    /*var list = new listobj('table');
     list.sethead(Array('#', 'Key', 'Value'));
     list.insert(0, Array(1, '名称', obj[li('tNAME')]));
     list.insert(0, Array(2, '所属包', obj[li('NAME_1')]));
     list.insert(0, Array(3, '子线程', (_tm = obj[li('NAME_2')]) == "" ? "(空)" : _tm));
     list.insert(0, Array(4, '用户', obj[li('USER')]));
     //list.insert(0,Array(5,'查询1',isexist('pid',obj[li('PID')])));
     //list.insert(0,Array(6,'查询2',isexist('name',obj[li('NAME')])));
     //list.insert

     list.appendTo($(".de-info"));*/
    (typeof(transobj) == "undefined" || transobj == null) ? (transobj = _lasttrans) : (_lasttrans = transobj);
    $("<div></div>").html(transobj.html()).appendTo(pd_text);
    pd_text.append("<p class='line'></p>");
    (new listobj('media')).insert(1, "更多信息..", "glyphicon-wrench", "Show more info.")
        .insert(2, "终止该应用", "glyphicon-wrench", "Kill it now!")
        .insert(3, "返回", "glyphicon-wrench", "Return")
        .appendTo($(".de-info")).click(function (obj, ids) {
            switch (ids) {
                case 1:
                    pd_menu(id);
                    break;
                case 2:
                    pd_kill(id);
                    break;
                case 3:
                    pd_close();
                    break;

            }
        });

};
loading = function (s, text) {
    if (s) {
        $(".p-ld-1").hide();
        $(".p-ld-2").show();
    }
    else {
        $(".p-ld-1").show();
        $(".p-ld-2").hide();
    }
};
regevent = function () {
    if(config.get('DefaultKillingway')=="")config.set('DefaultKillingway',1);
    // data-toggle="modal" data-target="#p-de-dia"
    //$(".proci").data("toggle","modal").data("target","#p-de-dia");
    $(".proci").click(function () {
        $(".p-de-tbody").html("");
        pd($(this).data('id'), $(this));
        $(".p-da-show").click();

        /*id=$(this).data("id");
         pid=pclist[id][li('PID')];
         if(confirm("确定要终止："+pclist[id][li('tNAME')]+"吗?")){
         alert((_msg=killtreeprocess(id))===""?"已执行,无返回内容":_msg);
         }*/
    });
    $(".p-refresh").click(function () {
        //alert("Test");
        //refreshlist();
        //location.reload();
        t.performTask("wPm_reload", 1, "", "");
    });
    $(".nav-config").click(function () {
        pd_show();
        pd_config();
    });
    $(".nav-close").click(function () {
        t.performTask("wPm_close", 1, "", "");
    });
    $(".nav-about").click(function(){
        pd_clear();
        pd_title("关于");
        pd_text.append("<h3>简易进程管理</h3><br />测试版本<br />By <b>DCat</b><br />Tieba:@definecat");
        pd_show();
    })
};
refreshlist = function () {
    loading(1, "");
    //$(".wl-info").show();
    //$(".wl-info").animate({'height':'60px'});

    $(".info").html("Geting..");
    getprocess();
    regevent();
};
$().ready(function () {
    loading(1, "");
    pd_text = $(".de-info");
    //pd_footer=$(".de");
    $(".info").html("正在加载数据....");
    //$(".wl-info").css({'top': parseInt($(".wl-nav").css('height'))});
    //$(".wl-info").css({'height':'1px'});
    setTimeout(function () {
        refreshlist();
    }, 500);

});
//tk.flash("工作正常.");
