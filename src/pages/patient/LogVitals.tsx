import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Heart, Activity, Droplets, Thermometer, Save, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';

export default function LogVitals() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    systolic: '',
    diastolic: '',
    heartRate: '',
    glucose: '',
    temperature: '',
    date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string) => {
    const numValue = parseFloat(value);
    const validations: Record<string, { min: number; max: number; label: string }> = {
      systolic: { min: 80, max: 200, label: 'Systolic BP' },
      diastolic: { min: 50, max: 120, label: 'Diastolic BP' },
      heartRate: { min: 40, max: 150, label: 'Heart Rate' },
      glucose: { min: 40, max: 400, label: 'Glucose' },
      temperature: { min: 95, max: 105, label: 'Temperature' },
    };

    if (value && validations[name]) {
      const { min, max, label } = validations[name];
      if (numValue < min || numValue > max) {
        return `${label} should be between ${min} and ${max}`;
      }
      if (name === 'systolic' && formData.diastolic && numValue <= parseFloat(formData.diastolic)) {
        return 'Systolic must be higher than diastolic';
      }
    }
    return '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(key => {
      if (key !== 'date') {
        const error = validateField(key, formData[key as keyof typeof formData]);
        if (error) newErrors[key] = error;
        if (!formData[key as keyof typeof formData]) {
          newErrors[key] = 'This field is required';
        }
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast({
        title: 'Validation Error',
        description: 'Please correct the errors in the form',
        variant: 'destructive',
      });
      return;
    }

    // Success
    toast({
      title: 'Vital Signs Saved!',
      description: 'Your health data has been recorded successfully.',
    });

    // Reset form
    setFormData({
      systolic: '',
      diastolic: '',
      heartRate: '',
      glucose: '',
      temperature: '',
      date: format(new Date(), "yyyy-MM-dd'T'HH:mm"),
    });
    setErrors({});
  };

  const FormField = ({ label, name, icon: Icon, unit, placeholder }: any) => (
    <div className="space-y-2">
      <Label htmlFor={name} className="text-lg flex items-center gap-2">
        <Icon className="h-5 w-5 text-primary" />
        {label}
      </Label>
      <div className="flex gap-2">
        <Input
          id={name}
          name={name}
          type="number"
          step={name === 'temperature' ? '0.1' : '1'}
          value={formData[name as keyof typeof formData]}
          onChange={handleChange}
          placeholder={placeholder}
          className="text-xl h-14"
          aria-label={label}
        />
        <div className="flex items-center justify-center bg-muted px-4 rounded-lg min-w-[80px]">
          <span className="text-lg font-semibold text-muted-foreground">{unit}</span>
        </div>
      </div>
      {errors[name] && (
        <p className="text-destructive text-sm font-semibold">{errors[name]}</p>
      )}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold mb-2">Log Vital Signs</h1>
        <p className="text-xl text-muted-foreground">
          Record your health measurements
        </p>
      </div>

      <Card className="card-elevated">
        <CardHeader>
          <CardTitle className="text-2xl">Enter Your Measurements</CardTitle>
          <CardDescription className="text-base">
            All fields are required. Enter your latest vital signs below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Blood Pressure */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Heart className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold">Blood Pressure</h3>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  label="Systolic (Top Number)"
                  name="systolic"
                  icon={Heart}
                  unit="mmHg"
                  placeholder="120"
                />
                <FormField
                  label="Diastolic (Bottom Number)"
                  name="diastolic"
                  icon={Heart}
                  unit="mmHg"
                  placeholder="80"
                />
              </div>
            </div>

            {/* Other Vitals */}
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                label="Heart Rate"
                name="heartRate"
                icon={Activity}
                unit="bpm"
                placeholder="72"
              />
              <FormField
                label="Blood Glucose"
                name="glucose"
                icon={Droplets}
                unit="mg/dL"
                placeholder="95"
              />
            </div>

            <FormField
              label="Body Temperature"
              name="temperature"
              icon={Thermometer}
              unit="°F"
              placeholder="98.6"
            />

            {/* Date Time */}
            <div className="space-y-2">
              <Label htmlFor="date" className="text-lg">Date & Time</Label>
              <Input
                id="date"
                name="date"
                type="datetime-local"
                value={formData.date}
                onChange={handleChange}
                className="text-lg h-14"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button type="submit" size="lg" className="flex-1 btn-large text-lg">
                <Save className="h-6 w-6 mr-2" />
                Save Reading
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="lg"
                className="flex-1 btn-large text-lg"
                onClick={() => navigate('/history')}
              >
                <TrendingUp className="h-6 w-6 mr-2" />
                View Charts
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-accent">
        <CardContent className="p-6">
          <h3 className="font-semibold text-lg mb-2">Normal Ranges</h3>
          <ul className="space-y-1 text-sm">
            <li>• Blood Pressure: 110-140 / 70-90 mmHg</li>
            <li>• Heart Rate: 60-100 bpm</li>
            <li>• Blood Glucose: 70-130 mg/dL</li>
            <li>• Temperature: 97.0-99.5 °F</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
