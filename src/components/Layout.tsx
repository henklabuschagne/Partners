import { Outlet, Link, useLocation } from 'react-router';
import { LayoutDashboard, Users, FileText, Receipt, BarChart3, ClipboardList } from 'lucide-react';
import { useEffect } from 'react';
import { isInIframe, notifyParentReady } from '../utils/iframeHelper';
import { DevApiPanel } from './DevApiPanel';

export function Layout() {
  const location = useLocation();

  useEffect(() => {
    // Notify parent window when app is ready (if embedded in iframe)
    if (isInIframe()) {
      console.log('✓ App is running inside an iframe');
      notifyParentReady();
    } else {
      console.log('✓ App is running standalone');
    }
  }, []);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/partners', label: 'Partners', icon: Users },
    { path: '/contracts', label: 'Contracts', icon: FileText },
    { path: '/invoices', label: 'Invoices', icon: Receipt },
    { path: '/analytics', label: 'Analytics', icon: BarChart3 },
    { path: '/activity', label: 'Activity Log', icon: ClipboardList },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-border flex flex-col h-screen">
        <div className="p-6 border-b border-border">
          <h1 className="text-xl text-brand-main font-semibold">Partner Portal</h1>
          <p className="text-sm text-muted-foreground mt-1">Management System</p>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${
                  isActive
                    ? 'bg-brand-primary-light text-brand-primary font-medium'
                    : 'text-foreground/80 hover:bg-muted hover:text-foreground'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-brand-primary' : 'text-muted-foreground'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="pt-4 border-t border-border">
          <DevApiPanel />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
