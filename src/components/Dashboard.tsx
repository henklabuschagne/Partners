import { useMemo, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Users, FileText, Receipt, DollarSign, TrendingUp, AlertCircle, Clock, RefreshCw, Percent } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useAppStore } from '../hooks/useAppStore';
import { Link, useNavigate } from 'react-router';
import { ResponsiveContainer, AreaChart, Area } from 'recharts';
import { DateRangeSelector, type DateRange } from './DateRangeSelector';

export function Dashboard() {
  const navigate = useNavigate();
  const {
    partners,
    contracts,
    invoices,
    activePartnerCount,
    activeContractCount,
    pendingInvoiceCount,
    overdueInvoiceCount,
    totalPaidRevenue,
  } = useAppStore('partners', 'contracts', 'invoices');

  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().getFullYear(), 0, 1),
    to: new Date(),
    label: 'Year to Date',
  });

  // Filter invoices by date range
  const filteredInvoices = useMemo(() => {
    const from = dateRange.from.getTime();
    const to = dateRange.to.getTime();
    return invoices
      .filter(i => {
        const d = new Date(i.issueDate).getTime();
        return d >= from && d <= to;
      })
      .sort((a, b) => b.issueDate.localeCompare(a.issueDate));
  }, [invoices, dateRange]);

  const recentInvoices = filteredInvoices.slice(0, 5);

  // Commission tracking
  const totalCommission = useMemo(() => {
    return filteredInvoices
      .filter(i => i.status === 'paid')
      .reduce((sum, inv) => {
        const contract = contracts.find(c => c.id === inv.contractId);
        if (!contract) return sum;
        return sum + inv.totalAmount * (contract.commissionRate / 100);
      }, 0);
  }, [filteredInvoices, contracts]);

  // Monthly revenue data for sparklines
  const monthlyData = useMemo(() => {
    const months: Record<string, { revenue: number; invoices: number; units: number }> = {};
    filteredInvoices.forEach(inv => {
      const key = inv.issueDate.slice(0, 7); // YYYY-MM
      if (!months[key]) months[key] = { revenue: 0, invoices: 0, units: 0 };
      months[key].revenue += inv.totalAmount;
      months[key].invoices += 1;
      months[key].units += inv.units;
    });
    return Object.entries(months)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, data]) => data);
  }, [filteredInvoices]);

  // Expiring contracts (within 90 days)
  const expiringContracts = useMemo(() => {
    const now = new Date();
    const ninetyDays = new Date(now.getTime() + 90 * 24 * 60 * 60 * 1000);
    return contracts
      .filter(c => c.status === 'active')
      .filter(c => {
        const end = new Date(c.endDate);
        return end <= ninetyDays && end > now;
      })
      .map(c => {
        const end = new Date(c.endDate);
        const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return { ...c, daysLeft };
      })
      .sort((a, b) => a.daysLeft - b.daysLeft);
  }, [contracts]);

  // Overdue invoices with aging
  const overdueInvoices = useMemo(() => {
    const now = new Date();
    return invoices
      .filter(i => i.status === 'overdue')
      .map(i => {
        const due = new Date(i.dueDate);
        const daysOverdue = Math.ceil((now.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
        return { ...i, daysOverdue };
      })
      .sort((a, b) => b.daysOverdue - a.daysOverdue);
  }, [invoices]);

  // Revenue forecast
  const forecast = useMemo(() => {
    const activeContracts = contracts.filter(c => c.status === 'active');
    const monthlyRevPerContract = activeContracts.map(c => {
      const contractInvs = invoices.filter(i => i.contractId === c.id);
      if (contractInvs.length === 0) return c.licenseFeePerUnit * c.minimumUnits;
      const totalRev = contractInvs.reduce((s, i) => s + i.totalAmount, 0);
      const earliest = new Date(Math.min(...contractInvs.map(i => new Date(i.issueDate).getTime())));
      const latest = new Date(Math.max(...contractInvs.map(i => new Date(i.issueDate).getTime())));
      const months = Math.max(1, (latest.getTime() - earliest.getTime()) / (1000 * 60 * 60 * 24 * 30));
      return totalRev / months;
    });
    const monthlyTotal = monthlyRevPerContract.reduce((s, v) => s + v, 0);
    return {
      monthly: Math.round(monthlyTotal),
      quarterly: Math.round(monthlyTotal * 3),
      annual: Math.round(monthlyTotal * 12),
    };
  }, [contracts, invoices]);

  // Range-scoped KPIs
  const rangeRevenue = useMemo(() => filteredInvoices.reduce((s, i) => s + i.totalAmount, 0), [filteredInvoices]);
  const rangePaid = useMemo(() => filteredInvoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.totalAmount, 0), [filteredInvoices]);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl mb-2">Dashboard</h1>
          <p className="text-muted-foreground">Overview of your partner program</p>
        </div>
        <DateRangeSelector value={dateRange} onChange={setDateRange} />
      </div>

      {/* Stats Grid — KPI Pattern B */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-primary-light rounded-lg">
                <Users className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Partners</p>
                <p className="text-2xl font-bold">{activePartnerCount}</p>
                <p className="text-xs text-muted-foreground mt-1">of {partners.length} total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-secondary-light rounded-lg">
                <FileText className="w-6 h-6 text-brand-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Contracts</p>
                <p className="text-2xl font-bold">{activeContractCount}</p>
                <p className="text-xs text-muted-foreground mt-1">{contracts.filter(c => c.status === 'expired').length} expired</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-success-light rounded-lg">
                <DollarSign className="w-6 h-6 text-brand-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Revenue ({dateRange.label})</p>
                <p className="text-2xl font-bold">R{rangePaid.toLocaleString()}</p>
                {monthlyData.length > 1 && (
                  <div className="h-8 mt-1">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={monthlyData}>
                        <defs>
                          <linearGradient id="sparkRev" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#5F966C" stopOpacity={0.4} />
                            <stop offset="95%" stopColor="#5F966C" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <Area type="monotone" dataKey="revenue" stroke="#5F966C" fill="url(#sparkRev)" strokeWidth={1.5} dot={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-warning-light rounded-lg">
                <Receipt className="w-6 h-6 text-brand-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending / Overdue</p>
                <p className="text-2xl font-bold">{pendingInvoiceCount}</p>
                <p className="text-xs text-brand-error mt-1">{overdueInvoiceCount} overdue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-brand-primary-light rounded-lg">
                <Percent className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Commission ({dateRange.label})</p>
                <p className="text-2xl font-bold">R{Math.round(totalCommission).toLocaleString()}</p>
                <p className="text-xs text-muted-foreground mt-1">On paid invoices</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Section */}
      {(expiringContracts.length > 0 || overdueInvoices.length > 0) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {expiringContracts.length > 0 && (
            <Card className="border-l-4 border-l-brand-warning bg-brand-warning-light">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-brand-main">
                  <div className="p-2 rounded-lg bg-brand-warning-light">
                    <Clock className="w-5 h-5 text-brand-warning" />
                  </div>
                  Contracts Expiring Soon ({expiringContracts.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {expiringContracts.slice(0, 5).map(c => (
                    <div key={c.id} className="flex items-center justify-between">
                      <div>
                        <Link to={`/contracts/${c.id}`} className="text-foreground hover:underline text-sm font-medium">
                          {c.partnerName}
                        </Link>
                        <p className="text-xs text-muted-foreground">
                          Expires {new Date(c.endDate).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={c.daysLeft <= 30
                            ? 'bg-brand-error-light text-brand-error border-brand-error-mid'
                            : 'bg-brand-warning-light text-brand-warning border-brand-warning-mid'
                          }
                        >
                          {c.daysLeft}d left
                        </Badge>
                        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={() => navigate(`/contracts/${c.id}`)}>
                          <RefreshCw className="w-3 h-3 mr-1" />
                          Renew
                        </Button>
                      </div>
                    </div>
                  ))}
                  {expiringContracts.length > 5 && (
                    <p className="text-xs text-muted-foreground pt-1">+{expiringContracts.length - 5} more expiring...</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {overdueInvoices.length > 0 && (
            <Card className="border-l-4 border-l-brand-error bg-brand-error-light">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-brand-main">
                  <div className="p-2 rounded-lg bg-brand-error-light">
                    <AlertCircle className="w-5 h-5 text-brand-error" />
                  </div>
                  Overdue Invoices ({overdueInvoices.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {overdueInvoices.slice(0, 5).map(i => (
                    <div key={i.id} className="flex items-center justify-between">
                      <div>
                        <Link to={`/partners/${i.partnerId}`} className="text-foreground hover:underline text-sm font-medium">
                          {i.invoiceNumber} — {i.partnerName}
                        </Link>
                        <p className="text-xs text-muted-foreground">R{i.totalAmount.toLocaleString()} - Due {new Date(i.dueDate).toLocaleDateString()}</p>
                      </div>
                      <Badge variant="outline" className="bg-brand-error-light text-brand-error border-brand-error-mid">
                        {i.daysOverdue}d overdue
                      </Badge>
                    </div>
                  ))}
                  {overdueInvoices.length > 5 && (
                    <p className="text-xs text-muted-foreground pt-1">+{overdueInvoices.length - 5} more overdue...</p>
                  )}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Forecast + Recent Invoices */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-brand-primary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-primary" />
              Revenue Forecast
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Monthly (est.)</span>
                <span className="font-semibold">R{forecast.monthly.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Quarterly (est.)</span>
                <span className="font-semibold">R{forecast.quarterly.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Annual (est.)</span>
                <span className="font-semibold">R{forecast.annual.toLocaleString()}</span>
              </div>
              <p className="text-xs text-muted-foreground pt-2 border-t">
                Based on {contracts.filter(c => c.status === 'active').length} active contract(s) and historical patterns.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Invoices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentInvoices.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">No invoices in selected range.</div>
              ) : (
                recentInvoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between pb-4 border-b last:border-0">
                    <div>
                      <p className="text-sm font-medium">{invoice.invoiceNumber}</p>
                      <Link to={`/partners/${invoice.partnerId}`} className="text-sm text-brand-primary hover:underline">
                        {invoice.partnerName}
                      </Link>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">R{invoice.totalAmount.toLocaleString()}</p>
                      <Badge
                        variant="outline"
                        className={
                          invoice.status === 'paid'
                            ? 'bg-brand-success-light text-brand-success border-brand-success-mid'
                            : invoice.status === 'overdue'
                            ? 'bg-brand-error-light text-brand-error border-brand-error-mid'
                            : 'bg-brand-warning-light text-brand-warning border-brand-warning-mid'
                        }
                      >
                        {invoice.status}
                      </Badge>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Contracts */}
      <Card>
        <CardHeader>
          <CardTitle>Active Contracts</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contracts
              .filter(c => c.status === 'active')
              .slice(0, 6)
              .map((contract) => (
                <Link key={contract.id} to={`/contracts/${contract.id}`} className="block pb-4 border-b last:border-0 hover:bg-muted/50 -mx-2 px-2 rounded transition-colors">
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-medium">{contract.partnerName}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-brand-primary">{contract.commissionRate}% comm.</span>
                      <Badge variant="outline" className="bg-brand-success-light text-brand-success border-brand-success-mid">
                        {contract.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
                    <p>Implementation: R{contract.implementationFee.toLocaleString()}</p>
                    <p>License: R{contract.licenseFeePerUnit}/unit</p>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">Valid until {new Date(contract.endDate).toLocaleDateString()}</p>
                </Link>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}