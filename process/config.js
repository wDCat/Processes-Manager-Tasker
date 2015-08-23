/* ------------------------------------------------------------------------
 Processes Manager
 Author: DCat (http://blog.opk.me/)
 Tieba: @definecat
 Version: 0.1.2
 ------------------------------------------------------------------------- */
if(typeof(tk.flash)=="undefined") {
    alert("Tasker is needed.");
}
if(typeof(t)=="undefined") {
    t=tk;
}
if(typeof(config)=='undefined') {
    //alert('setting.');
    config = {
        set: function (key, value) {
            tk.setGlobal("wPm_"+key,value);
            tk.setGlobal("wPm_Hash_"+key,"##"+value+"##");
            return tk.global("wPm_"+key);
        },
        get: function (key) {
            return tk.global("wPm_"+key);
        }
    };
}
//config.set('HH','Hello world');
//alert(config.read('HH'));