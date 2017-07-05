function BinaryHeap(scoreFunction){
  this.content = [];
  this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
  push: function(element) {
    this.content.push(element);
    this.bubbleUp(this.content.length - 1);
  },

  pop: function() {
    var result = this.content[0];
    var end = this.content.pop();
    if (this.content.length > 0) {
      this.content[0] = end;
      this.sinkDown(0);
    }
    return result;
  },

  remove: function(node) {
    var length = this.content.length;
    for (var i = 0; i < length; i++) {
      if (this.content[i] != node) continue;
      var end = this.content.pop();
      if (i == length - 1) break;
      this.content[i] = end;
      this.bubbleUp(i);
      this.sinkDown(i);
      break;
    }
  },

  size: function() {
    return this.content.length;
  },

  bubbleUp: function(n) {
    var element = this.content[n], score = this.scoreFunction(element);
    while (n > 0) {
      var parentN = Math.floor((n + 1) / 2) - 1,
      parent = this.content[parentN];
      if (score >= this.scoreFunction(parent))
        break;
      this.content[parentN] = element;
      this.content[n] = parent;
      n = parentN;
    }
  },

  sinkDown: function(n) {
    var length = this.content.length,
    element = this.content[n],
    elemScore = this.scoreFunction(element);

    while(true) {
      var child2N = (n + 1) * 2, child1N = child2N - 1;
      var swap = null;
      if (child1N < length) {
        var child1 = this.content[child1N],
        child1Score = this.scoreFunction(child1);
        if (child1Score < elemScore)
          swap = child1N;
      }
      if (child2N < length) {
        var child2 = this.content[child2N],
        child2Score = this.scoreFunction(child2);
        if (child2Score < (swap == null ? elemScore : child1Score))
          swap = child2N;
      }
      if (swap == null) break;
      this.content[n] = this.content[swap];
      this.content[swap] = element;
      n = swap;
    }
  }
};

(function () {
  'use strict';
  var root = this;
  var timezoneJS = {};
  if (typeof define === 'function' && define.amd) { // AMD
    define(function() {
     return timezoneJS;
    });
  } else if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = timezoneJS;
    }
    exports.timezoneJS = timezoneJS;
  } else {
    root.timezoneJS = timezoneJS;
  }

  timezoneJS.VERSION = '0.4.11';
  var ajax_lib = root.$ || root.jQuery || root.Zepto
    , fleegix = root.fleegix
    , DAYS = timezoneJS.Days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    , MONTHS = timezoneJS.Months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    , SHORT_MONTHS = {}
    , SHORT_DAYS = {}
    , EXACT_DATE_TIME = {};
  for (var i = 0; i < MONTHS.length; i++) {
    SHORT_MONTHS[MONTHS[i].substr(0, 3)] = i;
  }

  for (i = 0; i < DAYS.length; i++) {
    SHORT_DAYS[DAYS[i].substr(0, 3)] = i;
  }

  var _arrIndexOf = Array.prototype.indexOf || function (el) {
    if (this === null) {
      throw new TypeError();
    }
    var t = Object(this);
    var len = t.length >>> 0;
    if (len === 0) {
      return -1;
    }
    var n = 0;
    if (arguments.length > 1) {
      n = Number(arguments[1]);
      if (n != n) { // shortcut for verifying if it's NaN
        n = 0;
      } else if (n !== 0 && n !== Infinity && n !== -Infinity) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }
    if (n >= len) {
      return -1;
    }
    var k = n >= 0 ? n : Math.max(len - Math.abs(n), 0);
    for (; k < len; k++) {
      if (k in t && t[k] === el) {
        return k;
      }
    }
    return -1;
  };
  var _fixWidth = function (number, digits) {
    if (typeof number !== 'number') { throw 'not a number: ' + number; }
    var trim = (number > 1000);   // only trim 'year', as the others don't make sense why anyone would want that
    var s = number.toString();
    var s_len = s.length;
    if (trim && s_len > digits) {
      return s.substr(s_len - digits, s_len);
    }
    s = [s];
    while (s_len < digits) {
      s.unshift('0');
      s_len++;
    }
    return s.join('');
  };
  var _transport = function (opts) {
    if (!opts) return;
    if (!opts.url) throw new Error ('URL must be specified');
    if (!('async' in opts)) opts.async = true;
    if (typeof window === 'undefined' && typeof require === 'function') {
      var nodefs = require('fs');
      if (opts.async) {
        // No point if there's no success handler
        if (typeof opts.success !== 'function') return;
        opts.error = opts.error || console.error;
        return nodefs.readFile(opts.url, 'utf8', function(err, data) {
          return err ? opts.error(err) : opts.success(data);
        });
      }
      return nodefs.readFileSync(opts.url, 'utf8');
    }

    if ((!fleegix || typeof fleegix.xhr === 'undefined') && (!ajax_lib || typeof ajax_lib.ajax === 'undefined')) {
      throw new Error('Please use the Fleegix.js XHR module, jQuery ajax, Zepto ajax, or define your own transport mechanism for downloading zone files.');
    }
    if (!opts.async) {
      return fleegix && fleegix.xhr
      ? fleegix.xhr.doReq({ url: opts.url, async: false })
      : ajax_lib.ajax({ url : opts.url, async : false, dataType: 'text' }).responseText;
    }
    return fleegix && fleegix.xhr
    ? fleegix.xhr.send({
      url : opts.url,
      method : 'get',
      handleSuccess : opts.success,
      handleErr : opts.error
    })
    : ajax_lib.ajax({
      url : opts.url,
      dataType: 'text',
      method : 'GET',
      error : opts.error,
      success : opts.success
    });
  };
  timezoneJS.Date = function () {
    if(this === timezoneJS) {
      throw 'timezoneJS.Date object must be constructed with \'new\'';
    }
    var args = Array.prototype.slice.apply(arguments)
    , dt = null
    , tz = null
    , arr = []
    , valid = false
    ;
    if (Object.prototype.toString.call(args[0]) === '[object Array]') {
      args = args[0];
    }
    if (typeof args[args.length - 1] === 'string') {
      valid = Date.parse(args[args.length - 1].replace(/GMT[\+\-]\d+/, ''));
      if (isNaN(valid) || valid === null) { 
        tz = args.pop();
      }
    }
    var is_dt_local = false;
    switch (args.length) {
      case 0:
        dt = new Date();
        break;
      case 1:
        dt = new Date(args[0]);
        if (typeof args[0] == 'string' && args[0].search(/[+-][0-9]{4}/) == -1
                && args[0].search(/Z/) == -1 && args[0].search(/T/) == -1) {
            is_dt_local = true;
        }
        break;
      case 2:
        dt = new Date(args[0], args[1]);
        is_dt_local = true;
        break;
      default:
        for (var i = 0; i < 7; i++) {
          arr[i] = args[i] || 0;
        }
        dt = new Date(arr[0], arr[1], arr[2], arr[3], arr[4], arr[5], arr[6]);
        is_dt_local = true;
        break;
    }

    if (isNaN(dt.getTime())) { 
      throw new Error('Invalid date');
    }
    this._useCache = false;
    this._tzInfo = {};
    this._day = 0;
    this.year = 0;
    this.month = 0;
    this.date = 0;
    this.hours = 0;
    this.minutes = 0;
    this.seconds = 0;
    this.milliseconds = 0;
    this.timezone = tz || null;
    if (is_dt_local) {
       this.setFromDateObjProxy(dt);
    } else {
       this.setFromTimeProxy(dt.getTime(), tz);
    }
  };

  // Implements most of the native Date object
  timezoneJS.Date.prototype = {
    getDate: function () { return this.date; },
    getDay: function () { return this._day; },
    getFullYear: function () { return this.year; },
    getMonth: function () { return this.month; },
    getYear: function () { return this.year - 1900; },
    getHours: function () { return this.hours; },
    getMilliseconds: function () { return this.milliseconds; },
    getMinutes: function () { return this.minutes; },
    getSeconds: function () { return this.seconds; },
    getUTCDate: function () { return this.getUTCDateProxy().getUTCDate(); },
    getUTCDay: function () { return this.getUTCDateProxy().getUTCDay(); },
    getUTCFullYear: function () { return this.getUTCDateProxy().getUTCFullYear(); },
    getUTCHours: function () { return this.getUTCDateProxy().getUTCHours(); },
    getUTCMilliseconds: function () { return this.getUTCDateProxy().getUTCMilliseconds(); },
    getUTCMinutes: function () { return this.getUTCDateProxy().getUTCMinutes(); },
    getUTCMonth: function () { return this.getUTCDateProxy().getUTCMonth(); },
    getUTCSeconds: function () { return this.getUTCDateProxy().getUTCSeconds(); },
    // Time adjusted to user-specified timezone
    getTime: function () {
      return this._timeProxy + (this.getTimezoneOffset() * 60 * 1000);
    },
    getTimezone: function () { return this.timezone; },
    getTimezoneOffset: function () { return this.getTimezoneInfo().tzOffset; },
    getTimezoneAbbreviation: function () { return this.getTimezoneInfo().tzAbbr; },
    getTimezoneInfo: function () {
      if (this._useCache) return this._tzInfo;
      var res;
      // If timezone is specified, get the correct timezone info based on the Date given
      if (this.timezone) {
        res = this.timezone === 'Etc/UTC' || this.timezone === 'Etc/GMT'
          ? { tzOffset: 0, tzAbbr: 'UTC' }
          : timezoneJS.timezone.getTzInfo(this._timeProxy, this.timezone);
      }
      // If no timezone was specified, use the local browser offset
      else {
        res = { tzOffset: this.getLocalOffset(), tzAbbr: null };
      }
      this._tzInfo = res;
      this._useCache = true;
      return res;
    },
    getUTCDateProxy: function () {
      var dt = new Date(this._timeProxy);
      dt.setUTCMinutes(dt.getUTCMinutes() + this.getTimezoneOffset());
      return dt;
    },
    setDate: function (date) {
      this.setAttribute('date', date);
      return this.getTime();
    },
    setFullYear: function (year, month, date) {
      if (date !== undefined) { this.setAttribute('date', 1); }
      this.setAttribute('year', year);
      if (month !== undefined) { this.setAttribute('month', month); }
      if (date !== undefined) { this.setAttribute('date', date); }
      return this.getTime();
    },
    setMonth: function (month, date) {
      this.setAttribute('month', month);
      if (date !== undefined) { this.setAttribute('date', date); }
      return this.getTime();
    },
    setYear: function (year) {
      year = Number(year);
      if (0 <= year && year <= 99) { year += 1900; }
      this.setUTCAttribute('year', year);
      return this.getTime();
    },
    setHours: function (hours, minutes, seconds, milliseconds) {
      this.setAttribute('hours', hours);
      if (minutes !== undefined) { this.setAttribute('minutes', minutes); }
      if (seconds !== undefined) { this.setAttribute('seconds', seconds); }
      if (milliseconds !== undefined) { this.setAttribute('milliseconds', milliseconds); }
      return this.getTime();
    },
    setMinutes: function (minutes, seconds, milliseconds) {
      this.setAttribute('minutes', minutes);
      if (seconds !== undefined) { this.setAttribute('seconds', seconds); }
      if (milliseconds !== undefined) { this.setAttribute('milliseconds', milliseconds); }
      return this.getTime();
    },
    setSeconds: function (seconds, milliseconds) {
      this.setAttribute('seconds', seconds);
      if (milliseconds !== undefined) { this.setAttribute('milliseconds', milliseconds); }
      return this.getTime();
    },
    setMilliseconds: function (milliseconds) {
      this.setAttribute('milliseconds', milliseconds);
      return this.getTime();
    },
    setTime: function (n) {
      if (isNaN(n)) { throw new Error('Units must be a number.'); }
      this.setFromTimeProxy(n, this.timezone);
      return this.getTime();
    },
    setUTCFullYear: function (year, month, date) {
      if (date !== undefined) { this.setUTCAttribute('date', 1); }
      this.setUTCAttribute('year', year);
      if (month !== undefined) { this.setUTCAttribute('month', month); }
      if (date !== undefined) { this.setUTCAttribute('date', date); }
      return this.getTime();
    },
    setUTCMonth: function (month, date) {
      this.setUTCAttribute('month', month);
      if (date !== undefined) { this.setUTCAttribute('date', date); }
      return this.getTime();
    },
    setUTCDate: function (date) {
      this.setUTCAttribute('date', date);
      return this.getTime();
    },
    setUTCHours: function (hours, minutes, seconds, milliseconds) {
      this.setUTCAttribute('hours', hours);
      if (minutes !== undefined) { this.setUTCAttribute('minutes', minutes); }
      if (seconds !== undefined) { this.setUTCAttribute('seconds', seconds); }
      if (milliseconds !== undefined) { this.setUTCAttribute('milliseconds', milliseconds); }
      return this.getTime();
    },
    setUTCMinutes: function (minutes, seconds, milliseconds) {
      this.setUTCAttribute('minutes', minutes);
      if (seconds !== undefined) { this.setUTCAttribute('seconds', seconds); }
      if (milliseconds !== undefined) { this.setUTCAttribute('milliseconds', milliseconds); }
      return this.getTime();
    },
    setUTCSeconds: function (seconds, milliseconds) {
      this.setUTCAttribute('seconds', seconds);
      if (milliseconds !== undefined) { this.setUTCAttribute('milliseconds', milliseconds); }
      return this.getTime();
    },
    setUTCMilliseconds: function (milliseconds) {
      this.setUTCAttribute('milliseconds', milliseconds);
      return this.getTime();
    },
    setFromDateObjProxy: function (dt) {
      this.year = dt.getFullYear();
      this.month = dt.getMonth();
      this.date = dt.getDate();
      this.hours = dt.getHours();
      this.minutes = dt.getMinutes();
      this.seconds = dt.getSeconds();
      this.milliseconds = dt.getMilliseconds();
      this._day = dt.getDay();
      this._dateProxy = dt;
      this._timeProxy = Date.UTC(this.year, this.month, this.date, this.hours, this.minutes, this.seconds, this.milliseconds);
      this._useCache = false;
    },
    setFromTimeProxy: function (utcMillis, tz) {
      var dt = new Date(utcMillis);
      var tzOffset = tz ? timezoneJS.timezone.getTzInfo(utcMillis, tz, true).tzOffset : dt.getTimezoneOffset();
      dt.setTime(utcMillis + (dt.getTimezoneOffset() - tzOffset) * 60000);
      this.setFromDateObjProxy(dt);
    },
    setAttribute: function (unit, n) {
      if (isNaN(n)) { throw new Error('Units must be a number.'); }
      var dt = this._dateProxy;
      var meth = unit === 'year' ? 'FullYear' : unit.substr(0, 1).toUpperCase() + unit.substr(1);
      dt['set' + meth](n);
      this.setFromDateObjProxy(dt);
    },
    setUTCAttribute: function (unit, n) {
      if (isNaN(n)) { throw new Error('Units must be a number.'); }
      var meth = unit === 'year' ? 'FullYear' : unit.substr(0, 1).toUpperCase() + unit.substr(1);
      var dt = this.getUTCDateProxy();
      dt['setUTC' + meth](n);
      dt.setUTCMinutes(dt.getUTCMinutes() - this.getTimezoneOffset());
      this.setFromTimeProxy(dt.getTime() + this.getTimezoneOffset() * 60000, this.timezone);
    },
    setTimezone: function (tz) {
      var previousOffset = this.getTimezoneInfo().tzOffset;
      this.timezone = tz;
      this._useCache = false;
      // Set UTC minutes offsets by the delta of the two timezones
      this.setUTCMinutes(this.getUTCMinutes() - this.getTimezoneInfo().tzOffset + previousOffset);
    },
    removeTimezone: function () {
      this.timezone = null;
      this._useCache = false;
    },
    valueOf: function () { return this.getTime(); },
    clone: function () {
      return this.timezone ? new timezoneJS.Date(this.getTime(), this.timezone) : new timezoneJS.Date(this.getTime());
    },
    toGMTString: function () { return this.toString('EEE, dd MMM yyyy HH:mm:ss Z', 'Etc/GMT'); },
    toLocaleString: function () {},
    toLocaleDateString: function () {},
    toLocaleTimeString: function () {},
    toSource: function () {},
    toISOString: function () { return this.toString('yyyy-MM-ddTHH:mm:ss.SSS', 'Etc/UTC') + 'Z'; },
    toJSON: function () { return this.toISOString(); },
    toDateString: function () { return this.toString('EEE MMM dd yyyy'); },
    toTimeString: function () { return this.toString('H:mm k'); },
    // Allows different format following ISO8601 format:
    toString: function (format, tz) {
      if (!format) format = 'yyyy-MM-ddTHH:mm:ss.SSS';
      var result = format;
      var tzInfo = tz ? timezoneJS.timezone.getTzInfo(this.getTime(), tz) : this.getTimezoneInfo();
      var _this = this;
      if (tz) {
        _this = this.clone();
        _this.setTimezone(tz);
      }
      var hours = _this.getHours();
      return result
      // fix the same characters in Month names
      .replace(/a+/g, function () { return 'k'; })
      // `y`: year
      .replace(/y+/g, function (token) { return _fixWidth(_this.getFullYear(), token.length); })
      // `d`: date
      .replace(/d+/g, function (token) { return _fixWidth(_this.getDate(), token.length); })
      // `m`: minute
      .replace(/m+/g, function (token) { return _fixWidth(_this.getMinutes(), token.length); })
      // `s`: second
      .replace(/s+/g, function (token) { return _fixWidth(_this.getSeconds(), token.length); })
      // `S`: millisecond
      .replace(/S+/g, function (token) { return _fixWidth(_this.getMilliseconds(), token.length); })
      // 'h': 12 hour format
      .replace(/h+/g, function (token) { return _fixWidth( ((hours%12) === 0) ? 12 : (hours % 12), token.length); })
      // `M`: month. Note: `MM` will be the numeric representation (e.g February is 02) but `MMM` will be text representation (e.g February is Feb)
      .replace(/M+/g, function (token) {
        var _month = _this.getMonth(),
        _len = token.length;
        if (_len > 3) {
          return timezoneJS.Months[_month];
        } else if (_len > 2) {
          return timezoneJS.Months[_month].substring(0, _len);
        }
        return _fixWidth(_month + 1, _len);
      })
      // `k`: AM/PM
      .replace(/k+/g, function () {
        if (hours >= 12) {
          if (hours > 12) {
            hours -= 12;
          }
          return 'PM';
        }
        return 'AM';
      })
      // `H`: hour
      .replace(/H+/g, function (token) { return _fixWidth(hours, token.length); })
      // `E`: day
      .replace(/E+/g, function (token) { return DAYS[_this.getDay()].substring(0, token.length); })
      // `Z`: timezone abbreviation
      .replace(/Z+/gi, function () { return tzInfo.tzAbbr; });
    },
    toUTCString: function () { return this.toGMTString(); },
    civilToJulianDayNumber: function (y, m, d) {
      var a;
      // Adjust for zero-based JS-style array
      m++;
      if (m > 12) {
        a = parseInt(m/12, 10);
        m = m % 12;
        y += a;
      }
      if (m <= 2) {
        y -= 1;
        m += 12;
      }
      a = Math.floor(y / 100);
      var b = 2 - a + Math.floor(a / 4)
        , jDt = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + b - 1524;
      return jDt;
    },
    getLocalOffset: function () {
      return this._dateProxy.getTimezoneOffset();
    }
  };


  timezoneJS.timezone = new function () {
    var _this = this
      , regionMap = {'Etc':'etcetera','EST':'northamerica','MST':'northamerica','HST':'northamerica','EST5EDT':'northamerica','CST6CDT':'northamerica','MST7MDT':'northamerica','PST8PDT':'northamerica','America':['northamerica','southamerica'],'Pacific':'australasia','Atlantic':'europe','Africa':'africa','Indian':'africa','Antarctica':'antarctica','Asia':'asia','Australia':'australasia','Europe':'europe','WET':'europe','CET':'europe','MET':'europe','EET':'europe'}
      , regionExceptions = {'Pacific/Honolulu':'northamerica','Atlantic/Bermuda':'northamerica','Atlantic/Cape_Verde':'africa','Atlantic/St_Helena':'africa','Indian/Kerguelen':'antarctica','Indian/Chagos':'asia','Indian/Maldives':'asia','Indian/Christmas':'australasia','Indian/Cocos':'australasia','America/Danmarkshavn':'europe','America/Scoresbysund':'europe','America/Godthab':'europe','America/Thule':'europe','Asia/Istanbul':'europe','Asia/Yekaterinburg':'europe','Asia/Omsk':'europe','Asia/Novosibirsk':'europe','Asia/Krasnoyarsk':'europe','Asia/Irkutsk':'europe','Asia/Yakutsk':'europe','Asia/Vladivostok':'europe','Asia/Sakhalin':'europe','Asia/Magadan':'europe','Asia/Kamchatka':'europe','Asia/Anadyr':'europe','Africa/Ceuta':'europe','GMT':'etcetera','Europe/Nicosia':'asia'};
    function invalidTZError(t) { throw new Error('Timezone \'' + t + '\' is either incorrect, or not loaded in the timezone registry.'); }
    function builtInLoadZoneFile(fileName, opts) {
      var url = _this.zoneFileBasePath + '/' + fileName;
      return !opts || !opts.async
      ? _this.parseZones(_this.transport({ url : url, async : false }))
      : _this.transport({
        async: true,
        url : url,
        success : function (str) {
          return _this.parseZones(str) && typeof opts.callback === 'function' && opts.callback();
        },
        error : function () {
          throw new Error('Error retrieving \'' + url + '\' zoneinfo files');
        }
      });
    }
    function getRegionForTimezone(tz) {
      var exc = regionExceptions[tz]
        , reg
        , ret;
      if (exc) return exc;
      reg = tz.split('/')[0];
      ret = regionMap[reg];
      if (ret) return ret;
      var link = _this.zones[tz];
      if (typeof link === 'string') {
        return getRegionForTimezone(link);
      }
      if (!_this.loadedZones.backward) {
        _this.loadZoneFile('backward');
        return getRegionForTimezone(tz);
      }
      invalidTZError(tz);
    }
    function parseTimeString(str) {
      var pat = /(\d+)(?::0*(\d*))?(?::0*(\d*))?([wsugz])?$/;
      var hms = str.match(pat);
      hms[1] = parseInt(hms[1], 10);
      hms[2] = hms[2] ? parseInt(hms[2], 10) : 0;
      hms[3] = hms[3] ? parseInt(hms[3], 10) : 0;
      return hms.slice(1, 5);
    }
    function processZone(z) {
      if (!z[3]) { return; }
      var yea = parseInt(z[3], 10)
        , mon = 11
        , dat = 31;
      if (z[4]) {
        mon = SHORT_MONTHS[z[4].substr(0, 3)];
        dat = parseInt(z[5], 10) || 1;
      }
      var t = z[6] ? parseTimeString(z[6]) : [0, 0, 0];
      return [yea, mon, dat, t[0], t[1], t[2]];
    }
    function getZone(dt, tz) {
      var utcMillis = typeof dt === 'number' ? dt : new Date(dt).getTime();
      var t = tz;
      var zoneList = _this.zones[t];
      while (typeof zoneList === 'string') {
        t = zoneList;
        zoneList = _this.zones[t];
      }
      if (!zoneList) {
        if (!_this.loadedZones.backward) {
          _this.loadZoneFile('backward');
          return getZone(dt, tz);
        } else if (t && t !== tz) {
          _this.lazyLoadZoneFiles(t);
          return getZone(dt, t);
        }
        invalidTZError(t);
      }
      if (zoneList.length === 0) {
        throw new Error('No Zone found for \'' + tz + '\' on ' + dt);
      }
      for (var i = zoneList.length - 1; i >= 0; i--) {
        var z = zoneList[i];
        if (z[3] && utcMillis > z[3]) break;
      }
      return zoneList[i+1];
    }
    function getBasicOffset(time) {
      var off = parseTimeString(time)
        , adj = time.charAt(0) === '-' ? -1 : 1;
      off = adj * (((off[0] * 60 + off[1]) * 60 + off[2]) * 1000);
      return off/60/1000;
    }
    function getAdjustedOffset(off, min) {
      return -Math.ceil(min - off);
    }
    function getRule(dt, zone, isUTC) {
      var date = typeof dt === 'number' ? new Date(dt) : dt;
      var ruleset = zone[1];
      var basicOffset = zone[0];
      var staticDstMatch = ruleset.match(/^([0-9]):([0-9][0-9])$/);
      if (staticDstMatch) {
        return [-1000000, 'max', '-', 'Jan', 1, [0, 0, 0], parseInt(staticDstMatch[1],10) * 60 + parseInt(staticDstMatch[2], 10), '-'];
      }
      var convertDateToUTC = function (date, type, rule) {
        var offset = 0;

        if (type === 'u' || type === 'g' || type === 'z') { // UTC
          offset = 0;
        } else if (type === 's') { // Standard Time
          offset = basicOffset;
        } else if (type === 'w' || !type) { // Wall Clock Time
          offset = getAdjustedOffset(basicOffset, rule[6]);
        } else {
          throw new Error('unknown type ' + type);
        }
        offset *= 60 * 1000; // to millis

        return new Date(date.getTime() + offset);
      };
      var convertRuleToExactDateAndTime = function (yearAndRule, prevRule) {
        var year = yearAndRule[0]
          , rule = yearAndRule[1];
        var hms = rule[5];
        var effectiveDate;

        if (!EXACT_DATE_TIME[year])
          EXACT_DATE_TIME[year] = {};
        if (EXACT_DATE_TIME[year][rule])
          effectiveDate = EXACT_DATE_TIME[year][rule];
        else {
          if (!isNaN(rule[4])) {
            effectiveDate = new Date(Date.UTC(year, SHORT_MONTHS[rule[3]], rule[4], hms[0], hms[1], hms[2], 0));
          }
          else {
            var targetDay
              , operator;
            if (rule[4].substr(0, 4) === 'last') {
              // Start at the last day of the month and work backward.
              effectiveDate = new Date(Date.UTC(year, SHORT_MONTHS[rule[3]] + 1, 1, hms[0] - 24, hms[1], hms[2], 0));
              targetDay = SHORT_DAYS[rule[4].substr(4, 3)];
              operator = '<=';
            }
            else {
              effectiveDate = new Date(Date.UTC(year, SHORT_MONTHS[rule[3]], rule[4].substr(5), hms[0], hms[1], hms[2], 0));
              targetDay = SHORT_DAYS[rule[4].substr(0, 3)];
              operator = rule[4].substr(3, 2);
            }
            var ourDay = effectiveDate.getUTCDay();
            if (operator === '>=') {
              effectiveDate.setUTCDate(effectiveDate.getUTCDate() + (targetDay - ourDay + ((targetDay < ourDay) ? 7 : 0)));
            }
            else {
              effectiveDate.setUTCDate(effectiveDate.getUTCDate() + (targetDay - ourDay - ((targetDay > ourDay) ? 7 : 0)));
            }
          }
          EXACT_DATE_TIME[year][rule] = effectiveDate;
        }
        if (prevRule) {
          effectiveDate = convertDateToUTC(effectiveDate, hms[3], prevRule);
        }
        return effectiveDate;
      };

      var findApplicableRules = function (year, ruleset) {
        var applicableRules = [];
        for (var i = 0; ruleset && i < ruleset.length; i++) {
          //Exclude future rules.
          if (ruleset[i][0] <= year &&
              (
                ruleset[i][1] >= year ||
                  (ruleset[i][0] === year && ruleset[i][1] === 'only') ||
                    ruleset[i][1] === 'max'
          )
             ) {
               applicableRules.push([year, ruleset[i]]);
             }
        }
        return applicableRules;
      };

      var compareDates = function (a, b, prev) {
        var year, rule;
        if (!(a instanceof Date)) {
          year = a[0];
          rule = a[1];
          a = (!prev && EXACT_DATE_TIME[year] && EXACT_DATE_TIME[year][rule])
            ? EXACT_DATE_TIME[year][rule]
            : convertRuleToExactDateAndTime(a, prev);
        } else if (prev) {
          a = convertDateToUTC(a, isUTC ? 'u' : 'w', prev);
        }
        if (!(b instanceof Date)) {
          year = b[0];
          rule = b[1];
          b = (!prev && EXACT_DATE_TIME[year] && EXACT_DATE_TIME[year][rule]) ? EXACT_DATE_TIME[year][rule]
            : convertRuleToExactDateAndTime(b, prev);
        } else if (prev) {
          b = convertDateToUTC(b, isUTC ? 'u' : 'w', prev);
        }
        a = Number(a);
        b = Number(b);
        return a - b;
      };

      var year = date.getUTCFullYear();
      var applicableRules;

      applicableRules = findApplicableRules(year, _this.rules[ruleset]);
      applicableRules.push(date);
      applicableRules.sort(compareDates);
      if (_arrIndexOf.call(applicableRules, date) < 2) {
        applicableRules = applicableRules.concat(findApplicableRules(year-1, _this.rules[ruleset]));
        applicableRules.sort(compareDates);
      }
      var pinpoint = _arrIndexOf.call(applicableRules, date);
      if (pinpoint > 1 && compareDates(date, applicableRules[pinpoint-1], applicableRules[pinpoint-2][1]) < 0) {
        //The previous rule does not really apply, take the one before that.
        return applicableRules[pinpoint - 2][1];
      } else if (pinpoint > 0 && pinpoint < applicableRules.length - 1 && compareDates(date, applicableRules[pinpoint+1], applicableRules[pinpoint-1][1]) > 0) {
        return applicableRules[pinpoint + 1][1];
      } else if (pinpoint === 0) {
        return null;
      }
      return applicableRules[pinpoint - 1][1];
    }
    function getAbbreviation(zone, rule) {
      var base = zone[2];
      if (base.indexOf('%s') > -1) {
        var repl;
        if (rule) {
          repl = rule[7] === '-' ? '' : rule[7];
        }
        else {
          repl = 'S';
        }
        return base.replace('%s', repl);
      } else if (base.indexOf('/') > -1) {
        return base.split('/', 2)[rule ? (rule[6] ? 1 : 0) : 0];
      }
      return base;
    }

    this.zoneFileBasePath = null;
    this.zoneFiles = ['africa', 'antarctica', 'asia', 'australasia', 'backward', 'etcetera', 'europe', 'northamerica', 'pacificnew', 'southamerica'];
    this.loadingSchemes = {
      PRELOAD_ALL: 'preloadAll',
      LAZY_LOAD: 'lazyLoad',
      MANUAL_LOAD: 'manualLoad'
    };
    this.getRegionForTimezone = getRegionForTimezone;
    this.loadingScheme = this.loadingSchemes.LAZY_LOAD;
    this.loadedZones = {};
    this.zones = {};
    this.rules = {};

    this.init = function (o) {
      var opts = { async: true }
        , def = this.loadingScheme === this.loadingSchemes.PRELOAD_ALL
          ? this.zoneFiles
          : (this.defaultZoneFile || 'northamerica');
      for (var p in o) {
        opts[p] = o[p];
      }
      return this.loadZoneFiles(def, opts);
    };
    this.loadZoneFiles = function(fileNames, opts) {
      var callbackFn
        , done = 0;
      if (typeof fileNames === 'string') {
        return this.loadZoneFile(fileNames, opts);
      }
      opts = opts || {};
      callbackFn = opts.callback;
      opts.callback = function () {
        done++;
        (done === fileNames.length) && typeof callbackFn === 'function' && callbackFn();
      };
      for (var i = 0; i < fileNames.length; i++) {
        this.loadZoneFile(fileNames[i], opts);
      }
    };
    this.loadZoneFile = function (fileName, opts) {
      if (typeof this.zoneFileBasePath === 'undefined') {
        throw new Error('Please define a base path to your zone file directory -- timezoneJS.timezone.zoneFileBasePath.');
      }
      if (this.loadedZones[fileName]) {
        return;
      }
      this.loadedZones[fileName] = true;
      return builtInLoadZoneFile(fileName, opts);
    };
    this.loadZoneJSONData = function (url, sync) {
      var processData = function (data) {
        data = eval('('+ data +')');
        for (var z in data.zones) {
          _this.zones[z] = data.zones[z];
        }
        for (var r in data.rules) {
          _this.rules[r] = data.rules[r];
        }
      };
      return sync
      ? processData(_this.transport({ url : url, async : false }))
      : _this.transport({ url : url, success : processData });
    };
    this.loadZoneDataFromObject = function (data) {
      if (!data) { return; }
      for (var z in data.zones) {
        _this.zones[z] = data.zones[z];
      }
      for (var r in data.rules) {
        _this.rules[r] = data.rules[r];
      }
    };
    this.getAllZones = function () {
      var arr = [];
      for (var z in this.zones) { arr.push(z); }
      return arr.sort();
    };
    this.parseZones = function (str) {

      if (!str) {
        return false;
      }

      var lines = str.split('\n')
        , arr = []
        , chunk = ''
        , l
        , zone = null
        , rule = null;
      for (var i = 0; i < lines.length; i++) {
        l = lines[i];
        if (l.match(/^\s/)) {
          l = 'Zone ' + zone + l;
        }
        l = l.split('#')[0];
        if (l.length > 3) {
          arr = l.split(/\s+/);
          chunk = arr.shift();
          //Ignore Leap.
          switch (chunk) {
            case 'Zone':
              zone = arr.shift();
              if (!_this.zones[zone]) {
                _this.zones[zone] = [];
              }
              if (arr.length < 3) break;
              //Process zone right here and replace 3rd element with the processed array.
              arr.splice(3, arr.length, processZone(arr));
              if (arr[3]) arr[3] = Date.UTC.apply(null, arr[3]);
              arr[0] = -getBasicOffset(arr[0]);
              _this.zones[zone].push(arr);
              break;
            case 'Rule':
              rule = arr.shift();
              if (!_this.rules[rule]) {
                _this.rules[rule] = [];
              }
              //Parse int FROM year and TO year
              arr[0] = parseInt(arr[0], 10);
              arr[1] = parseInt(arr[1], 10) || arr[1];
              //Parse time string AT
              arr[5] = parseTimeString(arr[5]);
              //Parse offset SAVE
              arr[6] = getBasicOffset(arr[6]);
              _this.rules[rule].push(arr);
              break;
            case 'Link':
              if (_this.zones[arr[1]]) {
                throw new Error('Error with Link ' + arr[1] + '. Cannot create link of a preexisted zone.');
              }
              if (isNaN(arr[0])) {
                _this.zones[arr[1]] = arr[0];
              }
              else {
                _this.zones[arr[1]] = parseInt(arr[0], 10);
              }
              break;
          }
        }
      }
      return true;
    };
    this.transport = _transport;
    this.getTzInfo = function (dt, tz, isUTC) {
      this.lazyLoadZoneFiles(tz);
      var z = getZone(dt, tz);
      var off = +z[0];
      var rule = getRule(dt, z, isUTC);
      if (rule) {
        off = getAdjustedOffset(off, rule[6]);
      }
      var abbr = getAbbreviation(z, rule);
      return { tzOffset: off, tzAbbr: abbr };
    };
    this.lazyLoadZoneFiles = function(tz) {
      if (this.loadingScheme === this.loadingSchemes.LAZY_LOAD) {
        //Get the correct region for the zone.
        var zoneFile = getRegionForTimezone(tz);
        if (!zoneFile) {
          throw new Error('Not a valid timezone ID.');
        }
        this.loadZoneFiles(zoneFile);
      }
    };
  }();
}).call(typeof window !== "undefined" ? window : this);



class CocaPlus extends Coco {
	

	   constructor(){
		   super();
		   
		   this.timer = Object({
			   
			   _date :  null , 
			   
			   now  : {
				   
				     interval  : Date.now(),
					 
					 date    :  new Date(),
					 
					 toIso     :  ()=>{ return  this.timer.now.date.toISOString(); },
					 
					 toString  :  () => { return  this.timer.now.date ; }
					 
			   } ,
			   
			   timeZone : {
				   
					offset :  ()=> { return this.timer.now.date.getTimezoneOffset(); } 
				   
			   },
			   
			   
			   date : {
				      
					  create : ($parse) => {
						  try{
						    this.timer._date = new Date($parse);
							
							if(this.timer._date == 'Invalid Date'){
								this._error_control( "DATE" , 'INVALID DATE ');
							}
						  }catch(e){
							  this._error_control( "DATE" , e);
						  }
						  
						  return this;
					  },
					  
					  get : () => {
						  if(this.timer._date !== null )
							  return this.timer._date;
						  
						   this._error_control( "DATE" ,'DATE NOT INSTANCE ... first try date.create() ');
						   return this;
					  }
					  
			   },
			   
			   parseISO8601 : (dateString) =>  {
							var timebits = /^([0-9]{4})-([0-9]{2})-([0-9]{2})T([0-9]{2}):([0-9]{2})(?::([0-9]*)(\.[0-9]*)?)?(?:([+-])([0-9]{2})([0-9]{2}))?/;
							var m = timebits.exec(dateString);
							var resultDate;
						if (m) {
								var utcdate = Date.UTC(parseInt(m[1]),
									parseInt(m[2])-1, // months are zero-offset (!)
									parseInt(m[3]),
									parseInt(m[4]), parseInt(m[5]), // hh:mm
									(m[6] && parseInt(m[6]) || 0),  // optional seconds
									(m[7] && parseFloat(m[7])*1000) || 0); // optional fraction
									// utcdate is milliseconds since the epoch
									if (m[9] && m[10]) {
										var offsetMinutes = parseInt(m[9]) * 60 + parseInt(m[10]);
										utcdate += (m[8] === '+' ? -1 : +1) * offsetMinutes * 60000;
						}
							resultDate = new Date(utcdate);
						} else {
								resultDate = null;
						}
							return resultDate;
			    }
				
				
		   });
		   
		   this.timeZone = timezoneJS;
	   }
	   
	   CocaTime ($time = false ) { 
			switch($time){
				case true :
					return this.timer;
				case false:
					return this.timezone ;
			}
	   }
	   
	   
	   
	   BinHeap ($array = Array()){
		   
		   this.__heap = new BinaryHeap(function(x){return x;});
		   
		   for( let i in $array ){
			   this._heap.push($array[i]);
		   }
		   
		   return this.__heap;
	   }
	   
	   
	   
	   
	   
	
}

