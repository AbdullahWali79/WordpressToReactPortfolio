"use client";

import Link from "next/link";
import {
  FileText,
  Layers,
  Briefcase,
  Edit3,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Plus,
  ArrowRight,
  Calendar,
  Eye,
  BarChart3,
  PieChart,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getCmsBasePath } from "@/lib/env";
import { formatDate } from "@/lib/utils";
import { DailyContentWidget } from "@/components/cms/daily-content-widget";

// Mock data - in real implementation, fetch from API
const activityData = [
  { date: "Mon", posts: 4, pages: 2, portfolio: 1 },
  { date: "Tue", posts: 3, pages: 1, portfolio: 2 },
  { date: "Wed", posts: 5, pages: 3, portfolio: 1 },
  { date: "Thu", posts: 2, pages: 1, portfolio: 0 },
  { date: "Fri", posts: 6, pages: 2, portfolio: 3 },
  { date: "Sat", posts: 3, pages: 1, portfolio: 1 },
  { date: "Sun", posts: 4, pages: 2, portfolio: 2 },
];

const statusData = [
  { name: "Published", value: 45, color: "#22c55e" },
  { name: "Drafts", value: 12, color: "#f59e0b" },
  { name: "Scheduled", value: 8, color: "#3b82f6" },
];

const seoData = [
  { name: "Excellent", value: 25, color: "#22c55e" },
  { name: "Good", value: 20, color: "#84cc16" },
  { name: "Average", value: 15, color: "#f59e0b" },
  { name: "Poor", value: 5, color: "#ef4444" },
];

const recentItems = [
  { id: "1", title: "Getting Started with Next.js", type: "post", status: "published", updated: "2024-01-15", seoScore: 92 },
  { id: "2", title: "About Us Page", type: "page", status: "draft", updated: "2024-01-14", seoScore: 65 },
  { id: "3", title: "E-commerce Project", type: "portfolio", status: "published", updated: "2024-01-13", seoScore: 88 },
  { id: "4", title: "SEO Best Practices", type: "post", status: "published", updated: "2024-01-12", seoScore: 95 },
  { id: "5", title: "Contact Page", type: "page", status: "published", updated: "2024-01-11", seoScore: 78 },
];

const stats = [
  {
    title: "Total Posts",
    value: 32,
    icon: FileText,
    change: "+12%",
    changeType: "positive" as const,
    href: "/posts",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    title: "Pages",
    value: 8,
    icon: Layers,
    change: "+5%",
    changeType: "positive" as const,
    href: "/pages",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    title: "Portfolio",
    value: 15,
    icon: Briefcase,
    change: "-2%",
    changeType: "negative" as const,
    href: "/portfolio",
    color: "text-orange-500",
    bgColor: "bg-orange-500/10",
  },
  {
    title: "Drafts",
    value: 5,
    icon: Edit3,
    change: "3 new",
    changeType: "neutral" as const,
    href: "/posts",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
];

export default function CmsDashboardPage() {
  const cmsBasePath = getCmsBasePath();

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Welcome back! Here&apos;s what&apos;s happening with your site.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Calendar className="h-4 w-4" />
            {new Date().toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`${stat.bgColor} p-2 rounded-lg`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-xs font-medium ${
                    stat.changeType === "positive"
                      ? "text-green-600"
                      : stat.changeType === "negative"
                      ? "text-red-600"
                      : "text-muted-foreground"
                  }`}
                >
                  {stat.changeType === "positive" && <TrendingUp className="inline h-3 w-3 mr-1" />}
                  {stat.changeType === "negative" && <TrendingDown className="inline h-3 w-3 mr-1" />}
                  {stat.change}
                </span>
                <span className="text-xs text-muted-foreground">vs last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Activity Chart */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Publishing Activity</CardTitle>
                <CardDescription>Content published in the last 7 days</CardDescription>
              </div>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="posts"
                    stroke="#3b82f6"
                    strokeWidth={2}
                    dot={{ fill: "#3b82f6" }}
                    name="Posts"
                  />
                  <Line
                    type="monotone"
                    dataKey="pages"
                    stroke="#8b5cf6"
                    strokeWidth={2}
                    dot={{ fill: "#8b5cf6" }}
                    name="Pages"
                  />
                  <Line
                    type="monotone"
                    dataKey="portfolio"
                    stroke="#f97316"
                    strokeWidth={2}
                    dot={{ fill: "#f97316" }}
                    name="Portfolio"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Content Status & SEO */}
        <div className="grid gap-6">
          {/* Status Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Content Status</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-8">
                <div className="h-[150px] w-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={70}
                        dataKey="value"
                        paddingAngle={2}
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2">
                  {statusData.map((item) => (
                    <div key={item.name} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-sm">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* SEO Score Distribution */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">SEO Score Distribution</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[120px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={seoData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                      }}
                    />
                    <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                      {seoData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions & Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks you can perform</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href={`${cmsBasePath}/posts/new`}>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Plus className="h-4 w-4" />
                Create New Post
              </Button>
            </Link>
            <Link href={`${cmsBasePath}/pages/new`}>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Plus className="h-4 w-4" />
                Create New Page
              </Button>
            </Link>
            <Link href={`${cmsBasePath}/portfolio/new`}>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Plus className="h-4 w-4" />
                Add Portfolio Project
              </Button>
            </Link>
            <Link href={`${cmsBasePath}/media`}>
              <Button variant="outline" className="w-full justify-start gap-2">
                <Eye className="h-4 w-4" />
                Browse Media Library
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest updates across your content</CardDescription>
              </div>
              <Link href={`${cmsBasePath}/posts`}>
                <Button variant="ghost" size="sm" className="gap-1">
                  View All
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                        item.type === "post"
                          ? "bg-blue-500/10 text-blue-500"
                          : item.type === "page"
                          ? "bg-purple-500/10 text-purple-500"
                          : "bg-orange-500/10 text-orange-500"
                      }`}
                    >
                      {item.type === "post" ? (
                        <FileText className="h-5 w-5" />
                      ) : item.type === "page" ? (
                        <Layers className="h-5 w-5" />
                      ) : (
                        <Briefcase className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium line-clamp-1">{item.title}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span className="capitalize">{item.type}</span>
                        <span>•</span>
                        <span>{formatDate(item.updated)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <Badge
                        variant={item.status === "published" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {item.status}
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">
                        SEO: {item.seoScore}/100
                      </p>
                    </div>
                    <Link
                      href={`${cmsBasePath}/${item.type === "post" ? "posts" : item.type === "page" ? "pages" : "portfolio"}/${item.id}/edit`}
                    >
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <ArrowRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* SEO Alerts */}
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardContent className="pt-6">
          <div className="flex items-start gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-500/20 flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">SEO Attention Needed</h3>
              <p className="text-sm text-muted-foreground mb-3">
                3 items have SEO scores below 70 and need optimization. Improving these could boost your search rankings.
              </p>
              <Link href={`${cmsBasePath}/seo`}>
                <Button size="sm" variant="outline" className="gap-2">
                  View SEO Panel
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keep-Alive Daily Content Widget */}
      <DailyContentWidget />
    </div>
  );
}
