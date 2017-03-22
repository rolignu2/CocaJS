class Coco extends  CocaEvents
{
	constructor(){
		super();
		this.query_ 		= "";
		this.query_result	= null;
		this.childs_result  = null ;
		
	}
	
	query($query){return this._cmquery($query) ;}
	
	Query($query){return this._cmquery($query);}
	
	$($node ){ return this.node($node);}
	
	node( $node){
		this.query_result = Array($node);
		return this;
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
	
	inverseEach($array_object = null  , $function  ){
		
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
			 for(var i = k ; i >= 0  ; i--){
				 if(typeof _arr[i] == 'function')
					  continue;
				  
				
				  if(typeof _arr[i] == 'number' && i === 'length' ) 
					  continue;
				  
					 
				  $function( i , _arr[i] );
			 }
		 }
		 
		 return this;
	}
	
	
	arrayMap($object , $function){
		var $map = new Map($object);
		for (var [key, value] of $map) {
				$function( key  , value );
		}
		
		return this;
	}
	
	
	children( $element ){
		this.childs_result = this.result()[0].querySelectorAll($element);
		return this;
	}
	
	
	all_childs( $function ){
		
		let __k = Array();
		if(typeof ($function) !== 'function'){
			
			this.each(this.childs_result , (a,b)=>{
				__k.push(b);
			});
		
			return __k;
		}
		else {
			this.each(this.childs_result , (a,b)=>{
					$function(a,b);
			});
		}
		
		return this;
	}
	
	
	myChild( $index ){
		 try{
			return this.childs_result[$index] ;
		 }catch(e){
			 return null ;
		 }
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
	
	exist(){
		let __q = this.query_result;
		if(__q.length === 0 ) return false;
		else return true ;
	}
	
	getAttr($name ){
		try{
			return this.query_result[0].getAttribute($name);
		}catch(e){
			this._error_control("CRITICAL" ,e);
			return this;
		}
	}
	
	
	setAttr($name , $val )
	{
		try{
			this.query_result[0].setAttribute($name , $val);
		}catch(e){
			this._error_control("CRITICAL" ,e);
		}
		
		return this;
	}
	
	
	attr( $name , $val = null )
	{
		if(typeof ($name) == 'string')
			return this.setAttr($name , $val );
		
		if(typeof ($name) !== 'object')
			return this;
		
		for( let i in $name  ){
			this.setAttr( i , $name[i] );
		}
		
		return this;
		
	}
	

	existAttr( $name  )
	{
		let __a = this.getAttr($name);
		if( __a == '' || __a == 'undefined' || __a == null  )
			return false;
		else 
			return true;
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

