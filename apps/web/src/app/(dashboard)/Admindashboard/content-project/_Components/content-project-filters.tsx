import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Search, Calendar } from "lucide-react";

interface ContentProjectFiltersProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
  pagesFilter: string;
  setPagesFilter: (pages: string) => void;
}

export function ContentProjectFilters({
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  pagesFilter,
  setPagesFilter,
}: ContentProjectFiltersProps) {
  return (
    <div className="flex items-center gap-4 flex-wrap">
      <div className="relative flex-1 max-w-sm min-w-[200px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search by title, user, or project ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="COMPLETED">Completed</SelectItem>
          <SelectItem value="PENDING">Pending</SelectItem>
          <SelectItem value="FAILED">Failed</SelectItem>
          <SelectItem value="DRAFT">Draft</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" className="gap-2 bg-transparent">
        <Calendar className="h-4 w-4" />
        Generation Date
      </Button>
      <Select value={pagesFilter} onValueChange={setPagesFilter}>
        <SelectTrigger className="w-32">
          <SelectValue placeholder="Pages" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="1-10">1-10 pages</SelectItem>
          <SelectItem value="11-20">11-20 pages</SelectItem>
          <SelectItem value="21+">21+ pages</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
