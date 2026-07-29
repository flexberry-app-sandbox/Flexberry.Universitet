'use client';

import { Box } from '@mui/material';

import DataTable from '@/components/DataTable';
import { useNotification } from '@/components/Notification';
import useGetAllPassenger from '@/hooks/Passenger/useGetAllPassenger';
import useDeleteAllPassenger from '@/hooks/Passenger/useDeleteAllPassenger';
import { tView } from '@/enums/tView.types';
import { IPassengerL } from '@/types/Passenger.types';
import useListState from '@/hooks/useListState';
import useExportList from '@/hooks/useExportList';
import { formatError } from '@/utils/errorsUtils';

export default function PassengerPageList() {
  const viewName: string = 'PassengerL';

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
  } = useListState<IPassengerL>('PassengerPageList', {
    perPage: 10,
    columnWidth: {},
    columnHidden: {},
    columnOrder: {},
    columnSort: [],
    columnFilter: {},
  });

  const { showError, showSuccess } = useNotification();

  const { data, isLoading, count } = useGetAllPassenger<IPassengerL>({
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

  const { deleteAllPassenger } = useDeleteAllPassenger(handleSuccess, handleError);

  const handleDelete = (items: IPassengerL[]) => {
    deleteAllPassenger(items.map((item) => item.id));
  };

  const { exportList } = useExportList({
    viewName: tView.PassengerL,
    fileName: 'PassengerL',
    sorting,
    filter,
    search,
  });

  const fields = applyFieldSettings([
    {
      field: 'passportNumber',
      title: 'Passport number',
      filter: true,
      type: 'text',
    },
    {
      field: 'firstName',
      title: 'First name',
      filter: true,
      type: 'text',
    },
    {
      field: 'lastName',
      title: 'Last name',
      filter: true,
      type: 'text',
    },
  ]);

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', flexGrow: '1' }}>
      <DataTable
        data={data ?? []}
        fields={fields}
        title="Passenger"
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
