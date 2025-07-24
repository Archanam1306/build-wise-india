
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Project, DailyUpdate } from '@/types';
import { Calendar, User, Clock, Tag, Image } from 'lucide-react';

interface DailyUpdateDetailsModalProps {
  update: (DailyUpdate & { projectName: string }) | null;
  isOpen: boolean;
  onClose: () => void;
  relatedUpdates?: (DailyUpdate & { projectName: string })[];
}

const DailyUpdateDetailsModal: React.FC<DailyUpdateDetailsModalProps> = ({ 
  update, 
  isOpen, 
  onClose,
  relatedUpdates = []
}) => {
  if (!update) return null;

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Foundation': 'bg-orange-500/20 text-orange-300 border-orange-500/30',
      'Framing': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
      'Plumbing': 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30',
      'Electrical': 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
      'Roofing': 'bg-red-500/20 text-red-300 border-red-500/30',
      'Painting': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      'General': 'bg-gray-500/20 text-gray-300 border-gray-500/30'
    };
    return colors[category] || colors['General'];
  };

  // Group related updates by date
  const groupedRelatedUpdates: Record<string, (DailyUpdate & { projectName: string })[]> = {};
  relatedUpdates.forEach(relUpdate => {
    if (!groupedRelatedUpdates[relUpdate.date]) {
      groupedRelatedUpdates[relUpdate.date] = [];
    }
    groupedRelatedUpdates[relUpdate.date].push(relUpdate);
  });

  // Sort dates in descending order
  const sortedDates = Object.keys(groupedRelatedUpdates).sort((a, b) => 
    new Date(b).getTime() - new Date(a).getTime()
  );

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-800">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Daily Update Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Update Header */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="text-xl font-semibold text-white">{update.projectName}</div>
              <Badge className={getCategoryColor(update.category)}>
                {update.category}
              </Badge>
            </div>
            
            <div className="flex items-center text-gray-400 space-x-4 text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(update.date).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {update.uploadedBy}
              </div>
              <div className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {new Date(update.date).toLocaleTimeString()}
              </div>
              <div className="flex items-center">
                <Image className="h-4 w-4 mr-1" />
                {update.images.length} photos
              </div>
            </div>

            <p className="text-gray-300 mt-2">{update.caption}</p>
          </div>

          {/* Images Gallery */}
          <div className="space-y-2">
            <h3 className="font-medium text-white text-lg">Photos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {update.images.map((image, idx) => (
                <div key={idx} className="rounded-lg overflow-hidden bg-gray-800">
                  <img 
                    src={image} 
                    alt={`Update photo ${idx + 1}`} 
                    className="w-full h-auto object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=500&h=300&fit=crop';
                    }}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Previous Updates Timeline */}
          {sortedDates.length > 0 && (
            <div className="space-y-4">
              <h3 className="font-medium text-white text-lg border-t border-gray-800 pt-4">Previous Updates</h3>
              
              <div className="space-y-4">
                {sortedDates.map(date => (
                  <div key={date} className="space-y-2">
                    <div className="flex items-center">
                      <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
                      <span className="text-white font-medium">{new Date(date).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="pl-4 border-l border-gray-700 space-y-3">
                      {groupedRelatedUpdates[date].map(relUpdate => (
                        <div key={relUpdate.id} className="bg-gray-800 p-3 rounded-lg">
                          <div className="flex justify-between items-start mb-2">
                            <Badge className={getCategoryColor(relUpdate.category)}>
                              {relUpdate.category}
                            </Badge>
                            <span className="text-xs text-gray-500">{relUpdate.uploadedBy}</span>
                          </div>
                          <p className="text-gray-300 text-sm">{relUpdate.caption}</p>
                          
                          {relUpdate.images.length > 0 && (
                            <div className="grid grid-cols-4 gap-2 mt-2">
                              {relUpdate.images.slice(0, 4).map((img, i) => (
                                <div key={i} className="aspect-square rounded bg-gray-900 overflow-hidden">
                                  <img 
                                    src={img} 
                                    alt={`Preview ${i}`} 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.src = 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=200&h=200&fit=crop';
                                    }}
                                  />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DailyUpdateDetailsModal;
