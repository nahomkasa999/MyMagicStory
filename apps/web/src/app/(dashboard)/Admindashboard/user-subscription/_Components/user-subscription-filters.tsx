import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Calendar } from "lucide-react";

interface UserSubscriptionFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  planFilter: string;
  setPlanFilter: (plan: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  quotaFilter: string;
  setQuotaFilter: (quota: string) => void;
}

export function UserSubscriptionFilters({
  searchQuery,
  setSearchQuery,
  planFilter,
  setPlanFilter,
  statusFilter,
  setStatusFilter,
  quotaFilter,
  setQuotaFilter,
}: UserSubscriptionFiltersProps) {
  return (
    <div className="flex items-center gap-4 flex-wrap"> {/* Added flex-wrap for responsiveness */}
      <div className="relative flex-1 max-w-sm min-w-[200px]"> {/* Added min-w for better mobile layout */}
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by email, name, or user ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={planFilter} onValueChange={setPlanFilter}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Subscription" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="Pro">Pro</SelectItem>
          <SelectItem value="Starter">Starter</SelectItem>
          <SelectItem value="Free">Free</SelectItem>
          <SelectItem value="Cancelled">Cancelled</SelectItem>
          <SelectItem value="Trialing">Trialing</SelectItem>
          <SelectItem value="Suspended">Suspended</SelectItem>
        </SelectContent>
      </Select>
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="Active">Active</SelectItem>
          <SelectItem value="Suspended">Suspended</SelectItem>
          <SelectItem value="Inactive">Inactive</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" className="gap-2 bg-transparent">
        <Calendar className="h-4 w-4" />
        Registration Date
      </Button>
      <Select value={quotaFilter} onValueChange={setQuotaFilter}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Quota" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="near-limit">Near Limit</SelectItem>
          <SelectItem value="exceeded">Exceeded</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
