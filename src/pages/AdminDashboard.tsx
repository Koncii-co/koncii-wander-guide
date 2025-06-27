
import { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { analyticsService, AnalyticsSummary } from '@/services/analyticsService';
import { Users, Calendar, MapPin, DollarSign, MessageSquare, TrendingUp, Shield } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { user, isAuthenticated, isLoading } = useAuth0();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [userTrend, setUserTrend] = useState<{ date: string; count: number }[]>([]);
  const [bookingTrend, setBookingTrend] = useState<{ date: string; count: number; revenue: number }[]>([]);
  const [userRole, setUserRole] = useState<'admin' | 'user' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        navigate('/auth');
        return;
      }
      checkAccess();
    }
  }, [isAuthenticated, isLoading, navigate]);

  const checkAccess = async () => {
    try {
      const role = await analyticsService.checkUserRole();
      setUserRole(role);
      
      if (role !== 'admin') {
        toast({
          title: "Access Denied",
          description: "You don't have permission to access the admin dashboard.",
          variant: "destructive",
        });
        navigate('/');
        return;
      }

      await loadDashboardData();
    } catch (error) {
      console.error('Error checking access:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const loadDashboardData = async () => {
    try {
      const [summaryData, userTrendData, bookingTrendData] = await Promise.all([
        analyticsService.getAnalyticsSummary(),
        analyticsService.getUserRegistrationTrend(30),
        analyticsService.getBookingTrend(30)
      ]);

      setSummary(summaryData);
      setUserTrend(userTrendData);
      setBookingTrend(bookingTrendData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data.",
        variant: "destructive",
      });
    }
  };

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (userRole !== 'admin') {
    return null;
  }

  const chartConfig = {
    count: {
      label: "Count",
      color: "hsl(var(--chart-1))",
    },
    revenue: {
      label: "Revenue",
      color: "hsl(var(--chart-2))",
    },
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Monitor your travel platform's performance</p>
          </div>
          <Badge variant="secondary" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Admin Access
          </Badge>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.totalUsers || 0}</div>
              <p className="text-xs text-muted-foreground">
                +{summary?.newUsersThisMonth || 0} this month
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.totalBookings || 0}</div>
              <p className="text-xs text-muted-foreground">
                Confirmed reservations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${(summary?.totalRevenue || 0).toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">
                From all bookings
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">AI Interactions</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary?.chatInteractions || 0}</div>
              <p className="text-xs text-muted-foreground">
                Chat conversations
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Charts */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList>
            <TabsTrigger value="users">User Analytics</TabsTrigger>
            <TabsTrigger value="bookings">Booking Analytics</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>User Registrations (Last 30 Days)</CardTitle>
                <CardDescription>Daily new user sign-ups</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={userTrend}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="date" 
                        tickFormatter={(value) => new Date(value).toLocaleDateString()} 
                      />
                      <YAxis />
                      <ChartTooltip 
                        content={<ChartTooltipContent />}
                        labelFormatter={(value) => new Date(value).toLocaleDateString()}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="count" 
                        stroke="var(--color-count)" 
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Daily Bookings</CardTitle>
                  <CardDescription>Booking volume over time</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={bookingTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(value) => new Date(value).toLocaleDateString()} 
                        />
                        <YAxis />
                        <ChartTooltip 
                          content={<ChartTooltipContent />}
                          labelFormatter={(value) => new Date(value).toLocaleDateString()}
                        />
                        <Bar dataKey="count" fill="var(--color-count)" />
                      </BarChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Daily Revenue</CardTitle>
                  <CardDescription>Revenue generated per day</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer config={chartConfig} className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={bookingTrend}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis 
                          dataKey="date" 
                          tickFormatter={(value) => new Date(value).toLocaleDateString()} 
                        />
                        <YAxis />
                        <ChartTooltip 
                          content={<ChartTooltipContent />}
                          labelFormatter={(value) => new Date(value).toLocaleDateString()}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="revenue" 
                          stroke="var(--color-revenue)" 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Active Users</CardTitle>
                  <CardDescription>Users with recent activity this month</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-center py-8">
                    {summary?.activeUsersThisMonth || 0}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Trip Planning</CardTitle>
                  <CardDescription>Total trips created by users</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-4xl font-bold text-center py-8">
                    {summary?.totalTrips || 0}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AdminDashboard;
