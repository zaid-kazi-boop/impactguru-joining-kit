import { useState, useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Search, Download, Eye, FileText, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import SubmissionDetails from "@/components/SubmissionDetails";
import NotificationsLog from "@/components/NotificationsLog";

const ITEMS_PER_PAGE = 10;

export default function HRDashboard() {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSubmission, setSelectedSubmission] = useState<number | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  // Fetch submissions
  const { data: listData, isLoading: isLoadingList } = trpc.joiningKit.list.useQuery({
    limit: ITEMS_PER_PAGE,
    offset: currentPage * ITEMS_PER_PAGE,
  });

  // Search submissions
  const { data: searchData, isLoading: isSearching } = trpc.joiningKit.search.useQuery(
    { query: searchQuery },
    { enabled: searchQuery.length > 0 }
  );

  // Get selected submission details
  const { data: submissionDetails } = trpc.joiningKit.getById.useQuery(
    { id: selectedSubmission! },
    { enabled: !!selectedSubmission }
  );

  const submissions = searchQuery.length > 0 ? searchData : listData?.submissions;
  const totalCount = searchQuery.length > 0 ? searchData?.length || 0 : listData?.count || 0;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(0);
  };

  const handleViewDetails = (id: number) => {
    setSelectedSubmission(id);
    setIsDetailsOpen(true);
  };

  const handleDownloadPDF = async (submission: any) => {
    try {
      // Generate PDF from submission data
      const htmlContent = generatePDFHTML(submission);
      const element = document.createElement("div");
      element.innerHTML = htmlContent;
      document.body.appendChild(element);

      // Use window.print() as a simple PDF generation method
      // In production, you'd use a library like pdfkit or html2pdf
      window.print();
      document.body.removeChild(element);
      toast.success("PDF ready for download");
    } catch (error) {
      toast.error("Failed to generate PDF");
      console.error(error);
    }
  };

  const handleBulkDownload = async () => {
    if (!submissions || submissions.length === 0) {
      toast.error("No submissions to download");
      return;
    }

    try {
      const csvContent = [
        [
          "ID",
          "Full Name",
          "Employee ID",
          "Email",
          "Phone",
          "Designation",
          "Department",
          "Date of Joining",
          "Status",
          "Submitted At",
        ].join(","),
        ...submissions!.map((s) =>
          [
            s.id,
            `"${s.fullName}"`,
            s.employeeId,
            s.personalEmail,
            s.mobileNumber,
            s.designation,
            s.department,
            s.dateOfJoining,
            s.status,
            new Date(s.submittedAt).toLocaleString(),
          ].join(",")
        ),
      ].join("\n");

      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `joining-kits-${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast.success(`Downloaded ${submissions.length} submissions as CSV`);
    } catch (error) {
      toast.error("Failed to download submissions");
    }
  };

  const stats = useMemo(() => {
    return {
      total: totalCount,
      submitted: submissions?.filter((s: any) => s.status === "submitted").length || 0,
      reviewed: submissions?.filter((s: any) => s.status === "reviewed").length || 0,
      approved: submissions?.filter((s: any) => s.status === "approved").length || 0,
    };
  }, [submissions, totalCount]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">HR Dashboard</h1>
            <p className="text-slate-600 mt-1">Manage and review employee joining kit submissions</p>
          </div>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => window.location.href = '/'}
              className="text-sm"
            >
              Back to Form
            </Button>
            <Button onClick={handleBulkDownload} className="flex gap-2">
              <Download className="w-4 h-4" />
              Bulk Download
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard label="Total Submissions" value={stats.total} color="blue" />
          <StatCard label="Submitted" value={stats.submitted} color="yellow" />
          <StatCard label="Reviewed" value={stats.reviewed} color="purple" />
          <StatCard label="Approved" value={stats.approved} color="green" />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Joining Kit Submissions</CardTitle>
            <CardDescription>View and manage all employee submissions</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Search Bar */}
            <div className="mb-6 flex gap-2">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search by employee name or email..."
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  className="pl-10"
                />
              </div>
              {searchQuery && (
                <Button
                  variant="outline"
                  onClick={() => handleSearch("")}
                >
                  Clear
                </Button>
              )}
            </div>

            {/* Table */}
            {isLoadingList || isSearching ? (
              <div className="text-center py-12">
                <Loader2 className="w-8 h-8 text-slate-400 mx-auto mb-3 animate-spin" />
                <p className="text-slate-600">Loading submissions...</p>
              </div>
            ) : submissions && submissions.length > 0 ? (
              <>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Employee Name</TableHead>
                        <TableHead>Employee ID</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Designation</TableHead>
                        <TableHead>Submitted Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {submissions.map((submission: any) => (
                        <TableRow key={submission.id}>
                          <TableCell className="font-medium">{submission.fullName}</TableCell>
                          <TableCell>{submission.employeeId}</TableCell>
                          <TableCell className="text-sm">{submission.personalEmail}</TableCell>
                          <TableCell>{submission.designation}</TableCell>
                          <TableCell className="text-sm">
                            {new Date(submission.submittedAt).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={submission.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleViewDetails(submission.id)}
                                className="flex gap-1"
                              >
                                <Eye className="w-4 h-4" />
                                View
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDownloadPDF(submission)}
                                className="flex gap-1"
                              >
                                <FileText className="w-4 h-4" />
                                PDF
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-6 flex justify-center">
                    <Pagination>
                      <PaginationContent>
                        <PaginationItem>
                          <PaginationPrevious
                            onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                            className={currentPage === 0 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                        {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                          const pageNum = i;
                          return (
                            <PaginationItem key={pageNum}>
                              <PaginationLink
                                onClick={() => setCurrentPage(pageNum)}
                                isActive={currentPage === pageNum}
                                className="cursor-pointer"
                              >
                                {pageNum + 1}
                              </PaginationLink>
                            </PaginationItem>
                          );
                        })}
                        <PaginationItem>
                          <PaginationNext
                            onClick={() => setCurrentPage(Math.min(totalPages - 1, currentPage + 1))}
                            className={currentPage === totalPages - 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          />
                        </PaginationItem>
                      </PaginationContent>
                    </Pagination>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-600">No submissions found</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Details Modal */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Submission Details</DialogTitle>
            <DialogDescription>
              View complete information for this joining kit submission
            </DialogDescription>
          </DialogHeader>
          {submissionDetails && <SubmissionDetails submission={submissionDetails} />}
        </DialogContent>
      </Dialog>

      {/* Notifications Log */}
      <div className="mt-8">
        <NotificationsLog />
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "blue" | "yellow" | "purple" | "green";
}) {
  const colorClasses = {
    blue: "bg-blue-50 text-blue-700 border-blue-200",
    yellow: "bg-yellow-50 text-yellow-700 border-yellow-200",
    purple: "bg-purple-50 text-purple-700 border-purple-200",
    green: "bg-green-50 text-green-700 border-green-200",
  };

  return (
    <Card className={`border ${colorClasses[color]}`}>
      <CardContent className="pt-6">
        <p className="text-sm font-medium text-slate-600 mb-2">{label}</p>
        <p className="text-3xl font-bold">{value}</p>
      </CardContent>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const statusConfig = {
    draft: { bg: "bg-slate-100", text: "text-slate-700", label: "Draft" },
    submitted: { bg: "bg-blue-100", text: "text-blue-700", label: "Submitted" },
    reviewed: { bg: "bg-purple-100", text: "text-purple-700", label: "Reviewed" },
    approved: { bg: "bg-green-100", text: "text-green-700", label: "Approved" },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.draft;

  return (
    <Badge className={`${config.bg} ${config.text} border-0`}>
      {config.label}
    </Badge>
  );
}

function generatePDFHTML(submission: any): string {
  return `
    <html>
      <head>
        <title>Joining Kit - ${submission.fullName}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px; }
          .section { margin: 20px 0; }
          .field { display: grid; grid-template-columns: 200px 1fr; margin: 10px 0; }
          .label { font-weight: bold; color: #555; }
          .value { color: #333; }
        </style>
      </head>
      <body>
        <h1>Employee Joining Kit</h1>
        <div class="section">
          <h2>Personal Information</h2>
          <div class="field"><span class="label">Full Name:</span><span class="value">${submission.fullName}</span></div>
          <div class="field"><span class="label">Email:</span><span class="value">${submission.personalEmail}</span></div>
          <div class="field"><span class="label">Mobile:</span><span class="value">${submission.mobileNumber}</span></div>
        </div>
        <div class="section">
          <h2>Employment Information</h2>
          <div class="field"><span class="label">Employee ID:</span><span class="value">${submission.employeeId}</span></div>
          <div class="field"><span class="label">Designation:</span><span class="value">${submission.designation}</span></div>
          <div class="field"><span class="label">Department:</span><span class="value">${submission.department}</span></div>
          <div class="field"><span class="label">Date of Joining:</span><span class="value">${submission.dateOfJoining}</span></div>
        </div>
      </body>
    </html>
  `;
}
