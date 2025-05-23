
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReportList } from '@/components/ReportList';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { mockReports } from '@/data/mockData';
import { Report, ReportStatus } from '@/types';

const Reports = () => {
  const [activeTab, setActiveTab] = useState<string>('all');
  
  const filterReportsByStatus = (status?: ReportStatus): Report[] => {
    if (!status) return mockReports;
    return mockReports.filter(report => report.status === status);
  };
  
  const reports = {
    all: mockReports,
    pending: filterReportsByStatus('Pending'),
    inProgress: filterReportsByStatus('In Progress'),
    fixed: filterReportsByStatus('Fixed'),
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">My Reports</h1>
          
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            defaultValue="all"
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <TabsList>
                <TabsTrigger value="all">
                  All Reports
                  <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
                    {reports.all.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="pending">
                  Pending
                  <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
                    {reports.pending.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="inProgress">
                  In Progress
                  <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
                    {reports.inProgress.length}
                  </span>
                </TabsTrigger>
                <TabsTrigger value="fixed">
                  Fixed
                  <span className="ml-2 rounded-full bg-muted px-2 py-0.5 text-xs">
                    {reports.fixed.length}
                  </span>
                </TabsTrigger>
              </TabsList>
            </div>
            
            <TabsContent value="all">
              <ReportList reports={reports.all} />
            </TabsContent>
            
            <TabsContent value="pending">
              <ReportList reports={reports.pending} />
            </TabsContent>
            
            <TabsContent value="inProgress">
              <ReportList reports={reports.inProgress} />
            </TabsContent>
            
            <TabsContent value="fixed">
              <ReportList reports={reports.fixed} />
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Reports;
