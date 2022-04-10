const moves =[
    [1, 3],
    [0, 2, 4],
    [1, 5],
    [0, 4, 6],
    [1, 3, 5, 7],
    [4, 2, 8],
    [7, 3],
    [6, 4, 8],
    [7, 5]
];

const moves15 = [
    [1,4],
    [0,2,5],
    [1,3,6],
    [2,7],
    [0,5,8],
    [1,4,6,9],
    [2,5,7,10],
    [3,6,11],
    [4,9,12],
    [5,8,10,13],
    [6,9,11,14],
    [7,10,15],
    [8,13],
    [9,12,14],
    [10,13,15],
    [11,14]
]

//contador de movimentos do user
let numStep= 0;

// Procure por caixas vazias ao redor da caixa clicada
function getFreeBox(indice,boxIndex, flag){
    let ret
    if(indice == 9)
    {
        ret = moves[boxIndex].filter((item, index) => {
            let destiny = document.querySelector(flag.substr(0,flag.length-1)+item)
            return destiny.innerHTML.length == 2
        });
    }
    else{
        const compare = document.getElementById('ghost')
        ret = moves15[boxIndex].filter((item, index) => {
            let destiny = document.querySelector(flag.substr(0,4)+item)
            return compare.innerHTML == destiny.innerHTML
        });
    }
    if(ret.length)
        return ret[0];
    return false;
}

// Pesquisa exaustiva da distância de Manhattan
function searchNumber(list, number) {
    let pos = 0;

    while (pos < 9 && list[i] != number) {
        pos++;
    }

    if (pos < 9) {
        return pos;
    } else {
        return -1;
    }
}

function compare(l1, l2)
{
    if(!l1 || !l2)
        return false;

    if(l1.length != l2.length)
        return false;

    let i;

    for(i = 0; i < l1.length; i++)
        if(l1[i] != l2[i])
            return false;

    return true;
}

// Retorna o índice da caixa vazia
function getEmptyBox(matriz) {
    let index = 0;
    matriz.forEach((item, i) => {
        if(item == 0) index = i;
    });
    return index;
}

function possibilidade(lista) {
    let possibilidades = [];
    let indexEmptyBox = getEmptyBox(lista);
    if(lista.length == 9)
    {
        moves[indexEmptyBox].forEach((val, i) => {
            let listaTemp = new Array(...lista);
    
            listaTemp[indexEmptyBox] = lista[val];
            listaTemp[val] = 0;
            possibilidades.push(listaTemp);
            listaTemp = [];
        });
    }
    else{
        moves15[indexEmptyBox].forEach((val, i) => {
            let listaTemp = new Array(...lista);
    
            listaTemp[indexEmptyBox] = lista[val];
            listaTemp[val] = 0;
            possibilidades.push(listaTemp);
            listaTemp = [];
        });
    }
    
    return possibilidades;
}

function numeroPecasForaDoLugar(matriz, result)
{
    let pos = 0;
    let cont = 0;

    for(pos = 0; pos < matriz.length; pos++)
    {
        if(matriz[pos] != result[pos])
        {
            cont++;
        }
    }

    return cont;
}

function search(list, number)
{
    let pos = 0;
    while(pos < list.length && list[pos] != number)
        pos++;

    return pos;
}

function calculateSumManhattanDIstance(userList, result) {
    let perfectList = result;
    let x1, x2, y1, y2;
    let sum = 0, manhattanDistance;
    let pos;

    for (let i = 0; i < result.length; i++) {
            pos = search(result, userList[i]);

            x1 = (Math.floor(i / 3)) + 1;
            y1 = (i % 3) + 1;

            x2 = (Math.floor(pos / 3)) + 1; 
            y2 = (pos % 3) + 1;

            manhattanDistance = Math.abs(x2 - x1) + Math.abs(y2 - y1);

            sum = sum + manhattanDistance;
    }

    return sum;
}

function bestFirst(result, stateInitial)
{
    pq = new PriorityQueue();

    let ultimoEstado = [];
    let caminhoPercorrido;
    let contAux = 0;
    let custo = numeroPecasForaDoLugar(stateInitial, result);
    let listaCaminho = [];
    let estadosPercorridos = [];

    listaCaminho.push({vetor: stateInitial});
    estadosPercorridos.push({vetor: stateInitial});

    pq.enqueue(listaCaminho, custo);
    

    while(!pq.isEmpty())
    {
        contAux++;
    
        elemento = pq.dequeue();

        caminhoPercorrido = elemento.caminho;

        ultimoEstado = caminhoPercorrido[caminhoPercorrido.length - 1].vetor;

        if(compare(ultimoEstado, result))
        {
            let objRetorno = 
            {
                caminho: caminhoPercorrido.slice(0),
                qtdIteracoes: contAux - 1,
                profundidade: caminhoPercorrido.length - 1,
                qtdNosVisitados: estadosPercorridos.length
            };

            return objRetorno;
        }
        else
        {
            let possibilidades;

            possibilidades = possibilidade(ultimoEstado);

            for(let i = 0; i < possibilidades.length; i++)
            {
                let pos = 0;


                while(pos < caminhoPercorrido.length && !compare(possibilidades[i], caminhoPercorrido[pos].vetor))
                {
                    pos++;
                }

                if(pos == caminhoPercorrido.length)
                {
                    estadosPercorridos.push({vetor: possibilidades[i]});

                    custo = calculateSumManhattanDIstance(possibilidades[i], result)

                    let listaSeraInserida = caminhoPercorrido.slice(0);
                    
                    listaSeraInserida.push({vetor: possibilidades[i]});
                    pq.enqueue(listaSeraInserida, custo);
                }
            }
        }
    }
    return null;
}

const aStar = (result, stateInitial) => {
    pq = new PriorityQueue();

    let ultimoEstado = [];
    let caminhoPercorrido;
    let contAux = 0;
    let custo = numeroPecasForaDoLugar(stateInitial, result);
    let listaCaminho = [];
    let estadosPercorridos = [];

    listaCaminho.push({vetor: stateInitial});
    estadosPercorridos.push({vetor: stateInitial});

    pq.enqueue(listaCaminho, custo);
    

    while(!pq.isEmpty())
    {
        contAux++;
    
        elemento = pq.dequeue()

        caminhoPercorrido = elemento.caminho;

        ultimoEstado = caminhoPercorrido[caminhoPercorrido.length - 1].vetor;


        if(compare(ultimoEstado, result))
        {

            let objRetorno = 
            {
                caminho: caminhoPercorrido.slice(0),
                qtdIteracoes: contAux - 1,
                profundidade: caminhoPercorrido.length - 1,
                qtdNosVisitados: estadosPercorridos.length
            };

            return objRetorno;
        }
        else
        {
            let possibilidades;

            possibilidades = possibilidade(ultimoEstado);

            for(let i = 0; i < possibilidades.length; i++)
            {
                let pos = 0;


                while(pos < caminhoPercorrido.length && !compare(possibilidades[i], caminhoPercorrido[pos].vetor))
                {
                    pos++;
                }

                if(pos == caminhoPercorrido.length)
                {
                    estadosPercorridos.push({vetor: possibilidades[i]});

                    custo = calculateSumManhattanDIstance(possibilidades[i], result) + caminhoPercorrido.length;

                    let listaSeraInserida = caminhoPercorrido.slice(0);
                    
                    listaSeraInserida.push({vetor: possibilidades[i]});
                    pq.enqueue(listaSeraInserida, custo);
                }
            }
        }
    }
    return null;
}