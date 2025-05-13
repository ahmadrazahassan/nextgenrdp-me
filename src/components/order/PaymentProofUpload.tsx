'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { useDropzone, FileRejection } from 'react-dropzone';
import {
  UploadCloud,
  XCircle,
  CheckCircle,
  Loader2,
  File as FileIcon,
  Image as ImageIcon,
  AlertCircle,
} from 'lucide-react';
import NextImage from 'next/image'; // Renamed to avoid conflict with lucide icon
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress'; // Assuming you have Progress from shadcn/ui
import { useAuth } from '@/hooks/use-auth';

const MAX_SIZE_MB = 5;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
const ALLOWED_MIME_TYPES = {
  'image/jpeg': [],
  'image/png': [],
  'image/gif': [],
  'image/webp': [],
  'application/pdf': [],
};
const ALLOWED_EXTENSIONS_STRING = "JPG, PNG, GIF, WEBP, PDF";

interface PaymentProofUploadProps {
  onUploadSuccess: (fileUrl: string, fileName: string) => void;
  onUploadError?: (errorMessage: string) => void;
  orderId?: string; // Add orderId as optional prop
}

const PaymentProofUpload: React.FC<PaymentProofUploadProps> = ({
  onUploadSuccess,
  onUploadError,
  orderId,
}) => {
  const { user } = useAuth(); // Get current user
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null); // Data URL for preview
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<{ url: string; name: string } | null>(null);

  const clearState = (keepSuccess = false) => {
    setFile(null);
    setPreview(null);
    setError(null);
    setUploadProgress(null);
    setIsUploading(false);
    if (!keepSuccess) {
        setSuccessInfo(null);
    }
  };

  const onDrop = useCallback(
    (acceptedFiles: File[], fileRejections: FileRejection[]) => {
      clearState(); // Clear previous state on new drop

      if (fileRejections.length > 0) {
        const firstRejection = fileRejections[0];
        if (firstRejection.errors.some((e) => e.code === 'file-too-large')) {
          setError(`File is too large. Max size: ${MAX_SIZE_MB}MB.`);
        } else if (firstRejection.errors.some((e) => e.code === 'file-invalid-type')) {
          setError(`Invalid file type. Allowed: ${ALLOWED_EXTENSIONS_STRING}.`);
        } else {
          setError(firstRejection.errors[0]?.message || 'File rejected.');
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        const selectedFile = acceptedFiles[0];
        setFile(selectedFile);

        // Generate preview
        if (selectedFile.type.startsWith('image/')) {
          const reader = new FileReader();
          reader.onloadend = () => {
            setPreview(reader.result as string);
          };
          reader.readAsDataURL(selectedFile);
        } else {
          setPreview(null); // No preview for non-image files like PDF
        }
      }
    },
    []
  );

  const { getRootProps, getInputProps, isDragActive, isFocused } = useDropzone({
    onDrop,
    accept: ALLOWED_MIME_TYPES,
    maxSize: MAX_SIZE_BYTES,
    maxFiles: 1,
    multiple: false,
  });

  const handleUpload = useCallback(async () => {
    if (!file) return;
    if (!user?.id) {
      setError('You must be logged in to upload proof.');
      if (onUploadError) onUploadError('You must be logged in to upload proof.');
      return;
    }
    setIsUploading(true);
    setUploadProgress(0);
    setError(null);
    setSuccessInfo(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('userId', user.id); // Always include userId
    if (orderId) formData.append('orderId', orderId); // Optionally include orderId

    try {
      // NOTE: Standard fetch doesn't support progress easily.
      // For progress, you'd typically use XMLHttpRequest or a library like Axios.
      // Simulating progress for demo purposes, then calling fetch.
      await new Promise(res => setTimeout(res, 200)); setUploadProgress(30);
      await new Promise(res => setTimeout(res, 300)); setUploadProgress(70);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(100);
      await new Promise(res => setTimeout(res, 300)); // Short delay to show 100%

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Upload failed');
      }
      
      setSuccessInfo({ url: result.url, name: result.originalName || file.name });
      onUploadSuccess(result.url, result.originalName || file.name);
      setFile(null); // Clear the file state after successful upload

    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred during upload.';
      setError(errorMessage);
      if (onUploadError) onUploadError(errorMessage);
      clearState(); // Clear state on error
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      // Don't clear file/preview here if success, as successInfo handles the display
    }
  }, [file, onUploadSuccess, onUploadError, user?.id, orderId]);

  // --- Auto-upload Effect --- 
  useEffect(() => {
    if (file && !isUploading && !successInfo) {
      handleUpload();
    }
    // Intentionally not including handleUpload in dependency array
    // as its definition depends on 'file' which is already here.
    // Adding it can cause infinite loops if not careful.
  }, [file, isUploading, successInfo]); 

  const handleRemoveSelection = () => {
    clearState();
    onUploadSuccess('', ''); // Notify parent that proof is removed/cleared
  };

  const dropzoneClassName = useMemo(() => {
    let baseClasses = "p-6 sm:p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white focus:ring-indigo-500";
    if (isUploading) {
        baseClasses += " opacity-70 cursor-default"; // Indicate disabled state during upload
    }
    else if (isDragActive) {
      baseClasses += " border-indigo-500 bg-indigo-50 ring-indigo-500";
    } else if (isFocused) {
      baseClasses += " border-indigo-500 ring-indigo-500";
    } else {
      baseClasses += " border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100";
    }
    return baseClasses;
  }, [isDragActive, isFocused, isUploading]);

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Upload Payment Proof</h3>
      <p className="text-sm text-gray-500 mb-4">
        Upload a clear screenshot or PDF of your transaction receipt.
      </p>

      {/* Display Success Info - Light Theme */}
      {successInfo && (
        <div className="mt-3 p-4 bg-green-50 border border-green-300 rounded-lg flex items-center justify-between space-x-3 shadow-sm">
          <div className="flex items-center space-x-3 min-w-0">
            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0" />
            <div className="min-w-0">
                <p className="text-sm font-medium text-green-800">Proof Uploaded:</p>
                <p className="text-xs text-gray-600 truncate" title={successInfo.name}>{successInfo.name}</p>
            </div>
           </div>
           <Button variant="ghost" size="sm" onClick={handleRemoveSelection} className="text-gray-500 hover:text-gray-800 flex-shrink-0">
             Replace
           </Button>
        </div>
      )}

      {/* Display Error - Light Theme */}
      {error && (
         <div className="mt-3 p-3 bg-red-50 border border-red-300 rounded-md flex items-center space-x-2 shadow-sm">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700 font-medium flex-grow">{error}</p>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 flex-shrink-0"><XCircle size={18} /></button>
          </div>
      )}

      {/* Display Dropzone and Preview/Upload controls (only if no success yet) */} 
      {!successInfo && (
        <div {...getRootProps()} className={dropzoneClassName}>
          <input {...getInputProps()} disabled={isUploading} />
          {
            isUploading ? (
              <div className="flex flex-col items-center justify-center text-indigo-600">
                 <Loader2 className="h-10 w-10 sm:h-12 sm:w-12 mx-auto animate-spin mb-3" />
                 <p className="text-sm sm:text-base font-medium">Uploading...</p>
                 {uploadProgress !== null && (
                     <Progress value={uploadProgress} className="w-3/4 mt-3 h-1.5 bg-gray-200" />
                 )}
              </div>
            ) : file ? (
              // Show preview of selected file before upload starts (or if upload was interrupted?)
              // This state is very brief now due to auto-upload
               <div className="flex flex-col items-center text-center">
                 {preview ? (
                    <NextImage src={preview} alt="Preview" width={64} height={64} className="rounded border border-gray-200 object-cover h-16 w-16 mb-2" />
                 ) : (
                    <FileIcon className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-400 mb-2" />
                 )}
                 <p className="text-xs text-gray-600 font-medium truncate max-w-full px-2" title={file.name}>{file.name}</p>
                 <p className="text-xs text-gray-500">Ready to upload</p> 
               </div>
            ) : (
               // Default dropzone prompt
               <>
                 <UploadCloud className="h-10 w-10 sm:h-12 sm:w-12 mx-auto text-gray-400 mb-3" />
                 <p className="text-sm sm:text-base text-gray-600 font-medium">
                   {isDragActive ? "Drop the proof here..." : "Drag & drop file or click to browse"}
                 </p>
                 <p className="text-xs text-gray-500 mt-1">
                   Max {MAX_SIZE_MB}MB. Allowed: {ALLOWED_EXTENSIONS_STRING}
                 </p>
               </>
            )
          }
        </div>
      )}
    </div>
  );
};

export default PaymentProofUpload; 