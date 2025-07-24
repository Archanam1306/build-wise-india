import { User, Project, Contact } from '@/types';

export const mockUsers: User[] = [
  { id: 'u1', name: 'Rajesh Kumar', email: 'contractor@buildtech.com', role: 'contractor', phone: '+91 98765 43210' },
  { id: 'u2', name: 'Arjun Sharma', email: 'siteman1@buildtech.com', role: 'site-manager', phone: '+91 87654 32109' },
  { id: 'u3', name: 'Priya Singh', email: 'siteman2@buildtech.com', role: 'site-manager', phone: '+91 76543 21098' },
  { id: 'u4', name: 'Vikram Patel', email: 'siteman3@buildtech.com', role: 'site-manager', phone: '+91 65432 10987' },
  { id: 'u5', name: 'Amit Gupta', email: 'customer1@gmail.com', role: 'customer', phone: '+91 54321 09876' },
  { id: 'u6', name: 'Sunita Reddy', email: 'customer2@gmail.com', role: 'customer', phone: '+91 43210 98765' },
  { id: 'u7', name: 'Ravi Krishnan', email: 'customer3@gmail.com', role: 'customer', phone: '+91 32109 87654' },
  { id: 'u8', name: 'Meera Joshi', email: 'customer4@gmail.com', role: 'customer', phone: '+91 21098 76543' },
  { id: 'u9', name: 'Deepak Agarwal', email: 'customer5@gmail.com', role: 'customer', phone: '+91 10987 65432' },
  { id: 'u10', name: 'Kavitha Nair', email: 'customer6@gmail.com', role: 'customer', phone: '+91 09876 54321' },
];

export const mockProjects: Project[] = [
  {
    id: 'p1',
    name: 'Sunrise Villas',
    location: 'Whitefield, Bangalore',
    status: 'In Progress',
    progress: 65,
    siteManagerId: 'u2',
    customerId: 'u5',
    contractorId: 'u1',
    startDate: '2023-10-01',
    estimatedCompletion: '2024-06-30',
    totalBudget: 15000000,
    spentAmount: 9750000,
    lastUpdate: '2024-01-07',
    description: 'Premium residential villas with modern amenities',
    blueprints: [
      {
        id: 'bp1',
        type: 'elevation',
        name: 'Front Elevation',
        imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop',
        uploadDate: '2023-10-01',
        projectId: 'p1'
      },
      {
        id: 'bp2',
        type: 'electrical',
        name: 'Electrical Layout',
        imageUrl: 'https://images.unsplash.com/photo-1621905252472-e8f6b80e5ad4?w=800&h=600&fit=crop',
        uploadDate: '2023-10-05',
        projectId: 'p1'
      }
    ],
    dailyUpdates: [
      {
        id: 'du1',
        date: '2024-01-07',
        category: 'Foundation',
        caption: 'Foundation work completed, starting with first floor construction',
        images: ['https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=300&fit=crop'],
        uploadedBy: 'u2'
      },
      {
        id: 'du2',
        date: '2024-01-06',
        category: 'Foundation',
        caption: 'Concrete pouring for foundation base completed',
        images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1572981779307-38b8cabb2407?w=400&h=300&fit=crop'],
        uploadedBy: 'u2'
      },
      {
        id: 'du3',
        date: '2024-01-05',
        category: 'Framing',
        caption: 'Steel framework installation in progress',
        images: ['https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop'],
        uploadedBy: 'u2'
      }
    ],
    payments: [
      {
        id: 'pay1',
        amount: 250000,
        type: 'labour',
        status: 'approved',
        description: 'Labour payment for foundation work',
        raisedDate: '2024-01-05',
        raisedBy: 'u2',
        approvedDate: '2024-01-06',
        projectId: 'p1'
      },
      {
        id: 'pay2',
        amount: 180000,
        type: 'materials',
        status: 'pending',
        description: 'Cement and steel materials',
        raisedDate: '2024-01-07',
        raisedBy: 'u2',
        projectId: 'p1'
      }
    ],
    materials: [],
    contacts: [],
    ganttTasks: []
  },
  {
    id: 'p2',
    name: 'Lakeview Residency',
    location: 'Electronic City, Bangalore',
    status: 'Completed',
    progress: 100,
    siteManagerId: 'u3',
    customerId: 'u6',
    contractorId: 'u1',
    startDate: '2023-01-15',
    estimatedCompletion: '2023-12-31',
    totalBudget: 22000000,
    spentAmount: 21500000,
    lastUpdate: '2023-12-30',
    description: 'Luxury lakefront residential complex',
    blueprints: [
      {
        id: 'bp3',
        type: 'elevation',
        name: 'Lakefront Villa Elevation',
        imageUrl: 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=800&h=600&fit=crop',
        uploadDate: '2023-01-20',
        projectId: 'p2'
      },
      {
        id: 'bp4',
        type: 'structure',
        name: 'Luxury Complex Structure',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
        uploadDate: '2023-02-15',
        projectId: 'p2'
      },
      {
        id: 'bp5',
        type: 'electrical',
        name: 'Smart Home Electrical Plan',
        imageUrl: 'https://images.unsplash.com/photo-1621905253039-3341454e0c25?w=800&h=600&fit=crop',
        uploadDate: '2023-03-01',
        projectId: 'p2'
      },
      {
        id: 'bp6',
        type: 'paint',
        name: 'Interior Paint Design',
        imageUrl: 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&h=600&fit=crop',
        uploadDate: '2023-03-15',
        projectId: 'p2'
      }
    ],
    dailyUpdates: [
      {
        id: 'du4',
        date: '2023-12-30',
        category: 'Painting',
        caption: 'Final painting and touch-ups completed',
        images: ['https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1581094651181-35942459ad40?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop'],
        uploadedBy: 'u3'
      },
      {
        id: 'du5',
        date: '2023-12-28',
        category: 'Electrical',
        caption: 'All electrical fittings and testing completed',
        images: ['https://images.unsplash.com/photo-1621905252472-e8f6b80e5ad4?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1621905253039-3341454e0c25?w=400&h=300&fit=crop'],
        uploadedBy: 'u3'
      }
    ],
    payments: [
      {
        id: 'pay3',
        amount: 350000,
        type: 'labour',
        status: 'paid',
        description: 'Final labour payment',
        raisedDate: '2023-12-25',
        raisedBy: 'u3',
        approvedDate: '2023-12-26',
        projectId: 'p2'
      }
    ],
    materials: [],
    contacts: [],
    ganttTasks: []
  },
  {
    id: 'p3',
    name: 'Greenfield Towers',
    location: 'Koramangala, Bangalore',
    status: 'On Hold',
    progress: 30,
    siteManagerId: 'u4',
    customerId: 'u7',
    contractorId: 'u1',
    startDate: '2023-09-01',
    estimatedCompletion: '2024-08-31',
    totalBudget: 35000000,
    spentAmount: 10500000,
    lastUpdate: '2023-12-15',
    description: 'High-rise residential towers with commercial space',
    blueprints: [
      {
        id: 'bp7',
        type: 'elevation',
        name: 'Tower A Front Elevation',
        imageUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=600&fit=crop',
        uploadDate: '2023-12-01',
        projectId: 'p3'
      },
      {
        id: 'bp8',
        type: 'structure',
        name: 'Structural Framework Plan',
        imageUrl: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=800&h=600&fit=crop',
        uploadDate: '2023-12-02',
        projectId: 'p3'
      },
      {
        id: 'bp9',
        type: 'paint',
        name: 'Exterior Color Scheme',
        imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=800&h=600&fit=crop',
        uploadDate: '2023-12-05',
        projectId: 'p3'
      }
    ],
    dailyUpdates: [
      {
        id: 'du6',
        date: '2023-12-15',
        category: 'Foundation',
        caption: 'Foundation work on hold due to permit issues',
        images: ['https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop'],
        uploadedBy: 'u4'
      }
    ],
    payments: [
      {
        id: 'pay4',
        amount: 450000,
        type: 'advance',
        status: 'rejected',
        description: 'Advance payment request',
        raisedDate: '2023-12-10',
        raisedBy: 'u4',
        projectId: 'p3'
      }
    ],
    materials: [],
    contacts: [],
    ganttTasks: []
  },
  {
    id: 'p4',
    name: 'Skyline Estate',
    location: 'Sarjapur Road, Bangalore',
    status: 'In Progress',
    progress: 45,
    siteManagerId: 'u2',
    customerId: 'u8',
    contractorId: 'u1',
    startDate: '2023-11-01',
    estimatedCompletion: '2024-09-30',
    totalBudget: 28000000,
    spentAmount: 12600000,
    lastUpdate: '2024-01-06',
    description: 'Premium gated community with modern amenities',
    blueprints: [
      {
        id: 'bp10',
        type: 'elevation',
        name: 'Estate Main Gate Elevation',
        imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
        uploadDate: '2023-11-15',
        projectId: 'p4'
      },
      {
        id: 'bp11',
        type: 'electrical',
        name: 'Main Electrical Distribution Plan',
        imageUrl: 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=800&h=600&fit=crop',
        uploadDate: '2023-11-20',
        projectId: 'p4'
      },
      {
        id: 'bp12',
        type: 'structure',
        name: 'Foundation Structural Plan',
        imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop',
        uploadDate: '2023-11-25',
        projectId: 'p4'
      }
    ],
    dailyUpdates: [
      {
        id: 'du7',
        date: '2024-01-06',
        category: 'Plumbing',
        caption: 'Plumbing installation for ground floor completed',
        images: ['https://images.unsplash.com/photo-1621905252507-b35492cc74b4?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=300&fit=crop'],
        uploadedBy: 'u2'
      },
      {
        id: 'du8',
        date: '2024-01-04',
        category: 'Framing',
        caption: 'Second floor framing in progress',
        images: ['https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop'],
        uploadedBy: 'u2'
      }
    ],
    payments: [
      {
        id: 'pay5',
        amount: 320000,
        type: 'materials',
        status: 'approved',
        description: 'Plumbing materials and fittings',
        raisedDate: '2024-01-03',
        raisedBy: 'u2',
        approvedDate: '2024-01-04',
        projectId: 'p4'
      },
      {
        id: 'pay6',
        amount: 280000,
        type: 'machinery',
        status: 'pending',
        description: 'Crane rental for construction',
        raisedDate: '2024-01-06',
        raisedBy: 'u2',
        projectId: 'p4'
      }
    ],
    materials: [],
    contacts: [],
    ganttTasks: []
  },
  {
    id: 'p5',
    name: 'Palm Court',
    location: 'HSR Layout, Bangalore',
    status: 'In Progress',
    progress: 80,
    siteManagerId: 'u3',
    customerId: 'u9',
    contractorId: 'u1',
    startDate: '2023-05-01',
    estimatedCompletion: '2024-03-31',
    totalBudget: 18000000,
    spentAmount: 14400000,
    lastUpdate: '2024-01-07',
    description: 'Boutique residential project with garden spaces',
    blueprints: [
      {
        id: 'bp13',
        type: 'elevation',
        name: 'Palm Court Garden View',
        imageUrl: 'https://images.unsplash.com/photo-1558436120-1c7a6fcf3faa?w=800&h=600&fit=crop',
        uploadDate: '2023-05-15',
        projectId: 'p5'
      },
      {
        id: 'bp14',
        type: 'structure',
        name: 'Garden Layout Structure',
        imageUrl: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&h=600&fit=crop',
        uploadDate: '2023-06-01',
        projectId: 'p5'
      },
      {
        id: 'bp15',
        type: 'paint',
        name: 'Boutique Color Palette',
        imageUrl: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=800&h=600&fit=crop',
        uploadDate: '2023-06-20',
        projectId: 'p5'
      }
    ],
    dailyUpdates: [
      {
        id: 'du9',
        date: '2024-01-07',
        category: 'Roofing',
        caption: 'Roofing tiles installation completed',
        images: ['https://images.unsplash.com/photo-1558436120-1c7a6fcf3faa?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1545558014-8692077e9b5c?w=400&h=300&fit=crop'],
        uploadedBy: 'u3'
      },
      {
        id: 'du10',
        date: '2024-01-05',
        category: 'Electrical',
        caption: 'Internal wiring for all floors completed',
        images: ['https://images.unsplash.com/photo-1621905252472-e8f6b80e5ad4?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1621905253039-3341454e0c25?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1621905505842-65c9a8ac14c8?w=400&h=300&fit=crop'],
        uploadedBy: 'u3'
      }
    ],
    payments: [
      {
        id: 'pay7',
        amount: 195000,
        type: 'labour',
        status: 'paid',
        description: 'Roofing labour payment',
        raisedDate: '2024-01-02',
        raisedBy: 'u3',
        approvedDate: '2024-01-03',
        projectId: 'p5'
      }
    ],
    materials: [],
    contacts: [],
    ganttTasks: []
  },
  {
    id: 'p6',
    name: 'Ocean Breeze Homes',
    location: 'Marathahalli, Bangalore',
    status: 'Completed',
    progress: 100,
    siteManagerId: 'u4',
    customerId: 'u10',
    contractorId: 'u1',
    startDate: '2023-02-01',
    estimatedCompletion: '2023-11-30',
    totalBudget: 25000000,
    spentAmount: 24500000,
    lastUpdate: '2023-11-30',
    description: 'Coastal-themed residential development',
    blueprints: [
      {
        id: 'bp16',
        type: 'elevation',
        name: 'Ocean Theme Front View',
        imageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=600&fit=crop',
        uploadDate: '2023-02-20',
        projectId: 'p6'
      },
      {
        id: 'bp17',
        type: 'electrical',
        name: 'Marine Grade Electrical',
        imageUrl: 'https://images.unsplash.com/photo-1621905252472-e8f6b80e5ad4?w=800&h=600&fit=crop',
        uploadDate: '2023-03-10',
        projectId: 'p6'
      },
      {
        id: 'bp18',
        type: 'structure',
        name: 'Coastal Construction Plan',
        imageUrl: 'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=800&h=600&fit=crop',
        uploadDate: '2023-04-05',
        projectId: 'p6'
      }
    ],
    dailyUpdates: [
      {
        id: 'du11',
        date: '2023-11-30',
        category: 'General',
        caption: 'Project handover completed with all documentation',
        images: ['https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400&h=300&fit=crop'],
        uploadedBy: 'u4'
      },
      {
        id: 'du12',
        date: '2023-11-28',
        category: 'Painting',
        caption: 'Final inspection and cleanup completed',
        images: ['https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=400&h=300&fit=crop', 'https://images.unsplash.com/photo-1581094651181-35942459ad40?w=400&h=300&fit=crop'],
        uploadedBy: 'u4'
      }
    ],
    payments: [
      {
        id: 'pay8',
        amount: 150000,
        type: 'labour',
        status: 'paid',
        description: 'Final cleanup and handover',
        raisedDate: '2023-11-25',
        raisedBy: 'u4',
        approvedDate: '2023-11-26',
        projectId: 'p6'
      }
    ],
    materials: [],
    contacts: [],
    ganttTasks: []
  }
];

export const globalContacts: Contact[] = [
  {
    id: 'c1',
    name: 'Ramesh Sharma',
    role: 'Site Engineer',
    phone: '+91 98765 43210',
    whatsapp: '+91 98765 43210',
    email: 'ramesh@buildtech.com'
  },
  {
    id: 'c2',
    name: 'Suresh Kumar',
    role: 'Painter',
    phone: '+91 87654 32109',
    whatsapp: '+91 87654 32109',
    email: 'suresh@buildtech.com'
  },
  {
    id: 'c3',
    name: 'Manjunath R',
    role: 'Contractor',
    phone: '+91 76543 21098',
    whatsapp: '+91 76543 21098',
    email: 'manju@buildtech.com'
  },
  {
    id: 'c4',
    name: 'Priya Desai',
    role: 'Accountant',
    phone: '+91 65432 10987',
    whatsapp: '+91 65432 10987',
    email: 'priya@buildtech.com'
  },
  {
    id: 'c5',
    name: 'Vikram Singh',
    role: 'Owner',
    phone: '+91 54321 09876',
    whatsapp: '+91 54321 09876',
    email: 'vikram@buildtech.com'
  },
  {
    id: 'c6',
    name: 'Anand Rao',
    role: 'Supervisor',
    phone: '+91 43210 98765',
    whatsapp: '+91 43210 98765',
    email: 'anand@buildtech.com'
  }
];
