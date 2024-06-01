'use strict';

import {randm, n, matrixUnOr, Point, ARRAY_VERTICES, ctx, RADIUS} from './drawGraph.js';

let W = [];
window.addEventListener('DOMContentLoaded', () => {

    const nextButton = document.querySelector('#nextButton');

    const resetButton = document.querySelector('#resetButton');
    resetButton.addEventListener('click', () => {
        location.reload();
    });

    const createZeroMatrix = () => {
        let result = [];
        for (let i = 0; i < n; i++) {
            let row = [];
            for (let j = 0; j < n; j++) {
                row.push(0);
            }
            result.push(row);
        }
        return result;
    };

    const getWeightMatrix = () => {
        const B = randm(n);

        const getCeilMatr = (matrix, adjMatrix) => {

            let result = [];
            for (let i = 0; i < matrix.length; i++) {
                let row2 = [];
                for (let j = 0; j < matrix[i].length; j++) {
                    row2.push(Math.round(matrix[i][j] * 100 * adjMatrix[i][j]));
                }
                result.push(row2);
            }
            return result;
        };
        const C = getCeilMatr(B, matrixUnOr);
        const getDMatr = (matrix) => {

            let result = [];
            for (let row of matrix) {
                let res = [];
                for (let elem of row) {
                    res.push(elem > 0 ? 1 : 0);
                }
                result.push(res);
            }
            return result;
        };
        const D = getDMatr(C);

        const getHMatr = (matrix) => {

            let result = [];
            for (let i = 0; i < matrix.length; i++) {
                let row = [];
                for (let j = 0; j < matrix[i].length; j++) {
                    row.push(matrix[i][j] !== matrix[j][i] ? 1 : 0);
                }
                result.push(row);
            }
            return result;
        };
        const H = getHMatr(D);
        const createTriangularMatrix = (dimension) => {

            const result = Array.from({length: dimension}, () =>
                Array.from({length: dimension}, () => 0));
            for (let i = 0; i < dimension; i++) {
                for (let j = 0; j < dimension; j++) {
                    if (i < j) result[i][j] = 1;
                }
            }
            return result;
        };
        const Tr = createTriangularMatrix(n);
        const getWMatr = (c, d, h, tr) => {
            let result = createZeroMatrix();
            for (let i = 0; i < n; i++) {
                for (let j = 0; j < n; j++) {
                    if (i < j) result[i][j] = (d[i][j] + h[i][j] * tr[i][j]) * c[i][j];
                    else result[i][j] = result[j][i];
                }
            }
            return result;
        };
        return getWMatr(C, D, H, Tr);
    };
    W = getWeightMatrix();
    console.log('\nW matrix:', W);

    class Graph {
        constructor() {
            this.list = new Map();
            this.next = null;
            this.vers = this.vertices();
            this.paintedW = createZeroMatrix();
        }

        addVertex(vertex) {
            if (!this.list.has(vertex)) {
                this.list.set(vertex, []);
                if (this.vers.length > 1)
                    this.next = this.vers.indexOf(vertex) + 1;
            }
        }

        addEdge(vertex1, vertex2) {
            if (!this.list.has(vertex1)) {
                this.addVertex(vertex1);
            }
            if (!this.list.has(vertex2)) {
                this.addVertex(vertex2);
            }
            this.list.get(vertex1).push(vertex2);
            this.list.get(vertex2).push(vertex1);
        }

        getNeighbors(vertex) {
            return this.list.get(vertex) || [];
        }

        getEdgeWeight(vertex1, vertex2) {
            return W[vertex1.index][vertex2.index];
        }

        paintWeight(vertex1, vertex2) {
            if (!this.paintedW[vertex1.index][vertex2.index]) this.paintedW[vertex1.index][vertex2.index] = 1;
            else return 1;
        }


        vertices() {
            return Array.from(this.list.keys());
        }
    }

    let graph = new Graph();

    const getGraph = () => {

        for (let i = 0; i < matrixUnOr.length; i++) {
            for (let j = 0; j < matrixUnOr[i].length; j++) {
                if (matrixUnOr[i][j] && i < j) {
                    graph.addEdge(ARRAY_VERTICES[i], ARRAY_VERTICES[j]);
                }

            }

        }
    }
    getGraph();

    const drawWeight = (vertex1, vertex2, context) => {

        let x = 0, y = 0;

        if (vertex1.index < 5 && vertex2.index < 5) {
            x = vertex1.x + 1 / 3.5 * (vertex2.x - vertex1.x);
            y = vertex1.y + 1 / 3.5 * (vertex2.y - vertex1.y);
        } else if (vertex1.index >= 5 && vertex2.index <= 5) {
            x = vertex1.x + 1 / 2.5 * (vertex2.x - vertex1.x);
            y = vertex1.y + 1 / 2.5 * (vertex2.y - vertex1.y);
        } else if (vertex1.index <= 5 && vertex2.index >= 5) {
            x = vertex1.x + 1 / 2.5 * (vertex2.x - vertex1.x);
            y = vertex1.y + 1 / 2.5 * (vertex2.y - vertex1.y);
        } else if (vertex1.index >= 5 && vertex2.index >= 5) {
            x = vertex1.x + 1 / 3.5 * (vertex2.x - vertex1.x);
            y = vertex1.y + 1 / 3.5 * (vertex2.y - vertex1.y);
        }
        context.font = "bold 15px Arial";
        context.fillStyle = "blue";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(W[vertex1.index][vertex2.index], x, y);
    };
    const wrapperWeightsInit = () => {
        for (let i = 0; i < graph.list.size; i++) {
            for (let j = 0; j < graph.list.get(ARRAY_VERTICES[i]).length; j++) {
                if (!graph.paintWeight(ARRAY_VERTICES[i], graph.list.get(ARRAY_VERTICES[i])[j])) {
                    drawWeight(ARRAY_VERTICES[i], graph.list.get(ARRAY_VERTICES[i])[j], ctx);
                    graph.paintWeight(ARRAY_VERTICES[i], graph.list.get(ARRAY_VERTICES[i])[j]);
                    graph.paintWeight(graph.list.get(ARRAY_VERTICES[i])[j], ARRAY_VERTICES[i]);
                }
            }
        }
    };
    wrapperWeightsInit();

    const findMinNonZero = (matrix) => {
        let min = Infinity;
        let ind = 0;
        let jnd = 0;
        for (let i = 0; i < matrix.length; i++) {
            for (let j = 0; j < matrix[i].length; j++) {
                if (matrix[i][j] !== 0 && matrix[i][j] < min) {
                    min = matrix[i][j];
                    ind = i;
                    jnd = j;
                }
            }
        }
        return [ind, jnd, min];
    };
    const paintVertex = (point1, context) => {

        context.beginPath();
        context.arc(point1.x, point1.y, RADIUS, 0, 2 * Math.PI, true);
        context.stroke();
        context.fillStyle = 'blue';
        context.fill();
        context.font = "14px Arial";
        context.fillStyle = "white";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(point1.index + 1, point1.x, point1.y);
    };

    const paintEdge = (point1, point2, context) => {
        context.beginPath();
        context.moveTo(point1.x, point1.y);
        context.lineTo(point2.x, point2.y);
        context.strokeStyle = 'green';
        graph.next = null;
        context.lineWidth = 3;
        context.stroke();
        context.lineWidth = 1;
        context.strokeStyle = 'black';
        paintVertex(point1, context);
        paintVertex(point2, context)

    };

    const checkElsExitsSimultaneously = (el1, el2, array) => {
        let c1 = false;
        let c2 = false;
        for (let i = 0; i < array.length; i++) {
            if (array.includes(el1)) c1 = true;
            if (array.includes(el2)) c2 = true;
        }
        return c1 && c2;
    };

    let Wcopy = getWeightMatrix();
    let tree = [];
    let weight = 0;
    const kruskal = () => {

        if (tree.length < n) {
            const edge = findMinNonZero(Wcopy);
            Wcopy[edge[0]][edge[1]] = 0;
            if (graph.getNeighbors(ARRAY_VERTICES[edge[0]]).includes(ARRAY_VERTICES[edge[1]]) && !checkElsExitsSimultaneously(edge[0], edge[1], tree)) {
                if (!tree.includes(edge[0]) || !tree.includes(edge[1])) {
                    paintEdge(ARRAY_VERTICES[edge[0]], ARRAY_VERTICES[edge[1]], ctx);
                    paintVertex(ARRAY_VERTICES[edge[0]], ctx);
                    paintVertex(ARRAY_VERTICES[edge[1]], ctx);
                    if (!tree.includes(edge[0])) tree.push(edge[0]);
                    if (!tree.includes(edge[1])) tree.push(edge[1]);
                    weight += W[edge[0]][edge[1]];
                }
            } else {
                kruskal();
            }
        }
    }

    nextButton.addEventListener('click', () => {
        kruskal();
        if (tree.length === n) {
            console.log('Weight of minimum cost spanning tree: ', weight);
            wrapperWeightsInit();
            nextButton.disabled = true;
        }
    });

});
export {W};