"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { updateUserProfile } from "@/actions/user.actions";
import { useRouter } from "next/navigation";
import { LoaderCircle } from "lucide-react";

interface FormData {
  firstName: string;
  lastName: string;
  phoneNo: string;
}

interface FormErrors {
  firstName?: string;
  lastName?: string;
  phoneNo?: string;
}

const CompleteProfileForm = ({ userId }: { userId: string | undefined }) => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    phoneNo: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!userId) {
    return (
      <Card className="w-full max-w-md">
        <CardContent className="pt-6">
          <p className="text-center text-primary">
            User ID is required to complete the profile.
          </p>
        </CardContent>
      </Card>
    );
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // First name validation
    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    } else if (formData.firstName.trim().length < 2) {
      newErrors.firstName = "First name must be at least 2 characters";
    }

    // Last name validation
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    } else if (formData.lastName.trim().length < 2) {
      newErrors.lastName = "Last name must be at least 2 characters";
    }

    // Phone number validation
    if (!formData.phoneNo.trim()) {
      newErrors.phoneNo = "Phone number is required";
    } else if (!/^\+?[\d\s\-\(\)]{10,}$/.test(formData.phoneNo.trim())) {
      newErrors.phoneNo = "Please enter a valid phone number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await updateUserProfile(userId, {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        phoneNo: formData.phoneNo.trim(),
      });

      if (result.status) {
        router.refresh(); // Refresh the page to show updated state
      } else {
        setErrors({ firstName: "Failed to update profile. Please try again." });
      }
    } catch {
      setErrors({ firstName: "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-md">
      <CardHeader className="my-4">
        <CardTitle className="text-primary text-base md:text-2xl 2xl:text-3xl">
          Complete Your Profile
        </CardTitle>
        <CardDescription className="2xl:text-lg">
          Please provide your details to continue.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              type="text"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              placeholder="Enter your first name"
              className={errors.firstName ? "border-red-500" : ""}
            />
            {errors.firstName && (
              <p className="text-sm 2xl:text-base text-red-500">
                {errors.firstName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              placeholder="Enter your last name"
              className={errors.lastName ? "border-red-500" : ""}
            />
            {errors.lastName && (
              <p className="text-sm 2xl:text-base text-red-500">
                {errors.lastName}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phoneNo">Phone Number</Label>
            <Input
              id="phoneNo"
              type="tel"
              value={formData.phoneNo}
              onChange={(e) => handleInputChange("phoneNo", e.target.value)}
              placeholder="Enter your phone number"
              className={errors.phoneNo ? "border-red-500" : ""}
            />
            {errors.phoneNo && (
              <p className="text-sm 2xl:text-base text-red-500">
                {errors.phoneNo}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex gap-2">
                <LoaderCircle className="animate-spin size-4 2xl:size-6" />
                Updating...
              </span>
            ) : (
              "Complete Profile"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default CompleteProfileForm;
