
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Clock, ExternalLink, MapPin, Calendar, CheckCircle, Loader } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { mockReports } from '@/data/mockData';
import { Report } from '@/types';
import { format } from 'date-fns';

const ReportDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  
  useEffect(() => {
    // Simulate API request
    setLoading(true);
    setTimeout(() => {
      const foundReport = mockReports.find(r => r.id === id);
      setReport(foundReport || null);
      setLoading(false);
    }, 800);
  }, [id]);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-5 w-5 text-urban-warning" />;
      case 'In Progress':
        return <Loader className="h-5 w-5 text-urban-info" />;
      case 'Fixed':
        return <CheckCircle className="h-5 w-5 text-urban-success" />;
      default:
        return null;
    }
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'status-pending';
      case 'In Progress':
        return 'status-in-progress';
      case 'Fixed':
        return 'status-fixed';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <Button
          variant="ghost"
          className="mb-6"
          onClick={() => navigate('/reports')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Reports
        </Button>
        
        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="flex flex-col items-center">
              <Loader className="h-8 w-8 animate-spin text-urban-primary mb-4" />
              <p className="text-muted-foreground">Loading report details...</p>
            </div>
          </div>
        ) : report ? (
          <div className="max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row gap-6 mb-8">
              <div className="w-full md:w-1/2">
                <Card className="overflow-hidden">
                  <div className="relative aspect-video bg-muted">
                    <img
                      src={report.photo || '/placeholder.svg'}
                      alt={`${report.category} issue`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </Card>
              </div>
              
              <div className="w-full md:w-1/2">
                <div className="mb-4">
                  <h1 className="text-3xl font-bold">{report.category} Issue</h1>
                  <div className="flex items-center mt-2">
                    <Badge className={`${getStatusClass(report.status)} flex items-center gap-1`}>
                      {getStatusIcon(report.status)}
                      <span>{report.status}</span>
                    </Badge>
                    <span className="text-sm text-muted-foreground ml-3">
                      Report #{report.id}
                    </span>
                  </div>
                </div>
                
                <Card className="p-4 space-y-4 mb-6">
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Submitted</div>
                      <div className="text-sm text-muted-foreground">
                        {format(new Date(report.timestamp), 'PPP')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <div className="text-sm font-medium">Location</div>
                      <div className="text-sm text-muted-foreground">
                        {report.location.address || 'No address provided'}
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Coordinates: {report.location.lat.toFixed(6)}, {report.location.lng.toFixed(6)}
                      </div>
                    </div>
                  </div>
                  
                  {report.assignedTo && (
                    <div className="flex items-center gap-3">
                      <div className="h-5 w-5 rounded-full bg-muted flex items-center justify-center text-xs font-medium">
                        A
                      </div>
                      <div>
                        <div className="text-sm font-medium">Assigned To</div>
                        <div className="text-sm text-muted-foreground">
                          City Maintenance Team
                        </div>
                      </div>
                    </div>
                  )}
                </Card>
                
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <ExternalLink className="h-4 w-4" />
                  View on Map
                </Button>
              </div>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-medium mb-2">Description</h3>
                <Card className="p-4">
                  <p className="text-muted-foreground">
                    {report.description || 'No description provided.'}
                  </p>
                </Card>
              </div>
              
              <div>
                <h3 className="text-xl font-medium mb-2">Status Updates</h3>
                <Card className="divide-y divide-border">
                  <StatusUpdate
                    status="Submitted"
                    date={report.timestamp}
                    description="Report has been submitted successfully."
                  />
                  
                  {report.status === 'In Progress' || report.status === 'Fixed' ? (
                    <StatusUpdate
                      status="In Progress"
                      date={report.updatedAt || report.timestamp}
                      description="Your report has been assigned to the maintenance team."
                    />
                  ) : null}
                  
                  {report.status === 'Fixed' ? (
                    <StatusUpdate
                      status="Fixed"
                      date={report.updatedAt || report.timestamp}
                      description="The issue has been resolved. Thank you for your report."
                    />
                  ) : null}
                </Card>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold mb-2">Report Not Found</h2>
            <p className="text-muted-foreground mb-6">
              The report you're looking for doesn't exist or may have been removed.
            </p>
            <Button onClick={() => navigate('/reports')}>
              View All Reports
            </Button>
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

interface StatusUpdateProps {
  status: string;
  date: string;
  description: string;
}

function StatusUpdate({ status, date, description }: StatusUpdateProps) {
  return (
    <div className="py-4 px-4">
      <div className="flex justify-between items-start mb-2">
        <span className="font-medium">{status}</span>
        <span className="text-xs text-muted-foreground">
          {format(new Date(date), 'MMM d, yyyy')}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

export default ReportDetail;
