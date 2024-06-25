<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import DataTable from "primevue/datatable";
import Button from "primevue/button";
import Column from "primevue/column";
import DatePicker from "primevue/datepicker";
import Select from "primevue/select";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

// Define the document type
interface Document {
  id: number;
  documentName: string;
  documentViewedCount: number;
  documentDownloadedCount: number;
  documentCategory: string;
  dateDocumentAdded: string;
}

const documents = ref<Document[]>([]);
const startDate = ref<Date | null>(null);
const endDate = ref<Date | null>(null);
const filterType = ref<string | null>('all');

const filterOptions = ref([
  { label: 'All', value: 'all' },
  { label: 'Most Viewed', value: 'mostViewed' },
  { label: 'Most Downloaded', value: 'mostDownloaded' }
]);

const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const fetchDocuments = async () => {
  try {
    let url = document.location.origin + "/api/index.php/v1/rsfilesreports/get/documents/info";

    // Determine the start and end dates for the API call
    const defaultHiddenStartDate = '1970-01-01';
    const today = new Date();
    const defaultHiddenEndDate = formatDate(today); // End of today in 'YYYY-MM-DD' format

    const apiStartDate = startDate.value ? formatDate(startDate.value) : defaultHiddenStartDate;
    const apiEndDate = endDate.value ? `${formatDate(endDate.value)} 23:59:59` : `${defaultHiddenEndDate} 23:59:59`;

    // Append filter parameters to the URL
    url += `?startDate=${apiStartDate}&endDate=${apiEndDate}`;

    if (filterType.value && filterType.value !== 'all') {
      url += `&sortBy=${filterType.value}`;
    }
console.log(url);
    const res = await fetch(url);
    const data = await res.json();
    console.log("API Response:", data);  // Log the API response to check the structure

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch documents");
    }

    // Ensure the response contains data and is an array
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error("API response does not contain data or data is not an array");
    }

    // Map the API response to the Document interface
    const mappedData: Document[] = data.data.map((item: any) => ({
      id: item.IdFile,
      documentName: item.FileName || 'Unnamed',
      documentViewedCount: item.total_views,
      documentDownloadedCount: item.total_downloads,
      documentCategory: item.Category,
      dateDocumentAdded: item.DateAdded
    }));

    documents.value = mappedData;
  } catch (error: unknown) {
    console.error(getErrorMessage(error))
  }
};

const getErrorMessage = (error: unknown): string => {
  let message = "An error occurred while fetching documents";
  if (error instanceof Error) {
    message = error.message;
  }
  return message;
};

const formatDateString = (dateString: string): string => {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return dateString;
  }
  return formatDate(date);
};

const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(documents.value);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Documents");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, 'documents_report.xlsx');
};

const today = new Date();

onMounted(fetchDocuments);

watch([startDate, endDate, filterType], fetchDocuments);
</script>

<template>
    <div class="flex flex-col md:flex-row justify-center md:space-y-0 md:space-x-4 mb-4">
      <!-- Visible DatePickers for user input -->
      <DatePicker
        v-model="startDate"
        placeholder="Start Date"
        :maxDate="today"
        class="custom-datepicker p-inputtext-sm w-full md:w-auto"
        showIcon
        showButtonBar
      />
      <DatePicker
        v-model="endDate"
        placeholder="End Date"
        :maxDate="today"
        class="custom-datepicker p-inputtext-sm w-full md:w-auto"
        showIcon
        showButtonBar
      />
      <Select
        v-model="filterType"
        :options="filterOptions"
        optionLabel="label"
        optionValue="value"
        placeholder="Select..."
        class="p-inputtext-sm w-[200px] md:w-w-[200px] text-center custom-select-dropdown"
      />
      <Button label="Export to Excel" icon="pi pi-file-excel" @click="exportToExcel" severity="info" raised class="bg-[#3d618f] hover:bg-[#4d79b3] !text-white p-button-sm w-full md:w-auto" />
    </div>
    <DataTable
      :value="documents"
      stripedRows
      paginator
      paginatorPosition="bottom"
      :rows="10"
      :rowsPerPageOptions="[5, 10, 20, 50, 100]"
      tableStyle="min-width: 100%"
      class="custom-header"
    >
      <template #paginatorstart>
        <div class="flex flex-wrap items-center justify-end">
          <Button type="button" icon="pi pi-download" class="invisible" text />
        </div>
      </template>
      <template #paginatorend>
        <div @click="exportToExcel" class="flex flex-wrap items-center justify-end">
          <Button type="button" icon="pi pi-download" text />
        </div>
      </template>
      <Column field="documentName" header="Name" headerClass="bg-blue text-white"></Column>
      <Column field="documentViewedCount" header="Views" headerClass="bg-blue text-white" style="width: 5%"></Column>
      <Column field="documentDownloadedCount" header="Downloads" headerClass="bg-blue text-white" style="width: 5%"></Column>
      <Column field="documentCategory" header="Category" headerClass="bg-blue text-white" style="width: 20%"></Column>
      <Column field="dateDocumentAdded" header="Document Added" :body="(rowData: Document) => formatDateString(rowData.dateDocumentAdded)" headerClass="bg-blue text-white" style="width: 20%"></Column>
    </DataTable>
</template>

<style scoped>
  .container {
    max-width: 1200px;
  }
  .bg-blue {
    background-color: #3d618f; /* Blue */
    color: white;
  }
  .custom-select-dropdown .p-dropdown {
    width: 200px; /* Adjust as necessary */
  }
  .custom-select-dropdown .p-dropdown-label {
    display: inline-block;
    width: auto; /* Adjust width based on the longest option */
  }
  .custom-datepicker .p-datepicker {
    border-color: transparent;
  }
  .custom-datepicker .p-datepicker:hover {
    border-color: #1E3A8A; /* Blue */
    box-shadow: 0 0 0 2px #1E3A8A; /* Blue */
  }
  .custom-datepicker .p-datepicker:focus-within {
    border-color: #1E3A8A; /* Blue */
    box-shadow: 0 0 0 2px #1E3A8A; /* Blue */
  }
</style>
