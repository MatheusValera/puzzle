//
const grid = document.querySelector("#grid");
const gridAux = document.querySelector("#grid-aux");
let button_solve = document.querySelector('#btnSolve');
let button_mix = document.querySelector('#btnShuffle');
let buttons_move = document.querySelectorAll(".box");

var listLayout = [];
var listResult = [];
var quantidadeRandom;

window.addEventListener("load", init);

function init(e)
{
    switchActions(true);
    listLayout = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    listResult = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    fillGrid([...grid.children],listLayout);
    fillGrid([...gridAux.children],listResult)
    setNumStep(0);
}

function set() {
    let grid = document.querySelector('#div-grid')
    let gridState = document.querySelector('#div-grid-state')

    let btnSolve = document.querySelector("#btnSolve")
    let btnShuffle = document.querySelector("#btnShuffle")
    let btnRestart = document.querySelector("#btnRestart")

    grid.classList.remove("hidden")
    gridState.classList.add("hidden")

    btnSolve.disabled = false
    btnShuffle.disabled = false
    btnRestart.disabled = false
    
    btnSolve.classList.remove('opaque')
    btnShuffle.classList.remove('opaque')
    btnRestart.classList.remove('opaque')
    
    let divU = document.querySelector('#user-result')
    divU.classList.remove('hidden')

    showSetedResult()
}

function solve() {

    setNumStep(0);
    switchActions(false);

    let selected_algorithm = document.querySelector("[name='search']:checked")
    let algoritmo_busca = selected_algorithm.value
    
    let caminho = [];
    let retorno;
    let tempoBuscaSelecionada

    if(algoritmo_busca == 'bestFirst') {
        let t0 = performance.now();
        retorno = bestFirst(listResult, listLayout);
        let t1 = performance.now();
        tempoBuscaSelecionada = (t1 - t0) / 1000;
        caminho = retorno.caminho;
    }
    else {//A*
        let t0 = performance.now();
        retorno = aStar(listResult, listLayout)
        let t1 = performance.now();
        tempoBuscaSelecionada = (t1 - t0) / 1000;
        caminho = retorno.caminho;
    }
    showSteps(caminho, retorno.qtdIteracoes, retorno.qtdNosVisitados,tempoBuscaSelecionada);
    animateCaminho(caminho);
    switchActions(true);    
}

function restart() {
    location.reload();
}

function showSetedResult() {
    let elem = document.querySelector('#u-result') 
    elem.innerHTML = ""
    for (let i = 0; i < listResult.length; i++) {
        if(i!= 0 && i % 3 == 0)
            elem.innerHTML += "<br>";
        elem.innerHTML += " " +listResult[i] != 0 ? " " +listResult[i] : ' &#128123'
    }
}

async function animateCaminho(caminho){

    if(caminho && caminho.length > 0)
    {
        listLayout = caminho[0].vetor;
        fillGrid([...grid.children],caminho[0].vetor);
        caminho.splice(0, 1);
        setTimeout(() => {
            animateCaminho(caminho);
        }, 500);
        setNumStep(++numStep);
    }else 
        return true;
}

function showSteps(caminho, iteracoes, nosVisitados, tempoBuscaSelecionada){
    let div_box = document.querySelector('#path');

    profundidade = caminho.length;

    if(caminho && profundidade > 0)
    {
        // Limpa as divs caminho
        let child_box = document.querySelectorAll("#path div")
        child_box.forEach((item) => {
            div_box.removeChild(item);
        });
        // Limpa as flechas
        let child_arrow = document.querySelectorAll("#path label")
        child_arrow.forEach((arrow) => {
            div_box.removeChild(arrow);
        });
        /*
        let count_caminho = document.createElement("h3");
        let count_profundidade = document.createElement("h3");
        let count_nos_visitados = document.createElement("h3");
        let count_repeticoes_geracao_matriz = document.createElement("h3");
        let element_tempo_busca = document.createElement("h3");

        //count_caminho.innerHTML = "Iterações: " + iteracoes;
        //count_profundidade.innerHTML = "Profundidade: " + profundidade;
        //count_nos_visitados.innerHTML = "Nós visitados: " + nosVisitados;
        //count_repeticoes_geracao_matriz.innerHTML = "";
        //element_tempo_busca.innerHTML = "Tempo de Busca: " + tempoBuscaSelecionada + " (segundos)";
        
        div_box.append(count_repeticoes_geracao_matriz);
        div_box.append(count_caminho);
        div_box.append(count_profundidade);
        div_box.append(count_nos_visitados);
        div_box.append(element_tempo_busca);
        */
        let divPath = document.querySelector('#div-path')
        divPath.classList.remove('hidden');
        caminho.forEach((item, i) => {
            let box_matrix = document.createElement("div");
            let elemA = document.createElement("label");
            elemA.innerHTML = "&#10145"
            elemA.classList.add('m-5')
            box_matrix = matrixFromList(item.vetor);
            box_matrix.innerHTML = "Step" + (i+1) + box_matrix.innerHTML;
            if(i != 0)
                div_box.append(elemA)
            div_box.append(box_matrix);
        });
    }
    else{
        let divPath = document.querySelector('#div-path')
        divPath.classList.add('hidden');
    }
}

function matrixFromList(list)
{
    let ret = document.createElement("div");
    ret.classList.add("div-step");
    for (let i = 0; i < list.length; i++) {
        if(i % 3 == 0)
            ret.innerHTML += "<br>";
        ret.innerHTML += " " +list[i] != 0 ? " " +list[i] : ' &#128123'
    }
    return ret;
}


function switchActions(operation){
    if(operation){
        buttons_move.forEach((button) => {
            button.addEventListener("click", handleClickBox);
        });
    }
    else{
        buttons_move.forEach((button) => {
            button.onclick = false;
        })
    }
}

//preenche a grid
function fillGrid(grid, list = [])
{
    grid.forEach(function(item, i) {
        if(list[i] > 0) {
            item.classList.add("bg-clear");
            item.classList.remove("bg-empty");
            item.innerHTML = list[i]
            item.style.backgroundColor = 'rgb(159, 193, 255)'
        }
        else {
            item.classList.add("bg-empty");
            item.classList.remove("bg-clear");
            item.innerHTML = "&#128123";
            item.style.backgroundColor = '#000000'
        }
    });
}


function shuffle()
{
    random_iterations = Math.floor(Math.random() * 100) + 20;
    let lista2 = random_moves(listLayout, random_iterations);
    listLayout = lista2;
    //setNumStep(0)
    quantidadeRandom = random_iterations;
    fillGrid([...grid.children],listLayout)
}

function random_moves(lista, movimentos = 0){
    if(movimentos == 0)
        return lista;
    else{
        possibilidades = possibilidade(lista);
        let poss_i = Math.floor(Math.random() * possibilidades.length);
        return random_moves(possibilidades[poss_i], movimentos-1);
    }
}

//mexe a box
function handleClickBox(e)
{
    let elem = e.target.id;
    let boxIndex = elem.substr(3);
    let flag = elem.includes('au')
    flag = flag ? '#au_' + boxIndex : '#tb_' + boxIndex
    moveBox(boxIndex,flag)
    //if(moveBox(boxIndex,flag))
    //    validateGrid(flag);
}

//movimenta box de list
function moveBox(boxIndex, flag) {

    let box = document.querySelector(flag);
    let destinyIndex = getFreeBox(boxIndex,flag);
    let moved = false;
    if(flag.includes('tb')){
        if(destinyIndex !== false){
            listLayout[destinyIndex] = parseInt(box.innerHTML);
            listLayout[boxIndex] = 0;
    
            fillGrid([...grid.children],listLayout);
            moved = true;
        }
    }else {
        if(destinyIndex !== false){
            listResult[destinyIndex] = parseInt(box.innerHTML);
            listResult[boxIndex] = 0;
            fillGrid([...gridAux.children],listResult);
            moved = true;
        }
    }

    return moved;
}

function setNumStep(nMoves) {
    numStep = nMoves;
    let steps = document.querySelector("#num-step");
    steps.innerHTML = nMoves;
}

