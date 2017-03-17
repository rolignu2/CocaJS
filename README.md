# CocaJS

  Version 0.1.0 (Alpha)

``` Escrita con VanillaJS CocaJS pretende ser mas rapida que JQUERY pero no pretende destronarla como el mejor Framework o el mas usado ``` : i'm in love with the coco

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
    coca.Ajax(object);
    
    //La pereza gana tranquilo como un ejemplo anterior 
    coca.$$(object);
    
    //Soy super programador senio amante de angularJS , tranquilo aca tenemos tu async 
    var wait      = function() {};
    var success   = function(xhr) {};
    var error     = function(xhr)
    coca.Ajax(null , 'http://holamundo.com/' , { param : "Holiss" } , wait , success , error);
    
    

    
 ```
