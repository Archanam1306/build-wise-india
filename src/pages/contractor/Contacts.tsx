
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { globalContacts } from '@/data/mockData';
import { Contact as ContactType } from '@/types';
import { Phone, MessageCircle, Mail, User, Plus, Search, Filter } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Contacts = () => {
  const [contacts, setContacts] = useState<ContactType[]>(globalContacts);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    role: '',
    phone: '',
    whatsapp: '',
    email: ''
  });

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.phone.includes(searchTerm);
    const matchesRole = roleFilter === 'all' || contact.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleAddContact = () => {
    if (!newContact.name || !newContact.role || !newContact.phone) {
      toast({
        title: "Error",
        description: "Please fill in required fields (Name, Role, Phone)",
        variant: "destructive",
      });
      return;
    }

    const contact: ContactType = {
      id: `contact-${Date.now()}`,
      name: newContact.name,
      role: newContact.role as ContactType['role'],
      phone: newContact.phone,
      whatsapp: newContact.whatsapp || newContact.phone,
      email: newContact.email
    };

    setContacts([...contacts, contact]);
    setNewContact({ name: '', role: '', phone: '', whatsapp: '', email: '' });
    setShowAddForm(false);
    
    toast({
      title: "Success",
      description: "Contact added successfully",
    });
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleWhatsApp = (phone: string) => {
    window.open(`https://wa.me/${phone.replace(/[^0-9]/g, '')}`, '_blank');
  };

  const handleEmail = (email: string) => {
    if (email) {
      window.open(`mailto:${email}`, '_self');
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'Site Engineer':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'Painter':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Contractor':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'Accountant':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Owner':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Team Contacts</h1>
          <p className="text-gray-400">Manage all project team members and contacts</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Contact
        </Button>
      </div>

      {/* Add Contact Form */}
      {showAddForm && (
        <Card className="bg-gray-900 border-gray-800">
          <CardHeader>
            <CardTitle className="text-white">Add New Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Name *</label>
                <Input
                  value={newContact.name}
                  onChange={(e) => setNewContact({ ...newContact, name: e.target.value })}
                  placeholder="Full name"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Role *</label>
                <Select value={newContact.role} onValueChange={(value) => setNewContact({ ...newContact, role: value })}>
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-700">
                    <SelectItem value="Site Engineer" className="text-white">Site Engineer</SelectItem>
                    <SelectItem value="Painter" className="text-white">Painter</SelectItem>
                    <SelectItem value="Contractor" className="text-white">Contractor</SelectItem>
                    <SelectItem value="Accountant" className="text-white">Accountant</SelectItem>
                    <SelectItem value="Owner" className="text-white">Owner</SelectItem>
                    <SelectItem value="Supervisor" className="text-white">Supervisor</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">Phone *</label>
                <Input
                  value={newContact.phone}
                  onChange={(e) => setNewContact({ ...newContact, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div>
                <label className="text-sm text-gray-400 mb-2 block">WhatsApp</label>
                <Input
                  value={newContact.whatsapp}
                  onChange={(e) => setNewContact({ ...newContact, whatsapp: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm text-gray-400 mb-2 block">Email</label>
                <Input
                  value={newContact.email}
                  onChange={(e) => setNewContact({ ...newContact, email: e.target.value })}
                  placeholder="email@example.com"
                  type="email"
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleAddContact} className="bg-blue-600 hover:bg-blue-700">
                Add Contact
              </Button>
              <Button onClick={() => setShowAddForm(false)} variant="outline" className="border-gray-600 text-gray-300">
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by name or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 bg-gray-900 border-gray-700 text-white"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-full sm:w-[200px] bg-gray-900 border-gray-700 text-white">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent className="bg-gray-900 border-gray-700">
            <SelectItem value="all" className="text-white">All Roles</SelectItem>
            <SelectItem value="Site Engineer" className="text-white">Site Engineer</SelectItem>
            <SelectItem value="Painter" className="text-white">Painter</SelectItem>
            <SelectItem value="Contractor" className="text-white">Contractor</SelectItem>
            <SelectItem value="Accountant" className="text-white">Accountant</SelectItem>
            <SelectItem value="Owner" className="text-white">Owner</SelectItem>
            <SelectItem value="Supervisor" className="text-white">Supervisor</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Contacts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredContacts.map((contact) => (
          <Card key={contact.id} className="bg-gray-900 border-gray-800 hover:border-blue-500/50 transition-colors">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-300" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{contact.name}</h3>
                      <Badge className={getRoleColor(contact.role)}>
                        {contact.role}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-400">Phone:</span>
                    <span className="text-white">{contact.phone}</span>
                  </div>
                  {contact.email && (
                    <div className="flex items-center justify-between">
                      <span className="text-gray-400">Email:</span>
                      <span className="text-white text-xs">{contact.email}</span>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleCall(contact.phone)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <Phone className="h-4 w-4 mr-1" />
                    Call
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleWhatsApp(contact.whatsapp)}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    <MessageCircle className="h-4 w-4 mr-1" />
                    WhatsApp
                  </Button>
                  {contact.email && (
                    <Button
                      size="sm"
                      onClick={() => handleEmail(contact.email)}
                      variant="outline"
                      className="border-blue-400 text-blue-400 hover:bg-blue-400/10"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredContacts.length === 0 && (
        <Card className="bg-gray-900 border-gray-800">
          <CardContent className="text-center py-12">
            <div className="text-gray-400">
              <User className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">No contacts found</p>
              <p className="text-sm">Try adjusting your search or add a new contact</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Contacts;
