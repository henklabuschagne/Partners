import { Partner, Contract, Invoice } from '../types';

export const mockPartners: Partner[] = [
  { id: '1', name: 'John Smith', email: 'john@techsolutions.com', phone: '+27 11 234 5678', company: 'Tech Solutions Inc', status: 'active', joinedDate: '2024-01-15', region: 'Gauteng' },
  { id: '2', name: 'Sarah Johnson', email: 'sarah@innovatesoft.com', phone: '+27 21 345 6789', company: 'InnovateSoft', status: 'active', joinedDate: '2024-03-20', region: 'Western Cape' },
  { id: '3', name: 'Michael Chen', email: 'michael@globaltech.com', phone: '+27 31 456 7890', company: 'GlobalTech Partners', status: 'inactive', joinedDate: '2023-11-10', region: 'KwaZulu-Natal' },
  { id: '4', name: 'Emily Rodriguez', email: 'emily@digitalpro.com', phone: '+27 12 567 8901', company: 'Digital Pro Solutions', status: 'active', joinedDate: '2023-08-22', region: 'Gauteng' },
  { id: '5', name: 'David Kumar', email: 'david@cloudwise.in', phone: '+27 41 678 9012', company: 'CloudWise Technologies', status: 'active', joinedDate: '2024-02-10', region: 'Eastern Cape' },
  { id: '6', name: 'Lisa Anderson', email: 'lisa@nexusgroup.com', phone: '+27 21 789 0123', company: 'Nexus Group SA', status: 'active', joinedDate: '2023-09-05', region: 'Western Cape' },
  { id: '7', name: 'Carlos Martinez', email: 'carlos@iberiatech.es', phone: '+27 51 890 1234', company: 'Iberia Tech Solutions', status: 'active', joinedDate: '2024-04-18', region: 'Free State' },
  { id: '8', name: 'Yuki Tanaka', email: 'yuki@eastasia.jp', phone: '+27 11 901 2345', company: 'East Asia Systems', status: 'active', joinedDate: '2023-12-01', region: 'Gauteng' },
  { id: '9', name: 'Robert Williams', email: 'robert@southerntech.com', phone: '+27 44 012 3456', company: 'Southern Tech Group', status: 'inactive', joinedDate: '2023-06-15', region: 'Western Cape' },
  { id: '10', name: 'Sophie Dubois', email: 'sophie@parissoft.fr', phone: '+27 21 123 4567', company: 'Paris Software House', status: 'active', joinedDate: '2024-01-08', region: 'Western Cape' },
  { id: '11', name: 'Ahmed Hassan', email: 'ahmed@menatech.ae', phone: '+27 11 234 5670', company: 'MENA Tech Partners', status: 'active', joinedDate: '2024-05-12', region: 'Gauteng' },
  { id: '12', name: 'Isabella Silva', email: 'isabella@latamdigital.br', phone: '+27 31 345 6780', company: 'LatAm Digital Group', status: 'active', joinedDate: '2023-10-20', region: 'KwaZulu-Natal' },
  { id: '13', name: 'Thomas Mueller', email: 'thomas@deutschtech.de', phone: '+27 12 456 7891', company: 'Deutsch Tech GmbH', status: 'active', joinedDate: '2023-07-14', region: 'Gauteng' },
  { id: '14', name: 'Priya Sharma', email: 'priya@techventures.in', phone: '+27 41 567 8902', company: 'Tech Ventures India', status: 'active', joinedDate: '2024-06-03', region: 'Eastern Cape' },
  { id: '15', name: "James O'Connor", email: 'james@atlanticsoft.ie', phone: '+27 21 678 9013', company: 'Atlantic Software Ltd', status: 'active', joinedDate: '2024-02-28', region: 'Western Cape' },
];

export const mockContracts: Contract[] = [
  // ─── Original 2023-2024 Contracts ────────────────────
  { id: '1', partnerId: '1', partnerName: 'Tech Solutions Inc', startDate: '2024-01-15', endDate: '2025-01-14', implementationFee: 90000, licenseFeePerUnit: 1800, minimumUnits: 10, status: 'expired', commissionRate: 20 },
  { id: '2', partnerId: '2', partnerName: 'InnovateSoft', startDate: '2024-03-20', endDate: '2025-03-19', implementationFee: 135000, licenseFeePerUnit: 2160, minimumUnits: 15, status: 'expired', commissionRate: 25 },
  { id: '3', partnerId: '3', partnerName: 'GlobalTech Partners', startDate: '2023-11-10', endDate: '2024-11-09', implementationFee: 72000, licenseFeePerUnit: 1620, minimumUnits: 8, status: 'expired', commissionRate: 15 },
  { id: '4', partnerId: '4', partnerName: 'Digital Pro Solutions', startDate: '2023-08-22', endDate: '2024-08-21', implementationFee: 108000, licenseFeePerUnit: 1980, minimumUnits: 12, status: 'expired', commissionRate: 22 },
  { id: '5', partnerId: '4', partnerName: 'Digital Pro Solutions', startDate: '2024-09-01', endDate: '2025-08-31', implementationFee: 117000, licenseFeePerUnit: 2070, minimumUnits: 15, status: 'expired', commissionRate: 23 },
  { id: '6', partnerId: '5', partnerName: 'CloudWise Technologies', startDate: '2024-02-10', endDate: '2025-02-09', implementationFee: 99000, licenseFeePerUnit: 1710, minimumUnits: 10, status: 'expired', commissionRate: 18 },
  { id: '7', partnerId: '6', partnerName: 'Nexus Group SA', startDate: '2023-09-05', endDate: '2024-09-04', implementationFee: 144000, licenseFeePerUnit: 2340, minimumUnits: 20, status: 'expired', commissionRate: 28 },
  { id: '8', partnerId: '6', partnerName: 'Nexus Group SA', startDate: '2024-10-01', endDate: '2025-09-30', implementationFee: 153000, licenseFeePerUnit: 2430, minimumUnits: 20, status: 'expired', commissionRate: 30 },
  { id: '9', partnerId: '7', partnerName: 'Iberia Tech Solutions', startDate: '2024-04-18', endDate: '2025-04-17', implementationFee: 81000, licenseFeePerUnit: 1530, minimumUnits: 8, status: 'expired', commissionRate: 17 },
  { id: '10', partnerId: '8', partnerName: 'East Asia Systems', startDate: '2023-12-01', endDate: '2024-11-30', implementationFee: 126000, licenseFeePerUnit: 1890, minimumUnits: 15, status: 'expired', commissionRate: 21 },
  { id: '11', partnerId: '10', partnerName: 'Paris Software House', startDate: '2024-01-08', endDate: '2025-01-07', implementationFee: 122400, licenseFeePerUnit: 2250, minimumUnits: 12, status: 'expired', commissionRate: 24 },
  { id: '12', partnerId: '11', partnerName: 'MENA Tech Partners', startDate: '2024-05-12', endDate: '2025-05-11', implementationFee: 104400, licenseFeePerUnit: 1764, minimumUnits: 10, status: 'expired', commissionRate: 19 },
  { id: '13', partnerId: '12', partnerName: 'LatAm Digital Group', startDate: '2023-10-20', endDate: '2024-10-19', implementationFee: 93600, licenseFeePerUnit: 1584, minimumUnits: 10, status: 'expired', commissionRate: 16 },
  { id: '14', partnerId: '13', partnerName: 'Deutsch Tech GmbH', startDate: '2023-07-14', endDate: '2024-07-13', implementationFee: 162000, licenseFeePerUnit: 2520, minimumUnits: 25, status: 'expired', commissionRate: 32 },
  { id: '15', partnerId: '13', partnerName: 'Deutsch Tech GmbH', startDate: '2024-08-01', endDate: '2025-07-31', implementationFee: 171000, licenseFeePerUnit: 2610, minimumUnits: 25, status: 'expired', commissionRate: 33 },
  { id: '16', partnerId: '14', partnerName: 'Tech Ventures India', startDate: '2024-06-03', endDate: '2025-06-02', implementationFee: 86400, licenseFeePerUnit: 1656, minimumUnits: 10, status: 'expired', commissionRate: 18 },
  { id: '17', partnerId: '15', partnerName: 'Atlantic Software Ltd', startDate: '2024-02-28', endDate: '2025-02-27', implementationFee: 111600, licenseFeePerUnit: 1944, minimumUnits: 12, status: 'expired', commissionRate: 22 },
  { id: '18', partnerId: '1', partnerName: 'Tech Solutions Inc', startDate: '2024-07-01', endDate: '2025-06-30', implementationFee: 99000, licenseFeePerUnit: 1890, minimumUnits: 12, status: 'expired', commissionRate: 21 },
  { id: '19', partnerId: '5', partnerName: 'CloudWise Technologies', startDate: '2024-08-15', endDate: '2025-08-14', implementationFee: 108000, licenseFeePerUnit: 1800, minimumUnits: 12, status: 'expired', commissionRate: 20 },
  { id: '20', partnerId: '8', partnerName: 'East Asia Systems', startDate: '2024-06-20', endDate: '2025-06-19', implementationFee: 129600, licenseFeePerUnit: 1980, minimumUnits: 18, status: 'expired', commissionRate: 22 },

  // ─── 2025-2026 Renewal Contracts ─────────────────────
  { id: '21', partnerId: '1', partnerName: 'Tech Solutions Inc', startDate: '2025-07-01', endDate: '2026-06-30', implementationFee: 104400, licenseFeePerUnit: 1980, minimumUnits: 14, status: 'active', commissionRate: 22, renewedFromId: '18' },
  { id: '22', partnerId: '2', partnerName: 'InnovateSoft', startDate: '2025-04-01', endDate: '2026-03-31', implementationFee: 144000, licenseFeePerUnit: 2304, minimumUnits: 18, status: 'active', commissionRate: 26, renewedFromId: '2' },
  { id: '23', partnerId: '5', partnerName: 'CloudWise Technologies', startDate: '2025-09-01', endDate: '2026-04-15', implementationFee: 111600, licenseFeePerUnit: 1890, minimumUnits: 14, status: 'active', commissionRate: 20, renewedFromId: '19' },
  { id: '24', partnerId: '6', partnerName: 'Nexus Group SA', startDate: '2025-10-01', endDate: '2026-09-30', implementationFee: 162000, licenseFeePerUnit: 2520, minimumUnits: 22, status: 'active', commissionRate: 31, renewedFromId: '8' },
  { id: '25', partnerId: '7', partnerName: 'Iberia Tech Solutions', startDate: '2025-05-01', endDate: '2026-04-30', implementationFee: 90000, licenseFeePerUnit: 1620, minimumUnits: 10, status: 'active', commissionRate: 18, renewedFromId: '9' },
  { id: '26', partnerId: '8', partnerName: 'East Asia Systems', startDate: '2025-07-01', endDate: '2026-05-31', implementationFee: 135000, licenseFeePerUnit: 2016, minimumUnits: 16, status: 'active', commissionRate: 23, renewedFromId: '20' },
  { id: '27', partnerId: '10', partnerName: 'Paris Software House', startDate: '2025-02-01', endDate: '2026-01-31', implementationFee: 129600, licenseFeePerUnit: 2376, minimumUnits: 14, status: 'expired', commissionRate: 25, renewedFromId: '11' },
  { id: '28', partnerId: '10', partnerName: 'Paris Software House', startDate: '2026-02-01', endDate: '2027-01-31', implementationFee: 135000, licenseFeePerUnit: 2430, minimumUnits: 14, status: 'active', commissionRate: 26, renewedFromId: '27' },
  { id: '29', partnerId: '11', partnerName: 'MENA Tech Partners', startDate: '2025-06-01', endDate: '2026-05-31', implementationFee: 108000, licenseFeePerUnit: 1836, minimumUnits: 12, status: 'active', commissionRate: 20, renewedFromId: '12' },
  { id: '30', partnerId: '12', partnerName: 'LatAm Digital Group', startDate: '2025-01-01', endDate: '2025-12-31', implementationFee: 100800, licenseFeePerUnit: 1656, minimumUnits: 12, status: 'expired', commissionRate: 17, renewedFromId: '13' },
  { id: '31', partnerId: '12', partnerName: 'LatAm Digital Group', startDate: '2026-01-01', endDate: '2026-12-31', implementationFee: 104400, licenseFeePerUnit: 1710, minimumUnits: 12, status: 'active', commissionRate: 18, renewedFromId: '30' },
  { id: '32', partnerId: '13', partnerName: 'Deutsch Tech GmbH', startDate: '2025-08-01', endDate: '2026-07-31', implementationFee: 180000, licenseFeePerUnit: 2700, minimumUnits: 28, status: 'active', commissionRate: 34, renewedFromId: '15' },
  { id: '33', partnerId: '14', partnerName: 'Tech Ventures India', startDate: '2025-06-03', endDate: '2026-06-02', implementationFee: 93600, licenseFeePerUnit: 1764, minimumUnits: 12, status: 'active', commissionRate: 19, renewedFromId: '16' },
  { id: '34', partnerId: '15', partnerName: 'Atlantic Software Ltd', startDate: '2025-03-01', endDate: '2026-05-31', implementationFee: 122400, licenseFeePerUnit: 2070, minimumUnits: 14, status: 'active', commissionRate: 23, renewedFromId: '17' },
  { id: '35', partnerId: '4', partnerName: 'Digital Pro Solutions', startDate: '2025-09-01', endDate: '2026-08-31', implementationFee: 126000, licenseFeePerUnit: 2160, minimumUnits: 16, status: 'active', commissionRate: 24, renewedFromId: '5' },
];

export const mockInvoices: Invoice[] = [
  // ═══════════════════════════════════════════════════════
  //  2023-2024 INVOICES (original data)
  // ═══════════════════════════════════════════════════════

  // Tech Solutions Inc (Partner 1)
  { id: '1', invoiceNumber: 'INV-2024-001', partnerId: '1', partnerName: 'Tech Solutions Inc', contractId: '1', issueDate: '2024-01-15', dueDate: '2024-02-14', implementationFee: 90000, licenseFee: 18000, units: 10, totalAmount: 108000, status: 'paid', paidDate: '2024-02-10' },
  { id: '2', invoiceNumber: 'INV-2024-002', partnerId: '1', partnerName: 'Tech Solutions Inc', contractId: '1', issueDate: '2024-03-01', dueDate: '2024-03-31', implementationFee: 0, licenseFee: 27000, units: 15, totalAmount: 27000, status: 'paid', paidDate: '2024-03-28' },
  { id: '3', invoiceNumber: 'INV-2024-003', partnerId: '1', partnerName: 'Tech Solutions Inc', contractId: '1', issueDate: '2024-05-15', dueDate: '2024-06-14', implementationFee: 0, licenseFee: 21600, units: 12, totalAmount: 21600, status: 'paid', paidDate: '2024-06-12' },
  { id: '4', invoiceNumber: 'INV-2024-004', partnerId: '1', partnerName: 'Tech Solutions Inc', contractId: '18', issueDate: '2024-07-01', dueDate: '2024-07-31', implementationFee: 99000, licenseFee: 22680, units: 12, totalAmount: 121680, status: 'paid', paidDate: '2024-07-29' },
  { id: '5', invoiceNumber: 'INV-2024-005', partnerId: '1', partnerName: 'Tech Solutions Inc', contractId: '18', issueDate: '2024-09-10', dueDate: '2024-10-10', implementationFee: 0, licenseFee: 34020, units: 18, totalAmount: 34020, status: 'paid', paidDate: '2024-10-08' },
  { id: '6', invoiceNumber: 'INV-2024-006', partnerId: '1', partnerName: 'Tech Solutions Inc', contractId: '18', issueDate: '2024-11-05', dueDate: '2024-12-05', implementationFee: 0, licenseFee: 28350, units: 15, totalAmount: 28350, status: 'paid', paidDate: '2024-12-02' },

  // InnovateSoft (Partner 2)
  { id: '7', invoiceNumber: 'INV-2024-007', partnerId: '2', partnerName: 'InnovateSoft', contractId: '2', issueDate: '2024-03-20', dueDate: '2024-04-19', implementationFee: 135000, licenseFee: 32400, units: 15, totalAmount: 167400, status: 'paid', paidDate: '2024-04-17' },
  { id: '8', invoiceNumber: 'INV-2024-008', partnerId: '2', partnerName: 'InnovateSoft', contractId: '2', issueDate: '2024-06-01', dueDate: '2024-06-30', implementationFee: 0, licenseFee: 43200, units: 20, totalAmount: 43200, status: 'paid', paidDate: '2024-06-28' },
  { id: '9', invoiceNumber: 'INV-2024-009', partnerId: '2', partnerName: 'InnovateSoft', contractId: '2', issueDate: '2024-08-15', dueDate: '2024-09-14', implementationFee: 0, licenseFee: 54000, units: 25, totalAmount: 54000, status: 'paid', paidDate: '2024-09-12' },
  { id: '10', invoiceNumber: 'INV-2024-010', partnerId: '2', partnerName: 'InnovateSoft', contractId: '2', issueDate: '2024-10-20', dueDate: '2024-11-19', implementationFee: 0, licenseFee: 49680, units: 23, totalAmount: 49680, status: 'paid', paidDate: '2024-11-17' },
  { id: '11', invoiceNumber: 'INV-2024-011', partnerId: '2', partnerName: 'InnovateSoft', contractId: '2', issueDate: '2024-12-10', dueDate: '2025-01-09', implementationFee: 0, licenseFee: 38880, units: 18, totalAmount: 38880, status: 'paid', paidDate: '2025-01-07' },

  // GlobalTech Partners (Partner 3)
  { id: '12', invoiceNumber: 'INV-2023-012', partnerId: '3', partnerName: 'GlobalTech Partners', contractId: '3', issueDate: '2023-11-10', dueDate: '2023-12-10', implementationFee: 72000, licenseFee: 12960, units: 8, totalAmount: 84960, status: 'paid', paidDate: '2023-12-08' },
  { id: '13', invoiceNumber: 'INV-2024-013', partnerId: '3', partnerName: 'GlobalTech Partners', contractId: '3', issueDate: '2024-02-05', dueDate: '2024-03-06', implementationFee: 0, licenseFee: 16200, units: 10, totalAmount: 16200, status: 'paid', paidDate: '2024-03-04' },

  // Digital Pro Solutions (Partner 4)
  { id: '14', invoiceNumber: 'INV-2023-014', partnerId: '4', partnerName: 'Digital Pro Solutions', contractId: '4', issueDate: '2023-08-22', dueDate: '2023-09-21', implementationFee: 108000, licenseFee: 23760, units: 12, totalAmount: 131760, status: 'paid', paidDate: '2023-09-19' },
  { id: '15', invoiceNumber: 'INV-2023-015', partnerId: '4', partnerName: 'Digital Pro Solutions', contractId: '4', issueDate: '2023-11-15', dueDate: '2023-12-15', implementationFee: 0, licenseFee: 29700, units: 15, totalAmount: 29700, status: 'paid', paidDate: '2023-12-13' },
  { id: '16', invoiceNumber: 'INV-2024-016', partnerId: '4', partnerName: 'Digital Pro Solutions', contractId: '4', issueDate: '2024-03-10', dueDate: '2024-04-09', implementationFee: 0, licenseFee: 35640, units: 18, totalAmount: 35640, status: 'paid', paidDate: '2024-04-07' },
  { id: '17', invoiceNumber: 'INV-2024-017', partnerId: '4', partnerName: 'Digital Pro Solutions', contractId: '5', issueDate: '2024-09-01', dueDate: '2024-09-30', implementationFee: 117000, licenseFee: 31050, units: 15, totalAmount: 148050, status: 'paid', paidDate: '2024-09-28' },
  { id: '18', invoiceNumber: 'INV-2024-018', partnerId: '4', partnerName: 'Digital Pro Solutions', contractId: '5', issueDate: '2024-11-20', dueDate: '2024-12-20', implementationFee: 0, licenseFee: 41400, units: 20, totalAmount: 41400, status: 'paid', paidDate: '2024-12-18' },

  // CloudWise Technologies (Partner 5)
  { id: '19', invoiceNumber: 'INV-2024-019', partnerId: '5', partnerName: 'CloudWise Technologies', contractId: '6', issueDate: '2024-02-10', dueDate: '2024-03-11', implementationFee: 99000, licenseFee: 17100, units: 10, totalAmount: 116100, status: 'paid', paidDate: '2024-03-09' },
  { id: '20', invoiceNumber: 'INV-2024-020', partnerId: '5', partnerName: 'CloudWise Technologies', contractId: '6', issueDate: '2024-05-22', dueDate: '2024-06-21', implementationFee: 0, licenseFee: 23940, units: 14, totalAmount: 23940, status: 'paid', paidDate: '2024-06-19' },
  { id: '21', invoiceNumber: 'INV-2024-021', partnerId: '5', partnerName: 'CloudWise Technologies', contractId: '19', issueDate: '2024-08-15', dueDate: '2024-09-14', implementationFee: 108000, licenseFee: 21600, units: 12, totalAmount: 129600, status: 'paid', paidDate: '2024-09-12' },
  { id: '22', invoiceNumber: 'INV-2024-022', partnerId: '5', partnerName: 'CloudWise Technologies', contractId: '19', issueDate: '2024-11-10', dueDate: '2024-12-10', implementationFee: 0, licenseFee: 28800, units: 16, totalAmount: 28800, status: 'paid', paidDate: '2024-12-08' },

  // Nexus Group SA (Partner 6)
  { id: '23', invoiceNumber: 'INV-2023-023', partnerId: '6', partnerName: 'Nexus Group SA', contractId: '7', issueDate: '2023-09-05', dueDate: '2023-10-05', implementationFee: 144000, licenseFee: 46800, units: 20, totalAmount: 190800, status: 'paid', paidDate: '2023-10-03' },
  { id: '24', invoiceNumber: 'INV-2023-024', partnerId: '6', partnerName: 'Nexus Group SA', contractId: '7', issueDate: '2023-12-20', dueDate: '2024-01-19', implementationFee: 0, licenseFee: 58500, units: 25, totalAmount: 58500, status: 'paid', paidDate: '2024-01-17' },
  { id: '25', invoiceNumber: 'INV-2024-025', partnerId: '6', partnerName: 'Nexus Group SA', contractId: '7', issueDate: '2024-03-25', dueDate: '2024-04-24', implementationFee: 0, licenseFee: 70200, units: 30, totalAmount: 70200, status: 'paid', paidDate: '2024-04-22' },
  { id: '26', invoiceNumber: 'INV-2024-026', partnerId: '6', partnerName: 'Nexus Group SA', contractId: '7', issueDate: '2024-06-18', dueDate: '2024-07-18', implementationFee: 0, licenseFee: 51480, units: 22, totalAmount: 51480, status: 'paid', paidDate: '2024-07-16' },
  { id: '27', invoiceNumber: 'INV-2024-027', partnerId: '6', partnerName: 'Nexus Group SA', contractId: '8', issueDate: '2024-10-01', dueDate: '2024-10-31', implementationFee: 153000, licenseFee: 48600, units: 20, totalAmount: 201600, status: 'paid', paidDate: '2024-10-29' },
  { id: '28', invoiceNumber: 'INV-2024-028', partnerId: '6', partnerName: 'Nexus Group SA', contractId: '8', issueDate: '2024-12-15', dueDate: '2025-01-14', implementationFee: 0, licenseFee: 68040, units: 28, totalAmount: 68040, status: 'paid', paidDate: '2025-01-12' },

  // Iberia Tech Solutions (Partner 7)
  { id: '29', invoiceNumber: 'INV-2024-029', partnerId: '7', partnerName: 'Iberia Tech Solutions', contractId: '9', issueDate: '2024-04-18', dueDate: '2024-05-18', implementationFee: 81000, licenseFee: 12240, units: 8, totalAmount: 93240, status: 'paid', paidDate: '2024-05-16' },
  { id: '30', invoiceNumber: 'INV-2024-030', partnerId: '7', partnerName: 'Iberia Tech Solutions', contractId: '9', issueDate: '2024-07-22', dueDate: '2024-08-21', implementationFee: 0, licenseFee: 16830, units: 11, totalAmount: 16830, status: 'paid', paidDate: '2024-08-19' },
  { id: '31', invoiceNumber: 'INV-2024-031', partnerId: '7', partnerName: 'Iberia Tech Solutions', contractId: '9', issueDate: '2024-10-30', dueDate: '2024-11-29', implementationFee: 0, licenseFee: 13770, units: 9, totalAmount: 13770, status: 'paid', paidDate: '2024-11-27' },

  // East Asia Systems (Partner 8)
  { id: '32', invoiceNumber: 'INV-2023-032', partnerId: '8', partnerName: 'East Asia Systems', contractId: '10', issueDate: '2023-12-01', dueDate: '2023-12-31', implementationFee: 126000, licenseFee: 28350, units: 15, totalAmount: 154350, status: 'paid', paidDate: '2023-12-29' },
  { id: '33', invoiceNumber: 'INV-2024-033', partnerId: '8', partnerName: 'East Asia Systems', contractId: '10', issueDate: '2024-03-08', dueDate: '2024-04-07', implementationFee: 0, licenseFee: 34020, units: 18, totalAmount: 34020, status: 'paid', paidDate: '2024-04-05' },
  { id: '34', invoiceNumber: 'INV-2024-034', partnerId: '8', partnerName: 'East Asia Systems', contractId: '10', issueDate: '2024-06-12', dueDate: '2024-07-12', implementationFee: 0, licenseFee: 37800, units: 20, totalAmount: 37800, status: 'paid', paidDate: '2024-07-10' },
  { id: '35', invoiceNumber: 'INV-2024-035', partnerId: '8', partnerName: 'East Asia Systems', contractId: '10', issueDate: '2024-09-18', dueDate: '2024-10-18', implementationFee: 0, licenseFee: 30240, units: 16, totalAmount: 30240, status: 'paid', paidDate: '2024-10-16' },
  { id: '36', invoiceNumber: 'INV-2024-036', partnerId: '8', partnerName: 'East Asia Systems', contractId: '10', issueDate: '2024-11-25', dueDate: '2024-12-25', implementationFee: 0, licenseFee: 41580, units: 22, totalAmount: 41580, status: 'paid', paidDate: '2024-12-23' },

  // Paris Software House (Partner 10)
  { id: '37', invoiceNumber: 'INV-2024-037', partnerId: '10', partnerName: 'Paris Software House', contractId: '11', issueDate: '2024-01-08', dueDate: '2024-02-07', implementationFee: 122400, licenseFee: 27000, units: 12, totalAmount: 149400, status: 'paid', paidDate: '2024-02-05' },
  { id: '38', invoiceNumber: 'INV-2024-038', partnerId: '10', partnerName: 'Paris Software House', contractId: '11', issueDate: '2024-04-20', dueDate: '2024-05-20', implementationFee: 0, licenseFee: 33750, units: 15, totalAmount: 33750, status: 'paid', paidDate: '2024-05-18' },
  { id: '39', invoiceNumber: 'INV-2024-039', partnerId: '10', partnerName: 'Paris Software House', contractId: '11', issueDate: '2024-07-15', dueDate: '2024-08-14', implementationFee: 0, licenseFee: 40500, units: 18, totalAmount: 40500, status: 'paid', paidDate: '2024-08-12' },
  { id: '40', invoiceNumber: 'INV-2024-040', partnerId: '10', partnerName: 'Paris Software House', contractId: '11', issueDate: '2024-10-10', dueDate: '2024-11-09', implementationFee: 0, licenseFee: 36000, units: 16, totalAmount: 36000, status: 'paid', paidDate: '2024-11-07' },
  { id: '41', invoiceNumber: 'INV-2024-041', partnerId: '10', partnerName: 'Paris Software House', contractId: '11', issueDate: '2024-12-05', dueDate: '2025-01-04', implementationFee: 0, licenseFee: 31500, units: 14, totalAmount: 31500, status: 'paid', paidDate: '2025-01-02' },

  // MENA Tech Partners (Partner 11)
  { id: '42', invoiceNumber: 'INV-2024-042', partnerId: '11', partnerName: 'MENA Tech Partners', contractId: '12', issueDate: '2024-05-12', dueDate: '2024-06-11', implementationFee: 104400, licenseFee: 17640, units: 10, totalAmount: 122040, status: 'paid', paidDate: '2024-06-09' },
  { id: '43', invoiceNumber: 'INV-2024-043', partnerId: '11', partnerName: 'MENA Tech Partners', contractId: '12', issueDate: '2024-08-28', dueDate: '2024-09-27', implementationFee: 0, licenseFee: 22932, units: 13, totalAmount: 22932, status: 'paid', paidDate: '2024-09-25' },
  { id: '44', invoiceNumber: 'INV-2024-044', partnerId: '11', partnerName: 'MENA Tech Partners', contractId: '12', issueDate: '2024-11-18', dueDate: '2024-12-18', implementationFee: 0, licenseFee: 21168, units: 12, totalAmount: 21168, status: 'paid', paidDate: '2024-12-16' },

  // LatAm Digital Group (Partner 12)
  { id: '45', invoiceNumber: 'INV-2023-045', partnerId: '12', partnerName: 'LatAm Digital Group', contractId: '13', issueDate: '2023-10-20', dueDate: '2023-11-19', implementationFee: 93600, licenseFee: 15840, units: 10, totalAmount: 109440, status: 'paid', paidDate: '2023-11-17' },
  { id: '46', invoiceNumber: 'INV-2024-046', partnerId: '12', partnerName: 'LatAm Digital Group', contractId: '13', issueDate: '2024-01-25', dueDate: '2024-02-24', implementationFee: 0, licenseFee: 19008, units: 12, totalAmount: 19008, status: 'paid', paidDate: '2024-02-22' },
  { id: '47', invoiceNumber: 'INV-2024-047', partnerId: '12', partnerName: 'LatAm Digital Group', contractId: '13', issueDate: '2024-04-30', dueDate: '2024-05-30', implementationFee: 0, licenseFee: 22176, units: 14, totalAmount: 22176, status: 'paid', paidDate: '2024-05-28' },
  { id: '48', invoiceNumber: 'INV-2024-048', partnerId: '12', partnerName: 'LatAm Digital Group', contractId: '13', issueDate: '2024-07-28', dueDate: '2024-08-27', implementationFee: 0, licenseFee: 17424, units: 11, totalAmount: 17424, status: 'paid', paidDate: '2024-08-25' },
  { id: '49', invoiceNumber: 'INV-2024-049', partnerId: '12', partnerName: 'LatAm Digital Group', contractId: '13', issueDate: '2024-10-22', dueDate: '2024-11-21', implementationFee: 0, licenseFee: 25344, units: 16, totalAmount: 25344, status: 'paid', paidDate: '2024-11-19' },

  // Deutsch Tech GmbH (Partner 13)
  { id: '50', invoiceNumber: 'INV-2023-050', partnerId: '13', partnerName: 'Deutsch Tech GmbH', contractId: '14', issueDate: '2023-07-14', dueDate: '2023-08-13', implementationFee: 162000, licenseFee: 63000, units: 25, totalAmount: 225000, status: 'paid', paidDate: '2023-08-11' },
  { id: '51', invoiceNumber: 'INV-2023-051', partnerId: '13', partnerName: 'Deutsch Tech GmbH', contractId: '14', issueDate: '2023-10-18', dueDate: '2023-11-17', implementationFee: 0, licenseFee: 75600, units: 30, totalAmount: 75600, status: 'paid', paidDate: '2023-11-15' },
  { id: '52', invoiceNumber: 'INV-2024-052', partnerId: '13', partnerName: 'Deutsch Tech GmbH', contractId: '14', issueDate: '2024-01-12', dueDate: '2024-02-11', implementationFee: 0, licenseFee: 85680, units: 34, totalAmount: 85680, status: 'paid', paidDate: '2024-02-09' },
  { id: '53', invoiceNumber: 'INV-2024-053', partnerId: '13', partnerName: 'Deutsch Tech GmbH', contractId: '14', issueDate: '2024-04-22', dueDate: '2024-05-22', implementationFee: 0, licenseFee: 70560, units: 28, totalAmount: 70560, status: 'paid', paidDate: '2024-05-20' },
  { id: '54', invoiceNumber: 'INV-2024-054', partnerId: '13', partnerName: 'Deutsch Tech GmbH', contractId: '15', issueDate: '2024-08-01', dueDate: '2024-08-31', implementationFee: 171000, licenseFee: 65250, units: 25, totalAmount: 236250, status: 'paid', paidDate: '2024-08-29' },
  { id: '55', invoiceNumber: 'INV-2024-055', partnerId: '13', partnerName: 'Deutsch Tech GmbH', contractId: '15', issueDate: '2024-10-25', dueDate: '2024-11-24', implementationFee: 0, licenseFee: 83520, units: 32, totalAmount: 83520, status: 'paid', paidDate: '2024-11-22' },
  { id: '56', invoiceNumber: 'INV-2024-056', partnerId: '13', partnerName: 'Deutsch Tech GmbH', contractId: '15', issueDate: '2024-12-20', dueDate: '2025-01-19', implementationFee: 0, licenseFee: 78300, units: 30, totalAmount: 78300, status: 'paid', paidDate: '2025-01-17' },

  // Tech Ventures India (Partner 14)
  { id: '57', invoiceNumber: 'INV-2024-057', partnerId: '14', partnerName: 'Tech Ventures India', contractId: '16', issueDate: '2024-06-03', dueDate: '2024-07-03', implementationFee: 86400, licenseFee: 16560, units: 10, totalAmount: 102960, status: 'paid', paidDate: '2024-07-01' },
  { id: '58', invoiceNumber: 'INV-2024-058', partnerId: '14', partnerName: 'Tech Ventures India', contractId: '16', issueDate: '2024-09-05', dueDate: '2024-10-05', implementationFee: 0, licenseFee: 23184, units: 14, totalAmount: 23184, status: 'paid', paidDate: '2024-10-03' },
  { id: '59', invoiceNumber: 'INV-2024-059', partnerId: '14', partnerName: 'Tech Ventures India', contractId: '16', issueDate: '2024-12-01', dueDate: '2024-12-31', implementationFee: 0, licenseFee: 19872, units: 12, totalAmount: 19872, status: 'paid', paidDate: '2024-12-29' },

  // Atlantic Software Ltd (Partner 15)
  { id: '60', invoiceNumber: 'INV-2024-060', partnerId: '15', partnerName: 'Atlantic Software Ltd', contractId: '17', issueDate: '2024-02-28', dueDate: '2024-03-29', implementationFee: 111600, licenseFee: 23328, units: 12, totalAmount: 134928, status: 'paid', paidDate: '2024-03-27' },
  { id: '61', invoiceNumber: 'INV-2024-061', partnerId: '15', partnerName: 'Atlantic Software Ltd', contractId: '17', issueDate: '2024-05-15', dueDate: '2024-06-14', implementationFee: 0, licenseFee: 29160, units: 15, totalAmount: 29160, status: 'paid', paidDate: '2024-06-12' },
  { id: '62', invoiceNumber: 'INV-2024-062', partnerId: '15', partnerName: 'Atlantic Software Ltd', contractId: '17', issueDate: '2024-08-20', dueDate: '2024-09-19', implementationFee: 0, licenseFee: 34992, units: 18, totalAmount: 34992, status: 'paid', paidDate: '2024-09-17' },
  { id: '63', invoiceNumber: 'INV-2024-063', partnerId: '15', partnerName: 'Atlantic Software Ltd', contractId: '17', issueDate: '2024-11-12', dueDate: '2024-12-12', implementationFee: 0, licenseFee: 27216, units: 14, totalAmount: 27216, status: 'paid', paidDate: '2024-12-10' },

  // ═══════════════════════════════════════════════════════
  //  2025 INVOICES (filling the gap year)
  // ═══════════════════════════════════════════════════════

  // Tech Solutions Inc (Partner 1) — contracts 18 & 21
  { id: '64', invoiceNumber: 'INV-2025-064', partnerId: '1', partnerName: 'Tech Solutions Inc', contractId: '18', issueDate: '2025-01-15', dueDate: '2025-02-14', implementationFee: 0, licenseFee: 30240, units: 16, totalAmount: 30240, status: 'paid', paidDate: '2025-02-12' },
  { id: '65', invoiceNumber: 'INV-2025-065', partnerId: '1', partnerName: 'Tech Solutions Inc', contractId: '18', issueDate: '2025-04-10', dueDate: '2025-05-10', implementationFee: 0, licenseFee: 37800, units: 20, totalAmount: 37800, status: 'paid', paidDate: '2025-05-08' },
  { id: '66', invoiceNumber: 'INV-2025-066', partnerId: '1', partnerName: 'Tech Solutions Inc', contractId: '21', issueDate: '2025-07-01', dueDate: '2025-07-31', implementationFee: 104400, licenseFee: 27720, units: 14, totalAmount: 132120, status: 'paid', paidDate: '2025-07-29' },
  { id: '67', invoiceNumber: 'INV-2025-067', partnerId: '1', partnerName: 'Tech Solutions Inc', contractId: '21', issueDate: '2025-09-20', dueDate: '2025-10-20', implementationFee: 0, licenseFee: 33660, units: 17, totalAmount: 33660, status: 'paid', paidDate: '2025-10-18' },
  { id: '68', invoiceNumber: 'INV-2025-068', partnerId: '1', partnerName: 'Tech Solutions Inc', contractId: '21', issueDate: '2025-12-05', dueDate: '2026-01-04', implementationFee: 0, licenseFee: 31680, units: 16, totalAmount: 31680, status: 'paid', paidDate: '2026-01-02' },

  // InnovateSoft (Partner 2) — contracts 2 & 22
  { id: '69', invoiceNumber: 'INV-2025-069', partnerId: '2', partnerName: 'InnovateSoft', contractId: '2', issueDate: '2025-02-10', dueDate: '2025-03-12', implementationFee: 0, licenseFee: 47520, units: 22, totalAmount: 47520, status: 'paid', paidDate: '2025-03-10' },
  { id: '70', invoiceNumber: 'INV-2025-070', partnerId: '2', partnerName: 'InnovateSoft', contractId: '22', issueDate: '2025-04-01', dueDate: '2025-04-30', implementationFee: 144000, licenseFee: 41472, units: 18, totalAmount: 185472, status: 'paid', paidDate: '2025-04-28' },
  { id: '71', invoiceNumber: 'INV-2025-071', partnerId: '2', partnerName: 'InnovateSoft', contractId: '22', issueDate: '2025-06-20', dueDate: '2025-07-20', implementationFee: 0, licenseFee: 50688, units: 22, totalAmount: 50688, status: 'paid', paidDate: '2025-07-18' },
  { id: '72', invoiceNumber: 'INV-2025-072', partnerId: '2', partnerName: 'InnovateSoft', contractId: '22', issueDate: '2025-09-15', dueDate: '2025-10-15', implementationFee: 0, licenseFee: 57600, units: 25, totalAmount: 57600, status: 'paid', paidDate: '2025-10-13' },
  { id: '73', invoiceNumber: 'INV-2025-073', partnerId: '2', partnerName: 'InnovateSoft', contractId: '22', issueDate: '2025-12-01', dueDate: '2025-12-31', implementationFee: 0, licenseFee: 46080, units: 20, totalAmount: 46080, status: 'paid', paidDate: '2025-12-29' },

  // Digital Pro Solutions (Partner 4) — contracts 5 & 35
  { id: '74', invoiceNumber: 'INV-2025-074', partnerId: '4', partnerName: 'Digital Pro Solutions', contractId: '5', issueDate: '2025-02-01', dueDate: '2025-03-03', implementationFee: 0, licenseFee: 35190, units: 17, totalAmount: 35190, status: 'paid', paidDate: '2025-03-01' },
  { id: '75', invoiceNumber: 'INV-2025-075', partnerId: '4', partnerName: 'Digital Pro Solutions', contractId: '5', issueDate: '2025-05-10', dueDate: '2025-06-09', implementationFee: 0, licenseFee: 41400, units: 20, totalAmount: 41400, status: 'paid', paidDate: '2025-06-07' },
  { id: '76', invoiceNumber: 'INV-2025-076', partnerId: '4', partnerName: 'Digital Pro Solutions', contractId: '35', issueDate: '2025-09-01', dueDate: '2025-09-30', implementationFee: 126000, licenseFee: 34560, units: 16, totalAmount: 160560, status: 'paid', paidDate: '2025-09-28' },
  { id: '77', invoiceNumber: 'INV-2025-077', partnerId: '4', partnerName: 'Digital Pro Solutions', contractId: '35', issueDate: '2025-11-15', dueDate: '2025-12-15', implementationFee: 0, licenseFee: 41040, units: 19, totalAmount: 41040, status: 'paid', paidDate: '2025-12-13' },

  // CloudWise Technologies (Partner 5) — contracts 19 & 23
  { id: '78', invoiceNumber: 'INV-2025-078', partnerId: '5', partnerName: 'CloudWise Technologies', contractId: '19', issueDate: '2025-02-01', dueDate: '2025-03-03', implementationFee: 0, licenseFee: 25200, units: 14, totalAmount: 25200, status: 'paid', paidDate: '2025-03-01' },
  { id: '79', invoiceNumber: 'INV-2025-079', partnerId: '5', partnerName: 'CloudWise Technologies', contractId: '19', issueDate: '2025-05-10', dueDate: '2025-06-09', implementationFee: 0, licenseFee: 32400, units: 18, totalAmount: 32400, status: 'paid', paidDate: '2025-06-07' },
  { id: '80', invoiceNumber: 'INV-2025-080', partnerId: '5', partnerName: 'CloudWise Technologies', contractId: '23', issueDate: '2025-09-01', dueDate: '2025-09-30', implementationFee: 111600, licenseFee: 26460, units: 14, totalAmount: 138060, status: 'paid', paidDate: '2025-09-28' },
  { id: '81', invoiceNumber: 'INV-2025-081', partnerId: '5', partnerName: 'CloudWise Technologies', contractId: '23', issueDate: '2025-11-20', dueDate: '2025-12-20', implementationFee: 0, licenseFee: 30240, units: 16, totalAmount: 30240, status: 'paid', paidDate: '2025-12-18' },

  // Nexus Group SA (Partner 6) — contracts 8 & 24
  { id: '82', invoiceNumber: 'INV-2025-082', partnerId: '6', partnerName: 'Nexus Group SA', contractId: '8', issueDate: '2025-03-01', dueDate: '2025-03-31', implementationFee: 0, licenseFee: 60750, units: 25, totalAmount: 60750, status: 'paid', paidDate: '2025-03-29' },
  { id: '83', invoiceNumber: 'INV-2025-083', partnerId: '6', partnerName: 'Nexus Group SA', contractId: '8', issueDate: '2025-06-15', dueDate: '2025-07-15', implementationFee: 0, licenseFee: 72900, units: 30, totalAmount: 72900, status: 'paid', paidDate: '2025-07-13' },
  { id: '84', invoiceNumber: 'INV-2025-084', partnerId: '6', partnerName: 'Nexus Group SA', contractId: '8', issueDate: '2025-09-01', dueDate: '2025-09-30', implementationFee: 0, licenseFee: 53460, units: 22, totalAmount: 53460, status: 'paid', paidDate: '2025-09-28' },
  { id: '85', invoiceNumber: 'INV-2025-085', partnerId: '6', partnerName: 'Nexus Group SA', contractId: '24', issueDate: '2025-10-01', dueDate: '2025-10-31', implementationFee: 162000, licenseFee: 55440, units: 22, totalAmount: 217440, status: 'paid', paidDate: '2025-10-29' },
  { id: '86', invoiceNumber: 'INV-2025-086', partnerId: '6', partnerName: 'Nexus Group SA', contractId: '24', issueDate: '2025-12-20', dueDate: '2026-01-19', implementationFee: 0, licenseFee: 65520, units: 26, totalAmount: 65520, status: 'paid', paidDate: '2026-01-17' },

  // Iberia Tech Solutions (Partner 7) — contracts 9 & 25
  { id: '87', invoiceNumber: 'INV-2025-087', partnerId: '7', partnerName: 'Iberia Tech Solutions', contractId: '9', issueDate: '2025-01-20', dueDate: '2025-02-19', implementationFee: 0, licenseFee: 18360, units: 12, totalAmount: 18360, status: 'paid', paidDate: '2025-02-17' },
  { id: '88', invoiceNumber: 'INV-2025-088', partnerId: '7', partnerName: 'Iberia Tech Solutions', contractId: '25', issueDate: '2025-05-01', dueDate: '2025-05-31', implementationFee: 90000, licenseFee: 16200, units: 10, totalAmount: 106200, status: 'paid', paidDate: '2025-05-29' },
  { id: '89', invoiceNumber: 'INV-2025-089', partnerId: '7', partnerName: 'Iberia Tech Solutions', contractId: '25', issueDate: '2025-08-15', dueDate: '2025-09-14', implementationFee: 0, licenseFee: 21060, units: 13, totalAmount: 21060, status: 'paid', paidDate: '2025-09-12' },
  { id: '90', invoiceNumber: 'INV-2025-090', partnerId: '7', partnerName: 'Iberia Tech Solutions', contractId: '25', issueDate: '2025-11-10', dueDate: '2025-12-10', implementationFee: 0, licenseFee: 19440, units: 12, totalAmount: 19440, status: 'paid', paidDate: '2025-12-08' },

  // East Asia Systems (Partner 8) — contracts 20 & 26
  { id: '91', invoiceNumber: 'INV-2025-091', partnerId: '8', partnerName: 'East Asia Systems', contractId: '20', issueDate: '2025-03-10', dueDate: '2025-04-09', implementationFee: 129600, licenseFee: 35640, units: 18, totalAmount: 165240, status: 'paid', paidDate: '2025-04-07' },
  { id: '92', invoiceNumber: 'INV-2025-092', partnerId: '8', partnerName: 'East Asia Systems', contractId: '20', issueDate: '2025-06-05', dueDate: '2025-07-05', implementationFee: 0, licenseFee: 39600, units: 20, totalAmount: 39600, status: 'paid', paidDate: '2025-07-03' },
  { id: '93', invoiceNumber: 'INV-2025-093', partnerId: '8', partnerName: 'East Asia Systems', contractId: '26', issueDate: '2025-07-01', dueDate: '2025-07-31', implementationFee: 135000, licenseFee: 32256, units: 16, totalAmount: 167256, status: 'paid', paidDate: '2025-07-29' },
  { id: '94', invoiceNumber: 'INV-2025-094', partnerId: '8', partnerName: 'East Asia Systems', contractId: '26', issueDate: '2025-10-15', dueDate: '2025-11-14', implementationFee: 0, licenseFee: 40320, units: 20, totalAmount: 40320, status: 'paid', paidDate: '2025-11-12' },

  // Paris Software House (Partner 10) — contracts 27 & 28
  { id: '95', invoiceNumber: 'INV-2025-095', partnerId: '10', partnerName: 'Paris Software House', contractId: '27', issueDate: '2025-02-01', dueDate: '2025-03-03', implementationFee: 129600, licenseFee: 33264, units: 14, totalAmount: 162864, status: 'paid', paidDate: '2025-03-01' },
  { id: '96', invoiceNumber: 'INV-2025-096', partnerId: '10', partnerName: 'Paris Software House', contractId: '27', issueDate: '2025-05-15', dueDate: '2025-06-14', implementationFee: 0, licenseFee: 40392, units: 17, totalAmount: 40392, status: 'paid', paidDate: '2025-06-12' },
  { id: '97', invoiceNumber: 'INV-2025-097', partnerId: '10', partnerName: 'Paris Software House', contractId: '27', issueDate: '2025-08-20', dueDate: '2025-09-19', implementationFee: 0, licenseFee: 47520, units: 20, totalAmount: 47520, status: 'paid', paidDate: '2025-09-17' },
  { id: '98', invoiceNumber: 'INV-2025-098', partnerId: '10', partnerName: 'Paris Software House', contractId: '27', issueDate: '2025-11-10', dueDate: '2025-12-10', implementationFee: 0, licenseFee: 38016, units: 16, totalAmount: 38016, status: 'paid', paidDate: '2025-12-08' },

  // MENA Tech Partners (Partner 11) — contracts 12 & 29
  { id: '99', invoiceNumber: 'INV-2025-099', partnerId: '11', partnerName: 'MENA Tech Partners', contractId: '12', issueDate: '2025-02-15', dueDate: '2025-03-17', implementationFee: 0, licenseFee: 21168, units: 12, totalAmount: 21168, status: 'paid', paidDate: '2025-03-15' },
  { id: '100', invoiceNumber: 'INV-2025-100', partnerId: '11', partnerName: 'MENA Tech Partners', contractId: '29', issueDate: '2025-06-01', dueDate: '2025-06-30', implementationFee: 108000, licenseFee: 22032, units: 12, totalAmount: 130032, status: 'paid', paidDate: '2025-06-28' },
  { id: '101', invoiceNumber: 'INV-2025-101', partnerId: '11', partnerName: 'MENA Tech Partners', contractId: '29', issueDate: '2025-09-10', dueDate: '2025-10-10', implementationFee: 0, licenseFee: 27540, units: 15, totalAmount: 27540, status: 'paid', paidDate: '2025-10-08' },
  { id: '102', invoiceNumber: 'INV-2025-102', partnerId: '11', partnerName: 'MENA Tech Partners', contractId: '29', issueDate: '2025-12-01', dueDate: '2025-12-31', implementationFee: 0, licenseFee: 23868, units: 13, totalAmount: 23868, status: 'paid', paidDate: '2025-12-29' },

  // LatAm Digital Group (Partner 12) — contracts 30 & 31
  { id: '103', invoiceNumber: 'INV-2025-103', partnerId: '12', partnerName: 'LatAm Digital Group', contractId: '30', issueDate: '2025-01-15', dueDate: '2025-02-14', implementationFee: 100800, licenseFee: 19872, units: 12, totalAmount: 120672, status: 'paid', paidDate: '2025-02-12' },
  { id: '104', invoiceNumber: 'INV-2025-104', partnerId: '12', partnerName: 'LatAm Digital Group', contractId: '30', issueDate: '2025-04-20', dueDate: '2025-05-20', implementationFee: 0, licenseFee: 23184, units: 14, totalAmount: 23184, status: 'paid', paidDate: '2025-05-18' },
  { id: '105', invoiceNumber: 'INV-2025-105', partnerId: '12', partnerName: 'LatAm Digital Group', contractId: '30', issueDate: '2025-07-25', dueDate: '2025-08-24', implementationFee: 0, licenseFee: 26496, units: 16, totalAmount: 26496, status: 'paid', paidDate: '2025-08-22' },
  { id: '106', invoiceNumber: 'INV-2025-106', partnerId: '12', partnerName: 'LatAm Digital Group', contractId: '30', issueDate: '2025-10-15', dueDate: '2025-11-14', implementationFee: 0, licenseFee: 21528, units: 13, totalAmount: 21528, status: 'paid', paidDate: '2025-11-12' },

  // Deutsch Tech GmbH (Partner 13) — contracts 15 & 32
  { id: '107', invoiceNumber: 'INV-2025-107', partnerId: '13', partnerName: 'Deutsch Tech GmbH', contractId: '15', issueDate: '2025-01-20', dueDate: '2025-02-19', implementationFee: 0, licenseFee: 83520, units: 32, totalAmount: 83520, status: 'paid', paidDate: '2025-02-17' },
  { id: '108', invoiceNumber: 'INV-2025-108', partnerId: '13', partnerName: 'Deutsch Tech GmbH', contractId: '15', issueDate: '2025-04-15', dueDate: '2025-05-15', implementationFee: 0, licenseFee: 91350, units: 35, totalAmount: 91350, status: 'paid', paidDate: '2025-05-13' },
  { id: '109', invoiceNumber: 'INV-2025-109', partnerId: '13', partnerName: 'Deutsch Tech GmbH', contractId: '32', issueDate: '2025-08-01', dueDate: '2025-08-31', implementationFee: 180000, licenseFee: 75600, units: 28, totalAmount: 255600, status: 'paid', paidDate: '2025-08-29' },
  { id: '110', invoiceNumber: 'INV-2025-110', partnerId: '13', partnerName: 'Deutsch Tech GmbH', contractId: '32', issueDate: '2025-10-20', dueDate: '2025-11-19', implementationFee: 0, licenseFee: 86400, units: 32, totalAmount: 86400, status: 'paid', paidDate: '2025-11-17' },
  { id: '111', invoiceNumber: 'INV-2025-111', partnerId: '13', partnerName: 'Deutsch Tech GmbH', contractId: '32', issueDate: '2025-12-15', dueDate: '2026-01-14', implementationFee: 0, licenseFee: 94500, units: 35, totalAmount: 94500, status: 'paid', paidDate: '2026-01-12' },

  // Tech Ventures India (Partner 14) — contracts 16 & 33
  { id: '112', invoiceNumber: 'INV-2025-112', partnerId: '14', partnerName: 'Tech Ventures India', contractId: '16', issueDate: '2025-03-05', dueDate: '2025-04-04', implementationFee: 0, licenseFee: 21528, units: 13, totalAmount: 21528, status: 'paid', paidDate: '2025-04-02' },
  { id: '113', invoiceNumber: 'INV-2025-113', partnerId: '14', partnerName: 'Tech Ventures India', contractId: '33', issueDate: '2025-06-03', dueDate: '2025-07-03', implementationFee: 93600, licenseFee: 21168, units: 12, totalAmount: 114768, status: 'paid', paidDate: '2025-07-01' },
  { id: '114', invoiceNumber: 'INV-2025-114', partnerId: '14', partnerName: 'Tech Ventures India', contractId: '33', issueDate: '2025-09-10', dueDate: '2025-10-10', implementationFee: 0, licenseFee: 26460, units: 15, totalAmount: 26460, status: 'paid', paidDate: '2025-10-08' },
  { id: '115', invoiceNumber: 'INV-2025-115', partnerId: '14', partnerName: 'Tech Ventures India', contractId: '33', issueDate: '2025-12-01', dueDate: '2025-12-31', implementationFee: 0, licenseFee: 22932, units: 13, totalAmount: 22932, status: 'paid', paidDate: '2025-12-29' },

  // Atlantic Software Ltd (Partner 15) — contracts 17 & 34
  { id: '116', invoiceNumber: 'INV-2025-116', partnerId: '15', partnerName: 'Atlantic Software Ltd', contractId: '17', issueDate: '2025-02-01', dueDate: '2025-03-03', implementationFee: 0, licenseFee: 31104, units: 16, totalAmount: 31104, status: 'paid', paidDate: '2025-03-01' },
  { id: '117', invoiceNumber: 'INV-2025-117', partnerId: '15', partnerName: 'Atlantic Software Ltd', contractId: '34', issueDate: '2025-03-01', dueDate: '2025-03-31', implementationFee: 122400, licenseFee: 28980, units: 14, totalAmount: 151380, status: 'paid', paidDate: '2025-03-29' },
  { id: '118', invoiceNumber: 'INV-2025-118', partnerId: '15', partnerName: 'Atlantic Software Ltd', contractId: '34', issueDate: '2025-06-15', dueDate: '2025-07-15', implementationFee: 0, licenseFee: 35190, units: 17, totalAmount: 35190, status: 'paid', paidDate: '2025-07-13' },
  { id: '119', invoiceNumber: 'INV-2025-119', partnerId: '15', partnerName: 'Atlantic Software Ltd', contractId: '34', issueDate: '2025-09-20', dueDate: '2025-10-20', implementationFee: 0, licenseFee: 33120, units: 16, totalAmount: 33120, status: 'paid', paidDate: '2025-10-18' },
  { id: '120', invoiceNumber: 'INV-2025-120', partnerId: '15', partnerName: 'Atlantic Software Ltd', contractId: '34', issueDate: '2025-12-10', dueDate: '2026-01-09', implementationFee: 0, licenseFee: 37260, units: 18, totalAmount: 37260, status: 'paid', paidDate: '2026-01-07' },

  // ═══════════════════════════════════════════════════════
  //  2026 INVOICES (current year — YTD data)
  // ═══════════════════════════════════════════════════════

  // Tech Solutions Inc
  { id: '121', invoiceNumber: 'INV-2026-121', partnerId: '1', partnerName: 'Tech Solutions Inc', contractId: '21', issueDate: '2026-01-10', dueDate: '2026-02-09', implementationFee: 0, licenseFee: 35640, units: 18, totalAmount: 35640, status: 'paid', paidDate: '2026-02-07' },
  { id: '122', invoiceNumber: 'INV-2026-122', partnerId: '1', partnerName: 'Tech Solutions Inc', contractId: '21', issueDate: '2026-02-15', dueDate: '2026-03-17', implementationFee: 0, licenseFee: 37620, units: 19, totalAmount: 37620, status: 'pending' },

  // InnovateSoft
  { id: '123', invoiceNumber: 'INV-2026-123', partnerId: '2', partnerName: 'InnovateSoft', contractId: '22', issueDate: '2026-01-05', dueDate: '2026-02-04', implementationFee: 0, licenseFee: 48384, units: 21, totalAmount: 48384, status: 'paid', paidDate: '2026-02-02' },
  { id: '124', invoiceNumber: 'INV-2026-124', partnerId: '2', partnerName: 'InnovateSoft', contractId: '22', issueDate: '2026-02-20', dueDate: '2026-03-22', implementationFee: 0, licenseFee: 52992, units: 23, totalAmount: 52992, status: 'pending' },

  // Digital Pro Solutions
  { id: '125', invoiceNumber: 'INV-2026-125', partnerId: '4', partnerName: 'Digital Pro Solutions', contractId: '35', issueDate: '2026-01-20', dueDate: '2026-02-19', implementationFee: 0, licenseFee: 36720, units: 17, totalAmount: 36720, status: 'paid', paidDate: '2026-02-17' },
  { id: '126', invoiceNumber: 'INV-2026-126', partnerId: '4', partnerName: 'Digital Pro Solutions', contractId: '35', issueDate: '2026-03-01', dueDate: '2026-03-31', implementationFee: 0, licenseFee: 43200, units: 20, totalAmount: 43200, status: 'pending' },

  // CloudWise Technologies
  { id: '127', invoiceNumber: 'INV-2026-127', partnerId: '5', partnerName: 'CloudWise Technologies', contractId: '23', issueDate: '2026-01-15', dueDate: '2026-02-14', implementationFee: 0, licenseFee: 28350, units: 15, totalAmount: 28350, status: 'paid', paidDate: '2026-02-12' },
  { id: '128', invoiceNumber: 'INV-2026-128', partnerId: '5', partnerName: 'CloudWise Technologies', contractId: '23', issueDate: '2026-02-20', dueDate: '2026-03-01', implementationFee: 0, licenseFee: 34020, units: 18, totalAmount: 34020, status: 'overdue' },

  // Nexus Group SA
  { id: '129', invoiceNumber: 'INV-2026-129', partnerId: '6', partnerName: 'Nexus Group SA', contractId: '24', issueDate: '2026-01-10', dueDate: '2026-02-09', implementationFee: 0, licenseFee: 60480, units: 24, totalAmount: 60480, status: 'paid', paidDate: '2026-02-07' },
  { id: '130', invoiceNumber: 'INV-2026-130', partnerId: '6', partnerName: 'Nexus Group SA', contractId: '24', issueDate: '2026-02-28', dueDate: '2026-03-30', implementationFee: 0, licenseFee: 70560, units: 28, totalAmount: 70560, status: 'pending' },

  // Iberia Tech Solutions
  { id: '131', invoiceNumber: 'INV-2026-131', partnerId: '7', partnerName: 'Iberia Tech Solutions', contractId: '25', issueDate: '2026-02-05', dueDate: '2026-02-28', implementationFee: 0, licenseFee: 22680, units: 14, totalAmount: 22680, status: 'overdue' },

  // East Asia Systems
  { id: '132', invoiceNumber: 'INV-2026-132', partnerId: '8', partnerName: 'East Asia Systems', contractId: '26', issueDate: '2026-01-10', dueDate: '2026-02-09', implementationFee: 0, licenseFee: 36288, units: 18, totalAmount: 36288, status: 'paid', paidDate: '2026-02-07' },
  { id: '133', invoiceNumber: 'INV-2026-133', partnerId: '8', partnerName: 'East Asia Systems', contractId: '26', issueDate: '2026-02-15', dueDate: '2026-03-17', implementationFee: 0, licenseFee: 38304, units: 19, totalAmount: 38304, status: 'pending' },

  // Paris Software House
  { id: '134', invoiceNumber: 'INV-2026-134', partnerId: '10', partnerName: 'Paris Software House', contractId: '28', issueDate: '2026-02-01', dueDate: '2026-03-03', implementationFee: 135000, licenseFee: 34020, units: 14, totalAmount: 169020, status: 'overdue' },

  // MENA Tech Partners
  { id: '135', invoiceNumber: 'INV-2026-135', partnerId: '11', partnerName: 'MENA Tech Partners', contractId: '29', issueDate: '2026-01-05', dueDate: '2026-02-04', implementationFee: 0, licenseFee: 23868, units: 13, totalAmount: 23868, status: 'paid', paidDate: '2026-02-02' },
  { id: '136', invoiceNumber: 'INV-2026-136', partnerId: '11', partnerName: 'MENA Tech Partners', contractId: '29', issueDate: '2026-03-01', dueDate: '2026-03-31', implementationFee: 0, licenseFee: 25704, units: 14, totalAmount: 25704, status: 'pending' },

  // LatAm Digital Group
  { id: '137', invoiceNumber: 'INV-2026-137', partnerId: '12', partnerName: 'LatAm Digital Group', contractId: '31', issueDate: '2026-01-15', dueDate: '2026-02-14', implementationFee: 104400, licenseFee: 20520, units: 12, totalAmount: 124920, status: 'paid', paidDate: '2026-02-12' },
  { id: '138', invoiceNumber: 'INV-2026-138', partnerId: '12', partnerName: 'LatAm Digital Group', contractId: '31', issueDate: '2026-03-01', dueDate: '2026-03-31', implementationFee: 0, licenseFee: 23940, units: 14, totalAmount: 23940, status: 'pending' },

  // Deutsch Tech GmbH
  { id: '139', invoiceNumber: 'INV-2026-139', partnerId: '13', partnerName: 'Deutsch Tech GmbH', contractId: '32', issueDate: '2026-01-10', dueDate: '2026-02-09', implementationFee: 0, licenseFee: 81000, units: 30, totalAmount: 81000, status: 'paid', paidDate: '2026-02-07' },
  { id: '140', invoiceNumber: 'INV-2026-140', partnerId: '13', partnerName: 'Deutsch Tech GmbH', contractId: '32', issueDate: '2026-02-25', dueDate: '2026-03-27', implementationFee: 0, licenseFee: 83700, units: 31, totalAmount: 83700, status: 'pending' },

  // Tech Ventures India
  { id: '141', invoiceNumber: 'INV-2026-141', partnerId: '14', partnerName: 'Tech Ventures India', contractId: '33', issueDate: '2026-01-08', dueDate: '2026-02-07', implementationFee: 0, licenseFee: 24696, units: 14, totalAmount: 24696, status: 'paid', paidDate: '2026-02-05' },
  { id: '142', invoiceNumber: 'INV-2026-142', partnerId: '14', partnerName: 'Tech Ventures India', contractId: '33', issueDate: '2026-03-03', dueDate: '2026-04-02', implementationFee: 0, licenseFee: 26460, units: 15, totalAmount: 26460, status: 'pending' },

  // Atlantic Software Ltd
  { id: '143', invoiceNumber: 'INV-2026-143', partnerId: '15', partnerName: 'Atlantic Software Ltd', contractId: '34', issueDate: '2026-01-12', dueDate: '2026-02-11', implementationFee: 0, licenseFee: 33120, units: 16, totalAmount: 33120, status: 'paid', paidDate: '2026-02-09' },
  { id: '144', invoiceNumber: 'INV-2026-144', partnerId: '15', partnerName: 'Atlantic Software Ltd', contractId: '34', issueDate: '2026-02-20', dueDate: '2026-02-28', implementationFee: 0, licenseFee: 31050, units: 15, totalAmount: 31050, status: 'overdue' },
];
