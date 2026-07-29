'use client';

import { Box } from '@mui/material';

import DataTable from '@/components/DataTable';
import { useNotification } from '@/components/Notification';
import useGetAllHelicopter from '@/hooks/Helicopter/useGetAllHelicopter';
import useDeleteAllHelicopter from '@/hooks/Helicopter/useDeleteAllHelicopter';
import { tView } from '@/enums/tView.types';
import { IHelicopterL } from '@/types/Helicopter.types';
import useListState from '@/hooks/useListState';
import useExportList from '@/hooks/useExportList';
import { formatError } from '@/utils/errorsUtils';

export default function HelicopterPageList() {
  const viewName: string = 'HelicopterL';

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
  } = useListState<IHelicopterL>('HelicopterPageList', {
    perPage: 10,
    columnWidth: {},
    columnHidden: {},
    columnOrder: {},
    columnSort: [],
    columnFilter: {},
  });

  const { showError, showSuccess } = useNotification();

  const { data, isLoading, count } = useGetAllHelicopter<IHelicopterL>({
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

  const { deleteAllHelicopter } = useDeleteAllHelicopter(handleSuccess, handleError);

  const handleDelete = (items: IHelicopterL[]) => {
    deleteAllHelicopter(items.map((item) => item.id));
  };

  const { exportList } = useExportList({
    viewName: tView.HelicopterL,
    fileName: 'HelicopterL',
    sorting,
    filter,
    search,
  });

  const fields = applyFieldSettings([
    {
      field: 'rotorDiameter',
      title: 'Rotor diameter',
      filter: true,
      type: 'number',
    },
    {
      field: 'maxAltitude',
      title: 'Max altitude',
      filter: true,
      type: 'number',
    },
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
        title="Helicopter"
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
