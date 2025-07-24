import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, Upload, FileText, Image, Eye, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface IssueCategory {
  id: string;
  label: string;
  description: string;
}

interface ComplaintData {
  id: string;
  submittedDate: string;
  selectedIssues: string[];
  issueDescriptions: { [key: string]: string };
  otherDescription: string;
  uploadedFiles: File[];
  status: 'Requested' | 'Resolved';
  resolvedDate?: string;
}

const MaintenanceRequests: React.FC = () => {
  const { toast } = useToast();
  const [showResolved, setShowResolved] = useState(false);
  const [selectedIssues, setSelectedIssues] = useState<string[]>([]);
  const [issueDescriptions, setIssueDescriptions] = useState<{ [key: string]: string }>({});
  const [otherDescription, setOtherDescription] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [complaints, setComplaints] = useState<ComplaintData[]>([
    {
      id: 'CMP-2025-0001',
      submittedDate: '2025-01-15',
      selectedIssues: ['Electrical', 'Plumbing'],
      issueDescriptions: {
        'Electrical': 'Kitchen light flickering intermittently',
        'Plumbing': 'Bathroom tap dripping constantly'
      },
      otherDescription: '',
      uploadedFiles: [],
      status: 'Requested'
    },
    {
      id: 'CMP-2025-0002',
      submittedDate: '2025-01-10',
      selectedIssues: ['Paint'],
      issueDescriptions: {
        'Paint': 'Paint peeling off in living room wall'
      },
      otherDescription: '',
      uploadedFiles: [],
      status: 'Resolved',
      resolvedDate: '2025-01-20'
    }
  ]);

  const issueCategories: IssueCategory[] = [
    { id: 'electrical', label: 'Electrical', description: 'Power issues, wiring problems, switches' },
    { id: 'plumbing', label: 'Plumbing', description: 'Water supply, drainage, pipe issues' },
    { id: 'paint', label: 'Paint', description: 'Paint peeling, color fading, wall damage' },
    { id: 'interior-woodwork', label: 'Interior Woodwork', description: 'Doors, windows, cabinets' },
    { id: 'tiles', label: 'Tiles', description: 'Cracked, loose, or missing tiles' },
    { id: 'water-leakage', label: 'Water Leakage', description: 'Roof, wall, or pipe leaks' },
    { id: 'hvac', label: 'HVAC', description: 'Air conditioning, heating, ventilation' },
    { id: 'other', label: 'Other', description: 'Any other maintenance issues' }
  ];

  const handleIssueToggle = (issueId: string) => {
    setSelectedIssues(prev => 
      prev.includes(issueId) 
        ? prev.filter(id => id !== issueId)
        : [...prev, issueId]
    );
  };

  const handleDescriptionChange = (issueId: string, description: string) => {
    setIssueDescriptions(prev => ({
      ...prev,
      [issueId]: description
    }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/png', 'application/pdf'];
      return validTypes.includes(file.type);
    });

    if (uploadedFiles.length + validFiles.length > 5) {
      toast({
        title: "File limit exceeded",
        description: "Maximum 5 files allowed",
        variant: "destructive"
      });
      return;
    }

    setUploadedFiles(prev => [...prev, ...validFiles]);
  };

  const removeFile = (index: number) => {
    setUploadedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const generateComplaintId = () => {
    const year = new Date().getFullYear();
    const randomNum = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
    return `CMP-${year}-${randomNum}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedIssues.length === 0) {
      toast({
        title: "Please select at least one issue category",
        variant: "destructive"
      });
      return;
    }

    if (selectedIssues.includes('other') && !otherDescription.trim()) {
      toast({
        title: "Please describe the issue for 'Other' category",
        variant: "destructive"
      });
      return;
    }

    const complaintId = generateComplaintId();
    const newComplaint: ComplaintData = {
      id: complaintId,
      submittedDate: new Date().toISOString().split('T')[0],
      selectedIssues: selectedIssues.map(id => issueCategories.find(cat => cat.id === id)?.label || id),
      issueDescriptions,
      otherDescription,
      uploadedFiles: [...uploadedFiles],
      status: 'Requested'
    };

    setComplaints(prev => [newComplaint, ...prev]);
    
    // Reset form
    setSelectedIssues([]);
    setIssueDescriptions({});
    setOtherDescription('');
    setUploadedFiles([]);

    toast({
      title: "Complaint submitted successfully!",
      description: `Your complaint ID is: ${complaintId}`,
    });
  };

  const markAsResolved = (complaintId: string) => {
    setComplaints(prev => prev.map(complaint => 
      complaint.id === complaintId 
        ? { ...complaint, status: 'Resolved' as const, resolvedDate: new Date().toISOString().split('T')[0] }
        : complaint
    ));
    
    toast({
      title: "Complaint marked as resolved",
      description: `Complaint ${complaintId} has been resolved.`,
    });
  };

  const filteredComplaints = complaints.filter(complaint => 
    showResolved ? complaint.status === 'Resolved' : complaint.status === 'Requested'
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-white mb-2">Maintenance Requests</h1>
        <p className="text-gray-400">Submit and track your post-construction service requests</p>
      </div>

      {/* Toggle View */}
      <div className="flex items-center gap-3 mb-6">
        <Label htmlFor="view-toggle" className="text-white">
          {showResolved ? 'Resolved Complaints' : 'Requested Complaints'}
        </Label>
        <Switch
          id="view-toggle"
          checked={showResolved}
          onCheckedChange={setShowResolved}
        />
      </div>

      {!showResolved && (
        <Card className="mb-8 bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">Submit New Complaint</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Issue Categories */}
              <div>
                <Label className="text-white mb-3 block">Select Issue Categories</Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {issueCategories.map((category) => (
                    <div key={category.id} className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={category.id}
                          checked={selectedIssues.includes(category.id)}
                          onCheckedChange={() => handleIssueToggle(category.id)}
                        />
                        <Label htmlFor={category.id} className="text-white text-sm">
                          {category.label}
                        </Label>
                      </div>
                      <p className="text-xs text-gray-400 ml-6">{category.description}</p>
                      
                      {selectedIssues.includes(category.id) && category.id !== 'other' && (
                        <Textarea
                          placeholder={`Describe the ${category.label.toLowerCase()} issue...`}
                          value={issueDescriptions[category.id] || ''}
                          onChange={(e) => handleDescriptionChange(category.id, e.target.value)}
                          className="ml-6 mt-2 bg-gray-700 border-gray-600 text-white"
                          rows={2}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Other Description */}
              {selectedIssues.includes('other') && (
                <div>
                  <Label className="text-white mb-2 block">Describe the issue *</Label>
                  <Textarea
                    placeholder="Please provide detailed information about the issue..."
                    value={otherDescription}
                    onChange={(e) => setOtherDescription(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white"
                    rows={3}
                    required
                  />
                </div>
              )}

              {/* File Upload */}
              <div>
                <Label className="text-white mb-2 block">Upload Images/Documents</Label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                  <div className="flex flex-col items-center text-center">
                    <Upload className="h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-400 mb-2">
                      Upload up to 5 files (JPG, PNG, PDF)
                    </p>
                    <Input
                      type="file"
                      multiple
                      accept=".jpg,.jpeg,.png,.pdf"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                    />
                    <Label htmlFor="file-upload" className="cursor-pointer">
                      <Button type="button" variant="outline" className="bg-gray-700 border-gray-600 text-white hover:bg-gray-600">
                        Choose Files
                      </Button>
                    </Label>
                  </div>
                </div>
                
                {uploadedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-gray-700 p-2 rounded">
                        <div className="flex items-center gap-2">
                          {file.type.startsWith('image/') ? (
                            <Image className="h-4 w-4 text-gray-400" />
                          ) : (
                            <FileText className="h-4 w-4 text-gray-400" />
                          )}
                          <span className="text-sm text-white">{file.name}</span>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Disclaimer */}
              <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
                <p className="text-sm text-blue-200">
                  <strong>Note:</strong> Warranty or damage coverage is free for the first 2 years from the project completion date. T&C apply.
                </p>
              </div>

              <Button 
                type="submit" 
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
              >
                Submit Complaint
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Complaints List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">
          {showResolved ? 'Resolved Complaints' : 'Active Complaints'} ({filteredComplaints.length})
        </h2>
        
        {filteredComplaints.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8 text-center">
              <p className="text-gray-400">
                {showResolved ? 'No resolved complaints yet.' : 'No active complaints. Submit one above.'}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredComplaints.map((complaint) => (
            <Collapsible key={complaint.id}>
              <Card className="bg-gray-800 border-gray-700">
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="hover:bg-gray-700/50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div>
                          <CardTitle className="text-lg text-white text-left">
                            {complaint.id}
                          </CardTitle>
                          <p className="text-sm text-gray-400 text-left">
                            Submitted: {new Date(complaint.submittedDate).toLocaleDateString()}
                            {complaint.resolvedDate && (
                              <span className="ml-2">
                                | Resolved: {new Date(complaint.resolvedDate).toLocaleDateString()}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={complaint.status === 'Resolved' ? 'default' : 'secondary'}>
                          {complaint.status}
                        </Badge>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {/* Issue Types */}
                      <div>
                        <Label className="text-white text-sm font-medium">Issue Categories:</Label>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {complaint.selectedIssues.map((issue) => (
                            <Badge key={issue} variant="outline" className="border-gray-600 text-gray-300">
                              {issue}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      {/* Descriptions */}
                      {Object.entries(complaint.issueDescriptions).map(([category, description]) => (
                        <div key={category}>
                          <Label className="text-white text-sm font-medium">{category} Issue:</Label>
                          <p className="text-gray-300 text-sm mt-1">{description}</p>
                        </div>
                      ))}

                      {complaint.otherDescription && (
                        <div>
                          <Label className="text-white text-sm font-medium">Other Issue:</Label>
                          <p className="text-gray-300 text-sm mt-1">{complaint.otherDescription}</p>
                        </div>
                      )}

                      {/* Files */}
                      {complaint.uploadedFiles.length > 0 && (
                        <div>
                          <Label className="text-white text-sm font-medium">Uploaded Files:</Label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-1">
                            {complaint.uploadedFiles.map((file, index) => (
                              <div key={index} className="flex items-center gap-2 bg-gray-700 p-2 rounded">
                                {file.type.startsWith('image/') ? (
                                  <Image className="h-4 w-4 text-gray-400" />
                                ) : (
                                  <FileText className="h-4 w-4 text-gray-400" />
                                )}
                                <span className="text-xs text-gray-300 truncate">{file.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Actions */}
                      {complaint.status === 'Requested' && (
                        <div className="flex justify-end pt-4">
                          <Button
                            onClick={() => markAsResolved(complaint.id)}
                            variant="outline"
                            size="sm"
                            className="bg-green-600 hover:bg-green-700 text-white border-green-600"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Mark as Resolved
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))
        )}
      </div>
    </div>
  );
};

export default MaintenanceRequests;
