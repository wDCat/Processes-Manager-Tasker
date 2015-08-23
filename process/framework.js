/* ------------------------------------------------------------------------
 Processes Manager
 Author: DCat (http://blog.opk.me/)
 Tieba: @definecat
 Version: 0.1.2
 ------------------------------------------------------------------------- */
t = tk;
pclist = {};//记录列表进程

__nolog__ = 1;//禁止显示日志
window.onerror = function (rText, rLine, rd) {
    document.write("<p><div class='text-danger'>[Error-" + rd + "]" + rText + "</div></p>");
};
dolog = function (t) {
    if (typeof __nolog__ == "undefined")$(".logs").append("<div class='text-info'>[LOG] " + t + "</div>");
};
build = function (fil, vers) {
    dolog(fil + "---版本：" + vers)
};
dolog("DOLOG测试");
tid = {};
build("framework.js", 41);
clstr = function (str) {
    p = str.replace(/       /g, " ")
        .replace(/      /g, " ")
        .replace(/     /g, " ")
        .replace(/    /g, " ")
        .replace(/   /g, " ")
        .replace(/  /g, " ")
        .replace(/ /g, "|");
    dolog(p);
    return p;
};
clarr = function (arr) {
    dr = arr;
    var lpp = 0;
    for (i = 0; i < dr.length; i++) {

        if (dr[i] == "") {
            dr.splice(i, 1);
            i--;
            lpp = lpp + 1;
            if (lpp > 200)break;
        }
    }
    return dr;
};
function count(o) {
    var t = typeof o;
    if (t == 'string') {
        return o.length;
    } else if (t == 'object') {
        var n = 0;
        for (var i in o) {
            n++;
        }
        return n;
    }
    return false;
}
gettitle = function () {
    tit = t.shell("ps | grep USER", true, 20);
    dolog(tit);
    tit = clstr(tit).split("|");
    for (i = 0; i < tit.length; i++) {
        //dolog(i+"---"+tit[i]);
        if (tit[i] != "") {
            tid[tit[i]] = i;
            //dolog("call:"+tid[tit[i]]);
        }
    }
};
li = function (__i) {
    if (__i == 'tNAME')return 12;
    if (__i == 'NAME_1')return 13;
    if (__i == 'NAME_2')return 14;
    if (__i == 'NAME')return tid[__i] + 1;
    return tid[__i];
};
getprocess = function () {
    gettitle();
    //dolog("NAME 所在单元："+ tid['NAME']);
    pcs = t.shell("ps | grep u0_", true, 20);
    pcitem = pcs.split("\n");
    for (i = 0; i < pcitem.length; i++) {
        //break;
        obd = clstr(pcitem[i]);
        ob = obd.split("|");
        //dolog("LEN:"+ob.length+" -- "+obd);
        ob[li('tNAME')] = ob[li('NAME')];
        if (ob[li('NAME')].indexOf(":") != -1) {
            var name = ob[li('NAME')];
            var n2 = name.split(":");
            ob[li('NAME_1')] = n2[0];
            ob[li('NAME_2')] = n2[1];
        } else {
            ob[li('NAME_1')] = ob[li('NAME')];
            ob[li('NAME_2')] = "";
        }
        pclist[i] = ob;
        //dolog("trycall:"+pclist[i][li('NAME')]);
        printone(i, ob);

        //dolog(ob[ob.length-1]);
    }
    //$(".info").html("正在获取名称....");
    setTimeout(function () {
        printan();
    }, 300);
};

isexist = function (type, pn) {
    switch (type) {
        case 'name':
            var pids = t.shell("pidof " + pn, false, 30);
            if (pids == "")return {};
            else {
                var sp = pids.split("\n");
                return sp;
            }
            break;
        case 'pid':
            var pids = t.shell("ls /proc/" + pn, false, 30);
            if (pids.indexOf("No such file or directory") == -1)return 1;
            else return 0;
            break;
        default:
            alert('error');
    }
};
catinfo = function (_pid, type) {
    pid = _pid;
    return t.shell("cat /proc/" + pid + "/" + type, true, 20);
};
getprocesstasks = function (_pid) {
    pid = _pid;
    return t.shell("ls /proc/" + pid + "/task/", true, 20);
};
killprocess = function (way, pn) {//封装了一些杀进程的函数
    switch (way) {
        case "kill":
            return t.shell("kill -s 9 " + pn, true, 20);
            break;
        case "killall":
            return t.shell("killall " + pn, true, 20);
            break;
        case "am":
            return t.shell("am force-stop " + pn, true, 20);
            break;
        default:
            return "出现错误，指令无法识别."
    }
};
killtreeprocess = function (id) {
    name = pclist[id][li('NAME_1')];
    var msg = "已终止..";
    /*for(i=0;i<count(pclist);i++){
     if(pclist[i][li('NAME_1')]==name){
     dolog(pclist[i][li('NAME_1')]);
     msg=msg+"已关闭："+pclist[i][li('NAME')]+"---"+pclist[i][li('PID')]+"    \n";
     killprocess(pclist[i][li('PID')]);
     }
     }*/
    //msg=msg+t.shell("killall "+name,true,30);

    msg = msg + killprocess("am", name);
    return msg;
};
