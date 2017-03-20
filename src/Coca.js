'use strict';

class CocaAsync {
	
	constructor(){
		this.queue 				= [];
		this.options = {
			contentType 	: 'application/x-www-form-urlencoded; charset=UTF-8',
			crossDomain     : false ,
			dataType		: 'html',
			method 			: "GET"
		};
		this.point 			= null;
		this.succes_wait	= null;
		this.error_wait 	= null;
		
	}
	
	prepare () { return this;}
	
	contentType($t) { 
		this.options.contentType = $t ;
		return this;
	}
	
	converters($t){
		this.options.converters = $t;
		return this;
	}
	
	crossDomain($t){
		this.options.crossDomain = $t;
		return this;
	}
	
	dataType($j = null ){
		if($j == null ) return this;
		this.options.dataType = $j ;
		return this;
	}
	
	headers($h){
		this.options.headers = $h;
		return this;
	}
	
	json(){return this.dataType("json");}
	
	html(){return this.dataType("html");}
	
	xml(){return this.dataType("xml");}
	
	text() { return this.dataType("text"); }
	
	
	Ajax ( $operation = {}  , $url = "" , $objects = {} ,  $wait = null , $success = null , $error = null){
		return this.init($operation , $url , $objects , $wait , $success , $error);
	}
	
	ajax( $operation = {}  , $url = "" , $objects = {} ,  $wait = null , $success = null , $error = null){
		return this.init($operation , $url , $objects , $wait , $success , $error);
	}
	
	$$( $operation = {}  , $url = "" , $objects = {} ,  $wait = null , $success = null , $error = null){
		return this.init($operation , $url , $objects , $wait , $success , $error);
	}
	
	ShowErrors (){
		return this.errors;
	}
	
	ShowProcess(){
		return this.queue ;
	}
	
	success( $func ){
		if(typeof $func == 'function')
			this.succes_wait = $func;
		else 
			this.succes_wait = null;
		return this;
	}
	
	error ($func){
		if(typeof $func == 'function')
			this.error_wait = $func;
		else 
			this.error_wait = null;
		return this;
	}
	
	response(){
		return this.queue[this.point].response;
	}
	
	alive(){
		return this.queue[this.point].response;
	}
	
	init( $operation = {}  , $url = "" , $objects = "" ,  $wait = null , $success = null , $error = null )
	{
		
		let optype 			= typeof $operation;
		var $flags			= {
				 object 		: true , 
				 wait   		: true , 
				 success 		: true , 
				 error  		: true 
			};
		
		try{
			
			let $i  			= this._pRequest();
			this.point 			= $i;
			

			switch(optype)
			{
				case 'function' :
					$operation = $operation();
					$url =  $operation.url !== 'undefined' ? $operation.url : $url;
					$objects = $operation.data;
					$wait   = $operation.wait;	
					$success = $operation.success ;
					$error = $operation.error ; 
					break;
				case 'object' :
					$url =  $operation.url !== 'undefined' ? $operation.url : $url;
					$objects = $operation.data;
					$wait   = $operation.wait;	
					$success = $operation.success ;
					$error = $operation.error ; 
					break;
				case null  		 :
				case 'undefined' :
				case isNaN 		 : 
				case '' 		 :
				case ""			 : 
						// HELLO ITS ME :) 
						break;
			}
			
			
			
			if($url == "" || typeof $url == 'undefined') {
						
					this.errors.push({
							 id 		:  Math.floor((Math.random() * 555555) + 1),
							 cause 		: "url isNaN or Empty",
							 process	: $i
					});
						
					this._kRequest($i);
					return this;
			}
					
			
			if($operation.method != 'undefined' &&  $operation.method != null )
							this.options.method = $operation.method;
			else 
							this.options.method = "GET";
						
			if(typeof $objects == 'undefined')
							$flags.object = false ;
			if(typeof $wait == 'undefined')
							$flags.wait = false;
			if(typeof $success == 'undefined')
							$flags.success = false;
			if(typeof $error == 'undefined')
						    $flags.error = false;
		
			
			let $p_ = '' ;
			if(typeof $objects == 'object')
				$p_ = this._parserObj($objects);
			
			
			$url += $p_;
			
			var $this = this;
			this.queue[$i.index].request.onreadystatechange = function() {
				if ($this.queue[$i.index].request.readyState === XMLHttpRequest.DONE) {
					let response = $this.queue[$i.index].request.responseText;
					switch($this.queue[$i.index].request.status){
						case 200:
						
							if($this.options.dataType == 'json' 
									|| $this.options.dataType == 'JSON'
									|| $this.options.dataType == 'Json'
							)
							{
								try{
									response = JSON.parse(response);
								}catch(e){
									$this.errors.push({
											id 		:  Math.floor((Math.random() * 555555) + 1),
											cause 		: e,
											process	: 'JSON'
									});
								}
							}
						
							if( $flags.success == true ){
								$success(response);
								$this.queue[$i.index].success = $success;
							}
							else if($this.succes_wait !== null ){
								$this.succes_wait(response);
								$this.queue[$i.index].success = $this.succes_wait;
							}
							
							$this.queue[$i.index].response = response;
							break;
						case 500 :
						case 501 :
						case 502 :
						case 504 :
						case 508 :
						case 509 :
						case 404 :
						case 400 :
						case 402 :
						case 403 : 
						case 406 :
						case 407 : 
						case 408 :
						case 410 :
						case 429 :
							if( $flags.error == true ){
								$error(response);
								$this.queue[$i.index].error = $error;
							}
							else if($this.error_wait !== null ){
								$this.error_wait(response);
								$this.queue[$i.index].error = $this.error_wait;
							}
							$this.queue[$i.index].response = response;
							break;
					}
					
					$this.queue[$i.index].alive = false;
				}
				else if ($this.queue[$i.index].request.readyState === XMLHttpRequest.LOADING)
				{
					 if($flags.wait)
						 $wait();
				}
			};
			
			
			this.queue[$i.index].request.open(this.options.method , $url , true  );
			try{
				
				
				if(typeof this.options.crossDomain == 'boolean' && this.options.crossDomain == true  )
						this.queue[$i.index].request.setRequestHeader('Access-Control-Allow-Origin', '*');
				else if(typeof this.options.crossDomain == 'string' )
						this.queue[$i.index].request.setRequestHeader('Access-Control-Allow-Origin',this.options.crossDomain );
				
				
				this.queue[$i.index].request.setRequestHeader('Content-Type' , this.options.contentType);
				
				this.queue[$i.index].request.send();
			}
			catch(e){
				
				 this.errors.push({
							 id 		: Math.floor((Math.random() * 555555) + 1),
							 cause 		: e,
							 process	: "XHTML ERROR TO SEND "
				});
				
				if($flags.error)
					$error(e);
			}
			
			
			
		}
		catch(e){
			this.errors.push({
							 id 		:  Math.floor((Math.random() * 555555) + 1),
							 cause 		: e,
							 process	: optype
					});
		}
		
		
		
		return this;
	}

	_parserObj($object)
	{
		let a = "?";
		let k = Object.keys($object).length;
		let i = 0;
		for( let obj in $object )
		{
			i++;
			a += (obj + "=" + $object[obj] );
			if(i !== k) a += "&";
			
		}
		
		return a;
	}
	
	_pRequest ()
	{
		this.queue.push( {
			 request  : new XMLHttpRequest() , 
			 alive    : true , 
			 id       : (this.queue.length + 1),
			 success  : function(){},
			 error    : function(){},
			 type     : "",
			 method   : "GET",
			 response : null 
		});
		
		return  {
			index :  (this.queue.length - 1) ,
			id    :  (this.queue[this.queue.length - 1].id)
		} ;
	}
	
	_gRequest( $obj = null , $id = null  )
	{
		
		try{
			if($obj !== null ){
				return this.queue[$obj];
			}
		
			for( let q in this.queue  )
			{
				if(q.id ===  $id  )
					return q;
			}
		}
		catch(e){
			console.log(e);
		}
		
		return null;
	}
	
	_kRequest ($process )
	{
		 try{
			if(typeof $process == 'object'){
				delete this.queue[$process.index] ;
				return true ;
			}
			else {
				for(let i = 0 ;  i < this.queue.length ; i++){
					if(this.queue[i].id == $process &&  i !== id )
					{
						delete this.queue[i];
						break;
					}						
				}
				
				return true;
			}
		 }
		 catch(e){
			 this.errors.push({
							 id 		: Math.floor((Math.random() * 555555) + 1),
							 cause 		: e,
							 process	: null
			 });
		 }
		 
		 return false;
		
	}
	
	
	
}

class Coco extends CocaAsync
{
	constructor(){
		super();
		this.query_ 		= "";
		this.query_result	= null;
	}
	
	query($query){return this._cmquery($query) ;}
	
	Query($query){return this._cmquery($query);}
	
	node( $node){
		this.query_result = Array($node);
		return this;
	}
	
	$($node ){
	   return this.node($node);
	}
	
	each ( $array_object = null  , $function   ){
		
		 
		 if(typeof $array_object === 'function'){
			 $function = $array_object;
			 $array_object = null ;
		 }
				
		 if(typeof $function !== 'function')
			 return this;
		 
		 let _arr = $array_object ;
		 if(_arr == null )
				_arr = this.query_result;
			
		
		 if(		typeof _arr == 'Array' 
			|| 		typeof _arr == 'array'
			|| 		typeof _arr == 'object'
		 ) {
			
			 let k = _arr.length;
			 for(let i in _arr){
				  
				  if(typeof _arr[i] == 'function')
					  continue;
				  
				
				  if(typeof _arr[i] == 'number' && i === 'length' ) 
					  continue;
				  
					 
				  $function( i , _arr[i] );
			 }
		 }
		 
		 return this;
	}
	
	
	
	
	html ($val = 'undefined' )
	{

		let i = 0;
		if( (typeof $val === 'string' || typeof $val === 'number') && $val != 'undefined'){
		
				if(
							this.query_result[i].innerHTML == null 
						||  this.query_result[i].innerHTML == ''
						||  this.query_result[i].innerHTML == 'undefined'
				)
					this.query_result[i].value = $val ;
				else 
					this.query_result[i].innerHTML = $val;
		}	
		else {
			
			if(
						this.query_result[i].innerHTML == null 
					||  this.query_result[i].innerHTML == ''
					||  this.query_result[i].innerHTML == 'undefined'
			){
				return this.query_result[i].value;
			}
			else 
				return this.query_result[i].innerHTML;
		}
			
		return this.query_result[0];
	
	}
	
	getVal(){
		return this.html();
	}
	
	setVal($val){
		if($val == null || $val == 'IsNaN'  )
			$val = 'undefined';
		return this.html($val);
	}
	
	append( $val  ){
		
		let $html = this.html();
		if($html == '' || $html == 'undefined' || $html == null ){
			this.html($val);
			return this;
		}
		
		this.html( $html + $val );
		
		return this;
	}
	
	prepend( $val ){
		let $html = this.html();
		let i = 0 ;
		
		
		if($html == '' || $html == 'undefined' || $html == null ){
			this.html($val);
			return this;
		}
		
		if(		this.query_result[i].innerHTML == null 
						||  this.query_result[i].innerHTML == ''
						||  this.query_result[i].innerHTML == 'undefined'
		   )
		     this.query_result[i].value = $val + $html ;
	     else 
			 this.query_result[i].innerHTML = $val + $html;
		 
		 return this;
	}
	
	
	result(){
		return this.query_result;
	}
	
	css( $name , $val  = null  ){
		
		if(typeof ($name) == 'string')
			return this.setCss($name , $val );
		
		if(typeof ($name) !== 'object')
			return this;
		
		
		
		for(let i in $name ){
			this.setCss( i , $name[i] );
		}
		
		return this;
		
	}
	
	setCss( $name , $val   ){
		
	
		 if(typeof ($name) == 'object' )
			  return this.css($name);
		 
		 let $element = this.getAttr("style");
		 
		 if($element == '')
			 this.setAttr("style" , $name + ":" + $val + ";" );
		 else{
			 
			 
			 let split = String($element).split(";");
			 let __r   = "";
			 let __e   = true ;
			 
			 for(let i in split ){
				 
				 switch(split[i] ){
					 case '' :
					 case "" :
					 case "undefined" :
					 case null :
							continue;
							break;
				 }
				 
				let __p = String(split[i]).split(":");
				if(__p.length <= 0 )
						continue;
				
				if( String(__p[0]).trim() === $name.trim() ){
					 __r += $name + ":" + $val + ";" ;
					 __e = false;
				}
				else {
					__r += split[i] + ";"
				}
				 
			 }
			 
			 if(__e){
				 __r += $name + ":" + $val + ";";
			 }
			 
		
			 this.setAttr("style" , __r);
		 }
		 
		 return this;
	}
	
	getId(){
		return this.query_result[0].getAttribute("id");
	}
	
	getName(){
		return this.query_result[0].getAttribute("name");
	}
	
	getAttr($name ){
		return this.query_result[0].getAttribute($name);
	}
	
	
	setAttr($name , $val )
	{
		this.query_result[0].setAttribute($name , $val);
		return this;
	}
	
	removeAttr($name)
	{
		this.query_result[0].removeAttribute($name);
		return this;
	}
	
	_cmquery($query ){
		 this.query_ = $query ;
		 this.query_result = document.querySelectorAll($query);
		 return this;
	}
	
}

class CocaJS extends Coco{
	
	constructor(){
		super();
		this.errors 			= [];
		this.o 					= {};
		this.version			= "0.1.0";
	}
	
	version() { return this.version ;} 
	
	extend ()
	{
		
		var extended = {};
		var deep = false;
		var i = 0;
		var length = arguments.length;

		if ( Object.prototype.toString.call( arguments[0] ) === '[object Boolean]' ) {
			deep = arguments[0];
			i++;
		}

		var merge = function (obj) {
			for ( var prop in obj ) {
            if ( Object.prototype.hasOwnProperty.call( obj, prop ) ) {
                if ( deep && Object.prototype.toString.call(obj[prop]) === '[object Object]' ) {
                    extended[prop] = extend( true, extended[prop], obj[prop] );
                } else {
                    extended[prop] = obj[prop];
					}
				}
			}
		};

		for ( ; i < length; i++ ) {
			var obj = arguments[i];
			merge(obj);
		}

		this.o =  Object.create(extended);
		
	}
	
	
	Ready (callback) {
		var ready = false;

		var detach = function() {
			if(document.addEventListener) {
				document.removeEventListener("DOMContentLoaded", completed);
				window.removeEventListener("load", completed);
			} else {
				document.detachEvent("onreadystatechange", completed);
				window.detachEvent("onload", completed);
			}
		}
		var completed = function() {
			if(!ready && (document.addEventListener || event.type === "load" || document.readyState === "complete")) {
				ready = true;
				detach();
				callback();
			}
		};

		if(document.readyState === "complete") {
				callback();
		} else if(document.addEventListener) {
				document.addEventListener("DOMContentLoaded", completed);
				window.addEventListener("load", completed);
		} else {
			
			document.attachEvent("onreadystatechange", completed);
			window.attachEvent("onload", completed);

        var top = false;

			try {
				top = window.frameElement == null && document.documentElement;
			} catch(e) {}

			if(top && top.doScroll) {
				(function scrollCheck() {
					if(ready) return;

					try {
						top.doScroll("left");
					} catch(e) {
						return setTimeout(scrollCheck, 50);
					}

					ready = true;
					detach();
					callback();
            })();
		}
		}
	}
	
	
	ready(callback)
	{
		this.Ready(callback);
	}
	
	
	
}


/***INSTANCIA PADRE DE COCAJS ***/
var coca = new CocaJS();
var Coca = coca;

/***ASIGNACIONES DE COCAJS ***/
if( typeof ($C) === 'undefined'){
	
	var $C  = ( $element )=>{
		 let __c =  new CocaJS();
		 if(typeof ($element) == 'string'){
			 __c.query($element);
			 return __c;
		 }
		 return __c.node($element);
	};
	
	
	if(typeof ($c) === 'undefined'  ){
		var $c = ($element) => {
			 return $($element);
		}
	}
	
};

/**ASIGNACION SI NO EXISTE JQUERY **/
if( typeof ($) === "undefined" ) {

	var $ = ($element)=>{
		 return $($element);
	}
	
}