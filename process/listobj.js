/* ------------------------------------------------------------------------
 Objectly List
 Author: DCat (http://blog.opk.me/)
 Tieba: @definecat
 Version: 0.0.1
 ------------------------------------------------------------------------- */
listcount = 0;
listobj = function (type) {
    listcount = listcount + 5;
    switch (type) {
        case "table":
            return Object.create(listobj_table).create(listcount);
            break;
        case "media":
            return Object.create(listobj_media).create(listcount);
            break;
        case "button":
            return Object.create(listobj_button).create(listcount);
            break;
        default:
            alert("Error");
    }
};
listobj_table = {
    self: "",
    sid: "",
    test: "111",
    appendTo: function (obj) {
        //obj.html("");
        dr = $("<div></div>").addClass("table-responsive").appendTo(obj);
        this.self.appendTo(dr);
        return this;
    },
    create: function (id) {
        //alert("created");
        this.sid = id;
        this.self = $("<table></table>").addClass("table table-hover table-striped").data("sid", this.sid).addClass('list-' + this.sid).html("<thead><tr class='head'></tr></thead><tbody></tbody>");
        //sid=Math.random()*100;
        return this;
    },
    sethead: function (header) {
        hea = this.self.find('.head');
        for (i in header) {
            $("<th></th>").html(header[i]).appendTo(hea);
        }
        return this;
    },
    insert: function (id, ite) {
        var tro = $("<tr></tr>").addClass('list-' + this.sid + "-item").data('id', id);
        var isfirst = 1;
        for (i in ite) {
            if (isfirst == 1) {
                isfirst = 0;
                $("<th></th>").attr('scope', 'row').html(ite[i]).appendTo(tro);
            } else {
                $("<td></td>").html(ite[i]).appendTo(tro);
            }
        }
        tro.appendTo(this.self.find('tbody'));
        return this;
    },
    click: function (callback) {
        $('.list-' + this.sid + "-item").click(function () {
            callback(this, $(this).data('id'));
        });
        return this;
    }
};
listobj_media = {
    self: "",
    sid: "",
    test: "111",
    appendTo: function (obj) {
        //obj.html("");
        this.self.appendTo(obj);
        return this;
    },
    create: function (id) {
        //alert("created");
        this.sid = id;
        this.self = $("<div></div>").addClass("media-list").data("sid", this.sid).addClass('list-' + this.sid).html("");
        //sid=Math.random()*100;
        return this;
    },
    insert: function (id, title, img, text) {
        var tro = $("<div></div>").addClass('media list-' + this.sid + "-item").data('id', id);
        tro.html("<div class=\"media-left\"><center><span class=\"media-object img-circle img-thumbnail glyphicon icon\" src data-holder-rendered=\"true\" style=\"width: 55px; height: 55px;\"></span></center></div><div class=\"media-body\"><h4 class=\"media-heading title\"></h4><i><span class=\"text\"></span></i></div>");
        tro.find(".icon").css({'font-size': '35px', 'background': 'rgba(220,220,220,0.7)'}).addClass(img);
        tro.find(".text").html(text);
        tro.find(".title").html(title);
        tro.appendTo(this.self);
        this.self.find(".text").css({'font-size': '11px', 'color': '#555555'});
        return this;
    },
    click: function (callback) {
        $('.list-' + this.sid + "-item").click(function () {
            callback(this, $(this).data('id'));
        });
        return this;
    }

};
listobj_button = {
    self: 0,
    sid: 0,
    callback: {},
    appendTo: function (obj) {
        this.self.appendTo(obj);
        var mainc = this.callback;
        this.self.find("button").css({'margin-right': '6px'}).click(function () {
            var id = $(this).data('id');
            mainc[id]();
        });
        return this;
    },
    create: function (id) {
        this.sid = id;
        this.self = $("<div></div>").data("sid", this.sid).addClass('list-' + this.sid).html("");
        return this;
    },
    insert: function (id, title, type, call) {
        $("<button></button>").attr('type', 'button').addClass("btn btn-" + type).html(title).data('id', id).appendTo(this.self);
        this.callback[id] = call;
        return this;
    }

};
dialog_= {
    self:0,
    sid:0,
    create:function(mid) {
        this.sid=mid;
        var doc="    <button class=\"p-da-show d-show\" data-toggle=\"modal\" data-target=\"#p\" style=\"display:none;\">Open dialog        <div class=\"ripple-wrapper\"></div>    </button>    <div id=\"d-dd\" class=\"modal fade\" tabindex=\"-1\">        <div class=\"modal-dialog\">            <div class=\"modal-content\">                <div class=\"modal-header\">                    <button type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">×</button>                    <h4 class=\"modal-title d-title\">进程详情</h4>                </div>                <div class=\"modal-body d-text\">                </div>                <div class=\"modal-footer\" style=\"display:none;\">                    <button class=\"btn btn-primary d-close\" data-dismiss=\"modal\" style='display:none;'>隐藏窗口</button>                </div>            </div>        </div>    </div>";
        this.self=$("<div></div>").data('sid',mid).html(doc);
        this.self.appendTo($('.p-tmparea'));
        this.self.find("#d-dd").addClass(mid);
        this.self.find(".d-show").data('target','.'+mid);
        this.titleobj=this.self.find('.d-title').html('77');
        this.textobj=this.self.find('.d-text');
        this.footerobj=this.self.find('.d-footer');
        return this;
    },
    show:function() {

        this.self.find(".d-show").click();
        return this;
    },
    hide:function(){

        this.self.find(".d-close").click();
        return this;
    },
    titleobj:0,
    textobj:0,
    footerobj:0,
    title:function(_t){
        this.titleobj.html(_t);
        return this;
    },
    text:function(_t) {
        this.textobj.html(_t);
        return this;
    },
    footer:function(_t){
        this.footerobj.html(_t);
        return this;
    }
};
dialog=function() {
    return Object.create(dialog_).create(parseInt(Math.random() * 1000));
};