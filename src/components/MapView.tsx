
import { useEffect, useRef, useState } from 'react';
import { Report } from '@/types';
import { Card } from '@/components/ui/card';
import { Loader } from 'lucide-react';

interface MapViewProps {
  reports: Report[];
  selectedReport?: Report | null;
  onReportSelect?: (report: Report) => void;
}

// This is a mock implementation.
// In a real-world scenario, you would use a proper mapping library like Google Maps, Leaflet, or MapBox
export function MapView({ reports, selectedReport, onReportSelect }: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);
  
  return (
    <Card className="relative overflow-hidden rounded-lg border shadow-sm h-[400px] md:h-[500px] lg:h-[600px] w-full bg-muted/50">
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader className="h-8 w-8 animate-spin text-urban-primary" />
            <p className="text-sm text-muted-foreground">Loading map...</p>
          </div>
        </div>
      ) : (
        <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-74.006,40.7128,10,0/1200x600@2x?access_token=pk.placeholder')] bg-cover bg-center">
          <div className="absolute inset-0 bg-black/10" />
          
          {/* Map markers for reports */}
          {reports.map((report) => {
            // Calculate pseudo positions based on lat/lng
            const x = ((report.location.lng + 180) / 360) * 100;
            const y = ((90 - report.location.lat) / 180) * 100;
            
            return (
              <div
                key={report.id}
                className={`absolute w-4 h-4 rounded-full -translate-x-1/2 -translate-y-1/2 cursor-pointer transform hover:scale-125 transition-transform
                  ${selectedReport?.id === report.id ? 'border-2 border-white' : ''}
                  ${getMarkerColorByCategory(report.category)}
                `}
                style={{ left: `${x}%`, top: `${y}%` }}
                onClick={() => onReportSelect?.(report)}
              />
            );
          })}
          
          {/* Selected report info */}
          {selectedReport && (
            <div className="absolute bottom-4 left-0 right-0 mx-4 glass-card p-3 rounded-lg text-sm animate-fade-up">
              <div className="font-medium">{selectedReport.category} Issue</div>
              <div className="text-xs text-muted-foreground mt-1">
                {selectedReport.location.address || `${selectedReport.location.lat.toFixed(4)}, ${selectedReport.location.lng.toFixed(4)}`}
              </div>
            </div>
          )}
          
          {/* Mock map controls */}
          <div className="absolute right-4 top-4 flex flex-col gap-2">
            <button className="w-8 h-8 bg-background/90 hover:bg-background rounded-md flex items-center justify-center">+</button>
            <button className="w-8 h-8 bg-background/90 hover:bg-background rounded-md flex items-center justify-center">-</button>
          </div>
        </div>
      )}
    </Card>
  );
}

// Helper function to get marker color by category
function getMarkerColorByCategory(category: string): string {
  switch (category) {
    case 'Waste':
      return 'bg-amber-500';
    case 'Pothole':
      return 'bg-red-500';
    case 'Leak':
      return 'bg-blue-500';
    case 'Streetlight':
      return 'bg-yellow-400';
    default:
      return 'bg-gray-500';
  }
}
