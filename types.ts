
export interface NavItem {
  label: string;
  href: string;
}

export interface CoreValue {
  title: string;
  subtitle: string;
  icon: string;
  description: string;
  inAction: string;
}

export interface Voice {
  id: number;
  content: string;
  author: string;
  role: string;
  avatar: string;
}
