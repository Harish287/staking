"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams, useRouter } from "next/navigation";
import { fetchKycApplications } from "../../../store/slices/index";
import { RootState, AppDispatch } from "../../../store/slices/store";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Eye, Logs, MoreVertical, SquareCheck, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

const KycApplications = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🔍 Get params from URL
  const statusParam = searchParams.get("status") || "All";
  const pageParam = parseInt(searchParams.get("page") || "1", 10);
  const pageSizeParam = parseInt(searchParams.get("page_size") || "10", 10);

  const [searchQuery, setSearchQuery] = useState("");

  const { kycApplications, isLoading, error, totalPages } = useSelector(
    (state: RootState) => ({
      kycApplications: state.auth?.kycApplications ?? [],
      isLoading: state.auth?.isLoading ?? false,
      error: state.auth?.error ?? null,
      totalPages: state.auth?.totalPages ?? 1,
    })
  );

  // 🛠️ Fetch data based on URL query
  useEffect(() => {
    dispatch(
      fetchKycApplications({ page: pageParam, page_size: pageSizeParam })
    )
      .unwrap()
      .then((res) => console.log("Success:", res))
      .catch((err) => console.error("Error fetching:", err));
  }, [dispatch, pageParam, pageSizeParam]);

  // 🧠 Memoized filter logic
  const filteredApplications = useMemo(() => {
    return kycApplications.filter((app) => {
      const matchesSearch =
        app.user_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.user_id.toLowerCase().includes(searchQuery.toLowerCase());

      const statusMatch =
        statusParam === "All" ||
        (statusParam === "pending" && !app.status) ||
        (statusParam === "approve" && app.status === "verified") ||
        (statusParam === "rejected" && app.status === "rejected");

      return matchesSearch && statusMatch;
    });
  }, [kycApplications, searchQuery, statusParam]);

  // 🔁 Handle page change
  const changePage = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/admin/KYCList?${params.toString()}`);
  };

  // 🗂️ Handle tab change
  const handleTabChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("status", value);
    params.set("page", "1"); // Reset to first page on tab change
    router.push(`/admin/KYCList?${params.toString()}`);
  };

  return (
    <div className=" bg-blue-100">
      <Card className="p-6 shadow-xl rounded-xl container m-auto w-[90%] bg-white">
        <h2 className="text-2xl font-semibold mb-6">KYC Applications</h2>

        {/* 🔍 Search */}
        <Input
          className="mb-4"
          placeholder="Search by Username or User ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        {/* 📁 Tabs */}
        <Tabs
          value={statusParam}
          onValueChange={handleTabChange}
          className="mb-4"
        >
          <TabsList>
            <TabsTrigger value="All">All</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="approve">Approved</TabsTrigger>
            <TabsTrigger value="rejected">Rejected</TabsTrigger>
          </TabsList>
        </Tabs>

        {isLoading && <p className="text-gray-500">Loading...</p>}
        {error && <p className="text-red-500">{error}</p>}

        {!isLoading && !error && filteredApplications.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-100">
                  <TableHead>Name</TableHead>
                  <TableHead>Username</TableHead>
                  <TableHead>Document Type</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((app) => (
                  <TableRow key={app.user_id}>
                    <TableCell>{app.name}</TableCell>
                    <TableCell>{app.user_name}</TableCell>
                    <TableCell>{app.doc_type}</TableCell>
                    <TableCell>{app.submitted}</TableCell>
                    <TableCell>
                      {app.status === "verified" ? (
                        <span className="text-green-500 font-semibold">
                          Verified
                        </span>
                      ) : app.status === "rejected" ? (
                        <span className="text-red-500 font-semibold">
                          Rejected
                        </span>
                      ) : (
                        <span className="text-yellow-500 font-semibold border p-1">
                          Pending
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="p-2">
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className=" bg-white">
                          <Link
                            href={`/admin/KYCList/kycdetails/${app.user_id}`}
                          >
                            <DropdownMenuItem
                              className="text-[12px]"
                              onClick={() => console.log("Viewing Logs")}>
                              <Eye /> VIEW DETAILS
                            </DropdownMenuItem>
                          </Link>
                          <DropdownMenuItem
                            className="text-[12px]"
                            onClick={() => console.log("Downloading Logs")}
                          >
                            <SquareCheck /> APPROVE OR REJECT
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-[12px]"
                            onClick={() => console.log("More Details")}
                          >
                            <Trash2 /> DELETE
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {/* 📜 Pagination */}

            <div className="flex justify-between items-center mt-4">
              <div className=" flex gap-2">
                <Button
                  className=" bg-gray-400 text-[14px]"
                  onClick={() => changePage(Math.max(pageParam - 1, 1))}
                  disabled={pageParam <= 1}
                >
                  PREV
                </Button>
                <Button
                  className=" bg-gray-400 text-[14px]"
                  onClick={() => changePage(pageParam + 1)}
                  disabled={pageParam >= totalPages}
                >
                  NEXT
                </Button>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-base">Page</span>
                <Select
                  value={pageParam.toString()}
                  onValueChange={(value) => changePage(parseInt(value))}
                >
                  <SelectTrigger className="w-20">
                    <SelectValue placeholder={`Page ${pageParam}`} />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                      (p) => (
                        <SelectItem key={p} value={p.toString()}>
                          {p}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
                <span className="text-base">of {totalPages}</span>
              </div>
            </div>
          </>
        ) : (
          !isLoading && (
            <p className="text-gray-600">No KYC applications found.</p>
          )
        )}
      </Card>
    </div>
  );
};

export default KycApplications;
