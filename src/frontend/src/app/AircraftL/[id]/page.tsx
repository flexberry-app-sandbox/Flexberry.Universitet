'use client';

import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { AxiosError } from 'axios';

import AircraftEFields from '@/modules/FormFields/AircraftEFields';
import useGetAircraft from '@/hooks/Aircraft/useGetAircraft';
import useUpdateAircraft from '@/hooks/Aircraft/useUpdateAircraft';
import { useNotification } from '@/components/Notification';
import EditFormToolbar from '@/components/EditFormToolbar';
import CircularProgressCenter from '@/components/CircularProgressCenter';
import { IAircraftE } from '@/types/Aircraft.types';
import { ROUTES_CONFIG } from '@/config/routes.config';
import DisabledFormProvider from '@/components/DisabledFormProvider';
import { useDataObjectLock } from '@/hooks/useDataObjectLock';
import { getQueryParamStateId } from '@/utils/getQueryParamStateId';
import { createUuid } from '@/utils/guidUtils';

export default function AircraftPageEdit() {
  const viewName: string = 'AircraftE';
  const { id } = useParams<{ id: NonEmptyString }>();
  const { mode } = useDataObjectLock(id);

  const router = useRouter();
  const searchParams = useSearchParams();
  const { showError, showSuccess } = useNotification();

  const handleNotFound = () => {
    router.push(ROUTES_CONFIG.AIRCRAFT_L);
  };

  const { data, isLoading } = useGetAircraft<IAircraftE>({ id, viewName, onNotFound: handleNotFound });

  const [closeAfter, setCloseAfter] = useState(false);

  const methods = useForm<IAircraftE>({
    defaultValues: {
      id: createUuid(),
      registrationNumber: '',
      model: '',
      capacity: 0,
    },
  });

  const handleSuccess = () => {
    showSuccess('Изменения успешно сохранены');
    if (closeAfter) {
      handleTransition();
    }
  };

  const handleError = (error: AxiosError | Error) => {
    showError(`Ошибка при сохранении: ${error.message}`);
  };

  const { updateAircraftAsync } = useUpdateAircraft<IAircraftE>(handleSuccess, handleError);

  const handleSave = async (newValue: IAircraftE, close: boolean) => {
    setCloseAfter(close);
    await updateAircraftAsync({ aircraft: newValue, viewName: viewName });
  };

  const handleTransition = () => {
    router.push(`${ROUTES_CONFIG.AIRCRAFT_L}${getQueryParamStateId(searchParams)}`);
  };

  useEffect(() => {
    if (!isLoading && data) {
      methods.reset(data);
    }
  }, [data, isLoading, methods]);

  if (isLoading) {
    return <CircularProgressCenter />;
  }

  return (
    <FormProvider {...methods}>
      <DisabledFormProvider disabled={mode === 'readonly'}>
        <Box component="form">
          <EditFormToolbar
            title="Aircraft"
            onSave={handleSave}
            onTransition={handleTransition}
          />
          <AircraftEFields />
        </Box>
      </DisabledFormProvider>
    </FormProvider>
  );
}
