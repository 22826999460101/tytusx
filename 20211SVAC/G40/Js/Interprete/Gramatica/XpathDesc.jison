/* Definición Léxica */
%lex

%options case-insensitive

BSL                         "\\".
%s                          comment
%%

"<!--"                      this.begin('comment');
<comment>"-->"              this.popState();
<comment>.                  /* skip commentario content*/
"node()"                      %{ return 'tk_node';  %}
"last()"                      %{ return 'tk_last';  %}
"position()"                  %{ return 'tk_position';  %}
"text()"                      %{ return 'tk_texto';  %}
"ancestor-or-self::"          %{ return 'tk_ancestorself';  %}
"ancestor::"                  %{ return 'tk_ancestor';  %}
"attribute::"                 %{ return 'tk_attribute';  %}
"child::"                     %{ return 'tk_child';  %}
"descendant-or-self::"        %{ return 'tk_descendantself';  %}
"descendant::"                %{ return 'tk_descendant';  %}
"following-sibling::"         %{ return 'tk_followingsibling';  %}
"following::"                  %{ return 'tk_following';  %}
"parent::"                    %{ return 'tk_parent';  %}
"preceding-sibling::"         %{ return 'tk_precedingsibling';  %}
"preceding::"                 %{ return 'tk_preceding';  %}
"self::"                      %{ return 'tk_self';  %}
"div"                       %{ return 'tk_division';  %}
"or"                        %{ return 'tk_or';  %}
"and"                       %{ return 'tk_and';  %}
"mod"                       %{ return 'tk_mod';  %}
"@*"                         %{ return 'tk_arrobaasterisco';  %}
"@"                         %{ return 'tk_arroba';  %}
"|"                         %{ return 'tk_barra';  %}
"+"                         %{ return 'tk_mas';  %}
"-"                         %{ return 'tk_menos';  %}
"*"                         %{ return 'tk_asterisco';  %}
"!="                        %{ return 'tk_noigual'; %}
"<="                        %{ return 'tk_menorigual'; %}
">="                        %{ return 'tk_mayorigual'; %}
"="                         %{ return 'tk_igual'; %}
">"                         %{ return 'tk_mayor'; %}
"<"                         %{ return 'tk_menor'; %}
"?"                         %{ return 'tk_interrogacion'; %}
"..//"                        %{ return 'tk_dpds'; %}
".//"                        %{ return 'tk_pds'; %}
"../"                        %{ return 'tk_dps'; %}
"./"                        %{ return 'tk_ps'; %}
"//"                        %{ return 'tk_dobleslash'; %}
"/"                        %{ return 'tk_slash'; %}
".."                        %{ return 'tk_doblepunto'; %}
"."                         %{ return 'tk_punto'; %}
([0-9]+["."][0-9]+)\b        %{ return 'tk_decimal';  %}
[0-9]+\b                    %{ return 'tk_entero';  %}
\"[^\"]*\"                  %{ yytext = yytext.substr(1, yyleng-2); return 'tk_cadena1'; %}
\'[^\']*\'                  %{ yytext = yytext.substr(1, yyleng-2); return 'tk_cadena2'; %}
([a-zA-ZáéíúóàèìòÁÉÍÓÚÀÈÌÒÙñÑ])[a-zA-Z0-9áéíúóàèìòÁÉÍÓÚÀÈÌÒÙñÑ_]*     %{ return 'tk_identificador'; %}
[']                         %{ return 'tk_squote'; %}
["]                         %{ return 'tk_dquote'; %}
"["                         %{ return 'tk_corchetea'; %}
"]"                         %{ return 'tk_corchetec'; %}
"{"                         %{ return 'tk_llavea'; %}
"}"                         %{ return 'tk_llavec'; %}
"("                         %{ return 'tk_parentesisa'; %}
")"                         %{ return 'tk_parentesisc'; %}

\s+                         /* skip whitespace */
[ \t\r\n\f]                 %{ /*Los Ignoramos*/   %}
<<EOF>>                     %{ return 'EOF';       %}
.                           { }

/lex

//SECCION DE IMPORTS
%{

%}


/* Asociación de operadores y precedencia */ 
%left tk_identificador tk_slash tk_dobleslash tk_punto tk_doblepunto
%left tk_mas tk_menos
%left tk_asterisco tk_divisionb tk_mod
%left tk_dobleslash tk_slash tk_dpds tk_pds tk_dps tk_ps
%left UMENOS


// DEFINIMOS PRODUCCIÓN INICIAL
%start INICIO

%%

/* Definición de la gramática */
INICIO : SETS EOF     {  /*SELECT ES EL ARREGLO DE NODOS*/
                         /*Creamos una nueva instruccion y le mandamos los nodos que debe ir a buscar*/
                        if ($1!=null){
                          instruccion = new XPath(@1.first_line, @1.first_column, $1)
                          console.log("TODO CORRECTO :D XPATH DESC VERSION");
                          $$ = instruccion;
                          return $$;
                        }else {
                          instruccion = new XPath(@1.first_line, @1.first_column, [])
                          console.log("TODO CORRECTO :D XPATH DESC VERSION");
                          $$ = instruccion;
                          return $$;
                        }
                        } ;

SETS: SET OS {  if($1!=null && $2!=1) {
               arr = [$1];
              if($2!=null){
                arr = arr.concat($2);                                          
              }                                                                                                   
              $$ = arr;
              } else {          
                  $$ = null;             
              } 
                };

OS: SET OS { if($1!=null && $2!=1) {
               arr = [$1];
            if($2!=null){
              arr = arr.concat($2);                                          
            }                                                                                                       
             $$ = arr;
            } else {                          
              $$ = 1;                      
            }          
           }
    | { $$ = null;  };

SET:    SELECTORES EXPRESION {         
                        nodoXPath = new NodoXpath("", TipoNodo.SELECTOR_EXPRESION, null, $1[0], $2[0], @1.first_line, @1.first_column);                
                        nodoaux = new NodoArbol("NODO","");
                        nodoaux.agregarHijo(new NodoArbol($1[1],""));
                        nodoaux.agregarHijo($2[1]);
                        nodoxPATHDESC.agregarHijo(nodoaux);
                        $$ = nodoXPath;
                             }
   |    EXPRESION {     nodoXPath = new NodoXpath("", TipoNodo.EXPRESION, null, [], $1[0], @1.first_line, @1.first_column); 
                        nodoaux = new NodoArbol("NODO","");
                        nodoaux.agregarHijo($1[1]);
                        nodoxPATHDESC.agregarHijo(nodoaux);
                        $$ = nodoXPath;
                  }
   |    AXES     {       nodoXPath = new NodoXpath("", TipoNodo.AXES, $1[0], [], null, @1.first_line, @1.first_column); 
                        nodoaux = new NodoArbol("NODO","");
                        nodoaux.agregarHijo($1[1]);
                        nodoxPATHDESC.agregarHijo(nodoaux);
                        $$ = nodoXPath;
                }
   |    SELECTORES AXES { nodoXPath = new NodoXpath("", TipoNodo.SELECTOR_AXES, $2[0], $1[0], null, @1.first_line, @1.first_column); 
                        nodoaux = new NodoArbol("NODO","");
                        nodoaux.agregarHijo(new NodoArbol($1[1],""));
                        nodoaux.agregarHijo($2[1]);
                        nodoxPATHDESC.agregarHijo(nodoaux);
                        $$ = nodoXPath;
                          }
    |  error {  ListaErr.agregarError(new Error(NumeroE, yylineno,this._$.first_column + 1, "Sintactico", "Se esperaba un objeto y se encontro "+ yytext,"XPATH")); NumeroE++;
               $$ = null; };

SELECTORES: tk_dobleslash OTRO_SELECTOR { arr = [TipoSelector.DOBLE_SLASH]; 
                                          arr = arr.concat($2[0]);
                                          $1 = $1+""+$2[1] ;
                                          $$ = [arr,$1];
                                        }
         |  tk_dobleslash { $$ = [[TipoSelector.DOBLE_SLASH],$1]; }
         |  tk_slash { $$ = [[TipoSelector.SLASH],$1];  }
         |  tk_slash OTRO_SELECTOR {  arr = [TipoSelector.SLASH] 
                                      arr = arr.concat($2[0]);
                                      $1 = $1+""+$2[1];
                                      $$ = [arr,$1]; }
         |  OTRO_SELECTOR { $$ = [$1[0],$1[1]];   };

OTRO_SELECTOR: tk_dpds AGREGAR_SELECTOR { arr = [TipoSelector.DOSPUNTOS_DOSSLASH];
                                          arr = arr.concat($2[0]);
                                          $1 = $1+""+$2[1];
                                          $$ = [arr,$1];  }
            |  tk_pds  AGREGAR_SELECTOR { arr = [TipoSelector.PUNTO_DOSSLASH];
                                          arr = arr.concat($2[0]);
                                          $1 = $1+""+$2[1];
                                          $$ = [arr,$1];  }
            |  tk_dps  AGREGAR_SELECTOR { arr = [TipoSelector.DOSPUNTOS_SLASH];
                                          arr = arr.concat($2[0]);
                                          $1 = $1+""+$2[1];
                                          $$ = [arr,$1];  }
            |  tk_ps   AGREGAR_SELECTOR { arr = [TipoSelector.PUNTO_SLASH];
                                          arr = arr.concat($2[0]);
                                          $1 = $1+""+$2[1];
                                          $$ = [arr,$1];  };

AGREGAR_SELECTOR:  OTRO_SELECTOR { $$ = [$1[0],$1[1]]; }
                | { $$ = [[TipoSelector.FIN],""]; };

EXPRESION : tk_identificador PREDICADO {
                                        expresionAux = new ExpresionXPath(@1.first_line, @1.first_column, $1, TipoExpresionXPath.IDENTIFICADOR, $2[0]);
                                        nodoaux = new NodoArbol($1,"");
                                        nodoaux.agregarHijo($2[1]);
                                        $$ = [expresionAux,nodoaux];
                                        }
        |  tk_asterisco PREDICADO {     
                                        expresionAux = new ExpresionXPath(@1.first_line, @1.first_column, $1, TipoExpresionXPath.ASTERISCO, $2[0]);
                                        nodoaux = new NodoArbol($1,"");
                                        nodoaux.agregarHijo($2[1]);
                                        $$ = [expresionAux,nodoaux];
                                        }
        |  tk_punto {     
                                        expresionAux = new ExpresionXPath(@1.first_line, @1.first_column, $1, TipoExpresionXPath.PUNTO, null);
                                        nodoaux = new NodoArbol($1,"");
                                        $$ = [expresionAux,nodoaux];
                                        }
        |  tk_doblepunto {     
                                        expresionAux = new ExpresionXPath(@1.first_line, @1.first_column, $1, TipoExpresionXPath.DOBLEPUNTO, null);
                                        nodoaux = new NodoArbol($1,"");
                                        $$ = [expresionAux,nodoaux];
                                        }
        |  tk_texto PREDICADO {
                                        expresionAux = new ExpresionXPath(@1.first_line, @1.first_column, $1, TipoExpresionXPath.TEXT, $2[0]);
                                        nodoaux = new NodoArbol($1,"");
                                        nodoaux.agregarHijo($2[1]);
                                        $$ = [expresionAux,nodoaux];
                                        }
        |  tk_node PREDICADO {          expresionAux = new ExpresionXPath(@1.first_line, @1.first_column, $1, TipoExpresionXPath.NODE, $2[0]);
                                        nodoaux = new NodoArbol($1,"");
                                        nodoaux.agregarHijo($2[1]);
                                        $$ = [expresionAux,nodoaux];
                                        };

PREDICADO : tk_corchetea EXPRESION_FILTRO tk_corchetec { 
                                        nodoaux = new NodoArbol("Predicado","");
                                        nodoaux.agregarHijo(new NodoArbol("[",""));
                                        nodoaux.agregarHijo($2[1]);
                                        nodoaux.agregarHijo(new NodoArbol("]",""));
                                        $$ = [$2[0],nodoaux];} 
        |  { 
                                        nodoaux = new NodoArbol("Predicado","");
                                        nodoaux.agregarHijo(new NodoArbol("[",""));
                                        nodoaux.agregarHijo(new NodoArbol("]",""));
                                        $$ = [[],nodoaux];} ;


EXPRESION_FILTRO : EXPRESION_LOGICA { $$ = $1; };

AXES :          tk_ancestorself   EXPRESION      {      axesAux = new Axes(@1.first_line, @1.first_column, TipoAxes.ANCESTOR_OR_SELF, $2[0]);
                                                        nodoaux = new NodoArbol($1,"");
                                                        nodoaux.agregarHijo($2[1]);
                                                        $$ = [axesAux,nodoaux]; }

        |       tk_ancestor   EXPRESION          {      axesAux = new Axes(@1.first_line, @1.first_column, TipoAxes.ANCESTOR, $2[0]);
                                                        nodoaux = new NodoArbol($1,"");
                                                        nodoaux.agregarHijo($2[1]);
                                                        $$ = [axesAux,nodoaux]; }

        |       tk_child      EXPRESION          {      axesAux = new Axes(@1.first_line, @1.first_column, TipoAxes.CHILD, $2[0]);
                                                        nodoaux = new NodoArbol($1,"");
                                                        nodoaux.agregarHijo($2[1]);
                                                        $$ = [axesAux,nodoaux]; }

        |       tk_descendantself EXPRESION      {      axesAux = new Axes(@1.first_line, @1.first_column, TipoAxes.DESCENDANT_OR_SELF, $2[0]);
                                                        nodoaux = new NodoArbol($1,"");
                                                        nodoaux.agregarHijo($2[1]);
                                                        $$ = [axesAux,nodoaux]; }

        |       tk_descendant  EXPRESION         {      axesAux = new Axes(@1.first_line, @1.first_column, TipoAxes.DESCENDANT, $2[0]);
                                                        nodoaux = new NodoArbol($1,"");
                                                        nodoaux.agregarHijo($2[1]);
                                                        $$ = [axesAux,nodoaux]; }

        |       tk_followingsibling EXPRESION    {      axesAux = new Axes(@1.first_line, @1.first_column, TipoAxes.FOLLOWING_SIBLING, $2[0]);
                                                        nodoaux = new NodoArbol($1,"");
                                                        nodoaux.agregarHijo($2[1]);
                                                        $$ = [axesAux,nodoaux]; }

        |       tk_following  EXPRESION          {      axesAux = new Axes(@1.first_line, @1.first_column, TipoAxes.FOLLOWING, $2[0]);
                                                        nodoaux = new NodoArbol($1,"");
                                                        nodoaux.agregarHijo($2[1]);
                                                        $$ = [axesAux,nodoaux]; }

        |       tk_self  EXPRESION               {      axesAux = new Axes(@1.first_line, @1.first_column, TipoAxes.SELF, $2[0]);
                                                        nodoaux = new NodoArbol($1,"");
                                                        nodoaux.agregarHijo($2[1]);
                                                        $$ = [axesAux,nodoaux]; }

        |       tk_parent  EXPRESION             {      axesAux = new Axes(@1.first_line, @1.first_column, TipoAxes.PARENT, $2[0]);
                                                        nodoaux = new NodoArbol($1,"");
                                                        nodoaux.agregarHijo($2[1]);
                                                        $$ = [axesAux,nodoaux]; }

        |       tk_precedingsibling EXPRESION    {      axesAux = new Axes(@1.first_line, @1.first_column, TipoAxes.PRECEDING_SIBLING, $2[0]);
                                                        nodoaux = new NodoArbol($1,"");
                                                        nodoaux.agregarHijo($2[1]);
                                                        $$ = [axesAux,nodoaux]; }

        |       tk_preceding  EXPRESION          {      axesAux = new Axes(@1.first_line, @1.first_column, TipoAxes.PRECEDING, $2[0]);
                                                        nodoaux = new NodoArbol($1,"");
                                                        nodoaux.agregarHijo($2[1]);
                                                        $$ = [axesAux,nodoaux]; };

ATRIBUTO : tk_arroba tk_identificador tk_igual CADENA { idAux = new Primitivo($2, @1.first_line, @1.first_column);
                                                        operacionAux = new Operacion(TipoOperadores.ATRIBUTOS, idAux, $4[0], Operador.IGUAL, @1.first_line, @1.first_column);
                                                        nodoaux = new NodoArbol("=","");
                                                        nodoaux.agregarHijo(new NodoArbol("@"+$2,""));
                                                        nodoaux.agregarHijo($4[1]);
                                                        $$ = [operacionAux,nodoaux]; } 
                                                        
          |  tk_attribute tk_identificador tk_igual CADENA { idAux = new Primitivo($2, @1.first_line, @1.first_column);
                                                        operacionAux = new Operacion(TipoOperadores.ATRIBUTOS, idAux, $4[0], Operador.IGUAL, @1.first_line, @1.first_column);
                                                        nodoaux = new NodoArbol("=","");
                                                        nodoaux.agregarHijo(new NodoArbol("attribute::"+$2,""));
                                                        nodoaux.agregarHijo($4[1]);
                                                        $$ = [operacionAux,nodoaux]; };


EXPRESION_LOGICA : EXPRESION_LOGICA tk_and EXPRESION_RELACIONAL { operacionAux = new Operacion(TipoOperadores.ELEMENTOS, $1[0], $3[0], Operador.AND, @1.first_line, @1.first_column);
                                                                  nodoaux = new NodoArbol("and","");
                                                                  nodoaux.agregarHijo($1[1]);
                                                                  nodoaux.agregarHijo($3[1]);
                                                                  $$ = [operacionAux,nodoaux]; }

                |  EXPRESION_LOGICA tk_or EXPRESION_RELACIONAL {  operacionAux = new Operacion(TipoOperadores.ELEMENTOS, $1[0], $3[0], Operador.OR, @1.first_line, @1.first_column);
                                                                  nodoaux = new NodoArbol("or","");
                                                                  nodoaux.agregarHijo($1[1]);
                                                                  nodoaux.agregarHijo($3[1]);
                                                                  $$ = [operacionAux,nodoaux]; }   
                |  EXPRESION_RELACIONAL { $$ = $1; };


EXPRESION_RELACIONAL :  EXPRESION_NUMERICA tk_mayor EXPRESION_NUMERICA { operacionAux = new Operacion(TipoOperadores.ELEMENTOS, $1[0], $3[0], Operador.MAYOR_QUE, @1.first_line, @1.first_column);
                                                                         nodoaux = new NodoArbol(">","");
                                                                         nodoaux.agregarHijo($1[1]);
                                                                         nodoaux.agregarHijo($3[1]);
                                                                         $$ = [operacionAux,nodoaux]; }

                |       EXPRESION_NUMERICA tk_menor EXPRESION_NUMERICA { operacionAux = new Operacion(TipoOperadores.ELEMENTOS, $1[0], $3[0], Operador.MENOR_QUE, @1.first_line, @1.first_column);
                                                                         nodoaux = new NodoArbol("<","");
                                                                         nodoaux.agregarHijo($1[1]);
                                                                         nodoaux.agregarHijo($3[1]);
                                                                         $$ = [operacionAux,nodoaux]; }

                |       EXPRESION_NUMERICA tk_mayorigual EXPRESION_NUMERICA { operacionAux = new Operacion(TipoOperadores.ELEMENTOS, $1[0], $3[0], Operador.MAYOR_IGUAL_QUE, @1.first_line, @1.first_column);
                                                                              nodoaux = new NodoArbol(">=","");
                                                                              nodoaux.agregarHijo($1[1]);
                                                                              nodoaux.agregarHijo($3[1]);
                                                                              $$ = [operacionAux,nodoaux]; }

                |       EXPRESION_NUMERICA tk_menorigual EXPRESION_NUMERICA { operacionAux = new Operacion(TipoOperadores.ELEMENTOS, $1[0], $3[0], Operador.MENOR_IGUAL_QUE, @1.first_line, @1.first_column);
                                                                              nodoaux = new NodoArbol("<=","");
                                                                              nodoaux.agregarHijo($1[1]);
                                                                              nodoaux.agregarHijo($3[1]);
                                                                              $$ = [operacionAux,nodoaux]; }

                |       EXPRESION_NUMERICA tk_igual EXPRESION_CADENA { operacionAux = new Operacion(TipoOperadores.ELEMENTOS, $1[0], $3[0], Operador.IGUAL, @1.first_line, @1.first_column);
                                                                       nodoaux = new NodoArbol("=","");
                                                                       nodoaux.agregarHijo($1[1]);
                                                                       nodoaux.agregarHijo($3[1]);
                                                                       $$ = [operacionAux,nodoaux]; } 

                |       EXPRESION_NUMERICA tk_noigual EXPRESION_CADENA { operacionAux = new Operacion(TipoOperadores.ELEMENTOS, $1[0], $3[0], Operador.DIFERENTE_QUE, @1.first_line, @1.first_column);
                                                                         nodoaux = new NodoArbol("=","");
                                                                         nodoaux.agregarHijo($1[1]);
                                                                         nodoaux.agregarHijo($3[1]);
                                                                         $$ = [operacionAux,nodoaux]; }   
                |       EXPRESION_NUMERICA { $$ = $1; }   

                |       ATRIBUTO { $$ = $1; }

                |       tk_asterisco {  expresionAux = new ExpresionDefinida(@1.first_line, @1.first_column, ExpresionDefinida.ASTERISCO);
                                        nodoaux = new NodoArbol("*","");
                                        $$ = [expresionAux,nodoaux]; }

                |       tk_arrobaasterisco {    expresionAux = new ExpresionDefinida(@1.first_line, @1.first_column, ExpresionDefinida.ARROBA);
                                                nodoaux = new NodoArbol("@*","");
                                                $$ = [expresionAux,nodoaux]; }

                |       tk_texto {      expresionAux = new ExpresionDefinida(@1.first_line, @1.first_column, ExpresionDefinida.TEXT);
                                        nodoaux = new NodoArbol($1,"");
                                        $$ = [expresionAux,nodoaux]; }        

                |       tk_node {       expresionAux = new ExpresionDefinida(@1.first_line, @1.first_column, ExpresionDefinida.NODE);
                                        nodoaux = new NodoArbol($1,"");
                                        $$ = [expresionAux,nodoaux]; }  ;

EXPRESION_CADENA :     CADENA { $$ = $1; }
                |      EXPRESION_NUMERICA { $$ = $1; };

CADENA :         tk_cadena1 { primitivoAux = new Primitivo($1, @1.first_line, @1.first_column);
                              nodoaux = new NodoArbol($1,"");
                              $$ = [primitivoAux,nodoaux];   }

        |        tk_cadena2 { primitivoAux = new Primitivo($1, @1.first_line, @1.first_column);
                              nodoaux = new NodoArbol($1,"");
                              $$ = [primitivoAux,nodoaux];   };

EXPRESION_NUMERICA: tk_menos EXPRESION_NUMERICA %prec  UMENOS   { negativo = new Primitivo(-1, @1.first_line, @1.first_column);
                                                                  operacionAux = new Operacion(TipoOperadores.ELEMENTOS, $2[0], negativo, Operador.MULTIPLICACION, @1.first_line, @1.first_column);
                                                                  nodoaux = new NodoArbol("*","");
                                                                  nodoaux.agregarHijo(new NodoArbol("-1",""));
                                                                  nodoaux.agregarHijo($2[1]);
                                                                  $$ = [operacionAux,nodoaux]; } 
                | tk_entero EXPRESION_PRIMA	                {     if($2[0]==null){
                                                                  primitivoAux = new Primitivo(Number($1), @1.first_line, @1.first_column);
                                                                  nodoaux = new NodoArbol($1,"");
                                                                  $$ = [primitivoAux,nodoaux];
                                                                  } else {
                                                                    operacionHeredada = $2[0];
                                                                    nodoHeredado = $2[1];
                                                                    nodoHeredado.agregarHijo(new NodoArbol($1,""));
                                                                    primitivoAux = new Primitivo(Number($1), @1.first_line, @1.first_column);
                                                                    operacionHeredada.setOperadorIzquierda(primitivoAux);
                                                                    $$ = [ operacionHeredada, nodoHeredado ];
                                                                  }
                                                                   }
	              | tk_decimal EXPRESION_PRIMA                    { if($2[0]==null){
                                                                  primitivoAux = new Primitivo(Number($1), @1.first_line, @1.first_column);
                                                                  nodoaux = new NodoArbol($1,"");
                                                                  $$ = [primitivoAux,nodoaux];
                                                                  } else {
                                                                    operacionHeredada = $2[0];
                                                                    nodoHeredado = $2[1];
                                                                    nodoHeredado.agregarHijo(new NodoArbol($1,""));
                                                                    primitivoAux = new Primitivo(Number($1), @1.first_line, @1.first_column);
                                                                    operacionHeredada.setOperadorIzquierda(primitivoAux);
                                                                    $$ = [ operacionHeredada, nodoHeredado ];
                                                                  } }
                | tk_last EXPRESION_PRIMA                       { if($2[0]==null){
                                                                  expresionAux = new ExpresionDefinida(@1.first_line, @1.first_column, TipoExpresionDefinida.LAST);
                                                                  nodoaux = new NodoArbol($1,"");
                                                                  $$ = [expresionAux,nodoaux];
                                                                  } else {
                                                                    operacionHeredada = $2[0];
                                                                    nodoHeredado = $2[1];
                                                                    nodoHeredado.agregarHijo(new NodoArbol($1,""));
                                                                    expresionAux = new ExpresionDefinida(@1.first_line, @1.first_column, TipoExpresionDefinida.LAST);
                                                                    operacionHeredada.setOperadorIzquierda(expresionAux);
                                                                    $$ = [ operacionHeredada, nodoHeredado ];
                                                                  } }        
                | AXES EXPRESION_PRIMA                          { 
                                                                  if($2[0]==null){
                                                                    $$ = [ $1[0], $1[1] ];
                                                                  } else {
                                                                    operacionHeredada = $2[0];
                                                                    nodoHeredado = $2[1];
                                                                    nodoHeredado.agregarHijo($1[1]);
                                                                    operacionHeredada.setOperadorIzquierda($1[0]);
                                                                    $$ = [ operacionHeredada, nodoHeredado ];
                                                                  }                                                                                                                                              
                                                                   }
                | tk_position EXPRESION_PRIMA                   { if($2[0]==null){
                                                                  expresionAux = new ExpresionDefinida(@1.first_line, @1.first_column, TipoExpresionDefinida.POSITION);
                                                                  nodoaux = new NodoArbol($1,"");
                                                                  $$ = [expresionAux,nodoaux];
                                                                  } else {
                                                                    operacionHeredada = $2[0];
                                                                    nodoHeredado = $2[1];
                                                                    nodoHeredado.agregarHijo(new NodoArbol($1,""));
                                                                    expresionAux = new ExpresionDefinida(@1.first_line, @1.first_column, TipoExpresionDefinida.POSITION);
                                                                    operacionHeredada.setOperadorIzquierda(expresionAux);
                                                                    $$ = [ operacionHeredada, nodoHeredado ];
                                                                  } }  
	        | tk_identificador EXPRESION_PRIMA	        {           if($2[0]==null){
                                                                  primitivoAux = new Primitivo($1, @1.first_line, @1.first_column);
                                                                  nodoaux = new NodoArbol($1,"");
                                                                  $$ = [primitivoAux,nodoaux];
                                                                  } else {
                                                                    operacionHeredada = $2[0];
                                                                    nodoHeredado = $2[1];
                                                                    nodoHeredado.agregarHijo(new NodoArbol($1,""));
                                                                    primitivoAux = new Primitivo($1, @1.first_line, @1.first_column);
                                                                    operacionHeredada.setOperadorIzquierda(primitivoAux);
                                                                    $$ = [ operacionHeredada, nodoHeredado ];
                                                                  } };


EXPRESION_PRIMA:            tk_mas EXPRESION_NUMERICA                           {       operacionAux = new Operacion(TipoOperadores.ELEMENTOS, null, $2[0], Operador.SUMA, @1.first_line, @1.first_column);
                                                                                        nodoaux = new NodoArbol("+","");                                                                                      
                                                                                        nodoaux.agregarHijo($2[1]);
                                                                                        $$ = [operacionAux,nodoaux]; }
                    |       tk_menos EXPRESION_NUMERICA 	                {       operacionAux = new Operacion(TipoOperadores.ELEMENTOS, null, $2[0], Operador.RESTA, @1.first_line, @1.first_column);
                                                                                        nodoaux = new NodoArbol("-","");                                                                                      
                                                                                        nodoaux.agregarHijo($2[1]);
                                                                                        $$ = [operacionAux,nodoaux]; }
                    |       tk_asterisco EXPRESION_NUMERICA                     {       operacionAux = new Operacion(TipoOperadores.ELEMENTOS, null, $2[0], Operador.MULTIPLICACION, @1.first_line, @1.first_column);
                                                                                        nodoaux = new NodoArbol("*","");                                                                                      
                                                                                        nodoaux.agregarHijo($2[1]);
                                                                                        $$ = [operacionAux,nodoaux]; }
                    |       tk_mod EXPRESION_NUMERICA                           {       operacionAux = new Operacion(TipoOperadores.ELEMENTOS, null, $2[0], Operador.MODULO, @1.first_line, @1.first_column);
                                                                                        nodoaux = new NodoArbol("%","");                                                                                      
                                                                                        nodoaux.agregarHijo($2[1]);
                                                                                        $$ = [operacionAux,nodoaux]; }
                    |       tk_division EXPRESION_NUMERICA                      {       operacionAux = new Operacion(TipoOperadores.ELEMENTOS, null, $2[0], Operador.DIVISION, @1.first_line, @1.first_column);
                                                                                        nodoaux = new NodoArbol("÷","");                                                                                      
                                                                                        nodoaux.agregarHijo($2[1]);
                                                                                        $$ = [operacionAux,nodoaux]; }               
                    |       tk_parentesisa EXPRESION_NUMERICA tk_parentesisc    {  $$ = $2; }
                    |                                                           {  $$ = [null,null]; } ;                       
