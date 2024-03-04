
//https://medium.com/@05.ankitarora/implementing-dijkstras-algorithm-in-javascript-af57c6bb3afd

class PriorityQueue {
  constructor() {
    this.items = [];
  }

  enqueue(item, priority) {
    this.items.push({ item, priority });
    this.items.sort((a, b) => a.priority - b.priority);
  }

  dequeue() {
    return this.items.shift().item;
  }

  isEmpty() {
    return this.items.length === 0;
  }
}

class Graaph {
  constructor() {
    this.nodes = new Map();
  }

  addNode(node) {
    this.nodes.set(node, []);
  }

  addEdge(node1, node2, weight) {
    this.nodes.get(node1).push({ node: node2, weight });
    this.nodes.get(node2).push({ node: node1, weight });
  }

  dijkstra(startNode, endNode) {
    const distances = new Map();
    const previous = new Map();
    const priorityQueue = new PriorityQueue();

    // Initialize distances and priority queue
    for (const node of this.nodes.keys()) {
      distances.set(node, node === startNode ? 0 : Infinity);
      priorityQueue.enqueue(node, distances.get(node));
      previous.set(node, null);
    }

    while (!priorityQueue.isEmpty()) {
      const currentNode = priorityQueue.dequeue();

      if (currentNode === endNode) {
        // Reconstruct the path from endNode to startNode
        const path = [];
        let current = endNode;
        while (current !== null) {
          path.unshift(current);
          current = previous.get(current);
        }
        return path;
      }

      const neighbors = this.nodes.get(currentNode);
      for (const neighbor of neighbors) {
        const newDistance = distances.get(currentNode) + neighbor.weight;
        if (newDistance < distances.get(neighbor.node)) {
          distances.set(neighbor.node, newDistance);
          previous.set(neighbor.node, currentNode);
          priorityQueue.enqueue(neighbor.node, newDistance);
        }
      }
    }

    return null; // No path found
  }
}



