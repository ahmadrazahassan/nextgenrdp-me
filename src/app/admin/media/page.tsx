"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Filter,
  Image,
  Download,
  Trash2,
  MoreHorizontal,
  RefreshCw,
  User,
  Calendar,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Flag,
  Eye,
  ImagePlus,
  SlidersHorizontal,
  FolderOpen,
  FileWarning,
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { Toaster } from 'react-hot-toast';

// Define media item interface
interface MediaItem {
  id: string;
  userId: string;
  userName: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  path: string;
  thumbnailPath: string;
  status: "approved" | "pending" | "rejected" | "flagged";
  tags: string[];
  orderId?: string;
}

export default function AdminMediaPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<MediaItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectedImage, setSelectedImage] = useState<MediaItem | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  useEffect(() => {
    const fetchMediaItems = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/admin/media', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const data = await response.json();
        setMediaItems(data);
        setFilteredItems(data);
      } catch (error) {
        console.error("Error fetching media items:", error);
        setMediaItems([]);
        setFilteredItems([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchMediaItems();
  }, []);

  // Apply filters when search term or status filter changes
  useEffect(() => {
    if (mediaItems.length > 0) {
      let result = [...mediaItems];

      // Apply search filter
      if (searchTerm) {
        const lowercaseSearch = searchTerm.toLowerCase();
        result = result.filter(
          (item) =>
            item.fileName.toLowerCase().includes(lowercaseSearch) ||
            item.userName.toLowerCase().includes(lowercaseSearch) ||
            item.tags.some((tag) => tag.toLowerCase().includes(lowercaseSearch))
        );
      }

      // Apply status filter
      if (statusFilter !== "all") {
        result = result.filter((item) => item.status === statusFilter);
      }

      setFilteredItems(result);
    }
  }, [searchTerm, statusFilter, mediaItems]);

  // Format date for display
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + " B";
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
    else return (bytes / 1048576).toFixed(1) + " MB";
  };

  // Get status badge styling
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 border-0 flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3" />
            <span>Approved</span>
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-amber-100 text-amber-800 border-0 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            <span>Pending</span>
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 border-0 flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            <span>Rejected</span>
          </Badge>
        );
      case "flagged":
        return (
          <Badge className="bg-orange-100 text-orange-800 border-0 flex items-center gap-1">
            <Flag className="h-3 w-3" />
            <span>Flagged</span>
          </Badge>
        );
      default:
        return (
          <Badge className="bg-gray-100 text-gray-800 border-0 flex items-center gap-1">
            <span>{status}</span>
          </Badge>
        );
    }
  };

  // Handle selection of media items
  const handleSelectItem = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  // Handle selection of all items
  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredItems.map((item) => item.id));
    }
  };

  // View item details
  const handleViewItem = (item: MediaItem) => {
    setSelectedImage(item);
    setIsViewDialogOpen(true);
  };

  // Handle bulk actions
  const handleBulkAction = (action: string) => {
    switch (action) {
      case "approve":
        handleBulkApprove();
        break;
      case "reject":
        handleBulkReject();
        break;
      case "delete":
        handleBulkDelete();
        break;
      default:
        break;
    }
  };

  // Bulk approve items
  const handleBulkApprove = () => {
    const updatedItems = mediaItems.map((item) => {
      if (selectedItems.includes(item.id)) {
        return { ...item, status: "approved" as MediaItem["status"] };
      }
      return item;
    });

    setMediaItems(updatedItems);
    applyCurrentFilters(updatedItems);
    setSelectedItems([]);
  };

  // Bulk reject items
  const handleBulkReject = () => {
    const updatedItems = mediaItems.map((item) => {
      if (selectedItems.includes(item.id)) {
        return { ...item, status: "rejected" as MediaItem["status"] };
      }
      return item;
    });

    setMediaItems(updatedItems);
    applyCurrentFilters(updatedItems);
    setSelectedItems([]);
  };

  // Bulk delete items
  const handleBulkDelete = () => {
    const updatedItems = mediaItems.filter(
      (item) => !selectedItems.includes(item.id)
    );

    setMediaItems(updatedItems);
    applyCurrentFilters(updatedItems);
    setSelectedItems([]);
  };

  // Apply current filters to updated items
  const applyCurrentFilters = (items: MediaItem[]) => {
    let result = [...items];

    if (searchTerm) {
      const lowercaseSearch = searchTerm.toLowerCase();
      result = result.filter(
        (item) =>
          item.fileName.toLowerCase().includes(lowercaseSearch) ||
          item.userName.toLowerCase().includes(lowercaseSearch) ||
          item.tags.some((tag) => tag.toLowerCase().includes(lowercaseSearch))
      );
    }

    if (statusFilter !== "all") {
      result = result.filter((item) => item.status === statusFilter);
    }

    setFilteredItems(result);
  };

  // Replace setMediaItems, applyCurrentFilters, and refreshMediaItems to show toasts
  const showToast = (type: 'success' | 'error' | 'info', message: string) => {
    if (type === 'success') toast.success(message);
    else if (type === 'error') toast.error(message);
    else toast(message);
  };

  const refreshMediaItems = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/media', {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      const data = await response.json();
      setMediaItems(data);
      setFilteredItems(data);
    } catch (error) {
      setMediaItems([]);
      setFilteredItems([]);
      showToast('error', 'Failed to fetch media items');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (item: MediaItem) => {
    const res = await fetch(`/api/admin/media/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'approved' }),
    });
    if (res.ok) {
      showToast('success', 'Media approved!');
      await refreshMediaItems();
    } else {
      showToast('error', 'Failed to approve media');
    }
  };

  const handleReject = async (item: MediaItem) => {
    const res = await fetch(`/api/admin/media/${item.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'rejected' }),
    });
    if (res.ok) {
      showToast('success', 'Media rejected!');
      await refreshMediaItems();
    } else {
      showToast('error', 'Failed to reject media');
    }
  };

  const handleDelete = async (item: MediaItem) => {
    const res = await fetch(`/api/admin/media/${item.id}`, { method: 'DELETE' });
    if (res.ok) {
      showToast('success', 'Media deleted!');
      await refreshMediaItems();
    } else {
      showToast('error', 'Failed to delete media');
    }
  };

  return (
    <div className="flex-1 space-y-4 p-6 bg-gradient-to-br from-white via-sky-50 to-indigo-50 min-h-screen">
      {/* Page header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Media Management
          </h2>
          <p className="text-gray-500">
            Manage user screenshots and uploaded images
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-gray-200 text-gray-600"
            onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
          >
            {viewMode === "grid" ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <line x1="3" x2="21" y1="12" y2="12" />
                <line x1="3" x2="21" y1="6" y2="6" />
                <line x1="3" x2="21" y1="18" y2="18" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-2"
              >
                <rect width="7" height="7" x="3" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="3" rx="1" />
                <rect width="7" height="7" x="14" y="14" rx="1" />
                <rect width="7" height="7" x="3" y="14" rx="1" />
              </svg>
            )}
            {viewMode === "grid" ? "List View" : "Grid View"}
          </Button>
          <Button className="bg-sky-600 hover:bg-sky-700 text-white">
            <ImagePlus className="h-4 w-4 mr-2" />
            Upload New Image
          </Button>
        </div>
      </div>

      {/* Search and filters */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-[1fr_auto]">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search by filename, user, or tag..."
            className="pl-10 border-gray-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="border-gray-200 text-gray-600 h-10"
          >
            <Filter className="h-4 w-4 mr-2" />
            <span className="hidden md:inline">Filter</span>
          </Button>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[130px] border-gray-200 h-10">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="approved">Approved</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
              <SelectItem value="flagged">Flagged</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Bulk actions */}
      {selectedItems.length > 0 && (
        <div className="bg-sky-50 border border-sky-100 rounded-lg p-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Checkbox
              id="select-all"
              checked={selectedItems.length === filteredItems.length}
              onCheckedChange={handleSelectAll}
            />
            <Label htmlFor="select-all" className="text-sm font-medium">
              {selectedItems.length} items selected
            </Label>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-green-200 text-green-600 hover:text-green-700 hover:bg-green-50"
              onClick={() => handleBulkAction("approve")}
            >
              <CheckCircle2 className="h-4 w-4 mr-1" />
              Approve
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50"
              onClick={() => handleBulkAction("reject")}
            >
              <XCircle className="h-4 w-4 mr-1" />
              Reject
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white border-gray-200 text-gray-600"
              onClick={() => handleBulkAction("delete")}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </div>
        </div>
      )}

      {/* Media content */}
      <Card className="border-0 shadow-md">
        <CardHeader className="px-6 py-5">
          <div className="flex justify-between items-center">
            <CardTitle>Media Files</CardTitle>
            <CardDescription>
              {filteredItems.length} file{filteredItems.length !== 1 ? "s" : ""}{" "}
              found
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="px-6">
          {isLoading ? (
            <div className="py-10 text-center">
              <RefreshCw className="h-8 w-8 mx-auto mb-4 text-gray-400 animate-spin" />
              <p className="text-gray-500">Loading media files...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-10 text-center">
              <Image className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium text-gray-900">
                No media files found
              </h3>
              <p className="text-gray-500 mt-1">
                Try adjusting your search or filters
              </p>
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              <AnimatePresence>
                {filteredItems.map((item) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ duration: 0.3 }}
                    className="group relative border border-gray-200 rounded-lg overflow-hidden bg-white/80 backdrop-blur-md shadow-lg hover:shadow-2xl transition-shadow"
                  >
                    <div className="absolute top-2 left-2 z-10">
                      <Checkbox
                        checked={selectedItems.includes(item.id)}
                        onCheckedChange={() => handleSelectItem(item.id)}
                        className="h-5 w-5 border-2 border-white bg-black/30 opacity-70 group-hover:opacity-100 data-[state=checked]:opacity-100"
                      />
                    </div>
                    <div
                      className="aspect-square bg-gray-100 relative"
                      onClick={() => handleViewItem(item)}
                    >
                      {item.fileType.startsWith('image/') ? (
                        <img
                          src={item.path}
                          alt={item.fileName}
                          className="absolute inset-0 w-full h-full object-cover"
                          style={{ objectFit: 'cover' }}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
                          <Image className="h-10 w-10 text-gray-400" />
                        </div>
                      )}
                      
                      {/* Status indicator */}
                      <div className="absolute bottom-2 right-2">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {getStatusBadge(item.status)}
                        </motion.div>
                      </div>
                    </div>
                    <div className="p-3">
                      <div className="truncate text-sm font-medium">
                        {item.fileName}
                      </div>
                      <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
                        <div className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          {item.userName}
                        </div>
                        <div>{formatFileSize(item.fileSize)}</div>
                      </div>
                      <div className="flex items-center text-xs text-gray-500 mt-1">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(item.uploadDate)}
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {item.tags.map((tag, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs py-0 px-1.5 bg-gray-50"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 bg-white/80 hover:bg-white border-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewItem(item);
                          }}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 bg-white/80 hover:bg-white border-0"
                          asChild
                        >
                          <a href={item.path} download target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4" />
                          </a>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-8 w-8 p-0 bg-white/80 hover:bg-white text-red-500 hover:text-red-600 border-0"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="overflow-x-auto border border-gray-200 rounded-lg">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 font-medium">
                  <tr>
                    <th className="px-4 py-3 text-left w-10">
                      <Checkbox
                        checked={
                          selectedItems.length === filteredItems.length &&
                          filteredItems.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                      />
                    </th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">User</th>
                    <th className="px-4 py-3 text-left">Date</th>
                    <th className="px-4 py-3 text-left">Size</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Tags</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onCheckedChange={() => handleSelectItem(item.id)}
                        />
                      </td>
                      <td
                        className="px-4 py-3 font-medium cursor-pointer"
                        onClick={() => handleViewItem(item)}
                      >
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center mr-3">
                            {item.fileType.startsWith('image/') ? (
                              <img
                                src={item.path}
                                alt={item.fileName}
                                className="h-5 w-5 object-cover"
                              />
                            ) : (
                              <Image className="h-5 w-5 text-gray-400" />
                            )}
                          </div>
                          <span className="truncate max-w-[150px]">
                            {item.fileName}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">{item.userName}</td>
                      <td className="px-4 py-3">
                        {formatDate(item.uploadDate)}
                      </td>
                      <td className="px-4 py-3">
                        {formatFileSize(item.fileSize)}
                      </td>
                      <td className="px-4 py-3">
                        <motion.div
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0.8, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          {getStatusBadge(item.status)}
                        </motion.div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs py-0 px-1.5 bg-gray-50"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleViewItem(item)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0"
                              >
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent 
                              align="end" 
                              className="w-56 bg-white border border-gray-200 shadow-md rounded-lg py-1.5 z-[100]"
                              sideOffset={5}
                              alignOffset={0}
                              avoidCollisions={true}
                            >
                              <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 py-2 px-3">
                                <Eye className="h-4 w-4 mr-2 text-blue-600" />
                                <span>View Details</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer hover:bg-gray-50 py-2 px-3">
                                <Download className="h-4 w-4 mr-2 text-blue-600" />
                                <span>Download</span>
                              </DropdownMenuItem>
                              {item.status !== "approved" && (
                                <DropdownMenuItem className="cursor-pointer hover:bg-green-50 py-2 px-3 text-green-600">
                                  <CheckCircle2 className="h-4 w-4 mr-2" />
                                  <span>Approve</span>
                                </DropdownMenuItem>
                              )}
                              {item.status !== "rejected" && (
                                <DropdownMenuItem className="cursor-pointer hover:bg-red-50 py-2 px-3 text-red-600">
                                  <XCircle className="h-4 w-4 mr-2" />
                                  <span>Reject</span>
                                </DropdownMenuItem>
                              )}
                              {item.status !== "flagged" && (
                                <DropdownMenuItem className="cursor-pointer hover:bg-amber-50 py-2 px-3 text-amber-600">
                                  <Flag className="h-4 w-4 mr-2" />
                                  <span>Flag</span>
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="cursor-pointer hover:bg-red-50 py-2 px-3 text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="text-sm text-gray-500">
            Showing {filteredItems.length} of {mediaItems.length} files
          </div>
        </CardFooter>
      </Card>

      {/* Image view dialog */}
      <AnimatePresence>
        {isViewDialogOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col bg-white !p-0 rounded-xl shadow-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Image className="h-5 w-5 text-sky-600" />
                    {selectedImage?.fileName}
                  </DialogTitle>
                  <DialogDescription>
                    Uploaded by {selectedImage?.userName} on{" "}
                    {selectedImage && formatDate(selectedImage.uploadDate)}
                  </DialogDescription>
                </DialogHeader>
                <div className="flex-1 min-h-0 overflow-y-auto">
                  <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-0 py-0">
                    {/* Image preview */}
                    <div className="flex items-center justify-center min-h-[400px] bg-white p-8">
                      {selectedImage?.fileType.startsWith('image/') ? (
                        <img
                          src={selectedImage.path}
                          alt={selectedImage.fileName}
                          className="max-h-[500px] max-w-full object-contain rounded-lg border border-gray-200 shadow-lg bg-white"
                          style={{ background: 'white' }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <Image className="h-16 w-16 text-gray-400 mb-4" />
                          <p className="text-gray-500">Image preview would appear here</p>
                        </div>
                      )}
                    </div>
                    {/* Image details */}
                    <div className="space-y-4 bg-white p-6 border-l border-gray-100 shadow-sm rounded-r-xl">
                      <div className="p-4 border border-gray-200 rounded-lg bg-white">
                        <h3 className="text-sm font-medium mb-3">File Information</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Status:</span>
                            <span>{getStatusBadge(selectedImage?.status || "")}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">File Name:</span>
                            <span className="font-medium text-gray-900">
                              {selectedImage?.fileName}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Type:</span>
                            <span className="font-medium text-gray-900">
                              {selectedImage?.fileType}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Size:</span>
                            <span className="font-medium text-gray-900">
                              {selectedImage &&
                                formatFileSize(selectedImage.fileSize)}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">Upload Date:</span>
                            <span className="font-medium text-gray-900">
                              {selectedImage && formatDate(selectedImage.uploadDate)}
                            </span>
                          </div>
                          {selectedImage?.orderId && (
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500">Order ID:</span>
                              <span className="font-medium text-gray-900">
                                {selectedImage.orderId}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg bg-white">
                        <h3 className="text-sm font-medium mb-3">User Information</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">User Name:</span>
                            <span className="font-medium text-gray-900">
                              {selectedImage?.userName}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">User ID:</span>
                            <span className="font-medium text-gray-900">
                              {selectedImage?.userId}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="p-4 border border-gray-200 rounded-lg bg-white">
                        <h3 className="text-sm font-medium mb-3">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {selectedImage?.tags.map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-gray-50"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <DialogFooter className="flex justify-between items-center gap-2 pt-4 border-t">
                  <div className="flex gap-2">
                    {selectedImage && selectedImage.status !== "approved" && (
                      <Button
                        variant="default"
                        className="bg-green-600 hover:bg-green-700 text-white font-semibold shadow"
                        onClick={() => handleApprove(selectedImage)}
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                    )}
                    {selectedImage && selectedImage.status !== "rejected" && (
                      <Button
                        variant="destructive"
                        className="bg-red-600 hover:bg-red-700 text-white font-semibold shadow"
                        onClick={() => handleReject(selectedImage)}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    )}
                    {selectedImage && (
                      <Button
                        variant="outline"
                        className="border-red-200 text-red-600 hover:text-red-700 hover:bg-red-50 font-semibold shadow"
                        onClick={() => handleDelete(selectedImage)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </Button>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setIsViewDialogOpen(false)}
                      className="font-semibold"
                    >
                      Close
                    </Button>
                    {selectedImage && (
                      <Button className="bg-sky-600 hover:bg-sky-700 text-white font-semibold shadow" asChild>
                        <a href={selectedImage.path} download target="_blank" rel="noopener noreferrer">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </a>
                      </Button>
                    )}
                  </div>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </motion.div>
        )}
      </AnimatePresence>
      <Toaster position="top-right" />
    </div>
  );
} 