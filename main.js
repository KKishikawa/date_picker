var dp = document.getElementById("date_picker");
var ip = document.getElementById("ip_d");
var btn_d = document.getElementById("btn_d");
var p = new datePicker(dp);

btn_d.onclick = function () {
    p.toggle(ip);
};
