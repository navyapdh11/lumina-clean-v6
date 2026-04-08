import { describe, it, expect } from 'vitest';
import { 
  getAccessibleNodes, 
  findMenuNodeByHref, 
  findMenuNodeById,
  getBreadcrumb,
  hasPermission,
  type MenuNode 
} from '../lib/menu-graph';

describe('menu-graph', () => {
  describe('hasPermission', () => {
    it('should allow wildcard role access', () => {
      const node: MenuNode = { id: '1', label: 'Test', href: '/test', icon: 'home', permissions: ['*'] };
      expect(hasPermission(node, 'admin')).toBe(true);
      expect(hasPermission(node, 'any_role')).toBe(true);
    });

    it('should allow specific role access', () => {
      const node: MenuNode = { id: '1', label: 'Test', href: '/test', icon: 'home', permissions: ['admin', 'ops_manager'] };
      expect(hasPermission(node, 'admin')).toBe(true);
      expect(hasPermission(node, 'ops_manager')).toBe(true);
      expect(hasPermission(node, 'viewer')).toBe(false);
    });
  });

  describe('getAccessibleNodes', () => {
    it('should return all nodes for admin role', () => {
      const nodes = getAccessibleNodes('admin');
      expect(nodes.length).toBeGreaterThan(0);
    });

    it('should filter nodes by role', () => {
      const adminNodes = getAccessibleNodes('admin');
      const viewerNodes = getAccessibleNodes('viewer');
      expect(adminNodes.length).toBeGreaterThanOrEqual(viewerNodes.length);
    });
  });

  describe('findMenuNodeByHref', () => {
    it('should find node by href', async () => {
      const node = await findMenuNodeByHref('/dashboard', 'admin');
      expect(node).not.toBeNull();
      expect(node?.href).toBe('/dashboard');
    });

    it('should return null for non-existent href', async () => {
      const node = await findMenuNodeByHref('/non-existent', 'admin');
      expect(node).toBeNull();
    });
  });

  describe('findMenuNodeById', () => {
    it('should find node by id', async () => {
      const node = await findMenuNodeById('root', 'admin');
      expect(node).not.toBeNull();
      expect(node?.id).toBe('root');
    });
  });

  describe('getBreadcrumb', () => {
    it('should generate breadcrumb for nested node', () => {
      const breadcrumb = getBreadcrumb('kairos', 'admin');
      expect(breadcrumb.length).toBeGreaterThan(0);
      expect(breadcrumb[0].id).toBe('root');
    });
  });
});
