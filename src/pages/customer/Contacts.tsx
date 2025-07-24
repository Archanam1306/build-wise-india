
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Phone, 
  Mail, 
  MessageCircle, 
  User, 
  Copy,
  ExternalLink,
  Filter
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

// Mock data for contacts
const mockContacts = [
  {
    id: 'CON-001',
    name: 'John Smith',
    role: 'Site Engineer',
    phone: '+1 (555) 123-4567',
    whatsapp: '+1 (555) 123-4567',
    email: 'john.smith@construction.com',
    project: 'Modern Villa Construction',
    availability: 'Available',
    lastContact: '2024-01-20'
  },
  {
    id: 'CON-002',
    name: 'Sarah Johnson',
    role: 'Contractor',
    phone: '+1 (555) 234-5678',
    whatsapp: '+1 (555) 234-5678',
    email: 'sarah.johnson@builders.com',
    project: 'Modern Villa Construction',
    availability: 'Available',
    lastContact: '2024-01-19'
  },
  {
    id: 'CON-003',
    name: 'Mike Wilson',
    role: 'Painter',
    phone: '+1 (555) 345-6789',
    whatsapp: '+1 (555) 345-6789',
    email: 'mike.wilson@paintpro.com',
    project: 'Modern Villa Construction',
    availability: 'Busy',
    lastContact: '2024-01-18'
  },
  {
    id: 'CON-004',
    name: 'Emily Davis',
    role: 'Accountant',
    phone: '+1 (555) 456-7890',
    whatsapp: '+1 (555) 456-7890',
    email: 'emily.davis@accounting.com',
    project: 'Modern Villa Construction',
    availability: 'Available',
    lastContact: '2024-01-17'
  },
  {
    id: 'CON-005',
    name: 'Robert Taylor',
    role: 'Owner',
    phone: '+1 (555) 567-8901',
    whatsapp: '+1 (555) 567-8901',
    email: 'robert.taylor@owner.com',
    project: 'Modern Villa Construction',
    availability: 'Available',
    lastContact: '2024-01-16'
  },
  {
    id: 'CON-006',
    name: 'Lisa Anderson',
    role: 'Supervisor',
    phone: '+1 (555) 678-9012',
    whatsapp: '+1 (555) 678-9012',
    email: 'lisa.anderson@supervision.com',
    project: 'Modern Villa Construction',
    availability: 'Available',
    lastContact: '2024-01-15'
  }
];

const Contacts: React.FC = () => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedAvailability, setSelectedAvailability] = useState('all');
  const [selectedContact, setSelectedContact] = useState<any>(null);

  const roles = ['Site Engineer', 'Contractor', 'Painter', 'Accountant', 'Owner', 'Supervisor'];
  const availabilities = ['Available', 'Busy'];

  const filteredContacts = mockContacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || contact.role === selectedRole;
    const matchesAvailability = selectedAvailability === 'all' || contact.availability === selectedAvailability;
    
    return matchesSearch && matchesRole && matchesAvailability;
  });

  const getRoleColor = (role: string) => {
    const colors = {
      'Site Engineer': 'bg-blue-500',
      'Contractor': 'bg-green-500',
      'Painter': 'bg-purple-500',
      'Accountant': 'bg-orange-500',
      'Owner': 'bg-red-500',
      'Supervisor': 'bg-cyan-500'
    };
    return colors[role as keyof typeof colors] || 'bg-gray-500';
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available':
        return 'bg-green-500';
      case 'Busy':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleCopyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: `${type} copied to clipboard`,
      description: text,
    });
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`, '_blank');
  };

  const handleWhatsApp = (phone: string) => {
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}`;
    window.open(whatsappUrl, '_blank');
  };

  const getContactStats = () => {
    const stats = {
      total: mockContacts.length,
      available: mockContacts.filter(c => c.availability === 'Available').length,
      busy: mockContacts.filter(c => c.availability === 'Busy').length
    };
    return stats;
  };

  const stats = getContactStats();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Project Contacts</h1>
        <p className="text-gray-400">Connect with your project team members</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Total Contacts</p>
                <p className="text-2xl font-bold text-white">{stats.total}</p>
              </div>
              <User className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Available</p>
                <p className="text-2xl font-bold text-green-500">{stats.available}</p>
              </div>
              <User className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gray-800 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm">Busy</p>
                <p className="text-2xl font-bold text-yellow-500">{stats.busy}</p>
              </div>
              <User className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="mb-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search contacts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white"
          />
        </div>
        
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-full sm:w-48 bg-gray-800 border-gray-700 text-white">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all">All Roles</SelectItem>
            {roles.map(role => (
              <SelectItem key={role} value={role}>{role}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select value={selectedAvailability} onValueChange={setSelectedAvailability}>
          <SelectTrigger className="w-full sm:w-48 bg-gray-800 border-gray-700 text-white">
            <SelectValue placeholder="Filter by availability" />
          </SelectTrigger>
          <SelectContent className="bg-gray-800 border-gray-700">
            <SelectItem value="all">All Availability</SelectItem>
            {availabilities.map(availability => (
              <SelectItem key={availability} value={availability}>{availability}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContacts.map((contact) => (
          <Card key={contact.id} className="bg-gray-800 border-gray-700">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white text-lg">{contact.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className={`${getRoleColor(contact.role)} text-white border-0`}>
                      {contact.role}
                    </Badge>
                    <Badge variant="secondary" className={`${getAvailabilityColor(contact.availability)} text-white`}>
                      {contact.availability}
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Contact Information */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Phone className="h-4 w-4" />
                    <span className="text-sm">{contact.phone}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyToClipboard(contact.phone, 'Phone number')}
                    className="text-gray-400 hover:text-white"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-gray-400">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm truncate">{contact.email}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyToClipboard(contact.email, 'Email')}
                    className="text-gray-400 hover:text-white"
                  >
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>

              {/* Project Info */}
              <div className="text-sm text-gray-400">
                <p>Project: {contact.project}</p>
                <p>Last Contact: {formatDate(contact.lastContact)}</p>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCall(contact.phone)}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  <Phone className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEmail(contact.email)}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  <Mail className="h-3 w-3" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleWhatsApp(contact.whatsapp)}
                  className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                >
                  <MessageCircle className="h-3 w-3" />
                </Button>
              </div>

              <Button 
                variant="outline" 
                className="w-full bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                onClick={() => setSelectedContact(contact)}
              >
                <User className="h-4 w-4 mr-2" />
                View Details
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Contact Details Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="bg-gray-800 border-gray-700 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-white text-xl">{selectedContact.name}</CardTitle>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className={`${getRoleColor(selectedContact.role)} text-white border-0`}>
                      {selectedContact.role}
                    </Badge>
                    <Badge variant="secondary" className={`${getAvailabilityColor(selectedContact.availability)} text-white`}>
                      {selectedContact.availability}
                    </Badge>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedContact(null)}
                  className="text-gray-400 hover:text-white"
                >
                  ×
                </Button>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-white font-medium mb-3">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-white">{selectedContact.phone}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCall(selectedContact.phone)}
                        className="text-gray-400 hover:text-white"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyToClipboard(selectedContact.phone, 'Phone number')}
                        className="text-gray-400 hover:text-white"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <span className="text-white">{selectedContact.email}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEmail(selectedContact.email)}
                        className="text-gray-400 hover:text-white"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyToClipboard(selectedContact.email, 'Email')}
                        className="text-gray-400 hover:text-white"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-gray-400" />
                      <span className="text-white">{selectedContact.whatsapp}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleWhatsApp(selectedContact.whatsapp)}
                        className="text-gray-400 hover:text-white"
                      >
                        <ExternalLink className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyToClipboard(selectedContact.whatsapp, 'WhatsApp number')}
                        className="text-gray-400 hover:text-white"
                      >
                        <Copy className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Information */}
              <div>
                <h3 className="text-white font-medium mb-3">Project Information</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Project</span>
                    <span className="text-white">{selectedContact.project}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Last Contact</span>
                    <span className="text-white">{formatDate(selectedContact.lastContact)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Availability</span>
                    <Badge variant="secondary" className={`${getAvailabilityColor(selectedContact.availability)} text-white`}>
                      {selectedContact.availability}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-white font-medium mb-3">Quick Actions</h3>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    onClick={() => handleCall(selectedContact.phone)}
                    className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Call
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleEmail(selectedContact.email)}
                    className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleWhatsApp(selectedContact.whatsapp)}
                    className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600"
                  >
                    <MessageCircle className="h-4 w-4 mr-2" />
                    WhatsApp
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Contacts;
