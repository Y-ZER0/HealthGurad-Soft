import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, UserCircle, Stethoscope, Menu, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface LayoutProps {
  children: React.ReactNode;
  userRole: 'patient' | 'doctor';
  onRoleChange: (role: 'patient' | 'doctor') => void;
}

export const Layout = ({ children, userRole, onRoleChange }: LayoutProps) => {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const patientLinks = [
    { to: '/', label: 'Dashboard', icon: Heart },
    { to: '/log-vitals', label: 'Log Vitals', icon: Heart },
    { to: '/history', label: 'History', icon: Heart },
    { to: '/medications', label: 'Medications', icon: Heart },
    { to: '/alerts', label: 'Alerts', icon: Heart },
  ];

  const doctorLinks = [
    { to: '/doctor', label: 'Dashboard', icon: Stethoscope },
    { to: '/doctor/patients', label: 'Patients', icon: UserCircle },
    { to: '/doctor/alerts', label: 'Alerts', icon: Heart },
  ];

  const links = userRole === 'patient' ? patientLinks : doctorLinks;

  const NavLinks = ({ mobile = false }) => (
    <>
      {links.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          onClick={() => mobile && setMobileMenuOpen(false)}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
            location.pathname === to
              ? 'bg-primary text-primary-foreground font-semibold'
              : 'hover:bg-muted'
          }`}
        >
          <Icon className="h-5 w-5" />
          {label}
        </Link>
      ))}
    </>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-card border-b-2 border-border sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Heart className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-2xl font-bold text-primary">HealthGuard</h1>
              <p className="text-sm text-muted-foreground">Health Monitoring System</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Role Switcher */}
            <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
              <Button
                variant={userRole === 'patient' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onRoleChange('patient')}
                className="btn-large"
              >
                <UserCircle className="h-5 w-5 mr-2" />
                Patient
              </Button>
              <Button
                variant={userRole === 'doctor' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onRoleChange('doctor')}
                className="btn-large"
              >
                <Stethoscope className="h-5 w-5 mr-2" />
                Doctor
              </Button>
            </div>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild className="lg:hidden">
                <Button variant="outline" size="icon">
                  {mobileMenuOpen ? <X /> : <Menu />}
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <nav className="flex flex-col gap-2 mt-8">
                  <NavLinks mobile />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:block border-t border-border">
          <div className="container mx-auto px-4 py-2 flex gap-2">
            <NavLinks />
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-auto">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-muted-foreground">
          <p>&copy; 2025 HealthGuard. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};
