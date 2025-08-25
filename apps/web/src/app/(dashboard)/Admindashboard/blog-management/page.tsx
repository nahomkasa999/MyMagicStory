"use client";

import React, { useState, useMemo } from 'react';
import { BlogManagementHeader } from './_Components/blog-management-header';
import { BlogManagementFilters } from './_Components/blog-management-filters';
import { BlogPostsTable, BlogPost } from './_Components/blog-posts-table';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";


// Mock data for blog posts (from the AI reference)
const mockBlogPosts: BlogPost[] = [
  {
    id: 1,
    title: "Getting Started with AI Storytelling",
    author: "Admin User",
    category: "Tutorial",
    status: "published",
    publishDate: "2024-01-15",
    lastUpdated: "2024-01-16",
  },
  {
    id: 2,
    title: "Best Practices for Children's Stories",
    author: "Content Team",
    category: "Guide",
    status: "draft",
    publishDate: null,
    lastUpdated: "2024-01-14",
  },
  {
    id: 3,
    title: "Platform Updates - January 2024",
    author: "Admin User",
    category: "News",
    status: "scheduled",
    publishDate: "2024-01-20",
    lastUpdated: "2024-01-13",
  },
  {
    id: 4,
    title: "The Future of Generative AI in Content",
    author: "Tech Team",
    category: "News",
    status: "published",
    publishDate: "2024-01-10",
    lastUpdated: "2024-01-12",
  },
  {
    id: 5,
    title: "How to Promote Your Stories Online",
    author: "Marketing Team",
    category: "Guide",
    status: "draft",
    publishDate: null,
    lastUpdated: "2024-01-08",
  },
];

function AdminBlogManagementPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  const filteredBlogPosts = useMemo(() => {
    return mockBlogPosts.filter((post) => {
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === "all" || post.status === statusFilter;
      const matchesCategory = categoryFilter === "all" || post.category.toLowerCase() === categoryFilter;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [searchQuery, statusFilter, categoryFilter]);

  const handleCreatePost = () => {
    console.log("Create new blog post clicked!");
    // Implement logic to navigate to a new post creation page or open a modal
  };

  return (
    <div className="space-y-6 w-[70%] m-auto">
      <BlogManagementHeader onCreatePost={handleCreatePost} />
      <BlogManagementFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
      />

      {filteredBlogPosts.length === 0 ? (
        <Card className="flex flex-col items-center justify-center py-16">
          <FileText className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No blog posts found</h3>
          <p className="text-muted-foreground text-center mb-6">
            {searchQuery || statusFilter !== "all" || categoryFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Get started by creating your first blog post"}
          </p>
          <Button className="gap-2" onClick={handleCreatePost}>
            <Plus className="h-4 w-4" />
            Create Your First Post
          </Button>
        </Card>
      ) : (
        <BlogPostsTable posts={filteredBlogPosts} />
      )}
    </div>
  );
}

export default AdminBlogManagementPage;
