const logger = {
  info: (...args: unknown[]) => console.log('[mcts-dfs]', ...args),
  warn: (...args: unknown[]) => console.warn('[mcts-dfs]', ...args),
  error: (...args: unknown[]) => console.error('[mcts-dfs]', ...args),
  debug: (...args: unknown[]) => console.debug('[mcts-dfs]', ...args),
};

export interface MCTSNode {
  id: string;
  action: string;
  state: Record<string, unknown>;
  visits: number;
  value: number;
  children: MCTSNode[];
  parent: MCTSNode | null;
  depth: number;
  reward: number;
  expanded: boolean;
}

export interface MCTSAction {
  name: string;
  description: string;
  execute: (state: Record<string, unknown>) => Promise<{ success: boolean; reward: number; nextState: Record<string, unknown> }>;
  heuristic?: (state: Record<string, unknown>) => number;
}

export interface MCTSConfig {
  iterations: number;
  explorationConstant: number;
  maxDepth: number;
  discountFactor: number;
  enableTranspositionTable: boolean;
  selectionPolicy: 'ucb1' | 'ucb1-tuned' | 'pucb';
  rolloutPolicy: 'random' | 'heuristic' | ' MCTs';
  pruneThreshold: number;
  parallelSimulations: number;
}

const DEFAULT_MCTS_CONFIG: MCTSConfig = {
  iterations: 1000,
  explorationConstant: 1.414,
  maxDepth: 20,
  discountFactor: 0.95,
  enableTranspositionTable: true,
  selectionPolicy: 'ucb1-tuned',
  rolloutPolicy: 'heuristic',
  pruneThreshold: 0.01,
  parallelSimulations: 4,
};

interface SearchResult {
  action: string;
  expectedValue: number;
  visits: number;
  reasoning: string[];
  treeDepth: number;
}

class TranspositionTable {
  private table = new Map<string, MCTSNode>();

  hash(state: Record<string, unknown>): string {
    const keys = Object.keys(state).sort();
    let hash = '';
    for (const key of keys) {
      hash += `${key}:${JSON.stringify(state[key])};`;
    }
    return hash;
  }

  get(key: string): MCTSNode | undefined {
    return this.table.get(key);
  }

  set(key: string, node: MCTSNode): void {
    if (this.table.size > 10000) {
      const firstKey = this.table.keys().next().value;
      if (firstKey) this.table.delete(firstKey);
    }
    this.table.set(key, node);
  }

  clear(): void {
    this.table.clear();
  }

  size(): number {
    return this.table.size;
  }
}

export class MCTSDFSAgent {
  private config: MCTSConfig;
  private root: MCTSNode | null = null;
  private actions: MCTSAction[] = [];
  private transpositionTable: TranspositionTable;
  private iterationCount = 0;
  private totalSimulations = 0;

  constructor(config: Partial<MCTSConfig> = {}) {
    this.config = { ...DEFAULT_MCTS_CONFIG, ...config };
    this.transpositionTable = new TranspositionTable();
  }

  setActions(actions: MCTSAction[]): void {
    this.actions = actions;
  }

  async search(initialState: Record<string, unknown>): Promise<SearchResult> {
    this.root = this.createNode('root', initialState, null, 0);
    this.iterationCount = 0;
    const startTime = Date.now();

    logger.info({ iterations: this.config.iterations }, 'Starting MCTS-DFS search');

    for (let i = 0; i < this.config.iterations; i++) {
      this.iterationCount++;
      await this.iteration(this.root!);
      
      if (i % 100 === 0) {
        logger.debug({ iteration: i, visits: this.root.visits }, 'MCTS progress');
      }
    }

    const elapsed = Date.now() - startTime;
    this.totalSimulations += this.config.iterations;

    const bestChild = this.selectBestChild(this.root, 0);
    const reasoning = this.extractReasoning(bestChild);

    logger.info({ 
      iterations: this.iterationCount, 
      elapsed,
      bestAction: bestChild.action,
      expectedValue: bestChild.value,
    }, 'MCTS-DFS search complete');

    return {
      action: bestChild.action,
      expectedValue: bestChild.value,
      visits: bestChild.visits,
      reasoning,
      treeDepth: this.getTreeDepth(this.root),
    };
  }

  private async iteration(root: MCTSNode): Promise<void> {
    let node = root;

    const path: MCTSNode[] = [node];

    while (node.expanded && node.children.length > 0 && node.depth < this.config.maxDepth) {
      node = this.selectChild(node);
      path.push(node);
    }

    if (!node.expanded && this.actions.length > 0) {
      this.expand(node);
    }

    if (node.children.length > 0) {
      node = this.selectChild(node);
      path.push(node);
    }

    const reward = await this.simulate(node);

    this.backpropagate(path, reward);

    if (this.config.enableTranspositionTable) {
      const hash = this.transpositionTable.hash(node.state);
      const existing = this.transpositionTable.get(hash);
      if (!existing || existing.visits < node.visits) {
        this.transpositionTable.set(hash, node);
      }
    }
  }

  private createNode(action: string, state: Record<string, unknown>, parent: MCTSNode | null, depth: number): MCTSNode {
    return {
      id: `${action}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      action,
      state: { ...state },
      visits: 0,
      value: 0,
      children: [],
      parent,
      depth,
      reward: 0,
      expanded: false,
    };
  }

  private selectChild(node: MCTSNode): MCTSNode {
    const ucbValues = node.children.map(child => this.ucbScore(child, node.visits));
    let bestIndex = 0;
    let bestValue = ucbValues[0];

    for (let i = 1; i < ucbValues.length; i++) {
      if (ucbValues[i] > bestValue) {
        bestValue = ucbValues[i];
        bestIndex = i;
      }
    }

    return node.children[bestIndex];
  }

  private ucbScore(node: MCTSNode, parentVisits: number): number {
    if (node.visits === 0) return Infinity;

    const exploitation = node.value / node.visits;
    const exploration = this.config.explorationConstant * Math.sqrt(Math.log(parentVisits) / node.visits);

    if (this.config.selectionPolicy === 'ucb1') {
      return exploitation + exploration;
    }

    if (this.config.selectionPolicy === 'ucb1-tuned') {
      const v = node.value / node.visits;
      const n = node.visits;
      const N = parentVisits;
      const ln = Math.log(N) / n;
      const variance = Math.min(0.25, v * (1 - v) + Math.sqrt(ln / n));
      return v + Math.sqrt(ln * variance);
    }

    return exploitation + exploration;
  }

  private expand(node: MCTSNode): void {
    for (const action of this.actions) {
      const childState = { ...node.state, lastAction: action.name };
      const child = this.createNode(action.name, childState, node, node.depth + 1);
      node.children.push(child);
    }
    node.expanded = true;
  }

  private async simulate(node: MCTSNode): Promise<number> {
    let currentState = { ...node.state };
    let totalReward = 0;
    let depth = node.depth;

    const maxRolloutDepth = this.config.maxDepth - depth;
    
    for (let i = 0; i < maxRolloutDepth; i++) {
      if (this.config.rolloutPolicy === 'random') {
        const randomAction = this.actions[Math.floor(Math.random() * this.actions.length)];
        const result = await randomAction.execute(currentState);
        totalReward += result.reward * Math.pow(this.config.discountFactor, i);
        if (!result.success) break;
        currentState = result.nextState;
      } else if (this.config.rolloutPolicy === 'heuristic') {
        let bestAction: MCTSAction | null = null;
        let bestScore = -Infinity;

        for (const action of this.actions) {
          if (action.heuristic) {
            const score = action.heuristic(currentState);
            if (score > bestScore) {
              bestScore = score;
              bestAction = action;
            }
          }
        }

        if (bestAction) {
          const result = await bestAction.execute(currentState);
          totalReward += result.reward * Math.pow(this.config.discountFactor, i);
          if (!result.success) break;
          currentState = result.nextState;
        } else {
          break;
        }
      }
    }

    return totalReward;
  }

  private backpropagate(path: MCTSNode[], reward: number): void {
    for (let i = path.length - 1; i >= 0; i--) {
      const node = path[i];
      node.visits++;
      node.value += reward * Math.pow(this.config.discountFactor, path.length - i - 1);
    }
  }

  private selectBestChild(node: MCTSNode, exploration: number): MCTSNode {
    let bestChild = node.children[0];
    let bestScore = -Infinity;

    for (const child of node.children) {
      const score = child.visits > 0 ? child.value / child.visits : 0;
      if (score > bestScore) {
        bestScore = score;
        bestChild = child;
      }
    }

    return bestChild;
  }

  private getTreeDepth(node: MCTSNode): number {
    if (node.children.length === 0) return node.depth;
    return Math.max(...node.children.map(c => this.getTreeDepth(c)));
  }

  private extractReasoning(node: MCTSNode): string[] {
    const reasoning: string[] = [];
    let current: MCTSNode | null = node;

    while (current && current.parent) {
      const parentRef: MCTSNode = current.parent;
      const siblings = parentRef.children;
      const siblingValues: number[] = [];
      for (const child of siblings) {
        siblingValues.push(child.visits > 0 ? child.value / child.visits : 0);
      }
      const avgValue = siblingValues.reduce((a, b) => a + b, 0) / siblingValues.length;
      const currentValue = current.visits > 0 ? current.value / current.visits : 0;

      reasoning.unshift(
        `Selected "${current.action}" (value: ${currentValue.toFixed(3)}, visits: ${current.visits}) ` +
        `vs average sibling value: ${avgValue.toFixed(3)}`
      );

      current = parentRef;
    }

    return reasoning;
  }

  getStats(): { iterations: number; totalSimulations: number; transpositionTableSize: number } {
    return {
      iterations: this.iterationCount,
      totalSimulations: this.totalSimulations,
      transpositionTableSize: this.transpositionTable.size(),
    };
  }

  reset(): void {
    this.root = null;
    this.transpositionTable.clear();
    this.iterationCount = 0;
  }
}

export function createMCTSAgent(config?: Partial<MCTSConfig>): MCTSDFSAgent {
  return new MCTSDFSAgent(config);
}

export const mctsConfig = DEFAULT_MCTS_CONFIG;

export default MCTSDFSAgent;
