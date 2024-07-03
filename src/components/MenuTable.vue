<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import DataTable from "primevue/datatable";
import Button from "primevue/button";
import Column from "primevue/column";
import DatePicker from "primevue/datepicker";
import Select from "primevue/select";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import type CategoriesTable from './CategoriesTable.vue';

// Define the menu type
interface Menu {
  id: number;
  title: string;
  country: string;
}

// Format date function
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Set default hidden dates
const defaultHiddenStartDate = '1970-01-01';
const today = new Date();
const defaultHiddenEndDate = formatDate(today); // End of today in 'YYYY-MM-DD' format

const menus = ref<Menu[]>([]);
const startDate = ref<Date | null>(null); // No default value for UI, start date will be empty initially
const endDate = ref<Date | null>(null);   // No default value for UI, end date will be empty initially
const filterType = ref<string | null>('all');  // Default to "All"

const filterOptions = ref([
  { label: 'All', value: 'all' },
  { label: 'Most Viewed', value: 'mostViewed' }
]);

const fetchMenus = async () => {
  try {
    let url = document.location.origin + "/api/index.php/v1/rsfilesreports/get/menu/info";

    // Determine the start and end dates for the API call
    const apiStartDate = startDate.value ? formatDate(startDate.value) : defaultHiddenStartDate;
    const apiEndDate = endDate.value ? `${formatDate(endDate.value)} 23:59:59` : `${defaultHiddenEndDate} 23:59:59`;

    // Append filter parameters to the URL
    url += `?startDate=${apiStartDate}&endDate=${apiEndDate}`;

    if (filterType.value === "mostViewed") {
      url += `&sortBy=mostViewed`;
    }
    console.log(url);
    const res = await fetch(url);
    const data = await res.json();
    console.log("API Response:", data);  // Log the API response to check the structure

    if (!res.ok || !data.success) {
      throw new Error(data.message || "Failed to fetch menus");
    }

    // Ensure the response is an array
    if (!Array.isArray(data.data)) {
      throw new Error("API response is not an array");
    }

    // Convert the response to the required format
    menus.value = data.data.map((item: any) => ({
      title: item.menu_title,
      categories: item.file_path,
      // country: item.country,
      total_views: item.total_views
    }));
  } catch (error: unknown) {
    console.error(getErrorMessage(error));
  }
};

const getErrorMessage = (error: unknown): string => {
  let message = "An error occurred while fetching menus";
  if (error instanceof Error) {
    message = error.message;
  }
  return message;
};

const exportToExcel = () => {
  const worksheet = XLSX.utils.json_to_sheet(menus.value);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Menus");
  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const data = new Blob([excelBuffer], { type: "application/octet-stream" });
  saveAs(data, 'menus_report.xlsx');
};

onMounted(fetchMenus);

watch([startDate, endDate, filterType], fetchMenus);
</script>
<template>
  <div class="flex flex-col md:flex-row justify-center md:space-y-0 md:space-x-4 mb-4">
    <DatePicker
      v-model="startDate"
      placeholder="Start Date"
      :maxDate="today"
      class="p-inputtext-sm w-full md:w-auto"
      showIcon
      showButtonBar
    />
    <DatePicker
      v-model="endDate"
      placeholder="End Date"
      :maxDate="today"
      class="p-inputtext-sm w-full md:w-auto"
      showIcon
      showButtonBar
    />
    <Select
      v-model="filterType"
      :options="filterOptions"
      optionLabel="label"
      optionValue="value"
      placeholder="Select..."
      class="p-inputtext-sm w-full text-center md:w-[200px] md:w-w-[200px]"
    />
    <Button label="Export to Excel" icon="pi pi-file-excel" @click="exportToExcel" class="p-button-success bg-[#3d618f] hover:bg-[#4d79b3] !text-white p-button-sm w-full md:w-auto" />
    <Button label="Refresh Data" icon="pi pi-refresh" @click="fetchMenus" severity="info" raised class="bg-[#3d618f] hover:bg-[#4d79b3] !text-white p-button-sm w-full md:w-auto" />

  </div>

  <DataTable
    :value="menus"
    stripedRows
    paginator
    paginatorPosition="bottom"
    :rows="10"
    :rowsPerPageOptions="[5, 10, 20, 50, 100]"
    tableStyle="min-width: 100%"
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
    <Column field="title" header="Menu Name" headerClass="bg-blue text-white"></Column>
    <Column field="categories" header="Categories" headerClass="bg-blue text-white"></Column>
    <!-- <Column field="country" header="Country" headerClass="bg-blue text-white"></Column> -->
    <Column field="total_views" header="Total Views" headerClass="bg-blue text-white"></Column>

  </DataTable>
</template>

<style scoped>
  .container {
    max-width: 1200px;
  }
  .p-datatable-thead > tr > th {
    background-color: #1E3A8A; /* Blue */
    color: white;
  }
  .custom-select-dropdown .p-dropdown {
    width: 200px; /* Adjust as necessary */
  }
  .custom-select-dropdown .p-dropdown-label {
    display: inline-block;
    width: auto; /* Adjust width based on the longest option */
  }
</style>
