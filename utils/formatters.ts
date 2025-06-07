export const formatCurrency = (amount: number, showValue: boolean = true): string => {
  return showValue ? `₦${amount.toLocaleString()}` : '••••••••';
};

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

export const formatTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) {
    return 'Good morning ☀️';
  } else if (hour >= 12 && hour < 17) {
    return 'Good afternoon 🌤️';
  } else if (hour >= 17 && hour < 21) {
    return 'Good evening 🌅';
  } else {
    return 'Good night 🌙';
  }
};

export const getDaySuffix = (day: number): string => {
  if (day > 3 && day < 21) return 'th';
  switch (day % 10) {
    case 1: return 'st';
    case 2: return 'nd';
    case 3: return 'rd';
    default: return 'th';
  }
};

export const calculateProgress = (completed: number, total: number): number => {
  return Math.round((completed / total) * 100);
};