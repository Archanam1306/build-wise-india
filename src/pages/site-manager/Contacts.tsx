
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { mockProjects, mockUsers } from '@/data/mockData';
import { Phone, Mail, MessageCircle, User } from 'lucide-react';

const SiteManagerContacts = () => {
  const { user } = useAuth();

  const assignedProjects = mockProjects.filter(project => project.siteManagerId === user?.id);
  const activeProject = assignedProjects.find(project => project.status === 'In Progress') || assignedProjects[0];

  if (!activeProject) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-white mb-4">Project Contacts</h1>
          <p className="text-gray-400">No projects assigned to you yet.</p>
        </div>
      </div>
    );
  }

  const contractor = mockUsers.find(u => u.id === activeProject.contractorId);
  const customer = mockUsers.find(u => u.id === activeProject.customerId);
  const otherSiteManagers = mockUsers.filter(u => u.role === 'site-manager' && u.id !== user?.id);

  const contacts = [
    { ...contractor, category: 'Contractor' },
    { ...customer, category: 'Customer' },
    ...otherSiteManagers.map(sm => ({ ...sm, category: 'Site Manager' }))
  ].filter(Boolean);

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'contractor': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'customer': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'site-manager': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="p-6 space-y-6 bg-gray-900 min-h-screen">
        <div>
          <h1 className="text-3xl font-bold text-white">Project Contacts</h1>
          <p className="text-gray-400">Contact information for {activeProject.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((contact: any) => (
            <Card key={contact.id} className="bg-gray-800 border-gray-700">
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-full bg-gray-700">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-white text-lg">{contact.name}</CardTitle>
                    <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getRoleColor(contact.role)}`}>
                      {contact.category}
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-300">
                    <Mail className="h-4 w-4 mr-2 text-gray-400" />
                    {contact.email}
                  </div>
                  <div className="flex items-center text-sm text-gray-300">
                    <Phone className="h-4 w-4 mr-2 text-gray-400" />
                    {contact.phone}
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700">
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                  <Button size="sm" variant="outline" className="flex-1 border-green-400 text-green-400 hover:bg-green-400/10">
                    <MessageCircle className="h-4 w-4 mr-1" />
                    Message
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SiteManagerContacts;
