# CocaJS

  Version 0.1.2 (Alpha)

``` Escrita con VanillaJS; CocaJS pretende ser mas rapida que JQUERY pero no pretende destronarla como el mejor Framework o el mas usado ``` : i'm in love with the coco

## Como se usa : 
  
  ``` Antes que nada CocaJS se esta desarrollando a pequeños pasos pero solidos asi que carece de muchas funciones Que nos obliga a coexistir con JQUERY ```
  
  
  Descargate el repositorio y a continuacion "Busca" Coca.js y una vez que guardes ese script 
  en donde desee tu corazon, mandalo a llamar de esta forma. [OJO ! no esta minificado porque esta en prueba]

```
    <script src="../Aguna-ruta/Coca.js" type="text/javascript" ></script>
```

  Vamos bien.
  
  ## Usando Coca cuando el documento este listo 
### VanillaJS
```js

    /*
      Coca se instancia sola con los nombres de variables 
      "coca" , "Coca" o "$" si no existe jquery instanciado
      
      Digamos que existe JQUERY ... utilizaremos "coca"
      
    */
    
    //igual pero mas rapido que $(document).ready(function(){});
    
    coca.ready(() => {
      //documento listo para usar ...  ES6 
    });
    
    coca.ready(function() {
      //documento listo para usar ... ES5
    });
    
  
```

   ## Coca Asincrona (Goobye $.ajax )
   
      ##Coca genera una peticion asincrona mucho mas rapida gracias a vanillaJS 
     
``` Cuando se diseño coca async se penso en muchas formas de llamarlo o de utilizarlo ```
``` Coca async tiene como parametros definidos un objeto , funcion o parametros estandares ```
      
      Si coca se trabaja con parametros definidos por un objeto ten encuenta estos datos 
     
 ```js
         {
            url   : "La url obvio",
            data  : {}, //objeto datos parametros a la url 
            succces : function(xhr){}, //optional
            wait : function(){},       //opcional
            error : function(xhr){},   //opcional
         }
  ```
      
 ```js
    
     /**
        Continuando con la variable "coca" aprenderemos como 
        hacer un apeticion asincrona (AJAX) de multiples formas 
     **/
     
     //Primera forma 
     // $$ --> metodo  |  {  url : "" , data : "" } --> parametros 
     
     coca.$$(function(){
	
        //una funcion que haga algo antes de enviar la peticion 
	        
	      return {
		        url 		: "https://httpbin.org/get",
		        data 		: {
			          format : "json"
		        }
	     };
	
    }).success(function(response){
	        console.log(response);
    });
    
    
   var object =  {
            url   : "La url obvio",
            data  : {}, //objeto datos parametros a la url 
            succces : function(xhr){}, //optional
            wait : function(){},       //opcional
            error : function(xhr){},   //opcional
     }
    
    //otra forma de llamar a la coca async
    coca.ajax(object);
    
    //Andas de fino y buena ortografia , tranquilo aca tenemos la solucion 
    Coca.Ajax(object);
    
    //La pereza gana tranquilo como un ejemplo anterior 
    coca.$$(object);
    
    //Soy super programador senior amante de angularJS , tranquilo aca tenemos tu async 
    var wait      = function() {};
    var success   = function(xhr) {};
    var error     = function(xhr){};
    coca.Ajax(null , "http://holamundo.com/" , { param : "Holiss" } , wait , success , error);
    
    //Metamosle paja 
    
    coca.prepare()
    		.dataType()
		.contentType('algun content type')
		.json();

     coca.$$(object);	
	
   
 ```
 
  ## CocaJS manipulacion del DOM 
  
    La manipulacion se hace casi que igual a jquery solo que este es mas rapido.
    Tenemos este ejemplo : 
    
 ```html
   
   	<body>
	
		<div>
 		<p> Algun texto sin sentido ....</p>
		</div>
   
		<div style="font-size:1.5em;background:red;" id="meta_test"></div>
		<input type="hidden" id="test_" value="soy un valor escondido :) " />

	</body>
 ```
  
 ```js
   
      coca.ready(()=>{
      
         /**
	     vamos a buscar todos los divs , 
	     a esos divs le cambiaremos el html por Prueba X,Y,Z 
	     de ahi buscaremos el div con el id "meta_test"
	     y le haremos cambios de css ... mamado va
	 **/
      
         	coca.query("div").each( function(a,b){
	
		  	$C(b).html("Prueba X,Y,Z");
		 	 if($C(b).getId() === 'meta_test')
		 	 {
				 $C(b).css({
					 "background" : "blue",
					 "color"	  : "white !important",
					 "font-size"  : "2em",
					 "border"     : "6px solid red "
 			 	});
		 	  }  
		});
      
      });
      
      
      /***HAGAMOS APPENDS Y PREPEND  PERO ANTES UN HTML ***/
      
      coca.query("#meta_test").html("con la coca uno es mas feliz ... ")
      coca.append("<BR> coca A");
      coca.append("<BR> coca A");
      coca.append("<BR> coca A");
      coca.prepend("ESTE VA ARRIBA <BR>");
      coca.prepend("ESTE VA MAS  ARRIBA <BR>");
      
     
 ```
 
  CocaJS tiene mas manipulaciones del DOM, estas funciones son llamadas por el mismo coca.funcion ..
  
  	coca.each( Array , function(){} )   o  coca.each( function(){} ) //si existe un elemento apuntando
	coca.node(elemento o nodo )  equivalente  coca.$(elemento o nodo )  
	coca.html( string / html ) 
	coca.setVal(String)
	coca.append(string/html)
	coca.prepend(string/html)
	coca.result() // devuelve un array de los nodos afctados por coca.query ...
	coca.css( {}  ) // objecto o coca.css(string ,string)
	coca.setCss(string , string)
	coca.getId() // obtiene el id del elemento
	coca.getName() //obtiene el nombre del elemento 
	coca.setAttr(string , string ) //establece un nuevo atributo 
	coca.getAttr(string) //obitiene un atributo
	coca.removeAttr(string) //elimina un atributo 
	coca.query(string) // query en cual se ejecuta en el dom 
	
