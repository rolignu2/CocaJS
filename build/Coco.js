class Coco extends  CocaEvents
{
	
	/**
		Author 	: Rolando Arriaza <rolignu90@gmail.com>
		Version : 0.1.2
		Text    : Contructor de COCO instancia a COCA 
	**/
	constructor(){
		super();
		this.query_ 		= [];
		this.query_result	= [];
		this.cindex			= 0 ;
	}
	
	
	/**
		Author 		: Rolando Arriaza <rolignu90@gmail.com>
		Functions 	: query , Query , Q 
		Version 	: 0.1.2
		Text    	: instancia una llamada al query build esto tiene un impacto de diferentes ambitos 

				Example : 
						coca.Q("#som-id");    	//analiza en el document 
						coca.Q("<div></div>"); 	// crea un nuevo HTMLDOM 
						coca.Q(".class" , "!myclass"); //renombramos la instancia para utilizarla 
						let a = coca.Q("!myclass").result();
						let p = coca.result("!myclass");
						
						//	agregamos un HTMLDOM a una instancia de coca 
						//	si el objeto anteriormente ya fue invocado como se ve 
						//  entonces el aglrotimo no crea sino que analiza el nodo en la posicion que esta 
						//  luego de ver que posicion esta lo llama como posicion inicial 
						let m = coca.query("#my-id").result();
						coca.Q(m); 
	**/
	query($query , $rename = null ){return this._cmquery($query , $rename);}
	
	Query($query , $rename = null  ){return this._cmquery($query , $rename );}
	
	Q($query , $rename = null ) {return this._cmquery($query , $rename);} 
	
	/**
		Author 		: Rolando Arriaza <rolignu90@gmail.com>
		Functions 	: html 
		Version 	: 0.1.2
		Text    	: Busca algun nodo dentro del document o dentro de un objeto ya establecido 
		Params 		: String/Object/Array index  boolean pointer { if true = return this }
		Return 		: this/InnerHTML 
		Example 	: this.result().html() || this.result(this).text()
	**/
	
	result( index = null  , pointer = false ){
		
		try{

			 switch(typeof index){
				 case "string":
						for(let i in this.query_){
							if(this.query_[i].child === index){
								index = this.query_[i].index - 1;
							    break;
							}
						}
						break;
				case "number":
				case "object":
				default :
						if(index == 0 
								|| index == null 
								|| index == 'undefined'
						   ) 
								index = (this.cindex - 1);
						else 
								index = (index-1);
						break;
			 }
			 
			if(!pointer){
				
				if(typeof this.query_result[index] == 'undefined') 
					return this;
				
				let l = this.query_result[index].length;
				return this.query_result[index][l-1];
			}
					
			else 
					return this;
			
		}
		catch(e){
			this._error_control("INTERNAL ERROR" , e);
		}
		
		return this;
		
	}
	
	
	/**
		Author 		: Rolando Arriaza <rolignu90@gmail.com>
		Functions 	: find 
		Version 	: 0.1.2
		Text    	: Busca algun nodo dentro del document o dentro de un objeto ya establecido 
		Params 		: String/Object query  ;  String rename
		Return 		: this 
		Example 	: this.find("#id-test > div > p ")
	**/
	
	find( query = ""  , rename = null  ){
	
	try{

		 switch(typeof query ){
			 
			 case null:
			 case 'undefined':
					break;
			 default :
					this._cmquery(query , rename , "__FIND" );
					break;
		 }
		 
	}
	catch(e){
		this._error_control("NOT FOUND OR UNDEFINED" , e);
	}
		 
		 return this;
	}
	
	
	/**
		Author 		: Rolando Arriaza <rolignu90@gmail.com>
		Functions 	: each
		Version 	: 0.1.2
		Text    	: Each recorre iteraciones de un valor nodal o de un parametro tipo Object o Array 
		Params 		: Array param { Accept : object , array , nodeList  , function } 
		Return 		: iterableArray , iterableObject  , function ...
		Example 	: 
						this.each(SomeArray , function(value){  console.log(value); })
	**/
	
	each( ... param){
		
		let ap = [];
		switch(typeof param[0]){
			
			case 'function':
					let r = this.query_result[this.cindex -1].length;
					for(let i in this.query_result[this.cindex -1][r-1].children){
						
						 //eliminamos las funciones del nodo 
						 if(typeof this.query_result[this.cindex -1][r-1].children[i] == 'function')
							continue;
						
				        //eliminamos el lenght del nodo 
						if(typeof this.query_result[this.cindex -1][r-1].children[i] == 'number' && i === 'length' ) 
							continue;
						
						//	verificamos si la funcion tiene uno o dos parametros 
						// similar al map de jquery pero mejor :D
						if(param[0].length == 1){
							param[0](this.query_result[this.cindex -1][r-1].children[i]);
						}
						else if(param.length >= 2){
							param[0](i , this.query_result[this.cindex -1][r-1].children[i]);
						}
						
					}
					break;
			case 'object'  :
			case 'array'   :
					for(let k in param[0] ){
						
						if(param[1] !== 'undefined' && typeof param[1] == 'function'){
							switch(param[1].length){
							    case 1 :
									param[1](param[0][k]);
									break;
								case 2 :
									param[1](k ,  param[0][k]);
									break;
							}
						}
						else {
							ap.push({
								index : k ,
								data  : param[0][k]
							});
						}
					}
					break;
		}
		
		if(ap.length !== 0)
				return ap;
		
		return this;
		
	}
	
	
	
	
	/**
		Author 		: Rolando Arriaza <rolignu90@gmail.com>
		Functions 	: html 
		Version 	: 0.1.2
		Text    	: html , verifica la ultima instancia en el this.result() y devuelve o establece el html dentro 
		Return 		: this/innerHTML
	**/
	
	html( ...param  ){
		
		  let r = this.result();
		  try{
			if(param.length !== 0 && param[0] !== "" ){
				let p = "";
				for(let i in param){
				    if(typeof param[i] === 'string'){
						p += param[i];
					}
				}
				r.innerHTML = p;
			}
			else if(r !== this && r !== null && r !== 'undefined'){
				 return r.innerHTML;
			}
		  }
		  catch(e){
			  this._error_control("NODE NOT FOUND OR INNERHTML NOT PROCCESS" , e);
		  }
		
		 return this;
	}
	
	
	/**
		Author 		: Rolando Arriaza <rolignu90@gmail.com>
		Functions 	: text
		Version 	: 0.1.2
		Text    	: text , verifica la ultima instancia en el this.html() 
		Return 		: String 
	**/
	
	text (param = ''){
		return String(this.html(param));
	}
	
	
	/**
		Author 		: Rolando Arriaza <rolignu90@gmail.com>
		Functions 	: arrayMap
		Version 	: 0.1.1
		Text    	: esta funcion solo manipula objetos y arreglos , no Nodelist 
		Return 		: function / this 
	**/
	arrayMap($object , $function){
		try{
			var $map = new Map($object);
			for (var [key, value] of $map) {
					$function( key  , value );
			}
		}catch(e){
			 this._error_control("ARRAY MAP HAS A PROBLEM WITH LOGIC ITERATION" , e);
		}
		return this;
	}
	
	/**
		Author 		: Rolando Arriaza <rolignu90@gmail.com>
		Functions 	: css
		Version 	: 0.1.1
		Text    	: obtiene o establece una notacion de cascada  
		Return 		:  string / this 
	**/
	
	css( $name , $val  = null  ){
		
		if(typeof ($name) == 'string')
			return this.setCss($name , $val );
		
		if(typeof ($name) == 'object')
			for(let i in $name ){
				this.setCss( i , $name[i] );
			}
			
		
		return this;
	}
	
	/**
		Author 		: Rolando Arriaza <rolignu90@gmail.com>
		Functions 	: getAttr
		Version 	: 0.1.1
		Text    	:  une get / set en una sola funcion ademas no se limita a crear u obtener un objeto 
		Return 		:  mixed
		Examples    :  
		
						coca.Q("#mynode").find("#testA").find("p").attr(["style" , "id"]);  -- Obtiene una lista de objetos de los atributos indicados style e id 
						coca.Q("#mynode").find("#testA").find("p").attr("style"); 			-- obtiene un string del atributo 
						coca.Q("#mynode").find("#testA").find("p").attr([ { style : 'color:red;'} , {  id : 'new-id'} ]);  -- establece nuevos parametros a los atributos  
	**/
	
	attr( $name , $val = null , pivot = []){
	
		switch(typeof $name){
			
			case "string":
				 if($val == null )
						return this.getAttr($name);
				 else 
						this.setAttr($name , $val );
				break;
			case "object":
			case "array" : 
					for(let i in $name ){
						if(typeof $name[i] === 'object'){
							let l = Object.keys($name[i])[0];
							this.setAttr(l , $name[i][l]);
						}else if(typeof $name[i] == 'string'){
							let n = {} ;
							n[$name[i]] = this.attr($name[i]);
							pivot.push(n);
						}
					}
					
					if(pivot.length !== 0) return pivot;
				break;
			
		}
		
		return this;
		
	}
	
	/**
		Author 		: Rolando Arriaza <rolignu90@gmail.com>
		Functions 	: getAttr
		Version 	: 0.1.1
		Text    	: obtiene un atributo en especifico , ver funcion attr 
		Return 		:  string / this [on error ]
	**/
	
	getAttr($name){
		try{
			let l = this.query_result[this.cindex - 1 ].length - 1 ;
			return this.query_result[this.cindex - 1 ][l].getAttribute($name);
		}catch(e){
			this._error_control("ERROR getAttr " ,e);
			return this;
		}
	}
	
	
	/**
		Author 		: Rolando Arriaza <rolignu90@gmail.com>
		Functions 	: setAttr
		Version 	: 0.1.1
		Text    	:  establece un atributo especifico en el element
		Return 		:  this 
	**/
	
	setAttr($name , $val ){
		try{
			let l = this.query_result[this.cindex - 1 ].length - 1 ;
			this.query_result[this.cindex - 1 ][l].setAttribute($name , $val);
		}catch(e){
			this._error_control("CRITICAL" ,e);
		}
		return this;
	}
	
	/**
		Author 		: Rolando Arriaza <rolignu90@gmail.com>
		Functions 	: setCss
		Version 	: 0.1.1
		Text    	: algoritmo de establecimiento CSS en cual crea los parametros suficientes para el ATTR
		Return 		:  string / this 
	**/
	
	setCss( $name , $val   ){
		
		 if(typeof ($name) == 'object' )
			  return this.css($name);
		  
		 let $element = this.getAttr("style");
		 
		 if($element == '' || $element == null )
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
	
	
	/**
		Author 		: Rolando Arriaza <rolignu90@gmail.com>
		Functions 	: setVal 
		Version 	: 0.1.2
		Text    	: similar a text o html pero con un piquete condicional 
		Return 		: this 
	**/
	setVal($val){
		if($val == null || $val == 'IsNaN'  || $val == 'undefined' )
			$val = '';
		return this.html($val);
	}
	
	
	
	/**
		Author 		: Rolando Arriaza <rolignu90@gmail.com>
		Functions 	: _cmdquery
		Version 	: 0.1.2
		Text    	: Algoritmo de analisis nodal y sintactico  (ver coca.Query)
		return 		: Object
	**/
	_cmquery($query , $rename , channel = null  ){
		
		 let error = false ;
		 let cmd   = false ;
		 
		 try {
			 
				switch(typeof $query){
				 
					case 'object':
							/***
							
							
								El algoritmo debe de analizar antes el objeto que se introduce 
								como es un objeto en si necesitamos un algoritmo de analisis nodal 
								y verificar si ese objeto esta ya instanciado en el arreglo principal 
								
								si el algoritmo identifica el nodo que ya esta en uso (dentro de query_result)
								
							***/
							let Cn = $query.childNodes;
							let target = -1 ;
							let qa 	   = false ;
							for(let j = this.cindex ; j > 0  ; j--){
								 let s ;
								 for(let p in  this.query_result[j]){
									 s = this.query_result[j][p];
									 if(s.childNodes.length == Cn.length){
										let gh = (node1 , node2  , index)=> {
											index++;
											if(index > node2.length) return true;
											if(node1[index] == node2[index]) 
													return gh(node1 , node2 , index)
											else return false;
										};
										let d = gh(s.childNodes , Cn , -1 );
										if(d === true ){
											target = j;
											qa = true ;
											break;
										}else qa = false;
									 }
								 }
								 
								 if(qa === true ) break;
							}
							if(target === -1 ){
								 this.query_result.push([$query]);
							}
							else {
								 this.cindex = (target + 1);
								 cmd = true ;
							}
							break;
					case 'array' :
							this.query_result.push($query);
							break;
					default : 
							try{
							
								/**
									coca es capaz de identificar nombres personalizados 
									o id´s ya utilizados , para asi volver a reutilizar el codigo
									y evitar una carga mas de memoria en peticion de resultados
								**/
								
								let k = this._ViewRename($query , this.cindex);
								
							
								//coca devuelve un objeto query y target 
								if(k.query !== null  && k.target !== 0){
									//si existen entonces el index pasa a ser el principal 
									cmd = true ;
									this.cindex = k.target;
									break;
								}
								
							
								//m busca en el document
								let m = document.querySelectorAll($query);
								
								//	si no devuelve nada posiblemente debemos de buscar en los nodos 
								//	la onda es econtrarlo en el ultimo indexado para evitar una carga mayor 
								
								if(channel !== null ){
									
									//Busqueda de canal en cual se esta llamando , 
									// tiene una mejor optimizacion en uso de recursos 
									switch(channel){
										
										case "__FIND" : 
										
											let bq = this.query_[this.cindex - 1].query;
											let rq = document.querySelectorAll(bq + " > " + $query);
										
											if(rq.length !== 0){
												
												$query = bq  + " > " + $query;
												this.query_result.push(rq);
											}
											else return this ;
										
											break;

									}
									
								}
								else{
									
									if(m.length == 0 ){
									 let u = this.query_result[this.cindex - 1].length - 1;
									 let r = this.query_result[this.cindex - 1 ][u];
									 this.query_result.push(r.querySelectorAll($query));
									 
									}else{
									 
										//si es un resultado del document entonces se agrega al arreglo 
										this.query_result.push(m);
									}
								}
								
								
								
						}catch(n){
								
							if(typeof $query === 'string'){
								let p = new DOMParser();
								let r = p.parseFromString($query, "text/xml");
								this.query_result.push(r.childNodes);
							}
						}
						break;
				 
			 }
	
			
			if(!cmd){
				
				if($rename !== null ){
						for(let i in this.query_){
								if(this.query_.child ==  $rename){
									$rename = ($rename + String(this.cindex));
										break;
								}
						}
				}
		
				this._AddIndex();
	
				this.query_.push({
						index 	: this.cindex ,
						query 	: $query,
						error 	: error, 
						child  : $rename != null ? $rename : ("?child" + this.cindex ) 
				});
				
			
			}
				
			
		 }catch(e){
			 this._error_control("NOT VALID" , e)
			 error = true;
		 }
		 

	
		
		
		return  Object.create(
					Object.getPrototypeOf(this), 
					Object.getOwnPropertyDescriptors(this) 
				);
	}
	
	
	/**
		Author 		: Rolando Arriaza <rolignu90@gmail.com>
		Functions 	: _AddIndex 
		Version 	: 0.1.2
		Text    	: incrementa el indexado del algoritmo nodal 
	**/
	_AddIndex(){ this.cindex++ ;}
	
	
	
	
	
	/**
		Author 		: Rolando Arriaza <rolignu90@gmail.com>
		Functions 	: _ViewRename
		Version 	: 0.1.2
		Text    	: analiza sintactica de los nodos ya creados 
		Return 		: {
							target : 0,  	//	posicion del nodo 
							query  : null 	//  query que se utilizo para instanciarlo 
					   }
	**/
	_ViewRename($string , index = 1){
 
		
		if(index == 0 ) return {
			 target : 0,
			 query  : null 
		}
	  
	  
        let p = false ;
	    let c = String($string).localeCompare(this.query_[index - 1].query);
		
		if(c === 0){
			if(String($string).substr(0,1) == "#"){
				p = true ;
			}
		}
		
		if(	String($string).localeCompare(this.query_[index - 1].child) == 0 || p == true  ){
			return {
					target : this.query_[index - 1].index,
					query  : this.query_[index -1].query
			};
		}

		else{
			return this._ViewRename($string , (index - 1 ));
		}
		
		
		return {
			 target : 0,
			 query  : null 
		}
			
	}

	
}


