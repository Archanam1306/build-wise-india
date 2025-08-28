export interface User {
  id: string;
  email: string;
  role: 'contractor' | 'site-manager' | 'customer';
  name: string;
  phone: string;
  assignedProjects?: string[];
}

export interface Project {
  id: string;
  name: string;
  location: string;
  status: 'In Progress' | 'Completed' | 'On Hold' | 'Planning';
  progress: number;
  siteManagerId: string;
  siteManagerEmail: string;
  siteManagerName: string;
  customerId: string;
  contractorId: string;
  startDate: string;
  estimatedCompletion: string;
  totalBudget: number;
  spentAmount: number;
  lastUpdate: string;
  description: string;
  blueprints: Blueprint[];
  dailyUpdates: DailyUpdate[];
  payments: Payment[];
  materials: Material[];
  contacts: Contact[];
  ganttTasks: GanttTask[];
}

export interface Blueprint {
  id: string;
  type: 'elevation' | 'electrical' | 'paint' | 'structure';
  name: string;
  imageUrl: string;
  uploadDate: string;
  projectId: string;
}

export interface DailyUpdate {
  id: string;
  date: string;
  images: string[];
  caption: string;
  category: 'Plumbing' | 'Framing' | 'Roofing' | 'Electrical' | 'Painting' | 'Foundation' | 'General';
  uploadedBy: string;
}

export interface Payment {
  id: string;
  amount: number;
  description: string;
  status: 'pending' | 'approved' | 'rejected' | 'paid';
  raisedBy: string;
  raisedDate: string;
  approvedDate?: string;
  type: 'labour' | 'materials' | 'machinery' | 'advance';
  projectId: string;
}

export interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  pricePerUnit: number;
  totalCost: number;
  vendor: string;
  purchaseDate: string;
  category: string;
  threshold: number;
}

export interface Contact {
  id: string;
  name: string;
  role: 'Site Engineer' | 'Painter' | 'Contractor' | 'Accountant' | 'Owner' | 'Supervisor';
  phone: string;
  whatsapp: string;
  email: string;
}

export interface GanttTask {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  progress: number;
  dependencies: string[];
  status: 'completed' | 'in-progress' | 'delayed' | 'pending';
  assignee: string;
  comments: string[];
}
