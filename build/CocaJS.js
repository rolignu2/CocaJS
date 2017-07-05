class CocaJS extends CocaPlus{
	
	constructor(){
		super();
		this.errors 			= [];
		this.o 					= {};
		this.version			= "0.1.1";
		this.__test			    = false ;
	}
	
	version() { return this.version ;} 
	
	testMode($a = true ){this.__test = $a ;  return this; }
	
	setTest(){
		 this.testMode(true);
		 return this;
	}
	
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
	
	
	
	Errors($index){
		if(typeof $index == 'undefined')
			return this.errors;
		else 
			return this.errors[$index];
	}
	
	getError(   console = false ){
		if(console)
		   console.log(this.Errors());
	    else 
			return this.Errors();
	}

	
	_error_control( type , err ){
		
		  if(typeof err.message != 'undefined'){
			   this.errors.push({
					message : err.message ,
					type    : type ,
					file    : err.fileName,
					stack   : err.stack 
				});
		  }
		  else if (typeof err == 'string'){
			   this.errors.push({
					message : err ,
					type    : type ,
					file    : '...',
					stack   : '...'
				});
		  }
		
		 
		 if(this.__test){
			 console.log(this.errors[this.errors.length - 1 ]);
		 }else{
			 console.log( "You have one or more errors in the stack ( console.log(coca.getError()) to view the error ) [STACK][" + (this.errors.length)  + "]" );
		 }
		 
		 
		 
	}
	

}
