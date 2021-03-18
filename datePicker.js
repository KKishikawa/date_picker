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

/** 定数 */
datePicker.prototype.dateDataName = "d";
datePicker.prototype.lastMonthClassName = "last-month";
datePicker.prototype.nextMonthClassName = "next-month";
datePicker.prototype.monthDataName = "m";
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
    this.now = new Date();
    this.shownDate = new Date();
    this.showDateElement();

    this.root.style.left = window.pageXOffset + input.clientLeft + "px";
    this.root.style.top = window.pageYOffset + input.clientTop + input.clientHeight + 10 + "px";
    this.root.style.display = "";
}

/**
 * 本体作成
 */
datePicker.prototype.createFrame = function () {
    var that = this;
    var head = document.createElement("div");
    head.className = "dp-head-wrapper"
    this.prev = document.createElement("div");
    this.prev.textContent = "＜";
    this.prev.onclick = function () { that.handleClickSwitch(-1); };
    this.next = document.createElement("div");
    this.next.textContent = "＞";
    this.next.onclick = function () { that.handleClickSwitch(1); };
    this.headBody = document.createElement("div");
    this.headBody.onclick = function () { that.handleClickHeadBody(); };
    head.appendChild(this.prev);
    head.appendChild(this.headBody);
    head.appendChild(this.next);

    this.body = document.createElement("div");
    this.body.classList.add("dp-body-wrapper");
    this.body.onclick = function (e) { that.handleClickBody(e) };

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
    var dateTable = document.createElement("table");
    var d = new Date(this.shownDate);
    d.setDate(1);
    var wd = d.getDay();
    var dim = calendar.DayInMonth(this.shownDate);
    // first week
    var tr = dateTable.insertRow(-1);
    if (wd > 0) {
        var ld = new Date(d);
        for (var i = 0; i < wd; i++) {
            var c = tr.insertCell(0);
            ld.setDate(ld.getDate() - 1);
            var date = ld.getDate();
            c.textContent = date;
            c.dataset[this.dateDataName] = date;
            c.classList.add(calendar.weekClasses[ld.getDay()]);
            c.classList.add(this.lastMonthClassName);
        }
    }
    var fwcnt = 7 - wd;
    d.setDate(0);
    for (var i = 0; i < fwcnt; i++) {
        d.setDate(d.getDate() + 1);
        var c = tr.insertCell(-1);
        var date = d.getDate();
        c.textContent = date;
        c.dataset[this.dateDataName] = date;
        c.className = calendar.weekClasses[d.getDay()];
    }
    var loop = Math.ceil((dim - fwcnt) / 7) - 1;
    for (var i = 0; i < loop; i++) {
        tr = dateTable.insertRow(-1);
        for (var j = 0; j < 7; j++) {
            d.setDate(d.getDate() + 1);
            var c = tr.insertCell(-1);
            var date = d.getDate();
            c.textContent = date;
            c.dataset[this.dateDataName] = date;
            c.className = calendar.weekClasses[d.getDay()];
        }
    }
    var lwcnt = dim - d.getDate();
    tr = dateTable.insertRow(-1);
    for (var i = 0; i < lwcnt; i++) {
        d.setDate(d.getDate() + 1);
        var c = tr.insertCell(-1);
        var date = d.getDate();
        c.textContent = date;
        c.dataset[this.dateDataName] = date;
        c.className = calendar.weekClasses[d.getDay()];
    }
    var nmcnt = 7 - lwcnt;
    for (var i = 0; i < nmcnt; i++) {
        d.setDate(d.getDate() + 1);
        var c = tr.insertCell(-1);
        var date = d.getDate();
        c.textContent = date;
        c.dataset[this.dateDataName] = date;
        c.classList.add(calendar.weekClasses[d.getDay()]);
        c.classList.add(this.nextMonthClassName);
    }
    this.body.appendChild(dateTable);
};
datePicker.prototype.showYear = function () {
    this.headBody.textContent = this.shownDate.getFullYear() + "年";
}
datePicker.prototype.showMonthElement = function () {
    this.type = "month";
    this.showYear();
    this.body.innerHTML = "";
    var table = document.createElement("table");
    for (var i = 0; i < 3; i++) {
        var k = i * 4;
        var tr = table.insertRow(-1);
        for (var j = 1; j <= 4; j++) {
            var td = tr.insertCell(-1);
            var m = k + j;
            td.textContent = m + "月";
            td.dataset[this.monthDataName] = m;
        }
    }
    this.body.appendChild(table);
};
datePicker.prototype.showDateElement = function () {
    this.headBody.textContent = this.shownDate.getFullYear() + "年" + (this.shownDate.getMonth() + 1) + "月";
    this.body.innerHTML = "";
    this.type = "date";
    this.createWeekElement();
    this.createDateElement();
};

datePicker.prototype.handleClickSwitch = function (num) {
    switch (this.type) {
        case "date":
            this.shownDate.setMonth(this.shownDate.getMonth() + num);
            this.showDateElement();
            break;
        case "month":
            this.shownDate.setFullYear(this.shownDate.getFullYear() + num);
            this.showYear();
            break;
        default:
            break;
    }
};
datePicker.prototype.handleClickHeadBody = function () {
    this.showMonthElement();
};

/**
 * 
 * @param {MouseEvent} e マウスイベント
 */
datePicker.prototype.handleClickBody = function (e) {
    var t = e.target;
    switch (this.type) {
        case "date":
            var d = t.dataset[this.dateDataName];
            if (!d) break;
            this.shownDate.setDate(d);
            if (t.classList.contains(this.lastMonthClassName)) {
                this.shownDate.setMonth(this.shownDate.getMonth() - 1);
            } else if (t.classList.contains(this.nextMonthClassName)) {
                this.shownDate.setMonth(this.shownDate.getMonth() + 1);
            }
            this.input.value = this.shownDate.getFullYear() + "-" + (this.shownDate.getMonth() + 1) + "-" + this.shownDate.getDate();
            break;
        case "month":
            var m = t.dataset[this.monthDataName];
            if (!m) break;
        default:
            this.shownDate.setMonth(m - 1);
            this.showDateElement();
            break;
    }
};
