'use strict';

import {W} from './minBackbone.js';

export const randm = (n) => {

    Math.seedrandom(3220);

    let matrix = [];

    for (let i = 0; i < n; i++) {
        let row = [];
        for (let j = 0; j < n; j++) {
            let randomNumber = Math.random() * 2.0;
            row.push(randomNumber);
        }
        matrix.push(row);
    }

    return matrix;
};

export const mulmr = (matrix, k) => {

    const result = [];

    for (let i = 0; i < matrix.length; i++) {
        let row = [];
        for (let j = 0; j < matrix[i].length; j++) {
            row.push(matrix[i][j] * k);
            row[j] = row[j] < 1 ? 0 : 1;
        }
        result.push(row);
    }

    return result;
};

export const printMatrix = (matrix) => {

    let result = "";
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            result += matrix[i][j] + " ";
        }
        console.log(result);
        result = "";
    }
};

const n3 = 2, n4 = 0;
export const n = 10 + n3;
export const k = 1.0 - n3 * 0.01 - n4 * 0.005 - 0.05;

const randomMatrix = randm(n);

export const adjMatrixUnOrGr = (matrix) => {
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === 1) matrix [j][i] = 1;
        }
    }
    return matrix;
};

export const matrixUnOr = adjMatrixUnOrGr(mulmr(randomMatrix, k)); //матриця суміжності неорієнтованого графа
console.log('Adjacency matrix for unoriented graph: ');
printMatrix(matrixUnOr);


const RADIUS_OF_GRAPH = 200;
const GRAPH_CENTER_X = 300;
const GRAPH_CENTER_Y = 300;
export const RADIUS = 20;

export class Point {
    constructor(x, y, index) {
        this.x = x;
        this.y = y;
        this.index = index;
    }
}

const getArrayOfVertices = () => {
    const vertices = [];
    for (let i = 0; i < n; i++) {
        const angle = Math.PI - Math.PI / 6 * i;
        const x = RADIUS_OF_GRAPH * Math.cos(angle) + GRAPH_CENTER_X;
        const y = RADIUS_OF_GRAPH * Math.sin(angle) + GRAPH_CENTER_Y;
        const vertex = new Point(x, y, i);
        vertices.push(vertex);
    }
    return vertices;
};
export const ARRAY_VERTICES = getArrayOfVertices();

export const getVertex = (index) => {
    for (let i = 0; i < ARRAY_VERTICES.length; i++) {
        if (i === index) {
            return new Point(ARRAY_VERTICES[i].x, ARRAY_VERTICES[i].y, i);
        }
    }
};

const fillVertex = (point1, point2, context) => {
    context.beginPath();
    context.arc(point1.x, point1.y, RADIUS, 0, 2 * Math.PI, true);
    context.stroke();
    context.fillStyle = 'white';
    context.fill();
    context.font = "14px Arial";
    context.fillStyle = "black";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(point1.index + 1, point1.x, point1.y);
    context.beginPath();
    context.arc(point2.x, point2.y, RADIUS, 0, 2 * Math.PI, true);
    context.stroke();
    context.fillStyle = 'white';
    context.fill();
    context.font = "14px Arial";
    context.fillStyle = "black";
    context.textAlign = "center";
    context.textBaseline = "middle";
    context.fillText(point2.index + 1, point2.x, point2.y);
};

const drawLoop = (point, context) => {
    const angle = Math.PI + point.index * Math.PI / 6;
    let x1 = point.x + 2 * RADIUS * Math.cos(angle);
    let y1 = point.y - 2 * RADIUS * Math.sin(angle);
    const newPoint = new Point(x1, y1, point.index);
    context.beginPath();
    context.arc(x1, y1, RADIUS, 0, 2 * Math.PI, true);
    context.stroke();
    context.font = "bold 16px Arial";
    context.fillStyle = "blue";
    context.textAlign = "center";
    context.textBaseline = "middle";
    let x2 = point.x + 3 * RADIUS * Math.cos(angle);
    let y2 = point.y - 3 * RADIUS * Math.sin(angle);
    context.fillText(W[point.index][point.index], x2, y2);
};

const drawEdge = (point1, point2, context) => {
    context.beginPath();
    context.moveTo(point1.x, point1.y);
    context.lineTo(point2.x, point2.y);
    context.stroke();
    fillVertex(point1, point2, context);
};

const drawUnorientedGraph = () => {
    const canvas = document.getElementById("canvas");
    const context = canvas.getContext("2d");
    let index = 0;
    const drawVertex = () => {
        const vertex = getVertex(index);
        context.fillStyle = "white";
        context.beginPath();
        context.arc(vertex.x, vertex.y, RADIUS, 0, Math.PI * 2, true);
        context.stroke();
        context.fill();
        index++;
        context.font = "14px Arial";
        context.fillStyle = "black";
        context.textAlign = "center";
        context.textBaseline = "middle";
        context.fillText(index, vertex.x, vertex.y);
        if (index === n) {
            clearInterval(interval_id);
        }
        if (index === n) { // Check if all vertices are drawn
            let j = 0;
            let i = 0;
            const interval_ID = setInterval(() => {
                const vertex1 = getVertex(i);
                const vertex2 = getVertex(j);
                if (i === j && matrixUnOr[i][j]) {
                    drawLoop(vertex1, context);
                    j++;
                } else if (i < j && matrixUnOr[i][j]) {
                    drawEdge(vertex1, vertex2, context);
                    j++;
                } else if (matrixUnOr[i][j] && matrixUnOr[j][i]) {
                    j++;
                } else if (matrixUnOr[i][j] && i > j) {
                    drawEdge(vertex1, vertex2, context);
                    j++;
                } else j++;
                if (j === n) {
                    i++;
                    j = 0;
                }
                if (i === n) {
                    clearInterval(interval_ID);
                }
            }, 1);
        }
    };
    const interval_id = setInterval(drawVertex, 1);
    return context;
};
export const ctx = drawUnorientedGraph();