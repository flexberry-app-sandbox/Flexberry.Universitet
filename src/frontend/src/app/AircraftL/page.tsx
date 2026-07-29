'use client';

import { Box } from '@mui/material';

import DataTable from '@/components/DataTable';
import { useNotification } from '@/components/Notification';
import useGetAllAircraft from '@/hooks/Aircraft/useGetAllAircraft';
import useDeleteAllAircraft from '@/hooks/Aircraft/useDeleteAllAircraft';
import { tView } from '@/enums/tView.types';
import { IAircraftL } from '@/types/Aircraft.types';
import useListState from '@/hooks/useListState';
import useExportList from '@/hooks/useExportList';
import { formatError } from '@/utils/errorsUtils';

export default function AircraftPageList() {
  const viewName: string = 'AircraftL';

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
  } = useListState<IAircraftL>('AircraftPageList', {
    perPage: 10,
    columnWidth: {},
    columnHidden: {},
    columnOrder: {},
    columnSort: [],
    columnFilter: {},
  });

  const { showError, showSuccess } = useNotification();

  const { data, isLoading, count } = useGetAllAircraft<IAircraftL>({
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

  const { deleteAllAircraft } = useDeleteAllAircraft(handleSuccess, handleError);

  const handleDelete = (items: IAircraftL[]) => {
    deleteAllAircraft(items.map((item) => item.id));
  };

  const { exportList } = useExportList({
    viewName: tView.AircraftL,
    fileName: 'AircraftL',
    sorting,
    filter,
    search,
  });

  const fields = applyFieldSettings([
    {
      field: 'registrationNumber',
      title: 'Registration number',
      filter: true,
      type: 'text',
    },
    {
      field: 'model',
      title: 'Model',
      filter: true,
      type: 'text',
    },
    {
      field: 'capacity',
      title: 'Capacity',
      filter: true,
      type: 'number',
    },
  ]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: '1' }}>
      <DataTable
        data={data ?? []}
        fields={fields}
        title="Aircraft"
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
