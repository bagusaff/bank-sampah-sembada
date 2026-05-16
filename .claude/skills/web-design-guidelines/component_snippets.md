# Design System - Reusable Component Snippets

This document contains copy-paste ready components and code snippets that you can use directly in your refactored application.

---

## Table of Contents
1. [Custom Checkbox](#custom-checkbox)
2. [Stat Card](#stat-card)
3. [Navigation Item](#navigation-item)
4. [Metric Card](#metric-card)
5. [List Item Card](#list-item-card)
6. [Modal Structure](#modal-structure)
7. [Form Input](#form-input)
8. [Button Variants](#button-variants)
9. [Page Header](#page-header)
10. [Loading State](#loading-state)

---

## Custom Checkbox

```tsx
interface CustomCheckboxProps {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
}

export const CustomCheckbox: React.FC<CustomCheckboxProps> = ({ 
  checked, 
  indeterminate, 
  onChange 
}) => (
  <div 
    onClick={(e) => { e.stopPropagation(); onChange(); }}
    className={`
      w-5 h-5 rounded-md border-[1.5px] flex items-center justify-center cursor-pointer 
      transition-all duration-200 group relative
      ${checked || indeterminate 
        ? 'bg-brand-600 border-brand-600 shadow-sm shadow-brand-200' 
        : 'bg-white border-slate-300 hover:border-brand-400 hover:bg-slate-50'
      }
    `}
  >
    {checked && !indeterminate && (
      <Check size={12} strokeWidth={4} className="text-white animate-in zoom-in duration-200" />
    )}
    {indeterminate && (
      <Minus size={12} strokeWidth={4} className="text-white animate-in zoom-in duration-200" />
    )}
  </div>
);
```

---

## Stat Card

```tsx
interface StatCardProps {
  title: string;
  value: string | number;
  subtext?: string;
  icon: React.ReactNode;
  color: 'blue' | 'purple' | 'emerald' | 'orange';
}

export const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  subtext, 
  icon, 
  color 
}) => {
  const styles = {
    blue: { 
      bg: 'bg-blue-50', 
      text: 'text-blue-600', 
      ring: 'ring-blue-100', 
      border: 'border-blue-100' 
    },
    purple: { 
      bg: 'bg-purple-50', 
      text: 'text-purple-600', 
      ring: 'ring-purple-100', 
      border: 'border-purple-100' 
    },
    emerald: { 
      bg: 'bg-emerald-50', 
      text: 'text-emerald-600', 
      ring: 'ring-emerald-100', 
      border: 'border-emerald-100' 
    },
    orange: { 
      bg: 'bg-orange-50', 
      text: 'text-orange-600', 
      ring: 'ring-orange-100', 
      border: 'border-orange-100' 
    },
  };
  
  const s = styles[color];

  return (
    <div className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden">
      <div className="relative z-10 flex flex-col h-full justify-between gap-4">
        <div className="flex items-start justify-between">
          <div className={`w-12 h-12 rounded-2xl ${s.bg} ${s.text} flex items-center justify-center border ${s.border} shadow-sm group-hover:scale-110 transition-transform duration-300`}>
            {React.cloneElement(icon as React.ReactElement, { size: 22 })}
          </div>
          {subtext && (
            <div className={`text-[10px] font-bold ${s.text} ${s.bg} px-2.5 py-1 rounded-full flex items-center gap-1 border ${s.border}`}>
              <TrendingUp size={10} /> {subtext}
            </div>
          )}
        </div>
        <div>
          <h3 className="text-3xl font-black text-slate-900 tracking-tight mb-1">{value}</h3>
          <p className="text-sm font-bold text-slate-500">{title}</p>
        </div>
      </div>
    </div>
  );
};
```

---

## Navigation Item

```tsx
interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

export const NavItem: React.FC<NavItemProps> = ({ to, icon, label, isActive }) => {
  return (
    <Link
      to={to}
      className={`group flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-200 border ${
        isActive 
          ? 'bg-brand-50/60 border-brand-100/50 text-brand-700 shadow-sm' 
          : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <div className="flex items-center gap-3.5">
        {React.cloneElement(icon as React.ReactElement<any>, { 
          size: 20, 
          className: `transition-colors ${isActive ? 'text-brand-600' : 'text-slate-400 group-hover:text-slate-600'}` 
        })}
        <span className="text-sm font-bold tracking-tight">{label}</span>
      </div>
      {isActive && <div className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-pulse" />}
    </Link>
  );
};
```

---

## Metric Card

```tsx
interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  color: 'blue' | 'green' | 'purple' | 'yellow';
}

export const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon, color }) => {
  const getColors = (c: string) => {
    switch(c) {
      case 'blue': return 'bg-blue-50 text-blue-600';
      case 'green': return 'bg-emerald-50 text-emerald-600';
      case 'purple': return 'bg-purple-50 text-purple-600';
      case 'yellow': return 'bg-amber-50 text-amber-600';
      default: return 'bg-slate-50 text-slate-600';
    }
  };

  return (
    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
      <div>
        <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">{title}</p>
        <h3 className="text-2xl font-black text-slate-900 tracking-tight">{value}</h3>
      </div>
      <div className={`p-3 rounded-xl ${getColors(color)}`}>
        {icon}
      </div>
    </div>
  );
};
```

---

## List Item Card

```tsx
interface ListItemProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  timeOrBadge?: string;
  onClick?: () => void;
  highlighted?: boolean;
}

export const ListItemCard: React.FC<ListItemProps> = ({ 
  icon, 
  title, 
  description, 
  timeOrBadge, 
  onClick,
  highlighted 
}) => {
  return (
    <div 
      onClick={onClick}
      className={`flex items-start gap-4 p-4 rounded-2xl border transition-all cursor-pointer group
        ${highlighted 
          ? 'bg-white border-slate-100 shadow-md' 
          : 'bg-slate-50/50 border-slate-100 hover:bg-white hover:shadow-md hover:border-slate-100'
        }`}
    >
      <div className="p-2.5 rounded-xl bg-white border border-slate-100 text-brand-600 shadow-sm flex-shrink-0">
        {React.cloneElement(icon as React.ReactElement, { size: 16 })}
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h4 className="text-sm font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
            {title}
          </h4>
          {timeOrBadge && (
            <span className="text-[10px] font-bold text-slate-400">{timeOrBadge}</span>
          )}
        </div>
        <p className="text-xs text-slate-500 font-medium mt-1">{description}</p>
      </div>
    </div>
  );
};
```

---

## Modal Structure

```tsx
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
  }[];
}

export const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  actions 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-black text-slate-900">{title}</h2>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {children}
        </div>

        {/* Modal Footer */}
        {actions && actions.length > 0 && (
          <div className="p-6 border-t border-slate-100 flex gap-3">
            {actions.map((action, index) => (
              <button
                key={index}
                onClick={action.onClick}
                className={`flex-1 px-4 py-2.5 font-bold rounded-xl text-sm transition-all
                  ${action.variant === 'primary' 
                    ? 'bg-brand-600 text-white hover:bg-brand-700' 
                    : action.variant === 'danger'
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-slate-100 text-slate-900 hover:bg-slate-200'
                  }`}
              >
                {action.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
```

---

## Form Input

```tsx
interface FormInputProps {
  label?: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
}

export const FormInput: React.FC<FormInputProps> = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error,
  required,
  disabled
}) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-bold text-slate-900">
          {label}
          {required && <span className="text-red-600 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`w-full px-4 py-2.5 rounded-xl border transition-all outline-none
          ${error 
            ? 'border-red-300 focus:border-red-600 focus:ring-2 focus:ring-red-100' 
            : 'border-slate-300 focus:border-brand-600 focus:ring-2 focus:ring-brand-100'
          }
          ${disabled ? 'bg-slate-50 cursor-not-allowed opacity-60' : 'bg-white'}
          placeholder-slate-400`}
      />
      {error && <p className="text-xs text-red-600 font-medium">{error}</p>}
    </div>
  );
};
```

---

## Button Variants

```tsx
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'brand' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading,
  icon,
  iconPosition = 'right',
  children,
  disabled,
  className,
  ...props
}) => {
  const baseClasses = 'font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200',
    secondary: 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm',
    brand: 'bg-brand-600 text-white hover:bg-brand-700 shadow-lg shadow-brand-200',
    ghost: 'bg-transparent text-slate-600 hover:bg-slate-50',
    danger: 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-200',
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-xs',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      disabled={disabled || isLoading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className || ''}`}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 size={16} className="animate-spin" />
          {children}
        </>
      ) : (
        <>
          {icon && iconPosition === 'left' && icon}
          {children}
          {icon && iconPosition === 'right' && icon}
        </>
      )}
    </button>
  );
};
```

---

## Page Header

```tsx
interface PageHeaderProps {
  icon?: React.ReactNode;
  date?: string;
  title: string;
  subtitle?: string;
  actions?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  }[];
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  icon, 
  date, 
  title, 
  subtitle, 
  actions 
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
      {/* Left Section */}
      <div>
        {date && (
          <div className="flex items-center gap-2 mb-2">
            {icon || <Sun size={20} className="text-orange-400" />}
            <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              {date}
            </span>
          </div>
        )}
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-slate-500 font-medium text-lg mt-2 max-w-xl">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right Section - Action Buttons */}
      {actions && actions.length > 0 && (
        <div className="flex gap-3">
          {actions.map((action, index) => (
            <button
              key={index}
              onClick={action.onClick}
              className={`px-5 py-2.5 font-bold rounded-xl text-sm transition-all
                ${action.variant === 'primary'
                  ? 'bg-slate-900 text-white hover:bg-slate-800 shadow-lg shadow-slate-200'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 shadow-sm'
                }`}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
```

---

## Loading State

```tsx
export const LoadingState: React.FC<{ message?: string }> = ({ 
  message = 'Loading...' 
}) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] gap-6">
      <div className="relative">
        <div className="absolute inset-0 bg-brand-200 rounded-full blur-xl opacity-20 animate-pulse"></div>
        <Loader2 size={48} className="animate-spin text-brand-600 relative z-10" />
      </div>
      <p className="text-slate-400 font-bold text-xs uppercase tracking-[0.2em] animate-pulse">
        {message}
      </p>
    </div>
  );
};
```

---

## Additional Helper Components

### Badge

```tsx
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'error' | 'warning' | 'info';
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default' }) => {
  const classes = {
    default: 'bg-slate-100 text-slate-700 border-slate-200',
    success: 'bg-emerald-50 text-emerald-600 border-emerald-100',
    error: 'bg-red-50 text-red-600 border-red-100',
    warning: 'bg-orange-50 text-orange-600 border-orange-100',
    info: 'bg-blue-50 text-blue-600 border-blue-100',
  };

  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold border ${classes[variant]}`}>
      {children}
    </span>
  );
};
```

### Card

```tsx
interface CardProps {
  children: React.ReactNode;
  clickable?: boolean;
  onClick?: () => void;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ 
  children, 
  clickable, 
  onClick, 
  className 
}) => {
  return (
    <div
      onClick={onClick}
      className={`bg-white p-6 rounded-3xl border border-slate-100 shadow-[0_2px_20px_-4px_rgba(0,0,0,0.04)] 
        ${clickable ? 'hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)] hover:-translate-y-1 cursor-pointer' : ''} 
        transition-all duration-300
        ${className || ''}`}
    >
      {children}
    </div>
  );
};
```

### Section Label

```tsx
interface SectionLabelProps {
  children: React.ReactNode;
}

export const SectionLabel: React.FC<SectionLabelProps> = ({ children }) => {
  return (
    <div className="px-4 pb-2">
      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
        {children}
      </span>
    </div>
  );
};
```

---

## Usage Examples

### Using the Components Together

```tsx
// Page with Header and Stats
export const MyPage: React.FC = () => {
  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <PageHeader
        title="Dashboard"
        subtitle="Welcome back to your workspace"
        date={new Date().toLocaleDateString()}
        actions={[
          { label: 'View Reports', variant: 'secondary', onClick: () => {} },
          { label: 'Start Outreach', variant: 'primary', onClick: () => {} }
        ]}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Calls Today" value={45} icon={<Phone />} color="blue" />
        <StatCard title="Meetings" value={12} icon={<Calendar />} color="purple" />
        <StatCard title="Total Leads" value={238} icon={<Users />} color="emerald" />
        <StatCard title="Conversion" value="18.5%" icon={<Target />} color="orange" />
      </div>

      {/* Content Cards */}
      <Card>
        <h2 className="text-xl font-black text-slate-900 mb-4">Recent Activities</h2>
        <div className="space-y-4">
          {activities.map((activity) => (
            <ListItemCard
              key={activity.id}
              icon={<Clock />}
              title={activity.title}
              description={activity.description}
              timeOrBadge={activity.time}
            />
          ))}
        </div>
      </Card>
    </div>
  );
};
```

---

**All components use:**
- Tailwind CSS for styling
- Lucide React for icons
- TypeScript for type safety
- React for component structure

Copy and paste these components into your application and customize as needed!
