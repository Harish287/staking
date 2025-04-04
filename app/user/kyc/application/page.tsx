"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../../store/slices/store";
import {
  submitKyc,
  suggestUsername,
  verifyUsername,
} from "../../../../store/slices/index";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function KycVerification() {
  const dispatch = useDispatch<AppDispatch>();
  const { isLoading, error } = useSelector((state: RootState) => state.auth);
  const [usernameAvailability, setUsernameAvailability] = useState<string | null>(null);
  const [suggestedUsernames, setSuggestedUsernames] = useState<string[]>([]);
  const [kycStatus, setKycStatus] = useState<string | null>(null);

  const genders = [
    { id: "male", label: "Male" },
    { id: "female", label: "Female" },
  ];

  const documentTypes = [
    { id: "passport", name: "Passport" },
    { id: "badge", name: "Badge" },
    { id: "licence", name: "Licence" },
    // { id: "pancard", name: "PAN Card" },
  ];

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    dob: "",
    username: "",
    mobile: "",
    alternate_mobile: "",
    gender: "",
    country: "",
    state: "",
    city: "",
    postal_code: "",
    address_line_1: "",
    address_line_2: "",
    document_type: "",
    document_one: null as File | null,
    document_two: null as File | null,
    document_photo: null as File | null,
  });

  useEffect(() => {
    if (formData.first_name && formData.dob) {
      // console.log("suggestUsername");

      dispatch(
        suggestUsername({
          name: formData.first_name,
          dob: formData.dob,
        })
      ).then((response) => {
        if (response.payload) {
          setSuggestedUsernames(response.payload);
        }
      });
    }
  }, [formData.first_name, formData.dob, dispatch]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, username: e.target.value });
    dispatch(verifyUsername(e.target.value)).then((response) => {
      if (response.payload) {
        setUsernameAvailability(response.payload);
      }
    });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSelectChange = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "document_one" | "document_two" | "document_photo"
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, [field]: e.target.files[0] });
    }
  };

  const handleRemoveFile = (
    field: "document_one" | "document_two" | "document_photo"
  ) => {
    setFormData({ ...formData, [field]: null });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const submissionData = new FormData();
    Object.keys(formData).forEach((key) => {
      const value = (formData as any)[key];
      if (value) submissionData.append(key, value);
    });

    dispatch(submitKyc({ formData: submissionData })).then((response) => {
      if (response.payload?.detail === "Your KYC Application is waiting for review") {
        setKycStatus(response.payload.detail);
      }
    });
  };

  if (kycStatus) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-lg text-center">
          <h2 className="text-xl font-semibold text-gray-900">KYC Application Submitted</h2>
          <p className="text-gray-700 mt-2">{kycStatus}</p>
        </div>
      </div>
    );
  }
  

  return (
    <div className="max-w-3xl w-full mx-auto bg-white rounded-lg shadow-lg p-6">
      <h1 className="text-2xl font-semibold text-center text-gray-900 mb-4">
        KYC Verification
      </h1>

      {error && (
        <Alert className="bg-red-50 text-red-600">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {/* {error && (
        <Alert className="bg-red-50 text-red-600">
          <AlertDescription>
            {typeof error === "string" ? error : JSON.stringify(error)}
          </AlertDescription>
        </Alert>
      )} */}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="first_name">First Name *</Label>
            <Input id="first_name" onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="last_name">Last Name *</Label>
            <Input id="last_name" onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="dob">Date of Birth *</Label>
            <Input id="dob" type="date" onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="username">Username *</Label>
            <div className="relative">
              <Input
                id="username"
                value={formData.username}
                onChange={handleUsernameChange}
                required
              />

              {usernameAvailability && (
                <p className="text-sm text-gray-600">{usernameAvailability}</p>
              )}

{suggestedUsernames.length > 0 && (
  <Popover>
    <PopoverTrigger asChild>
      <button type="button" className="absolute right-2 top-2 text-sm text-blue-600 underline">
        Suggestions
      </button>
    </PopoverTrigger>
    <PopoverContent align="start" className="w-full bg-white">
      <Select onValueChange={(value) => setFormData({ ...formData, username: value })}>
        <SelectTrigger>
          <SelectValue placeholder="Pick a username" />
        </SelectTrigger>
        <SelectContent>
          {[...new Set(suggestedUsernames)].map((name) => (
            <SelectItem key={name} value={name}>
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </PopoverContent>
  </Popover>
)}

            </div>
          </div>

          <div>
            <Label htmlFor="mobile">Mobile *</Label>
            <Input id="mobile" onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="alternate_mobile">Alternate Mobile</Label>
            <Input id="alternate_mobile" onChange={handleInputChange} />
          </div>

          <div>
            <Label htmlFor="gender">Gender *</Label>
            <Select
              onValueChange={(value) => handleSelectChange("gender", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select gender" />
              </SelectTrigger>
              <SelectContent className=" bg-white">
                {genders.map((g) => (
                  <SelectItem key={g.id} value={g.id}>
                    {g.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="country">Country *</Label>
            <Input id="country" onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="state">State *</Label>
            <Input id="state" onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="city">City *</Label>
            <Input id="city" onChange={handleInputChange} required />
          </div>
          <div>
            <Label htmlFor="postal_code">Postal Code *</Label>
            <Input id="postal_code" onChange={handleInputChange} required />
          </div>
        </div>

        <div>
          <Label htmlFor="address_line_1">Address Line 1 *</Label>
          <Textarea id="address_line_1" onChange={handleInputChange} required />
        </div>
        <div>
          <Label htmlFor="address_line_2">Address Line 2</Label>
          <Textarea id="address_line_2" onChange={handleInputChange} />
        </div>

        <div>
          <Label htmlFor="document_type">Document Type *</Label>
          <Select
            onValueChange={(value) =>
              handleSelectChange("document_type", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent className=" bg-white">
              {documentTypes.map((doc) => (
                <SelectItem key={doc.id} value={doc.id}>
                  {doc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <FileUpload
            id="document_one"
            label="Upload Document One *"
            file={formData.document_one}
            onFileChange={handleFileChange}
            onRemove={handleRemoveFile}
          />
          <FileUpload
            id="document_two"
            label="Upload Document Two"
            file={formData.document_two}
            onFileChange={handleFileChange}
            onRemove={handleRemoveFile}
          />
          <FileUpload
            id="document_photo"
            label="Upload Your Photo *"
            file={formData.document_photo}
            onFileChange={handleFileChange}
            onRemove={handleRemoveFile}
          />
        </div>

        <div className="flex justify-end">
          <Button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-8"
            disabled={isLoading}
          >
            {isLoading ? "Submitting..." : "Submit"}
          </Button>
        </div>
      </form>
    </div>
  );
}

function FileUpload({
  id,
  label,
  file,
  onFileChange,
  onRemove,
}: {
  id: string;
  label: string;
  file: File | null;
  onFileChange: any;
  onRemove: any;
}) {
  return (
    <div className="border-2 border-dashed p-4 text-center relative">
      <input
        id={id}
        type="file"
        className="hidden"
        onChange={(e) => onFileChange(e, id as any)}
      />
      {!file ? (
        <label htmlFor={id} className="cursor-pointer">
          <Upload className="h-12 w-12 text-gray-400 mb-2" />
          <p className="text-blue-600">{label}</p>
        </label>
      ) : (
        <div className="flex items-center justify-between p-2 bg-gray-100 rounded-lg">
          <span className="text-gray-800">{file.name}</span>
          <button
            type="button"
            onClick={() => onRemove(id as any)}
            className="text-red-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  );
}
