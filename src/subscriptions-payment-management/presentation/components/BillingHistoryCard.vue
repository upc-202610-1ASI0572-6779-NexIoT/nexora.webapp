<template>
  <section class="billing-card">
    <div class="section-header">
      <h2>{{ t('subscription.billing.title') }}</h2>
      <div class="section-actions">
        <button class="outline-button" type="button" @click="handleExportExcel" :disabled="filteredInvoices.length === 0">
          <font-awesome-icon icon="download" />
          <span>{{ t('subscription.billing.exportCsv') }}</span>
        </button>
        <button class="outline-button" :class="{ 'outline-button--active': showFilters }" type="button" @click="showFilters = !showFilters">
          <font-awesome-icon icon="filter" />
          <span>{{ t('subscription.billing.filter') }}</span>
        </button>
      </div>
    </div>

    <!-- Filters Panel -->
    <transition name="fade">
      <div v-if="showFilters" class="filter-panel">
        <div class="filter-group">
          <label class="filter-label">{{ t('subscription.billing.filters.status') }}</label>
          <select v-model="filterStatus" class="filter-select">
            <option value="ALL">{{ t('subscription.billing.filters.all') }}</option>
            <option value="Paid">{{ t('subscription.billing.filters.paid') }}</option>
            <option value="Pending">{{ t('subscription.billing.filters.pending') }}</option>
          </select>
        </div>
        <div class="filter-group">
          <label class="filter-label">{{ t('subscription.billing.filters.startDate') }}</label>
          <input v-model="filterStartDate" type="date" class="filter-input" />
        </div>
        <div class="filter-group">
          <label class="filter-label">{{ t('subscription.billing.filters.endDate') }}</label>
          <input v-model="filterEndDate" type="date" class="filter-input" />
        </div>
        <div class="filter-group filter-group--actions">
          <button class="filter-reset-btn" @click="resetFilters">{{ t('subscription.billing.filters.clear') }}</button>
        </div>
      </div>
    </transition>

    <div class="billing-table-wrapper">
      <div v-if="filteredInvoices.length === 0" class="empty-state">
        <p>{{ t('subscription.billing.filters.empty') }}</p>
      </div>
      <table v-else class="billing-table">
        <thead>
        <tr>
          <th>{{ t('subscription.billing.headers.invoiceId') }}</th>
          <th>{{ t('subscription.billing.headers.date') }}</th>
          <th>{{ t('subscription.billing.headers.amount') }}</th>
          <th>{{ t('subscription.billing.headers.status') }}</th>
          <th>{{ t('subscription.billing.headers.action') }}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="invoice in filteredInvoices" :key="invoice.id">
          <td>
            <strong>{{ invoice.id }}</strong>
          </td>
          <td>{{ invoice.date }}</td>
          <td>{{ invoice.amount }}</td>
          <td>
              <span :class="['status-pill', 'status-pill--' + invoice.status.toLowerCase()]">
                {{ invoice.getStatusLabel() }}
              </span>
          </td>
          <td>
            <button class="pdf-button" type="button" @click="handlePrintPDF(invoice)">
              <span>{{ t('subscription.billing.viewPdf') }}</span>
              <font-awesome-icon icon="download" />
            </button>
          </td>
        </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useI18n } from '@/shared/presentation/i18n';
import { useSubscriptionPaymentStore } from '../store/subscriptionPaymentStore';
import { useAuthStore } from '@/contexts/iam/auth/presentation/store/authStore';

const { t } = useI18n();
const subscriptionPaymentStore = useSubscriptionPaymentStore();
const authStore = useAuthStore();

const props = defineProps({
  invoices: {
    type: Array,
    required: true
  }
});

const showFilters = ref(false);
const filterStatus = ref('ALL');
const filterStartDate = ref('');
const filterEndDate = ref('');

const resetFilters = () => {
  filterStatus.value = 'ALL';
  filterStartDate.value = '';
  filterEndDate.value = '';
};

const filteredInvoices = computed(() => {
  return props.invoices.filter(inv => {
    // Filter by status
    if (filterStatus.value !== 'ALL' && inv.status !== filterStatus.value) {
      return false;
    }
    // Filter by date
    if (filterStartDate.value) {
      const startDate = new Date(filterStartDate.value);
      startDate.setHours(0, 0, 0, 0);
      const invDate = new Date(inv.rawDate || inv.date);
      if (invDate < startDate) return false;
    }
    if (filterEndDate.value) {
      const endDate = new Date(filterEndDate.value);
      endDate.setHours(23, 59, 59, 999);
      const invDate = new Date(inv.rawDate || inv.date);
      if (invDate > endDate) return false;
    }
    return true;
  });
});

const handleExportExcel = () => {
  const sub = subscriptionPaymentStore.subscription;
  const user = authStore.user;

  // Format filters for reporting
  let statusFilterText = filterStatus.value === 'Paid' ? t('subscription.billing.filters.paid') :
      filterStatus.value === 'Pending' ? t('subscription.billing.filters.pending') :
          t('subscription.billing.filters.all');
  let dateFilterText = `${filterStartDate.value || '—'} a ${filterEndDate.value || '—'}`;

  let tableHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>Reporte Nexora</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <meta charset="utf-8">
    </head>
    <body style="font-family: Arial, sans-serif; color: #1e293b;">
      <table>
        <!-- Header Brand Banner -->
        <tr style="height: 40px;">
          <td colspan="5" style="background-color: #082765; color: #ffffff; font-size: 16pt; font-weight: bold; text-align: center; vertical-align: middle; font-family: Arial, sans-serif;">
            NEXORA - IoT ASSET MANAGEMENT
          </td>
        </tr>
        <tr style="height: 20px;">
          <td colspan="5" style="background-color: #f97316; color: #ffffff; font-size: 10pt; font-weight: bold; text-align: center; vertical-align: middle; font-family: Arial, sans-serif;">
            Reporte de Historial de Facturación
          </td>
        </tr>

        <!-- Company & Client Details -->
        <tr><td colspan="5" style="height: 10px;"></td></tr>
        <tr>
          <td style="font-weight: bold; color: #475569; font-size: 9pt;">Empresa:</td>
          <td colspan="2" style="font-size: 9pt;">Nexora Technologies S.A.</td>
          <td style="font-weight: bold; color: #475569; font-size: 9pt;">Cliente:</td>
          <td style="font-size: 9pt; font-weight: bold;">${user ? user.fullName : 'Cliente Nexora'}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; color: #475569; font-size: 9pt;">R.U.C.:</td>
          <td colspan="2" style="font-size: 9pt;">20601234567</td>
          <td style="font-weight: bold; color: #475569; font-size: 9pt;">Email Cliente:</td>
          <td style="font-size: 9pt;">${user ? user.email : '—'}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; color: #475569; font-size: 9pt;">Fecha Reporte:</td>
          <td colspan="2" style="font-size: 9pt;">${new Date().toLocaleDateString()}</td>
          <td style="font-weight: bold; color: #475569; font-size: 9pt;">Plan Actual:</td>
          <td style="font-size: 9pt; font-weight: bold; color: #082765;">${sub?.plan?.name || '—'}</td>
        </tr>
        <tr>
          <td style="font-weight: bold; color: #475569; font-size: 9pt;">Filtro Estado:</td>
          <td colspan="2" style="font-size: 9pt;">${statusFilterText}</td>
          <td style="font-weight: bold; color: #475569; font-size: 9pt;">Filtro Fechas:</td>
          <td style="font-size: 9pt;">${dateFilterText}</td>
        </tr>
        <tr><td colspan="5" style="height: 15px;"></td></tr>

        <!-- Table Headers -->
        <thead>
          <tr style="height: 25px;">
            <th style="background-color: #082765; color: #ffffff; font-weight: bold; text-align: left; padding: 6px; border: 1px solid #cbd5e1; font-family: Arial, sans-serif; font-size: 10pt;">${t('subscription.billing.headers.invoiceId')}</th>
            <th style="background-color: #082765; color: #ffffff; font-weight: bold; text-align: left; padding: 6px; border: 1px solid #cbd5e1; font-family: Arial, sans-serif; font-size: 10pt;">${t('subscription.billing.headers.date')}</th>
            <th style="background-color: #082765; color: #ffffff; font-weight: bold; text-align: right; padding: 6px; border: 1px solid #cbd5e1; font-family: Arial, sans-serif; font-size: 10pt;">${t('subscription.billing.headers.amount')}</th>
            <th style="background-color: #082765; color: #ffffff; font-weight: bold; text-align: center; padding: 6px; border: 1px solid #cbd5e1; font-family: Arial, sans-serif; font-size: 10pt;">${t('subscription.billing.headers.status')}</th>
            <th style="background-color: #082765; color: #ffffff; font-weight: bold; text-align: left; padding: 6px; border: 1px solid #cbd5e1; font-family: Arial, sans-serif; font-size: 10pt;">Concepto</th>
          </tr>
        </thead>
        <tbody>
    `;

  filteredInvoices.value.forEach((inv, index) => {
    const isEven = index % 2 === 0;
    const rowBg = isEven ? '#ffffff' : '#f8fafc';

    // Status colors
    const statusBg = inv.status === 'Paid' ? '#ecfdf3' : '#fef3c7';
    const statusColor = inv.status === 'Paid' ? '#16803a' : '#d97706';
    const statusText = inv.getStatusLabel();

    tableHtml += `
      <tr style="background-color: ${rowBg}; height: 22px;">
        <td style="padding: 6px; border: 1px solid #cbd5e1; font-family: Arial, sans-serif; font-size: 9.5pt; font-weight: bold; color: #082765;">${inv.id}</td>
        <td style="padding: 6px; border: 1px solid #cbd5e1; font-family: Arial, sans-serif; font-size: 9.5pt; color: #334155;">${inv.date}</td>
        <td style="padding: 6px; border: 1px solid #cbd5e1; font-family: Arial, sans-serif; font-size: 9.5pt; font-weight: bold; text-align: right; color: #0f172a;">${inv.amount}</td>
        <td style="padding: 6px; border: 1px solid #cbd5e1; font-family: Arial, sans-serif; font-size: 9pt; font-weight: bold; text-align: center; background-color: ${statusBg}; color: ${statusColor};">${statusText}</td>
        <td style="padding: 6px; border: 1px solid #cbd5e1; font-family: Arial, sans-serif; font-size: 9.5pt; color: #475569;">
          Suscripción Plan ${sub?.plan?.name || 'Nexora IoT'}
        </td>
      </tr>
    `;
  });

  tableHtml += `
        </tbody>
      </table>

      <!-- Footer Note -->
      <br>
      <div style="font-size: 8pt; color: #94a3b8; font-family: Arial, sans-serif;">
        Documento generado automáticamente por el sistema de facturación Nexora. support@nexora.io
      </div>
    </body>
    </html>
  `;

  const blob = new Blob([tableHtml], { type: 'application/vnd.ms-excel' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Nexora_Historial_Facturacion_${new Date().toISOString().slice(0, 10)}.xls`;
  a.click();
  URL.revokeObjectURL(url);
};

const handlePrintPDF = (invoice) => {
  const sub = subscriptionPaymentStore.subscription;
  const user = authStore.user;

  const printWindow = window.open('', '_blank', 'width=800,height=900');

  const htmlContent = `
    <html>
    <head>
      <title>${t('subscription.billing.receipt.title')} Nexora - ${invoice.id}</title>
      <style>
        body {
          font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
          color: #1e293b;
          margin: 0;
          padding: 40px;
          background-color: #ffffff;
        }
        .invoice-container {
          max-width: 700px;
          margin: 0 auto;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          padding: 40px;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
          position: relative;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          border-bottom: 2px solid #082765;
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .logo-section h1 {
          font-size: 26pt;
          color: #082765;
          margin: 0;
          font-weight: 800;
          letter-spacing: -0.5px;
        }
        .logo-section p {
          margin: 4px 0 0 0;
          font-size: 9.5pt;
          color: #f97316;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.5px;
        }
        .company-details {
          text-align: right;
          font-size: 9pt;
          color: #64748b;
          line-height: 1.5;
        }
        .company-details strong {
          color: #082765;
          font-size: 10pt;
        }
        .invoice-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 30px;
          background-color: #f8fafc;
          padding: 15px 20px;
          border-radius: 6px;
          border-left: 4px solid #f97316;
        }
        .invoice-title {
          font-size: 18pt;
          font-weight: 800;
          color: #082765;
          text-transform: uppercase;
        }
        .invoice-meta {
          text-align: right;
          font-size: 9.5pt;
          color: #334155;
          margin: 2px 0;
        }
        .invoice-meta span {
          font-weight: bold;
          color: #082765;
        }
        .details-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
          margin-bottom: 40px;
          font-size: 9.5pt;
          line-height: 1.6;
        }
        .details-box h3 {
          font-size: 10pt;
          color: #475569;
          text-transform: uppercase;
          margin-top: 0;
          margin-bottom: 10px;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 4px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }
        .details-box p {
          margin: 4px 0;
        }
        .item-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 40px;
        }
        .item-table th {
          background-color: #082765;
          color: #ffffff;
          font-size: 9pt;
          font-weight: 700;
          text-transform: uppercase;
          padding: 12px;
          text-align: left;
        }
        .item-table td {
          padding: 14px 12px;
          border-bottom: 1px solid #e2e8f0;
          font-size: 9.5pt;
          color: #334155;
        }
        .text-right {
          text-align: right;
        }
        .totals-section {
          display: flex;
          justify-content: flex-end;
        }
        .totals-table {
          width: 280px;
          font-size: 9.5pt;
        }
        .totals-table td {
          padding: 8px 0;
          color: #475569;
        }
        .totals-table tr.total-row td {
          border-top: 2px solid #082765;
          font-size: 13pt;
          font-weight: bold;
          color: #082765;
          padding-top: 12px;
        }
        .footer {
          margin-top: 60px;
          text-align: center;
          font-size: 8.5pt;
          color: #94a3b8;
          border-top: 1px solid #e2e8f0;
          padding-top: 20px;
          line-height: 1.5;
        }
        .status-stamp {
          border: 4px solid #16a34a;
          color: #16a34a;
          border-radius: 6px;
          padding: 8px 16px;
          font-size: 16pt;
          font-weight: 800;
          text-transform: uppercase;
          display: inline-block;
          transform: rotate(-7deg);
          opacity: 0.85;
          margin-top: 15px;
          letter-spacing: 1px;
        }
        .status-stamp--pending {
          border-color: #d97706;
          color: #d97706;
        }
        @media print {
          body {
            padding: 0;
            background-color: transparent;
          }
          .invoice-container {
            border: none;
            box-shadow: none;
            padding: 0;
            max-width: 100%;
          }
        }
      </style>
    </head>
    <body>
      <div class="invoice-container">
        <div class="header">
          <div class="logo-section">
            <h1>NEXORA</h1>
            <p>IoT Asset Management</p>
          </div>
          <div class="company-details">
            <strong>Nexora Technologies S.A.</strong><br>
            Av. Larco 456, Piso 8, Miraflores<br>
            Lima, Perú<br>
            R.U.C. 20601234567<br>
            billing@nexora.io
          </div>
        </div>

        <div class="invoice-title-row">
          <div>
            <div class="invoice-title">${t('subscription.billing.receipt.title')}</div>
            <div class="invoice-meta">${t('subscription.billing.receipt.code')}: <span>${invoice.id}</span></div>
          </div>
          <div>
            <div class="invoice-meta">${t('subscription.billing.receipt.date')}: <span>${invoice.date}</span></div>
            <div class="invoice-meta">${t('subscription.billing.receipt.currency')}: <span>USD</span></div>
          </div>
        </div>

        <div class="details-row">
          <div class="details-box">
            <h3>${t('subscription.billing.receipt.client')}</h3>
            <p><strong>${user ? user.fullName : 'Cliente Nexora'}</strong></p>
            <p>Email: ${user ? user.email : ''}</p>
          </div>
          <div class="details-box">
            <h3>${t('subscription.billing.receipt.details')}</h3>
            <p>${t('subscription.billing.receipt.plan')}: <strong>${sub?.plan?.name || 'Suscripción Nexora'}</strong></p>
            <p>${t('subscription.billing.receipt.status')}: ${sub?.status || 'Active'}</p>
            <div class="${invoice.status === 'Paid' ? 'status-stamp' : 'status-stamp status-stamp--pending'}">
              ${invoice.status === 'Paid' ? t('subscription.billing.receipt.paid') : t('subscription.billing.receipt.pending')}
            </div>
          </div>
        </div>

        <table class="item-table">
          <thead>
            <tr>
              <th>${t('subscription.billing.receipt.description')}</th>
              <th class="text-right">${t('subscription.billing.receipt.total')}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${t('subscription.billing.receipt.concept', { planName: sub?.plan?.name || '' })}</td>
              <td class="text-right" style="font-weight: bold; color: #0f172a;">${invoice.amount}</td>
            </tr>
          </tbody>
        </table>

        <div class="totals-section">
          <table class="totals-table">
            <tr>
              <td>${t('subscription.billing.receipt.subtotal')}</td>
              <td class="text-right" style="font-weight: bold; color: #334155;">${invoice.amount}</td>
            </tr>
            <tr>
              <td>${t('subscription.billing.receipt.tax')}</td>
              <td class="text-right" style="color: #64748b;">$0.00</td>
            </tr>
            <tr class="total-row">
              <td>${t('subscription.billing.receipt.total')}</td>
              <td class="text-right">${invoice.amount}</td>
            </tr>
          </table>
        </div>

        <div class="footer">
          ${t('subscription.billing.receipt.footer')}
        </div>
      </div>

      <script>
        window.onload = function() {
          window.print();
          setTimeout(function() { window.close(); }, 500);
        }
      <\/script>
    </body>
    </html>
  `;

  printWindow.document.write(htmlContent);
  printWindow.document.close();
};
</script>

<style scoped>
.billing-card {
  background: #ffffff;
  border: 1px solid #d7dde6;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(15, 23, 42, 0.08);
  margin-bottom: 16px;
}

.section-header,
.section-actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.section-header {
  justify-content: space-between;
  padding: 20px 28px;
}

.section-header h2 {
  color: #082765;
  font-size: 1.45rem;
  line-height: 1.15;
  margin: 0;
}

.section-actions {
  gap: 12px;
}

.outline-button {
  align-items: center;
  background: #ffffff;
  border: 1px solid #b7bfcb;
  border-radius: 4px;
  color: #374151;
  cursor: pointer;
  display: inline-flex;
  font-family: var(--font-general);
  font-weight: 800;
  gap: 8px;
  justify-content: center;
  min-height: 36px;
  padding: 0 14px;
  transition: all 0.2s ease;
}

.outline-button:hover:not(:disabled) {
  filter: brightness(0.96);
  border-color: #94a3b8;
}

.outline-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.outline-button--active {
  background-color: #f1f5f9;
  border-color: #082765;
  color: #082765;
}

/* Filters panel styling */
.filter-panel {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
  background-color: #f8fafc;
  border-bottom: 1px solid #e2e8f0;
  padding: 16px 28px;
  align-items: flex-end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.filter-group--actions {
  justify-content: flex-end;
}

.filter-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: #64748b;
  text-transform: uppercase;
}

.filter-select,
.filter-input {
  border: 1px solid #cbd5e1;
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 0.85rem;
  color: #1e293b;
  outline: none;
  background-color: white;
}

.filter-select:focus,
.filter-input:focus {
  border-color: #082765;
}

.filter-reset-btn {
  background: none;
  border: 1px dashed #cbd5e1;
  padding: 8px 16px;
  border-radius: 6px;
  color: #64748b;
  font-weight: 600;
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.filter-reset-btn:hover {
  background-color: #e2e8f0;
  color: #1e293b;
  border-color: #94a3b8;
}

.billing-table-wrapper {
  overflow-x: auto;
}

.billing-table {
  border-collapse: collapse;
  min-width: 680px;
  width: 100%;
}

.billing-table th {
  background: #f3f4f6;
  color: #4b5563;
  font-size: 0.76rem;
  padding: 14px 28px;
  text-align: left;
  text-transform: uppercase;
}

.billing-table td {
  border-top: 1px solid #e5e7eb;
  color: #4b5563;
  font-size: 0.9rem;
  padding: 15px 28px;
}

.billing-table td:first-child strong {
  color: #082765;
}

.billing-table td:nth-child(3) {
  color: #111827;
  font-weight: 800;
}

.status-pill {
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 4px 12px;
  text-transform: uppercase;
  display: inline-block;
}

.status-pill--paid {
  background: #ecfdf3;
  color: #16803a;
}

.status-pill--pending {
  background: #fef3c7;
  color: #d97706;
}

.pdf-button {
  align-items: center;
  background: transparent;
  border: 0;
  border-radius: 4px;
  color: #a64f00;
  cursor: pointer;
  display: inline-flex;
  font-family: var(--font-general);
  font-weight: 800;
  gap: 10px;
  justify-content: center;
  min-height: 24px;
  padding: 0;
  transition: opacity 0.2s;
}

.pdf-button:hover {
  opacity: 0.8;
}

.empty-state {
  padding: 40px;
  text-align: center;
  color: #64748b;
  font-size: 0.9rem;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

@media (max-width: 768px) {
  .section-header {
    align-items: stretch;
    flex-direction: column;
  }

  .section-actions {
    width: 100%;
  }

  .outline-button {
    flex: 1;
  }
}
</style>
