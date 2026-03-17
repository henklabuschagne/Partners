import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import { TrendingUp, TrendingDown, DollarSign, Users, FileText, Calendar } from 'lucide-react';
import { useAppStore } from '../hooks/useAppStore';
import { useState, useMemo } from 'react';
import { DateRangeSelector, type DateRange } from './DateRangeSelector';

export function Analytics() {
  const { partners, contracts, invoices } = useAppStore('partners', 'contracts', 'invoices');

  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(2023, 0, 1),
    to: new Date(),
    label: 'All Time',
  });

  // Filter invoices by date range
  const filteredInvoices = useMemo(() => {
    const from = dateRange.from.getTime();
    const to = dateRange.to.getTime();
    return invoices.filter(i => {
      const d = new Date(i.issueDate).getTime();
      return d >= from && d <= to;
    });
  }, [invoices, dateRange]);

  // Revenue by Partner
  const revenueByPartner = partners.map((partner) => {
    const partnerInvoices = filteredInvoices.filter((inv) => inv.partnerId === partner.id);
    const totalRevenue = partnerInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const paidRevenue = partnerInvoices
      .filter((inv) => inv.status === 'paid')
      .reduce((sum, inv) => sum + inv.totalAmount, 0);
    
    return {
      name: partner.company,
      total: totalRevenue,
      paid: paidRevenue,
      pending: totalRevenue - paidRevenue,
      invoices: partnerInvoices.length,
    };
  }).sort((a, b) => b.total - a.total);

  // Monthly Revenue Trend (computed dynamically)
  const monthlyRevenue = useMemo(() => {
    const months: Record<string, { month: string; revenue: number; invoices: number }> = {};
    filteredInvoices.forEach(inv => {
      const d = new Date(inv.issueDate);
      const key = d.toISOString().slice(0, 7);
      const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      if (!months[key]) months[key] = { month: label, revenue: 0, invoices: 0 };
      months[key].revenue += inv.totalAmount;
      months[key].invoices += 1;
    });
    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, data]) => data);
  }, [filteredInvoices]);

  // Contract Status Distribution
  const contractStatusData = [
    {
      name: 'Active',
      value: contracts.filter((c) => c.status === 'active').length,
      color: '#5F966C',
    },
    {
      name: 'Pending',
      value: contracts.filter((c) => c.status === 'pending').length,
      color: '#CEA569',
    },
    {
      name: 'Expired',
      value: contracts.filter((c) => c.status === 'expired').length,
      color: '#AB5A5C',
    },
  ].filter((d) => d.value > 0);

  // Invoice Status Distribution
  const invoiceStatusData = [
    {
      name: 'Paid',
      value: filteredInvoices.filter((i) => i.status === 'paid').length,
      color: '#5F966C',
    },
    {
      name: 'Pending',
      value: filteredInvoices.filter((i) => i.status === 'pending').length,
      color: '#CEA569',
    },
    {
      name: 'Overdue',
      value: filteredInvoices.filter((i) => i.status === 'overdue').length,
      color: '#AB5A5C',
    },
  ].filter((d) => d.value > 0);

  // Fee Breakdown
  const feeBreakdown = filteredInvoices.reduce(
    (acc, inv) => ({
      implementation: acc.implementation + inv.implementationFee,
      license: acc.license + inv.licenseFee,
    }),
    { implementation: 0, license: 0 }
  );

  const feeBreakdownData = [
    { name: 'Implementation Fees', value: feeBreakdown.implementation, color: '#456E92' },
    { name: 'License Fees', value: feeBreakdown.license, color: '#7AA2C0' },
  ].filter((d) => d.value > 0);

  // Regional Distribution
  const regionalData = partners.reduce((acc, partner) => {
    const region = partner.region;
    const existing = acc.find((r) => r.region === region);
    if (existing) {
      existing.partners += 1;
      if (partner.status === 'active') existing.active += 1;
    } else {
      acc.push({
        region,
        partners: 1,
        active: partner.status === 'active' ? 1 : 0,
      });
    }
    return acc;
  }, [] as Array<{ region: string; partners: number; active: number }>);

  // Partner Performance Metrics
  const partnerPerformance = partners.map((partner) => {
    const partnerContracts = contracts.filter((c) => c.partnerId === partner.id);
    const partnerInvoices = filteredInvoices.filter((inv) => inv.partnerId === partner.id);
    const totalRevenue = partnerInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
    const paidInvoices = partnerInvoices.filter((inv) => inv.status === 'paid').length;
    const totalUnits = partnerInvoices.reduce((sum, inv) => sum + inv.units, 0);

    return {
      partner,
      contracts: partnerContracts.length,
      invoices: partnerInvoices.length,
      revenue: totalRevenue,
      paidInvoices,
      units: totalUnits,
      avgInvoice: partnerInvoices.length > 0 ? totalRevenue / partnerInvoices.length : 0,
    };
  }).sort((a, b) => b.revenue - a.revenue);

  // Key Metrics
  const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);
  const paidRevenue = filteredInvoices
    .filter((inv) => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.totalAmount, 0);
  const avgContractValue = contracts.reduce((sum, c) => sum + c.implementationFee, 0) / contracts.length;
  const totalUnits = filteredInvoices.reduce((sum, inv) => sum + inv.units, 0);

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl mb-2">Analytics Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive insights into partner performance and revenue metrics</p>
        </div>
        <DateRangeSelector value={dateRange} onChange={setDateRange} />
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
          <TabsTrigger value="partners">Partners</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-muted-foreground">Total Revenue</CardTitle>
                <DollarSign className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R{totalRevenue.toLocaleString()}</div>
                <p className="text-brand-success flex items-center gap-1 mt-1">
                  <TrendingUp className="w-3 h-3" />
                  R{paidRevenue.toLocaleString()} paid
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-muted-foreground">Active Partners</CardTitle>
                <Users className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {partners.filter((p) => p.status === 'active').length}
                </div>
                <p className="text-muted-foreground mt-1">
                  of {partners.length} total
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-muted-foreground">Avg Contract Value</CardTitle>
                <FileText className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">R{avgContractValue.toLocaleString()}</div>
                <p className="text-muted-foreground mt-1">
                  Implementation fees
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm text-muted-foreground">Total Units</CardTitle>
                <Calendar className="w-4 h-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{totalUnits}</div>
                <p className="text-muted-foreground mt-1">
                  Across all invoices
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 1 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contract Status Distribution</CardTitle>
                <CardDescription>Breakdown of contract statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={contractStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#456E92"
                      dataKey="value"
                    >
                      {contractStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Invoice Status Distribution</CardTitle>
                <CardDescription>Breakdown of invoice statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={invoiceStatusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={100}
                      fill="#456E92"
                      dataKey="value"
                    >
                      {invoiceStatusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>

          {/* Charts Row 2 */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Fee Breakdown</CardTitle>
                <CardDescription>Implementation vs License fees</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={feeBreakdownData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: R${value.toLocaleString()}`}
                      outerRadius={100}
                      fill="#456E92"
                      dataKey="value"
                    >
                      {feeBreakdownData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `R${Number(value).toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Partners by Region</CardTitle>
                <CardDescription>Geographic distribution of partners</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={regionalData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="region" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="active" fill="#5F966C" name="Active" />
                    <Bar dataKey="partners" fill="#7AA2C0" name="Total" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Revenue Tab */}
        <TabsContent value="revenue" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Revenue Trend</CardTitle>
              <CardDescription>Monthly revenue over time</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <AreaChart data={monthlyRevenue}>
                  <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#456E92" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#456E92" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value) => `R${Number(value).toLocaleString()}`} />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="#456E92"
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    name="Revenue"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Revenue by Partner</CardTitle>
              <CardDescription>Top performing partners by total revenue</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={revenueByPartner} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" />
                  <YAxis dataKey="name" type="category" width={150} />
                  <Tooltip formatter={(value) => `R${Number(value).toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="paid" stackId="a" fill="#5F966C" name="Paid" />
                  <Bar dataKey="pending" stackId="a" fill="#CEA569" name="Pending" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {revenueByPartner.map((item) => (
              <Card key={item.name}>
                <CardHeader>
                  <CardTitle>{item.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Revenue:</span>
                    <span className="font-semibold">R{item.total.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Paid:</span>
                    <span className="text-brand-success">R{item.paid.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Pending:</span>
                    <span className="text-brand-warning">R{item.pending.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Invoices:</span>
                    <span className="font-semibold">{item.invoices}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Partners Tab */}
        <TabsContent value="partners" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Partner Overview</CardTitle>
              <CardDescription>Detailed breakdown of all partners</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {partners.map((partner) => {
                  const partnerContracts = contracts.filter((c) => c.partnerId === partner.id);
                  const partnerInvoices = filteredInvoices.filter((inv) => inv.partnerId === partner.id);
                  const revenue = partnerInvoices.reduce((sum, inv) => sum + inv.totalAmount, 0);

                  return (
                    <div
                      key={partner.id}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3>{partner.company}</h3>
                          <p className="text-sm text-muted-foreground">{partner.name}</p>
                          <p className="text-sm text-muted-foreground">{partner.region}</p>
                        </div>
                        <Badge
                          variant="outline"
                          className={partner.status === 'active'
                            ? 'bg-brand-success-light text-brand-success border-brand-success-mid'
                            : 'bg-muted text-muted-foreground'
                          }
                        >
                          {partner.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Contracts</p>
                          <p className="font-semibold">{partnerContracts.length}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Invoices</p>
                          <p className="font-semibold">{partnerInvoices.length}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Revenue</p>
                          <p className="font-semibold">R{revenue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Joined</p>
                          <p className="font-semibold">
                            {new Date(partner.joinedDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Regional Distribution</CardTitle>
              <CardDescription>Partners by geographic region</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={regionalData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="region" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="active" fill="#5F966C" name="Active Partners" />
                  <Bar dataKey="partners" fill="#7AA2C0" name="Total Partners" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Partner Performance Leaderboard</CardTitle>
              <CardDescription>Ranked by total revenue generated</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {partnerPerformance.map((item, index) => (
                  <div
                    key={item.partner.id}
                    className="flex items-center gap-4 p-4 border rounded-lg"
                  >
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-brand-primary-light text-brand-primary flex-shrink-0 font-semibold">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="truncate">{item.partner.company}</h3>
                        <Badge
                          variant="outline"
                          className={item.partner.status === 'active'
                            ? 'bg-brand-success-light text-brand-success border-brand-success-mid'
                            : 'bg-muted text-muted-foreground'
                          }
                        >
                          {item.partner.status}
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Revenue</p>
                          <p className="font-semibold">R{item.revenue.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Contracts</p>
                          <p className="font-semibold">{item.contracts}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Invoices</p>
                          <p className="font-semibold">
                            {item.paidInvoices}/{item.invoices}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Units</p>
                          <p className="font-semibold">{item.units}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Avg Invoice</p>
                          <p className="font-semibold">R{Math.round(item.avgInvoice).toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                    {item.revenue > 0 && (
                      <div className="flex-shrink-0">
                        {index === 0 ? (
                          <TrendingUp className="w-6 h-6 text-brand-success" />
                        ) : (
                          <TrendingDown className="w-6 h-6 text-muted-foreground" />
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Invoice Completion Rate</CardTitle>
                <CardDescription>Paid vs total invoices by partner</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {partnerPerformance.map((item) => {
                    const completionRate =
                      item.invoices > 0 ? (item.paidInvoices / item.invoices) * 100 : 0;
                    return (
                      <div key={item.partner.id}>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm font-medium">{item.partner.company}</span>
                          <span className="text-sm text-muted-foreground">
                            {item.paidInvoices}/{item.invoices} ({Math.round(completionRate)}%)
                          </span>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div
                            className="bg-brand-success h-2 rounded-full"
                            style={{ width: `${completionRate}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Units Sold by Partner</CardTitle>
                <CardDescription>Total license units across all invoices</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart
                    data={partnerPerformance.map((p) => ({
                      name: p.partner.company,
                      units: p.units,
                    }))}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="units" fill="#7AA2C0" name="Units" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}