"use strict";
class CodeUtil {
    constructor() {
    }
    static init() {
        this._cadSalida = "";
        this._sp = 0;
        this._hp = 0;
        this._rp = 0;
        this._temporal = 1;
        this._etiqueta = 1;
        this.initCad();
        this.generarFuncionesNativas();
    }
    static registrarTamañoHeapCargaXML(size) {
        this.printWithComment(this.TMP_SIZE_TS_XML + " = " + size + " ;", "Guardamos posicion de H para determinar tamaño de la carga");
    }
    static generarDefinicionFunciones() {
        CodeUtil.print("/*************************************/");
        this.print("void imprimirObjeto();");
        this.print("void concatenarObjeto();");
        this.print("void crarLista();");
        this.print("void equalString();");
        this.print("void printString();");
        this.print("void printLnString();");
        this.print("void imprimirAtributos();");
        this.print("void imprimirAtributo();");
        this.print("void imprimirHijos();");
        this.print("void crearLista();");
        this.print("void imprimirListaObjetos();");
        this.print("void findObjectsByNombre();");
        CodeUtil.print("/*************************************/");
        this.print("");
    }
    static generarFuncionesNativas() {
        this.generarDefinicionFunciones();
        RootIdentifier.findObjectsByNombre();
        this.imprimirListaObjetos();
        this.imprimrObjeto();
        this.imprimirHijos();
        this.imprimirAtributo();
        this.imprimirAtributos();
        this.concatenarObjeto();
        this.crearLista();
        this.equalString();
        this.genPrintstring();
        this.genPrintLnString();
        CodeUtil.print("/*************************************/");
        CodeUtil.print("");
    }
    static printWithComment(cadena, comentario) {
        CodeUtil._cadSalida += cadena + ((comentario == null) ? "" : "\t\t\t//" + comentario) + "\n";
    }
    static print(cadena) {
        CodeUtil._cadSalida += cadena + "\n";
    }
    static printComment(comentario) {
        CodeUtil._cadSalida += "//" + comentario + "\n";
    }
    static initCad() {
        this._cadSalida = "";
        this._cadSalida += "float Heap[1000000]; //estructura heap\n";
        this._cadSalida += "float Stack[1000000]; //estructura stack\n";
        this._cadSalida += "float Repository[2000000]; //estructura repository\n";
        this._cadSalida += "int SP=0;\n";
        this._cadSalida += "int HP=0;\n";
        this._cadSalida += "int RP=0;\n";
        CodeUtil.print("");
        CodeUtil.print("");
    }
    static getDefinitionTemps() {
        var cadFinal = "";
        var cad = "float ";
        for (var _i = 0; _i <= this._temporal; _i++) {
            cad += (cad == "float ") ? "" : ",";
            cad += " t" + _i;
            if (cad.length > 150) {
                cadFinal += cad + ";\n";
                cad = "float ";
            }
        }
        cad += ";";
        cad = (cad == "float ;") ? "" : cad;
        cadFinal += cad;
        return cadFinal;
    }
    static generarTemporal() {
        var temporal = this.T + this._temporal;
        this._temporal += 1;
        return temporal;
    }
    static generarEtiqueta() {
        var etiqueta = "L" + this._etiqueta;
        this._etiqueta += 1;
        return etiqueta;
    }
    static guardarTexto(cadena) {
        CodeUtil.printComment("Guardamos " + cadena);
        var tmp = CodeUtil.generarTemporal();
        CodeUtil.printWithComment(tmp + " = RP + 0 ;", "Obtenemos inicio de cadena");
        for (let caracter of cadena) {
            CodeUtil.printWithComment("Repository[RP] = " + caracter.charCodeAt(0) + " ;", caracter);
            CodeUtil.print("RP = RP + 1 ;");
        }
        CodeUtil.printWithComment("Repository[RP] = -1 ;", "EOF");
        CodeUtil.print("RP = RP + 1 ;");
        return tmp;
    }
    static crearMain() {
        this.print("/**************************************");
        this.print("main():void");
        this.print("AmbitaoGlboal->stack[P]");
        this.print("List AmbitaoGlboal->stack[P+1]");
        this.print("**************************************/");
        CodeUtil.print("int main()");
        CodeUtil.print("{");
        CodeUtil.printWithComment(CodeUtil.METHOD_CARGARXML + ";", "Stack[SP] y Stack[SP+1] queda la carga. ");
    }
    static cerrarMain() {
        CodeUtil.print("}");
    }
    static createTemps() {
        this._cadSalida = this.getDefinitionTemps() + "\n" + this._cadSalida;
    }
    static createLibs() {
        this._cadSalida = "#include <stdio.h>\n\n" + this._cadSalida;
    }
    static comenzarPrograma() {
        CodeUtil.crearMain();
    }
    static finalizarProgrma() {
        CodeUtil.cerrarMain();
        CodeUtil.createTemps();
        CodeUtil.createLibs();
    }
    static genPrintstring() {
        this.print("/**************************************");
        this.print("printString(string cadena1 ):void");
        this.print("cadena1->stack[P]");
        this.print("**************************************/");
        this.print("void " + this.METHOD_PRINT_STRING);
        this.print("{");
        var temporalPosParametro1 = this.generarTemporal();
        this.printWithComment(temporalPosParametro1 + " = SP + 0 ; ", "Pos parametro 1 (Cadena1)");
        var temporalRefCadena = this.generarTemporal();
        this.printWithComment(temporalRefCadena + " = Stack[(int)" + temporalPosParametro1 + "] ; ", "Obtenemos el valor del parametro");
        var lInicio = this.generarEtiqueta();
        var lFinl = this.generarEtiqueta();
        var temporalChar1 = this.generarTemporal();
        this.printWithComment(lInicio + ":", "Etiqueta Inicio");
        this.printWithComment(temporalChar1 + " = Repository[(int)" + temporalRefCadena + "] ; ", "Caracter de la cadena.");
        this.print("if ( " + temporalChar1 + " == -1 ) goto " + lFinl + " ;");
        this.print('printf("%c",(int)' + temporalChar1 + ');');
        this.print(temporalRefCadena + " = " + temporalRefCadena + " + " + 1 + " ;");
        this.print("goto " + lInicio + " ;");
        this.printWithComment(lFinl + ":", "Etiqueta Fin");
        //this.print('printf("\\n"); ');
        this.print("return ;");
        this.print("}");
        this.print("");
    }
    static genPrintLnString() {
        this.print("/**************************************");
        this.print("printLnString(string cadena1 ):void");
        this.print("cadena1->stack[P]");
        this.print("**************************************/");
        this.print("void printLnString()");
        this.print("{");
        var temporalPosParametro1 = this.generarTemporal();
        this.printWithComment(temporalPosParametro1 + " = SP + 0 ; ", "Pos parametro 1 (Cadena1)");
        var temporalRefCadena = this.generarTemporal();
        this.printWithComment(temporalRefCadena + " = Stack[(int)" + temporalPosParametro1 + "] ; ", "Obtenemos el valor del parametro");
        var lInicio = this.generarEtiqueta();
        var lFinl = this.generarEtiqueta();
        var temporalChar1 = this.generarTemporal();
        this.printWithComment(lInicio + ":", "Etiqueta Inicio");
        this.printWithComment(temporalChar1 + " = Repository[(int)" + temporalRefCadena + "] ; ", "Caracter de la cadena.");
        this.print("if ( " + temporalChar1 + " == -1 ) goto " + lFinl + " ;");
        this.print('printf("%c",(int)' + temporalChar1 + ');');
        this.print(temporalRefCadena + " = " + temporalRefCadena + " + " + 1 + " ;");
        this.print("goto " + lInicio + " ;");
        this.printWithComment(lFinl + ":", "Etiqueta Fin");
        this.print('printf("\\n"); ');
        this.print("}");
        this.print("");
    }
    static equalString() {
        this.print("/**************************************");
        this.print("equalString(string cadena1, string cadena2):boolean");
        this.print("cadena1->stack[P]");
        this.print("cadena2->stack[P+1]");
        this.print("return->stack[P]");
        this.print("**************************************/");
        this.print("void " + this.METHOD_EQUAL_);
        this.print("{");
        var temporalI = this.generarTemporal();
        this.printWithComment(temporalI + " = 0 ;", "Temporal i");
        var temporalIgual = this.generarTemporal();
        this.printWithComment(temporalIgual + " = 1 ;", "Temporal result ");
        var temporalPosParametro1 = this.generarTemporal();
        this.printWithComment(temporalPosParametro1 + " = SP + 0 ; ", "Pos parametro 1 (Cadena1)");
        var temporalPosParametro2 = this.generarTemporal();
        this.printWithComment(temporalPosParametro2 + " = SP + 1 ; ", "Pos parametro 2 (Cadena2)");
        var temporalChar1 = this.generarTemporal();
        var temporalChar2 = this.generarTemporal();
        var lInicio = this.generarEtiqueta();
        var lBreak = this.generarEtiqueta();
        //var lFin = this.generarEtiqueta();
        var lIfEof = this.generarEtiqueta();
        this.printWithComment(lInicio + ":", "Etiqueta Inicio");
        //this.printWithComment("if ("+temporalIgual+"!= 1 ) goto "+lFin+" ;"," Ciclo");
        this.print(temporalPosParametro1 + " = " + temporalPosParametro1 + " + " + temporalI + " ;");
        this.print(temporalPosParametro2 + " = " + temporalPosParametro2 + " + " + temporalI + " ;");
        this.printWithComment(temporalChar1 + " = Repository[(int)" + temporalPosParametro1 + "] ; ", "Caracter de la cadena 1");
        this.printWithComment(temporalChar2 + " = Repository[(int)" + temporalPosParametro2 + "] ; ", "Caracter de la cadena 2");
        this.print("if (" + temporalChar1 + " == " + temporalChar2 + " ) goto " + lIfEof + " ;");
        this.print(temporalIgual + " = 0 ;");
        this.print("goto " + lBreak + " ;");
        this.printWithComment(lIfEof + ":", "Etiqueta para validar fin de cadena");
        this.printWithComment("if (" + temporalChar1 + " == -1 ) goto " + lBreak + ";", "Si encontro -1 terminar de analizar la cadena");
        this.print(temporalI + " = " + temporalI + " + 1 ;");
        this.print("goto " + lInicio + ";");
        this.printWithComment(lBreak + ":", "Etiqueta de break;");
        //this.printWithComment(lFin+":","Etiqueta falso");
        this.printWithComment("Stack[SP] = " + temporalIgual + ";", "Retornamos el boleano si es igual o no");
        this.print("}");
        this.print("");
    }
    static crearLista() {
        this.print("/**************************************");
        this.print("crearLista():int");
        this.print("return->stack[P]");
        this.print("**************************************/");
        this.print("void crearLista()");
        this.print("{");
        var tmpReferencia = this.generarTemporal();
        this.print(tmpReferencia + " = HP ;");
        this.printWithComment("Heap[ HP ] = -1 ;", "Se inicializa el espacio del objeto");
        this.print("HP = HP + 1 ;");
        this.printWithComment("Heap[ HP ] = -1 ;", "Se inicializa el espacio de la referencia");
        this.print("HP = HP + 1 ;");
        this.print("Stack [ SP ] = " + tmpReferencia + " ;");
        this.print("}");
    }
    static concatenarObjeto() {
        this.print("/**************************************");
        this.print("concatenarObjeto(ListObjects listaObjetos, Object objetoNuevo):void");
        this.print("listaObjetos->stack[P]");
        this.print("objetoNuevo->stack[P+1]");
        this.print("**************************************/");
        this.print("void concatenarObjeto()");
        this.print("{");
        var lInicio = this.generarEtiqueta();
        var lValidarApuntador = this.generarEtiqueta();
        var lValidarSiguietntelLista = this.generarEtiqueta();
        var lFin = this.generarEtiqueta();
        this.printWithComment(lInicio + ":", "Etiqueta de incio");
        var tmpPosParametro1 = this.generarTemporal();
        this.printWithComment(tmpPosParametro1 + " = SP + 0 ;", "Posicion del parametro de la lista");
        var tmpPosParametro2 = this.generarTemporal();
        this.printWithComment(tmpPosParametro2 + " = SP + 1 ;", "Posicion del parametro del objeto");
        var tmpParametro1 = this.generarTemporal();
        this.printWithComment(tmpParametro1 + " = Stack[(int)" + tmpPosParametro1 + "];", "Se obtiene la referencia de la lista");
        var tmpParametro2 = this.generarTemporal();
        this.printWithComment(tmpParametro2 + " = Stack[(int)" + tmpPosParametro2 + "];", "Se obtiene la referencia del objeto");
        var tmpObjeto = this.generarTemporal();
        this.printComment("Valor del objeto de la lista");
        this.print(tmpObjeto + " = Heap[(int)" + tmpParametro1 + "];");
        this.printComment("Valor de la referencia de la lista");
        var tmpPosReferencia = this.generarTemporal();
        this.print(tmpPosReferencia + " = " + tmpParametro1 + " + 1 ;");
        var tmpApuntador = this.generarTemporal();
        this.print(tmpApuntador + " = Heap[(int)" + tmpPosReferencia + "];");
        this.print("if ( " + tmpObjeto + " != -1) goto " + lValidarApuntador + " ;");
        this.printComment("La lista esta vacia, se inserta el primer objeto");
        //Guardamos el objeto en la primera posicion
        this.printWithComment("Heap[(int)" + tmpParametro1 + "] = " + tmpParametro2 + " ;", "La primera casilla es nula y asignamos el objeto enviado por parametro");
        this.printWithComment("goto " + lFin + " ; ", "Salgo a etiqueta fin");
        this.print(lValidarApuntador + " : ");
        this.print("if ( " + tmpApuntador + " != -1 ) goto " + lValidarSiguietntelLista + " ;" /*,"Buscar en la sigueinte sub lista"*/);
        //Creamos nueva lista y la concatenamos a la existente
        this.printComment("El apuntador es nulo y se crea nueva lista para concatenar");
        this.printComment("Se va a crear una nueva lista.");
        this.print("SP = SP + 2 ;");
        this.printWithComment("crearLista(); ", "Llamamos funcion que crea lista");
        var tmpApuntadorNuevaLista = this.generarTemporal();
        this.printWithComment(tmpApuntadorNuevaLista + " = Stack[SP] ;", "Se recupera el return del metodo. ");
        this.print("SP = SP - 2 ;");
        //Enlazamos la lista
        this.printComment("Asociamos la nueva lista a la lista actual");
        this.print("Heap[(int)" + tmpPosReferencia + "] = " + tmpApuntadorNuevaLista + " ;");
        //Se guarda nuevamente el objeto en la nueva lista
        this.printWithComment("Stack[(int)" + tmpPosParametro1 + "] = " + tmpApuntadorNuevaLista + " ;", "Se asigna al parametro la nueva lista");
        this.printWithComment("Stack[(int)" + tmpPosParametro2 + "] = " + tmpParametro2 + " ;", "El objeto recibido sigue como parametro 2");
        this.printWithComment("goto " + lInicio + " ;", "Se hace goto en vez de llamada recursiva");
        /*
        this.print("SP = SP + 2 ;");
        //var tmpPosAntiguoPosPar2 = tmpPosParametro2;
        tmpPosParametro1 = this.generarTemporal();
        this.printWithComment(tmpPosParametro1 + " = SP + 0 ;","Posicion del parametro de la lista");
        tmpPosParametro2 = this.generarTemporal();
        this.printWithComment(tmpPosParametro2 + " = SP + 1 ;","Posicion del parametro del objeto");
        this.printWithComment("Stack[(int)"+tmpPosParametro1+"] = "+tmpApuntadorNuevaLista+" ;",
            "Se pasa la referencia de la nueva lista");
        this.printWithComment("Stack[(int)"+tmpPosParametro2+"] = "+tmpParametro2+" ;",
            "Se pasa la referencia del objeto, el mismo que se recibio por parametro");
        this.print("SP = SP - 2 ;");
        this.printWithComment("goto "+lFin+" ; ","Salgo a etiqueta fin");
        */
        this.print(lValidarSiguietntelLista + " :");
        //Insertamos en la referencia de la siguiente lista.
        this.printComment("Se busca en el siguiente objeto enlazado");
        this.printWithComment("Stack[(int)" + tmpPosParametro1 + "] = " + tmpApuntador + " ;", "Se asigna al parametro la referencia de la lista");
        this.printWithComment("Stack[(int)" + tmpPosParametro2 + "] = " + tmpParametro2 + " ;", "El objeto recibido sigue como parametro 2");
        this.printWithComment("goto " + lInicio + " ; ", "Salgo a etiqueta incio");
        this.printWithComment(lFin + " :", "Etiqueta fin");
        this.print("return ;");
        this.print("}");
        this.print("");
    }
    static imprimrObjeto() {
        this.print("/**************************************");
        this.print("imprimirObjeto(Object objetoImprimir, boolean imprimirAtributo ):void");
        this.print("objetoImprimir->stack[P]");
        this.print("imprimirAtributo->stack[P+1]");
        this.print("**************************************/");
        this.print("void imprimirObjeto()");
        this.print("{");
        var etiquetaAtributo = this.generarEtiqueta();
        var etiquetaContenido = this.generarEtiqueta();
        var etiquetaFin = this.generarEtiqueta();
        let tmpPostParametro1 = this.generarTemporal();
        this.printWithComment(tmpPostParametro1 + " = SP + 0 ;", "Posicion del parametro");
        let tmpPostParametro2 = this.generarTemporal();
        this.printWithComment(tmpPostParametro2 + " = SP + 1 ;", "Posicion del parametro");
        let tmpParametro1 = this.generarTemporal();
        this.printWithComment(tmpParametro1 + " = Stack[(int)" + tmpPostParametro1 + "]; ", "Objeto enviado por parametro");
        let tmpParametro2 = this.generarTemporal();
        this.printWithComment(tmpParametro2 + " = Stack[(int)" + tmpPostParametro2 + "]; ", "Indicador enviado por parametro");
        var tmpPosTipoObjeto = this.generarTemporal();
        this.printWithComment(tmpPosTipoObjeto + " = " + tmpParametro1 + " + " + TsRow.POS_OBJECT + " ;", "Obtenemos la posicion donde se guarda el tipo de objeto");
        var tmpTipoObjeto = this.generarTemporal();
        this.print(tmpTipoObjeto + " = Heap[(int)" + tmpPosTipoObjeto + "]; ");
        this.print("if ( " + tmpTipoObjeto + " != " + TipoDato3D.objeto + " ) goto " + etiquetaAtributo + " ;");
        //**********************************************IMPRESION DE OBJETOS
        this.printComment("Inicia a imprimr un objeto");
        let tmpPosCadena = this.generarTemporal();
        this.print(tmpPosCadena + " = " + tmpParametro1 + " + " + TsRow.POS_LABEL_CONT_ATTRIBUTE + " ;");
        let tmpCadena = this.generarTemporal();
        this.printWithComment(tmpCadena + " = Heap[(int)" + tmpPosCadena + "];", "Se obtiene la referencia de la etiqueta");
        //Se imprime el tag de apertura
        this.printComment("Imrimimos el tag de apertura");
        this.print('printf("<");');
        this.printWithComment("SP = SP + 2 ; ", "Se cambia de ambito");
        //this.guardarTemporales(tmpPostParametro1,tmpCadena)
        this.printWithComment("Stack[SP] = " + tmpCadena + " ; ", "Se pasa de referncia la etiqueta a imprimir.");
        this.printWithComment("printString();", "Call: Se llama metodo para imprimir la etiqueta del elemento xml");
        //this.recuperarTemporales(tmpPostParametro1,tmpCadena)
        this.printWithComment("SP = SP - 2 ; ", "Se recupera el ambito");
        //Se imprime los atributos
        this.printComment("Se imprime los atributos");
        this.print('printf(" ");');
        this.printWithComment("SP = SP + 2 ; ", "Se cambia de ambito");
        //this.guardarTemporales(tmpPostParametro1,tmpCadena);
        this.printWithComment("Stack[SP] = " + tmpParametro1 + " ;", "Se para la referencia del objeto actual para imprimir sus atributos ");
        this.printWithComment("imprimirAtributos();", "Call: Se llama funcion para imprimir atributos");
        //this.recuperarTemporales(tmpPostParametro1,tmpCadena);
        this.printWithComment("SP = SP - 2 ; ", "Se recupera el ambito");
        this.print('printf(">\\n");');
        //Se Imprime el contenido
        this.printComment("Se Imprime el contenido");
        this.printWithComment("SP = SP + 2 ; ", "Se cambia de ambito");
        this.guardarTemporales(tmpPostParametro1, tmpCadena);
        this.printWithComment("Stack[SP] = " + tmpParametro1 + " ;", "Se para la referencia del objeto actual para imprimir sus hijos ");
        this.printWithComment("imprimirHijos();", "Imprimimos los hijos del objeto");
        this.recuperarTemporales(tmpPostParametro1, tmpCadena);
        this.printWithComment("SP = SP - 2 ; ", "Se recupera el ambito");
        //Se imprime el tag de cierre
        this.printComment("Imrimimos el tag de cierre");
        this.print('printf("</");');
        this.printWithComment("SP = SP + 2 ; ", "Cambiamos de ambito");
        //this.guardarTemporales(tmpPostParametro1,tmpCadena);
        this.printWithComment("Stack[SP] = " + tmpCadena + " ; ", "Se pasa de referncia la etiqueta a imprimir.");
        this.printWithComment("printString();", "Call: Se llama metodo para imprimir la etiqueta del elemento xml");
        //this.recuperarTemporales(tmpPostParametro1,tmpCadena);
        this.printWithComment("SP = SP - 2 ; ", "Recuperamos el ambito");
        this.print('printf(">\\n");');
        this.print("goto " + etiquetaFin + " ;");
        this.printComment("Finaliza a imprimr un objeto");
        this.print(etiquetaAtributo + ":");
        this.print("if ( " + tmpTipoObjeto + " != " + TipoDato3D.atributo + " ) goto " + etiquetaContenido + " ;");
        //**********************************************IMPRESION DE ATRIBUTOS
        this.printComment("Inicio impresion atributo");
        this.printWithComment("if ( " + tmpParametro2 + " == 0 ) goto " + etiquetaFin + " ;", "Si el indicador es 0 no imprimimos");
        let tmpPosValorAtributo = this.generarTemporal();
        this.printWithComment(tmpPosValorAtributo + " = " + tmpParametro1 + " + " + TsRow.POS_INIT_CHILDS + " ;", "Posicion del apuntador del valor del atributo");
        let tmpValorAtributo = this.generarTemporal();
        this.printWithComment(tmpValorAtributo + " = Heap[(int)" + tmpPosValorAtributo + "] ; ", "Referncia del valor del atributo. ");
        this.print("SP = SP + 2 ; ");
        //this.guardarTemporales(tmpPostParametro1,tmpValorAtributo);
        this.printWithComment("Stack[SP] = " + tmpValorAtributo + " ;", "Paso de la cadena a imprimrir como parametro");
        this.printWithComment("printLnString();", "Call: Imprimri valor atributo");
        //this.recuperarTemporales(tmpPostParametro1,tmpValorAtributo);
        this.print("SP = SP - 2 ; ");
        this.printComment("Finaliza impresion atributo");
        //**********************************************IMPRESION DE CONTENIDO
        this.printComment("Inicio Impresion de Contenido");
        this.print(etiquetaContenido + ":");
        let tmpPosContenido = this.generarTemporal();
        this.print(tmpPosContenido + " = " + tmpParametro1 + " + " + TsRow.POS_LABEL_CONT_ATTRIBUTE + " ;");
        let tmpContenido = this.generarTemporal();
        this.printWithComment(tmpContenido + " = Heap[(int)" + tmpPosContenido + "];", "Se obtiene la referencia del contenido");
        this.print("SP = SP + 2 ; ");
        //this.guardarTemporales(tmpPostParametro1,tmpContenido)
        this.printWithComment("Stack[SP] = " + tmpContenido + " ; ", "Se pasa de referncia el contenido a imprimir.");
        this.printWithComment("printLnString();", "Call: Se llama metodo para imprimir contenido ");
        //this.recuperarTemporales(tmpParametro1,tmpContenido)
        this.print("SP = SP - 2 ; ");
        this.printComment("Fin Impresion de Contenido");
        this.printWithComment(etiquetaFin + ": ", "Etiqueta fin");
        this.print("return ;");
        this.print("}");
        this.print("");
    }
    static imprimirAtributos() {
        this.print("/**************************************");
        this.print("imprimirAtributos(Object objetoPadre ):void");
        this.print("objetoPadre->stack[P]");
        this.print("**************************************/");
        this.print("void imprimirAtributos()");
        this.print("{");
        var tmpPostParametro1 = this.generarTemporal();
        this.printWithComment(tmpPostParametro1 + " = SP + 0 ;", "Posicion del parametro");
        var tmpParametro1 = this.generarTemporal();
        this.printWithComment(tmpParametro1 + " = Stack[(int)" + tmpPostParametro1 + "]; ", "Objeto enviado por parametro");
        var tmpPosTamañoObjeto = this.generarTemporal();
        this.printWithComment(tmpPosTamañoObjeto + " = " + tmpParametro1 + " + " + TsRow.POS_SIZE + " ;", "Obtenemos la posicion donde se guarda el tamaño de objeto");
        var tmpTamañoObjeto = this.generarTemporal();
        this.printWithComment(tmpTamañoObjeto + " = Heap[(int)" + tmpPosTamañoObjeto + "] ;", "Obtenemos el tamaño del objeto");
        var i = this.generarTemporal();
        this.print(i + " = 0 ;");
        var lInicio = this.generarEtiqueta();
        var lFin = this.generarEtiqueta();
        this.print(lInicio + ": ");
        this.printWithComment("if (" + i + " >= " + tmpTamañoObjeto + " ) goto " + lFin + " ;", "Recorremos hasta que i>=tamaño objeto");
        var tmpPosInicioHijos = this.generarTemporal();
        this.print(tmpPosInicioHijos + " = " + tmpParametro1 + " + " + TsRow.SIZE_PROPERTIES_OBJECT + " ;");
        var tmpPosHijo = this.generarTemporal();
        this.print(tmpPosHijo + " = " + tmpPosInicioHijos + " + " + i + " ;");
        var tmpHijo = this.generarTemporal();
        this.printWithComment(tmpHijo + " = Heap[(int)" + tmpPosHijo + "];", "Obtenemos el hijo para mandar a imprimir");
        this.print("SP = SP + 1 ;");
        this.print("Stack[SP] = " + tmpHijo + ";");
        this.print("imprimirAtributo();");
        this.print("SP = SP - 1 ;");
        this.print(i + " = " + i + " + 1 ;");
        this.print("goto " + lInicio + " ;");
        this.printWithComment(lFin + ":", "Etiqueta fin");
        this.print("return ;");
        this.print("}");
        this.print("");
    }
    static imprimirAtributo() {
        this.print("/**************************************");
        this.print("imprimirAtributo(Attribute atributo ):void");
        this.print("atributo->stack[P]");
        this.print("**************************************/");
        this.print("void imprimirAtributo()");
        this.print("{");
        var etiquetaFin = this.generarEtiqueta();
        var tmpPostParametro1 = this.generarTemporal();
        this.printWithComment(tmpPostParametro1 + " = SP + 0 ;", "Posicion del parametro");
        var tmpParametro1 = this.generarTemporal();
        this.printWithComment(tmpParametro1 + " = Stack[(int)" + tmpPostParametro1 + "]; ", "Objeto enviado por parametro");
        var tmpPosTipoObjeto = this.generarTemporal();
        this.printWithComment(tmpPosTipoObjeto + " = " + tmpParametro1 + " + " + TsRow.POS_OBJECT + " ;", "Obtenemos la posicion donde se guarda el tipo de objeto");
        var tmpTipoObjeto = this.generarTemporal();
        this.print(tmpTipoObjeto + " = Heap[(int)" + tmpPosTipoObjeto + "]; ");
        this.print("if ( " + tmpTipoObjeto + " != " + TipoDato3D.atributo + " ) goto " + etiquetaFin + " ;");
        var tmpRefNombreAtributo = this.generarTemporal();
        var tmpNombreAributo = this.generarTemporal();
        var tmpRefValorAtributo = this.generarTemporal();
        var tmpValorAtributo = this.generarTemporal();
        this.printWithComment(tmpRefNombreAtributo + " = " + tmpParametro1 + " + " + TsRow.POS_LABEL_CONT_ATTRIBUTE + ";", "Posicion del nombre");
        this.printWithComment(tmpNombreAributo + " = Heap[(int)" + tmpRefNombreAtributo + "];", "Referenia al nombre");
        this.print("SP = SP + 1 ; ");
        this.printWithComment("Stack[SP] = " + tmpNombreAributo + " ;", "Se para referencia del nombre");
        this.print("printString();");
        this.print("SP = SP - 1 ; ");
        this.print('printf("=");');
        this.print('printf("\\\"");');
        this.print(tmpRefValorAtributo + " = " + tmpParametro1 + " + " + TsRow.SIZE_PROPERTIES_OBJECT + " ;");
        this.printWithComment(tmpValorAtributo + " = Heap[(int)" + tmpRefValorAtributo + "];", "Referenia al valor");
        this.print("SP = SP + 1 ; ");
        this.printWithComment("Stack[SP] = " + tmpValorAtributo + "; ", "Pasamos el valor del atributo para imprimir");
        this.print("printString();");
        this.print("SP = SP - 1 ; ");
        this.print('printf("\\\" ");');
        this.print(etiquetaFin + ": ");
        this.print("return ;");
        this.print("}");
        this.print("");
    }
    static imprimirHijos() {
        this.print("/**************************************");
        this.print("imprimirHijos(Object objetoPadre ):void");
        this.print("objetoPadre->stack[P]");
        this.print("**************************************/");
        this.print("void imprimirHijos()");
        this.print("{");
        var tmpPostParametro1 = this.generarTemporal();
        this.printWithComment(tmpPostParametro1 + " = SP + 0 ;", "Posicion del parametro");
        var tmpParametro1 = this.generarTemporal();
        this.printWithComment(tmpParametro1 + " = Stack[(int)" + tmpPostParametro1 + "]; ", "Objeto enviado por parametro");
        var tmpPosTamañoObjeto = this.generarTemporal();
        this.printWithComment(tmpPosTamañoObjeto + " = " + tmpParametro1 + " + " + TsRow.POS_SIZE + " ;", "Obtenemos la posicion donde se guarda el tamaño de objeto");
        var tmpTamañoObjeto = this.generarTemporal();
        this.printWithComment(tmpTamañoObjeto + " = Heap[(int)" + tmpPosTamañoObjeto + "] ;", "Obtenemos el tamaño del objeto");
        var i = this.generarTemporal();
        this.print(i + " = 0 ;");
        let lInicio = this.generarEtiqueta();
        var lFin = this.generarEtiqueta();
        this.print(lInicio + ": ");
        this.printWithComment("if (" + i + " >= " + tmpTamañoObjeto + " ) goto " + lFin + " ;", "Recorremos hasta que i>=tamaño objeto");
        var tmpPosInicioHijos = this.generarTemporal();
        this.print(tmpPosInicioHijos + " = " + tmpParametro1 + " + " + TsRow.POS_INIT_CHILDS + " ;");
        var tmpPosHijo = this.generarTemporal();
        this.print(tmpPosHijo + " = " + tmpPosInicioHijos + " + " + i + " ;");
        var tmpHijo = this.generarTemporal();
        this.printWithComment(tmpHijo + " = Heap[(int)" + tmpPosHijo + "];", "Obtenemos el hijo para mandar a imprimir");
        this.printWithComment("SP = SP + 1 ;", "Se cambia el ambito");
        this.guardarTemporales(tmpPostParametro1, tmpHijo);
        this.print("Stack[SP] = " + tmpHijo + ";");
        let tmpParametro2 = this.generarTemporal();
        this.printWithComment(tmpParametro2 + " = SP + 1 ;", "Parametro para imprimir atributos.");
        this.printWithComment("Stack[(int)" + tmpParametro2 + "] = 0 ;", " En este caso enviamos 0 default porque son hijos");
        this.print("imprimirObjeto();");
        this.recuperarTemporales(tmpPostParametro1, tmpHijo);
        this.printWithComment("SP = SP - 1 ;", "Se recupera el ambito");
        this.printWithComment(i + " = " + i + " + 1 ;", "Incrementamos el contador (i++)");
        this.print("goto " + lInicio + " ;");
        this.printWithComment(lFin + ":", "Etiqueta fin");
        this.print("return ;");
        this.print("}");
        this.print("");
    }
    static guardarTemporales(tmpMenor, tmpMayor) {
        let inicio = +(tmpMenor.replace(this.T, ""));
        let final = +(tmpMayor.replace(this.T, ""));
        this.printComment("Guardamos los temporales en la pila");
        for (let i = inicio; i <= final; i++) {
            this.print("Stack[SP] = " + this.T + i + " ;");
            this.print("SP = SP + 1 ;");
        }
        this.printComment("Fin de guardar temporales en la pila");
    }
    static recuperarTemporales(tmpMenor, tmpMayor) {
        let inicio = +(tmpMenor.replace(this.T, ""));
        let final = +(tmpMayor.replace(this.T, ""));
        this.printComment("Recuperamos los temporales en la pila");
        for (let i = final; i >= inicio; i--) {
            this.print("SP = SP - 1 ;");
            this.print(this.T + i + " = Stack[SP] ;");
        }
        this.printComment("Fin de recuperacion de temporales en la pila");
    }
    static imprimirListaObjetos() {
        this.print("/**************************************");
        this.print("imprimirListaObjetos(ListObject listaObjetos ):void");
        this.print("ListaObjetos->stack[P]");
        this.print("**************************************/");
        this.print("void imprimirListaObjetos()");
        this.print("{");
        let tamanioAmbito = 1;
        let lInicio = this.generarEtiqueta();
        let lFin = this.generarEtiqueta();
        this.printWithComment(lInicio + ": ", "Etiqueta Inicio");
        let tmpPostParametro1 = this.generarTemporal();
        this.printWithComment(tmpPostParametro1 + " = SP + 0 ;", "Posicion del parametro");
        let tmpParametro1 = this.generarTemporal();
        this.printWithComment(tmpParametro1 + " = Stack[(int)" + tmpPostParametro1 + "]; ", "Objeto enviado por parametro");
        let tmpReferenciaObjeto = this.generarTemporal();
        this.printWithComment(tmpReferenciaObjeto + "= Heap[(int)" + tmpParametro1 + "];", "Obtenemos la referencia del primer objeto.");
        this.printWithComment("if ( " + tmpReferenciaObjeto + " == -1 ) goto " + lFin + " ; ", "Si esta vacia la lista no terminamos metodo");
        this.printWithComment("SP = SP + " + tamanioAmbito + " ;", "Cambiamos ambito");
        this.printWithComment("Stack[SP] = " + tmpReferenciaObjeto + " ;", "Pasamos el objeto a imprimir");
        let tmpPosParametroImpAtributo = this.generarTemporal();
        this.printWithComment(tmpPosParametroImpAtributo + " = SP + 1 ;", "Posicion para parametro de imprimir atributo");
        this.print("Stack[(int)" + tmpPosParametroImpAtributo + "] = 1 ;");
        this.printWithComment("imprimirObjeto();", "Call: Imprimir Objeto");
        this.printWithComment("SP = SP - " + tamanioAmbito + " ;", "Recuperamos ambito");
        let tmpPosRefeSiguienteObjeto = this.generarTemporal();
        this.printWithComment(tmpPosRefeSiguienteObjeto + " = " + tmpParametro1 + " + 1 ;", "Obtenemos la referencia del siguiente objeto de la lsita");
        let tmpRefSiguienteObjeto = this.generarTemporal();
        this.printWithComment(tmpRefSiguienteObjeto + " = Heap[(int)" + tmpPosRefeSiguienteObjeto + "] ;", "Obtenemos la referncia del siguiente objeto");
        this.printWithComment("if ( " + tmpRefSiguienteObjeto + " == -1 ) goto " + lFin + " ;", "Si no hay ningun otro objeto finalizamos");
        this.printWithComment("Stack[(int)" + tmpPostParametro1 + "] = " + tmpRefSiguienteObjeto + ";", "Colocamos el siguiente objeto en la posicion del parametro y comenzamos la funcion");
        this.printWithComment("goto " + lInicio + ";", "Saltamos al Etiqueta Inicio");
        this.printWithComment(lFin + ":", "Etiqueta fin");
        this.print("return ;");
        this.print("}");
        this.print("");
    }
}
CodeUtil.METHOD_CARGARXML = "cargarXml()";
CodeUtil.METHOD_EQUAL_ = "equalString()";
CodeUtil.METHOD_PRINT_STRING = "printString()";
CodeUtil.T = "t";
CodeUtil.TMP_SIZE_TS_XML = CodeUtil.T + "0";
CodeUtil._cadSalida = "";