'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useUpdateProfileMutation, useGetProfileQuery } from '../api/authApi';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { toast } from 'sonner';
import { Upload, User, Calendar, Mail } from 'lucide-react';
import { useAppSelector } from '@/lib/store/hooks';

export function ProfileForm() {
  // Check if user is authenticated before making API call
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

  const { data: profileData, isLoading: isLoadingProfile } = useGetProfileQuery(
    undefined,
    { skip: !isAuthenticated }
  );
  const [updateProfile, { isLoading: isUpdating }] = useUpdateProfileMutation();

  const [formData, setFormData] = useState({
    fullName: profileData?.data?.fullName || '',
    gender: profileData?.data?.gender || '',
    dob: profileData?.data?.dob || '',
    avatar: profileData?.data?.avatar || '',
  });

  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(
    profileData?.data?.avatar || null
  );

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      const file = acceptedFiles[0];

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File too large. Please select an image under 5MB');
        return;
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }

      try {
        setIsUploading(true);

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreviewUrl(reader.result as string);
        };
        reader.readAsDataURL(file);

        // Upload to Cloudinary
        const result = await uploadToCloudinary(file);

        setFormData((prev) => ({
          ...prev,
          avatar: result.secure_url,
        }));

        toast.success('Image uploaded successfully!');
      } catch (error) {
        console.error('Upload error:', error);
        toast.error('Failed to upload image. Please try again.');
        setPreviewUrl(formData.avatar || null);
      } finally {
        setIsUploading(false);
      }
    },
    [formData.avatar]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
    },
    maxFiles: 1,
    multiple: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const updateData = {
        fullName: formData.fullName || undefined,
        gender: formData.gender || undefined,
        dob: formData.dob || undefined,
        avatar: formData.avatar || undefined,
      };

      const result = await updateProfile(updateData).unwrap();

      toast.success(result.message || 'Profile updated successfully!');
    } catch (error: unknown) {
      console.error('Update profile error:', error);
      if (error && typeof error === 'object' && 'data' in error) {
        const errorData = error.data as { message?: string };
        toast.error(
          errorData?.message || 'Failed to update profile. Please try again.'
        );
      } else {
        toast.error('Failed to update profile. Please try again.');
      }
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (isLoadingProfile) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  // Update form data when profile data is loaded
  if (profileData?.data && !formData.fullName) {
    setFormData({
      fullName: profileData.data.fullName || '',
      gender: profileData.data.gender || '',
      dob: profileData.data.dob || '',
      avatar: profileData.data.avatar || '',
    });
    setPreviewUrl(profileData.data.avatar || null);
  }

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Personal Information</CardTitle>
        <CardDescription>
          Update your personal information and profile picture
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Upload */}
          <div className="flex flex-col items-center space-y-4">
            <Avatar className="h-32 w-32">
              <AvatarImage
                src={previewUrl || undefined}
                alt={formData.fullName}
              />
              <AvatarFallback className="text-3xl">
                {formData.fullName?.charAt(0)?.toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>

            <div
              {...getRootProps()}
              className={`w-full max-w-md cursor-pointer rounded-lg border-2 border-dashed p-6 transition-colors ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300'} ${isUploading ? 'cursor-not-allowed opacity-50' : 'hover:border-primary'} `}
            >
              <input {...getInputProps()} disabled={isUploading} />
              <div className="flex flex-col items-center justify-center space-y-2 text-center">
                <Upload className="h-8 w-8 text-gray-400" />
                {isUploading ? (
                  <p className="text-sm text-gray-600">Uploading...</p>
                ) : isDragActive ? (
                  <p className="text-sm text-gray-600">Drop image here...</p>
                ) : (
                  <>
                    <p className="text-sm text-gray-600">
                      Drag and drop an image here or click to select
                    </p>
                    <p className="text-xs text-gray-400">
                      PNG, JPG, GIF, WEBP (max 5MB)
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div className="space-y-2">
            <Label htmlFor="fullName" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Full Name
            </Label>
            <Input
              id="fullName"
              type="text"
              value={formData.fullName}
              onChange={(e) => handleChange('fullName', e.target.value)}
              placeholder="Enter your full name"
              required
            />
          </div>

          {/* Email (Read-only) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={profileData?.data?.email || ''}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500">Email cannot be changed</p>
          </div>

          {/* Gender */}
          <div className="space-y-2">
            <Label htmlFor="gender">Gender</Label>
            <Select
              value={formData.gender}
              onValueChange={(value) => handleChange('gender', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="MALE">Male</SelectItem>
                <SelectItem value="FEMALE">Female</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Date of Birth */}
          <div className="space-y-2">
            <Label htmlFor="dob" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Date of Birth
            </Label>
            <Input
              id="dob"
              type="date"
              value={formData.dob}
              onChange={(e) => handleChange('dob', e.target.value)}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end gap-4 pt-4">
            <Button
              type="submit"
              disabled={isUpdating || isUploading}
              className="min-w-[120px]"
            >
              {isUpdating ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
