class QElement {
    constructor(caminhoPercorrido, funcaoAvaliacao)
    {
        this.caminho = caminhoPercorrido;
        this.custo = funcaoAvaliacao;
    }
}

class PriorityQueue {
    constructor() {
        this.items = [];
    }
  
    enqueue(element, priority) {
        var qElement = new QElement(element, priority);
        var contain = false;
    
       
        for (var i = 0; i < this.items.length; i++) {
            if (this.items[i].custo > qElement.custo) {
                
                this.items.splice(i, 0, qElement);
                contain = true;
                break;
            }
        }
    
        
        if (!contain) {
            this.items.push(qElement);
        }
    }

    dequeue() {
        if (this.isEmpty())
            return "Underflow";
        return this.items.shift();
    }

    front() {
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items[0];
    }

    rear() {
        if (this.isEmpty())
            return "No elements in Queue";
        return this.items.pop();
    }

    isEmpty() {
        return this.items.length == 0;
    }

    printPQueue() {
        var str = "";
        for (var i = 0; i < this.items.length; i++)
            str += this.items[i].element + " ";
        return str;
    }
}