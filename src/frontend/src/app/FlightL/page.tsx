'use client';

import { Box } from '@mui/material';

import DataTable from '@/components/DataTable';
import { useNotification } from '@/components/Notification';
import useGetAllFlight from '@/hooks/Flight/useGetAllFlight';
import useDeleteAllFlight from '@/hooks/Flight/useDeleteAllFlight';
import { tFlightStatus } from '@/enums/tFlightStatus.types';
import { tView } from '@/enums/tView.types';
import { IFlightL } from '@/types/Flight.types';
import useListState from '@/hooks/useListState';
import useExportList from '@/hooks/useExportList';
import { formatError } from '@/utils/errorsUtils';

export default function FlightPageList() {
  const viewName: string = 'FlightL';

  const {
    resetAll,
    isReady,
    applyFieldSettings,
    handleRowClickWithState,
    handleCreateButtonWithState,
    updateSettings: {
      updatePerPage,
      updateSorting,
      updateVisibleColumns,
      updateColumnResize,
      updateColumnReorder,
      updateFilter,
    },
    params: { page, perPage, sorting, filter, search, setSearch },
  } = useListState<IFlightL>('FlightPageList', {
    perPage: 10,
    columnWidth: {},
    columnHidden: {},
    columnOrder: {},
    columnSort: [],
    columnFilter: {},
  });

  const { showError, showSuccess } = useNotification();

  const { data, isLoading, count } = useGetAllFlight<IFlightL>({
    viewName,
    perPage,
    page,
    sorting,
    filter,
    search,
    enabled: isReady,
  });

  const handleSuccess = () => {
    showSuccess(`Запись удалена.`);
  };

  const handleError = (error: Error) => {
    showError(`Ошибка при удалении настройки: ${formatError(error)}.`);
  };

  const { deleteAllFlight } = useDeleteAllFlight(handleSuccess, handleError);

  const handleDelete = (items: IFlightL[]) => {
    deleteAllFlight(items.map((item) => item.id));
  };

  const { exportList } = useExportList({
    viewName: tView.FlightL,
    fileName: 'FlightL',
    sorting,
    filter,
    search,
  });

  const fields = applyFieldSettings([
    {
      field: 'flightNumber',
      title: 'Flight number',
      filter: true,
      type: 'text',
    },
    {
      field: 'departureTime',
      title: 'Departure time',
      filter: true,
      type: 'date',
    },
    {
      field: 'arrivalTime',
      title: 'Arrival time',
      filter: true,
      type: 'date',
    },
    {
      field: 'status',
      title: 'Status',
      filter: true,
      type: 'enum',
      options: tFlightStatus,
    },
  ]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: '1' }}>
      <DataTable
        data={data ?? []}
        fields={fields}
        title="Flight"
        onRowClick={(item) => handleRowClickWithState(item)}
        onCreateButtonClick={() => handleCreateButtonWithState()}
        onDelete={handleDelete}
        filters={filter}
        setFilters={(v) => updateFilter(v)}
        setGlobalFilter={setSearch}
        totalRecords={count}
        rowsPerPage={perPage}
        page={page}
        setPage={(page, perPage) => updatePerPage(page, perPage)}
        multiSortMeta={sorting}
        setSorting={(columns) => updateSorting(columns)}
        lazyLoad={true}
        onChangeVisibleColumns={(columns) => updateVisibleColumns(fields, columns)}
        onColumnResize={(field, width) => updateColumnResize(field, width)}
        onColumnReorder={(fields) => updateColumnReorder(fields)}
        showResetButton={true}
        onResetSettingsClick={resetAll}
        onExportClick={exportList}
        isLoading={isLoading}
      />
    </Box>
  );
}
