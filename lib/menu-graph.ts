export interface MenuNode {
  id: string;
  label: string;
  href: string;
  icon: string;
  permissions: string[];
  children?: string[];
  metadata?: Record<string, unknown>;
}

export interface MenuGraph {
  nodes: Map<string, MenuNode>;
  adjacency: Map<string, string[]>;
}

const MENU_NODES: MenuNode[] = [
  {
    id: 'root',
    label: 'Dashboard',
    href: '/dashboard',
    icon: 'dashboard',
    permissions: ['*'],
    children: ['bookings', 'calendar', 'analytics', 'agents', 'settings'],
  },
  {
    id: 'bookings',
    label: 'Bookings',
    href: '/dashboard/bookings',
    icon: 'calendar-check',
    permissions: ['admin', 'ops_manager', 'cleaner'],
    children: ['booking-detail', 'booking-new'],
  },
  {
    id: 'calendar',
    label: 'Calendar',
    href: '/dashboard/calendar',
    icon: 'calendar',
    permissions: ['admin', 'ops_manager', 'cleaner'],
    children: [],
  },
  {
    id: 'analytics',
    label: 'Analytics',
    href: '/dashboard/analytics',
    icon: 'bar-chart',
    permissions: ['admin', 'ops_manager', 'viewer'],
    children: ['revenue', 'performance', 'customers'],
  },
  {
    id: 'agents',
    label: 'AI Agents',
    href: '/dashboard/agents',
    icon: 'bot',
    permissions: ['admin', 'ops_manager'],
    children: ['kairos', 'krites', 'rag-dispatch'],
  },
  {
    id: 'settings',
    label: 'Settings',
    href: '/dashboard/settings',
    icon: 'settings',
    permissions: ['admin'],
    children: ['profile', 'team', 'integrations', 'billing'],
  },
  {
    id: 'booking-detail',
    label: 'Booking Detail',
    href: '/dashboard/bookings/[id]',
    icon: 'file-text',
    permissions: ['admin', 'ops_manager', 'cleaner'],
    children: [],
  },
  {
    id: 'booking-new',
    label: 'New Booking',
    href: '/dashboard/bookings/new',
    icon: 'plus-circle',
    permissions: ['admin', 'ops_manager'],
    children: [],
  },
  {
    id: 'revenue',
    label: 'Revenue',
    href: '/dashboard/analytics/revenue',
    icon: 'dollar-sign',
    permissions: ['admin', 'ops_manager'],
    children: [],
  },
  {
    id: 'performance',
    label: 'Performance',
    href: '/dashboard/analytics/performance',
    icon: 'trending-up',
    permissions: ['admin', 'ops_manager'],
    children: [],
  },
  {
    id: 'customers',
    label: 'Customers',
    href: '/dashboard/analytics/customers',
    icon: 'users',
    permissions: ['admin', 'ops_manager'],
    children: [],
  },
  {
    id: 'kairos',
    label: 'KAIROS',
    href: '/dashboard/agents/kairos',
    icon: 'brain',
    permissions: ['admin'],
    children: [],
  },
  {
    id: 'krites',
    label: 'Krites Cache',
    href: '/dashboard/agents/krites',
    icon: 'database',
    permissions: ['admin'],
    children: [],
  },
  {
    id: 'rag-dispatch',
    label: 'RAG Dispatch',
    href: '/dashboard/agents/rag-dispatch',
    icon: 'search',
    permissions: ['admin'],
    children: [],
  },
  {
    id: 'profile',
    label: 'Profile',
    href: '/dashboard/settings/profile',
    icon: 'user',
    permissions: ['admin'],
    children: [],
  },
  {
    id: 'team',
    label: 'Team',
    href: '/dashboard/settings/team',
    icon: 'users',
    permissions: ['admin'],
    children: [],
  },
  {
    id: 'integrations',
    label: 'Integrations',
    href: '/dashboard/settings/integrations',
    icon: 'plug',
    permissions: ['admin'],
    children: [],
  },
  {
    id: 'billing',
    label: 'Billing',
    href: '/dashboard/settings/billing',
    icon: 'credit-card',
    permissions: ['admin'],
    children: [],
  },
];

function buildMenuGraph(): MenuGraph {
  const nodes = new Map<string, MenuNode>();
  const adjacency = new Map<string, string[]>();

  for (const node of MENU_NODES) {
    nodes.set(node.id, node);
    if (node.children && node.children.length > 0) {
      adjacency.set(node.id, node.children);
    }
  }

  return { nodes, adjacency };
}

let cachedGraph: MenuGraph | null = null;

function getMenuGraph(): MenuGraph {
  if (!cachedGraph) {
    cachedGraph = buildMenuGraph();
  }
  return cachedGraph;
}

export function hasPermission(node: MenuNode, userRole: string): boolean {
  if (node.permissions.includes('*')) return true;
  return node.permissions.includes(userRole);
}

export async function dfsNavigate(
  startId: string,
  predicate: (node: MenuNode) => boolean,
  userRole: string
): Promise<MenuNode | null> {
  const graph = getMenuGraph();
  const visited = new Set<string>();
  const stack: string[] = [startId];

  while (stack.length > 0) {
    const currentId = stack.pop()!;
    if (visited.has(currentId)) continue;

    const node = graph.nodes.get(currentId);
    if (!node || !hasPermission(node, userRole)) continue;

    visited.add(currentId);

    if (predicate(node)) {
      return node;
    }

    const children = graph.adjacency.get(currentId) || [];
    for (const childId of [...children].reverse()) {
      if (!visited.has(childId)) {
        stack.push(childId);
      }
    }
  }

  return null;
}

export function getAccessibleNodes(userRole: string): MenuNode[] {
  const graph = getMenuGraph();
  const accessible: MenuNode[] = [];
  const nodeArray = Array.from(graph.nodes.values());

  for (const node of nodeArray) {
    if (hasPermission(node, userRole)) {
      accessible.push(node);
    }
  }

  return accessible;
}

export function getAllAccessiblePaths(
  startId: string,
  userRole: string
): string[][] {
  const graph = getMenuGraph();
  const paths: string[][] = [];
  const currentPath: string[] = [];

  function dfs(nodeId: string): void {
    const node = graph.nodes.get(nodeId);
    if (!node || !hasPermission(node, userRole)) return;

    currentPath.push(nodeId);
    paths.push([...currentPath]);

    const children = graph.adjacency.get(nodeId) || [];
    for (const childId of children) {
      dfs(childId);
    }

    currentPath.pop();
  }

  dfs(startId);
  return paths;
}

export async function findMenuNodeByHref(
  href: string,
  userRole: string
): Promise<MenuNode | null> {
  return dfsNavigate(
    'root',
    (node) => node.href === href,
    userRole
  );
}

export async function findMenuNodeById(
  id: string,
  userRole: string
): Promise<MenuNode | null> {
  return dfsNavigate(
    'root',
    (node) => node.id === id,
    userRole
  );
}

export function getBreadcrumb(
  nodeId: string,
  userRole: string
): MenuNode[] {
  const graph = getMenuGraph();
  const breadcrumb: MenuNode[] = [];
  const visited = new Set<string>();
  const parentMap = new Map<string, string>();

  const adjacencyArray = Array.from(graph.adjacency.entries());
  for (const [parentId, children] of adjacencyArray) {
    for (const childId of children) {
      parentMap.set(childId, parentId);
    }
  }

  function buildPath(currentId: string): boolean {
    if (visited.has(currentId)) return false;
    visited.add(currentId);

    const node = graph.nodes.get(currentId);
    if (!node || !hasPermission(node, userRole)) return false;

    const parentId = parentMap.get(currentId);
    if (parentId) {
      if (buildPath(parentId)) {
        breadcrumb.push(node);
        return true;
      }
    }

    if (currentId === nodeId) {
      breadcrumb.push(node);
      return true;
    }

    return false;
  }

  buildPath(nodeId);
  return breadcrumb.reverse();
}

export const menuNavigator = {
  getMenuGraph,
  dfsNavigate,
  getAccessibleNodes,
  getAllAccessiblePaths,
  findMenuNodeByHref,
  findMenuNodeById,
  getBreadcrumb,
  hasPermission,
};

export default menuNavigator;
