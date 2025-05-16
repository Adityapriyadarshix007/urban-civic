
import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Upload, MapPin, Check, Loader, Trash2, Droplet, LampFloor, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { ReportCategory } from '@/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

export function ReportForm() {
  const [category, setCategory] = useState<ReportCategory>('Waste');
  const [description, setDescription] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [location, setLocation] = useState({ lat: 0, lng: 0, address: '' });
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  
  const photoInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const handleCategoryChange = (value: string) => {
    setCategory(value as ReportCategory);
  };
  
  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
  };
  
  const handlePhotoClick = () => {
    photoInputRef.current?.click();
  };
  
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      setIsUploading(true);
      
      // Simulate upload delay
      setTimeout(() => {
        const reader = new FileReader();
        reader.onload = () => {
          setPhotoUrl(reader.result as string);
          setIsUploading(false);
        };
        reader.readAsDataURL(file);
      }, 1500);
    }
  };
  
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          
          setLocation({
            lat: latitude,
            lng: longitude,
            address: 'Current location',
          });
          
          setIsGettingLocation(false);
          toast({
            title: "Location detected",
            description: "Your current location has been added to the report.",
          });
        },
        (error) => {
          console.error("Error getting location:", error);
          setIsGettingLocation(false);
          toast({
            variant: "destructive",
            title: "Location error",
            description: "Could not detect your location. Please enter it manually.",
          });
        }
      );
    } else {
      setIsGettingLocation(false);
      toast({
        variant: "destructive",
        title: "Geolocation not supported",
        description: "Your browser does not support geolocation. Please enter your location manually.",
      });
    }
  };
  
  const handleAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocation(prev => ({
      ...prev,
      address: e.target.value,
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API request delay
    setTimeout(() => {
      setIsSubmitting(false);
      toast({
        title: "Report submitted",
        description: "Your report has been successfully submitted.",
      });
      navigate('/reports');
    }, 2000);
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Report an Issue</CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="category">Issue Category</Label>
            <RadioGroup
              id="category"
              value={category}
              onValueChange={handleCategoryChange}
              className="grid grid-cols-2 gap-3 sm:grid-cols-4"
            >
              <div>
                <RadioGroupItem
                  value="Waste"
                  id="waste"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="waste"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-muted/50 p-4 hover:bg-muted/80 peer-data-[state=checked]:border-urban-primary [&:has([data-state=checked])]:border-urban-primary"
                >
                  <Trash2 className="mb-3 h-6 w-6" />
                  <span className="text-sm font-medium">Waste</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem
                  value="Pothole"
                  id="pothole"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="pothole"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-muted/50 p-4 hover:bg-muted/80 peer-data-[state=checked]:border-urban-primary [&:has([data-state=checked])]:border-urban-primary"
                >
                  <AlertCircle className="mb-3 h-6 w-6" />
                  <span className="text-sm font-medium">Pothole</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem
                  value="Leak"
                  id="leak"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="leak"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-muted/50 p-4 hover:bg-muted/80 peer-data-[state=checked]:border-urban-primary [&:has([data-state=checked])]:border-urban-primary"
                >
                  <Droplet className="mb-3 h-6 w-6" />
                  <span className="text-sm font-medium">Leak</span>
                </Label>
              </div>
              
              <div>
                <RadioGroupItem
                  value="Streetlight"
                  id="streetlight"
                  className="peer sr-only"
                />
                <Label
                  htmlFor="streetlight"
                  className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-muted/50 p-4 hover:bg-muted/80 peer-data-[state=checked]:border-urban-primary [&:has([data-state=checked])]:border-urban-primary"
                >
                  <LampFloor className="mb-3 h-6 w-6" />
                  <span className="text-sm font-medium">Streetlight</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <div className="space-y-2">
            <Label>Photo</Label>
            <div className="flex items-center gap-4">
              <div
                onClick={handlePhotoClick}
                className={`w-full h-40 bg-muted/60 rounded-md flex flex-col items-center justify-center cursor-pointer border-2 border-dashed transition-all ${
                  photoUrl ? 'border-transparent' : 'border-muted-foreground/20 hover:border-muted-foreground/30'
                }`}
              >
                <input
                  type="file"
                  ref={photoInputRef}
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="sr-only"
                />
                
                {isUploading ? (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Loader className="h-8 w-8 animate-spin" />
                    <span className="text-sm">Uploading...</span>
                  </div>
                ) : photoUrl ? (
                  <div className="relative w-full h-full">
                    <img
                      src={photoUrl}
                      alt="Issue"
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button variant="secondary" size="sm" type="button">
                        <Camera className="h-4 w-4 mr-2" />
                        Change photo
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <Upload className="h-8 w-8" />
                    <span className="text-sm font-medium">Upload photo</span>
                    <span className="text-xs">Click to browse files</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  id="location"
                  placeholder="Enter address or use current location"
                  value={location.address}
                  onChange={handleAddressChange}
                />
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={getCurrentLocation}
                disabled={isGettingLocation}
              >
                {isGettingLocation ? (
                  <Loader className="h-4 w-4 animate-spin" />
                ) : (
                  <MapPin className="h-4 w-4" />
                )}
              </Button>
            </div>
            <div className="text-xs text-muted-foreground">
              {location.lat && location.lng ? (
                <span>
                  Coordinates: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
                </span>
              ) : (
                <span>Please enter an address or use your current location</span>
              )}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Textarea
              id="description"
              placeholder="Provide any additional details about the issue..."
              rows={4}
              value={description}
              onChange={handleDescriptionChange}
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-end">
          <Button type="submit" className="w-full sm:w-auto" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader className="mr-2 h-4 w-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" />
                Submit Report
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}
