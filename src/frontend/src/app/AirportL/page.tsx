'use client';

import { Box } from '@mui/material';

import DataTable from '@/components/DataTable';
import { useNotification } from '@/components/Notification';
import useGetAllAirport from '@/hooks/Airport/useGetAllAirport';
import useDeleteAllAirport from '@/hooks/Airport/useDeleteAllAirport';
import { tView } from '@/enums/tView.types';
import { IAirportL } from '@/types/Airport.types';
import useListState from '@/hooks/useListState';
import useExportList from '@/hooks/useExportList';
import { formatError } from '@/utils/errorsUtils';

export default function AirportPageList() {
  const viewName: string = 'AirportL';

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
  } = useListState<IAirportL>('AirportPageList', {
    perPage: 10,
    columnWidth: {},
    columnHidden: {},
    columnOrder: {},
    columnSort: [],
    columnFilter: {},
  });

  const { showError, showSuccess } = useNotification();

  const { data, isLoading, count } = useGetAllAirport<IAirportL>({
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

  const { deleteAllAirport } = useDeleteAllAirport(handleSuccess, handleError);

  const handleDelete = (items: IAirportL[]) => {
    deleteAllAirport(items.map((item) => item.id));
  };

  const { exportList } = useExportList({
    viewName: tView.AirportL,
    fileName: 'AirportL',
    sorting,
    filter,
    search,
  });

  const fields = applyFieldSettings([
    {
      field: 'code',
      title: 'Code',
      filter: true,
      type: 'text',
    },
    {
      field: 'name',
      title: 'Name',
      filter: true,
      type: 'text',
    },
  ]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: '1' }}>
      <DataTable
        data={data ?? []}
        fields={fields}
        title="Airport"
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
