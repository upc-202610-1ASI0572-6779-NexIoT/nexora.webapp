<template>
  <section class="billing-card">
    <div class="section-header">
      <h2>Billing History</h2>
      <div class="section-actions">
        <button class="outline-button" type="button">
          <font-awesome-icon icon="download" />
          <span>Export CSV</span>
        </button>
        <button class="outline-button" type="button">
          <font-awesome-icon icon="filter" />
          <span>Filter</span>
        </button>
      </div>
    </div>

    <div class="billing-table-wrapper">
      <table class="billing-table">
        <thead>
          <tr>
            <th>Invoice ID</th>
            <th>Date</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="invoice in invoices" :key="invoice.id">
            <td>
              <strong>{{ invoice.id }}</strong>
            </td>
            <td>{{ invoice.date }}</td>
            <td>{{ invoice.amount }}</td>
            <td>
              <span class="paid-pill">{{ invoice.getStatusLabel() }}</span>
            </td>
            <td>
              <button class="pdf-button" type="button">
                <span>View PDF</span>
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
defineProps({
  invoices: {
    type: Array,
    required: true
  }
});
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
  transition: filter 0.2s ease, border-color 0.2s ease;
}

.outline-button:hover {
  filter: brightness(0.96);
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

.paid-pill {
  background: #ecfdf3;
  border-radius: 999px;
  color: #16803a;
  font-size: 0.72rem;
  font-weight: 800;
  padding: 4px 12px;
  text-transform: uppercase;
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
