'use strict'
var calendar = calendar || {};
calendar.weekLabels = ["日", "月", "火", "水", "木", "金", "土"];
calendar.weekClasses = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
calendar.validateDate = function (str) {
    var year, month, date;
    if (typeof str !== 'string' && typeof str !== 'number') {
        return false;
    }
    str += "";  // fix the type to String
    if (str.test(/^\d{8}$/)) {
        year = str.slice(0, 4);
        month = str.slice(4, 6);
        date = str.slice(6);
    }
    var sptr = ['/', '-'];
    return new Date(year, month, date);
};
/**
 * その月の日数を取得する。
 * @param {Date} date 対象月内の日
 * @returns 日数
 */
calendar.DayInMonth = function (date) {
    var eDate = new Date(date);
    eDate.setMonth(eDate.getMonth() + 1);
    eDate.setDate(0);
    return eDate.getDate();
};



/**
 * constructor
 * @param {HTMLElement} el 日付ピッカーのroot
 */
var datePicker = function (el) {
    this.root = el;
    this.createFrame();
    this.root.style.display = "none";
};
/**
 * ピッカーを開く/閉じる
 * @param {HTMLInputElement} input 入力フィールド
 */
datePicker.prototype.toggle = function (input) {
    if (this.root.style.display != "none") {
        this.root.style.display = "none";
        return;
    }
    this.input = input;
    this.curDate = new Date();
    this.shownDate = new Date(this.curDate);
    this.showDateElement();

    this.root.style.left = window.pageXOffset + input.clientLeft + "px";
    this.root.style.top = window.pageYOffset + input.clientTop + input.clientHeight + "px";
    this.root.style.display = "";
}

/**
 * 本体作成
 */
datePicker.prototype.createFrame = function () {
    var head = document.createElement("div");
    this.prev = document.createElement("div");
    this.prev.textContent = "＜";
    this.next = document.createElement("div");
    this.next.textContent = "＞";
    this.headBody = document.createElement("div");
    head.appendChild(this.prev);
    head.appendChild(this.headBody);
    head.appendChild(this.next);

    this.body = document.createElement("div");
    this.body.classList.add("dp-body-wrapper");

    this.root.appendChild(head);
    this.root.appendChild(this.body);
};
datePicker.prototype.createWeekElement = function () {
    var weekTable = document.createElement("table");
    var row = weekTable.insertRow(-1);

    for (var i = 0; i < 7; i++) {
        var cell = row.insertCell(-1);
        cell.textContent = calendar.weekLabels[i];
        cell.classList.add(calendar.weekClasses[i]);
    }
    this.body.appendChild(weekTable);
};
datePicker.prototype.createDateElement = function () {
    this.DateTable = document.createElement("table");
    this.DateTable.innerHTML = ""; // 初期化
    var d = new Date(this.shownDate);
    d.setDate(1);
    var wd = d.getDay();
    var dim = calendar.DayInMonth(this.shownDate);
    // first week
    var tr = this.DateTable.insertRow(-1);
    if (wd > 0) {
        var ld = new Date(d);
        ld.setDate(0);
        for (var i = 0; i < wd; i++) {
            var c = tr.insertCell(0);
            ld.setDate(ld.getDate() - i);
            var date = d.getDate();
            c.innerText = date;
            c.attributes["d"] = date;
            c.classList.add(calendar.weekClasses[ld.getDay()]);
            c.classList.add("last-month");
        }
    }
    var fwcnt = 7 - wd;
    d.setDate(0);
    for (var i = 0; i < fwcnt; i++) {
        d.setDate(d.getDate() + 1);
        var c = tr.insertCell(-1);
        var date = d.getDate();
        c.innerText = date;
        c.attributes["d"] = date;
        c.className = calendar.weekClasses[d.getDay()];
    }
    var loop = Math.ceil((dim - fwcnt) / 7) - 1;
    for (var i = 0; i < loop; i++) {
        tr = this.DateTable.insertRow(-1);
        for (var j = 0; j < 7; j++) {
            d.setDate(d.getDate() + 1);
            var c = tr.insertCell(-1);
            var date = d.getDate();
            c.innerText = date;
            c.attributes["d"] = date;
            c.className = calendar.weekClasses[d.getDay()];
        }
    }
    var lwcnt = dim - d.getDate();
    tr = this.DateTable.insertRow(-1);
    for (var i = 0; i < lwcnt; i++) {
        d.setDate(d.getDate() + 1);
        var c = tr.insertCell(-1);
        var date = d.getDate();
        c.innerText = date;
        c.attributes["d"] = date;
        c.className = calendar.weekClasses[d.getDay()];
    }
    var nmcnt = 7 - lwcnt;
    for(var i = 0; i < nmcnt; i++){
        d.setDate(d.getDate() + 1);
        var c = tr.insertCell(-1);
        var date = d.getDate();
        c.innerText = date;
        c.attributes["d"] = date;
        c.classList.add(calendar.weekClasses[d.getDay()]);
        c.classList.add("next-month");
    }
    this.body.appendChild(this.DateTable);
};
datePicker.prototype.showMonthElement = function () {

};

datePicker.prototype.showDateElement = function () {
    this.headBody.textContent = this.curDate.getFullYear() + "年" + (this.curDate.getMonth() + 1) + "月";
    this.body.innerText = "";
    this.createWeekElement();
    this.createDateElement();
};