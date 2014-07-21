(function(){

if (!window.qx) window.qx = {};

qx.$$start = new Date();

if (!qx.$$environment) qx.$$environment = {};
var envinfo = {"qx.allowUrlSettings":true,"qx.application":"testrunner.TestLoaderMobile","qx.debug":false,"qx.globalErrorHandling":true,"qx.optimization.basecalls":true,"qx.optimization.privates":true,"qx.optimization.strings":true,"qx.optimization.variables":true,"qx.optimization.variants":true,"qx.optimization.whitespace":true,"qx.revision":"","qx.theme":"","qx.version":"3.0.1","testrunner.testParts":false};
for (var k in envinfo) qx.$$environment[k] = envinfo[k];

if (!qx.$$libraries) qx.$$libraries = {};
var libinfo = {"__out__":{"sourceUri":"../script"},"qx":{"resourceUri":"../resource","sourceUri":"../script","sourceViewUri":"https://github.com/qooxdoo/qooxdoo/blob/%{qxGitBranch}/framework/source/class/%{classFilePath}#L%{lineNumber}"},"testrunner":{"resourceUri":"../resource","sourceUri":"../script"},"unittesting":{"resourceUri":"../resource","sourceUri":"../script"}};
for (var k in libinfo) qx.$$libraries[k] = libinfo[k];

qx.$$resources = {};
qx.$$translations = {"C":null,"en":null};
qx.$$locales = {"C":null,"en":null};
qx.$$packageData = {};
qx.$$g = {}

qx.$$loader = {
  parts : {"boot":[0]},
  packages : {"0":{"uris":["__out__:tests.d7141238c332.js"]}},
  urisBefore : [],
  cssBefore : [],
  boot : "boot",
  closureParts : {},
  bootIsInline : true,
  addNoCacheParam : true,

  decodeUris : function(compressedUris)
  {
    var libs = qx.$$libraries;
    var uris = [];
    for (var i=0; i<compressedUris.length; i++)
    {
      var uri = compressedUris[i].split(":");
      var euri;
      if (uri.length==2 && uri[0] in libs) {
        var prefix = libs[uri[0]].sourceUri;
        euri = prefix + "/" + uri[1];
      } else {
        euri = compressedUris[i];
      }
      if (qx.$$loader.addNoCacheParam) {
        euri += "?nocache=" + Math.random();
      }
      
      uris.push(euri);
    }
    return uris;
  }
};

var readyStateValue = {"complete" : true};
if (document.documentMode && document.documentMode < 10 ||
    (typeof window.ActiveXObject !== "undefined" && !document.documentMode)) {
  readyStateValue["loaded"] = true;
}

function loadScript(uri, callback) {
  var elem = document.createElement("script");
  elem.charset = "utf-8";
  elem.src = uri;
  elem.onreadystatechange = elem.onload = function() {
    if (!this.readyState || readyStateValue[this.readyState]) {
      elem.onreadystatechange = elem.onload = null;
      if (typeof callback === "function") {
        callback();
      }
    }
  };

  if (isLoadParallel) {
    elem.async = null;
  }

  var head = document.getElementsByTagName("head")[0];
  head.appendChild(elem);
}

function loadCss(uri) {
  var elem = document.createElement("link");
  elem.rel = "stylesheet";
  elem.type= "text/css";
  elem.href= uri;
  var head = document.getElementsByTagName("head")[0];
  head.appendChild(elem);
}

var isWebkit = /AppleWebKit\/([^ ]+)/.test(navigator.userAgent);
var isLoadParallel = 'async' in document.createElement('script');

function loadScriptList(list, callback) {
  if (list.length == 0) {
    callback();
    return;
  }

  var item;

  if (isLoadParallel) {
    while (list.length) {
      item = list.shift();
      if (list.length) {
        loadScript(item);
      } else {
        loadScript(item, callback);
      }
    }
  } else {
    item = list.shift();
    loadScript(item,  function() {
      if (isWebkit) {
        // force async, else Safari fails with a "maximum recursion depth exceeded"
        window.setTimeout(function() {
          loadScriptList(list, callback);
        }, 0);
      } else {
        loadScriptList(list, callback);
      }
    });
  }
}

var fireContentLoadedEvent = function() {
  qx.$$domReady = true;
  document.removeEventListener('DOMContentLoaded', fireContentLoadedEvent, false);
};
if (document.addEventListener) {
  document.addEventListener('DOMContentLoaded', fireContentLoadedEvent, false);
}

qx.$$loader.importPackageData = function (dataMap, callback) {
  if (dataMap["resources"]){
    var resMap = dataMap["resources"];
    for (var k in resMap) qx.$$resources[k] = resMap[k];
  }
  if (dataMap["locales"]){
    var locMap = dataMap["locales"];
    var qxlocs = qx.$$locales;
    for (var lang in locMap){
      if (!qxlocs[lang]) qxlocs[lang] = locMap[lang];
      else
        for (var k in locMap[lang]) qxlocs[lang][k] = locMap[lang][k];
    }
  }
  if (dataMap["translations"]){
    var trMap   = dataMap["translations"];
    var qxtrans = qx.$$translations;
    for (var lang in trMap){
      if (!qxtrans[lang]) qxtrans[lang] = trMap[lang];
      else
        for (var k in trMap[lang]) qxtrans[lang][k] = trMap[lang][k];
    }
  }
  if (callback){
    callback(dataMap);
  }
}

qx.$$loader.signalStartup = function ()
{
  qx.$$loader.scriptLoaded = true;
  if (window.qx && qx.event && qx.event.handler && qx.event.handler.Application) {
    qx.event.handler.Application.onScriptLoaded();
    qx.$$loader.applicationHandlerReady = true;
  } else {
    qx.$$loader.applicationHandlerReady = false;
  }
}

// Load all stuff
qx.$$loader.init = function(){
  var l=qx.$$loader;
  if (l.cssBefore.length>0) {
    for (var i=0, m=l.cssBefore.length; i<m; i++) {
      loadCss(l.cssBefore[i]);
    }
  }
  if (l.urisBefore.length>0){
    loadScriptList(l.urisBefore, function(){
      l.initUris();
    });
  } else {
    l.initUris();
  }
}

// Load qooxdoo boot stuff
qx.$$loader.initUris = function(){
  var l=qx.$$loader;
  var bootPackageHash=l.parts[l.boot][0];
  if (l.bootIsInline){
    l.importPackageData(qx.$$packageData[bootPackageHash]);
    l.signalStartup();
  } else {
    loadScriptList(l.decodeUris(l.packages[l.parts[l.boot][0]].uris), function(){
      // Opera needs this extra time to parse the scripts
      window.setTimeout(function(){
        l.importPackageData(qx.$$packageData[bootPackageHash] || {});
        l.signalStartup();
      }, 0);
    });
  }
}
})();

qx.$$packageData['0']={"locales":{"C":{"alternateQuotationEnd":"’","alternateQuotationStart":"‘","cldr_am":"AM","cldr_date_format_full":"EEEE, MMMM d, y","cldr_date_format_long":"MMMM d, y","cldr_date_format_medium":"MMM d, y","cldr_date_format_short":"M/d/yy","cldr_date_time_format_EHm":"E HH:mm","cldr_date_time_format_EHms":"E HH:mm:ss","cldr_date_time_format_Ed":"d E","cldr_date_time_format_Ehm":"E h:mm a","cldr_date_time_format_Ehms":"E h:mm:ss a","cldr_date_time_format_Gy":"y G","cldr_date_time_format_GyMMM":"MMM y G","cldr_date_time_format_GyMMMEd":"E, MMM d, y G","cldr_date_time_format_GyMMMd":"MMM d, y G","cldr_date_time_format_H":"HH","cldr_date_time_format_Hm":"HH:mm","cldr_date_time_format_Hms":"HH:mm:ss","cldr_date_time_format_M":"L","cldr_date_time_format_MEd":"E, M/d","cldr_date_time_format_MMM":"LLL","cldr_date_time_format_MMMEd":"E, MMM d","cldr_date_time_format_MMMd":"MMM d","cldr_date_time_format_Md":"M/d","cldr_date_time_format_d":"d","cldr_date_time_format_h":"h a","cldr_date_time_format_hm":"h:mm a","cldr_date_time_format_hms":"h:mm:ss a","cldr_date_time_format_ms":"mm:ss","cldr_date_time_format_y":"y","cldr_date_time_format_yM":"M/y","cldr_date_time_format_yMEd":"E, M/d/y","cldr_date_time_format_yMMM":"MMM y","cldr_date_time_format_yMMMEd":"E, MMM d, y","cldr_date_time_format_yMMMd":"MMM d, y","cldr_date_time_format_yMd":"M/d/y","cldr_date_time_format_yQQQ":"QQQ y","cldr_date_time_format_yQQQQ":"QQQQ y","cldr_day_format_abbreviated_fri":"Fri","cldr_day_format_abbreviated_mon":"Mon","cldr_day_format_abbreviated_sat":"Sat","cldr_day_format_abbreviated_sun":"Sun","cldr_day_format_abbreviated_thu":"Thu","cldr_day_format_abbreviated_tue":"Tue","cldr_day_format_abbreviated_wed":"Wed","cldr_day_format_short_fri":"Fr","cldr_day_format_short_mon":"Mo","cldr_day_format_short_sat":"Sa","cldr_day_format_short_sun":"Su","cldr_day_format_short_thu":"Th","cldr_day_format_short_tue":"Tu","cldr_day_format_short_wed":"We","cldr_day_format_wide_fri":"Friday","cldr_day_format_wide_mon":"Monday","cldr_day_format_wide_sat":"Saturday","cldr_day_format_wide_sun":"Sunday","cldr_day_format_wide_thu":"Thursday","cldr_day_format_wide_tue":"Tuesday","cldr_day_format_wide_wed":"Wednesday","cldr_day_stand-alone_narrow_fri":"F","cldr_day_stand-alone_narrow_mon":"M","cldr_day_stand-alone_narrow_sat":"S","cldr_day_stand-alone_narrow_sun":"S","cldr_day_stand-alone_narrow_thu":"T","cldr_day_stand-alone_narrow_tue":"T","cldr_day_stand-alone_narrow_wed":"W","cldr_month_format_abbreviated_1":"Jan","cldr_month_format_abbreviated_10":"Oct","cldr_month_format_abbreviated_11":"Nov","cldr_month_format_abbreviated_12":"Dec","cldr_month_format_abbreviated_2":"Feb","cldr_month_format_abbreviated_3":"Mar","cldr_month_format_abbreviated_4":"Apr","cldr_month_format_abbreviated_5":"May","cldr_month_format_abbreviated_6":"Jun","cldr_month_format_abbreviated_7":"Jul","cldr_month_format_abbreviated_8":"Aug","cldr_month_format_abbreviated_9":"Sep","cldr_month_format_wide_1":"January","cldr_month_format_wide_10":"October","cldr_month_format_wide_11":"November","cldr_month_format_wide_12":"December","cldr_month_format_wide_2":"February","cldr_month_format_wide_3":"March","cldr_month_format_wide_4":"April","cldr_month_format_wide_5":"May","cldr_month_format_wide_6":"June","cldr_month_format_wide_7":"July","cldr_month_format_wide_8":"August","cldr_month_format_wide_9":"September","cldr_month_stand-alone_narrow_1":"J","cldr_month_stand-alone_narrow_10":"O","cldr_month_stand-alone_narrow_11":"N","cldr_month_stand-alone_narrow_12":"D","cldr_month_stand-alone_narrow_2":"F","cldr_month_stand-alone_narrow_3":"M","cldr_month_stand-alone_narrow_4":"A","cldr_month_stand-alone_narrow_5":"M","cldr_month_stand-alone_narrow_6":"J","cldr_month_stand-alone_narrow_7":"J","cldr_month_stand-alone_narrow_8":"A","cldr_month_stand-alone_narrow_9":"S","cldr_number_decimal_separator":".","cldr_number_group_separator":",","cldr_number_percent_format":"#,##0%","cldr_pm":"PM","cldr_time_format_full":"h:mm:ss a zzzz","cldr_time_format_long":"h:mm:ss a z","cldr_time_format_medium":"h:mm:ss a","cldr_time_format_short":"h:mm a","quotationEnd":"”","quotationStart":"“"},"en":{"alternateQuotationEnd":"’","alternateQuotationStart":"‘","cldr_am":"AM","cldr_date_format_full":"EEEE, MMMM d, y","cldr_date_format_long":"MMMM d, y","cldr_date_format_medium":"MMM d, y","cldr_date_format_short":"M/d/yy","cldr_date_time_format_EHm":"E HH:mm","cldr_date_time_format_EHms":"E HH:mm:ss","cldr_date_time_format_Ed":"d E","cldr_date_time_format_Ehm":"E h:mm a","cldr_date_time_format_Ehms":"E h:mm:ss a","cldr_date_time_format_Gy":"y G","cldr_date_time_format_GyMMM":"MMM y G","cldr_date_time_format_GyMMMEd":"E, MMM d, y G","cldr_date_time_format_GyMMMd":"MMM d, y G","cldr_date_time_format_H":"HH","cldr_date_time_format_Hm":"HH:mm","cldr_date_time_format_Hms":"HH:mm:ss","cldr_date_time_format_M":"L","cldr_date_time_format_MEd":"E, M/d","cldr_date_time_format_MMM":"LLL","cldr_date_time_format_MMMEd":"E, MMM d","cldr_date_time_format_MMMd":"MMM d","cldr_date_time_format_Md":"M/d","cldr_date_time_format_d":"d","cldr_date_time_format_h":"h a","cldr_date_time_format_hm":"h:mm a","cldr_date_time_format_hms":"h:mm:ss a","cldr_date_time_format_ms":"mm:ss","cldr_date_time_format_y":"y","cldr_date_time_format_yM":"M/y","cldr_date_time_format_yMEd":"E, M/d/y","cldr_date_time_format_yMMM":"MMM y","cldr_date_time_format_yMMMEd":"E, MMM d, y","cldr_date_time_format_yMMMd":"MMM d, y","cldr_date_time_format_yMd":"M/d/y","cldr_date_time_format_yQQQ":"QQQ y","cldr_date_time_format_yQQQQ":"QQQQ y","cldr_day_format_abbreviated_fri":"Fri","cldr_day_format_abbreviated_mon":"Mon","cldr_day_format_abbreviated_sat":"Sat","cldr_day_format_abbreviated_sun":"Sun","cldr_day_format_abbreviated_thu":"Thu","cldr_day_format_abbreviated_tue":"Tue","cldr_day_format_abbreviated_wed":"Wed","cldr_day_format_short_fri":"Fr","cldr_day_format_short_mon":"Mo","cldr_day_format_short_sat":"Sa","cldr_day_format_short_sun":"Su","cldr_day_format_short_thu":"Th","cldr_day_format_short_tue":"Tu","cldr_day_format_short_wed":"We","cldr_day_format_wide_fri":"Friday","cldr_day_format_wide_mon":"Monday","cldr_day_format_wide_sat":"Saturday","cldr_day_format_wide_sun":"Sunday","cldr_day_format_wide_thu":"Thursday","cldr_day_format_wide_tue":"Tuesday","cldr_day_format_wide_wed":"Wednesday","cldr_day_stand-alone_narrow_fri":"F","cldr_day_stand-alone_narrow_mon":"M","cldr_day_stand-alone_narrow_sat":"S","cldr_day_stand-alone_narrow_sun":"S","cldr_day_stand-alone_narrow_thu":"T","cldr_day_stand-alone_narrow_tue":"T","cldr_day_stand-alone_narrow_wed":"W","cldr_month_format_abbreviated_1":"Jan","cldr_month_format_abbreviated_10":"Oct","cldr_month_format_abbreviated_11":"Nov","cldr_month_format_abbreviated_12":"Dec","cldr_month_format_abbreviated_2":"Feb","cldr_month_format_abbreviated_3":"Mar","cldr_month_format_abbreviated_4":"Apr","cldr_month_format_abbreviated_5":"May","cldr_month_format_abbreviated_6":"Jun","cldr_month_format_abbreviated_7":"Jul","cldr_month_format_abbreviated_8":"Aug","cldr_month_format_abbreviated_9":"Sep","cldr_month_format_wide_1":"January","cldr_month_format_wide_10":"October","cldr_month_format_wide_11":"November","cldr_month_format_wide_12":"December","cldr_month_format_wide_2":"February","cldr_month_format_wide_3":"March","cldr_month_format_wide_4":"April","cldr_month_format_wide_5":"May","cldr_month_format_wide_6":"June","cldr_month_format_wide_7":"July","cldr_month_format_wide_8":"August","cldr_month_format_wide_9":"September","cldr_month_stand-alone_narrow_1":"J","cldr_month_stand-alone_narrow_10":"O","cldr_month_stand-alone_narrow_11":"N","cldr_month_stand-alone_narrow_12":"D","cldr_month_stand-alone_narrow_2":"F","cldr_month_stand-alone_narrow_3":"M","cldr_month_stand-alone_narrow_4":"A","cldr_month_stand-alone_narrow_5":"M","cldr_month_stand-alone_narrow_6":"J","cldr_month_stand-alone_narrow_7":"J","cldr_month_stand-alone_narrow_8":"A","cldr_month_stand-alone_narrow_9":"S","cldr_number_decimal_separator":".","cldr_number_group_separator":",","cldr_number_percent_format":"#,##0%","cldr_pm":"PM","cldr_time_format_full":"h:mm:ss a zzzz","cldr_time_format_long":"h:mm:ss a z","cldr_time_format_medium":"h:mm:ss a","cldr_time_format_short":"h:mm a","quotationEnd":"”","quotationStart":"“"}},"resources":{"qx/mobile/css/LICENSE":"qx","qx/mobile/css/android.css":"qx","qx/mobile/css/custom.css":"qx","qx/mobile/css/indigo.css":"qx","qx/mobile/css/ios.css":"qx","qx/static/blank.gif":[1,1,"gif","qx"]},"translations":{"C":{},"en":{}}};
(function(){var b=".prototype",c="function",d="Boolean",e="Error",f="Object.keys requires an object as argument.",g="constructor",h="warn",j="default",k="hasOwnProperty",m="string",n="Object",o="toLocaleString",p="error",q="toString",r="qx.debug",s="()",t="RegExp",u="String",v="info",w="BROKEN_IE",x="isPrototypeOf",y="Date",z="",A="qx.Bootstrap",B="Function",C="]",D="Class",E="Array",F="[Class ",G="valueOf",H="Number",I="debug",J="ES5",K=".",L="propertyIsEnumerable",M="object";if(!window.qx){window.qx={};}
;qx.Bootstrap={genericToString:function(){return F+this.classname+C;}
,createNamespace:function(name,N){var Q=name.split(K);var P=Q[0];var parent=this.__a&&this.__a[P]?this.__a:window;for(var i=0,O=Q.length-1;i<O;i++ ,P=Q[i]){if(!parent[P]){parent=parent[P]={};}
else {parent=parent[P];}
;}
;parent[P]=N;return P;}
,setDisplayName:function(S,R,name){S.displayName=R+K+name+s;}
,setDisplayNames:function(U,T){for(var name in U){var V=U[name];if(V instanceof Function){V.displayName=T+K+name+s;}
;}
;}
,base:function(W,X){{}
;if(arguments.length===1){return W.callee.base.call(this);}
else {return W.callee.base.apply(this,Array.prototype.slice.call(arguments,1));}
;}
,define:function(name,bj){if(!bj){var bj={statics:{}};}
;var bf;var bb=null;qx.Bootstrap.setDisplayNames(bj.statics,name);if(bj.members||bj.extend){qx.Bootstrap.setDisplayNames(bj.members,name+b);bf=bj.construct||new Function;if(bj.extend){this.extendClass(bf,bf,bj.extend,name,bd);}
;var ba=bj.statics||{};for(var i=0,bc=qx.Bootstrap.keys(ba),l=bc.length;i<l;i++ ){var Y=bc[i];bf[Y]=ba[Y];}
;bb=bf.prototype;bb.base=qx.Bootstrap.base;var bh=bj.members||{};var Y,bg;for(var i=0,bc=qx.Bootstrap.keys(bh),l=bc.length;i<l;i++ ){Y=bc[i];bg=bh[Y];if(bg instanceof Function&&bb[Y]){bg.base=bb[Y];}
;bb[Y]=bg;}
;}
else {bf=bj.statics||{};if(qx.Bootstrap.$$registry&&qx.Bootstrap.$$registry[name]){var bi=qx.Bootstrap.$$registry[name];if(this.keys(bf).length!==0){if(bj.defer){bj.defer(bf,bb);}
;for(var be in bf){bi[be]=bf[be];}
;return;}
;}
;}
;bf.$$type=D;if(!bf.hasOwnProperty(q)){bf.toString=this.genericToString;}
;var bd=name?this.createNamespace(name,bf):z;bf.name=bf.classname=name;bf.basename=bd;if(bj.defer){bj.defer(bf,bb);}
;qx.Bootstrap.$$registry[name]=bf;return bf;}
};qx.Bootstrap.define(A,{statics:{__a:null,LOADSTART:qx.$$start||new Date(),DEBUG:(function(){var bk=true;if(qx.$$environment&&qx.$$environment[r]===false){bk=false;}
;return bk;}
)(),getEnvironmentSetting:function(bl){if(qx.$$environment){return qx.$$environment[bl];}
;}
,setEnvironmentSetting:function(bm,bn){if(!qx.$$environment){qx.$$environment={};}
;if(qx.$$environment[bm]===undefined){qx.$$environment[bm]=bn;}
;}
,createNamespace:qx.Bootstrap.createNamespace,setRoot:function(bo){this.__a=bo;}
,base:qx.Bootstrap.base,define:qx.Bootstrap.define,setDisplayName:qx.Bootstrap.setDisplayName,setDisplayNames:qx.Bootstrap.setDisplayNames,genericToString:qx.Bootstrap.genericToString,extendClass:function(clazz,construct,superClass,name,basename){var superproto=superClass.prototype;var helper=new Function();helper.prototype=superproto;var proto=new helper();clazz.prototype=proto;proto.name=proto.classname=name;proto.basename=basename;construct.base=superClass;clazz.superclass=superClass;construct.self=clazz.constructor=proto.constructor=clazz;}
,getByName:function(name){return qx.Bootstrap.$$registry[name];}
,$$registry:{},objectGetLength:function(bp){return qx.Bootstrap.keys(bp).length;}
,objectMergeWith:function(br,bq,bt){if(bt===undefined){bt=true;}
;for(var bs in bq){if(bt||br[bs]===undefined){br[bs]=bq[bs];}
;}
;return br;}
,__b:[x,k,o,q,G,L,g],keys:({"ES5":Object.keys,"BROKEN_IE":function(bu){if(bu===null||(typeof bu!=M&&typeof bu!=c)){throw new TypeError(f);}
;var bv=[];var bx=Object.prototype.hasOwnProperty;for(var by in bu){if(bx.call(bu,by)){bv.push(by);}
;}
;var bw=qx.Bootstrap.__b;for(var i=0,a=bw,l=a.length;i<l;i++ ){if(bx.call(bu,a[i])){bv.push(a[i]);}
;}
;return bv;}
,"default":function(bz){if(bz===null||(typeof bz!=M&&typeof bz!=c)){throw new TypeError(f);}
;var bA=[];var bB=Object.prototype.hasOwnProperty;for(var bC in bz){if(bB.call(bz,bC)){bA.push(bC);}
;}
;return bA;}
})[typeof (Object.keys)==c?J:(function(){for(var bD in {toString:1}){return bD;}
;}
)()!==q?w:j],__c:{"[object String]":u,"[object Array]":E,"[object Object]":n,"[object RegExp]":t,"[object Number]":H,"[object Boolean]":d,"[object Date]":y,"[object Function]":B,"[object Error]":e},bind:function(bF,self,bG){var bE=Array.prototype.slice.call(arguments,2,arguments.length);return function(){var bH=Array.prototype.slice.call(arguments,0,arguments.length);return bF.apply(self,bE.concat(bH));}
;}
,firstUp:function(bI){return bI.charAt(0).toUpperCase()+bI.substr(1);}
,firstLow:function(bJ){return bJ.charAt(0).toLowerCase()+bJ.substr(1);}
,getClass:function(bL){var bK=Object.prototype.toString.call(bL);return (qx.Bootstrap.__c[bK]||bK.slice(8,-1));}
,isString:function(bM){return (bM!==null&&(typeof bM===m||qx.Bootstrap.getClass(bM)==u||bM instanceof String||(!!bM&&!!bM.$$isString)));}
,isArray:function(bN){return (bN!==null&&(bN instanceof Array||(bN&&qx.data&&qx.data.IListData&&qx.util.OOUtil.hasInterface(bN.constructor,qx.data.IListData))||qx.Bootstrap.getClass(bN)==E||(!!bN&&!!bN.$$isArray)));}
,isObject:function(bO){return (bO!==undefined&&bO!==null&&qx.Bootstrap.getClass(bO)==n);}
,isFunction:function(bP){return qx.Bootstrap.getClass(bP)==B;}
,$$logs:[],debug:function(bR,bQ){qx.Bootstrap.$$logs.push([I,arguments]);}
,info:function(bT,bS){qx.Bootstrap.$$logs.push([v,arguments]);}
,warn:function(bV,bU){qx.Bootstrap.$$logs.push([h,arguments]);}
,error:function(bX,bW){qx.Bootstrap.$$logs.push([p,arguments]);}
,trace:function(bY){}
}});}
)();
(function(){var a="qx.util.OOUtil";qx.Bootstrap.define(a,{statics:{classIsDefined:function(name){return qx.Bootstrap.getByName(name)!==undefined;}
,getPropertyDefinition:function(b,name){while(b){if(b.$$properties&&b.$$properties[name]){return b.$$properties[name];}
;b=b.superclass;}
;return null;}
,hasProperty:function(c,name){return !!qx.util.OOUtil.getPropertyDefinition(c,name);}
,getEventType:function(d,name){var d=d.constructor;while(d.superclass){if(d.$$events&&d.$$events[name]!==undefined){return d.$$events[name];}
;d=d.superclass;}
;return null;}
,supportsEvent:function(e,name){return !!qx.util.OOUtil.getEventType(e,name);}
,getByInterface:function(h,f){var g,i,l;while(h){if(h.$$implements){g=h.$$flatImplements;for(i=0,l=g.length;i<l;i++ ){if(g[i]===f){return h;}
;}
;}
;h=h.superclass;}
;return null;}
,hasInterface:function(k,j){return !!qx.util.OOUtil.getByInterface(k,j);}
,getMixins:function(n){var m=[];while(n){if(n.$$includes){m.push.apply(m,n.$$flatIncludes);}
;n=n.superclass;}
;return m;}
}});}
)();
(function(){var a="qx.bom.client.Xml.getSelectSingleNode",b="qx.bom.client.Stylesheet.getInsertRule",c="qx.bom.client.Html.getDataset",d="qx.bom.client.PhoneGap.getPhoneGap",e="qx.bom.client.EcmaScript.getArrayReduce",f="qx.core.Environment for a list of predefined keys.",g='] found, and no default ("default") given',h="qx.bom.client.Html.getAudioAif",j="qx.bom.client.CssTransform.get3D",k="qx.bom.client.EcmaScript.getArrayLastIndexOf",l=" is not a valid key. Please see the API-doc of ",m=' type)',n="qx.bom.client.EcmaScript.getArrayForEach",o="qx.bom.client.Xml.getAttributeNS",p="qx.bom.client.Stylesheet.getRemoveImport",q="qx.bom.client.Css.getUserModify",r="qx.bom.client.Css.getBoxShadow",s="qx.bom.client.Html.getXul",t="qx.bom.client.Plugin.getWindowsMedia",u=":",v="qx.blankpage",w="qx.bom.client.Html.getVideo",x="qx.bom.client.Device.getName",y="qx.bom.client.Event.getTouch",z="qx.optimization.strings",A="qx.debug.property.level",B="qx.bom.client.EcmaScript.getArrayFilter",C="qx.bom.client.EcmaScript.getStringTrim",D="qx.optimization.variables",E="qx.bom.client.EcmaScript.getStackTrace",F="qx.bom.client.EcmaScript.getDateNow",G="qx.bom.client.EcmaScript.getArrayEvery",H="qx.bom.client.Xml.getImplementation",I="qx.bom.client.Html.getConsole",J="qx.bom.client.Engine.getVersion",K="qx.bom.client.Device.getType",L="qx.bom.client.Plugin.getQuicktime",M="qx.bom.client.Html.getNaturalDimensions",N="qx.bom.client.Xml.getSelectNodes",O="qx.bom.client.Xml.getElementsByTagNameNS",P="qx.nativeScrollBars",Q="qx.bom.client.Html.getDataUrl",R="qx.bom.client.Flash.isAvailable",S="qx.bom.client.Html.getCanvas",T="qx.dyntheme",U="qx.bom.client.Device.getPixelRatio",V="qx.bom.client.Css.getBoxModel",W="qx.bom.client.Plugin.getSilverlight",X="qx/static/blank.html",Y="qx.bom.client.EcmaScript.getArrayMap",ej="qx.bom.client.Css.getUserSelect",ee="qx.bom.client.Css.getRadialGradient",ek="module.property",eg="qx.bom.client.Plugin.getWindowsMediaVersion",eh="qx.bom.client.Stylesheet.getCreateStyleSheet",ed='No match for variant "',ei="qx.bom.client.Locale.getLocale",eo="module.events",ep="qx.bom.client.Plugin.getSkype",eq="module.databinding",er="qx.bom.client.Html.getFileReader",el="qx.bom.client.Css.getBorderImage",em="qx.bom.client.Stylesheet.getDeleteRule",ef="qx.bom.client.EcmaScript.getErrorToString",en="qx.bom.client.Plugin.getDivXVersion",ev="qx.bom.client.Scroll.scrollBarOverlayed",eX="qx.bom.client.Plugin.getPdfVersion",ew="qx.bom.client.Xml.getCreateNode",ex="qx.bom.client.Css.getAlphaImageLoaderNeeded",es="qx.bom.client.Css.getLinearGradient",et="qx.bom.client.Transport.getXmlHttpRequest",fY="qx.bom.client.Css.getBorderImageSyntax",eu="qx.bom.client.Html.getClassList",ey="qx.bom.client.Event.getHelp",ez="qx.optimization.comments",eA="qx.bom.client.Locale.getVariant",eF="qx.bom.client.Css.getBoxSizing",eG="qx.bom.client.OperatingSystem.getName",eH="module.logger",eB="qx.mobile.emulatetouch",eC="qx.bom.client.Html.getAudioWav",eD="qx.bom.client.Browser.getName",eE="qx.bom.client.Css.getInlineBlock",eL="qx.bom.client.Plugin.getPdf",eM="please use 'css.pointerevents' instead.",eN="qx.dynlocale",eO="qx.bom.client.Device.getTouch",eI="The environment key 'event.pointer' is deprecated, ",eJ="qx.emulatemouse",ga='" (',eK="qx.bom.client.Html.getAudio",eS="qx.core.Environment",eT="qx.bom.client.EcmaScript.getFunctionBind",ge="qx.bom.client.CssTransform.getSupport",eU="qx.bom.client.Html.getTextContent",eP="qx.bom.client.Css.getPlaceholder",eQ="qx.bom.client.Css.getFloat",gc="default",eR=' in variants [',eV="false",eW="qx.bom.client.Css.getFilterGradient",fj="qx.bom.client.Html.getHistoryState",fi="qxenv",fh="qx.bom.client.Html.getSessionStorage",fn="qx.bom.client.Html.getAudioAu",fm="qx.bom.client.Css.getOpacity",fl="qx.bom.client.Css.getFilterTextShadow",fk="qx.bom.client.Html.getVml",fc="qx.bom.client.Transport.getMaxConcurrentRequestCount",fb="qx.bom.client.Event.getHashChange",fa="qx.bom.client.Css.getRgba",eY="qx.bom.client.Css.getBorderRadius",fg="qx.bom.client.EcmaScript.getArraySome",ff="qx.bom.client.Transport.getSsl",fe="qx.bom.client.Html.getWebWorker",fd="qx.bom.client.Json.getJson",fu="qx.bom.client.Browser.getQuirksMode",ft="qx.debug.dispose",fs="qx.bom.client.Css.getTextOverflow",fr="qx.bom.client.EcmaScript.getArrayIndexOf",fy="qx.bom.client.Xml.getQualifiedItem",fx="qx.bom.client.Html.getVideoOgg",fw="&",fv="qx.bom.client.EcmaScript.getArrayReduceRight",fq="qx.bom.client.Engine.getMsPointer",fp="qx.bom.client.Browser.getDocumentMode",fo="qx.allowUrlVariants",fJ="qx.debug.ui.queue",fI="|",fH="qx.bom.client.Html.getContains",fN="qx.bom.client.Plugin.getActiveX",fM=".",fL="qx.bom.client.Xml.getDomProperties",fK="qx.bom.client.CssAnimation.getSupport",fC="qx.debug.databinding",fB="qx.optimization.basecalls",fA="qx.bom.client.Browser.getVersion",fz="qx.bom.client.Css.getUserSelectNone",fG="true",fF="qx.bom.client.Html.getSvg",fE="qx.bom.client.EcmaScript.getObjectKeys",fD="qx.bom.client.Plugin.getDivX",fT="qx.bom.client.Runtime.getName",fS="qx.bom.client.Html.getLocalStorage",fR="css.pointerevents",fQ="qx.allowUrlSettings",fX="qx.bom.client.Flash.getStrictSecurityModel",fW="qx.aspects",fV="qx.debug",fU="qx.bom.client.Css.getPointerEvents",fP="qx.dynamicmousewheel",fO="qx.bom.client.Html.getAudioMp3",dO="qx.bom.client.Engine.getName",dN="qx.bom.client.Html.getUserDataStorage",gf="qx.bom.client.Plugin.getGears",dL="qx.bom.client.Plugin.getQuicktimeVersion",dM="qx.bom.client.Html.getAudioOgg",dK="event.pointer",gd="qx.bom.client.Css.getTextShadow",dI="qx.bom.client.Plugin.getSilverlightVersion",dJ="qx.bom.client.Html.getCompareDocumentPosition",dH="qx.bom.client.Flash.getExpressInstall",gb="qx.bom.client.Html.getSelection",dF="qx.bom.client.OperatingSystem.getVersion",dG="qx.bom.client.Html.getXPath",dE="qx.bom.client.Html.getGeoLocation",dX="qx.optimization.privates",dY="qx.bom.client.Scroll.getNativeScroll",dV="qx.bom.client.Css.getAppearance",dW="qx.bom.client.CssTransition.getSupport",dT="qx.bom.client.Stylesheet.getAddImport",dU="qx.optimization.variants",dS="qx.bom.client.Html.getVideoWebm",dD="qx.bom.client.Flash.getVersion",dQ="qx.bom.client.CssAnimation.getRequestAnimationFrame",dR="qx.bom.client.Css.getLegacyWebkitGradient",dP="qx.bom.client.PhoneGap.getNotification",ec="qx.bom.client.Html.getVideoH264",ea="qx.bom.client.Xml.getCreateElementNS",eb="qx.bom.client.Xml.getDomParser";qx.Bootstrap.define(eS,{statics:{_checks:{},_asyncChecks:{},__d:{},_checksMap:{"engine.version":J,"engine.name":dO,"browser.name":eD,"browser.version":fA,"browser.documentmode":fp,"browser.quirksmode":fu,"runtime.name":fT,"device.name":x,"device.type":K,"device.pixelRatio":U,"device.touch":eO,"locale":ei,"locale.variant":eA,"os.name":eG,"os.version":dF,"os.scrollBarOverlayed":ev,"plugin.gears":gf,"plugin.activex":fN,"plugin.skype":ep,"plugin.quicktime":L,"plugin.quicktime.version":dL,"plugin.windowsmedia":t,"plugin.windowsmedia.version":eg,"plugin.divx":fD,"plugin.divx.version":en,"plugin.silverlight":W,"plugin.silverlight.version":dI,"plugin.flash":R,"plugin.flash.version":dD,"plugin.flash.express":dH,"plugin.flash.strictsecurity":fX,"plugin.pdf":eL,"plugin.pdf.version":eX,"io.maxrequests":fc,"io.ssl":ff,"io.xhr":et,"event.touch":y,"event.mspointer":fq,"event.help":ey,"event.hashchange":fb,"ecmascript.error.stacktrace":E,"ecmascript.array.indexof":fr,"ecmascript.array.lastindexof":k,"ecmascript.array.foreach":n,"ecmascript.array.filter":B,"ecmascript.array.map":Y,"ecmascript.array.some":fg,"ecmascript.array.every":G,"ecmascript.array.reduce":e,"ecmascript.array.reduceright":fv,"ecmascript.function.bind":eT,"ecmascript.object.keys":fE,"ecmascript.date.now":F,"ecmascript.error.toString":ef,"ecmascript.string.trim":C,"html.webworker":fe,"html.filereader":er,"html.geolocation":dE,"html.audio":eK,"html.audio.ogg":dM,"html.audio.mp3":fO,"html.audio.wav":eC,"html.audio.au":fn,"html.audio.aif":h,"html.video":w,"html.video.ogg":fx,"html.video.h264":ec,"html.video.webm":dS,"html.storage.local":fS,"html.storage.session":fh,"html.storage.userdata":dN,"html.classlist":eu,"html.xpath":dG,"html.xul":s,"html.canvas":S,"html.svg":fF,"html.vml":fk,"html.dataset":c,"html.dataurl":Q,"html.console":I,"html.stylesheet.createstylesheet":eh,"html.stylesheet.insertrule":b,"html.stylesheet.deleterule":em,"html.stylesheet.addimport":dT,"html.stylesheet.removeimport":p,"html.element.contains":fH,"html.element.compareDocumentPosition":dJ,"html.element.textcontent":eU,"html.image.naturaldimensions":M,"html.history.state":fj,"html.selection":gb,"json":fd,"css.textoverflow":fs,"css.placeholder":eP,"css.borderradius":eY,"css.borderimage":el,"css.borderimage.standardsyntax":fY,"css.boxshadow":r,"css.gradient.linear":es,"css.gradient.filter":eW,"css.gradient.radial":ee,"css.gradient.legacywebkit":dR,"css.boxmodel":V,"css.rgba":fa,"css.userselect":ej,"css.userselect.none":fz,"css.usermodify":q,"css.appearance":dV,"css.float":eQ,"css.boxsizing":eF,"css.animation":fK,"css.animation.requestframe":dQ,"css.transform":ge,"css.transform.3d":j,"css.transition":dW,"css.inlineblock":eE,"css.opacity":fm,"css.textShadow":gd,"css.textShadow.filter":fl,"css.alphaimageloaderneeded":ex,"css.pointerevents":fU,"phonegap":d,"phonegap.notification":dP,"xml.implementation":H,"xml.domparser":eb,"xml.selectsinglenode":a,"xml.selectnodes":N,"xml.getelementsbytagnamens":O,"xml.domproperties":fL,"xml.attributens":o,"xml.createnode":ew,"xml.getqualifieditem":fy,"xml.createelementns":ea,"qx.mobile.nativescroll":dY},get:function(gj){if(qx.Bootstrap.DEBUG){if(gj===dK){gj=fR;qx.Bootstrap.warn(eI+eM);}
;}
;if(this.__d[gj]!=undefined){return this.__d[gj];}
;var gl=this._checks[gj];if(gl){var gh=gl();this.__d[gj]=gh;return gh;}
;var gg=this._getClassNameFromEnvKey(gj);if(gg[0]!=undefined){var gk=gg[0];var gi=gg[1];var gh=gk[gi]();this.__d[gj]=gh;return gh;}
;if(qx.Bootstrap.DEBUG){qx.Bootstrap.warn(gj+l+f);qx.Bootstrap.trace(this);}
;}
,_getClassNameFromEnvKey:function(gq){var gs=this._checksMap;if(gs[gq]!=undefined){var gn=gs[gq];var gr=gn.lastIndexOf(fM);if(gr>-1){var gp=gn.slice(0,gr);var gm=gn.slice(gr+1);var go=qx.Bootstrap.getByName(gp);if(go!=undefined){return [go,gm];}
;}
;}
;return [undefined,undefined];}
,getAsync:function(gu,gx,self){var gy=this;if(this.__d[gu]!=undefined){window.setTimeout(function(){gx.call(self,gy.__d[gu]);}
,0);return;}
;var gv=this._asyncChecks[gu];if(gv){gv(function(gA){gy.__d[gu]=gA;gx.call(self,gA);}
);return;}
;var gt=this._getClassNameFromEnvKey(gu);if(gt[0]!=undefined){var gw=gt[0];var gz=gt[1];gw[gz](function(gB){gy.__d[gu]=gB;gx.call(self,gB);}
);return;}
;if(qx.Bootstrap.DEBUG){qx.Bootstrap.warn(gu+l+f);qx.Bootstrap.trace(this);}
;}
,select:function(gD,gC){return this.__e(this.get(gD),gC);}
,selectAsync:function(gF,gE,self){this.getAsync(gF,function(gG){var gH=this.__e(gF,gE);gH.call(self,gG);}
,this);}
,__e:function(gL,gK){var gJ=gK[gL];if(gK.hasOwnProperty(gL)){return gJ;}
;for(var gM in gK){if(gM.indexOf(fI)!=-1){var gI=gM.split(fI);for(var i=0;i<gI.length;i++ ){if(gI[i]==gL){return gK[gM];}
;}
;}
;}
;if(gK[gc]!==undefined){return gK[gc];}
;if(qx.Bootstrap.DEBUG){throw new Error(ed+gL+ga+(typeof gL)+m+eR+qx.Bootstrap.keys(gK)+g);}
;}
,filter:function(gN){var gP=[];for(var gO in gN){if(this.get(gO)){gP.push(gN[gO]);}
;}
;return gP;}
,invalidateCacheKey:function(gQ){delete this.__d[gQ];}
,add:function(gS,gR){if(this._checks[gS]==undefined){if(gR instanceof Function){this._checks[gS]=gR;}
else {this._checks[gS]=this.__h(gR);}
;}
;}
,addAsync:function(gU,gT){if(this._checks[gU]==undefined){this._asyncChecks[gU]=gT;}
;}
,getChecks:function(){return this._checks;}
,getAsyncChecks:function(){return this._asyncChecks;}
,_initDefaultQxValues:function(){this.add(fG,function(){return true;}
);this.add(fQ,function(){return false;}
);this.add(fo,function(){return false;}
);this.add(A,function(){return 0;}
);this.add(fV,function(){return true;}
);this.add(fJ,function(){return true;}
);this.add(fW,function(){return false;}
);this.add(eN,function(){return true;}
);this.add(T,function(){return true;}
);this.add(eB,function(){return false;}
);this.add(eJ,function(){return false;}
);this.add(v,function(){return X;}
);this.add(fP,function(){return true;}
);this.add(fC,function(){return false;}
);this.add(ft,function(){return false;}
);this.add(fB,function(){return false;}
);this.add(ez,function(){return false;}
);this.add(dX,function(){return false;}
);this.add(z,function(){return false;}
);this.add(D,function(){return false;}
);this.add(dU,function(){return false;}
);this.add(eq,function(){return true;}
);this.add(eH,function(){return true;}
);this.add(ek,function(){return true;}
);this.add(eo,function(){return true;}
);this.add(P,function(){return false;}
);}
,__f:function(){if(qx&&qx.$$environment){for(var gV in qx.$$environment){var gW=qx.$$environment[gV];this._checks[gV]=this.__h(gW);}
;}
;}
,__g:function(){if(window.document&&window.document.location){var gX=window.document.location.search.slice(1).split(fw);for(var i=0;i<gX.length;i++ ){var hb=gX[i].split(u);if(hb.length!=3||hb[0]!=fi){continue;}
;var gY=hb[1];var ha=decodeURIComponent(hb[2]);if(ha==fG){ha=true;}
else if(ha==eV){ha=false;}
else if(/^(\d|\.)+$/.test(ha)){ha=parseFloat(ha);}
;this._checks[gY]=this.__h(ha);}
;}
;}
,__h:function(hc){return qx.Bootstrap.bind(function(hd){return hd;}
,null,hc);}
},defer:function(he){he._initDefaultQxValues();he.__f();if(he.get(fQ)===true){he.__g();}
;}
});}
)();
(function(){var a="ecmascript.array.lastindexof",b="function",c="stack",d="ecmascript.array.map",f="ecmascript.date.now",g="ecmascript.array.reduce",h="e",i="qx.bom.client.EcmaScript",j="ecmascript.object.keys",k="ecmascript.error.stacktrace",l="ecmascript.string.trim",m="ecmascript.array.indexof",n="stacktrace",o="ecmascript.error.toString",p="[object Error]",q="ecmascript.array.foreach",r="ecmascript.function.bind",s="ecmascript.array.reduceright",t="ecmascript.array.some",u="ecmascript.array.filter",v="ecmascript.array.every";qx.Bootstrap.define(i,{statics:{getStackTrace:function(){var w;var e=new Error(h);w=e.stack?c:e.stacktrace?n:null;if(!w){try{throw e;}
catch(x){e=x;}
;}
;return e.stacktrace?n:e.stack?c:null;}
,getArrayIndexOf:function(){return !!Array.prototype.indexOf;}
,getArrayLastIndexOf:function(){return !!Array.prototype.lastIndexOf;}
,getArrayForEach:function(){return !!Array.prototype.forEach;}
,getArrayFilter:function(){return !!Array.prototype.filter;}
,getArrayMap:function(){return !!Array.prototype.map;}
,getArraySome:function(){return !!Array.prototype.some;}
,getArrayEvery:function(){return !!Array.prototype.every;}
,getArrayReduce:function(){return !!Array.prototype.reduce;}
,getArrayReduceRight:function(){return !!Array.prototype.reduceRight;}
,getErrorToString:function(){return typeof Error.prototype.toString==b&&Error.prototype.toString()!==p;}
,getFunctionBind:function(){return typeof Function.prototype.bind===b;}
,getObjectKeys:function(){return !!Object.keys;}
,getDateNow:function(){return !!Date.now;}
,getStringTrim:function(){return typeof String.prototype.trim===b;}
},defer:function(y){qx.core.Environment.add(m,y.getArrayIndexOf);qx.core.Environment.add(a,y.getArrayLastIndexOf);qx.core.Environment.add(q,y.getArrayForEach);qx.core.Environment.add(u,y.getArrayFilter);qx.core.Environment.add(d,y.getArrayMap);qx.core.Environment.add(t,y.getArraySome);qx.core.Environment.add(v,y.getArrayEvery);qx.core.Environment.add(g,y.getArrayReduce);qx.core.Environment.add(s,y.getArrayReduceRight);qx.core.Environment.add(f,y.getDateNow);qx.core.Environment.add(o,y.getErrorToString);qx.core.Environment.add(k,y.getStackTrace);qx.core.Environment.add(r,y.getFunctionBind);qx.core.Environment.add(j,y.getObjectKeys);qx.core.Environment.add(l,y.getStringTrim);}
});}
)();
(function(){var a='',b="ecmascript.string.trim",c="qx.lang.normalize.String";qx.Bootstrap.define(c,{defer:function(){if(!qx.core.Environment.get(b)){String.prototype.trim=function(d){return this.replace(/^\s+|\s+$/g,a);}
;}
;}
});}
)();
(function(){var a="ecmascript.object.keys",b="qx.lang.normalize.Object";qx.Bootstrap.define(b,{defer:function(){if(!qx.core.Environment.get(a)){Object.keys=qx.Bootstrap.keys;}
;}
});}
)();
(function(){var a="qx.lang.normalize.Function",b="ecmascript.function.bind",c="function",d="Function.prototype.bind called on incompatible ";qx.Bootstrap.define(a,{defer:function(){if(!qx.core.Environment.get(b)){var e=Array.prototype.slice;Function.prototype.bind=function(i){var h=this;if(typeof h!=c){throw new TypeError(d+h);}
;var f=e.call(arguments,1);var g=function(){if(this instanceof g){var F=function(){}
;F.prototype=h.prototype;var self=new F;var j=h.apply(self,f.concat(e.call(arguments)));if(Object(j)===j){return j;}
;return self;}
else {return h.apply(i,f.concat(e.call(arguments)));}
;}
;return g;}
;}
;}
});}
)();
(function(){var a="",b="qx.lang.normalize.Error",c=": ",d="Error",e="ecmascript.error.toString";qx.Bootstrap.define(b,{defer:function(){if(!qx.core.Environment.get(e)){Error.prototype.toString=function(){var name=this.name||d;var f=this.message||a;if(name===a&&f===a){return d;}
;if(name===a){return f;}
;if(f===a){return name;}
;return name+c+f;}
;}
;}
});}
)();
(function(){var a="qx.lang.normalize.Date",b="ecmascript.date.now";qx.Bootstrap.define(a,{defer:function(){if(!qx.core.Environment.get(b)){Date.now=function(){return +new Date();}
;}
;}
});}
)();
(function(){var a="function",b="ecmascript.array.lastindexof",c="ecmascript.array.map",d="ecmascript.array.filter",e="Length is 0 and no second argument given",f="qx.lang.normalize.Array",g="ecmascript.array.indexof",h="First argument is not callable",j="ecmascript.array.reduce",k="ecmascript.array.foreach",m="ecmascript.array.reduceright",n="ecmascript.array.some",o="ecmascript.array.every";qx.Bootstrap.define(f,{defer:function(){if(!qx.core.Environment.get(g)){Array.prototype.indexOf=function(p,q){if(q==null){q=0;}
else if(q<0){q=Math.max(0,this.length+q);}
;for(var i=q;i<this.length;i++ ){if(this[i]===p){return i;}
;}
;return -1;}
;}
;if(!qx.core.Environment.get(b)){Array.prototype.lastIndexOf=function(r,s){if(s==null){s=this.length-1;}
else if(s<0){s=Math.max(0,this.length+s);}
;for(var i=s;i>=0;i-- ){if(this[i]===r){return i;}
;}
;return -1;}
;}
;if(!qx.core.Environment.get(k)){Array.prototype.forEach=function(t,u){var l=this.length;for(var i=0;i<l;i++ ){var v=this[i];if(v!==undefined){t.call(u||window,v,i,this);}
;}
;}
;}
;if(!qx.core.Environment.get(d)){Array.prototype.filter=function(z,w){var x=[];var l=this.length;for(var i=0;i<l;i++ ){var y=this[i];if(y!==undefined){if(z.call(w||window,y,i,this)){x.push(this[i]);}
;}
;}
;return x;}
;}
;if(!qx.core.Environment.get(c)){Array.prototype.map=function(D,A){var B=[];var l=this.length;for(var i=0;i<l;i++ ){var C=this[i];if(C!==undefined){B[i]=D.call(A||window,C,i,this);}
;}
;return B;}
;}
;if(!qx.core.Environment.get(n)){Array.prototype.some=function(E,F){var l=this.length;for(var i=0;i<l;i++ ){var G=this[i];if(G!==undefined){if(E.call(F||window,G,i,this)){return true;}
;}
;}
;return false;}
;}
;if(!qx.core.Environment.get(o)){Array.prototype.every=function(H,I){var l=this.length;for(var i=0;i<l;i++ ){var J=this[i];if(J!==undefined){if(!H.call(I||window,J,i,this)){return false;}
;}
;}
;return true;}
;}
;if(!qx.core.Environment.get(j)){Array.prototype.reduce=function(K,L){if(typeof K!==a){throw new TypeError(h);}
;if(L===undefined&&this.length===0){throw new TypeError(e);}
;var M=L===undefined?this[0]:L;for(var i=L===undefined?1:0;i<this.length;i++ ){if(i in this){M=K.call(undefined,M,this[i],i,this);}
;}
;return M;}
;}
;if(!qx.core.Environment.get(m)){Array.prototype.reduceRight=function(N,O){if(typeof N!==a){throw new TypeError(h);}
;if(O===undefined&&this.length===0){throw new TypeError(e);}
;var P=O===undefined?this[this.length-1]:O;for(var i=O===undefined?this.length-2:this.length-1;i>=0;i-- ){if(i in this){P=N.call(undefined,P,this[i],i,this);}
;}
;return P;}
;}
;}
});}
)();
(function(){var b='!==inherit){',c='qx.lang.Type.isString(value) && qx.util.ColorUtil.isValidPropertyValue(value)',d='value !== null && qx.theme.manager.Font.getInstance().isDynamic(value)',e="set",f=';',g="resetThemed",h='value !== null && value.nodeType === 9 && value.documentElement',j='===value)return value;',k='value !== null && value.$$type === "Mixin"',m='return init;',n='var init=this.',o='value !== null && value.nodeType === 1 && value.attributes',p="var parent = this.getLayoutParent();",q="Error in property ",r='var a=this._getChildren();if(a)for(var i=0,l=a.length;i<l;i++){',s="property",t="();",u='.validate.call(this, value);',v='qx.core.Assert.assertInstance(value, Date, msg) || true',w='else{',x="if (!parent) return;",y=" in method ",z='qx.core.Assert.assertInstance(value, Error, msg) || true',A='=computed;',B='Undefined value is not allowed!',C='(backup);',D='else ',E='=true;',F='if(old===undefined)old=this.',G='if(computed===inherit){',H='old=computed=this.',I="inherit",J='if(this.',K='return this.',L='else if(this.',M='Is invalid!',N='if(value===undefined)prop.error(this,2,"',O='", "',P='var computed, old=this.',Q='else if(computed===undefined)',R='delete this.',S="resetRuntime",T="': ",U=" of class ",V='value !== null && value.nodeType !== undefined',W='===undefined)return;',X='value !== null && qx.theme.manager.Decoration.getInstance().isValidPropertyValue(value)',Y="reset",ba="string",bb="')){",bc="module.events",bd="return this.",be='qx.core.Assert.assertPositiveInteger(value, msg) || true',bf='else this.',bg='value=this.',bh='","',bi='if(init==qx.core.Property.$$inherit)init=null;',bj="get",bk='value !== null && value.$$type === "Interface"',bl='var inherit=prop.$$inherit;',bm="', qx.event.type.Data, [computed, old]",bn="var value = parent.",bo="$$useinit_",bp='computed=undefined;delete this.',bq="(value);",br='this.',bs='Requires exactly one argument!',bt='",value);',bu='computed=value;',bv='}else{',bw="$$runtime_",bx="setThemed",by=';}',bz='(value);',bA="$$user_",bB='!==undefined)',bC='){',bD='qx.core.Assert.assertArray(value, msg) || true',bE='if(computed===undefined||computed===inherit){',bF=";",bG='qx.core.Assert.assertPositiveNumber(value, msg) || true',bH=".prototype",bI="Boolean",bJ=")}",bK="(a[",bL='(computed, old, "',bM="setRuntime",bN='return value;',bO="this.",bP='if(init==qx.core.Property.$$inherit)throw new Error("Inheritable property ',bQ="if(reg.hasListener(this, '",bR='Does not allow any arguments!',bS=')a[i].',bT="()",bU="var a=arguments[0] instanceof Array?arguments[0]:arguments;",bV='.$$properties.',bW='value !== null && value.$$type === "Theme"',bX='old=this.',bY="var reg=qx.event.Registration;",ca="())",cb='=value;',cc='return null;',cd='qx.core.Assert.assertObject(value, msg) || true',ce='");',cf='if(old===computed)return value;',cg='qx.core.Assert.assertString(value, msg) || true',ch='if(old===undefined)old=null;',ci='var pa=this.getLayoutParent();if(pa)computed=pa.',cj="if (value===undefined) value = parent.",ck='value !== null && value.$$type === "Class"',cl='qx.core.Assert.assertFunction(value, msg) || true',cm='!==undefined&&',cn='var computed, old;',co='var backup=computed;',cp=".",cq='}',cr="object",cs="$$init_",ct="$$theme_",cu='!==undefined){',cv='if(computed===undefined)computed=null;',cw="Unknown reason: ",cx="init",cy='qx.core.Assert.assertMap(value, msg) || true',cz="qx.aspects",cA='qx.core.Assert.assertNumber(value, msg) || true',cB='if((computed===undefined||computed===inherit)&&',cC="reg.fireEvent(this, '",cD='Null value is not allowed!',cE='qx.core.Assert.assertInteger(value, msg) || true',cF="value",cG="shorthand",cH='computed=this.',cI='qx.core.Assert.assertInstance(value, RegExp, msg) || true',cJ='value !== null && value.type !== undefined',cK='value !== null && value.document',cL="",cM='throw new Error("Property ',cN="(!this.",cO='qx.core.Assert.assertBoolean(value, msg) || true',cP='if(a[i].',cQ=' of an instance of ',cR="toggle",cS="refresh",cT="$$inherit_",cU='var prop=qx.core.Property;',cV="boolean",cW=" with incoming value '",cX="a=qx.lang.Array.fromShortHand(qx.lang.Array.fromArguments(a));",cY='if(computed===undefined||computed==inherit)computed=null;',da="qx.core.Property",db="is",dc=' is not (yet) ready!");',dd="]);",de='Could not change or apply init value after constructing phase!';qx.Bootstrap.define(da,{statics:{__i:function(){if(qx.core.Environment.get(bc)){qx.event.type.Data;qx.event.dispatch.Direct;}
;}
,__j:{"Boolean":cO,"String":cg,"Number":cA,"Integer":cE,"PositiveNumber":bG,"PositiveInteger":be,"Error":z,"RegExp":cI,"Object":cd,"Array":bD,"Map":cy,"Function":cl,"Date":v,"Node":V,"Element":o,"Document":h,"Window":cK,"Event":cJ,"Class":ck,"Mixin":k,"Interface":bk,"Theme":bW,"Color":c,"Decorator":X,"Font":d},__k:{"Node":true,"Element":true,"Document":true,"Window":true,"Event":true},$$inherit:I,$$store:{runtime:{},user:{},theme:{},inherit:{},init:{},useinit:{}},$$method:{get:{},set:{},reset:{},init:{},refresh:{},setRuntime:{},resetRuntime:{},setThemed:{},resetThemed:{}},$$allowedKeys:{name:ba,dereference:cV,inheritable:cV,nullable:cV,themeable:cV,refine:cV,init:null,apply:ba,event:ba,check:null,transform:ba,deferredInit:cV,validate:null},$$allowedGroupKeys:{name:ba,group:cr,mode:ba,themeable:cV},$$inheritable:{},__l:function(dh){var df=this.__m(dh);if(!df.length){var dg=function(){}
;}
else {dg=this.__n(df);}
;dh.prototype.$$refreshInheritables=dg;}
,__m:function(di){var dj=[];while(di){var dk=di.$$properties;if(dk){for(var name in this.$$inheritable){if(dk[name]&&dk[name].inheritable){dj.push(name);}
;}
;}
;di=di.superclass;}
;return dj;}
,__n:function(inheritables){var inherit=this.$$store.inherit;var init=this.$$store.init;var refresh=this.$$method.refresh;var code=[p,x];for(var i=0,l=inheritables.length;i<l;i++ ){var name=inheritables[i];code.push(bn,inherit[name],bF,cj,init[name],bF,bO,refresh[name],bq);}
;return new Function(code.join(cL));}
,attachRefreshInheritables:function(dl){dl.prototype.$$refreshInheritables=function(){qx.core.Property.__l(dl);return this.$$refreshInheritables();}
;}
,attachMethods:function(dn,name,dm){dm.group?this.__o(dn,dm,name):this.__p(dn,dm,name);}
,__o:function(clazz,config,name){var upname=qx.Bootstrap.firstUp(name);var members=clazz.prototype;var themeable=config.themeable===true;{}
;var setter=[];var resetter=[];if(themeable){var styler=[];var unstyler=[];}
;var argHandler=bU;setter.push(argHandler);if(themeable){styler.push(argHandler);}
;if(config.mode==cG){var shorthand=cX;setter.push(shorthand);if(themeable){styler.push(shorthand);}
;}
;for(var i=0,a=config.group,l=a.length;i<l;i++ ){{}
;setter.push(bO,this.$$method.set[a[i]],bK,i,dd);resetter.push(bO,this.$$method.reset[a[i]],t);if(themeable){{}
;styler.push(bO,this.$$method.setThemed[a[i]],bK,i,dd);unstyler.push(bO,this.$$method.resetThemed[a[i]],t);}
;}
;this.$$method.set[name]=e+upname;members[this.$$method.set[name]]=new Function(setter.join(cL));this.$$method.reset[name]=Y+upname;members[this.$$method.reset[name]]=new Function(resetter.join(cL));if(themeable){this.$$method.setThemed[name]=bx+upname;members[this.$$method.setThemed[name]]=new Function(styler.join(cL));this.$$method.resetThemed[name]=g+upname;members[this.$$method.resetThemed[name]]=new Function(unstyler.join(cL));}
;}
,__p:function(clazz,config,name){var upname=qx.Bootstrap.firstUp(name);var members=clazz.prototype;{}
;if(config.dereference===undefined&&typeof config.check===ba){config.dereference=this.__q(config.check);}
;var method=this.$$method;var store=this.$$store;store.runtime[name]=bw+name;store.user[name]=bA+name;store.theme[name]=ct+name;store.init[name]=cs+name;store.inherit[name]=cT+name;store.useinit[name]=bo+name;method.get[name]=bj+upname;members[method.get[name]]=function(){return qx.core.Property.executeOptimizedGetter(this,clazz,name,bj);}
;method.set[name]=e+upname;members[method.set[name]]=function(dp){return qx.core.Property.executeOptimizedSetter(this,clazz,name,e,arguments);}
;method.reset[name]=Y+upname;members[method.reset[name]]=function(){return qx.core.Property.executeOptimizedSetter(this,clazz,name,Y);}
;if(config.inheritable||config.apply||config.event||config.deferredInit){method.init[name]=cx+upname;members[method.init[name]]=function(dq){return qx.core.Property.executeOptimizedSetter(this,clazz,name,cx,arguments);}
;{}
;}
;if(config.inheritable){method.refresh[name]=cS+upname;members[method.refresh[name]]=function(dr){return qx.core.Property.executeOptimizedSetter(this,clazz,name,cS,arguments);}
;{}
;}
;method.setRuntime[name]=bM+upname;members[method.setRuntime[name]]=function(ds){return qx.core.Property.executeOptimizedSetter(this,clazz,name,bM,arguments);}
;method.resetRuntime[name]=S+upname;members[method.resetRuntime[name]]=function(){return qx.core.Property.executeOptimizedSetter(this,clazz,name,S);}
;if(config.themeable){method.setThemed[name]=bx+upname;members[method.setThemed[name]]=function(dt){return qx.core.Property.executeOptimizedSetter(this,clazz,name,bx,arguments);}
;method.resetThemed[name]=g+upname;members[method.resetThemed[name]]=function(){return qx.core.Property.executeOptimizedSetter(this,clazz,name,g);}
;{}
;}
;if(config.check===bI){members[cR+upname]=new Function(bd+method.set[name]+cN+method.get[name]+ca);members[db+upname]=new Function(bd+method.get[name]+bT);{}
;}
;{}
;}
,__q:function(du){return !!this.__k[du];}
,__r:{'0':de,'1':bs,'2':B,'3':bR,'4':cD,'5':M},error:function(dv,dB,dA,dw,dx){var dy=dv.constructor.classname;var dz=q+dA+U+dy+y+this.$$method[dw][dA]+cW+dx+T;throw new Error(dz+(this.__r[dB]||cw+dB));}
,__s:function(instance,members,name,variant,code,args){var store=this.$$method[variant][name];{members[store]=new Function(cF,code.join(cL));}
;if(qx.core.Environment.get(cz)){members[store]=qx.core.Aspect.wrap(instance.classname+cp+store,members[store],s);}
;qx.Bootstrap.setDisplayName(members[store],instance.classname+bH,store);if(args===undefined){return instance[store]();}
else {return instance[store](args[0]);}
;}
,executeOptimizedGetter:function(dF,dE,name,dD){var dH=dE.$$properties[name];var dG=dE.prototype;var dC=[];var dI=this.$$store;dC.push(J,dI.runtime[name],bB);dC.push(K,dI.runtime[name],f);if(dH.inheritable){dC.push(L,dI.inherit[name],bB);dC.push(K,dI.inherit[name],f);dC.push(D);}
;dC.push(J,dI.user[name],bB);dC.push(K,dI.user[name],f);if(dH.themeable){dC.push(L,dI.theme[name],bB);dC.push(K,dI.theme[name],f);}
;if(dH.deferredInit&&dH.init===undefined){dC.push(L,dI.init[name],bB);dC.push(K,dI.init[name],f);}
;dC.push(D);if(dH.init!==undefined){if(dH.inheritable){dC.push(n,dI.init[name],f);if(dH.nullable){dC.push(bi);}
else if(dH.init!==undefined){dC.push(K,dI.init[name],f);}
else {dC.push(bP,name,cQ,dE.classname,dc);}
;dC.push(m);}
else {dC.push(K,dI.init[name],f);}
;}
else if(dH.inheritable||dH.nullable){dC.push(cc);}
else {dC.push(cM,name,cQ,dE.classname,dc);}
;return this.__s(dF,dG,name,dD,dC);}
,executeOptimizedSetter:function(dP,dO,name,dN,dM){var dR=dO.$$properties[name];var dQ=dO.prototype;var dK=[];var dJ=dN===e||dN===bx||dN===bM||(dN===cx&&dR.init===undefined);var dL=dR.apply||dR.event||dR.inheritable;var dS=this.__t(dN,name);this.__u(dK,dR,name,dN,dJ);if(dJ){this.__v(dK,dO,dR,name);}
;if(dL){this.__w(dK,dJ,dS,dN);}
;if(dR.inheritable){dK.push(bl);}
;{}
;if(!dL){this.__y(dK,name,dN,dJ);}
else {this.__z(dK,dR,name,dN,dJ);}
;if(dR.inheritable){this.__A(dK,dR,name,dN);}
else if(dL){this.__B(dK,dR,name,dN);}
;if(dL){this.__C(dK,dR,name,dN);if(dR.inheritable&&dQ._getChildren){this.__D(dK,name);}
;}
;if(dJ){dK.push(bN);}
;return this.__s(dP,dQ,name,dN,dK,dM);}
,__t:function(dT,name){if(dT===bM||dT===S){var dU=this.$$store.runtime[name];}
else if(dT===bx||dT===g){dU=this.$$store.theme[name];}
else if(dT===cx){dU=this.$$store.init[name];}
else {dU=this.$$store.user[name];}
;return dU;}
,__u:function(dX,dV,name,dY,dW){{if(!dV.nullable||dV.check||dV.inheritable){dX.push(cU);}
;if(dY===e){dX.push(N,name,bh,dY,bt);}
;}
;}
,__v:function(ea,ec,eb,name){if(eb.transform){ea.push(bg,eb.transform,bz);}
;if(eb.validate){if(typeof eb.validate===ba){ea.push(br,eb.validate,bz);}
else if(eb.validate instanceof Function){ea.push(ec.classname,bV,name);ea.push(u);}
;}
;}
,__w:function(ee,ed,eg,ef){var eh=(ef===Y||ef===g||ef===S);if(ed){ee.push(J,eg,j);}
else if(eh){ee.push(J,eg,W);}
;}
,__x:undefined,__y:function(ej,name,ek,ei){if(ek===bM){ej.push(br,this.$$store.runtime[name],cb);}
else if(ek===S){ej.push(J,this.$$store.runtime[name],bB);ej.push(R,this.$$store.runtime[name],f);}
else if(ek===e){ej.push(br,this.$$store.user[name],cb);}
else if(ek===Y){ej.push(J,this.$$store.user[name],bB);ej.push(R,this.$$store.user[name],f);}
else if(ek===bx){ej.push(br,this.$$store.theme[name],cb);}
else if(ek===g){ej.push(J,this.$$store.theme[name],bB);ej.push(R,this.$$store.theme[name],f);}
else if(ek===cx&&ei){ej.push(br,this.$$store.init[name],cb);}
;}
,__z:function(en,el,name,eo,em){if(el.inheritable){en.push(P,this.$$store.inherit[name],f);}
else {en.push(cn);}
;en.push(J,this.$$store.runtime[name],cu);if(eo===bM){en.push(cH,this.$$store.runtime[name],cb);}
else if(eo===S){en.push(R,this.$$store.runtime[name],f);en.push(J,this.$$store.user[name],bB);en.push(cH,this.$$store.user[name],f);en.push(L,this.$$store.theme[name],bB);en.push(cH,this.$$store.theme[name],f);en.push(L,this.$$store.init[name],cu);en.push(cH,this.$$store.init[name],f);en.push(br,this.$$store.useinit[name],E);en.push(cq);}
else {en.push(H,this.$$store.runtime[name],f);if(eo===e){en.push(br,this.$$store.user[name],cb);}
else if(eo===Y){en.push(R,this.$$store.user[name],f);}
else if(eo===bx){en.push(br,this.$$store.theme[name],cb);}
else if(eo===g){en.push(R,this.$$store.theme[name],f);}
else if(eo===cx&&em){en.push(br,this.$$store.init[name],cb);}
;}
;en.push(cq);en.push(L,this.$$store.user[name],cu);if(eo===e){if(!el.inheritable){en.push(bX,this.$$store.user[name],f);}
;en.push(cH,this.$$store.user[name],cb);}
else if(eo===Y){if(!el.inheritable){en.push(bX,this.$$store.user[name],f);}
;en.push(R,this.$$store.user[name],f);en.push(J,this.$$store.runtime[name],bB);en.push(cH,this.$$store.runtime[name],f);en.push(J,this.$$store.theme[name],bB);en.push(cH,this.$$store.theme[name],f);en.push(L,this.$$store.init[name],cu);en.push(cH,this.$$store.init[name],f);en.push(br,this.$$store.useinit[name],E);en.push(cq);}
else {if(eo===bM){en.push(cH,this.$$store.runtime[name],cb);}
else if(el.inheritable){en.push(cH,this.$$store.user[name],f);}
else {en.push(H,this.$$store.user[name],f);}
;if(eo===bx){en.push(br,this.$$store.theme[name],cb);}
else if(eo===g){en.push(R,this.$$store.theme[name],f);}
else if(eo===cx&&em){en.push(br,this.$$store.init[name],cb);}
;}
;en.push(cq);if(el.themeable){en.push(L,this.$$store.theme[name],cu);if(!el.inheritable){en.push(bX,this.$$store.theme[name],f);}
;if(eo===bM){en.push(cH,this.$$store.runtime[name],cb);}
else if(eo===e){en.push(cH,this.$$store.user[name],cb);}
else if(eo===bx){en.push(cH,this.$$store.theme[name],cb);}
else if(eo===g){en.push(R,this.$$store.theme[name],f);en.push(J,this.$$store.init[name],cu);en.push(cH,this.$$store.init[name],f);en.push(br,this.$$store.useinit[name],E);en.push(cq);}
else if(eo===cx){if(em){en.push(br,this.$$store.init[name],cb);}
;en.push(cH,this.$$store.theme[name],f);}
else if(eo===cS){en.push(cH,this.$$store.theme[name],f);}
;en.push(cq);}
;en.push(L,this.$$store.useinit[name],bC);if(!el.inheritable){en.push(bX,this.$$store.init[name],f);}
;if(eo===cx){if(em){en.push(cH,this.$$store.init[name],cb);}
else {en.push(cH,this.$$store.init[name],f);}
;}
else if(eo===e||eo===bM||eo===bx||eo===cS){en.push(R,this.$$store.useinit[name],f);if(eo===bM){en.push(cH,this.$$store.runtime[name],cb);}
else if(eo===e){en.push(cH,this.$$store.user[name],cb);}
else if(eo===bx){en.push(cH,this.$$store.theme[name],cb);}
else if(eo===cS){en.push(cH,this.$$store.init[name],f);}
;}
;en.push(cq);if(eo===e||eo===bM||eo===bx||eo===cx){en.push(w);if(eo===bM){en.push(cH,this.$$store.runtime[name],cb);}
else if(eo===e){en.push(cH,this.$$store.user[name],cb);}
else if(eo===bx){en.push(cH,this.$$store.theme[name],cb);}
else if(eo===cx){if(em){en.push(cH,this.$$store.init[name],cb);}
else {en.push(cH,this.$$store.init[name],f);}
;en.push(br,this.$$store.useinit[name],E);}
;en.push(cq);}
;}
,__A:function(eq,ep,name,er){eq.push(bE);if(er===cS){eq.push(bu);}
else {eq.push(ci,this.$$store.inherit[name],f);}
;eq.push(cB);eq.push(br,this.$$store.init[name],cm);eq.push(br,this.$$store.init[name],b);eq.push(cH,this.$$store.init[name],f);eq.push(br,this.$$store.useinit[name],E);eq.push(bv);eq.push(R,this.$$store.useinit[name],by);eq.push(cq);eq.push(cf);eq.push(G);eq.push(bp,this.$$store.inherit[name],f);eq.push(cq);eq.push(Q);eq.push(R,this.$$store.inherit[name],f);eq.push(bf,this.$$store.inherit[name],A);eq.push(co);if(ep.init!==undefined&&er!==cx){eq.push(F,this.$$store.init[name],bF);}
else {eq.push(ch);}
;eq.push(cY);}
,__B:function(et,es,name,eu){if(eu!==e&&eu!==bM&&eu!==bx){et.push(cv);}
;et.push(cf);if(es.init!==undefined&&eu!==cx){et.push(F,this.$$store.init[name],bF);}
else {et.push(ch);}
;}
,__C:function(ew,ev,name,ex){if(ev.apply){ew.push(br,ev.apply,bL,name,O,ex,ce);}
;if(ev.event){ew.push(bY,bQ,ev.event,bb,cC,ev.event,bm,bJ);}
;}
,__D:function(ey,name){ey.push(r);ey.push(cP,this.$$method.refresh[name],bS,this.$$method.refresh[name],C);ey.push(cq);}
}});}
)();
(function(){var a="qx.Mixin",b=".prototype",c="]",d='Conflict between mixin "',e="constructor",f="Array",g='"!',h='" and "',j="destruct",k='" in property "',m="Mixin",n='" in member "',o="[Mixin ";qx.Bootstrap.define(a,{statics:{define:function(name,q){if(q){if(q.include&&!(qx.Bootstrap.getClass(q.include)===f)){q.include=[q.include];}
;{}
;var r=q.statics?q.statics:{};qx.Bootstrap.setDisplayNames(r,name);for(var p in r){if(r[p] instanceof Function){r[p].$$mixin=r;}
;}
;if(q.construct){r.$$constructor=q.construct;qx.Bootstrap.setDisplayName(q.construct,name,e);}
;if(q.include){r.$$includes=q.include;}
;if(q.properties){r.$$properties=q.properties;}
;if(q.members){r.$$members=q.members;qx.Bootstrap.setDisplayNames(q.members,name+b);}
;for(var p in r.$$members){if(r.$$members[p] instanceof Function){r.$$members[p].$$mixin=r;}
;}
;if(q.events){r.$$events=q.events;}
;if(q.destruct){r.$$destructor=q.destruct;qx.Bootstrap.setDisplayName(q.destruct,name,j);}
;}
else {var r={};}
;r.$$type=m;r.name=name;r.toString=this.genericToString;r.basename=qx.Bootstrap.createNamespace(name,r);this.$$registry[name]=r;return r;}
,checkCompatibility:function(t){var u=this.flatten(t);var v=u.length;if(v<2){return true;}
;var w={};var x={};var z={};var y;for(var i=0;i<v;i++ ){y=u[i];for(var s in y.events){if(z[s]){throw new Error(d+y.name+h+z[s]+n+s+g);}
;z[s]=y.name;}
;for(var s in y.properties){if(w[s]){throw new Error(d+y.name+h+w[s]+k+s+g);}
;w[s]=y.name;}
;for(var s in y.members){if(x[s]){throw new Error(d+y.name+h+x[s]+n+s+g);}
;x[s]=y.name;}
;}
;return true;}
,isCompatible:function(B,C){var A=qx.util.OOUtil.getMixins(C);A.push(B);return qx.Mixin.checkCompatibility(A);}
,getByName:function(name){return this.$$registry[name];}
,isDefined:function(name){return this.getByName(name)!==undefined;}
,getTotalNumber:function(){return qx.Bootstrap.objectGetLength(this.$$registry);}
,flatten:function(D){if(!D){return [];}
;var E=D.concat();for(var i=0,l=D.length;i<l;i++ ){if(D[i].$$includes){E.push.apply(E,this.flatten(D[i].$$includes));}
;}
;return E;}
,genericToString:function(){return o+this.name+c;}
,$$registry:{},__E:null,__F:function(name,F){}
}});}
)();
(function(){var a="qx.data.MBinding";qx.Mixin.define(a,{members:{bind:function(b,e,c,d){return qx.data.SingleValueBinding.bind(this,b,e,c,d);}
,removeBinding:function(f){qx.data.SingleValueBinding.removeBindingFromObject(this,f);}
,removeAllBindings:function(){qx.data.SingleValueBinding.removeAllBindingsForObject(this);}
,getBindings:function(){return qx.data.SingleValueBinding.getAllBindingsForObject(this);}
}});}
)();
(function(){var a="qx.core.Aspect",b="before",c="*",d="static";qx.Bootstrap.define(a,{statics:{__G:[],wrap:function(h,l,j){var m=[];var e=[];var k=this.__G;var g;for(var i=0;i<k.length;i++ ){g=k[i];if((g.type==null||j==g.type||g.type==c)&&(g.name==null||h.match(g.name))){g.pos==-1?m.push(g.fcn):e.push(g.fcn);}
;}
;if(m.length===0&&e.length===0){return l;}
;var f=function(){for(var i=0;i<m.length;i++ ){m[i].call(this,h,l,j,arguments);}
;var n=l.apply(this,arguments);for(var i=0;i<e.length;i++ ){e[i].call(this,h,l,j,arguments,n);}
;return n;}
;if(j!==d){f.self=l.self;f.base=l.base;}
;l.wrapper=f;f.original=l;return f;}
,addAdvice:function(q,o,p,name){this.__G.push({fcn:q,pos:o===b?-1:1,type:p,name:name});}
}});}
)();
(function(){var a='Implementation of method "',b='"',c="function",d='" is not supported by Class "',e="Boolean",f="qx.Interface",g='The event "',h='" required by interface "',j='" is missing in class "',k='"!',m='The property "',n="Interface",o="toggle",p="]",q="[Interface ",r="is",s="Array",t='Implementation of member "';qx.Bootstrap.define(f,{statics:{define:function(name,v){if(v){if(v.extend&&!(qx.Bootstrap.getClass(v.extend)===s)){v.extend=[v.extend];}
;{}
;var u=v.statics?v.statics:{};if(v.extend){u.$$extends=v.extend;}
;if(v.properties){u.$$properties=v.properties;}
;if(v.members){u.$$members=v.members;}
;if(v.events){u.$$events=v.events;}
;}
else {var u={};}
;u.$$type=n;u.name=name;u.toString=this.genericToString;u.basename=qx.Bootstrap.createNamespace(name,u);qx.Interface.$$registry[name]=u;return u;}
,getByName:function(name){return this.$$registry[name];}
,isDefined:function(name){return this.getByName(name)!==undefined;}
,getTotalNumber:function(){return qx.Bootstrap.objectGetLength(this.$$registry);}
,flatten:function(x){if(!x){return [];}
;var w=x.concat();for(var i=0,l=x.length;i<l;i++ ){if(x[i].$$extends){w.push.apply(w,this.flatten(x[i].$$extends));}
;}
;return w;}
,__H:function(B,C,y,F,D){var z=y.$$members;if(z){for(var E in z){if(qx.Bootstrap.isFunction(z[E])){var H=this.__I(C,E);var A=H||qx.Bootstrap.isFunction(B[E]);if(!A){if(D){throw new Error(a+E+j+C.classname+h+y.name+b);}
else {return false;}
;}
;var G=F===true&&!H&&!qx.util.OOUtil.hasInterface(C,y);if(G){B[E]=this.__L(y,B[E],E,z[E]);}
;}
else {if(typeof B[E]===undefined){if(typeof B[E]!==c){if(D){throw new Error(t+E+j+C.classname+h+y.name+b);}
else {return false;}
;}
;}
;}
;}
;}
;if(!D){return true;}
;}
,__I:function(L,I){var N=I.match(/^(is|toggle|get|set|reset)(.*)$/);if(!N){return false;}
;var K=qx.Bootstrap.firstLow(N[2]);var M=qx.util.OOUtil.getPropertyDefinition(L,K);if(!M){return false;}
;var J=N[0]==r||N[0]==o;if(J){return qx.util.OOUtil.getPropertyDefinition(L,K).check==e;}
;return true;}
,__J:function(R,O,P){if(O.$$properties){for(var Q in O.$$properties){if(!qx.util.OOUtil.getPropertyDefinition(R,Q)){if(P){throw new Error(m+Q+d+R.classname+k);}
else {return false;}
;}
;}
;}
;if(!P){return true;}
;}
,__K:function(V,S,T){if(S.$$events){for(var U in S.$$events){if(!qx.util.OOUtil.supportsEvent(V,U)){if(T){throw new Error(g+U+d+V.classname+k);}
else {return false;}
;}
;}
;}
;if(!T){return true;}
;}
,assertObject:function(Y,W){var ba=Y.constructor;this.__H(Y,ba,W,false,true);this.__J(ba,W,true);this.__K(ba,W,true);var X=W.$$extends;if(X){for(var i=0,l=X.length;i<l;i++ ){this.assertObject(Y,X[i]);}
;}
;}
,assert:function(bd,bb,be){this.__H(bd.prototype,bd,bb,be,true);this.__J(bd,bb,true);this.__K(bd,bb,true);var bc=bb.$$extends;if(bc){for(var i=0,l=bc.length;i<l;i++ ){this.assert(bd,bc[i],be);}
;}
;}
,objectImplements:function(bh,bf){var bi=bh.constructor;if(!this.__H(bh,bi,bf)||!this.__J(bi,bf)||!this.__K(bi,bf)){return false;}
;var bg=bf.$$extends;if(bg){for(var i=0,l=bg.length;i<l;i++ ){if(!this.objectImplements(bh,bg[i])){return false;}
;}
;}
;return true;}
,classImplements:function(bl,bj){if(!this.__H(bl.prototype,bl,bj)||!this.__J(bl,bj)||!this.__K(bl,bj)){return false;}
;var bk=bj.$$extends;if(bk){for(var i=0,l=bk.length;i<l;i++ ){if(!this.has(bl,bk[i])){return false;}
;}
;}
;return true;}
,genericToString:function(){return q+this.name+p;}
,$$registry:{},__L:function(bo,bn,bp,bm){}
,__E:null,__F:function(name,bq){}
}});}
)();
(function(){var b=".prototype",c="$$init_",d="constructor",e="Property module disabled.",f="extend",g="module.property",h="singleton",j="qx.event.type.Data",k="module.events",m="qx.aspects",n="toString",o='extend',p="Array",q="static",r="",s="Events module not enabled.",t="]",u="Class",v="qx.Class",w='"extend" parameter is null or undefined',x="[Class ",y="destructor",z="destruct",A=".",B="member";qx.Bootstrap.define(v,{statics:{__M:qx.core.Environment.get(g)?qx.core.Property:null,define:function(name,F){if(!F){F={};}
;if(F.include&&!(qx.Bootstrap.getClass(F.include)===p)){F.include=[F.include];}
;if(F.implement&&!(qx.Bootstrap.getClass(F.implement)===p)){F.implement=[F.implement];}
;var C=false;if(!F.hasOwnProperty(f)&&!F.type){F.type=q;C=true;}
;{}
;var D=this.__P(name,F.type,F.extend,F.statics,F.construct,F.destruct,F.include);if(F.extend){if(F.properties){this.__R(D,F.properties,true);}
;if(F.members){this.__T(D,F.members,true,true,false);}
;if(F.events){this.__Q(D,F.events,true);}
;if(F.include){for(var i=0,l=F.include.length;i<l;i++ ){this.__X(D,F.include[i],false);}
;}
;}
else if(F.hasOwnProperty(o)&&false){throw new Error(w);}
;if(F.environment){for(var E in F.environment){qx.core.Environment.add(E,F.environment[E]);}
;}
;if(F.implement){for(var i=0,l=F.implement.length;i<l;i++ ){this.__V(D,F.implement[i]);}
;}
;{}
;if(F.defer){F.defer.self=D;F.defer(D,D.prototype,{add:function(name,G){var H={};H[name]=G;qx.Class.__R(D,H,true);}
});}
;return D;}
,undefine:function(name){delete this.$$registry[name];var K=name.split(A);var J=[window];for(var i=0;i<K.length;i++ ){J.push(J[i][K[i]]);}
;for(var i=J.length-1;i>=1;i-- ){var I=J[i];var parent=J[i-1];if(qx.Bootstrap.isFunction(I)||qx.Bootstrap.objectGetLength(I)===0){delete parent[K[i-1]];}
else {break;}
;}
;}
,isDefined:qx.util.OOUtil.classIsDefined,getTotalNumber:function(){return qx.Bootstrap.objectGetLength(this.$$registry);}
,getByName:qx.Bootstrap.getByName,include:function(M,L){{}
;qx.Class.__X(M,L,false);}
,patch:function(O,N){{}
;qx.Class.__X(O,N,true);}
,isSubClassOf:function(Q,P){if(!Q){return false;}
;if(Q==P){return true;}
;if(Q.prototype instanceof P){return true;}
;return false;}
,getPropertyDefinition:qx.util.OOUtil.getPropertyDefinition,getProperties:function(S){var R=[];while(S){if(S.$$properties){R.push.apply(R,Object.keys(S.$$properties));}
;S=S.superclass;}
;return R;}
,getByProperty:function(T,name){while(T){if(T.$$properties&&T.$$properties[name]){return T;}
;T=T.superclass;}
;return null;}
,hasProperty:qx.util.OOUtil.hasProperty,getEventType:qx.util.OOUtil.getEventType,supportsEvent:qx.util.OOUtil.supportsEvent,hasOwnMixin:function(V,U){return V.$$includes&&V.$$includes.indexOf(U)!==-1;}
,getByMixin:function(Y,X){var W,i,l;while(Y){if(Y.$$includes){W=Y.$$flatIncludes;for(i=0,l=W.length;i<l;i++ ){if(W[i]===X){return Y;}
;}
;}
;Y=Y.superclass;}
;return null;}
,getMixins:qx.util.OOUtil.getMixins,hasMixin:function(bb,ba){return !!this.getByMixin(bb,ba);}
,hasOwnInterface:function(bd,bc){return bd.$$implements&&bd.$$implements.indexOf(bc)!==-1;}
,getByInterface:qx.util.OOUtil.getByInterface,getInterfaces:function(bf){var be=[];while(bf){if(bf.$$implements){be.push.apply(be,bf.$$flatImplements);}
;bf=bf.superclass;}
;return be;}
,hasInterface:qx.util.OOUtil.hasInterface,implementsInterface:function(bh,bg){var bi=bh.constructor;if(this.hasInterface(bi,bg)){return true;}
;if(qx.Interface.objectImplements(bh,bg)){return true;}
;if(qx.Interface.classImplements(bi,bg)){return true;}
;return false;}
,getInstance:function(){if(!this.$$instance){this.$$allowconstruct=true;this.$$instance=new this();delete this.$$allowconstruct;}
;return this.$$instance;}
,genericToString:function(){return x+this.classname+t;}
,$$registry:qx.Bootstrap.$$registry,__E:null,__N:null,__F:function(name,bj){}
,__O:function(bk){}
,__P:function(name,bu,bt,bl,br,bp,bo){var bq;if(!bt&&qx.core.Environment.get(m)==false){bq=bl||{};qx.Bootstrap.setDisplayNames(bq,name);}
else {bq={};if(bt){if(!br){br=this.__Y();}
;if(this.__bb(bt,bo)){bq=this.__bc(br,name,bu);}
else {bq=br;}
;if(bu===h){bq.getInstance=this.getInstance;}
;qx.Bootstrap.setDisplayName(br,name,d);}
;if(bl){qx.Bootstrap.setDisplayNames(bl,name);var bs;for(var i=0,a=Object.keys(bl),l=a.length;i<l;i++ ){bs=a[i];var bm=bl[bs];if(qx.core.Environment.get(m)){if(bm instanceof Function){bm=qx.core.Aspect.wrap(name+A+bs,bm,q);}
;bq[bs]=bm;}
else {bq[bs]=bm;}
;}
;}
;}
;var bn=name?qx.Bootstrap.createNamespace(name,bq):r;bq.name=bq.classname=name;bq.basename=bn;bq.$$type=u;if(bu){bq.$$classtype=bu;}
;if(!bq.hasOwnProperty(n)){bq.toString=this.genericToString;}
;if(bt){qx.Bootstrap.extendClass(bq,br,bt,name,bn);if(bp){if(qx.core.Environment.get(m)){bp=qx.core.Aspect.wrap(name,bp,y);}
;bq.$$destructor=bp;qx.Bootstrap.setDisplayName(bp,name,z);}
;}
;this.$$registry[name]=bq;return bq;}
,__Q:function(bv,bw,by){{var bx,bx;}
;if(bv.$$events){for(var bx in bw){bv.$$events[bx]=bw[bx];}
;}
else {bv.$$events=bw;}
;}
,__R:function(bA,bD,bB){if(!qx.core.Environment.get(g)){throw new Error(e);}
;var bC;if(bB===undefined){bB=false;}
;var bz=bA.prototype;for(var name in bD){bC=bD[name];{}
;bC.name=name;if(!bC.refine){if(bA.$$properties===undefined){bA.$$properties={};}
;bA.$$properties[name]=bC;}
;if(bC.init!==undefined){bA.prototype[c+name]=bC.init;}
;if(bC.event!==undefined){if(!qx.core.Environment.get(k)){throw new Error(s);}
;var event={};event[bC.event]=j;this.__Q(bA,event,bB);}
;if(bC.inheritable){this.__M.$$inheritable[name]=true;if(!bz.$$refreshInheritables){this.__M.attachRefreshInheritables(bA);}
;}
;if(!bC.refine){this.__M.attachMethods(bA,name,bC);}
;}
;}
,__S:null,__T:function(bL,bE,bG,bI,bK){var bF=bL.prototype;var bJ,bH;qx.Bootstrap.setDisplayNames(bE,bL.classname+b);for(var i=0,a=Object.keys(bE),l=a.length;i<l;i++ ){bJ=a[i];bH=bE[bJ];{}
;if(bI!==false&&bH instanceof Function&&bH.$$type==null){if(bK==true){bH=this.__U(bH,bF[bJ]);}
else {if(bF[bJ]){bH.base=bF[bJ];}
;bH.self=bL;}
;if(qx.core.Environment.get(m)){bH=qx.core.Aspect.wrap(bL.classname+A+bJ,bH,B);}
;}
;bF[bJ]=bH;}
;}
,__U:function(bM,bN){if(bN){return function(){var bP=bM.base;bM.base=bN;var bO=bM.apply(this,arguments);bM.base=bP;return bO;}
;}
else {return bM;}
;}
,__V:function(bS,bQ){{}
;var bR=qx.Interface.flatten([bQ]);if(bS.$$implements){bS.$$implements.push(bQ);bS.$$flatImplements.push.apply(bS.$$flatImplements,bR);}
else {bS.$$implements=[bQ];bS.$$flatImplements=bR;}
;}
,__W:function(bU){var name=bU.classname;var bT=this.__bc(bU,name,bU.$$classtype);for(var i=0,a=Object.keys(bU),l=a.length;i<l;i++ ){bV=a[i];bT[bV]=bU[bV];}
;bT.prototype=bU.prototype;var bX=bU.prototype;for(var i=0,a=Object.keys(bX),l=a.length;i<l;i++ ){bV=a[i];var bY=bX[bV];if(bY&&bY.self==bU){bY.self=bT;}
;}
;for(var bV in this.$$registry){var bW=this.$$registry[bV];if(!bW){continue;}
;if(bW.base==bU){bW.base=bT;}
;if(bW.superclass==bU){bW.superclass=bT;}
;if(bW.$$original){if(bW.$$original.base==bU){bW.$$original.base=bT;}
;if(bW.$$original.superclass==bU){bW.$$original.superclass=bT;}
;}
;}
;qx.Bootstrap.createNamespace(name,bT);this.$$registry[name]=bT;return bT;}
,__X:function(cf,cd,cc){{}
;if(this.hasMixin(cf,cd)){return;}
;var ca=cf.$$original;if(cd.$$constructor&&!ca){cf=this.__W(cf);}
;var cb=qx.Mixin.flatten([cd]);var ce;for(var i=0,l=cb.length;i<l;i++ ){ce=cb[i];if(ce.$$events){this.__Q(cf,ce.$$events,cc);}
;if(ce.$$properties){this.__R(cf,ce.$$properties,cc);}
;if(ce.$$members){this.__T(cf,ce.$$members,cc,cc,cc);}
;}
;if(cf.$$includes){cf.$$includes.push(cd);cf.$$flatIncludes.push.apply(cf.$$flatIncludes,cb);}
else {cf.$$includes=[cd];cf.$$flatIncludes=cb;}
;}
,__Y:function(){function cg(){cg.base.apply(this,arguments);}
;return cg;}
,__ba:function(){return function(){}
;}
,__bb:function(ci,ch){{}
;if(ci&&ci.$$includes){var cj=ci.$$flatIncludes;for(var i=0,l=cj.length;i<l;i++ ){if(cj[i].$$constructor){return true;}
;}
;}
;if(ch){var ck=qx.Mixin.flatten(ch);for(var i=0,l=ck.length;i<l;i++ ){if(ck[i].$$constructor){return true;}
;}
;}
;return false;}
,__bc:function(cm,name,cl){var co=function(){var cr=co;{}
;var cp=cr.$$original.apply(this,arguments);if(cr.$$includes){var cq=cr.$$flatIncludes;for(var i=0,l=cq.length;i<l;i++ ){if(cq[i].$$constructor){cq[i].$$constructor.apply(this,arguments);}
;}
;}
;{}
;return cp;}
;if(qx.core.Environment.get(m)){var cn=qx.core.Aspect.wrap(name,co,d);co.$$original=cm;co.constructor=cn;co=cn;}
;co.$$original=cm;cm.wrapper=co;return co;}
},defer:function(){if(qx.core.Environment.get(m)){for(var cs in qx.Bootstrap.$$registry){var ct=qx.Bootstrap.$$registry[cs];for(var cu in ct){if(ct[cu] instanceof Function){ct[cu]=qx.core.Aspect.wrap(cs+A+cu,ct[cu],q);}
;}
;}
;}
;}
});}
)();
(function(){var a="qx.debug.databinding",b=". Error message: ",c="Boolean",d="Data after conversion: ",f="set",g="deepBinding",h=")",k=") to the object '",l="item",m="Please use only one array at a time: ",n="Binding executed from ",p="Integer",q="reset",r=" of object ",s="qx.data.SingleValueBinding",t="Binding property ",u="Failed so set value ",v="change",w="Binding could not be found!",x="get",y="^",z=" does not work.",A="String",B=" to ",C="Binding from '",D="",E=" (",F="PositiveNumber",G="Data before conversion: ",H="]",I="[",J=".",K="PositiveInteger",L='No number or \'last\' value hast been given in an array binding: ',M="' (",N=" on ",O="Binding does not exist!",P="Number",Q=").",R=" by ",S="Date",T=" not possible: No event available. ",U="last";qx.Class.define(s,{statics:{__bd:{},bind:function(Y,bm,bk,bb,bj){var bn=this.__bf(Y,bm,bk,bb,bj);var bd=bm.split(J);var X=this.__bl(bd);var bh=[];var bc=[];var be=[];var bi=[];var ba=Y;try{for(var i=0;i<bd.length;i++ ){if(X[i]!==D){bi.push(v);}
else {bi.push(this.__bg(ba,bd[i]));}
;bh[i]=ba;if(i==bd.length-1){if(X[i]!==D){var bp=X[i]===U?ba.length-1:X[i];var W=ba.getItem(bp);this.__bk(W,bk,bb,bj,Y);be[i]=this.__bm(ba,bi[i],bk,bb,bj,X[i]);}
else {if(bd[i]!=null&&ba[x+qx.lang.String.firstUp(bd[i])]!=null){var W=ba[x+qx.lang.String.firstUp(bd[i])]();this.__bk(W,bk,bb,bj,Y);}
;be[i]=this.__bm(ba,bi[i],bk,bb,bj);}
;}
else {var V={index:i,propertyNames:bd,sources:bh,listenerIds:be,arrayIndexValues:X,targetObject:bk,targetPropertyChain:bb,options:bj,listeners:bc};var bg=qx.lang.Function.bind(this.__be,this,V);bc.push(bg);be[i]=ba.addListener(bi[i],bg);}
;if(ba[x+qx.lang.String.firstUp(bd[i])]==null){ba=null;}
else if(X[i]!==D){ba=ba[x+qx.lang.String.firstUp(bd[i])](X[i]);}
else {ba=ba[x+qx.lang.String.firstUp(bd[i])]();}
;if(!ba){break;}
;}
;}
catch(bq){for(var i=0;i<bh.length;i++ ){if(bh[i]&&be[i]){bh[i].removeListenerById(be[i]);}
;}
;var bf=bn.targets;var bl=bn.listenerIds;for(var i=0;i<bf.length;i++ ){if(bf[i]&&bl[i]){bf[i].removeListenerById(bl[i]);}
;}
;throw bq;}
;var bo={type:g,listenerIds:be,sources:bh,targetListenerIds:bn.listenerIds,targets:bn.targets};this.__bn(bo,Y,bm,bk,bb);return bo;}
,__be:function(bx){if(bx.options&&bx.options.onUpdate){bx.options.onUpdate(bx.sources[bx.index],bx.targetObject);}
;for(var j=bx.index+1;j<bx.propertyNames.length;j++ ){var bv=bx.sources[j];bx.sources[j]=null;if(!bv){continue;}
;bv.removeListenerById(bx.listenerIds[j]);}
;var bv=bx.sources[bx.index];for(var j=bx.index+1;j<bx.propertyNames.length;j++ ){if(bx.arrayIndexValues[j-1]!==D){bv=bv[x+qx.lang.String.firstUp(bx.propertyNames[j-1])](bx.arrayIndexValues[j-1]);}
else {bv=bv[x+qx.lang.String.firstUp(bx.propertyNames[j-1])]();}
;bx.sources[j]=bv;if(!bv){if(bx.options&&bx.options.converter){var br=false;if(bx.options.ignoreConverter){var by=bx.propertyNames.slice(0,j).join(J);var bw=by.match(new RegExp(y+bx.options.ignoreConverter));br=bw?bw.length>0:false;}
;var bz=null;if(!br){bz=bx.options.converter();}
;this.__bi(bx.targetObject,bx.targetPropertyChain,bz);}
else {this.__bh(bx.targetObject,bx.targetPropertyChain);}
;break;}
;if(j==bx.propertyNames.length-1){if(qx.Class.implementsInterface(bv,qx.data.IListData)){var bA=bx.arrayIndexValues[j]===U?bv.length-1:bx.arrayIndexValues[j];var bs=bv.getItem(bA);this.__bk(bs,bx.targetObject,bx.targetPropertyChain,bx.options,bx.sources[bx.index]);bx.listenerIds[j]=this.__bm(bv,v,bx.targetObject,bx.targetPropertyChain,bx.options,bx.arrayIndexValues[j]);}
else {if(bx.propertyNames[j]!=null&&bv[x+qx.lang.String.firstUp(bx.propertyNames[j])]!=null){var bs=bv[x+qx.lang.String.firstUp(bx.propertyNames[j])]();this.__bk(bs,bx.targetObject,bx.targetPropertyChain,bx.options,bx.sources[bx.index]);}
;var bt=this.__bg(bv,bx.propertyNames[j]);bx.listenerIds[j]=this.__bm(bv,bt,bx.targetObject,bx.targetPropertyChain,bx.options);}
;}
else {if(bx.listeners[j]==null){var bu=qx.lang.Function.bind(this.__be,this,bx);bx.listeners.push(bu);}
;if(qx.Class.implementsInterface(bv,qx.data.IListData)){var bt=v;}
else {var bt=this.__bg(bv,bx.propertyNames[j]);}
;bx.listenerIds[j]=bv.addListener(bt,bx.listeners[j]);}
;}
;}
,__bf:function(bC,bK,bO,bG,bI){var bF=bG.split(J);var bD=this.__bl(bF);var bN=[];var bM=[];var bH=[];var bL=[];var bE=bO;for(var i=0;i<bF.length-1;i++ ){if(bD[i]!==D){bL.push(v);}
else {try{bL.push(this.__bg(bE,bF[i]));}
catch(e){break;}
;}
;bN[i]=bE;var bJ=function(){for(var j=i+1;j<bF.length-1;j++ ){var bR=bN[j];bN[j]=null;if(!bR){continue;}
;bR.removeListenerById(bH[j]);}
;var bR=bN[i];for(var j=i+1;j<bF.length-1;j++ ){var bP=qx.lang.String.firstUp(bF[j-1]);if(bD[j-1]!==D){var bS=bD[j-1]===U?bR.getLength()-1:bD[j-1];bR=bR[x+bP](bS);}
else {bR=bR[x+bP]();}
;bN[j]=bR;if(bM[j]==null){bM.push(bJ);}
;if(qx.Class.implementsInterface(bR,qx.data.IListData)){var bQ=v;}
else {try{var bQ=qx.data.SingleValueBinding.__bg(bR,bF[j]);}
catch(e){break;}
;}
;bH[j]=bR.addListener(bQ,bM[j]);}
;qx.data.SingleValueBinding.updateTarget(bC,bK,bO,bG,bI);}
;bM.push(bJ);bH[i]=bE.addListener(bL[i],bJ);var bB=qx.lang.String.firstUp(bF[i]);if(bE[x+bB]==null){bE=null;}
else if(bD[i]!==D){bE=bE[x+bB](bD[i]);}
else {bE=bE[x+bB]();}
;if(!bE){break;}
;}
;return {listenerIds:bH,targets:bN};}
,updateTarget:function(bT,bW,bY,bU,bX){var bV=this.resolvePropertyChain(bT,bW);bV=qx.data.SingleValueBinding.__bo(bV,bY,bU,bX,bT);this.__bi(bY,bU,bV);}
,resolvePropertyChain:function(o,cd){var cc=this.__bj(o,cd);var ce;if(cc!=null){var cg=cd.substring(cd.lastIndexOf(J)+1,cd.length);if(cg.charAt(cg.length-1)==H){var ca=cg.substring(cg.lastIndexOf(I)+1,cg.length-1);var cb=cg.substring(0,cg.lastIndexOf(I));var cf=cc[x+qx.lang.String.firstUp(cb)]();if(ca==U){ca=cf.length-1;}
;if(cf!=null){ce=cf.getItem(ca);}
;}
else {ce=cc[x+qx.lang.String.firstUp(cg)]();}
;}
;return ce;}
,__bg:function(ci,cj){var ch=this.__bp(ci,cj);if(ch==null){if(qx.Class.supportsEvent(ci.constructor,cj)){ch=cj;}
else if(qx.Class.supportsEvent(ci.constructor,v+qx.lang.String.firstUp(cj))){ch=v+qx.lang.String.firstUp(cj);}
else {throw new qx.core.AssertionError(t+cj+r+ci+T);}
;}
;return ch;}
,__bh:function(cm,ck){var cl=this.__bj(cm,ck);if(cl!=null){var cn=ck.substring(ck.lastIndexOf(J)+1,ck.length);if(cn.charAt(cn.length-1)==H){this.__bi(cm,ck,null);return;}
;if(cl[q+qx.lang.String.firstUp(cn)]!=undefined){cl[q+qx.lang.String.firstUp(cn)]();}
else {cl[f+qx.lang.String.firstUp(cn)](null);}
;}
;}
,__bi:function(cu,cq,cr){var cp=this.__bj(cu,cq);if(cp!=null){var cv=cq.substring(cq.lastIndexOf(J)+1,cq.length);if(cv.charAt(cv.length-1)==H){var co=cv.substring(cv.lastIndexOf(I)+1,cv.length-1);var cs=cv.substring(0,cv.lastIndexOf(I));var ct=cu;if(!qx.Class.implementsInterface(ct,qx.data.IListData)){ct=cp[x+qx.lang.String.firstUp(cs)]();}
;if(co==U){co=ct.length-1;}
;if(ct!=null){ct.setItem(co,cr);}
;}
else {cp[f+qx.lang.String.firstUp(cv)](cr);}
;}
;}
,__bj:function(cB,cy){var cA=cy.split(J);var cx=cB;for(var i=0;i<cA.length-1;i++ ){try{var cz=cA[i];if(cz.indexOf(H)==cz.length-1){var cw=cz.substring(cz.indexOf(I)+1,cz.length-1);cz=cz.substring(0,cz.indexOf(I));}
;if(cz!=D){cx=cx[x+qx.lang.String.firstUp(cz)]();}
;if(cw!=null){if(cw==U){cw=cx.length-1;}
;cx=cx.getItem(cw);cw=null;}
;}
catch(cC){return null;}
;}
;return cx;}
,__bk:function(cH,cD,cF,cG,cE){cH=this.__bo(cH,cD,cF,cG,cE);if(cH===undefined){this.__bh(cD,cF);}
;if(cH!==undefined){try{this.__bi(cD,cF,cH);if(cG&&cG.onUpdate){cG.onUpdate(cE,cD,cH);}
;}
catch(e){if(!(e instanceof qx.core.ValidationError)){throw e;}
;if(cG&&cG.onSetFail){cG.onSetFail(e);}
else {qx.log.Logger.warn(u+cH+N+cD+b+e);}
;}
;}
;}
,__bl:function(cI){var cJ=[];for(var i=0;i<cI.length;i++ ){var name=cI[i];if(qx.lang.String.endsWith(name,H)){var cK=name.substring(name.indexOf(I)+1,name.indexOf(H));if(name.indexOf(H)!=name.length-1){throw new Error(m+name+z);}
;if(cK!==U){if(cK==D||isNaN(parseInt(cK,10))){throw new Error(L+name+z);}
;}
;if(name.indexOf(I)!=0){cI[i]=name.substring(0,name.indexOf(I));cJ[i]=D;cJ[i+1]=cK;cI.splice(i+1,0,l);i++ ;}
else {cJ[i]=cK;cI.splice(i,1,l);}
;}
else {cJ[i]=D;}
;}
;return cJ;}
,__bm:function(cL,cO,cT,cR,cP,cN){{var cM;}
;var cQ=function(cW,e){if(cW!==D){if(cW===U){cW=cL.length-1;}
;var cX=cL.getItem(cW);if(cX===undefined){qx.data.SingleValueBinding.__bh(cT,cR);}
;var cV=e.getData().start;var cU=e.getData().end;if(cW<cV||cW>cU){return;}
;}
else {var cX=e.getData();}
;if(qx.core.Environment.get(a)){qx.log.Logger.debug(n+cL+R+cO+B+cT+E+cR+h);qx.log.Logger.debug(G+cX);}
;cX=qx.data.SingleValueBinding.__bo(cX,cT,cR,cP,cL);if(qx.core.Environment.get(a)){qx.log.Logger.debug(d+cX);}
;try{if(cX!==undefined){qx.data.SingleValueBinding.__bi(cT,cR,cX);}
else {qx.data.SingleValueBinding.__bh(cT,cR);}
;if(cP&&cP.onUpdate){cP.onUpdate(cL,cT,cX);}
;}
catch(cY){if(!(cY instanceof qx.core.ValidationError)){throw cY;}
;if(cP&&cP.onSetFail){cP.onSetFail(cY);}
else {qx.log.Logger.warn(u+cX+N+cT+b+cY);}
;}
;}
;if(!cN){cN=D;}
;cQ=qx.lang.Function.bind(cQ,cL,cN);var cS=cL.addListener(cO,cQ);return cS;}
,__bn:function(de,da,dd,db,dc){if(this.__bd[da.toHashCode()]===undefined){this.__bd[da.toHashCode()]=[];}
;this.__bd[da.toHashCode()].push([de,da,dd,db,dc]);}
,__bo:function(di,dn,dh,dj,df){if(dj&&dj.converter){var dk;if(dn.getModel){dk=dn.getModel();}
;return dj.converter(di,dk,df,dn);}
else {var dg=this.__bj(dn,dh);var dp=dh.substring(dh.lastIndexOf(J)+1,dh.length);if(dg==null){return di;}
;var dl=qx.Class.getPropertyDefinition(dg.constructor,dp);var dm=dl==null?D:dl.check;return this.__bq(di,dm);}
;}
,__bp:function(dq,ds){var dr=qx.Class.getPropertyDefinition(dq.constructor,ds);if(dr==null){return null;}
;return dr.event;}
,__bq:function(dv,du){var dt=qx.lang.Type.getClass(dv);if((dt==P||dt==A)&&(du==p||du==K)){dv=parseInt(dv,10);}
;if((dt==c||dt==P||dt==S)&&du==A){dv=dv+D;}
;if((dt==P||dt==A)&&(du==P||du==F)){dv=parseFloat(dv);}
;return dv;}
,removeBindingFromObject:function(dw,dy){if(dy.type==g){for(var i=0;i<dy.sources.length;i++ ){if(dy.sources[i]){dy.sources[i].removeListenerById(dy.listenerIds[i]);}
;}
;for(var i=0;i<dy.targets.length;i++ ){if(dy.targets[i]){dy.targets[i].removeListenerById(dy.targetListenerIds[i]);}
;}
;}
else {dw.removeListenerById(dy);}
;var dx=this.__bd[dw.toHashCode()];if(dx!=undefined){for(var i=0;i<dx.length;i++ ){if(dx[i][0]==dy){qx.lang.Array.remove(dx,dx[i]);return;}
;}
;}
;throw new Error(w);}
,removeAllBindingsForObject:function(dA){{}
;var dz=this.__bd[dA.toHashCode()];if(dz!=undefined){for(var i=dz.length-1;i>=0;i-- ){this.removeBindingFromObject(dA,dz[i][0]);}
;}
;}
,getAllBindingsForObject:function(dB){if(this.__bd[dB.toHashCode()]===undefined){this.__bd[dB.toHashCode()]=[];}
;return this.__bd[dB.toHashCode()];}
,removeAllBindings:function(){for(var dD in this.__bd){var dC=qx.core.ObjectRegistry.fromHashCode(dD);if(dC==null){delete this.__bd[dD];continue;}
;this.removeAllBindingsForObject(dC);}
;this.__bd={};}
,getAllBindings:function(){return this.__bd;}
,showBindingInLog:function(dF,dH){var dG;for(var i=0;i<this.__bd[dF.toHashCode()].length;i++ ){if(this.__bd[dF.toHashCode()][i][0]==dH){dG=this.__bd[dF.toHashCode()][i];break;}
;}
;if(dG===undefined){var dE=O;}
else {var dE=C+dG[1]+M+dG[2]+k+dG[3]+M+dG[4]+Q;}
;qx.log.Logger.debug(dE);}
,showAllBindingsInLog:function(){for(var dJ in this.__bd){var dI=qx.core.ObjectRegistry.fromHashCode(dJ);for(var i=0;i<this.__bd[dJ].length;i++ ){this.showBindingInLog(dI,this.__bd[dJ][i][0]);}
;}
;}
}});}
)();
(function(){var a="qx.util.RingBuffer";qx.Class.define(a,{extend:Object,construct:function(b){this.setMaxEntries(b||50);}
,members:{__br:0,__bs:0,__bt:false,__bu:0,__bv:null,__bw:null,setMaxEntries:function(c){this.__bw=c;this.clear();}
,getMaxEntries:function(){return this.__bw;}
,addEntry:function(d){this.__bv[this.__br]=d;this.__br=this.__bx(this.__br,1);var e=this.getMaxEntries();if(this.__bs<e){this.__bs++ ;}
;if(this.__bt&&(this.__bu<e)){this.__bu++ ;}
;}
,mark:function(){this.__bt=true;this.__bu=0;}
,clearMark:function(){this.__bt=false;}
,getAllEntries:function(){return this.getEntries(this.getMaxEntries(),false);}
,getEntries:function(f,j){if(f>this.__bs){f=this.__bs;}
;if(j&&this.__bt&&(f>this.__bu)){f=this.__bu;}
;if(f>0){var h=this.__bx(this.__br,-1);var g=this.__bx(h,-f+1);var i;if(g<=h){i=this.__bv.slice(g,h+1);}
else {i=this.__bv.slice(g,this.__bs).concat(this.__bv.slice(0,h+1));}
;}
else {i=[];}
;return i;}
,clear:function(){this.__bv=new Array(this.getMaxEntries());this.__bs=0;this.__bu=0;this.__br=0;}
,__bx:function(n,l){var k=this.getMaxEntries();var m=(n+l)%k;if(m<0){m+=k;}
;return m;}
}});}
)();
(function(){var a="qx.log.appender.RingBuffer";qx.Class.define(a,{extend:qx.util.RingBuffer,construct:function(b){this.setMaxMessages(b||50);}
,members:{setMaxMessages:function(c){this.setMaxEntries(c);}
,getMaxMessages:function(){return this.getMaxEntries();}
,process:function(d){this.addEntry(d);}
,getAllLogEvents:function(){return this.getAllEntries();}
,retrieveLogEvents:function(e,f){return this.getEntries(e,f);}
,clearHistory:function(){this.clear();}
}});}
)();
(function(){var a="qx.lang.Type",b="Error",c="RegExp",d="Date",e="Number",f="Boolean";qx.Bootstrap.define(a,{statics:{getClass:qx.Bootstrap.getClass,isString:qx.Bootstrap.isString,isArray:qx.Bootstrap.isArray,isObject:qx.Bootstrap.isObject,isFunction:qx.Bootstrap.isFunction,isRegExp:function(g){return this.getClass(g)==c;}
,isNumber:function(h){return (h!==null&&(this.getClass(h)==e||h instanceof Number));}
,isBoolean:function(i){return (i!==null&&(this.getClass(i)==f||i instanceof Boolean));}
,isDate:function(j){return (j!==null&&(this.getClass(j)==d||j instanceof Date));}
,isError:function(k){return (k!==null&&(this.getClass(k)==b||k instanceof Error));}
}});}
)();
(function(){var a="mshtml",b="engine.name",c="[object Array]",d="qx.lang.Array",e="Cannot clean-up map entry doneObjects[",f="]",g="qx",h="number",j="][",k="string";qx.Bootstrap.define(d,{statics:{cast:function(m,o,p){if(m.constructor===o){return m;}
;if(qx.data&&qx.data.IListData){if(qx.Class&&qx.Class.hasInterface(m,qx.data.IListData)){var m=m.toArray();}
;}
;var n=new o;if((qx.core.Environment.get(b)==a)){if(m.item){for(var i=p||0,l=m.length;i<l;i++ ){n.push(m[i]);}
;return n;}
;}
;if(Object.prototype.toString.call(m)===c&&p==null){n.push.apply(n,m);}
else {n.push.apply(n,Array.prototype.slice.call(m,p||0));}
;return n;}
,fromArguments:function(q,r){return Array.prototype.slice.call(q,r||0);}
,fromCollection:function(t){if((qx.core.Environment.get(b)==a)){if(t.item){var s=[];for(var i=0,l=t.length;i<l;i++ ){s[i]=t[i];}
;return s;}
;}
;return Array.prototype.slice.call(t,0);}
,fromShortHand:function(u){var w=u.length;var v=qx.lang.Array.clone(u);switch(w){case 1:v[1]=v[2]=v[3]=v[0];break;case 2:v[2]=v[0];case 3:v[3]=v[1];};return v;}
,clone:function(x){return x.concat();}
,insertAt:function(y,z,i){y.splice(i,0,z);return y;}
,insertBefore:function(A,C,B){var i=A.indexOf(B);if(i==-1){A.push(C);}
else {A.splice(i,0,C);}
;return A;}
,insertAfter:function(D,F,E){var i=D.indexOf(E);if(i==-1||i==(D.length-1)){D.push(F);}
else {D.splice(i+1,0,F);}
;return D;}
,removeAt:function(G,i){return G.splice(i,1)[0];}
,removeAll:function(H){H.length=0;return this;}
,append:function(J,I){{}
;Array.prototype.push.apply(J,I);return J;}
,exclude:function(M,L){{}
;for(var i=0,N=L.length,K;i<N;i++ ){K=M.indexOf(L[i]);if(K!=-1){M.splice(K,1);}
;}
;return M;}
,remove:function(O,P){var i=O.indexOf(P);if(i!=-1){O.splice(i,1);return P;}
;}
,contains:function(Q,R){return Q.indexOf(R)!==-1;}
,equals:function(T,S){var length=T.length;if(length!==S.length){return false;}
;for(var i=0;i<length;i++ ){if(T[i]!==S[i]){return false;}
;}
;return true;}
,sum:function(U){var V=0;for(var i=0,l=U.length;i<l;i++ ){V+=U[i];}
;return V;}
,max:function(W){{}
;var i,Y=W.length,X=W[0];for(i=1;i<Y;i++ ){if(W[i]>X){X=W[i];}
;}
;return X===undefined?null:X;}
,min:function(ba){{}
;var i,bc=ba.length,bb=ba[0];for(i=1;i<bc;i++ ){if(ba[i]<bb){bb=ba[i];}
;}
;return bb===undefined?null:bb;}
,unique:function(bf){var bp=[],be={},bi={},bk={};var bj,bd=0;var bn=g+Date.now();var bg=false,bl=false,bo=false;for(var i=0,bm=bf.length;i<bm;i++ ){bj=bf[i];if(bj===null){if(!bg){bg=true;bp.push(bj);}
;}
else if(bj===undefined){}
else if(bj===false){if(!bl){bl=true;bp.push(bj);}
;}
else if(bj===true){if(!bo){bo=true;bp.push(bj);}
;}
else if(typeof bj===k){if(!be[bj]){be[bj]=1;bp.push(bj);}
;}
else if(typeof bj===h){if(!bi[bj]){bi[bj]=1;bp.push(bj);}
;}
else {var bh=bj[bn];if(bh==null){bh=bj[bn]=bd++ ;}
;if(!bk[bh]){bk[bh]=bj;bp.push(bj);}
;}
;}
;for(var bh in bk){try{delete bk[bh][bn];}
catch(bq){try{bk[bh][bn]=null;}
catch(br){throw new Error(e+bh+j+bn+f);}
;}
;}
;return bp;}
}});}
)();
(function(){var a=" != ",b="qx.core.Object",c="Expected value to be an array but found ",d="' (rgb(",f=") was fired.",g="Expected value to be an integer >= 0 but found ",h="' to be not equal with '",j="' to '",k="Expected object '",m="Called assertTrue with '",n="Expected value to be a map but found ",o="The function did not raise an exception!",p="Expected value to be undefined but found ",q="Expected value to be a DOM element but found  '",r="Expected value to be a regular expression but found ",s="' to implement the interface '",t="Expected value to be null but found ",u="Invalid argument 'type'",v="Called assert with 'false'",w="Assertion error! ",x="'",y="null",z="' but found '",A="'undefined'",B=",",C="' must must be a key of the map '",D="Expected '",E="The String '",F="Expected value to be a string but found ",G="Event (",H="Expected value to be the CSS color '",I="!",J="Expected value not to be undefined but found undefined!",K="qx.util.ColorUtil",L=": ",M="The raised exception does not have the expected type! ",N=") not fired.",O="'!",P="qx.core.Assert",Q="",R="Expected value to be typeof object but found ",S="' but found ",T="' (identical) but found '",U="' must have any of the values defined in the array '",V="Expected value to be a number but found ",W="Called assertFalse with '",X="qx.ui.core.Widget",Y="]",bJ="Expected value to be a qooxdoo object but found ",bK="' arguments.",bL="Expected value '%1' to be in the range '%2'..'%3'!",bF="Array[",bG="' does not match the regular expression '",bH="' to be not identical with '",bI="Expected [",bP="' arguments but found '",bQ="', which cannot be converted to a CSS color!",bR=", ",cg="qx.core.AssertionError",bM="Expected value to be a boolean but found ",bN="Expected value not to be null but found null!",bO="))!",bD="Expected value to be a qooxdoo widget but found ",bU="The value '",bE="Expected value to be typeof '",bV="\n Stack trace: \n",bW="Expected value to be typeof function but found ",cb="Expected value to be an integer but found ",bS="Called fail().",cf="The parameter 're' must be a string or a regular expression.",bT=")), but found value '",bX="qx.util.ColorUtil not available! Your code must have a dependency on 'qx.util.ColorUtil'",bY="Expected value to be a number >= 0 but found ",ca="Expected value to be instanceof '",cc="], but found [",cd="Wrong number of arguments given. Expected '",ce="object";qx.Class.define(P,{statics:{__by:true,__bz:function(ch,ci){var cm=Q;for(var i=1,l=arguments.length;i<l;i++ ){cm=cm+this.__bA(arguments[i]===undefined?A:arguments[i]);}
;var cl=Q;if(cm){cl=ch+L+cm;}
else {cl=ch;}
;var ck=w+cl;if(qx.Class.isDefined(cg)){var cj=new qx.core.AssertionError(ch,cm);if(this.__by){qx.Bootstrap.error(ck+bV+cj.getStackTrace());}
;throw cj;}
else {if(this.__by){qx.Bootstrap.error(ck);}
;throw new Error(ck);}
;}
,__bA:function(co){var cn;if(co===null){cn=y;}
else if(qx.lang.Type.isArray(co)&&co.length>10){cn=bF+co.length+Y;}
else if((co instanceof Object)&&(co.toString==null)){cn=qx.lang.Json.stringify(co,null,2);}
else {try{cn=co.toString();}
catch(e){cn=Q;}
;}
;return cn;}
,assert:function(cq,cp){cq==true||this.__bz(cp||Q,v);}
,fail:function(cr,cs){var ct=cs?Q:bS;this.__bz(cr||Q,ct);}
,assertTrue:function(cv,cu){(cv===true)||this.__bz(cu||Q,m,cv,x);}
,assertFalse:function(cx,cw){(cx===false)||this.__bz(cw||Q,W,cx,x);}
,assertEquals:function(cy,cz,cA){cy==cz||this.__bz(cA||Q,D,cy,z,cz,O);}
,assertNotEquals:function(cB,cC,cD){cB!=cC||this.__bz(cD||Q,D,cB,h,cC,O);}
,assertIdentical:function(cE,cF,cG){cE===cF||this.__bz(cG||Q,D,cE,T,cF,O);}
,assertNotIdentical:function(cH,cI,cJ){cH!==cI||this.__bz(cJ||Q,D,cH,bH,cI,O);}
,assertNotUndefined:function(cL,cK){cL!==undefined||this.__bz(cK||Q,J);}
,assertUndefined:function(cN,cM){cN===undefined||this.__bz(cM||Q,p,cN,I);}
,assertNotNull:function(cP,cO){cP!==null||this.__bz(cO||Q,bN);}
,assertNull:function(cR,cQ){cR===null||this.__bz(cQ||Q,t,cR,I);}
,assertJsonEquals:function(cS,cT,cU){this.assertEquals(qx.lang.Json.stringify(cS),qx.lang.Json.stringify(cT),cU);}
,assertMatch:function(cX,cW,cV){this.assertString(cX);this.assert(qx.lang.Type.isRegExp(cW)||qx.lang.Type.isString(cW),cf);cX.search(cW)>=0||this.__bz(cV||Q,E,cX,bG,cW.toString(),O);}
,assertArgumentsCount:function(db,dc,dd,cY){var da=db.length;(da>=dc&&da<=dd)||this.__bz(cY||Q,cd,dc,j,dd,bP,da,bK);}
,assertEventFired:function(de,event,dh,di,dj){var df=false;var dg=function(e){if(di){di.call(de,e);}
;df=true;}
;var dk;try{dk=de.addListener(event,dg,de);dh.call(de);}
catch(dl){throw dl;}
finally{try{de.removeListenerById(dk);}
catch(dm){}
;}
;df===true||this.__bz(dj||Q,G,event,N);}
,assertEventNotFired:function(dn,event,dr,ds){var dp=false;var dq=function(e){dp=true;}
;var dt=dn.addListener(event,dq,dn);dr.call();dp===false||this.__bz(ds||Q,G,event,f);dn.removeListenerById(dt);}
,assertException:function(dx,dw,dv,du){var dw=dw||Error;var dy;try{this.__by=false;dx();}
catch(dz){dy=dz;}
finally{this.__by=true;}
;if(dy==null){this.__bz(du||Q,o);}
;dy instanceof dw||this.__bz(du||Q,M,dw,a,dy);if(dv){this.assertMatch(dy.toString(),dv,du);}
;}
,assertInArray:function(dC,dB,dA){dB.indexOf(dC)!==-1||this.__bz(dA||Q,bU,dC,U,dB,x);}
,assertArrayEquals:function(dD,dE,dF){this.assertArray(dD,dF);this.assertArray(dE,dF);dF=dF||bI+dD.join(bR)+cc+dE.join(bR)+Y;if(dD.length!==dE.length){this.fail(dF,true);}
;for(var i=0;i<dD.length;i++ ){if(dD[i]!==dE[i]){this.fail(dF,true);}
;}
;}
,assertKeyInMap:function(dI,dH,dG){dH[dI]!==undefined||this.__bz(dG||Q,bU,dI,C,dH,x);}
,assertFunction:function(dK,dJ){qx.lang.Type.isFunction(dK)||this.__bz(dJ||Q,bW,dK,I);}
,assertString:function(dM,dL){qx.lang.Type.isString(dM)||this.__bz(dL||Q,F,dM,I);}
,assertBoolean:function(dO,dN){qx.lang.Type.isBoolean(dO)||this.__bz(dN||Q,bM,dO,I);}
,assertNumber:function(dQ,dP){(qx.lang.Type.isNumber(dQ)&&isFinite(dQ))||this.__bz(dP||Q,V,dQ,I);}
,assertPositiveNumber:function(dS,dR){(qx.lang.Type.isNumber(dS)&&isFinite(dS)&&dS>=0)||this.__bz(dR||Q,bY,dS,I);}
,assertInteger:function(dU,dT){(qx.lang.Type.isNumber(dU)&&isFinite(dU)&&dU%1===0)||this.__bz(dT||Q,cb,dU,I);}
,assertPositiveInteger:function(dX,dV){var dW=(qx.lang.Type.isNumber(dX)&&isFinite(dX)&&dX%1===0&&dX>=0);dW||this.__bz(dV||Q,g,dX,I);}
,assertInRange:function(eb,ec,ea,dY){(eb>=ec&&eb<=ea)||this.__bz(dY||Q,qx.lang.String.format(bL,[eb,ec,ea]));}
,assertObject:function(ee,ed){var ef=ee!==null&&(qx.lang.Type.isObject(ee)||typeof ee===ce);ef||this.__bz(ed||Q,R,(ee),I);}
,assertArray:function(eh,eg){qx.lang.Type.isArray(eh)||this.__bz(eg||Q,c,eh,I);}
,assertMap:function(ej,ei){qx.lang.Type.isObject(ej)||this.__bz(ei||Q,n,ej,I);}
,assertRegExp:function(el,ek){qx.lang.Type.isRegExp(el)||this.__bz(ek||Q,r,el,I);}
,assertType:function(eo,en,em){this.assertString(en,u);typeof (eo)===en||this.__bz(em||Q,bE,en,S,eo,I);}
,assertInstance:function(er,es,ep){var eq=es.classname||es+Q;er instanceof es||this.__bz(ep||Q,ca,eq,S,er,I);}
,assertInterface:function(ev,eu,et){qx.Class.implementsInterface(ev,eu)||this.__bz(et||Q,k,ev,s,eu,O);}
,assertCssColor:function(eC,ez,eB){var ew=qx.Class.getByName(K);if(!ew){throw new Error(bX);}
;var ey=ew.stringToRgb(eC);try{var eA=ew.stringToRgb(ez);}
catch(eE){this.__bz(eB||Q,H,eC,d,ey.join(B),bT,ez,bQ);}
;var eD=ey[0]==eA[0]&&ey[1]==eA[1]&&ey[2]==eA[2];eD||this.__bz(eB||Q,H,ey,d,ey.join(B),bT,ez,d,eA.join(B),bO);}
,assertElement:function(eG,eF){!!(eG&&eG.nodeType===1)||this.__bz(eF||Q,q,eG,O);}
,assertQxObject:function(eI,eH){this.__bB(eI,b)||this.__bz(eH||Q,bJ,eI,I);}
,assertQxWidget:function(eK,eJ){this.__bB(eK,X)||this.__bz(eJ||Q,bD,eK,I);}
,__bB:function(eM,eL){if(!eM){return false;}
;var eN=eM.constructor;while(eN){if(eN.classname===eL){return true;}
;eN=eN.superclass;}
;return false;}
}});}
)();
(function(){var a="-",b="]",c='\\u',d="undefined",e="",f='\\$1',g="0041-005A0061-007A00AA00B500BA00C0-00D600D8-00F600F8-02C102C6-02D102E0-02E402EC02EE0370-037403760377037A-037D03860388-038A038C038E-03A103A3-03F503F7-0481048A-05250531-055605590561-058705D0-05EA05F0-05F20621-064A066E066F0671-06D306D506E506E606EE06EF06FA-06FC06FF07100712-072F074D-07A507B107CA-07EA07F407F507FA0800-0815081A082408280904-0939093D09500958-0961097109720979-097F0985-098C098F09900993-09A809AA-09B009B209B6-09B909BD09CE09DC09DD09DF-09E109F009F10A05-0A0A0A0F0A100A13-0A280A2A-0A300A320A330A350A360A380A390A59-0A5C0A5E0A72-0A740A85-0A8D0A8F-0A910A93-0AA80AAA-0AB00AB20AB30AB5-0AB90ABD0AD00AE00AE10B05-0B0C0B0F0B100B13-0B280B2A-0B300B320B330B35-0B390B3D0B5C0B5D0B5F-0B610B710B830B85-0B8A0B8E-0B900B92-0B950B990B9A0B9C0B9E0B9F0BA30BA40BA8-0BAA0BAE-0BB90BD00C05-0C0C0C0E-0C100C12-0C280C2A-0C330C35-0C390C3D0C580C590C600C610C85-0C8C0C8E-0C900C92-0CA80CAA-0CB30CB5-0CB90CBD0CDE0CE00CE10D05-0D0C0D0E-0D100D12-0D280D2A-0D390D3D0D600D610D7A-0D7F0D85-0D960D9A-0DB10DB3-0DBB0DBD0DC0-0DC60E01-0E300E320E330E40-0E460E810E820E840E870E880E8A0E8D0E94-0E970E99-0E9F0EA1-0EA30EA50EA70EAA0EAB0EAD-0EB00EB20EB30EBD0EC0-0EC40EC60EDC0EDD0F000F40-0F470F49-0F6C0F88-0F8B1000-102A103F1050-1055105A-105D106110651066106E-10701075-1081108E10A0-10C510D0-10FA10FC1100-1248124A-124D1250-12561258125A-125D1260-1288128A-128D1290-12B012B2-12B512B8-12BE12C012C2-12C512C8-12D612D8-13101312-13151318-135A1380-138F13A0-13F41401-166C166F-167F1681-169A16A0-16EA1700-170C170E-17111720-17311740-17511760-176C176E-17701780-17B317D717DC1820-18771880-18A818AA18B0-18F51900-191C1950-196D1970-19741980-19AB19C1-19C71A00-1A161A20-1A541AA71B05-1B331B45-1B4B1B83-1BA01BAE1BAF1C00-1C231C4D-1C4F1C5A-1C7D1CE9-1CEC1CEE-1CF11D00-1DBF1E00-1F151F18-1F1D1F20-1F451F48-1F4D1F50-1F571F591F5B1F5D1F5F-1F7D1F80-1FB41FB6-1FBC1FBE1FC2-1FC41FC6-1FCC1FD0-1FD31FD6-1FDB1FE0-1FEC1FF2-1FF41FF6-1FFC2071207F2090-209421022107210A-211321152119-211D212421262128212A-212D212F-2139213C-213F2145-2149214E218321842C00-2C2E2C30-2C5E2C60-2CE42CEB-2CEE2D00-2D252D30-2D652D6F2D80-2D962DA0-2DA62DA8-2DAE2DB0-2DB62DB8-2DBE2DC0-2DC62DC8-2DCE2DD0-2DD62DD8-2DDE2E2F300530063031-3035303B303C3041-3096309D-309F30A1-30FA30FC-30FF3105-312D3131-318E31A0-31B731F0-31FF3400-4DB54E00-9FCBA000-A48CA4D0-A4FDA500-A60CA610-A61FA62AA62BA640-A65FA662-A66EA67F-A697A6A0-A6E5A717-A71FA722-A788A78BA78CA7FB-A801A803-A805A807-A80AA80C-A822A840-A873A882-A8B3A8F2-A8F7A8FBA90A-A925A930-A946A960-A97CA984-A9B2A9CFAA00-AA28AA40-AA42AA44-AA4BAA60-AA76AA7AAA80-AAAFAAB1AAB5AAB6AAB9-AABDAAC0AAC2AADB-AADDABC0-ABE2AC00-D7A3D7B0-D7C6D7CB-D7FBF900-FA2DFA30-FA6DFA70-FAD9FB00-FB06FB13-FB17FB1DFB1F-FB28FB2A-FB36FB38-FB3CFB3EFB40FB41FB43FB44FB46-FBB1FBD3-FD3DFD50-FD8FFD92-FDC7FDF0-FDFBFE70-FE74FE76-FEFCFF21-FF3AFF41-FF5AFF66-FFBEFFC2-FFC7FFCA-FFCFFFD2-FFD7FFDA-FFDC",h="\\\\",j='-',k="g",l="\\\"",m="qx.lang.String",n="(^|[^",o="0",p="%",q='"',r=' ',s='\n',t="])[";qx.Bootstrap.define(m,{statics:{__bC:g,__bD:null,__bE:{},camelCase:function(v){var u=this.__bE[v];if(!u){u=v.replace(/\-([a-z])/g,function(x,w){return w.toUpperCase();}
);if(v.indexOf(a)>=0){this.__bE[v]=u;}
;}
;return u;}
,hyphenate:function(z){var y=this.__bE[z];if(!y){y=z.replace(/[A-Z]/g,function(A){return (j+A.charAt(0).toLowerCase());}
);if(z.indexOf(a)==-1){this.__bE[z]=y;}
;}
;return y;}
,capitalize:function(C){if(this.__bD===null){var B=c;this.__bD=new RegExp(n+this.__bC.replace(/[0-9A-F]{4}/g,function(D){return B+D;}
)+t+this.__bC.replace(/[0-9A-F]{4}/g,function(E){return B+E;}
)+b,k);}
;return C.replace(this.__bD,function(F){return F.toUpperCase();}
);}
,clean:function(G){return G.replace(/\s+/g,r).trim();}
,trimLeft:function(H){return H.replace(/^\s+/,e);}
,trimRight:function(I){return I.replace(/\s+$/,e);}
,startsWith:function(K,J){return K.indexOf(J)===0;}
,endsWith:function(M,L){return M.substring(M.length-L.length,M.length)===L;}
,repeat:function(N,O){return N.length>0?new Array(O+1).join(N):e;}
,pad:function(Q,length,P){var R=length-Q.length;if(R>0){if(typeof P===d){P=o;}
;return this.repeat(P,R)+Q;}
else {return Q;}
;}
,firstUp:qx.Bootstrap.firstUp,firstLow:qx.Bootstrap.firstLow,contains:function(T,S){return T.indexOf(S)!=-1;}
,format:function(U,V){var W=U;var i=V.length;while(i-- ){W=W.replace(new RegExp(p+(i+1),k),V[i]+e);}
;return W;}
,escapeRegexpChars:function(X){return X.replace(/([.*+?^${}()|[\]\/\\])/g,f);}
,toArray:function(Y){return Y.split(/\B|\b/g);}
,stripTags:function(ba){return ba.replace(/<\/?[^>]+>/gi,e);}
,stripScripts:function(bd,bc){var be=e;var bb=bd.replace(/<script[^>]*>([\s\S]*?)<\/script>/gi,function(){be+=arguments[1]+s;return e;}
);if(bc===true){qx.lang.Function.globalEval(be);}
;return bb;}
,quote:function(bf){return q+bf.replace(/\\/g,h).replace(/\"/g,l)+q;}
}});}
)();
(function(){var a='anonymous()',b="()",c="qx.lang.Function",d=".",e=".prototype.",f=".constructor()";qx.Bootstrap.define(c,{statics:{getCaller:function(g){return g.caller?g.caller.callee:g.callee.caller;}
,getName:function(h){if(h.displayName){return h.displayName;}
;if(h.$$original||h.wrapper||h.classname){return h.classname+f;}
;if(h.$$mixin){for(var i in h.$$mixin.$$members){if(h.$$mixin.$$members[i]==h){return h.$$mixin.name+e+i+b;}
;}
;for(var i in h.$$mixin){if(h.$$mixin[i]==h){return h.$$mixin.name+d+i+b;}
;}
;}
;if(h.self){var k=h.self.constructor;if(k){for(var i in k.prototype){if(k.prototype[i]==h){return k.classname+e+i+b;}
;}
;for(var i in k){if(k[i]==h){return k.classname+d+i+b;}
;}
;}
;}
;var j=h.toString().match(/function\s*(\w*)\s*\(.*/);if(j&&j.length>=1&&j[1]){return j[1]+b;}
;return a;}
,globalEval:function(data){if(window.execScript){return window.execScript(data);}
else {return eval.call(window,data);}
;}
,create:function(m,l){{}
;if(!l){return m;}
;if(!(l.self||l.args||l.delay!=null||l.periodical!=null||l.attempt)){return m;}
;return function(event){{}
;var o=qx.lang.Array.fromArguments(arguments);if(l.args){o=l.args.concat(o);}
;if(l.delay||l.periodical){var n=function(){return m.apply(l.self||this,o);}
;{n=qx.event.GlobalError.observeMethod(n);}
;if(l.delay){return window.setTimeout(n,l.delay);}
;if(l.periodical){return window.setInterval(n,l.periodical);}
;}
else if(l.attempt){var p=false;try{p=m.apply(l.self||this,o);}
catch(q){}
;return p;}
else {return m.apply(l.self||this,o);}
;}
;}
,bind:function(r,self,s){return this.create(r,{self:self,args:arguments.length>2?qx.lang.Array.fromArguments(arguments,2):null});}
,curry:function(t,u){return this.create(t,{args:arguments.length>1?qx.lang.Array.fromArguments(arguments,1):null});}
,listener:function(w,self,x){if(arguments.length<3){return function(event){return w.call(self||this,event||window.event);}
;}
else {var v=qx.lang.Array.fromArguments(arguments,2);return function(event){var y=[event||window.event];y.push.apply(y,v);w.apply(self||this,y);}
;}
;}
,attempt:function(z,self,A){return this.create(z,{self:self,attempt:true,args:arguments.length>2?qx.lang.Array.fromArguments(arguments,2):null})();}
,delay:function(C,B,self,D){return this.create(C,{delay:B,self:self,args:arguments.length>3?qx.lang.Array.fromArguments(arguments,3):null})();}
,periodical:function(F,E,self,G){return this.create(F,{periodical:E,self:self,args:arguments.length>3?qx.lang.Array.fromArguments(arguments,3):null})();}
}});}
)();
(function(){var a="qx.globalErrorHandling",b="qx.event.GlobalError";qx.Bootstrap.define(b,{statics:{__bF:null,__bG:null,__bH:null,__bI:function(){if(qx.core&&qx.core.Environment){return true;}
else {return !!qx.Bootstrap.getEnvironmentSetting(a);}
;}
,setErrorHandler:function(c,d){this.__bF=c||null;this.__bH=d||window;if(this.__bI()){if(c&&window.onerror){var e=qx.Bootstrap.bind(this.__bJ,this);if(this.__bG==null){this.__bG=window.onerror;}
;var self=this;window.onerror=function(f,g,h){self.__bG(f,g,h);e(f,g,h);}
;}
;if(c&&!window.onerror){window.onerror=qx.Bootstrap.bind(this.__bJ,this);}
;if(this.__bF==null){if(this.__bG!=null){window.onerror=this.__bG;this.__bG=null;}
else {window.onerror=null;}
;}
;}
;}
,__bJ:function(i,j,k){if(this.__bF){this.handleError(new qx.core.WindowError(i,j,k));}
;}
,observeMethod:function(l){if(this.__bI()){var self=this;return function(){if(!self.__bF){return l.apply(this,arguments);}
;try{return l.apply(this,arguments);}
catch(m){self.handleError(new qx.core.GlobalError(m,arguments));}
;}
;}
else {return l;}
;}
,handleError:function(n){if(this.__bF){this.__bF.call(this.__bH,n);}
;}
},defer:function(o){if(qx.core&&qx.core.Environment){qx.core.Environment.add(a,true);}
else {qx.Bootstrap.setEnvironmentSetting(a,true);}
;o.setErrorHandler(null,null);}
});}
)();
(function(){var a="",b="qx.core.WindowError";qx.Bootstrap.define(b,{extend:Error,construct:function(c,e,f){var d=Error.call(this,c);if(d.stack){this.stack=d.stack;}
;if(d.stacktrace){this.stacktrace=d.stacktrace;}
;this.__bK=c;this.__bL=e||a;this.__bM=f===undefined?-1:f;}
,members:{__bK:null,__bL:null,__bM:null,toString:function(){return this.__bK;}
,getUri:function(){return this.__bL;}
,getLineNumber:function(){return this.__bM;}
}});}
)();
(function(){var a="GlobalError: ",b="qx.core.GlobalError";qx.Bootstrap.define(b,{extend:Error,construct:function(e,c){if(qx.Bootstrap.DEBUG){qx.core.Assert.assertNotUndefined(e);}
;this.__bK=a+(e&&e.message?e.message:e);var d=Error.call(this,this.__bK);if(d.stack){this.stack=d.stack;}
;if(d.stacktrace){this.stacktrace=d.stacktrace;}
;this.__bN=c;this.__bO=e;}
,members:{__bO:null,__bN:null,__bK:null,toString:function(){return this.__bK;}
,getArguments:function(){return this.__bN;}
,getSourceException:function(){return this.__bO;}
},destruct:function(){this.__bO=null;this.__bN=null;this.__bK=null;}
});}
)();
(function(){var a=": ",b="qx.type.BaseError",c="",d="error";qx.Class.define(b,{extend:Error,construct:function(e,f){var g=Error.call(this,f);if(g.stack){this.stack=g.stack;}
;if(g.stacktrace){this.stacktrace=g.stacktrace;}
;this.__bP=e||c;this.message=f||qx.type.BaseError.DEFAULTMESSAGE;}
,statics:{DEFAULTMESSAGE:d},members:{__bQ:null,__bP:null,message:null,getComment:function(){return this.__bP;}
,toString:function(){return this.__bP+(this.message?a+this.message:c);}
}});}
)();
(function(){var b=': ',d='String',e='',f='Boolean',g='\\\\',h='object',l='\\f',m=']',o='\\t',p='function',q='{\n',r='[]',s="qx.lang.JsonImpl",t='Z',u=',',w='\\n',x='Object',y='{}',z='"',A='@',B='.',C='(',D='Array',E='T',F=':',G='\\r',H='{',I='JSON.parse',J=' ',K='\n',L='\\u',M=',\n',N='0000',O='null',P='string',Q="Cannot stringify a recursive object.",R='0',S='-',T='[',U='Number',V=')',W='[\n',X='\\"',Y='\\b',ba='}';qx.Bootstrap.define(s,{extend:Object,construct:function(){this.stringify=qx.lang.Function.bind(this.stringify,this);this.parse=qx.lang.Function.bind(this.parse,this);}
,members:{__bR:null,__bS:null,__bT:null,__bU:null,stringify:function(bc,bb,bd){this.__bR=e;this.__bS=e;this.__bU=[];if(qx.lang.Type.isNumber(bd)){var bd=Math.min(10,Math.floor(bd));for(var i=0;i<bd;i+=1){this.__bS+=J;}
;}
else if(qx.lang.Type.isString(bd)){if(bd.length>10){bd=bd.slice(0,10);}
;this.__bS=bd;}
;if(bb&&(qx.lang.Type.isFunction(bb)||qx.lang.Type.isArray(bb))){this.__bT=bb;}
else {this.__bT=null;}
;return this.__bV(e,{'':bc});}
,__bV:function(bi,bj){var bg=this.__bR,be,bh=bj[bi];if(bh&&qx.lang.Type.isFunction(bh.toJSON)){bh=bh.toJSON(bi);}
else if(qx.lang.Type.isDate(bh)){bh=this.dateToJSON(bh);}
;if(typeof this.__bT===p){bh=this.__bT.call(bj,bi,bh);}
;if(bh===null){return O;}
;if(bh===undefined){return undefined;}
;switch(qx.lang.Type.getClass(bh)){case d:return this.__bW(bh);case U:return isFinite(bh)?String(bh):O;case f:return String(bh);case D:this.__bR+=this.__bS;be=[];if(this.__bU.indexOf(bh)!==-1){throw new TypeError(Q);}
;this.__bU.push(bh);var length=bh.length;for(var i=0;i<length;i+=1){be[i]=this.__bV(i,bh)||O;}
;this.__bU.pop();if(be.length===0){var bf=r;}
else if(this.__bR){bf=W+this.__bR+be.join(M+this.__bR)+K+bg+m;}
else {bf=T+be.join(u)+m;}
;this.__bR=bg;return bf;case x:this.__bR+=this.__bS;be=[];if(this.__bU.indexOf(bh)!==-1){throw new TypeError(Q);}
;this.__bU.push(bh);if(this.__bT&&typeof this.__bT===h){var length=this.__bT.length;for(var i=0;i<length;i+=1){var k=this.__bT[i];if(typeof k===P){var v=this.__bV(k,bh);if(v){be.push(this.__bW(k)+(this.__bR?b:F)+v);}
;}
;}
;}
else {for(var k in bh){if(Object.hasOwnProperty.call(bh,k)){var v=this.__bV(k,bh);if(v){be.push(this.__bW(k)+(this.__bR?b:F)+v);}
;}
;}
;}
;this.__bU.pop();if(be.length===0){var bf=y;}
else if(this.__bR){bf=q+this.__bR+be.join(M+this.__bR)+K+bg+ba;}
else {bf=H+be.join(u)+ba;}
;this.__bR=bg;return bf;};}
,dateToJSON:function(bk){var bl=function(n){return n<10?R+n:n;}
;var bm=function(n){var bn=bl(n);return n<100?R+bn:bn;}
;return isFinite(bk.valueOf())?bk.getUTCFullYear()+S+bl(bk.getUTCMonth()+1)+S+bl(bk.getUTCDate())+E+bl(bk.getUTCHours())+F+bl(bk.getUTCMinutes())+F+bl(bk.getUTCSeconds())+B+bm(bk.getUTCMilliseconds())+t:null;}
,__bW:function(bp){var bo={'\b':Y,'\t':o,'\n':w,'\f':l,'\r':G,'"':X,'\\':g};var bq=/[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;bq.lastIndex=0;if(bq.test(bp)){return z+bp.replace(bq,function(a){var c=bo[a];return typeof c===P?c:L+(N+a.charCodeAt(0).toString(16)).slice(-4);}
)+z;}
else {return z+bp+z;}
;}
,parse:function(text,reviver){var cx=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;cx.lastIndex=0;if(cx.test(text)){text=text.replace(cx,function(a){return L+(N+a.charCodeAt(0).toString(16)).slice(-4);}
);}
;if(/^[\],:{}\s]*$/.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,A).replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,m).replace(/(?:^|:|,)(?:\s*\[)+/g,e))){var j=eval(C+text+V);return typeof reviver===p?this.__bX({'':j},e,reviver):j;}
;throw new SyntaxError(I);}
,__bX:function(bu,bt,bs){var br=bu[bt];if(br&&typeof br===h){for(var k in br){if(Object.hasOwnProperty.call(br,k)){var v=this.__bX(br,k,bs);if(v!==undefined){br[k]=v;}
else {delete br[k];}
;}
;}
;}
;return bs.call(bu,bt,br);}
}});}
)();
(function(){var a="anonymous",b="...",c="qx.dev.StackTrace",d="",e="\n",f="?",g="/source/class/",h="Error created at",j="ecmascript.error.stacktrace",k="Backtrace:",l="stack",m=":",n=".",o="function",p="prototype",q="stacktrace";qx.Bootstrap.define(c,{statics:{FILENAME_TO_CLASSNAME:null,FORMAT_STACKTRACE:null,getStackTrace:function(){var t=[];try{throw new Error();}
catch(G){if(qx.dev.StackTrace.hasEnvironmentCheck&&qx.core.Environment.get(j)){var y=qx.dev.StackTrace.getStackTraceFromError(G);var B=qx.dev.StackTrace.getStackTraceFromCaller(arguments);qx.lang.Array.removeAt(y,0);t=B.length>y.length?B:y;for(var i=0;i<Math.min(B.length,y.length);i++ ){var w=B[i];if(w.indexOf(a)>=0){continue;}
;var s=null;var C=w.split(n);var v=/(.*?)\(/.exec(C[C.length-1]);if(v&&v.length==2){s=v[1];C.pop();}
;if(C[C.length-1]==p){C.pop();}
;var E=C.join(n);var u=y[i];var F=u.split(m);var A=F[0];var z=F[1];var r;if(F[2]){r=F[2];}
;var x=null;if(qx.Class.getByName(A)){x=A;}
else {x=E;}
;var D=x;if(s){D+=n+s;}
;D+=m+z;if(r){D+=m+r;}
;t[i]=D;}
;}
else {t=this.getStackTraceFromCaller(arguments);}
;}
;return t;}
,getStackTraceFromCaller:function(K){var J=[];var M=qx.lang.Function.getCaller(K);var H={};while(M){var L=qx.lang.Function.getName(M);J.push(L);try{M=M.caller;}
catch(N){break;}
;if(!M){break;}
;var I=qx.core.ObjectRegistry.toHashCode(M);if(H[I]){J.push(b);break;}
;H[I]=M;}
;return J;}
,getStackTraceFromError:function(bd){var T=[];var R,S,ba,Q,P,bf,bb;var bc=qx.dev.StackTrace.hasEnvironmentCheck?qx.core.Environment.get(j):null;if(bc===l){if(!bd.stack){return T;}
;R=/@(.+):(\d+)$/gm;while((S=R.exec(bd.stack))!=null){bb=S[1];Q=S[2];ba=this.__bY(bb);T.push(ba+m+Q);}
;if(T.length>0){return this.__cb(T);}
;R=/at (.*)/gm;var be=/\((.*?)(:[^\/].*)\)/;var Y=/(.*?)(:[^\/].*)/;while((S=R.exec(bd.stack))!=null){var X=be.exec(S[1]);if(!X){X=Y.exec(S[1]);}
;if(X){ba=this.__bY(X[1]);T.push(ba+X[2]);}
else {T.push(S[1]);}
;}
;}
else if(bc===q){var U=bd.stacktrace;if(!U){return T;}
;if(U.indexOf(h)>=0){U=U.split(h)[0];}
;R=/line\ (\d+?),\ column\ (\d+?)\ in\ (?:.*?)\ in\ (.*?):[^\/]/gm;while((S=R.exec(U))!=null){Q=S[1];P=S[2];bb=S[3];ba=this.__bY(bb);T.push(ba+m+Q+m+P);}
;if(T.length>0){return this.__cb(T);}
;R=/Line\ (\d+?)\ of\ linked\ script\ (.*?)$/gm;while((S=R.exec(U))!=null){Q=S[1];bb=S[2];ba=this.__bY(bb);T.push(ba+m+Q);}
;}
else if(bd.message&&bd.message.indexOf(k)>=0){var W=bd.message.split(k)[1].trim();var V=W.split(e);for(var i=0;i<V.length;i++ ){var O=V[i].match(/\s*Line ([0-9]+) of.* (\S.*)/);if(O&&O.length>=2){Q=O[1];bf=this.__bY(O[2]);T.push(bf+m+Q);}
;}
;}
else if(bd.sourceURL&&bd.line){T.push(this.__bY(bd.sourceURL)+m+bd.line);}
;return this.__cb(T);}
,__bY:function(bh){if(typeof qx.dev.StackTrace.FILENAME_TO_CLASSNAME==o){var bg=qx.dev.StackTrace.FILENAME_TO_CLASSNAME(bh);{}
;return bg;}
;return qx.dev.StackTrace.__ca(bh);}
,__ca:function(bk){var bl=g;var bi=bk.indexOf(bl);var bm=bk.indexOf(f);if(bm>=0){bk=bk.substring(0,bm);}
;var bj=(bi==-1)?bk:bk.substring(bi+bl.length).replace(/\//g,n).replace(/\.js$/,d);return bj;}
,__cb:function(bn){if(typeof qx.dev.StackTrace.FORMAT_STACKTRACE==o){bn=qx.dev.StackTrace.FORMAT_STACKTRACE(bn);{}
;}
;return bn;}
},defer:function(bo){bo.hasEnvironmentCheck=qx.bom.client.EcmaScript&&qx.bom.client.EcmaScript.getStackTrace;}
});}
)();
(function(){var c="-",d="qx.debug.dispose",e="",f="qx.core.ObjectRegistry",g="Disposed ",h="$$hash",j="-0",k=" objects",m="Could not dispose object ",n=": ";qx.Bootstrap.define(f,{statics:{inShutDown:false,__G:{},__cc:0,__cd:[],__ce:e,__cf:{},register:function(o){var r=this.__G;if(!r){return;}
;var q=o.$$hash;if(q==null){var p=this.__cd;if(p.length>0&&!qx.core.Environment.get(d)){q=p.pop();}
else {q=(this.__cc++ )+this.__ce;}
;o.$$hash=q;if(qx.core.Environment.get(d)){if(qx.dev&&qx.dev.Debug&&qx.dev.Debug.disposeProfilingActive){this.__cf[q]=qx.dev.StackTrace.getStackTrace();}
;}
;}
;{}
;r[q]=o;}
,unregister:function(s){var t=s.$$hash;if(t==null){return;}
;var u=this.__G;if(u&&u[t]){delete u[t];this.__cd.push(t);}
;try{delete s.$$hash;}
catch(v){if(s.removeAttribute){s.removeAttribute(h);}
;}
;}
,toHashCode:function(w){{}
;var y=w.$$hash;if(y!=null){return y;}
;var x=this.__cd;if(x.length>0){y=x.pop();}
else {y=(this.__cc++ )+this.__ce;}
;return w.$$hash=y;}
,clearHashCode:function(z){{}
;var A=z.$$hash;if(A!=null){this.__cd.push(A);try{delete z.$$hash;}
catch(B){if(z.removeAttribute){z.removeAttribute(h);}
;}
;}
;}
,fromHashCode:function(C){return this.__G[C]||null;}
,shutdown:function(){this.inShutDown=true;var E=this.__G;var G=[];for(var D in E){G.push(D);}
;G.sort(function(a,b){return parseInt(b,10)-parseInt(a,10);}
);var F,i=0,l=G.length;while(true){try{for(;i<l;i++ ){D=G[i];F=E[D];if(F&&F.dispose){F.dispose();}
;}
;}
catch(H){qx.Bootstrap.error(this,m+F.toString()+n+H,H);if(i!==l){i++ ;continue;}
;}
;break;}
;qx.Bootstrap.debug(this,g+l+k);delete this.__G;}
,getRegistry:function(){return this.__G;}
,getNextHash:function(){return this.__cc;}
,getPostId:function(){return this.__ce;}
,getStackTraces:function(){return this.__cf;}
},defer:function(I){if(window&&window.top){var frames=window.top.frames;for(var i=0;i<frames.length;i++ ){if(frames[i]===window){I.__ce=c+(i+1);return;}
;}
;}
;I.__ce=j;}
});}
)();
(function(){var a="qx.core.AssertionError";qx.Class.define(a,{extend:qx.type.BaseError,construct:function(b,c){qx.type.BaseError.call(this,b,c);this.__cg=qx.dev.StackTrace.getStackTrace();}
,members:{__cg:null,getStackTrace:function(){return this.__cg;}
}});}
)();
(function(){var a="prop",b="qx.bom.client.Json",c="repl",d="JSON",e='{"x":1}',f="json",g="val";qx.Bootstrap.define(b,{statics:{getJson:function(){return (qx.Bootstrap.getClass(window.JSON)==d&&JSON.parse(e).x===1&&JSON.stringify({"prop":g},function(k,v){return k===a?c:v;}
).indexOf(c)>0);}
},defer:function(h){qx.core.Environment.add(f,h.getJson);}
});}
)();
(function(){var a="qx.lang.Json",b="json";qx.Bootstrap.define(a,{statics:{JSON:qx.core.Environment.get(b)?window.JSON:new qx.lang.JsonImpl(),stringify:null,parse:null},defer:function(c){c.stringify=c.JSON.stringify;c.parse=c.JSON.parse;}
});}
)();
(function(){var a="[object Opera]",b="function",c="[^\\.0-9]",d="4.0",e="gecko",f="1.9.0.0",g="Version/",h="9.0",i="8.0",j="Gecko",k="Maple",l="AppleWebKit/",m="Trident",n="Unsupported client: ",o="",p="opera",q="engine.version",r="! Assumed gecko version 1.9.0.0 (Firefox 3.0).",s="mshtml",t="engine.name",u="webkit",v="5.0",w=".",x="qx.bom.client.Engine";qx.Bootstrap.define(x,{statics:{getVersion:function(){var A=window.navigator.userAgent;var B=o;if(qx.bom.client.Engine.__ch()){if(/Opera[\s\/]([0-9]+)\.([0-9])([0-9]*)/.test(A)){if(A.indexOf(g)!=-1){var D=A.match(/Version\/(\d+)\.(\d+)/);B=D[1]+w+D[2].charAt(0)+w+D[2].substring(1,D[2].length);}
else {B=RegExp.$1+w+RegExp.$2;if(RegExp.$3!=o){B+=w+RegExp.$3;}
;}
;}
;}
else if(qx.bom.client.Engine.__ci()){if(/AppleWebKit\/([^ ]+)/.test(A)){B=RegExp.$1;var C=RegExp(c).exec(B);if(C){B=B.slice(0,C.index);}
;}
;}
else if(qx.bom.client.Engine.__ck()||qx.bom.client.Engine.__cj()){if(/rv\:([^\);]+)(\)|;)/.test(A)){B=RegExp.$1;}
;}
else if(qx.bom.client.Engine.__cl()){var z=/Trident\/([^\);]+)(\)|;)/.test(A);if(/MSIE\s+([^\);]+)(\)|;)/.test(A)){B=RegExp.$1;if(B<8&&z){if(RegExp.$1==d){B=i;}
else if(RegExp.$1==v){B=h;}
;}
;}
else if(z){var D=/\brv\:(\d+?\.\d+?)\b/.exec(A);if(D){B=D[1];}
;}
;}
else {var y=window.qxFail;if(y&&typeof y===b){B=y().FULLVERSION;}
else {B=f;qx.Bootstrap.warn(n+A+r);}
;}
;return B;}
,getName:function(){var name;if(qx.bom.client.Engine.__ch()){name=p;}
else if(qx.bom.client.Engine.__ci()){name=u;}
else if(qx.bom.client.Engine.__ck()||qx.bom.client.Engine.__cj()){name=e;}
else if(qx.bom.client.Engine.__cl()){name=s;}
else {var E=window.qxFail;if(E&&typeof E===b){name=E().NAME;}
else {name=e;qx.Bootstrap.warn(n+window.navigator.userAgent+r);}
;}
;return name;}
,__ch:function(){return window.opera&&Object.prototype.toString.call(window.opera)==a;}
,__ci:function(){return window.navigator.userAgent.indexOf(l)!=-1;}
,__cj:function(){return window.navigator.userAgent.indexOf(k)!=-1;}
,__ck:function(){return window.controllers&&window.navigator.product===j&&window.navigator.userAgent.indexOf(k)==-1&&window.navigator.userAgent.indexOf(m)==-1;}
,__cl:function(){return window.navigator.cpuClass&&(/MSIE\s+([^\);]+)(\)|;)/.test(window.navigator.userAgent)||/Trident\/\d+?\.\d+?/.test(window.navigator.userAgent));}
},defer:function(F){qx.core.Environment.add(q,F.getVersion);qx.core.Environment.add(t,F.getName);}
});}
)();
(function(){var a="qx.log.Logger",b="[",c="...(+",d="array",e=")",f="info",g="node",h="instance",j="string",k="null",m="error",n="#",o="class",p=": ",q="warn",r="document",s="{...(",t="",u="number",v="stringify",w="]",x="date",y="unknown",z="function",A="text[",B="[...(",C="boolean",D="\n",E=")}",F="debug",G=")]",H="map",I="undefined",J="object";qx.Class.define(a,{statics:{__cm:F,setLevel:function(K){this.__cm=K;}
,getLevel:function(){return this.__cm;}
,setTreshold:function(L){this.__cp.setMaxMessages(L);}
,getTreshold:function(){return this.__cp.getMaxMessages();}
,__cn:{},__co:0,register:function(P){if(P.$$id){return;}
;var M=this.__co++ ;this.__cn[M]=P;P.$$id=M;var N=this.__cq;var O=this.__cp.getAllLogEvents();for(var i=0,l=O.length;i<l;i++ ){if(N[O[i].level]>=N[this.__cm]){P.process(O[i]);}
;}
;}
,unregister:function(Q){var R=Q.$$id;if(R==null){return;}
;delete this.__cn[R];delete Q.$$id;}
,debug:function(T,S){qx.log.Logger.__cr(F,arguments);}
,info:function(V,U){qx.log.Logger.__cr(f,arguments);}
,warn:function(X,W){qx.log.Logger.__cr(q,arguments);}
,error:function(ba,Y){qx.log.Logger.__cr(m,arguments);}
,trace:function(bb){var bc=qx.dev.StackTrace.getStackTrace();qx.log.Logger.__cr(f,[(typeof bb!==I?[bb].concat(bc):bc).join(D)]);}
,deprecatedMethodWarning:function(bf,bd){{var be;}
;}
,deprecatedClassWarning:function(bi,bg){{var bh;}
;}
,deprecatedEventWarning:function(bl,event,bj){{var bk;}
;}
,deprecatedMixinWarning:function(bn,bm){{var bo;}
;}
,deprecatedConstantWarning:function(bs,bq,bp){{var self,br;}
;}
,deprecateMethodOverriding:function(bv,bu,bw,bt){{var bx;}
;}
,clear:function(){this.__cp.clearHistory();}
,__cp:new qx.log.appender.RingBuffer(50),__cq:{debug:0,info:1,warn:2,error:3},__cr:function(bz,bB){var bE=this.__cq;if(bE[bz]<bE[this.__cm]){return;}
;var by=bB.length<2?null:bB[0];var bD=by?1:0;var bA=[];for(var i=bD,l=bB.length;i<l;i++ ){bA.push(this.__ct(bB[i],true));}
;var bF=new Date;var bG={time:bF,offset:bF-qx.Bootstrap.LOADSTART,level:bz,items:bA,win:window};if(by){if(by.$$hash!==undefined){bG.object=by.$$hash;}
else if(by.$$type){bG.clazz=by;}
;}
;this.__cp.process(bG);var bC=this.__cn;for(var bH in bC){bC[bH].process(bG);}
;}
,__cs:function(bJ){if(bJ===undefined){return I;}
else if(bJ===null){return k;}
;if(bJ.$$type){return o;}
;var bI=typeof bJ;if(bI===z||bI==j||bI===u||bI===C){return bI;}
else if(bI===J){if(bJ.nodeType){return g;}
else if(bJ instanceof Error||(bJ.name&&bJ.message)){return m;}
else if(bJ.classname){return h;}
else if(bJ instanceof Array){return d;}
else if(bJ instanceof Date){return x;}
else {return H;}
;}
;if(bJ.toString){return v;}
;return y;}
,__ct:function(bP,bO){var bS=this.__cs(bP);var bM=y;var bL=[];switch(bS){case k:case I:bM=bS;break;case j:case u:case C:case x:bM=bP;break;case g:if(bP.nodeType===9){bM=r;}
else if(bP.nodeType===3){bM=A+bP.nodeValue+w;}
else if(bP.nodeType===1){bM=bP.nodeName.toLowerCase();if(bP.id){bM+=n+bP.id;}
;}
else {bM=g;}
;break;case z:bM=qx.lang.Function.getName(bP)||bS;break;case h:bM=bP.basename+b+bP.$$hash+w;break;case o:case v:bM=bP.toString();break;case m:bL=qx.dev.StackTrace.getStackTraceFromError(bP);bM=(bP.basename?bP.basename+p:t)+bP.toString();break;case d:if(bO){bM=[];for(var i=0,l=bP.length;i<l;i++ ){if(bM.length>20){bM.push(c+(l-i)+e);break;}
;bM.push(this.__ct(bP[i],false));}
;}
else {bM=B+bP.length+G;}
;break;case H:if(bO){var bK;var bR=[];for(var bQ in bP){bR.push(bQ);}
;bR.sort();bM=[];for(var i=0,l=bR.length;i<l;i++ ){if(bM.length>20){bM.push(c+(l-i)+e);break;}
;bQ=bR[i];bK=this.__ct(bP[bQ],false);bK.key=bQ;bM.push(bK);}
;}
else {var bN=0;for(var bQ in bP){bN++ ;}
;bM=s+bN+E;}
;break;};return {type:bS,text:bM,trace:bL};}
},defer:function(bT){var bU=qx.Bootstrap.$$logs;for(var i=0;i<bU.length;i++ ){bT.__cr(bU[i][0],bU[i][1]);}
;qx.Bootstrap.debug=bT.debug;qx.Bootstrap.info=bT.info;qx.Bootstrap.warn=bT.warn;qx.Bootstrap.error=bT.error;qx.Bootstrap.trace=bT.trace;}
});}
)();
(function(){var a="qx.event.type.Data",b="qx.event.type.Event",c="qx.data.IListData";qx.Interface.define(c,{events:{"change":a,"changeLength":b},members:{getItem:function(d){}
,setItem:function(e,f){}
,splice:function(g,h,i){}
,contains:function(j){}
,getLength:function(){}
,toArray:function(){}
}});}
)();
(function(){var a="qx.core.ValidationError";qx.Class.define(a,{extend:qx.type.BaseError});}
)();
(function(){var a="qx.core.MProperty",b="get",c="reset",d="No such property: ",e="set";qx.Mixin.define(a,{members:{set:function(g,h){var f=qx.core.Property.$$method.set;if(qx.Bootstrap.isString(g)){if(!this[f[g]]){if(this[e+qx.Bootstrap.firstUp(g)]!=undefined){this[e+qx.Bootstrap.firstUp(g)](h);return this;}
;throw new Error(d+g);}
;return this[f[g]](h);}
else {for(var i in g){if(!this[f[i]]){if(this[e+qx.Bootstrap.firstUp(i)]!=undefined){this[e+qx.Bootstrap.firstUp(i)](g[i]);continue;}
;throw new Error(d+i);}
;this[f[i]](g[i]);}
;return this;}
;}
,get:function(k){var j=qx.core.Property.$$method.get;if(!this[j[k]]){if(this[b+qx.Bootstrap.firstUp(k)]!=undefined){return this[b+qx.Bootstrap.firstUp(k)]();}
;throw new Error(d+k);}
;return this[j[k]]();}
,reset:function(m){var l=qx.core.Property.$$method.reset;if(!this[l[m]]){if(this[c+qx.Bootstrap.firstUp(m)]!=undefined){this[c+qx.Bootstrap.firstUp(m)]();return;}
;throw new Error(d+m);}
;this[l[m]]();}
}});}
)();
(function(){var a="info",b="debug",c="warn",d="qx.core.MLogging",e="error";qx.Mixin.define(d,{members:{__cu:qx.log.Logger,debug:function(f){this.__cv(b,arguments);}
,info:function(g){this.__cv(a,arguments);}
,warn:function(h){this.__cv(c,arguments);}
,error:function(i){this.__cv(e,arguments);}
,trace:function(){this.__cu.trace(this);}
,__cv:function(j,l){var k=qx.lang.Array.fromArguments(l);k.unshift(this);this.__cu[j].apply(this.__cu,k);}
}});}
)();
(function(){var a="HTMLEvents",b="engine.name",c="",d="qx.bom.Event",f="return;",g="function",h="mouseover",j="transitionend",k="gecko",m="css.transition",n="on",o="undefined",p="end-event";qx.Bootstrap.define(d,{statics:{addNativeListener:function(t,s,q,r){if(t.addEventListener){t.addEventListener(s,q,!!r);}
else if(t.attachEvent){t.attachEvent(n+s,q);}
else if(typeof t[n+s]!=o){t[n+s]=q;}
else {{}
;}
;}
,removeNativeListener:function(x,w,u,v){if(x.removeEventListener){x.removeEventListener(w,u,!!v);}
else if(x.detachEvent){try{x.detachEvent(n+w,u);}
catch(e){if(e.number!==-2146828218){throw e;}
;}
;}
else if(typeof x[n+w]!=o){x[n+w]=null;}
else {{}
;}
;}
,getTarget:function(e){return e.target||e.srcElement;}
,getRelatedTarget:function(e){if(e.relatedTarget!==undefined){if((qx.core.Environment.get(b)==k)){try{e.relatedTarget&&e.relatedTarget.nodeType;}
catch(y){return null;}
;}
;return e.relatedTarget;}
else if(e.fromElement!==undefined&&e.type===h){return e.fromElement;}
else if(e.toElement!==undefined){return e.toElement;}
else {return null;}
;}
,preventDefault:function(e){if(e.preventDefault){e.preventDefault();}
else {try{e.keyCode=0;}
catch(z){}
;e.returnValue=false;}
;}
,stopPropagation:function(e){if(e.stopPropagation){e.stopPropagation();}
else {e.cancelBubble=true;}
;}
,fire:function(C,A){if(document.createEvent){var B=document.createEvent(a);B.initEvent(A,true,true);return !C.dispatchEvent(B);}
else {var B=document.createEventObject();return C.fireEvent(n+A,B);}
;}
,supportsEvent:function(H,G){if(H!=window&&G.toLowerCase().indexOf(j)!=-1){var F=qx.core.Environment.get(m);return (F&&F[p]==G);}
;var D=n+G.toLowerCase();var E=(D in H);if(!E){E=typeof H[D]==g;if(!E&&H.setAttribute){H.setAttribute(D,f);E=typeof H[D]==g;H.removeAttribute(D);}
;}
;return E;}
,getEventName:function(I,L){var J=[c].concat(qx.bom.Style.VENDOR_PREFIXES);for(var i=0,l=J.length;i<l;i++ ){var K=J[i].toLowerCase();if(qx.bom.Event.supportsEvent(I,K+L)){return K?K+qx.lang.String.firstUp(L):L;}
;}
;return null;}
}});}
)();
(function(){var a="qx.bom.client.CssTransition",b="E",c="transitionEnd",d="e",e="nd",f="transition",g="css.transition",h="Trans";qx.Bootstrap.define(a,{statics:{getTransitionName:function(){return qx.bom.Style.getPropertyName(f);}
,getSupport:function(){var name=qx.bom.client.CssTransition.getTransitionName();if(!name){return null;}
;var i=qx.bom.Event.getEventName(window,c);i=i==c?i.toLowerCase():i;if(!i){i=name+(name.indexOf(h)>0?b:d)+e;}
;return {name:name,"end-event":i};}
},defer:function(j){qx.core.Environment.add(g,j.getSupport);}
});}
)();
(function(){var a="-",b="qx.bom.Style",c="",d='-',e="Webkit",f="ms",g="Moz",h="O",j="string",k="Khtml";qx.Bootstrap.define(b,{statics:{VENDOR_PREFIXES:[e,g,h,f,k],__cw:{},getPropertyName:function(o){var m=document.documentElement.style;if(m[o]!==undefined){return o;}
;for(var i=0,l=this.VENDOR_PREFIXES.length;i<l;i++ ){var n=this.VENDOR_PREFIXES[i]+qx.lang.String.firstUp(o);if(m[n]!==undefined){return n;}
;}
;return null;}
,getCssName:function(p){var q=this.__cw[p];if(!q){q=p.replace(/[A-Z]/g,function(r){return (d+r.charAt(0).toLowerCase());}
);if((/^ms/.test(q))){q=a+q;}
;this.__cw[p]=q;}
;return q;}
,getAppliedStyle:function(w,u,v,t){var s=(t!==false)?[null].concat(this.VENDOR_PREFIXES):[null];for(var i=0,l=s.length;i<l;i++ ){var x=s[i]?a+s[i].toLowerCase()+a+v:v;try{w.style[u]=x;if(typeof w.style[u]==j&&w.style[u]!==c){return x;}
;}
catch(y){}
;}
;return null;}
}});}
)();
(function(){var a="UNKNOWN_",b="|bubble",c="",d="_",e="c",f="|",g="unload",h="|capture",j="DOM_",k="__cB",m="WIN_",n="QX_",o="qx.event.Manager",p="capture",q="__cC",r="DOCUMENT_";qx.Class.define(o,{extend:Object,construct:function(s,t){this.__cx=s;this.__cy=qx.core.ObjectRegistry.toHashCode(s);this.__cz=t;if(s.qx!==qx){var self=this;qx.bom.Event.addNativeListener(s,g,qx.event.GlobalError.observeMethod(function(){qx.bom.Event.removeNativeListener(s,g,arguments.callee);self.dispose();}
));}
;this.__cA={};this.__cB={};this.__cC={};this.__cD={};}
,statics:{__cE:0,getNextUniqueId:function(){return (this.__cE++ )+c;}
},members:{__cz:null,__cA:null,__cC:null,__cF:null,__cB:null,__cD:null,__cx:null,__cy:null,getWindow:function(){return this.__cx;}
,getWindowId:function(){return this.__cy;}
,getHandler:function(v){var u=this.__cB[v.classname];if(u){return u;}
;return this.__cB[v.classname]=new v(this);}
,getDispatcher:function(x){var w=this.__cC[x.classname];if(w){return w;}
;return this.__cC[x.classname]=new x(this,this.__cz);}
,getListeners:function(z,D,y){var B=z.$$hash||qx.core.ObjectRegistry.toHashCode(z);var E=this.__cA[B];if(!E){return null;}
;var C=D+(y?h:b);var A=E[C];return A?A.concat():null;}
,getAllListeners:function(){return this.__cA;}
,serializeListeners:function(G){var K=G.$$hash||qx.core.ObjectRegistry.toHashCode(G);var O=this.__cA[K];var J=[];if(O){var H,N,F,I,L;for(var M in O){H=M.indexOf(f);N=M.substring(0,H);F=M.charAt(H+1)==e;I=O[M];for(var i=0,l=I.length;i<l;i++ ){L=I[i];J.push({self:L.context,handler:L.handler,type:N,capture:F});}
;}
;}
;return J;}
,toggleAttachedEvents:function(R,Q){var U=R.$$hash||qx.core.ObjectRegistry.toHashCode(R);var X=this.__cA[U];if(X){var S,W,P,T;for(var V in X){S=V.indexOf(f);W=V.substring(0,S);P=V.charCodeAt(S+1)===99;T=X[V];if(Q){this.__cG(R,W,P);}
else {this.__cH(R,W,P);}
;}
;}
;}
,hasListener:function(ba,be,Y){{}
;var bc=ba.$$hash||qx.core.ObjectRegistry.toHashCode(ba);var bf=this.__cA[bc];if(!bf){return false;}
;var bd=be+(Y?h:b);var bb=bf[bd];return !!(bb&&bb.length>0);}
,importListeners:function(bg,bi){{}
;var bm=bg.$$hash||qx.core.ObjectRegistry.toHashCode(bg);var bo=this.__cA[bm]={};var bk=qx.event.Manager;for(var bh in bi){var bl=bi[bh];var bn=bl.type+(bl.capture?h:b);var bj=bo[bn];if(!bj){bj=bo[bn]=[];this.__cG(bg,bl.type,bl.capture);}
;bj.push({handler:bl.listener,context:bl.self,unique:bl.unique||(bk.__cE++ )+c});}
;}
,addListener:function(br,by,bt,self,bp){{var bv;}
;var bq=br.$$hash||qx.core.ObjectRegistry.toHashCode(br);var bz=this.__cA[bq];if(!bz){bz=this.__cA[bq]={};}
;var bu=by+(bp?h:b);var bs=bz[bu];if(!bs){bs=bz[bu]=[];}
;if(bs.length===0){this.__cG(br,by,bp);}
;var bx=(qx.event.Manager.__cE++ )+c;var bw={handler:bt,context:self,unique:bx};bs.push(bw);return bu+f+bx;}
,findHandler:function(bE,bN){var bL=false,bD=false,bO=false,bA=false;var bK;if(bE.nodeType===1){bL=true;bK=j+bE.tagName.toLowerCase()+d+bN;}
else if(bE.nodeType===9){bA=true;bK=r+bN;}
else if(bE==this.__cx){bD=true;bK=m+bN;}
else if(bE.classname){bO=true;bK=n+bE.classname+d+bN;}
else {bK=a+bE+d+bN;}
;var bC=this.__cD;if(bC[bK]){return bC[bK];}
;var bJ=this.__cz.getHandlers();var bF=qx.event.IEventHandler;var bH,bI,bG,bB;for(var i=0,l=bJ.length;i<l;i++ ){bH=bJ[i];bG=bH.SUPPORTED_TYPES;if(bG&&!bG[bN]){continue;}
;bB=bH.TARGET_CHECK;if(bB){var bM=false;if(bL&&((bB&bF.TARGET_DOMNODE)!=0)){bM=true;}
else if(bD&&((bB&bF.TARGET_WINDOW)!=0)){bM=true;}
else if(bO&&((bB&bF.TARGET_OBJECT)!=0)){bM=true;}
else if(bA&&((bB&bF.TARGET_DOCUMENT)!=0)){bM=true;}
;if(!bM){continue;}
;}
;bI=this.getHandler(bJ[i]);if(bH.IGNORE_CAN_HANDLE||bI.canHandleEvent(bE,bN)){bC[bK]=bI;return bI;}
;}
;return null;}
,__cG:function(bS,bR,bP){var bQ=this.findHandler(bS,bR);if(bQ){bQ.registerEvent(bS,bR,bP);return;}
;{}
;}
,removeListener:function(bV,cc,bX,self,bT){{var ca;}
;var bU=bV.$$hash||qx.core.ObjectRegistry.toHashCode(bV);var cd=this.__cA[bU];if(!cd){return false;}
;var bY=cc+(bT?h:b);var bW=cd[bY];if(!bW){return false;}
;var cb;for(var i=0,l=bW.length;i<l;i++ ){cb=bW[i];if(cb.handler===bX&&cb.context===self){qx.lang.Array.removeAt(bW,i);if(bW.length==0){this.__cH(bV,cc,bT);}
;return true;}
;}
;return false;}
,removeListenerById:function(cg,co){{var ck;}
;var ci=co.split(f);var cn=ci[0];var ce=ci[1].charCodeAt(0)==99;var cm=ci[2];var cf=cg.$$hash||qx.core.ObjectRegistry.toHashCode(cg);var cp=this.__cA[cf];if(!cp){return false;}
;var cj=cn+(ce?h:b);var ch=cp[cj];if(!ch){return false;}
;var cl;for(var i=0,l=ch.length;i<l;i++ ){cl=ch[i];if(cl.unique===cm){qx.lang.Array.removeAt(ch,i);if(ch.length==0){this.__cH(cg,cn,ce);}
;return true;}
;}
;return false;}
,removeAllListeners:function(cr){var ct=cr.$$hash||qx.core.ObjectRegistry.toHashCode(cr);var cw=this.__cA[ct];if(!cw){return false;}
;var cs,cv,cq;for(var cu in cw){if(cw[cu].length>0){cs=cu.split(f);cv=cs[0];cq=cs[1]===p;this.__cH(cr,cv,cq);}
;}
;delete this.__cA[ct];return true;}
,deleteAllListeners:function(cx){delete this.__cA[cx];}
,__cH:function(cB,cA,cy){var cz=this.findHandler(cB,cA);if(cz){cz.unregisterEvent(cB,cA,cy);return;}
;{}
;}
,dispatchEvent:function(cD,event){{var cH;}
;var cI=event.getType();if(!event.getBubbles()&&!this.hasListener(cD,cI)){qx.event.Pool.getInstance().poolObject(event);return true;}
;if(!event.getTarget()){event.setTarget(cD);}
;var cG=this.__cz.getDispatchers();var cF;var cC=false;for(var i=0,l=cG.length;i<l;i++ ){cF=this.getDispatcher(cG[i]);if(cF.canDispatchEvent(cD,event,cI)){cF.dispatchEvent(cD,event,cI);cC=true;break;}
;}
;if(!cC){{}
;return true;}
;var cE=event.getDefaultPrevented();qx.event.Pool.getInstance().poolObject(event);return !cE;}
,dispose:function(){this.__cz.removeManager(this);qx.util.DisposeUtil.disposeMap(this,k);qx.util.DisposeUtil.disposeMap(this,q);this.__cA=this.__cx=this.__cF=null;this.__cz=this.__cD=null;}
}});}
)();
(function(){var a=" is a singleton! Please use disposeSingleton instead.",b="undefined",c="qx.util.DisposeUtil",d=" of object: ",e="!",f=" has non disposable entries: ",g="The map field: ",h="The array field: ",j="The object stored in key ",k="Has no disposable object under key: ";qx.Class.define(c,{statics:{disposeObjects:function(n,m,o){var name;for(var i=0,l=m.length;i<l;i++ ){name=m[i];if(n[name]==null||!n.hasOwnProperty(name)){continue;}
;if(!qx.core.ObjectRegistry.inShutDown){if(n[name].dispose){if(!o&&n[name].constructor.$$instance){throw new Error(j+name+a);}
else {n[name].dispose();}
;}
else {throw new Error(k+name+e);}
;}
;n[name]=null;}
;}
,disposeArray:function(q,p){var r=q[p];if(!r){return;}
;if(qx.core.ObjectRegistry.inShutDown){q[p]=null;return;}
;try{var s;for(var i=r.length-1;i>=0;i-- ){s=r[i];if(s){s.dispose();}
;}
;}
catch(t){throw new Error(h+p+d+q+f+t);}
;r.length=0;q[p]=null;}
,disposeMap:function(v,u){var w=v[u];if(!w){return;}
;if(qx.core.ObjectRegistry.inShutDown){v[u]=null;return;}
;try{var y;for(var x in w){y=w[x];if(w.hasOwnProperty(x)&&y){y.dispose();}
;}
;}
catch(z){throw new Error(g+u+d+v+f+z);}
;v[u]=null;}
,disposeTriggeredBy:function(A,C){var B=C.dispose;C.dispose=function(){B.call(C);A.dispose();}
;}
,destroyContainer:function(E){{}
;var D=[];this._collectContainerChildren(E,D);var F=D.length;for(var i=F-1;i>=0;i-- ){D[i].destroy();}
;E.destroy();}
,_collectContainerChildren:function(I,H){var J=I.getChildren();for(var i=0;i<J.length;i++ ){var G=J[i];H.push(G);if(this.__cI(G)){this._collectContainerChildren(G,H);}
;}
;}
,__cI:function(L){var K=[qx.ui.container.Composite,qx.ui.container.Scroll,qx.ui.container.SlideBar,qx.ui.container.Stack];for(var i=0,l=K.length;i<l;i++ ){if(typeof K[i]!==b&&qx.Class.isSubClassOf(L.constructor,K[i])){return true;}
;}
;return false;}
}});}
)();
(function(){var b="qx.dom.Node",c="";qx.Bootstrap.define(b,{statics:{ELEMENT:1,ATTRIBUTE:2,TEXT:3,CDATA_SECTION:4,ENTITY_REFERENCE:5,ENTITY:6,PROCESSING_INSTRUCTION:7,COMMENT:8,DOCUMENT:9,DOCUMENT_TYPE:10,DOCUMENT_FRAGMENT:11,NOTATION:12,getDocument:function(d){return d.nodeType===this.DOCUMENT?d:d.ownerDocument||d.document;}
,getWindow:function(e){if(e.nodeType==null){return e;}
;if(e.nodeType!==this.DOCUMENT){e=e.ownerDocument;}
;return e.defaultView||e.parentWindow;}
,getDocumentElement:function(f){return this.getDocument(f).documentElement;}
,getBodyElement:function(g){return this.getDocument(g).body;}
,isNode:function(h){return !!(h&&h.nodeType!=null);}
,isElement:function(j){return !!(j&&j.nodeType===this.ELEMENT);}
,isDocument:function(k){return !!(k&&k.nodeType===this.DOCUMENT);}
,isText:function(l){return !!(l&&l.nodeType===this.TEXT);}
,isWindow:function(m){return !!(m&&m.history&&m.location&&m.document);}
,isNodeName:function(n,o){if(!o||!n||!n.nodeName){return false;}
;return o.toLowerCase()==qx.dom.Node.getName(n);}
,getName:function(p){if(!p||!p.nodeName){return null;}
;return p.nodeName.toLowerCase();}
,getText:function(q){if(!q||!q.nodeType){return null;}
;switch(q.nodeType){case 1:var i,a=[],r=q.childNodes,length=r.length;for(i=0;i<length;i++ ){a[i]=this.getText(r[i]);}
;return a.join(c);case 2:case 3:case 4:return q.nodeValue;};return null;}
,isBlockNode:function(s){if(!qx.dom.Node.isElement(s)){return false;}
;s=qx.dom.Node.getName(s);return /^(body|form|textarea|fieldset|ul|ol|dl|dt|dd|li|div|hr|p|h[1-6]|quote|pre|table|thead|tbody|tfoot|tr|td|th|iframe|address|blockquote)$/.test(s);}
}});}
)();
(function(){var c="qx.event.Registration";qx.Class.define(c,{statics:{__cJ:{},getManager:function(f){if(f==null){{}
;f=window;}
else if(f.nodeType){f=qx.dom.Node.getWindow(f);}
else if(!qx.dom.Node.isWindow(f)){f=window;}
;var e=f.$$hash||qx.core.ObjectRegistry.toHashCode(f);var d=this.__cJ[e];if(!d){d=new qx.event.Manager(f,this);this.__cJ[e]=d;}
;return d;}
,removeManager:function(g){var h=g.getWindowId();delete this.__cJ[h];}
,addListener:function(l,k,i,self,j){return this.getManager(l).addListener(l,k,i,self,j);}
,removeListener:function(p,o,m,self,n){return this.getManager(p).removeListener(p,o,m,self,n);}
,removeListenerById:function(q,r){return this.getManager(q).removeListenerById(q,r);}
,removeAllListeners:function(s){return this.getManager(s).removeAllListeners(s);}
,deleteAllListeners:function(u){var t=u.$$hash;if(t){this.getManager(u).deleteAllListeners(t);}
;}
,hasListener:function(x,w,v){return this.getManager(x).hasListener(x,w,v);}
,serializeListeners:function(y){return this.getManager(y).serializeListeners(y);}
,createEvent:function(B,C,A){{}
;if(C==null){C=qx.event.type.Event;}
;var z=qx.event.Pool.getInstance().getObject(C);A?z.init.apply(z,A):z.init();if(B){z.setType(B);}
;return z;}
,dispatchEvent:function(D,event){return this.getManager(D).dispatchEvent(D,event);}
,fireEvent:function(E,F,H,G){{var I;}
;var J=this.createEvent(F,H||null,G);return this.getManager(E).dispatchEvent(E,J);}
,fireNonBubblingEvent:function(K,P,N,M){{}
;var O=this.getManager(K);if(!O.hasListener(K,P,false)){return true;}
;var L=this.createEvent(P,N||null,M);return O.dispatchEvent(K,L);}
,PRIORITY_FIRST:-32000,PRIORITY_NORMAL:0,PRIORITY_LAST:32000,__cB:[],addHandler:function(Q){{}
;this.__cB.push(Q);this.__cB.sort(function(a,b){return a.PRIORITY-b.PRIORITY;}
);}
,getHandlers:function(){return this.__cB;}
,__cC:[],addDispatcher:function(S,R){{}
;this.__cC.push(S);this.__cC.sort(function(a,b){return a.PRIORITY-b.PRIORITY;}
);}
,getDispatchers:function(){return this.__cC;}
}});}
)();
(function(){var a="qx.core.MEvent";qx.Mixin.define(a,{members:{__cK:qx.event.Registration,addListener:function(d,b,self,c){if(!this.$$disposed){return this.__cK.addListener(this,d,b,self,c);}
;return null;}
,addListenerOnce:function(h,f,self,g){var i=function(e){this.removeListener(h,f,this,g);f.call(self||this,e);}
;f.$$wrapped_callback=i;return this.addListener(h,i,this,g);}
,removeListener:function(l,j,self,k){if(!this.$$disposed){if(j.$$wrapped_callback){var m=j.$$wrapped_callback;delete j.$$wrapped_callback;j=m;}
;return this.__cK.removeListener(this,l,j,self,k);}
;return false;}
,removeListenerById:function(n){if(!this.$$disposed){return this.__cK.removeListenerById(this,n);}
;return false;}
,hasListener:function(p,o){return this.__cK.hasListener(this,p,o);}
,dispatchEvent:function(q){if(!this.$$disposed){return this.__cK.dispatchEvent(this,q);}
;return true;}
,fireEvent:function(s,t,r){if(!this.$$disposed){return this.__cK.fireEvent(this,s,t,r);}
;return true;}
,fireNonBubblingEvent:function(v,w,u){if(!this.$$disposed){return this.__cK.fireNonBubblingEvent(this,v,w,u);}
;return true;}
,fireDataEvent:function(z,A,x,y){if(!this.$$disposed){if(x===undefined){x=null;}
;return this.__cK.fireNonBubblingEvent(this,z,qx.event.type.Data,[A,x,!!y]);}
;return true;}
}});}
)();
(function(){var a="qx.core.MAssert";qx.Mixin.define(a,{members:{assert:function(c,b){qx.core.Assert.assert(c,b);}
,fail:function(d,e){qx.core.Assert.fail(d,e);}
,assertTrue:function(g,f){qx.core.Assert.assertTrue(g,f);}
,assertFalse:function(i,h){qx.core.Assert.assertFalse(i,h);}
,assertEquals:function(j,k,l){qx.core.Assert.assertEquals(j,k,l);}
,assertNotEquals:function(m,n,o){qx.core.Assert.assertNotEquals(m,n,o);}
,assertIdentical:function(p,q,r){qx.core.Assert.assertIdentical(p,q,r);}
,assertNotIdentical:function(s,t,u){qx.core.Assert.assertNotIdentical(s,t,u);}
,assertNotUndefined:function(w,v){qx.core.Assert.assertNotUndefined(w,v);}
,assertUndefined:function(y,x){qx.core.Assert.assertUndefined(y,x);}
,assertNotNull:function(A,z){qx.core.Assert.assertNotNull(A,z);}
,assertNull:function(C,B){qx.core.Assert.assertNull(C,B);}
,assertJsonEquals:function(D,E,F){qx.core.Assert.assertJsonEquals(D,E,F);}
,assertMatch:function(I,H,G){qx.core.Assert.assertMatch(I,H,G);}
,assertArgumentsCount:function(L,K,M,J){qx.core.Assert.assertArgumentsCount(L,K,M,J);}
,assertEventFired:function(P,event,Q,N,O){qx.core.Assert.assertEventFired(P,event,Q,N,O);}
,assertEventNotFired:function(T,event,R,S){qx.core.Assert.assertEventNotFired(T,event,R,S);}
,assertException:function(V,W,X,U){qx.core.Assert.assertException(V,W,X,U);}
,assertInArray:function(bb,ba,Y){qx.core.Assert.assertInArray(bb,ba,Y);}
,assertArrayEquals:function(bc,bd,be){qx.core.Assert.assertArrayEquals(bc,bd,be);}
,assertKeyInMap:function(bh,bg,bf){qx.core.Assert.assertKeyInMap(bh,bg,bf);}
,assertFunction:function(bj,bi){qx.core.Assert.assertFunction(bj,bi);}
,assertString:function(bl,bk){qx.core.Assert.assertString(bl,bk);}
,assertBoolean:function(bn,bm){qx.core.Assert.assertBoolean(bn,bm);}
,assertNumber:function(bp,bo){qx.core.Assert.assertNumber(bp,bo);}
,assertPositiveNumber:function(br,bq){qx.core.Assert.assertPositiveNumber(br,bq);}
,assertInteger:function(bt,bs){qx.core.Assert.assertInteger(bt,bs);}
,assertPositiveInteger:function(bv,bu){qx.core.Assert.assertPositiveInteger(bv,bu);}
,assertInRange:function(by,bz,bx,bw){qx.core.Assert.assertInRange(by,bz,bx,bw);}
,assertObject:function(bB,bA){qx.core.Assert.assertObject(bB,bA);}
,assertArray:function(bD,bC){qx.core.Assert.assertArray(bD,bC);}
,assertMap:function(bF,bE){qx.core.Assert.assertMap(bF,bE);}
,assertRegExp:function(bH,bG){qx.core.Assert.assertRegExp(bH,bG);}
,assertType:function(bK,bJ,bI){qx.core.Assert.assertType(bK,bJ,bI);}
,assertInstance:function(bM,bN,bL){qx.core.Assert.assertInstance(bM,bN,bL);}
,assertInterface:function(bQ,bP,bO){qx.core.Assert.assertInterface(bQ,bP,bO);}
,assertCssColor:function(bR,bT,bS){qx.core.Assert.assertCssColor(bR,bT,bS);}
,assertElement:function(bV,bU){qx.core.Assert.assertElement(bV,bU);}
,assertQxObject:function(bX,bW){qx.core.Assert.assertQxObject(bX,bW);}
,assertQxWidget:function(ca,bY){qx.core.Assert.assertQxWidget(ca,bY);}
}});}
)();
(function(){var a="module.events",b="Cloning only possible with properties.",c="qx.core.Object",d="module.property",e="]",f="[",g="Object";qx.Class.define(c,{extend:Object,include:qx.core.Environment.filter({"module.databinding":qx.data.MBinding,"module.logger":qx.core.MLogging,"module.events":qx.core.MEvent,"module.property":qx.core.MProperty}),construct:function(){qx.core.ObjectRegistry.register(this);}
,statics:{$$type:g},members:{__M:qx.core.Environment.get(d)?qx.core.Property:null,toHashCode:function(){return this.$$hash;}
,toString:function(){return this.classname+f+this.$$hash+e;}
,base:function(h,j){{}
;if(arguments.length===1){return h.callee.base.call(this);}
else {return h.callee.base.apply(this,Array.prototype.slice.call(arguments,1));}
;}
,self:function(k){return k.callee.self;}
,clone:function(){if(!qx.core.Environment.get(d)){throw new Error(b);}
;var n=this.constructor;var m=new n;var p=qx.Class.getProperties(n);var o=this.__M.$$store.user;var q=this.__M.$$method.set;var name;for(var i=0,l=p.length;i<l;i++ ){name=p[i];if(this.hasOwnProperty(o[name])){m[q[name]](this[o[name]]);}
;}
;return m;}
,__cL:null,setUserData:function(r,s){if(!this.__cL){this.__cL={};}
;this.__cL[r]=s;}
,getUserData:function(u){if(!this.__cL){return null;}
;var t=this.__cL[u];return t===undefined?null:t;}
,isDisposed:function(){return this.$$disposed||false;}
,dispose:function(){if(this.$$disposed){return;}
;this.$$disposed=true;this.$$instance=null;this.$$allowconstruct=null;{}
;var x=this.constructor;var v;while(x.superclass){if(x.$$destructor){x.$$destructor.call(this);}
;if(x.$$includes){v=x.$$flatIncludes;for(var i=0,l=v.length;i<l;i++ ){if(v[i].$$destructor){v[i].$$destructor.call(this);}
;}
;}
;x=x.superclass;}
;{var y,w;}
;}
,_disposeObjects:function(z){qx.util.DisposeUtil.disposeObjects(this,arguments);}
,_disposeSingletonObjects:function(A){qx.util.DisposeUtil.disposeObjects(this,arguments,true);}
,_disposeArray:function(B){qx.util.DisposeUtil.disposeArray(this,B);}
,_disposeMap:function(C){qx.util.DisposeUtil.disposeMap(this,C);}
},environment:{"qx.debug.dispose.level":0},destruct:function(){if(qx.core.Environment.get(a)){if(!qx.core.ObjectRegistry.inShutDown){qx.event.Registration.removeAllListeners(this);}
else {qx.event.Registration.deleteAllListeners(this);}
;}
;qx.core.ObjectRegistry.unregister(this);this.__cL=null;if(qx.core.Environment.get(d)){var F=this.constructor;var J;var K=this.__M.$$store;var H=K.user;var I=K.theme;var D=K.inherit;var G=K.useinit;var E=K.init;while(F){J=F.$$properties;if(J){for(var name in J){if(J[name].dereference){this[H[name]]=this[I[name]]=this[D[name]]=this[G[name]]=this[E[name]]=undefined;}
;}
;}
;F=F.superclass;}
;}
;}
});}
)();
(function(){var a="qx.event.type.Event";qx.Class.define(a,{extend:qx.core.Object,statics:{CAPTURING_PHASE:1,AT_TARGET:2,BUBBLING_PHASE:3},members:{init:function(c,b){{}
;this._type=null;this._target=null;this._currentTarget=null;this._relatedTarget=null;this._originalTarget=null;this._stopPropagation=false;this._preventDefault=false;this._bubbles=!!c;this._cancelable=!!b;this._timeStamp=(new Date()).getTime();this._eventPhase=null;return this;}
,clone:function(d){if(d){var e=d;}
else {var e=qx.event.Pool.getInstance().getObject(this.constructor);}
;e._type=this._type;e._target=this._target;e._currentTarget=this._currentTarget;e._relatedTarget=this._relatedTarget;e._originalTarget=this._originalTarget;e._stopPropagation=this._stopPropagation;e._bubbles=this._bubbles;e._preventDefault=this._preventDefault;e._cancelable=this._cancelable;return e;}
,stop:function(){if(this._bubbles){this.stopPropagation();}
;if(this._cancelable){this.preventDefault();}
;}
,stopPropagation:function(){{}
;this._stopPropagation=true;}
,getPropagationStopped:function(){return !!this._stopPropagation;}
,preventDefault:function(){{}
;this._preventDefault=true;}
,getDefaultPrevented:function(){return !!this._preventDefault;}
,getType:function(){return this._type;}
,setType:function(f){this._type=f;}
,getEventPhase:function(){return this._eventPhase;}
,setEventPhase:function(g){this._eventPhase=g;}
,getTimeStamp:function(){return this._timeStamp;}
,getTarget:function(){return this._target;}
,setTarget:function(h){this._target=h;}
,getCurrentTarget:function(){return this._currentTarget||this._target;}
,setCurrentTarget:function(i){this._currentTarget=i;}
,getRelatedTarget:function(){return this._relatedTarget;}
,setRelatedTarget:function(j){this._relatedTarget=j;}
,getOriginalTarget:function(){return this._originalTarget;}
,setOriginalTarget:function(k){this._originalTarget=k;}
,getBubbles:function(){return this._bubbles;}
,setBubbles:function(l){this._bubbles=l;}
,isCancelable:function(){return this._cancelable;}
,setCancelable:function(m){this._cancelable=m;}
},destruct:function(){this._target=this._currentTarget=this._relatedTarget=this._originalTarget=null;}
});}
)();
(function(){var a="qx.util.ObjectPool",b="Class needs to be defined!",c="Object is already pooled: ",d="Integer";qx.Class.define(a,{extend:qx.core.Object,construct:function(e){qx.core.Object.call(this);this.__cM={};if(e!=null){this.setSize(e);}
;}
,properties:{size:{check:d,init:Infinity}},members:{__cM:null,getObject:function(h){if(this.$$disposed){return new h;}
;if(!h){throw new Error(b);}
;var f=null;var g=this.__cM[h.classname];if(g){f=g.pop();}
;if(f){f.$$pooled=false;}
else {f=new h;}
;return f;}
,poolObject:function(k){if(!this.__cM){return;}
;var j=k.classname;var m=this.__cM[j];if(k.$$pooled){throw new Error(c+k);}
;if(!m){this.__cM[j]=m=[];}
;if(m.length>this.getSize()){if(k.destroy){k.destroy();}
else {k.dispose();}
;return;}
;k.$$pooled=true;m.push(k);}
},destruct:function(){var p=this.__cM;var n,o,i,l;for(n in p){o=p[n];for(i=0,l=o.length;i<l;i++ ){o[i].dispose();}
;}
;delete this.__cM;}
});}
)();
(function(){var a="singleton",b="qx.event.Pool";qx.Class.define(b,{extend:qx.util.ObjectPool,type:a,construct:function(){qx.util.ObjectPool.call(this,30);}
});}
)();
(function(){var a="qx.event.type.Data";qx.Class.define(a,{extend:qx.event.type.Event,members:{__cN:null,__cO:null,init:function(c,d,b){qx.event.type.Event.prototype.init.call(this,false,b);this.__cN=c;this.__cO=d;return this;}
,clone:function(e){var f=qx.event.type.Event.prototype.clone.call(this,e);f.__cN=this.__cN;f.__cO=this.__cO;return f;}
,getData:function(){return this.__cN;}
,getOldData:function(){return this.__cO;}
},destruct:function(){this.__cN=this.__cO=null;}
});}
)();
(function(){var a="qx.event.IEventHandler";qx.Interface.define(a,{statics:{TARGET_DOMNODE:1,TARGET_WINDOW:2,TARGET_OBJECT:4,TARGET_DOCUMENT:8},members:{canHandleEvent:function(c,b){}
,registerEvent:function(f,e,d){}
,unregisterEvent:function(i,h,g){}
}});}
)();
(function(){var a="qx.event.handler.Object";qx.Class.define(a,{extend:qx.core.Object,implement:qx.event.IEventHandler,statics:{PRIORITY:qx.event.Registration.PRIORITY_LAST,SUPPORTED_TYPES:null,TARGET_CHECK:qx.event.IEventHandler.TARGET_OBJECT,IGNORE_CAN_HANDLE:false},members:{canHandleEvent:function(c,b){return qx.Class.supportsEvent(c.constructor,b);}
,registerEvent:function(f,e,d){}
,unregisterEvent:function(i,h,g){}
},defer:function(j){qx.event.Registration.addHandler(j);}
});}
)();
(function(){var a="qx.event.IEventDispatcher";qx.Interface.define(a,{members:{canDispatchEvent:function(c,event,b){this.assertInstance(event,qx.event.type.Event);this.assertString(b);}
,dispatchEvent:function(e,event,d){this.assertInstance(event,qx.event.type.Event);this.assertString(d);}
}});}
)();
(function(){var a="qx.event.dispatch.Direct";qx.Class.define(a,{extend:qx.core.Object,implement:qx.event.IEventDispatcher,construct:function(b){this._manager=b;}
,statics:{PRIORITY:qx.event.Registration.PRIORITY_LAST},members:{canDispatchEvent:function(d,event,c){return !event.getBubbles();}
,dispatchEvent:function(e,event,k){{var j,f;}
;event.setEventPhase(qx.event.type.Event.AT_TARGET);var g=this._manager.getListeners(e,k,false);if(g){for(var i=0,l=g.length;i<l;i++ ){var h=g[i].context||e;{}
;g[i].handler.call(h,event);}
;}
;}
},defer:function(m){qx.event.Registration.addDispatcher(m);}
});}
)();
(function(){var a="qx.dev.unit.TestSuite",b="__unknown_class__",c="Stack trace: ",d="error",f="\n",g="qx.dev.unit.MTestLoader",h="' had an error: ",k=" - ",l="The test '",m="failure",n="' failed: ",o="Test '";qx.Mixin.define(g,{properties:{suite:{check:a,nullable:true,init:null}},members:{_getClassNameFromUrl:function(){var q=window.location.search;var p=q.match(/[\?&]testclass=([A-Za-z0-9_\.]+)/);if(p){p=p[1];}
else {p=b;}
;return p;}
,setTestNamespace:function(s){var r=new qx.dev.unit.TestSuite();r.add(s);this.setSuite(r);}
,runJsUnit:function(){var t=new qx.dev.unit.JsUnitTestResult();this.getSuite().run(t);t.exportToJsUnit();}
,runStandAlone:function(){var u=new qx.dev.unit.TestResult();u.addListener(m,function(e){var w=e.getData()[0].exception;var v=e.getData()[0].test;this.error(o+v.getFullName()+n+w.message+k+w.getComment());if(w.getStackTrace){this.error(c+w.getStackTrace().join(f));}
;}
,this);u.addListener(d,function(e){var y=e.getData()[0].exception;var x=e.getData()[0].test;this.error(l+x.getFullName()+h+y,y);}
,this);this.getSuite().run(u);}
,getTestDescriptions:function(){var D=[];var B=this.getSuite().getTestClasses();for(var i=0;i<B.length;i++ ){var C=B[i];var z={};z.classname=C.getName();z.tests=[];var A=C.getTestMethods();for(var j=0;j<A.length;j++ ){z.tests.push(A[j].getName());}
;D.push(z);}
;return qx.lang.Json.stringify(D);}
,runTests:function(F,G,E){var H=this.getSuite().getTestClasses();for(var i=0;i<H.length;i++ ){if(G==H[i].getName()){var I=H[i].getTestMethods();for(var j=0;j<I.length;j++ ){if(E&&I[j].getName()!=E){continue;}
;I[j].run(F);}
;return;}
;}
;}
,runTestsFromNamespace:function(L,J){var K=this.getSuite().getTestClasses();for(var i=0;i<K.length;i++ ){if(K[i].getName().indexOf(J)==0){K[i].run(L);}
;}
;}
}});}
)();
(function(){var a="qx.dev.unit.AbstractTestSuite",b="abstract",c="_tests";qx.Class.define(a,{extend:qx.core.Object,type:b,construct:function(){qx.core.Object.call(this);this._tests=[];}
,members:{_tests:null,addTestFunction:function(name,d){this._tests.push(new qx.dev.unit.TestFunction(null,name,d));}
,addTestMethod:function(e,f){this._tests.push(new qx.dev.unit.TestFunction(e,f));}
,addFail:function(h,g){this.addTestFunction(h,function(){this.fail(g);}
);}
,run:function(j){for(var i=0;i<this._tests.length;i++ ){(this._tests[i]).run(j);}
;}
,getTestMethods:function(){var l=[];for(var i=0;i<this._tests.length;i++ ){var k=this._tests[i];if(k instanceof qx.dev.unit.TestFunction){l.push(k);}
;}
;return l;}
},destruct:function(){this._disposeArray(c);}
});}
)();
(function(){var a="qx.dev.unit.TestFunction",b="Function",c="",d=":",e="qx.dev.unit.TestCase",f="String";qx.Class.define(a,{extend:qx.core.Object,construct:function(g,i,h){if(h){this.setTestFunction(h);}
;if(g){this.setClassName(g.classname);this.setTestClass(g);}
;this.setName(i);}
,properties:{testFunction:{check:b},name:{check:f},className:{check:f,init:c},testClass:{check:e,init:null}},members:{run:function(k){var j=this.getTestClass();var m=this.getName();var l=this;k.run(this,function(){j.setTestFunc(l);j.setTestResult(k);try{j[m]();}
catch(n){throw n;}
;}
);}
,setUp:function(){var o=this.getTestClass();if(qx.lang.Type.isFunction(o.setUp)){o.setUp();}
;}
,tearDown:function(){var p=this.getTestClass();if(qx.lang.Type.isFunction(p.tearDown)){p.tearDown();}
;}
,getFullName:function(){return [this.getClassName(),this.getName()].join(d);}
}});}
)();
(function(){var a="'!",b="qx.dev.unit.TestSuite",c="' is undefined!",d="abstract",e="existsCheck",f="Unknown test class '",g="The class/namespace '";qx.Class.define(b,{extend:qx.dev.unit.AbstractTestSuite,construct:function(h){qx.dev.unit.AbstractTestSuite.call(this);this._tests=[];if(h){this.add(h);}
;}
,members:{add:function(j){if(qx.lang.Type.isString(j)){var k=window.eval(j);if(!k){this.addFail(j,g+j+c);}
;j=k;}
;if(qx.lang.Type.isFunction(j)){this.addTestClass(j);}
else if(qx.lang.Type.isObject(j)){this.addTestNamespace(j);}
else {this.addFail(e,f+j+a);return;}
;}
,addTestNamespace:function(l){if(qx.lang.Type.isFunction(l)&&l.classname){if(qx.Class.isSubClassOf(l,qx.dev.unit.TestCase)){if(l.$$classtype!==d){this.addTestClass(l);}
;return;}
;}
else if(qx.lang.Type.isObject(l)&&!(l instanceof Array)){for(var m in l){this.addTestNamespace(l[m]);}
;}
;}
,addTestClass:function(n){this._tests.push(new qx.dev.unit.TestClass(n));}
,getTestClasses:function(){var p=[];for(var i=0;i<this._tests.length;i++ ){var o=this._tests[i];if(o instanceof qx.dev.unit.TestClass){p.push(o);}
;}
;return p;}
}});}
)();
(function(){var a="existsCheck",b="test",c="Unknown test class!",d="Sub class check.",e="String",f="'is not a sub class of 'qx.dev.unit.TestCase'",g="The test class '",h="qx.dev.unit.TestClass";qx.Class.define(h,{extend:qx.dev.unit.AbstractTestSuite,construct:function(k){qx.dev.unit.AbstractTestSuite.call(this);if(!k){this.addFail(a,c);return;}
;if(!qx.Class.isSubClassOf(k,qx.dev.unit.TestCase)){this.addFail(d,g+k.classname+f);return;}
;var l=k.prototype;var i=new k;for(var j in l){if(qx.lang.Type.isFunction(l[j])&&j.indexOf(b)==0){this.addTestMethod(i,j);}
;}
;this.setName(k.classname);}
,properties:{name:{check:e}}});}
)();
(function(){var a="qx.dev.unit.TestCase",b="Called skip()",c="qx.event.type.Data";qx.Class.define(a,{extend:qx.core.Object,include:[qx.core.MAssert],events:{assertionFailed:c},properties:{testResult:{init:null},testFunc:{init:null}},members:{isDebugOn:function(){return false;}
,wait:function(d,e,f){throw new qx.dev.unit.AsyncWrapper(d,e,f);}
,resume:function(g,self){this.getTestResult().run(this.getTestFunc(),g||(function(){}
),self||this,true);}
,skip:function(h){throw new qx.dev.unit.RequirementError(null,h||b);}
}});}
)();
(function(){var a=": ",b="qx.dev.unit.RequirementError",c="Requirement not met";qx.Class.define(b,{extend:Error,construct:function(d,f){this.__nF=f||c;this.__nG=d;var e=Error.call(this,this.__nF);if(e.stack){this.stack=e.stack;}
;if(e.stacktrace){this.stacktrace=e.stacktrace;}
;}
,members:{__nF:null,__nG:null,getRequirement:function(){return this.__nG;}
,toString:function(){var g=this.__nF;if(this.__nG){g+=a+this.__nG;}
;return g;}
}});}
)();
(function(){var a="Function",b="qx.dev.unit.AsyncWrapper",c="Integer",d="Object";qx.Class.define(b,{extend:qx.core.Object,construct:function(e,g,f){for(var i=0;i<2;i++ ){if(qx.lang.Type.isFunction(arguments[i])){this.setDeferredFunction(arguments[i]);}
else if(qx.lang.Type.isNumber(arguments[i])){this.setDelay(arguments[i]);}
;}
;if(f){this.setContext(f);}
;}
,properties:{deferredFunction:{check:a,init:false},context:{check:d,init:null},delay:{check:c,nullable:false,init:5000}}});}
)();
(function(){var a="Error in asynchronous test",b=": ",c="qx.debug.dispose",d="testrunner.unit",e="assertionFailed",f="skip",g="Asynchronous Test Error",h="tearDown",j="qx.dev.unit.RequirementError",k="setUp failed",m="endTest",n="wait",o="tearDown failed: ",p="qx.dev.unit.TestResult",q="error",r="failure",s="resume() called before wait()",t="qx.core.AssertionError",u="qx.event.type.Data",v="Undisposed object in ",w="setUp failed: ",x="tearDown failed",y="]",z="endMeasurement",A="[",B="Timeout reached before resume() was called.",C="failed",D="\n",E="startTest";qx.Class.define(p,{extend:qx.core.Object,events:{startTest:u,endTest:u,error:u,failure:u,wait:u,skip:u,endMeasurement:u},statics:{run:function(H,F,G){H.run(F,G);}
},members:{_timeout:null,run:function(N,J,self,K){if(!this._timeout){this._timeout={};}
;var L=N.getTestClass();if(!L.hasListener(e)){L.addListener(e,function(S){var T=[{exception:S.getData(),test:N}];this.fireDataEvent(r,T);}
,this);}
;if(K&&!this._timeout[N.getFullName()]){this._timeout[N.getFullName()]=C;var M=new qx.type.BaseError(a,s);this._createError(r,[M],N);this.fireDataEvent(m,N);return;}
;this.fireDataEvent(E,N);if(qx.core.Environment.get(c)){qx.dev.Debug.startDisposeProfiling();}
;if(this._timeout[N.getFullName()]){if(this._timeout[N.getFullName()]!==C){this._timeout[N.getFullName()].stop();this._timeout[N.getFullName()].dispose();}
;delete this._timeout[N.getFullName()];}
else {try{N.setUp();}
catch(U){try{this.tearDown(N);}
catch(V){}
;if(U.classname==j){this._createError(f,[U],N);this.fireDataEvent(m,N);}
else {if(U instanceof qx.type.BaseError&&U.message==qx.type.BaseError.DEFAULTMESSAGE){U.message=k;}
else {U.message=w+U.message;}
;this._createError(q,[U],N);this.fireDataEvent(m,N);}
;return;}
;}
;try{J.call(self||window);}
catch(W){var P=true;if(W instanceof qx.dev.unit.AsyncWrapper){if(this._timeout[N.getFullName()]){return;}
;if(W.getDelay()){var I=this;var R=function(){throw new qx.core.AssertionError(g,B);}
;var Q=(W.getDeferredFunction()?W.getDeferredFunction():R);var O=(W.getContext()?W.getContext():window);this._timeout[N.getFullName()]=qx.event.Timer.once(function(){this.run(N,Q,O);}
,I,W.getDelay());this.fireDataEvent(n,N);}
;}
else if(W instanceof qx.dev.unit.MeasurementResult){P=false;this._createError(z,[W],N);}
else {try{this.tearDown(N);}
catch(X){}
;if(W.classname==t){this._createError(r,[W],N);this.fireDataEvent(m,N);}
else if(W.classname==j){this._createError(f,[W],N);this.fireDataEvent(m,N);}
else {this._createError(q,[W],N);this.fireDataEvent(m,N);}
;}
;}
;if(!P){try{this.tearDown(N);this.fireDataEvent(m,N);}
catch(Y){if(Y instanceof qx.type.BaseError&&Y.message==qx.type.BaseError.DEFAULTMESSAGE){Y.message=x;}
else {Y.message=o+Y.message;}
;this._createError(q,[Y],N);this.fireDataEvent(m,N);}
;}
;}
,_createError:function(bb,bc,bd){var ba=[];for(var i=0,l=bc.length;i<l;i++ ){ba.push({exception:bc[i],test:bd});}
;this.fireDataEvent(bb,ba);}
,__nH:function(be){be._addedListeners=[];if(!qx.event.Registration.addListenerOriginal){qx.event.Registration.addListenerOriginal=qx.event.Registration.addListener;qx.event.Registration.addListener=function(bg,bj,bi,self,bf){var bh=qx.event.Registration.addListenerOriginal(bg,bj,bi,self,bf);var bk=true;if((bg.classname&&bg.classname.indexOf(d)==0)||(self&&self.classname&&self.classname.indexOf(d)==0)){bk=false;}
;if(bk){be._addedListeners.push([bg,bh]);}
;return bh;}
;}
;}
,__nI:function(bm){if(bm._addedListeners){var bn=bm._addedListeners;for(var i=0,l=bn.length;i<l;i++ ){var bl=bn[i][0];var bo=bn[i][1];try{qx.event.Registration.removeListenerById(bl,bo);}
catch(bp){}
;}
;}
;}
,tearDown:function(bv){bv.tearDown();var bu=bv.getTestClass();var br=h+qx.lang.String.firstUp(bv.getName());if(bu[br]){bu[br]();}
;if(qx.core.Environment.get(c)&&qx.dev.Debug.disposeProfilingActive){var bt=bv.getFullName();var bs=qx.dev.Debug.stopDisposeProfiling();for(var i=0;i<bs.length;i++ ){var bq;if(bs[i].stackTrace){bq=bs[i].stackTrace.join(D);}
;window.top.qx.log.Logger.warn(v+bt+b+bs[i].object.classname+A+bs[i].object.toHashCode()+y+D+bq);}
;}
;}
},destruct:function(){this._timeout=null;}
});}
)();
(function(){var a="qx.event.Timer",b="_applyInterval",c="_applyEnabled",d="Boolean",f="interval",g="qx.event.type.Event",h="Integer";qx.Class.define(a,{extend:qx.core.Object,construct:function(i){qx.core.Object.call(this);this.setEnabled(false);if(i!=null){this.setInterval(i);}
;var self=this;this.__dE=function(){self._oninterval.call(self);}
;}
,events:{"interval":g},statics:{once:function(j,k,l){{}
;var m=new qx.event.Timer(l);m.__dF=j;m.addListener(f,function(e){m.stop();j.call(k,e);m.dispose();k=null;}
,k);m.start();return m;}
},properties:{enabled:{init:true,check:d,apply:c},interval:{check:h,init:1000,apply:b}},members:{__dG:null,__dE:null,_applyInterval:function(o,n){if(this.getEnabled()){this.restart();}
;}
,_applyEnabled:function(q,p){if(p){window.clearInterval(this.__dG);this.__dG=null;}
else if(q){this.__dG=window.setInterval(this.__dE,this.getInterval());}
;}
,start:function(){this.setEnabled(true);}
,startWith:function(r){this.setInterval(r);this.start();}
,stop:function(){this.setEnabled(false);}
,restart:function(){this.stop();this.start();}
,restartWith:function(s){this.stop();this.startWith(s);}
,_oninterval:qx.event.GlobalError.observeMethod(function(){if(this.$$disposed){return;}
;if(this.getEnabled()){this.fireEvent(f);}
;}
)},destruct:function(){if(this.__dG){window.clearInterval(this.__dG);}
;this.__dG=this.__dE=null;}
});}
)();
(function(){var a="Iterations: ",b="\n",c="Time: ",d="Render time: ",e="Measured: ",f="ms",g="qx.dev.unit.MeasurementResult";qx.Class.define(g,{extend:Object,construct:function(i,k,j,h){this.__nF=i;this.__nJ=k;this.__nK=j;this.__nL=h;}
,members:{__nF:null,__nJ:null,__nK:null,__nL:null,getData:function(){return {message:this.__nF,iterations:this.__nJ,ownTime:this.__nK,renderTime:this.__nL};}
,toString:function(){return [e+this.__nF,a+this.__nJ,c+this.__nK+f,d+this.__nL+f].join(b);}
}});}
)();
(function(){var a="-",b=") ***",c="qx.debug.dispose",d="\r\n",f="px;'>",g="): ",h="function",k="</span><br>",l="*** EXCEPTION (",m="============================================================",n="Object",o="<br>",p="null",q="Array",r="Call ",s="members",t=":",u=": ",v="statics",w="get",x="construct",y="",z="qx.dev.Debug",A=": EXCEPTION expanding property",B=".startDisposeProfiling first.",C="\n",D="*** TOO MUCH RECURSION: not displaying ***",E="Object, count=",F="  ",G="<span style='padding-left:",H=" ",I="------------------------------------------------------------",J="Array, length=",K="undefined",L="index(",M="object";qx.Class.define(z,{statics:{disposeProfilingActive:false,debugObject:function(N,P,O){qx.log.Logger.debug(this,qx.dev.Debug.debugObjectToString(N,P,O,false));}
,debugObjectToString:function(S,T,ba,U){if(!ba){ba=10;}
;var Y=(U?k:C);var V=function(bc){var bb;if(!U){bb=y;for(var i=0;i<bc;i++ ){bb+=F;}
;}
else {bb=G+(bc*8)+f;}
;return bb;}
;var X=y;var R=function(bf,bg,bd){if(bg>bd){X+=(V(bg)+D+Y);return;}
;if(typeof (bf)!=M){X+=V(bg)+bf+Y;return;}
;for(var be in bf){if(typeof (bf[be])==M){try{if(bf[be] instanceof Array){X+=V(bg)+be+u+q+Y;}
else if(bf[be]===null){X+=V(bg)+be+u+p+Y;continue;}
else if(bf[be]===undefined){X+=V(bg)+be+u+K+Y;continue;}
else {X+=V(bg)+be+u+n+Y;}
;R(bf[be],bg+1,bd);}
catch(e){X+=V(bg)+be+A+Y;}
;}
else {X+=V(bg)+be+u+bf[be]+Y;}
;}
;}
;if(T){X+=V(0)+T+Y;}
;if(S instanceof Array){X+=V(0)+J+S.length+t+Y;}
else if(typeof (S)==M){var Q=0;for(var W in S){Q++ ;}
;X+=V(0)+E+Q+t+Y;}
;X+=V(0)+I+Y;try{R(S,0,ba);}
catch(bh){X+=V(0)+l+bh+b+Y;}
;X+=V(0)+m+Y;return X;}
,getFunctionName:function(bj,bi){var bk=bj.self;if(!bk){return null;}
;while(bj.wrapper){bj=bj.wrapper;}
;switch(bi){case x:return bj==bk?x:null;case s:return qx.lang.Object.getKeyFromValue(bk,bj);case v:return qx.lang.Object.getKeyFromValue(bk.prototype,bj);default:if(bj==bk){return x;}
;return (qx.lang.Object.getKeyFromValue(bk.prototype,bj)||qx.lang.Object.getKeyFromValue(bk,bj)||null);};}
,debugProperties:function(bq,br,bo,bl){if(br==null){br=10;}
;if(bl==null){bl=1;}
;var bn=y;bo?bn=o:bn=d;var bm=y;if(qx.lang.Type.isNumber(bq)||qx.lang.Type.isString(bq)||qx.lang.Type.isBoolean(bq)||bq==null||br<=0){return bq;}
else if(qx.Class.hasInterface(bq.constructor,qx.data.IListData)){for(var i=0;i<bq.length;i++ ){for(var j=0;j<bl;j++ ){bm+=a;}
;bm+=L+i+g+this.debugProperties(bq.getItem(i),br-1,bo,bl+1)+bn;}
;return bm+bn;}
else if(bq.constructor!=null){var bs=bq.constructor.$$properties;for(var bp in bs){bm+=bn;for(var j=0;j<bl;j++ ){bm+=a;}
;bm+=H+bp+u+this.debugProperties(bq[w+qx.lang.String.firstUp(bp)](),br-1,bo,bl+1);}
;return bm;}
;return y;}
,startDisposeProfiling:qx.core.Environment.select(c,{"true":function(){this.disposeProfilingActive=true;this.__nM=qx.core.ObjectRegistry.getNextHash();}
,"default":(function(){}
)}),stopDisposeProfiling:qx.core.Environment.select(c,{"true":function(bv){if(!this.__nM){qx.log.Logger.error(r+this.classname+B);return [];}
;this.disposeProfilingActive=false;var bu=[];while(!qx.ui.core.queue.Dispose.isEmpty()){qx.ui.core.queue.Dispose.flush();}
;var bw=qx.core.ObjectRegistry.getNextHash();var by=qx.core.ObjectRegistry.getPostId();var bz=qx.core.ObjectRegistry.getStackTraces();for(var bx=this.__nM;bx<bw;bx++ ){var bt=qx.core.ObjectRegistry.fromHashCode(bx+by);if(bt&&bt.isDisposed&&!bt.isDisposed()){if(bv&&typeof bv==h&&!bv(bt)){continue;}
;if(bt.constructor.$$instance===bt){continue;}
;if(qx.Class.implementsInterface(bt,qx.event.IEventHandler)){continue;}
;if(bt.$$pooled){continue;}
;if(qx.Class.implementsInterface(bt,qx.ui.decoration.IDecorator)&&qx.theme.manager.Decoration.getInstance().isCached(bt)){continue;}
;if(bt.$$ignoreDisposeWarning){continue;}
;if(bt instanceof qx.bom.Font&&qx.theme.manager.Font.getInstance().isDynamic(bt)){continue;}
;bu.push({object:bt,stackTrace:bz[bx+by]?bz[bx+by]:null});}
;}
;delete this.__nM;return bu;}
,"default":(function(){}
)})}});}
)();
(function(){var a="qx.ui.decoration.IDecorator";qx.Interface.define(a,{members:{getStyles:function(){}
,getPadding:function(){}
,getInsets:function(){}
}});}
)();
(function(){var a="dispose",b="qx.ui.core.queue.Dispose";qx.Class.define(b,{statics:{__ej:[],add:function(d){var c=this.__ej;if(qx.lang.Array.contains(c,d)){return;}
;c.unshift(d);qx.ui.core.queue.Manager.scheduleFlush(a);}
,isEmpty:function(){return this.__ej.length==0;}
,flush:function(){var e=this.__ej;for(var i=e.length-1;i>=0;i-- ){var f=e[i];e.splice(i,1);f.dispose();}
;if(e.length!=0){return;}
;this.__ej=[];}
}});}
)();
(function(){var a="qx.util.DeferredCallManager",b="singleton";qx.Class.define(a,{extend:qx.core.Object,type:b,construct:function(){this.__el={};this.__em=qx.lang.Function.bind(this.__eq,this);this.__en=false;}
,members:{__eo:null,__ep:null,__el:null,__en:null,__em:null,schedule:function(d){if(this.__eo==null){this.__eo=window.setTimeout(this.__em,0);}
;var c=d.toHashCode();if(this.__ep&&this.__ep[c]){return;}
;this.__el[c]=d;this.__en=true;}
,cancel:function(f){var e=f.toHashCode();if(this.__ep&&this.__ep[e]){this.__ep[e]=null;return;}
;delete this.__el[e];if(qx.lang.Object.isEmpty(this.__el)&&this.__eo!=null){window.clearTimeout(this.__eo);this.__eo=null;}
;}
,__eq:qx.event.GlobalError.observeMethod(function(){this.__eo=null;while(this.__en){this.__ep=qx.lang.Object.clone(this.__el);this.__el={};this.__en=false;for(var h in this.__ep){var g=this.__ep[h];if(g){this.__ep[h]=null;g.call();}
;}
;}
;this.__ep=null;}
)},destruct:function(){if(this.__eo!=null){window.clearTimeout(this.__eo);}
;this.__em=this.__el=null;}
});}
)();
(function(){var a="qx.lang.Object";qx.Bootstrap.define(a,{statics:{empty:function(b){{}
;for(var c in b){if(b.hasOwnProperty(c)){delete b[c];}
;}
;}
,isEmpty:function(d){{}
;for(var e in d){return false;}
;return true;}
,getLength:qx.Bootstrap.objectGetLength,getValues:function(g){{}
;var h=[];var f=Object.keys(g);for(var i=0,l=f.length;i<l;i++ ){h.push(g[f[i]]);}
;return h;}
,mergeWith:qx.Bootstrap.objectMergeWith,clone:function(j,n){if(qx.lang.Type.isObject(j)){var k={};for(var m in j){if(n){k[m]=qx.lang.Object.clone(j[m],n);}
else {k[m]=j[m];}
;}
;return k;}
else if(qx.lang.Type.isArray(j)){var k=[];for(var i=0;i<j.length;i++ ){if(n){k[i]=qx.lang.Object.clone(j[i]);}
else {k[i]=j[i];}
;}
;return k;}
;return j;}
,invert:function(o){{}
;var p={};for(var q in o){p[o[q].toString()]=q;}
;return p;}
,getKeyFromValue:function(r,s){{}
;for(var t in r){if(r.hasOwnProperty(t)&&r[t]===s){return t;}
;}
;return null;}
,contains:function(u,v){{}
;return this.getKeyFromValue(u,v)!==null;}
,fromArray:function(w){{}
;var x={};for(var i=0,l=w.length;i<l;i++ ){{}
;x[w[i].toString()]=true;}
;return x;}
}});}
)();
(function(){var a="qx.util.DeferredCall";qx.Class.define(a,{extend:qx.core.Object,construct:function(b,c){qx.core.Object.call(this);this.__bF=b;this.__bH=c||null;this.__er=qx.util.DeferredCallManager.getInstance();}
,members:{__bF:null,__bH:null,__er:null,cancel:function(){this.__er.cancel(this);}
,schedule:function(){this.__er.schedule(this);}
,call:function(){{var d;}
;this.__bH?this.__bF.apply(this.__bH):this.__bF();}
},destruct:function(){this.cancel();this.__bH=this.__bF=this.__er=null;}
});}
)();
(function(){var a="mshtml",b="engine.name",c="pop.push.reverse.shift.sort.splice.unshift.join.slice",d="number",e="qx.type.BaseArray",f=".";qx.Bootstrap.define(e,{extend:Array,construct:function(g){}
,members:{toArray:null,valueOf:null,pop:null,push:null,reverse:null,shift:null,sort:null,splice:null,unshift:null,concat:null,join:null,slice:null,toString:null,indexOf:null,lastIndexOf:null,forEach:null,filter:null,map:null,some:null,every:null}});(function(){function h(p){if((qx.core.Environment.get(b)==a)){j.prototype={length:0,$$isArray:true};var n=c.split(f);for(var length=n.length;length;){j.prototype[n[ --length]]=Array.prototype[n[length]];}
;}
;var m=Array.prototype.slice;j.prototype.concat=function(){var r=this.slice(0);for(var i=0,length=arguments.length;i<length;i++ ){var q;if(arguments[i] instanceof j){q=m.call(arguments[i],0);}
else if(arguments[i] instanceof Array){q=arguments[i];}
else {q=[arguments[i]];}
;r.push.apply(r,q);}
;return r;}
;j.prototype.toString=function(){return m.call(this,0).toString();}
;j.prototype.toLocaleString=function(){return m.call(this,0).toLocaleString();}
;j.prototype.constructor=j;j.prototype.indexOf=Array.prototype.indexOf;j.prototype.lastIndexOf=Array.prototype.lastIndexOf;j.prototype.forEach=Array.prototype.forEach;j.prototype.some=Array.prototype.some;j.prototype.every=Array.prototype.every;var o=Array.prototype.filter;var l=Array.prototype.map;j.prototype.filter=function(){var s=new this.constructor;s.push.apply(s,o.apply(this,arguments));return s;}
;j.prototype.map=function(){var t=new this.constructor;t.push.apply(t,l.apply(this,arguments));return t;}
;j.prototype.slice=function(){var u=new this.constructor;u.push.apply(u,Array.prototype.slice.apply(this,arguments));return u;}
;j.prototype.splice=function(){var v=new this.constructor;v.push.apply(v,Array.prototype.splice.apply(this,arguments));return v;}
;j.prototype.toArray=function(){return Array.prototype.slice.call(this,0);}
;j.prototype.valueOf=function(){return this.length;}
;return j;}
;function j(length){if(arguments.length===1&&typeof length===d){this.length=-1<length&&length===length>>.5?length:this.push(length);}
else if(arguments.length){this.push.apply(this,arguments);}
;}
;function k(){}
;k.prototype=[];j.prototype=new k;j.prototype.length=0;qx.type.BaseArray=h(j);}
)();}
)();
(function(){var a="qxWeb";qx.Bootstrap.define(a,{extend:qx.type.BaseArray,statics:{__es:[],$$qx:qx,$init:function(e){var d=[];for(var i=0;i<e.length;i++ ){var c=!!(e[i]&&(e[i].nodeType===1||e[i].nodeType===9));if(c){d.push(e[i]);continue;}
;var b=!!(e[i]&&e[i].history&&e[i].location&&e[i].document);if(b){d.push(e[i]);}
;}
;var f=qx.lang.Array.cast(d,qxWeb);for(var i=0;i<qxWeb.__es.length;i++ ){qxWeb.__es[i].call(f);}
;return f;}
,$attach:function(g){for(var name in g){{}
;qxWeb.prototype[name]=g[name];}
;}
,$attachStatic:function(h){for(var name in h){{}
;qxWeb[name]=h[name];}
;}
,$attachInit:function(j){this.__es.push(j);}
,define:function(name,k){if(k==undefined){k=name;name=null;}
;return qx.Bootstrap.define.call(qx.Bootstrap,name,k);}
},construct:function(n,m){if(!n&&this instanceof qxWeb){return this;}
;if(qx.Bootstrap.isString(n)){if(m instanceof qxWeb){m=m[0];}
;n=qx.bom.Selector.query(n,m);}
else if(!(qx.Bootstrap.isArray(n))){n=[n];}
;return qxWeb.$init(n);}
,members:{filter:function(o){if(qx.lang.Type.isFunction(o)){return qxWeb.$init(Array.prototype.filter.call(this,o));}
;return qxWeb.$init(qx.bom.Selector.matches(o,this));}
,slice:function(p,r){if(r!==undefined){return qxWeb.$init(Array.prototype.slice.call(this,p,r));}
;return qxWeb.$init(Array.prototype.slice.call(this,p));}
,splice:function(s,t,u){return qxWeb.$init(Array.prototype.splice.apply(this,arguments));}
,map:function(v,w){return qxWeb.$init(Array.prototype.map.apply(this,arguments));}
,concat:function(y){var x=Array.prototype.slice.call(this,0);for(var i=0;i<arguments.length;i++ ){if(arguments[i] instanceof qxWeb){x=x.concat(Array.prototype.slice.call(arguments[i],0));}
else {x.push(arguments[i]);}
;}
;return qxWeb.$init(x);}
,_forEachElement:function(A,z){for(var i=0,l=this.length;i<l;i++ ){if(this[i]&&this[i].nodeType===1){A.apply(z||this,[this[i],i,this]);}
;}
;}
},defer:function(B){if(window.q==undefined){q=B;}
;}
});}
)();
(function(){var c="-",d="*(?:checked|disabled|ismap|multiple|readonly|selected|value)",f="(^|",g="'] ",h=":active",k=":disabled",l="div",n=")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:",o="[selected]",p="'></div>",q="[test!='']:sizzle",r="nth",s="*(?:",t="*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(",u="<a name='",v="option",w="image",x="*([\\x20\\t\\r\\n\\f>+~])",y="~=",z="previousSibling",A="*(even|odd|(([+-]|)(\\d*)n|)",B="only",C="*",D="+|((?:^|[^\\\\])(?:\\\\.)*)",E="i",F="='$1']",G="@",H="w#",I="^=",J="*\\)|)",K="+$",L="=",M=":focus",N="id",O="first",P="'></a><div name='",Q="$=",R="reset",S="string",T="[\\x20\\t\\r\\n\\f]",U="*(?:([+-]|)",V="*((?:-\\d)?\\d*)",W="#",X="input",Y="type",cH="parentNode",cI="(",cJ="w",cD="password",cE="even",cF="TAG",cG="*[>+~]|",cN="*\\]",cO="*(?:\"\"|'')",cT="*\\)|)(?=[^-]|$)",cP="unsupported pseudo: ",cK="w*",cL=" ",cM="*,",dx="text",ef="^",cU=")",cQ=":(",cR="[test^='']",ec="radio",cS="sizcache",cV="button",cW="0",cX="^(",dd="<input type='hidden'/>",de="odd",df="class",cY="*(\\d+)|))",da="<p test=''></p>",db="|=",dc="\\[",dk="<div class='hidden e'></div><div class='hidden'></div>",dl="g",dm="submit",dn="!=",dg="<select><option selected=''></option></select>",dh="e",di="checkbox",dj="*=",ds="|",dt=".",ee="<select></select>",du="object",dp="$1",dq="file",ed="eq",dr="qx.bom.Selector",dv="CHILD",dw="|$)",dI=",",dH=":(even|odd|eq|gt|lt|nth|first|last)(?:\\(",dG=")['\"]?\\]",dM="<a href='#'></a>",dL="empty",dK=":enabled",dJ="[id='",dB="(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+",dA="^#(",dz="[*^$]=",dy="^:(only|nth|first|last)-child(?:\\(",dF="*(",dE="^\\.(",dD="",dC="href",dT="multiple",dS=")|[^:]|\\\\.)*|.*))\\)|)",dR=")|)|)",dQ="POS",dX="boolean",dW="Syntax error, unrecognized expression: ",dV="([*^$|!~]?=)",dU="^\\[name=['\"]?(",dP="\\$&",dO=":checked",dN="undefined",eb="ID",ea="last",dY="HTML";qx.Bootstrap.define(dr,{statics:{query:null,matches:null}});(function(window,undefined){var ep,fg,eR,em,er,eA,fm,eF,es,eg,eK=true,eE=dN,fc=(cS+Math.random()).replace(dt,dD),eW=String,document=window.document,fv=document.documentElement,eJ=0,fs=0,eP=[].pop,fr=[].push,ev=[].slice,eQ=[].indexOf||function(fw){var i=0,fx=this.length;for(;i<fx;i++ ){if(this[i]===fw){return i;}
;}
;return -1;}
,fi=function(fy,fz){fy[fc]=fz==null||fz;return fy;}
,eo=function(){var fB={},fA=[];return fi(function(fC,fD){if(fA.push(fC)>eR.cacheLength){delete fB[fA.shift()];}
;return (fB[fC]=fD);}
,fB);}
,fj=eo(),fb=eo(),ft=eo(),ex=T,eT=dB,eN=eT.replace(cJ,H),ez=dV,eM=dc+ex+dF+eT+cU+ex+s+ez+ex+t+eN+dR+ex+cN,eS=cQ+eT+n+eM+dS,el=dH+ex+V+ex+cT,ek=new RegExp(ef+ex+D+ex+K,dl),fh=new RegExp(ef+ex+cM+ex+C),ey=new RegExp(ef+ex+x+ex+C),fd=new RegExp(eS),fp=/^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/,ff=/^:not/,eO=/[\x20\t\r\n\f]*[+~]/,eu=/:not\($/,ej=/h\d/i,eY=/input|select|textarea|button/i,eq=/\\(?!\\)/g,fl={"ID":new RegExp(dA+eT+cU),"CLASS":new RegExp(dE+eT+cU),"NAME":new RegExp(dU+eT+dG),"TAG":new RegExp(cX+eT.replace(cJ,cK)+cU),"ATTR":new RegExp(ef+eM),"PSEUDO":new RegExp(ef+eS),"POS":new RegExp(el,E),"CHILD":new RegExp(dy+ex+A+ex+U+ex+cY+ex+J,E),"needsContext":new RegExp(ef+ex+cG+el,E)},eV=function(fF){var fE=document.createElement(l);try{return fF(fE);}
catch(e){return false;}
finally{fE=null;}
;}
,en=eV(function(fG){fG.appendChild(document.createComment(dD));return !fG.getElementsByTagName(C).length;}
),eI=eV(function(fH){fH.innerHTML=dM;return fH.firstChild&&typeof fH.firstChild.getAttribute!==eE&&fH.firstChild.getAttribute(dC)===W;}
),fk=eV(function(fI){fI.innerHTML=ee;var fJ=typeof fI.lastChild.getAttribute(dT);return fJ!==dX&&fJ!==S;}
),fq=eV(function(fK){fK.innerHTML=dk;if(!fK.getElementsByClassName||!fK.getElementsByClassName(dh).length){return false;}
;fK.lastChild.className=dh;return fK.getElementsByClassName(dh).length===2;}
),eh=eV(function(fL){fL.id=fc+0;fL.innerHTML=u+fc+P+fc+p;fv.insertBefore(fL,fv.firstChild);var fM=document.getElementsByName&&document.getElementsByName(fc).length===2+document.getElementsByName(fc+0).length;fg=!document.getElementById(fc);fv.removeChild(fL);return fM;}
);try{ev.call(fv.childNodes,0)[0].nodeType;}
catch(e){ev=function(i){var fN,fO=[];for(;(fN=this[i]);i++ ){fO.push(fN);}
;return fO;}
;}
;function eX(fV,fU,fS,fT){fS=fS||[];fU=fU||document;var fW,fR,fP,m,fQ=fU.nodeType;if(!fV||typeof fV!==S){return fS;}
;if(fQ!==1&&fQ!==9){return [];}
;fP=er(fU);if(!fP&&!fT){if((fW=fp.exec(fV))){if((m=fW[1])){if(fQ===9){fR=fU.getElementById(m);if(fR&&fR.parentNode){if(fR.id===m){fS.push(fR);return fS;}
;}
else {return fS;}
;}
else {if(fU.ownerDocument&&(fR=fU.ownerDocument.getElementById(m))&&eA(fU,fR)&&fR.id===m){fS.push(fR);return fS;}
;}
;}
else if(fW[2]){fr.apply(fS,ev.call(fU.getElementsByTagName(fV),0));return fS;}
else if((m=fW[3])&&fq&&fU.getElementsByClassName){fr.apply(fS,ev.call(fU.getElementsByClassName(m),0));return fS;}
;}
;}
;return et(fV.replace(ek,dp),fU,fS,fT,fP);}
;eX.matches=function(fX,fY){return eX(fX,null,null,fY);}
;eX.matchesSelector=function(gb,ga){return eX(ga,null,null,[gb]).length>0;}
;function fo(gc){return function(gd){var name=gd.nodeName.toLowerCase();return name===X&&gd.type===gc;}
;}
;function ei(ge){return function(gf){var name=gf.nodeName.toLowerCase();return (name===X||name===cV)&&gf.type===ge;}
;}
;function eU(gg){return fi(function(gh){gh=+gh;return fi(function(gk,gi){var j,gj=gg([],gk.length,gh),i=gj.length;while(i-- ){if(gk[(j=gj[i])]){gk[j]=!(gi[j]=gk[j]);}
;}
;}
);}
);}
;em=eX.getText=function(gn){var gl,go=dD,i=0,gm=gn.nodeType;if(gm){if(gm===1||gm===9||gm===11){if(typeof gn.textContent===S){return gn.textContent;}
else {for(gn=gn.firstChild;gn;gn=gn.nextSibling){go+=em(gn);}
;}
;}
else if(gm===3||gm===4){return gn.nodeValue;}
;}
else {for(;(gl=gn[i]);i++ ){go+=em(gl);}
;}
;return go;}
;er=eX.isXML=function(gp){var gq=gp&&(gp.ownerDocument||gp).documentElement;return gq?gq.nodeName!==dY:false;}
;eA=eX.contains=fv.contains?function(a,b){var gr=a.nodeType===9?a.documentElement:a,gs=b&&b.parentNode;return a===gs||!!(gs&&gs.nodeType===1&&gr.contains&&gr.contains(gs));}
:fv.compareDocumentPosition?function(a,b){return b&&!!(a.compareDocumentPosition(b)&16);}
:function(a,b){while((b=b.parentNode)){if(b===a){return true;}
;}
;return false;}
;eX.attr=function(gu,name){var gv,gt=er(gu);if(!gt){name=name.toLowerCase();}
;if((gv=eR.attrHandle[name])){return gv(gu);}
;if(gt||fk){return gu.getAttribute(name);}
;gv=gu.getAttributeNode(name);return gv?typeof gu[name]===dX?gu[name]?name:null:gv.specified?gv.value:null:null;}
;eR=eX.selectors={cacheLength:50,createPseudo:fi,match:fl,attrHandle:eI?{}:{"href":function(gw){return gw.getAttribute(dC,2);}
,"type":function(gx){return gx.getAttribute(Y);}
},find:{"ID":fg?function(gz,gA,gy){if(typeof gA.getElementById!==eE&&!gy){var m=gA.getElementById(gz);return m&&m.parentNode?[m]:[];}
;}
:function(gC,gD,gB){if(typeof gD.getElementById!==eE&&!gB){var m=gD.getElementById(gC);return m?m.id===gC||typeof m.getAttributeNode!==eE&&m.getAttributeNode(N).value===gC?[m]:undefined:[];}
;}
,"TAG":en?function(gE,gF){if(typeof gF.getElementsByTagName!==eE){return gF.getElementsByTagName(gE);}
;}
:function(gJ,gK){var gH=gK.getElementsByTagName(gJ);if(gJ===C){var gI,gG=[],i=0;for(;(gI=gH[i]);i++ ){if(gI.nodeType===1){gG.push(gI);}
;}
;return gG;}
;return gH;}
,"NAME":eh&&function(gL,gM){if(typeof gM.getElementsByName!==eE){return gM.getElementsByName(name);}
;}
,"CLASS":fq&&function(gN,gP,gO){if(typeof gP.getElementsByClassName!==eE&&!gO){return gP.getElementsByClassName(gN);}
;}
},relative:{">":{dir:cH,first:true}," ":{dir:cH},"+":{dir:z,first:true},"~":{dir:z}},preFilter:{"ATTR":function(gQ){gQ[1]=gQ[1].replace(eq,dD);gQ[3]=(gQ[4]||gQ[5]||dD).replace(eq,dD);if(gQ[2]===y){gQ[3]=cL+gQ[3]+cL;}
;return gQ.slice(0,4);}
,"CHILD":function(gR){gR[1]=gR[1].toLowerCase();if(gR[1]===r){if(!gR[2]){eX.error(gR[0]);}
;gR[3]=+(gR[3]?gR[4]+(gR[5]||1):2*(gR[2]===cE||gR[2]===de));gR[4]=+((gR[6]+gR[7])||gR[2]===de);}
else if(gR[2]){eX.error(gR[0]);}
;return gR;}
,"PSEUDO":function(gT){var gS,gU;if(fl[dv].test(gT[0])){return null;}
;if(gT[3]){gT[2]=gT[3];}
else if((gS=gT[4])){if(fd.test(gS)&&(gU=eH(gS,true))&&(gU=gS.indexOf(cU,gS.length-gU)-gS.length)){gS=gS.slice(0,gU);gT[0]=gT[0].slice(0,gU);}
;gT[2]=gS;}
;return gT.slice(0,3);}
},filter:{"ID":fg?function(gV){gV=gV.replace(eq,dD);return function(gW){return gW.getAttribute(N)===gV;}
;}
:function(gX){gX=gX.replace(eq,dD);return function(ha){var gY=typeof ha.getAttributeNode!==eE&&ha.getAttributeNode(N);return gY&&gY.value===gX;}
;}
,"TAG":function(hb){if(hb===C){return function(){return true;}
;}
;hb=hb.replace(eq,dD).toLowerCase();return function(hc){return hc.nodeName&&hc.nodeName.toLowerCase()===hb;}
;}
,"CLASS":function(hd){var he=fj[fc][hd];if(!he){he=fj(hd,new RegExp(f+ex+cU+hd+cI+ex+dw));}
;return function(hf){return he.test(hf.className||(typeof hf.getAttribute!==eE&&hf.getAttribute(df))||dD);}
;}
,"ATTR":function(name,hg,hh){return function(hi,hj){var hk=eX.attr(hi,name);if(hk==null){return hg===dn;}
;if(!hg){return true;}
;hk+=dD;return hg===L?hk===hh:hg===dn?hk!==hh:hg===I?hh&&hk.indexOf(hh)===0:hg===dj?hh&&hk.indexOf(hh)>-1:hg===Q?hh&&hk.substr(hk.length-hh.length)===hh:hg===y?(cL+hk+cL).indexOf(hh)>-1:hg===db?hk===hh||hk.substr(0,hh.length+1)===hh+c:false;}
;}
,"CHILD":function(hl,hn,ho,hm){if(hl===r){return function(hr){var hp,hq,parent=hr.parentNode;if(ho===1&&hm===0){return true;}
;if(parent){hq=0;for(hp=parent.firstChild;hp;hp=hp.nextSibling){if(hp.nodeType===1){hq++ ;if(hr===hp){break;}
;}
;}
;}
;hq-=hm;return hq===ho||(hq%ho===0&&hq/ho>=0);}
;}
;return function(ht){var hs=ht;switch(hl){case B:case O:while((hs=hs.previousSibling)){if(hs.nodeType===1){return false;}
;}
;if(hl===O){return true;}
;hs=ht;case ea:while((hs=hs.nextSibling)){if(hs.nodeType===1){return false;}
;}
;return true;};}
;}
,"PSEUDO":function(hv,hw){var hu,hx=eR.pseudos[hv]||eR.setFilters[hv.toLowerCase()]||eX.error(cP+hv);if(hx[fc]){return hx(hw);}
;if(hx.length>1){hu=[hv,hv,dD,hw];return eR.setFilters.hasOwnProperty(hv.toLowerCase())?fi(function(hz,hy){var hA,hB=hx(hz,hw),i=hB.length;while(i-- ){hA=eQ.call(hz,hB[i]);hz[hA]=!(hy[hA]=hB[i]);}
;}
):function(hC){return hx(hC,0,hu);}
;}
;return hx;}
},pseudos:{"not":fi(function(hE){var hD=[],hF=[],hG=fm(hE.replace(ek,dp));return hG[fc]?fi(function(hL,hI,hM,hH){var hJ,hK=hG(hL,null,hH,[]),i=hL.length;while(i-- ){if((hJ=hK[i])){hL[i]=!(hI[i]=hJ);}
;}
;}
):function(hO,hP,hN){hD[0]=hO;hG(hD,null,hN,hF);return !hF.pop();}
;}
),"has":fi(function(hQ){return function(hR){return eX(hQ,hR).length>0;}
;}
),"contains":fi(function(hS){return function(hT){return (hT.textContent||hT.innerText||em(hT)).indexOf(hS)>-1;}
;}
),"enabled":function(hU){return hU.disabled===false;}
,"disabled":function(hV){return hV.disabled===true;}
,"checked":function(hW){var hX=hW.nodeName.toLowerCase();return (hX===X&&!!hW.checked)||(hX===v&&!!hW.selected);}
,"selected":function(hY){if(hY.parentNode){hY.parentNode.selectedIndex;}
;return hY.selected===true;}
,"parent":function(ia){return !eR.pseudos[dL](ia);}
,"empty":function(ic){var ib;ic=ic.firstChild;while(ic){if(ic.nodeName>G||(ib=ic.nodeType)===3||ib===4){return false;}
;ic=ic.nextSibling;}
;return true;}
,"header":function(ie){return ej.test(ie.nodeName);}
,"text":function(ih){var ig,ii;return ih.nodeName.toLowerCase()===X&&(ig=ih.type)===dx&&((ii=ih.getAttribute(Y))==null||ii.toLowerCase()===ig);}
,"radio":fo(ec),"checkbox":fo(di),"file":fo(dq),"password":fo(cD),"image":fo(w),"submit":ei(dm),"reset":ei(R),"button":function(ij){var name=ij.nodeName.toLowerCase();return name===X&&ij.type===cV||name===cV;}
,"input":function(ik){return eY.test(ik.nodeName);}
,"focus":function(im){var il=im.ownerDocument;return im===il.activeElement&&(!il.hasFocus||il.hasFocus())&&!!(im.type||im.href);}
,"active":function(io){return io===io.ownerDocument.activeElement;}
,"first":eU(function(ip,length,iq){return [0];}
),"last":eU(function(ir,length,is){return [length-1];}
),"eq":eU(function(it,length,iu){return [iu<0?iu+length:iu];}
),"even":eU(function(iv,length,iw){for(var i=0;i<length;i+=2){iv.push(i);}
;return iv;}
),"odd":eU(function(ix,length,iy){for(var i=1;i<length;i+=2){ix.push(i);}
;return ix;}
),"lt":eU(function(iz,length,iA){for(var i=iA<0?iA+length:iA; --i>=0;){iz.push(i);}
;return iz;}
),"gt":eU(function(iB,length,iC){for(var i=iC<0?iC+length:iC; ++i<length;){iB.push(i);}
;return iB;}
)}};function eL(a,b,iE){if(a===b){return iE;}
;var iD=a.nextSibling;while(iD){if(iD===b){return -1;}
;iD=iD.nextSibling;}
;return 1;}
;eF=fv.compareDocumentPosition?function(a,b){if(a===b){es=true;return 0;}
;return (!a.compareDocumentPosition||!b.compareDocumentPosition?a.compareDocumentPosition:a.compareDocumentPosition(b)&4)?-1:1;}
:function(a,b){if(a===b){es=true;return 0;}
else if(a.sourceIndex&&b.sourceIndex){return a.sourceIndex-b.sourceIndex;}
;var iJ,iH,iG=[],iL=[],iK=a.parentNode,iI=b.parentNode,iF=iK;if(iK===iI){return eL(a,b);}
else if(!iK){return -1;}
else if(!iI){return 1;}
;while(iF){iG.unshift(iF);iF=iF.parentNode;}
;iF=iI;while(iF){iL.unshift(iF);iF=iF.parentNode;}
;iJ=iG.length;iH=iL.length;for(var i=0;i<iJ&&i<iH;i++ ){if(iG[i]!==iL[i]){return eL(iG[i],iL[i]);}
;}
;return i===iJ?eL(a,iL[i],-1):eL(iG[i],b,1);}
;[0,0].sort(eF);eK=!es;eX.uniqueSort=function(iM){var iN,i=1;es=eK;iM.sort(eF);if(es){for(;(iN=iM[i]);i++ ){if(iN===iM[i-1]){iM.splice(i-- ,1);}
;}
;}
;return iM;}
;eX.error=function(iO){throw new Error(dW+iO);}
;function eH(iS,iR){var iY,iX,iP,iW,iT,iV,iU,iQ=fb[fc][iS];if(iQ){return iR?0:iQ.slice(0);}
;iT=iS;iV=[];iU=eR.preFilter;while(iT){if(!iY||(iX=fh.exec(iT))){if(iX){iT=iT.slice(iX[0].length);}
;iV.push(iP=[]);}
;iY=false;if((iX=ey.exec(iT))){iP.push(iY=new eW(iX.shift()));iT=iT.slice(iY.length);iY.type=iX[0].replace(ek,cL);}
;for(iW in eR.filter){if((iX=fl[iW].exec(iT))&&(!iU[iW]||(iX=iU[iW](iX,document,true)))){iP.push(iY=new eW(iX.shift()));iT=iT.slice(iY.length);iY.type=iW;iY.matches=iX;}
;}
;if(!iY){break;}
;}
;return iR?iT.length:iT?eX.error(iS):fb(iS,iV).slice(0);}
;function eC(ja,jb,jc){var jd=jb.dir,jf=jc&&jb.dir===cH,je=fs++ ;return jb.first?function(jh,ji,jg){while((jh=jh[jd])){if(jf||jh.nodeType===1){return ja(jh,ji,jg);}
;}
;}
:function(jn,jo,jj){if(!jj){var jl,jm=eJ+cL+je+cL,jk=jm+ep;while((jn=jn[jd])){if(jf||jn.nodeType===1){if((jl=jn[fc])===jk){return jn.sizset;}
else if(typeof jl===S&&jl.indexOf(jm)===0){if(jn.sizset){return jn;}
;}
else {jn[fc]=jk;if(ja(jn,jo,jj)){jn.sizset=true;return jn;}
;jn.sizset=false;}
;}
;}
;}
else {while((jn=jn[jd])){if(jf||jn.nodeType===1){if(ja(jn,jo,jj)){return jn;}
;}
;}
;}
;}
;}
;function eD(jp){return jp.length>1?function(jr,js,jq){var i=jp.length;while(i-- ){if(!jp[i](jr,js,jq)){return false;}
;}
;return true;}
:jp[0];}
;function eB(jw,ju,jx,jz,jt){var jv,jB=[],i=0,jy=jw.length,jA=ju!=null;for(;i<jy;i++ ){if((jv=jw[i])){if(!jx||jx(jv,jz,jt)){jB.push(jv);if(jA){ju.push(i);}
;}
;}
;}
;return jB;}
;function ew(jG,jF,jE,jD,jC,jH){if(jD&&!jD[fc]){jD=ew(jD);}
;if(jC&&!jC[fc]){jC=ew(jC,jH);}
;return fi(function(jQ,jL,jR,jI){if(jQ&&jC){return;}
;var i,jN,jJ,jP=[],jT=[],jK=jL.length,jS=jQ||fe(jF||C,jR.nodeType?[jR]:jR,[],jQ),jM=jG&&(jQ||!jF)?eB(jS,jP,jG,jR,jI):jS,jO=jE?jC||(jQ?jG:jK||jD)?[]:jL:jM;if(jE){jE(jM,jO,jR,jI);}
;if(jD){jJ=eB(jO,jT);jD(jJ,[],jR,jI);i=jJ.length;while(i-- ){if((jN=jJ[i])){jO[jT[i]]=!(jM[jT[i]]=jN);}
;}
;}
;if(jQ){i=jG&&jO.length;while(i-- ){if((jN=jO[i])){jQ[jP[i]]=!(jL[jP[i]]=jN);}
;}
;}
else {jO=eB(jO===jL?jO.splice(jK,jO.length):jO);if(jC){jC(null,jL,jO,jI);}
else {fr.apply(jL,jO);}
;}
;}
);}
;function fa(ka){var jU,jW,j,jX=ka.length,jV=eR.relative[ka[0].type],kd=jV||eR.relative[cL],i=jV?1:0,kc=eC(function(ke){return ke===jU;}
,kd,true),jY=eC(function(kf){return eQ.call(jU,kf)>-1;}
,kd,true),kb=[function(kh,ki,kg){return (!jV&&(kg||ki!==eg))||((jU=ki).nodeType?kc(kh,ki,kg):jY(kh,ki,kg));}
];for(;i<jX;i++ ){if((jW=eR.relative[ka[i].type])){kb=[eC(eD(kb),jW)];}
else {jW=eR.filter[ka[i].type].apply(null,ka[i].matches);if(jW[fc]){j= ++i;for(;j<jX;j++ ){if(eR.relative[ka[j].type]){break;}
;}
;return ew(i>1&&eD(kb),i>1&&ka.slice(0,i-1).join(dD).replace(ek,dp),jW,i<j&&fa(ka.slice(i,j)),j<jX&&fa((ka=ka.slice(j))),j<jX&&ka.join(dD));}
;kb.push(jW);}
;}
;return eD(kb);}
;function eG(kn,kk){var kj=kk.length>0,kl=kn.length>0,km=function(kx,kz,ko,kt,kq){var kv,j,ks,kw=[],kp=0,i=cW,ku=kx&&[],kA=kq!=null,kr=eg,kB=kx||kl&&eR.find[cF](C,kq&&kz.parentNode||kz),ky=(eJ+=kr==null?1:Math.E);if(kA){eg=kz!==document&&kz;ep=km.el;}
;for(;(kv=kB[i])!=null;i++ ){if(kl&&kv){for(j=0;(ks=kn[j]);j++ ){if(ks(kv,kz,ko)){kt.push(kv);break;}
;}
;if(kA){eJ=ky;ep= ++km.el;}
;}
;if(kj){if((kv=!ks&&kv)){kp-- ;}
;if(kx){ku.push(kv);}
;}
;}
;kp+=i;if(kj&&i!==kp){for(j=0;(ks=kk[j]);j++ ){ks(ku,kw,kz,ko);}
;if(kx){if(kp>0){while(i-- ){if(!(ku[i]||kw[i])){kw[i]=eP.call(kt);}
;}
;}
;kw=eB(kw);}
;fr.apply(kt,kw);if(kA&&!kx&&kw.length>0&&(kp+kk.length)>1){eX.uniqueSort(kt);}
;}
;if(kA){eJ=ky;eg=kr;}
;return ku;}
;km.el=0;return kj?fi(km):km;}
;fm=eX.compile=function(kE,kC){var i,kG=[],kD=[],kF=ft[fc][kE];if(!kF){if(!kC){kC=eH(kE);}
;i=kC.length;while(i-- ){kF=fa(kC[i]);if(kF[fc]){kG.push(kF);}
else {kD.push(kF);}
;}
;kF=ft(kE,eG(kD,kG));}
;return kF;}
;function fe(kK,kH,kI,kL){var i=0,kJ=kH.length;for(;i<kJ;i++ ){eX(kK,kH[i],kI,kL);}
;return kI;}
;function et(kO,kS,kN,kR,kM){var i,kP,kQ,kT,find,kU=eH(kO),j=kU.length;if(!kR){if(kU.length===1){kP=kU[0]=kU[0].slice(0);if(kP.length>2&&(kQ=kP[0]).type===eb&&kS.nodeType===9&&!kM&&eR.relative[kP[1].type]){kS=eR.find[eb](kQ.matches[0].replace(eq,dD),kS,kM)[0];if(!kS){return kN;}
;kO=kO.slice(kP.shift().length);}
;for(i=fl[dQ].test(kO)?-1:kP.length-1;i>=0;i-- ){kQ=kP[i];if(eR.relative[(kT=kQ.type)]){break;}
;if((find=eR.find[kT])){if((kR=find(kQ.matches[0].replace(eq,dD),eO.test(kP[0].type)&&kS.parentNode||kS,kM))){kP.splice(i,1);kO=kR.length&&kP.join(dD);if(!kO){fr.apply(kN,ev.call(kR,0));return kN;}
;break;}
;}
;}
;}
;}
;fm(kO,kU)(kR,kS,kM,kN,eO.test(kO));return kN;}
;if(document.querySelectorAll){(function(){var kW,lc=et,lb=/'|\\/g,kY=/\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g,kX=[M],kV=[h,M],la=fv.matchesSelector||fv.mozMatchesSelector||fv.webkitMatchesSelector||fv.oMatchesSelector||fv.msMatchesSelector;eV(function(ld){ld.innerHTML=dg;if(!ld.querySelectorAll(o).length){kX.push(dc+ex+d);}
;if(!ld.querySelectorAll(dO).length){kX.push(dO);}
;}
);eV(function(le){le.innerHTML=da;if(le.querySelectorAll(cR).length){kX.push(dz+ex+cO);}
;le.innerHTML=dd;if(!le.querySelectorAll(dK).length){kX.push(dK,k);}
;}
);kX=new RegExp(kX.join(ds));et=function(lk,ln,li,lm,lf){if(!lm&&!lf&&(!kX||!kX.test(lk))){var lh,i,lg=true,lj=fc,lo=ln,ll=ln.nodeType===9&&lk;if(ln.nodeType===1&&ln.nodeName.toLowerCase()!==du){lh=eH(lk);if((lg=ln.getAttribute(N))){lj=lg.replace(lb,dP);}
else {ln.setAttribute(N,lj);}
;lj=dJ+lj+g;i=lh.length;while(i-- ){lh[i]=lj+lh[i].join(dD);}
;lo=eO.test(lk)&&ln.parentNode||ln;ll=lh.join(dI);}
;if(ll){try{fr.apply(li,ev.call(lo.querySelectorAll(ll),0));return li;}
catch(lp){}
finally{if(!lg){ln.removeAttribute(N);}
;}
;}
;}
;return lc(lk,ln,li,lm,lf);}
;if(la){eV(function(lq){kW=la.call(lq,l);try{la.call(lq,q);kV.push(dn,eS);}
catch(e){}
;}
);kV=new RegExp(kV.join(ds));eX.matchesSelector=function(ls,lr){lr=lr.replace(kY,F);if(!er(ls)&&!kV.test(lr)&&(!kX||!kX.test(lr))){try{var lt=la.call(ls,lr);if(lt||kW||ls.document&&ls.document.nodeType!==11){return lt;}
;}
catch(e){}
;}
;return eX(lr,null,null,[ls]).length>0;}
;}
;}
)();}
;eR.pseudos[r]=eR.pseudos[ed];function fu(){}
;eR.filters=fu.prototype=eR.pseudos;eR.setFilters=new fu();qx.bom.Selector.query=function(lv,lu){return eX(lv,lu);}
;qx.bom.Selector.matches=function(lx,lw){return eX(lx,null,null,lw);}
;}
)(window);}
)();
(function(){var a="qx.module.Polyfill";qx.Bootstrap.define(a,{});}
)();
(function(){var a="mshtml",b="engine.name",c="*",d="load",e="left",f="qx.module.Event",g="undefined",h="DOMContentLoaded",n="browser.documentmode",o="complete";qx.Bootstrap.define(f,{statics:{__et:{},__eu:{on:{},off:{}},on:function(w,t,u){for(var i=0;i<this.length;i++ ){var p=this[i];var q=u||qxWeb(p);var v=qx.module.Event.__eu.on;var s=v[c]||[];if(v[w]){s=s.concat(v[w]);}
;for(var j=0,m=s.length;j<m;j++ ){s[j](p,w,t,u);}
;var r=function(event){var B=qx.module.Event.__et;var A=B[c]||[];if(B[w]){A=A.concat(B[w]);}
;for(var x=0,y=A.length;x<y;x++ ){event=A[x](event,p,w);}
;t.apply(this,[event]);}
.bind(q);r.original=t;if(qx.bom.Event.supportsEvent(p,w)){qx.bom.Event.addNativeListener(p,w,r);}
;if(!p.__ev){p.__ev=new qx.event.Emitter();}
;var z=p.__ev.on(w,r,q);if(!p.__ew){p.__ew={};}
;if(!p.__ew[w]){p.__ew[w]={};}
;p.__ew[w][z]=r;if(!u){if(!p.__ex){p.__ex={};}
;p.__ex[z]=q;}
;}
;return this;}
,off:function(L,D,I){var H=(D===null&&I===null);for(var j=0;j<this.length;j++ ){var C=this[j];if(!C.__ew){continue;}
;var N=[];if(L!==null){N.push(L);}
else {for(var F in C.__ew){N.push(F);}
;}
;for(var i=0,l=N.length;i<l;i++ ){for(var G in C.__ew[N[i]]){var K=C.__ew[N[i]][G];if(H||K==D||K.original==D){var E=typeof C.__ex!==g&&C.__ex[G];var O;if(!I&&E){O=C.__ex[G];}
;C.__ev.off(N[i],K,O||I);if(H||K.original==D){qx.bom.Event.removeNativeListener(C,N[i],K);}
;delete C.__ew[N[i]][G];if(E){delete C.__ex[G];}
;}
;}
;var J=qx.module.Event.__eu.off;var M=J[c]||[];if(J[L]){M=M.concat(J[L]);}
;for(var k=0,m=M.length;k<m;k++ ){M[k](C,L,D,I);}
;}
;}
;return this;}
,allOff:function(P){return this.off(P||null,null,null);}
,emit:function(Q,R){for(var j=0;j<this.length;j++ ){var S=this[j];if(S.__ev){S.__ev.emit(Q,R);}
;}
;return this;}
,once:function(U,T,W){var self=this;var V=function(X){self.off(U,V,W);T.call(this,X);}
;this.on(U,V,W);return this;}
,hasListener:function(Y){if(!this[0]||!this[0].__ev||!this[0].__ev.getListeners()[Y]){return false;}
;return this[0].__ev.getListeners()[Y].length>0;}
,copyEventsTo:function(bg){var be=this.concat();var bf=bg.concat();for(var i=be.length-1;i>=0;i-- ){var bb=be[i].getElementsByTagName(c);for(var j=0;j<bb.length;j++ ){be.push(bb[j]);}
;}
;for(var i=bf.length-1;i>=0;i-- ){var bb=bf[i].getElementsByTagName(c);for(var j=0;j<bb.length;j++ ){bf.push(bb[j]);}
;}
;bf.forEach(function(bh){bh.__ev=null;}
);for(var i=0;i<be.length;i++ ){var ba=be[i];if(!ba.__ev){continue;}
;var bc=ba.__ev.getListeners();for(var name in bc){for(var j=bc[name].length-1;j>=0;j-- ){var bd=bc[name][j].listener;if(bd.original){bd=bd.original;}
;qxWeb(bf[i]).on(name,bd,bc[name][j].ctx);}
;}
;}
;}
,__cR:false,ready:function(bi){if(document.readyState===o){window.setTimeout(bi,1);return;}
;var bj=function(){qx.module.Event.__cR=true;bi();}
;qxWeb(window).on(d,bj);var bk=function(){qxWeb(window).off(d,bj);bi();}
;if(qxWeb.env.get(b)!==a||qxWeb.env.get(n)>8){qx.bom.Event.addNativeListener(document,h,bk);}
else {var bl=function(){if(qx.module.Event.__cR){return;}
;try{document.documentElement.doScroll(e);if(document.body){bk();}
;}
catch(bm){window.setTimeout(bl,100);}
;}
;bl();}
;}
,$registerNormalization:function(bq,bn){if(!qx.lang.Type.isArray(bq)){bq=[bq];}
;var bo=qx.module.Event.__et;for(var i=0,l=bq.length;i<l;i++ ){var bp=bq[i];if(qx.lang.Type.isFunction(bn)){if(!bo[bp]){bo[bp]=[];}
;bo[bp].push(bn);}
;}
;}
,$unregisterNormalization:function(bu,br){if(!qx.lang.Type.isArray(bu)){bu=[bu];}
;var bs=qx.module.Event.__et;for(var i=0,l=bu.length;i<l;i++ ){var bt=bu[i];if(bs[bt]){qx.lang.Array.remove(bs[bt],br);}
;}
;}
,$getRegistry:function(){return qx.module.Event.__et;}
,$registerEventHook:function(bA,bx,bw){if(!qx.lang.Type.isArray(bA)){bA=[bA];}
;var by=qx.module.Event.__eu.on;for(var i=0,l=bA.length;i<l;i++ ){var bz=bA[i];if(qx.lang.Type.isFunction(bx)){if(!by[bz]){by[bz]=[];}
;by[bz].push(bx);}
;}
;if(!bw){return;}
;var bv=qx.module.Event.__eu.off;for(var i=0,l=bA.length;i<l;i++ ){var bz=bA[i];if(qx.lang.Type.isFunction(bw)){if(!bv[bz]){bv[bz]=[];}
;bv[bz].push(bw);}
;}
;}
,$unregisterEventHook:function(bG,bD,bC){if(!qx.lang.Type.isArray(bG)){bG=[bG];}
;var bE=qx.module.Event.__eu.on;for(var i=0,l=bG.length;i<l;i++ ){var bF=bG[i];if(bE[bF]){qx.lang.Array.remove(bE[bF],bD);}
;}
;if(!bC){return;}
;var bB=qx.module.Event.__eu.off;for(var i=0,l=bG.length;i<l;i++ ){var bF=bG[i];if(bB[bF]){qx.lang.Array.remove(bB[bF],bC);}
;}
;}
,$getHookRegistry:function(){return qx.module.Event.__eu;}
},defer:function(bH){qxWeb.$attach({"on":bH.on,"off":bH.off,"allOff":bH.allOff,"once":bH.once,"emit":bH.emit,"hasListener":bH.hasListener,"copyEventsTo":bH.copyEventsTo});qxWeb.$attachStatic({"ready":bH.ready,"$registerEventNormalization":bH.$registerNormalization,"$unregisterEventNormalization":bH.$unregisterNormalization,"$getEventNormalizationRegistry":bH.$getRegistry,"$registerEventHook":bH.$registerEventHook,"$unregisterEventHook":bH.$unregisterEventHook,"$getEventHookRegistry":bH.$getHookRegistry});}
});}
)();
(function(){var a="qx.event.Emitter",b="*";qx.Bootstrap.define(a,{extend:Object,statics:{__ey:[]},members:{__ew:null,__ez:null,on:function(name,c,d){var e=qx.event.Emitter.__ey.length;this.__eA(name).push({listener:c,ctx:d,id:e});qx.event.Emitter.__ey.push({name:name,listener:c,ctx:d});return e;}
,once:function(name,f,g){var h=qx.event.Emitter.__ey.length;this.__eA(name).push({listener:f,ctx:g,once:true,id:h});qx.event.Emitter.__ey.push({name:name,listener:f,ctx:g});return h;}
,off:function(name,l,j){var k=this.__eA(name);for(var i=k.length-1;i>=0;i-- ){var m=k[i];if(m.listener==l&&m.ctx==j){k.splice(i,1);qx.event.Emitter.__ey[m.id]=null;return m.id;}
;}
;return null;}
,offById:function(o){var n=qx.event.Emitter.__ey[o];if(n){this.off(n.name,n.listener,n.ctx);}
;return null;}
,addListener:function(name,p,q){return this.on(name,p,q);}
,addListenerOnce:function(name,r,s){return this.once(name,r,s);}
,removeListener:function(name,t,u){this.off(name,t,u);}
,removeListenerById:function(v){this.offById(v);}
,emit:function(name,y){var x=this.__eA(name);for(var i=0;i<x.length;i++ ){var w=x[i];w.listener.call(w.ctx,y);if(w.once){x.splice(i,1);i-- ;}
;}
;x=this.__eA(b);for(var i=x.length-1;i>=0;i-- ){var w=x[i];w.listener.call(w.ctx,y);}
;}
,getListeners:function(){return this.__ew;}
,__eA:function(name){if(this.__ew==null){this.__ew={};}
;if(this.__ew[name]==null){this.__ew[name]=[];}
;return this.__ew[name];}
}});}
)();
(function(){var a="none",b="qx.module.Css",c="",d="display";qx.Bootstrap.define(b,{statics:{setStyle:function(name,e){if(/\w-\w/.test(name)){name=qx.lang.String.camelCase(name);}
;this._forEachElement(function(f){qx.bom.element.Style.set(f,name,e);}
);return this;}
,getStyle:function(name){if(this[0]&&qx.dom.Node.isElement(this[0])){if(/\w-\w/.test(name)){name=qx.lang.String.camelCase(name);}
;return qx.bom.element.Style.get(this[0],name);}
;return null;}
,setStyles:function(g){for(var name in g){this.setStyle(name,g[name]);}
;return this;}
,getStyles:function(j){var h={};for(var i=0;i<j.length;i++ ){h[j[i]]=this.getStyle(j[i]);}
;return h;}
,addClass:function(name){this._forEachElement(function(k){qx.bom.element.Class.add(k,name);}
);return this;}
,addClasses:function(m){this._forEachElement(function(n){qx.bom.element.Class.addClasses(n,m);}
);return this;}
,removeClass:function(name){this._forEachElement(function(o){qx.bom.element.Class.remove(o,name);}
);return this;}
,removeClasses:function(p){this._forEachElement(function(q){qx.bom.element.Class.removeClasses(q,p);}
);return this;}
,hasClass:function(name){if(!this[0]||!qx.dom.Node.isElement(this[0])){return false;}
;return qx.bom.element.Class.has(this[0],name);}
,getClass:function(){if(!this[0]||!qx.dom.Node.isElement(this[0])){return c;}
;return qx.bom.element.Class.get(this[0]);}
,toggleClass:function(name){var r=qx.bom.element.Class;this._forEachElement(function(s){r.has(s,name)?r.remove(s,name):r.add(s,name);}
);return this;}
,toggleClasses:function(t){for(var i=0,l=t.length;i<l;i++ ){this.toggleClass(t[i]);}
;return this;}
,replaceClass:function(v,u){this._forEachElement(function(w){qx.bom.element.Class.replace(w,v,u);}
);return this;}
,getHeight:function(){var x=this[0];if(x){if(qx.dom.Node.isElement(x)){return qx.bom.element.Dimension.getHeight(x);}
else if(qx.dom.Node.isDocument(x)){return qx.bom.Document.getHeight(qx.dom.Node.getWindow(x));}
else if(qx.dom.Node.isWindow(x)){return qx.bom.Viewport.getHeight(x);}
;}
;return null;}
,getWidth:function(){var y=this[0];if(y){if(qx.dom.Node.isElement(y)){return qx.bom.element.Dimension.getWidth(y);}
else if(qx.dom.Node.isDocument(y)){return qx.bom.Document.getWidth(qx.dom.Node.getWindow(y));}
else if(qx.dom.Node.isWindow(y)){return qx.bom.Viewport.getWidth(y);}
;}
;return null;}
,getOffset:function(){var z=this[0];if(z&&qx.dom.Node.isElement(z)){return qx.bom.element.Location.get(z);}
;return null;}
,getContentHeight:function(){var A=this[0];if(qx.dom.Node.isElement(A)){return qx.bom.element.Dimension.getContentHeight(A);}
;return null;}
,getContentWidth:function(){var B=this[0];if(qx.dom.Node.isElement(B)){return qx.bom.element.Dimension.getContentWidth(B);}
;return null;}
,getPosition:function(){var C=this[0];if(qx.dom.Node.isElement(C)){return qx.bom.element.Location.getPosition(C);}
;return null;}
,includeStylesheet:function(E,D){qx.bom.Stylesheet.includeFile(E,D);}
,hide:function(){this._forEachElement(function(F,H){var I=this.eq(H);var G=I.getStyle(d);if(G!==a){I[0].$$qPrevDisp=G;I.setStyle(d,a);}
;}
);return this;}
,show:function(){this._forEachElement(function(P,J){var K=this.eq(J);var N=K.getStyle(d);var M=K[0].$$qPrevDisp;var O;if(N==a){if(M&&M!=a){O=M;}
else {var L=qxWeb.getDocument(K[0]);O=qx.module.Css.__eC(K[0].tagName,L);}
;K.setStyle(d,O);K[0].$$qPrevDisp=a;}
;}
);return this;}
,__eB:{},__eC:function(T,Q){var S=qx.module.Css.__eB;if(!S[T]){var U=Q||document;var R=qxWeb(U.createElement(T)).appendTo(Q.body);S[T]=R.getStyle(d);R.remove();}
;return S[T]||c;}
},defer:function(V){qxWeb.$attach({"setStyle":V.setStyle,"getStyle":V.getStyle,"setStyles":V.setStyles,"getStyles":V.getStyles,"addClass":V.addClass,"addClasses":V.addClasses,"removeClass":V.removeClass,"removeClasses":V.removeClasses,"hasClass":V.hasClass,"getClass":V.getClass,"toggleClass":V.toggleClass,"toggleClasses":V.toggleClasses,"replaceClass":V.replaceClass,"getHeight":V.getHeight,"getWidth":V.getWidth,"getOffset":V.getOffset,"getContentHeight":V.getContentHeight,"getContentWidth":V.getContentWidth,"getPosition":V.getPosition,"hide":V.hide,"show":V.show});qxWeb.$attachStatic({"includeStylesheet":V.includeStylesheet});}
});}
)();
(function(){var a="engine.name",b=");",c="",d=")",e="zoom:1;filter:alpha(opacity=",f="qx.bom.element.Opacity",g="css.opacity",h=";",i="opacity:",j="alpha(opacity=",k="opacity",l="filter";qx.Bootstrap.define(f,{statics:{compile:qx.core.Environment.select(a,{"mshtml":function(m){if(m>=1){m=1;}
;if(m<0.00001){m=0;}
;if(qx.core.Environment.get(g)){return i+m+h;}
else {return e+(m*100)+b;}
;}
,"default":function(n){if(n>=1){return c;}
;return i+n+h;}
}),set:qx.core.Environment.select(a,{"mshtml":function(q,o){if(qx.core.Environment.get(g)){if(o>=1){o=c;}
;q.style.opacity=o;}
else {var p=qx.bom.element.Style.get(q,l,qx.bom.element.Style.COMPUTED_MODE,false);if(o>=1){o=1;}
;if(o<0.00001){o=0;}
;if(!q.currentStyle||!q.currentStyle.hasLayout){q.style.zoom=1;}
;q.style.filter=p.replace(/alpha\([^\)]*\)/gi,c)+j+o*100+d;}
;}
,"default":function(s,r){if(r>=1){r=c;}
;s.style.opacity=r;}
}),reset:qx.core.Environment.select(a,{"mshtml":function(u){if(qx.core.Environment.get(g)){u.style.opacity=c;}
else {var t=qx.bom.element.Style.get(u,l,qx.bom.element.Style.COMPUTED_MODE,false);u.style.filter=t.replace(/alpha\([^\)]*\)/gi,c);}
;}
,"default":function(v){v.style.opacity=c;}
}),get:qx.core.Environment.select(a,{"mshtml":function(z,y){if(qx.core.Environment.get(g)){var w=qx.bom.element.Style.get(z,k,y,false);if(w!=null){return parseFloat(w);}
;return 1.0;}
else {var x=qx.bom.element.Style.get(z,l,y,false);if(x){var w=x.match(/alpha\(opacity=(.*)\)/);if(w&&w[1]){return parseFloat(w[1])/100;}
;}
;return 1.0;}
;}
,"default":function(C,B){var A=qx.bom.element.Style.get(C,k,B,false);if(A!=null){return parseFloat(A);}
;return 1.0;}
})}});}
)();
(function(){var a="rim_tabletos",b="10.1",c="Darwin",d="10.3",e="os.version",f="10.7",g="2003",h=")",i="iPhone",j="android",k="unix",l="ce",m="7",n="SymbianOS",o="10.5",p="os.name",q="10.9",r="|",s="MacPPC",t="95",u="iPod",v="10.8",w="\.",x="Win64",y="linux",z="me",A="10.2",B="Macintosh",C="Android",D="Windows",E="98",F="ios",G="vista",H="8",I="blackberry",J="2000",K="8.1",L="(",M="",N="win",O="Linux",P="10.6",Q="BSD",R="10.0",S="10.4",T="Mac OS X",U="iPad",V="X11",W="xp",X="symbian",Y="qx.bom.client.OperatingSystem",bo="g",bp="Win32",bq="osx",bk="webOS",bl="RIM Tablet OS",bm="BlackBerry",bn="nt4",br=".",bs="MacIntel",bt="webos";qx.Bootstrap.define(Y,{statics:{getName:function(){if(!navigator){return M;}
;var bu=navigator.platform||M;var bv=navigator.userAgent||M;if(bu.indexOf(D)!=-1||bu.indexOf(bp)!=-1||bu.indexOf(x)!=-1){return N;}
else if(bu.indexOf(B)!=-1||bu.indexOf(s)!=-1||bu.indexOf(bs)!=-1||bu.indexOf(T)!=-1){return bq;}
else if(bv.indexOf(bl)!=-1){return a;}
else if(bv.indexOf(bk)!=-1){return bt;}
else if(bu.indexOf(u)!=-1||bu.indexOf(i)!=-1||bu.indexOf(U)!=-1){return F;}
else if(bv.indexOf(C)!=-1){return j;}
else if(bu.indexOf(O)!=-1){return y;}
else if(bu.indexOf(V)!=-1||bu.indexOf(Q)!=-1||bu.indexOf(c)!=-1){return k;}
else if(bu.indexOf(n)!=-1){return X;}
else if(bu.indexOf(bm)!=-1){return I;}
;return M;}
,__cU:{"Windows NT 6.3":K,"Windows NT 6.2":H,"Windows NT 6.1":m,"Windows NT 6.0":G,"Windows NT 5.2":g,"Windows NT 5.1":W,"Windows NT 5.0":J,"Windows 2000":J,"Windows NT 4.0":bn,"Win 9x 4.90":z,"Windows CE":l,"Windows 98":E,"Win98":E,"Windows 95":t,"Win95":t,"Mac OS X 10_9":q,"Mac OS X 10.9":q,"Mac OS X 10_8":v,"Mac OS X 10.8":v,"Mac OS X 10_7":f,"Mac OS X 10.7":f,"Mac OS X 10_6":P,"Mac OS X 10.6":P,"Mac OS X 10_5":o,"Mac OS X 10.5":o,"Mac OS X 10_4":S,"Mac OS X 10.4":S,"Mac OS X 10_3":d,"Mac OS X 10.3":d,"Mac OS X 10_2":A,"Mac OS X 10.2":A,"Mac OS X 10_1":b,"Mac OS X 10.1":b,"Mac OS X 10_0":R,"Mac OS X 10.0":R},getVersion:function(){var bw=qx.bom.client.OperatingSystem.__cV(navigator.userAgent);if(bw==null){bw=qx.bom.client.OperatingSystem.__cW(navigator.userAgent);}
;if(bw!=null){return bw;}
else {return M;}
;}
,__cV:function(bx){var bA=[];for(var bz in qx.bom.client.OperatingSystem.__cU){bA.push(bz);}
;var bB=new RegExp(L+bA.join(r).replace(/\./g,w)+h,bo);var by=bB.exec(bx);if(by&&by[1]){return qx.bom.client.OperatingSystem.__cU[by[1]];}
;return null;}
,__cW:function(bF){var bG=bF.indexOf(C)!=-1;var bC=bF.match(/(iPad|iPhone|iPod)/i)?true:false;if(bG){var bE=new RegExp(/ Android (\d+(?:\.\d+)+)/i);var bH=bE.exec(bF);if(bH&&bH[1]){return bH[1];}
;}
else if(bC){var bI=new RegExp(/(CPU|iPhone|iPod) OS (\d+)_(\d+)\s+/);var bD=bI.exec(bF);if(bD&&bD[2]&&bD[3]){return bD[2]+br+bD[3];}
;}
;return null;}
},defer:function(bJ){qx.core.Environment.add(p,bJ.getName);qx.core.Environment.add(e,bJ.getVersion);}
});}
)();
(function(){var a="CSS1Compat",b="msie",c="android",d="operamini",e="gecko",f="maple",g="browser.quirksmode",h="browser.name",i="trident",j="mobile chrome",k=")(/| )([0-9]+\.[0-9])",l="iemobile",m="prism|Fennec|Camino|Kmeleon|Galeon|Netscape|SeaMonkey|Namoroka|Firefox",n="IEMobile|Maxthon|MSIE|Trident",o="opera mobi",p="Mobile Safari",q="Maple",r="operamobile",s="ie",t="mobile safari",u="AdobeAIR|Titanium|Fluid|Chrome|Android|Epiphany|Konqueror|iCab|OmniWeb|Maxthon|Pre|PhantomJS|Mobile Safari|Safari",v="qx.bom.client.Browser",w="(Maple )([0-9]+\.[0-9]+\.[0-9]*)",x="",y="opera mini",z="(",A="browser.version",B="opera",C="ce",D="mshtml",E="Opera Mini|Opera Mobi|Opera",F="webkit",G="browser.documentmode",H="5.0",I="Mobile/";qx.Bootstrap.define(v,{statics:{getName:function(){var L=navigator.userAgent;var M=new RegExp(z+qx.bom.client.Browser.__cX+k);var K=L.match(M);if(!K){return x;}
;var name=K[1].toLowerCase();var J=qx.bom.client.Engine.getName();if(J===F){if(name===c){name=j;}
else if(L.indexOf(p)!==-1||L.indexOf(I)!==-1){name=t;}
;}
else if(J===D){if(name===b||name===i){name=s;if(qx.bom.client.OperatingSystem.getVersion()===C){name=l;}
;}
;}
else if(J===B){if(name===o){name=r;}
else if(name===y){name=d;}
;}
else if(J===e){if(L.indexOf(q)!==-1){name=f;}
;}
;return name;}
,getVersion:function(){var P=navigator.userAgent;var Q=new RegExp(z+qx.bom.client.Browser.__cX+k);var N=P.match(Q);if(!N){return x;}
;var name=N[1].toLowerCase();var O=N[3];if(P.match(/Version(\/| )([0-9]+\.[0-9])/)){O=RegExp.$2;}
;if(qx.bom.client.Engine.getName()==D){O=qx.bom.client.Engine.getVersion();if(name===b&&qx.bom.client.OperatingSystem.getVersion()==C){O=H;}
;}
;if(qx.bom.client.Browser.getName()==f){Q=new RegExp(w);N=P.match(Q);if(!N){return x;}
;O=N[2];}
;return O;}
,getDocumentMode:function(){if(document.documentMode){return document.documentMode;}
;return 0;}
,getQuirksMode:function(){if(qx.bom.client.Engine.getName()==D&&parseFloat(qx.bom.client.Engine.getVersion())>=8){return qx.bom.client.Engine.DOCUMENT_MODE===5;}
else {return document.compatMode!==a;}
;}
,__cX:{"webkit":u,"gecko":m,"mshtml":n,"opera":E}[qx.bom.client.Engine.getName()]},defer:function(R){qx.core.Environment.add(h,R.getName),qx.core.Environment.add(A,R.getVersion),qx.core.Environment.add(G,R.getDocumentMode),qx.core.Environment.add(g,R.getQuirksMode);}
});}
)();
(function(){var a="cursor:",b="engine.name",c="ns-resize",d="",e="mshtml",f="nw-resize",g="n-resize",h="engine.version",i="nesw-resize",j="opera",k="browser.documentmode",l=";",m="nwse-resize",n="ew-resize",o="qx.bom.element.Cursor",p="ne-resize",q="e-resize",r="browser.quirksmode",s="cursor";qx.Bootstrap.define(o,{statics:{__dN:{},compile:function(t){return a+(this.__dN[t]||t)+l;}
,get:function(v,u){return qx.bom.element.Style.get(v,s,u,false);}
,set:function(x,w){x.style.cursor=this.__dN[w]||w;}
,reset:function(y){y.style.cursor=d;}
},defer:function(z){if(qx.core.Environment.get(b)==e&&((parseFloat(qx.core.Environment.get(h))<9||qx.core.Environment.get(k)<9)&&!qx.core.Environment.get(r))){z.__dN[i]=p;z.__dN[m]=f;if(((parseFloat(qx.core.Environment.get(h))<8||qx.core.Environment.get(k)<8)&&!qx.core.Environment.get(r))){z.__dN[n]=q;z.__dN[c]=g;}
;}
else if(qx.core.Environment.get(b)==j&&parseInt(qx.core.Environment.get(h))<12){z.__dN[i]=p;z.__dN[m]=f;}
;}
});}
)();
(function(){var a="clip:auto;",b="rect(",c=")",d=");",e="",f="px",g="Could not parse clip string: ",h="qx.bom.element.Clip",i="string",j="clip:rect(",k=" ",l="clip",m="rect(auto,auto,auto,auto)",n="rect(auto, auto, auto, auto)",o="auto",p=",";qx.Bootstrap.define(h,{statics:{compile:function(q){if(!q){return a;}
;var v=q.left;var top=q.top;var u=q.width;var t=q.height;var r,s;if(v==null){r=(u==null?o:u+f);v=o;}
else {r=(u==null?o:v+u+f);v=v+f;}
;if(top==null){s=(t==null?o:t+f);top=o;}
else {s=(t==null?o:top+t+f);top=top+f;}
;return j+top+p+r+p+s+p+v+d;}
,get:function(z,D){var x=qx.bom.element.Style.get(z,l,D,false);var C,top,A,E;var w,y;if(typeof x===i&&x!==o&&x!==e){x=x.trim();if(/\((.*)\)/.test(x)){var F=RegExp.$1;if(/,/.test(F)){var B=F.split(p);}
else {var B=F.split(k);}
;top=B[0].trim();w=B[1].trim();y=B[2].trim();C=B[3].trim();if(C===o){C=null;}
;if(top===o){top=null;}
;if(w===o){w=null;}
;if(y===o){y=null;}
;if(top!=null){top=parseInt(top,10);}
;if(w!=null){w=parseInt(w,10);}
;if(y!=null){y=parseInt(y,10);}
;if(C!=null){C=parseInt(C,10);}
;if(w!=null&&C!=null){A=w-C;}
else if(w!=null){A=w;}
;if(y!=null&&top!=null){E=y-top;}
else if(y!=null){E=y;}
;}
else {throw new Error(g+x);}
;}
;return {left:C||null,top:top||null,width:A||null,height:E||null};}
,set:function(L,G){if(!G){L.style.clip=m;return;}
;var M=G.left;var top=G.top;var K=G.width;var J=G.height;var H,I;if(M==null){H=(K==null?o:K+f);M=o;}
else {H=(K==null?o:M+K+f);M=M+f;}
;if(top==null){I=(J==null?o:J+f);top=o;}
else {I=(J==null?o:top+J+f);top=top+f;}
;L.style.clip=b+top+p+H+p+I+p+M+c;}
,reset:function(N){N.style.clip=n;}
}});}
)();
(function(){var a="border-box",b="qx.bom.element.BoxSizing",c="css.boxsizing",d="",e="boxSizing",f="content-box",g=":",h=";";qx.Bootstrap.define(b,{statics:{__dO:{tags:{button:true,select:true},types:{search:true,button:true,submit:true,reset:true,checkbox:true,radio:true}},__dP:function(j){var i=this.__dO;return i.tags[j.tagName.toLowerCase()]||i.types[j.type];}
,compile:function(k){if(qx.core.Environment.get(c)){var l=qx.bom.Style.getCssName(qx.core.Environment.get(c));return l+g+k+h;}
else {{}
;}
;}
,get:function(m){if(qx.core.Environment.get(c)){return qx.bom.element.Style.get(m,e,null,false)||d;}
;if(qx.bom.Document.isStandardMode(qx.dom.Node.getWindow(m))){if(!this.__dP(m)){return f;}
;}
;return a;}
,set:function(o,n){if(qx.core.Environment.get(c)){try{o.style[qx.core.Environment.get(c)]=n;}
catch(p){{}
;}
;}
else {{}
;}
;}
,reset:function(q){this.set(q,d);}
}});}
)();
(function(){var a="css.float",b="foo",c="css.borderimage.standardsyntax",d="borderRadius",e="boxSizing",f="stretch",g='m11',h="content",j="css.inlineblock",k="css.gradient.filter",l="css.appearance",m="css.opacity",n="div",o="pointerEvents",p="css.gradient.radial",q="css.pointerevents",r="input",s="color",t="string",u="borderImage",v="userSelect",w="styleFloat",x="css.textShadow.filter",y="css.usermodify",z="css.boxsizing",A='url("foo.png") 4 4 4 4 fill stretch',B="css.boxmodel",C="qx.bom.client.Css",D="appearance",E="placeholder",F="-moz-none",G="backgroundImage",H="css.textShadow",I="DXImageTransform.Microsoft.Shadow",J="css.boxshadow",K="css.alphaimageloaderneeded",L="css.gradient.legacywebkit",M="css.borderradius",N="linear-gradient(0deg, #fff, #000)",O="textShadow",P="auto",Q="css.borderimage",R="foo.png",S="rgba(1, 2, 3, 0.5)",T="color=#666666,direction=45",U="radial-gradient(0px 0px, cover, red 50%, blue 100%)",V="rgba",W="(",X='url("foo.png") 4 4 4 4 stretch',Y="css.gradient.linear",bC="DXImageTransform.Microsoft.Gradient",bD="css.userselect",bE="span",by="-webkit-gradient(linear,0% 0%,100% 100%,from(white), to(red))",bz="mshtml",bA="css.rgba",bB=");",bI="4 fill",bJ='WebKitCSSMatrix',bK="none",bR="startColorStr=#550000FF, endColorStr=#55FFFF00",bF="progid:",bG="css.placeholder",bH="css.userselect.none",bw="css.textoverflow",bM="inline-block",bx="-moz-inline-box",bN="textOverflow",bO="userModify",bP="boxShadow",bL="cssFloat",bQ="border";qx.Bootstrap.define(C,{statics:{__dQ:null,getBoxModel:function(){var content=qx.bom.client.Engine.getName()!==bz||!qx.bom.client.Browser.getQuirksMode();return content?h:bQ;}
,getTextOverflow:function(){return qx.bom.Style.getPropertyName(bN);}
,getPlaceholder:function(){var i=document.createElement(r);return E in i;}
,getAppearance:function(){return qx.bom.Style.getPropertyName(D);}
,getBorderRadius:function(){return qx.bom.Style.getPropertyName(d);}
,getBoxShadow:function(){return qx.bom.Style.getPropertyName(bP);}
,getBorderImage:function(){return qx.bom.Style.getPropertyName(u);}
,getBorderImageSyntax:function(){var bT=qx.bom.client.Css.getBorderImage();if(!bT){return null;}
;var bS=document.createElement(n);if(bT===u){bS.style[bT]=A;if(bS.style.borderImageSource.indexOf(R)>=0&&bS.style.borderImageSlice.indexOf(bI)>=0&&bS.style.borderImageRepeat.indexOf(f)>=0){return true;}
;}
else {bS.style[bT]=X;if(bS.style[bT].indexOf(R)>=0){return false;}
;}
;return null;}
,getUserSelect:function(){return qx.bom.Style.getPropertyName(v);}
,getUserSelectNone:function(){var bV=qx.bom.client.Css.getUserSelect();if(bV){var bU=document.createElement(bE);bU.style[bV]=F;return bU.style[bV]===F?F:bK;}
;return null;}
,getUserModify:function(){return qx.bom.Style.getPropertyName(bO);}
,getFloat:function(){var bW=document.documentElement.style;return bW.cssFloat!==undefined?bL:bW.styleFloat!==undefined?w:null;}
,getTranslate3d:function(){return bJ in window&&g in new WebKitCSSMatrix();}
,getLinearGradient:function(){qx.bom.client.Css.__dQ=false;var cb=N;var bX=document.createElement(n);var bY=qx.bom.Style.getAppliedStyle(bX,G,cb);if(!bY){cb=by;var bY=qx.bom.Style.getAppliedStyle(bX,G,cb,false);if(bY){qx.bom.client.Css.__dQ=true;}
;}
;if(!bY){return null;}
;var ca=/(.*?)\(/.exec(bY);return ca?ca[1]:null;}
,getFilterGradient:function(){return qx.bom.client.Css.__dR(bC,bR);}
,getRadialGradient:function(){var cf=U;var cc=document.createElement(n);var cd=qx.bom.Style.getAppliedStyle(cc,G,cf);if(!cd){return null;}
;var ce=/(.*?)\(/.exec(cd);return ce?ce[1]:null;}
,getLegacyWebkitGradient:function(){if(qx.bom.client.Css.__dQ===null){qx.bom.client.Css.getLinearGradient();}
;return qx.bom.client.Css.__dQ;}
,getRgba:function(){var cg;try{cg=document.createElement(n);}
catch(ch){cg=document.createElement();}
;try{cg.style[s]=S;if(cg.style[s].indexOf(V)!=-1){return true;}
;}
catch(ci){}
;return false;}
,getBoxSizing:function(){return qx.bom.Style.getPropertyName(e);}
,getInlineBlock:function(){var cj=document.createElement(bE);cj.style.display=bM;if(cj.style.display==bM){return bM;}
;cj.style.display=bx;if(cj.style.display!==bx){return bx;}
;return null;}
,getOpacity:function(){return (typeof document.documentElement.style.opacity==t);}
,getTextShadow:function(){return !!qx.bom.Style.getPropertyName(O);}
,getFilterTextShadow:function(){return qx.bom.client.Css.__dR(I,T);}
,__dR:function(cn,cl){var cm=false;var co=bF+cn+W+cl+bB;var ck=document.createElement(n);document.body.appendChild(ck);ck.style.filter=co;if(ck.filters&&ck.filters.length>0&&ck.filters.item(cn).enabled==true){cm=true;}
;document.body.removeChild(ck);return cm;}
,getAlphaImageLoaderNeeded:function(){return qx.bom.client.Engine.getName()==bz&&qx.bom.client.Browser.getDocumentMode()<9;}
,getPointerEvents:function(){var cp=document.documentElement;if(o in cp.style){var cr=cp.style.pointerEvents;cp.style.pointerEvents=P;cp.style.pointerEvents=b;var cq=cp.style.pointerEvents==P;cp.style.pointerEvents=cr;return cq;}
;return false;}
},defer:function(cs){qx.core.Environment.add(bw,cs.getTextOverflow);qx.core.Environment.add(bG,cs.getPlaceholder);qx.core.Environment.add(M,cs.getBorderRadius);qx.core.Environment.add(J,cs.getBoxShadow);qx.core.Environment.add(Y,cs.getLinearGradient);qx.core.Environment.add(k,cs.getFilterGradient);qx.core.Environment.add(p,cs.getRadialGradient);qx.core.Environment.add(L,cs.getLegacyWebkitGradient);qx.core.Environment.add(B,cs.getBoxModel);qx.core.Environment.add(bA,cs.getRgba);qx.core.Environment.add(Q,cs.getBorderImage);qx.core.Environment.add(c,cs.getBorderImageSyntax);qx.core.Environment.add(y,cs.getUserModify);qx.core.Environment.add(bD,cs.getUserSelect);qx.core.Environment.add(bH,cs.getUserSelectNone);qx.core.Environment.add(l,cs.getAppearance);qx.core.Environment.add(a,cs.getFloat);qx.core.Environment.add(z,cs.getBoxSizing);qx.core.Environment.add(j,cs.getInlineBlock);qx.core.Environment.add(m,cs.getOpacity);qx.core.Environment.add(H,cs.getTextShadow);qx.core.Environment.add(x,cs.getFilterTextShadow);qx.core.Environment.add(K,cs.getAlphaImageLoaderNeeded);qx.core.Environment.add(q,cs.getPointerEvents);}
});}
)();
(function(){var a="css.float",b="px",c="Cascaded styles are not supported in this browser!",d="css.appearance",e="pixelRight",f="float",g="css.userselect",h="css.boxsizing",i="css.textoverflow",j="pixelHeight",k=":",l="pixelTop",m="browser.documentmode",n="css.borderimage",o="pixelLeft",p="engine.name",q="css.usermodify",r="mshtml",s="qx.bom.element.Style",t="",u="pixelBottom",v="pixelWidth",w=";",x="style";qx.Bootstrap.define(s,{statics:{__dS:null,__dT:null,__dU:function(){var z={"appearance":qx.core.Environment.get(d),"userSelect":qx.core.Environment.get(g),"textOverflow":qx.core.Environment.get(i),"borderImage":qx.core.Environment.get(n),"float":qx.core.Environment.get(a),"userModify":qx.core.Environment.get(q),"boxSizing":qx.core.Environment.get(h)};this.__dT={};for(var y in qx.lang.Object.clone(z)){if(!z[y]){delete z[y];}
else {this.__dT[y]=y==f?f:qx.bom.Style.getCssName(z[y]);}
;}
;this.__dS=z;}
,__dV:function(name){var A=qx.bom.Style.getPropertyName(name);if(A){this.__dS[name]=A;}
;return A;}
,__dW:{width:v,height:j,left:o,right:e,top:l,bottom:u},__dX:{clip:qx.bom.element.Clip,cursor:qx.bom.element.Cursor,opacity:qx.bom.element.Opacity,boxSizing:qx.bom.element.BoxSizing},compile:function(B){var E=[];var F=this.__dX;var D=this.__dT;var name,C;for(name in B){C=B[name];if(C==null){continue;}
;name=this.__dS[name]||this.__dV(name)||name;if(F[name]){E.push(F[name].compile(C));}
else {if(!D[name]){D[name]=qx.bom.Style.getCssName(name);}
;E.push(D[name],k,C,w);}
;}
;return E.join(t);}
,setCss:function(H,G){if(qx.core.Environment.get(p)===r&&parseInt(qx.core.Environment.get(m),10)<8){H.style.cssText=G;}
else {H.setAttribute(x,G);}
;}
,getCss:function(I){if(qx.core.Environment.get(p)===r&&parseInt(qx.core.Environment.get(m),10)<8){return I.style.cssText.toLowerCase();}
else {return I.getAttribute(x);}
;}
,isPropertySupported:function(J){return (this.__dX[J]||this.__dS[J]||J in document.documentElement.style);}
,COMPUTED_MODE:1,CASCADED_MODE:2,LOCAL_MODE:3,set:function(M,name,K,L){{}
;name=this.__dS[name]||this.__dV(name)||name;if(L!==false&&this.__dX[name]){this.__dX[name].set(M,K);}
else {M.style[name]=K!==null?K:t;}
;}
,setStyles:function(T,N,U){{}
;var Q=this.__dS;var R=this.__dX;var O=T.style;for(var S in N){var P=N[S];var name=Q[S]||this.__dV(S)||S;if(P===undefined){if(U!==false&&R[name]){R[name].reset(T);}
else {O[name]=t;}
;}
else {if(U!==false&&R[name]){R[name].set(T,P);}
else {O[name]=P!==null?P:t;}
;}
;}
;}
,reset:function(W,name,V){name=this.__dS[name]||this.__dV(name)||name;if(V!==false&&this.__dX[name]){this.__dX[name].reset(W);}
else {W.style[name]=t;}
;}
,get:qx.core.Environment.select(p,{"mshtml":function(ba,name,bb,be){name=this.__dS[name]||this.__dV(name)||name;if(be!==false&&this.__dX[name]){return this.__dX[name].get(ba,bb);}
;if(!ba.currentStyle){return ba.style[name]||t;}
;switch(bb){case this.LOCAL_MODE:return ba.style[name]||t;case this.CASCADED_MODE:return ba.currentStyle[name]||t;default:var bc=ba.currentStyle[name]||ba.style[name]||t;if(/^-?[\.\d]+(px)?$/i.test(bc)){return bc;}
;var bd=this.__dW[name];if(bd){var Y=ba.style[name];ba.style[name]=bc||0;var X=ba.style[bd]+b;ba.style[name]=Y;return X;}
;return bc;};}
,"default":function(bh,name,bi,bj){name=this.__dS[name]||this.__dV(name)||name;if(bj!==false&&this.__dX[name]){return this.__dX[name].get(bh,bi);}
;switch(bi){case this.LOCAL_MODE:return bh.style[name]||t;case this.CASCADED_MODE:if(bh.currentStyle){return bh.currentStyle[name]||t;}
;throw new Error(c);default:var bg=qx.dom.Node.getDocument(bh);var bf=bg.defaultView.getComputedStyle(bh,null);if(bf&&bf[name]){return bf[name];}
;return bh.style[name]||t;};}
})},defer:function(bk){bk.__dU();}
});}
)();
(function(){var a="engine.name",b="CSS1Compat",c="position:absolute;width:0;height:0;width:1",d="engine.version",e="qx.bom.Document",f="1px",g="div";qx.Bootstrap.define(e,{statics:{isQuirksMode:qx.core.Environment.select(a,{"mshtml":function(h){if(qx.core.Environment.get(d)>=8){return (h||window).document.documentMode===5;}
else {return (h||window).document.compatMode!==b;}
;}
,"webkit":function(i){if(document.compatMode===undefined){var j=(i||window).document.createElement(g);j.style.cssText=c;return j.style.width===f?true:false;}
else {return (i||window).document.compatMode!==b;}
;}
,"default":function(k){return (k||window).document.compatMode!==b;}
}),isStandardMode:function(l){return !this.isQuirksMode(l);}
,getWidth:function(m){var o=(m||window).document;var n=qx.bom.Viewport.getWidth(m);var scroll=this.isStandardMode(m)?o.documentElement.scrollWidth:o.body.scrollWidth;return Math.max(scroll,n);}
,getHeight:function(p){var r=(p||window).document;var q=qx.bom.Viewport.getHeight(p);var scroll=this.isStandardMode(p)?r.documentElement.scrollHeight:r.body.scrollHeight;return Math.max(scroll,q);}
}});}
)();
(function(){var a="undefined",b="qx.bom.Viewport";qx.Bootstrap.define(b,{statics:{getWidth:function(c){var c=c||window;var d=c.document;return qx.bom.Document.isStandardMode(c)?d.documentElement.clientWidth:d.body.clientWidth;}
,getHeight:function(e){var e=e||window;var f=e.document;return qx.bom.Document.isStandardMode(e)?f.documentElement.clientHeight:f.body.clientHeight;}
,getScrollLeft:function(g){var g=g?g:window;if(typeof g.pageXOffset!==a){return g.pageXOffset;}
;var h=g.document;return h.documentElement.scrollLeft||h.body.scrollLeft;}
,getScrollTop:function(i){var i=i?i:window;if(typeof i.pageYOffset!==a){return i.pageYOffset;}
;var j=i.document;return j.documentElement.scrollTop||j.body.scrollTop;}
,__dY:function(k){var m=this.getWidth(k)>this.getHeight(k)?90:0;var l=k.orientation;if(l==null||Math.abs(l%180)==m){return {"-270":90,"-180":180,"-90":-90,"0":0,"90":90,"180":180,"270":-90};}
else {return {"-270":180,"-180":-90,"-90":0,"0":90,"90":180,"180":-90,"270":0};}
;}
,__ea:null,getOrientation:function(n){var n=n||window.top;var o=n.orientation;if(o==null){o=this.getWidth(n)>this.getHeight(n)?90:0;}
else {if(this.__ea==null){this.__ea=this.__dY(n);}
;o=this.__ea[o];}
;return o;}
,isLandscape:function(p){return this.getWidth(p)>=this.getHeight(p);}
,isPortrait:function(q){return this.getWidth(q)<this.getHeight(q);}
}});}
)();
(function(){var a="borderBottomWidth",b="scroll",c="qx.bom.element.Location",d="engine.version",e="paddingLeft",f="borderRightWidth",g="auto",h="static",i="borderTopWidth",j="borderLeftWidth",k="marginBottom",l="marginTop",m="overflowY",n="marginLeft",o="border-box",p="padding",q="paddingBottom",r="paddingTop",s="gecko",t="marginRight",u="browser.quirksmode",v="mshtml",w="engine.name",x="position",y="margin",z="paddingRight",A="BODY",B="overflowX",C="border",D="browser.documentmode";qx.Bootstrap.define(c,{statics:{__dH:function(F,E){return qx.bom.element.Style.get(F,E,qx.bom.element.Style.COMPUTED_MODE,false);}
,__dI:function(H,G){return parseInt(qx.bom.element.Style.get(H,G,qx.bom.element.Style.COMPUTED_MODE,false),10)||0;}
,__dJ:function(J){var K=0,top=0;var I=qx.dom.Node.getWindow(J);K-=qx.bom.Viewport.getScrollLeft(I);top-=qx.bom.Viewport.getScrollTop(I);return {left:K,top:top};}
,__dK:qx.core.Environment.select(w,{"mshtml":function(N){var M=qx.dom.Node.getDocument(N);var L=M.body;var O=0;var top=0;O-=L.clientLeft+M.documentElement.clientLeft;top-=L.clientTop+M.documentElement.clientTop;if(!qx.core.Environment.get(u)){O+=this.__dI(L,j);top+=this.__dI(L,i);}
;return {left:O,top:top};}
,"webkit":function(R){var Q=qx.dom.Node.getDocument(R);var P=Q.body;var S=P.offsetLeft;var top=P.offsetTop;if(parseFloat(qx.core.Environment.get(d))<530.17){S+=this.__dI(P,j);top+=this.__dI(P,i);}
;return {left:S,top:top};}
,"gecko":function(U){var T=qx.dom.Node.getDocument(U).body;var V=T.offsetLeft;var top=T.offsetTop;if(parseFloat(qx.core.Environment.get(d))<1.9){V+=this.__dI(T,n);top+=this.__dI(T,l);}
;if(qx.bom.element.BoxSizing.get(T)!==o){V+=this.__dI(T,j);top+=this.__dI(T,i);}
;return {left:V,top:top};}
,"default":function(X){var W=qx.dom.Node.getDocument(X).body;var Y=W.offsetLeft;var top=W.offsetTop;return {left:Y,top:top};}
}),__dL:function(ba){var bb=ba.getBoundingClientRect();return {left:Math.round(bb.left),top:Math.round(bb.top)};}
,get:function(bg,bh){if(bg.tagName==A){var location=this.__dM(bg);var bk=location.left;var top=location.top;}
else {var bc=this.__dK(bg);var bf=this.__dL(bg);var scroll=this.__dJ(bg);var bk=bf.left+bc.left-scroll.left;var top=bf.top+bc.top-scroll.top;}
;var bd=bk+bg.offsetWidth;var be=top+bg.offsetHeight;if(bh){if(bh==p||bh==b){var bj=qx.bom.element.Style.get(bg,B);if(bj==b||bj==g){bd+=bg.scrollWidth-bg.offsetWidth+this.__dI(bg,j)+this.__dI(bg,f);}
;var bi=qx.bom.element.Style.get(bg,m);if(bi==b||bi==g){be+=bg.scrollHeight-bg.offsetHeight+this.__dI(bg,i)+this.__dI(bg,a);}
;}
;switch(bh){case p:bk+=this.__dI(bg,e);top+=this.__dI(bg,r);bd-=this.__dI(bg,z);be-=this.__dI(bg,q);case b:bk-=bg.scrollLeft;top-=bg.scrollTop;bd-=bg.scrollLeft;be-=bg.scrollTop;case C:bk+=this.__dI(bg,j);top+=this.__dI(bg,i);bd-=this.__dI(bg,f);be-=this.__dI(bg,a);break;case y:bk-=this.__dI(bg,n);top-=this.__dI(bg,l);bd+=this.__dI(bg,t);be+=this.__dI(bg,k);break;};}
;return {left:bk,top:top,right:bd,bottom:be};}
,__dM:function(bl){var top=bl.offsetTop;var bm=bl.offsetLeft;if(qx.core.Environment.get(w)!==v||!((parseFloat(qx.core.Environment.get(d))<8||qx.core.Environment.get(D)<8)&&!qx.core.Environment.get(u))){top+=this.__dI(bl,l);bm+=this.__dI(bl,n);}
;if(qx.core.Environment.get(w)===s){top+=this.__dI(bl,j);bm+=this.__dI(bl,i);}
;return {left:bm,top:top};}
,getLeft:function(bn,bo){return this.get(bn,bo).left;}
,getTop:function(bp,bq){return this.get(bp,bq).top;}
,getRight:function(br,bs){return this.get(br,bs).right;}
,getBottom:function(bt,bu){return this.get(bt,bu).bottom;}
,getRelative:function(by,bx,bw,bv){var bA=this.get(by,bw);var bz=this.get(bx,bv);return {left:bA.left-bz.left,top:bA.top-bz.top,right:bA.right-bz.right,bottom:bA.bottom-bz.bottom};}
,getPosition:function(bB){return this.getRelative(bB,this.getOffsetParent(bB));}
,getOffsetParent:function(bE){var bD=bE.offsetParent||document.body;var bC=qx.bom.element.Style;while(bD&&(!/^body|html$/i.test(bD.tagName)&&bC.get(bD,x)===h)){bD=bD.offsetParent;}
;return bD;}
}});}
)();
(function(){var a="mshtml",b="engine.name",c="qx.bom.element.Dimension",d="0px",e="paddingRight",f="engine.version",g="paddingLeft",h="opera",i="paddingBottom",j="paddingTop",k="overflowX",l="overflowY";qx.Bootstrap.define(c,{statics:{getWidth:function(n){var m=n.getBoundingClientRect();return Math.round(m.right)-Math.round(m.left);}
,getHeight:function(p){var o=p.getBoundingClientRect();return Math.round(o.bottom)-Math.round(o.top);}
,getSize:function(q){return {width:this.getWidth(q),height:this.getHeight(q)};}
,__eD:{visible:true,hidden:true},getContentWidth:function(u){var r=qx.bom.element.Style;var s=qx.bom.element.Style.get(u,k);var t=parseInt(r.get(u,g)||d,10);var x=parseInt(r.get(u,e)||d,10);if(this.__eD[s]){var w=u.clientWidth;if((qx.core.Environment.get(b)==h)||qx.dom.Node.isBlockNode(u)){w=w-t-x;}
;if(qx.core.Environment.get(b)==a){if(w===0&&u.offsetHeight===0){return u.offsetWidth;}
;}
;return w;}
else {if(u.clientWidth>=u.scrollWidth){return Math.max(u.clientWidth,u.scrollWidth)-t-x;}
else {var v=u.scrollWidth-t;if(qx.core.Environment.get(b)==a&&qx.core.Environment.get(f)>=6){v-=x;}
;return v;}
;}
;}
,getContentHeight:function(D){var y=qx.bom.element.Style;var A=qx.bom.element.Style.get(D,l);var B=parseInt(y.get(D,j)||d,10);var z=parseInt(y.get(D,i)||d,10);if(this.__eD[A]){return D.clientHeight-B-z;}
else {if(D.clientHeight>=D.scrollHeight){return Math.max(D.clientHeight,D.scrollHeight)-B-z;}
else {var C=D.scrollHeight-B;if(qx.core.Environment.get(b)==a&&qx.core.Environment.get(f)==6){C-=z;}
;return C;}
;}
;}
,getContentSize:function(E){return {width:this.getContentWidth(E),height:this.getContentHeight(E)};}
}});}
)();
(function(){var b="function",c="html.video.h264",d="html.element.contains",f='video/ogg; codecs="theora, vorbis"',g="html.console",h="html.xul",i="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",j="html.video.ogg",k="http://www.w3.org/TR/SVG11/feature#BasicStructure",l="html.storage.local",m="div",n="qx.bom.client.Html",o="getSelection",p='audio',q='video/mp4; codecs="avc1.42E01E, mp4a.40.2"',r="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==",s="html.audio",t="video",u="url(#default#VML)",w="head",x="audio",y="audio/mpeg",z="org.w3c.dom.svg",A="html.classlist",B="html.svg",C="html.video",D="html.geolocation",E="DOMTokenList",F="html.storage.session",G="1.1",H="html.history.state",I="object",J="html.image.naturaldimensions",K="html.audio.aif",L="audio/x-wav",M='<v:shape id="vml_flag1" adj="1" />',N="html.canvas",O="audio/ogg",P="",Q="html.storage.userdata",R="number",S="html.element.compareDocumentPosition",T="audio/x-aiff",U="html.audio.au",V="img",W="html.selection",X="selection",Y="html.xpath",bA="qxtest",bB='video',bC="span",bw="html.element.textcontent",bx="geolocation",by="html.audio.mp3",bz="html.vml",bH="undefined",bI="html.audio.ogg",bN="none",bQ="label",bD='video/webm; codecs="vp8, vorbis"',bE="html.dataurl",bF="html.webworker",bG="html.dataset",bK="1.0",bR="html.audio.wav",bL="html.filereader",bM="audio/basic",bO="#default#userdata",bJ="html.video.webm",bP="display";qx.Bootstrap.define(n,{statics:{getWebWorker:function(){return window.Worker!=null;}
,getFileReader:function(){return window.FileReader!=null;}
,getGeoLocation:function(){return bx in navigator;}
,getAudio:function(){return !!document.createElement(p).canPlayType;}
,getAudioOgg:function(){if(!qx.bom.client.Html.getAudio()){return P;}
;var a=document.createElement(x);return a.canPlayType(O);}
,getAudioMp3:function(){if(!qx.bom.client.Html.getAudio()){return P;}
;var a=document.createElement(x);return a.canPlayType(y);}
,getAudioWav:function(){if(!qx.bom.client.Html.getAudio()){return P;}
;var a=document.createElement(x);return a.canPlayType(L);}
,getAudioAu:function(){if(!qx.bom.client.Html.getAudio()){return P;}
;var a=document.createElement(x);return a.canPlayType(bM);}
,getAudioAif:function(){if(!qx.bom.client.Html.getAudio()){return P;}
;var a=document.createElement(x);return a.canPlayType(T);}
,getVideo:function(){return !!document.createElement(bB).canPlayType;}
,getVideoOgg:function(){if(!qx.bom.client.Html.getVideo()){return P;}
;var v=document.createElement(t);return v.canPlayType(f);}
,getVideoH264:function(){if(!qx.bom.client.Html.getVideo()){return P;}
;var v=document.createElement(t);return v.canPlayType(q);}
,getVideoWebm:function(){if(!qx.bom.client.Html.getVideo()){return P;}
;var v=document.createElement(t);return v.canPlayType(bD);}
,getLocalStorage:function(){try{return window.localStorage!=null;}
catch(bS){return false;}
;}
,getSessionStorage:function(){try{return window.sessionStorage!=null;}
catch(bT){return false;}
;}
,getUserDataStorage:function(){var bU=document.createElement(m);bU.style[bP]=bN;document.getElementsByTagName(w)[0].appendChild(bU);var bV=false;try{bU.addBehavior(bO);bU.load(bA);bV=true;}
catch(e){}
;document.getElementsByTagName(w)[0].removeChild(bU);return bV;}
,getClassList:function(){return !!(document.documentElement.classList&&qx.Bootstrap.getClass(document.documentElement.classList)===E);}
,getXPath:function(){return !!document.evaluate;}
,getXul:function(){try{document.createElementNS(i,bQ);return true;}
catch(e){return false;}
;}
,getSvg:function(){return document.implementation&&document.implementation.hasFeature&&(document.implementation.hasFeature(z,bK)||document.implementation.hasFeature(k,G));}
,getVml:function(){var bW=document.createElement(m);document.body.appendChild(bW);bW.innerHTML=M;bW.firstChild.style.behavior=u;var bX=typeof bW.firstChild.adj==I;document.body.removeChild(bW);return bX;}
,getCanvas:function(){return !!window.CanvasRenderingContext2D;}
,getDataUrl:function(bY){var ca=new Image();ca.onload=ca.onerror=function(){window.setTimeout(function(){bY.call(null,(ca.width==1&&ca.height==1));}
,0);}
;ca.src=r;}
,getDataset:function(){return !!document.documentElement.dataset;}
,getContains:function(){return (typeof document.documentElement.contains!==bH);}
,getCompareDocumentPosition:function(){return (typeof document.documentElement.compareDocumentPosition===b);}
,getTextContent:function(){var cb=document.createElement(bC);return (typeof cb.textContent!==bH);}
,getConsole:function(){return typeof window.console!==bH;}
,getNaturalDimensions:function(){var cc=document.createElement(V);return typeof cc.naturalHeight===R&&typeof cc.naturalWidth===R;}
,getHistoryState:function(){return (typeof window.onpopstate!==bH&&typeof window.history.replaceState!==bH&&typeof window.history.pushState!==bH);}
,getSelection:function(){if(typeof window.getSelection===b){return o;}
;if(typeof document.selection===I){return X;}
;return null;}
},defer:function(cd){qx.core.Environment.add(bF,cd.getWebWorker);qx.core.Environment.add(bL,cd.getFileReader);qx.core.Environment.add(D,cd.getGeoLocation);qx.core.Environment.add(s,cd.getAudio);qx.core.Environment.add(bI,cd.getAudioOgg);qx.core.Environment.add(by,cd.getAudioMp3);qx.core.Environment.add(bR,cd.getAudioWav);qx.core.Environment.add(U,cd.getAudioAu);qx.core.Environment.add(K,cd.getAudioAif);qx.core.Environment.add(C,cd.getVideo);qx.core.Environment.add(j,cd.getVideoOgg);qx.core.Environment.add(c,cd.getVideoH264);qx.core.Environment.add(bJ,cd.getVideoWebm);qx.core.Environment.add(l,cd.getLocalStorage);qx.core.Environment.add(F,cd.getSessionStorage);qx.core.Environment.add(Q,cd.getUserDataStorage);qx.core.Environment.add(A,cd.getClassList);qx.core.Environment.add(Y,cd.getXPath);qx.core.Environment.add(h,cd.getXul);qx.core.Environment.add(N,cd.getCanvas);qx.core.Environment.add(B,cd.getSvg);qx.core.Environment.add(bz,cd.getVml);qx.core.Environment.add(bG,cd.getDataset);qx.core.Environment.addAsync(bE,cd.getDataUrl);qx.core.Environment.add(d,cd.getContains);qx.core.Environment.add(S,cd.getCompareDocumentPosition);qx.core.Environment.add(bw,cd.getTextContent);qx.core.Environment.add(g,cd.getConsole);qx.core.Environment.add(J,cd.getNaturalDimensions);qx.core.Environment.add(H,cd.getHistoryState);qx.core.Environment.add(W,cd.getSelection);}
});}
)();
(function(){var a='',b="g",c="(^|\\s)",d='function',e="(\\s|$)",f="",g="\\b|\\b",h="qx.bom.element.Class",j='SVGAnimatedString',k="html.classlist",m="default",n=" ",o='object',p="$2",q="native",r="\\b",s='undefined';qx.Bootstrap.define(h,{statics:{__eE:/\s+/g,__eF:/^\s+|\s+$/g,add:{"native":function(t,name){t.classList.add(name);return name;}
,"default":function(u,name){if(!this.has(u,name)){u.className+=(u.className?n:f)+name;}
;return name;}
}[qx.core.Environment.get(k)?q:m],addClasses:{"native":function(w,v){for(var i=0;i<v.length;i++ ){w.classList.add(v[i]);}
;return w.className;}
,"default":function(y,A){var z={};var B;var x=y.className;if(x){B=x.split(this.__eE);for(var i=0,l=B.length;i<l;i++ ){z[B[i]]=true;}
;for(var i=0,l=A.length;i<l;i++ ){if(!z[A[i]]){B.push(A[i]);}
;}
;}
else {B=A;}
;return y.className=B.join(n);}
}[qx.core.Environment.get(k)?q:m],get:function(D){var C=D.className;if(typeof C.split!==d){if(typeof C===o){if(qx.Bootstrap.getClass(C)==j){C=C.baseVal;}
else {{}
;C=a;}
;}
;if(typeof C===s){{}
;C=a;}
;}
;return C;}
,has:{"native":function(E,name){return E.classList.contains(name);}
,"default":function(G,name){var F=new RegExp(c+name+e);return F.test(G.className);}
}[qx.core.Environment.get(k)?q:m],remove:{"native":function(H,name){H.classList.remove(name);return name;}
,"default":function(J,name){var I=new RegExp(c+name+e);J.className=J.className.replace(I,p);return name;}
}[qx.core.Environment.get(k)?q:m],removeClasses:{"native":function(L,K){for(var i=0;i<K.length;i++ ){L.classList.remove(K[i]);}
;return L.className;}
,"default":function(O,M){var N=new RegExp(r+M.join(g)+r,b);return O.className=O.className.replace(N,f).replace(this.__eF,f).replace(this.__eE,n);}
}[qx.core.Environment.get(k)?q:m],replace:function(R,Q,P){if(!this.has(R,Q)){return f;}
;this.remove(R,Q);return this.add(R,P);}
,toggle:{"native":function(T,name,S){if(S===undefined){T.classList.toggle(name);}
else {S?this.add(T,name):this.remove(T,name);}
;return name;}
,"default":function(V,name,U){if(U==null){U=!this.has(V,name);}
;U?this.add(V,name):this.remove(V,name);return name;}
}[qx.core.Environment.get(k)?q:m]}});}
)();
(function(){var a="stylesheet",b="head",c="html.stylesheet.addimport",d="html.stylesheet.insertrule",e="}",f="html.stylesheet.createstylesheet",g='@import "',h="text/css",j="{",k='";',l="html.stylesheet.removeimport",m="html.stylesheet.deleterule",n="qx.bom.Stylesheet",o="link",p="style";qx.Bootstrap.define(n,{statics:{includeFile:function(s,q){if(!q){q=document;}
;var t=q.createElement(o);t.type=h;t.rel=a;t.href=s;var r=q.getElementsByTagName(b)[0];r.appendChild(t);}
,createElement:function(u){if(qx.core.Environment.get(f)){var v=document.createStyleSheet();if(u){v.cssText=u;}
;return v;}
else {var w=document.createElement(p);w.type=h;if(u){w.appendChild(document.createTextNode(u));}
;document.getElementsByTagName(b)[0].appendChild(w);return w.sheet;}
;}
,addRule:function(z,A,y){{var x;}
;if(qx.core.Environment.get(d)){z.insertRule(A+j+y+e,z.cssRules.length);}
else {z.addRule(A,y);}
;}
,removeRule:function(C,E){if(qx.core.Environment.get(m)){var B=C.cssRules;var D=B.length;for(var i=D-1;i>=0; --i){if(B[i].selectorText==E){C.deleteRule(i);}
;}
;}
else {var B=C.rules;var D=B.length;for(var i=D-1;i>=0; --i){if(B[i].selectorText==E){C.removeRule(i);}
;}
;}
;}
,removeSheet:function(G){var F=G.ownerNode?G.ownerNode:G.owningElement;qx.dom.Element.removeChild(F,F.parentNode);}
,removeAllRules:function(I){if(qx.core.Environment.get(m)){var H=I.cssRules;var J=H.length;for(var i=J-1;i>=0;i-- ){I.deleteRule(i);}
;}
else {var H=I.rules;var J=H.length;for(var i=J-1;i>=0;i-- ){I.removeRule(i);}
;}
;}
,addImport:function(L,K){if(qx.core.Environment.get(c)){L.addImport(K);}
else {L.insertRule(g+K+k,L.cssRules.length);}
;}
,removeImport:function(M,N){if(qx.core.Environment.get(l)){var O=M.imports;var P=O.length;for(var i=P-1;i>=0;i-- ){if(O[i].href==N||O[i].href==qx.util.Uri.getAbsolute(N)){M.removeImport(i);}
;}
;}
else {var Q=M.cssRules;var P=Q.length;for(var i=P-1;i>=0;i-- ){if(Q[i].href==N){M.deleteRule(i);}
;}
;}
;}
,removeAllImports:function(S){if(qx.core.Environment.get(l)){var U=S.imports;var T=U.length;for(var i=T-1;i>=0;i-- ){S.removeImport(i);}
;}
else {var R=S.cssRules;var T=R.length;for(var i=T-1;i>=0;i-- ){if(R[i].type==R[i].IMPORT_RULE){S.deleteRule(i);}
;}
;}
;}
}});}
)();
(function(){var a="file",b="+",c="strict",d="anchor",e="div",f="query",g="source",h="password",j="host",k="protocol",l="user",n="directory",p="loose",q="relative",r="queryKey",s="qx.util.Uri",t="",u="path",v="authority",w='">0</a>',x="&",y="port",z='<a href="',A="userInfo",B="?",C="=";qx.Bootstrap.define(s,{statics:{parseUri:function(F,E){var G={key:[g,k,v,A,l,h,j,y,q,u,n,a,f,d],q:{name:r,parser:/(?:^|&)([^&=]*)=?([^&]*)/g},parser:{strict:/^(?:([^:\/?#]+):)?(?:\/\/((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?))?((((?:[^?#\/]*\/)*)([^?#]*))(?:\?([^#]*))?(?:#(.*))?)/,loose:/^(?:(?![^:@]+:[^:@\/]*@)([^:\/?#.]+):)?(?:\/\/)?((?:(([^:@]*)(?::([^:@]*))?)?@)?([^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/}};var o=G,m=G.parser[E?c:p].exec(F),D={},i=14;while(i-- ){D[o.key[i]]=m[i]||t;}
;D[o.q.name]={};D[o.key[12]].replace(o.q.parser,function(I,J,H){if(J){D[o.q.name][J]=H;}
;}
);return D;}
,appendParamsToUrl:function(K,L){if(L===undefined){return K;}
;{}
;if(qx.lang.Type.isObject(L)){L=qx.util.Uri.toParameter(L);}
;if(!L){return K;}
;return K+=/\?/.test(K)?x+L:B+L;}
,toParameter:function(M,Q){var P,O=[];for(P in M){if(M.hasOwnProperty(P)){var N=M[P];if(N instanceof Array){for(var i=0;i<N.length;i++ ){this.__eG(P,N[i],O,Q);}
;}
else {this.__eG(P,N,O,Q);}
;}
;}
;return O.join(x);}
,__eG:function(U,V,T,S){var R=window.encodeURIComponent;if(S){T.push(R(U).replace(/%20/g,b)+C+R(V).replace(/%20/g,b));}
else {T.push(R(U)+C+R(V));}
;}
,getAbsolute:function(X){var W=document.createElement(e);W.innerHTML=z+X+w;return W.firstChild.href;}
}});}
)();
(function(){var a="engine.name",b="='",c="<",d="",f="none",g="<INPUT TYPE='RADIO' NAME='RADIOTEST' VALUE='Second Choice'>",h="qx.dom.Element",j="webkit",k="The tag name is missing!",m=" ",n="div",o=">",p="' ",q="></";qx.Bootstrap.define(h,{statics:{__eH:{"onload":true,"onpropertychange":true,"oninput":true,"onchange":true,"name":true,"type":true,"checked":true,"disabled":true},hasChild:function(parent,r){return r.parentNode===parent;}
,hasChildren:function(s){return !!s.firstChild;}
,hasChildElements:function(t){t=t.firstChild;while(t){if(t.nodeType===1){return true;}
;t=t.nextSibling;}
;return false;}
,getParentElement:function(u){return u.parentNode;}
,isInDom:function(x,v){if(!v){v=window;}
;var w=v.document.getElementsByTagName(x.nodeName);for(var i=0,l=w.length;i<l;i++ ){if(w[i]===x){return true;}
;}
;return false;}
,insertAt:function(y,parent,z){var A=parent.childNodes[z];if(A){parent.insertBefore(y,A);}
else {parent.appendChild(y);}
;return true;}
,insertBegin:function(B,parent){if(parent.firstChild){this.insertBefore(B,parent.firstChild);}
else {parent.appendChild(B);}
;return true;}
,insertEnd:function(C,parent){parent.appendChild(C);return true;}
,insertBefore:function(D,E){E.parentNode.insertBefore(D,E);return true;}
,insertAfter:function(F,G){var parent=G.parentNode;if(G==parent.lastChild){parent.appendChild(F);}
else {return this.insertBefore(F,G.nextSibling);}
;return true;}
,remove:function(H){if(!H.parentNode){return false;}
;H.parentNode.removeChild(H);return true;}
,removeChild:function(I,parent){if(I.parentNode!==parent){return false;}
;parent.removeChild(I);return true;}
,removeChildAt:function(J,parent){var K=parent.childNodes[J];if(!K){return false;}
;parent.removeChild(K);return true;}
,replaceChild:function(M,L){if(!L.parentNode){return false;}
;L.parentNode.replaceChild(M,L);return true;}
,replaceAt:function(O,P,parent){var N=parent.childNodes[P];if(!N){return false;}
;parent.replaceChild(O,N);return true;}
,__eI:{},__eJ:{},_allowCreationWithMarkup:function(Q){if(!Q){Q=window;}
;var R=Q.location.href;if(qx.dom.Element.__eJ[R]==undefined){try{Q.document.createElement(g);qx.dom.Element.__eJ[R]=true;}
catch(e){qx.dom.Element.__eJ[R]=false;}
;}
;return qx.dom.Element.__eJ[R];}
,getHelperElement:function(S){if(!S){S=window;}
;var T=S.location.href;if(!qx.dom.Element.__eI[T]){var U=qx.dom.Element.__eI[T]=S.document.createElement(n);if(qx.core.Environment.get(a)==j){U.style.display=f;S.document.body.appendChild(U);}
;}
;return qx.dom.Element.__eI[T];}
,create:function(name,bc,W){if(!W){W=window;}
;if(!name){throw new Error(k);}
;var Y=this.__eH;var X=d;for(var bb in bc){if(Y[bb]){X+=bb+b+bc[bb]+p;}
;}
;var ba;if(X!=d){if(qx.dom.Element._allowCreationWithMarkup(W)){ba=W.document.createElement(c+name+m+X+o);}
else {var V=qx.dom.Element.getHelperElement(W);V.innerHTML=c+name+m+X+q+name+o;ba=V.firstChild;}
;}
else {ba=W.document.createElement(name);}
;for(var bb in bc){if(!Y[bb]){qx.bom.element.Attribute.set(ba,bb,bc[bb]);}
;}
;return ba;}
,empty:function(bd){return bd.innerHTML=d;}
}});}
)();
(function(){var a="readOnly",b="accessKey",c="qx.bom.element.Attribute",d="rowSpan",e="vAlign",f="className",g="textContent",h="'",i="htmlFor",j="longDesc",k="cellSpacing",l="frameBorder",m="='",n="",o="useMap",p="innerText",q="innerHTML",r="tabIndex",s="dateTime",t="maxLength",u="html.element.textcontent",v="mshtml",w="engine.name",x="cellPadding",y="browser.documentmode",z="colSpan",A="undefined";qx.Bootstrap.define(c,{statics:{__eK:{names:{"class":f,"for":i,html:q,text:qx.core.Environment.get(u)?g:p,colspan:z,rowspan:d,valign:e,datetime:s,accesskey:b,tabindex:r,maxlength:t,readonly:a,longdesc:j,cellpadding:x,cellspacing:k,frameborder:l,usemap:o},runtime:{"html":1,"text":1},bools:{compact:1,nowrap:1,ismap:1,declare:1,noshade:1,checked:1,disabled:1,readOnly:1,multiple:1,selected:1,noresize:1,defer:1,allowTransparency:1},property:{$$html:1,$$widget:1,disabled:1,checked:1,readOnly:1,multiple:1,selected:1,value:1,maxLength:1,className:1,innerHTML:1,innerText:1,textContent:1,htmlFor:1,tabIndex:1},qxProperties:{$$widget:1,$$html:1},propertyDefault:{disabled:false,checked:false,readOnly:false,multiple:false,selected:false,value:n,className:n,innerHTML:n,innerText:n,textContent:n,htmlFor:n,tabIndex:0,maxLength:qx.core.Environment.select(w,{"mshtml":2147483647,"webkit":524288,"default":-1})},removeableProperties:{disabled:1,multiple:1,maxLength:1},original:{href:1,src:1,type:1}},compile:function(B){var C=[];var E=this.__eK.runtime;for(var D in B){if(!E[D]){C.push(D,m,B[D],h);}
;}
;return C.join(n);}
,get:function(H,name){var F=this.__eK;var G;name=F.names[name]||name;if(qx.core.Environment.get(w)==v&&parseInt(qx.core.Environment.get(y),10)<8&&F.original[name]){G=H.getAttribute(name,2);}
else if(F.property[name]){G=H[name];if(typeof F.propertyDefault[name]!==A&&G==F.propertyDefault[name]){if(typeof F.bools[name]===A){return null;}
else {return G;}
;}
;}
else {G=H.getAttribute(name);}
;if(F.bools[name]){return !!G;}
;return G;}
,set:function(K,name,J){if(typeof J===A){return;}
;var I=this.__eK;name=I.names[name]||name;if(I.bools[name]){J=!!J;}
;if(I.property[name]&&(!(K[name]===undefined)||I.qxProperties[name])){if(J==null){if(I.removeableProperties[name]){K.removeAttribute(name);return;}
else if(typeof I.propertyDefault[name]!==A){J=I.propertyDefault[name];}
;}
;K[name]=J;}
else {if(J===true){K.setAttribute(name,name);}
else if(J===false||J===null){K.removeAttribute(name);}
else {K.setAttribute(name,J);}
;}
;}
,reset:function(L,name){this.set(L,name,null);}
}});}
)();
(function(){var a="qx.bom.client.Stylesheet",b="html.stylesheet.deleterule",c="html.stylesheet.insertrule",d="function",e="html.stylesheet.createstylesheet",f="html.stylesheet.addimport",g="html.stylesheet.removeimport",h="object";qx.Bootstrap.define(a,{statics:{__eL:function(){if(!qx.bom.client.Stylesheet.__eM){qx.bom.client.Stylesheet.__eM=qx.bom.Stylesheet.createElement();}
;return qx.bom.client.Stylesheet.__eM;}
,getCreateStyleSheet:function(){return typeof document.createStyleSheet===h;}
,getInsertRule:function(){return typeof qx.bom.client.Stylesheet.__eL().insertRule===d;}
,getDeleteRule:function(){return typeof qx.bom.client.Stylesheet.__eL().deleteRule===d;}
,getAddImport:function(){return (typeof qx.bom.client.Stylesheet.__eL().addImport===h);}
,getRemoveImport:function(){return (typeof qx.bom.client.Stylesheet.__eL().removeImport===h);}
},defer:function(i){qx.core.Environment.add(e,i.getCreateStyleSheet);qx.core.Environment.add(c,i.getInsertRule);qx.core.Environment.add(b,i.getDeleteRule);qx.core.Environment.add(f,i.getAddImport);qx.core.Environment.add(g,i.getRemoveImport);}
});}
)();
(function(){var a="start",b="animationEnd",c="",d="none",e="qx.module.Animation",f="animationIteration",g="end",h="animationStart",j="ease-in",k="iteration",l="ease-out",m="display";qx.Bootstrap.define(e,{events:{"animationStart":undefined,"animationIteration":undefined,"animationEnd":undefined},statics:{getAnimationHandles:function(){var n=[];for(var i=0;i<this.length;i++ ){n[i]=this[i].$$animation;}
;return n;}
,_fadeOut:{duration:700,timing:l,keep:100,keyFrames:{'0':{opacity:1},'100':{opacity:0,display:d}}},_fadeIn:{duration:700,timing:j,keep:100,keyFrames:{'0':{opacity:0},'100':{opacity:1}}},animate:function(p,o){qx.module.Animation._animate.bind(this)(p,o,false);return this;}
,animateReverse:function(r,q){qx.module.Animation._animate.bind(this)(r,q,true);return this;}
,_animate:function(u,s,t){this._forEachElement(function(v,i){if(v.$$animation){v.$$animation.stop();}
;var w;if(t){w=qx.bom.element.Animation.animateReverse(v,u,s);}
else {w=qx.bom.element.Animation.animate(v,u,s);}
;var self=this;if(i==0){w.on(a,function(){self.emit(h);}
,w);w.on(k,function(){self.emit(f);}
,w);}
;w.on(g,function(){for(var i=0;i<self.length;i++ ){if(self[i].$$animation){return;}
;}
;self.emit(b);}
,v);}
);}
,play:function(){for(var i=0;i<this.length;i++ ){var x=this[i].$$animation;if(x){x.play();}
;}
;return this;}
,pause:function(){for(var i=0;i<this.length;i++ ){var y=this[i].$$animation;if(y){y.pause();}
;}
;return this;}
,stop:function(){for(var i=0;i<this.length;i++ ){var z=this[i].$$animation;if(z){z.stop();}
;}
;return this;}
,isPlaying:function(){for(var i=0;i<this.length;i++ ){var A=this[i].$$animation;if(A&&A.isPlaying()){return true;}
;}
;return false;}
,isEnded:function(){for(var i=0;i<this.length;i++ ){var B=this[i].$$animation;if(B&&!B.isEnded()){return false;}
;}
;return true;}
,fadeIn:function(C){this.setStyle(m,c);return this.animate(qx.module.Animation._fadeIn,C);}
,fadeOut:function(D){return this.animate(qx.module.Animation._fadeOut,D);}
},defer:function(E){qxWeb.$attach({"animate":E.animate,"animateReverse":E.animateReverse,"fadeIn":E.fadeIn,"fadeOut":E.fadeOut,"play":E.play,"pause":E.pause,"stop":E.stop,"isEnded":E.isEnded,"isPlaying":E.isPlaying,"getAnimationHandles":E.getAnimationHandles});}
});}
)();
(function(){var a="css.animation",b="translate",c="rotate",d="skew",e="scale",f="qx.bom.element.Animation";qx.Bootstrap.define(f,{statics:{animate:function(h,k,g){var j=qx.bom.element.Animation.__eN(h,k.keyFrames);if(qx.core.Environment.get(a)&&j){return qx.bom.element.AnimationCss.animate(h,k,g);}
else {return qx.bom.element.AnimationJs.animate(h,k,g);}
;}
,animateReverse:function(m,o,l){var n=qx.bom.element.Animation.__eN(m,o.keyFrames);if(qx.core.Environment.get(a)&&n){return qx.bom.element.AnimationCss.animateReverse(m,o,l);}
else {return qx.bom.element.AnimationJs.animateReverse(m,o,l);}
;}
,__eN:function(p,t){var r=[];for(var v in t){var s=t[v];for(var u in s){if(r.indexOf(u)==-1){r.push(u);}
;}
;}
;var q=[e,c,d,b];for(var i=0;i<r.length;i++ ){var u=qx.lang.String.camelCase(r[i]);if(!(u in p.style)){if(q.indexOf(r[i])!=-1){continue;}
;if(qx.bom.Style.getPropertyName(u)){continue;}
;return false;}
;}
;return true;}
}});}
)();
(function(){var c="cm",d="mm",e="0",f="pt",g="pc",h="",k="%",l="em",m="qx.bom.element.AnimationJs",n="infinite",o="#",p="in",q="px",r="start",s="end",t="ex",u="undefined",v="iteration",w="string";qx.Bootstrap.define(m,{statics:{__eO:30,__eP:[k,p,c,d,l,t,f,g,q],animate:function(y,z,x){return this._animate(y,z,x,false);}
,animateReverse:function(B,C,A){return this._animate(B,C,A,true);}
,_animate:function(D,N,M,F){if(D.$$animation){return D.$$animation;}
;N=qx.lang.Object.clone(N,true);if(M==undefined){M=N.duration;}
;var I=N.keyFrames;var G=this.__eV(I);var H=this.__eU(M,G);var K=parseInt(M/H,10);this.__eQ(I,D);var L=this.__eR(K,H,G,I,M,N.timing);var E=new qx.bom.element.AnimationHandle();E.jsAnimation=true;if(F){L.reverse();E.reverse=true;}
;E.desc=N;E.el=D;E.delta=L;E.stepTime=H;E.steps=K;D.$$animation=E;E.i=0;E.initValues={};E.repeatSteps=this.__eS(K,N.repeat);var J=N.delay||0;var self=this;E.delayId=window.setTimeout(function(){E.delayId=null;self.play(E);}
,J);return E;}
,__eQ:function(S,O){var V={};for(var R in S){for(var name in S[R]){var P=qx.bom.Style.getPropertyName(name);if(P&&P!=name){var U=qx.bom.Style.getCssName(P);S[R][U]=S[R][name];delete S[R][name];name=U;}
;if(V[name]==undefined){var T=S[R][name];if(typeof T==w){V[name]=T.substring((parseInt(T,10)+h).length,T.length);}
else {V[name]=h;}
;}
;}
;}
;for(var R in S){var Q=S[R];for(var name in V){if(Q[name]==undefined){if(name in O.style){if(window.getComputedStyle){Q[name]=getComputedStyle(O,null)[name];}
else {Q[name]=O.style[name];}
;}
else {Q[name]=O[name];}
;if(Q[name]===h&&this.__eP.indexOf(V[name])!=-1){Q[name]=e+V[name];}
;}
;}
;}
;}
,__eR:function(bg,ba,Y,bc,bk,be){var bb=new Array(bg);var bm=1;bb[0]=bc[0];var X=bc[0];var bd=bc[Y[bm]];for(var i=1;i<bb.length;i++ ){if(i*ba/bk*100>Y[bm]){X=bd;bm++ ;bd=bc[Y[bm]];}
;bb[i]={};for(var name in bd){var bh=bd[name]+h;if(bh.charAt(0)==o){var bj=qx.util.ColorUtil.cssStringToRgb(X[name]);var bi=qx.util.ColorUtil.cssStringToRgb(bh);var W=[];for(var j=0;j<bj.length;j++ ){var bf=bj[j]-bi[j];W[j]=parseInt(bj[j]-bf*qx.bom.AnimationFrame.calculateTiming(be,i/bg),10);}
;bb[i][name]=qx.util.ColorUtil.rgbToHexString(W);}
else if(!isNaN(parseInt(bh,10))){var bl=bh.substring((parseInt(bh,10)+h).length,bh.length);var bf=parseFloat(bh)-parseFloat(X[name]);bb[i][name]=(parseFloat(X[name])+bf*qx.bom.AnimationFrame.calculateTiming(be,i/bg))+bl;}
else {bb[i][name]=X[name]+h;}
;}
;}
;bb[bb.length-1]=bc[100];return bb;}
,play:function(bn){bn.emit(r,bn.el);var bo=window.setInterval(function(){bn.repeatSteps-- ;var bp=bn.delta[bn.i%bn.steps];if(bn.i===0){for(var name in bp){if(bn.initValues[name]===undefined){if(bn.el[name]!==undefined){bn.initValues[name]=bn.el[name];}
else if(qx.bom.element.Style){bn.initValues[name]=qx.bom.element.Style.get(bn.el,qx.lang.String.camelCase(name));}
else {bn.initValues[name]=bn.el.style[qx.lang.String.camelCase(name)];}
;}
;}
;}
;qx.bom.element.AnimationJs.__eT(bn.el,bp);bn.i++ ;if(bn.i%bn.steps==0){bn.emit(v,bn.el);if(bn.desc.alternate){bn.delta.reverse();}
;}
;if(bn.repeatSteps<0){qx.bom.element.AnimationJs.stop(bn);}
;}
,bn.stepTime);bn.animationId=bo;return bn;}
,pause:function(bq){window.clearInterval(bq.animationId);bq.animationId=null;return bq;}
,stop:function(bu){var bt=bu.desc;var br=bu.el;var bs=bu.initValues;if(bu.animationId){window.clearInterval(bu.animationId);}
;if(bu.delayId){window.clearTimeout(bu.delayId);}
;if(br==undefined){return bu;}
;var bv=bt.keep;if(bv!=undefined&&!bu.stopped){if(bu.reverse||(bt.alternate&&bt.repeat&&bt.repeat%2==0)){bv=100-bv;}
;this.__eT(br,bt.keyFrames[bv]);}
else {this.__eT(br,bs);}
;br.$$animation=null;bu.el=null;bu.ended=true;bu.animationId=null;bu.emit(s,br);return bu;}
,__eS:function(bx,bw){if(bw==undefined){return bx;}
;if(bw==n){return Number.MAX_VALUE;}
;return bx*bw;}
,__eT:function(bz,by){for(var bA in by){if(by[bA]===undefined){continue;}
;if(typeof bz.style[bA]===u&&bA in bz){bz[bA]=by[bA];continue;}
;var name=qx.lang.String.camelCase(bA);if(qx.bom.element.Style){qx.bom.element.Style.set(bz,name,by[bA]);}
else {bz.style[name]=by[bA];}
;}
;}
,__eU:function(bD,bB){var bE=100;for(var i=0;i<bB.length-1;i++ ){bE=Math.min(bE,bB[i+1]-bB[i]);}
;var bC=bD*bE/100;while(bC>this.__eO){bC=bC/2;}
;return Math.round(bC);}
,__eV:function(bG){var bF=Object.keys(bG);for(var i=0;i<bF.length;i++ ){bF[i]=parseInt(bF[i],10);}
;bF.sort(function(a,b){return a-b;}
);return bF;}
}});}
)();
(function(){var a="Could not parse color: ",c="",d="Invalid hex value: ",e="Could not convert system colors to RGB: ",h="(",j=")",k="#",l="a",m="Invalid hex3 value: ",n="qx.theme.manager.Color",o="qx.util.ColorUtil",q="Invalid hex6 value: ",s="rgb",u=",";qx.Bootstrap.define(o,{statics:{REGEXP:{hex3:/^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,hex6:/^#([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,rgb:/^rgb\(\s*([0-9]{1,3}\.{0,1}[0-9]*)\s*,\s*([0-9]{1,3}\.{0,1}[0-9]*)\s*,\s*([0-9]{1,3}\.{0,1}[0-9]*)\s*\)$/,rgba:/^rgba\(\s*([0-9]{1,3}\.{0,1}[0-9]*)\s*,\s*([0-9]{1,3}\.{0,1}[0-9]*)\s*,\s*([0-9]{1,3}\.{0,1}[0-9]*)\s*,\s*([0-9]{1,3}\.{0,1}[0-9]*)\s*\)$/},SYSTEM:{activeborder:true,activecaption:true,appworkspace:true,background:true,buttonface:true,buttonhighlight:true,buttonshadow:true,buttontext:true,captiontext:true,graytext:true,highlight:true,highlighttext:true,inactiveborder:true,inactivecaption:true,inactivecaptiontext:true,infobackground:true,infotext:true,menu:true,menutext:true,scrollbar:true,threeddarkshadow:true,threedface:true,threedhighlight:true,threedlightshadow:true,threedshadow:true,window:true,windowframe:true,windowtext:true},NAMED:{black:[0,0,0],silver:[192,192,192],gray:[128,128,128],white:[255,255,255],maroon:[128,0,0],red:[255,0,0],purple:[128,0,128],fuchsia:[255,0,255],green:[0,128,0],lime:[0,255,0],olive:[128,128,0],yellow:[255,255,0],navy:[0,0,128],blue:[0,0,255],teal:[0,128,128],aqua:[0,255,255],transparent:[-1,-1,-1],magenta:[255,0,255],orange:[255,165,0],brown:[165,42,42]},isNamedColor:function(v){return this.NAMED[v]!==undefined;}
,isSystemColor:function(w){return this.SYSTEM[w]!==undefined;}
,supportsThemes:function(){if(qx.Class){return qx.Class.isDefined(n);}
;return false;}
,isThemedColor:function(x){if(!this.supportsThemes()){return false;}
;if(qx.theme&&qx.theme.manager&&qx.theme.manager.Color){return qx.theme.manager.Color.getInstance().isDynamic(x);}
;return false;}
,stringToRgb:function(y){if(this.supportsThemes()&&this.isThemedColor(y)){y=qx.theme.manager.Color.getInstance().resolveDynamic(y);}
;if(this.isNamedColor(y)){return this.NAMED[y].concat();}
else if(this.isSystemColor(y)){throw new Error(e+y);}
else if(this.isRgbaString(y)){return this.__eX(y);}
else if(this.isRgbString(y)){return this.__eW();}
else if(this.isHex3String(y)){return this.__eY();}
else if(this.isHex6String(y)){return this.__fa();}
;throw new Error(a+y);}
,cssStringToRgb:function(z){if(this.isNamedColor(z)){return this.NAMED[z];}
else if(this.isSystemColor(z)){throw new Error(e+z);}
else if(this.isRgbString(z)){return this.__eW();}
else if(this.isRgbaString(z)){return this.__eX();}
else if(this.isHex3String(z)){return this.__eY();}
else if(this.isHex6String(z)){return this.__fa();}
;throw new Error(a+z);}
,stringToRgbString:function(A){return this.rgbToRgbString(this.stringToRgb(A));}
,rgbToRgbString:function(B){return s+(B[3]?l:c)+h+B.join(u)+j;}
,rgbToHexString:function(C){return (k+qx.lang.String.pad(C[0].toString(16).toUpperCase(),2)+qx.lang.String.pad(C[1].toString(16).toUpperCase(),2)+qx.lang.String.pad(C[2].toString(16).toUpperCase(),2));}
,isValidPropertyValue:function(D){return (this.isThemedColor(D)||this.isNamedColor(D)||this.isHex3String(D)||this.isHex6String(D)||this.isRgbString(D)||this.isRgbaString(D));}
,isCssString:function(E){return (this.isSystemColor(E)||this.isNamedColor(E)||this.isHex3String(E)||this.isHex6String(E)||this.isRgbString(E)||this.isRgbaString(E));}
,isHex3String:function(F){return this.REGEXP.hex3.test(F);}
,isHex6String:function(G){return this.REGEXP.hex6.test(G);}
,isRgbString:function(H){return this.REGEXP.rgb.test(H);}
,isRgbaString:function(I){return this.REGEXP.rgba.test(I);}
,__eW:function(){var L=parseInt(RegExp.$1,10);var K=parseInt(RegExp.$2,10);var J=parseInt(RegExp.$3,10);return [L,K,J];}
,__eX:function(){var P=parseInt(RegExp.$1,10);var O=parseInt(RegExp.$2,10);var M=parseInt(RegExp.$3,10);var N=parseInt(RegExp.$4,10);if(P===0&&O===0&M===0&&N===0){return [-1,-1,-1];}
;return [P,O,M];}
,__eY:function(){var S=parseInt(RegExp.$1,16)*17;var R=parseInt(RegExp.$2,16)*17;var Q=parseInt(RegExp.$3,16)*17;return [S,R,Q];}
,__fa:function(){var V=(parseInt(RegExp.$1,16)*16)+parseInt(RegExp.$2,16);var U=(parseInt(RegExp.$3,16)*16)+parseInt(RegExp.$4,16);var T=(parseInt(RegExp.$5,16)*16)+parseInt(RegExp.$6,16);return [V,U,T];}
,hex3StringToRgb:function(W){if(this.isHex3String(W)){return this.__eY(W);}
;throw new Error(m+W);}
,hex3StringToHex6String:function(X){if(this.isHex3String(X)){return this.rgbToHexString(this.hex3StringToRgb(X));}
;return X;}
,hex6StringToRgb:function(Y){if(this.isHex6String(Y)){return this.__fa(Y);}
;throw new Error(q+Y);}
,hexStringToRgb:function(ba){if(this.isHex3String(ba)){return this.__eY(ba);}
;if(this.isHex6String(ba)){return this.__fa(ba);}
;throw new Error(d+ba);}
,rgbToHsb:function(bi){var bc,bd,bf;var bm=bi[0];var bj=bi[1];var bb=bi[2];var bl=(bm>bj)?bm:bj;if(bb>bl){bl=bb;}
;var be=(bm<bj)?bm:bj;if(bb<be){be=bb;}
;bf=bl/255.0;if(bl!=0){bd=(bl-be)/bl;}
else {bd=0;}
;if(bd==0){bc=0;}
else {var bh=(bl-bm)/(bl-be);var bk=(bl-bj)/(bl-be);var bg=(bl-bb)/(bl-be);if(bm==bl){bc=bg-bk;}
else if(bj==bl){bc=2.0+bh-bg;}
else {bc=4.0+bk-bh;}
;bc=bc/6.0;if(bc<0){bc=bc+1.0;}
;}
;return [Math.round(bc*360),Math.round(bd*100),Math.round(bf*100)];}
,hsbToRgb:function(bn){var i,f,p,r,t;var bo=bn[0]/360;var bp=bn[1]/100;var bq=bn[2]/100;if(bo>=1.0){bo%=1.0;}
;if(bp>1.0){bp=1.0;}
;if(bq>1.0){bq=1.0;}
;var br=Math.floor(255*bq);var bs={};if(bp==0.0){bs.red=bs.green=bs.blue=br;}
else {bo*=6.0;i=Math.floor(bo);f=bo-i;p=Math.floor(br*(1.0-bp));r=Math.floor(br*(1.0-(bp*f)));t=Math.floor(br*(1.0-(bp*(1.0-f))));switch(i){case 0:bs.red=br;bs.green=t;bs.blue=p;break;case 1:bs.red=r;bs.green=br;bs.blue=p;break;case 2:bs.red=p;bs.green=br;bs.blue=t;break;case 3:bs.red=p;bs.green=r;bs.blue=br;break;case 4:bs.red=t;bs.green=p;bs.blue=br;break;case 5:bs.red=br;bs.green=p;bs.blue=r;break;};}
;return [bs.red,bs.green,bs.blue];}
,randomColor:function(){var r=Math.round(Math.random()*255);var g=Math.round(Math.random()*255);var b=Math.round(Math.random()*255);return this.rgbToRgbString([r,g,b]);}
}});}
)();
(function(){var a="css.animation",b="Element",c="",d="qx.bom.element.AnimationHandle",e="play-state",f="paused",g="running";qx.Bootstrap.define(d,{extend:qx.event.Emitter,construct:function(){var h=qx.core.Environment.get(a);this.__fb=h&&h[e];this.__fc=true;}
,events:{"start":b,"end":b,"iteration":b},members:{__fb:null,__fc:false,__fd:false,isPlaying:function(){return this.__fc;}
,isEnded:function(){return this.__fd;}
,isPaused:function(){return this.el.style[this.__fb]==f;}
,pause:function(){if(this.el){this.el.style[this.__fb]=f;this.el.$$animation.__fc=false;if(this.animationId&&qx.bom.element.AnimationJs){qx.bom.element.AnimationJs.pause(this);}
;}
;}
,play:function(){if(this.el){this.el.style[this.__fb]=g;this.el.$$animation.__fc=true;if(this.i!=undefined&&qx.bom.element.AnimationJs){qx.bom.element.AnimationJs.play(this);}
;}
;}
,stop:function(){if(this.el&&qx.core.Environment.get(a)&&!this.jsAnimation){this.el.style[this.__fb]=c;this.el.style[qx.core.Environment.get(a).name]=c;this.el.$$animation.__fc=false;this.el.$$animation.__fd=true;}
else if(this.jsAnimation){this.stopped=true;qx.bom.element.AnimationJs.stop(this);}
;}
}});}
)();
(function(){var a="oAnimationStart",b="animationend",c="MSAnimationStart",d="oRequestAnimationFrame",f="AnimationFillMode",g="MSAnimationEnd",h="requestAnimationFrame",j="mozRequestAnimationFrame",k="webkitAnimationEnd",l="css.animation.requestframe",m="AnimationPlayState",n="",o="MSAnimationIteration",p="animation",q="oAnimationEnd",r="@",s="animationiteration",t="webkitRequestAnimationFrame",u=" name",v="qx.bom.client.CssAnimation",w="css.animation",x="oAnimationIteration",y="webkitAnimationIteration",z="-keyframes",A="msRequestAnimationFrame",B="@keyframes",C="animationstart",D="webkitAnimationStart";qx.Bootstrap.define(v,{statics:{getSupport:function(){var name=qx.bom.client.CssAnimation.getName();if(name!=null){return {"name":name,"play-state":qx.bom.client.CssAnimation.getPlayState(),"start-event":qx.bom.client.CssAnimation.getAnimationStart(),"iteration-event":qx.bom.client.CssAnimation.getAnimationIteration(),"end-event":qx.bom.client.CssAnimation.getAnimationEnd(),"fill-mode":qx.bom.client.CssAnimation.getFillMode(),"keyframes":qx.bom.client.CssAnimation.getKeyFrames()};}
;return null;}
,getFillMode:function(){return qx.bom.Style.getPropertyName(f);}
,getPlayState:function(){return qx.bom.Style.getPropertyName(m);}
,getName:function(){return qx.bom.Style.getPropertyName(p);}
,getAnimationStart:function(){var E={"msAnimation":c,"WebkitAnimation":D,"MozAnimation":C,"OAnimation":a,"animation":C};return E[this.getName()];}
,getAnimationIteration:function(){var F={"msAnimation":o,"WebkitAnimation":y,"MozAnimation":s,"OAnimation":x,"animation":s};return F[this.getName()];}
,getAnimationEnd:function(){var G={"msAnimation":g,"WebkitAnimation":k,"MozAnimation":b,"OAnimation":q,"animation":b};return G[this.getName()];}
,getKeyFrames:function(){var H=qx.bom.Style.VENDOR_PREFIXES;var K=[];for(var i=0;i<H.length;i++ ){var J=r+qx.bom.Style.getCssName(H[i])+z;K.push(J);}
;K.unshift(B);var I=qx.bom.Stylesheet.createElement();for(var i=0;i<K.length;i++ ){try{qx.bom.Stylesheet.addRule(I,K[i]+u,n);return K[i];}
catch(e){}
;}
;return null;}
,getRequestAnimationFrame:function(){var L=[h,A,t,j,d];for(var i=0;i<L.length;i++ ){if(window[L[i]]!=undefined){return L[i];}
;}
;return null;}
},defer:function(M){qx.core.Environment.add(w,M.getSupport);qx.core.Environment.add(l,M.getRequestAnimationFrame);}
});}
)();
(function(){var b="ease-in-out",c="Number",d="css.animation.requestframe",e="qx.bom.AnimationFrame",f="frame",g="end",h="linear",j="ease-in",k="ease-out";qx.Bootstrap.define(e,{extend:qx.event.Emitter,events:{"end":undefined,"frame":c},members:{__fe:false,startSequence:function(l){this.__fe=false;var m=+(new Date());var n=function(p){if(this.__fe){this.id=null;return;}
;if(p>=m+l){this.emit(g);this.id=null;}
else {var o=Math.max(p-m,0);this.emit(f,o);this.id=qx.bom.AnimationFrame.request(n,this);}
;}
;this.id=qx.bom.AnimationFrame.request(n,this);}
,cancelSequence:function(){this.__fe=true;}
},statics:{TIMEOUT:30,calculateTiming:function(q,x){if(q==j){var a=[3.1223e-7,0.0757,1.2646,-0.167,-0.4387,0.2654];}
else if(q==k){var a=[-7.0198e-8,1.652,-0.551,-0.0458,0.1255,-0.1807];}
else if(q==h){return x;}
else if(q==b){var a=[2.482e-7,-0.2289,3.3466,-1.0857,-1.7354,0.7034];}
else {var a=[-0.0021,0.2472,9.8054,-21.6869,17.7611,-5.1226];}
;var y=0;for(var i=0;i<a.length;i++ ){y+=a[i]*Math.pow(x,i);}
;return y;}
,request:function(r,t){var s=qx.core.Environment.get(d);var u=function(v){if(v<1e10){v=this.__ff+v;}
;v=v||+(new Date());r.call(t,v);}
;if(s){return window[s](u);}
else {return window.setTimeout(function(){u();}
,qx.bom.AnimationFrame.TIMEOUT);}
;}
},defer:function(w){w.__ff=window.performance&&performance.timing&&performance.timing.navigationStart;if(!w.__ff){w.__ff=Date.now();}
;}
});}
)();
(function(){var a="fill-mode",b="repeat",c="timing",d="start",f="end",g="Anni",h="alternate",i="keep",j=":",k="} ",l="name",m="iteration-event",n="",o="origin",p="forwards",q="start-event",r="iteration",s="end-event",t="css.animation",u="ms ",v="% {",w=" ",x="linear",y=";",z="qx.bom.element.AnimationCss",A="keyframes";qx.Bootstrap.define(z,{statics:{__fg:null,__fh:g,__co:0,__fi:{},__fj:{"scale":true,"rotate":true,"skew":true,"translate":true},__fk:qx.core.Environment.get(t),animateReverse:function(C,D,B){return this._animate(C,D,B,true);}
,animate:function(F,G,E){return this._animate(F,G,E,false);}
,_animate:function(H,O,N,J){this.__fp(O);{}
;var L=O.keep;if(L!=null&&(J||(O.alternate&&O.repeat%2==0))){L=100-L;}
;if(!this.__fg){this.__fg=qx.bom.Stylesheet.createElement();}
;var K=O.keyFrames;if(N==undefined){N=O.duration;}
;if(this.__fk!=null){var name=this.__fr(K,J);var I=name+w+N+u+O.repeat+w+O.timing+w+(O.delay?O.delay+u:n)+(O.alternate?h:n);qx.bom.Event.addNativeListener(H,this.__fk[q],this.__fl);qx.bom.Event.addNativeListener(H,this.__fk[m],this.__fm);qx.bom.Event.addNativeListener(H,this.__fk[s],this.__fn);H.style[qx.lang.String.camelCase(this.__fk[l])]=I;if(L&&L==100&&this.__fk[a]){H.style[this.__fk[a]]=p;}
;}
;var M=new qx.bom.element.AnimationHandle();M.desc=O;M.el=H;M.keep=L;H.$$animation=M;if(O.origin!=null){qx.bom.element.Transform.setOrigin(H,O.origin);}
;if(this.__fk==null){window.setTimeout(function(){qx.bom.element.AnimationCss.__fn({target:H});}
,0);}
;return M;}
,__fl:function(e){e.target.$$animation.emit(d,e.target);}
,__fm:function(e){if(e.target!=null&&e.target.$$animation!=null){e.target.$$animation.emit(r,e.target);}
;}
,__fn:function(e){var P=e.target;var Q=P.$$animation;if(!Q){return;}
;var S=Q.desc;if(qx.bom.element.AnimationCss.__fk!=null){var R=qx.lang.String.camelCase(qx.bom.element.AnimationCss.__fk[l]);P.style[R]=n;qx.bom.Event.removeNativeListener(P,qx.bom.element.AnimationCss.__fk[l],qx.bom.element.AnimationCss.__fn);}
;if(S.origin!=null){qx.bom.element.Transform.setOrigin(P,n);}
;qx.bom.element.AnimationCss.__fo(P,S.keyFrames[Q.keep]);P.$$animation=null;Q.el=null;Q.ended=true;Q.emit(f,P);}
,__fo:function(T,U){var W;for(var V in U){if(V in qx.bom.element.AnimationCss.__fj){if(!W){W={};}
;W[V]=U[V];}
else {T.style[qx.lang.String.camelCase(V)]=U[V];}
;}
;if(W){qx.bom.element.Transform.transform(T,W);}
;}
,__fp:function(X){if(!X.hasOwnProperty(h)){X.alternate=false;}
;if(!X.hasOwnProperty(i)){X.keep=null;}
;if(!X.hasOwnProperty(b)){X.repeat=1;}
;if(!X.hasOwnProperty(c)){X.timing=x;}
;if(!X.hasOwnProperty(o)){X.origin=null;}
;}
,__fq:null,__fr:function(frames,ba){var bd=n;for(var bh in frames){bd+=(ba?-(bh-100):bh)+v;var bc=frames[bh];var bf;for(var Y in bc){if(Y in this.__fj){if(!bf){bf={};}
;bf[Y]=bc[Y];}
else {var bg=qx.bom.Style.getPropertyName(Y);var bb=(bg!==null)?qx.bom.Style.getCssName(bg):n;bd+=(bb||Y)+j+bc[Y]+y;}
;}
;if(bf){bd+=qx.bom.element.Transform.getCss(bf);}
;bd+=k;}
;if(this.__fi[bd]){return this.__fi[bd];}
;var name=this.__fh+this.__co++ ;var be=this.__fk[A]+w+name;qx.bom.Stylesheet.addRule(this.__fg,be,bd);this.__fi[bd]=name;return name;}
}});}
)();
(function(){var a="css.transform.3d",b="backfaceVisibility",c="transformStyle",d="css.transform",e="transformOrigin",f="qx.bom.client.CssTransform",g="transform",h="perspective",i="perspectiveOrigin";qx.Bootstrap.define(f,{statics:{getSupport:function(){var name=qx.bom.client.CssTransform.getName();if(name!=null){return {"name":name,"style":qx.bom.client.CssTransform.getStyle(),"origin":qx.bom.client.CssTransform.getOrigin(),"3d":qx.bom.client.CssTransform.get3D(),"perspective":qx.bom.client.CssTransform.getPerspective(),"perspective-origin":qx.bom.client.CssTransform.getPerspectiveOrigin(),"backface-visibility":qx.bom.client.CssTransform.getBackFaceVisibility()};}
;return null;}
,getStyle:function(){return qx.bom.Style.getPropertyName(c);}
,getPerspective:function(){return qx.bom.Style.getPropertyName(h);}
,getPerspectiveOrigin:function(){return qx.bom.Style.getPropertyName(i);}
,getBackFaceVisibility:function(){return qx.bom.Style.getPropertyName(b);}
,getOrigin:function(){return qx.bom.Style.getPropertyName(e);}
,getName:function(){return qx.bom.Style.getPropertyName(g);}
,get3D:function(){return qx.bom.client.CssTransform.getPerspective()!=null;}
},defer:function(j){qx.core.Environment.add(d,j.getSupport);qx.core.Environment.add(a,j.get3D);}
});}
)();
(function(){var a="backface-visibility",b="name",c="perspective",d="visible",e="",f="(",g="px",h="css.transform",j=" ",k="qx.bom.element.Transform",l="hidden",m="Z",n=";",o="perspective-origin",p=") ",q="X",r="Y",s="origin",t="style",u=":";qx.Bootstrap.define(k,{statics:{__fs:[q,r,m],__ft:qx.core.Environment.get(h),transform:function(v,x){var y=this.__fu(x);if(this.__ft!=null){var w=this.__ft[b];v.style[w]=y;}
;}
,translate:function(z,A){this.transform(z,{translate:A});}
,scale:function(B,C){this.transform(B,{scale:C});}
,rotate:function(D,E){this.transform(D,{rotate:E});}
,skew:function(F,G){this.transform(F,{skew:G});}
,getCss:function(I){var J=this.__fu(I);if(this.__ft!=null){var H=this.__ft[b];return qx.bom.Style.getCssName(H)+u+J+n;}
;return e;}
,setOrigin:function(K,L){if(this.__ft!=null){K.style[this.__ft[s]]=L;}
;}
,getOrigin:function(M){if(this.__ft!=null){return M.style[this.__ft[s]];}
;return e;}
,setStyle:function(N,O){if(this.__ft!=null){N.style[this.__ft[t]]=O;}
;}
,getStyle:function(P){if(this.__ft!=null){return P.style[this.__ft[t]];}
;return e;}
,setPerspective:function(Q,R){if(this.__ft!=null){Q.style[this.__ft[c]]=R+g;}
;}
,getPerspective:function(S){if(this.__ft!=null){return S.style[this.__ft[c]];}
;return e;}
,setPerspectiveOrigin:function(T,U){if(this.__ft!=null){T.style[this.__ft[o]]=U;}
;}
,getPerspectiveOrigin:function(V){if(this.__ft!=null){var W=V.style[this.__ft[o]];if(W!=e){return W;}
else {var Y=V.style[this.__ft[o]+q];var X=V.style[this.__ft[o]+r];if(Y!=e){return Y+j+X;}
;}
;}
;return e;}
,setBackfaceVisibility:function(ba,bb){if(this.__ft!=null){ba.style[this.__ft[a]]=bb?d:l;}
;}
,getBackfaceVisibility:function(bc){if(this.__ft!=null){return bc.style[this.__ft[a]]==d;}
;return true;}
,__fu:function(bf){var bg=e;for(var bd in bf){var be=bf[bd];if(qx.Bootstrap.isArray(be)){for(var i=0;i<be.length;i++ ){if(be[i]==undefined){continue;}
;bg+=bd+this.__fs[i]+f;bg+=be[i];bg+=p;}
;}
else {bg+=bd+f+bf[bd]+p;}
;}
;return bg;}
}});}
)();
(function(){var a="Child is already in: ",b="text",c="qx.html.Element",d="|capture|",f="focus",g="blur",h="div",j="class",k="deactivate",m="__fP",n="css.userselect",o="animationEnd",p="capture",q="visible",r="Root elements could not be inserted into other ones.",s="Has no children!",t="|bubble|",u="releaseCapture",v="Could not move to same index!",w="element",z="",A="qxSelectable",B="tabIndex",C="off",D="on",E="qx.html.Iframe",F="activate",G="Has no parent to remove from.",H="mshtml",I="engine.name",J="none",K="Has no child: ",L="scroll",M=" ",N="hidden",O="Has no child at this position!",P="css.userselect.none",Q="Could not overwrite existing element!";qx.Class.define(c,{extend:qx.core.Object,construct:function(T,R,S){qx.core.Object.call(this);this.__fv=T||h;this.__fw=R||null;this.__fx=S||null;}
,statics:{DEBUG:false,_modified:{},_visibility:{},_scroll:{},_actions:[],__fy:{},__fz:null,__fA:null,_scheduleFlush:function(U){qx.html.Element.__gb.schedule();}
,flush:function(){var bh;{}
;var Y=this.__fB();var W=Y.getFocus();if(W&&this.__fD(W)){Y.blur(W);}
;var bo=Y.getActive();if(bo&&this.__fD(bo)){qx.bom.Element.deactivate(bo);}
;var bc=this.__fC();if(bc&&this.__fD(bc)){qx.bom.Element.releaseCapture(bc);}
;var bi=[];var bj=this._modified;for(var bg in bj){bh=bj[bg];if(bh.__fT()||bh.classname==E){if(bh.__fE&&qx.dom.Hierarchy.isRendered(bh.__fE)){bi.push(bh);}
else {{}
;bh.__fS();}
;delete bj[bg];}
;}
;for(var i=0,l=bi.length;i<l;i++ ){bh=bi[i];{}
;bh.__fS();}
;var be=this._visibility;for(var bg in be){bh=be[bg];var bk=bh.__fE;if(!bk){delete be[bg];continue;}
;{}
;if(!bh.$$disposed){bk.style.display=bh.__dn?z:J;if((qx.core.Environment.get(I)==H)){if(!(document.documentMode>=8)){bk.style.visibility=bh.__dn?q:N;}
;}
;}
;delete be[bg];}
;var scroll=this._scroll;for(var bg in scroll){bh=scroll[bg];var X=bh.__fE;if(X&&X.offsetWidth){var bb=true;if(bh.__fI!=null){bh.__fE.scrollLeft=bh.__fI;delete bh.__fI;}
;if(bh.__fJ!=null){bh.__fE.scrollTop=bh.__fJ;delete bh.__fJ;}
;var bl=bh.__fG;if(bl!=null){var bf=bl.element.getDomElement();if(bf&&bf.offsetWidth){qx.bom.element.Scroll.intoViewX(bf,X,bl.align);delete bh.__fG;}
else {bb=false;}
;}
;var bm=bh.__fH;if(bm!=null){var bf=bm.element.getDomElement();if(bf&&bf.offsetWidth){qx.bom.element.Scroll.intoViewY(bf,X,bm.align);delete bh.__fH;}
else {bb=false;}
;}
;if(bb){delete scroll[bg];}
;}
;}
;var ba={"releaseCapture":1,"blur":1,"deactivate":1};for(var i=0;i<this._actions.length;i++ ){var bn=this._actions[i];var bk=bn.element.__fE;if(!bk||!ba[bn.type]&&!bn.element.__fT()){continue;}
;var bd=bn.args;bd.unshift(bk);qx.bom.Element[bn.type].apply(qx.bom.Element,bd);}
;this._actions=[];for(var bg in this.__fy){var V=this.__fy[bg];var X=V.element.__fE;if(X){qx.bom.Selection.set(X,V.start,V.end);delete this.__fy[bg];}
;}
;qx.event.handler.Appear.refresh();}
,__fB:function(){if(!this.__fz){var bp=qx.event.Registration.getManager(window);this.__fz=bp.getHandler(qx.event.handler.Focus);}
;return this.__fz;}
,__fC:function(){if(!this.__fA){var bq=qx.event.Registration.getManager(window);this.__fA=bq.getDispatcher(qx.event.dispatch.MouseCapture);}
;return this.__fA.getCaptureElement();}
,__fD:function(br){var bs=qx.core.ObjectRegistry.fromHashCode(br.$$element);return bs&&!bs.__fT();}
},members:{__fv:null,__fE:null,__a:false,__fF:true,__dn:true,__fG:null,__fH:null,__fI:null,__fJ:null,__fK:null,__fL:null,__fM:null,__fw:null,__fx:null,__fN:null,__fO:null,__fP:null,__fQ:null,__fR:null,_scheduleChildrenUpdate:function(){if(this.__fQ){return;}
;this.__fQ=true;qx.html.Element._modified[this.$$hash]=this;qx.html.Element._scheduleFlush(w);}
,_createDomElement:function(){return qx.dom.Element.create(this.__fv);}
,__fS:function(){{}
;var length;var bt=this.__fP;if(bt){length=bt.length;var bu;for(var i=0;i<length;i++ ){bu=bt[i];if(bu.__dn&&bu.__fF&&!bu.__fE){bu.__fS();}
;}
;}
;if(!this.__fE){this.__fE=this._createDomElement();this.__fE.$$element=this.$$hash;this._copyData(false);if(bt&&length>0){this._insertChildren();}
;}
else {this._syncData();if(this.__fQ){this._syncChildren();}
;}
;delete this.__fQ;}
,_insertChildren:function(){var bv=this.__fP;var length=bv.length;var bx;if(length>2){var bw=document.createDocumentFragment();for(var i=0;i<length;i++ ){bx=bv[i];if(bx.__fE&&bx.__fF){bw.appendChild(bx.__fE);}
;}
;this.__fE.appendChild(bw);}
else {var bw=this.__fE;for(var i=0;i<length;i++ ){bx=bv[i];if(bx.__fE&&bx.__fF){bw.appendChild(bx.__fE);}
;}
;}
;}
,_syncChildren:function(){var bH=qx.core.ObjectRegistry;var by=this.__fP;var bF=by.length;var bz;var bD;var bB=this.__fE;var bG=bB.childNodes;var bA=0;var bE;{var bC;}
;for(var i=bG.length-1;i>=0;i-- ){bE=bG[i];bD=bH.fromHashCode(bE.$$element);if(!bD||!bD.__fF||bD.__fR!==this){bB.removeChild(bE);{}
;}
;}
;for(var i=0;i<bF;i++ ){bz=by[i];if(bz.__fF){bD=bz.__fE;bE=bG[bA];if(!bD){continue;}
;if(bD!=bE){if(bE){bB.insertBefore(bD,bE);}
else {bB.appendChild(bD);}
;{}
;}
;bA++ ;}
;}
;{}
;}
,_copyData:function(bJ){var bL=this.__fE;var bN=this.__fx;if(bN){var bK=qx.bom.element.Attribute;for(var bM in bN){bK.set(bL,bM,bN[bM]);}
;}
;var bN=this.__fw;if(bN){var bI=qx.bom.element.Style;if(bJ){bI.setStyles(bL,bN);}
else {bI.setCss(bL,bI.compile(bN));}
;}
;var bN=this.__fN;if(bN){for(var bM in bN){this._applyProperty(bM,bN[bM]);}
;}
;var bN=this.__fO;if(bN){qx.event.Registration.getManager(bL).importListeners(bL,bN);delete this.__fO;}
;}
,_syncData:function(){var bS=this.__fE;var bR=qx.bom.element.Attribute;var bP=qx.bom.element.Style;var bQ=this.__fL;if(bQ){var bV=this.__fx;if(bV){var bT;for(var bU in bQ){bT=bV[bU];if(bT!==undefined){bR.set(bS,bU,bT);}
else {bR.reset(bS,bU);}
;}
;}
;this.__fL=null;}
;var bQ=this.__fK;if(bQ){var bV=this.__fw;if(bV){var bO={};for(var bU in bQ){bO[bU]=bV[bU];}
;bP.setStyles(bS,bO);}
;this.__fK=null;}
;var bQ=this.__fM;if(bQ){var bV=this.__fN;if(bV){var bT;for(var bU in bQ){this._applyProperty(bU,bV[bU]);}
;}
;this.__fM=null;}
;}
,__fT:function(){var bW=this;while(bW){if(bW.__a){return true;}
;if(!bW.__fF||!bW.__dn){return false;}
;bW=bW.__fR;}
;return false;}
,__fU:function(bX){if(bX.__fR===this){throw new Error(a+bX);}
;if(bX.__a){throw new Error(r);}
;if(bX.__fR){bX.__fR.remove(bX);}
;bX.__fR=this;if(!this.__fP){this.__fP=[];}
;if(this.__fE){this._scheduleChildrenUpdate();}
;}
,__fV:function(bY){if(bY.__fR!==this){throw new Error(K+bY);}
;if(this.__fE){this._scheduleChildrenUpdate();}
;delete bY.__fR;}
,__fW:function(ca){if(ca.__fR!==this){throw new Error(K+ca);}
;if(this.__fE){this._scheduleChildrenUpdate();}
;}
,getChildren:function(){return this.__fP||null;}
,getChild:function(cb){var cc=this.__fP;return cc&&cc[cb]||null;}
,hasChildren:function(){var cd=this.__fP;return cd&&cd[0]!==undefined;}
,indexOf:function(cf){var ce=this.__fP;return ce?ce.indexOf(cf):-1;}
,hasChild:function(ch){var cg=this.__fP;return cg&&cg.indexOf(ch)!==-1;}
,add:function(ci){if(arguments[1]){for(var i=0,l=arguments.length;i<l;i++ ){this.__fU(arguments[i]);}
;this.__fP.push.apply(this.__fP,arguments);}
else {this.__fU(ci);this.__fP.push(ci);}
;return this;}
,addAt:function(ck,cj){this.__fU(ck);qx.lang.Array.insertAt(this.__fP,ck,cj);return this;}
,remove:function(cl){var cm=this.__fP;if(!cm){return this;}
;if(arguments[1]){var cn;for(var i=0,l=arguments.length;i<l;i++ ){cn=arguments[i];this.__fV(cn);qx.lang.Array.remove(cm,cn);}
;}
else {this.__fV(cl);qx.lang.Array.remove(cm,cl);}
;return this;}
,removeAt:function(co){var cp=this.__fP;if(!cp){throw new Error(s);}
;var cq=cp[co];if(!cq){throw new Error(O);}
;this.__fV(cq);qx.lang.Array.removeAt(this.__fP,co);return this;}
,removeAll:function(){var cr=this.__fP;if(cr){for(var i=0,l=cr.length;i<l;i++ ){this.__fV(cr[i]);}
;cr.length=0;}
;return this;}
,getParent:function(){return this.__fR||null;}
,insertInto:function(parent,cs){parent.__fU(this);if(cs==null){parent.__fP.push(this);}
else {qx.lang.Array.insertAt(this.__fP,this,cs);}
;return this;}
,insertBefore:function(ct){var parent=ct.__fR;parent.__fU(this);qx.lang.Array.insertBefore(parent.__fP,this,ct);return this;}
,insertAfter:function(cu){var parent=cu.__fR;parent.__fU(this);qx.lang.Array.insertAfter(parent.__fP,this,cu);return this;}
,moveTo:function(cv){var parent=this.__fR;parent.__fW(this);var cw=parent.__fP.indexOf(this);if(cw===cv){throw new Error(v);}
else if(cw<cv){cv-- ;}
;qx.lang.Array.removeAt(parent.__fP,cw);qx.lang.Array.insertAt(parent.__fP,this,cv);return this;}
,moveBefore:function(cx){var parent=this.__fR;return this.moveTo(parent.__fP.indexOf(cx));}
,moveAfter:function(cy){var parent=this.__fR;return this.moveTo(parent.__fP.indexOf(cy)+1);}
,free:function(){var parent=this.__fR;if(!parent){throw new Error(G);}
;if(!parent.__fP){return this;}
;parent.__fV(this);qx.lang.Array.remove(parent.__fP,this);return this;}
,getDomElement:function(){return this.__fE||null;}
,getNodeName:function(){return this.__fv;}
,setNodeName:function(name){this.__fv=name;}
,setRoot:function(cz){this.__a=cz;}
,useMarkup:function(cA){if(this.__fE){throw new Error(Q);}
;if(qx.core.Environment.get(I)==H){var cB=document.createElement(h);}
else {var cB=qx.dom.Element.getHelperElement();}
;cB.innerHTML=cA;this.useElement(cB.firstChild);return this.__fE;}
,useElement:function(cC){if(this.__fE){throw new Error(Q);}
;this.__fE=cC;this.__fE.$$element=this.$$hash;this._copyData(true);}
,isFocusable:function(){var cE=this.getAttribute(B);if(cE>=1){return true;}
;var cD=qx.event.handler.Focus.FOCUSABLE_ELEMENTS;if(cE>=0&&cD[this.__fv]){return true;}
;return false;}
,setSelectable:function(cG){this.setAttribute(A,cG?D:C);var cF=qx.core.Environment.get(n);if(cF){this.setStyle(cF,cG?b:qx.core.Environment.get(P));}
;}
,isNativelyFocusable:function(){return !!qx.event.handler.Focus.FOCUSABLE_ELEMENTS[this.__fv];}
,include:function(){if(this.__fF){return this;}
;delete this.__fF;if(this.__fR){this.__fR._scheduleChildrenUpdate();}
;return this;}
,exclude:function(){if(!this.__fF){return this;}
;this.__fF=false;if(this.__fR){this.__fR._scheduleChildrenUpdate();}
;return this;}
,isIncluded:function(){return this.__fF===true;}
,fadeIn:function(cH){var cI=qxWeb(this.__fE);if(cI.isPlaying()){cI.stop();}
;if(!this.__fE){this.__fS();cI.push(this.__fE);}
;if(this.__fE){cI.fadeIn(cH);return cI.getAnimationHandles()[0];}
;}
,fadeOut:function(cJ){var cK=qxWeb(this.__fE);if(cK.isPlaying()){cK.stop();}
;if(this.__fE){cK.fadeOut(cJ).once(o,function(){this.hide();qx.html.Element.flush();}
,this);return cK.getAnimationHandles()[0];}
;}
,show:function(){if(this.__dn){return this;}
;if(this.__fE){qx.html.Element._visibility[this.$$hash]=this;qx.html.Element._scheduleFlush(w);}
;if(this.__fR){this.__fR._scheduleChildrenUpdate();}
;delete this.__dn;return this;}
,hide:function(){if(!this.__dn){return this;}
;if(this.__fE){qx.html.Element._visibility[this.$$hash]=this;qx.html.Element._scheduleFlush(w);}
;this.__dn=false;return this;}
,isVisible:function(){return this.__dn===true;}
,scrollChildIntoViewX:function(cO,cM,cP){var cL=this.__fE;var cN=cO.getDomElement();if(cP!==false&&cL&&cL.offsetWidth&&cN&&cN.offsetWidth){qx.bom.element.Scroll.intoViewX(cN,cL,cM);}
else {this.__fG={element:cO,align:cM};qx.html.Element._scroll[this.$$hash]=this;qx.html.Element._scheduleFlush(w);}
;delete this.__fI;}
,scrollChildIntoViewY:function(cT,cR,cU){var cQ=this.__fE;var cS=cT.getDomElement();if(cU!==false&&cQ&&cQ.offsetWidth&&cS&&cS.offsetWidth){qx.bom.element.Scroll.intoViewY(cS,cQ,cR);}
else {this.__fH={element:cT,align:cR};qx.html.Element._scroll[this.$$hash]=this;qx.html.Element._scheduleFlush(w);}
;delete this.__fJ;}
,scrollToX:function(x,cV){var cW=this.__fE;if(cV!==true&&cW&&cW.offsetWidth){cW.scrollLeft=x;delete this.__fI;}
else {this.__fI=x;qx.html.Element._scroll[this.$$hash]=this;qx.html.Element._scheduleFlush(w);}
;delete this.__fG;}
,getScrollX:function(){var cX=this.__fE;if(cX){return cX.scrollLeft;}
;return this.__fI||0;}
,scrollToY:function(y,da){var cY=this.__fE;if(da!==true&&cY&&cY.offsetWidth){cY.scrollTop=y;delete this.__fJ;}
else {this.__fJ=y;qx.html.Element._scroll[this.$$hash]=this;qx.html.Element._scheduleFlush(w);}
;delete this.__fH;}
,getScrollY:function(){var dc=this.__fE;if(dc){return dc.scrollTop;}
;return this.__fJ||0;}
,disableScrolling:function(){this.enableScrolling();this.scrollToX(0);this.scrollToY(0);this.addListener(L,this.__fY,this);}
,enableScrolling:function(){this.removeListener(L,this.__fY,this);}
,__fX:null,__fY:function(e){if(!this.__fX){this.__fX=true;this.__fE.scrollTop=0;this.__fE.scrollLeft=0;delete this.__fX;}
;}
,getTextSelection:function(){var dd=this.__fE;if(dd){return qx.bom.Selection.get(dd);}
;return null;}
,getTextSelectionLength:function(){var de=this.__fE;if(de){return qx.bom.Selection.getLength(de);}
;return null;}
,getTextSelectionStart:function(){var df=this.__fE;if(df){return qx.bom.Selection.getStart(df);}
;return null;}
,getTextSelectionEnd:function(){var dg=this.__fE;if(dg){return qx.bom.Selection.getEnd(dg);}
;return null;}
,setTextSelection:function(dh,di){var dj=this.__fE;if(dj){qx.bom.Selection.set(dj,dh,di);return;}
;qx.html.Element.__fy[this.toHashCode()]={element:this,start:dh,end:di};qx.html.Element._scheduleFlush(w);}
,clearTextSelection:function(){var dk=this.__fE;if(dk){qx.bom.Selection.clear(dk);}
;delete qx.html.Element.__fy[this.toHashCode()];}
,__ga:function(dl,dm){var dn=qx.html.Element._actions;dn.push({type:dl,element:this,args:dm||[]});qx.html.Element._scheduleFlush(w);}
,focus:function(){this.__ga(f);}
,blur:function(){this.__ga(g);}
,activate:function(){this.__ga(F);}
,deactivate:function(){this.__ga(k);}
,capture:function(dp){this.__ga(p,[dp!==false]);}
,releaseCapture:function(){this.__ga(u);}
,setStyle:function(dq,dr,ds){if(!this.__fw){this.__fw={};}
;if(this.__fw[dq]==dr){return this;}
;if(dr==null){delete this.__fw[dq];}
else {this.__fw[dq]=dr;}
;if(this.__fE){if(ds){qx.bom.element.Style.set(this.__fE,dq,dr);return this;}
;if(!this.__fK){this.__fK={};}
;this.__fK[dq]=true;qx.html.Element._modified[this.$$hash]=this;qx.html.Element._scheduleFlush(w);}
;return this;}
,setStyles:function(du,dw){var dv=qx.bom.element.Style;if(!this.__fw){this.__fw={};}
;if(this.__fE){if(!this.__fK){this.__fK={};}
;for(var dt in du){var dx=du[dt];if(this.__fw[dt]==dx){continue;}
;if(dx==null){delete this.__fw[dt];}
else {this.__fw[dt]=dx;}
;if(dw){dv.set(this.__fE,dt,dx);continue;}
;this.__fK[dt]=true;}
;qx.html.Element._modified[this.$$hash]=this;qx.html.Element._scheduleFlush(w);}
else {for(var dt in du){var dx=du[dt];if(this.__fw[dt]==dx){continue;}
;if(dx==null){delete this.__fw[dt];}
else {this.__fw[dt]=dx;}
;}
;}
;return this;}
,removeStyle:function(dz,dy){this.setStyle(dz,null,dy);return this;}
,getStyle:function(dA){return this.__fw?this.__fw[dA]:null;}
,getAllStyles:function(){return this.__fw||null;}
,setAttribute:function(dB,dC,dD){if(!this.__fx){this.__fx={};}
;if(this.__fx[dB]==dC){return this;}
;if(dC==null){delete this.__fx[dB];}
else {this.__fx[dB]=dC;}
;if(this.__fE){if(dD){qx.bom.element.Attribute.set(this.__fE,dB,dC);return this;}
;if(!this.__fL){this.__fL={};}
;this.__fL[dB]=true;qx.html.Element._modified[this.$$hash]=this;qx.html.Element._scheduleFlush(w);}
;return this;}
,setAttributes:function(dE,dF){for(var dG in dE){this.setAttribute(dG,dE[dG],dF);}
;return this;}
,removeAttribute:function(dI,dH){return this.setAttribute(dI,null,dH);}
,getAttribute:function(dJ){return this.__fx?this.__fx[dJ]:null;}
,addClass:function(name){var dK=((this.getAttribute(j)||z)+M+name).trim();this.setAttribute(j,dK);}
,removeClass:function(name){var dL=this.getAttribute(j);if(dL){this.setAttribute(j,(dL.replace(name,z)).trim());}
;}
,_applyProperty:function(name,dM){}
,_setProperty:function(dN,dO,dP){if(!this.__fN){this.__fN={};}
;if(this.__fN[dN]==dO){return this;}
;if(dO==null){delete this.__fN[dN];}
else {this.__fN[dN]=dO;}
;if(this.__fE){if(dP){this._applyProperty(dN,dO);return this;}
;if(!this.__fM){this.__fM={};}
;this.__fM[dN]=true;qx.html.Element._modified[this.$$hash]=this;qx.html.Element._scheduleFlush(w);}
;return this;}
,_removeProperty:function(dR,dQ){return this._setProperty(dR,null,dQ);}
,_getProperty:function(dT){var dS=this.__fN;if(!dS){return null;}
;var dU=dS[dT];return dU==null?null:dU;}
,addListener:function(ea,dW,self,dV){if(this.$$disposed){return null;}
;{var dX;}
;if(this.__fE){return qx.event.Registration.addListener(this.__fE,ea,dW,self,dV);}
;if(!this.__fO){this.__fO={};}
;if(dV==null){dV=false;}
;var dY=qx.event.Manager.getNextUniqueId();var eb=ea+(dV?d:t)+dY;this.__fO[eb]={type:ea,listener:dW,self:self,capture:dV,unique:dY};return eb;}
,removeListener:function(ei,ed,self,ec){if(this.$$disposed){return null;}
;{var eg;}
;if(this.__fE){qx.event.Registration.removeListener(this.__fE,ei,ed,self,ec);}
else {var ee=this.__fO;var eh;if(ec==null){ec=false;}
;for(var ef in ee){eh=ee[ef];if(eh.listener===ed&&eh.self===self&&eh.capture===ec&&eh.type===ei){delete ee[ef];break;}
;}
;}
;return this;}
,removeListenerById:function(ej){if(this.$$disposed){return null;}
;if(this.__fE){qx.event.Registration.removeListenerById(this.__fE,ej);}
else {delete this.__fO[ej];}
;return this;}
,hasListener:function(em,ek){if(this.$$disposed){return false;}
;if(this.__fE){return qx.event.Registration.hasListener(this.__fE,em,ek);}
;var en=this.__fO;var ep;if(ek==null){ek=false;}
;for(var eo in en){ep=en[eo];if(ep.capture===ek&&ep.type===em){return true;}
;}
;return false;}
},defer:function(eq){eq.__gb=new qx.util.DeferredCall(eq.flush,eq);}
,destruct:function(){var er=this.__fE;if(er){qx.event.Registration.getManager(er).removeAllListeners(er);er.$$element=z;}
;if(!qx.core.ObjectRegistry.inShutDown){var parent=this.__fR;if(parent&&!parent.$$disposed){parent.remove(this);}
;}
;this._disposeArray(m);this.__fx=this.__fw=this.__fO=this.__fN=this.__fL=this.__fK=this.__fM=this.__fE=this.__fR=this.__fG=this.__fH=null;}
});}
)();
(function(){var a="selectstart",b="blur",c="mousedown",d="focus",e="qx.event.handler.Focus",f="_applyFocus",g="DOMFocusIn",h="deactivate",i="textarea",j="touchend",k="_applyActive",l='character',m="input",n="event.touch",o="",p="qxSelectable",q="tabIndex",r="off",s="touchstart",t="activate",u="focusin",v="mshtml",w="engine.name",x="mouseup",y="DOMFocusOut",z="focusout",A="qxKeepFocus",B="on",C="qxKeepActive",D="draggesture";qx.Class.define(e,{extend:qx.core.Object,implement:qx.event.IEventHandler,construct:function(E){qx.core.Object.call(this);this._manager=E;this._window=E.getWindow();this._document=this._window.document;this._root=this._document.documentElement;this._body=this._document.body;var F=qx.core.Environment.get(n)&&qx.event.handler.MouseEmulation.ON;this.__gc=F?s:c;this.__gd=F?j:x;this._initObserver();}
,properties:{active:{apply:k,nullable:true},focus:{apply:f,nullable:true}},statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,SUPPORTED_TYPES:{focus:1,blur:1,focusin:1,focusout:1,activate:1,deactivate:1},IGNORE_CAN_HANDLE:true,FOCUSABLE_ELEMENTS:qx.core.Environment.select(w,{"mshtml|gecko":{a:1,body:1,button:1,frame:1,iframe:1,img:1,input:1,object:1,select:1,textarea:1},"opera|webkit":{button:1,input:1,select:1,textarea:1}})},members:{__ge:null,__gf:null,__gg:null,__gh:null,__gi:null,__gj:null,__gk:null,__gl:null,__gm:null,__gn:null,__gc:o,__gd:o,canHandleEvent:function(H,G){}
,registerEvent:function(K,J,I){}
,unregisterEvent:function(N,M,L){}
,focus:function(O){if((qx.core.Environment.get(w)==v)){window.setTimeout(function(){try{O.focus();var P=qx.bom.Selection.get(O);if(P.length==0){var Q=O.createTextRange();Q.moveStart(l,O.value.length);Q.collapse();Q.select();}
;}
catch(R){}
;}
,0);}
else {try{O.focus();}
catch(S){}
;}
;this.setFocus(O);this.setActive(O);}
,activate:function(T){this.setActive(T);}
,blur:function(U){try{U.blur();}
catch(V){}
;if(this.getActive()===U){this.resetActive();}
;if(this.getFocus()===U){this.resetFocus();}
;}
,deactivate:function(W){if(this.getActive()===W){this.resetActive();}
;}
,tryActivate:function(Y){var X=this.__gC(Y);if(X){this.setActive(X);}
;}
,__go:function(ba,bc,bf,be){var bd=qx.event.Registration;var bb=bd.createEvent(bf,qx.event.type.Focus,[ba,bc,be]);bd.dispatchEvent(ba,bb);}
,_windowFocused:true,__gp:function(){if(this._windowFocused){this._windowFocused=false;this.__go(this._window,null,b,false);}
;}
,__gq:function(){if(!this._windowFocused){this._windowFocused=true;this.__go(this._window,null,d,false);}
;}
,_initObserver:qx.core.Environment.select(w,{"gecko":function(){this.__ge=qx.lang.Function.listener(this.__gw,this);this.__gf=qx.lang.Function.listener(this.__gx,this);this.__gg=qx.lang.Function.listener(this.__gv,this);this.__gh=qx.lang.Function.listener(this.__gu,this);this.__gi=qx.lang.Function.listener(this.__gr,this);qx.bom.Event.addNativeListener(this._document,this.__gc,this.__ge,true);qx.bom.Event.addNativeListener(this._document,this.__gd,this.__gf,true);qx.bom.Event.addNativeListener(this._window,d,this.__gg,true);qx.bom.Event.addNativeListener(this._window,b,this.__gh,true);qx.bom.Event.addNativeListener(this._window,D,this.__gi,true);}
,"mshtml":function(){this.__ge=qx.lang.Function.listener(this.__gw,this);this.__gf=qx.lang.Function.listener(this.__gx,this);this.__gk=qx.lang.Function.listener(this.__gs,this);this.__gl=qx.lang.Function.listener(this.__gt,this);this.__gj=qx.lang.Function.listener(this.__gz,this);qx.bom.Event.addNativeListener(this._document,this.__gc,this.__ge);qx.bom.Event.addNativeListener(this._document,this.__gd,this.__gf);qx.bom.Event.addNativeListener(this._document,u,this.__gk);qx.bom.Event.addNativeListener(this._document,z,this.__gl);qx.bom.Event.addNativeListener(this._document,a,this.__gj);}
,"webkit":function(){this.__ge=qx.lang.Function.listener(this.__gw,this);this.__gf=qx.lang.Function.listener(this.__gx,this);this.__gl=qx.lang.Function.listener(this.__gt,this);this.__gg=qx.lang.Function.listener(this.__gv,this);this.__gh=qx.lang.Function.listener(this.__gu,this);this.__gj=qx.lang.Function.listener(this.__gz,this);qx.bom.Event.addNativeListener(this._document,this.__gc,this.__ge,true);qx.bom.Event.addNativeListener(this._document,this.__gd,this.__gf,true);qx.bom.Event.addNativeListener(this._document,a,this.__gj,false);qx.bom.Event.addNativeListener(this._window,y,this.__gl,true);qx.bom.Event.addNativeListener(this._window,d,this.__gg,true);qx.bom.Event.addNativeListener(this._window,b,this.__gh,true);}
,"opera":function(){this.__ge=qx.lang.Function.listener(this.__gw,this);this.__gf=qx.lang.Function.listener(this.__gx,this);this.__gk=qx.lang.Function.listener(this.__gs,this);this.__gl=qx.lang.Function.listener(this.__gt,this);qx.bom.Event.addNativeListener(this._document,this.__gc,this.__ge,true);qx.bom.Event.addNativeListener(this._document,this.__gd,this.__gf,true);qx.bom.Event.addNativeListener(this._window,g,this.__gk,true);qx.bom.Event.addNativeListener(this._window,y,this.__gl,true);}
}),_stopObserver:qx.core.Environment.select(w,{"gecko":function(){qx.bom.Event.removeNativeListener(this._document,this.__gc,this.__ge,true);qx.bom.Event.removeNativeListener(this._document,this.__gd,this.__gf,true);qx.bom.Event.removeNativeListener(this._window,d,this.__gg,true);qx.bom.Event.removeNativeListener(this._window,b,this.__gh,true);qx.bom.Event.removeNativeListener(this._window,D,this.__gi,true);}
,"mshtml":function(){qx.bom.Event.removeNativeListener(this._document,this.__gc,this.__ge);qx.bom.Event.removeNativeListener(this._document,this.__gd,this.__gf);qx.bom.Event.removeNativeListener(this._document,u,this.__gk);qx.bom.Event.removeNativeListener(this._document,z,this.__gl);qx.bom.Event.removeNativeListener(this._document,a,this.__gj);}
,"webkit":function(){qx.bom.Event.removeNativeListener(this._document,this.__gc,this.__ge,true);qx.bom.Event.removeNativeListener(this._document,this.__gd,this.__gf,true);qx.bom.Event.removeNativeListener(this._document,a,this.__gj,false);qx.bom.Event.removeNativeListener(this._window,y,this.__gl,true);qx.bom.Event.removeNativeListener(this._window,d,this.__gg,true);qx.bom.Event.removeNativeListener(this._window,b,this.__gh,true);}
,"opera":function(){qx.bom.Event.removeNativeListener(this._document,this.__gc,this.__ge,true);qx.bom.Event.removeNativeListener(this._document,this.__gd,this.__gf,true);qx.bom.Event.removeNativeListener(this._window,g,this.__gk,true);qx.bom.Event.removeNativeListener(this._window,y,this.__gl,true);}
}),__gr:qx.event.GlobalError.observeMethod(qx.core.Environment.select(w,{"gecko":function(bg){var bh=qx.bom.Event.getTarget(bg);if(!this.__gD(bh)){qx.bom.Event.preventDefault(bg);}
;}
,"default":null})),__gs:qx.event.GlobalError.observeMethod(qx.core.Environment.select(w,{"mshtml":function(bj){this.__gq();var bk=qx.bom.Event.getTarget(bj);var bi=this.__gB(bk);if(bi){this.setFocus(bi);}
;this.tryActivate(bk);}
,"opera":function(bl){var bm=qx.bom.Event.getTarget(bl);if(bm==this._document||bm==this._window){this.__gq();if(this.__gm){this.setFocus(this.__gm);delete this.__gm;}
;if(this.__gn){this.setActive(this.__gn);delete this.__gn;}
;}
else {this.setFocus(bm);this.tryActivate(bm);if(!this.__gD(bm)){bm.selectionStart=0;bm.selectionEnd=0;}
;}
;}
,"default":null})),__gt:qx.event.GlobalError.observeMethod(qx.core.Environment.select(w,{"mshtml":function(bn){var bo=qx.bom.Event.getRelatedTarget(bn);if(bo==null){this.__gp();this.resetFocus();this.resetActive();}
;}
,"webkit":function(bp){var bq=qx.bom.Event.getTarget(bp);if(bq===this.getFocus()){this.resetFocus();}
;if(bq===this.getActive()){this.resetActive();}
;}
,"opera":function(br){var bs=qx.bom.Event.getTarget(br);if(bs==this._document){this.__gp();this.__gm=this.getFocus();this.__gn=this.getActive();this.resetFocus();this.resetActive();}
else {if(bs===this.getFocus()){this.resetFocus();}
;if(bs===this.getActive()){this.resetActive();}
;}
;}
,"default":null})),__gu:qx.event.GlobalError.observeMethod(qx.core.Environment.select(w,{"gecko":function(bt){var bu=qx.bom.Event.getTarget(bt);if(bu===this._window||bu===this._document){this.__gp();this.resetActive();this.resetFocus();}
;}
,"webkit":function(bv){var bw=qx.bom.Event.getTarget(bv);if(bw===this._window||bw===this._document){this.__gp();this.__gm=this.getFocus();this.__gn=this.getActive();this.resetActive();this.resetFocus();}
;}
,"default":null})),__gv:qx.event.GlobalError.observeMethod(qx.core.Environment.select(w,{"gecko":function(bx){var by=qx.bom.Event.getTarget(bx);if(by===this._window||by===this._document){this.__gq();by=this._body;}
;this.setFocus(by);this.tryActivate(by);}
,"webkit":function(bz){var bA=qx.bom.Event.getTarget(bz);if(bA===this._window||bA===this._document){this.__gq();if(this.__gm){this.setFocus(this.__gm);delete this.__gm;}
;if(this.__gn){this.setActive(this.__gn);delete this.__gn;}
;}
else {this.setFocus(bA);this.tryActivate(bA);}
;}
,"default":null})),__gw:qx.event.GlobalError.observeMethod(qx.core.Environment.select(w,{"mshtml":function(bC){var bD=qx.bom.Event.getTarget(bC);var bB=this.__gB(bD);if(bB){if(!this.__gD(bD)){bD.unselectable=B;try{document.selection.empty();}
catch(bE){}
;try{bB.focus();}
catch(bF){}
;}
;}
else {qx.bom.Event.preventDefault(bC);if(!this.__gD(bD)){bD.unselectable=B;}
;}
;}
,"webkit|gecko":function(bH){var bI=qx.bom.Event.getTarget(bH);var bG=this.__gB(bI);if(bG){this.setFocus(bG);if(qx.core.Environment.get(n)&&qx.event.handler.MouseEmulation.ON){try{if(document.activeElement==bG){bG.blur();}
;bG.focus();}
catch(bJ){}
;}
;}
else {qx.bom.Event.preventDefault(bH);}
;}
,"opera":function(bM){var bN=qx.bom.Event.getTarget(bM);var bK=this.__gB(bN);if(!this.__gD(bN)){qx.bom.Event.preventDefault(bM);if(bK){var bL=this.getFocus();if(bL&&bL.selectionEnd){bL.selectionStart=0;bL.selectionEnd=0;bL.blur();}
;if(bK){this.setFocus(bK);}
;}
;}
else if(bK){this.setFocus(bK);}
;}
,"default":null})),__gx:qx.event.GlobalError.observeMethod(qx.core.Environment.select(w,{"mshtml":function(bO){var bP=qx.bom.Event.getTarget(bO);if(bP.unselectable){bP.unselectable=r;}
;this.tryActivate(this.__gy(bP));}
,"gecko":function(bQ){var bR=qx.bom.Event.getTarget(bQ);while(bR&&bR.offsetWidth===undefined){bR=bR.parentNode;}
;if(bR){this.tryActivate(bR);}
;}
,"webkit|opera":function(bS){var bT=qx.bom.Event.getTarget(bS);this.tryActivate(this.__gy(bT));}
,"default":null})),__gy:qx.event.GlobalError.observeMethod(qx.core.Environment.select(w,{"mshtml|webkit":function(bU){var bV=this.getFocus();if(bV&&bU!=bV&&(bV.nodeName.toLowerCase()===m||bV.nodeName.toLowerCase()===i)){bU=bV;}
;return bU;}
,"default":function(bW){return bW;}
})),__gz:qx.event.GlobalError.observeMethod(qx.core.Environment.select(w,{"mshtml|webkit":function(bX){var bY=qx.bom.Event.getTarget(bX);if(!this.__gD(bY)){qx.bom.Event.preventDefault(bX);}
;}
,"default":null})),__gA:function(ca){var cb=qx.bom.element.Attribute.get(ca,q);if(cb>=1){return true;}
;var cc=qx.event.handler.Focus.FOCUSABLE_ELEMENTS;if(cb>=0&&cc[ca.tagName]){return true;}
;return false;}
,__gB:function(cd){while(cd&&cd.nodeType===1){if(cd.getAttribute(A)==B){return null;}
;if(this.__gA(cd)){return cd;}
;cd=cd.parentNode;}
;return this._body;}
,__gC:function(ce){var cf=ce;while(ce&&ce.nodeType===1){if(ce.getAttribute(C)==B){return null;}
;ce=ce.parentNode;}
;return cf;}
,__gD:function(cg){while(cg&&cg.nodeType===1){var ch=cg.getAttribute(p);if(ch!=null){return ch===B;}
;cg=cg.parentNode;}
;return true;}
,_applyActive:function(cj,ci){if(ci){this.__go(ci,cj,h,true);}
;if(cj){this.__go(cj,ci,t,true);}
;}
,_applyFocus:function(cl,ck){if(ck){this.__go(ck,cl,z,true);}
;if(cl){this.__go(cl,ck,u,true);}
;if(ck){this.__go(ck,cl,b,false);}
;if(cl){this.__go(cl,ck,d,false);}
;}
},destruct:function(){this._stopObserver();this._manager=this._window=this._document=this._root=this._body=this.__gE=null;}
,defer:function(cn){qx.event.Registration.addHandler(cn);var co=cn.FOCUSABLE_ELEMENTS;for(var cm in co){co[cm.toUpperCase()]=1;}
;}
});}
)();
(function(){var a="qx.event.type.Focus";qx.Class.define(a,{extend:qx.event.type.Event,members:{init:function(d,b,c){qx.event.type.Event.prototype.init.call(this,c,false);this._target=d;this._relatedTarget=b;return this;}
}});}
)();
(function(){var a="touchmove",b="os.name",c="MSPointerDown",d="swipe",e="android",f="qx.event.handler.TouchCore",g="event.mspointer",h="MSPointerCancel",j="y",k="pointer-events",l="longtap",m="touchend",n="MSPointerUp",o="right",p="engine.name",q="x",r="touchcancel",s="MSPointerMove",t="webkit",u="none",v="left",w="tap",z="down",A="undefined",B="up",C="touchstart";qx.Bootstrap.define(f,{extend:Object,statics:{TAP_MAX_DISTANCE:qx.core.Environment.get(b)!=e?10:40,SWIPE_DIRECTION:{x:[v,o],y:[B,z]},SWIPE_MIN_DISTANCE:qx.core.Environment.get(b)!=e?11:41,SWIPE_MIN_VELOCITY:0,LONGTAP_TIME:500},construct:function(D,E){this.__gF=D;this.__ev=E;this._initTouchObserver();}
,members:{__gF:null,__ev:null,__gG:null,__gH:null,__gI:null,__gJ:null,__gK:null,__gL:null,__gM:null,__gN:null,__gO:null,__gP:null,__gQ:null,_initTouchObserver:function(){this.__gG=qx.lang.Function.listener(this._onTouchEvent,this);var Event=qx.bom.Event;Event.addNativeListener(this.__gF,C,this.__gG);Event.addNativeListener(this.__gF,a,this.__gG);Event.addNativeListener(this.__gF,m,this.__gG);Event.addNativeListener(this.__gF,r,this.__gG);if(qx.core.Environment.get(g)){Event.addNativeListener(this.__gF,c,this.__gG);Event.addNativeListener(this.__gF,s,this.__gG);Event.addNativeListener(this.__gF,n,this.__gG);Event.addNativeListener(this.__gF,h,this.__gG);}
;}
,_stopTouchObserver:function(){var Event=qx.bom.Event;Event.removeNativeListener(this.__gF,C,this.__gG);Event.removeNativeListener(this.__gF,a,this.__gG);Event.removeNativeListener(this.__gF,m,this.__gG);Event.removeNativeListener(this.__gF,r,this.__gG);if(qx.core.Environment.get(g)){Event.removeNativeListener(this.__gF,c,this.__gG);Event.removeNativeListener(this.__gF,s,this.__gG);Event.removeNativeListener(this.__gF,n,this.__gG);Event.removeNativeListener(this.__gF,h,this.__gG);}
;}
,_onTouchEvent:function(F){this._commonTouchEventHandler(F);}
,_getScalingDistance:function(H,G){return (Math.sqrt(Math.pow(H.pageX-G.pageX,2)+Math.pow(H.pageY-G.pageY,2)));}
,_getRotationAngle:function(J,I){var x=J.pageX-I.pageX;var y=J.pageY-I.pageY;return (Math.atan2(y,x)*180/Math.PI);}
,_commonTouchEventHandler:function(M,K){var K=K||M.type;if(qx.core.Environment.get(g)){M.changedTouches=[M];M.targetTouches=[M];M.touches=[M];if(K==c){K=C;}
else if(K==n){K=m;}
else if(K==s){if(this.__gN==true){K=a;}
;}
else if(K==h){K=r;}
;}
;if(K==C){this.__gH=this._getTarget(M);this.__gM=true;if(M.touches&&M.touches.length>1){this.__gO=this._getScalingDistance(M.touches[0],M.touches[1]);this.__gP=this._getRotationAngle(M.touches[0],M.touches[1]);}
;}
;if(K==a){if(typeof M.scale==A&&M.targetTouches.length>1){var N=this._getScalingDistance(M.targetTouches[0],M.targetTouches[1]);M.scale=N/this.__gO;}
;if(typeof M.rotation==A&&M.targetTouches.length>1){var L=this._getRotationAngle(M.targetTouches[0],M.targetTouches[1]);M.rotation=L-this.__gP;}
;if(this.__gM){this.__gM=this._isBelowTapMaxDistance(M.changedTouches[0]);}
;}
;this._fireEvent(M,K);this.__gS(M,K);}
,_isBelowTapMaxDistance:function(O){var P={x:O.screenX-this.__gI,y:O.screenY-this.__gJ};var Q=qx.event.handler.TouchCore;return (Math.abs(P.x)<=Q.TAP_MAX_DISTANCE&&Math.abs(P.y)<=Q.TAP_MAX_DISTANCE);}
,_getTarget:function(S){var T=qx.bom.Event.getTarget(S);if(qx.core.Environment.get(p)==t){if(T&&T.nodeType==3){T=T.parentNode;}
;}
else if(qx.core.Environment.get(g)){var R=this.__gR(S);if(R){T=R;}
;}
;return T;}
,__gR:function(W){if(W&&W.touches){var U=W.touches[0].clientX;var V=W.touches[0].clientY;}
;var Y=document.msElementsFromPoint(U,V);if(Y){for(var i=0;i<Y.length;i++ ){var ba=Y[i];var X=qx.bom.element.Style.get(ba,k,3);if(X!=u){return ba;}
;}
;}
;return null;}
,_fireEvent:function(bb,bc,bd){if(!bd){bd=this._getTarget(bb);}
;var bc=bc||bb.type;if(bd&&bd.nodeType&&this.__ev){this.__ev.emit(bc,bb);}
;}
,__gS:function(be,bf,bg){if(!bg){bg=this._getTarget(be);}
;var bf=bf||be.type;if(bf==C){this.__gT(be,bg);}
else if(bf==a){this.__gU(be,bg);}
else if(bf==m){this.__gV(be,bg);}
;}
,__gT:function(bi,bj){var bh=bi.changedTouches[0];this.__gN=true;this.__gI=bh.screenX;this.__gJ=bh.screenY;this.__gK=new Date().getTime();this.__gL=bi.targetTouches.length===1;if(this.__gL){this.__gQ=window.setTimeout(this.__gX.bind(this,bi,bj),qx.event.handler.TouchCore.LONGTAP_TIME);}
else {this.__gY();}
;}
,__gU:function(bk,bl){if(this.__gL&&bk.changedTouches.length>1){this.__gL=false;}
;if(!this._isBelowTapMaxDistance(bk.changedTouches[0])){this.__gY();}
;}
,__gV:function(bm,bn){this.__gN=false;this.__gY();if(this.__gL){var bq=bm.changedTouches[0];var br={x:bq.screenX-this.__gI,y:bq.screenY-this.__gJ};var bo;if(this.__gH==bn&&this.__gM){if(qx.event&&qx.event.type&&qx.event.type.Tap){bo=qx.event.type.Tap;}
;this._fireEvent(bm,w,bn,bo);}
else {var bp=this.__gW(bm,bn,br);if(bp){if(qx.event&&qx.event.type&&qx.event.type.Swipe){bo=qx.event.type.Swipe;}
;bm.swipe=bp;this._fireEvent(bm,d,bn,bo);}
;}
;}
;}
,__gW:function(bu,bv,bA){var bx=qx.event.handler.TouchCore;var by=new Date().getTime()-this.__gK;var bB=(Math.abs(bA.x)>=Math.abs(bA.y))?q:j;var bs=bA[bB];var bt=bx.SWIPE_DIRECTION[bB][bs<0?0:1];var bz=(by!==0)?bs/by:0;var bw=null;if(Math.abs(bz)>=bx.SWIPE_MIN_VELOCITY&&Math.abs(bs)>=bx.SWIPE_MIN_DISTANCE){bw={startTime:this.__gK,duration:by,axis:bB,direction:bt,distance:bs,velocity:bz};}
;return bw;}
,__gX:function(bC,bD){this._fireEvent(bC,l,bD,qx.event.type.Tap);this.__gQ=null;this.__gM=false;}
,__gY:function(){if(this.__gQ){window.clearTimeout(this.__gQ);this.__gQ=null;}
;}
,dispose:function(){this._stopTouchObserver();this.__gH=this.__gF=this.__ev=this.__gO=this.__gP=null;this.__gY();}
}});}
)();
(function(){var a="qx.event.type.Native";qx.Class.define(a,{extend:qx.event.type.Event,members:{init:function(b,e,f,d,c){qx.event.type.Event.prototype.init.call(this,d,c);this._target=e||qx.bom.Event.getTarget(b);this._relatedTarget=f||qx.bom.Event.getRelatedTarget(b);if(b.timeStamp){this._timeStamp=b.timeStamp;}
;this._native=b;this._returnValue=null;return this;}
,clone:function(g){var h=qx.event.type.Event.prototype.clone.call(this,g);var i={};h._native=this._cloneNativeEvent(this._native,i);h._returnValue=this._returnValue;return h;}
,_cloneNativeEvent:function(j,k){k.preventDefault=(function(){}
);return k;}
,preventDefault:function(){qx.event.type.Event.prototype.preventDefault.call(this);qx.bom.Event.preventDefault(this._native);}
,getNativeEvent:function(){return this._native;}
,setReturnValue:function(l){this._returnValue=l;}
,getReturnValue:function(){return this._returnValue;}
},destruct:function(){this._native=this._returnValue=null;}
});}
)();
(function(){var a="os.name",b="opera",c="engine.name",d="qx.event.type.Dom",e="osx";qx.Class.define(d,{extend:qx.event.type.Native,statics:{SHIFT_MASK:1,CTRL_MASK:2,ALT_MASK:4,META_MASK:8},members:{_cloneNativeEvent:function(f,g){var g=qx.event.type.Native.prototype._cloneNativeEvent.call(this,f,g);g.shiftKey=f.shiftKey;g.ctrlKey=f.ctrlKey;g.altKey=f.altKey;g.metaKey=f.metaKey;return g;}
,getModifiers:function(){var h=0;var i=this._native;if(i.shiftKey){h|=qx.event.type.Dom.SHIFT_MASK;}
;if(i.ctrlKey){h|=qx.event.type.Dom.CTRL_MASK;}
;if(i.altKey){h|=qx.event.type.Dom.ALT_MASK;}
;if(i.metaKey){h|=qx.event.type.Dom.META_MASK;}
;return h;}
,isCtrlPressed:function(){return this._native.ctrlKey;}
,isShiftPressed:function(){return this._native.shiftKey;}
,isAltPressed:function(){return this._native.altKey;}
,isMetaPressed:function(){return this._native.metaKey;}
,isCtrlOrCommandPressed:function(){if(qx.core.Environment.get(a)==e&&qx.core.Environment.get(c)!=b){return this._native.metaKey;}
else {return this._native.ctrlKey;}
;}
}});}
)();
(function(){var a="touchcancel",b="qx.event.type.Touch",c="touchend";qx.Class.define(b,{extend:qx.event.type.Dom,members:{_cloneNativeEvent:function(d,e){var e=qx.event.type.Dom.prototype._cloneNativeEvent.call(this,d,e);e.pageX=d.pageX;e.pageY=d.pageY;e.offsetX=d.offsetX;e.offsetY=d.offsetY;e.layerX=(d.offsetX||d.layerX);e.layerY=(d.offsetY||d.layerY);e.scale=d.scale;e.rotation=d.rotation;e.srcElement=d.srcElement;e.targetTouches=[];for(var i=0;i<d.targetTouches.length;i++ ){e.targetTouches[i]=d.targetTouches[i];}
;e.changedTouches=[];for(i=0;i<d.changedTouches.length;i++ ){e.changedTouches[i]=d.changedTouches[i];}
;e.touches=[];for(i=0;i<d.touches.length;i++ ){e.touches[i]=d.touches[i];}
;return e;}
,stop:function(){this.stopPropagation();}
,getAllTouches:function(){return this._native.touches;}
,getTargetTouches:function(){return this._native.targetTouches;}
,getChangedTargetTouches:function(){return this._native.changedTouches;}
,isMultiTouch:function(){return this.__hb().length>1;}
,getScale:function(){return this._native.scale;}
,getRotation:function(){return this._native.rotation;}
,getDocumentLeft:function(f){return this.__ha(f).pageX;}
,getDocumentTop:function(g){return this.__ha(g).pageY;}
,getScreenLeft:function(h){return this.__ha(h).screenX;}
,getScreenTop:function(j){return this.__ha(j).screenY;}
,getViewportLeft:function(k){return this.__ha(k).clientX;}
,getViewportTop:function(l){return this.__ha(l).clientY;}
,getIdentifier:function(m){return this.__ha(m).identifier;}
,__ha:function(n){n=n==null?0:n;return this.__hb()[n];}
,__hb:function(){var o=(this._isTouchEnd()?this.getChangedTargetTouches():this.getTargetTouches());return o;}
,_isTouchEnd:function(){return (this.getType()==c||this.getType()==a);}
}});}
)();
(function(){var a="qx.event.type.Tap";qx.Class.define(a,{extend:qx.event.type.Touch,members:{_isTouchEnd:function(){return true;}
}});}
)();
(function(){var a="qx.event.type.Swipe";qx.Class.define(a,{extend:qx.event.type.Touch,members:{_cloneNativeEvent:function(b,c){var c=qx.event.type.Touch.prototype._cloneNativeEvent.call(this,b,c);c.swipe=b.swipe;return c;}
,_isTouchEnd:function(){return true;}
,getStartTime:function(){return this._native.swipe.startTime;}
,getDuration:function(){return this._native.swipe.duration;}
,getAxis:function(){return this._native.swipe.axis;}
,getDirection:function(){return this._native.swipe.direction;}
,getVelocity:function(){return this._native.swipe.velocity;}
,getDistance:function(){return this._native.swipe.distance;}
}});}
)();
(function(){var a="qx.event.handler.UserAction";qx.Class.define(a,{extend:qx.core.Object,implement:qx.event.IEventHandler,construct:function(b){qx.core.Object.call(this);this.__er=b;this.__cx=b.getWindow();}
,statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,SUPPORTED_TYPES:{useraction:1},TARGET_CHECK:qx.event.IEventHandler.TARGET_WINDOW,IGNORE_CAN_HANDLE:true},members:{__er:null,__cx:null,canHandleEvent:function(d,c){}
,registerEvent:function(g,f,e){}
,unregisterEvent:function(j,i,h){}
},destruct:function(){this.__er=this.__cx=null;}
,defer:function(k){qx.event.Registration.addHandler(k);}
});}
)();
(function(){var a="resize",b="os.name",c="qx.event.handler.Orientation",d="landscape",e="android",f="portrait",g="orientationchange";qx.Class.define(c,{extend:qx.core.Object,implement:qx.event.IEventHandler,construct:function(h){qx.core.Object.call(this);this.__er=h;this.__cx=h.getWindow();this._initObserver();}
,statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,SUPPORTED_TYPES:{orientationchange:1},TARGET_CHECK:qx.event.IEventHandler.TARGET_WINDOW,IGNORE_CAN_HANDLE:true},members:{__er:null,__cx:null,__hc:null,_currentOrientation:null,__hd:null,canHandleEvent:function(j,i){}
,registerEvent:function(m,l,k){}
,unregisterEvent:function(p,o,n){}
,_initObserver:function(){this.__hd=qx.lang.Function.listener(this._onNative,this);this.__hc=qx.bom.Event.supportsEvent(this.__cx,g)?g:a;var Event=qx.bom.Event;Event.addNativeListener(this.__cx,this.__hc,this.__hd);}
,_stopObserver:function(){var Event=qx.bom.Event;Event.removeNativeListener(this.__cx,this.__hc,this.__hd);}
,_onNative:qx.event.GlobalError.observeMethod(function(q){var r=0;if(qx.core.Environment.get(b)==e){r=300;}
;qx.lang.Function.delay(this._onOrientationChange,r,this,q);}
),_onOrientationChange:function(s){var u=qx.bom.Viewport;var t=u.getOrientation(s.target);if(this._currentOrientation!=t){this._currentOrientation=t;var v=u.isLandscape(s.target)?d:f;qx.event.Registration.fireEvent(this.__cx,g,qx.event.type.Orientation,[t,v]);}
;}
},destruct:function(){this._stopObserver();this.__er=this.__cx=null;}
,defer:function(w){qx.event.Registration.addHandler(w);}
});}
)();
(function(){var a="landscape",b="qx.event.type.Orientation",c="portrait";qx.Class.define(b,{extend:qx.event.type.Event,members:{__he:null,__hf:null,init:function(d,e){qx.event.type.Event.prototype.init.call(this,false,false);this.__he=d;this.__hf=e;return this;}
,clone:function(f){var g=qx.event.type.Event.prototype.clone.call(this,f);g.__he=this.__he;g.__hf=this.__hf;return g;}
,getOrientation:function(){return this.__he;}
,isLandscape:function(){return this.__hf==a;}
,isPortrait:function(){return this.__hf==c;}
}});}
)();
(function(){var a="os.name",b="qx.mobile.nativescroll",c="osx",d="qx.nativeScrollBars",e="os.scrollBarOverlayed",f="browser.version",g="ios",h="qx.bom.client.Scroll";qx.Bootstrap.define(h,{statics:{scrollBarOverlayed:function(){var i=qx.bom.element.Scroll.getScrollbarWidth();var k=qx.bom.client.OperatingSystem.getName()===c;var j=qx.core.Environment.get(d);return i==0&&k&&j;}
,getNativeScroll:function(){return qx.core.Environment.get(a)==g&&parseInt(qx.core.Environment.get(f))>4;}
},defer:function(l){qx.core.Environment.add(e,l.scrollBarOverlayed);qx.core.Environment.add(b,l.getNativeScroll);}
});}
)();
(function(){var a="borderBottomWidth",b="visible",d="engine.name",e="borderTopWidth",f="top",g="borderLeftStyle",h="none",i="overflow",j="right",k="bottom",l="borderLeftWidth",m="100px",n="-moz-scrollbars-vertical",o="borderRightStyle",p="hidden",q="div",r="left",u="qx.bom.element.Scroll",v="borderRightWidth",w="scroll",x="overflowY";qx.Class.define(u,{statics:{__hg:null,getScrollbarWidth:function(){if(this.__hg!==null){return this.__hg;}
;var y=qx.bom.element.Style;var A=function(E,F){return parseInt(y.get(E,F),10)||0;}
;var B=function(G){return (y.get(G,o)==h?0:A(G,v));}
;var C=function(H){return (y.get(H,g)==h?0:A(H,l));}
;var D=qx.core.Environment.select(d,{"mshtml":function(I){if(y.get(I,x)==p||I.clientWidth==0){return B(I);}
;return Math.max(0,I.offsetWidth-I.clientLeft-I.clientWidth);}
,"default":function(J){if(J.clientWidth==0){var L=y.get(J,i);var K=(L==w||L==n?16:0);return Math.max(0,B(J)+K);}
;return Math.max(0,(J.offsetWidth-J.clientWidth-C(J)));}
});var z=function(M){return D(M)-B(M);}
;var t=document.createElement(q);var s=t.style;s.height=s.width=m;s.overflow=w;document.body.appendChild(t);var c=z(t);this.__hg=c;document.body.removeChild(t);return this.__hg;}
,intoViewX:function(bi,stop,bh){var parent=bi.parentNode;var bg=qx.dom.Node.getDocument(bi);var Y=bg.body;var be,Q,V;var R,P,S;var bb,T,O;var X,bc,bd,ba;var bf,U,bj;var N=bh===r;var W=bh===j;stop=stop?stop.parentNode:bg;while(parent&&parent!=stop){if(parent.scrollWidth>parent.clientWidth&&(parent===Y||qx.bom.element.Style.get(parent,x)!=b)){if(parent===Y){Q=parent.scrollLeft;V=Q+qx.bom.Viewport.getWidth();R=qx.bom.Viewport.getWidth();P=parent.clientWidth;S=parent.scrollWidth;bb=0;T=0;O=0;}
else {be=qx.bom.element.Location.get(parent);Q=be.left;V=be.right;R=parent.offsetWidth;P=parent.clientWidth;S=parent.scrollWidth;bb=parseInt(qx.bom.element.Style.get(parent,l),10)||0;T=parseInt(qx.bom.element.Style.get(parent,v),10)||0;O=R-P-bb-T;}
;X=qx.bom.element.Location.get(bi);bc=X.left;bd=X.right;ba=bi.offsetWidth;bf=bc-Q-bb;U=bd-V+T;bj=0;if(N){bj=bf;}
else if(W){bj=U+O;}
else if(bf<0||ba>P){bj=bf;}
else if(U>0){bj=U+O;}
;parent.scrollLeft+=bj;qx.event.Registration.fireNonBubblingEvent(parent,w);}
;if(parent===Y){break;}
;parent=parent.parentNode;}
;}
,intoViewY:function(bD,stop,bC){var parent=bD.parentNode;var bB=qx.dom.Node.getDocument(bD);var bk=bB.body;var by,bt,bw;var bE,bx,bu;var bp,bl,bA;var br,bs,bq,bm;var bn,bv,bz;var bo=bC===f;var bF=bC===k;stop=stop?stop.parentNode:bB;while(parent&&parent!=stop){if(parent.scrollHeight>parent.clientHeight&&(parent===bk||qx.bom.element.Style.get(parent,x)!=b)){if(parent===bk){bt=parent.scrollTop;bw=bt+qx.bom.Viewport.getHeight();bE=qx.bom.Viewport.getHeight();bx=parent.clientHeight;bu=parent.scrollHeight;bp=0;bl=0;bA=0;}
else {by=qx.bom.element.Location.get(parent);bt=by.top;bw=by.bottom;bE=parent.offsetHeight;bx=parent.clientHeight;bu=parent.scrollHeight;bp=parseInt(qx.bom.element.Style.get(parent,e),10)||0;bl=parseInt(qx.bom.element.Style.get(parent,a),10)||0;bA=bE-bx-bp-bl;}
;br=qx.bom.element.Location.get(bD);bs=br.top;bq=br.bottom;bm=bD.offsetHeight;bn=bs-bt-bp;bv=bq-bw+bl;bz=0;if(bo){bz=bn;}
else if(bF){bz=bv+bA;}
else if(bn<0||bm>bx){bz=bn;}
else if(bv>0){bz=bv+bA;}
;parent.scrollTop+=bz;qx.event.Registration.fireNonBubblingEvent(parent,w);}
;if(parent===bk){break;}
;parent=parent.parentNode;}
;}
,intoView:function(bI,stop,bH,bG){this.intoViewX(bI,stop,bH);this.intoViewY(bI,stop,bG);}
}});}
)();
(function(){var a="mshtml",b="onhashchange",c="event.help",d="event.mspointer",e="event.touch",f="msPointerEnabled",g="event.hashchange",h="onhelp",i="documentMode",j="qx.bom.client.Event",k="ontouchstart";qx.Bootstrap.define(j,{statics:{getTouch:function(){return (k in window);}
,getMsPointer:function(){if(f in window.navigator){return window.navigator.msPointerEnabled;}
;return false;}
,getHelp:function(){return (h in document);}
,getHashChange:function(){var l=qx.bom.client.Engine.getName();var m=b in window;return (l!==a&&m)||(l===a&&i in document&&document.documentMode>=8&&m);}
},defer:function(n){qx.core.Environment.add(e,n.getTouch);qx.core.Environment.add(d,n.getMsPointer);qx.core.Environment.add(c,n.getHelp);qx.core.Environment.add(g,n.getHashChange);}
});}
)();
(function(){var a="touchmove",b="engine.name",c="mouseup",d="qx.event.handler.Touch",f="useraction",g="touchend",h="mshtml",i="event.mspointer",j="qx.mobile.nativescroll",k="dispose",l="qx.mobile.emulatetouch",m="event.touch",n="touchstart",o="mousedown",p="mousemove";qx.Class.define(d,{extend:qx.event.handler.TouchCore,implement:qx.event.IEventHandler,construct:function(q){this.__er=q;this.__cx=q.getWindow();this.__a=this.__cx.document;qx.event.handler.TouchCore.apply(this,[this.__a]);if(!qx.core.Environment.get(i)){this._initMouseObserver();}
;}
,statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,SUPPORTED_TYPES:{touchstart:1,touchmove:1,touchend:1,touchcancel:1,tap:1,longtap:1,swipe:1},TARGET_CHECK:qx.event.IEventHandler.TARGET_DOMNODE+qx.event.IEventHandler.TARGET_DOCUMENT,IGNORE_CAN_HANDLE:true,MOUSE_TO_TOUCH_MAPPING:{"mousedown":n,"mousemove":a,"mouseup":g}},members:{__hh:null,__er:null,__cx:null,__a:null,__hi:false,canHandleEvent:function(s,r){}
,registerEvent:function(v,u,t){}
,unregisterEvent:function(y,x,w){}
,_fireEvent:function(A,z,B,C){if(!B){B=this._getTarget(A);}
;var z=z||A.type;if(B&&B.nodeType){qx.event.Registration.fireEvent(B,z,C||qx.event.type.Touch,[A,B,null,true,true]);}
;qx.event.Registration.fireEvent(this.__cx,f,qx.event.type.Data,[z]);}
,__hj:qx.core.Environment.select(l,{"true":function(E){var D=E.type;var F=qx.event.handler.Touch.MOUSE_TO_TOUCH_MAPPING;if(F[D]){D=F[D];if(D==n&&this.__hk(E)){this.__hi=true;}
else if(D==g){this.__hi=false;}
;var H=this.__hl(E);var G=(D==g?[]:[H]);E.touches=G;E.targetTouches=G;E.changedTouches=[H];}
;return D;}
,"default":(function(){}
)}),__hk:qx.core.Environment.select(l,{"true":function(J){if((qx.core.Environment.get(b)==h)){var I=1;}
else {var I=0;}
;return J.button==I;}
,"default":(function(){}
)}),__hl:qx.core.Environment.select(l,{"true":function(K){var L=this._getTarget(K);return {clientX:K.clientX,clientY:K.clientY,screenX:K.screenX,screenY:K.screenY,pageX:K.pageX,pageY:K.pageY,identifier:1,target:L};}
,"default":(function(){}
)}),_initMouseObserver:qx.core.Environment.select(l,{"true":function(){if(!qx.core.Environment.get(m)){this.__hh=qx.lang.Function.listener(this._onMouseEvent,this);var Event=qx.bom.Event;Event.addNativeListener(this.__a,o,this.__hh);Event.addNativeListener(this.__a,p,this.__hh);Event.addNativeListener(this.__a,c,this.__hh);}
;}
,"default":(function(){}
)}),_stopMouseObserver:qx.core.Environment.select(l,{"true":function(){if(!qx.core.Environment.get(m)){var Event=qx.bom.Event;Event.removeNativeListener(this.__a,o,this.__hh);Event.removeNativeListener(this.__a,p,this.__hh);Event.removeNativeListener(this.__a,c,this.__hh);}
;}
,"default":(function(){}
)}),_onTouchEvent:qx.event.GlobalError.observeMethod(function(M){this._commonTouchEventHandler(M);}
),_onMouseEvent:qx.core.Environment.select(l,{"true":qx.event.GlobalError.observeMethod(function(O){if(!qx.core.Environment.get(m)){if(O.type==p&&!this.__hi){return;}
;var N=this.__hj(O);this._commonTouchEventHandler(O,N);}
;}
),"default":(function(){}
)}),dispose:function(){this.__hm(k);this._stopMouseObserver();this.__er=this.__cx=this.__a=null;}
,__hm:function(Q,P){qx.event.handler.TouchCore.prototype[Q].apply(this,P||[]);}
},defer:function(R){qx.event.Registration.addHandler(R);if(qx.core.Environment.get(m)){if(qx.core.Environment.get(j)==false){document.addEventListener(a,function(e){e.preventDefault();}
);}
;qx.event.Registration.getManager(document).getHandler(R);}
;}
});}
)();
(function(){var a="ipod",b="pc",c="ps3",d=")",e="iPhone",f="psp",g="wii",h="xbox",i="\.",j="ipad",k="ds",l="(",m="mobile",n="device.type",o="tablet",p="ontouchstart",q="g",r="|",s="qx.bom.client.Device",t="desktop",u="device.name",v="device.touch",w="undefined",x="device.pixelRatio";qx.Bootstrap.define(s,{statics:{__cU:{"iPod":a,"iPad":j,"iPhone":e,"PSP":f,"PLAYSTATION 3":c,"Nintendo Wii":g,"Nintendo DS":k,"XBOX":h,"Xbox":h},getName:function(){var A=[];for(var z in this.__cU){A.push(z);}
;var B=new RegExp(l+A.join(r).replace(/\./g,i)+d,q);var y=B.exec(navigator.userAgent);if(y&&y[1]){return qx.bom.client.Device.__cU[y[1]];}
;return b;}
,getType:function(){return qx.bom.client.Device.detectDeviceType(navigator.userAgent);}
,detectDeviceType:function(C){if(qx.bom.client.Device.detectTabletDevice(C)){return o;}
else if(qx.bom.client.Device.detectMobileDevice(C)){return m;}
;return t;}
,detectMobileDevice:function(D){return /android.+mobile|ip(hone|od)|bada\/|blackberry|BB10|maemo|opera m(ob|in)i|fennec|NetFront|phone|psp|symbian|IEMobile|windows (ce|phone)|xda/i.test(D);}
,detectTabletDevice:function(F){var G=(/MSIE 10/i.test(F))&&(/ARM/i.test(F))&&!(/windows phone/i.test(F));var E=(!(/Fennec|HTC.Magic|Nexus|android.+mobile|Tablet PC/i.test(F))&&(/Android|ipad|tablet|playbook|silk|kindle|psp/i.test(F)));return G||E;}
,getDevicePixelRatio:function(){if(typeof window.devicePixelRatio!==w){return window.devicePixelRatio;}
;return 1;}
,getTouch:function(){return (p in window)||window.navigator.msMaxTouchPoints>1;}
},defer:function(H){qx.core.Environment.add(u,H.getName);qx.core.Environment.add(v,H.getTouch);qx.core.Environment.add(n,H.getType);qx.core.Environment.add(x,H.getDevicePixelRatio);}
});}
)();
(function(){var a="touchmove",b="os.name",c="mouseup",d="mousedown",f="touchend",g="win",h="none",i="qx.event.handler.MouseEmulation",j="event.mspointer",k="qx.emulatemouse",l="longtap",m="click",n="event.touch",o="touchstart",p="contextmenu",q="tap",r="device.touch",s="mousewheel",t="mousemove";qx.Class.define(i,{extend:qx.core.Object,implement:qx.event.IEventHandler,construct:function(u){qx.core.Object.call(this);this.__er=u;this.__cx=u.getWindow();this.__a=this.__cx.document;if(qx.event.handler.MouseEmulation.ON){this._initObserver();document.documentElement.style.msTouchAction=h;}
;}
,statics:{PRIORITY:qx.event.Registration.PRIORITY_FIRST,SUPPORTED_TYPES:{mousedown:1,mouseup:1,mousemove:1,click:1,contextmenu:1},TARGET_CHECK:qx.event.IEventHandler.TARGET_DOMNODE+qx.event.IEventHandler.TARGET_DOCUMENT+qx.event.IEventHandler.TARGET_WINDOW,IGNORE_CAN_HANDLE:true,ON:qx.core.Environment.get(k)&&((qx.core.Environment.get(j)&&qx.core.Environment.get(r))||(qx.core.Environment.get(n)&&qx.core.Environment.get(b)!==g))},members:{__er:null,__cx:null,__a:null,__hn:null,__ho:null,__hp:null,__hq:null,canHandleEvent:function(w,v){}
,registerEvent:function(z,y,x){}
,unregisterEvent:function(C,B,A){}
,__go:function(D,E,F){var G=E==s?new qx.event.type.MouseWheel():new qx.event.type.Mouse();G.init(D,F,null,true,true);G.setType(E);return qx.event.Registration.getManager(F).dispatchEvent(F,G);}
,__hr:function(H,I,J,K){var L=this.__hA(K,J);L.wheelDelta=H;L.wheelDeltaY=I;L.wheelDeltaX=H;this.__go(L,s,K);}
,__hs:function(N,O,Q,M,R){this.__hp=null;this.__hq=null;if(N==0&&O==0){return;}
;var S=parseInt((R||20)/10);if(N>0){N=Math.max(0,N-S);}
else {N=Math.min(0,N+S);}
;if(O>0){O=Math.max(0,O-S);}
else {O=Math.min(0,O+S);}
;var P=+(new Date());this.__hq=qx.bom.AnimationFrame.request(qx.lang.Function.bind(function(T,U,X,W,V){this.__hs(T,U,X,W,V-P);}
,this,N,O,Q,M));this.__hr(N,O,Q,M);}
,__ht:function(Y){var bb={x:Y.screenX,y:Y.screenY};var ba=false;var bc=20;if(Math.abs(bb.x-this.__hn.x)>bc){ba=true;}
;if(Math.abs(bb.y-this.__hn.y)>bc){ba=true;}
;return ba;}
,_initObserver:function(){qx.event.Registration.addListener(this.__a,o,this.__hv,this);qx.event.Registration.addListener(this.__a,a,this.__hw,this);qx.event.Registration.addListener(this.__a,f,this.__hx,this);qx.event.Registration.addListener(this.__a,q,this.__hy,this);qx.event.Registration.addListener(this.__a,l,this.__hz,this);qx.bom.Event.addNativeListener(this.__cx,o,this.__hu);}
,_stopObserver:function(){qx.event.Registration.removeListener(this.__a,o,this.__hv,this);qx.event.Registration.removeListener(this.__a,a,this.__hw,this);qx.event.Registration.removeListener(this.__a,f,this.__hx,this);qx.event.Registration.removeListener(this.__a,q,this.__hy,this);qx.event.Registration.removeListener(this.__a,l,this.__hz,this);qx.bom.Event.removeNativeListener(this.__cx,o,this.__hu);}
,__hu:function(e){e.preventDefault();}
,__hv:function(e){var be=e.getTarget();var bd=this.__hA(be,e.getAllTouches()[0]);if(qx.core.Environment.get(n)){if(!this.__go(bd,d,be)){e.preventDefault();}
;}
;this.__ho={x:bd.screenX,y:bd.screenY};this.__hn={x:bd.screenX,y:bd.screenY};if(this.__hq&&window.cancelAnimationFrame){window.cancelAnimationFrame(this.__hq);this.__hq=null;}
;}
,__hw:function(e){var bf=e.getTarget();var bi=this.__hA(bf,e.getChangedTargetTouches()[0]);if(qx.core.Environment.get(n)){if(!this.__go(bi,t,bf)){e.preventDefault();}
;}
;var bh=-parseInt(this.__ho.y-bi.screenY);var bg=-parseInt(this.__ho.x-bi.screenX);this.__ho={x:bi.screenX,y:bi.screenY};if(e.getNativeEvent().pointerType!=4){var bj=e.getChangedTargetTouches()[0];this.__hr(bg,bh,bj,bf);if(this.__hp){clearTimeout(this.__hp);this.__hp=null;}
;this.__hp=setTimeout(qx.lang.Function.bind(function(bk,bl,bm,bn){this.__hs(bk,bl,bm,bn);}
,this,bg,bh,bj,bf),100);}
;}
,__hx:function(e){var bp=e.getTarget();var bo=this.__hA(bp,e.getChangedTargetTouches()[0]);if(qx.core.Environment.get(n)){if(!this.__go(bo,c,bp)){e.preventDefault();}
;}
;}
,__hy:function(e){var br=e.getTarget();var bq=this.__hA(br,e.getChangedTargetTouches()[0]);if(!this.__ht(bq)){this.__go(bq,m,br);}
;}
,__hz:function(e){var bt=e.getTarget();var bs=this.__hA(bt,e.getChangedTargetTouches()[0]);this.__go(bs,p,bt);}
,__hA:function(bv,bw){var bu={};bu.button=0;bu.wheelDelta=0;bu.wheelDeltaX=0;bu.wheelDeltaY=0;bu.wheelX=0;bu.wheelY=0;bu.target=bv;bu.clientX=bw.clientX;bu.clientY=bw.clientY;bu.pageX=bw.pageX;bu.pageY=bw.pageY;bu.screenX=bw.screenX;bu.screenY=bw.screenY;bu.shiftKey=false;bu.ctrlKey=false;bu.altKey=false;bu.metaKey=false;return bu;}
},destruct:function(){if(qx.event.handler.MouseEmulation.ON){this._stopObserver();}
;this.__er=this.__cx=this.__a=null;}
,defer:function(bx){if(bx.ON){qx.event.Registration.addHandler(bx);}
;}
});}
)();
(function(){var a="click",b="middle",c="none",d="contextmenu",e="qx.event.type.Mouse",f="browser.documentmode",g="left",h="right",i="browser.name",j="ie";qx.Class.define(e,{extend:qx.event.type.Dom,members:{_cloneNativeEvent:function(k,l){var l=qx.event.type.Dom.prototype._cloneNativeEvent.call(this,k,l);l.button=k.button;l.clientX=k.clientX;l.clientY=k.clientY;l.pageX=k.pageX;l.pageY=k.pageY;l.screenX=k.screenX;l.screenY=k.screenY;l.wheelDelta=k.wheelDelta;l.wheelDeltaX=k.wheelDeltaX;l.wheelDeltaY=k.wheelDeltaY;l.detail=k.detail;l.axis=k.axis;l.wheelX=k.wheelX;l.wheelY=k.wheelY;l.HORIZONTAL_AXIS=k.HORIZONTAL_AXIS;l.srcElement=k.srcElement;l.target=k.target;return l;}
,__hB:{'0':g,'2':h,'1':b},__hC:{'1':g,'2':h,'4':b},stop:function(){this.stopPropagation();}
,getButton:function(){switch(this._type){case d:return h;case a:if(qx.core.Environment.get(i)===j&&qx.core.Environment.get(f)<9){return g;}
;default:if(this._native.target!==undefined){return this.__hB[this._native.button]||c;}
else {return this.__hC[this._native.button]||c;}
;};}
,isLeftPressed:function(){return this.getButton()===g;}
,isMiddlePressed:function(){return this.getButton()===b;}
,isRightPressed:function(){return this.getButton()===h;}
,getRelatedTarget:function(){return this._relatedTarget;}
,getViewportLeft:function(){return this._native.clientX;}
,getViewportTop:function(){return this._native.clientY;}
,getDocumentLeft:function(){if(this._native.pageX!==undefined){return this._native.pageX;}
else {var m=qx.dom.Node.getWindow(this._native.srcElement);return this._native.clientX+qx.bom.Viewport.getScrollLeft(m);}
;}
,getDocumentTop:function(){if(this._native.pageY!==undefined){return this._native.pageY;}
else {var n=qx.dom.Node.getWindow(this._native.srcElement);return this._native.clientY+qx.bom.Viewport.getScrollTop(n);}
;}
,getScreenLeft:function(){return this._native.screenX;}
,getScreenTop:function(){return this._native.screenY;}
}});}
)();
(function(){var a="engine.name",b="x",c="osx",d="win",f="os.name",g="qx.dynamicmousewheel",h="engine.version",i="chrome",j="qx.event.type.MouseWheel",k="browser.name",l="y";qx.Class.define(j,{extend:qx.event.type.Mouse,statics:{MAXSCROLL:null,MINSCROLL:null,FACTOR:1},members:{stop:function(){this.stopPropagation();this.preventDefault();}
,__hD:function(p){var m=Math.abs(p);if(qx.event.type.MouseWheel.MINSCROLL==null||qx.event.type.MouseWheel.MINSCROLL>m){qx.event.type.MouseWheel.MINSCROLL=m;this.__hE();}
;if(qx.event.type.MouseWheel.MAXSCROLL==null||qx.event.type.MouseWheel.MAXSCROLL<m){qx.event.type.MouseWheel.MAXSCROLL=m;this.__hE();}
;if(qx.event.type.MouseWheel.MAXSCROLL===m&&qx.event.type.MouseWheel.MINSCROLL===m){return 2*(p/m);}
;var n=qx.event.type.MouseWheel.MAXSCROLL-qx.event.type.MouseWheel.MINSCROLL;var o=(p/n)*Math.log(n)*qx.event.type.MouseWheel.FACTOR;return o<0?Math.min(o,-1):Math.max(o,1);}
,__hE:function(){var q=qx.event.type.MouseWheel.MAXSCROLL||0;var t=qx.event.type.MouseWheel.MINSCROLL||q;if(q<=t){return;}
;var r=q-t;var s=(q/r)*Math.log(r);if(s==0){s=1;}
;qx.event.type.MouseWheel.FACTOR=6/s;}
,getWheelDelta:function(u){var e=this._native;if(u===undefined){if(v===undefined){var v=-e.wheelDelta;if(e.wheelDelta===undefined){v=e.detail;}
;}
;return this.__hF(v);}
;if(u===b){var x=0;if(e.wheelDelta!==undefined){if(e.wheelDeltaX!==undefined){x=e.wheelDeltaX?this.__hF(-e.wheelDeltaX):0;}
;}
else {if(e.axis&&e.axis==e.HORIZONTAL_AXIS){x=this.__hF(e.detail);}
;}
;return x;}
;if(u===l){var y=0;if(e.wheelDelta!==undefined){if(e.wheelDeltaY!==undefined){y=e.wheelDeltaY?this.__hF(-e.wheelDeltaY):0;}
else {y=this.__hF(-e.wheelDelta);}
;}
else {if(!(e.axis&&e.axis==e.HORIZONTAL_AXIS)){y=this.__hF(e.detail);}
;}
;return y;}
;return 0;}
,__hF:function(z){if(qx.event.handler.MouseEmulation.ON){return z;}
else if(qx.core.Environment.get(g)){return this.__hD(z);}
else {var w=qx.core.Environment.select(a,{"default":function(){return z/40;}
,"gecko":function(){return z;}
,"webkit":function(){if(qx.core.Environment.get(k)==i){if(qx.core.Environment.get(f)==c){return z/60;}
else {return z/120;}
;}
else {if(qx.core.Environment.get(f)==d){var A=120;if(parseFloat(qx.core.Environment.get(h))==533.16){A=1200;}
;}
else {A=40;if(parseFloat(qx.core.Environment.get(h))==533.16||parseFloat(qx.core.Environment.get(h))==533.17||parseFloat(qx.core.Environment.get(h))==533.18){A=1200;}
;}
;return z/A;}
;}
});return w.call(this);}
;}
}});}
)();
(function(){var a="abstract",b="Missing implementation",c="qx.event.dispatch.AbstractBubbling";qx.Class.define(c,{extend:qx.core.Object,implement:qx.event.IEventDispatcher,type:a,construct:function(d){this._manager=d;}
,members:{_getParent:function(e){throw new Error(b);}
,canDispatchEvent:function(g,event,f){return event.getBubbles();}
,dispatchEvent:function(l,event,w){var parent=l;var s=this._manager;var o,x;var n;var v,u;var y;var q=[];o=s.getListeners(l,w,true);x=s.getListeners(l,w,false);if(o){q.push(o);}
;if(x){q.push(x);}
;var parent=this._getParent(l);var k=[];var h=[];var m=[];var p=[];while(parent!=null){o=s.getListeners(parent,w,true);if(o){m.push(o);p.push(parent);}
;x=s.getListeners(parent,w,false);if(x){k.push(x);h.push(parent);}
;parent=this._getParent(parent);}
;event.setEventPhase(qx.event.type.Event.CAPTURING_PHASE);for(var i=m.length-1;i>=0;i-- ){y=p[i];event.setCurrentTarget(y);n=m[i];for(var j=0,r=n.length;j<r;j++ ){v=n[j];u=v.context||y;{}
;v.handler.call(u,event);}
;if(event.getPropagationStopped()){return;}
;}
;event.setEventPhase(qx.event.type.Event.AT_TARGET);event.setCurrentTarget(l);for(var i=0,t=q.length;i<t;i++ ){n=q[i];for(var j=0,r=n.length;j<r;j++ ){v=n[j];u=v.context||l;{}
;v.handler.call(u,event);}
;if(event.getPropagationStopped()){return;}
;}
;event.setEventPhase(qx.event.type.Event.BUBBLING_PHASE);for(var i=0,t=k.length;i<t;i++ ){y=h[i];event.setCurrentTarget(y);n=k[i];for(var j=0,r=n.length;j<r;j++ ){v=n[j];u=v.context||y;{}
;v.handler.call(u,event);}
;if(event.getPropagationStopped()){return;}
;}
;}
}});}
)();
(function(){var a="qx.event.dispatch.DomBubbling";qx.Class.define(a,{extend:qx.event.dispatch.AbstractBubbling,statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL},members:{_getParent:function(b){return b.parentNode;}
,canDispatchEvent:function(d,event,c){return d.nodeType!==undefined&&event.getBubbles();}
},defer:function(e){qx.event.Registration.addDispatcher(e);}
});}
)();
(function(){var a="engine.name",b="qx.bom.Selection",c="character",d="button",e='character',f="#text",g="webkit",h="input",i="gecko",j="EndToEnd",k="opera",l="StartToStart",m="html.selection",n="textarea",o="body";qx.Class.define(b,{statics:{getSelectionObject:qx.core.Environment.select(m,{"selection":function(p){return p.selection;}
,"default":function(q){return qx.dom.Node.getWindow(q).getSelection();}
}),get:qx.core.Environment.select(m,{"selection":function(r){var s=qx.bom.Range.get(qx.dom.Node.getDocument(r));return s.text;}
,"default":function(t){if(this.__hG(t)){return t.value.substring(t.selectionStart,t.selectionEnd);}
else {return this.getSelectionObject(qx.dom.Node.getDocument(t)).toString();}
;}
}),getLength:qx.core.Environment.select(m,{"selection":function(u){var w=this.get(u);var v=qx.util.StringSplit.split(w,/\r\n/);return w.length-(v.length-1);}
,"default":function(x){if(qx.core.Environment.get(a)==k){var B,C,A;if(this.__hG(x)){var z=x.selectionStart;var y=x.selectionEnd;B=x.value.substring(z,y);C=y-z;}
else {B=qx.bom.Selection.get(x);C=B.length;}
;A=qx.util.StringSplit.split(B,/\r\n/);return C-(A.length-1);}
;if(this.__hG(x)){return x.selectionEnd-x.selectionStart;}
else {return this.get(x).length;}
;}
}),getStart:qx.core.Environment.select(m,{"selection":function(D){if(this.__hG(D)){var I=qx.bom.Range.get();if(!D.contains(I.parentElement())){return -1;}
;var J=qx.bom.Range.get(D);var H=D.value.length;J.moveToBookmark(I.getBookmark());J.moveEnd(e,H);return H-J.text.length;}
else {var J=qx.bom.Range.get(D);var F=J.parentElement();var K=qx.bom.Range.get();try{K.moveToElementText(F);}
catch(M){return 0;}
;var E=qx.bom.Range.get(qx.dom.Node.getBodyElement(D));E.setEndPoint(l,J);E.setEndPoint(j,K);if(K.compareEndPoints(l,E)==0){return 0;}
;var G;var L=0;while(true){G=E.moveStart(c,-1);if(K.compareEndPoints(l,E)==0){break;}
;if(G==0){break;}
else {L++ ;}
;}
;return  ++L;}
;}
,"default":function(N){if(qx.core.Environment.get(a)===i||qx.core.Environment.get(a)===g){if(this.__hG(N)){return N.selectionStart;}
else {var P=qx.dom.Node.getDocument(N);var O=this.getSelectionObject(P);if(O.anchorOffset<O.focusOffset){return O.anchorOffset;}
else {return O.focusOffset;}
;}
;}
;if(this.__hG(N)){return N.selectionStart;}
else {return qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(N)).anchorOffset;}
;}
}),getEnd:qx.core.Environment.select(m,{"selection":function(Q){if(this.__hG(Q)){var V=qx.bom.Range.get();if(!Q.contains(V.parentElement())){return -1;}
;var W=qx.bom.Range.get(Q);var U=Q.value.length;W.moveToBookmark(V.getBookmark());W.moveStart(e,-U);return W.text.length;}
else {var W=qx.bom.Range.get(Q);var S=W.parentElement();var X=qx.bom.Range.get();try{X.moveToElementText(S);}
catch(ba){return 0;}
;var U=X.text.length;var R=qx.bom.Range.get(qx.dom.Node.getBodyElement(Q));R.setEndPoint(j,W);R.setEndPoint(l,X);if(X.compareEndPoints(j,R)==0){return U-1;}
;var T;var Y=0;while(true){T=R.moveEnd(c,1);if(X.compareEndPoints(j,R)==0){break;}
;if(T==0){break;}
else {Y++ ;}
;}
;return U-( ++Y);}
;}
,"default":function(bb){if(qx.core.Environment.get(a)===i||qx.core.Environment.get(a)===g){if(this.__hG(bb)){return bb.selectionEnd;}
else {var bd=qx.dom.Node.getDocument(bb);var bc=this.getSelectionObject(bd);if(bc.focusOffset>bc.anchorOffset){return bc.focusOffset;}
else {return bc.anchorOffset;}
;}
;}
;if(this.__hG(bb)){return bb.selectionEnd;}
else {return qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(bb)).focusOffset;}
;}
}),__hG:function(be){return qx.dom.Node.isElement(be)&&(be.nodeName.toLowerCase()==h||be.nodeName.toLowerCase()==n);}
,set:qx.core.Environment.select(m,{"selection":function(bf,bi,bh){var bg;if(qx.dom.Node.isDocument(bf)){bf=bf.body;}
;if(qx.dom.Node.isElement(bf)||qx.dom.Node.isText(bf)){switch(bf.nodeName.toLowerCase()){case h:case n:case d:if(bh===undefined){bh=bf.value.length;}
;if(bi>=0&&bi<=bf.value.length&&bh>=0&&bh<=bf.value.length){bg=qx.bom.Range.get(bf);bg.collapse(true);bg.moveStart(c,bi);bg.moveEnd(c,bh-bi);bg.select();return true;}
;break;case f:if(bh===undefined){bh=bf.nodeValue.length;}
;if(bi>=0&&bi<=bf.nodeValue.length&&bh>=0&&bh<=bf.nodeValue.length){bg=qx.bom.Range.get(qx.dom.Node.getBodyElement(bf));bg.moveToElementText(bf.parentNode);bg.collapse(true);bg.moveStart(c,bi);bg.moveEnd(c,bh-bi);bg.select();return true;}
;break;default:if(bh===undefined){bh=bf.childNodes.length-1;}
;if(bf.childNodes[bi]&&bf.childNodes[bh]){bg=qx.bom.Range.get(qx.dom.Node.getBodyElement(bf));bg.moveToElementText(bf.childNodes[bi]);bg.collapse(true);var bj=qx.bom.Range.get(qx.dom.Node.getBodyElement(bf));bj.moveToElementText(bf.childNodes[bh]);bg.setEndPoint(j,bj);bg.select();return true;}
;};}
;return false;}
,"default":function(bk,bp,bm){var bn=bk.nodeName.toLowerCase();if(qx.dom.Node.isElement(bk)&&(bn==h||bn==n)){if(bm===undefined){bm=bk.value.length;}
;if(bp>=0&&bp<=bk.value.length&&bm>=0&&bm<=bk.value.length){bk.focus();bk.select();bk.setSelectionRange(bp,bm);return true;}
;}
else {var bq=false;var bl=qx.dom.Node.getWindow(bk).getSelection();var bo=qx.bom.Range.get(bk);if(qx.dom.Node.isText(bk)){if(bm===undefined){bm=bk.length;}
;if(bp>=0&&bp<bk.length&&bm>=0&&bm<=bk.length){bq=true;}
;}
else if(qx.dom.Node.isElement(bk)){if(bm===undefined){bm=bk.childNodes.length-1;}
;if(bp>=0&&bk.childNodes[bp]&&bm>=0&&bk.childNodes[bm]){bq=true;}
;}
else if(qx.dom.Node.isDocument(bk)){bk=bk.body;if(bm===undefined){bm=bk.childNodes.length-1;}
;if(bp>=0&&bk.childNodes[bp]&&bm>=0&&bk.childNodes[bm]){bq=true;}
;}
;if(bq){if(!bl.isCollapsed){bl.collapseToStart();}
;bo.setStart(bk,bp);if(qx.dom.Node.isText(bk)){bo.setEnd(bk,bm);}
else {bo.setEndAfter(bk.childNodes[bm]);}
;if(bl.rangeCount>0){bl.removeAllRanges();}
;bl.addRange(bo);return true;}
;}
;return false;}
}),setAll:function(br){return qx.bom.Selection.set(br,0);}
,clear:qx.core.Environment.select(m,{"selection":function(bs){var bt=qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(bs));var bu=qx.bom.Range.get(bs);var parent=bu.parentElement();var bv=qx.bom.Range.get(qx.dom.Node.getDocument(bs));if(parent==bv.parentElement()&&parent==bs){bt.empty();}
;}
,"default":function(bw){var bB=qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(bw));var bx=bw.nodeName.toLowerCase();if(qx.dom.Node.isElement(bw)&&(bx==h||bx==n)){bw.setSelectionRange(0,0);qx.bom.Element.blur(bw);}
else if(qx.dom.Node.isDocument(bw)||bx==o){bB.collapse(bw.body?bw.body:bw,0);}
else {var by=qx.bom.Range.get(bw);if(!by.collapsed){var bz;var bA=by.commonAncestorContainer;if(qx.dom.Node.isElement(bw)&&qx.dom.Node.isText(bA)){bz=bA.parentNode;}
else {bz=bA;}
;if(bz==bw){bB.collapse(bw,0);}
;}
;}
;}
})}});}
)();
(function(){var a="m",b="g",c="^",d="",e="qx.util.StringSplit",f="i",g="$(?!\\s)",h="[object RegExp]",j="y";qx.Class.define(e,{statics:{split:function(k,p,o){if(Object.prototype.toString.call(p)!==h){return String.prototype.split.call(k,p,o);}
;var r=[],l=0,m=(p.ignoreCase?f:d)+(p.multiline?a:d)+(p.sticky?j:d),p=RegExp(p.source,m+b),n,t,q,u,s=/()??/.exec(d)[1]===undefined;k=k+d;if(!s){n=RegExp(c+p.source+g,m);}
;if(o===undefined||+o<0){o=Infinity;}
else {o=Math.floor(+o);if(!o){return [];}
;}
;while(t=p.exec(k)){q=t.index+t[0].length;if(q>l){r.push(k.slice(l,t.index));if(!s&&t.length>1){t[0].replace(n,function(){for(var i=1;i<arguments.length-2;i++ ){if(arguments[i]===undefined){t[i]=undefined;}
;}
;}
);}
;if(t.length>1&&t.index<k.length){Array.prototype.push.apply(r,t.slice(1));}
;u=t[0].length;l=q;if(r.length>=o){break;}
;}
;if(p.lastIndex===t.index){p.lastIndex++ ;}
;}
;if(l===k.length){if(u||!p.test(d)){r.push(d);}
;}
else {r.push(k.slice(l));}
;return r.length>o?r.slice(0,o):r;}
}});}
)();
(function(){var a="qx.bom.Range",b="text",c="password",d="file",e="submit",f="reset",g="textarea",h="input",i="hidden",j="html.selection",k="button",l="body";qx.Class.define(a,{statics:{get:qx.core.Environment.select(j,{"selection":function(m){if(qx.dom.Node.isElement(m)){switch(m.nodeName.toLowerCase()){case h:switch(m.type){case b:case c:case i:case k:case f:case d:case e:return m.createTextRange();break;default:return qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(m)).createRange();};break;case g:case l:case k:return m.createTextRange();break;default:return qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(m)).createRange();};}
else {if(m==null){m=window;}
;return qx.bom.Selection.getSelectionObject(qx.dom.Node.getDocument(m)).createRange();}
;}
,"default":function(n){var o=qx.dom.Node.getDocument(n);var p=qx.bom.Selection.getSelectionObject(o);if(p.rangeCount>0){return p.getRangeAt(0);}
else {return o.createRange();}
;}
})}});}
)();
(function(){var a="offline",b="qx.event.handler.Offline",c="online";qx.Class.define(b,{extend:qx.core.Object,implement:qx.event.IEventHandler,construct:function(d){qx.core.Object.call(this);this.__er=d;this.__cx=d.getWindow();this._initObserver();}
,statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,SUPPORTED_TYPES:{online:true,offline:true},TARGET_CHECK:qx.event.IEventHandler.TARGET_WINDOW,IGNORE_CAN_HANDLE:true},members:{__er:null,__cx:null,__hd:null,canHandleEvent:function(f,e){}
,registerEvent:function(i,h,g){}
,unregisterEvent:function(l,k,j){}
,_initObserver:function(){this.__hd=qx.lang.Function.listener(this._onNative,this);qx.bom.Event.addNativeListener(this.__cx,a,this.__hd);qx.bom.Event.addNativeListener(this.__cx,c,this.__hd);}
,_stopObserver:function(){qx.bom.Event.removeNativeListener(this.__cx,a,this.__hd);qx.bom.Event.removeNativeListener(this.__cx,c,this.__hd);}
,_onNative:qx.event.GlobalError.observeMethod(function(m){qx.event.Registration.fireEvent(this.__cx,m.type,qx.event.type.Event,[]);}
),isOnline:function(){return !!this.__cx.navigator.onLine;}
},destruct:function(){this.__er=null;this._stopObserver();delete qx.event.handler.Appear.__instances[this.$$hash];}
,defer:function(n){qx.event.Registration.addHandler(n);}
});}
)();
(function(){var a="qx.event.handler.Appear",b="disappear",c="appear";qx.Class.define(a,{extend:qx.core.Object,implement:qx.event.IEventHandler,construct:function(d){qx.core.Object.call(this);this.__er=d;this.__hH={};qx.event.handler.Appear.__hI[this.$$hash]=this;}
,statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,SUPPORTED_TYPES:{appear:true,disappear:true},TARGET_CHECK:qx.event.IEventHandler.TARGET_DOMNODE,IGNORE_CAN_HANDLE:true,__hI:{},refresh:function(){var e=this.__hI;for(var f in e){e[f].refresh();}
;}
},members:{__er:null,__hH:null,canHandleEvent:function(h,g){}
,registerEvent:function(l,m,j){var k=qx.core.ObjectRegistry.toHashCode(l)+m;var i=this.__hH;if(i&&!i[k]){i[k]=l;l.$$displayed=l.offsetWidth>0;}
;}
,unregisterEvent:function(q,r,o){var p=qx.core.ObjectRegistry.toHashCode(q)+r;var n=this.__hH;if(!n){return;}
;if(n[p]){delete n[p];}
;}
,refresh:function(){var w=this.__hH;var v;for(var u in w){v=w[u];var s=v.offsetWidth>0;if((!!v.$$displayed)!==s){v.$$displayed=s;var t=qx.event.Registration.createEvent(s?c:b);this.__er.dispatchEvent(v,t);}
;}
;}
},destruct:function(){this.__er=this.__hH=null;delete qx.event.handler.Appear.__hI[this.$$hash];}
,defer:function(x){qx.event.Registration.addHandler(x);}
});}
)();
(function(){var a="os.name",b="mousedown",c="mouseout",d="gecko",e="dblclick",f="useraction",g="mousewheel",h="event.touch",j="mousemove",k="ios",l="mouseover",m="qx.event.handler.Mouse",n="click",o="on",p="engine.version",q="engine.name",r="mouseup",s="contextmenu",t="qx.emulatemouse",u="webkit",v="DOMMouseScroll",w="device.touch",x="event.mspointer";qx.Class.define(m,{extend:qx.core.Object,implement:qx.event.IEventHandler,construct:function(y){qx.core.Object.call(this);this.__er=y;this.__cx=y.getWindow();this.__a=this.__cx.document;if(!(qx.core.Environment.get(h)&&qx.event.handler.MouseEmulation.ON)){this._initButtonObserver();this._initMoveObserver();this._initWheelObserver();}
;if(qx.core.Environment.get(t)){qx.event.handler.MouseEmulation;}
;}
,statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,SUPPORTED_TYPES:{mousemove:1,mouseover:1,mouseout:1,mousedown:1,mouseup:1,click:1,dblclick:1,contextmenu:1,mousewheel:1},TARGET_CHECK:qx.event.IEventHandler.TARGET_DOMNODE+qx.event.IEventHandler.TARGET_DOCUMENT+qx.event.IEventHandler.TARGET_WINDOW,IGNORE_CAN_HANDLE:true},members:{__hJ:null,__hK:null,__hL:null,__hM:null,__hN:null,__er:null,__cx:null,__a:null,__hO:null,canHandleEvent:function(A,z){}
,registerEvent:qx.core.Environment.get(a)===k?function(D,C,B){D[o+C]=(function(){return null;}
);}
:(function(){return null;}
),unregisterEvent:qx.core.Environment.get(a)===k?function(G,F,E){G[o+F]=undefined;}
:(function(){return null;}
),__go:function(H,I,J){if(!J){J=qx.bom.Event.getTarget(H);}
;if(J&&J.nodeType){qx.event.Registration.fireEvent(J,I||H.type,I==g?qx.event.type.MouseWheel:qx.event.type.Mouse,[H,J,null,true,true]);}
;qx.event.Registration.fireEvent(this.__cx,f,qx.event.type.Data,[I||H.type]);}
,__hP:function(){var M=[this.__cx,this.__a,this.__a.body];var L=this.__cx;var K=v;for(var i=0;i<M.length;i++ ){if(qx.bom.Event.supportsEvent(M[i],g)){K=g;L=M[i];break;}
;}
;return {type:K,target:L};}
,preventNextClick:function(){this.__hO=true;}
,_initButtonObserver:function(){this.__hJ=qx.lang.Function.listener(this._onButtonEvent,this);var Event=qx.bom.Event;Event.addNativeListener(this.__a,b,this.__hJ);Event.addNativeListener(this.__a,r,this.__hJ);if(!(qx.event.handler.MouseEmulation.ON&&qx.core.Environment.get(x)&&qx.core.Environment.get(w))){Event.addNativeListener(this.__a,n,this.__hJ);}
;Event.addNativeListener(this.__a,e,this.__hJ);Event.addNativeListener(this.__a,s,this.__hJ);}
,_initMoveObserver:function(){this.__hK=qx.lang.Function.listener(this._onMoveEvent,this);var Event=qx.bom.Event;Event.addNativeListener(this.__a,j,this.__hK);Event.addNativeListener(this.__a,l,this.__hK);Event.addNativeListener(this.__a,c,this.__hK);}
,_initWheelObserver:function(){this.__hL=qx.lang.Function.listener(this._onWheelEvent,this);var N=this.__hP();qx.bom.Event.addNativeListener(N.target,N.type,this.__hL);}
,_stopButtonObserver:function(){var Event=qx.bom.Event;Event.removeNativeListener(this.__a,b,this.__hJ);Event.removeNativeListener(this.__a,r,this.__hJ);if(!(qx.event.handler.MouseEmulation.ON&&qx.core.Environment.get(x)&&qx.core.Environment.get(w))){Event.removeNativeListener(this.__a,n,this.__hJ);}
;Event.removeNativeListener(this.__a,e,this.__hJ);Event.removeNativeListener(this.__a,s,this.__hJ);}
,_stopMoveObserver:function(){var Event=qx.bom.Event;Event.removeNativeListener(this.__a,j,this.__hK);Event.removeNativeListener(this.__a,l,this.__hK);Event.removeNativeListener(this.__a,c,this.__hK);}
,_stopWheelObserver:function(){var O=this.__hP();qx.bom.Event.removeNativeListener(O.target,O.type,this.__hL);}
,_onMoveEvent:qx.event.GlobalError.observeMethod(function(P){this.__go(P);}
),_onButtonEvent:qx.event.GlobalError.observeMethod(function(S){var R=S.type;var T=qx.bom.Event.getTarget(S);if(R==n&&this.__hO){delete this.__hO;return;}
;if(qx.core.Environment.get(q)==d||qx.core.Environment.get(q)==u){if(T&&T.nodeType==3){T=T.parentNode;}
;}
;var Q=qx.event.handler.DragDrop&&this.__er.getHandler(qx.event.handler.DragDrop).isSessionActive();if(Q&&R==n){return;}
;if(this.__hQ){this.__hQ(S,R,T);}
;if(this.__hS){this.__hS(S,R,T);}
;this.__go(S,R,T);if(this.__hR){this.__hR(S,R,T);}
;if(this.__hT&&!Q){this.__hT(S,R,T);}
;this.__hM=R;}
),_onWheelEvent:qx.event.GlobalError.observeMethod(function(U){this.__go(U,g);}
),__hQ:qx.core.Environment.select(q,{"webkit":function(W,V,X){if(parseFloat(qx.core.Environment.get(p))<530){if(V==s){this.__go(W,r,X);}
;}
;}
,"default":null}),__hR:qx.core.Environment.select(q,{"opera":function(Y,ba,bb){if(ba==r&&Y.button==2){this.__go(Y,s,bb);}
;}
,"default":null}),__hS:qx.core.Environment.select(q,{"mshtml":function(bc,bd,be){if(bc.target!==undefined){return;}
;if(bd==r&&this.__hM==n){this.__go(bc,b,be);}
else if(bd==e){this.__go(bc,n,be);}
;}
,"default":null}),__hT:qx.core.Environment.select(q,{"mshtml":null,"default":function(bg,bf,bh){switch(bf){case b:this.__hN=bh;break;case r:if(bh!==this.__hN){var bi=qx.dom.Hierarchy.getCommonParent(bh,this.__hN);if(bi){this.__go(bg,n,bi);}
;}
;};}
})},destruct:function(){if(!(qx.core.Environment.get(h)&&qx.event.handler.MouseEmulation.ON)){this._stopButtonObserver();this._stopMoveObserver();this._stopWheelObserver();}
;this.__er=this.__cx=this.__a=this.__hN=null;}
,defer:function(bj){qx.event.Registration.addHandler(bj);}
});}
)();
(function(){var a="qx.dom.Hierarchy",b="previousSibling",c="html.element.contains",d="html.element.compareDocumentPosition",e="nextSibling",f="parentNode",g="*";qx.Bootstrap.define(a,{statics:{getNodeIndex:function(h){var i=0;while(h&&(h=h.previousSibling)){i++ ;}
;return i;}
,getElementIndex:function(l){var j=0;var k=qx.dom.Node.ELEMENT;while(l&&(l=l.previousSibling)){if(l.nodeType==k){j++ ;}
;}
;return j;}
,getNextElementSibling:function(m){while(m&&(m=m.nextSibling)&&!qx.dom.Node.isElement(m)){continue;}
;return m||null;}
,getPreviousElementSibling:function(n){while(n&&(n=n.previousSibling)&&!qx.dom.Node.isElement(n)){continue;}
;return n||null;}
,contains:function(q,p){if(qx.core.Environment.get(c)){if(qx.dom.Node.isDocument(q)){var o=qx.dom.Node.getDocument(p);return q&&o==q;}
else if(qx.dom.Node.isDocument(p)){return false;}
else {return q.contains(p);}
;}
else if(qx.core.Environment.get(d)){return !!(q.compareDocumentPosition(p)&16);}
else {while(p){if(q==p){return true;}
;p=p.parentNode;}
;return false;}
;}
,isRendered:function(s){var r=s.ownerDocument||s.document;if(qx.core.Environment.get(c)){if(!s.parentNode||!s.offsetParent){return false;}
;return r.body.contains(s);}
else if(qx.core.Environment.get(d)){return !!(r.compareDocumentPosition(s)&16);}
else {while(s){if(s==r.body){return true;}
;s=s.parentNode;}
;return false;}
;}
,isDescendantOf:function(u,t){return this.contains(t,u);}
,getCommonParent:function(w,x){if(w===x){return w;}
;if(qx.core.Environment.get(c)){while(w&&qx.dom.Node.isElement(w)){if(w.contains(x)){return w;}
;w=w.parentNode;}
;return null;}
else {var v=[];while(w||x){if(w){if(qx.lang.Array.contains(v,w)){return w;}
;v.push(w);w=w.parentNode;}
;if(x){if(qx.lang.Array.contains(v,x)){return x;}
;v.push(x);x=x.parentNode;}
;}
;return null;}
;}
,getAncestors:function(y){return this._recursivelyCollect(y,f);}
,getChildElements:function(A){A=A.firstChild;if(!A){return [];}
;var z=this.getNextSiblings(A);if(A.nodeType===1){z.unshift(A);}
;return z;}
,getDescendants:function(B){return qx.lang.Array.fromCollection(B.getElementsByTagName(g));}
,getFirstDescendant:function(C){C=C.firstChild;while(C&&C.nodeType!=1){C=C.nextSibling;}
;return C;}
,getLastDescendant:function(D){D=D.lastChild;while(D&&D.nodeType!=1){D=D.previousSibling;}
;return D;}
,getPreviousSiblings:function(E){return this._recursivelyCollect(E,b);}
,getNextSiblings:function(F){return this._recursivelyCollect(F,e);}
,_recursivelyCollect:function(I,G){var H=[];while(I=I[G]){if(I.nodeType==1){H.push(I);}
;}
;return H;}
,getSiblings:function(J){return this.getPreviousSiblings(J).reverse().concat(this.getNextSiblings(J));}
,isEmpty:function(K){K=K.firstChild;while(K){if(K.nodeType===qx.dom.Node.ELEMENT||K.nodeType===qx.dom.Node.TEXT){return false;}
;K=K.nextSibling;}
;return true;}
,cleanWhitespace:function(N){var L=N.firstChild;while(L){var M=L.nextSibling;if(L.nodeType==3&&!/\S/.test(L.nodeValue)){N.removeChild(L);}
;L=M;}
;}
}});}
)();
(function(){var a="mshtml",b="engine.name",c="keypress",d="useraction",e="win",f="text",g="keyinput",h="os.name",i="webkit",j="input",k="gecko",l="off",m="keydown",n="autoComplete",o="keyup",p="qx.event.handler.Keyboard";qx.Class.define(p,{extend:qx.core.Object,implement:qx.event.IEventHandler,construct:function(q){qx.core.Object.call(this);this.__er=q;this.__cx=q.getWindow();if((qx.core.Environment.get(b)==k)){this.__a=this.__cx;}
else {this.__a=this.__cx.document.documentElement;}
;this.__hU={};this._initKeyObserver();}
,statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,SUPPORTED_TYPES:{keyup:1,keydown:1,keypress:1,keyinput:1},TARGET_CHECK:qx.event.IEventHandler.TARGET_DOMNODE,IGNORE_CAN_HANDLE:true},members:{__hV:null,__er:null,__cx:null,__a:null,__hU:null,__hW:null,__hX:null,__hY:null,canHandleEvent:function(s,r){}
,registerEvent:function(v,u,t){}
,unregisterEvent:function(y,x,w){}
,_fireInputEvent:function(A,z){var B=this.__ia();if(B&&B.offsetWidth!=0){var event=qx.event.Registration.createEvent(g,qx.event.type.KeyInput,[A,B,z]);this.__er.dispatchEvent(B,event);}
;if(this.__cx){qx.event.Registration.fireEvent(this.__cx,d,qx.event.type.Data,[g]);}
;}
,_fireSequenceEvent:function(D,F,C){var E=this.__ia();var G=D.keyCode;var event=qx.event.Registration.createEvent(F,qx.event.type.KeySequence,[D,E,C]);this.__er.dispatchEvent(E,event);if(qx.core.Environment.get(b)==a||qx.core.Environment.get(b)==i){if(F==m&&event.getDefaultPrevented()){if(!qx.event.util.Keyboard.isNonPrintableKeyCode(G)&&!this._emulateKeyPress[G]){this._fireSequenceEvent(D,c,C);}
;}
;}
;if(this.__cx){qx.event.Registration.fireEvent(this.__cx,d,qx.event.type.Data,[F]);}
;}
,__ia:function(){var H=this.__er.getHandler(qx.event.handler.Focus);var I=H.getActive();if(!I||I.offsetWidth==0){I=H.getFocus();}
;if(!I||I.offsetWidth==0){I=this.__er.getWindow().document.body;}
;return I;}
,_initKeyObserver:function(){this.__hV=qx.lang.Function.listener(this.__ib,this);this.__hY=qx.lang.Function.listener(this.__id,this);var Event=qx.bom.Event;Event.addNativeListener(this.__a,o,this.__hV);Event.addNativeListener(this.__a,m,this.__hV);Event.addNativeListener(this.__a,c,this.__hY);}
,_stopKeyObserver:function(){var Event=qx.bom.Event;Event.removeNativeListener(this.__a,o,this.__hV);Event.removeNativeListener(this.__a,m,this.__hV);Event.removeNativeListener(this.__a,c,this.__hY);for(var K in (this.__hX||{})){var J=this.__hX[K];Event.removeNativeListener(J.target,c,J.callback);}
;delete (this.__hX);}
,__ib:qx.event.GlobalError.observeMethod(qx.core.Environment.select(b,{"mshtml":function(N){N=window.event||N;var O=N.keyCode;var M=0;var L=N.type;if(!(this.__hU[O]==m&&L==m)){this._idealKeyHandler(O,M,L,N);}
;if(L==m){if(qx.event.util.Keyboard.isNonPrintableKeyCode(O)||this._emulateKeyPress[O]){this._idealKeyHandler(O,M,c,N);}
;}
;this.__hU[O]=L;}
,"gecko":function(Q){var S=0;var U=Q.keyCode;var T=Q.type;var R=qx.event.util.Keyboard;if(qx.core.Environment.get(h)==e){var P=U?R.keyCodeToIdentifier(U):R.charCodeToIdentifier(S);if(!(this.__hU[P]==m&&T==m)){this._idealKeyHandler(U,S,T,Q);}
;this.__hU[P]=T;}
else {this._idealKeyHandler(U,S,T,Q);}
;this.__ic(Q.target,T,U);}
,"webkit":function(X){var Y=0;var W=0;var V=X.type;Y=X.keyCode;this._idealKeyHandler(Y,W,V,X);if(V==m){if(qx.event.util.Keyboard.isNonPrintableKeyCode(Y)||this._emulateKeyPress[Y]){this._idealKeyHandler(Y,W,c,X);}
;}
;this.__hU[Y]=V;}
,"opera":function(ba){this.__hW=ba.keyCode;this._idealKeyHandler(ba.keyCode,0,ba.type,ba);}
})),__ic:qx.core.Environment.select(b,{"gecko":function(bc,be,bf){if(be===m&&(bf==33||bf==34||bf==38||bf==40)&&bc.type==f&&bc.tagName.toLowerCase()===j&&bc.getAttribute(n)!==l){if(!this.__hX){this.__hX={};}
;var bb=qx.core.ObjectRegistry.toHashCode(bc);if(this.__hX[bb]){return;}
;var self=this;this.__hX[bb]={target:bc,callback:function(bg){qx.bom.Event.stopPropagation(bg);self.__id(bg);}
};var bd=qx.event.GlobalError.observeMethod(this.__hX[bb].callback);qx.bom.Event.addNativeListener(bc,c,bd);}
;}
,"default":null}),__id:qx.event.GlobalError.observeMethod(qx.core.Environment.select(b,{"mshtml":function(bh){bh=window.event||bh;if(this._charCode2KeyCode[bh.keyCode]){this._idealKeyHandler(this._charCode2KeyCode[bh.keyCode],0,bh.type,bh);}
else {this._idealKeyHandler(0,bh.keyCode,bh.type,bh);}
;}
,"gecko":function(bi){var bj=bi.charCode;var bk=bi.type;this._idealKeyHandler(bi.keyCode,bj,bk,bi);}
,"webkit":function(bl){if(this._charCode2KeyCode[bl.keyCode]){this._idealKeyHandler(this._charCode2KeyCode[bl.keyCode],0,bl.type,bl);}
else {this._idealKeyHandler(0,bl.keyCode,bl.type,bl);}
;}
,"opera":function(bm){var bo=bm.keyCode;var bn=bm.type;if(bo!=this.__hW){this._idealKeyHandler(0,this.__hW,bn,bm);}
else {if(qx.event.util.Keyboard.keyCodeToIdentifierMap[bm.keyCode]){this._idealKeyHandler(bm.keyCode,0,bm.type,bm);}
else {this._idealKeyHandler(0,bm.keyCode,bm.type,bm);}
;}
;}
})),_idealKeyHandler:function(bs,bq,bt,br){var bp;if(bs||(!bs&&!bq)){bp=qx.event.util.Keyboard.keyCodeToIdentifier(bs);this._fireSequenceEvent(br,bt,bp);}
else {bp=qx.event.util.Keyboard.charCodeToIdentifier(bq);this._fireSequenceEvent(br,c,bp);this._fireInputEvent(br,bq);}
;}
,_emulateKeyPress:qx.core.Environment.select(b,{"mshtml":{'8':true,'9':true},"webkit":{'8':true,'9':true,'27':true},"default":{}}),_identifierToKeyCode:function(bu){return qx.event.util.Keyboard.identifierToKeyCodeMap[bu]||bu.charCodeAt(0);}
},destruct:function(){this._stopKeyObserver();this.__hW=this.__er=this.__cx=this.__a=this.__hU=null;}
,defer:function(bv,bw){qx.event.Registration.addHandler(bv);if((qx.core.Environment.get(b)==a)||qx.core.Environment.get(b)==i){bw._charCode2KeyCode={'13':13,'27':27};}
;}
});}
)();
(function(){var a="-",b="PageUp",c="Escape",d="Enter",e="+",f="PrintScreen",g="os.name",h="7",i="A",j="Space",k="Left",l="5",m="F5",n="Down",o="Up",p="3",q="Meta",r="F11",s="0",t="F6",u="PageDown",v="osx",w="CapsLock",x="Insert",y="F8",z="Scroll",A="Control",B="Tab",C="Shift",D="End",E="Pause",F="Unidentified",G="/",H="8",I="Z",J="*",K="cmd",L="F1",M="F4",N="Home",O="qx.event.util.Keyboard",P="F2",Q="6",R="F7",S="Apps",T="4",U="F12",V="Alt",W="2",X="NumLock",Y="Delete",bn="1",bo="Win",bp="Backspace",bj="F9",bk="F10",bl="Right",bm="F3",bq="9",br=",";qx.Bootstrap.define(O,{statics:{specialCharCodeMap:{'8':bp,'9':B,'13':d,'27':c,'32':j},numpadToCharCode:{'96':s.charCodeAt(0),'97':bn.charCodeAt(0),'98':W.charCodeAt(0),'99':p.charCodeAt(0),'100':T.charCodeAt(0),'101':l.charCodeAt(0),'102':Q.charCodeAt(0),'103':h.charCodeAt(0),'104':H.charCodeAt(0),'105':bq.charCodeAt(0),'106':J.charCodeAt(0),'107':e.charCodeAt(0),'109':a.charCodeAt(0),'110':br.charCodeAt(0),'111':G.charCodeAt(0)},keyCodeToIdentifierMap:{'16':C,'17':A,'18':V,'20':w,'224':q,'37':k,'38':o,'39':bl,'40':n,'33':b,'34':u,'35':D,'36':N,'45':x,'46':Y,'112':L,'113':P,'114':bm,'115':M,'116':m,'117':t,'118':R,'119':y,'120':bj,'121':bk,'122':r,'123':U,'144':X,'44':f,'145':z,'19':E,'91':qx.core.Environment.get(g)==v?K:bo,'92':bo,'93':qx.core.Environment.get(g)==v?K:S},charCodeA:i.charCodeAt(0),charCodeZ:I.charCodeAt(0),charCode0:s.charCodeAt(0),charCode9:bq.charCodeAt(0),keyCodeToIdentifier:function(bs){if(this.isIdentifiableKeyCode(bs)){var bt=this.numpadToCharCode[bs];if(bt){return String.fromCharCode(bt);}
;return (this.keyCodeToIdentifierMap[bs]||this.specialCharCodeMap[bs]||String.fromCharCode(bs));}
else {return F;}
;}
,charCodeToIdentifier:function(bu){return this.specialCharCodeMap[bu]||String.fromCharCode(bu).toUpperCase();}
,isIdentifiableKeyCode:function(bv){if(bv>=this.charCodeA&&bv<=this.charCodeZ){return true;}
;if(bv>=this.charCode0&&bv<=this.charCode9){return true;}
;if(this.specialCharCodeMap[bv]){return true;}
;if(this.numpadToCharCode[bv]){return true;}
;if(this.isNonPrintableKeyCode(bv)){return true;}
;return false;}
,isNonPrintableKeyCode:function(bw){return this.keyCodeToIdentifierMap[bw]?true:false;}
,isValidKeyIdentifier:function(bx){if(this.identifierToKeyCodeMap[bx]){return true;}
;if(bx.length!=1){return false;}
;if(bx>=s&&bx<=bq){return true;}
;if(bx>=i&&bx<=I){return true;}
;switch(bx){case e:case a:case J:case G:return true;default:return false;};}
,isPrintableKeyIdentifier:function(by){if(by===j){return true;}
else {return this.identifierToKeyCodeMap[by]?false:true;}
;}
},defer:function(bz,bA){if(!bz.identifierToKeyCodeMap){bz.identifierToKeyCodeMap={};for(var bB in bz.keyCodeToIdentifierMap){bz.identifierToKeyCodeMap[bz.keyCodeToIdentifierMap[bB]]=parseInt(bB,10);}
;for(var bB in bz.specialCharCodeMap){bz.identifierToKeyCodeMap[bz.specialCharCodeMap[bB]]=parseInt(bB,10);}
;}
;}
});}
)();
(function(){var a="qx.event.type.KeySequence";qx.Class.define(a,{extend:qx.event.type.Dom,members:{init:function(c,d,b){qx.event.type.Dom.prototype.init.call(this,c,d,null,true,true);this._keyCode=c.keyCode;this._identifier=b;return this;}
,clone:function(e){var f=qx.event.type.Dom.prototype.clone.call(this,e);f._keyCode=this._keyCode;f._identifier=this._identifier;return f;}
,getKeyIdentifier:function(){return this._identifier;}
,getKeyCode:function(){return this._keyCode;}
,isPrintable:function(){return qx.event.util.Keyboard.isPrintableKeyIdentifier(this._identifier);}
}});}
)();
(function(){var a="qx.event.type.KeyInput";qx.Class.define(a,{extend:qx.event.type.Dom,members:{init:function(c,d,b){qx.event.type.Dom.prototype.init.call(this,c,d,null,true,true);this._charCode=b;return this;}
,clone:function(e){var f=qx.event.type.Dom.prototype.clone.call(this,e);f._charCode=this._charCode;return f;}
,getCharCode:function(){return this._charCode;}
,getChar:function(){return String.fromCharCode(this._charCode);}
}});}
)();
(function(){var a="text",b="blur",c="engine.version",d="keydown",f="radio",g="textarea",h="password",j="propertychange",k="select-multiple",m="change",n="input",p="value",q="select",r="browser.documentmode",s="browser.version",t="opera",u="keyup",v="mshtml",w="engine.name",x="keypress",y="checkbox",z="qx.event.handler.Input",A="checked";qx.Class.define(z,{extend:qx.core.Object,implement:qx.event.IEventHandler,construct:function(){qx.core.Object.call(this);this._onChangeCheckedWrapper=qx.lang.Function.listener(this._onChangeChecked,this);this._onChangeValueWrapper=qx.lang.Function.listener(this._onChangeValue,this);this._onInputWrapper=qx.lang.Function.listener(this._onInput,this);this._onPropertyWrapper=qx.lang.Function.listener(this._onProperty,this);if((qx.core.Environment.get(w)==t)){this._onKeyDownWrapper=qx.lang.Function.listener(this._onKeyDown,this);this._onKeyUpWrapper=qx.lang.Function.listener(this._onKeyUp,this);this._onBlurWrapper=qx.lang.Function.listener(this._onBlur,this);}
;}
,statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,SUPPORTED_TYPES:{input:1,change:1},TARGET_CHECK:qx.event.IEventHandler.TARGET_DOMNODE,IGNORE_CAN_HANDLE:false},members:{__ie:false,__if:null,__ig:null,__ih:null,canHandleEvent:function(D,C){var B=D.tagName.toLowerCase();if(C===n&&(B===n||B===g)){return true;}
;if(C===m&&(B===n||B===g||B===q)){return true;}
;return false;}
,registerEvent:function(I,H,F){if(qx.core.Environment.get(w)==v&&(qx.core.Environment.get(c)<9||(qx.core.Environment.get(c)>=9&&qx.core.Environment.get(r)<9))){if(!I.__ii){var G=I.tagName.toLowerCase();var E=I.type;if(E===a||E===h||G===g||E===y||E===f){qx.bom.Event.addNativeListener(I,j,this._onPropertyWrapper);}
;if(E!==y&&E!==f){qx.bom.Event.addNativeListener(I,m,this._onChangeValueWrapper);}
;if(E===a||E===h){this._onKeyPressWrapped=qx.lang.Function.listener(this._onKeyPress,this,I);qx.bom.Event.addNativeListener(I,x,this._onKeyPressWrapped);}
;I.__ii=true;}
;}
else {if(H===n){this.__ij(I);}
else if(H===m){if(I.type===f||I.type===y){qx.bom.Event.addNativeListener(I,m,this._onChangeCheckedWrapper);}
else {qx.bom.Event.addNativeListener(I,m,this._onChangeValueWrapper);}
;if((qx.core.Environment.get(w)==t)||(qx.core.Environment.get(w)==v)){if(I.type===a||I.type===h){this._onKeyPressWrapped=qx.lang.Function.listener(this._onKeyPress,this,I);qx.bom.Event.addNativeListener(I,x,this._onKeyPressWrapped);}
;}
;}
;}
;}
,__ij:qx.core.Environment.select(w,{"mshtml":function(J){if(qx.core.Environment.get(c)>=9&&qx.core.Environment.get(r)>=9){qx.bom.Event.addNativeListener(J,n,this._onInputWrapper);if(J.type===a||J.type===h||J.type===g){this._inputFixWrapper=qx.lang.Function.listener(this._inputFix,this,J);qx.bom.Event.addNativeListener(J,u,this._inputFixWrapper);}
;}
;}
,"webkit":function(L){var K=L.tagName.toLowerCase();if(parseFloat(qx.core.Environment.get(c))<532&&K==g){qx.bom.Event.addNativeListener(L,x,this._onInputWrapper);}
;qx.bom.Event.addNativeListener(L,n,this._onInputWrapper);}
,"opera":function(M){qx.bom.Event.addNativeListener(M,u,this._onKeyUpWrapper);qx.bom.Event.addNativeListener(M,d,this._onKeyDownWrapper);qx.bom.Event.addNativeListener(M,b,this._onBlurWrapper);qx.bom.Event.addNativeListener(M,n,this._onInputWrapper);}
,"default":function(N){qx.bom.Event.addNativeListener(N,n,this._onInputWrapper);}
}),unregisterEvent:function(R,Q){if(qx.core.Environment.get(w)==v&&qx.core.Environment.get(c)<9&&qx.core.Environment.get(r)<9){if(R.__ii){var P=R.tagName.toLowerCase();var O=R.type;if(O===a||O===h||P===g||O===y||O===f){qx.bom.Event.removeNativeListener(R,j,this._onPropertyWrapper);}
;if(O!==y&&O!==f){qx.bom.Event.removeNativeListener(R,m,this._onChangeValueWrapper);}
;if(O===a||O===h){qx.bom.Event.removeNativeListener(R,x,this._onKeyPressWrapped);}
;try{delete R.__ii;}
catch(S){R.__ii=null;}
;}
;}
else {if(Q===n){this.__ik(R);}
else if(Q===m){if(R.type===f||R.type===y){qx.bom.Event.removeNativeListener(R,m,this._onChangeCheckedWrapper);}
else {qx.bom.Event.removeNativeListener(R,m,this._onChangeValueWrapper);}
;}
;if((qx.core.Environment.get(w)==t)||(qx.core.Environment.get(w)==v)){if(R.type===a||R.type===h){qx.bom.Event.removeNativeListener(R,x,this._onKeyPressWrapped);}
;}
;}
;}
,__ik:qx.core.Environment.select(w,{"mshtml":function(T){if(qx.core.Environment.get(c)>=9&&qx.core.Environment.get(r)>=9){qx.bom.Event.removeNativeListener(T,n,this._onInputWrapper);if(T.type===a||T.type===h||T.type===g){qx.bom.Event.removeNativeListener(T,u,this._inputFixWrapper);}
;}
;}
,"webkit":function(V){var U=V.tagName.toLowerCase();if(parseFloat(qx.core.Environment.get(c))<532&&U==g){qx.bom.Event.removeNativeListener(V,x,this._onInputWrapper);}
;qx.bom.Event.removeNativeListener(V,n,this._onInputWrapper);}
,"opera":function(W){qx.bom.Event.removeNativeListener(W,u,this._onKeyUpWrapper);qx.bom.Event.removeNativeListener(W,d,this._onKeyDownWrapper);qx.bom.Event.removeNativeListener(W,b,this._onBlurWrapper);qx.bom.Event.removeNativeListener(W,n,this._onInputWrapper);}
,"default":function(X){qx.bom.Event.removeNativeListener(X,n,this._onInputWrapper);}
}),_onKeyPress:qx.core.Environment.select(w,{"mshtml|opera":function(e,Y){if(e.keyCode===13){if(Y.value!==this.__ig){this.__ig=Y.value;qx.event.Registration.fireEvent(Y,m,qx.event.type.Data,[Y.value]);}
;}
;}
,"default":null}),_inputFix:qx.core.Environment.select(w,{"mshtml":function(e,ba){if(e.keyCode===46||e.keyCode===8){if(ba.value!==this.__ih){this.__ih=ba.value;qx.event.Registration.fireEvent(ba,n,qx.event.type.Data,[ba.value]);}
;}
;}
,"default":null}),_onKeyDown:qx.core.Environment.select(w,{"opera":function(e){if(e.keyCode===13){this.__ie=true;}
;}
,"default":null}),_onKeyUp:qx.core.Environment.select(w,{"opera":function(e){if(e.keyCode===13){this.__ie=false;}
;}
,"default":null}),_onBlur:qx.core.Environment.select(w,{"opera":function(e){if(this.__if&&qx.core.Environment.get(s)<10.6){window.clearTimeout(this.__if);}
;}
,"default":null}),_onInput:qx.event.GlobalError.observeMethod(function(e){var bc=qx.bom.Event.getTarget(e);var bb=bc.tagName.toLowerCase();if(!this.__ie||bb!==n){if((qx.core.Environment.get(w)==t)&&qx.core.Environment.get(s)<10.6){this.__if=window.setTimeout(function(){qx.event.Registration.fireEvent(bc,n,qx.event.type.Data,[bc.value]);}
,0);}
else {qx.event.Registration.fireEvent(bc,n,qx.event.type.Data,[bc.value]);}
;}
;}
),_onChangeValue:qx.event.GlobalError.observeMethod(function(e){var bd=qx.bom.Event.getTarget(e);var be=bd.value;if(bd.type===k){var be=[];for(var i=0,o=bd.options,l=o.length;i<l;i++ ){if(o[i].selected){be.push(o[i].value);}
;}
;}
;qx.event.Registration.fireEvent(bd,m,qx.event.type.Data,[be]);}
),_onChangeChecked:qx.event.GlobalError.observeMethod(function(e){var bf=qx.bom.Event.getTarget(e);if(bf.type===f){if(bf.checked){qx.event.Registration.fireEvent(bf,m,qx.event.type.Data,[bf.value]);}
;}
else {qx.event.Registration.fireEvent(bf,m,qx.event.type.Data,[bf.checked]);}
;}
),_onProperty:qx.core.Environment.select(w,{"mshtml":qx.event.GlobalError.observeMethod(function(e){var bg=qx.bom.Event.getTarget(e);var bh=e.propertyName;if(bh===p&&(bg.type===a||bg.type===h||bg.tagName.toLowerCase()===g)){if(!bg.$$inValueSet){qx.event.Registration.fireEvent(bg,n,qx.event.type.Data,[bg.value]);}
;}
else if(bh===A){if(bg.type===y){qx.event.Registration.fireEvent(bg,m,qx.event.type.Data,[bg.checked]);}
else if(bg.checked){qx.event.Registration.fireEvent(bg,m,qx.event.type.Data,[bg.value]);}
;}
;}
),"default":function(){}
})},defer:function(bi){qx.event.Registration.addHandler(bi);}
});}
)();
(function(){var a="-",b="qx.event.handler.Element",c="load",d="iframe";qx.Class.define(b,{extend:qx.core.Object,implement:qx.event.IEventHandler,construct:function(e){qx.core.Object.call(this);this._manager=e;this._registeredEvents={};}
,statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,SUPPORTED_TYPES:{abort:true,load:true,scroll:true,select:true,reset:true,submit:true},CANCELABLE:{selectstart:true},TARGET_CHECK:qx.event.IEventHandler.TARGET_DOMNODE,IGNORE_CAN_HANDLE:false},members:{canHandleEvent:function(g,f){if(f===c){return g.tagName.toLowerCase()!==d;}
else {return true;}
;}
,registerEvent:function(j,l,i){var m=qx.core.ObjectRegistry.toHashCode(j);var h=m+a+l;var k=qx.lang.Function.listener(this._onNative,this,h);qx.bom.Event.addNativeListener(j,l,k);this._registeredEvents[h]={element:j,type:l,listener:k};}
,unregisterEvent:function(p,r,o){var s=this._registeredEvents;if(!s){return;}
;var t=qx.core.ObjectRegistry.toHashCode(p);var n=t+a+r;var q=this._registeredEvents[n];if(q){qx.bom.Event.removeNativeListener(p,r,q.listener);}
;delete this._registeredEvents[n];}
,_onNative:qx.event.GlobalError.observeMethod(function(v,u){var w=this._registeredEvents;if(!w){return;}
;var y=w[u];var x=this.constructor.CANCELABLE[y.type];qx.event.Registration.fireNonBubblingEvent(y.element,y.type,qx.event.type.Native,[v,undefined,undefined,undefined,x]);}
)},destruct:function(){var z;var A=this._registeredEvents;for(var B in A){z=A[B];qx.bom.Event.removeNativeListener(z.element,z.type,z.listener);}
;this._manager=this._registeredEvents=null;}
,defer:function(C){qx.event.Registration.addHandler(C);}
});}
)();
(function(){var a="qx.event.handler.Capture";qx.Class.define(a,{extend:qx.core.Object,implement:qx.event.IEventHandler,statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,SUPPORTED_TYPES:{capture:true,losecapture:true},TARGET_CHECK:qx.event.IEventHandler.TARGET_DOMNODE,IGNORE_CAN_HANDLE:true},members:{canHandleEvent:function(c,b){}
,registerEvent:function(f,e,d){}
,unregisterEvent:function(i,h,g){}
},defer:function(j){qx.event.Registration.addHandler(j);}
});}
)();
(function(){var a="blur",b="mousedown",c="qxDraggable",d="mouseout",f="Escape",g="drag",h="keydown",i="Unsupported data type: ",j="drop",k="qxDroppable",l="qx.event.handler.DragDrop",m="This method must not be used outside the drop event listener!",n="Control",o="Shift",p="!",q="mousemove",r="move",s="droprequest",t="copy",u="dragstart",v="alias",w="mouseover",x="dragchange",y="Alt",z="keyup",A="mouseup",B="keypress",C="dragleave",D="dragend",E="dragover",F="left",G="Please use a droprequest listener to the drag source to fill the manager with data!",H="on";qx.Class.define(l,{extend:qx.core.Object,implement:qx.event.IEventHandler,construct:function(I){qx.core.Object.call(this);this.__er=I;this.__a=I.getWindow().document.documentElement;this.__er.addListener(this.__a,b,this._onMouseDown,this);this.__iv();}
,statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,SUPPORTED_TYPES:{dragstart:1,dragend:1,dragover:1,dragleave:1,drop:1,drag:1,dragchange:1,droprequest:1},IGNORE_CAN_HANDLE:true},members:{__er:null,__a:null,__il:null,__im:null,__in:null,__io:null,__ip:null,__d:null,__iq:null,__ir:null,__is:false,__it:0,__iu:0,canHandleEvent:function(K,J){}
,registerEvent:function(N,M,L){}
,unregisterEvent:function(Q,P,O){}
,addType:function(R){this.__in[R]=true;}
,addAction:function(S){this.__io[S]=true;}
,supportsType:function(T){return !!this.__in[T];}
,supportsAction:function(U){return !!this.__io[U];}
,getData:function(V){if(!this.__iB||!this.__il){throw new Error(m);}
;if(!this.__in[V]){throw new Error(i+V+p);}
;if(!this.__d[V]){this.__iq=V;this.__go(s,this.__im,this.__il,false);}
;if(!this.__d[V]){throw new Error(G);}
;return this.__d[V]||null;}
,getCurrentAction:function(){return this.__ir;}
,addData:function(W,X){this.__d[W]=X;}
,getCurrentType:function(){return this.__iq;}
,isSessionActive:function(){return this.__is;}
,__iv:function(){this.__in={};this.__io={};this.__ip={};this.__d={};}
,__iw:function(){if(this.__im==null){return;}
;var bc=this.__io;var Y=this.__ip;var ba=null;if(this.__iB){if(Y.Shift&&Y.Control&&bc.alias){ba=v;}
else if(Y.Shift&&Y.Alt&&bc.copy){ba=t;}
else if(Y.Shift&&bc.move){ba=r;}
else if(Y.Alt&&bc.alias){ba=v;}
else if(Y.Control&&bc.copy){ba=t;}
else if(bc.move){ba=r;}
else if(bc.copy){ba=t;}
else if(bc.alias){ba=v;}
;}
;var bb=this.__ir;if(ba!=bb){if(this.__il){this.__ir=ba;this.__ix=this.__go(x,this.__il,this.__im,true);if(!this.__ix){ba=null;}
;}
;if(ba!=bb){this.__ir=ba;this.__go(x,this.__im,this.__il,false);}
;}
;}
,__go:function(bi,be,bf,bg,bj){var bh=qx.event.Registration;var bd=bh.createEvent(bi,qx.event.type.Drag,[bg,bj]);if(be!==bf){bd.setRelatedTarget(bf);}
;return bh.dispatchEvent(be,bd);}
,__iy:function(bk){while(bk&&bk.nodeType==1){if(bk.getAttribute(c)==H){return bk;}
;bk=bk.parentNode;}
;return null;}
,__iz:function(bl){while(bl&&bl.nodeType==1){if(bl.getAttribute(k)==H){return bl;}
;bl=bl.parentNode;}
;return null;}
,__iA:function(){this.__im=null;this.__er.removeListener(this.__a,q,this._onMouseMove,this,true);this.__er.removeListener(this.__a,A,this._onMouseUp,this,true);qx.event.Registration.removeListener(window,a,this._onWindowBlur,this);this.__iv();}
,clearSession:function(){if(this.__is){this.__er.removeListener(this.__a,w,this._onMouseOver,this,true);this.__er.removeListener(this.__a,d,this._onMouseOut,this,true);this.__er.removeListener(this.__a,h,this._onKeyDown,this,true);this.__er.removeListener(this.__a,z,this._onKeyUp,this,true);this.__er.removeListener(this.__a,B,this._onKeyPress,this,true);this.__go(D,this.__im,this.__il,false);this.__is=false;}
;this.__iB=false;this.__il=null;this.__iA();}
,__iB:false,__ix:false,_onWindowBlur:function(e){this.clearSession();}
,_onKeyDown:function(e){var bm=e.getKeyIdentifier();switch(bm){case y:case n:case o:if(!this.__ip[bm]){this.__ip[bm]=true;this.__iw();}
;};}
,_onKeyUp:function(e){var bn=e.getKeyIdentifier();switch(bn){case y:case n:case o:if(this.__ip[bn]){this.__ip[bn]=false;this.__iw();}
;};}
,_onKeyPress:function(e){var bo=e.getKeyIdentifier();switch(bo){case f:this.clearSession();};}
,_onMouseDown:function(e){if(this.__is||e.getButton()!==F){return;}
;var bp=this.__iy(e.getTarget());if(bp){this.__it=e.getDocumentLeft();this.__iu=e.getDocumentTop();this.__im=bp;this.__er.addListener(this.__a,q,this._onMouseMove,this,true);this.__er.addListener(this.__a,A,this._onMouseUp,this,true);qx.event.Registration.addListener(window,a,this._onWindowBlur,this);}
;}
,_onMouseUp:function(e){if(this.__iB&&this.__ix){this.__go(j,this.__il,this.__im,false,e);}
;if(this.__is&&e.getTarget()==this.__im){e.stopPropagation();this.__hO();}
;this.clearSession();}
,_onMouseMove:function(e){if(this.__is){if(!this.__go(g,this.__im,this.__il,true,e)){this.clearSession();}
;}
else {if(Math.abs(e.getDocumentLeft()-this.__it)>3||Math.abs(e.getDocumentTop()-this.__iu)>3){if(this.__go(u,this.__im,this.__il,true,e)){this.__is=true;this.__er.addListener(this.__a,w,this._onMouseOver,this,true);this.__er.addListener(this.__a,d,this._onMouseOut,this,true);this.__er.addListener(this.__a,h,this._onKeyDown,this,true);this.__er.addListener(this.__a,z,this._onKeyUp,this,true);this.__er.addListener(this.__a,B,this._onKeyPress,this,true);var bq=this.__ip;bq.Control=e.isCtrlPressed();bq.Shift=e.isShiftPressed();bq.Alt=e.isAltPressed();this.__iw();}
else {this.__go(D,this.__im,this.__il,false);this.__iA();}
;}
;}
;}
,_onMouseOver:function(e){var bt=e.getTarget();var br=qx.ui.core.DragDropCursor.getInstance();var bs=br.getContentElement().getDomElement();if(bt===bs){return;}
;var bu=this.__iz(bt);if(bu&&bu!=this.__il){this.__iB=this.__go(E,bu,this.__im,true,e);this.__il=bu;this.__iw();}
;}
,_onMouseOut:function(e){var bv=qx.ui.core.DragDropCursor.getInstance();var bw=bv.getContentElement().getDomElement();if(e.getTarget()===bw){return;}
;if(e.getRelatedTarget()===bw){return;}
;var by=this.__iz(e.getTarget());var bx=this.__iz(e.getRelatedTarget());if(by&&by!==bx&&by==this.__il){this.__go(C,this.__il,bx,false,e);this.__il=null;this.__iB=false;qx.event.Timer.once(this.__iw,this,0);}
;}
,__hO:function(){var bz=qx.event.Registration.getManager(window).getHandler(qx.event.handler.Mouse);bz.preventNextClick();}
},destruct:function(){this.__im=this.__il=this.__er=this.__a=this.__in=this.__io=this.__ip=this.__d=null;}
,defer:function(bA){if(!qx.event.handler.MouseEmulation.ON){qx.event.Registration.addHandler(bA);}
;}
});}
)();
(function(){var a="best-fit",b="placementRight",c="Boolean",d="bottom-right",e="' ",f="widget",g="placementLeft",h="qx.ui.core.MPlacement",i="left-top",j="Integer",k="left-middle",l="right-middle",m="top-center",n="[qx.ui.core.MPlacement.setMoveDirection()], the value was '",o="offsetRight",p="mouse",q="interval",r="keep-align",s="bottom-left",t="direct",u="shorthand",v="Invalid value for the parameter 'direction' ",w="offsetLeft",x="top-left",y="appear",z="offsetBottom",A="top",B="top-right",C="offsetTop",D="but 'top' or 'left' are allowed.",E="right-bottom",F="disappear",G="right-top",H="bottom-center",I="left-bottom",J="left";qx.Mixin.define(h,{statics:{__dn:null,__do:J,setVisibleElement:function(K){this.__dn=K;}
,getVisibleElement:function(){return this.__dn;}
,setMoveDirection:function(L){if(L===A||L===J){this.__do=L;}
else {throw new Error(v+n+L+e+D);}
;}
,getMoveDirection:function(){return this.__do;}
},properties:{position:{check:[x,m,B,s,H,d,i,k,I,G,l,E],init:s,themeable:true},placeMethod:{check:[f,p],init:p,themeable:true},domMove:{check:c,init:false},placementModeX:{check:[t,r,a],init:r,themeable:true},placementModeY:{check:[t,r,a],init:r,themeable:true},offsetLeft:{check:j,init:0,themeable:true},offsetTop:{check:j,init:0,themeable:true},offsetRight:{check:j,init:0,themeable:true},offsetBottom:{check:j,init:0,themeable:true},offset:{group:[C,o,z,w],mode:u,themeable:true}},members:{__dp:null,__dq:null,__dr:null,getLayoutLocation:function(N){var P,O,R,top;O=N.getBounds();if(!O){return null;}
;R=O.left;top=O.top;var Q=O;N=N.getLayoutParent();while(N&&!N.isRootWidget()){O=N.getBounds();R+=O.left;top+=O.top;P=N.getInsets();R+=P.left;top+=P.top;N=N.getLayoutParent();}
;if(N.isRootWidget()){var M=N.getContentLocation();if(M){R+=M.left;top+=M.top;}
;}
;return {left:R,top:top,right:R+Q.width,bottom:top+Q.height};}
,moveTo:function(Y,top){var X=qx.ui.core.MPlacement.getVisibleElement();if(X){var W=this.getBounds();var V=X.getContentLocation();if(W&&V){var U=top+W.height;var T=Y+W.width;if((T>V.left&&Y<V.right)&&(U>V.top&&top<V.bottom)){var S=qx.ui.core.MPlacement.getMoveDirection();if(S===J){Y=Math.max(V.left-W.width,0);}
else {top=Math.max(V.top-W.height,0);}
;}
;}
;}
;if(this.getDomMove()){this.setDomPosition(Y,top);}
else {this.setLayoutProperties({left:Y,top:top});}
;}
,placeToWidget:function(bc,ba){if(ba){this.__ds();this.__dp=qx.lang.Function.bind(this.placeToWidget,this,bc,false);qx.event.Idle.getInstance().addListener(q,this.__dp);this.__dr=function(){this.__ds();}
;this.addListener(F,this.__dr,this);}
;var bb=bc.getContentLocation()||this.getLayoutLocation(bc);if(bb!=null){this.__du(bb);return true;}
else {return false;}
;}
,__ds:function(){if(this.__dp){qx.event.Idle.getInstance().removeListener(q,this.__dp);this.__dp=null;}
;if(this.__dr){this.removeListener(F,this.__dr,this);this.__dr=null;}
;}
,placeToMouse:function(event){var be=Math.round(event.getDocumentLeft());var top=Math.round(event.getDocumentTop());var bd={left:be,top:top,right:be,bottom:top};this.__du(bd);}
,placeToElement:function(bh,bf){var location=qx.bom.element.Location.get(bh);var bg={left:location.left,top:location.top,right:location.left+bh.offsetWidth,bottom:location.top+bh.offsetHeight};if(bf){this.__dp=qx.lang.Function.bind(this.placeToElement,this,bh,false);qx.event.Idle.getInstance().addListener(q,this.__dp);this.addListener(F,function(){if(this.__dp){qx.event.Idle.getInstance().removeListener(q,this.__dp);this.__dp=null;}
;}
,this);}
;this.__du(bg);}
,placeToPoint:function(bj){var bi={left:bj.left,top:bj.top,right:bj.left,bottom:bj.top};this.__du(bi);}
,_getPlacementOffsets:function(){return {left:this.getOffsetLeft(),top:this.getOffsetTop(),right:this.getOffsetRight(),bottom:this.getOffsetBottom()};}
,__dt:function(bk){var bl=null;if(this._computePlacementSize){var bl=this._computePlacementSize();}
else if(this.isVisible()){var bl=this.getBounds();}
;if(bl==null){this.addListenerOnce(y,function(){this.__dt(bk);}
,this);}
else {bk.call(this,bl);}
;}
,__du:function(bm){this.__dt(function(bo){var bn=qx.util.placement.Placement.compute(bo,this.getLayoutParent().getBounds(),bm,this._getPlacementOffsets(),this.getPosition(),this.getPlacementModeX(),this.getPlacementModeY());this.removeState(g);this.removeState(b);this.addState(bm.left<bn.left?b:g);this.moveTo(bn.left,bn.top);}
);}
},destruct:function(){this.__ds();}
});}
)();
(function(){var a="-",b="align-start",c="best-fit",d="qx.util.placement.Placement",e="middle",f='__dv',g="bottom",h="keep-align",i="align-end",j="align-center",k="Invalid 'mode' argument!'",l="center",m="edge-start",n="Class",o="direct",p="top",q="left",r="right",s="edge-end";qx.Class.define(d,{extend:qx.core.Object,construct:function(){qx.core.Object.call(this);this.__dv=qx.util.placement.DirectAxis;}
,properties:{axisX:{check:n},axisY:{check:n},edge:{check:[p,r,g,q],init:p},align:{check:[p,r,g,q,l,e],init:r}},statics:{__dw:null,compute:function(D,w,t,u,C,x,y){this.__dw=this.__dw||new qx.util.placement.Placement();var A=C.split(a);var z=A[0];var v=A[1];{var B;}
;this.__dw.set({axisX:this.__dA(x),axisY:this.__dA(y),edge:z,align:v});return this.__dw.compute(D,w,t,u);}
,__dx:null,__dy:null,__dz:null,__dA:function(E){switch(E){case o:this.__dx=this.__dx||qx.util.placement.DirectAxis;return this.__dx;case h:this.__dy=this.__dy||qx.util.placement.KeepAlignAxis;return this.__dy;case c:this.__dz=this.__dz||qx.util.placement.BestFitAxis;return this.__dz;default:throw new Error(k);};}
},members:{__dv:null,compute:function(K,H,F,G){{}
;var I=this.getAxisX()||this.__dv;var L=I.computeStart(K.width,{start:F.left,end:F.right},{start:G.left,end:G.right},H.width,this.__dB());var J=this.getAxisY()||this.__dv;var top=J.computeStart(K.height,{start:F.top,end:F.bottom},{start:G.top,end:G.bottom},H.height,this.__dC());return {left:L,top:top};}
,__dB:function(){var N=this.getEdge();var M=this.getAlign();if(N==q){return m;}
else if(N==r){return s;}
else if(M==q){return b;}
else if(M==l){return j;}
else if(M==r){return i;}
;}
,__dC:function(){var P=this.getEdge();var O=this.getAlign();if(P==p){return m;}
else if(P==g){return s;}
else if(O==p){return b;}
else if(O==e){return j;}
else if(O==g){return i;}
;}
},destruct:function(){this._disposeObjects(f);}
});}
)();
(function(){var a="align-start",b="align-end",c="qx.util.placement.AbstractAxis",d="edge-start",e="align-center",f="abstract method call!",g="edge-end";qx.Bootstrap.define(c,{extend:Object,statics:{computeStart:function(j,k,l,h,i){throw new Error(f);}
,_moveToEdgeAndAlign:function(n,o,p,m){switch(m){case d:return o.start-p.end-n;case g:return o.end+p.start;case a:return o.start+p.start;case e:return o.start+parseInt((o.end-o.start-n)/2,10)+p.start;case b:return o.end-p.end-n;};}
,_isInRange:function(r,s,q){return r>=0&&r+s<=q;}
}});}
)();
(function(){var a="qx.util.placement.KeepAlignAxis",b="edge-start",c="edge-end";qx.Bootstrap.define(a,{statics:{_moveToEdgeAndAlign:qx.util.placement.AbstractAxis._moveToEdgeAndAlign,_isInRange:qx.util.placement.AbstractAxis._isInRange,computeStart:function(k,f,g,d,j){var i=this._moveToEdgeAndAlign(k,f,g,j);var e,h;if(this._isInRange(i,k,d)){return i;}
;if(j==b||j==c){e=f.start-g.end;h=f.end+g.start;}
else {e=f.end-g.end;h=f.start+g.start;}
;if(e>d-h){i=e-k;}
else {i=h;}
;return i;}
}});}
)();
(function(){var a="qx.util.placement.DirectAxis";qx.Bootstrap.define(a,{statics:{_moveToEdgeAndAlign:qx.util.placement.AbstractAxis._moveToEdgeAndAlign,computeStart:function(d,e,f,b,c){return this._moveToEdgeAndAlign(d,e,f,c);}
}});}
)();
(function(){var a="qx.util.placement.BestFitAxis";qx.Bootstrap.define(a,{statics:{_isInRange:qx.util.placement.AbstractAxis._isInRange,_moveToEdgeAndAlign:qx.util.placement.AbstractAxis._moveToEdgeAndAlign,computeStart:function(g,c,d,b,f){var e=this._moveToEdgeAndAlign(g,c,d,f);if(this._isInRange(e,g,b)){return e;}
;if(e<0){e=Math.min(0,b-g);}
;if(e+g>b){e=Math.max(0,b-g);}
;return e;}
}});}
)();
(function(){var a="Number",b="interval",c="_applyTimeoutInterval",d="qx.event.type.Event",e="qx.event.Idle",f="singleton";qx.Class.define(e,{extend:qx.core.Object,type:f,construct:function(){qx.core.Object.call(this);var g=new qx.event.Timer(this.getTimeoutInterval());g.addListener(b,this._onInterval,this);g.start();this.__dD=g;}
,events:{"interval":d},properties:{timeoutInterval:{check:a,init:100,apply:c}},members:{__dD:null,_applyTimeoutInterval:function(h){this.__dD.setInterval(h);}
,_onInterval:function(){this.fireEvent(b);}
},destruct:function(){if(this.__dD){this.__dD.stop();}
;this.__dD=null;}
});}
)();
(function(){var a="changeWidth",b="Boolean",c="allowShrinkY",d="_applyAlign",e="_applyStretching",f="bottom",g="Integer",h="changeTheme",i="_applyDimension",j="baseline",k="marginBottom",l="qx.ui.core.LayoutItem",m="center",n="marginTop",o="allowGrowX",p="shorthand",q="middle",r="marginLeft",s="qx.dyntheme",t="allowShrinkX",u="top",v="right",w="marginRight",x="abstract",y="_applyMargin",z="allowGrowY",A="left",B="changeHeight";qx.Class.define(l,{type:x,extend:qx.core.Object,construct:function(){qx.core.Object.call(this);if(qx.core.Environment.get(s)){qx.theme.manager.Appearance.getInstance().addListener(h,this._onChangeTheme,this);qx.theme.manager.Color.getInstance().addListener(h,this._onChangeTheme,this);}
;}
,properties:{minWidth:{check:g,nullable:true,apply:i,init:null,themeable:true},width:{check:g,event:a,nullable:true,apply:i,init:null,themeable:true},maxWidth:{check:g,nullable:true,apply:i,init:null,themeable:true},minHeight:{check:g,nullable:true,apply:i,init:null,themeable:true},height:{check:g,event:B,nullable:true,apply:i,init:null,themeable:true},maxHeight:{check:g,nullable:true,apply:i,init:null,themeable:true},allowGrowX:{check:b,apply:e,init:true,themeable:true},allowShrinkX:{check:b,apply:e,init:true,themeable:true},allowGrowY:{check:b,apply:e,init:true,themeable:true},allowShrinkY:{check:b,apply:e,init:true,themeable:true},allowStretchX:{group:[o,t],mode:p,themeable:true},allowStretchY:{group:[z,c],mode:p,themeable:true},marginTop:{check:g,init:0,apply:y,themeable:true},marginRight:{check:g,init:0,apply:y,themeable:true},marginBottom:{check:g,init:0,apply:y,themeable:true},marginLeft:{check:g,init:0,apply:y,themeable:true},margin:{group:[n,w,k,r],mode:p,themeable:true},alignX:{check:[A,m,v],nullable:true,apply:d,themeable:true},alignY:{check:[u,q,f,j],nullable:true,apply:d,themeable:true}},members:{_onChangeTheme:qx.core.Environment.select(s,{"true":function(){var E=qx.util.PropertyUtil.getAllProperties(this.constructor);for(var name in E){var D=E[name];if(D.themeable){var C=qx.util.PropertyUtil.getUserValue(this,name);if(C==null){qx.util.PropertyUtil.resetThemed(this,name);}
;}
;}
;}
,"false":null}),__eb:null,__ec:null,__ed:null,__ee:null,__ef:null,__eg:null,__eh:null,getBounds:function(){return this.__eg||this.__ec||null;}
,clearSeparators:function(){}
,renderSeparator:function(F,G){}
,renderLayout:function(N,top,K,J){{var L;}
;var I=null;if(this.getHeight()==null&&this._hasHeightForWidth()){var I=this._getHeightForWidth(K);}
;if(I!=null&&I!==this.__eb){this.__eb=I;qx.ui.core.queue.Layout.add(this);return null;}
;var H=this.__ec;if(!H){H=this.__ec={};}
;var M={};if(N!==H.left||top!==H.top){M.position=true;H.left=N;H.top=top;}
;if(K!==H.width||J!==H.height){M.size=true;H.width=K;H.height=J;}
;if(this.__ed){M.local=true;delete this.__ed;}
;if(this.__ef){M.margin=true;delete this.__ef;}
;return M;}
,isExcluded:function(){return false;}
,hasValidLayout:function(){return !this.__ed;}
,scheduleLayoutUpdate:function(){qx.ui.core.queue.Layout.add(this);}
,invalidateLayoutCache:function(){this.__ed=true;this.__ee=null;}
,getSizeHint:function(O){var P=this.__ee;if(P){return P;}
;if(O===false){return null;}
;P=this.__ee=this._computeSizeHint();if(this._hasHeightForWidth()&&this.__eb&&this.getHeight()==null){P.height=this.__eb;}
;if(P.minWidth>P.width){P.width=P.minWidth;}
;if(P.maxWidth<P.width){P.width=P.maxWidth;}
;if(!this.getAllowGrowX()){P.maxWidth=P.width;}
;if(!this.getAllowShrinkX()){P.minWidth=P.width;}
;if(P.minHeight>P.height){P.height=P.minHeight;}
;if(P.maxHeight<P.height){P.height=P.maxHeight;}
;if(!this.getAllowGrowY()){P.maxHeight=P.height;}
;if(!this.getAllowShrinkY()){P.minHeight=P.height;}
;return P;}
,_computeSizeHint:function(){var U=this.getMinWidth()||0;var R=this.getMinHeight()||0;var V=this.getWidth()||U;var T=this.getHeight()||R;var Q=this.getMaxWidth()||Infinity;var S=this.getMaxHeight()||Infinity;return {minWidth:U,width:V,maxWidth:Q,minHeight:R,height:T,maxHeight:S};}
,_hasHeightForWidth:function(){var W=this._getLayout();if(W){return W.hasHeightForWidth();}
;return false;}
,_getHeightForWidth:function(X){var Y=this._getLayout();if(Y&&Y.hasHeightForWidth()){return Y.getHeightForWidth(X);}
;return null;}
,_getLayout:function(){return null;}
,_applyMargin:function(){this.__ef=true;var parent=this.$$parent;if(parent){parent.updateLayoutProperties();}
;}
,_applyAlign:function(){var parent=this.$$parent;if(parent){parent.updateLayoutProperties();}
;}
,_applyDimension:function(){qx.ui.core.queue.Layout.add(this);}
,_applyStretching:function(){qx.ui.core.queue.Layout.add(this);}
,hasUserBounds:function(){return !!this.__eg;}
,setUserBounds:function(bb,top,ba,bc){this.__eg={left:bb,top:top,width:ba,height:bc};qx.ui.core.queue.Layout.add(this);}
,resetUserBounds:function(){delete this.__eg;qx.ui.core.queue.Layout.add(this);}
,__ei:{},setLayoutProperties:function(bf){if(bf==null){return;}
;var bd=this.__eh;if(!bd){bd=this.__eh={};}
;var parent=this.getLayoutParent();if(parent){parent.updateLayoutProperties(bf);}
;for(var be in bf){if(bf[be]==null){delete bd[be];}
else {bd[be]=bf[be];}
;}
;}
,getLayoutProperties:function(){return this.__eh||this.__ei;}
,clearLayoutProperties:function(){delete this.__eh;}
,updateLayoutProperties:function(bi){var bg=this._getLayout();if(bg){{var bh;}
;bg.invalidateChildrenCache();}
;qx.ui.core.queue.Layout.add(this);}
,getApplicationRoot:function(){return qx.core.Init.getApplication().getRoot();}
,getLayoutParent:function(){return this.$$parent||null;}
,setLayoutParent:function(parent){if(this.$$parent===parent){return;}
;this.$$parent=parent||null;qx.ui.core.queue.Visibility.add(this);}
,isRootWidget:function(){return false;}
,_getRoot:function(){var parent=this;while(parent){if(parent.isRootWidget()){return parent;}
;parent=parent.$$parent;}
;return null;}
,clone:function(){var bj=qx.core.Object.prototype.clone.call(this);var bk=this.__eh;if(bk){bj.__eh=qx.lang.Object.clone(bk);}
;return bj;}
},destruct:function(){if(qx.core.Environment.get(s)){qx.theme.manager.Appearance.getInstance().removeListener(h,this._onChangeTheme,this);qx.theme.manager.Color.getInstance().removeListener(h,this._onChangeTheme,this);}
;this.$$parent=this.$$subparent=this.__eh=this.__ec=this.__eg=this.__ee=null;}
});}
)();
(function(){var a="$$theme_",b="$$user_",c="qx.util.PropertyUtil",d="$$init_";qx.Class.define(c,{statics:{getProperties:function(e){return e.$$properties;}
,getAllProperties:function(j){var g={};var f=j;while(f!=qx.core.Object){var i=this.getProperties(f);for(var h in i){g[h]=i[h];}
;f=f.superclass;}
;return g;}
,getUserValue:function(l,k){return l[b+k];}
,setUserValue:function(n,m,o){n[b+m]=o;}
,deleteUserValue:function(q,p){delete (q[b+p]);}
,getInitValue:function(s,r){return s[d+r];}
,setInitValue:function(u,t,v){u[d+t]=v;}
,deleteInitValue:function(x,w){delete (x[d+w]);}
,getThemeValue:function(z,y){return z[a+y];}
,setThemeValue:function(B,A,C){B[a+A]=C;}
,deleteThemeValue:function(E,D){delete (E[a+D]);}
,setThemed:function(H,G,I){var F=qx.core.Property.$$method.setThemed;H[F[G]](I);}
,resetThemed:function(K,J){var L=qx.core.Property.$$method.resetThemed;K[L[J]]();}
}});}
)();
(function(){var a="qx.ui.core.queue.Visibility",b="visibility";qx.Class.define(a,{statics:{__ej:[],__cN:{},remove:function(c){delete this.__cN[c.$$hash];qx.lang.Array.remove(this.__ej,c);}
,isVisible:function(d){return this.__cN[d.$$hash]||false;}
,__ek:function(f){var h=this.__cN;var g=f.$$hash;var e;if(f.isExcluded()){e=false;}
else {var parent=f.$$parent;if(parent){e=this.__ek(parent);}
else {e=f.isRootWidget();}
;}
;return h[g]=e;}
,add:function(k){var j=this.__ej;if(qx.lang.Array.contains(j,k)){return;}
;j.unshift(k);qx.ui.core.queue.Manager.scheduleFlush(b);}
,flush:function(){var o=this.__ej;var p=this.__cN;for(var i=o.length-1;i>=0;i-- ){var n=o[i].$$hash;if(p[n]!=null){o[i].addChildrenToQueue(o);}
;}
;var l={};for(var i=o.length-1;i>=0;i-- ){var n=o[i].$$hash;l[n]=p[n];p[n]=null;}
;for(var i=o.length-1;i>=0;i-- ){var m=o[i];var n=m.$$hash;o.splice(i,1);if(p[n]==null){this.__ek(m);}
;if(p[n]&&p[n]!=l[n]){m.checkAppearanceNeeds();}
;}
;this.__ej=[];}
}});}
)();
(function(){var a="useraction",b="Error in the 'Appearance' queue:",c="Error in the 'Widget' queue:",d=" due to exceptions in user code. The application has to be reloaded!",f="Error in the 'Layout' queue:",g="Error in the 'Visibility' queue:",h="qx.debug.ui.queue",i="Error in the 'Dispose' queue:",j="event.touch",k="qx.ui.core.queue.Manager",l=" times in a row",m="Fatal Error: Flush terminated ";qx.Class.define(k,{statics:{__iU:false,__fe:false,__iT:{},__iV:0,MAX_RETRIES:10,scheduleFlush:function(n){var self=qx.ui.core.queue.Manager;self.__iT[n]=true;if(!self.__iU){self.__fe=false;qx.bom.AnimationFrame.request(function(){if(self.__fe){self.__fe=false;return;}
;self.flush();}
,self);self.__iU=true;}
;}
,flush:function(){var self=qx.ui.core.queue.Manager;if(self.__iW){return;}
;self.__iW=true;self.__fe=true;var o=self.__iT;self.__iX(function(){while(o.visibility||o.widget||o.appearance||o.layout||o.element){if(o.widget){delete o.widget;if(qx.core.Environment.get(h)){try{qx.ui.core.queue.Widget.flush();}
catch(e){qx.log.Logger.error(qx.ui.core.queue.Widget,c+e,e);}
;}
else {qx.ui.core.queue.Widget.flush();}
;}
;if(o.visibility){delete o.visibility;if(qx.core.Environment.get(h)){try{qx.ui.core.queue.Visibility.flush();}
catch(e){qx.log.Logger.error(qx.ui.core.queue.Visibility,g+e,e);}
;}
else {qx.ui.core.queue.Visibility.flush();}
;}
;if(o.appearance){delete o.appearance;if(qx.core.Environment.get(h)){try{qx.ui.core.queue.Appearance.flush();}
catch(e){qx.log.Logger.error(qx.ui.core.queue.Appearance,b+e,e);}
;}
else {qx.ui.core.queue.Appearance.flush();}
;}
;if(o.widget||o.visibility||o.appearance){continue;}
;if(o.layout){delete o.layout;if(qx.core.Environment.get(h)){try{qx.ui.core.queue.Layout.flush();}
catch(e){qx.log.Logger.error(qx.ui.core.queue.Layout,f+e,e);}
;}
else {qx.ui.core.queue.Layout.flush();}
;}
;if(o.widget||o.visibility||o.appearance||o.layout){continue;}
;if(o.element){delete o.element;qx.html.Element.flush();}
;}
;}
,function(){self.__iU=false;}
);self.__iX(function(){if(o.dispose){delete o.dispose;if(qx.core.Environment.get(h)){try{qx.ui.core.queue.Dispose.flush();}
catch(e){qx.log.Logger.error(i+e);}
;}
else {qx.ui.core.queue.Dispose.flush();}
;}
;}
,function(){self.__iW=false;}
);self.__iV=0;}
,__iX:function(p,q){var self=qx.ui.core.queue.Manager;try{p();}
catch(e){{}
;self.__iU=false;self.__iW=false;self.__iV+=1;if(self.__iV<=self.MAX_RETRIES){self.scheduleFlush();}
else {throw new Error(m+(self.__iV-1)+l+d);}
;throw e;}
finally{q();}
;}
,__iY:function(e){qx.ui.core.queue.Manager.flush();}
},defer:function(r){qx.html.Element._scheduleFlush=r.scheduleFlush;qx.event.Registration.addListener(window,a,qx.core.Environment.get(j)?r.__iY:r.flush);}
});}
)();
(function(){var a="qx.ui.core.queue.Widget",b="widget",c="$$default";qx.Class.define(a,{statics:{__ej:[],__iT:{},remove:function(e,g){var d=this.__ej;if(!qx.lang.Array.contains(d,e)){return;}
;var f=e.$$hash;if(g==null){qx.lang.Array.remove(d,e);delete this.__iT[f];return;}
;if(this.__iT[f]){delete this.__iT[f][g];if(qx.lang.Object.getLength(this.__iT[f])==0){qx.lang.Array.remove(d,e);}
;}
;}
,add:function(j,l){var h=this.__ej;if(!qx.lang.Array.contains(h,j)){h.unshift(j);}
;if(l==null){l=c;}
;var k=j.$$hash;if(!this.__iT[k]){this.__iT[k]={};}
;this.__iT[k][l]=true;qx.ui.core.queue.Manager.scheduleFlush(b);}
,flush:function(){var m=this.__ej;var n,o;for(var i=m.length-1;i>=0;i-- ){n=m[i];o=this.__iT[n.$$hash];m.splice(i,1);n.syncWidget(o);}
;if(m.length!=0){return;}
;this.__ej=[];this.__iT={};}
}});}
)();
(function(){var a="qx.ui.core.queue.Layout",b="layout";qx.Class.define(a,{statics:{__ej:{},__ja:{},remove:function(c){delete this.__ej[c.$$hash];}
,add:function(d){this.__ej[d.$$hash]=d;qx.ui.core.queue.Manager.scheduleFlush(b);}
,isScheduled:function(e){return !!this.__ej[e.$$hash];}
,flush:function(){var f=this.__jc();for(var i=f.length-1;i>=0;i-- ){var g=f[i];if(g.hasValidLayout()){continue;}
;if(g.isRootWidget()&&!g.hasUserBounds()){var j=g.getSizeHint();g.renderLayout(0,0,j.width,j.height);}
else {var h=g.getBounds();g.renderLayout(h.left,h.top,h.width,h.height);}
;}
;}
,getNestingLevel:function(l){var k=this.__ja;var n=0;var parent=l;while(true){if(k[parent.$$hash]!=null){n+=k[parent.$$hash];break;}
;if(!parent.$$parent){break;}
;parent=parent.$$parent;n+=1;}
;var m=n;while(l&&l!==parent){k[l.$$hash]=m-- ;l=l.$$parent;}
;return n;}
,__jb:function(){var t=qx.ui.core.queue.Visibility;this.__ja={};var s=[];var r=this.__ej;var o,q;for(var p in r){o=r[p];if(t.isVisible(o)){q=this.getNestingLevel(o);if(!s[q]){s[q]={};}
;s[q][p]=o;delete r[p];}
;}
;return s;}
,__jc:function(){var x=[];var z=this.__jb();for(var w=z.length-1;w>=0;w-- ){if(!z[w]){continue;}
;for(var v in z[w]){var u=z[w][v];if(w==0||u.isRootWidget()||u.hasUserBounds()){x.push(u);u.invalidateLayoutCache();continue;}
;var B=u.getSizeHint(false);if(B){u.invalidateLayoutCache();var y=u.getSizeHint();var A=(!u.getBounds()||B.minWidth!==y.minWidth||B.width!==y.width||B.maxWidth!==y.maxWidth||B.minHeight!==y.minHeight||B.height!==y.height||B.maxHeight!==y.maxHeight);}
else {A=true;}
;if(A){var parent=u.getLayoutParent();if(!z[w-1]){z[w-1]={};}
;z[w-1][parent.$$hash]=parent;}
else {x.push(u);}
;}
;}
;return x;}
}});}
)();
(function(){var a="appearance",b="qx.ui.core.queue.Appearance";qx.Class.define(b,{statics:{__ej:[],remove:function(c){qx.lang.Array.remove(this.__ej,c);}
,add:function(e){var d=this.__ej;if(qx.lang.Array.contains(d,e)){return;}
;d.unshift(e);qx.ui.core.queue.Manager.scheduleFlush(a);}
,has:function(f){return qx.lang.Array.contains(this.__ej,f);}
,flush:function(){var j=qx.ui.core.queue.Visibility;var g=this.__ej;var h;for(var i=g.length-1;i>=0;i-- ){h=g[i];g.splice(i,1);if(j.isVisible(h)){h.syncAppearance();}
else {h.$$stateChanges=true;}
;}
;}
}});}
)();
(function(){var a="qx.util.ValueManager",b="abstract";qx.Class.define(a,{type:b,extend:qx.core.Object,construct:function(){qx.core.Object.call(this);this._dynamic={};}
,members:{_dynamic:null,resolveDynamic:function(c){return this._dynamic[c];}
,isDynamic:function(d){return !!this._dynamic[d];}
,resolve:function(e){if(e&&this._dynamic[e]){return this._dynamic[e];}
;return e;}
,_setDynamic:function(f){this._dynamic=f;}
,_getDynamic:function(){return this._dynamic;}
},destruct:function(){this._dynamic=null;}
});}
)();
(function(){var a="Could not parse color: ",b="_applyTheme",c="qx.theme.manager.Color",d="Theme",e="changeTheme",f="string",g="singleton";qx.Class.define(c,{type:g,extend:qx.util.ValueManager,properties:{theme:{check:d,nullable:true,apply:b,event:e}},members:{_applyTheme:function(j){var h={};if(j){var i=j.colors;for(var name in i){h[name]=this.__jE(i,name);}
;}
;this._setDynamic(h);}
,__jE:function(l,name){var k=l[name];if(typeof k===f){if(!qx.util.ColorUtil.isCssString(k)){if(l[k]!=undefined){return this.__jE(l,k);}
;throw new Error(a+k);}
;return k;}
else if(k instanceof Array){return qx.util.ColorUtil.rgbToRgbString(k);}
;throw new Error(a+k);}
,resolve:function(p){var o=this._dynamic;var m=o[p];if(m){return m;}
;var n=this.getTheme();if(n!==null&&n.colors[p]){return o[p]=n.colors[p];}
;return p;}
,isDynamic:function(s){var r=this._dynamic;if(s&&(r[s]!==undefined)){return true;}
;var q=this.getTheme();if(q!==null&&s&&(q.colors[s]!==undefined)){r[s]=q.colors[s];return true;}
;return false;}
}});}
)();
(function(){var a="Missing appearance: ",b="_applyTheme",c="string",d="qx.theme.manager.Appearance",e=":",f="Theme",g="changeTheme",h="/",j="singleton";qx.Class.define(d,{type:j,extend:qx.core.Object,construct:function(){qx.core.Object.call(this);this.__kk={};this.__kl={};}
,properties:{theme:{check:f,nullable:true,event:g,apply:b}},members:{__km:{},__kk:null,__kl:null,_applyTheme:function(){this.__kl={};this.__kk={};}
,__kn:function(y,u,l,p){var r=u.appearances;var m=r[y];if(!m){var x=h;var n=[];var q=y.split(x);var w=qx.lang.Array.clone(q);var t;while(!m&&q.length>0){n.unshift(q.pop());var o=q.join(x);m=r[o];if(m){t=m.alias||m;if(typeof t===c){var v=t+x+n.join(x);return this.__kn(v,u,l,w);}
;}
;}
;for(var i=0;i<n.length-1;i++ ){n.shift();var s=n.join(x);var k=this.__kn(s,u,null,w);if(k){return k;}
;}
;if(l!=null){return this.__kn(l,u,null,w);}
;{}
;return null;}
else if(typeof m===c){return this.__kn(m,u,l,w);}
else if(m.include&&!m.style){return this.__kn(m.include,u,l,w);}
;return y;}
,styleFrom:function(R,J,K,A){if(!K){K=this.getTheme();}
;var H=this.__kl;var z=H[R];if(!z){z=H[R]=this.__kn(R,K,A);}
;var O=K.appearances[z];if(!O){this.warn(a+R);return null;}
;if(!O.style){return null;}
;var P=z;if(J){var D=O.$$bits;if(!D){D=O.$$bits={};O.$$length=0;}
;var E=0;for(var G in J){if(!J[G]){continue;}
;if(D[G]==null){D[G]=1<<O.$$length++ ;}
;E+=D[G];}
;if(E>0){P+=e+E;}
;}
;var F=this.__kk;if(F[P]!==undefined){return F[P];}
;if(!J){J=this.__km;}
;var M;if(O.include||O.base){var Q;if(O.include){Q=this.styleFrom(O.include,J,K,A);}
;var I=O.style(J,Q);M={};if(O.base){var N=this.styleFrom(z,J,O.base,A);if(O.include){for(var C in N){if(!Q.hasOwnProperty(C)&&!I.hasOwnProperty(C)){M[C]=N[C];}
;}
;}
else {for(var L in N){if(!I.hasOwnProperty(L)){M[L]=N[L];}
;}
;}
;}
;if(O.include){for(var B in Q){if(!I.hasOwnProperty(B)){M[B]=Q[B];}
;}
;}
;for(var S in I){M[S]=I[S];}
;}
else {M=O.style(J);}
;return F[P]=M||null;}
},destruct:function(){this.__kk=this.__kl=null;}
});}
)();
(function(){var a="qx.event.handler.Window";qx.Class.define(a,{extend:qx.core.Object,implement:qx.event.IEventHandler,construct:function(b){qx.core.Object.call(this);this._manager=b;this._window=b.getWindow();this._initWindowObserver();}
,statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,SUPPORTED_TYPES:{error:1,load:1,beforeunload:1,unload:1,resize:1,scroll:1,beforeshutdown:1},TARGET_CHECK:qx.event.IEventHandler.TARGET_WINDOW,IGNORE_CAN_HANDLE:true},members:{canHandleEvent:function(d,c){}
,registerEvent:function(h,g,f){}
,unregisterEvent:function(k,j,i){}
,_initWindowObserver:function(){this._onNativeWrapper=qx.lang.Function.listener(this._onNative,this);var l=qx.event.handler.Window.SUPPORTED_TYPES;for(var m in l){qx.bom.Event.addNativeListener(this._window,m,this._onNativeWrapper);}
;}
,_stopWindowObserver:function(){var n=qx.event.handler.Window.SUPPORTED_TYPES;for(var o in n){qx.bom.Event.removeNativeListener(this._window,o,this._onNativeWrapper);}
;}
,_onNative:qx.event.GlobalError.observeMethod(function(e){if(this.isDisposed()){return;}
;var t=this._window;try{var q=t.document;}
catch(u){return;}
;var r=q.documentElement;var p=qx.bom.Event.getTarget(e);if(p==null||p===t||p===q||p===r){var event=qx.event.Registration.createEvent(e.type,qx.event.type.Native,[e,t]);qx.event.Registration.dispatchEvent(t,event);var s=event.getReturnValue();if(s!=null){e.returnValue=s;return s;}
;}
;}
)},destruct:function(){this._stopWindowObserver();this._manager=this._window=null;}
,defer:function(v){qx.event.Registration.addHandler(v);}
});}
)();
(function(){var a="ready",b="mshtml",c="engine.name",d="qx.event.handler.Application",f="complete",g="webkit",h="gecko",i="load",j="unload",k="opera",l="left",m="DOMContentLoaded",n="shutdown",o="browser.documentmode";qx.Class.define(d,{extend:qx.core.Object,implement:qx.event.IEventHandler,construct:function(p){qx.core.Object.call(this);this._window=p.getWindow();this.__cP=false;this.__cQ=false;this.__cR=false;this.__cS=false;this._initObserver();qx.event.handler.Application.$$instance=this;}
,statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,SUPPORTED_TYPES:{ready:1,shutdown:1},TARGET_CHECK:qx.event.IEventHandler.TARGET_WINDOW,IGNORE_CAN_HANDLE:true,onScriptLoaded:function(){var q=qx.event.handler.Application.$$instance;if(q){q.__cT();}
;}
},members:{canHandleEvent:function(s,r){}
,registerEvent:function(v,u,t){}
,unregisterEvent:function(y,x,w){}
,__cR:null,__cP:null,__cQ:null,__cS:null,__cT:function(){if(!this.__cR&&this.__cP&&qx.$$loader.scriptLoaded){if((qx.core.Environment.get(c)==b)){if(qx.event.Registration.hasListener(this._window,a)){this.__cR=true;qx.event.Registration.fireEvent(this._window,a);}
;}
else {this.__cR=true;qx.event.Registration.fireEvent(this._window,a);}
;}
;}
,isApplicationReady:function(){return this.__cR;}
,_initObserver:function(){if(qx.$$domReady||document.readyState==f||document.readyState==a){this.__cP=true;this.__cT();}
else {this._onNativeLoadWrapped=qx.lang.Function.bind(this._onNativeLoad,this);if(qx.core.Environment.get(c)==h||qx.core.Environment.get(c)==k||qx.core.Environment.get(c)==g||(qx.core.Environment.get(c)==b&&qx.core.Environment.get(o)>8)){qx.bom.Event.addNativeListener(this._window,m,this._onNativeLoadWrapped);}
else {var self=this;var z=function(){try{document.documentElement.doScroll(l);if(document.body){self._onNativeLoadWrapped();}
;}
catch(A){window.setTimeout(z,100);}
;}
;z();}
;qx.bom.Event.addNativeListener(this._window,i,this._onNativeLoadWrapped);}
;this._onNativeUnloadWrapped=qx.lang.Function.bind(this._onNativeUnload,this);qx.bom.Event.addNativeListener(this._window,j,this._onNativeUnloadWrapped);}
,_stopObserver:function(){if(this._onNativeLoadWrapped){qx.bom.Event.removeNativeListener(this._window,i,this._onNativeLoadWrapped);}
;qx.bom.Event.removeNativeListener(this._window,j,this._onNativeUnloadWrapped);this._onNativeLoadWrapped=null;this._onNativeUnloadWrapped=null;}
,_onNativeLoad:qx.event.GlobalError.observeMethod(function(){this.__cP=true;this.__cT();}
),_onNativeUnload:qx.event.GlobalError.observeMethod(function(){if(!this.__cS){this.__cS=true;try{qx.event.Registration.fireEvent(this._window,n);}
catch(e){throw e;}
finally{qx.core.ObjectRegistry.shutdown();}
;}
;}
)},destruct:function(){this._stopObserver();this._window=null;}
,defer:function(B){qx.event.Registration.addHandler(B);}
});}
)();
(function(){var a="qx.core.BaseInit",b="engine.name",c="Main runtime: ",d="",f="os.name",g="engine.version",h="Missing application class: ",i="Load runtime: ",j="ms",k="Could not detect engine!",l='testrunner.TestLoaderMobile',m="Finalize runtime: ",n="Could not detect operating system!",o="Could not detect the version of the engine!";qx.Class.define(a,{statics:{__cY:null,getApplication:function(){return this.__cY||null;}
,ready:function(){if(this.__cY){return;}
;if(qx.core.Environment.get(b)==d){qx.log.Logger.warn(k);}
;if(qx.core.Environment.get(g)==d){qx.log.Logger.warn(o);}
;if(qx.core.Environment.get(f)==d){qx.log.Logger.warn(n);}
;qx.log.Logger.debug(this,i+(new Date-qx.Bootstrap.LOADSTART)+j);var q=l;var r=qx.Class.getByName(q);if(r){this.__cY=new r;var p=new Date;this.__cY.main();qx.log.Logger.debug(this,c+(new Date-p)+j);var p=new Date;this.__cY.finalize();qx.log.Logger.debug(this,m+(new Date-p)+j);}
else {qx.log.Logger.warn(h+q);}
;}
,__da:function(e){var s=this.__cY;if(s){s.close();}
;}
,__db:function(){var t=this.__cY;if(t){t.terminate();}
;qx.core.ObjectRegistry.shutdown();}
}});}
)();
(function(){var a="ready",b="shutdown",c="beforeunload",d="qx.core.Init";qx.Class.define(d,{statics:{getApplication:qx.core.BaseInit.getApplication,ready:qx.core.BaseInit.ready,__da:function(e){var f=this.getApplication();if(f){e.setReturnValue(f.close());}
;}
,__db:function(){var g=this.getApplication();if(g){g.terminate();}
;}
},defer:function(h){qx.event.Registration.addListener(window,a,h.ready,h);qx.event.Registration.addListener(window,b,h.__db,h);qx.event.Registration.addListener(window,c,h.__da,h);}
});}
)();
(function(){var a="To enable localization please include qx.locale.Manager into your build!",b="qx.locale.MTranslation";qx.Mixin.define(b,{members:{tr:function(c,e){var d=qx.locale.Manager;if(d){return d.tr.apply(d,arguments);}
;throw new Error(a);}
,trn:function(g,j,f,h){var i=qx.locale.Manager;if(i){return i.trn.apply(i,arguments);}
;throw new Error(a);}
,trc:function(n,m,l){var k=qx.locale.Manager;if(k){return k.trc.apply(k,arguments);}
;throw new Error(a);}
,marktr:function(p){var o=qx.locale.Manager;if(o){return o.marktr.apply(o,arguments);}
;throw new Error(a);}
}});}
)();
(function(){var a="backgroundColor",b="drag",c="_applyNativeContextMenu",d="div",f="__iJ",g="_applyBackgroundColor",h="qx.event.type.Data",j="_applyFocusable",k=" requires a layout, but no one was defined!",m="qx.event.type.KeyInput",n="focused",o="disabled",p="move",q="createChildControl",r="Unsupported control: ",s="dragstart",t="Font",u="qx.dynlocale",v="dragchange",w="_applyEnabled",x="_applySelectable",y="Number",z="_applyKeepActive",A="dragend",B="_applyVisibility",C="Child control '",D="qxDraggable",E="syncAppearance",F="paddingLeft",G="' of widget ",H="qx.event.type.Mouse",I="_applyPadding",J="#",K="At least one child in control ",L="visible",M="qx.event.type.Event",N="qx.event.type.MouseWheel",O="_applyCursor",P="changeVisibility",Q="_applyDraggable",R="resize",S="Decorator",T="Remove Error: ",U="zIndex",V="changeTextColor",W="$$widget",X="changeContextMenu",Y="on",cA="paddingTop",cB="opacity",cC="This widget has no children!",cw="changeSelectable",cx="__iH",cy="none",cz="__iC",cH="outline",cI="hidden",cJ="_applyAppearance",cK="hovered",cD="_applyOpacity",cE="Boolean",cF="px",cG="__iG",cO="qx.ui.core.Widget",dr="default",dS="TabIndex property must be between 1 and 32000",cP="_applyFont",cL="cursor",cM="qxDroppable",dO="' already created!",cN="changeZIndex",cQ=": ",cR="Color",cS="changeEnabled",cX="Abstract method call: _getContentHeightForWidth()!",cY="changeFont",da="qx.event.type.Focus",cT="_applyDecorator",cU="_applyZIndex",cV="_applyTextColor",cW="Widget is not focusable!",de="qx.ui.menu.Menu",df="engine.name",dg="qx.event.type.Drag",dh="qx.event.type.KeySequence",db="excluded",dc="DOM element is not yet created!",dP="_applyToolTipText",dd="Exception while creating child control '",dl="_applyDroppable",dm=" is not a child of this widget!",dR="widget",dn="changeDecorator",di="qx.event.type.Tap",dj="Integer",dQ="_applyTabIndex",dk="changeAppearance",dp="shorthand",dq="/",dC="String",dB="border-box",dA="",dG="_applyContextMenu",dF="changeToolTipText",dE="padding",dD="tabIndex",dv="paddingBottom",du="beforeContextmenuOpen",dt="changeNativeContextMenu",ds="undefined",dz="qx.ui.tooltip.ToolTip",dy="contextmenu",dx="_applyKeepFocus",dw="paddingRight",dK="changeBackgroundColor",dJ="changeLocale",dI="qxKeepFocus",dH="opera",dN="qx.event.type.Touch",dM="qxKeepActive",dL="absolute";qx.Class.define(cO,{extend:qx.ui.core.LayoutItem,include:[qx.locale.MTranslation],construct:function(){qx.ui.core.LayoutItem.call(this);this.__iC=this.__iI();this.initFocusable();this.initSelectable();this.initNativeContextMenu();}
,events:{appear:M,disappear:M,createChildControl:h,resize:h,move:h,syncAppearance:h,mousemove:H,mouseover:H,mouseout:H,mousedown:H,mouseup:H,click:H,dblclick:H,contextmenu:H,beforeContextmenuOpen:h,mousewheel:N,touchstart:dN,touchend:dN,touchmove:dN,touchcancel:dN,tap:di,longtap:di,swipe:dN,keyup:dh,keydown:dh,keypress:dh,keyinput:m,focus:da,blur:da,focusin:da,focusout:da,activate:da,deactivate:da,capture:M,losecapture:M,drop:dg,dragleave:dg,dragover:dg,drag:dg,dragstart:dg,dragend:dg,dragchange:dg,droprequest:dg},properties:{paddingTop:{check:dj,init:0,apply:I,themeable:true},paddingRight:{check:dj,init:0,apply:I,themeable:true},paddingBottom:{check:dj,init:0,apply:I,themeable:true},paddingLeft:{check:dj,init:0,apply:I,themeable:true},padding:{group:[cA,dw,dv,F],mode:dp,themeable:true},zIndex:{nullable:true,init:10,apply:cU,event:cN,check:dj,themeable:true},decorator:{nullable:true,init:null,apply:cT,event:dn,check:S,themeable:true},backgroundColor:{nullable:true,check:cR,apply:g,event:dK,themeable:true},textColor:{nullable:true,check:cR,apply:cV,event:V,themeable:true,inheritable:true},font:{nullable:true,apply:cP,check:t,event:cY,themeable:true,inheritable:true,dereference:true},opacity:{check:y,apply:cD,themeable:true,nullable:true,init:null},cursor:{check:dC,apply:O,themeable:true,inheritable:true,nullable:true,init:null},toolTip:{check:dz,nullable:true},toolTipText:{check:dC,nullable:true,event:dF,apply:dP},toolTipIcon:{check:dC,nullable:true,event:dF},blockToolTip:{check:cE,init:false},visibility:{check:[L,cI,db],init:L,apply:B,event:P},enabled:{init:true,check:cE,inheritable:true,apply:w,event:cS},anonymous:{init:false,check:cE},tabIndex:{check:dj,nullable:true,apply:dQ},focusable:{check:cE,init:false,apply:j},keepFocus:{check:cE,init:false,apply:dx},keepActive:{check:cE,init:false,apply:z},draggable:{check:cE,init:false,apply:Q},droppable:{check:cE,init:false,apply:dl},selectable:{check:cE,init:false,event:cw,apply:x},contextMenu:{check:de,apply:dG,nullable:true,event:X},nativeContextMenu:{check:cE,init:false,themeable:true,event:dt,apply:c},appearance:{check:dC,init:dR,apply:cJ,event:dk}},statics:{DEBUG:false,getWidgetByElement:function(dW,dU){while(dW){var dT=dW.$$widget;if(dT!=null){var dV=qx.core.ObjectRegistry.fromHashCode(dT);if(!dU||!dV.getAnonymous()){return dV;}
;}
;try{dW=dW.parentNode;}
catch(e){return null;}
;}
;return null;}
,contains:function(parent,dX){while(dX){if(parent==dX){return true;}
;dX=dX.getLayoutParent();}
;return false;}
,__iD:new qx.util.ObjectPool()},members:{__iC:null,__iE:null,__iF:null,__iG:null,_getLayout:function(){return this.__iG;}
,_setLayout:function(dY){{}
;if(this.__iG){this.__iG.connectToWidget(null);}
;if(dY){dY.connectToWidget(this);}
;this.__iG=dY;qx.ui.core.queue.Layout.add(this);}
,setLayoutParent:function(parent){if(this.$$parent===parent){return;}
;var content=this.getContentElement();if(this.$$parent&&!this.$$parent.$$disposed){this.$$parent.getContentElement().remove(content);}
;this.$$parent=parent||null;if(parent&&!parent.$$disposed){this.$$parent.getContentElement().add(content);}
;this.$$refreshInheritables();qx.ui.core.queue.Visibility.add(this);}
,_updateInsets:null,renderLayout:function(eg,top,ed,eb){var eh=qx.ui.core.LayoutItem.prototype.renderLayout.call(this,eg,top,ed,eb);if(!eh){return null;}
;if(qx.lang.Object.isEmpty(eh)&&!this._updateInsets){return null;}
;var content=this.getContentElement();var ek=eh.size||this._updateInsets;var ei=cF;var ea={};if(eh.position){ea.left=eg+ei;ea.top=top+ei;}
;if(ek||eh.margin){ea.width=ed+ei;ea.height=eb+ei;}
;if(Object.keys(ea).length>0){content.setStyles(ea);}
;if(ek||eh.local||eh.margin){if(this.__iG&&this.hasLayoutChildren()){var ef=this.getInsets();var innerWidth=ed-ef.left-ef.right;var innerHeight=eb-ef.top-ef.bottom;var ej=this.getDecorator();var ee={left:0,right:0,top:0,bottom:0};if(ej){ej=qx.theme.manager.Decoration.getInstance().resolve(ej);ee=ej.getPadding();}
;var ec={top:this.getPaddingTop()+ee.top,right:this.getPaddingRight()+ee.right,bottom:this.getPaddingBottom()+ee.bottom,left:this.getPaddingLeft()+ee.left};this.__iG.renderLayout(innerWidth,innerHeight,ec);}
else if(this.hasLayoutChildren()){throw new Error(K+this._findTopControl()+k);}
;}
;if(eh.position&&this.hasListener(p)){this.fireDataEvent(p,this.getBounds());}
;if(eh.size&&this.hasListener(R)){this.fireDataEvent(R,this.getBounds());}
;delete this._updateInsets;return eh;}
,__iH:null,clearSeparators:function(){var en=this.__iH;if(!en){return;}
;var eo=qx.ui.core.Widget.__iD;var content=this.getContentElement();var em;for(var i=0,l=en.length;i<l;i++ ){em=en[i];eo.poolObject(em);content.remove(em.getContentElement());}
;en.length=0;}
,renderSeparator:function(eq,er){var ep=qx.ui.core.Widget.__iD.getObject(qx.ui.core.Widget);ep.set({decorator:eq});var et=ep.getContentElement();this.getContentElement().add(et);var es=et.getDomElement();if(es){es.style.top=er.top+cF;es.style.left=er.left+cF;es.style.width=er.width+cF;es.style.height=er.height+cF;}
else {et.setStyles({left:er.left+cF,top:er.top+cF,width:er.width+cF,height:er.height+cF});}
;if(!this.__iH){this.__iH=[];}
;this.__iH.push(ep);}
,_computeSizeHint:function(){var eA=this.getWidth();var eu=this.getMinWidth();var ev=this.getMaxWidth();var ey=this.getHeight();var ew=this.getMinHeight();var ex=this.getMaxHeight();{}
;var eB=this._getContentHint();var ez=this.getInsets();var eD=ez.left+ez.right;var eC=ez.top+ez.bottom;if(eA==null){eA=eB.width+eD;}
;if(ey==null){ey=eB.height+eC;}
;if(eu==null){eu=eD;if(eB.minWidth!=null){eu+=eB.minWidth;if(eu>ev&&ev!=null){eu=ev;}
;}
;}
;if(ew==null){ew=eC;if(eB.minHeight!=null){ew+=eB.minHeight;if(ew>ex&&ex!=null){ew=ex;}
;}
;}
;if(ev==null){if(eB.maxWidth==null){ev=Infinity;}
else {ev=eB.maxWidth+eD;if(ev<eu&&eu!=null){ev=eu;}
;}
;}
;if(ex==null){if(eB.maxHeight==null){ex=Infinity;}
else {ex=eB.maxHeight+eC;if(ex<ew&&ew!=null){ex=ew;}
;}
;}
;return {width:eA,minWidth:eu,maxWidth:ev,height:ey,minHeight:ew,maxHeight:ex};}
,invalidateLayoutCache:function(){qx.ui.core.LayoutItem.prototype.invalidateLayoutCache.call(this);if(this.__iG){this.__iG.invalidateLayoutCache();}
;}
,_getContentHint:function(){var eF=this.__iG;if(eF){if(this.hasLayoutChildren()){var eG=eF.getSizeHint();{var eE;}
;return eG;}
else {return {width:0,height:0};}
;}
else {return {width:100,height:50};}
;}
,_getHeightForWidth:function(eL){var eK=this.getInsets();var eH=eK.left+eK.right;var eN=eK.top+eK.bottom;var eM=eL-eH;var eI=this._getLayout();if(eI&&eI.hasHeightForWidth()){var eO=eI.getHeightForWidth(eL);}
else {eO=this._getContentHeightForWidth(eM);}
;var eJ=eO+eN;return eJ;}
,_getContentHeightForWidth:function(eP){throw new Error(cX);}
,getInsets:function(){var top=this.getPaddingTop();var eQ=this.getPaddingRight();var eR=this.getPaddingBottom();var eU=this.getPaddingLeft();if(this.getDecorator()){var eT=qx.theme.manager.Decoration.getInstance().resolve(this.getDecorator());var eS=eT.getInsets();{}
;top+=eS.top;eQ+=eS.right;eR+=eS.bottom;eU+=eS.left;}
;return {"top":top,"right":eQ,"bottom":eR,"left":eU};}
,getInnerSize:function(){var eW=this.getBounds();if(!eW){return null;}
;var eV=this.getInsets();return {width:eW.width-eV.left-eV.right,height:eW.height-eV.top-eV.bottom};}
,fadeOut:function(eX){return this.getContentElement().fadeOut(eX);}
,fadeIn:function(eY){return this.getContentElement().fadeIn(eY);}
,show:function(){this.setVisibility(L);}
,hide:function(){this.setVisibility(cI);}
,exclude:function(){this.setVisibility(db);}
,isVisible:function(){return this.getVisibility()===L;}
,isHidden:function(){return this.getVisibility()!==L;}
,isExcluded:function(){return this.getVisibility()===db;}
,isSeeable:function(){qx.ui.core.queue.Manager.flush();var fa=this.getContentElement().getDomElement();if(fa){return fa.offsetWidth>0;}
;return false;}
,__iI:function(){var fc=this._createContentElement();fc.setAttribute(W,this.toHashCode());{}
;var fb={"zIndex":10,"boxSizing":dB};if(!qx.ui.root.Inline||!(this instanceof qx.ui.root.Inline)){fb.position=dL;}
;fc.setStyles(fb);return fc;}
,_createContentElement:function(){return new qx.html.Element(d,{overflowX:cI,overflowY:cI});}
,getContainerElement:function(){{}
;return this.__iC;}
,getContentElement:function(){return this.__iC;}
,__iJ:null,getLayoutChildren:function(){var fe=this.__iJ;if(!fe){return this.__iK;}
;var ff;for(var i=0,l=fe.length;i<l;i++ ){var fd=fe[i];if(fd.hasUserBounds()||fd.isExcluded()){if(ff==null){ff=fe.concat();}
;qx.lang.Array.remove(ff,fd);}
;}
;return ff||fe;}
,scheduleLayoutUpdate:function(){qx.ui.core.queue.Layout.add(this);}
,invalidateLayoutChildren:function(){var fg=this.__iG;if(fg){fg.invalidateChildrenCache();}
;qx.ui.core.queue.Layout.add(this);}
,hasLayoutChildren:function(){var fi=this.__iJ;if(!fi){return false;}
;var fh;for(var i=0,l=fi.length;i<l;i++ ){fh=fi[i];if(!fh.hasUserBounds()&&!fh.isExcluded()){return true;}
;}
;return false;}
,getChildrenContainer:function(){return this;}
,__iK:[],_getChildren:function(){return this.__iJ||this.__iK;}
,_indexOf:function(fk){var fj=this.__iJ;if(!fj){return -1;}
;return fj.indexOf(fk);}
,_hasChildren:function(){var fl=this.__iJ;return fl!=null&&(!!fl[0]);}
,addChildrenToQueue:function(fm){var fn=this.__iJ;if(!fn){return;}
;var fo;for(var i=0,l=fn.length;i<l;i++ ){fo=fn[i];fm.push(fo);fo.addChildrenToQueue(fm);}
;}
,_add:function(fq,fp){{}
;if(fq.getLayoutParent()==this){qx.lang.Array.remove(this.__iJ,fq);}
;if(this.__iJ){this.__iJ.push(fq);}
else {this.__iJ=[fq];}
;this.__iL(fq,fp);}
,_addAt:function(fu,fr,ft){if(!this.__iJ){this.__iJ=[];}
;if(fu.getLayoutParent()==this){qx.lang.Array.remove(this.__iJ,fu);}
;var fs=this.__iJ[fr];if(fs===fu){fu.setLayoutProperties(ft);}
;if(fs){qx.lang.Array.insertBefore(this.__iJ,fu,fs);}
else {this.__iJ.push(fu);}
;this.__iL(fu,ft);}
,_addBefore:function(fv,fx,fw){{}
;if(fv==fx){return;}
;if(!this.__iJ){this.__iJ=[];}
;if(fv.getLayoutParent()==this){qx.lang.Array.remove(this.__iJ,fv);}
;qx.lang.Array.insertBefore(this.__iJ,fv,fx);this.__iL(fv,fw);}
,_addAfter:function(fA,fy,fz){{}
;if(fA==fy){return;}
;if(!this.__iJ){this.__iJ=[];}
;if(fA.getLayoutParent()==this){qx.lang.Array.remove(this.__iJ,fA);}
;qx.lang.Array.insertAfter(this.__iJ,fA,fy);this.__iL(fA,fz);}
,_remove:function(fB){if(!this.__iJ){throw new Error(cC);}
;qx.lang.Array.remove(this.__iJ,fB);this.__iM(fB);}
,_removeAt:function(fC){if(!this.__iJ){throw new Error(cC);}
;var fD=this.__iJ[fC];qx.lang.Array.removeAt(this.__iJ,fC);this.__iM(fD);return fD;}
,_removeAll:function(){if(!this.__iJ){return [];}
;var fE=this.__iJ.concat();this.__iJ.length=0;for(var i=fE.length-1;i>=0;i-- ){this.__iM(fE[i]);}
;qx.ui.core.queue.Layout.add(this);return fE;}
,_afterAddChild:null,_afterRemoveChild:null,__iL:function(fG,fF){{}
;var parent=fG.getLayoutParent();if(parent&&parent!=this){parent._remove(fG);}
;fG.setLayoutParent(this);if(fF){fG.setLayoutProperties(fF);}
else {this.updateLayoutProperties();}
;if(this._afterAddChild){this._afterAddChild(fG);}
;}
,__iM:function(fH){{}
;if(fH.getLayoutParent()!==this){throw new Error(T+fH+dm);}
;fH.setLayoutParent(null);if(this.__iG){this.__iG.invalidateChildrenCache();}
;qx.ui.core.queue.Layout.add(this);if(this._afterRemoveChild){this._afterRemoveChild(fH);}
;}
,capture:function(fI){this.getContentElement().capture(fI);}
,releaseCapture:function(){this.getContentElement().releaseCapture();}
,_applyPadding:function(fK,fJ,name){this._updateInsets=true;qx.ui.core.queue.Layout.add(this);this.__iN(name,fK);}
,__iN:function(fL,fO){var content=this.getContentElement();var fM=this.getDecorator();fM=qx.theme.manager.Decoration.getInstance().resolve(fM);if(fM){var fN=qx.Bootstrap.firstLow(fL.replace(dE,dA));fO+=fM.getPadding()[fN]||0;}
;content.setStyle(fL,fO+cF);}
,_applyDecorator:function(fQ,fP){var content=this.getContentElement();if(fP){fP=qx.theme.manager.Decoration.getInstance().getCssClassName(fP);content.removeClass(fP);}
;if(fQ){fQ=qx.theme.manager.Decoration.getInstance().addCssClass(fQ);content.addClass(fQ);}
;}
,_applyToolTipText:function(fT,fS){if(qx.core.Environment.get(u)){if(this.__iF){return;}
;var fR=qx.locale.Manager.getInstance();this.__iF=fR.addListener(dJ,function(){var fU=this.getToolTipText();if(fU&&fU.translate){this.setToolTipText(fU.translate());}
;}
,this);}
;}
,_applyTextColor:function(fW,fV){}
,_applyZIndex:function(fY,fX){this.getContentElement().setStyle(U,fY==null?0:fY);}
,_applyVisibility:function(gb,ga){var content=this.getContentElement();if(gb===L){content.show();}
else {content.hide();}
;var parent=this.$$parent;if(parent&&(ga==null||gb==null||ga===db||gb===db)){parent.invalidateLayoutChildren();}
;qx.ui.core.queue.Visibility.add(this);}
,_applyOpacity:function(gd,gc){this.getContentElement().setStyle(cB,gd==1?null:gd);}
,_applyCursor:function(gf,ge){if(gf==null&&!this.isSelectable()){gf=dr;}
;this.getContentElement().setStyle(cL,gf,qx.core.Environment.get(df)==dH);}
,_applyBackgroundColor:function(gj,gi){var gh=this.getBackgroundColor();var content=this.getContentElement();var gg=qx.theme.manager.Color.getInstance().resolve(gh);content.setStyle(a,gg);}
,_applyFont:function(gl,gk){}
,_onChangeTheme:function(){qx.ui.core.LayoutItem.prototype._onChangeTheme.call(this);this.updateAppearance();var gm=this.getDecorator();this._applyDecorator(null,gm);this._applyDecorator(gm);gm=this.getFont();if(qx.lang.Type.isString(gm)){this._applyFont(gm,gm);}
;gm=this.getTextColor();if(qx.lang.Type.isString(gm)){this._applyTextColor(gm,gm);}
;gm=this.getBackgroundColor();if(qx.lang.Type.isString(gm)){this._applyBackgroundColor(gm,gm);}
;}
,__iO:null,$$stateChanges:null,_forwardStates:null,hasState:function(go){var gn=this.__iO;return !!gn&&!!gn[go];}
,addState:function(gs){var gr=this.__iO;if(!gr){gr=this.__iO={};}
;if(gr[gs]){return;}
;this.__iO[gs]=true;if(gs===cK){this.syncAppearance();}
else if(!qx.ui.core.queue.Visibility.isVisible(this)){this.$$stateChanges=true;}
else {qx.ui.core.queue.Appearance.add(this);}
;var forward=this._forwardStates;var gq=this.__iR;if(forward&&forward[gs]&&gq){var gp;for(var gt in gq){gp=gq[gt];if(gp instanceof qx.ui.core.Widget){gq[gt].addState(gs);}
;}
;}
;}
,removeState:function(gx){var gw=this.__iO;if(!gw||!gw[gx]){return;}
;delete this.__iO[gx];if(gx===cK){this.syncAppearance();}
else if(!qx.ui.core.queue.Visibility.isVisible(this)){this.$$stateChanges=true;}
else {qx.ui.core.queue.Appearance.add(this);}
;var forward=this._forwardStates;var gv=this.__iR;if(forward&&forward[gx]&&gv){for(var gy in gv){var gu=gv[gy];if(gu instanceof qx.ui.core.Widget){gu.removeState(gx);}
;}
;}
;}
,replaceState:function(gA,gD){var gC=this.__iO;if(!gC){gC=this.__iO={};}
;if(!gC[gD]){gC[gD]=true;}
;if(gC[gA]){delete gC[gA];}
;if(!qx.ui.core.queue.Visibility.isVisible(this)){this.$$stateChanges=true;}
else {qx.ui.core.queue.Appearance.add(this);}
;var forward=this._forwardStates;var gB=this.__iR;if(forward&&forward[gD]&&gB){for(var gE in gB){var gz=gB[gE];if(gz instanceof qx.ui.core.Widget){gz.replaceState(gA,gD);}
;}
;}
;}
,__iP:null,__iQ:null,syncAppearance:function(){var gJ=this.__iO;var gI=this.__iP;var gK=qx.theme.manager.Appearance.getInstance();var gG=qx.core.Property.$$method.setThemed;var gO=qx.core.Property.$$method.resetThemed;if(this.__iQ){delete this.__iQ;if(gI){var gF=gK.styleFrom(gI,gJ,null,this.getAppearance());gI=null;}
;}
;if(!gI){var gH=this;var gL=[];do {gL.push(gH.$$subcontrol||gH.getAppearance());}
while(gH=gH.$$subparent);gI=gL.reverse().join(dq).replace(/#[0-9]+/g,dA);this.__iP=gI;}
;var gN=gK.styleFrom(gI,gJ,null,this.getAppearance());if(gN){if(gF){for(var gM in gF){if(gN[gM]===undefined){this[gO[gM]]();}
;}
;}
;{var gM;}
;for(var gM in gN){gN[gM]===undefined?this[gO[gM]]():this[gG[gM]](gN[gM]);}
;}
else if(gF){for(var gM in gF){this[gO[gM]]();}
;}
;this.fireDataEvent(E,this.__iO);}
,_applyAppearance:function(gQ,gP){this.updateAppearance();}
,checkAppearanceNeeds:function(){if(!this.__iE){qx.ui.core.queue.Appearance.add(this);this.__iE=true;}
else if(this.$$stateChanges){qx.ui.core.queue.Appearance.add(this);delete this.$$stateChanges;}
;}
,updateAppearance:function(){this.__iQ=true;qx.ui.core.queue.Appearance.add(this);var gT=this.__iR;if(gT){var gR;for(var gS in gT){gR=gT[gS];if(gR instanceof qx.ui.core.Widget){gR.updateAppearance();}
;}
;}
;}
,syncWidget:function(gU){}
,getEventTarget:function(){var gV=this;while(gV.getAnonymous()){gV=gV.getLayoutParent();if(!gV){return null;}
;}
;return gV;}
,getFocusTarget:function(){var gW=this;if(!gW.getEnabled()){return null;}
;while(gW.getAnonymous()||!gW.getFocusable()){gW=gW.getLayoutParent();if(!gW||!gW.getEnabled()){return null;}
;}
;return gW;}
,getFocusElement:function(){return this.getContentElement();}
,isTabable:function(){return (!!this.getContentElement().getDomElement())&&this.isFocusable();}
,_applyFocusable:function(ha,gX){var gY=this.getFocusElement();if(ha){var hb=this.getTabIndex();if(hb==null){hb=1;}
;gY.setAttribute(dD,hb);gY.setStyle(cH,cy);}
else {if(gY.isNativelyFocusable()){gY.setAttribute(dD,-1);}
else if(gX){gY.setAttribute(dD,null);}
;}
;}
,_applyKeepFocus:function(hd){var hc=this.getFocusElement();hc.setAttribute(dI,hd?Y:null);}
,_applyKeepActive:function(hf){var he=this.getContentElement();he.setAttribute(dM,hf?Y:null);}
,_applyTabIndex:function(hg){if(hg==null){hg=1;}
else if(hg<1||hg>32000){throw new Error(dS);}
;if(this.getFocusable()&&hg!=null){this.getFocusElement().setAttribute(dD,hg);}
;}
,_applySelectable:function(hi,hh){if(hh!==null){this._applyCursor(this.getCursor());}
;this.getContentElement().setSelectable(hi);}
,_applyEnabled:function(hk,hj){if(hk===false){this.addState(o);this.removeState(cK);if(this.isFocusable()){this.removeState(n);this._applyFocusable(false,true);}
;if(this.isDraggable()){this._applyDraggable(false,true);}
;if(this.isDroppable()){this._applyDroppable(false,true);}
;}
else {this.removeState(o);if(this.isFocusable()){this._applyFocusable(true,false);}
;if(this.isDraggable()){this._applyDraggable(true,false);}
;if(this.isDroppable()){this._applyDroppable(true,false);}
;}
;}
,_applyNativeContextMenu:function(hm,hl,name){}
,_applyContextMenu:function(ho,hn){if(hn){hn.removeState(dy);if(hn.getOpener()==this){hn.resetOpener();}
;if(!ho){this.removeListener(dy,this._onContextMenuOpen);hn.removeListener(P,this._onBeforeContextMenuOpen,this);}
;}
;if(ho){ho.setOpener(this);ho.addState(dy);if(!hn){this.addListener(dy,this._onContextMenuOpen);ho.addListener(P,this._onBeforeContextMenuOpen,this);}
;}
;}
,_onContextMenuOpen:function(e){this.getContextMenu().openAtMouse(e);e.stop();}
,_onBeforeContextMenuOpen:function(e){if(e.getData()==L&&this.hasListener(du)){this.fireDataEvent(du,e);}
;}
,_onStopEvent:function(e){e.stopPropagation();}
,_getDragDropCursor:function(){return qx.ui.core.DragDropCursor.getInstance();}
,_applyDraggable:function(hq,hp){if(qx.event.handler.MouseEmulation.ON){return;}
;if(!this.isEnabled()&&hq===true){hq=false;}
;this._getDragDropCursor();if(hq){this.addListener(s,this._onDragStart);this.addListener(b,this._onDrag);this.addListener(A,this._onDragEnd);this.addListener(v,this._onDragChange);}
else {this.removeListener(s,this._onDragStart);this.removeListener(b,this._onDrag);this.removeListener(A,this._onDragEnd);this.removeListener(v,this._onDragChange);}
;this.getContentElement().setAttribute(D,hq?Y:null);}
,_applyDroppable:function(hs,hr){if(!this.isEnabled()&&hs===true){hs=false;}
;this.getContentElement().setAttribute(cM,hs?Y:null);}
,_onDragStart:function(e){this._getDragDropCursor().placeToMouse(e);this.getApplicationRoot().setGlobalCursor(dr);}
,_onDrag:function(e){this._getDragDropCursor().placeToMouse(e);}
,_onDragEnd:function(e){this._getDragDropCursor().moveTo(-1000,-1000);this.getApplicationRoot().resetGlobalCursor();}
,_onDragChange:function(e){var ht=this._getDragDropCursor();var hu=e.getCurrentAction();hu?ht.setAction(hu):ht.resetAction();}
,visualizeFocus:function(){this.addState(n);}
,visualizeBlur:function(){this.removeState(n);}
,scrollChildIntoView:function(hz,hy,hx,hw){hw=typeof hw==ds?true:hw;var hv=qx.ui.core.queue.Layout;var parent;if(hw){hw=!hv.isScheduled(hz);parent=hz.getLayoutParent();if(hw&&parent){hw=!hv.isScheduled(parent);if(hw){parent.getChildren().forEach(function(hA){hw=hw&&!hv.isScheduled(hA);}
);}
;}
;}
;this.scrollChildIntoViewX(hz,hy,hw);this.scrollChildIntoViewY(hz,hx,hw);}
,scrollChildIntoViewX:function(hD,hB,hC){this.getContentElement().scrollChildIntoViewX(hD.getContentElement(),hB,hC);}
,scrollChildIntoViewY:function(hG,hE,hF){this.getContentElement().scrollChildIntoViewY(hG.getContentElement(),hE,hF);}
,focus:function(){if(this.isFocusable()){this.getFocusElement().focus();}
else {throw new Error(cW);}
;}
,blur:function(){if(this.isFocusable()){this.getFocusElement().blur();}
else {throw new Error(cW);}
;}
,activate:function(){this.getContentElement().activate();}
,deactivate:function(){this.getContentElement().deactivate();}
,tabFocus:function(){this.getFocusElement().focus();}
,hasChildControl:function(hH){if(!this.__iR){return false;}
;return !!this.__iR[hH];}
,__iR:null,_getCreatedChildControls:function(){return this.__iR;}
,getChildControl:function(hK,hJ){if(!this.__iR){if(hJ){return null;}
;this.__iR={};}
;var hI=this.__iR[hK];if(hI){return hI;}
;if(hJ===true){return null;}
;return this._createChildControl(hK);}
,_showChildControl:function(hM){var hL=this.getChildControl(hM);hL.show();return hL;}
,_excludeChildControl:function(hO){var hN=this.getChildControl(hO,true);if(hN){hN.exclude();}
;}
,_isChildControlVisible:function(hQ){var hP=this.getChildControl(hQ,true);if(hP){return hP.isVisible();}
;return false;}
,_releaseChildControl:function(hU){var hR=this.getChildControl(hU,false);if(!hR){throw new Error(r+hU);}
;delete hR.$$subcontrol;delete hR.$$subparent;var hS=this.__iO;var forward=this._forwardStates;if(hS&&forward&&hR instanceof qx.ui.core.Widget){for(var hT in hS){if(forward[hT]){hR.removeState(hT);}
;}
;}
;delete this.__iR[hU];return hR;}
,_createChildControl:function(ia){if(!this.__iR){this.__iR={};}
else if(this.__iR[ia]){throw new Error(C+ia+dO);}
;var hW=ia.indexOf(J);try{if(hW==-1){var hV=this._createChildControlImpl(ia);}
else {var hV=this._createChildControlImpl(ia.substring(0,hW),ia.substring(hW+1,ia.length));}
;}
catch(ib){ib.message=dd+ia+G+this.toString()+cQ+ib.message;throw ib;}
;if(!hV){throw new Error(r+ia);}
;hV.$$subcontrol=ia;hV.$$subparent=this;var hX=this.__iO;var forward=this._forwardStates;if(hX&&forward&&hV instanceof qx.ui.core.Widget){for(var hY in hX){if(forward[hY]){hV.addState(hY);}
;}
;}
;this.fireDataEvent(q,hV);return this.__iR[ia]=hV;}
,_createChildControlImpl:function(ie,ic){return null;}
,_disposeChildControls:function(){var ij=this.__iR;if(!ij){return;}
;var ih=qx.ui.core.Widget;for(var ii in ij){var ig=ij[ii];if(!ih.contains(this,ig)){ig.destroy();}
else {ig.dispose();}
;}
;delete this.__iR;}
,_findTopControl:function(){var ik=this;while(ik){if(!ik.$$subparent){return ik;}
;ik=ik.$$subparent;}
;return null;}
,getContainerLocation:function(il){{}
;return this.getContentLocation(il);}
,getContentLocation:function(io){var im=this.getContentElement().getDomElement();return im?qx.bom.element.Location.get(im,io):null;}
,setDomLeft:function(iq){var ip=this.getContentElement().getDomElement();if(ip){ip.style.left=iq+cF;}
else {throw new Error(dc);}
;}
,setDomTop:function(is){var ir=this.getContentElement().getDomElement();if(ir){ir.style.top=is+cF;}
else {throw new Error(dc);}
;}
,setDomPosition:function(iu,top){var it=this.getContentElement().getDomElement();if(it){it.style.left=iu+cF;it.style.top=top+cF;}
else {throw new Error(dc);}
;}
,destroy:function(){if(this.$$disposed){return;}
;var parent=this.$$parent;if(parent){parent._remove(this);}
;qx.ui.core.queue.Dispose.add(this);}
,clone:function(){var iv=qx.ui.core.LayoutItem.prototype.clone.call(this);if(this.getChildren){var iw=this.getChildren();for(var i=0,l=iw.length;i<l;i++ ){iv.add(iw[i].clone());}
;}
;return iv;}
},destruct:function(){if(!qx.core.ObjectRegistry.inShutDown){if(qx.core.Environment.get(u)){if(this.__iF){qx.locale.Manager.getInstance().removeListenerById(this.__iF);}
;}
;var ix=this.getContentElement();if(ix){ix.setAttribute(W,null,true);}
;this._disposeChildControls();qx.ui.core.queue.Appearance.remove(this);qx.ui.core.queue.Layout.remove(this);qx.ui.core.queue.Visibility.remove(this);qx.ui.core.queue.Widget.remove(this);}
;if(this.getContextMenu()){this.setContextMenu(null);}
;if(!qx.core.ObjectRegistry.inShutDown){this.clearSeparators();this.__iH=null;}
else {this._disposeArray(cx);}
;this._disposeArray(f);this.__iO=this.__iR=null;this._disposeObjects(cG,cz);}
});}
)();
(function(){var a="Missing renderLayout() implementation!",b="abstract",c="It is not possible to manually set the connected widget.",d="qx.ui.layout.Abstract",e="Missing getHeightForWidth() implementation!";qx.Class.define(d,{type:b,extend:qx.core.Object,members:{__ee:null,_invalidChildrenCache:null,__iS:null,invalidateLayoutCache:function(){this.__ee=null;}
,renderLayout:function(g,h,f){this.warn(a);}
,getSizeHint:function(){if(this.__ee){return this.__ee;}
;return this.__ee=this._computeSizeHint();}
,hasHeightForWidth:function(){return false;}
,getHeightForWidth:function(i){this.warn(e);return null;}
,_computeSizeHint:function(){return null;}
,invalidateChildrenCache:function(){this._invalidChildrenCache=true;}
,verifyLayoutProperty:null,_clearSeparators:function(){var j=this.__iS;if(j instanceof qx.ui.core.LayoutItem){j.clearSeparators();}
;}
,_renderSeparator:function(k,l){this.__iS.renderSeparator(k,l);}
,connectToWidget:function(m){if(m&&this.__iS){throw new Error(c);}
;this.__iS=m;this.invalidateChildrenCache();}
,_getWidget:function(){return this.__iS;}
,_applyLayoutChange:function(){if(this.__iS){this.__iS.scheduleLayoutUpdate();}
;}
,_getLayoutChildren:function(){return this.__iS.getLayoutChildren();}
},destruct:function(){this.__iS=this.__ee=null;}
});}
)();
(function(){var a="blur",b="activate",c="focus",d="qx.ui.core.EventHandler";qx.Class.define(d,{extend:qx.core.Object,implement:qx.event.IEventHandler,construct:function(){qx.core.Object.call(this);this.__er=qx.event.Registration.getManager(window);}
,statics:{PRIORITY:qx.event.Registration.PRIORITY_FIRST,SUPPORTED_TYPES:{mousemove:1,mouseover:1,mouseout:1,mousedown:1,mouseup:1,click:1,dblclick:1,contextmenu:1,mousewheel:1,keyup:1,keydown:1,keypress:1,keyinput:1,capture:1,losecapture:1,focusin:1,focusout:1,focus:1,blur:1,activate:1,deactivate:1,appear:1,disappear:1,dragstart:1,dragend:1,dragover:1,dragleave:1,drop:1,drag:1,dragchange:1,droprequest:1,touchstart:1,touchend:1,touchmove:1,touchcancel:1,tap:1,longtap:1,swipe:1},IGNORE_CAN_HANDLE:false},members:{__er:null,__jd:{focusin:1,focusout:1,focus:1,blur:1},__je:{mouseover:1,mouseout:1,appear:1,disappear:1},canHandleEvent:function(f,e){return f instanceof qx.ui.core.Widget;}
,_dispatchEvent:function(h){var n=h.getTarget();var m=qx.ui.core.Widget.getWidgetByElement(n);var o=false;while(m&&m.isAnonymous()){var o=true;m=m.getLayoutParent();}
;if(m&&o&&h.getType()==b){m.getContentElement().activate();}
;if(this.__jd[h.getType()]){m=m&&m.getFocusTarget();if(!m){return;}
;}
;if(h.getRelatedTarget){var v=h.getRelatedTarget();var u=qx.ui.core.Widget.getWidgetByElement(v);while(u&&u.isAnonymous()){u=u.getLayoutParent();}
;if(u){if(this.__jd[h.getType()]){u=u.getFocusTarget();}
;if(u===m){return;}
;}
;}
;var q=h.getCurrentTarget();var s=qx.ui.core.Widget.getWidgetByElement(q);if(!s||s.isAnonymous()){return;}
;if(this.__jd[h.getType()]){s=s.getFocusTarget();}
;var t=h.getType();if(!s||!(s.isEnabled()||this.__je[t])){return;}
;var g=h.getEventPhase()==qx.event.type.Event.CAPTURING_PHASE;var p=this.__er.getListeners(s,t,g);if(!p||p.length===0){return;}
;var j=qx.event.Pool.getInstance().getObject(h.constructor);h.clone(j);j.setTarget(m);j.setRelatedTarget(u||null);j.setCurrentTarget(s);var w=h.getOriginalTarget();if(w){var k=qx.ui.core.Widget.getWidgetByElement(w);while(k&&k.isAnonymous()){k=k.getLayoutParent();}
;j.setOriginalTarget(k);}
else {j.setOriginalTarget(n);}
;for(var i=0,l=p.length;i<l;i++ ){var r=p[i].context||s;p[i].handler.call(r,j);}
;if(j.getPropagationStopped()){h.stopPropagation();}
;if(j.getDefaultPrevented()){h.preventDefault();}
;qx.event.Pool.getInstance().poolObject(j);}
,registerEvent:function(z,y,x){var A;if(y===c||y===a){A=z.getFocusElement();}
else {A=z.getContentElement();}
;if(A){A.addListener(y,this._dispatchEvent,this,x);}
;}
,unregisterEvent:function(D,C,B){var E;if(C===c||C===a){E=D.getFocusElement();}
else {E=D.getContentElement();}
;if(E){E.removeListener(C,this._dispatchEvent,this,B);}
;}
},destruct:function(){this.__er=null;}
,defer:function(F){qx.event.Registration.addHandler(F);}
});}
)();
(function(){var a="Image could not be loaded: ",b="Boolean",c="px",d=".png",e="background-image",f="engine.version",g="scale",h="changeSource",i="div",j="nonScaled",k="qx.ui.basic.Image",l="loaded",m="0 0",n="__jf",o=", no-repeat",p="replacement",q="backgroundImage",r="backgroundRepeat",s="-disabled.$1",t="class",u="qx.event.type.Event",v="loadingFailed",w="css.alphaimageloaderneeded",x="String",y="browser.documentmode",z="backgroundPosition",A="border-box",B="left",C="_applySource",D="$$widget",E="top",F="scaled",G=", ",H="image",I="mshtml",J="engine.name",K=", 0 0",L="_applyScale",M="position",N="img",O="no-repeat",P="background-position",Q="hidden",R="alphaScaled",S=",",T="absolute";qx.Class.define(k,{extend:qx.ui.core.Widget,construct:function(U){this.__jf={};qx.ui.core.Widget.call(this);if(U){this.setSource(U);}
;}
,properties:{source:{check:x,init:null,nullable:true,event:h,apply:C,themeable:true},scale:{check:b,init:false,themeable:true,apply:L},appearance:{refine:true,init:H},allowShrinkX:{refine:true,init:false},allowShrinkY:{refine:true,init:false},allowGrowX:{refine:true,init:false},allowGrowY:{refine:true,init:false}},events:{loadingFailed:u,loaded:u},members:{__jg:null,__jh:null,__hf:null,__jf:null,__ji:null,__jj:null,_onChangeTheme:function(){qx.ui.core.Widget.prototype._onChangeTheme.call(this);this._styleSource();}
,getContentElement:function(){return this.__jn();}
,_createContentElement:function(){return this.__jn();}
,_getContentHint:function(){return {width:this.__jg||0,height:this.__jh||0};}
,_applyDecorator:function(X,W){qx.ui.core.Widget.prototype._applyDecorator.call(this,X,W);var Y=this.getSource();Y=qx.util.AliasManager.getInstance().resolve(Y);var V=this.getContentElement();if(this.__jj){V=V.getChild(0);}
;this.__ju(V,Y);}
,_applyPadding:function(bb,ba,name){qx.ui.core.Widget.prototype._applyPadding.call(this,bb,ba,name);var bc=this.getContentElement();if(this.__jj){bc.getChild(0).setStyles({top:this.getPaddingTop()||0,left:this.getPaddingLeft()||0});}
else {bc.setPadding(this.getPaddingLeft()||0,this.getPaddingTop()||0);}
;}
,renderLayout:function(bf,top,bd,bg){qx.ui.core.Widget.prototype.renderLayout.call(this,bf,top,bd,bg);var be=this.getContentElement();if(this.__jj){be.getChild(0).setStyles({width:bd-(this.getPaddingLeft()||0)-(this.getPaddingRight()||0),height:bg-(this.getPaddingTop()||0)-(this.getPaddingBottom()||0),top:this.getPaddingTop()||0,left:this.getPaddingLeft()||0});}
;}
,_applyEnabled:function(bi,bh){qx.ui.core.Widget.prototype._applyEnabled.call(this,bi,bh);if(this.getSource()){this._styleSource();}
;}
,_applySource:function(bj){this._styleSource();}
,_applyScale:function(bk){this._styleSource();}
,__jk:function(bl){this.__hf=bl;}
,__jl:function(){if(this.__hf==null){var bn=this.getSource();var bm=false;if(bn!=null){bm=qx.lang.String.endsWith(bn,d);}
;if(this.getScale()&&bm&&qx.core.Environment.get(w)){this.__hf=R;}
else if(this.getScale()){this.__hf=F;}
else {this.__hf=j;}
;}
;return this.__hf;}
,__jm:function(bq){var bp;var bo;if(bq==R){bp=true;bo=i;}
else if(bq==j){bp=false;bo=i;}
else {bp=true;bo=N;}
;var bs=new qx.html.Image(bo);bs.setAttribute(D,this.toHashCode());bs.setScale(bp);bs.setStyles({"overflowX":Q,"overflowY":Q,"boxSizing":A});if(qx.core.Environment.get(w)){var br=this.__jj=new qx.html.Element(i);br.setAttribute(D,this.toHashCode());br.setStyle(M,T);br.add(bs);return br;}
;return bs;}
,__jn:function(){if(this.$$disposed){return null;}
;var bt=this.__jl();if(this.__jf[bt]==null){this.__jf[bt]=this.__jm(bt);}
;var bu=this.__jf[bt];if(!this.__ji){this.__ji=bu;}
;return bu;}
,_styleSource:function(){var bv=qx.util.AliasManager.getInstance().resolve(this.getSource());var by=this.getContentElement();if(this.__jj){by=by.getChild(0);}
;if(!bv){by.resetSource();return;}
;this.__jo(bv);if((qx.core.Environment.get(J)==I)&&(parseInt(qx.core.Environment.get(f),10)<9||qx.core.Environment.get(y)<9)){var bw=this.getScale()?g:O;by.tagNameHint=qx.bom.element.Decoration.getTagName(bw,bv);}
;var bx=this.__ji;if(this.__jj){bx=bx.getChild(0);}
;if(qx.util.ResourceManager.getInstance().has(bv)){this.__jq(bx,bv);}
else if(qx.io.ImageLoader.isLoaded(bv)){this.__jr(bx,bv);}
else {this.__js(bx,bv);}
;}
,__jo:qx.core.Environment.select(J,{"mshtml":function(bA){var bB=qx.core.Environment.get(w);var bz=qx.lang.String.endsWith(bA,d);if(bB&&bz){if(this.getScale()&&this.__jl()!=R){this.__jk(R);}
else if(!this.getScale()&&this.__jl()!=j){this.__jk(j);}
;}
else {if(this.getScale()&&this.__jl()!=F){this.__jk(F);}
else if(!this.getScale()&&this.__jl()!=j){this.__jk(j);}
;}
;this.__jp(this.__jn());}
,"default":function(bC){if(this.getScale()&&this.__jl()!=F){this.__jk(F);}
else if(!this.getScale()&&this.__jl(j)){this.__jk(j);}
;this.__jp(this.__jn());}
}),__jp:function(bG){var bF=this.__ji;if(bF!=bG){if(bF!=null){var bQ=c;var bD={};var bL=this.getBounds();if(bL!=null){bD.width=bL.width+bQ;bD.height=bL.height+bQ;}
;var bM=this.getInsets();bD.left=parseInt(bF.getStyle(B)||bM.left)+bQ;bD.top=parseInt(bF.getStyle(E)||bM.top)+bQ;bD.zIndex=10;var bJ=this.__jj?bG.getChild(0):bG;bJ.setStyles(bD,true);bJ.setSelectable(this.getSelectable());var bN=bF.getParent();if(bN){var bE=bN.getChildren().indexOf(bF);bN.removeAt(bE);bN.addAt(bG,bE);}
;var bI=bJ.getNodeName();bJ.setSource(null);var bH=this.__jj?this.__ji.getChild(0):this.__ji;bJ.tagNameHint=bI;bJ.setAttribute(t,bH.getAttribute(t));qx.html.Element.flush();var bP=bH.getDomElement();var bO=bG.getDomElement();if(bP&&bO){var bK=bP.$$hash;bP.$$hash=bO.$$hash;bO.$$hash=bK;}
;this.__ji=bG;}
;}
;}
,__jq:function(bS,bU){var bT=qx.util.ResourceManager.getInstance();if(!this.getEnabled()){var bR=bU.replace(/\.([a-z]+)$/,s);if(bT.has(bR)){bU=bR;this.addState(p);}
else {this.removeState(p);}
;}
;if(bS.getSource()===bU){return;}
;this.__ju(bS,bU);this.__jw(bT.getImageWidth(bU),bT.getImageHeight(bU));}
,__jr:function(bV,ca){var bX=qx.io.ImageLoader;this.__ju(bV,ca);var bY=bX.getWidth(ca);var bW=bX.getHeight(ca);this.__jw(bY,bW);}
,__js:function(cb,ce){var cf=qx.io.ImageLoader;{var cd,cc,self;}
;if(!cf.isFailed(ce)){cf.load(ce,this.__jv,this);}
else {if(cb!=null){cb.resetSource();}
;}
;}
,__ju:function(cg,cl){if(cg.getNodeName()==i){var co=qx.theme.manager.Decoration.getInstance().resolve(this.getDecorator());if(co){var cm=(co.getStartColor()&&co.getEndColor());var ck=co.getBackgroundImage();if(cm||ck){var ch=this.getScale()?g:O;var ci=qx.bom.element.Decoration.getAttributes(cl,ch);var cj=co.getStyles(true);var cn={"backgroundImage":ci.style.backgroundImage,"backgroundPosition":(ci.style.backgroundPosition||m),"backgroundRepeat":(ci.style.backgroundRepeat||O)};if(ck){cn[z]+=S+cj[P]||m;cn[r]+=G+co.getBackgroundRepeat();}
;if(cm){cn[z]+=K;cn[r]+=o;}
;cn[q]+=S+cj[e];cg.setStyles(cn);return;}
;}
else {cg.setSource(null);}
;}
;cg.setSource(cl);}
,__jv:function(cp,cq){if(this.$$disposed===true){return;}
;if(cp!==qx.util.AliasManager.getInstance().resolve(this.getSource())){return;}
;if(cq.failed){this.warn(a+cp);this.fireEvent(v);}
else if(cq.aborted){return;}
else {this.fireEvent(l);}
;this._styleSource();}
,__jw:function(cr,cs){if(cr!==this.__jg||cs!==this.__jh){this.__jg=cr;this.__jh=cs;qx.ui.core.queue.Layout.add(this);}
;}
},destruct:function(){delete this.__ji;this._disposeMap(n);}
});}
)();
(function(){var a="singleton",b="qx.util.LibraryManager";qx.Class.define(b,{extend:qx.core.Object,type:a,statics:{__jx:qx.$$libraries||{}},members:{has:function(c){return !!this.self(arguments).__jx[c];}
,get:function(d,e){return this.self(arguments).__jx[d][e]?this.self(arguments).__jx[d][e]:null;}
,set:function(f,g,h){this.self(arguments).__jx[f][g]=h;}
}});}
)();
(function(){var a="Microsoft.XMLHTTP",b="xhr",c="io.ssl",d="io.xhr",e="",f="file:",g="https:",h="webkit",i="gecko",j="activex",k="opera",l=".",m="io.maxrequests",n="qx.bom.client.Transport";qx.Bootstrap.define(n,{statics:{getMaxConcurrentRequestCount:function(){var p;var r=qx.bom.client.Engine.getVersion().split(l);var o=0;var s=0;var q=0;if(r[0]){o=r[0];}
;if(r[1]){s=r[1];}
;if(r[2]){q=r[2];}
;if(window.maxConnectionsPerServer){p=window.maxConnectionsPerServer;}
else if(qx.bom.client.Engine.getName()==k){p=8;}
else if(qx.bom.client.Engine.getName()==h){p=4;}
else if(qx.bom.client.Engine.getName()==i&&((o>1)||((o==1)&&(s>9))||((o==1)&&(s==9)&&(q>=1)))){p=6;}
else {p=2;}
;return p;}
,getSsl:function(){return window.location.protocol===g;}
,getXmlHttpRequest:function(){var t=window.ActiveXObject?(function(){if(window.location.protocol!==f){try{new window.XMLHttpRequest();return b;}
catch(u){}
;}
;try{new window.ActiveXObject(a);return j;}
catch(v){}
;}
)():(function(){try{new window.XMLHttpRequest();return b;}
catch(w){}
;}
)();return t||e;}
},defer:function(x){qx.core.Environment.add(m,x.getMaxConcurrentRequestCount);qx.core.Environment.add(c,x.getSsl);qx.core.Environment.add(d,x.getXmlHttpRequest);}
});}
)();
(function(){var a="mshtml",b="engine.name",c="//",d="io.ssl",e="",f="encoding",g="?",h="data",i="string",j="type",k="data:image/",l=";",m="/",n="resourceUri",o="qx.util.ResourceManager",p="singleton",q=",";qx.Class.define(o,{extend:qx.core.Object,type:p,construct:function(){qx.core.Object.call(this);}
,statics:{__G:qx.$$resources||{},__jy:{}},members:{has:function(r){return !!this.self(arguments).__G[r];}
,getData:function(s){return this.self(arguments).__G[s]||null;}
,getImageWidth:function(u){var t=this.self(arguments).__G[u];return t?t[0]:null;}
,getImageHeight:function(w){var v=this.self(arguments).__G[w];return v?v[1]:null;}
,getImageFormat:function(y){var x=this.self(arguments).__G[y];return x?x[2]:null;}
,getCombinedFormat:function(D){var A=e;var C=this.self(arguments).__G[D];var z=C&&C.length>4&&typeof (C[4])==i&&this.constructor.__G[C[4]];if(z){var E=C[4];var B=this.constructor.__G[E];A=B[2];}
;return A;}
,toUri:function(I){if(I==null){return I;}
;var F=this.self(arguments).__G[I];if(!F){return I;}
;if(typeof F===i){var H=F;}
else {var H=F[3];if(!H){return I;}
;}
;var G=e;if((qx.core.Environment.get(b)==a)&&qx.core.Environment.get(d)){G=this.self(arguments).__jy[H];}
;return G+qx.util.LibraryManager.getInstance().get(H,n)+m+I;}
,toDataUri:function(L){var K=this.constructor.__G[L];var N=this.constructor.__G[K[4]];var M;if(N){var J=N[4][L];M=k+J[j]+l+J[f]+q+J[h];}
else {M=this.toUri(L);}
;return M;}
},defer:function(P){if((qx.core.Environment.get(b)==a)){if(qx.core.Environment.get(d)){for(var Q in qx.$$libraries){var O;if(qx.util.LibraryManager.getInstance().get(Q,n)){O=qx.util.LibraryManager.getInstance().get(Q,n);}
else {P.__jy[Q]=e;continue;}
;if(O.match(/^\/\//)!=null){P.__jy[Q]=window.location.protocol;}
else if(O.match(/^\//)!=null){P.__jy[Q]=window.location.protocol+c+window.location.host;}
else if(O.match(/^\.\//)!=null){var S=document.URL;P.__jy[Q]=S.substring(0,S.lastIndexOf(m)+1);}
else if(O.match(/^http/)!=null){P.__jy[Q]=e;}
else {var R=window.location.href.indexOf(g);var T;if(R==-1){T=window.location.href;}
else {T=window.location.href.substring(0,R);}
;P.__jy[Q]=T.substring(0,T.lastIndexOf(m)+1);}
;}
;}
;}
;}
});}
)();
(function(){var a="0",b="qx/static",c="http://",d="https://",e="file://",f="qx.util.AliasManager",g="singleton",h=".",i="/",j="static";qx.Class.define(f,{type:g,extend:qx.util.ValueManager,construct:function(){qx.util.ValueManager.call(this);this.__jz={};this.add(j,b);}
,members:{__jz:null,_preprocess:function(n){var m=this._getDynamic();if(m[n]===false){return n;}
else if(m[n]===undefined){if(n.charAt(0)===i||n.charAt(0)===h||n.indexOf(c)===0||n.indexOf(d)===a||n.indexOf(e)===0){m[n]=false;return n;}
;if(this.__jz[n]){return this.__jz[n];}
;var l=n.substring(0,n.indexOf(i));var k=this.__jz[l];if(k!==undefined){m[n]=k+n.substring(l.length);}
;}
;return n;}
,add:function(o,q){this.__jz[o]=q;var p=this._getDynamic();for(var r in p){if(r.substring(0,r.indexOf(i))===o){p[r]=q+r.substring(o.length);}
;}
;}
,remove:function(s){delete this.__jz[s];}
,resolve:function(t){var u=this._getDynamic();if(t!=null){t=this._preprocess(t);}
;return u[t]||t;}
,getAliases:function(){var v={};for(var w in this.__jz){v[w]=this.__jz[w];}
;return v;}
},destruct:function(){this.__jz=null;}
});}
)();
(function(){var a="mshtml",b="engine.name",c="__jB",d="_applyTheme",e="",f="'.",g="qx-",h="Unable to resolve decorator '",j="singleton",k=";",l="qx.theme.manager.Decoration",m=".",n="Theme",o="object",p="changeTheme",q="string",r="browser.documentmode",s=":";qx.Class.define(l,{type:j,extend:qx.core.Object,construct:function(){qx.core.Object.call(this);this.__fi=[];this.__jA=(qx.core.Environment.get(b)==a&&qx.core.Environment.get(r)<9);}
,properties:{theme:{check:n,nullable:true,apply:d,event:p}},members:{__jB:null,__fi:null,__jA:false,getCssClassName:function(t){if(qx.lang.Type.isString(t)){return g+t;}
else {return g+t.toHashCode();}
;}
,addCssClass:function(y){var v=qx.ui.style.Stylesheet.getInstance();var A=y;y=this.getCssClassName(y);var z=m+y;if(v.hasRule(z)){return y;}
;if(qx.lang.Type.isString(A)){A=this.resolve(A);}
;if(!A){throw new Error(h+y+f);}
;var F=e;var u=A.getStyles(true);for(var C in u){if(qx.Bootstrap.isObject(u[C])){var w=e;var E=u[C];var B=false;for(var x in E){B=true;w+=x+s+E[x]+k;}
;var D=this.__jA?z:z+(B?s:e);this.__fi.push(D+C);v.addRule(D+C,w);continue;}
;F+=C+s+u[C]+k;}
;if(F){v.addRule(z,F);this.__fi.push(z);}
;return y;}
,resolve:function(J){if(!J){return null;}
;if(typeof J===o){return J;}
;var K=this.getTheme();if(!K){return null;}
;var H=this.__jB;if(!H){H=this.__jB={};}
;var G=H[J];if(G){return G;}
;var M=qx.lang.Object.clone(K.decorations[J],true);if(!M){return null;}
;if(!M.style){M.style={};}
;var I=M;while(I.include){I=K.decorations[I.include];if(!M.decorator&&I.decorator){M.decorator=qx.lang.Object.clone(I.decorator);}
;if(I.style){for(var L in I.style){if(M.style[L]==undefined){M.style[L]=qx.lang.Object.clone(I.style[L],true);}
;}
;}
;}
;return H[J]=(new qx.ui.decoration.Decorator()).set(M.style);}
,isValidPropertyValue:function(N){if(typeof N===q){return this.isDynamic(N);}
else if(typeof N===o){var O=N.constructor;return qx.Class.hasInterface(O,qx.ui.decoration.IDecorator);}
;return false;}
,isDynamic:function(Q){if(!Q){return false;}
;var P=this.getTheme();if(!P){return false;}
;return !!P.decorations[Q];}
,isCached:function(R){return !this.__jB?false:qx.lang.Object.contains(this.__jB,R);}
,_applyTheme:function(U,S){var T=qx.util.AliasManager.getInstance();for(var i=0;i<this.__fi.length;i++ ){var V=this.__fi[i];qx.ui.style.Stylesheet.getInstance().removeRule(V);}
;this.__fi=[];if(S){for(var W in S.aliases){T.remove(W);}
;}
;if(U){for(var W in U.aliases){T.add(W,U.aliases[W]);}
;}
;this._disposeMap(c);this.__jB={};}
},destruct:function(){this._disposeMap(c);}
});}
)();
(function(){var a="qx.ui.style.Stylesheet",b="singleton";qx.Class.define(a,{type:b,extend:qx.core.Object,construct:function(){qx.core.Object.call(this);this.__fg=qx.bom.Stylesheet.createElement();this.__fi=[];}
,members:{__fi:null,__fg:null,addRule:function(d,c){if(this.hasRule(d)){return;}
;qx.bom.Stylesheet.addRule(this.__fg,d,c);this.__fi.push(d);}
,hasRule:function(e){return this.__fi.indexOf(e)!=-1;}
,removeRule:function(f){delete this.__fi[this.__fi.indexOf(f)];qx.bom.Stylesheet.removeRule(this.__fg,f);}
},destruct:function(){qx.bom.Stylesheet.removeSheet(this.__fg);}
});}
)();
(function(){var a=" 0",b="</div>",c="),to(",d="px",e="css.borderradius",f="from(",g=")",h="background-image",i="background",j="<div style='width: 100%; height: 100%; position: absolute;",k="filter",l="background-size",m="', ",n="'></div>",o="0",p="_applyLinearBackgroundGradient",q="-webkit-gradient(linear,",r="startColorPosition",s="background-color",t="deg, ",u="url(",v="css.gradient.legacywebkit",w="EndColorStr='#FF",x="startColor",y="shorthand",z="100% 100%",A="Color",B='<div style=\"position: absolute; width: 100%; height: 100%; filter:progid:DXImageTransform.Microsoft.Gradient(GradientType=',C="MBoxShadow",D="StartColorStr='#FF",E="vertical",F="",G="transparent",H="qx.ui.decoration.MLinearBackgroundGradient",I="(",J="endColorPosition",K="canvas",L="';)\">",M="css.gradient.linear",N="';)",O="endColor",P=", ",Q="css.gradient.filter",R="horizontal",S="Number",T='2d',U="%",V=" ",W="white",X="linear-gradient",Y='progid:DXImageTransform.Microsoft.Gradient(GradientType=',bb=",";qx.Mixin.define(H,{properties:{startColor:{check:A,nullable:true,apply:p},endColor:{check:A,nullable:true,apply:p},orientation:{check:[R,E],init:E,apply:p},startColorPosition:{check:S,init:0,apply:p},endColorPosition:{check:S,init:100,apply:p},colorPositionUnit:{check:[d,U],init:U,apply:p},gradientStart:{group:[x,r],mode:y},gradientEnd:{group:[O,J],mode:y}},members:{__jC:null,_styleLinearBackgroundGradient:function(bc){var bm=this.__jD();var bq=bm.start;var bk=bm.end;var bi;if(!bq||!bk){return;}
;var bt=this.getColorPositionUnit();if(qx.core.Environment.get(v)){bt=bt===d?F:bt;if(this.getOrientation()==R){var bp=this.getStartColorPosition()+bt+a+bt;var bn=this.getEndColorPosition()+bt+a+bt;}
else {var bp=o+bt+V+this.getStartColorPosition()+bt;var bn=o+bt+V+this.getEndColorPosition()+bt;}
;var bf=f+bq+c+bk+g;bi=q+bp+bb+bn+bb+bf+g;bc[i]=bi;}
else if(qx.core.Environment.get(Q)&&!qx.core.Environment.get(M)&&qx.core.Environment.get(e)){if(!this.__jC){this.__jC=document.createElement(K);}
;var bg=this.getOrientation()==E;var bm=this.__jD();var bj=bg?200:1;var bl=bg?1:200;this.__jC.width=bl;this.__jC.height=bj;var bh=this.__jC.getContext(T);if(bg){var bs=bh.createLinearGradient(0,0,0,bj);}
else {var bs=bh.createLinearGradient(0,0,bl,0);}
;bs.addColorStop(this.getStartColorPosition()/100,bm.start);bs.addColorStop(this.getEndColorPosition()/100,bm.end);bh.fillStyle=bs;bh.fillRect(0,0,bl,bj);var bi=u+this.__jC.toDataURL()+g;bc[h]=bi;bc[l]=z;}
else if(qx.core.Environment.get(Q)&&!qx.core.Environment.get(M)){var bm=this.__jD();var br=this.getOrientation()==R?1:0;var bq=bm.start;var bk=bm.end;if(!qx.util.ColorUtil.isHex6String(bq)){bq=qx.util.ColorUtil.stringToRgb(bq);bq=qx.util.ColorUtil.rgbToHexString(bq);}
;if(!qx.util.ColorUtil.isHex6String(bk)){bk=qx.util.ColorUtil.stringToRgb(bk);bk=qx.util.ColorUtil.rgbToHexString(bk);}
;bq=bq.substring(1,bq.length);bk=bk.substring(1,bk.length);bi=Y+br+P+D+bq+m+w+bk+N;if(bc[k]){bc[k]+=P+bi;}
else {bc[k]=bi;}
;if(!bc[s]||bc[s]==G){bc[s]=W;}
;}
else {var bu=this.getOrientation()==R?0:270;var be=bq+V+this.getStartColorPosition()+bt;var bd=bk+V+this.getEndColorPosition()+bt;var bo=qx.core.Environment.get(M);if(bo===X){bu=this.getOrientation()==R?bu+90:bu-90;}
;bi=bo+I+bu+t+be+bb+bd+g;if(bc[h]){bc[h]+=P+bi;}
else {bc[h]=bi;}
;}
;}
,__jD:function(){{var bv;var bx=this.getStartColor();var bw=this.getEndColor();}
;return {start:bx,end:bw};}
,_getContent:function(){if(qx.core.Environment.get(Q)&&!qx.core.Environment.get(M)){var bA=this.__jD();var bD=this.getOrientation()==R?1:0;var bC=qx.util.ColorUtil.hex3StringToHex6String(bA.start);var bz=qx.util.ColorUtil.hex3StringToHex6String(bA.end);bC=bC.substring(1,bC.length);bz=bz.substring(1,bz.length);var bB=F;if(this.classname.indexOf(C)!=-1){var by={};this._styleBoxShadow(by);bB=j+qx.bom.element.Style.compile(by)+n;}
;return B+bD+P+D+bC+m+w+bz+L+bB+b;}
;return F;}
,_applyLinearBackgroundGradient:function(){{}
;}
}});}
)();
(function(){var a="double",b="px ",c="widthTop",d="inset",e="solid",f="dotted",g="styleRight",h="styleBottom",i="_applyWidth",j="border-top",k="border-left",l="ridge",m="border-right",n="qx.ui.decoration.MSingleBorder",o="shorthand",p="Color",q="widthBottom",r="outset",s="widthLeft",t="",u="border-bottom",v="styleTop",w="colorBottom",x="groove",y="styleLeft",z="widthRight",A="dashed",B="Number",C="colorLeft",D="colorRight",E="colorTop",F="_applyStyle",G=" ",H="absolute";qx.Mixin.define(n,{properties:{widthTop:{check:B,init:0,apply:i},widthRight:{check:B,init:0,apply:i},widthBottom:{check:B,init:0,apply:i},widthLeft:{check:B,init:0,apply:i},styleTop:{nullable:true,check:[e,f,A,a,d,r,l,x],init:e,apply:F},styleRight:{nullable:true,check:[e,f,A,a,d,r,l,x],init:e,apply:F},styleBottom:{nullable:true,check:[e,f,A,a,d,r,l,x],init:e,apply:F},styleLeft:{nullable:true,check:[e,f,A,a,d,r,l,x],init:e,apply:F},colorTop:{nullable:true,check:p,apply:F},colorRight:{nullable:true,check:p,apply:F},colorBottom:{nullable:true,check:p,apply:F},colorLeft:{nullable:true,check:p,apply:F},left:{group:[s,y,C]},right:{group:[z,g,D]},top:{group:[c,v,E]},bottom:{group:[q,h,w]},width:{group:[c,z,q,s],mode:o},style:{group:[v,g,h,y],mode:o},color:{group:[E,D,w,C],mode:o}},members:{_styleBorder:function(I){{var K;var O=this.getColorTop();var L=this.getColorRight();var J=this.getColorBottom();var N=this.getColorLeft();}
;var M=this.getWidthTop();if(M>0){I[j]=M+b+this.getStyleTop()+G+(O||t);}
;var M=this.getWidthRight();if(M>0){I[m]=M+b+this.getStyleRight()+G+(L||t);}
;var M=this.getWidthBottom();if(M>0){I[u]=M+b+this.getStyleBottom()+G+(J||t);}
;var M=this.getWidthLeft();if(M>0){I[k]=M+b+this.getStyleLeft()+G+(N||t);}
;{}
;I.position=H;}
,_getDefaultInsetsForBorder:function(){return {top:this.getWidthTop(),right:this.getWidthRight(),bottom:this.getWidthBottom(),left:this.getWidthLeft()};}
,_applyWidth:function(){this._applyStyle();this._resetInsets();}
,_applyStyle:function(){{}
;}
}});}
)();
(function(){var a=', url(',b="repeat",c="backgroundPositionX",d="backgroundPositionY",e="px",f="background-position",g=" ",h="background-repeat",i="no-repeat",j=')',k="scale",l="_applyBackgroundPosition",m='url(',n="repeat-x",o="background-image",p="100% 100%",q="repeat-y",r="qx.ui.decoration.MBackgroundImage",s="background-size",t="String",u="_applyBackgroundImage";qx.Mixin.define(r,{properties:{backgroundImage:{check:t,nullable:true,apply:u},backgroundRepeat:{check:[b,n,q,i,k],init:b,apply:u},backgroundPositionX:{nullable:true,apply:l},backgroundPositionY:{nullable:true,apply:l},backgroundPosition:{group:[d,c]}},members:{_styleBackgroundImage:function(v){var x=this.getBackgroundImage();if(!x){return;}
;var y=qx.util.AliasManager.getInstance().resolve(x);var z=qx.util.ResourceManager.getInstance().toUri(y);if(v[o]){v[o]+=a+z+j;}
else {v[o]=m+z+j;}
;var w=this.getBackgroundRepeat();if(w===k){v[s]=p;}
else {v[h]=w;}
;var top=this.getBackgroundPositionY()||0;var A=this.getBackgroundPositionX()||0;if(!isNaN(top)){top+=e;}
;if(!isNaN(A)){A+=e;}
;v[f]=A+g+top;{}
;}
,_applyBackgroundImage:function(){{}
;}
,_applyBackgroundPosition:function(){{}
;}
}});}
)();
(function(){var a="innerWidthRight",b="innerColorBottom",c="css.borderradius",d="px ",e='""',f="_applyDoubleBorder",g="border-top",h="inset 0 -",i="css.boxsizing",j="innerWidthTop",k="100%",l="border-left",m="innerColorRight",n="css.boxshadow",o="innerColorTop",p="innerColorLeft",q="inset ",r="shorthand",s="inset -",t="Color",u="border-box",v="qx.ui.decoration.MDoubleBorder",w="border-bottom",x=":before",y="inset 0 ",z="px solid ",A="innerWidthBottom",B="css.rgba",C="inherit",D="Number",E="innerWidthLeft",F="px 0 ",G="inset 0 0 0 ",H="border-right",I=" ",J=",",K="absolute";qx.Mixin.define(v,{include:[qx.ui.decoration.MSingleBorder,qx.ui.decoration.MBackgroundImage],construct:function(){this._getDefaultInsetsForBorder=this.__jH;this._styleBorder=this.__jF;}
,properties:{innerWidthTop:{check:D,init:0,apply:f},innerWidthRight:{check:D,init:0,apply:f},innerWidthBottom:{check:D,init:0,apply:f},innerWidthLeft:{check:D,init:0,apply:f},innerWidth:{group:[j,a,A,E],mode:r},innerColorTop:{nullable:true,check:t,apply:f},innerColorRight:{nullable:true,check:t,apply:f},innerColorBottom:{nullable:true,check:t,apply:f},innerColorLeft:{nullable:true,check:t,apply:f},innerColor:{group:[o,m,b,p],mode:r},innerOpacity:{check:D,init:1,apply:f}},members:{__jF:function(L){var U=qx.core.Environment.get(n);var O,Y,innerWidth;{var T;O={top:this.getColorTop(),right:this.getColorRight(),bottom:this.getColorBottom(),left:this.getColorLeft()};Y={top:this.getInnerColorTop(),right:this.getInnerColorRight(),bottom:this.getInnerColorBottom(),left:this.getInnerColorLeft()};}
;innerWidth={top:this.getInnerWidthTop(),right:this.getInnerWidthRight(),bottom:this.getInnerWidthBottom(),left:this.getInnerWidthLeft()};var R=this.getWidthTop();if(R>0){L[g]=R+d+this.getStyleTop()+I+O.top;}
;R=this.getWidthRight();if(R>0){L[H]=R+d+this.getStyleRight()+I+O.right;}
;R=this.getWidthBottom();if(R>0){L[w]=R+d+this.getStyleBottom()+I+O.bottom;}
;R=this.getWidthLeft();if(R>0){L[l]=R+d+this.getStyleLeft()+I+O.left;}
;var X=this.getInnerOpacity();if(X<1){this.__jG(Y,X);}
;if(innerWidth.top>0||innerWidth.right>0||innerWidth.bottom>0||innerWidth.left>0){var W=(innerWidth.top||0)+z+Y.top;var V=(innerWidth.right||0)+z+Y.right;var Q=(innerWidth.bottom||0)+z+Y.bottom;var S=(innerWidth.left||0)+z+Y.left;L[x]={"width":k,"height":k,"position":K,"content":e,"border-top":W,"border-right":V,"border-bottom":Q,"border-left":S,"left":0,"top":0};var M=qx.bom.Style.getCssName(qx.core.Environment.get(i));L[x][M]=u;var N=qx.core.Environment.get(c);if(N){N=qx.bom.Style.getCssName(N);L[x][N]=C;}
;var P=[];if(Y.top&&innerWidth.top&&Y.top==Y.bottom&&Y.top==Y.right&&Y.top==Y.left&&innerWidth.top==innerWidth.bottom&&innerWidth.top==innerWidth.right&&innerWidth.top==innerWidth.left){P.push(G+innerWidth.top+d+Y.top);}
else {if(Y.top){P.push(y+(innerWidth.top||0)+d+Y.top);}
;if(Y.right){P.push(s+(innerWidth.right||0)+F+Y.right);}
;if(Y.bottom){P.push(h+(innerWidth.bottom||0)+d+Y.bottom);}
;if(Y.left){P.push(q+(innerWidth.left||0)+F+Y.left);}
;}
;if(P.length>0&&U){U=qx.bom.Style.getCssName(U);if(!L[U]){L[U]=P.join(J);}
else {L[U]+=J+P.join(J);}
;}
;}
;}
,__jG:function(bd,ba){if(!qx.core.Environment.get(B)){{}
;return;}
;for(var be in bd){var bb=qx.util.ColorUtil.stringToRgb(bd[be]);bb.push(ba);var bc=qx.util.ColorUtil.rgbToRgbString(bb);bd[be]=bc;}
;}
,_applyDoubleBorder:function(){{}
;}
,__jH:function(){return {top:this.getWidthTop()+this.getInnerWidthTop(),right:this.getWidthRight()+this.getInnerWidthRight(),bottom:this.getWidthBottom()+this.getInnerWidthBottom(),left:this.getWidthLeft()+this.getInnerWidthLeft()};}
}});}
)();
(function(){var a="_applyBoxShadow",b="shadowHorizontalLength",c="Boolean",d="",e="px ",f="css.boxshadow",g="shadowVerticalLength",h="inset ",i="shorthand",j="qx.ui.decoration.MBoxShadow",k="Integer",l="Color",m=",";qx.Mixin.define(j,{properties:{shadowHorizontalLength:{nullable:true,check:k,apply:a},shadowVerticalLength:{nullable:true,check:k,apply:a},shadowBlurRadius:{nullable:true,check:k,apply:a},shadowSpreadRadius:{nullable:true,check:k,apply:a},shadowColor:{nullable:true,check:l,apply:a},inset:{init:false,check:c,apply:a},shadowLength:{group:[b,g],mode:i}},members:{_styleBoxShadow:function(n){var v=qx.core.Environment.get(f);if(!v||this.getShadowVerticalLength()==null&&this.getShadowHorizontalLength()==null){return;}
;{var r;var o=this.getShadowColor();}
;if(o!=null){var u=this.getShadowVerticalLength()||0;var p=this.getShadowHorizontalLength()||0;var blur=this.getShadowBlurRadius()||0;var t=this.getShadowSpreadRadius()||0;var s=this.getInset()?h:d;var q=s+p+e+u+e+blur+e+t+e+o;v=qx.bom.Style.getCssName(v);if(!n[v]){n[v]=q;}
else {n[v]+=m+q;}
;}
;}
,_applyBoxShadow:function(){{}
;}
}});}
)();
(function(){var a="radiusTopRight",b="radiusTopLeft",c="px",d="-webkit-border-bottom-left-radius",e="-webkit-background-clip",f="radiusBottomRight",g="Integer",h="-webkit-border-bottom-right-radius",i="background-clip",j="border-top-left-radius",k="border-top-right-radius",l="border-bottom-left-radius",m="radiusBottomLeft",n="-webkit-border-top-left-radius",o="shorthand",p="-moz-border-radius-bottomright",q="padding-box",r="border-bottom-right-radius",s="qx.ui.decoration.MBorderRadius",t="-moz-border-radius-topright",u="engine.name",v="_applyBorderRadius",w="-webkit-border-top-right-radius",x="webkit",y="-moz-border-radius-topleft",z="-moz-border-radius-bottomleft";qx.Mixin.define(s,{properties:{radiusTopLeft:{nullable:true,check:g,apply:v},radiusTopRight:{nullable:true,check:g,apply:v},radiusBottomLeft:{nullable:true,check:g,apply:v},radiusBottomRight:{nullable:true,check:g,apply:v},radius:{group:[b,a,f,m],mode:o}},members:{_styleBorderRadius:function(A){A[e]=q;A[i]=q;var B=false;var C=this.getRadiusTopLeft();if(C>0){B=true;A[y]=C+c;A[n]=C+c;A[j]=C+c;}
;C=this.getRadiusTopRight();if(C>0){B=true;A[t]=C+c;A[w]=C+c;A[k]=C+c;}
;C=this.getRadiusBottomLeft();if(C>0){B=true;A[z]=C+c;A[d]=C+c;A[l]=C+c;}
;C=this.getRadiusBottomRight();if(C>0){B=true;A[p]=C+c;A[h]=C+c;A[r]=C+c;}
;if(B&&qx.core.Environment.get(u)==x){A[e]=q;}
else {A[i]=q;}
;}
,_applyBorderRadius:function(){{}
;}
}});}
)();
(function(){var a="border-width",b="css.borderimage.standardsyntax",c="repeat",d="Boolean",e="-l",f="stretch",g="px ",h="sliceBottom",i="-t",j="Integer",k="solid",l="borderImage",m="-r",n="border-style",o="sliceLeft",p="-b",q="sliceRight",r="px",s="repeatX",t=" fill",u="String",v="vertical",w="",x="transparent",y="round",z='") ',A="shorthand",B="qx.ui.decoration.MBorderImage",C="sliceTop",D="horizontal",E="_applyBorderImage",F="border-color",G='url("',H=" ",I="grid",J="repeatY";qx.Mixin.define(B,{properties:{borderImage:{check:u,nullable:true,apply:E},sliceTop:{check:j,nullable:true,init:null,apply:E},sliceRight:{check:j,nullable:true,init:null,apply:E},sliceBottom:{check:j,nullable:true,init:null,apply:E},sliceLeft:{check:j,nullable:true,init:null,apply:E},slice:{group:[C,q,h,o],mode:A},repeatX:{check:[f,c,y],init:f,apply:E},repeatY:{check:[f,c,y],init:f,apply:E},repeat:{group:[s,J],mode:A},fill:{check:d,init:true,apply:E},borderImageMode:{check:[D,v,I],init:I}},members:{_styleBorderImage:function(K){if(!this.getBorderImage()){return;}
;var M=qx.util.AliasManager.getInstance().resolve(this.getBorderImage());var O=qx.util.ResourceManager.getInstance().toUri(M);var R=this._getDefaultInsetsForBorderImage();var L=[R.top,R.right,R.bottom,R.left];var P=[this.getRepeatX(),this.getRepeatY()].join(H);var S=this.getFill()&&qx.core.Environment.get(b)?t:w;var N=qx.bom.Style.getPropertyName(l);if(N){var Q=qx.bom.Style.getCssName(N);K[Q]=G+O+z+L.join(H)+S+H+P;}
;K[n]=k;K[F]=x;K[a]=L.join(g)+r;}
,_getDefaultInsetsForBorderImage:function(){if(!this.getBorderImage()){return {top:0,right:0,bottom:0,left:0};}
;var T=qx.util.AliasManager.getInstance().resolve(this.getBorderImage());var U=this.__jI(T);return {top:this.getSliceTop()||U[0],right:this.getSliceRight()||U[1],bottom:this.getSliceBottom()||U[2],left:this.getSliceLeft()||U[3]};}
,_applyBorderImage:function(){{}
;}
,__jI:function(bc){var bb=this.getBorderImageMode();var bd=0;var Y=0;var ba=0;var be=0;var bf=/(.*)(\.[a-z]+)$/.exec(bc);var V=bf[1];var X=bf[2];var W=qx.util.ResourceManager.getInstance();if(bb==I||bb==v){bd=W.getImageHeight(V+i+X);ba=W.getImageHeight(V+p+X);}
;if(bb==I||bb==D){Y=W.getImageWidth(V+m+X);be=W.getImageWidth(V+e+X);}
;return [bd,Y,ba,be];}
}});}
)();
(function(){var a="qx.ui.decoration.MBackgroundColor",b='',c="background-color",d="Color",e="_applyBackgroundColor";qx.Mixin.define(a,{properties:{backgroundColor:{check:d,nullable:true,apply:e}},members:{_styleBackgroundColor:function(f){var g=this.getBackgroundColor();if(g&&b){g=qx.theme.manager.Color.getInstance().resolve(g);}
;if(g){f[c]=g;}
;}
,_applyBackgroundColor:function(){{}
;}
}});}
)();
(function(){var a="abstract",b="Abstract method called.",c="qx.ui.decoration.Abstract";qx.Class.define(c,{extend:qx.core.Object,implement:[qx.ui.decoration.IDecorator],type:a,members:{__jJ:null,_getDefaultInsets:function(){throw new Error(b);}
,_isInitialized:function(){throw new Error(b);}
,_resetInsets:function(){this.__jJ=null;}
,getInsets:function(){if(this.__jJ){return this.__jJ;}
;return this._getDefaultInsets();}
},destruct:function(){this.__jJ=null;}
});}
)();
(function(){var a="qx.ui.decoration.Decorator",b="_style",c="_getDefaultInsetsFor",d="bottom",e="top",f="left",g="right";qx.Class.define(a,{extend:qx.ui.decoration.Abstract,implement:[qx.ui.decoration.IDecorator],include:[qx.ui.decoration.MBackgroundColor,qx.ui.decoration.MBorderRadius,qx.ui.decoration.MBoxShadow,qx.ui.decoration.MDoubleBorder,qx.ui.decoration.MLinearBackgroundGradient,qx.ui.decoration.MBorderImage],members:{__jK:false,getPadding:function(){var k=this.getInset();var h=this._getDefaultInsetsForBorderImage();var n=k.top-(h.top?h.top:this.getWidthTop());var m=k.right-(h.right?h.right:this.getWidthRight());var j=k.bottom-(h.bottom?h.bottom:this.getWidthBottom());var l=k.left-(h.left?h.left:this.getWidthLeft());return {top:k.top?n:this.getInnerWidthTop(),right:k.right?m:this.getInnerWidthRight(),bottom:k.bottom?j:this.getInnerWidthBottom(),left:k.left?l:this.getInnerWidthLeft()};}
,getStyles:function(r){if(r){return this._getStyles();}
;var q={};var p=this._getStyles();for(var o in p){q[qx.lang.String.camelCase(o)]=p[o];}
;return q;}
,_getStyles:function(){var s={};for(var name in this){if(name.indexOf(b)==0&&this[name] instanceof Function){this[name](s);}
;}
;this.__jK=true;return s;}
,_getDefaultInsets:function(){var w=[e,g,d,f];var u={};for(var name in this){if(name.indexOf(c)==0&&this[name] instanceof Function){var v=this[name]();for(var i=0;i<w.length;i++ ){var t=w[i];if(u[t]==undefined){u[t]=v[t];}
;if(v[t]>u[t]){u[t]=v[t];}
;}
;}
;}
;if(u[e]!=undefined){return u;}
;return {top:0,right:0,bottom:0,left:0};}
,_isInitialized:function(){return this.__jK;}
}});}
)();
(function(){var a="load",b="html.image.naturaldimensions",c="qx.io.ImageLoader";qx.Bootstrap.define(c,{statics:{__cN:{},__jL:{width:null,height:null},__jM:/\.(png|gif|jpg|jpeg|bmp)\b/i,__jN:/^data:image\/(png|gif|jpg|jpeg|bmp)\b/i,isLoaded:function(d){var e=this.__cN[d];return !!(e&&e.loaded);}
,isFailed:function(f){var g=this.__cN[f];return !!(g&&g.failed);}
,isLoading:function(h){var j=this.__cN[h];return !!(j&&j.loading);}
,getFormat:function(o){var n=this.__cN[o];if(!n||!n.format){var k=this.__jN.exec(o);if(k!=null){var m=(n&&qx.lang.Type.isNumber(n.width)?n.width:this.__jL.width);var p=(n&&qx.lang.Type.isNumber(n.height)?n.height:this.__jL.height);n={loaded:true,format:k[1],width:m,height:p};}
;}
;return n?n.format:null;}
,getSize:function(q){var r=this.__cN[q];return r?{width:r.width,height:r.height}:this.__jL;}
,getWidth:function(s){var t=this.__cN[s];return t?t.width:null;}
,getHeight:function(u){var v=this.__cN[u];return v?v.height:null;}
,load:function(y,x,z){var A=this.__cN[y];if(!A){A=this.__cN[y]={};}
;if(x&&!z){z=window;}
;if(A.loaded||A.loading||A.failed){if(x){if(A.loading){A.callbacks.push(x,z);}
else {x.call(z,y,A);}
;}
;}
else {A.loading=true;A.callbacks=[];if(x){A.callbacks.push(x,z);}
;var w=new Image();var B=qx.lang.Function.listener(this.__jO,this,w,y);w.onload=B;w.onerror=B;w.src=y;A.element=w;}
;}
,abort:function(C){var F=this.__cN[C];if(F&&!F.loaded){F.aborted=true;var E=F.callbacks;var D=F.element;D.onload=D.onerror=null;delete F.callbacks;delete F.element;delete F.loading;for(var i=0,l=E.length;i<l;i+=2){E[i].call(E[i+1],C,F);}
;}
;this.__cN[C]=null;}
,__jO:qx.event.GlobalError.observeMethod(function(event,H,G){var L=this.__cN[G];var I=function(M){return (M&&M.height!==0);}
;if(event.type===a&&I(H)){L.loaded=true;L.width=this.__jP(H);L.height=this.__jQ(H);var J=this.__jM.exec(G);if(J!=null){L.format=J[1];}
;}
else {L.failed=true;}
;H.onload=H.onerror=null;var K=L.callbacks;delete L.loading;delete L.callbacks;delete L.element;for(var i=0,l=K.length;i<l;i+=2){K[i].call(K[i+1],G,L);}
;}
),__jP:function(N){return qx.core.Environment.get(b)?N.naturalWidth:N.width;}
,__jQ:function(O){return qx.core.Environment.get(b)?O.naturalHeight:O.height;}
,dispose:function(){this.__cN={};}
}});}
)();
(function(){var a="source",b="engine.name",c="",d="mshtml",e="px",f="px ",g="no-repeat",h="backgroundImage",i="scale",j="webkit",k="div",l="qx.html.Image",m="qx/static/blank.gif",n="backgroundPosition";qx.Class.define(l,{extend:qx.html.Element,members:{__jR:null,__jS:null,tagNameHint:null,setPadding:function(o,p){this.__jS=o;this.__jR=p;if(this.getNodeName()==k){this.setStyle(n,o+f+p+e);}
;}
,_applyProperty:function(name,t){qx.html.Element.prototype._applyProperty.call(this,name,t);if(name===a){var s=this.getDomElement();var q=this.getAllStyles();if(this.getNodeName()==k&&this.getStyle(h)){q.backgroundRepeat=null;}
;var u=this._getProperty(a);var r=this._getProperty(i);var v=r?i:g;if(u!=null){u=u||null;q.paddingTop=this.__jR;q.paddingLeft=this.__jS;qx.bom.element.Decoration.update(s,u,v,q);}
;}
;}
,_removeProperty:function(x,w){if(x==a){this._setProperty(x,c,w);}
else {this._setProperty(x,null,w);}
;}
,_createDomElement:function(){var z=this._getProperty(i);var A=z?i:g;if((qx.core.Environment.get(b)==d)){var y=this._getProperty(a);if(this.tagNameHint!=null){this.setNodeName(this.tagNameHint);}
else {this.setNodeName(qx.bom.element.Decoration.getTagName(A,y));}
;}
else {this.setNodeName(qx.bom.element.Decoration.getTagName(A));}
;return qx.html.Element.prototype._createDomElement.call(this);}
,_copyData:function(B){return qx.html.Element.prototype._copyData.call(this,true);}
,setSource:function(C){this._setProperty(a,C);return this;}
,getSource:function(){return this._getProperty(a);}
,resetSource:function(){if((qx.core.Environment.get(b)==j)){this._setProperty(a,m);}
else {this._removeProperty(a,true);}
;return this;}
,setScale:function(D){this._setProperty(i,D);return this;}
,getScale:function(){return this._getProperty(i);}
}});}
)();
(function(){var a="qx/icon",b="repeat",c="px",d=".png",f="crop",g="px ",h="background-image",i="scale",j="no-repeat",k="div",l="Potential clipped image candidate: ",m="progid:DXImageTransform.Microsoft.AlphaImageLoader(src='",n='<div style="',o="scale-x",p="css.alphaimageloaderneeded",q="repeat-y",r='<img src="',s="qx.bom.element.Decoration",t="Image modification not possible because elements could not be replaced at runtime anymore!",u="', sizingMethod='",v="",w='"/>',x="png",y="img",z="')",A='"></div>',B="mshtml",C="engine.name",D='" style="',E="none",F="b64",G="webkit",H=" ",I="repeat-x",J="background-repeat",K="DXImageTransform.Microsoft.AlphaImageLoader",L="qx/static/blank.gif",M="scale-y",N="absolute";qx.Class.define(s,{statics:{DEBUG:false,__jT:{},__jU:qx.core.Environment.select(C,{"mshtml":{"scale-x":true,"scale-y":true,"scale":true,"no-repeat":true},"default":null}),__jV:{"scale-x":y,"scale-y":y,"scale":y,"repeat":k,"no-repeat":k,"repeat-x":k,"repeat-y":k},update:function(R,S,P,O){var T=this.getTagName(P,S);if(T!=R.tagName.toLowerCase()){throw new Error(t);}
;var Q=this.getAttributes(S,P,O);if(T===y){R.src=Q.src||qx.util.ResourceManager.getInstance().toUri(L);}
;if(R.style.backgroundPosition!=v&&Q.style.backgroundPosition===undefined){Q.style.backgroundPosition=null;}
;if(R.style.clip!=v&&Q.style.clip===undefined){Q.style.clip=null;}
;qx.bom.element.Style.setStyles(R,Q.style);if(qx.core.Environment.get(p)){try{R.filters[K].apply();}
catch(e){}
;}
;}
,create:function(X,V,U){var Y=this.getTagName(V,X);var W=this.getAttributes(X,V,U);var ba=qx.bom.element.Style.compile(W.style);if(Y===y){return r+W.src+D+ba+w;}
else {return n+ba+A;}
;}
,getTagName:function(bc,bb){if(bb&&qx.core.Environment.get(p)&&this.__jU[bc]&&qx.lang.String.endsWith(bb,d)){return k;}
;return this.__jV[bc];}
,getAttributes:function(bh,be,bd){if(!bd){bd={};}
;if(!bd.position){bd.position=N;}
;if((qx.core.Environment.get(C)==B)){bd.fontSize=0;bd.lineHeight=0;}
else if((qx.core.Environment.get(C)==G)){bd.WebkitUserDrag=E;}
;var bf=qx.util.ResourceManager.getInstance().getImageFormat(bh)||qx.io.ImageLoader.getFormat(bh);{}
;var bi;if(qx.core.Environment.get(p)&&this.__jU[be]&&bf===x){var bj=this.__jX(bh);this.__jW(bd,bj.width,bj.height);bi=this.processAlphaFix(bd,be,bh);}
else {delete bd.clip;if(be===i){bi=this.__jY(bd,be,bh);}
else if(be===o||be===M){bi=this.__ka(bd,be,bh);}
else {bi=this.__kd(bd,be,bh);}
;}
;return bi;}
,__jW:function(bl,bk,bm){if(bl.width==null&&bk!=null){bl.width=bk+c;}
;if(bl.height==null&&bm!=null){bl.height=bm+c;}
;}
,__jX:function(bn){var bo=qx.util.ResourceManager.getInstance().getImageWidth(bn)||qx.io.ImageLoader.getWidth(bn);var bp=qx.util.ResourceManager.getInstance().getImageHeight(bn)||qx.io.ImageLoader.getHeight(bn);return {width:bo,height:bp};}
,processAlphaFix:function(bs,bt,br){if(bt==b||bt==I||bt==q){return bs;}
;var bu=bt==j?f:i;var bq=m+qx.util.ResourceManager.getInstance().toUri(br)+u+bu+z;bs.filter=bq;bs.backgroundImage=bs.backgroundRepeat=v;delete bs[h];delete bs[J];return {style:bs};}
,__jY:function(bw,bx,bv){var by=qx.util.ResourceManager.getInstance().toUri(bv);var bz=this.__jX(bv);this.__jW(bw,bz.width,bz.height);return {src:by,style:bw};}
,__ka:function(bA,bB,bD){var bC=qx.util.ResourceManager.getInstance();var bG=bC.getCombinedFormat(bD);var bI=this.__jX(bD);var bE;if(bG){var bH=bC.getData(bD);var bF=bH[4];if(bG==F){bE=bC.toDataUri(bD);}
else {bE=bC.toUri(bF);}
;if(bB===o){bA=this.__kb(bA,bH,bI.height);}
else {bA=this.__kc(bA,bH,bI.width);}
;return {src:bE,style:bA};}
else {{}
;if(bB==o){bA.height=bI.height==null?null:bI.height+c;}
else if(bB==M){bA.width=bI.width==null?null:bI.width+c;}
;bE=bC.toUri(bD);return {src:bE,style:bA};}
;}
,__kb:function(bJ,bK,bM){var bL=qx.util.ResourceManager.getInstance().getImageHeight(bK[4]);bJ.clip={top:-bK[6],height:bM};bJ.height=bL+c;if(bJ.top!=null){bJ.top=(parseInt(bJ.top,10)+bK[6])+c;}
else if(bJ.bottom!=null){bJ.bottom=(parseInt(bJ.bottom,10)+bM-bL-bK[6])+c;}
;return bJ;}
,__kc:function(bO,bP,bN){var bQ=qx.util.ResourceManager.getInstance().getImageWidth(bP[4]);bO.clip={left:-bP[5],width:bN};bO.width=bQ+c;if(bO.left!=null){bO.left=(parseInt(bO.left,10)+bP[5])+c;}
else if(bO.right!=null){bO.right=(parseInt(bO.right,10)+bN-bQ-bP[5])+c;}
;return bO;}
,__kd:function(bR,bS,bV){var bU=qx.util.ResourceManager.getInstance();var bT=bU.getCombinedFormat(bV);var ce=this.__jX(bV);if(bT&&bS!==b){var cd=bU.getData(bV);var cb=cd[4];if(bT==F){var bX=bU.toDataUri(bV);var bW=0;var bY=0;}
else {var bX=bU.toUri(cb);var bW=cd[5];var bY=cd[6];if(bR.paddingTop||bR.paddingLeft||bR.paddingRight||bR.paddingBottom){var top=bR.paddingTop||0;var cf=bR.paddingLeft||0;bW+=bR.paddingLeft||0;bY+=bR.paddingTop||0;bR.clip={left:cf,top:top,width:ce.width,height:ce.height};}
;}
;var ca=qx.bom.element.Background.getStyles(bX,bS,bW,bY);for(var cc in ca){bR[cc]=ca[cc];}
;if(ce.width!=null&&bR.width==null&&(bS==q||bS===j)){bR.width=ce.width+c;}
;if(ce.height!=null&&bR.height==null&&(bS==I||bS===j)){bR.height=ce.height+c;}
;return {style:bR};}
else {var top=bR.paddingTop||0;var cf=bR.paddingLeft||0;bR.backgroundPosition=cf+g+top+c;{}
;this.__jW(bR,ce.width,ce.height);this.__ke(bR,bV,bS);return {style:bR};}
;}
,__ke:function(cg,cj,ch){var top=null;var cm=null;if(cg.backgroundPosition){var ci=cg.backgroundPosition.split(H);cm=parseInt(ci[0],10);if(isNaN(cm)){cm=ci[0];}
;top=parseInt(ci[1],10);if(isNaN(top)){top=ci[1];}
;}
;var ck=qx.bom.element.Background.getStyles(cj,ch,cm,top);for(var cl in ck){cg[cl]=ck[cl];}
;if(cg.filter){cg.filter=v;}
;}
,__kf:function(cn){if(this.DEBUG&&qx.util.ResourceManager.getInstance().has(cn)&&cn.indexOf(a)==-1){if(!this.__jT[cn]){qx.log.Logger.debug(l+cn);this.__jT[cn]=true;}
;}
;}
,isAlphaImageLoaderEnabled:function(){{}
;return qx.core.Environment.get(p);}
}});}
)();
(function(){var a="')",b="gecko",c="background-image:url(",d="0",e=");",f="",g="px",h="number",i=")",j="background-repeat:",k="engine.version",l="data:",m=" ",n="qx.bom.element.Background",o=";",p="url(",q="background-position:",r="base64",s="url('",t="engine.name",u="'";qx.Class.define(n,{statics:{__kg:[c,null,e,q,null,o,j,null,o],__kh:{backgroundImage:null,backgroundPosition:null,backgroundRepeat:null},__ki:function(z,top){var v=qx.core.Environment.get(t);var x=qx.core.Environment.get(k);if(v==b&&x<1.9&&z==top&&typeof z==h){top+=0.01;}
;if(z){var y=(typeof z==h)?z+g:z;}
else {y=d;}
;if(top){var w=(typeof top==h)?top+g:top;}
else {w=d;}
;return y+m+w;}
,__kj:function(A){var String=qx.lang.String;var B=A.substr(0,50);return String.startsWith(B,l)&&String.contains(B,r);}
,compile:function(F,D,H,top){var G=this.__ki(H,top);var E=qx.util.ResourceManager.getInstance().toUri(F);if(this.__kj(E)){E=u+E+u;}
;var C=this.__kg;C[1]=E;C[4]=G;C[7]=D;return C.join(f);}
,getStyles:function(L,J,N,top){if(!L){return this.__kh;}
;var M=this.__ki(N,top);var K=qx.util.ResourceManager.getInstance().toUri(L);var O;if(this.__kj(K)){O=s+K+a;}
else {O=p+K+i;}
;var I={backgroundPosition:M,backgroundImage:O};if(J!=null){I.backgroundRepeat=J;}
;return I;}
,set:function(T,S,Q,U,top){var P=this.getStyles(S,Q,U,top);for(var R in P){T.style[R]=P[R];}
;}
}});}
)();
(function(){var a="dragdrop-cursor",b="_applyAction",c="alias",d="qx.ui.core.DragDropCursor",e="move",f="singleton",g="copy";qx.Class.define(d,{extend:qx.ui.basic.Image,include:qx.ui.core.MPlacement,type:f,construct:function(){qx.ui.basic.Image.call(this);this.setZIndex(1e8);this.setDomMove(true);var h=this.getApplicationRoot();h.add(this,{left:-1000,top:-1000});}
,properties:{appearance:{refine:true,init:a},action:{check:[c,g,e],apply:b,nullable:true}},members:{_applyAction:function(j,i){if(i){this.removeState(i);}
;if(j){this.addState(j);}
;}
}});}
)();
(function(){var a='indexOf',b='slice',c='concat',d='toLocaleLowerCase',e="qx.type.BaseString",f="",g='trim',h='match',j='toLocaleUpperCase',k='search',m='replace',n='toLowerCase',o='charCodeAt',p='split',q='substring',r='lastIndexOf',s='substr',t='toUpperCase',u='charAt';qx.Class.define(e,{extend:Object,construct:function(v){var v=v||f;this.__ko=v;this.length=v.length;}
,members:{$$isString:true,length:0,__ko:null,toString:function(){return this.__ko;}
,charAt:null,valueOf:null,charCodeAt:null,concat:null,indexOf:null,lastIndexOf:null,match:null,replace:null,search:null,slice:null,split:null,substr:null,substring:null,toLowerCase:null,toUpperCase:null,toHashCode:function(){return qx.core.ObjectRegistry.toHashCode(this);}
,toLocaleLowerCase:null,toLocaleUpperCase:null,base:function(x,w){return qx.core.Object.prototype.base.apply(this,arguments);}
},defer:function(y,z){{}
;var A=[u,o,c,a,r,h,m,k,b,p,s,q,n,t,d,j,g];z.valueOf=z.toString;if(new y(f).valueOf()==null){delete z.valueOf;}
;for(var i=0,l=A.length;i<l;i++ ){z[A[i]]=String.prototype[A[i]];}
;}
});}
)();
(function(){var a="qx.locale.LocalizedString";qx.Class.define(a,{extend:qx.type.BaseString,construct:function(b,d,c){qx.type.BaseString.call(this,b);this.__kp=d;this.__kq=c;}
,members:{__kp:null,__kq:null,translate:function(){return qx.locale.Manager.getInstance().translate(this.__kp,this.__kq);}
}});}
)();
(function(){var a="locale",b="_applyLocale",c="",d="changeLocale",e="_",f="C",g="locale.variant",h="qx.dynlocale",j="qx.locale.Manager",k="String",l="singleton";qx.Class.define(j,{type:l,extend:qx.core.Object,construct:function(){qx.core.Object.call(this);this.__kr=qx.$$translations||{};this.__ks=qx.$$locales||{};var m=qx.core.Environment.get(a);var n=qx.core.Environment.get(g);if(n!==c){m+=e+n;}
;this.__kt=m;this.setLocale(m||this.__ku);}
,statics:{tr:function(p,q){var o=qx.lang.Array.fromArguments(arguments);o.splice(0,1);return qx.locale.Manager.getInstance().translate(p,o);}
,trn:function(s,v,r,u){var t=qx.lang.Array.fromArguments(arguments);t.splice(0,3);if(r!=1){return qx.locale.Manager.getInstance().translate(v,t);}
else {return qx.locale.Manager.getInstance().translate(s,t);}
;}
,trc:function(z,x,y){var w=qx.lang.Array.fromArguments(arguments);w.splice(0,2);return qx.locale.Manager.getInstance().translate(x,w);}
,marktr:function(A){return A;}
},properties:{locale:{check:k,nullable:true,apply:b,event:d}},members:{__ku:f,__kv:null,__kw:null,__kr:null,__ks:null,__kt:null,getLanguage:function(){return this.__kw;}
,getTerritory:function(){return this.getLocale().split(e)[1]||c;}
,getAvailableLocales:function(C){var D=[];for(var B in this.__ks){if(B!=this.__ku){if(this.__ks[B]===null&&!C){continue;}
;D.push(B);}
;}
;return D;}
,__kx:function(E){var G;if(E==null){return null;}
;var F=E.indexOf(e);if(F==-1){G=E;}
else {G=E.substring(0,F);}
;return G;}
,_applyLocale:function(I,H){{}
;this.__kv=I;this.__kw=this.__kx(I);}
,addTranslation:function(J,M){var K=this.__kr;if(K[J]){for(var L in M){K[J][L]=M[L];}
;}
else {K[J]=M;}
;}
,addLocale:function(Q,O){var N=this.__ks;if(N[Q]){for(var P in O){N[Q][P]=O[P];}
;}
else {N[Q]=O;}
;}
,translate:function(U,T,R){var S=this.__kr;return this.__ky(S,U,T,R);}
,localize:function(Y,X,V){var W=this.__ks;return this.__ky(W,Y,X,V);}
,__ky:function(be,bf,bc,bd){{}
;var ba;if(!be){return bf;}
;if(bd){var bb=this.__kx(bd);}
else {bd=this.__kv;bb=this.__kw;}
;if(!ba&&be[bd]){ba=be[bd][bf];}
;if(!ba&&be[bb]){ba=be[bb][bf];}
;if(!ba&&be[this.__ku]){ba=be[this.__ku][bf];}
;if(!ba){ba=bf;}
;if(bc.length>0){var bg=[];for(var i=0;i<bc.length;i++ ){var bh=bc[i];if(bh&&bh.translate){bg[i]=bh.translate();}
else {bg[i]=bh;}
;}
;ba=qx.lang.String.format(ba,bg);}
;if(qx.core.Environment.get(h)){ba=new qx.locale.LocalizedString(ba,bf,bc);}
;return ba;}
},destruct:function(){this.__kr=this.__ks=null;}
});}
)();
(function(){var a="qx.bom.client.Locale",b="-",c="locale",d="",e="android",f="locale.variant";qx.Bootstrap.define(a,{statics:{getLocale:function(){var g=qx.bom.client.Locale.__kz();var h=g.indexOf(b);if(h!=-1){g=g.substr(0,h);}
;return g;}
,getVariant:function(){var i=qx.bom.client.Locale.__kz();var k=d;var j=i.indexOf(b);if(j!=-1){k=i.substr(j+1);}
;return k;}
,__kz:function(){var l=(navigator.userLanguage||navigator.language||d);if(qx.bom.client.OperatingSystem.getName()==e){var m=/(\w{2})-(\w{2})/i.exec(navigator.userAgent);if(m){l=m[0];}
;}
;return l.toLowerCase();}
},defer:function(n){qx.core.Environment.add(c,n.getLocale);qx.core.Environment.add(f,n.getVariant);}
});}
)();
(function(){var a="qx.event.type.Drag";qx.Class.define(a,{extend:qx.event.type.Event,members:{init:function(b,c){qx.event.type.Event.prototype.init.call(this,true,b);if(c){this._native=c.getNativeEvent()||null;this._originalTarget=c.getTarget()||null;}
else {this._native=null;this._originalTarget=null;}
;return this;}
,clone:function(d){var e=qx.event.type.Event.prototype.clone.call(this,d);e._native=this._native;return e;}
,getDocumentLeft:function(){if(this._native==null){return 0;}
;if(this._native.pageX!==undefined){return this._native.pageX;}
else {var f=qx.dom.Node.getWindow(this._native.srcElement);return this._native.clientX+qx.bom.Viewport.getScrollLeft(f);}
;}
,getDocumentTop:function(){if(this._native==null){return 0;}
;if(this._native.pageY!==undefined){return this._native.pageY;}
else {var g=qx.dom.Node.getWindow(this._native.srcElement);return this._native.clientY+qx.bom.Viewport.getScrollTop(g);}
;}
,getManager:function(){return qx.event.Registration.getManager(this.getTarget()).getHandler(qx.event.handler.DragDrop);}
,addType:function(h){this.getManager().addType(h);}
,addAction:function(i){this.getManager().addAction(i);}
,supportsType:function(j){return this.getManager().supportsType(j);}
,supportsAction:function(k){return this.getManager().supportsAction(k);}
,addData:function(l,m){this.getManager().addData(l,m);}
,getData:function(n){return this.getManager().getData(n);}
,getCurrentType:function(){return this.getManager().getCurrentType();}
,getCurrentAction:function(){return this.getManager().getCurrentAction();}
,stopSession:function(){this.getManager().clearSession();}
}});}
)();
(function(){var a="mshtml",b="engine.name",c="qx.bom.Element";qx.Class.define(c,{statics:{addListener:function(g,f,d,self,e){return qx.event.Registration.addListener(g,f,d,self,e);}
,removeListener:function(n,m,h,self,k){return qx.event.Registration.removeListener(n,m,h,self,k);}
,removeListenerById:function(o,p){return qx.event.Registration.removeListenerById(o,p);}
,hasListener:function(s,r,q){return qx.event.Registration.hasListener(s,r,q);}
,focus:function(t){qx.event.Registration.getManager(t).getHandler(qx.event.handler.Focus).focus(t);}
,blur:function(u){qx.event.Registration.getManager(u).getHandler(qx.event.handler.Focus).blur(u);}
,activate:function(v){qx.event.Registration.getManager(v).getHandler(qx.event.handler.Focus).activate(v);}
,deactivate:function(w){qx.event.Registration.getManager(w).getHandler(qx.event.handler.Focus).deactivate(w);}
,capture:function(y,x){qx.event.Registration.getManager(y).getDispatcher(qx.event.dispatch.MouseCapture).activateCapture(y,x);}
,releaseCapture:function(z){qx.event.Registration.getManager(z).getDispatcher(qx.event.dispatch.MouseCapture).releaseCapture(z);}
,clone:function(E,L){var C;if(L||((qx.core.Environment.get(b)==a)&&!qx.xml.Document.isXmlDocument(E))){var G=qx.event.Registration.getManager(E);var A=qx.dom.Hierarchy.getDescendants(E);A.push(E);}
;if((qx.core.Environment.get(b)==a)){for(var i=0,l=A.length;i<l;i++ ){G.toggleAttachedEvents(A[i],false);}
;}
;var C=E.cloneNode(true);if((qx.core.Environment.get(b)==a)){for(var i=0,l=A.length;i<l;i++ ){G.toggleAttachedEvents(A[i],true);}
;}
;if(L===true){var K=qx.dom.Hierarchy.getDescendants(C);K.push(C);var B,J,I,D;for(var i=0,H=A.length;i<H;i++ ){I=A[i];B=G.serializeListeners(I);if(B.length>0){J=K[i];for(var j=0,F=B.length;j<F;j++ ){D=B[j];G.addListener(J,D.type,D.handler,D.self,D.capture);}
;}
;}
;}
;return C;}
}});}
)();
(function(){var a="function",b="plugin.silverlight.version",c="Silverlight",d="Skype.Detection",f="QuickTimeCheckObject.QuickTimeCheck.1",g="Adobe Acrobat",h="plugin.windowsmedia",k="QuickTime",l="plugin.silverlight",m="pdf",n="wmv",o="qx.bom.client.Plugin",p="application/x-skype",q="plugin.divx",r="Chrome PDF Viewer",s="divx",t="Windows Media",u="",v="mshtml",w="skype.click2call",x="plugin.skype",y="plugin.gears",z="plugin.quicktime",A="plugin.windowsmedia.version",B="quicktime",C="DivX Web Player",D="AgControl.AgControl",E="Microsoft.XMLHTTP",F="silverlight",G="plugin.pdf",H="plugin.pdf.version",I="MSXML2.DOMDocument.6.0",J="WMPlayer.OCX.7",K="AcroPDF.PDF",L="plugin.activex",M="plugin.quicktime.version",N="plugin.divx.version",O="npdivx.DivXBrowserPlugin.1",P="object";qx.Bootstrap.define(o,{statics:{getGears:function(){return !!(window.google&&window.google.gears);}
,getActiveX:function(){if(typeof window.ActiveXObject===a){return true;}
;try{return (typeof (new window.ActiveXObject(E))===P||typeof (new window.ActiveXObject(I))===P);}
catch(Q){return false;}
;}
,getSkype:function(){if(qx.bom.client.Plugin.getActiveX()){try{new ActiveXObject(d);return true;}
catch(e){}
;}
;var R=navigator.mimeTypes;if(R){if(p in R){return true;}
;for(var i=0;i<R.length;i++ ){var S=R[i];if(S.type.indexOf(w)!=-1){return true;}
;}
;}
;return false;}
,__kA:{quicktime:{plugin:[k],control:f},wmv:{plugin:[t],control:J},divx:{plugin:[C],control:O},silverlight:{plugin:[c],control:D},pdf:{plugin:[r,g],control:K}},getQuicktimeVersion:function(){var T=qx.bom.client.Plugin.__kA[B];return qx.bom.client.Plugin.__kB(T.control,T.plugin);}
,getWindowsMediaVersion:function(){var U=qx.bom.client.Plugin.__kA[n];return qx.bom.client.Plugin.__kB(U.control,U.plugin);}
,getDivXVersion:function(){var V=qx.bom.client.Plugin.__kA[s];return qx.bom.client.Plugin.__kB(V.control,V.plugin);}
,getSilverlightVersion:function(){var W=qx.bom.client.Plugin.__kA[F];return qx.bom.client.Plugin.__kB(W.control,W.plugin);}
,getPdfVersion:function(){var X=qx.bom.client.Plugin.__kA[m];return qx.bom.client.Plugin.__kB(X.control,X.plugin);}
,getQuicktime:function(){var Y=qx.bom.client.Plugin.__kA[B];return qx.bom.client.Plugin.__kC(Y.control,Y.plugin);}
,getWindowsMedia:function(){var ba=qx.bom.client.Plugin.__kA[n];return qx.bom.client.Plugin.__kC(ba.control,ba.plugin);}
,getDivX:function(){var bb=qx.bom.client.Plugin.__kA[s];return qx.bom.client.Plugin.__kC(bb.control,bb.plugin);}
,getSilverlight:function(){var bc=qx.bom.client.Plugin.__kA[F];return qx.bom.client.Plugin.__kC(bc.control,bc.plugin);}
,getPdf:function(){var bd=qx.bom.client.Plugin.__kA[m];return qx.bom.client.Plugin.__kC(bd.control,bd.plugin);}
,__kB:function(bl,bh){var be=qx.bom.client.Plugin.__kC(bl,bh);if(!be){return u;}
;if(qx.bom.client.Engine.getName()==v){var bf=new ActiveXObject(bl);try{var bj=bf.versionInfo;if(bj!=undefined){return bj;}
;bj=bf.version;if(bj!=undefined){return bj;}
;bj=bf.settings.version;if(bj!=undefined){return bj;}
;}
catch(bm){return u;}
;return u;}
else {var bk=navigator.plugins;var bi=/([0-9]\.[0-9])/g;for(var i=0;i<bk.length;i++ ){var bg=bk[i];for(var j=0;j<bh.length;j++ ){if(bg.name.indexOf(bh[j])!==-1){if(bi.test(bg.name)||bi.test(bg.description)){return RegExp.$1;}
;}
;}
;}
;return u;}
;}
,__kC:function(bq,bo){if(qx.bom.client.Engine.getName()==v){var bn=window.ActiveXObject;if(!bn){return false;}
;try{new ActiveXObject(bq);}
catch(br){return false;}
;return true;}
else {var bp=navigator.plugins;if(!bp){return false;}
;var name;for(var i=0;i<bp.length;i++ ){name=bp[i].name;for(var j=0;j<bo.length;j++ ){if(name.indexOf(bo[j])!==-1){return true;}
;}
;}
;return false;}
;}
},defer:function(bs){qx.core.Environment.add(y,bs.getGears);qx.core.Environment.add(z,bs.getQuicktime);qx.core.Environment.add(M,bs.getQuicktimeVersion);qx.core.Environment.add(h,bs.getWindowsMedia);qx.core.Environment.add(A,bs.getWindowsMediaVersion);qx.core.Environment.add(q,bs.getDivX);qx.core.Environment.add(N,bs.getDivXVersion);qx.core.Environment.add(l,bs.getSilverlight);qx.core.Environment.add(b,bs.getSilverlightVersion);qx.core.Environment.add(G,bs.getPdf);qx.core.Environment.add(H,bs.getPdfVersion);qx.core.Environment.add(L,bs.getActiveX);qx.core.Environment.add(x,bs.getSkype);}
});}
)();
(function(){var a='<\?xml version="1.0" encoding="utf-8"?>\n<',b="MSXML2.DOMDocument.3.0",c="qx.xml.Document",d="",e=" />",f="xml.domparser",g="SelectionLanguage",h="'",j="MSXML2.XMLHTTP.3.0",k="plugin.activex",m="No XML implementation available!",n="MSXML2.XMLHTTP.6.0",o="xml.implementation",p=" xmlns='",q="text/xml",r="XPath",s="MSXML2.DOMDocument.6.0",t="HTML";qx.Bootstrap.define(c,{statics:{DOMDOC:null,XMLHTTP:null,isXmlDocument:function(u){if(u.nodeType===9){return u.documentElement.nodeName!==t;}
else if(u.ownerDocument){return this.isXmlDocument(u.ownerDocument);}
else {return false;}
;}
,create:function(v,w){if(qx.core.Environment.get(k)){var x=new ActiveXObject(this.DOMDOC);if(this.DOMDOC==b){x.setProperty(g,r);}
;if(w){var y=a;y+=w;if(v){y+=p+v+h;}
;y+=e;x.loadXML(y);}
;return x;}
;if(qx.core.Environment.get(o)){return document.implementation.createDocument(v||d,w||d,null);}
;throw new Error(m);}
,fromString:function(A){if(qx.core.Environment.get(k)){var B=qx.xml.Document.create();B.loadXML(A);return B;}
;if(qx.core.Environment.get(f)){var z=new DOMParser();return z.parseFromString(A,q);}
;throw new Error(m);}
},defer:function(D){if(qx.core.Environment.get(k)){var C=[s,b];var E=[n,j];for(var i=0,l=C.length;i<l;i++ ){try{new ActiveXObject(C[i]);new ActiveXObject(E[i]);}
catch(F){continue;}
;D.DOMDOC=C[i];D.XMLHTTP=E[i];break;}
;}
;}
});}
)();
(function(){var a="function",b="xml.implementation",c="xml.attributens",d="xml.selectnodes",e="<a></a>",f="xml.getqualifieditem",g="SelectionLanguage",h="xml.getelementsbytagnamens",i="qx.bom.client.Xml",j="xml.domproperties",k="xml.selectsinglenode",l="1.0",m="xml.createnode",n="xml.domparser",o="getProperty",p="undefined",q="XML",r="string",s="xml.createelementns";qx.Bootstrap.define(i,{statics:{getImplementation:function(){return document.implementation&&document.implementation.hasFeature&&document.implementation.hasFeature(q,l);}
,getDomParser:function(){return typeof window.DOMParser!==p;}
,getSelectSingleNode:function(){return typeof qx.xml.Document.create().selectSingleNode!==p;}
,getSelectNodes:function(){return typeof qx.xml.Document.create().selectNodes!==p;}
,getElementsByTagNameNS:function(){return typeof qx.xml.Document.create().getElementsByTagNameNS!==p;}
,getDomProperties:function(){var t=qx.xml.Document.create();return (o in t&&typeof t.getProperty(g)===r);}
,getAttributeNS:function(){var u=qx.xml.Document.fromString(e).documentElement;return typeof u.getAttributeNS===a&&typeof u.setAttributeNS===a;}
,getCreateElementNS:function(){return typeof qx.xml.Document.create().createElementNS===a;}
,getCreateNode:function(){return typeof qx.xml.Document.create().createNode!==p;}
,getQualifiedItem:function(){var v=qx.xml.Document.fromString(e).documentElement;return typeof v.attributes.getQualifiedItem!==p;}
},defer:function(w){qx.core.Environment.add(b,w.getImplementation);qx.core.Environment.add(n,w.getDomParser);qx.core.Environment.add(k,w.getSelectSingleNode);qx.core.Environment.add(d,w.getSelectNodes);qx.core.Environment.add(h,w.getElementsByTagNameNS);qx.core.Environment.add(j,w.getDomProperties);qx.core.Environment.add(c,w.getAttributeNS);qx.core.Environment.add(s,w.getCreateElementNS);qx.core.Environment.add(m,w.getCreateNode);qx.core.Environment.add(f,w.getQualifiedItem);}
});}
)();
(function(){var a="mshtml",b="engine.name",c="blur",d="losecapture",e="focus",f="click",g="qx.event.dispatch.MouseCapture",h="capture",i="scroll";qx.Class.define(g,{extend:qx.event.dispatch.AbstractBubbling,construct:function(j,k){qx.event.dispatch.AbstractBubbling.call(this,j);this.__cx=j.getWindow();this.__cz=k;j.addListener(this.__cx,c,this.releaseCapture,this);j.addListener(this.__cx,e,this.releaseCapture,this);j.addListener(this.__cx,i,this.releaseCapture,this);}
,statics:{PRIORITY:qx.event.Registration.PRIORITY_FIRST},members:{__cz:null,__kD:null,__kE:true,__cx:null,_getParent:function(l){return l.parentNode;}
,canDispatchEvent:function(n,event,m){return !!(this.__kD&&this.__kF[m]);}
,dispatchEvent:function(p,event,o){if(!qx.event.handler.MouseEmulation.ON){if(o==f){event.stopPropagation();this.releaseCapture();return;}
;}
;if(this.__kE||!qx.dom.Hierarchy.contains(this.__kD,p)){p=this.__kD;}
;qx.event.dispatch.AbstractBubbling.prototype.dispatchEvent.call(this,p,event,o);}
,__kF:{"mouseup":1,"mousedown":1,"click":1,"dblclick":1,"mousemove":1,"mouseout":1,"mouseover":1},activateCapture:function(r,q){var q=q!==false;if(this.__kD===r&&this.__kE==q){return;}
;if(this.__kD){this.releaseCapture();}
;this.nativeSetCapture(r,q);if(this.hasNativeCapture){var self=this;qx.bom.Event.addNativeListener(r,d,function(){qx.bom.Event.removeNativeListener(r,d,arguments.callee);self.releaseCapture();}
);}
;this.__kE=q;this.__kD=r;this.__cz.fireEvent(r,h,qx.event.type.Event,[true,false]);}
,getCaptureElement:function(){return this.__kD;}
,releaseCapture:function(){var s=this.__kD;if(!s){return;}
;this.__kD=null;this.__cz.fireEvent(s,d,qx.event.type.Event,[true,false]);this.nativeReleaseCapture(s);}
,hasNativeCapture:qx.core.Environment.get(b)==a,nativeSetCapture:qx.core.Environment.select(b,{"mshtml":function(u,t){u.setCapture(t!==false);}
,"default":(function(){}
)}),nativeReleaseCapture:qx.core.Environment.select(b,{"mshtml":function(v){v.releaseCapture();}
,"default":(function(){}
)})},destruct:function(){this.__kD=this.__cx=this.__cz=null;}
,defer:function(w){qx.event.Registration.addDispatcher(w);}
});}
)();
(function(){var a="_applyTheme",b="qx.theme.manager.Font",c="_dynamic",d="Theme",e="changeTheme",f="singleton";qx.Class.define(b,{type:f,extend:qx.util.ValueManager,properties:{theme:{check:d,nullable:true,apply:a,event:e}},members:{resolveDynamic:function(h){var g=this._dynamic;return h instanceof qx.bom.Font?h:g[h];}
,resolve:function(l){var k=this._dynamic;var i=k[l];if(i){return i;}
;var j=this.getTheme();if(j!==null&&j.fonts[l]){var m=this.__kW(j.fonts[l]);return k[l]=(new m).set(j.fonts[l]);}
;return l;}
,isDynamic:function(q){var p=this._dynamic;if(q&&(q instanceof qx.bom.Font||p[q]!==undefined)){return true;}
;var o=this.getTheme();if(o!==null&&q&&o.fonts[q]){var n=this.__kW(o.fonts[q]);p[q]=(new n).set(o.fonts[q]);return true;}
;return false;}
,__kV:function(s,r){if(s[r].include){var t=s[s[r].include];s[r].include=null;delete s[r].include;s[r]=qx.lang.Object.mergeWith(s[r],t,false);this.__kV(s,r);}
;}
,_applyTheme:function(y){var u=this._dynamic;for(var x in u){if(u[x].themed){u[x].dispose();delete u[x];}
;}
;if(y){var v=y.fonts;for(var x in v){if(v[x].include&&v[v[x].include]){this.__kV(v,x);}
;var w=this.__kW(v[x]);u[x]=(new w).set(v[x]);u[x].themed=true;}
;}
;this._setDynamic(u);}
,__kW:function(z){if(z.sources){return qx.bom.webfonts.WebFont;}
;return qx.bom.Font;}
},destruct:function(){this._disposeMap(c);}
});}
)();
(function(){var a="Boolean",b="px",c="_applyItalic",d="_applyBold",e="underline",f="_applyTextShadow",g="Integer",h="_applyFamily",j="_applyLineHeight",k='"',m="Array",n="line-through",o="overline",p="Color",q="String",r="",s="italic",t="normal",u="qx.bom.Font",v="bold",w="Number",x="_applyDecoration",y=" ",z="_applySize",A=",",B="_applyColor";qx.Class.define(u,{extend:qx.core.Object,construct:function(D,C){qx.core.Object.call(this);this.__kX={fontFamily:r,fontSize:null,fontWeight:null,fontStyle:null,textDecoration:null,lineHeight:null,color:null,textShadow:null};if(D!==undefined){this.setSize(D);}
;if(C!==undefined){this.setFamily(C);}
;}
,statics:{fromString:function(H){var I=new qx.bom.Font();var F=H.split(/\s+/);var name=[];var G;for(var i=0;i<F.length;i++ ){switch(G=F[i]){case v:I.setBold(true);break;case s:I.setItalic(true);break;case e:I.setDecoration(e);break;default:var E=parseInt(G,10);if(E==G||qx.lang.String.contains(G,b)){I.setSize(E);}
else {name.push(G);}
;break;};}
;if(name.length>0){I.setFamily(name);}
;return I;}
,fromConfig:function(K){var J=new qx.bom.Font;J.set(K);return J;}
,__kY:{fontFamily:r,fontSize:r,fontWeight:r,fontStyle:r,textDecoration:r,lineHeight:1.2,color:r,textShadow:r},getDefaultStyles:function(){return this.__kY;}
},properties:{size:{check:g,nullable:true,apply:z},lineHeight:{check:w,nullable:true,apply:j},family:{check:m,nullable:true,apply:h},bold:{check:a,nullable:true,apply:d},italic:{check:a,nullable:true,apply:c},decoration:{check:[e,n,o],nullable:true,apply:x},color:{check:p,nullable:true,apply:B},textShadow:{nullable:true,check:q,apply:f}},members:{__kX:null,_applySize:function(M,L){this.__kX.fontSize=M===null?null:M+b;}
,_applyLineHeight:function(O,N){this.__kX.lineHeight=O===null?null:O;}
,_applyFamily:function(P,Q){var R=r;for(var i=0,l=P.length;i<l;i++ ){if(P[i].indexOf(y)>0){R+=k+P[i]+k;}
else {R+=P[i];}
;if(i!==l-1){R+=A;}
;}
;this.__kX.fontFamily=R;}
,_applyBold:function(T,S){this.__kX.fontWeight=T==null?null:T?v:t;}
,_applyItalic:function(V,U){this.__kX.fontStyle=V==null?null:V?s:t;}
,_applyDecoration:function(X,W){this.__kX.textDecoration=X==null?null:X;}
,_applyColor:function(ba,Y){this.__kX.color=null;if(ba){this.__kX.color=qx.theme.manager.Color.getInstance().resolve(ba);}
;}
,_applyTextShadow:function(bc,bb){this.__kX.textShadow=bc==null?null:bc;}
,getStyles:function(){return this.__kX;}
}});}
)();
(function(){var a="changeStatus",b="qx.bom.webfonts.WebFont",c="_applySources",d="",e="qx.event.type.Data";qx.Class.define(b,{extend:qx.bom.Font,events:{"changeStatus":e},properties:{sources:{nullable:true,apply:c}},members:{__la:null,_applySources:function(h,k){var f=[];for(var i=0,l=h.length;i<l;i++ ){var g=this._quoteFontFamily(h[i].family);f.push(g);var j=h[i].source;qx.bom.webfonts.Manager.getInstance().require(g,j,this._onWebFontChangeStatus,this);}
;this.setFamily(f.concat(this.getFamily()));}
,_onWebFontChangeStatus:function(m){var n=m.getData();this.fireDataEvent(a,n);{}
;}
,_quoteFontFamily:function(o){return o.replace(/["']/g,d);}
}});}
)();
(function(){var a="m",b="os.name",c=")",d="os.version",e="qx.bom.webfonts.Manager",f="svg",g="chrome",h="browser.name",k="singleton",n=",\n",o="src: ",p="mobileSafari",q="'eot)",r="');",s="changeStatus",t="interval",u="#",v="firefox",w="!",y="eot",z="ios",A="'eot')",B="\.(",C="}\n",D="font-family: ",E="browser.documentmode",F="mobile safari",G="safari",H="@font-face.*?",I="",J="ttf",K=";\n",L="') format('svg')",M="') format('woff')",N="('embedded-opentype')",O="browser.version",P="opera",Q="engine.version",R="Couldn't create @font-face rule for WebFont ",S="mshtml",T="engine.name",U="url('",V="src: url('",W="('embedded-opentype)",X="\nfont-style: normal;\nfont-weight: normal;",Y="?#iefix') format('embedded-opentype')",bh="woff",bi="ie",bj=";",bf="@font-face {",bg="') format('truetype')";qx.Class.define(e,{extend:qx.core.Object,type:k,construct:function(){qx.core.Object.call(this);this.__lb=[];this.__lc={};this.__ej=[];this.__ld=this.getPreferredFormats();}
,statics:{FONT_FORMATS:[y,bh,J,f],VALIDATION_TIMEOUT:5000},members:{__lb:null,__le:null,__lc:null,__ld:null,__ej:null,__lf:null,require:function(bm,bn,bo,bq){var bl=[];for(var i=0,l=bn.length;i<l;i++ ){var bp=bn[i].split(u);var bk=qx.util.ResourceManager.getInstance().toUri(bp[0]);if(bp.length>1){bk=bk+u+bp[1];}
;bl.push(bk);}
;if(qx.core.Environment.get(T)==S&&(parseInt(qx.core.Environment.get(Q))<9)||qx.core.Environment.get(E)<9){if(!this.__lf){this.__lf=new qx.event.Timer(100);this.__lf.addListener(t,this.__lh,this);}
;if(!this.__lf.isEnabled()){this.__lf.start();}
;this.__ej.push([bm,bl,bo,bq]);}
else {this.__lg(bm,bl,bo,bq);}
;}
,remove:function(bs){var br=null;for(var i=0,l=this.__lb.length;i<l;i++ ){if(this.__lb[i]==bs){br=i;this.__ln(bs);break;}
;}
;if(br){qx.lang.Array.removeAt(this.__lb,br);}
;if(bs in this.__lc){this.__lc[bs].dispose();delete this.__lc[bs];}
;}
,getPreferredFormats:function(){var bt=[];var bx=qx.core.Environment.get(h);var bu=qx.core.Environment.get(O);var bw=qx.core.Environment.get(b);var bv=qx.core.Environment.get(d);if((bx==bi&&qx.core.Environment.get(E)>=9)||(bx==v&&bu>=3.6)||(bx==g&&bu>=6)){bt.push(bh);}
;if((bx==P&&bu>=10)||(bx==G&&bu>=3.1)||(bx==v&&bu>=3.5)||(bx==g&&bu>=4)||(bx==F&&bw==z&&bv>=4.2)){bt.push(J);}
;if(bx==bi&&bu>=4){bt.push(y);}
;if(bx==p&&bw==z&&bv>=4.1){bt.push(f);}
;return bt;}
,removeStyleSheet:function(){this.__lb=[];if(this.__le){qx.bom.Stylesheet.removeSheet(this.__le);}
;this.__le=null;}
,__lg:function(bA,bC,bz,bD){if(!qx.lang.Array.contains(this.__lb,bA)){var bE=this.__lj(bC);var bB=this.__lk(bA,bE);if(!bB){throw new Error(R+bA+w);}
;if(!this.__le){this.__le=qx.bom.Stylesheet.createElement();}
;try{this.__lm(bB);}
catch(bF){{}
;}
;this.__lb.push(bA);}
;if(!this.__lc[bA]){this.__lc[bA]=new qx.bom.webfonts.Validator(bA);this.__lc[bA].setTimeout(qx.bom.webfonts.Manager.VALIDATION_TIMEOUT);this.__lc[bA].addListenerOnce(s,this.__li,this);}
;if(bz){var by=bD||window;this.__lc[bA].addListenerOnce(s,bz,by);}
;this.__lc[bA].validate();}
,__lh:function(){if(this.__ej.length==0){this.__lf.stop();return;}
;var bG=this.__ej.shift();this.__lg.apply(this,bG);}
,__li:function(bH){var bI=bH.getData();if(bI.valid===false){qx.event.Timer.once(function(){this.remove(bI.family);}
,this,250);}
;}
,__lj:function(bJ){var bL=qx.bom.webfonts.Manager.FONT_FORMATS;var bK={};for(var i=0,l=bJ.length;i<l;i++ ){var bM=null;for(var x=0;x<bL.length;x++ ){var bN=new RegExp(B+bL[x]+c);var bO=bN.exec(bJ[i]);if(bO){bM=bO[1];}
;}
;if(bM){bK[bM]=bJ[i];}
;}
;return bK;}
,__lk:function(bR,bU){var bT=[];var bP=this.__ld.length>0?this.__ld:qx.bom.webfonts.Manager.FONT_FORMATS;for(var i=0,l=bP.length;i<l;i++ ){var bQ=bP[i];if(bU[bQ]){bT.push(this.__ll(bQ,bU[bQ]));}
;}
;var bS=o+bT.join(n)+bj;bS=D+bR+K+bS;bS=bS+X;return bS;}
,__ll:function(bW,bV){switch(bW){case y:return U+bV+r+V+bV+Y;case bh:return U+bV+M;case J:return U+bV+bg;case f:return U+bV+L;default:return null;};}
,__lm:function(bY){var bX=bf+bY+C;if(qx.core.Environment.get(h)==bi&&qx.core.Environment.get(E)<9){var ca=this.__lo(this.__le.cssText);ca+=bX;this.__le.cssText=ca;}
else {this.__le.insertRule(bX,this.__le.cssRules.length);}
;}
,__ln:function(cb){var ce=new RegExp(H+cb,a);for(var i=0,l=document.styleSheets.length;i<l;i++ ){var cc=document.styleSheets[i];if(cc.cssText){var cd=cc.cssText.replace(/\n/g,I).replace(/\r/g,I);cd=this.__lo(cd);if(ce.exec(cd)){cd=cd.replace(ce,I);}
;cc.cssText=cd;}
else if(cc.cssRules){for(var j=0,m=cc.cssRules.length;j<m;j++ ){var cd=cc.cssRules[j].cssText.replace(/\n/g,I).replace(/\r/g,I);if(ce.exec(cd)){this.__le.deleteRule(j);return;}
;}
;}
;}
;}
,__lo:function(cf){return cf.replace(q,A).replace(W,N);}
},destruct:function(){delete this.__lb;this.removeStyleSheet();for(var cg in this.__lc){this.__lc[cg].dispose();}
;qx.bom.webfonts.Validator.removeDefaultHelperElements();}
});}
)();
(function(){var a="sans-serif",b="__ls",c="changeStatus",d="Integer",e="auto",f="qx.event.type.Data",g="0",h="qx.bom.webfonts.Validator",i="interval",j="Georgia",k="WEei",l="Times New Roman",m="Arial",n="normal",o="Helvetica",p="350px",q="_applyFontFamily",r="-1000px",s="hidden",t="serif",u="span",v="absolute",w=",";qx.Class.define(h,{extend:qx.core.Object,construct:function(x){qx.core.Object.call(this);if(x){this.setFontFamily(x);}
;this.__lp=this._getRequestedHelpers();}
,statics:{COMPARISON_FONTS:{sans:[m,o,a],serif:[l,j,t]},HELPER_CSS:{position:v,margin:g,padding:g,top:r,left:r,fontSize:p,width:e,height:e,lineHeight:n,fontVariant:n,visibility:s},COMPARISON_STRING:k,__lq:null,__lr:null,removeDefaultHelperElements:function(){var y=qx.bom.webfonts.Validator.__lr;if(y){for(var z in y){document.body.removeChild(y[z]);}
;}
;delete qx.bom.webfonts.Validator.__lr;}
},properties:{fontFamily:{nullable:true,init:null,apply:q},timeout:{check:d,init:5000}},events:{"changeStatus":f},members:{__lp:null,__ls:null,__lt:null,validate:function(){this.__lt=new Date().getTime();if(this.__ls){this.__ls.restart();}
else {this.__ls=new qx.event.Timer(100);this.__ls.addListener(i,this.__lu,this);qx.event.Timer.once(function(){this.__ls.start();}
,this,0);}
;}
,_reset:function(){if(this.__lp){for(var B in this.__lp){var A=this.__lp[B];document.body.removeChild(A);}
;this.__lp=null;}
;}
,_isFontValid:function(){if(!qx.bom.webfonts.Validator.__lq){this.__es();}
;if(!this.__lp){this.__lp=this._getRequestedHelpers();}
;var D=qx.bom.element.Dimension.getWidth(this.__lp.sans);var C=qx.bom.element.Dimension.getWidth(this.__lp.serif);var E=qx.bom.webfonts.Validator;if(D!==E.__lq.sans&&C!==E.__lq.serif){return true;}
;return false;}
,_getRequestedHelpers:function(){var F=[this.getFontFamily()].concat(qx.bom.webfonts.Validator.COMPARISON_FONTS.sans);var G=[this.getFontFamily()].concat(qx.bom.webfonts.Validator.COMPARISON_FONTS.serif);return {sans:this._getHelperElement(F),serif:this._getHelperElement(G)};}
,_getHelperElement:function(H){var I=qx.lang.Object.clone(qx.bom.webfonts.Validator.HELPER_CSS);if(H){if(I.fontFamily){I.fontFamily+=w+H.join(w);}
else {I.fontFamily=H.join(w);}
;}
;var J=document.createElement(u);J.innerHTML=qx.bom.webfonts.Validator.COMPARISON_STRING;qx.bom.element.Style.setStyles(J,I);document.body.appendChild(J);return J;}
,_applyFontFamily:function(L,K){if(L!==K){this._reset();}
;}
,__es:function(){var M=qx.bom.webfonts.Validator;if(!M.__lr){M.__lr={sans:this._getHelperElement(M.COMPARISON_FONTS.sans),serif:this._getHelperElement(M.COMPARISON_FONTS.serif)};}
;M.__lq={sans:qx.bom.element.Dimension.getWidth(M.__lr.sans),serif:qx.bom.element.Dimension.getWidth(M.__lr.serif)};}
,__lu:function(){if(this._isFontValid()){this.__ls.stop();this._reset();this.fireDataEvent(c,{family:this.getFontFamily(),valid:true});}
else {var N=new Date().getTime();if(N-this.__lt>=this.getTimeout()){this.__ls.stop();this._reset();this.fireDataEvent(c,{family:this.getFontFamily(),valid:false});}
;}
;}
},destruct:function(){this._reset();this.__ls.stop();this.__ls.removeListener(i,this.__lu,this);this._disposeObjects(b);}
});}
)();
(function(){var a="$test_",b="_",c="qx.dev.unit.JsUnitTestResult";qx.Class.define(c,{extend:qx.dev.unit.TestResult,construct:function(){qx.dev.unit.TestResult.call(this);this.__nN=[];}
,members:{__nN:null,run:function(d,e){var f=a+d.getFullName().replace(/\W/g,b);this.__nN.push(f);window[f]=e;}
,exportToJsUnit:function(){var self=this;window.exposeTestFunctionNames=function(){return self.__nN;}
;window.isTestPageLoaded=true;}
}});}
)();
(function(){var a="qx.application.IApplication";qx.Interface.define(a,{members:{main:function(){}
,finalize:function(){}
,close:function(){}
,terminate:function(){}
}});}
)();
(function(){var a="qx.application.Mobile",b="qx.mobile.nativescroll";qx.Class.define(a,{extend:qx.core.Object,implement:[qx.application.IApplication],include:qx.locale.MTranslation,construct:function(){qx.core.Object.call(this);}
,members:{__a:null,main:function(){this.__a=this._createRootWidget();if(qx.core.Environment.get(b)==false){this.__a.setShowScrollbarY(false);}
;}
,getRoot:function(){return this.__a;}
,_createRootWidget:function(){return new qx.ui.mobile.core.Root();}
,finalize:function(){}
,close:function(){}
,terminate:function(){}
},destruct:function(){this.__a=null;}
});}
)();
(function(){var a="ready",b="qx.bom.Lifecycle",c="shutdown";qx.Class.define(b,{statics:{onReady:function(d,f){var g=qx.event.Registration;var e=g.getManager(window).getHandler(qx.event.handler.Application);if(e&&e.isApplicationReady()){d.call(f);}
else {g.addListener(window,a,d,f);}
;}
,onShutdown:function(h,i){qx.event.Registration.addListener(window,c,h,i);}
}});}
)();
(function(){var a="changeVisibility",b="_applyAttribute",c="Boolean",d="px",e="qx.event.type.Mouse",f="true",g="excluded",h="div",j="qx.event.type.Tap",k="css.transform.3d",m="readonly",n="px,",o="exclude",p="changeId",q="pointerEvents",r="data-selectable",s="qx.event.type.KeyInput",t="visible",u="_transformId",v="disabled",w="qx.event.type.MouseWheel",x="qx.event.type.KeySequence",y="_applyEnabled",z="String",A="undefined",B="_applyId",C=") ",D="changeEnabled",E="_transform",F="",G="visibility",H="_applyDefaultCssClass",I="data-activatable",J="qx.event.type.Focus",K="false",L="This widget has no children!",M="deg) ",N="px) ",O="qx_id_",P="none",Q="Number",R="translate(",S="rotate(",T="translate3d(",U="qx.ui.mobile.core.Widget",V="_applyStyle",W='anonymous',X="qx.event.type.Event",Y="hidden",bh="transform",bi="qx.event.type.Touch",bj="_applyVisibility",bf="scale(",bg=",";qx.Class.define(U,{extend:qx.core.Object,include:[qx.locale.MTranslation],construct:function(){qx.core.Object.call(this);this._setContainerElement(this._createContainerElement());this.__fP=[];this.setId(this.getId());this.initDefaultCssClass();this.initName();this.initAnonymous();this.initActivatable();}
,events:{mousemove:e,mouseover:e,mouseout:e,mousedown:e,mouseup:e,click:e,dblclick:e,contextmenu:e,beforeContextmenuOpen:e,mousewheel:w,touchstart:bi,touchend:bi,touchmove:bi,touchcancel:bi,tap:j,longtap:j,swipe:bi,keyup:x,keydown:x,keypress:x,keyinput:s,domupdated:X,appear:X,disappear:X,focus:J,blur:J,focusin:J,focusout:J,activate:J,deactivate:J},properties:{defaultCssClass:{check:z,init:null,nullable:true,apply:H},enabled:{init:true,check:c,nullable:false,event:D,apply:y},name:{check:z,init:null,nullable:true,apply:b},anonymous:{check:c,init:null,nullable:true,apply:V},id:{check:z,init:null,nullable:true,apply:B,transform:u,event:p},visibility:{check:[t,Y,g],init:t,apply:bj,event:a},activatable:{check:c,init:false,apply:b},rotation:{check:Q,nullable:true,init:null,apply:E},scaleX:{check:Q,nullable:true,init:null,apply:E},scaleY:{check:Q,nullable:true,init:null,apply:E},translateX:{check:Q,nullable:true,init:0,apply:E},translateY:{check:Q,nullable:true,init:0,apply:E},translateZ:{check:Q,nullable:true,init:0,apply:E}},statics:{ID_PREFIX:O,__G:{},__po:0,__pp:null,onShutdown:function(){window.clearTimeout(qx.ui.mobile.core.Widget.__pp);delete qx.ui.mobile.core.Widget.__G;}
,getCurrentId:function(){return qx.ui.mobile.core.Widget.__po;}
,registerWidget:function(bk){var bl=bk.getId();var bm=qx.ui.mobile.core.Widget.__G;{}
;bm[bl]=bk;}
,unregisterWidget:function(bn){delete qx.ui.mobile.core.Widget.__G[bn];}
,getWidgetById:function(bo){return qx.ui.mobile.core.Widget.__G[bo];}
,scheduleDomUpdated:function(){if(qx.ui.mobile.core.Widget.__pp==null){qx.ui.mobile.core.Widget.__pp=window.setTimeout(qx.ui.mobile.core.Widget.domUpdated,0);}
;}
,domUpdated:qx.event.GlobalError.observeMethod(function(){var bp=qx.ui.mobile.core.Widget;window.clearTimeout(bp.__pp);bp.__pp=null;qx.event.handler.Appear.refresh();qx.ui.mobile.core.DomUpdatedHandler.refresh();}
),addAttributeMapping:function(bs,bq,bt){{var br;}
;qx.ui.mobile.core.Widget.ATTRIBUTE_MAPPING[bs]={attribute:bq,values:bt};}
,addStyleMapping:function(bu,bv,bx){{var bw;}
;qx.ui.mobile.core.Widget.STYLE_MAPPING[bu]={style:bv,values:bx};}
,ATTRIBUTE_MAPPING:{"selectable":{attribute:r,values:{"true":null,"false":K}},"activatable":{attribute:I,values:{"true":f,"false":null}},"readOnly":{attribute:m}},STYLE_MAPPING:{"anonymous":{style:q,values:{"true":P,"false":null}}}},members:{__pq:null,__iC:null,__pr:null,__fP:null,__iG:null,_getTagName:function(){return h;}
,_createContainerElement:function(){return qx.dom.Element.create(this._getTagName());}
,_domUpdated:function(){qx.ui.mobile.core.Widget.scheduleDomUpdated();}
,_transformId:function(by){if(by==null){var bz=qx.ui.mobile.core.Widget;by=bz.ID_PREFIX+bz.__po++ ;}
;return by;}
,_applyId:function(bB,bA){if(bA!=null){qx.ui.mobile.core.Widget.unregisterWidget(bA);}
;var bC=this.getContainerElement();bC.id=bB;qx.ui.mobile.core.Widget.registerWidget(this);}
,_applyEnabled:function(bE,bD){if(bE){this.removeCssClass(v);this._setStyle(W,this.getAnonymous());}
else {this.addCssClass(v);this._setStyle(W,true);}
;}
,_add:function(bG,bF){{}
;this._initializeChildLayout(bG,bF);this.getContentElement().appendChild(bG.getContainerElement());this.__fP.push(bG);this._domUpdated();}
,_addAt:function(bK,bH,bJ){if(bK.getLayoutParent()==this){qx.lang.Array.remove(this.__fP,bK);}
;var bI=this.__fP[bH];if(bI){this._addBefore(bK,bI,bJ);}
else {this._add(bK,bJ);}
;}
,_addBefore:function(bN,bM,bL){{}
;if(bN==bM){return;}
;this._initializeChildLayout(bN,bL);this.getContentElement().insertBefore(bN.getContainerElement(),bM.getContainerElement());qx.lang.Array.insertBefore(this.__fP,bN,bM);this._domUpdated();}
,_addAfter:function(bS,bR,bO){{}
;if(bS==bR){return;}
;this._initializeChildLayout(bS,bO);var length=this._getChildren().length;var bQ=this._indexOf(bR);if(bQ==length-1){this.getContentElement().appendChild(bS.getContainerElement());}
else {var bP=this._getChildren()[bQ+1];this.getContentElement().insertBefore(bS.getContainerElement(),bP.getContainerElement());}
;qx.lang.Array.insertAfter(this.__fP,bS,bR);this._domUpdated();}
,_remove:function(bT){bT.setLayoutParent(null);this._domUpdated();}
,_removeAt:function(bU){if(!this.__fP){throw new Error(L);}
;var bV=this.__fP[bU];this._remove(bV);}
,_removeAll:function(){var bW=this.__fP.concat();for(var i=0,l=bW.length;i<l;i++ ){this._remove(bW[i]);}
;return bW;}
,_indexOf:function(bY){var bX=this.__fP;if(!bX){return -1;}
;return bX.indexOf(bY);}
,setLayoutParent:function(parent){if(this.__pr===parent){return;}
;var ca=this.__pr;if(ca&&!ca.$$disposed){this.__pr.removeChild(this);}
;this.__pr=parent||null;}
,removeChild:function(cc){qx.lang.Array.remove(this.__fP,cc);this.getContentElement().removeChild(cc.getContainerElement());var cb=this._getLayout();if(cb){cb.disconnectFromChildWidget(cc);}
;}
,getLayoutParent:function(){return this.__pr;}
,_getChildren:function(){return this.__fP;}
,_hasChildren:function(){return this.__fP&&this.__fP.length>0;}
,_setLayout:function(cd){{}
;if(this.__iG){this.__iG.connectToWidget(null);for(var i=0;i<length;i++ ){var ce=this._getChildren()[i];this.__iG.disconnectFromChildWidget(ce);}
;}
;if(cd){cd.connectToWidget(this);}
;this.__iG=cd;this._domUpdated();}
,_initializeChildLayout:function(ch,cf){ch.setLayoutParent(this);ch.setLayoutProperties(cf);var cg=this._getLayout();if(cg){cg.connectToChildWidget(ch);}
;}
,_getLayout:function(){return this.__iG;}
,setLayoutProperties:function(ci){var parent=this.getLayoutParent();if(parent){parent.updateLayoutProperties(this,ci);}
;}
,updateLayoutProperties:function(cj,cl){var ck=this._getLayout();if(ck){ck.setLayoutProperties(cj,cl);}
;this._domUpdated();}
,updateLayout:function(cn,cm,cp){var co=this._getLayout();if(co){co.updateLayout(cn,cm,cp);}
;this._domUpdated();}
,_setHtml:function(cq){this.getContentElement().innerHTML=cq||F;this._domUpdated();}
,_transform:function(){var cs=F;if(this.getRotation()!=null){cs=cs+S+this.getRotation()+M;}
;if(this.getScaleX()!=null&&this.getScaleY()!=null){cs=cs+bf+this.getScaleX()+bg+this.getScaleY()+C;}
;if(this.getTranslateX()!=null&&this.getTranslateY()!=null){var cr=qx.core.Environment.get(k);if(cr&&this.getTranslateZ()!=null){cs=cs+T+this.getTranslateX()+d+bg+this.getTranslateY()+n+this.getTranslateZ()+N;}
else {cs=cs+R+this.getTranslateX()+d+bg+this.getTranslateY()+N;}
;}
;qx.bom.element.Style.set(this.getContainerElement(),bh,cs);}
,_applyAttribute:function(cv,cu,ct){this._setAttribute(ct,cv);}
,_setAttribute:function(cw,cz){var cy=qx.ui.mobile.core.Widget.ATTRIBUTE_MAPPING[cw];if(cy){cw=cy.attribute||cw;var cx=cy.values;cz=cx&&typeof cx[cz]!==A?cx[cz]:cz;}
;var cA=this.getContainerElement();if(cz!=null){qx.bom.element.Attribute.set(cA,cw,cz);}
else {qx.bom.element.Attribute.reset(cA,cw);}
;this._domUpdated();}
,_getAttribute:function(cB){var cC=this.getContainerElement();return qx.bom.element.Attribute.get(cC,cB);}
,_applyStyle:function(cF,cE,cD){this._setStyle(cD,cF);}
,_setStyle:function(cG,cI){var cH=qx.ui.mobile.core.Widget.STYLE_MAPPING[cG];if(cH){cG=cH.style||cG;cI=cH.values[cI];}
;var cJ=this.getContainerElement();if(cI!=null){qx.bom.element.Style.set(cJ,cG,cI);}
else {qx.bom.element.Style.reset(cJ,cG);}
;this._domUpdated();}
,_getStyle:function(cK){var cL=this.getContainerElement();return qx.bom.element.Style.get(cL,cK);}
,_applyDefaultCssClass:function(cN,cM){if(cM){this.removeCssClass(cM);}
;if(cN){this.addCssClass(cN);}
;}
,addCssClass:function(cO){qx.bom.element.Class.add(this.getContainerElement(),cO);this._domUpdated();}
,addCssClasses:function(cP){if(cP){qx.bom.element.Class.addClasses(this.getContainerElement(),cP);this._domUpdated();}
;}
,removeCssClass:function(cQ){qx.bom.element.Class.remove(this.getContainerElement(),cQ);this._domUpdated();}
,removeCssClasses:function(cR){if(cR){qx.bom.element.Class.removeClasses(this.getContainerElement(),cR);this._domUpdated();}
;}
,toggleCssClass:function(cS){if(this.hasCssClass(cS)){this.removeCssClass(cS);}
else {this.addCssClass(cS);}
;}
,hasCssClass:function(cT){return qx.bom.element.Class.has(this.getContainerElement(),cT);}
,_applyVisibility:function(cV,cU){if(cV==g){this.addCssClass(o);}
else if(cV==t){this.removeCssClass(o);this._setStyle(G,t);}
else if(cV==Y){this._setStyle(G,Y);}
;this._domUpdated();}
,__ps:function(cW,cX){this.setVisibility(cW);var parent=this.getLayoutParent();if(parent){parent.updateLayout(this,cW,cX);}
;}
,show:function(cY){this.__ps(t,cY);}
,hide:function(da){this.__ps(Y,da);}
,exclude:function(db){this.__ps(g,db);}
,isVisible:function(){return this.getVisibility()===t;}
,isHidden:function(){return this.getVisibility()!==t;}
,isExcluded:function(){return this.getVisibility()===g;}
,isSeeable:function(){return this.getContainerElement().offsetWidth>0;}
,_setContainerElement:function(dc){this.__pq=dc;}
,getContainerElement:function(){return this.__pq;}
,getContentElement:function(){if(!this.__iC){this.__iC=this._getContentElement();}
;return this.__iC;}
,_getContentElement:function(){return this.getContainerElement();}
,destroy:function(){if(this.$$disposed){return;}
;var parent=this.__pr;if(parent){parent._remove(this);}
;this.dispose();}
},destruct:function(){if(!qx.core.ObjectRegistry.inShutDown){qx.event.Registration.removeAllListeners(this);if(this.getId()){qx.ui.mobile.core.Widget.unregisterWidget(this.getId());}
;}
;this.__pr=this.__pq=this.__iC=null;if(this.__iG){this.__iG.dispose();}
;this.__iG=null;}
,defer:function(dd){qx.bom.Lifecycle.onShutdown(dd.onShutdown,dd);}
});}
)();
(function(){var a="abstract",b="The layout does not support the ",c="qx.ui.mobile.layout.Abstract",d="updateLayout",e=" property",f="qx.event.type.Data";qx.Class.define(c,{extend:qx.core.Object,type:a,events:{updateLayout:f},members:{_widget:null,__pt:null,__pu:null,_getCssClasses:function(){{}
;}
,_getSupportedChildLayoutProperties:function(){return null;}
,_setLayoutProperty:function(g,h,i){{}
;}
,setLayoutProperties:function(k,m){if(m==null){return;}
;var l=this._getSupportedChildLayoutProperties();if(!l){return;}
;for(var j in m){if(!l[j]){throw new Error(b+j+e);}
;var n=m[j];this._setLayoutProperty(k,j,n);this._addPropertyToChildLayoutCache(k,j,n);}
;}
,connectToWidget:function(o){if(this._widget){this._widget.removeCssClasses(this._getCssClasses());}
;this._widget=o;if(o){o.addCssClasses(this._getCssClasses());if(this.__pt){for(var p in this.__pt){this.reset(p);this.set(p,this.__pt[p]);}
;}
;}
else {this.__pt=null;}
;}
,connectToChildWidget:function(q){}
,disconnectFromChildWidget:function(r){}
,updateLayout:function(t,s,u){this.fireDataEvent(d,{widget:t,action:s,properties:u});}
,_addCachedProperty:function(v,w){if(!this.__pt){this.__pt={};}
;this.__pt[v]=w;}
,_getChildLayoutPropertyValue:function(y,x){var z=this.__pv(y);return z[x];}
,_addPropertyToChildLayoutCache:function(B,A,D){var C=this.__pv(B);if(D==null){delete C[A];}
else {C[A]=D;}
;}
,__pv:function(E){if(!this.__pu){this.__pu={};}
;var F=this.__pu;var G=E.toHashCode();if(!F[G]){F[G]={};}
;return F[G];}
},destruct:function(){this._widget=null;}
});}
)();
(function(){var a="touchmove",b="qx.ui.mobile.core.EventHandler",c="touchend",d="touchcancel",e="data-selectable",f="true",g="data-activatable",h="touchstart",j="false",k="active";qx.Class.define(b,{extend:qx.core.Object,implement:qx.event.IEventHandler,construct:function(){qx.core.Object.call(this);this.__er=qx.event.Registration.getManager(window);}
,statics:{PRIORITY:qx.event.Registration.PRIORITY_FIRST,SUPPORTED_TYPES:{mousemove:1,mouseover:1,mouseout:1,mousedown:1,mouseup:1,click:1,dblclick:1,contextmenu:1,mousewheel:1,keyup:1,keydown:1,keypress:1,keyinput:1,capture:1,losecapture:1,focusin:1,focusout:1,focus:1,blur:1,activate:1,deactivate:1,appear:1,disappear:1,resize:1,dragstart:1,dragend:1,dragover:1,dragleave:1,drop:1,drag:1,dragchange:1,droprequest:1,touchstart:1,touchend:1,touchmove:1,touchcancel:1,tap:1,longtap:1,swipe:1},IGNORE_CAN_HANDLE:false,__pw:null,__px:null,__py:null,__pz:null,__dD:null,__hv:function(o){var m=qx.ui.mobile.core.EventHandler;m.__px=qx.bom.Viewport.getScrollLeft();m.__py=qx.bom.Viewport.getScrollTop();var n=o.getChangedTargetTouches()[0];m.__pz=n.screenY;m.__pB();var p=o.getTarget();while(p&&p.parentNode&&p.parentNode.nodeType==1&&qx.bom.element.Attribute.get(p,g)!=f){p=p.parentNode;}
;m.__pw=p;m.__pA=window.setTimeout(function(){m.__pA=null;var q=m.__pw;if(q&&(qx.bom.element.Attribute.get(q,e)!=j)){qx.bom.element.Class.add(q,k);}
;}
,100);}
,__hx:function(r){qx.ui.mobile.core.EventHandler.__pC();}
,__hw:function(u){var s=qx.ui.mobile.core.EventHandler;var v=u.getChangedTargetTouches()[0];var t=v.screenY-s.__pz;if(s.__pw&&Math.abs(t)>=qx.event.handler.TouchCore.TAP_MAX_DISTANCE){s.__pC();}
;if(s.__pw&&(s.__px!=qx.bom.Viewport.getScrollLeft()||s.__py!=qx.bom.Viewport.getScrollTop())){s.__pC();}
;}
,__pB:function(){var w=qx.ui.mobile.core.EventHandler;if(w.__pA){window.clearTimeout(w.__pA);w.__pA=null;}
;}
,__pC:function(){var x=qx.ui.mobile.core.EventHandler;x.__pB();var y=x.__pw;if(y){qx.bom.element.Class.remove(y,k);}
;x.__pw=null;}
},members:{__er:null,canHandleEvent:function(A,z){return A instanceof qx.ui.mobile.core.Widget;}
,registerEvent:function(D,C,B){var E=D.getContainerElement();qx.event.Registration.addListener(E,C,this._dispatchEvent,this,B);}
,unregisterEvent:function(H,G,F){var I=H.getContainerElement();qx.event.Registration.removeListener(I,G,this._dispatchEvent,this,F);}
,_dispatchEvent:function(K){var O=K.getTarget();if(!O||O.id==null){return;}
;var N=qx.ui.mobile.core.Widget.getWidgetById(O.id);if(K.getRelatedTarget){var V=K.getRelatedTarget();if(V&&V.id){var U=qx.ui.mobile.core.Widget.getWidgetById(V.id);}
;}
;var Q=K.getCurrentTarget();var S=qx.ui.mobile.core.Widget.getWidgetById(Q.id);if(!S){return;}
;var J=K.getEventPhase()==qx.event.type.Event.CAPTURING_PHASE;var T=K.getType();var P=this.__er.getListeners(S,T,J);if(!P||P.length===0){return;}
;var L=qx.event.Pool.getInstance().getObject(K.constructor);K.clone(L);L.setTarget(N);L.setRelatedTarget(U||null);L.setCurrentTarget(S);var W=K.getOriginalTarget();if(W&&W.id){var M=qx.ui.mobile.core.Widget.getWidgetById(W.id);L.setOriginalTarget(M);}
else {L.setOriginalTarget(O);}
;for(var i=0,l=P.length;i<l;i++ ){var R=P[i].context||S;P[i].handler.call(R,L);}
;if(L.getPropagationStopped()){K.stopPropagation();}
;if(L.getDefaultPrevented()){K.preventDefault();}
;qx.event.Pool.getInstance().poolObject(L);}
},destruct:function(){this.__er=null;}
,defer:function(X){qx.event.Registration.addHandler(X);qx.event.Registration.addListener(document,h,X.__hv);qx.event.Registration.addListener(document,c,X.__hx);qx.event.Registration.addListener(document,d,X.__hx);qx.event.Registration.addListener(document,a,X.__hw);}
});}
)();
(function(){var a="qx.ui.mobile.core.DomUpdatedHandler",b="domupdated";qx.Class.define(a,{extend:qx.core.Object,implement:qx.event.IEventHandler,construct:function(c){qx.core.Object.call(this);this.__er=c;this.__hH={};qx.ui.mobile.core.DomUpdatedHandler.__hI[this.$$hash]=this;}
,statics:{PRIORITY:qx.event.Registration.PRIORITY_NORMAL,SUPPORTED_TYPES:{domupdated:1},IGNORE_CAN_HANDLE:false,__hI:{},refresh:function(){var d=this.__hI;for(var e in d){d[e].refresh();}
;}
},members:{__er:null,__hH:null,canHandleEvent:function(g,f){return g instanceof qx.ui.mobile.core.Widget;}
,registerEvent:function(k,l,i){var j=k.$$hash;var h=this.__hH;if(h&&!h[j]){h[j]=k;}
;}
,unregisterEvent:function(p,q,n){var o=p.$$hash;var m=this.__hH;if(!m){return;}
;if(m[o]){delete m[o];}
;}
,refresh:function(){var u=this.__hH;var t;for(var s in u){t=u[s];if(t&&!t.$$disposed&&t.isSeeable()){var r=qx.event.Registration.createEvent(b);this.__er.dispatchEvent(t,r);}
;}
;}
},destruct:function(){this.__er=this.__hH=null;delete qx.ui.mobile.core.DomUpdatedHandler.__hI[this.$$hash];}
,defer:function(v){qx.event.Registration.addHandler(v);}
});}
)();
(function(){var a="qx.ui.mobile.core.MLayoutHandling";qx.Mixin.define(a,{members:{setLayout:function(b){this._setLayout(b);}
,getLayout:function(){return this._getLayout();}
},statics:{remap:function(c){c.getLayout=c._getLayout;c.setLayout=c._setLayout;}
}});}
)();
(function(){var a="qx.ui.mobile.core.MChildrenHandling";qx.Mixin.define(a,{members:{getChildren:function(){return this._getChildren();}
,hasChildren:function(){return this._hasChildren();}
,indexOf:function(b){return this._indexOf(b);}
,add:function(d,c){this._add(d,c);}
,addAt:function(g,e,f){this._addAt(g,e,f);}
,addBefore:function(i,j,h){this._addBefore(i,j,h);}
,addAfter:function(m,l,k){this._addAfter(m,l,k);}
,remove:function(n){this._remove(n);}
,removeAt:function(o){this._removeAt(o);}
,removeAll:function(){this._removeAll();}
},statics:{remap:function(p){p.getChildren=p._getChildren;p.hasChildren=p._hasChildren;p.indexOf=p._indexOf;p.add=p._add;p.addAt=p._addAt;p.addBefore=p._addBefore;p.addAfter=p._addAfter;p.remove=p._remove;p.removeAt=p._removeAt;p.removeAll=p._removeAll;}
}});}
)();
(function(){var a="qx.ui.mobile.container.Composite";qx.Class.define(a,{extend:qx.ui.mobile.core.Widget,include:[qx.ui.mobile.core.MChildrenHandling,qx.ui.mobile.core.MLayoutHandling],construct:function(b){qx.ui.mobile.core.Widget.call(this);if(b){this.setLayout(b);}
;}
,defer:function(c,d){qx.ui.mobile.core.MChildrenHandling.remap(d);qx.ui.mobile.core.MLayoutHandling.remap(d);}
});}
)();
(function(){var a="mobile",b="qx.ui.mobile.core.Root",c="Boolean",d="root",e="orientationchange",f="overflow-y",g="os.name",h="portrait",i="os.version",j="v",k="hidden",l="ios",m="landscape",n="auto",o="px",p="_applyShowScrollbarY";qx.Class.define(b,{extend:qx.ui.mobile.container.Composite,construct:function(q,r){this.__a=q||document.body;qx.ui.mobile.container.Composite.call(this,r||new qx.ui.mobile.layout.VBox());this.addCssClass(a);this.addCssClass(qx.core.Environment.get(g));this.addCssClass(j+qx.core.Environment.get(i).charAt(0));qx.event.Registration.addListener(window,e,this._onOrientationChange,this);this._onOrientationChange();}
,properties:{defaultCssClass:{refine:true,init:d},showScrollbarY:{check:c,init:true,apply:p}},members:{__a:null,_createContainerElement:function(){return this.__a;}
,_applyShowScrollbarY:function(t,s){this._setStyle(f,t?n:k);}
,getWidth:function(){return qx.bom.element.Dimension.getWidth(this.__a);}
,getHeight:function(){return qx.bom.element.Dimension.getHeight(this.__a);}
,_onOrientationChange:function(v){var u=null;if(v){u=v.isPortrait();}
else {u=qx.bom.Viewport.isPortrait();}
;if(u){this.addCssClass(h);this.removeCssClass(m);}
else {this.addCssClass(m);this.removeCssClass(h);}
;if(qx.core.Environment.get(g)==l){document.documentElement.style.height=window.innerHeight+o;window.scrollTo(0,0);}
;}
},destruct:function(){this.__a=null;qx.event.Registration.removeListener(window,e,this._onOrientationChange,this);}
});}
)();
(function(){var a="abstract",b="_applyLayoutChange",c="flex",d="middle",e="bottom",f="boxAlignEnd",g="boxReverse",h="boxAlignStart",j="center",k="boxPackStart",l="boxAlignCenter",m="Boolean",n="boxPackEnd",o="top",p="left",q="right",r="boxFlex",s="boxPackCenter",t="qx.ui.mobile.layout.AbstractBox";qx.Class.define(t,{extend:qx.ui.mobile.layout.Abstract,type:a,construct:function(v,u,w){qx.ui.mobile.layout.Abstract.call(this);if(v){this.setAlignX(v);}
;if(u){this.setAlignY(u);}
;if(w){this.setReversed(w);}
;}
,properties:{alignX:{check:[p,j,q],nullable:true,init:null,apply:b},alignY:{check:[o,d,e],nullable:true,init:null,apply:b},reversed:{check:m,nullable:true,init:null,apply:b}},statics:{PROPERTY_CSS_MAPPING:{"alignX":{"hbox":{"left":k,"center":s,"right":n},"vbox":{"left":h,"center":l,"right":f}},"alignY":{"hbox":{"top":h,"middle":l,"bottom":f},"vbox":{"top":k,"middle":s,"bottom":n}},"reversed":{"hbox":{"true":g,"false":null},"vbox":{"true":g,"false":null}}},SUPPORTED_CHILD_LAYOUT_PROPERTIES:{"flex":1}},members:{_getSupportedChildLayoutProperties:function(){return qx.ui.mobile.layout.AbstractBox.SUPPORTED_CHILD_LAYOUT_PROPERTIES;}
,_setLayoutProperty:function(x,y,A){if(y==c){var z=this._getChildLayoutPropertyValue(x,y);if(z!=null){x.removeCssClass(r+A);}
;x.addCssClass(r+A);}
;}
,connectToWidget:function(B){if(this._widget){this.resetAlignX();this.resetAlignY();this.resetReversed();}
;qx.ui.mobile.layout.Abstract.prototype.connectToWidget.call(this,B);}
,disconnectFromChildWidget:function(C){qx.ui.mobile.layout.Abstract.prototype.disconnectFromChildWidget.call(this);for(var i=0;i<=6;i++ ){C.removeCssClass(r+i);}
;}
,_applyLayoutChange:function(F,E,D){if(this._widget){var H=this._getCssClasses()[0];var I=qx.ui.mobile.layout.AbstractBox.PROPERTY_CSS_MAPPING[D][H];if(E){var G=I[E];if(G){this._widget.removeCssClass(G);}
;}
;if(F){var J=I[F];if(J){this._widget.addCssClass(J);}
;}
;}
else {if(F){this._addCachedProperty(D,F);}
;}
;}
}});}
)();
(function(){var a="vbox",b="qx.ui.mobile.layout.VBox";qx.Class.define(b,{extend:qx.ui.mobile.layout.AbstractBox,members:{_getCssClasses:function(){return [a];}
}});}
)();
(function(){var a="qx.dev.unit.TestLoaderMobile",b="__unknown_class__";qx.Class.define(a,{extend:qx.application.Mobile,include:[qx.dev.unit.MTestLoader],members:{main:function(){qx.application.Mobile.prototype.main.call(this);qx.log.appender.Console;var c=this._getClassNameFromUrl();if(c!==b){this.setTestNamespace(this._getClassNameFromUrl());}
;if(window.top.jsUnitTestSuite){this.runJsUnit();return;}
;if(window==window.top){this.runStandAlone();return;}
;}
}});}
)();
(function(){var a='.qxconsole .messages{background:white;height:100%;width:100%;overflow:auto;}',b="Enter",c="px",d='</div>',f='.qxconsole .messages .user-result{background:white}',g='.qxconsole .messages .level-error{background:#FFE2D5}',h="div",i="user-command",j='<div class="command">',k="Up",l='.qxconsole .command input:focus{outline:none;}',m='.qxconsole .messages .type-key{color:#565656;font-style:italic}',n="none",o='.qxconsole .messages .type-instance{color:#565656;font-weight:bold}',p='.qxconsole .messages div{padding:0px 4px;}',q='.qxconsole .messages .level-debug{background:white}',r='.qxconsole .messages .type-class{color:#5F3E8A;font-weight:bold}',s="DIV",t='.qxconsole .messages .level-user{background:#E3EFE9}',u='<div class="qxconsole">',v="",w="D",x='.qxconsole .messages .type-map{color:#CC3E8A;font-weight:bold;}',y='.qxconsole .messages .type-string{color:black;font-weight:normal;}',z='.qxconsole .control a{text-decoration:none;color:black;}',A='<div class="messages">',B='.qxconsole .messages .type-boolean{color:#15BC91;font-weight:normal;}',C='<input type="text"/>',D="clear",E='.qxconsole .command input{width:100%;border:0 none;font-family:Consolas,Monaco,monospace;font-size:11px;line-height:1.2;}',F="keypress",G='.qxconsole .messages .type-array{color:#CC3E8A;font-weight:bold;}',H='.qxconsole{z-index:10000;width:600px;height:300px;top:0px;right:0px;position:absolute;border-left:1px solid black;color:black;border-bottom:1px solid black;color:black;font-family:Consolas,Monaco,monospace;font-size:11px;line-height:1.2;}',I='.qxconsole .command{background:white;padding:2px 4px;border-top:1px solid black;}',J='.qxconsole .messages .user-command{color:blue}',K="F7",L="qx.log.appender.Console",M='.qxconsole .messages .level-info{background:#DEEDFA}',N="block",O='.qxconsole .messages .level-warn{background:#FFF7D5}',P='.qxconsole .messages .type-stringify{color:#565656;font-weight:bold}',Q='.qxconsole .messages .user-error{background:#FFE2D5}',R='.qxconsole .control{background:#cdcdcd;border-bottom:1px solid black;padding:4px 8px;}',S='<div class="control"><a href="javascript:qx.log.appender.Console.clear()">Clear</a> | <a href="javascript:qx.log.appender.Console.toggle()">Hide</a></div>',T=">>> ",U="Down",V='.qxconsole .messages .type-number{color:#155791;font-weight:normal;}';qx.Class.define(L,{statics:{__nu:null,__cr:null,__nv:null,__nw:null,init:function(){var W=[H,R,z,a,p,J,f,Q,q,M,O,g,t,y,V,B,G,x,m,r,o,P,I,E,l];qx.bom.Stylesheet.createElement(W.join(v));var Y=[u,S,A,d,j,C,d,d];var ba=document.createElement(s);ba.innerHTML=Y.join(v);var X=ba.firstChild;document.body.appendChild(ba.firstChild);this.__nu=X;this.__cr=X.childNodes[1];this.__nv=X.childNodes[2].firstChild;this.__nz();qx.log.Logger.register(this);qx.core.ObjectRegistry.register(this);}
,dispose:function(){qx.event.Registration.removeListener(document.documentElement,F,this.__id,this);qx.log.Logger.unregister(this);}
,clear:function(){this.__cr.innerHTML=v;}
,process:function(bb){this.__cr.appendChild(qx.log.appender.Util.toHtml(bb));this.__nx();}
,__nx:function(){this.__cr.scrollTop=this.__cr.scrollHeight;}
,__dn:true,toggle:function(){if(!this.__nu){this.init();}
else if(this.__nu.style.display==n){this.show();}
else {this.__nu.style.display=n;}
;}
,show:function(){if(!this.__nu){this.init();}
else {this.__nu.style.display=N;this.__cr.scrollTop=this.__cr.scrollHeight;}
;}
,__ny:[],execute:function(){var bd=this.__nv.value;if(bd==v){return;}
;if(bd==D){this.clear();return;}
;var bc=document.createElement(h);bc.innerHTML=qx.log.appender.Util.escapeHTML(T+bd);bc.className=i;this.__ny.push(bd);this.__nw=this.__ny.length;this.__cr.appendChild(bc);this.__nx();try{var be=window.eval(bd);}
catch(bf){qx.log.Logger.error(bf);}
;if(be!==undefined){qx.log.Logger.debug(be);}
;}
,__nz:function(e){this.__cr.style.height=(this.__nu.clientHeight-this.__nu.firstChild.offsetHeight-this.__nu.lastChild.offsetHeight)+c;}
,__id:function(e){var bh=e.getKeyIdentifier();if((bh==K)||(bh==w&&e.isCtrlPressed())){this.toggle();e.preventDefault();}
;if(!this.__nu){return;}
;if(!qx.dom.Hierarchy.contains(this.__nu,e.getTarget())){return;}
;if(bh==b&&this.__nv.value!=v){this.execute();this.__nv.value=v;}
;if(bh==k||bh==U){this.__nw+=bh==k?-1:1;this.__nw=Math.min(Math.max(0,this.__nw),this.__ny.length);var bg=this.__ny[this.__nw];this.__nv.value=bg||v;this.__nv.select();}
;}
},defer:function(bi){qx.event.Registration.addListener(document.documentElement,F,bi.__id,bi);}
});}
)();
(function(){var a="Use qx.dev.StackTrace.FORMAT_STACKTRACE instead",b="function",c="<span class='object'>",d="]:",e="&gt;",f="<span class='object' title='Object instance with hash code: ",g="FORMAT_STACK",h="string",k="level-",l="0",m="&lt;",n="<span class='offset'>",o="</span> ",p="}",q=":",r="qx.log.appender.Util",s="&amp;",t="&#39;",u="DIV",v="",w="]",x="'>",y="<span>",z="[",A=", ",B="</span>",C="\n",D="&quot;",E="<span class='type-key'>",F="{",G="</span>:<span class='type-",H="</span>: ",I=" ",J="]</span>: ",K="map",L="?",M="<span class='type-";qx.Class.define(r,{statics:{toHtml:function(V){var X=[];var T,W,O,Q;X.push(n,this.formatOffset(V.offset,6),o);if(V.object){var N=V.win.qx.core.ObjectRegistry.fromHashCode(V.object);if(N){X.push(f+N.$$hash+x,N.classname,z,N.$$hash,J);}
;}
else if(V.clazz){X.push(c+V.clazz.classname,H);}
;var P=V.items;for(var i=0,U=P.length;i<U;i++ ){T=P[i];W=T.text;if(W instanceof Array){var Q=[];for(var j=0,S=W.length;j<S;j++ ){O=W[j];if(typeof O===h){Q.push(y+this.escapeHTML(O)+B);}
else if(O.key){Q.push(E+O.key+G+O.type+x+this.escapeHTML(O.text)+B);}
else {Q.push(M+O.type+x+this.escapeHTML(O.text)+B);}
;}
;X.push(M+T.type+x);if(T.type===K){X.push(F,Q.join(A),p);}
else {X.push(z,Q.join(A),w);}
;X.push(B);}
else {X.push(M+T.type+x+this.escapeHTML(W)+o);}
;}
;var R=document.createElement(u);R.innerHTML=X.join(v);R.className=k+V.level;return R;}
,formatOffset:function(bb,length){var ba=bb.toString();var bc=(length||6)-ba.length;var Y=v;for(var i=0;i<bc;i++ ){Y+=l;}
;return Y+ba;}
,escapeHTML:function(bd){return String(bd).replace(/[<>&"']/g,this.__nt);}
,__nt:function(bf){var be={"<":m,">":e,"&":s,"'":t,'"':D};return be[bf]||L;}
,toText:function(bg){return this.toTextArray(bg).join(I);}
,toTextArray:function(bn){var bp=[];bp.push(this.formatOffset(bn.offset,6));if(bn.object){var bh=bn.win.qx.core.ObjectRegistry.fromHashCode(bn.object);if(bh){bp.push(bh.classname+z+bh.$$hash+d);}
;}
else if(bn.clazz){bp.push(bn.clazz.classname+q);}
;var bi=bn.items;var bl,bo;for(var i=0,bm=bi.length;i<bm;i++ ){bl=bi[i];bo=bl.text;if(bl.trace&&bl.trace.length>0){if(typeof (this.FORMAT_STACK)==b){qx.log.Logger.deprecatedConstantWarning(qx.log.appender.Util,g,a);bo+=C+this.FORMAT_STACK(bl.trace);}
else {bo+=C+bl.trace;}
;}
;if(bo instanceof Array){var bj=[];for(var j=0,bk=bo.length;j<bk;j++ ){bj.push(bo[j].text);}
;if(bl.type===K){bp.push(F,bj.join(A),p);}
else {bp.push(z,bj.join(A),w);}
;}
else {bp.push(bo);}
;}
;return bp;}
}});}
)();
(function(){var a="testrunner.TestLoaderMobile";qx.Class.define(a,{extend:qx.dev.unit.TestLoaderMobile,statics:{getInstance:function(){return this.instance;}
},members:{main:function(){testrunner.TestLoader.instance=this;qx.dev.unit.TestLoaderMobile.prototype.main.call(this);}
}});}
)();
(function(){var a="Abstract method call",b="abstract",c="qx.application.AbstractGui";qx.Class.define(c,{type:b,extend:qx.core.Object,implement:[qx.application.IApplication],include:qx.locale.MTranslation,members:{__a:null,_createRootWidget:function(){throw new Error(a);}
,getRoot:function(){return this.__a;}
,main:function(){qx.theme.manager.Meta.getInstance().initialize();qx.ui.tooltip.Manager.getInstance();this.__a=this._createRootWidget();}
,finalize:function(){this.render();}
,render:function(){qx.ui.core.queue.Manager.flush();}
,close:function(d){}
,terminate:function(){}
},destruct:function(){this.__a=null;}
});}
)();
(function(){var a="__dd",b="widget",c="qx.ui.tooltip.ToolTip",d="Boolean",f="",g="interval",h="mouseover",i="_applyCurrent",j="mouseout",k="__df",l="qx.ui.tooltip.Manager",m="mousemove",n="focusout",o="tooltip-error",p="singleton",q="__dc";qx.Class.define(l,{type:p,extend:qx.core.Object,construct:function(){qx.core.Object.call(this);qx.event.Registration.addListener(document.body,h,this.__dk,this,true);this.__dc=new qx.event.Timer();this.__dc.addListener(g,this.__dh,this);this.__dd=new qx.event.Timer();this.__dd.addListener(g,this.__di,this);this.__de={left:0,top:0};}
,properties:{current:{check:c,nullable:true,apply:i},showInvalidToolTips:{check:d,init:true},showToolTips:{check:d,init:true}},members:{__de:null,__dd:null,__dc:null,__df:null,__dg:null,getSharedTooltip:function(){if(!this.__df){this.__df=new qx.ui.tooltip.ToolTip().set({rich:true});}
;return this.__df;}
,getSharedErrorTooltip:function(){if(!this.__dg){this.__dg=new qx.ui.tooltip.ToolTip().set({appearance:o,rich:true});this.__dg.setLabel(f);this.__dg.syncAppearance();}
;return this.__dg;}
,_applyCurrent:function(t,s){if(s&&qx.ui.core.Widget.contains(s,t)){return;}
;if(s){if(!s.isDisposed()){s.exclude();}
;this.__dc.stop();this.__dd.stop();}
;var u=qx.event.Registration;var r=document.body;if(t){this.__dc.startWith(t.getShowTimeout());u.addListener(r,j,this.__dl,this,true);u.addListener(r,n,this.__dm,this,true);u.addListener(r,m,this.__dj,this,true);}
else {u.removeListener(r,j,this.__dl,this,true);u.removeListener(r,n,this.__dm,this,true);u.removeListener(r,m,this.__dj,this,true);}
;}
,__dh:function(e){var v=this.getCurrent();if(v&&!v.isDisposed()){this.__dd.startWith(v.getHideTimeout());if(v.getPlaceMethod()==b){v.placeToWidget(v.getOpener());}
else {v.placeToPoint(this.__de);}
;v.show();}
;this.__dc.stop();}
,__di:function(e){var w=this.getCurrent();if(w&&!w.isDisposed()){w.exclude();}
;this.__dd.stop();this.resetCurrent();}
,__dj:function(e){var x=this.__de;x.left=Math.round(e.getDocumentLeft());x.top=Math.round(e.getDocumentTop());}
,__dk:function(e){var y=qx.ui.core.Widget.getWidgetByElement(e.getTarget());this.showToolTip(y);}
,showToolTip:function(B){if(!B){return;}
;var C,A,D,z;while(B!=null){C=B.getToolTip();A=B.getToolTipText()||null;D=B.getToolTipIcon()||null;if(qx.Class.hasInterface(B.constructor,qx.ui.form.IForm)&&!B.isValid()){z=B.getInvalidMessage();}
;if(C||A||D||z){break;}
;B=B.getLayoutParent();}
;if(!B||!B.getEnabled()||B.isBlockToolTip()||(!z&&!this.getShowToolTips())||(z&&!this.getShowInvalidToolTips())){return;}
;if(z){C=this.getSharedErrorTooltip().set({label:z});}
;if(!C){C=this.getSharedTooltip().set({label:A,icon:D});}
;this.setCurrent(C);C.setOpener(B);}
,__dl:function(e){var E=qx.ui.core.Widget.getWidgetByElement(e.getTarget());if(!E){return;}
;var F=qx.ui.core.Widget.getWidgetByElement(e.getRelatedTarget());if(!F){return;}
;var G=this.getCurrent();if(G&&(F==G||qx.ui.core.Widget.contains(G,F))){return;}
;if(F&&E&&qx.ui.core.Widget.contains(E,F)){return;}
;if(G&&!F){this.setCurrent(null);}
else {this.resetCurrent();}
;}
,__dm:function(e){var H=qx.ui.core.Widget.getWidgetByElement(e.getTarget());if(!H){return;}
;var I=this.getCurrent();if(I&&I==H.getToolTip()){this.setCurrent(null);}
;}
},destruct:function(){qx.event.Registration.removeListener(document.body,h,this.__dk,this,true);this._disposeObjects(q,a,k);this.__de=null;}
});}
)();
(function(){var a="qx.ui.core.MLayoutHandling";qx.Mixin.define(a,{members:{setLayout:function(b){this._setLayout(b);}
,getLayout:function(){return this._getLayout();}
},statics:{remap:function(c){c.getLayout=c._getLayout;c.setLayout=c._setLayout;}
}});}
)();
(function(){var a="qx.ui.core.MChildrenHandling";qx.Mixin.define(a,{members:{getChildren:function(){return this._getChildren();}
,hasChildren:function(){return this._hasChildren();}
,indexOf:function(b){return this._indexOf(b);}
,add:function(d,c){this._add(d,c);}
,addAt:function(g,e,f){this._addAt(g,e,f);}
,addBefore:function(h,j,i){this._addBefore(h,j,i);}
,addAfter:function(m,k,l){this._addAfter(m,k,l);}
,remove:function(n){this._remove(n);}
,removeAt:function(o){return this._removeAt(o);}
,removeAll:function(){return this._removeAll();}
},statics:{remap:function(p){p.getChildren=p._getChildren;p.hasChildren=p._hasChildren;p.indexOf=p._indexOf;p.add=p._add;p.addAt=p._addAt;p.addBefore=p._addBefore;p.addAfter=p._addAfter;p.remove=p._remove;p.removeAt=p._removeAt;p.removeAll=p._removeAll;}
}});}
)();
(function(){var a="qx.ui.container.Composite",b="addChildWidget",c="removeChildWidget",d="qx.event.type.Data";qx.Class.define(a,{extend:qx.ui.core.Widget,include:[qx.ui.core.MChildrenHandling,qx.ui.core.MLayoutHandling],construct:function(e){qx.ui.core.Widget.call(this);if(e!=null){this._setLayout(e);}
;}
,events:{addChildWidget:d,removeChildWidget:d},members:{_afterAddChild:function(f){this.fireNonBubblingEvent(b,qx.event.type.Data,[f]);}
,_afterRemoveChild:function(g){this.fireNonBubblingEvent(c,qx.event.type.Data,[g]);}
},defer:function(h,i){qx.ui.core.MChildrenHandling.remap(i);qx.ui.core.MLayoutHandling.remap(i);}
});}
)();
(function(){var a="qx.ui.popup.Popup",b="visible",c="excluded",d="popup",e="Boolean";qx.Class.define(a,{extend:qx.ui.container.Composite,include:qx.ui.core.MPlacement,construct:function(f){qx.ui.container.Composite.call(this,f);this.initVisibility();}
,properties:{appearance:{refine:true,init:d},visibility:{refine:true,init:c},autoHide:{check:e,init:true}},members:{show:function(){if(this.getLayoutParent()==null){qx.core.Init.getApplication().getRoot().add(this);}
;qx.ui.container.Composite.prototype.show.call(this);}
,_applyVisibility:function(i,h){qx.ui.container.Composite.prototype._applyVisibility.call(this,i,h);var g=qx.ui.popup.Manager.getInstance();i===b?g.add(this):g.remove(this);}
},destruct:function(){if(!qx.ui.popup.Manager.getInstance().isDisposed()){qx.ui.popup.Manager.getInstance().remove(this);}
;}
});}
)();
(function(){var a="__kG",b="blur",c="mousedown",d="singleton",f="qx.ui.popup.Manager";qx.Class.define(f,{type:d,extend:qx.core.Object,construct:function(){qx.core.Object.call(this);this.__kG=[];qx.event.Registration.addListener(document.documentElement,c,this.__kI,this,true);qx.bom.Element.addListener(window,b,this.hideAll,this);}
,members:{__kG:null,add:function(g){{}
;this.__kG.push(g);this.__kH();}
,remove:function(h){{}
;qx.lang.Array.remove(this.__kG,h);this.__kH();}
,hideAll:function(){var l=this.__kG.length,j={};while(l-- ){j=this.__kG[l];if(j.getAutoHide()){j.exclude();}
;}
;}
,__kH:function(){var k=1e7;for(var i=0;i<this.__kG.length;i++ ){this.__kG[i].setZIndex(k++ );}
;}
,__kI:function(e){var n=qx.ui.core.Widget.getWidgetByElement(e.getTarget());var o=this.__kG;for(var i=0;i<o.length;i++ ){var m=o[i];if(!m.getAutoHide()||n==m||qx.ui.core.Widget.contains(m,n)){continue;}
;m.exclude();}
;}
},destruct:function(){qx.event.Registration.removeListener(document.documentElement,c,this.__kI,this,true);this._disposeArray(a);}
});}
)();
(function(){var a="_applyRich",b="qx.ui.tooltip.ToolTip",c="_applyIcon",d="tooltip",f="qx.ui.core.Widget",g="mouseover",h="Boolean",i="arrow",j="left",k="right",l="_applyLabel",m="Integer",n="_applyArrowPosition",o="String",p="atom";qx.Class.define(b,{extend:qx.ui.popup.Popup,construct:function(q,r){qx.ui.popup.Popup.call(this);this.setLayout(new qx.ui.layout.HBox());this._createChildControl(i);this._createChildControl(p);if(q!=null){this.setLabel(q);}
;if(r!=null){this.setIcon(r);}
;this.addListener(g,this._onMouseOver,this);}
,properties:{appearance:{refine:true,init:d},showTimeout:{check:m,init:700,themeable:true},hideTimeout:{check:m,init:4000,themeable:true},label:{check:o,nullable:true,apply:l},icon:{check:o,nullable:true,apply:c,themeable:true},rich:{check:h,init:false,apply:a},opener:{check:f,nullable:true},arrowPosition:{check:[j,k],init:j,themeable:true,apply:n}},members:{_forwardStates:{placementLeft:true},_createChildControlImpl:function(u,t){var s;switch(u){case p:s=new qx.ui.basic.Atom();this._add(s,{flex:1});break;case i:s=new qx.ui.basic.Image();this._add(s);};return s||qx.ui.popup.Popup.prototype._createChildControlImpl.call(this,u);}
,_onMouseOver:function(e){}
,_applyIcon:function(w,v){var x=this.getChildControl(p);w==null?x.resetIcon():x.setIcon(w);}
,_applyLabel:function(z,y){var A=this.getChildControl(p);z==null?A.resetLabel():A.setLabel(z);}
,_applyRich:function(C,B){var D=this.getChildControl(p);D.setRich(C);}
,_applyArrowPosition:function(F,E){this._getLayout().setReversed(F==j);}
}});}
)();
(function(){var a="Decorator",b="middle",c="_applyLayoutChange",d="_applyReversed",e="bottom",f="center",g="Boolean",h="top",j="left",k="right",m="Integer",n="qx.ui.layout.HBox";qx.Class.define(n,{extend:qx.ui.layout.Abstract,construct:function(o,p,q){qx.ui.layout.Abstract.call(this);if(o){this.setSpacing(o);}
;if(p){this.setAlignX(p);}
;if(q){this.setSeparator(q);}
;}
,properties:{alignX:{check:[j,f,k],init:j,apply:c},alignY:{check:[h,b,e],init:h,apply:c},spacing:{check:m,init:0,apply:c},separator:{check:a,nullable:true,apply:c},reversed:{check:g,init:false,apply:d}},members:{__kJ:null,__kK:null,__kL:null,__fP:null,_applyReversed:function(){this._invalidChildrenCache=true;this._applyLayoutChange();}
,__kM:function(){var w=this._getLayoutChildren();var length=w.length;var t=false;var r=this.__kJ&&this.__kJ.length!=length&&this.__kK&&this.__kJ;var u;var s=r?this.__kJ:new Array(length);var v=r?this.__kK:new Array(length);if(this.getReversed()){w=w.concat().reverse();}
;for(var i=0;i<length;i++ ){u=w[i].getLayoutProperties();if(u.width!=null){s[i]=parseFloat(u.width)/100;}
;if(u.flex!=null){v[i]=u.flex;t=true;}
else {v[i]=0;}
;}
;if(!r){this.__kJ=s;this.__kK=v;}
;this.__kL=t;this.__fP=w;delete this._invalidChildrenCache;}
,verifyLayoutProperty:null,renderLayout:function(N,H,M){if(this._invalidChildrenCache){this.__kM();}
;var D=this.__fP;var length=D.length;var P=qx.ui.layout.Util;var L=this.getSpacing();var R=this.getSeparator();if(R){var A=P.computeHorizontalSeparatorGaps(D,L,R);}
else {var A=P.computeHorizontalGaps(D,L,true);}
;var i,O,J,I;var Q=[];var E=A;for(i=0;i<length;i+=1){I=this.__kJ[i];J=I!=null?Math.floor((N-A)*I):D[i].getSizeHint().width;Q.push(J);E+=J;}
;if(this.__kL&&E!=N){var G={};var K,y;for(i=0;i<length;i+=1){K=this.__kK[i];if(K>0){F=D[i].getSizeHint();G[i]={min:F.minWidth,value:Q[i],max:F.maxWidth,flex:K};}
;}
;var B=P.computeFlexOffsets(G,N,E);for(i in B){y=B[i].offset;Q[i]+=y;E+=y;}
;}
;var V=D[0].getMarginLeft();if(E<N&&this.getAlignX()!=j){V=N-E;if(this.getAlignX()===f){V=Math.round(V/2);}
;}
;var F,top,z,J,C,T,x;var L=this.getSpacing();this._clearSeparators();if(R){var S=qx.theme.manager.Decoration.getInstance().resolve(R).getInsets();var U=S.left+S.right;}
;for(i=0;i<length;i+=1){O=D[i];J=Q[i];F=O.getSizeHint();T=O.getMarginTop();x=O.getMarginBottom();z=Math.max(F.minHeight,Math.min(H-T-x,F.maxHeight));top=P.computeVerticalAlignOffset(O.getAlignY()||this.getAlignY(),z,H,T,x);if(i>0){if(R){V+=C+L;this._renderSeparator(R,{left:V+M.left,top:M.top,width:U,height:H});V+=U+L+O.getMarginLeft();}
else {V+=P.collapseMargins(L,C,O.getMarginLeft());}
;}
;O.renderLayout(V+M.left,top+M.top,J,z);V+=J;C=O.getMarginRight();}
;}
,_computeSizeHint:function(){if(this._invalidChildrenCache){this.__kM();}
;var bl=qx.ui.layout.Util;var X=this.__fP;var bd=0,be=0,W=0;var bb=0,bc=0;var bi,Y,bk;for(var i=0,l=X.length;i<l;i+=1){bi=X[i];Y=bi.getSizeHint();be+=Y.width;var bh=this.__kK[i];var ba=this.__kJ[i];if(bh){bd+=Y.minWidth;}
else if(ba){W=Math.max(W,Math.round(Y.minWidth/ba));}
else {bd+=Y.width;}
;bk=bi.getMarginTop()+bi.getMarginBottom();if((Y.height+bk)>bc){bc=Y.height+bk;}
;if((Y.minHeight+bk)>bb){bb=Y.minHeight+bk;}
;}
;bd+=W;var bg=this.getSpacing();var bj=this.getSeparator();if(bj){var bf=bl.computeHorizontalSeparatorGaps(X,bg,bj);}
else {var bf=bl.computeHorizontalGaps(X,bg,true);}
;return {minWidth:bd+bf,width:be+bf,minHeight:bb,height:bc};}
},destruct:function(){this.__kJ=this.__kK=this.__fP=null;}
});}
)();
(function(){var a="middle",b="qx.ui.layout.Util",c="left",d="center",e="top",f="bottom",g="right";qx.Class.define(b,{statics:{PERCENT_VALUE:/[0-9]+(?:\.[0-9]+)?%/,computeFlexOffsets:function(j,n,h){var r,q,s,k;var m=n>h;var t=Math.abs(n-h);var u,o;var p={};for(q in j){r=j[q];p[q]={potential:m?r.max-r.value:r.value-r.min,flex:m?r.flex:1/r.flex,offset:0};}
;while(t!=0){k=Infinity;s=0;for(q in p){r=p[q];if(r.potential>0){s+=r.flex;k=Math.min(k,r.potential/r.flex);}
;}
;if(s==0){break;}
;k=Math.min(t,k*s)/s;u=0;for(q in p){r=p[q];if(r.potential>0){o=Math.min(t,r.potential,Math.ceil(k*r.flex));u+=o-k*r.flex;if(u>=1){u-=1;o-=1;}
;r.potential-=o;if(m){r.offset+=o;}
else {r.offset-=o;}
;t-=o;}
;}
;}
;return p;}
,computeHorizontalAlignOffset:function(w,v,y,z,A){if(z==null){z=0;}
;if(A==null){A=0;}
;var x=0;switch(w){case c:x=z;break;case g:x=y-v-A;break;case d:x=Math.round((y-v)/2);if(x<z){x=z;}
else if(x<A){x=Math.max(z,y-v-A);}
;break;};return x;}
,computeVerticalAlignOffset:function(C,F,B,G,D){if(G==null){G=0;}
;if(D==null){D=0;}
;var E=0;switch(C){case e:E=G;break;case f:E=B-F-D;break;case a:E=Math.round((B-F)/2);if(E<G){E=G;}
else if(E<D){E=Math.max(G,B-F-D);}
;break;};return E;}
,collapseMargins:function(K){var I=0,H=0;for(var i=0,l=arguments.length;i<l;i++ ){var J=arguments[i];if(J<0){H=Math.min(H,J);}
else if(J>0){I=Math.max(I,J);}
;}
;return I+H;}
,computeHorizontalGaps:function(O,M,L){if(M==null){M=0;}
;var N=0;if(L){N+=O[0].getMarginLeft();for(var i=1,l=O.length;i<l;i+=1){N+=this.collapseMargins(M,O[i-1].getMarginRight(),O[i].getMarginLeft());}
;N+=O[l-1].getMarginRight();}
else {for(var i=1,l=O.length;i<l;i+=1){N+=O[i].getMarginLeft()+O[i].getMarginRight();}
;N+=(M*(l-1));}
;return N;}
,computeVerticalGaps:function(S,Q,P){if(Q==null){Q=0;}
;var R=0;if(P){R+=S[0].getMarginTop();for(var i=1,l=S.length;i<l;i+=1){R+=this.collapseMargins(Q,S[i-1].getMarginBottom(),S[i].getMarginTop());}
;R+=S[l-1].getMarginBottom();}
else {for(var i=1,l=S.length;i<l;i+=1){R+=S[i].getMarginTop()+S[i].getMarginBottom();}
;R+=(Q*(l-1));}
;return R;}
,computeHorizontalSeparatorGaps:function(bb,U,Y){var T=qx.theme.manager.Decoration.getInstance().resolve(Y);var V=T.getInsets();var W=V.left+V.right;var X=0;for(var i=0,l=bb.length;i<l;i++ ){var ba=bb[i];X+=ba.getMarginLeft()+ba.getMarginRight();}
;X+=(U+W+U)*(l-1);return X;}
,computeVerticalSeparatorGaps:function(bj,bc,bh){var bf=qx.theme.manager.Decoration.getInstance().resolve(bh);var be=bf.getInsets();var bd=be.top+be.bottom;var bg=0;for(var i=0,l=bj.length;i<l;i++ ){var bi=bj[i];bg+=bi.getMarginTop()+bi.getMarginBottom();}
;bg+=(bc+bd+bc)*(l-1);return bg;}
,arrangeIdeals:function(bl,bn,bk,bm,bo,bp){if(bn<bl||bo<bm){if(bn<bl&&bo<bm){bn=bl;bo=bm;}
else if(bn<bl){bo-=(bl-bn);bn=bl;if(bo<bm){bo=bm;}
;}
else if(bo<bm){bn-=(bm-bo);bo=bm;if(bn<bl){bn=bl;}
;}
;}
;if(bn>bk||bo>bp){if(bn>bk&&bo>bp){bn=bk;bo=bp;}
else if(bn>bk){bo+=(bn-bk);bn=bk;if(bo>bp){bo=bp;}
;}
else if(bo>bp){bn+=(bo-bp);bo=bp;if(bn>bk){bn=bk;}
;}
;}
;return {begin:bn,end:bo};}
}});}
)();
(function(){var a="Boolean",b="changeGap",c="changeShow",d="bottom",e="bottom-right",f="_applyCenter",g="changeIcon",h="qx.ui.basic.Atom",i="changeLabel",j="both",k="Integer",l="_applyIconPosition",m="bottom-left",n="String",o="icon",p="top-left",q="top",r="top-right",s="right",t="_applyRich",u="_applyIcon",v="label",w="_applyShow",x="left",y="_applyLabel",z="_applyGap",A="atom";qx.Class.define(h,{extend:qx.ui.core.Widget,construct:function(B,C){{}
;qx.ui.core.Widget.call(this);this._setLayout(new qx.ui.layout.Atom());if(B!=null){this.setLabel(B);}
;if(C!==undefined){this.setIcon(C);}
;}
,properties:{appearance:{refine:true,init:A},label:{apply:y,nullable:true,check:n,event:i},rich:{check:a,init:false,apply:t},icon:{check:n,apply:u,nullable:true,themeable:true,event:g},gap:{check:k,nullable:false,event:b,apply:z,themeable:true,init:4},show:{init:j,check:[j,v,o],themeable:true,inheritable:true,apply:w,event:c},iconPosition:{init:x,check:[q,s,d,x,p,m,r,e],themeable:true,apply:l},center:{init:false,check:a,themeable:true,apply:f}},members:{_createChildControlImpl:function(F,E){var D;switch(F){case v:D=new qx.ui.basic.Label(this.getLabel());D.setAnonymous(true);D.setRich(this.getRich());this._add(D);if(this.getLabel()==null||this.getShow()===o){D.exclude();}
;break;case o:D=new qx.ui.basic.Image(this.getIcon());D.setAnonymous(true);this._addAt(D,0);if(this.getIcon()==null||this.getShow()===v){D.exclude();}
;break;};return D||qx.ui.core.Widget.prototype._createChildControlImpl.call(this,F);}
,_forwardStates:{focused:true,hovered:true},_handleLabel:function(){if(this.getLabel()==null||this.getShow()===o){this._excludeChildControl(v);}
else {this._showChildControl(v);}
;}
,_handleIcon:function(){if(this.getIcon()==null||this.getShow()===v){this._excludeChildControl(o);}
else {this._showChildControl(o);}
;}
,_applyLabel:function(H,G){var I=this.getChildControl(v,true);if(I){I.setValue(H);}
;this._handleLabel();}
,_applyRich:function(K,J){var L=this.getChildControl(v,true);if(L){L.setRich(K);}
;}
,_applyIcon:function(N,M){var O=this.getChildControl(o,true);if(O){O.setSource(N);}
;this._handleIcon();}
,_applyGap:function(Q,P){this._getLayout().setGap(Q);}
,_applyShow:function(S,R){this._handleLabel();this._handleIcon();}
,_applyIconPosition:function(U,T){this._getLayout().setIconPosition(U);}
,_applyCenter:function(W,V){this._getLayout().setCenter(W);}
,_applySelectable:function(Y,X){qx.ui.core.Widget.prototype._applySelectable.call(this,Y,X);var ba=this.getChildControl(v,true);if(ba){this.getChildControl(v).setSelectable(Y);}
;}
}});}
)();
(function(){var a="middle",b="_applyLayoutChange",c="top-right",d="bottom",e="top-left",f="bottom-left",g="center",h="qx.ui.layout.Atom",j="bottom-right",k="top",l="left",m="right",n="Integer",o="Boolean";qx.Class.define(h,{extend:qx.ui.layout.Abstract,properties:{gap:{check:n,init:4,apply:b},iconPosition:{check:[l,k,m,d,e,f,c,j],init:l,apply:b},center:{check:o,init:false,apply:b}},members:{verifyLayoutProperty:null,renderLayout:function(E,y,D){var N=D.left;var top=D.top;var z=qx.ui.layout.Util;var q=this.getIconPosition();var t=this._getLayoutChildren();var length=t.length;var M,r;var G,x;var C=this.getGap();var J=this.getCenter();var L=[d,m,c,j];if(L.indexOf(q)!=-1){var A=length-1;var v=-1;var s=-1;}
else {var A=0;var v=length;var s=1;}
;if(q==k||q==d){if(J){var F=0;for(var i=A;i!=v;i+=s){r=t[i].getSizeHint().height;if(r>0){F+=r;if(i!=A){F+=C;}
;}
;}
;top+=Math.round((y-F)/2);}
;var u=top;for(var i=A;i!=v;i+=s){G=t[i];x=G.getSizeHint();M=Math.min(x.maxWidth,Math.max(E,x.minWidth));r=x.height;N=z.computeHorizontalAlignOffset(g,M,E)+D.left;G.renderLayout(N,u,M,r);if(r>0){u=top+r+C;}
;}
;}
else {var w=E;var p=null;var I=0;for(var i=A;i!=v;i+=s){G=t[i];M=G.getSizeHint().width;if(M>0){if(!p&&G instanceof qx.ui.basic.Label){p=G;}
else {w-=M;}
;I++ ;}
;}
;if(I>1){var H=(I-1)*C;w-=H;}
;if(p){var x=p.getSizeHint();var B=Math.max(x.minWidth,Math.min(w,x.maxWidth));w-=B;}
;if(J&&w>0){N+=Math.round(w/2);}
;for(var i=A;i!=v;i+=s){G=t[i];x=G.getSizeHint();r=Math.min(x.maxHeight,Math.max(y,x.minHeight));if(G===p){M=B;}
else {M=x.width;}
;var K=a;if(q==e||q==c){K=k;}
else if(q==f||q==j){K=d;}
;var u=top+z.computeVerticalAlignOffset(K,x.height,y);G.renderLayout(N,u,M,r);if(M>0){N+=M+C;}
;}
;}
;}
,_computeSizeHint:function(){var Y=this._getLayoutChildren();var length=Y.length;var P,W;if(length===1){var P=Y[0].getSizeHint();W={width:P.width,height:P.height,minWidth:P.minWidth,minHeight:P.minHeight};}
else {var U=0,V=0;var R=0,T=0;var S=this.getIconPosition();var Q=this.getGap();if(S===k||S===d){var O=0;for(var i=0;i<length;i++ ){P=Y[i].getSizeHint();V=Math.max(V,P.width);U=Math.max(U,P.minWidth);if(P.height>0){T+=P.height;R+=P.minHeight;O++ ;}
;}
;if(O>1){var X=(O-1)*Q;T+=X;R+=X;}
;}
else {var O=0;for(var i=0;i<length;i++ ){P=Y[i].getSizeHint();T=Math.max(T,P.height);R=Math.max(R,P.minHeight);if(P.width>0){V+=P.width;U+=P.minWidth;O++ ;}
;}
;if(O>1){var X=(O-1)*Q;V+=X;U+=X;}
;}
;W={minWidth:U,width:V,minHeight:R,height:T};}
;return W;}
}});}
)();
(function(){var a="qx.event.type.Data",b="qx.ui.form.IStringForm";qx.Interface.define(b,{events:{"changeValue":a},members:{setValue:function(c){return arguments.length==1;}
,resetValue:function(){}
,getValue:function(){}
}});}
)();
(function(){var a="os.name",b="_applyTextAlign",c="Boolean",d="qx.ui.core.Widget",f="nowrap",g="changeStatus",h="changeTextAlign",i="_applyWrap",j="changeValue",k="color",l="qx.ui.basic.Label",m="osx",n="css.textoverflow",o="html.xul",p="_applyValue",q="center",r="_applyBuddy",s="enabled",t="String",u="toggleValue",v="whiteSpace",w="textAlign",x="function",y="qx.dynlocale",z="engine.version",A="right",B="gecko",C="justify",D="changeRich",E="normal",F="_applyRich",G="engine.name",H="click",I="label",J="changeLocale",K="left",L="A";qx.Class.define(l,{extend:qx.ui.core.Widget,implement:[qx.ui.form.IStringForm],construct:function(M){qx.ui.core.Widget.call(this);if(M!=null){this.setValue(M);}
;if(qx.core.Environment.get(y)){qx.locale.Manager.getInstance().addListener(J,this._onChangeLocale,this);}
;}
,properties:{rich:{check:c,init:false,event:D,apply:F},wrap:{check:c,init:true,apply:i},value:{check:t,apply:p,event:j,nullable:true},buddy:{check:d,apply:r,nullable:true,init:null,dereference:true},textAlign:{check:[K,q,A,C],nullable:true,themeable:true,apply:b,event:h},appearance:{refine:true,init:I},selectable:{refine:true,init:false},allowGrowX:{refine:true,init:false},allowGrowY:{refine:true,init:false},allowShrinkY:{refine:true,init:false}},members:{__kN:null,__kO:null,__kP:null,__kQ:null,__kR:null,_getContentHint:function(){if(this.__kO){this.__kS=this.__kT();delete this.__kO;}
;return {width:this.__kS.width,height:this.__kS.height};}
,_hasHeightForWidth:function(){return this.getRich()&&this.getWrap();}
,_applySelectable:function(N){if(!qx.core.Environment.get(n)&&qx.core.Environment.get(o)){if(N&&!this.isRich()){{}
;return;}
;}
;qx.ui.core.Widget.prototype._applySelectable.call(this,N);}
,_getContentHeightForWidth:function(O){if(!this.getRich()&&!this.getWrap()){return null;}
;return this.__kT(O).height;}
,_createContentElement:function(){return new qx.html.Label;}
,_applyTextAlign:function(Q,P){this.getContentElement().setStyle(w,Q);}
,_applyTextColor:function(S,R){if(S){this.getContentElement().setStyle(k,qx.theme.manager.Color.getInstance().resolve(S));}
else {this.getContentElement().removeStyle(k);}
;}
,__kS:{width:0,height:0},_applyFont:function(V,U){if(U&&this.__kN&&this.__kR){this.__kN.removeListenerById(this.__kR);this.__kR=null;}
;var T;if(V){this.__kN=qx.theme.manager.Font.getInstance().resolve(V);if(this.__kN instanceof qx.bom.webfonts.WebFont){this.__kR=this.__kN.addListener(g,this._onWebFontStatusChange,this);}
;T=this.__kN.getStyles();}
else {this.__kN=null;T=qx.bom.Font.getDefaultStyles();}
;if(this.getTextColor()!=null){delete T[k];}
;this.getContentElement().setStyles(T);this.__kO=true;qx.ui.core.queue.Layout.add(this);}
,__kT:function(Y){var X=qx.bom.Label;var bb=this.getFont();var W=bb?this.__kN.getStyles():qx.bom.Font.getDefaultStyles();var content=this.getValue()||L;var ba=this.getRich();if(this.__kR){this.__kU();}
;return ba?X.getHtmlSize(content,W,Y):X.getTextSize(content,W);}
,__kU:function(){if(!this.getContentElement()){return;}
;if(qx.core.Environment.get(a)==m&&qx.core.Environment.get(G)==B&&parseInt(qx.core.Environment.get(z),10)<16&&parseInt(qx.core.Environment.get(z),10)>9){var bc=this.getContentElement().getDomElement();if(bc){bc.innerHTML=bc.innerHTML;}
;}
;}
,_applyBuddy:function(be,bd){if(bd!=null){bd.removeBinding(this.__kP);this.__kP=null;this.removeListenerById(this.__kQ);this.__kQ=null;}
;if(be!=null){this.__kP=be.bind(s,this,s);this.__kQ=this.addListener(H,function(){if(be.isFocusable()){be.focus.apply(be);}
;if(u in be&&typeof be.toggleValue===x){be.toggleValue();}
;}
,this);}
;}
,_applyRich:function(bf){this.getContentElement().setRich(bf);this.__kO=true;qx.ui.core.queue.Layout.add(this);}
,_applyWrap:function(bi,bg){if(bi&&!this.isRich()){{}
;}
;if(this.isRich()){var bh=bi?E:f;this.getContentElement().setStyle(v,bh);}
;}
,_onChangeLocale:qx.core.Environment.select(y,{"true":function(e){var content=this.getValue();if(content&&content.translate){this.setValue(content.translate());}
;}
,"false":null}),_onWebFontStatusChange:function(bj){if(bj.getData().valid===true){this.__kO=true;qx.ui.core.queue.Layout.add(this);}
;}
,_applyValue:function(bl,bk){this.getContentElement().setValue(bl);this.__kO=true;qx.ui.core.queue.Layout.add(this);}
},destruct:function(){if(qx.core.Environment.get(y)){qx.locale.Manager.getInstance().removeListener(J,this._onChangeLocale,this);}
;if(this.__kP!=null){var bm=this.getBuddy();if(bm!=null&&!bm.isDisposed()){bm.removeBinding(this.__kP);}
;}
;if(this.__kN&&this.__kR){this.__kN.removeListenerById(this.__kR);}
;this.__kN=this.__kP=null;}
});}
)();
(function(){var a="value",b="qx.html.Label",c="The label mode cannot be modified after initial creation";qx.Class.define(b,{extend:qx.html.Element,members:{__lv:null,_applyProperty:function(name,d){qx.html.Element.prototype._applyProperty.call(this,name,d);if(name==a){var e=this.getDomElement();qx.bom.Label.setValue(e,d);}
;}
,_createDomElement:function(){var g=this.__lv;var f=qx.bom.Label.create(this._content,g);return f;}
,_copyData:function(h){return qx.html.Element.prototype._copyData.call(this,true);}
,setRich:function(i){var j=this.getDomElement();if(j){throw new Error(c);}
;i=!!i;if(this.__lv==i){return this;}
;this.__lv=i;return this;}
,setValue:function(k){this._setProperty(a,k);return this;}
,getValue:function(){return this._getProperty(a);}
}});}
)();
(function(){var a="text",b="px",c="http://www.mozilla.org/keymaster/gatekeeper/there.is.only.xul",d="crop",e="nowrap",f="gecko",g="end",h="div",i="browser.name",j="100%",k="auto",l="0",m="css.textoverflow",n="html.xul",o="chrome",p="value",q="visible",r="qx.bom.Label",s="safari",t="",u="ellipsis",v="browser.version",w="engine.version",x="normal",y="mshtml",z="engine.name",A="inherit",B="block",C="label",D="-1000px",E="hidden",F="absolute";qx.Bootstrap.define(r,{statics:{__lw:{fontFamily:1,fontSize:1,fontWeight:1,fontStyle:1,lineHeight:1},__lx:function(){var G=this.__lz(false);document.body.insertBefore(G,document.body.firstChild);return this._textElement=G;}
,__ly:function(){var H=this.__lz(true);document.body.insertBefore(H,document.body.firstChild);return this._htmlElement=H;}
,__lz:function(K){var I=qx.dom.Element.create(h);var J=I.style;J.width=J.height=k;J.left=J.top=D;J.visibility=E;J.position=F;J.overflow=q;J.display=B;if(K){J.whiteSpace=x;}
else {J.whiteSpace=e;if(!qx.core.Environment.get(m)&&qx.core.Environment.get(n)){var L=document.createElementNS(c,C);var J=L.style;J.padding=l;J.margin=l;J.width=k;for(var M in this.__lw){J[M]=A;}
;I.appendChild(L);}
;}
;return I;}
,__lA:function(O){var N={};if(O){N.whiteSpace=x;}
else if(!qx.core.Environment.get(m)&&qx.core.Environment.get(n)){N.display=B;}
else {N.overflow=E;N.whiteSpace=e;N[qx.core.Environment.get(m)]=u;}
;return N;}
,create:function(content,S,R){if(!R){R=window;}
;var P=R.document.createElement(h);if(S){P.useHtml=true;}
else if(!qx.core.Environment.get(m)&&qx.core.Environment.get(n)){var T=R.document.createElementNS(c,C);var Q=T.style;Q.cursor=A;Q.color=A;Q.overflow=E;Q.maxWidth=j;Q.padding=l;Q.margin=l;Q.width=k;for(var U in this.__lw){T.style[U]=A;}
;T.setAttribute(d,g);P.appendChild(T);}
else {qx.bom.element.Style.setStyles(P,this.__lA(S));}
;if(content){this.setValue(P,content);}
;return P;}
,setValue:function(W,V){V=V||t;if(W.useHtml){W.innerHTML=V;}
else if(!qx.core.Environment.get(m)&&qx.core.Environment.get(n)){W.firstChild.setAttribute(p,V);}
else {qx.bom.element.Attribute.set(W,a,V);}
;}
,getValue:function(X){if(X.useHtml){return X.innerHTML;}
else if(!qx.core.Environment.get(m)&&qx.core.Environment.get(n)){return X.firstChild.getAttribute(p)||t;}
else {return qx.bom.element.Attribute.get(X,a);}
;}
,getHtmlSize:function(content,Y,ba){var bb=this._htmlElement||this.__ly();bb.style.width=ba!=undefined?ba+b:k;bb.innerHTML=content;return this.__lB(bb,Y);}
,getTextSize:function(bd,bc){var be=this._textElement||this.__lx();if(!qx.core.Environment.get(m)&&qx.core.Environment.get(n)){be.firstChild.setAttribute(p,bd);}
else {qx.bom.element.Attribute.set(be,a,bd);}
;return this.__lB(be,bc);}
,__lB:function(bj,bf){var bg=this.__lw;if(!bf){bf={};}
;for(var bi in bg){bj.style[bi]=bf[bi]||t;}
;var bh=qx.bom.element.Dimension.getSize(bj);if((qx.core.Environment.get(z)==f)){bh.width++ ;}
;if((qx.core.Environment.get(z)==y)&&parseFloat(qx.core.Environment.get(w))>=9){bh.width++ ;}
;if(qx.core.Environment.get(i)==o&&parseFloat(qx.core.Environment.get(v))>=22){bh.width++ ;}
;if(qx.core.Environment.get(i)==s&&parseFloat(qx.core.Environment.get(v))>=6){bh.width++ ;}
;return bh;}
}});}
)();
(function(){var a="qx.ui.form.IForm",b="qx.event.type.Data";qx.Interface.define(a,{events:{"changeEnabled":b,"changeValid":b,"changeInvalidMessage":b,"changeRequired":b},members:{setEnabled:function(c){return arguments.length==1;}
,getEnabled:function(){}
,setRequired:function(d){return arguments.length==1;}
,getRequired:function(){}
,setValid:function(e){return arguments.length==1;}
,getValid:function(){}
,setInvalidMessage:function(f){return arguments.length==1;}
,getInvalidMessage:function(){}
,setRequiredInvalidMessage:function(g){return arguments.length==1;}
,getRequiredInvalidMessage:function(){}
}});}
)();
(function(){var a="The theme to use is not available: ",b="_applyTheme",c="qx.theme",d="qx.theme.manager.Meta",e="qx.theme.Modern",f="Theme",g="singleton";qx.Class.define(d,{type:g,extend:qx.core.Object,properties:{theme:{check:f,nullable:true,apply:b}},members:{_applyTheme:function(n,i){var k=null;var h=null;var r=null;var s=null;var m=null;if(n){k=n.meta.color||null;h=n.meta.decoration||null;r=n.meta.font||null;s=n.meta.icon||null;m=n.meta.appearance||null;}
;var j=qx.theme.manager.Color.getInstance();var q=qx.theme.manager.Decoration.getInstance();var o=qx.theme.manager.Font.getInstance();var l=qx.theme.manager.Icon.getInstance();var p=qx.theme.manager.Appearance.getInstance();j.setTheme(k);q.setTheme(h);o.setTheme(r);l.setTheme(s);p.setTheme(m);}
,initialize:function(){var v=qx.core.Environment;var t,u;t=v.get(c);if(t){u=qx.Theme.getByName(t);if(!u){throw new Error(a+t);}
;this.setTheme(u);}
;}
},environment:{"qx.theme":e}});}
)();
(function(){var a="qx.theme.manager.Icon",b="Theme",c="changeTheme",d="_applyTheme",e="singleton";qx.Class.define(a,{type:e,extend:qx.core.Object,properties:{theme:{check:b,nullable:true,apply:d,event:c}},members:{_applyTheme:function(i,g){var h=qx.util.AliasManager.getInstance();if(g){for(var f in g.aliases){h.remove(f);}
;}
;if(i){for(var f in i.aliases){h.add(f,i.aliases[f]);}
;}
;}
}});}
)();
(function(){var b="'!",c="other",d="widgets",e="undefined",f="fonts",g="appearances",h="qx.Theme",j="]",k="Mixin theme is not a valid theme!",m="[Theme ",n="colors",o="decorations",p="' are not compatible '",q="Theme",r="meta",s="The mixins '",t="borders",u="icons";qx.Bootstrap.define(h,{statics:{define:function(name,w){if(!w){var w={};}
;w.include=this.__lC(w.include);w.patch=this.__lC(w.patch);{}
;var v={$$type:q,name:name,title:w.title,toString:this.genericToString};if(w.extend){v.supertheme=w.extend;}
;v.basename=qx.Bootstrap.createNamespace(name,v);this.__lF(v,w);this.__lD(v,w);this.$$registry[name]=v;for(var i=0,a=w.include,l=a.length;i<l;i++ ){this.include(v,a[i]);}
;for(var i=0,a=w.patch,l=a.length;i<l;i++ ){this.patch(v,a[i]);}
;}
,__lC:function(x){if(!x){return [];}
;if(qx.Bootstrap.isArray(x)){return x;}
else {return [x];}
;}
,__lD:function(y,z){var A=z.aliases||{};if(z.extend&&z.extend.aliases){qx.Bootstrap.objectMergeWith(A,z.extend.aliases,false);}
;y.aliases=A;}
,getAll:function(){return this.$$registry;}
,getByName:function(name){return this.$$registry[name];}
,isDefined:function(name){return this.getByName(name)!==undefined;}
,getTotalNumber:function(){return qx.Bootstrap.objectGetLength(this.$$registry);}
,genericToString:function(){return m+this.name+j;}
,__lE:function(C){for(var i=0,B=this.__lG,l=B.length;i<l;i++ ){if(C[B[i]]){return B[i];}
;}
;}
,__lF:function(H,I){var E=this.__lE(I);if(I.extend&&!E){E=I.extend.type;}
;H.type=E||c;var F=function(){}
;if(I.extend){F.prototype=new I.extend.$$clazz;}
;var D=F.prototype;var G=I[E];for(var J in G){D[J]=G[J];if(D[J].base){{}
;D[J].base=I.extend;}
;}
;H.$$clazz=F;H[E]=new F;}
,$$registry:{},__lG:[n,t,o,f,u,d,g,r],__E:null,__lH:null,__F:function(){}
,patch:function(N,L){this.__lI(L);var P=this.__lE(L);if(P!==this.__lE(N)){throw new Error(s+N.name+p+L.name+b);}
;var M=L[P];var K=N.$$clazz.prototype;for(var O in M){K[O]=M[O];}
;}
,include:function(T,R){this.__lI(R);var V=R.type;if(V!==T.type){throw new Error(s+T.name+p+R.name+b);}
;var S=R[V];var Q=T.$$clazz.prototype;for(var U in S){if(Q[U]!==undefined){continue;}
;Q[U]=S[U];}
;}
,__lI:function(W){if(typeof W===e||W==null){var X=new Error(k);{var Y;}
;throw X;}
;}
}});}
)();
(function(){var a="qx.application.Standalone";qx.Class.define(a,{extend:qx.application.AbstractGui,members:{_createRootWidget:function(){return new qx.ui.root.Application(document);}
}});}
)();
(function(){var a="_applyActiveWindow",b="changeModal",c="changeVisibility",d="__er",f="changeActive",g="qx.ui.window.MDesktop",h="__lJ",i="qx.ui.window.Window";qx.Mixin.define(g,{properties:{activeWindow:{check:i,apply:a,init:null,nullable:true}},members:{__lJ:null,__er:null,getWindowManager:function(){if(!this.__er){this.setWindowManager(new qx.ui.window.Window.DEFAULT_MANAGER_CLASS());}
;return this.__er;}
,supportsMaximize:function(){return true;}
,setWindowManager:function(j){if(this.__er){this.__er.setDesktop(null);}
;j.setDesktop(this);this.__er=j;}
,_onChangeActive:function(e){if(e.getData()){this.setActiveWindow(e.getTarget());}
else if(this.getActiveWindow()==e.getTarget()){this.setActiveWindow(null);}
;}
,_applyActiveWindow:function(l,k){this.getWindowManager().changeActiveWindow(l,k);this.getWindowManager().updateStack();}
,_onChangeModal:function(e){this.getWindowManager().updateStack();}
,_onChangeVisibility:function(){this.getWindowManager().updateStack();}
,_afterAddChild:function(m){if(qx.Class.isDefined(i)&&m instanceof qx.ui.window.Window){this._addWindow(m);}
;}
,_addWindow:function(n){if(!qx.lang.Array.contains(this.getWindows(),n)){this.getWindows().push(n);n.addListener(f,this._onChangeActive,this);n.addListener(b,this._onChangeModal,this);n.addListener(c,this._onChangeVisibility,this);}
;if(n.getActive()){this.setActiveWindow(n);}
;this.getWindowManager().updateStack();}
,_afterRemoveChild:function(o){if(qx.Class.isDefined(i)&&o instanceof qx.ui.window.Window){this._removeWindow(o);}
;}
,_removeWindow:function(p){qx.lang.Array.remove(this.getWindows(),p);p.removeListener(f,this._onChangeActive,this);p.removeListener(b,this._onChangeModal,this);p.removeListener(c,this._onChangeVisibility,this);this.getWindowManager().updateStack();}
,getWindows:function(){if(!this.__lJ){this.__lJ=[];}
;return this.__lJ;}
},destruct:function(){this._disposeArray(h);this._disposeObjects(d);}
});}
)();
(function(){var a="qx.ui.window.IWindowManager";qx.Interface.define(a,{members:{setDesktop:function(b){this.assertInterface(b,qx.ui.window.IDesktop);}
,changeActiveWindow:function(c,d){}
,updateStack:function(){}
,bringToFront:function(e){this.assertInstance(e,qx.ui.window.Window);}
,sendToBack:function(f){this.assertInstance(f,qx.ui.window.Window);}
}});}
)();
(function(){var a="qx.ui.window.Manager",b="__lK";qx.Class.define(a,{extend:qx.core.Object,implement:qx.ui.window.IWindowManager,members:{__lK:null,setDesktop:function(c){this.__lK=c;this.updateStack();}
,getDesktop:function(){return this.__lK;}
,changeActiveWindow:function(d,e){if(d){this.bringToFront(d);d.setActive(true);}
;if(e){e.resetActive();}
;}
,_minZIndex:1e5,updateStack:function(){qx.ui.core.queue.Widget.add(this);}
,syncWidget:function(){this.__lK.forceUnblock();var h=this.__lK.getWindows();var g=this._minZIndex;var m=g+h.length*2;var j=g+h.length*4;var k=null;for(var i=0,l=h.length;i<l;i++ ){var f=h[i];if(!f.isVisible()){continue;}
;k=k||f;if(f.isModal()){f.setZIndex(j);this.__lK.blockContent(j-1);j+=2;k=f;}
else if(f.isAlwaysOnTop()){f.setZIndex(m);m+=2;}
else {f.setZIndex(g);g+=2;}
;if(!k.isModal()&&f.isActive()||f.getZIndex()>k.getZIndex()){k=f;}
;}
;this.__lK.setActiveWindow(k);}
,bringToFront:function(o){var n=this.__lK.getWindows();var p=qx.lang.Array.remove(n,o);if(p){n.push(o);this.updateStack();}
;}
,sendToBack:function(r){var q=this.__lK.getWindows();var s=qx.lang.Array.remove(q,r);if(s){q.unshift(r);this.updateStack();}
;}
},destruct:function(){this._disposeObjects(b);}
});}
)();
(function(){var a="mousedown",b="Boolean",c="w-resize",d="sw-resize",f="n-resize",g="resizableRight",h="ne-resize",i="se-resize",j="Integer",k="e-resize",l="resizableLeft",m="mousemove",n="move",o="shorthand",p="maximized",q="resize",r="nw-resize",s="mouseout",t="qx.ui.core.MResizable",u="mouseup",v="losecapture",w="resize-frame",x="resizableBottom",y="s-resize",z="resizableTop";qx.Mixin.define(t,{construct:function(){var content=this.getContentElement();content.addListener(a,this.__lX,this,true);content.addListener(u,this.__lY,this);content.addListener(m,this.__mb,this);content.addListener(s,this.__mc,this);content.addListener(v,this.__ma,this);var A=content.getDomElement();if(A==null){A=window;}
;this.__lL=qx.event.Registration.getManager(A).getHandler(qx.event.handler.DragDrop);}
,properties:{resizableTop:{check:b,init:true},resizableRight:{check:b,init:true},resizableBottom:{check:b,init:true},resizableLeft:{check:b,init:true},resizable:{group:[z,g,x,l],mode:o},resizeSensitivity:{check:j,init:5},useResizeFrame:{check:b,init:true}},members:{__lL:null,__lM:null,__lN:null,__lO:null,__lP:null,__lQ:null,__lR:null,RESIZE_TOP:1,RESIZE_BOTTOM:2,RESIZE_LEFT:4,RESIZE_RIGHT:8,_getResizeFrame:function(){var B=this.__lM;if(!B){B=this.__lM=new qx.ui.core.Widget();B.setAppearance(w);B.exclude();qx.core.Init.getApplication().getRoot().add(B);}
;return B;}
,__lS:function(){var location=this.getContentLocation();var C=this._getResizeFrame();C.setUserBounds(location.left,location.top,location.right-location.left,location.bottom-location.top);C.show();C.setZIndex(this.getZIndex()+1);}
,__lT:function(e){var E=this.__lN;var D=this.getSizeHint();var H=this.__lR;var G=this.__lQ;var I=G.width;var F=G.height;var K=G.left;var top=G.top;var J;if((E&this.RESIZE_TOP)||(E&this.RESIZE_BOTTOM)){J=Math.max(H.top,Math.min(H.bottom,e.getDocumentTop()))-this.__lP;if(E&this.RESIZE_TOP){F-=J;}
else {F+=J;}
;if(F<D.minHeight){F=D.minHeight;}
else if(F>D.maxHeight){F=D.maxHeight;}
;if(E&this.RESIZE_TOP){top+=G.height-F;}
;}
;if((E&this.RESIZE_LEFT)||(E&this.RESIZE_RIGHT)){J=Math.max(H.left,Math.min(H.right,e.getDocumentLeft()))-this.__lO;if(E&this.RESIZE_LEFT){I-=J;}
else {I+=J;}
;if(I<D.minWidth){I=D.minWidth;}
else if(I>D.maxWidth){I=D.maxWidth;}
;if(E&this.RESIZE_LEFT){K+=G.width-I;}
;}
;return {viewportLeft:K,viewportTop:top,parentLeft:G.bounds.left+K-G.left,parentTop:G.bounds.top+top-G.top,width:I,height:F};}
,__lU:{'1':f,'2':y,'4':c,'8':k,'5':r,'6':d,'9':h,'10':i},__lV:function(e){var location=this.getContentLocation();var N=this.getResizeSensitivity();var O=e.getDocumentLeft();var M=e.getDocumentTop();var L=this.__lW(location,O,M,N);if(L>0){L=L|this.__lW(location,O,M,N*2);}
;this.__lN=L;}
,__lW:function(location,S,R,P){var Q=0;if(this.getResizableTop()&&Math.abs(location.top-R)<P&&S>location.left-P&&S<location.right+P){Q+=this.RESIZE_TOP;}
else if(this.getResizableBottom()&&Math.abs(location.bottom-R)<P&&S>location.left-P&&S<location.right+P){Q+=this.RESIZE_BOTTOM;}
;if(this.getResizableLeft()&&Math.abs(location.left-S)<P&&R>location.top-P&&R<location.bottom+P){Q+=this.RESIZE_LEFT;}
else if(this.getResizableRight()&&Math.abs(location.right-S)<P&&R>location.top-P&&R<location.bottom+P){Q+=this.RESIZE_RIGHT;}
;return Q;}
,__lX:function(e){if(!this.__lN||!this.getEnabled()){return;}
;this.addState(q);this.__lO=e.getDocumentLeft();this.__lP=e.getDocumentTop();var location=this.getContentLocation();var U=this.getBounds();this.__lQ={top:location.top,left:location.left,width:location.right-location.left,height:location.bottom-location.top,bounds:qx.lang.Object.clone(U)};var parent=this.getLayoutParent();var V=parent.getContentLocation();var T=parent.getBounds();this.__lR={left:V.left,top:V.top,right:V.left+T.width,bottom:V.top+T.height};if(this.getUseResizeFrame()){this.__lS();}
;this.capture();e.stop();}
,__lY:function(e){if(!this.hasState(q)||!this.getEnabled()){return;}
;if(this.getUseResizeFrame()){this._getResizeFrame().exclude();}
;var W=this.__lT(e);this.setWidth(W.width);this.setHeight(W.height);if(this.getResizableLeft()||this.getResizableTop()){this.setLayoutProperties({left:W.parentLeft,top:W.parentTop});}
;this.__lN=0;this.removeState(q);this.resetCursor();this.getApplicationRoot().resetGlobalCursor();this.releaseCapture();e.stopPropagation();}
,__ma:function(e){if(!this.__lN){return;}
;this.resetCursor();this.getApplicationRoot().resetGlobalCursor();this.removeState(n);if(this.getUseResizeFrame()){this._getResizeFrame().exclude();}
;}
,__mb:function(e){if(!this.getEnabled()){return;}
;if(this.hasState(q)){var Y=this.__lT(e);if(this.getUseResizeFrame()){var X=this._getResizeFrame();X.setUserBounds(Y.viewportLeft,Y.viewportTop,Y.width,Y.height);}
else {this.setWidth(Y.width);this.setHeight(Y.height);if(this.getResizableLeft()||this.getResizableTop()){this.setLayoutProperties({left:Y.parentLeft,top:Y.parentTop});}
;}
;e.stopPropagation();}
else if(!this.hasState(p)&&!this.__lL.isSessionActive()){this.__lV(e);var bc=this.__lN;var bb=this.getApplicationRoot();if(bc){var ba=this.__lU[bc];this.setCursor(ba);bb.setGlobalCursor(ba);}
else if(this.getCursor()){this.resetCursor();bb.resetGlobalCursor();}
;}
;}
,__mc:function(e){if(this.getCursor()&&!this.hasState(q)){this.resetCursor();this.getApplicationRoot().resetGlobalCursor();}
;}
},destruct:function(){if(this.__lM!=null&&!qx.core.ObjectRegistry.inShutDown){this.__lM.destroy();this.__lM=null;}
;this.__lL=null;}
});}
)();
(function(){var a="qx.ui.core.MRemoteLayoutHandling";qx.Mixin.define(a,{members:{setLayout:function(b){this.getChildrenContainer().setLayout(b);}
,getLayout:function(){return this.getChildrenContainer().getLayout();}
}});}
)();
(function(){var a="indexOf",b="addAfter",c="add",d="addBefore",e="_",f="addAt",g="hasChildren",h="removeAt",i="removeAll",j="getChildren",k="remove",l="qx.ui.core.MRemoteChildrenHandling";qx.Mixin.define(l,{members:{__md:function(q,m,o,n){var p=this.getChildrenContainer();if(p===this){q=e+q;}
;return (p[q])(m,o,n);}
,getChildren:function(){return this.__md(j);}
,hasChildren:function(){return this.__md(g);}
,add:function(s,r){return this.__md(c,s,r);}
,remove:function(t){return this.__md(k,t);}
,removeAll:function(){return this.__md(i);}
,indexOf:function(u){return this.__md(a,u);}
,addAt:function(x,v,w){this.__md(f,x,v,w);}
,addBefore:function(y,A,z){this.__md(d,y,A,z);}
,addAfter:function(D,B,C){this.__md(b,D,B,C);}
,removeAt:function(E){return this.__md(h,E);}
}});}
)();
(function(){var a="mouseup",b="mousedown",c="Boolean",d="__me",f="losecapture",g="mousewheel",h="qx.ui.core.MMovable",i="The move handle could not be redefined!",j="mousemove",k="move",l="maximized",m="__mf",n="move-frame";qx.Mixin.define(h,{properties:{movable:{check:c,init:true},useMoveFrame:{check:c,init:false}},members:{__me:null,__mf:null,__mg:null,__mh:null,__mi:null,__mj:null,__mk:null,__ml:false,__mm:null,__mn:0,_activateMoveHandle:function(o){if(this.__me){throw new Error(i);}
;this.__me=o;o.addListener(b,this._onMoveMouseDown,this);o.addListener(a,this._onMoveMouseUp,this);o.addListener(j,this._onMoveMouseMove,this);o.addListener(f,this.__mr,this);if(qx.event.handler.MouseEmulation.ON){o.addListener(g,function(e){e.stopPropagation();}
,this);}
;}
,__mo:function(){var p=this.__mf;if(!p){p=this.__mf=new qx.ui.core.Widget();p.setAppearance(n);p.exclude();qx.core.Init.getApplication().getRoot().add(p);}
;return p;}
,__mp:function(){var location=this.getContentLocation();var r=this.getBounds();var q=this.__mo();q.setUserBounds(location.left,location.top,r.width,r.height);q.show();q.setZIndex(this.getZIndex()+1);}
,__mq:function(e){var t=this.__mg;var w=Math.max(t.left,Math.min(t.right,e.getDocumentLeft()));var s=Math.max(t.top,Math.min(t.bottom,e.getDocumentTop()));var u=this.__mh+w;var v=this.__mi+s;return {viewportLeft:parseInt(u,10),viewportTop:parseInt(v,10),parentLeft:parseInt(u-this.__mj,10),parentTop:parseInt(v-this.__mk,10)};}
,_onMoveMouseDown:function(e){if(!this.getMovable()||this.hasState(l)){return;}
;var parent=this.getLayoutParent();var x=parent.getContentLocation();var z=parent.getBounds();if(qx.Class.implementsInterface(parent,qx.ui.window.IDesktop)){if(!parent.isBlocked()){this.__mm=parent.getBlockerColor();this.__mn=parent.getBlockerOpacity();parent.setBlockerColor(null);parent.setBlockerOpacity(1);parent.blockContent(this.getZIndex()-1);this.__ml=true;}
;}
;this.__mg={left:x.left,top:x.top,right:x.left+z.width,bottom:x.top+z.height};var y=this.getContentLocation();this.__mj=x.left;this.__mk=x.top;this.__mh=y.left-e.getDocumentLeft();this.__mi=y.top-e.getDocumentTop();this.addState(k);this.__me.capture();if(this.getUseMoveFrame()){this.__mp();}
;e.stop();}
,_onMoveMouseMove:function(e){if(!this.hasState(k)){return;}
;var B=this.__mq(e);if(this.getUseMoveFrame()){this.__mo().setDomPosition(B.viewportLeft,B.viewportTop);}
else {var A=this.getLayoutParent().getInsets();this.setDomPosition(B.parentLeft-(A.left||0),B.parentTop-(A.top||0));}
;e.stopPropagation();}
,_onMoveMouseUp:function(e){if(!this.hasState(k)){return;}
;this.removeState(k);var parent=this.getLayoutParent();if(qx.Class.implementsInterface(parent,qx.ui.window.IDesktop)){if(this.__ml){parent.unblock();parent.setBlockerColor(this.__mm);parent.setBlockerOpacity(this.__mn);this.__mm=null;this.__mn=0;this.__ml=false;}
;}
;this.__me.releaseCapture();var D=this.__mq(e);var C=this.getLayoutParent().getInsets();this.setLayoutProperties({left:D.parentLeft-(C.left||0),top:D.parentTop-(C.top||0)});if(this.getUseMoveFrame()){this.__mo().exclude();}
;e.stopPropagation();}
,__mr:function(e){if(!this.hasState(k)){return;}
;this.removeState(k);if(this.getUseMoveFrame()){this.__mo().exclude();}
;}
},destruct:function(){this._disposeObjects(m,d);this.__mg=null;}
});}
)();
(function(){var a="qx.ui.window.IDesktop";qx.Interface.define(a,{members:{setWindowManager:function(b){this.assertInterface(b,qx.ui.window.IWindowManager);}
,getWindows:function(){}
,supportsMaximize:function(){}
,blockContent:function(c){this.assertInteger(c);}
,unblock:function(){}
,isBlocked:function(){}
}});}
)();
(function(){var a="resetPaddingRight",b="setPaddingTop",c="_applyContentPadding",d="setPaddingBottom",e="resetThemed",f="contentPaddingRight",g="Integer",h="contentPaddingLeft",i="setThemedPaddingLeft",j="resetPaddingTop",k="shorthand",l="setThemedPaddingRight",m="setThemed",n="setPaddingRight",o="contentPaddingBottom",p="resetPaddingBottom",q="qx.ui.core.MContentPadding",r="resetPaddingLeft",s="setThemedPaddingTop",t="setPaddingLeft",u="setThemedPaddingBottom",v="contentPaddingTop";qx.Mixin.define(q,{properties:{contentPaddingTop:{check:g,init:0,apply:c,themeable:true},contentPaddingRight:{check:g,init:0,apply:c,themeable:true},contentPaddingBottom:{check:g,init:0,apply:c,themeable:true},contentPaddingLeft:{check:g,init:0,apply:c,themeable:true},contentPadding:{group:[v,f,o,h],mode:k,themeable:true}},members:{__ms:{contentPaddingTop:b,contentPaddingRight:n,contentPaddingBottom:d,contentPaddingLeft:t},__mt:{contentPaddingTop:s,contentPaddingRight:l,contentPaddingBottom:u,contentPaddingLeft:i},__mu:{contentPaddingTop:j,contentPaddingRight:a,contentPaddingBottom:p,contentPaddingLeft:r},_applyContentPadding:function(z,w,name,y){var A=this._getContentPaddingTarget();if(z==null){var x=this.__mu[name];A[x]();}
else {if(y==m||y==e){var B=this.__mt[name];A[B](z);}
else {var B=this.__ms[name];A[B](z);}
;}
;}
}});}
)();
(function(){var a="beforeClose",b="beforeMinimize",c="mousedown",d="Boolean",f="window-resize-frame",g="changeStatus",h="changeIcon",i="excluded",j="_applyModal",k="execute",l="dblclick",m="restore-button",n="_applyActive",o="minimize-button",p="qx.event.type.Event",q="close-button",r="beforeRestore",s="statusbar",t="captionbar",u="String",v="minimize",w="modal",x="changeModal",y="title",z="icon",A="showStatusbar",B="changeAlwaysOnTop",C="_applyShowStatusbar",D="maximized",E="_applyStatus",F="qx.ui.window.Window",G="normal",H="changeCaption",I="engine.name",J="statusbar-text",K="focusout",L="beforeMaximize",M="maximize",N="maximize-button",O="restore",P="window",Q="pane",R="close",S="changeActive",T="mshtml",U="_applyCaptionBarChange",V="active",W="minimized";qx.Class.define(F,{extend:qx.ui.core.Widget,include:[qx.ui.core.MRemoteChildrenHandling,qx.ui.core.MRemoteLayoutHandling,qx.ui.core.MResizable,qx.ui.core.MMovable,qx.ui.core.MContentPadding],construct:function(X,Y){qx.ui.core.Widget.call(this);this._setLayout(new qx.ui.layout.VBox());this._createChildControl(t);this._createChildControl(Q);if(Y!=null){this.setIcon(Y);}
;if(X!=null){this.setCaption(X);}
;this._updateCaptionBar();this.addListener(c,this._onWindowMouseDown,this,true);this.addListener(K,this._onWindowFocusOut,this);qx.core.Init.getApplication().getRoot().add(this);this.initVisibility();qx.ui.core.FocusHandler.getInstance().addRoot(this);this._getResizeFrame().setAppearance(f);}
,statics:{DEFAULT_MANAGER_CLASS:qx.ui.window.Manager},events:{"beforeClose":p,"close":p,"beforeMinimize":p,"minimize":p,"beforeMaximize":p,"maximize":p,"beforeRestore":p,"restore":p},properties:{appearance:{refine:true,init:P},visibility:{refine:true,init:i},focusable:{refine:true,init:true},active:{check:d,init:false,apply:n,event:S},alwaysOnTop:{check:d,init:false,event:B},modal:{check:d,init:false,event:x,apply:j},caption:{apply:U,event:H,nullable:true},icon:{check:u,nullable:true,apply:U,event:h,themeable:true},status:{check:u,nullable:true,apply:E,event:g},showClose:{check:d,init:true,apply:U,themeable:true},showMaximize:{check:d,init:true,apply:U,themeable:true},showMinimize:{check:d,init:true,apply:U,themeable:true},allowClose:{check:d,init:true,apply:U},allowMaximize:{check:d,init:true,apply:U},allowMinimize:{check:d,init:true,apply:U},showStatusbar:{check:d,init:false,apply:C}},members:{__mv:null,__mw:null,getChildrenContainer:function(){return this.getChildControl(Q);}
,_forwardStates:{active:true,maximized:true,showStatusbar:true,modal:true},setLayoutParent:function(parent){{}
;qx.ui.core.Widget.prototype.setLayoutParent.call(this,parent);}
,_createChildControlImpl:function(be,bd){var ba;switch(be){case s:ba=new qx.ui.container.Composite(new qx.ui.layout.HBox());this._add(ba);ba.add(this.getChildControl(J));break;case J:ba=new qx.ui.basic.Label();ba.setValue(this.getStatus());break;case Q:ba=new qx.ui.container.Composite();this._add(ba,{flex:1});break;case t:var bb=new qx.ui.layout.Grid();bb.setRowFlex(0,1);bb.setColumnFlex(1,1);ba=new qx.ui.container.Composite(bb);this._add(ba);ba.addListener(l,this._onCaptionMouseDblClick,this);this._activateMoveHandle(ba);break;case z:ba=new qx.ui.basic.Image(this.getIcon());this.getChildControl(t).add(ba,{row:0,column:0});break;case y:ba=new qx.ui.basic.Label(this.getCaption());ba.setWidth(0);ba.setAllowGrowX(true);var bc=this.getChildControl(t);bc.add(ba,{row:0,column:1});break;case o:ba=new qx.ui.form.Button();ba.setFocusable(false);ba.addListener(k,this._onMinimizeButtonClick,this);this.getChildControl(t).add(ba,{row:0,column:2});break;case m:ba=new qx.ui.form.Button();ba.setFocusable(false);ba.addListener(k,this._onRestoreButtonClick,this);this.getChildControl(t).add(ba,{row:0,column:3});break;case N:ba=new qx.ui.form.Button();ba.setFocusable(false);ba.addListener(k,this._onMaximizeButtonClick,this);this.getChildControl(t).add(ba,{row:0,column:4});break;case q:ba=new qx.ui.form.Button();ba.setFocusable(false);ba.addListener(k,this._onCloseButtonClick,this);this.getChildControl(t).add(ba,{row:0,column:6});break;};return ba||qx.ui.core.Widget.prototype._createChildControlImpl.call(this,be);}
,_updateCaptionBar:function(){var bg;var bh=this.getIcon();if(bh){this.getChildControl(z).setSource(bh);this._showChildControl(z);}
else {this._excludeChildControl(z);}
;var bf=this.getCaption();if(bf){this.getChildControl(y).setValue(bf);this._showChildControl(y);}
else {this._excludeChildControl(y);}
;if(this.getShowMinimize()){this._showChildControl(o);bg=this.getChildControl(o);this.getAllowMinimize()?bg.resetEnabled():bg.setEnabled(false);}
else {this._excludeChildControl(o);}
;if(this.getShowMaximize()){if(this.isMaximized()){this._showChildControl(m);this._excludeChildControl(N);}
else {this._showChildControl(N);this._excludeChildControl(m);}
;bg=this.getChildControl(N);this.getAllowMaximize()?bg.resetEnabled():bg.setEnabled(false);}
else {this._excludeChildControl(N);this._excludeChildControl(m);}
;if(this.getShowClose()){this._showChildControl(q);bg=this.getChildControl(q);this.getAllowClose()?bg.resetEnabled():bg.setEnabled(false);}
else {this._excludeChildControl(q);}
;}
,close:function(){if(!this.isVisible()){return;}
;if(this.fireNonBubblingEvent(a,qx.event.type.Event,[false,true])){this.hide();this.fireEvent(R);}
;}
,open:function(){this.show();this.setActive(true);this.focus();}
,center:function(){var parent=this.getLayoutParent();if(parent){var bj=parent.getBounds();if(bj){var bk=this.getSizeHint();var bi=Math.round((bj.width-bk.width)/2);var top=Math.round((bj.height-bk.height)/2);if(top<0){top=0;}
;this.moveTo(bi,top);return;}
;}
;{}
;}
,maximize:function(){if(this.isMaximized()){return;}
;var parent=this.getLayoutParent();if(parent!=null&&parent.supportsMaximize()){if(this.fireNonBubblingEvent(L,qx.event.type.Event,[false,true])){if(!this.isVisible()){this.open();}
;var bl=this.getLayoutProperties();this.__mw=bl.left===undefined?0:bl.left;this.__mv=bl.top===undefined?0:bl.top;this.setLayoutProperties({left:null,top:null,edge:0});this.addState(D);this._updateCaptionBar();this.fireEvent(M);}
;}
;}
,minimize:function(){if(!this.isVisible()){return;}
;if(this.fireNonBubblingEvent(b,qx.event.type.Event,[false,true])){var bm=this.getLayoutProperties();this.__mw=bm.left===undefined?0:bm.left;this.__mv=bm.top===undefined?0:bm.top;this.removeState(D);this.hide();this.fireEvent(v);}
;}
,restore:function(){if(this.getMode()===G){return;}
;if(this.fireNonBubblingEvent(r,qx.event.type.Event,[false,true])){if(!this.isVisible()){this.open();}
;var bn=this.__mw;var top=this.__mv;this.setLayoutProperties({edge:null,left:bn,top:top});this.removeState(D);this._updateCaptionBar();this.fireEvent(O);}
;}
,moveTo:function(bo,top){if(this.isMaximized()){return;}
;this.setLayoutProperties({left:bo,top:top});}
,isMaximized:function(){return this.hasState(D);}
,getMode:function(){if(!this.isVisible()){return W;}
else {if(this.isMaximized()){return D;}
else {return G;}
;}
;}
,_applyActive:function(bq,bp){if(bp){this.removeState(V);}
else {this.addState(V);}
;}
,_applyModal:function(bs,br){if(br){this.removeState(w);}
else {this.addState(w);}
;}
,_getContentPaddingTarget:function(){return this.getChildControl(Q);}
,_applyShowStatusbar:function(bv,bt){var bu=this._getResizeFrame();if(bv){this.addState(A);bu.addState(A);}
else {this.removeState(A);bu.removeState(A);}
;if(bv){this._showChildControl(s);}
else {this._excludeChildControl(s);}
;}
,_applyCaptionBarChange:function(bx,bw){this._updateCaptionBar();}
,_applyStatus:function(bz,by){var bA=this.getChildControl(J,true);if(bA){bA.setValue(bz);}
;}
,_applyFocusable:function(bC,bB){if(qx.core.Environment.get(I)!==T){qx.ui.core.Widget.prototype._applyFocusable.call(this,bC,bB);}
;}
,_onWindowEventStop:function(e){e.stopPropagation();}
,_onWindowMouseDown:function(e){this.setActive(true);}
,_onWindowFocusOut:function(e){if(this.getModal()){return;}
;var bD=e.getRelatedTarget();if(bD!=null&&!qx.ui.core.Widget.contains(this,bD)){this.setActive(false);}
;}
,_onCaptionMouseDblClick:function(e){if(this.getAllowMaximize()){this.isMaximized()?this.restore():this.maximize();}
;}
,_onMinimizeButtonClick:function(e){this.minimize();this.getChildControl(o).reset();}
,_onRestoreButtonClick:function(e){this.restore();this.getChildControl(m).reset();}
,_onMaximizeButtonClick:function(e){this.maximize();this.getChildControl(N).reset();}
,_onCloseButtonClick:function(e){this.close();this.getChildControl(q).reset();}
}});}
)();
(function(){var a="Decorator",b="_applyLayoutChange",c="center",d="_applyReversed",e="bottom",f="qx.ui.layout.VBox",g="top",h="left",j="middle",k="Integer",m="right",n="Boolean";qx.Class.define(f,{extend:qx.ui.layout.Abstract,construct:function(o,p,q){qx.ui.layout.Abstract.call(this);if(o){this.setSpacing(o);}
;if(p){this.setAlignY(p);}
;if(q){this.setSeparator(q);}
;}
,properties:{alignY:{check:[g,j,e],init:g,apply:b},alignX:{check:[h,c,m],init:h,apply:b},spacing:{check:k,init:0,apply:b},separator:{check:a,nullable:true,apply:b},reversed:{check:n,init:false,apply:d}},members:{__mx:null,__kK:null,__kL:null,__fP:null,_applyReversed:function(){this._invalidChildrenCache=true;this._applyLayoutChange();}
,__kM:function(){var w=this._getLayoutChildren();var length=w.length;var s=false;var r=this.__mx&&this.__mx.length!=length&&this.__kK&&this.__mx;var u;var t=r?this.__mx:new Array(length);var v=r?this.__kK:new Array(length);if(this.getReversed()){w=w.concat().reverse();}
;for(var i=0;i<length;i++ ){u=w[i].getLayoutProperties();if(u.height!=null){t[i]=parseFloat(u.height)/100;}
;if(u.flex!=null){v[i]=u.flex;s=true;}
else {v[i]=0;}
;}
;if(!r){this.__mx=t;this.__kK=v;}
;this.__kL=s;this.__fP=w;delete this._invalidChildrenCache;}
,verifyLayoutProperty:null,renderLayout:function(O,G,R){if(this._invalidChildrenCache){this.__kM();}
;var D=this.__fP;var length=D.length;var N=qx.ui.layout.Util;var M=this.getSpacing();var T=this.getSeparator();if(T){var A=N.computeVerticalSeparatorGaps(D,M,T);}
else {var A=N.computeVerticalGaps(D,M,true);}
;var i,S,z,H;var I=[];var P=A;for(i=0;i<length;i+=1){H=this.__mx[i];z=H!=null?Math.floor((G-A)*H):D[i].getSizeHint().height;I.push(z);P+=z;}
;if(this.__kL&&P!=G){var F={};var L,y;for(i=0;i<length;i+=1){L=this.__kK[i];if(L>0){E=D[i].getSizeHint();F[i]={min:E.minHeight,value:I[i],max:E.maxHeight,flex:L};}
;}
;var B=N.computeFlexOffsets(F,G,P);for(i in B){y=B[i].offset;I[i]+=y;P+=y;}
;}
;var top=D[0].getMarginTop();if(P<G&&this.getAlignY()!=g){top=G-P;if(this.getAlignY()===j){top=Math.round(top/2);}
;}
;var E,V,J,z,x,K,C;this._clearSeparators();if(T){var U=qx.theme.manager.Decoration.getInstance().resolve(T).getInsets();var Q=U.top+U.bottom;}
;for(i=0;i<length;i+=1){S=D[i];z=I[i];E=S.getSizeHint();K=S.getMarginLeft();C=S.getMarginRight();J=Math.max(E.minWidth,Math.min(O-K-C,E.maxWidth));V=N.computeHorizontalAlignOffset(S.getAlignX()||this.getAlignX(),J,O,K,C);if(i>0){if(T){top+=x+M;this._renderSeparator(T,{top:top+R.top,left:R.left,height:Q,width:O});top+=Q+M+S.getMarginTop();}
else {top+=N.collapseMargins(M,x,S.getMarginTop());}
;}
;S.renderLayout(V+R.left,top+R.top,J,z);top+=z;x=S.getMarginBottom();}
;}
,_computeSizeHint:function(){if(this._invalidChildrenCache){this.__kM();}
;var W=qx.ui.layout.Util;var bl=this.__fP;var ba=0,bb=0,bj=0;var bc=0,bd=0;var bh,X,bk;for(var i=0,l=bl.length;i<l;i+=1){bh=bl[i];X=bh.getSizeHint();bb+=X.height;var bg=this.__kK[i];var Y=this.__mx[i];if(bg){ba+=X.minHeight;}
else if(Y){bj=Math.max(bj,Math.round(X.minHeight/Y));}
else {ba+=X.height;}
;bk=bh.getMarginLeft()+bh.getMarginRight();if((X.width+bk)>bd){bd=X.width+bk;}
;if((X.minWidth+bk)>bc){bc=X.minWidth+bk;}
;}
;ba+=bj;var bf=this.getSpacing();var bi=this.getSeparator();if(bi){var be=W.computeVerticalSeparatorGaps(bl,bf,bi);}
else {var be=W.computeVerticalGaps(bl,bf,true);}
;return {minHeight:ba+be,height:bb+be,minWidth:bc,width:bd};}
},destruct:function(){this.__mx=this.__kK=this.__fP=null;}
});}
)();
(function(){var a="' must be defined!",b="height",c="hAlign",d="vAlign",e="Integer",f="'",g="_applyLayoutChange",h="qx.ui.layout.Grid",m="maxHeight",n="Cannot add widget '",o="width",p=") for '",q="'!. ",r="top",s="minHeight",t="' in this cell (",u=", ",v="The layout properties 'row' and 'column' of the child widget '",w="minWidth",z="flex",A="left",B="maxWidth",C="There is already a widget '";qx.Class.define(h,{extend:qx.ui.layout.Abstract,construct:function(E,D){qx.ui.layout.Abstract.call(this);this.__my=[];this.__mz=[];if(E){this.setSpacingX(E);}
;if(D){this.setSpacingY(D);}
;}
,properties:{spacingX:{check:e,init:0,apply:g},spacingY:{check:e,init:0,apply:g}},members:{__mA:null,__my:null,__mz:null,__mB:null,__mC:null,__mD:null,__mE:null,__mF:null,__mG:null,verifyLayoutProperty:null,__mH:function(){var L=[];var G=[];var J=[];var I=-1;var F=-1;var K=this._getLayoutChildren();for(var i=0,l=K.length;i<l;i++ ){var M=K[i];var N=M.getLayoutProperties();var O=N.row;var H=N.column;N.colSpan=N.colSpan||1;N.rowSpan=N.rowSpan||1;if(O==null||H==null){throw new Error(v+M+a);}
;if(L[O]&&L[O][H]){throw new Error(n+M+q+C+L[O][H]+t+O+u+H+p+this+f);}
;for(var x=H;x<H+N.colSpan;x++ ){for(var y=O;y<O+N.rowSpan;y++ ){if(L[y]==undefined){L[y]=[];}
;L[y][x]=M;F=Math.max(F,x);I=Math.max(I,y);}
;}
;if(N.rowSpan>1){J.push(M);}
;if(N.colSpan>1){G.push(M);}
;}
;for(var y=0;y<=I;y++ ){if(L[y]==undefined){L[y]=[];}
;}
;this.__mA=L;this.__mB=G;this.__mC=J;this.__mD=I;this.__mE=F;this.__mF=null;this.__mG=null;delete this._invalidChildrenCache;}
,_setRowData:function(S,Q,R){var P=this.__my[S];if(!P){this.__my[S]={};this.__my[S][Q]=R;}
else {P[Q]=R;}
;}
,_setColumnData:function(T,V,W){var U=this.__mz[T];if(!U){this.__mz[T]={};this.__mz[T][V]=W;}
else {U[V]=W;}
;}
,setSpacing:function(X){this.setSpacingY(X);this.setSpacingX(X);return this;}
,setColumnAlign:function(Y,ba,bb){{}
;this._setColumnData(Y,c,ba);this._setColumnData(Y,d,bb);this._applyLayoutChange();return this;}
,getColumnAlign:function(bc){var bd=this.__mz[bc]||{};return {vAlign:bd.vAlign||r,hAlign:bd.hAlign||A};}
,setRowAlign:function(bf,be,bg){{}
;this._setRowData(bf,c,be);this._setRowData(bf,d,bg);this._applyLayoutChange();return this;}
,getRowAlign:function(bi){var bh=this.__my[bi]||{};return {vAlign:bh.vAlign||r,hAlign:bh.hAlign||A};}
,getCellWidget:function(bk,bj){if(this._invalidChildrenCache){this.__mH();}
;var bk=this.__mA[bk]||{};return bk[bj]||null;}
,getRowCount:function(){if(this._invalidChildrenCache){this.__mH();}
;return this.__mD+1;}
,getColumnCount:function(){if(this._invalidChildrenCache){this.__mH();}
;return this.__mE+1;}
,getCellAlign:function(bs,bm){var br=r;var bp=A;var bq=this.__my[bs];var bn=this.__mz[bm];var bl=this.__mA[bs][bm];if(bl){var bo={vAlign:bl.getAlignY(),hAlign:bl.getAlignX()};}
else {bo={};}
;if(bo.vAlign){br=bo.vAlign;}
else if(bq&&bq.vAlign){br=bq.vAlign;}
else if(bn&&bn.vAlign){br=bn.vAlign;}
;if(bo.hAlign){bp=bo.hAlign;}
else if(bn&&bn.hAlign){bp=bn.hAlign;}
else if(bq&&bq.hAlign){bp=bq.hAlign;}
;return {vAlign:br,hAlign:bp};}
,setColumnFlex:function(bt,bu){this._setColumnData(bt,z,bu);this._applyLayoutChange();return this;}
,getColumnFlex:function(bv){var bw=this.__mz[bv]||{};return bw.flex!==undefined?bw.flex:0;}
,setRowFlex:function(by,bx){this._setRowData(by,z,bx);this._applyLayoutChange();return this;}
,getRowFlex:function(bB){var bz=this.__my[bB]||{};var bA=bz.flex!==undefined?bz.flex:0;return bA;}
,setColumnMaxWidth:function(bC,bD){this._setColumnData(bC,B,bD);this._applyLayoutChange();return this;}
,getColumnMaxWidth:function(bE){var bF=this.__mz[bE]||{};return bF.maxWidth!==undefined?bF.maxWidth:Infinity;}
,setColumnWidth:function(bG,bH){this._setColumnData(bG,o,bH);this._applyLayoutChange();return this;}
,getColumnWidth:function(bI){var bJ=this.__mz[bI]||{};return bJ.width!==undefined?bJ.width:null;}
,setColumnMinWidth:function(bK,bL){this._setColumnData(bK,w,bL);this._applyLayoutChange();return this;}
,getColumnMinWidth:function(bM){var bN=this.__mz[bM]||{};return bN.minWidth||0;}
,setRowMaxHeight:function(bP,bO){this._setRowData(bP,m,bO);this._applyLayoutChange();return this;}
,getRowMaxHeight:function(bR){var bQ=this.__my[bR]||{};return bQ.maxHeight||Infinity;}
,setRowHeight:function(bS,bT){this._setRowData(bS,b,bT);this._applyLayoutChange();return this;}
,getRowHeight:function(bV){var bU=this.__my[bV]||{};return bU.height!==undefined?bU.height:null;}
,setRowMinHeight:function(bX,bW){this._setRowData(bX,s,bW);this._applyLayoutChange();return this;}
,getRowMinHeight:function(ca){var bY=this.__my[ca]||{};return bY.minHeight||0;}
,__mI:function(cc){var cb=cc.getSizeHint();var ce=cc.getMarginLeft()+cc.getMarginRight();var cd=cc.getMarginTop()+cc.getMarginBottom();var cf={height:cb.height+cd,width:cb.width+ce,minHeight:cb.minHeight+cd,minWidth:cb.minWidth+ce,maxHeight:cb.maxHeight+cd,maxWidth:cb.maxWidth+ce};return cf;}
,_fixHeightsRowSpan:function(cA){var cm=this.getSpacingY();for(var i=0,l=this.__mC.length;i<l;i++ ){var cs=this.__mC[i];var cp=this.__mI(cs);var ci=cs.getLayoutProperties();var co=ci.row;var cx=cm*(ci.rowSpan-1);var cg=cx;var cj={};for(var j=0;j<ci.rowSpan;j++ ){var cn=ci.row+j;var cw=cA[cn];var cy=this.getRowFlex(cn);if(cy>0){cj[cn]={min:cw.minHeight,value:cw.height,max:cw.maxHeight,flex:cy};}
;cx+=cw.height;cg+=cw.minHeight;}
;if(cx<cp.height){if(!qx.lang.Object.isEmpty(cj)){var cz=qx.ui.layout.Util.computeFlexOffsets(cj,cp.height,cx);for(var k=0;k<ci.rowSpan;k++ ){var cu=cz[co+k]?cz[co+k].offset:0;cA[co+k].height+=cu;}
;}
else {var cr=cm*(ci.rowSpan-1);var cq=cp.height-cr;var cv=Math.floor(cq/ci.rowSpan);var ct=0;var ch=0;for(var k=0;k<ci.rowSpan;k++ ){var cl=cA[co+k].height;ct+=cl;if(cl<cv){ch++ ;}
;}
;var ck=Math.floor((cq-ct)/ch);for(var k=0;k<ci.rowSpan;k++ ){if(cA[co+k].height<cv){cA[co+k].height+=ck;}
;}
;}
;}
;if(cg<cp.minHeight){var cz=qx.ui.layout.Util.computeFlexOffsets(cj,cp.minHeight,cg);for(var j=0;j<ci.rowSpan;j++ ){var cu=cz[co+j]?cz[co+j].offset:0;cA[co+j].minHeight+=cu;}
;}
;}
;}
,_fixWidthsColSpan:function(cE){var cF=this.getSpacingX();for(var i=0,l=this.__mB.length;i<l;i++ ){var cB=this.__mB[i];var cD=this.__mI(cB);var cH=cB.getLayoutProperties();var cC=cH.column;var cN=cF*(cH.colSpan-1);var cG=cN;var cI={};var cK;for(var j=0;j<cH.colSpan;j++ ){var cJ=cH.column+j;var cM=cE[cJ];var cL=this.getColumnFlex(cJ);if(cL>0){cI[cJ]={min:cM.minWidth,value:cM.width,max:cM.maxWidth,flex:cL};}
;cN+=cM.width;cG+=cM.minWidth;}
;if(cN<cD.width){var cO=qx.ui.layout.Util.computeFlexOffsets(cI,cD.width,cN);for(var j=0;j<cH.colSpan;j++ ){cK=cO[cC+j]?cO[cC+j].offset:0;cE[cC+j].width+=cK;}
;}
;if(cG<cD.minWidth){var cO=qx.ui.layout.Util.computeFlexOffsets(cI,cD.minWidth,cG);for(var j=0;j<cH.colSpan;j++ ){cK=cO[cC+j]?cO[cC+j].offset:0;cE[cC+j].minWidth+=cK;}
;}
;}
;}
,_getRowHeights:function(){if(this.__mF!=null){return this.__mF;}
;var cY=[];var cR=this.__mD;var cQ=this.__mE;for(var da=0;da<=cR;da++ ){var cS=0;var cU=0;var cT=0;for(var cX=0;cX<=cQ;cX++ ){var cP=this.__mA[da][cX];if(!cP){continue;}
;var cV=cP.getLayoutProperties().rowSpan||0;if(cV>1){continue;}
;var cW=this.__mI(cP);if(this.getRowFlex(da)>0){cS=Math.max(cS,cW.minHeight);}
else {cS=Math.max(cS,cW.height);}
;cU=Math.max(cU,cW.height);}
;var cS=Math.max(cS,this.getRowMinHeight(da));var cT=this.getRowMaxHeight(da);if(this.getRowHeight(da)!==null){var cU=this.getRowHeight(da);}
else {var cU=Math.max(cS,Math.min(cU,cT));}
;cY[da]={minHeight:cS,height:cU,maxHeight:cT};}
;if(this.__mC.length>0){this._fixHeightsRowSpan(cY);}
;this.__mF=cY;return cY;}
,_getColWidths:function(){if(this.__mG!=null){return this.__mG;}
;var df=[];var dc=this.__mE;var de=this.__mD;for(var dk=0;dk<=dc;dk++ ){var di=0;var dh=0;var dd=Infinity;for(var dl=0;dl<=de;dl++ ){var db=this.__mA[dl][dk];if(!db){continue;}
;var dg=db.getLayoutProperties().colSpan||0;if(dg>1){continue;}
;var dj=this.__mI(db);if(this.getColumnFlex(dk)>0){dh=Math.max(dh,dj.minWidth);}
else {dh=Math.max(dh,dj.width);}
;di=Math.max(di,dj.width);}
;dh=Math.max(dh,this.getColumnMinWidth(dk));dd=this.getColumnMaxWidth(dk);if(this.getColumnWidth(dk)!==null){var di=this.getColumnWidth(dk);}
else {var di=Math.max(dh,Math.min(di,dd));}
;df[dk]={minWidth:dh,width:di,maxWidth:dd};}
;if(this.__mB.length>0){this._fixWidthsColSpan(df);}
;this.__mG=df;return df;}
,_getColumnFlexOffsets:function(dq){var dm=this.getSizeHint();var ds=dq-dm.width;if(ds==0){return {};}
;var dp=this._getColWidths();var dn={};for(var i=0,l=dp.length;i<l;i++ ){var dt=dp[i];var dr=this.getColumnFlex(i);if((dr<=0)||(dt.width==dt.maxWidth&&ds>0)||(dt.width==dt.minWidth&&ds<0)){continue;}
;dn[i]={min:dt.minWidth,value:dt.width,max:dt.maxWidth,flex:dr};}
;return qx.ui.layout.Util.computeFlexOffsets(dn,dq,dm.width);}
,_getRowFlexOffsets:function(dw){var du=this.getSizeHint();var dy=dw-du.height;if(dy==0){return {};}
;var dx=this._getRowHeights();var dv={};for(var i=0,l=dx.length;i<l;i++ ){var dA=dx[i];var dz=this.getRowFlex(i);if((dz<=0)||(dA.height==dA.maxHeight&&dy>0)||(dA.height==dA.minHeight&&dy<0)){continue;}
;dv[i]={min:dA.minHeight,value:dA.height,max:dA.maxHeight,flex:dz};}
;return qx.ui.layout.Util.computeFlexOffsets(dv,dw,du.height);}
,renderLayout:function(dV,dB,dU){if(this._invalidChildrenCache){this.__mH();}
;var dP=qx.ui.layout.Util;var dD=this.getSpacingX();var dJ=this.getSpacingY();var dT=this._getColWidths();var dW=this._getColumnFlexOffsets(dV);var dE=[];var dY=this.__mE;var dC=this.__mD;var dX;for(var ea=0;ea<=dY;ea++ ){dX=dW[ea]?dW[ea].offset:0;dE[ea]=dT[ea].width+dX;}
;var dM=this._getRowHeights();var dO=this._getRowFlexOffsets(dB);var eg=[];for(var dK=0;dK<=dC;dK++ ){dX=dO[dK]?dO[dK].offset:0;eg[dK]=dM[dK].height+dX;}
;var ee=0;for(var ea=0;ea<=dY;ea++ ){var top=0;for(var dK=0;dK<=dC;dK++ ){var dR=this.__mA[dK][ea];if(!dR){top+=eg[dK]+dJ;continue;}
;var dF=dR.getLayoutProperties();if(dF.row!==dK||dF.column!==ea){top+=eg[dK]+dJ;continue;}
;var ef=dD*(dF.colSpan-1);for(var i=0;i<dF.colSpan;i++ ){ef+=dE[ea+i];}
;var dS=dJ*(dF.rowSpan-1);for(var i=0;i<dF.rowSpan;i++ ){dS+=eg[dK+i];}
;var dG=dR.getSizeHint();var ed=dR.getMarginTop();var dQ=dR.getMarginLeft();var dN=dR.getMarginBottom();var dI=dR.getMarginRight();var dL=Math.max(dG.minWidth,Math.min(ef-dQ-dI,dG.maxWidth));var eh=Math.max(dG.minHeight,Math.min(dS-ed-dN,dG.maxHeight));var eb=this.getCellAlign(dK,ea);var ec=ee+dP.computeHorizontalAlignOffset(eb.hAlign,dL,ef,dQ,dI);var dH=top+dP.computeVerticalAlignOffset(eb.vAlign,eh,dS,ed,dN);dR.renderLayout(ec+dU.left,dH+dU.top,dL,eh);top+=eg[dK]+dJ;}
;ee+=dE[ea]+dD;}
;}
,invalidateLayoutCache:function(){qx.ui.layout.Abstract.prototype.invalidateLayoutCache.call(this);this.__mG=null;this.__mF=null;}
,_computeSizeHint:function(){if(this._invalidChildrenCache){this.__mH();}
;var ek=this._getColWidths();var ei=0,eq=0;for(var i=0,l=ek.length;i<l;i++ ){var ep=ek[i];if(this.getColumnFlex(i)>0){ei+=ep.minWidth;}
else {ei+=ep.width;}
;eq+=ep.width;}
;var er=this._getRowHeights();var el=0,em=0;for(var i=0,l=er.length;i<l;i++ ){var es=er[i];if(this.getRowFlex(i)>0){el+=es.minHeight;}
else {el+=es.height;}
;em+=es.height;}
;var eo=this.getSpacingX()*(ek.length-1);var en=this.getSpacingY()*(er.length-1);var ej={minWidth:ei+eo,width:eq+eo,minHeight:el+en,height:em+en};return ej;}
},destruct:function(){this.__mA=this.__my=this.__mz=this.__mB=this.__mC=this.__mG=this.__mF=null;}
});}
)();
(function(){var a="qx.ui.form.IExecutable",b="qx.event.type.Data";qx.Interface.define(a,{events:{"execute":b},members:{setCommand:function(c){return arguments.length==1;}
,getCommand:function(){}
,execute:function(){}
}});}
)();
(function(){var a="toolTipText",b="icon",c="label",d="qx.ui.core.MExecutable",f="value",g="qx.event.type.Event",h="execute",j="_applyCommand",k="enabled",l="menu",m="changeCommand",n="qx.ui.core.Command";qx.Mixin.define(d,{events:{"execute":g},properties:{command:{check:n,apply:j,event:m,nullable:true}},members:{__mJ:null,__mK:false,__mL:null,_bindableProperties:[k,c,b,a,f,l],execute:function(){var o=this.getCommand();if(o){if(this.__mK){this.__mK=false;}
else {this.__mK=true;o.execute(this);}
;}
;this.fireEvent(h);}
,__mM:function(e){if(this.__mK){this.__mK=false;return;}
;this.__mK=true;this.execute();}
,_applyCommand:function(r,p){if(p!=null){p.removeListenerById(this.__mL);}
;if(r!=null){this.__mL=r.addListener(h,this.__mM,this);}
;var q=this.__mJ;if(q==null){this.__mJ=q={};}
;var u;for(var i=0;i<this._bindableProperties.length;i++ ){var t=this._bindableProperties[i];if(p!=null&&!p.isDisposed()&&q[t]!=null){p.removeBinding(q[t]);q[t]=null;}
;if(r!=null&&qx.Class.hasProperty(this.constructor,t)){var s=r.get(t);if(s==null){u=this.get(t);if(u==null){this.syncAppearance();u=qx.util.PropertyUtil.getThemeValue(this,t);}
;}
else {u=null;}
;q[t]=r.bind(t,this,t);if(u){this.set(t,u);}
;}
;}
;}
},destruct:function(){this._applyCommand(null,this.getCommand());this.__mJ=null;}
});}
)();
(function(){var a="dblclick",b="qx.ui.form.Button",c="mouseup",d="mousedown",f="Enter",g="pressed",h="event.mspointer",i="hovered",j="mouseover",k="mouseout",l="click",m="mousemove",n="keydown",o="abandoned",p="button",q="keyup",r="Space";qx.Class.define(b,{extend:qx.ui.basic.Atom,include:[qx.ui.core.MExecutable],implement:[qx.ui.form.IExecutable],construct:function(s,u,t){qx.ui.basic.Atom.call(this,s,u);if(t!=null){this.setCommand(t);}
;this.addListener(j,this._onMouseOver);this.addListener(k,this._onMouseOut);this.addListener(d,this._onMouseDown);this.addListener(c,this._onMouseUp);this.addListener(l,this._onClick);this.addListener(n,this._onKeyDown);this.addListener(q,this._onKeyUp);this.addListener(a,this._onStopEvent);if(qx.event.handler.MouseEmulation.ON&&!qx.core.Environment.get(h)){this.addListener(m,function(e){var y=this.getBounds();var v={left:e.getDocumentLeft(),top:e.getDocumentTop()};var w=v.left>y.left&&v.left<y.left+y.width;var x=v.top>y.top&&v.top<y.top+y.height;if(w&&x){this.addState(g);}
else {this.removeState(g);}
;}
);}
;}
,properties:{appearance:{refine:true,init:p},focusable:{refine:true,init:true}},members:{_forwardStates:{focused:true,hovered:true,pressed:true,disabled:true},press:function(){if(this.hasState(o)){return;}
;this.addState(g);}
,release:function(){if(this.hasState(g)){this.removeState(g);}
;}
,reset:function(){this.removeState(g);this.removeState(o);this.removeState(i);}
,_onMouseOver:function(e){if(!this.isEnabled()||e.getTarget()!==this){return;}
;if(this.hasState(o)){this.removeState(o);this.addState(g);}
;this.addState(i);}
,_onMouseOut:function(e){if(!this.isEnabled()||e.getTarget()!==this){return;}
;this.removeState(i);if(this.hasState(g)){this.removeState(g);this.addState(o);}
;}
,_onMouseDown:function(e){if(!e.isLeftPressed()){return;}
;e.stopPropagation();this.capture();this.removeState(o);this.addState(g);}
,_onMouseUp:function(e){this.releaseCapture();var z=this.hasState(g);var A=this.hasState(o);if(z){this.removeState(g);}
;if(A){this.removeState(o);}
else {if(z){this.execute();}
;}
;e.stopPropagation();}
,_onClick:function(e){e.stopPropagation();}
,_onKeyDown:function(e){switch(e.getKeyIdentifier()){case f:case r:this.removeState(o);this.addState(g);e.stopPropagation();};}
,_onKeyUp:function(e){switch(e.getKeyIdentifier()){case f:case r:if(this.hasState(g)){this.removeState(o);this.removeState(g);this.execute();e.stopPropagation();}
;};}
}});}
)();
(function(){var a="keypress",b="focusout",c="activate",d="Tab",f="__mN",g="singleton",h="deactivate",j="focusin",k="qx.ui.core.FocusHandler";qx.Class.define(k,{extend:qx.core.Object,type:g,construct:function(){qx.core.Object.call(this);this.__mN={};}
,members:{__mN:null,__mO:null,__mP:null,__mQ:null,connectTo:function(m){m.addListener(a,this.__id,this);m.addListener(j,this._onFocusIn,this,true);m.addListener(b,this._onFocusOut,this,true);m.addListener(c,this._onActivate,this,true);m.addListener(h,this._onDeactivate,this,true);}
,addRoot:function(n){this.__mN[n.$$hash]=n;}
,removeRoot:function(o){delete this.__mN[o.$$hash];}
,getActiveWidget:function(){return this.__mO;}
,isActive:function(p){return this.__mO==p;}
,getFocusedWidget:function(){return this.__mP;}
,isFocused:function(q){return this.__mP==q;}
,isFocusRoot:function(r){return !!this.__mN[r.$$hash];}
,_onActivate:function(e){var t=e.getTarget();this.__mO=t;var s=this.__mR(t);if(s!=this.__mQ){this.__mQ=s;}
;}
,_onDeactivate:function(e){var u=e.getTarget();if(this.__mO==u){this.__mO=null;}
;}
,_onFocusIn:function(e){var v=e.getTarget();if(v!=this.__mP){this.__mP=v;v.visualizeFocus();}
;}
,_onFocusOut:function(e){var w=e.getTarget();if(w==this.__mP){this.__mP=null;w.visualizeBlur();}
;}
,__id:function(e){if(e.getKeyIdentifier()!=d){return;}
;if(!this.__mQ){return;}
;e.stopPropagation();e.preventDefault();var x=this.__mP;if(!e.isShiftPressed()){var y=x?this.__mV(x):this.__mT();}
else {var y=x?this.__mW(x):this.__mU();}
;if(y){y.tabFocus();}
;}
,__mR:function(z){var A=this.__mN;while(z){if(A[z.$$hash]){return z;}
;z=z.getLayoutParent();}
;return null;}
,__mS:function(I,H){if(I===H){return 0;}
;var C=I.getTabIndex()||0;var B=H.getTabIndex()||0;if(C!=B){return C-B;}
;var J=I.getContentElement().getDomElement();var G=H.getContentElement().getDomElement();var F=qx.bom.element.Location;var E=F.get(J);var D=F.get(G);if(E.top!=D.top){return E.top-D.top;}
;if(E.left!=D.left){return E.left-D.left;}
;var K=I.getZIndex();var L=H.getZIndex();if(K!=L){return K-L;}
;return 0;}
,__mT:function(){return this.__na(this.__mQ,null);}
,__mU:function(){return this.__nb(this.__mQ,null);}
,__mV:function(M){var N=this.__mQ;if(N==M){return this.__mT();}
;while(M&&M.getAnonymous()){M=M.getLayoutParent();}
;if(M==null){return [];}
;var O=[];this.__mX(N,M,O);O.sort(this.__mS);var P=O.length;return P>0?O[0]:this.__mT();}
,__mW:function(Q){var R=this.__mQ;if(R==Q){return this.__mU();}
;while(Q&&Q.getAnonymous()){Q=Q.getLayoutParent();}
;if(Q==null){return [];}
;var S=[];this.__mY(R,Q,S);S.sort(this.__mS);var T=S.length;return T>0?S[T-1]:this.__mU();}
,__mX:function(parent,U,V){var X=parent.getLayoutChildren();var W;for(var i=0,l=X.length;i<l;i++ ){W=X[i];if(!(W instanceof qx.ui.core.Widget)){continue;}
;if(!this.isFocusRoot(W)&&W.isEnabled()&&W.isVisible()){if(W.isTabable()&&this.__mS(U,W)<0){V.push(W);}
;this.__mX(W,U,V);}
;}
;}
,__mY:function(parent,Y,ba){var bc=parent.getLayoutChildren();var bb;for(var i=0,l=bc.length;i<l;i++ ){bb=bc[i];if(!(bb instanceof qx.ui.core.Widget)){continue;}
;if(!this.isFocusRoot(bb)&&bb.isEnabled()&&bb.isVisible()){if(bb.isTabable()&&this.__mS(Y,bb)>0){ba.push(bb);}
;this.__mY(bb,Y,ba);}
;}
;}
,__na:function(parent,bd){var bf=parent.getLayoutChildren();var be;for(var i=0,l=bf.length;i<l;i++ ){be=bf[i];if(!(be instanceof qx.ui.core.Widget)){continue;}
;if(!this.isFocusRoot(be)&&be.isEnabled()&&be.isVisible()){if(be.isTabable()){if(bd==null||this.__mS(be,bd)<0){bd=be;}
;}
;bd=this.__na(be,bd);}
;}
;return bd;}
,__nb:function(parent,bg){var bi=parent.getLayoutChildren();var bh;for(var i=0,l=bi.length;i<l;i++ ){bh=bi[i];if(!(bh instanceof qx.ui.core.Widget)){continue;}
;if(!this.isFocusRoot(bh)&&bh.isEnabled()&&bh.isVisible()){if(bh.isTabable()){if(bg==null||this.__mS(bh,bg)>0){bg=bh;}
;}
;bg=this.__nb(bh,bg);}
;}
;return bg;}
},destruct:function(){this._disposeMap(f);this.__mP=this.__mO=this.__mQ=null;}
});}
)();
(function(){var a="_applyBlockerColor",b="Number",c="qx.ui.core.MBlocker",d="_applyBlockerOpacity",e="__nc",f="Color";qx.Mixin.define(c,{construct:function(){this.__nc=this._createBlocker();}
,properties:{blockerColor:{check:f,init:null,nullable:true,apply:a,themeable:true},blockerOpacity:{check:b,init:1,apply:d,themeable:true}},members:{__nc:null,_createBlocker:function(){return new qx.ui.core.Blocker(this);}
,_applyBlockerColor:function(h,g){this.__nc.setColor(h);}
,_applyBlockerOpacity:function(j,i){this.__nc.setOpacity(j);}
,block:function(){this.__nc.block();}
,isBlocked:function(){return this.__nc.isBlocked();}
,unblock:function(){this.__nc.unblock();}
,forceUnblock:function(){this.__nc.forceUnblock();}
,blockContent:function(k){this.__nc.blockContent(k);}
,isContentBlocked:function(){{}
;return this.__nc.isBlocked();}
,unblockContent:function(){{}
;this.__nc.unblock();}
,forceUnblockContent:function(){{}
;this.__nc.forceUnblock();}
,getBlocker:function(){return this.__nc;}
},destruct:function(){this._disposeObjects(e);}
});}
)();
(function(){var a="qx.dyntheme",b="backgroundColor",c="_applyOpacity",d="Boolean",f="px",g="keydown",h="deactivate",j="changeTheme",k="__dD",l="opacity",m="Tab",n="qx.event.type.Event",o="move",p="Color",q="resize",r="zIndex",s="appear",t="qx.ui.root.Abstract",u="keyup",v="keypress",w="Number",x="unblocked",y="qx.ui.core.Blocker",z="disappear",A="blocked",B="__nc",C="_applyColor";qx.Class.define(y,{extend:qx.core.Object,events:{blocked:n,unblocked:n},construct:function(D){qx.core.Object.call(this);this._widget=D;D.addListener(q,this.__nh,this);D.addListener(o,this.__nh,this);D.addListener(z,this.__nj,this);if(qx.Class.isDefined(t)&&D instanceof qx.ui.root.Abstract){this._isRoot=true;this.setKeepBlockerActive(true);}
;if(qx.core.Environment.get(a)){qx.theme.manager.Color.getInstance().addListener(j,this._onChangeTheme,this);}
;this.__nd=[];this.__ne=[];}
,properties:{color:{check:p,init:null,nullable:true,apply:C,themeable:true},opacity:{check:w,init:1,apply:c,themeable:true},keepBlockerActive:{check:d,init:false}},members:{__nc:null,__nf:0,__nd:null,__ne:null,__dD:null,_widget:null,_isRoot:false,__ng:null,__nh:function(e){var E=e.getData();if(this.isBlocked()){this._updateBlockerBounds(E);}
;}
,__ni:function(){this._updateBlockerBounds(this._widget.getBounds());if(this._widget.isRootWidget()){this._widget.getContentElement().add(this.getBlockerElement());}
else {this._widget.getLayoutParent().getContentElement().add(this.getBlockerElement());}
;}
,__nj:function(){if(this.isBlocked()){this.getBlockerElement().getParent().remove(this.getBlockerElement());this._widget.addListenerOnce(s,this.__ni,this);}
;}
,_updateBlockerBounds:function(F){this.getBlockerElement().setStyles({width:F.width+f,height:F.height+f,left:F.left+f,top:F.top+f});}
,_applyColor:function(I,H){var G=qx.theme.manager.Color.getInstance().resolve(I);this.__nk(b,G);}
,_applyOpacity:function(K,J){this.__nk(l,K);}
,_onChangeTheme:qx.core.Environment.select(a,{"true":function(){this._applyColor(this.getColor());}
,"false":null}),__nk:function(M,N){var L=[];this.__nc&&L.push(this.__nc);for(var i=0;i<L.length;i++ ){L[i].setStyle(M,N);}
;}
,_backupActiveWidget:function(){var O=qx.event.Registration.getManager(window).getHandler(qx.event.handler.Focus);this.__nd.push(O.getActive());this.__ne.push(O.getFocus());if(this._widget.isFocusable()){this._widget.focus();}
;}
,_restoreActiveWidget:function(){var R=this.__nd.length;if(R>0){var Q=this.__nd[R-1];if(Q){qx.bom.Element.activate(Q);}
;this.__nd.pop();}
;var P=this.__ne.length;if(P>0){var Q=this.__ne[P-1];if(Q){qx.bom.Element.focus(this.__ne[P-1]);}
;this.__ne.pop();}
;}
,__nl:function(){return new qx.html.Blocker(this.getColor(),this.getOpacity());}
,getBlockerElement:function(S){if(!this.__nc){this.__nc=this.__nl();this.__nc.setStyle(r,15);if(!S){if(this._isRoot){S=this._widget;}
else {S=this._widget.getLayoutParent();}
;}
;S.getContentElement().add(this.__nc);this.__nc.exclude();}
;return this.__nc;}
,block:function(){this._block();}
,_block:function(T,V){if(!this._isRoot&&!this._widget.getLayoutParent()){this.__ng=this._widget.addListenerOnce(s,this._block.bind(this,T));return;}
;var parent;if(this._isRoot||V){parent=this._widget;}
else {parent=this._widget.getLayoutParent();}
;var U=this.getBlockerElement(parent);if(T!=null){U.setStyle(r,T);}
;this.__nf++ ;if(this.__nf<2){this._backupActiveWidget();var W=this._widget.getBounds();if(W){this._updateBlockerBounds(W);}
;U.include();if(!V){U.activate();}
;U.addListener(h,this.__no,this);U.addListener(v,this.__nn,this);U.addListener(g,this.__nn,this);U.addListener(u,this.__nn,this);this.fireEvent(A,qx.event.type.Event);}
;}
,isBlocked:function(){return this.__nf>0;}
,unblock:function(){if(this.__ng){this._widget.removeListenerById(this.__ng);}
;if(!this.isBlocked()){return;}
;this.__nf-- ;if(this.__nf<1){this.__nm();this.__nf=0;}
;}
,forceUnblock:function(){if(!this.isBlocked()){return;}
;this.__nf=0;this.__nm();}
,__nm:function(){this._restoreActiveWidget();var X=this.getBlockerElement();X.removeListener(h,this.__no,this);X.removeListener(v,this.__nn,this);X.removeListener(g,this.__nn,this);X.removeListener(u,this.__nn,this);X.exclude();this.fireEvent(x,qx.event.type.Event);}
,getContentBlockerElement:function(){{}
;return this.getBlockerElement();}
,blockContent:function(Y){this._block(Y,true);}
,isContentBlocked:function(){{}
;return this.isBlocked();}
,unblockContent:function(){{}
;this.unblock();}
,forceUnblockContent:function(){{}
;this.forceUnblock();}
,__nn:function(e){if(e.getKeyIdentifier()==m){e.stop();}
;}
,__no:function(){if(this.getKeepBlockerActive()){this.getBlockerElement().activate();}
;}
},destruct:function(){if(qx.core.Environment.get(a)){qx.theme.manager.Color.getInstance().removeListener(j,this._onChangeTheme,this);}
;this._widget.removeListener(q,this.__nh,this);this._widget.removeListener(o,this.__nh,this);this._widget.removeListener(s,this.__ni,this);this._widget.removeListener(z,this.__nj,this);if(this.__ng){this._widget.removeListenerById(this.__ng);}
;this._disposeObjects(B,k);this.__nd=this.__ne=this._widget=null;}
});}
)();
(function(){var a="dblclick",b="mshtml",c="engine.name",d="repeat",f="mousedown",g="disappear",h="appear",i="url(",j="mousewheel",k=")",l="mouseover",m="mouseout",n="qx.html.Blocker",o="mouseup",p="mousemove",q="div",r="contextmenu",s="click",t="qx/static/blank.gif",u="cursor",v="absolute";qx.Class.define(n,{extend:qx.html.Element,construct:function(y,w){var y=y?qx.theme.manager.Color.getInstance().resolve(y):null;var x={position:v,opacity:w||0,backgroundColor:y};if((qx.core.Environment.get(c)==b)){x.backgroundImage=i+qx.util.ResourceManager.getInstance().toUri(t)+k;x.backgroundRepeat=d;}
;qx.html.Element.call(this,q,x);this.addListener(f,this._stopPropagation,this);this.addListener(o,this._stopPropagation,this);this.addListener(s,this._stopPropagation,this);this.addListener(a,this._stopPropagation,this);this.addListener(p,this._stopPropagation,this);this.addListener(l,this._stopPropagation,this);this.addListener(m,this._stopPropagation,this);this.addListener(j,this._stopPropagation,this);this.addListener(r,this._stopPropagation,this);this.addListener(h,this.__np,this);this.addListener(g,this.__np,this);}
,members:{_stopPropagation:function(e){e.stopPropagation();}
,__np:function(){var z=this.getStyle(u);this.setStyle(u,null,true);this.setStyle(u,z,true);}
}});}
)();
(function(){var a="changeGlobalCursor",b="engine.name",c="keypress",d="Boolean",f="root",g="help",h="",i="contextmenu",j=" !important",k="input",l="_applyGlobalCursor",m="Space",n="_applyNativeHelp",o=";",p="event.help",q="qx.ui.root.Abstract",r="abstract",s="textarea",t="String",u="*";qx.Class.define(q,{type:r,extend:qx.ui.core.Widget,include:[qx.ui.core.MChildrenHandling,qx.ui.core.MBlocker,qx.ui.window.MDesktop],construct:function(){qx.ui.core.Widget.call(this);qx.ui.core.FocusHandler.getInstance().addRoot(this);qx.ui.core.queue.Visibility.add(this);this.initNativeHelp();this.addListener(c,this.__nr,this);}
,properties:{appearance:{refine:true,init:f},enabled:{refine:true,init:true},focusable:{refine:true,init:true},globalCursor:{check:t,nullable:true,themeable:true,apply:l,event:a},nativeContextMenu:{refine:true,init:false},nativeHelp:{check:d,init:false,apply:n}},members:{__nq:null,isRootWidget:function(){return true;}
,getLayout:function(){return this._getLayout();}
,_applyGlobalCursor:qx.core.Environment.select(b,{"mshtml":function(w,v){}
,"default":function(A,z){var y=qx.bom.Stylesheet;var x=this.__nq;if(!x){this.__nq=x=y.createElement();}
;y.removeAllRules(x);if(A){y.addRule(x,u,qx.bom.element.Cursor.compile(A).replace(o,h)+j);}
;}
}),_applyNativeContextMenu:function(C,B){if(C){this.removeListener(i,this._onNativeContextMenu,this,true);}
else {this.addListener(i,this._onNativeContextMenu,this,true);}
;}
,_onNativeContextMenu:function(e){if(e.getTarget().getNativeContextMenu()){return;}
;e.preventDefault();}
,__nr:function(e){if(e.getKeyIdentifier()!==m){return;}
;var E=e.getTarget();var D=qx.ui.core.FocusHandler.getInstance();if(!D.isFocused(E)){return;}
;var F=E.getContentElement().getNodeName();if(F===k||F===s){return;}
;e.preventDefault();}
,_applyNativeHelp:function(H,G){if(qx.core.Environment.get(p)){if(G===false){qx.bom.Event.removeNativeListener(document,g,(function(){return false;}
));}
;if(H===false){qx.bom.Event.addNativeListener(document,g,(function(){return false;}
));}
;}
;}
},destruct:function(){this.__nq=null;}
,defer:function(I,J){qx.ui.core.MChildrenHandling.remap(J);}
});}
)();
(function(){var a="resize",b="rgba(0,0,0,0)",c="paddingLeft",d="WebkitTapHighlightColor",f="qx.emulatemouse",g="engine.name",h="webkit",i="0px",j="The application could not be started due to a missing body tag in the HTML file!",k="$$widget",l="qx.ui.root.Application",m="event.touch",n="div",o="paddingTop",p="hidden",q="The root widget does not support 'left', or 'top' paddings!",r="100%",s="absolute";qx.Class.define(l,{extend:qx.ui.root.Abstract,construct:function(t){this.__cx=qx.dom.Node.getWindow(t);this.__ns=t;if(qx.core.Environment.get(m)&&qx.core.Environment.get(f)){if(t.body){t.body.style[d]=b;}
;}
;qx.ui.root.Abstract.call(this);qx.event.Registration.addListener(this.__cx,a,this._onResize,this);this._setLayout(new qx.ui.layout.Canvas());qx.ui.core.queue.Layout.add(this);qx.ui.core.FocusHandler.getInstance().connectTo(this);this.getContentElement().disableScrolling();}
,members:{__cx:null,__ns:null,_createContentElement:function(){var u=this.__ns;if((qx.core.Environment.get(g)==h)){if(!u.body){alert(j);}
;}
;var y=u.documentElement.style;var v=u.body.style;y.overflow=v.overflow=p;y.padding=y.margin=v.padding=v.margin=i;y.width=y.height=v.width=v.height=r;var x=u.createElement(n);u.body.appendChild(x);var w=new qx.html.Root(x);w.setStyles({"position":s,"overflowX":p,"overflowY":p});w.setAttribute(k,this.toHashCode());return w;}
,_onResize:function(e){qx.ui.core.queue.Layout.add(this);if(qx.ui.popup&&qx.ui.popup.Manager){qx.ui.popup.Manager.getInstance().hideAll();}
;if(qx.ui.menu&&qx.ui.menu.Manager){qx.ui.menu.Manager.getInstance().hideAll();}
;}
,_computeSizeHint:function(){var z=qx.bom.Viewport.getWidth(this.__cx);var A=qx.bom.Viewport.getHeight(this.__cx);return {minWidth:z,width:z,maxWidth:z,minHeight:A,height:A,maxHeight:A};}
,_applyPadding:function(C,B,name){if(C&&(name==o||name==c)){throw new Error(q);}
;qx.ui.root.Abstract.prototype._applyPadding.call(this,C,B,name);}
},destruct:function(){this.__cx=this.__ns=null;}
});}
)();
(function(){var a="qx.ui.layout.Canvas",b="number",c="Boolean";qx.Class.define(a,{extend:qx.ui.layout.Abstract,properties:{desktop:{check:c,init:false}},members:{verifyLayoutProperty:null,renderLayout:function(g,j,m){var s=this._getLayoutChildren();var d,u,r;var f,top,e,h,n,k;var q,p,t,o;for(var i=0,l=s.length;i<l;i++ ){d=s[i];u=d.getSizeHint();r=d.getLayoutProperties();q=d.getMarginTop();p=d.getMarginRight();t=d.getMarginBottom();o=d.getMarginLeft();f=r.left!=null?r.left:r.edge;if(qx.lang.Type.isString(f)){f=Math.round(parseFloat(f)*g/100);}
;e=r.right!=null?r.right:r.edge;if(qx.lang.Type.isString(e)){e=Math.round(parseFloat(e)*g/100);}
;top=r.top!=null?r.top:r.edge;if(qx.lang.Type.isString(top)){top=Math.round(parseFloat(top)*j/100);}
;h=r.bottom!=null?r.bottom:r.edge;if(qx.lang.Type.isString(h)){h=Math.round(parseFloat(h)*j/100);}
;if(f!=null&&e!=null){n=g-f-e-o-p;if(n<u.minWidth){n=u.minWidth;}
else if(n>u.maxWidth){n=u.maxWidth;}
;f+=o;}
else {n=r.width;if(n==null){n=u.width;}
else {n=Math.round(parseFloat(n)*g/100);if(n<u.minWidth){n=u.minWidth;}
else if(n>u.maxWidth){n=u.maxWidth;}
;}
;if(e!=null){f=g-n-e-p-o;}
else if(f==null){f=o;}
else {f+=o;}
;}
;if(top!=null&&h!=null){k=j-top-h-q-t;if(k<u.minHeight){k=u.minHeight;}
else if(k>u.maxHeight){k=u.maxHeight;}
;top+=q;}
else {k=r.height;if(k==null){k=u.height;}
else {k=Math.round(parseFloat(k)*j/100);if(k<u.minHeight){k=u.minHeight;}
else if(k>u.maxHeight){k=u.maxHeight;}
;}
;if(h!=null){top=j-k-h-t-q;}
else if(top==null){top=q;}
else {top+=q;}
;}
;f+=m.left;top+=m.top;d.renderLayout(f,top,n,k);}
;}
,_computeSizeHint:function(){var M=0,y=0;var J=0,I=0;var H,v;var E,C;var L=this._getLayoutChildren();var w,B,z;var K=this.isDesktop();var A,top,x,D;for(var i=0,l=L.length;i<l;i++ ){w=L[i];B=w.getLayoutProperties();z=w.getSizeHint();var G=w.getMarginLeft()+w.getMarginRight();var F=w.getMarginTop()+w.getMarginBottom();H=z.width+G;v=z.minWidth+G;A=B.left!=null?B.left:B.edge;if(A&&typeof A===b){H+=A;v+=A;}
;x=B.right!=null?B.right:B.edge;if(x&&typeof x===b){H+=x;v+=x;}
;M=Math.max(M,H);y=K?0:Math.max(y,v);E=z.height+F;C=z.minHeight+F;top=B.top!=null?B.top:B.edge;if(top&&typeof top===b){E+=top;C+=top;}
;D=B.bottom!=null?B.bottom:B.edge;if(D&&typeof D===b){E+=D;C+=D;}
;J=Math.max(J,E);I=K?0:Math.max(I,C);}
;return {width:M,minWidth:y,height:J,minHeight:I};}
}});}
)();
(function(){var a="qx.html.Root";qx.Class.define(a,{extend:qx.html.Element,construct:function(b){qx.html.Element.call(this);if(b!=null){this.useElement(b);}
;}
,members:{useElement:function(c){qx.html.Element.prototype.useElement.call(this,c);this.setRoot(true);qx.html.Element._modified[this.$$hash]=this;}
}});}
)();
(function(){var a="qx.dev.unit.TestLoader",b="__unknown_class__";qx.Class.define(a,{extend:qx.application.Standalone,include:[qx.dev.unit.MTestLoader],members:{main:function(){qx.application.Standalone.prototype.main.call(this);qx.log.appender.Console;var c=this._getClassNameFromUrl();if(c!==b){this.setTestNamespace(this._getClassNameFromUrl());}
;if(window.top.jsUnitTestSuite){this.runJsUnit();return;}
;if(window==window.top){this.runStandAlone();return;}
;}
}});}
)();
(function(){var a="testrunner.TestLoader";qx.Class.define(a,{extend:qx.dev.unit.TestLoader,statics:{getInstance:function(){return this.instance;}
},members:{main:function(){testrunner.TestLoader.instance=this;qx.dev.unit.TestLoader.prototype.main.call(this);}
}});}
)();
(function(){var c="This should never fail!",d="A rose by any other name is still a rose",e="Can false be true?!",f="unittesting.test.OriginalTest",g="You must be kidding, 3 can never be outside [1,10]!";qx.Class.define(f,{extend:qx.dev.unit.TestCase,members:{testSimple:function(){this.assertEquals(4,3+1,c);this.assertFalse(false,e);}
,testAdvanced:function(){var a=3;var b=a;this.assertIdentical(a,b,d);this.assertInRange(3,1,10,g);}
}});}
)();
(function(){var c="unittesting.test.DemoTest",d="This should never fail!",e="A rose by any other name is still a rose",f="Can false be true?!",g="You must be kidding, 3 can never be outside [1,10]!";qx.Class.define(c,{extend:qx.dev.unit.TestCase,members:{testSimple:function(){this.assertEquals(4,3+1,d);this.assertFalse(false,f);}
,testAdvanced:function(){var a=3;var b=a;this.assertIdentical(a,b,e);this.assertInRange(3,1,10,g);}
}});}
)();


qx.$$loader.init();

