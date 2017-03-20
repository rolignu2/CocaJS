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